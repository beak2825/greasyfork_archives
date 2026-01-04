// ==UserScript==
// @name         p4u-worklogger
// @description  JIRA work log in UU
// @version      2.10.1
// @namespace    https://uuos9.plus4u.net/
// @homepage     https://github.com/bubblefoil/p4u-worklogger
// @author       bubblefoil
// @license      MIT
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      jira.unicorn.com
// @match        https://uuos9.plus4u.net/uu-specialistwtmg01-main/*
// @match        https://uuapp.plus4u.net/uu-specialistwtm-maing01/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/36386/p4u-worklogger.user.js
// @updateURL https://update.greasyfork.org/scripts/36386/p4u-worklogger.meta.js
// ==/UserScript==

//Test issue - FBLI-7870
const jiraComUrl = 'https://jira.unicorn.com';
const jiraRestApiPath = 'rest/api/2';
const jiraIssueKeyPattern = /([A-Z]+-\d+)/;
const jiraIssueProjectPattern = /([A-Z]+)-\d+/;

class PageCheck {

    static isWorkLogFormPage() {
        //Check that the work log page is loaded by querying for some expected elements
        if (document.title !== 'Working Time Management') {
            console.log("Judging by the page title, this does not seem to be the Working Time Management app. Exiting extension script.");
            return false;
        }
        return true;
    }
}

if (!PageCheck.isWorkLogFormPage()) {
    // noinspection JSAnnotator
    return;
} else {
    // language=CSS
    // noinspection JSUnresolvedFunction
    GM_addStyle(`
    /* Widen the month selection button envelope by overriding its fixed width. */
    .uu-specialistwtm-worker-monthly-detail-top-change-month-dropdown {
        min-width: 330px;
    }
    /* Copied from .uu-specialistwtm-worker-monthly-detail-top-back-icon without its padding */
    .wtm-month-switch-button-icon {
        color: #616161;
        font-size: 20px;
        height: fit-content;
    }
    `);

    // Polyfill some syntactic sugar
    Promise.of = Promise.resolve;
}

const jiraIssueLoaderAnimation = `
<style>
    .progress-spinner {
        width: 16px;
        height: 16px;
        -webkit-animation: spin 2s linear infinite; /* Safari */
        animation: spin 1.5s linear infinite;
    }

    /* Safari */
    @-webkit-keyframes spin {
        0% {
            -webkit-transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
<svg class="progress-spinner" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 75.76 75.76">
    <defs>
        <style>.cls-2 { fill: #2684ff; } .cls-3 { fill: url(#linear-gradient); } .cls-4 { fill: url(#linear-gradient-2); }</style>
        <linearGradient id="linear-gradient" x1="34.64" y1="15.35" x2="19" y2="30.99" gradientUnits="userSpaceOnUse"><stop offset="0.18" stop-color="#0052cc"/><stop offset="1" stop-color="#2684ff"/></linearGradient>
        <linearGradient id="linear-gradient-2" x1="38.78" y1="60.28" x2="54.39" y2="44.67" xlink:href="#linear-gradient"/>
    </defs>
    <title>Connecting to Jira...</title>
    <g id="Layer_2">
        <g id="Blue">
            <path class="cls-2" d="M72.4,35.76,39.8,3.16,36.64,0h0L12.1,24.54h0L.88,35.76A3,3,0,0,0,.88,40L23.3,62.42,36.64,75.76,61.18,51.22l.38-.38L72.4,40A3,3,0,0,0,72.4,35.76ZM36.64,49.08l-11.2-11.2,11.2-11.2,11.2,11.2Z"/>
            <path class="cls-3" d="M36.64,26.68A18.86,18.86,0,0,1,36.56.09L12.05,24.59,25.39,37.93,36.64,26.68Z"/>
            <path class="cls-4" d="M47.87,37.85,36.64,49.08a18.86,18.86,0,0,1,0,26.68h0L61.21,51.19Z"/>
        </g>
    </g>
</svg>
`;

/**
 * Branches off the flow into a supplied function, typically to perform side-effects.
 * Returns the input value.
 *
 * @param {function(*): *} f The dead-end functions, may be impure.
 * @return {function(*): (Promise<*> | Promise<void>)} Resolved Promise of the original input
 */
const tee = (f) => (x) => {
    f(x);
    return Promise.of(x);
};

/**
 * Returns wrapped fn which, when called, delegates the call to fn
 * if and only if pred returns true at the time of invocation.
 * Wrapping function passes args to Both pred and fn.
 *
 * @param pred {Function} predicate
 * @param fn {Function} function to be called conditionally if pred(...args) == true
 * @return {Function}
 */
function when(pred, fn) {
    return function conditionalFn(...args) {
        if (pred(...args)) {
            return fn(...args);
        }
    }
}

/**
 * Returns a function that dispatches calls to one of given functions, based on the first matching predicate.
 * Takes pairs of predicate, function (alternating), tests predicates one by one
 * and when a predicate returns true (strict match), calls following function and returns its result.
 * Each predicate and fn gets arguments passed to the returned dispatching function.
 *
 * Basically a functional if-else.
 *
 * @param pred {Function} Predicate
 * @param fn {Function} Function to call if pred matches.
 * @param more More pred/fn pairs.
 * @return {function(...[*]=)} Dispatching function
 */
function condp(pred, fn, ...more) {
    if (more.length % 2 !== 0) {
        throw new Error('Invalid number of functions. Expected even number of functions, predicate/function pairs.')
    }
    const nonFn = [pred, fn, ...more].find(f => typeof f !== "function");
    if (nonFn) {
        throw new TypeError('Invalid argument. Expected even number of functions, predicate/function pairs, but got this: ' + nonFn);
    }
    return function predMatchingFn(...args) {
        const fns = [pred, fn, ...more];
        for (let i = 0; i < fns.length; i += 2) {
            if (fns[i](...args)) {
                return fns[i + 1](...args);
            }
        }
    };
}

/**
 * Returns pred giving negated result.
 */
function not(pred) {
    return function notPred(...args) {
        return !pred(...args);
    }
}

/**
 * Returns pred giving positive result if all given preds return true.
 */
function and(...preds) {
    return function everyPred(...args) {
        return preds.every(p => {
            if (typeof p !== "function") {
                throw new TypeError('All arguments of function [and] must be functions, not this thing:' + p);
            }
            return p(...args);
        });
    };
}

/**
 * Pure form of attribute assignment.
 * Adds an attribute to an object and returns the updated object.
 *
 * @param o Target object
 * @param k Attribute name
 * @param v Attribute value
 * @return {Object} o with o.k = v
 */
const assoc = (o, k, v) => {
    o[k] = v;
    return o;
};

/**
 * Enhances the work log table.
 */
class LogTableDecorator {

    /**
     * Finds the JIRA issue references in the work descriptions in the work log table
     * and replaces them with links.
     */
    static findAndLinkifyJiraIssues() {
        const logTableNodes = document.querySelectorAll('#table-tsitems td.htsItemStyle div.hts_object');
        const hasTextNodes = (p) => Array.from(p.childNodes).find(n => n.nodeType === 3);
        Array.from(logTableNodes)
            .filter(hasTextNodes)
            .forEach(node => this.replaceIssueByLink(node));
    }

    static replaceIssueByLink(element) {
        const issueKeyPatternGlobal = new RegExp(jiraIssueKeyPattern, "g");
        element.innerHTML = element.innerHTML
            .replace(issueKeyPatternGlobal, `<a href="${jiraComUrl + '/browse'}/$1" target="_blank">$1</a>`);
    }
}

const wtmMessage = {
    cs: {
        'wtm.table.day-range.label': 'ČAS MEZI DNY:',
        'wtm.month.prev.title': 'Předchozí měsíc',
        'wtm.month.next.title': 'Následující měsíc',
    },
    en: {
        'wtm.table.day-range.label': 'TIME BETWEEN DAYS:',
        'wtm.month.prev.title': 'Previous month',
        'wtm.month.next.title': 'Next month',
    }
};

const _t = function (messageCode) {
    if (!messageCode) {
        console.warn('Invalid I18N message code: ', messageCode);
        return '?';
    }
    const getBundle = function () {
        const language = WtmWorktableModel.language();
        if (wtmMessage.hasOwnProperty(language)) {
            return wtmMessage[language];
        }
        return wtmMessage.cs
    };
    const bundle = getBundle();
    if (!bundle.hasOwnProperty(messageCode)) {
        console.warn(`)I18N message "${messageCode}" is not defined for "${WtmWorktableModel.language()}`);
        return messageCode;
    }
    return bundle[messageCode];
};

class WtmDateTime {

    /**
     * Returns parsed date as an array of fields: [day, month, year]. Months are counted from 1.
     * @param {string} selectedDate
     * @return {number[]}
     */
    static parseDate(selectedDate) {
        const dateParts = selectedDate.split(/[.\/]/);
        const dateFields = dateParts.length === 3 && dateParts.map(Number) || [NaN, NaN, NaN];
        if (WtmWorktableModel.language() === 'cs') {
            return dateFields;
        } else {
            const [month, day, year] = dateFields;
            return [day, month, year];
        }
    }

    static parseDateTime(selectedDate, selectedTime) {
        const [day, month, year] = this.parseDate(selectedDate);
        const [hour, minute] = selectedTime.split(':').map(Number);
        return new Date(year, month - 1, day, hour, minute, 0, 0);
    }

    static padToDoubleDigit(num) {
        const norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
    }

    static addHours(d, h) {
        return this.addMinutes(d, h * 60);
    }

    static addMinutes(d, m) {
        return new Date(d.getTime() + (m * 60 * 1000))
    }
}

/**
 * Access methods to the WTM time table view.
 */
class WtmWorktableModel {

    static language() {
        return document.getElementsByClassName("uu5-bricks-language-selector-code-text")[0].textContent;
    }

    static newItemButton() {
        return document.querySelector('button.uu-specialistwtm-create-timesheet-item-button');
    }

    static monthlyDetailTopTimeColumn() {
        return document.querySelector('.uu5-common-div .uu-specialistwtm-worker-monthly-detail-top-time-column');
    }

    static timeTable() {
        return document.querySelector('table.uu5-bricks-table-table');
    }

    /**
     * Reads the day of month from a time table row.
     * @param {HTMLTableRowElement} tableRow
     * @return {number|NaN} Day of month, 0 - 31, or NaN.
     */
    static getDay(tableRow) {
        const dateCellText = tableRow.cells[1].innerText;
        const dateFields = WtmDateTime.parseDate(dateCellText);
        return dateFields[0];
    }

    static isModalDialogOpened() {
        const modal = document.querySelector('div.uu5-bricks-page-modal');
        const modalStyle = modal && window.getComputedStyle(modal);
        return modalStyle && modalStyle.visibility === 'visible';
    }

    /**
     * Reads logged working time in minutes from a time table row.
     * @param {HTMLTableRowElement} tableRow
     * @return {number|NaN} Minutes of work, or NaN.
     */
    static getTimeInMinutes(tableRow) {
        const dateCellText = tableRow.cells[2].innerText;
        const match = dateCellText.match(/(\d\d)[:](\d\d)/);
        return match && 60 * Number(match[1]) + Number(match[2]) || NaN;
    }

    /**
     * Filters table rows by given range of days of month.
     * @param {number} dayFrom
     * @param {number} dayTo
     * @return {Promise<HTMLTableRowElement[]>}
     */
    static rowsBetweenDays(dayFrom, dayTo) {
        return new Promise(resolve => {
            const timeTable = WtmWorktableModel.timeTable();
            const firstDay = Math.min(dayFrom, dayTo);
            const lastDay = Math.max(dayFrom, dayTo);
            const rowsInRange = [].filter.call(timeTable.rows, (row, idx) => {
                return idx > 0 && firstDay <= WtmWorktableModel.getDay(row) && WtmWorktableModel.getDay(row) <= lastDay;
            });
            resolve(rowsInRange);
        })
    }

    /**
     *
     * @param dayFrom
     * @param dayTo
     * @return {Promise<number>} Sum of time in selected day range in minutes.
     */
    static minutesBetween(dayFrom, dayTo) {
        return this
            .rowsBetweenDays(dayFrom, dayTo)
            .then((rows) => new Promise(resolve => {
                const minutesTotal = rows
                    .map((row) => WtmWorktableModel.getTimeInMinutes(row))
                    .reduce((acc, minutes) => acc + minutes, 0);
                resolve(minutesTotal);
            }));
    }
}

/**
 * Takes care of Time table extension view.
 */
class WtmWorktableView {

    constructor() {
    }

    static worktableSumViewShow() {
        if (document.getElementById('wtt-time-range-form')) {
            console.log('WTM Extension: Work table already enhanced.');
            WtmWorktableView.updateSum();
            return;
        }
        console.log('WTM Extension: enhancing work table');
        const today = new Date();
        const dayOfWeek = (today.getDay() + 6) % 7;
        const lastMonday = Math.max(today.getDate() - dayOfWeek, 1);
        const nextSunday = Math.min(lastMonday + 6, 31);
        WtmWorktableModel.monthlyDetailTopTimeColumn()
            .insertAdjacentHTML(
                'beforeend',
                `
                <div id="wtt-time-range-form" class="uu-specialistwtm-worker-monthly-detail-top-time-column" style="z-index: 10">
                    <!--Move the span to front, because this div is covered by some uu component's width % and the content is hard to select by mouse-->
                    <span class="uu5-bricks-span uu5-bricks-lsi-item uu5-bricks-lsi uu-specialistwtm-worker-monthly-detail-top-total-time-label" style="width: max-content; min-width: 8em;">${_t('wtm.table.day-range.label')}</span>
                    <input class="uu5-bricks-text uu5-common-text uu-specialistwtm-worker-monthly-detail-table-form-date" type="number" id="wtt-day-from" value="${lastMonday}" min="1" max="31" style="width: 4em; margin: 0.25em">
                    <input class="uu5-bricks-text uu5-common-text uu-specialistwtm-worker-monthly-detail-table-form-date" type="number" id="wtt-day-to" value="${nextSunday}" min="1" max="31" style="width: 4em; margin: 0.25em">
                    <span id="wtt-time-in-range-sum" class="uu5-bricks-span uu-specialistwtm-worker-monthly-detail-top-total-time">${WtmWorktableView.formatToHours(0)}</span>
                </div>`
            );
        WtmWorktableView.getDayFromInput().onchange = () => WtmWorktableView.updateSum();
        WtmWorktableView.getDayFromInput().onclick = () => WtmWorktableView.updateSum();
        WtmWorktableView.getDayToInput().onchange = () => WtmWorktableView.updateSum();
        WtmWorktableView.getDayToInput().onclick = () => WtmWorktableView.updateSum();
        WtmWorktableView.updateSum().catch((e) => console.warn(e));
    }

    static getDayToInput() {
        return document.getElementById('wtt-day-to');
    }

    static getDayFromInput() {
        return document.getElementById('wtt-day-from');
    }

    static async updateSum() {
        const dFrom = Number(WtmWorktableView.getDayFromInput().value);
        const dTo = Number(WtmWorktableView.getDayToInput().value);
        document.getElementById('wtt-time-in-range-sum').innerText = '-h';
        const minutesInRange = await WtmWorktableModel.minutesBetween(dFrom, dTo);
        document.getElementById('wtt-time-in-range-sum').innerText = WtmWorktableView.formatToHours(minutesInRange);
    }

    static formatToHours(minutes) {
        return ` ${Number(Math.round(minutes / 60 * 100) / 100).toLocaleString(WtmWorktableModel.language())}h`;
    }
}

class WtmDialog {

    static descArea() {
        return document.getElementsByTagName("textarea")[0];
    }

    static _getNamedInput(elementName) {
        return document.getElementsByName(elementName)[0]
            .lastChild
            .firstChild
            .firstChild;
    }

    static datePicker() {
        return WtmDialog._getNamedInput("date")
    }

    static timeFrom() {
        return WtmDialog._getNamedInput("timeFrom");
    }

    static timeTo() {
        return WtmDialog._getNamedInput("timeTo");
    }

    static artifactField() {
        return WtmDialog._getNamedInput("subject");
    }

    static categoryField() {
        return WtmDialog._getNamedInput("category");
    }

    static dateFrom() {
        return WtmDateTime.parseDateTime(this.datePicker().value, this.timeFrom().value);
    }

    static dateTo() {
        return WtmDateTime.parseDateTime(this.datePicker().value, this.timeTo().value);
    }

    static getDurationSeconds() {
        const dateFrom = WtmDialog.dateFrom();
        const dateTo = WtmDialog.dateTo();
        if (isNaN(dateFrom.getTime()) || isNaN(dateTo.getTime())) {
            return 0;
        }
        const durationMillis = dateTo - dateFrom;
        return durationMillis > 0 ? durationMillis / 1000 : 0;
    }

    /** Returns the OK button. It is an &lt;a&gt; element containing a structure of spans. */
    static buttonNextItem() {
        return WtmDialog.highRateNode().parentElement
            .lastChild
            .firstChild
            .firstChild
            .firstChild;
    }

    /** Returns the 'Next item' button. It is an &lt;a&gt; element containing a structure of spans, or null in case of work log update. */
    static  buttonOk() {
        return WtmDialog.highRateNode().parentElement
            .lastChild
            .lastChild
            .firstChild
            .firstChild;
    }

    static addKeyboardShortcutMnemonics() {
        WtmDialog.buttonOk().title = "Ctrl + Enter";
        WtmDialog.buttonNextItem().title = "Ctrl + Shift + Enter";
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {string} key
     */
    static addMnemonic(element, key) {
        if (element && key && key.length === 1 && element.innerText.indexOf(key) > 0) {
            element.innerHTML = element.innerText.replace(key, `<u>${key}</u>`);
            element.accessKey = key;
        }
    }

    static highRateNode() {
        return document.getElementsByName("highRate")[0];
    }
}

/**
 * Wrap log functions to make them more functional.
 * Cannot be wrapped in a class because FF does not support fields and standard function syntax is horribly bloated.
 */
const log = tee(console.log);
const error = tee(console.error);
const warn = tee(console.warn);
const info = tee(console.info);
const debug = tee(console.debug);
const trace = tee(console.trace);

/**
 * Removes leading and trailing slash '/' character.
 * @param s
 * @return {string}
 */
const stripSlashes = (s) => s
    .replace(/^\//, '')
    .replace(/\/?$/, '');

const addRequestParameter = (parameter) => (value) => (url) => {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${parameter}=${value}`;
};

/**
 * @param {...string|string[]} resource path
 * @return {function(*=): Promise<string | Error>}
 */
const getResourceUrl = (...resource) => (domain) => new Promise((resolve, reject) => {
        if (domain && typeof domain === 'string') {
            resolve(`${stripSlashes(domain)}/${resource.flat().map(stripSlashes).join('/')}`);
        } else {
            reject(new TypeError('Invalid url domain :' + domain));
        }
    }
);

/**
 * @param {...string} resourcePath path
 * @return {function(*=): Promise<string | Error>}
 */
const jiraRestApiResource = (...resourcePath) =>
    getResourceUrl([jiraRestApiPath].concat(resourcePath).flat(2));

/**
 * @param {...string} issue JIRA issue key
 * @return {function(string): Promise<string|Error>} Resource url provider which takes domain as the argument.
 */
const jiraRestApiIssueUrl = (issue) => jiraRestApiResource('issue', issue);


/**
 * @param {...string} issue JIRA issue key
 * @return {function(string): Promise<string|Error>} Resource url provider which takes domain as the argument.
 */
const jiraBrowseIssueUrl = (issue) => getResourceUrl('browse', issue);

class InvalidResponse {
    /**
     * @param {HttpResponse} response
     */
    constructor(response) {
        this._url = response.finalUrl;
        this._response = response;
    }

    get response() {
        return this._response;
    }

    get url() {
        return this._url;
    }
}

class InvalidProjectError {

    constructor(projectKey) {
        this._projectKey = projectKey;
    }

    get projectKey() {
        return this._projectKey;
    }
}

class ProjectLoadingError {

    constructor(projectKey) {
        this._projectKey = projectKey;
    }

    get projectKey() {
        return this._projectKey;
    }
}

/**
 * Constructs a base of an HTTP request for json data and GET method.
 *
 * @param {string} url
 * @return {Request} Pre-filled request object for GM_xmlhttpRequest
 */
const getJsonRequest = (url) => ({
    method: 'GET',
    headers: {'Accept': 'application/json'},
    url: url,
    onreadystatechange: function (res) {
        console.debug(`Processing request: [${url}], state: ${res.readyState}`);
    }
});

/**
 * JIRA API connector and utils.
 */
class Jira4U {

    constructor() {
    }

    static tryParseIssue(desc) {
        console.log(`Parsing description: ${desc}`);
        if (typeof desc !== "string") {
            return new WorkDescription();
        }
        return WorkDescription.parse(desc);
    }

    /**
     * @param {string} issueKey
     * @return {Promise<string|TypeError>}
     */
    static getProjectCode(issueKey) {
        if (typeof issueKey !== 'string' || !jiraIssueProjectPattern.test(issueKey)) {
            return Promise.reject(new TypeError(`Invalid argument issueKey: "${issueKey}", expected an issue key`));
        }
        return Promise.of(issueKey.match(jiraIssueProjectPattern)[1]);
    }

    /**
     * @param {Function} onprogress
     * @return {function(Object): Object}
     */
    static setOnProgressCallback(onprogress) {
        return (request) => Object.assign(request, {onreadystatechange: onprogress});
    }
    /**
     * Triggers the actual http request.
     *
     * @typedef HttpResponse
     * @property {number} status
     * @property {string} responseText
     * @property {string} responseHeaders
     * @property {string} finalUrl
     *
     * @param {Request} requestParams
     * @return {Promise<HttpResponse>} A Promise which resolves with the http response.
     */
    static request(requestParams) {
        return new Promise((resolve, reject) => {
            // noinspection JSUnresolvedFunction
            GM_xmlhttpRequest(
                Object.assign(requestParams, {
                    onload: resolve,
                    onerror: reject
                }))
        });
    }

    /**
     * Checks whether http response status is OK (200).
     *
     * @param {HttpResponse} response Http response
     * @return {Promise<HttpResponse|InvalidResponse>}
     */
    static validateStatusOk(response) {
        return (response.status === 200)
            ? Promise.of(response)
            : Promise.reject(new InvalidResponse(response));
    }

    /**
     * @param {HttpResponse} response
     * @return {object}
     */
    static parseResponse(response) {
        return JSON.parse(response.responseText);
    }

    /**
     * Resolve url of the JIRA in which requested project exists.
     * If the project is found at both eu and com domains, com is preferred.
     *
     * @param {string} projectCode Just the project prefix of a JIRA issue.
     * @return {Promise<string|InvalidProjectError|ProjectLoadingError>} JIRA url
     */
    static async getJiraUrlForProject(projectCode) {
        return jiraComUrl;
    }

    /**
     * Fetches raw JIRA issue data.
     * @param {string} key JIRA issue key string
     * @param {?Function} onprogress Optional loading progress callback
     * @return {Promise<HttpResponse|InvalidResponse>}
     */
    static fetchIssue(key, onprogress = () => undefined) {
        return Jira4U.getProjectCode(key)
            .then(Jira4U.getJiraUrlForProject)
            .then(tee(url => debug('project code url: ' + url)))
            .then(jiraRestApiIssueUrl(key))
            .then(tee(url => log(`Resolved JIRA issue url: [${url}]`)))
            .then(getJsonRequest)
            .then(Jira4U.setOnProgressCallback(onprogress))
            .then(Jira4U.request);
    }

    /**
     * Returns a Promise which loads and parses JIRA issue to an object.
     * @param {string} key JIRA issue key string
     * @param {?Function} onprogress Optional loading progress callback
     * @return {Promise<JiraIssue|InvalidResponse|string|InvalidProjectError|ProjectLoadingError>}
     */
    static loadIssue(key, onprogress = () => undefined) {
        return Jira4U.fetchIssue(key)
            .then(tee(_ => log(`Loading of issue ${key} completed.`)))
            //Getting into the onload function does not actually mean the status was OK
            .then(Jira4U.validateStatusOk)
            .then(tee(_ => log(`Issue ${key} loaded successfully.`)))
            .then(Jira4U.parseResponse)
    }

    /**
     * @param {string} workInfo.key JIRA issue key string.
     * @param {Date} workInfo.started The date/time the work on the issue started.
     * @param {number} workInfo.duration in seconds.
     * @param {string} workInfo.comment The work log comment.
     * @param {Function} [workInfo.onReadyStateChange] Callback to be invoked when the request state changes.
     * @return {Promise}
     */
    static logWork(workInfo) {
        console.log(`Sending a work log request. Issue=${workInfo.key}, Time spent=${workInfo.duration}minutes, Comment="${workInfo.comment}"`);
        return Jira4U.getProjectCode(workInfo.key)
            .then(Jira4U.getJiraUrlForProject)
            .then(jiraRestApiResource('issue', workInfo.key, 'worklog'))
            .then(url => (
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        //Disable the cross-site request check on the JIRA side
                        "X-Atlassian-Token": "nocheck",
                        //Previous header does not work for requests from a web browser
                        "User-Agent": "xx"
                    },
                    data: JSON.stringify({
                        timeSpentSeconds: workInfo.duration,
                        started: Jira4U._toIsoString(workInfo.started),
                        comment: workInfo.comment,
                    }),
                    url: url,
                    onreadystatechange: workInfo.onReadyStateChange
                })
            )
            .then(Jira4U.request);
    }

    /**
     * Converts a date to a proper ISO formatted string, which contains milliseconds and the zone offset suffix.
     * No other date formats are recognized by JIRA.
     * @param {Date} date Valid Date object to be formatted.
     * @returns {string}
     */
    static _toIsoString(date) {
        const offset = -date.getTimezoneOffset();
        const offsetSign = offset >= 0 ? '+' : '-';
        const pad = WtmDateTime.padToDoubleDigit;
        return date.getFullYear()
            + '-' + pad(date.getMonth() + 1)
            + '-' + pad(date.getDate())
            + 'T' + pad(date.getHours())
            + ':' + pad(date.getMinutes())
            + ':' + pad(date.getSeconds())
            + '.' + String(date.getUTCMilliseconds()).padStart(3, "0").substr(0, 3)
            + offsetSign + pad(offset / 60) + pad(offset % 60);
    }

}

/**
 * JIRA issue visualisation functions.
 *
 * Most of this object is stateless functions
 * with the exception of currently visualised JIRA issue,
 * because it is repeatedly accessed when user changes
 * the working time to update the worklog bar.
 */
class IssueVisual {

    constructor() {
        IssueVisual.init();
    }

    /**
     * Install JIRA issue GUI into the worklog dialog.
     * Checks whether the GUI has already been added before
     * making any DOM changes, so repeated calls have no effect.
     */
    static init() {
        if (document.getElementById('jira-toolbar-envelope')) {
            console.log("JIRA toolbar was already added to form.");
            return;
        }
        IssueVisual.addToForm();
    }

    /**
     * Adds jira issue GUI to the time sheet form.
     */
    static addToForm() {
        console.log("Adding JIRA toolbar into form");

        const transition = "-webkit-transition: width 0.25s; transition-delay: 0.5s;";
        const trackerStyle = "width: 100%; border-collapse: collapse; height: 0.75em; margin-top: 0.4em;";

        //.uu5-forms-label uu5-forms-input-m
        const jiraBarNode = document.createElement('DIV');
        jiraBarNode.id = 'jira-toolbar-envelope';
        jiraBarNode.innerHTML = (`
        <div>
            <div>
                <span id="parsedJiraIssue" class="uu5-forms-input-m"></span>
            </div>
        </div>
        <div>
            <div>
                <table id="jiraWorkTrackerOriginal" style="${trackerStyle}">
                  <tbody>
                    <tr>
                      <td class="workTracker wtl" id="jiraOrigEstimate" title="Původní odhad:" style="background-color: #89AFD7; padding: 0; ${transition} width: 0;"></td>
                      <td class="workTracker wt" style="background-color: #eeeeee; padding: 0; ${transition} width: 100%"></td>
                    </tr>
                  </tbody>
                </table>
                <table id="jiraWorkTrackerLogged" style="${trackerStyle}">
                  <tbody>
                    <tr>
                      <td class="workTracker wtl" id="jiraWorkLogged" title="Vykázáno:" style="background-color: #51a825; padding: 0; ${transition} width: 0;"></td>
                      <td class="workTracker wtn" id="jiraWorkLogging" title="Nový výkaz" style="background-color: #51A82580; padding: 0; /*${transition}*/ width: 0"></td>
                      <td class="workTracker wtr" id="jiraRemainEstimate" title="Zbývající odhad:" style="background-color: #ec8e00; padding: 0; ${transition} width: 0;"></td>
                      <td class="workTracker pad" id="jiraWorkPad" title="Zbývá" style="background-color: #eeeeee; padding: 0; width: 100%"></td>
                    </tr>
                  </tbody>
                </table>
            </div>
            <div>
                <span id="parsedJiraIssue"></span>
            </div>
        </div>
        <div style="margin-top: 10px">
            <button id="jiraLogWorkButton" class="uu5-bricks-button-m uu6-bricks-button-filled" type="button" style="border: none" disabled>
                <span class="uu5-bricks-span uu5-bricks-lsi-item uu5-bricks-lsi">Vykázat na <u>J</u>IRA issue</span>
            </button>
            <span id="jira-issue-work-log-request-progress" style="margin-left: 8px;"></span>
        </div>
        `);
        IssueVisual.insertAfter(jiraBarNode, WtmDialog.highRateNode());
    }


    static insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    /**
     * Display a loaded JIRA issue in the form as a link
     * and update the time tracker.
     *
     * @param {JiraIssue} issue The JIRA issue object as fetched from JIRA rest API
     */
    static async showIssue(issue) {
        const domain = issue.self.slice(0, issue.self.indexOf(jiraRestApiPath));
        const url = await jiraBrowseIssueUrl(issue.key)(domain);
        //Some projects use this field for a project code, like NBS or FBLI
        const projectCode = P4uWorklogger.mapToHumanJiraIssue(issue).projectCode;
        const projectCodeHtml = projectCode && `<div>Project Code: ${projectCode}</div>` || '';
        IssueVisual.$showInIssueSummary(IssueVisual.linkHtml(url, `${issue.key} - ${issue.fields.summary}`) + projectCodeHtml);
        IssueVisual.trackWorkOf(issue);
        return issue;
    }

    /**
     * Displays some fancy animation at the place of the JIRA issue summary.
     */
    static showIssueLoadingProgress() {
        IssueVisual.$showInIssueSummary(jiraIssueLoaderAnimation);
        IssueVisual.resetWorkTracker();
    }

    /**
     * Sets the currently displayed JIRA issue to null and resets all the visualisation.
     */
    static resetIssue() {
        IssueVisual.resetWorkTracker();
    }

    /**
     * Display a visual work log time tracker of the current JIRA issue in the form.
     */
    static updateWorkTracker() {
        if (IssueVisual._issue) {
            const issue = IssueVisual._issue;
            const orig = issue.fields.timetracking.originalEstimateSeconds || 0;
            const remain = issue.fields.timetracking.remainingEstimateSeconds || 0;
            const logged = issue.fields.timetracking.timeSpentSeconds || 0;
            const added = WtmDialog.getDurationSeconds();
            const totalMax = Math.max(orig, logged + Math.max(added, remain));
            const newRemain = Math.max(remain - added, 0);
            const percentOfTotal = (x) => totalMax > 0 ? x / totalMax * 100 : 0;
            const setWidth = (id, w) => {
                document.getElementById(id).style.width = `${Math.round(w)}%`;
            };
            const setTitle = (id, t) => {
                const e = document.getElementById(id);
                e.title = e.title.split(':')[0] + ': ' + t || "0h";
                e.alt = e.title;
            };
            const toHours = (seconds) => (seconds / 3600).toFixed(2) + 'h';

            setWidth('jiraOrigEstimate', percentOfTotal(orig));
            setTitle('jiraOrigEstimate', issue.fields.timetracking.originalEstimate);
            setWidth('jiraWorkLogged', percentOfTotal(logged));
            setTitle('jiraWorkLogged', issue.fields.timetracking.timeSpent);
            setWidth('jiraWorkLogging', percentOfTotal(added));
            setTitle('jiraWorkLogging', toHours(added));
            setWidth('jiraRemainEstimate', percentOfTotal(newRemain));
            setTitle('jiraRemainEstimate', toHours(newRemain));
            const remainCell = document.getElementById('jiraRemainEstimate');
            remainCell.style.display = (newRemain === 0) ? "none" : null;//Chrome renders zero width as 1px
        }
        else
            IssueVisual.resetWorkTracker();
    }

    /**
     * Sets currently displayed JIRA issue for the time tracker bar.
     * This is the only state held by IssueVisual class.
     *
     * @typedef JiraIssue
     * @property {string} key The key of the JIRA issue, e.g. XYZ-1234
     * @property {string} rawJiraIssue.fields.project.key The project key of the JIRA issue, e.g. XYZ
     * @property {string} fields.summary The JIRA issue summary, i.e. the title of the ticket.
     * @property {string} self JIRA link to this issue.
     * @property {?number} fields.timetracking.originalEstimateSeconds
     * @property {?number} fields.timetracking.remainingEstimateSeconds
     * @property {?number} fields.timetracking.timeSpentSeconds
     * @property {?number} fields.timetracking.originalEstimate
     * @property {?number} fields.timetracking.remainingEstimate
     * @property {?number} fields.timetracking.timeSpent
     * @property {string} rawJiraIssue.fields.issuetype.name Type of the issue, e.g. "Bug"
     * @property {?string} fields.customfield_13908 NBS Project code
     * @property {?string} fields.customfield_10174 FBL Project code
     * @property {?string} fields.customfield_12271 FBL System
     *
     * @param {?JiraIssue} issue
     */
    static trackWorkOf(issue = null) {
        IssueVisual._issue = issue;
        IssueVisual.updateWorkTracker();
    }

    /**
     * No JIRA issue is displayed, no work time is tracked.
     */
    static resetWorkTracker() {
        IssueVisual._issue = null;
        ['jiraOrigEstimate', 'jiraWorkLogged', 'jiraWorkLogging', 'jiraRemainEstimate']
            .forEach(id => document.getElementById(id).style.width = `0%`);
    }

    /**
     * Displays default content when no issue has been loaded.
     */
    static showIssueDefault() {
        IssueVisual.$showInIssueSummary(`<span>Zadejte kód JIRA Issue na začátek Popisu činnosti.</span>`);
        IssueVisual.resetIssue();
    }

    /**
     * Handles JIRA issue loading errors.
     * Updates GUI accordingly.
     *
     * @param {string} key JIRA issue
     * @param {InvalidResponse|InvalidProjectError|ProjectLoadingError|Error} error
     */
    static issueLoadingFailed(key, error) {
        IssueVisual.resetIssue();

        function tryGetProjectUrl() {
            return Jira4U.getProjectCode(key)
                .then(Jira4U.getJiraUrlForProject)
                .then(jiraBrowseIssueUrl(key));
        }

        function getErrorMessages(responseErr) {
            if (/content-type:\sapplication\/json/.test(responseErr.responseHeaders)) {
                let error = JSON.parse(responseErr.responseText);
                return Promise.of(error.errorMessages ? ' Chyba: ' + error.errorMessages.join(', ') : '');
            }
            return Promise.reject(responseErr);
        }

        if (error instanceof InvalidResponse) {
            const status = error.response.status;
            if (status === 401 || status === 403) {
                const renderJiraLink = url => IssueVisual.elem('SPAN',
                    [
                        document.createTextNode('JIRA autentizace selhala. '),
                        IssueVisual.nodeFromHtml(IssueVisual.linkHtml(url, 'Přihlaste se do JIRA')),
                        document.createTextNode(' a '),
                        IssueVisual.clickableSpan(P4uWorklogger.loadAndShowIssueFromDescription, 'zkuste to znovu')
                    ]);
                tryGetProjectUrl()
                    .then(renderJiraLink)
                    .then(IssueVisual.$showInIssueSummary)
                    .catch(_ => {
                        console.error('Failed to resolve url for issue ' + key);
                        IssueVisual.$showInIssueSummary(
                            `JIRA autentizace selhala.<br>
Přihlaste se do ${IssueVisual.linkHtml(jiraComUrl, 'jira.unicorn.com')}.`);
                    });
            } else if (status === 404) {
                getErrorMessages(error.response)
                    .then(msg => IssueVisual.$showInIssueSummary(`<span>Nepodařilo se načíst ${key}.${msg}.</span>`))
                    .catch(err => {
                        console.error(`Failed to load issue ${key}. Response: ${JSON.stringify(err, null, 2)}`);
                        IssueVisual.$showInIssueSummary(`<span>Nepodařilo se načíst ${key}. Chyba: 404</span>`);
                    });
            }
        } else if (error instanceof InvalidProjectError) {
            IssueVisual.$showInIssueSummary(`<span>Projekt ${error.projectKey} neexistje.</span>`);
        } else if (error instanceof ProjectLoadingError) {
            IssueVisual.$showInIssueSummary(`<span>Nepodařilo se načist projekt ${error.projectKey}.</span>`);
        } else {
            const showUnknownError = () => IssueVisual.$showInIssueSummary(`<span>Něco se přihodilo. Budete muset ${IssueVisual.linkHtml(jiraComUrl, 'vykázat do JIRA ručně.')}'</span>`);
            if (error.stack) {
                showUnknownError();
                throw error;
            }
            console.error('Unknown error: ' + error);
            showUnknownError();
        }
    }

    static linkHtml(href, label) {
        return `<a href="${href}" target="_blank">${label}</a>`;
    };

    static elem(name, children = []) {
        const element = document.createElement(name);
        children.forEach(child => element.appendChild(child));
        return element;
    };

    static nodeFromHtml(htmlContent) {
        const element = document.createElement('div');
        element.innerHTML = htmlContent;
        return element.firstChild;
    };

    static clickableSpan(callback, label) {
        const clickableSpan = document.createElement('SPAN');
        clickableSpan.innerText = label;
        clickableSpan.onclick = callback;
        clickableSpan.style.color = 'blue';
        clickableSpan.style.cursor = 'pointer';
        return clickableSpan;
    };

    static $jiraIssueSummary() {
        return $(document.getElementById("parsedJiraIssue"));
    }

    /**
     * Replaces content of the placeholder element for the JIRA issue summary.
     * Returns the element, wrapped as a jQuery object for easier content manipulation.
     *
     * @return {jQuery|HTMLElement}
     */
    static $showInIssueSummary(htmlContent) {
        const issueSummary = IssueVisual.$jiraIssueSummary();
        issueSummary.empty().append(htmlContent);
        return issueSummary;
    }

    /**
     * Display a sign next to the JIRA button
     * to show state of writing the work log record.
     *
     * @param {'loading'|'done'|'error'|'idle'} state Issue loading state.
     * @return {HTMLElement}
     */
    static showJiraIssueWorkLogRequestProgress(state) {
        const stateViews = {
            'loading': jiraIssueLoaderAnimation,
            'done': `✔`,
            'error': `❌`,
            'idle': ``
        };
        const logProgress = document.getElementById("jira-issue-work-log-request-progress");
        logProgress.innerHTML = stateViews[state] || stateViews['idle'];
        return logProgress;
    }

    /**
     * @return {HTMLElement} Log work button
     */
    static jiraLogWorkButton() {
        return document.getElementById('jiraLogWorkButton');
    }

}

/**
 * Container for a JIRA issue key + description.
 * It can construct itself by parsing the issue key from work description.
 */
class WorkDescription {

    constructor(issueKey = null, descriptionText = "") {
        this._issueKey = issueKey;
        this._descriptionText = descriptionText;
    }

    static parse(workDescriptionText) {
        if (typeof workDescriptionText === "string") {
            let segments = workDescriptionText.match(jiraIssueKeyPattern);
            if (segments != null) {
                let key = segments[1];
                return new WorkDescription(key, workDescriptionText.replace(key, "").trim());
            }
        }
        return new WorkDescription();
    }

    get issueKey() {
        return this._issueKey;
    }

    get descriptionText() {
        return this._descriptionText;
    }
}

/**
 * Wraps the rest of the script, mainly the steps that are executed when the document is loaded.
 */
class P4uWorklogger {

    constructor() {
        // Initialize the page decoration.
        this._previousDesctiptionValue = null;
        this._previousIssue = null;
    }

    workLogFormShow() {
        IssueVisual.init();
        this._previousDesctiptionValue = WtmDialog.descArea().value;
        this._previousIssue = Jira4U.tryParseIssue(this._previousDesctiptionValue);
        this.doTheMagic();
    }

    doTheMagic() {
        IssueVisual.showIssueDefault();

        WtmDialog.timeFrom().onblur = IssueVisual.updateWorkTracker;
        WtmDialog.timeTo().onblur = IssueVisual.updateWorkTracker;

        //Chrome fires DOM events for textContent changes even during typing, FF does not.
        //So we add input listener and paranoidly make sure we do not add it more than once.
        const descriptionChangeListener = ev => workLogger.checkWorkDescriptionChanged(ev.target.value);
        WtmDialog.descArea().removeEventListener('input', descriptionChangeListener);
        WtmDialog.descArea().addEventListener('input', descriptionChangeListener);
        //In case of a Work log update, there may already be some work description.
        P4uWorklogger.loadAndShowIssueFromDescription();

        const jiraLogWorkButton = IssueVisual.jiraLogWorkButton();
        jiraLogWorkButton.removeEventListener('click', P4uWorklogger.writeWorkLogToJira);
        jiraLogWorkButton.addEventListener('click', P4uWorklogger.writeWorkLogToJira);
        P4uWorklogger.registerKeyboardShortcuts();
    }

    static loadAndShowIssueFromDescription() {
        if (WtmDialog.descArea().value) {
            const wd = Jira4U.tryParseIssue(WtmDialog.descArea().value);
            P4uWorklogger.loadJiraIssue(wd);
        }
    }

    static loadIssueFromDescription() {
        if (WtmDialog.descArea().value) {
            const wd = Jira4U.tryParseIssue(WtmDialog.descArea().value);
            P4uWorklogger.loadJiraIssue(wd);
        }
    }

    static registerKeyboardShortcuts() {
        WtmDialog.addKeyboardShortcutMnemonics();

        const timeControlTitle = `Použijte šipky ⬆⬇ pro změnu času. Stisknutím 'T' zaměříte vstupní pole času.`;
        WtmDialog.timeFrom().addEventListener('keydown', P4uWorklogger.shiftTime);
        WtmDialog.timeFrom().title = timeControlTitle;
        WtmDialog.timeTo().addEventListener('keydown', P4uWorklogger.shiftTime);
        WtmDialog.timeTo().title = timeControlTitle;
    }

    /**
     * Tries to remember Subject and Category values previously filled for given jira issue.
     * @param rawJiraIssue {JiraIssue}
     */
    static async fillFormFromMemorizedValues(rawJiraIssue) {
        const subjectField = WtmDialog.artifactField();
        const categoryField = WtmDialog.categoryField();
        let jiraIssue = P4uWorklogger.mapToHumanJiraIssue(rawJiraIssue);
        let formValues = WorkloggerFormMemory.remember(jiraIssue);
        if (formValues.subject) {
            await P4uWorklogger.setInputValueWithEvent(subjectField, formValues.subject);
        }
        if (formValues.category) {
            await P4uWorklogger.setInputValueWithEvent(categoryField, formValues.category);
        }
        // Setting Category value shows an autocomplete popup and steals focus.
        // Let the popup render, click the first item in the whisperer and return focus to the Description
        window.requestAnimationFrame(() => {
            const catPopup = document.querySelector('div.uu5-bricks-popover-body a');
            catPopup && catPopup.click();
            setTimeout(() => WtmDialog.descArea().focus(), 0);
            setTimeout(() => WtmDialog.descArea().click(), 20);
        });
    }
    /**
     * @typedef HumanJiraIssue
     * @property projectCode {?string} Optional custom field used by some projects just for the work logs.
     * @property system {string} FBL specific
     * @property type {string} Issue type, like 'Bug'
     * @property issueKeyPrefix {string} Just the project part of the issue key, typically same as jiraIssue.key
     *
     * @param rawJiraIssue {JiraIssue}
     * @return {HumanJiraIssue}
     */
    static mapToHumanJiraIssue(rawJiraIssue) {
        return {
            projectCode: rawJiraIssue.fields.customfield_10174?.value || rawJiraIssue.fields.customfield_13908?.value,
            system: rawJiraIssue.fields.customfield_12271?.value,
            type: rawJiraIssue.fields.issuetype.name,
            issueKeyPrefix: rawJiraIssue.fields.project.key,
        };
    }

    static getTimeAdjustmentDirection(ev) {
        if (ev.key === 'ArrowDown') {
            return -1;
        } else if (ev.key === 'ArrowUp') {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Updates selected work log range time based on arrow up|down key press.
     * @param {Event} ev The keyboard event.
     */
    static shiftTime(ev) {
        const input = ev.target;
        if (input.nodeName !== 'INPUT') {
            console.warn('Cannot shift selected time, element is not an input: ', input);
            return;
        }
        const timeAdjustment = P4uWorklogger.getTimeAdjustmentDirection(ev);
        if (timeAdjustment === 0) {
            return;
        }
        ev.preventDefault();
        //If the value is empty, try the other period boundary. This allows just adding time in an empty input.
        const value = input.value || WtmDialog.timeFrom().value || WtmDialog.timeTo().value || '08:00';
        const selectionStart = input.selectionStart;
        const selectionEnd = input.selectionEnd;
        const selectionDirection = input.selectionDirection;
        const cursorPosition = selectionDirection === 'backward' ? selectionStart : selectionEnd;
        const newValue = P4uWorklogger.updateTime(timeAdjustment, cursorPosition, value);
        P4uWorklogger.setInputValueWithEvent(input, newValue)
            .then(() => {
                    //Following are reset when the value changes
                    input.selectionStart = selectionStart;
                    input.selectionEnd = selectionEnd;
                    input.selectionDirection = selectionDirection;
                }
            )
            .then(IssueVisual.updateWorkTracker);
    }

    /**
     * Sets input.value to text in a way that React reacts to the related input event.
     * https://stackoverflow.com/a/46012210/2471106
     * @param input
     * @param text
     * @return {Promise<boolean>}
     */
    static async setInputValueWithEvent(input, text) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, text);
        const ev2 = new Event('input', {bubbles: true});
        return input.dispatchEvent(ev2);
    }

    /**
     * Updates hours or minutes of time represented as HH:mm string.
     * @param {number} adjustmentDirection Positive or negative number. Should be -1 or 1.
     * @param {number} cursorPosition Index of the caret. Decides whether to change hours or minutes.
     * @param {string} timeInputValue Time string in the input box
     * @return {string} Shifted and formatted time
     */
    static updateTime(adjustmentDirection, cursorPosition, timeInputValue) {
        const timeRegExp = /(\d{1,2}):(\d{1,2})/;
        if (!timeRegExp.test(timeInputValue)) {
            console.debug(`Invalid time format, cannot adjust time "${timeInputValue}"`);
            return timeInputValue;
        }
        const dateTime = WtmDateTime.parseDateTime(WtmDialog.datePicker().value, timeInputValue);
        const pad = WtmDateTime.padToDoubleDigit;
        const formatTime = (date) => pad(date.getHours()) + ':' + pad(date.getMinutes());
        if (cursorPosition <= timeInputValue.indexOf(':')) {
            return formatTime(WtmDateTime.addHours(dateTime, adjustmentDirection));
        } else {
            return formatTime(WtmDateTime.addMinutes(dateTime, 15 * adjustmentDirection));
        }
    }

    static writeWorkLogToJira() {
        console.debug(new Date().toISOString(), 'Adding a work log item.');
        const wd = Jira4U.tryParseIssue(WtmDialog.descArea().value);
        if (!wd.issueKey) {
            return;
        }
        IssueVisual.jiraLogWorkButton().disabled = true;
        const durationSeconds = WtmDialog.getDurationSeconds();
        if (durationSeconds <= 0) {
            return 0;
        }
        const dateFrom = WtmDialog.dateFrom();
        console.log(`Logging ${durationSeconds} minutes of work on ${wd.issueKey}`);
        Jira4U.logWork({
            key: wd.issueKey,
            started: dateFrom,
            duration: durationSeconds,
            comment: wd.descriptionText,
            onReadyStateChange: function (state) {
                console.debug("Log work request state changed to: " + state.readyState);
                if (state === 1) {
                    IssueVisual.showJiraIssueWorkLogRequestProgress('loading');
                }
            }
        }).then(res => {
            console.info("Work was successfully logged to JIRA.", JSON.parse(res.responseText));
            IssueVisual.showJiraIssueWorkLogRequestProgress('done');
            //The buttons are probably refreshed. They loose their enhancements after adding a worklog.
            setTimeout(() => {
                P4uWorklogger.registerKeyboardShortcuts();
                IssueVisual.jiraLogWorkButton().disabled = false;
            }, 500);
        }, err => {
            console.warn("Failed to log work to JIRA. ", err);
            IssueVisual.showJiraIssueWorkLogRequestProgress('error');
            IssueVisual.jiraLogWorkButton().disabled = false;
        });
    }

    checkWorkDescriptionChanged(description) {
        if (this._previousDesctiptionValue !== description) {
            this._previousDesctiptionValue = description;
            this.workDescriptionChanged(description);
        } else console.debug("No description change")
    }

    /**
     * @param {string} description The new work description value
     */
    workDescriptionChanged(description) {
        const wd = Jira4U.tryParseIssue(description);
        if (this._previousIssue.issueKey === null || this._previousIssue.issueKey !== wd.issueKey) {
            this._previousIssue = wd;
            P4uWorklogger.loadJiraIssue(wd);
        }
    }

    static loadJiraIssue(wd) {
        IssueVisual.jiraLogWorkButton().disabled = true;
        IssueVisual.showJiraIssueWorkLogRequestProgress('idle');
        if (!wd.issueKey) {
            IssueVisual.showIssueDefault();
            return;
        }

        let key = wd.issueKey;
        console.debug("JIRA issue key recognized: ", key);
        const showLoadingProgress = progress => {
            console.info(`Loading jira issue ${key}, state: ${progress.readyState}`);
            if (progress.readyState === 1) {
                IssueVisual.showIssueLoadingProgress();
            }
        };

        Jira4U.loadIssue(key, showLoadingProgress)
            .then(tee(IssueVisual.showIssue))
            .then(tee(_ => IssueVisual.jiraLogWorkButton().disabled = false))
            .then(P4uWorklogger.fillFormFromMemorizedValues)
            .catch(responseErr => {
                console.log(`Failed to load issue ${key}. Error: ${JSON.stringify(responseErr, null, 2)}`);
                IssueVisual.issueLoadingFailed(key, responseErr);
            });
    }
}

class WorkloggerFormMemory {

    /**
     * @typedef TimesheetItem
     * @property {string} datetimeFrom "2020-03-30T17:01:00+02:00"
     * @property {string} datetimeTo "2020-03-30T18:01:00+02:00"
     * @property {string} subject "ues:UNI-BT:USYE.NECS~SWA04"
     * @property {string} category "USYE.NECS"
     * @property {string} description "NECS-1234 Pretending to work"
     *
     * @param timesheetItem {TimesheetItem}
     */
    static memorize(timesheetItem) {
        console.debug('Remember form data for autocomplete');

        /**
         * @param {HumanJiraIssue} jiraIssue
         */
        function storeFormDataForProjectCode(jiraIssue) {
            const {subject = "", category = ""} = timesheetItem;
            if (jiraIssue.projectCode) {
                console.debug('Saving form data for project code ', jiraIssue.projectCode);
                GM_setValue(jiraIssue.projectCode, JSON.stringify({subject, category}));
                console.debug(`Form data for project code ${jiraIssue.projectCode} saved.`);
            } else if (jiraIssue.issueKeyPrefix) {
                console.debug('Saving form data for project key ', jiraIssue.issueKeyPrefix);
                GM_setValue(jiraIssue.issueKeyPrefix, JSON.stringify({subject, category}));
                console.debug(`Form data for project key ${jiraIssue.issueKeyPrefix} saved.`);
            }
        }

        if (timesheetItem.description && (timesheetItem.subject || timesheetItem.category)) {
            const workDescription = Jira4U.tryParseIssue(timesheetItem.description);
            if (workDescription.issueKey) {
                console.debug(`Loading JIRA issue '${workDescription.issueKey}' to get project code for form data memorization`);
                Jira4U.loadIssue(workDescription.issueKey)
                    .then(P4uWorklogger.mapToHumanJiraIssue)
                    .then(storeFormDataForProjectCode)
                    .catch(error);
            }
        } else {
            console.debug('No form data to memorize for autocomplete');
        }
    }

    /**
     * @typedef FormValues
     * @property {string} subject "ues:UNI-BT:USYE.NECS~SWA04"
     * @property {string} category "USYE.NECS"
     *
     * @param {HumanJiraIssue} jiraIssue
     * @return {FormValues}
     */
    static remember(jiraIssue) {
        console.log('Loading form data for issue ', jiraIssue);
        const value = GM_getValue(jiraIssue.projectCode) || GM_getValue(jiraIssue.issueKeyPrefix) || `{}`;
        return JSON.parse(value);
    }
}

/**
 * Keyboard shortcuts registration and handling.
 */
class WtmShortcuts {
    /**
     * Registers keyboard shortcuts available throughout WTM.
     * Element titles need to be set in DomObserver because they require the element to exist while this is installed when script loads.
     */
    static install() {
        if (WtmShortcuts.install.done) {
            return;
        }
        WtmShortcuts.install.done = true;
        // New work item - N
        document.addEventListener("keypress",
            condp(
                and(WtmShortcuts.keyCodePred('KeyN'), not(WtmWorktableModel.isModalDialogOpened))
                , WtmShortcuts.clickElement(WtmWorktableModel.newItemButton),
                /* TODO this requires filtering regular typing events (or events from input target elements)
                and(WtmShortcuts.keyCodePred('KeyT'), WtmWorktableModel.isModalDialogOpened)
                , WtmShortcuts.doWithElement(el => el.focus(), WtmDialog.timeFrom),
                and(WtmShortcuts.keyCodePred('KeyD'), WtmWorktableModel.isModalDialogOpened)
                , WtmShortcuts.doWithElement(el => el.focus(), WtmDialog.datePicker),*/
                and(ev => ev.ctrlKey, ev => ev.shiftKey, WtmShortcuts.keyCodePred('Enter'), WtmWorktableModel.isModalDialogOpened)
                , WtmShortcuts.clickElement(WtmDialog.buttonNextItem),
                and(ev => ev.ctrlKey, WtmShortcuts.keyCodePred('Enter'), WtmWorktableModel.isModalDialogOpened)
                , WtmShortcuts.clickElement(WtmDialog.buttonOk)));
    }

    static doWithElement(elementFn, targetElement) {
        return function elementAction() {
            let target = (typeof targetElement === "function") ? targetElement() : targetElement;
            elementFn(target);
        }
    }

    static clickElement(targetElement) {
        const clicker = element => {
            if (element && typeof element.click === "function") {
                element.click();
            } else {
                console.warn('Cannot activate element by shortcut. Element:', element)
            }
        };
        return WtmShortcuts.doWithElement(clicker, targetElement);
    }

    static keyCodePred(code) {
        return function checkIsKey(ev) {
            return ev.code === code;
        };
    }

}

/**
 * Adds month selection buttons.
 */
class MonthSelector {
    static getMonthSelectorContainer() {
        return document.querySelector('.uu-specialistwtm-worker-monthly-detail-top-change-month-dropdown');
    }

    static getMonthSelector() {
        return this.getMonthSelectorContainer().firstElementChild;
    }
    static getMonthSelectorButton() {
        return this.getMonthSelector().querySelector('button');
    }

    static getSelectedMonthValue() {
        return this.getMonthSelectorButton().querySelector('.uu-specialistwtm-worker-monthly-detail-top-month-dropdown-value').innerText;
    }

    install() {
        if (MonthSelector.getMonthSelectorContainer().querySelector('span.wtm-month-switch-button-icon')) {
            return;
        }
        const createArrow = (direction) => {
            const arrow = document.createElement('SPAN');
            arrow.classList.add('wtm-month-switch-button-icon', 'uu5-bricks-button', 'uu5-bricks-button-inverted', 'mdi', 'mdi-chevron-' + direction);
            return arrow;
        };

        /**
         * Creates the month switching callback, which is called after the dropdown menu is shown.
         * The menu is a div containing an UL element. This list is searched for the current month by the displayed text.
         * Index of the selected list item is updated and the neighbor item is clicked.
         *
         * @param selectedMonthText
         * @param monthIndexFn {Function} Returns new month index
         * @return {function(*): Function}
         */
        const createMonthSelector = function (selectedMonthText, monthIndexFn) {
            //This returned fn may recursively call itself to repeat the drop-down click if the menu was not rendered yet.
            return function selectMonth(attempts = 1) {
                const dropDown = MonthSelector.getMonthDropDown();
                if (!dropDown) {
                    if (attempts > 3) {
                        console.warn('Month drop-down menu does not exist. Attempt:', attempts);
                        return false;
                    }
                    MonthSelector.getMonthSelectorButton().click();
                    //Repeat opening the dropdown and wait for rendering.
                    window.requestAnimationFrame(() => selectMonth(++attempts));
                    return false;
                }
                const selectedMonthIndex = Array
                    .from(dropDown.children)
                    .findIndex(li => li.innerText.trim() === selectedMonthText);
                if (selectedMonthIndex < 0) {
                    console.debug('Cannot find selected month:', selectedMonthText);
                    return false;//May leave the menu opened? It may actually be desirable as a fallback scenario.
                }
                const newMonthIndex =
                    Math.max(0,
                        Math.min(dropDown.children.length - 1,
                            monthIndexFn(selectedMonthIndex)))
                    || selectedMonthIndex;
                dropDown.children[newMonthIndex].firstChild.click();//LI contains an A element
                return true;
            }
        };

        const createArrowClickHandler = (monthIdxUpdateFn) => (event) => {
            console.trace('WTM Extension', 'Click:', event);
            //Show the months dropdown
            MonthSelector.getMonthSelectorButton().click();
            //Allow browser to render the menu, then click desired month.
            // Using requestAnimationFrame here always caused the menu to be visible before script clicks an item in it.
            setTimeout(createMonthSelector(MonthSelector.getSelectedMonthValue(), monthIdxUpdateFn), 0);
        };

        const arrowLeft = createArrow('left');
        arrowLeft.onclick = createArrowClickHandler(i => i + 1);//Months are in the reversed order
        arrowLeft.title = _t('wtm.month.prev.title');

        const arrowRight = createArrow('right');
        arrowRight.onclick = createArrowClickHandler(i => i - 1);
        arrowRight.title = _t('wtm.month.next.title');

        const monthSelector = MonthSelector.getMonthSelector();
        monthSelector.insertBefore(arrowLeft, monthSelector.firstChild);
        monthSelector.appendChild(arrowRight);
    }

    static getMonthDropDown() {
        return MonthSelector.getMonthSelectorContainer().querySelector('ul.uu5-bricks-dropdown-menu-list');
    }
}

const workLogger = new P4uWorklogger();
const monthSelector = new MonthSelector();

class WtmDomObserver {

    constructor() {
        this.observeOptions = {
            attributes: false,
            characterData: false,
            childList: true,
            subtree: true,
            attributeOldValue: false,
            characterDataOldValue: false,
        };
        this.mutationObserver = null;
        this.pageReadyMutationOberver = null;
    }

    observe() {
        const hasAddedNodes = (mutation) => mutation.addedNodes.length > 0;
        const isWorkDescription = (mutation) => mutation.target.type === 'textarea' && mutation.target.name === 'description';
        const isWorkLogForm = (mutation) => affectsNodesWithClass(mutation, 'uu5-bricks-modal-body', 'uu-specialistwtm-create-timesheet-item-modal-container');
        const isWorkTable = (mutation) => affectsNodesWithClass(mutation, 'uu-specialistwtm-worker-monthly-detail-container', 'uu-specialistwtm-worker-monthly-detail-table');

        const affectsNodesWithClass = (mutation, targetNodeClass, childNodeClass) => {
            if (!mutation.target.classList.contains(targetNodeClass)) {
                return false;
            }
            for (const childNode of mutation.target.childNodes) {
                if (childNode.classList.contains(childNodeClass)) {
                    return true;
                }
            }
            return false;
        };

        this.mutationObserver = new MutationObserver(function (mutations) {
            mutations
            // .filter(hasAddedNodes)
                .forEach((mutation) => {
                    // console.log(mutation); //I expect to use this functionality frequently
                    if (isWorkDescription(mutation)) {
                        workLogger.checkWorkDescriptionChanged(mutation.target.textContent);
                    }
                    if (isWorkLogForm(mutation)) {
                        workLogger.workLogFormShow();
                    } else if (mutation.target.classList.contains('uu-specialistwtm-create-timesheet-item-buttons-save')) {
                        console.debug('Buttons changed, re-applying extension.');
                        P4uWorklogger.registerKeyboardShortcuts();
                    }
                    if (isWorkTable(mutation)) {
                        WtmWorktableView.worktableSumViewShow();
                    }

                    if (MonthSelector.getMonthSelectorContainer()) {
                        monthSelector.install();
                    }

                    if (WtmWorktableModel.newItemButton()) {
                        WtmWorktableModel.newItemButton().title = '(n)';
                    }
                });
        });

        //During page loading, there are tons of mutations. This observer is active until the main page is added, then it disconnects and activates the actual observer.
        this.pageReadyMutationOberver = new MutationObserver(function (mutations) {
            const isMainPageAddition = (mutation) => hasAddedNodes(mutation) && mutation.type === 'childList' && mutation.target.matches('div.uu5-common-div.uu5-bricks-page-system-layer.plus4u5-app-page-system-layer-wrapper');
            if (mutations.some(isMainPageAddition)) {
                swapObservers();
            }
        });

        let swapObservers = () => {
            if (this.pageReadyMutationOberver) {
                this.pageReadyMutationOberver.disconnect();
            }
            this.mutationObserver.observe(document.body, this.observeOptions);
        };
        this.pageReadyMutationOberver.observe(document.body, this.observeOptions);
    }
}

/**
 * Intercepts XMLHttpRequests and invokes a registered callback.
 * Currently supports just one callback, registering more would probably
 * nest the XMLHttpRequest.open and XMLHttpRequest.send proxy functions.
 */
class RequestListener {

    static onDataSent(urlFilter, callback) {
        // Start with interception of fn XMLHttpRequest.open, which is provided request URL
        (function (open) {
            window.XMLHttpRequest.prototype.open = function (method, url, ...args) {
                // Store the URL on he XMLHttpRequest.send fn because send() gets the request body right after open() is called.
                window.XMLHttpRequest.prototype.send.lastOpenedUrl = url;
                open.apply(this, [method, url, ...args]);
            };
        })(window.XMLHttpRequest.prototype.open);

        // Next, intercept the XMLHttpRequest.send fn, check that the last opened URL is the one to intercept and invoke callback
        (function (send) {
            window.XMLHttpRequest.prototype.send = function (data) {
                const lastOpenedUrl = window.XMLHttpRequest.prototype.send.lastOpenedUrl;
                if (data && lastOpenedUrl && urlFilter(lastOpenedUrl)) {
                    callback(lastOpenedUrl, data)
                }
                send.call(this, data);
            };
        })(window.XMLHttpRequest.prototype.send);
    }

    static isUrlPathName(urlEnding) {
        return function requestEventUrlPathnameFilter(url) {
            try {
                return new URL(url).pathname.endsWith(urlEnding);
            } catch (e) {
                console.warn(`failed to compare URL ending "${urlEnding} with URL ${url}`);
                return false;
            }
        };
    }
}

RequestListener.onDataSent(
    RequestListener.isUrlPathName('/createTimesheetItem'),
    (url, data) => {
        WorkloggerFormMemory.memorize(JSON.parse(data));
    }
);

const brickObserver = new WtmDomObserver();
brickObserver.observe();
WtmShortcuts.install();

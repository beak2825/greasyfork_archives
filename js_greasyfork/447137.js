// ==UserScript==
// @name			Jira Mods
// @namespace		COMDSPDSA
// @version			1.1
// @description		Changes layout for Jira
// @author			Dan Overlander
// @include			*jira.dell.com*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=1061286
// @grant           GM_setValue
// @grant           GM_getValue
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/447137/Jira%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/447137/Jira%20Mods.meta.js
// ==/UserScript==

// Since v00.0: init, copying from AriaAssistant script

// tm is an object included via @require from DorkForce's Tampermonkey Assist script
const monkey = tm;
let debugPassFail = [];
const avatarHost = 'localhost:8675/';
const pingPhoto = '!none';
const imageExt = '.png';

(function () {
//    const foundEls = []; // keeps a log of elements that are found and initialized, so as not to try reinitializing them
// export interface ObserverDef {
//   single: boolean;
//   selector: String;
//   callback: (elem: any) => void;
// }
const observers = {
    /**
     * handler to process user-defined callback when element is located in DOM
     * @param {NodeList} elements - All elements found matching the user-defined selector in "observerDefs"
     * @return {void}
     */
    handleFound: (elements, observerDef) => {
        elements.forEach((element) => {
            observerDef.callback(element, observerDef);
            // if (!foundEls.includes(element.id)) {
            //     foundEls.push(element.id);
            // }
        });
    },
    /**
     * Creates a single-use observer to await the existance of a DOM element
     * @param {Array<ObserverDef>} observerDefs - an array of elements to await
     * @return {Array<observer} observers - an array of all MutationObservers created
     */
    create: (observerDefs) => {
        // As assistance for delayed initialization, define an observer to watch for changes
        var observerList = [];
        observerDefs.forEach(function (obd) {
            if (obd.single == null) {
                obd.single = true;
            }
            observerList.push(
                new MutationObserver(function (mutations, me) {
                    var targetElems = document.querySelectorAll(obd.selector);
                    if (targetElems.length > 0) {
                        observers.handleFound(targetElems, obd);
                        if (obd.single) {
                            me.disconnect(); // stop observing
                        }
                        return;
                    }
                })
            );
        });
        // start observing
        observerList.forEach(function (observer) {
            observer.observe(document, {
                childList: true,
                subtree: true
            });
        });
        return observerList;
    }
}
const report = {
    start: (id) => {
        if (debugPassFail.length > 0) {
            utils.debug([`Reporting Error!`, debugPassFail, id]);
        }
        debugPassFail = [];
        debugPassFail.push({
            id: id,
            step: `start`,
            pass: true,
        });
    },
    abort: () => {
        report.step(`not needed`);
        report.finish();
    },
    step: (step, pass = true) => {
        let thisId = debugPassFail[0] ? debugPassFail[0].id : `???`;
        debugPassFail.push({
            id: thisId,
            step: step,
            pass: pass,
        });
    },
    finish: () => {
        const pass = [];
        const fail = [];
        if (debugPassFail.length === 0) {
            return;
        }
        if (debugPassFail.length === 1) {
            report.step(`did nothing`, false);
        }
        debugPassFail.forEach(pf => {
            if (pf.pass) { pass.push(pf); };
            if (!pf.pass) { fail.push(pf); };
        });
        if (fail.length > 0) {
            utils.debug({
                iAm: fail[0].id,
                ...fail
            });
        } else if (pass.length > 0 && !global.prefs.debugIgnores.includes(`pass`)) {
            utils.debug({
                iAm: pass[0].id,
                ...pass
            });
        }
        debugPassFail = [];
    },
};
const utils = {
    capitalize: (cap) => {
        if (!cap) {
            return;
        }
        return cap.charAt(0).toUpperCase() + cap.slice(1);
    },
    createElement: (a, b) => {
        var d = document.createElement(a);
        if (b && "object" == typeof b) {
            var e;
            for (e in b) {
                if ("html" === e) {
                    d.innerHTML = b[e];
                } else {
                    if (e.slice(0, 5) === "aria_" || e.slice(0, 5) === "data_") {
                        var attr = e.slice(0, 4) + "-" + e.slice(5);
                        d.setAttribute(attr, b[e]);
                    } else {
                        d.setAttribute(e, b[e]);
                    }
                }
            }
        }
        return d;
    },
    debug: (msg) => {
        const iAm = msg.iAm ? msg.iAm : debugPassFail[0] ? debugPassFail[0].id : `undefined`;
        let shouldIgnore = false;
        let userSelectedIgnore = [iAm].filter(function (iAmCheck) {
            return global.prefs.debugIgnores.some(function (match) {
                return iAmCheck.toLowerCase().indexOf(match.toLowerCase()) !== -1;
            });
        });
        shouldIgnore = userSelectedIgnore.length > 0;
        if (utils.stringToBoolean(global.prefs.debugMode) && !shouldIgnore) {
            if (typeof msg === 'object') {
                let hasSource = false;
                if (msg.constructor === Array) {
                    msg.includes("iAm") && (hasSource = true);
                    shouldIgnore = global.prefs.debugIgnores.includes(msg.find(id => id === "iAm"));
                } else {
                    const keys = Object.keys(msg);
                    keys.forEach((key) => {
                        !hasSource && (hasSource = key === "iAm");
                    });
                    shouldIgnore = global.prefs.debugIgnores.includes(msg.iAm);
                }
                if (hasSource) {
                    !shouldIgnore && console.log(msg);
                } else {
                    console.log({ 'iAm': iAm, ...msg });
                }
            } else {
                console.log({ 'iAm': iAm, 're': msg });
            }
        }
    },
    delayUntil: function (id, condition, callback) {
        const repeat = (id, co, ca) => {
            setTimeout(() => {
                utils.delayUntil(id, co, ca);
            }, global.constants.TIMEOUT * 2);
        };
        if (!global.states.delays.find((x) => x.delayId === id)) {
            global.states.delays.push({
                delayId: id,
                delayCount: 0
            });
        }
        global.states.delays.find((x) => x.delayId === id).delayCount++;
        if (global.states.delays.find((x) => x.delayId === id).delayCount > 20) {
            global.states.delays.find((x) => x.delayId === id).delayCount === 0;
            return;
        }
        try {
            if (!condition()) {
                utils.debug('delay WAIT called by ' + id);
                repeat(id, condition, callback);
            } else {
                utils.debug('delay PASS for ' + id);
                callback();
            }
        } catch (e) {
            utils.debug('delay WAIT called by ' + id + ' TRIED\n   ' + e);
            repeat(id, condition, callback);
        }
    },
    getElementByTextContent: (text, tagName = `span`) => {
        var spanList = document.getElementsByTagName(tagName);
        for (var i = 0, len = spanList.length; i < len; i++) {
            if (spanList[i].textContent === text) {
                return spanList[i];
            }
        }
    },
    getElementsByTextContent: (text, tagName = `span`) => {
        const spanList = document.getElementsByTagName(tagName);
        const returnList = [];
        for (var i = 0, len = spanList.length; i < len; i++) {
            if (spanList[i].textContent === text) {
                returnList.push(spanList[i]);
            }
        }
        return returnList;
    },
    initScript: () => {
        Object.keys(global.constants.initalizeOnElements).forEach((key) => {
            const trigger = global.constants.initalizeOnElements[key];
            monkey.getContainer({
                'el': trigger,
                'max': 100,
                'spd': 1000
            }).then(function () {
                page.initialize();
            });
        });
    },
    isEmpty: (obj) => {
        return Object.keys(obj).every(key => obj[key] === undefined);
    },
    isNumeric: (n) => {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    listenOnce: (element, event, handler) => {
        element.addEventListener(
            event,
            function tempHandler(e) {
                handler(e);
                element.removeEventListener(event, tempHandler, false);
            },
            false
        );
    },
    savedMems: () => {
        return JSON.parse(GM_getValue(global.ids.memsName));
    },
    stringToBoolean: (thisState) => {
        if (typeof thisState === `boolean`) {
            return thisState;
        }
        if (thisState === `1` || thisState === `true`) {
            return true;
        }
        return false;
    },
    user: {
        chat: (idName, messageName, email) => {
            const chatLink = 'https://teams.microsoft.com/l/chat/0/0?users=';
            idName = email || utils.user.renameIndexedToEmail(idName) + '@dell.com';
            var message = messageName ? '&message=' + messageName : '';
            window.open(chatLink + idName + message);
        },
        renameIndexedToEmail: (userName) => {
            const commaIndex = userName.indexOf(`, `);
            if (commaIndex <= 0) {
                return;
            }
            const lName = userName.substr(0, commaIndex);
            const fName = userName.replace(lName, ``).replace(`, `, ``);
            return `${fName}_${lName}`;
        },
        properName: (thisName) => {
            if (!thisName) {
                return;
            }
            var firstName = '',
                lastName = '',
                midName = '';

            thisName = thisName
                .replace('https://gitlab.dell.com/', '')
                .replace(' - Dell Team', '')
                .replace('User profile for ', '')
                .replace('\'s avatar', '')
                .replace('Assigned to ', '')
                .replace('Avatar for ', '')
                .replace('Assignee:', '')
                .replace(`Uploaded image for project: `, ``)
                .replace(/(<table>).*(<\/table>)/gi, '')
                .replace(/dell\.com/gi, '')
                .replace(/dellteam\.com/gi, '')
                .replace(/'/g, '')
                .replace('@', '')
                .replace(/@/g, '')
                .replace(/\//g, '')
                .replace(/Review requested from /g, '')
                .replace(/_/g, '-');
            firstName = thisName.substring(0, thisName.indexOf('-'));
            lastName = thisName.substring(thisName.indexOf('-') + 1, thisName.length);
            if ((firstName.length === 0 && lastName.length === 0)) {
                return;
            }
            if (firstName.length > 0 && lastName.length > 0 && thisName.indexOf(',') < 0) {
                thisName = lastName + ', ' + firstName;
            }
            if (thisName.indexOf('-') > 0) {
                midName = thisName.substring(0, thisName.indexOf('-'));
                thisName = thisName.substring(thisName.indexOf('-') + 1, thisName.length);
                thisName = thisName + ' ' + midName;
            }
            while (thisName.indexOf('  ') > 0) {
                thisName = thisName.replace(/\s\s/, ''); // no double spaces
            }
            thisName = thisName
                .replace(/(\r\n\t|\n|\r\t)/gm, '') // no line breaks or tabs
                .replace(/ ,/, ',') // no spaces before commas
                .replace(/\%20/, '') // no %20 characters
                .replace(/Americas/g, '')
                .trim(); // seriously, no extra spaces
            thisName = thisName.replace(',', ', ').replace('  ', ' '); // there's probably a less-stupid way of REALLY making sure it's always "COMMA SPACE"
            return thisName;
        },
        updateImg: function (img, thisName) {
            if (thisName && thisName.length > 0 && thisName !== ', ') {
                const src = img.getAttribute(`src`);
                if (src.match(/(!none|jira|gravatar)/gi)) {
                    img.setAttribute("data-previous", src);
                    var nameDivider = (thisName.indexOf(',') < 0) ? ' ' : ', ';
                    var thisNameSpaceIndex = thisName.indexOf(' ') + 1;
                    var thisNameFirst = thisName.indexOf(' ') < 0 ? thisName : nameDivider === ' ' ? thisName.substr(0, thisName.indexOf(thisNameSpaceIndex) - 1) : thisName.substr(thisNameSpaceIndex, thisName.length - thisNameSpaceIndex);
                    if (thisNameFirst.length === 0) {
                        thisNameFirst = thisName;
                    }
                    if (!global.states.avatarPingFailed && global.prefs.avatarPreference[0] === 'localhost') {
                        // look at why there's a difference handling localhost vs. the other avatar servers
                        img.setAttribute('src', 'http://' + avatarHost + thisName + imageExt);
                    } else if (global.prefs.avatarPreference[0] !== 'localhost') {
                        var templateSrc = global.templates.default.replace(/IMGID/g, thisName).replace(/IMGALT/g, thisName);
                        templateSrc = encodeURI(templateSrc.substr(templateSrc.indexOf('http'), (templateSrc.indexOf('alt=') - templateSrc.indexOf('http')) - 2));
                        img.setAttribute('src', templateSrc);
                    }
                }
            } else {
                utils.debug('updateImg: invalid user name for ' + img.src + ': ' + thisName + '(' + thisName.length + ' chars)');
            }
        },
    },
    xhrAction: (iAm, token, xhrType, urlPath, params, callback, alwaysCallback) => {
        if (!iAm || !token || !xhrType || !urlPath || !callback) {
            utils.debug('improper xhr setup');
            return;
        }
        utils.debug({ 'id': iAm, 'xhrType': xhrType, 'urlPath': urlPath, 'params': params, 'callback': callback, 'alwaysCallback': alwaysCallback });

        // Set up our HTTP request
        const xhr = new XMLHttpRequest();

        // Setup our listener to process completed requests
        xhr.onload = function () {
            global.states.xhrBusy = false;

            // Process our return data
            if (xhr.status >= 200 && xhr.status < 300) {
                // What do when the request is successful
                console.log("SUCCESS");
                const resp = xhr.response;
                if (resp) {
                    // resp = JSON.parse(resp).slice().reverse();
                    utils.debug({ 'id': 'xhrAction', 're': { 'urlPath': urlPath, ...JSON.parse(resp) } });
                    callback(resp);
                }
            } else {
                // What do when the request fails
                utils.debug('XHR Call for ' + iAm + ' failed!');
            }
            if (alwaysCallback) {
                alwaysCallback();
            }
        };
        xhr.open(xhrType, urlPath);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        if (params != null) {
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify(params));
        } else {
            xhr.send();
        }
    },
};
const global = {
    constants: {
        TIMEOUT: 750,
        initalizeOnElements: ['body'], // .content
    },
    ids: {
        scriptName: 'JiraMods',
        prefsName: 'JiraPrefs',
        memsName: 'JiraMems',
        projectCode: `DDSTM`,
        projectNameValue: `DellDesignSystem`,
    },
    states: {
        areClassesAdded: false,
        avatarPingFailed: false,
        isMouseMoved: false,
        areStepsAnnounced: false,
        observingAvatars: false,
        observingChatAdds: false,
    },
    prefs: {},
    mems: {},
    templates: {
        default: null,
        localhost: '<img src="http://' + avatarHost + 'IMGID.png" alt="IMGALT" title="IMGALT" class="avatar s40" data-email="">',
        dicebear: '<img src="https://avatars.dicebear.com/api/dicebearType/IMGID.svg" alt="IMGALT" title="IMGALT" class="avatar s40" data-email="">',
        boring: `https://source.boringavatars.com/beam/120/IMGID?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`,
    }
};
const page = {
    initialize: function () {
        page.setPrefs();
        page.setMems();
        monkey.setTamperIcon(global);
        monkey.addClasses();
        const stepsRun = [];
        const steps = [
            page.addClasses,
            mods.customize.addFaves,
            mods.customize.collapseBotPosts,
            mods.customize.modMainLogo,
            mods.customize.modMainMenu,
            mods.customize.moveComments,
            mods.customize.removeLinks,
            mods.customize.shortLists,
            mods.customize.useDDSClasses,
            mods.user.addChat,
            mods.user.avatars,
            mods.autofill.defect,
            mods.autofill.searchbar,
            mods.append.copyLink,
            mods.append.swimButtons,
            mods.append.voteButtons,
        ];
        steps.forEach((step, index) => {
            if (!global.states.areStepsAnnounced) {
                stepsRun.push(step.name);
            }
            setTimeout(() => {
                step();
            }, index * 10);
        });
        if (!global.states.areStepsAnnounced) {
            utils.debug([`INIT`, stepsRun]);
            global.states.areStepsAnnounced = true;
        }
    },
    setPrefs: function () {
        var currentPrefs = GM_getValue(global.ids.prefsName),
            setDefaultPrefs = function () {
                if (!global.prefs.avatarPreference) global.prefs.avatarPreference = ['dicebear', 'localhost', 'boring'];
                if (!global.prefs.dicebearType) global.prefs.dicebearType = 'initials';
                if (!global.prefs.jiraApiKey) global.prefs.jiraApiKey = '';
                if (!global.prefs.customCss) global.prefs.customCss = `
.altMenuLink {
    background: gold !important;
    border: 1px solid goldenrod !important;
}
                `;
                if (!global.prefs.favorites) global.prefs.favorites = [
                    {
                        name: `Dashboard`,
                        url: `https://jira.dell.com/secure/Dashboard.jspa?selectPageId=11319`,
                        icon: `dashboard`,
                        class: `dds__button--editorial-light`,
                    },{
                        name: `My Backlog`,
                        url: `https://jira.dell.com/secure/RapidBoard.jspa?rapidView=172&view=planning&selectedIssue=DDSTM-1017&quickFilter=441&quickFilter=1600&issueLimit=100`,
                        icon: `wrench-cir`,
                        class: `dds__button--editorial-light altMenuLink`,
                    },{
                        name: `My Board`,
                        url: `https://jira.dell.com/secure/RapidBoard.jspa?rapidView=172&view=detail&selectedIssue=DDSTM-1010&quickFilter=441`,
                        icon: `device-storage-array`,
                        class: `dds__button--editorial-light altMenuLink`,
                    },{
                        name: `My Issues`,
                        url: `https://jira.dell.com/issues/?filter=-1`,
                        icon: `view-list`,
                        class: `dds__button--editorial-light altMenuLink`,
                    },{
                        name: `Query`,
                        url: `https://jira.dell.com/secure/StructureBoard.jspa?s=%7B%22sQuery%22%3A%7B%22query%22%3A%22Project%20%3D%20DellDesignSystem%22%2C%22type%22%3A%22jql%22%7D%7D#`,
                        icon: `search`,
                        class: `dds__button--editorial-light`,
                    },
                ];
                if (!global.prefs.autofills) global.prefs.autofills = [{
                    identifier: `.jira-dialog`,
                    fields: [
                        { id: `customfield_10220`, value: `10308` },
                        { id: `customfield_10204`, value: `10136` },
                        { id: `customfield_10207`, value: `10139` },
                        { id: `customfield_10214`, value: `10198` },
                        { id: `customfield_10210`, value: `10152` },
                    ],
                },{
                    identifier: `#create-issue-dialog`,
                    fields: [
                        { id: `customfield_10210`, value: `10151` },
                        { id: `customfield_10212`, value: `10172` },
                        { id: `customfield_10209`, value: `10142` },
                        { id: `customfield_10500`, value: `18859` },
                        { id: `customfield_10213`, value: `10177` },
                        { id: `customfield_10211`, value: `10158` },
                        { id: `customfield_10220`, value: `10308` },
                        { id: `customfield_10204`, value: `10136` },
                        { id: `customfield_10207`, value: `10139` },
                    ],
                },];
                if (!global.prefs.removals) global.prefs.removals = ['Plans', 'Query', 'Structure'];
                if (!global.prefs.mainLogo) global.prefs.mainLogo = `https://avatars.dicebear.com/api/bottts/Jira.svg`;
                if (!global.prefs.menuIconSwaps) global.prefs.menuIconSwaps = [
                    { text: 'Dashboards', icon: 'dashboard'},
                    { text: 'Projects', icon: 'book-open'},
                    { text: 'Issues', icon: 'card-info'},
                    { text: 'Boards', icon: 'chart-insights'},
                ];
                if (!global.prefs.debugIgnores) global.prefs.debugIgnores = [];
                if (!global.prefs.debugMode) global.prefs.debugMode = false;
                if (!global.prefs.collapseBotPosts) global.prefs.collapseBotPosts = false;
                if (!global.prefs.addCollapseButtons) global.prefs.addCollapseButtons = false;
                if (!global.prefs.addCopyLinks) global.prefs.addCopyLinks = false;
                if (!global.prefs.addFavorites) global.prefs.addFavorites = false;
                if (!global.prefs.addVoteButtons) global.prefs.addVoteButtons = false;
                if (!global.prefs.addTeamsLinks) global.prefs.addTeamsLinks = false;
                if (!global.prefs.modMainLogo) global.prefs.modMainLogo = false;
                if (!global.prefs.modMainMenu) global.prefs.modMainMenu = false;
                if (!global.prefs.moveComments) global.prefs.moveComments = false;
                if (!global.prefs.moveBacklog) global.prefs.moveBacklog = false;
                if (!global.prefs.useAvatars) global.prefs.useAvatars = false;
                if (!global.prefs.shortLists) global.prefs.shortLists = false;
                if (!global.prefs.fillSearchProject) global.prefs.fillSearchProject = false;
                if (!global.prefs.removeLinks) global.prefs.removeLinks = false;
                if (!global.prefs.useDDSClasses) global.prefs.useDDSClasses = false;
            };

        if (!currentPrefs || utils.isEmpty(JSON.parse(currentPrefs))) {
            global.prefs = {};
            setDefaultPrefs();
            monkey.savePreferences(global.ids.prefsName, global.prefs);
        } else {
            global.prefs = JSON.parse(currentPrefs);
            setDefaultPrefs();
            for (var key in global.prefs) {
                try {
                    if (global.prefs[key] === 'true' || global.prefs[key] === 'false') {
                        global.prefs[key] = (global.prefs[key] == 'true');
                    } else {
                        global.prefs[key] = JSON.parse(global.prefs[key]);
                    }
                } catch (e) {
                    // swallow error. console.error(e);
                }
            }
        }
        switch (global.prefs.avatarPreference[0]) {
            case 'boring':
                global.templates.default = global.templates.boring;
                break;
            case 'dicebear':
                global.templates.default = global.templates.dicebear.replace(`dicebearType`, global.prefs.dicebearType);
                break;
            default:
                global.templates.default = global.templates.localhost;
                break;
        }
    },
    setMems: function () {
        var currentMems = GM_getValue(global.ids.memsName);
        if (currentMems == null || utils.isEmpty(JSON.parse(currentMems))) {
            global.mems = {};
            // global.mems.ariaMuteElements = [];
            // global.mems.domHideElements = [];
            monkey.savePreferences(global.ids.memsName, global.mems);
        } else {
            global.mems = JSON.parse(currentMems);
        }
    },
    addClasses: function () {
    report.start(`page.addClasses`);
        if (!global.states.areClassesAdded) {
            global.states.areClassesAdded = true;
            report.step(`classes added`);



            const ddsCss = [
                `https://dds.dell.com/components/2.13.0/css/dds-reboot.min.css`,
                `https://dds.dell.com/components/2.13.0/css/dds-fonts.min.css`,
                `https://dds.dell.com/components/2.13.0/css/dds-icons.min.css`,
                `https://dds.dell.com/components/2.13.0/css/dds-helpers.min.css`,
                `https://dds.dell.com/components/2.13.0/css/dds-main.min.css`
            ];
            ddsCss.forEach(cssUrl => {
                report.step(`adding ${cssUrl}`);
                const link = utils.createElement(`link`, {
                    href: cssUrl,
                    type: `text/css`,
                    rel: `stylesheet`,
                });
                document.getElementsByTagName("head")[0].appendChild(link);
            });

            if (global.prefs.moveComments) {
                monkey.addGlobalStyle(`
                .changehistory td {
                    display: flex;
                    line-height: 0.8rem;
                    font-family: monospace;
                    font-size: 0.8rem;
                }`);
            }

            if (global.prefs.shortLists) {
                monkey.addGlobalStyle(`
                span.issue-link-key {
                    margin-right: 0.625rem;
                }
                .issue-content-container {
                    display: flex;
                    font-size: 0.8rem;
                }`);
            }

            // Make certain sections pop
            monkey.addGlobalStyle(`
            #detail-repro,
            #customfield_10208-val,
            #description-val,
            #customfield_10217-val {
                background: aliceblue;
                border: 0.2rem dotted;
                border-radius: 0.625rem;
            }`);

            // header removed buttons
            monkey.addGlobalStyle(`
            .removedLink {
                display:none !important;
            }`);

            // header favorite buttons
            monkey.addGlobalStyle(`
            .faveLink {
                margin-left: 0.625rem;
                margin-right: 0 !important;
                padding: 0.5rem;
            }`);

            // dashboard days-remaining
            monkey.addGlobalStyle(`
            #gadget-11556 {
                height: inherit !important;
            }
            .sprint-days-remaining-dashboard-item .ghx-remaining-value {
                font-family: fantasy;
                opacity: 0.5;
                top: 1.3rem;
                position: relative;
            }`);

            // fit images to size
            monkey.addGlobalStyle(`
            .activity-comment img {
                max-width: 100%;
            }`);

            // adjustments for DDS classes
            monkey.addGlobalStyle(`
            #structure .celldiv {
                height: inherit;
                max-height: inherit;
            }
            .aui-button-primary {
                font-weight: inherit;
            }
            .dds__button {
                margin-right: 0.625rem;
            }
            h1 {
                font-size: 2rem;
                line-height: 2rem;
            }
            h2 {
                font-size: 1.5rem;
                line-height: 1.5rem;
            }
            h3 {
                font-size: 1rem;
                line-height: 1rem;
            }
            blockquote {
                font-size: 1.05rem;
                line-height: 130%;
            }`);

            // Copy Issue as Markdown styling
            monkey.addGlobalStyle(`
            .copyLink {
                margin-left: 0.625rem;
                cursor: pointer;
            }
            .ghx-column .copyLink {
                position: absolute;
                bottom: 1rem;
                right: 1rem;
            }`);

            if (global.prefs.moveBacklog) {
                // Adjusting Backlog to be alongside TODO list
                monkey.addGlobalStyle(`
                #ghx-content-group {
                    display: flex !important;
                }
                .ghx-backlog-container {
                    margin-top: 0px !important;
                    margin-left: 1rem;
                }
                .ghx-sprint-group, .ghx-backlog-group {
                    width: 50%;
                    max-height: 72vh !important;
                    overflow-y: scroll;
                    border-bottom: 2px dotted dodgerblue;
                }
                .js-sprint-container:not(:first-child) {
                    margin-top: 2rem !important;
                }`);
            }

            if (global.prefs.customCss) {
                monkey.addGlobalStyle(global.prefs.customCss);
            }

        } else {
            report.step(`already added`);
        }
        report.finish();
    },
};
const mods = {
    user: {
        addChat: () => {
            report.start(`user.addChat`);
            if (!global.prefs.addTeamsLinks) {
                report.step(`declined via prefs`);
                report.abort();
                return;
            }
            if (global.states.observingChatAdds) {
                report.step(`already observing`);
                report.abort();
                return;
            }
            global.states.observingChatAdds = true;
            const obdSelector = `.user-hover-details`;
            const obdCallback = () => {
                const chatEl = document.querySelector(`.user-chat-link`);
                const userEl = document.querySelector(`.user-hover-details`);
                const avatarEl = document.querySelector(`#avatar-full-name-link`);
                const summaryEl = document.getElementById(`summary-val`);
                const subnavEl = document.getElementById(`subnav-title`);
                const emailEl = document.getElementById(`user-hover-email`);
                let chatRef = summaryEl ? summaryEl.innerText : subnavEl ? subnavEl.innerText : ``;
                if (chatRef) {
                    chatRef = `[${chatRef}](${window.location.href})`;
                }
                if (!userEl) {
                    // report.abort();
                    return;
                }
                if (!chatEl) {
                    const displayName = utils.user.properName(avatarEl.innerText);
                    const chatLink = utils.createElement(`a`, {
                        href: `#`,
                        class: `user-chat-link`
                    });
                    chatLink.innerText = `Chat with ${displayName}`;
                    chatLink.addEventListener(`click`, () => {
                        utils.user.chat(displayName, chatRef, emailEl.innerText);
                    });
                    userEl.appendChild(chatLink);
                    // report.step(`added chat link`);
                }
            };
            observers.create([{
                single: false,
                selector: obdSelector,
                callback: obdCallback
            }]);

            report.finish();
        },
        avatars: () => {
            report.start(`user.avatars`);
            if (!global.prefs.useAvatars) {
                report.step(`declined via prefs`);
                report.abort();
                return;
            }
            if (global.states.observingAvatars) {
                report.step(`already observing`);
                report.abort();
                return;
            }
            global.states.observingAvatars = true;
            if (!global.states.avatarPingFailed && pingPhoto != null && global.prefs.avatarPreference[0] === `localhost`) {
                report.step(`Using localhost avatars`);
                monkey.ping(avatarHost + pingPhoto + imageExt, function callback(response) {
                    if (response === `responded`) {
                        global.states.avatarPingFailed = false;
                    } else {
                        report.step(`avatar ping failed`, false);
                        global.states.avatarPingFailed = true;
                    }
                    global.mems.avatarPingTimer = moment();
                    monkey.savePreferences(global.ids.memsName, global.mems);
                });
            }

            let thisName = `none`;

            const swapAvatar = (element, avatar) => {
                let inst = element.tagName === `IMG` ? element : avatar.getImgSource(avatar.element);
                thisName = utils.user.properName(avatar.getNameSource(inst));
                thisName && utils.user.updateImg(inst, thisName);

                inst.onerror = () => {
                    const prevSrc = inst.getAttribute(`data-previous`);
                    const noSrc = `http://${avatarHost}!none${imageExt}`
                    inst.src = prevSrc || noSrc;
                }
                inst.src = inst.src;
            };

            const guessName = (el) => {
                if (!el) return null;
                if (el.alt) return el.alt;
                if (el.getAttribute(`alt`)) return el.getAttribute(`alt`);
                if (el.getAttribute(`title`)) return el.getAttribute(`title`);
                if (el.getAttribute(`data-tooltip`)) return el.getAttribute(`data-tooltip`);
                if (el.innerText) return el.innerText;
                if (el.parentElement.innerText) return el.parentElement.innerText;
                if (document.getElementById(`up-user-title-name`)) return document.getElementById(`up-user-title-name`).innerText;
            };

            const observerDefinitions = [{
                single: false,
                meta: `Hover menu avatars (ie those who voted)`,
                selector: `.user-hover img`,
                getImgSource: null,
                getNameSource: guessName,
                callback: swapAvatar,
            },{
                single: false,
                meta: `Releases Page`,
                selector: `.author-avatar-wrapper img`,
                getImgSource: null,
                getNameSource: guessName,
                callback: swapAvatar,
            },{
                single: false,
                meta: `Backlog Avatars`,
                selector: `.ghx-avatar-img`,
                getImgSource: null,
                getNameSource: guessName,
                callback: swapAvatar,
            },{
                single: false,
                meta: `Item small avatars`,
                selector: `.aui-avatar-inner img`,
                getImgSource: null,
                getNameSource: guessName,
                callback: swapAvatar,
            },{
                single: false,
                meta: `Profile Page Edit Avatar`,
                selector: `#avatar-owner-id`,
                getImgSource: (el) => { return document.querySelector(`${el} img`); },
                getNameSource: guessName,
                callback: swapAvatar,
            },{
                single: false,
                meta: `User details page, User Icon in Activity Feed`,
                selector: `span.user-icon img`,
                getImgSource: null,
                getNameSource: guessName,
                callback: swapAvatar,
            },{
                single: false,
                meta: `User Avatar in Tooltip`,
                selector: `.avatar-image`,
                getImgSource: null,
                getNameSource: guessName,
                callback: swapAvatar,
            }];

            observerDefinitions.forEach(obd => {
                document.querySelectorAll(obd.selector).forEach(el => {
                    swapAvatar(el, obd);
                })
            });

            observers.create(observerDefinitions);

            report.finish();
        },
    },
    customize: {
        addFaves: () => {
            report.start(`customize.addFaves`);
            if (!global.prefs.addFavorites || !global.prefs.favorites || global.prefs.favorites.length === 0) {
                report.step(`declined via prefs`);
                report.abort();
                return;
            }
            const header = document.querySelector(`.aui-header-inner`);
            if (header && header.querySelectorAll(`.faveLink`).length > 0) {
                report.step(`already performed`);
                report.abort();
                return;
            }
            global.prefs.favorites.forEach(fave => {
                const fButton = utils.createElement(`button`, {
                    'class': `dds__button dds__button--sm faveLink ${fave.class}`,
                    'aria-label': fave.name,
                    'title': fave.name,
                });
                fButton.innerHTML = fave.icon ? `<i class="dds__icon dds__icon--${fave.icon}"></i>` : fave.name;
                fButton.addEventListener(`click`, (e) => {
                    document.location.href = fave.url;
                });
                if (header) {
                    header.appendChild(fButton);
                }
            })
            report.finish();
        },
        modMainLogo: () => {
            report.start(`customize.modMainLogo`);
            if (!global.prefs.modMainLogo || global.prefs.mainLogo.length === 0) {
                report.step(`declined via prefs`);
                report.abort();
                return;
            }
            const logoEl = document.querySelector(`#logo`);
            const logoImg = document.querySelector(`#logo img`);
            if (logoEl.classList.contains(`modModified`)) {
                report.step(`already performed`);
                report.abort();
                return;
            }
            logoEl.classList.add(`modModified`);
            logoEl.style.marginRight = `0`;
            logoImg.style.width = `32px`;
            logoImg.src = global.prefs.mainLogo;
            report.step(`modified main logo`);
            report.finish();
        },
        modMainMenu: () => {
            report.start(`customize.modMainMenu`);
            if (!global.prefs.modMainMenu || (global.prefs.menuIconSwaps && global.prefs.menuIconSwaps.length < 1)) {
                report.step(`declined via prefs`);
                report.abort();
                return;
            }
            const moddedMenus = document.querySelectorAll(`.aui-header-primary a.aui-dropdown2-trigger .modModified`);
            const menus = document.querySelectorAll(`.aui-header-primary a.aui-dropdown2-trigger:not(.modModified)`);
            if (menus.length === 0 || moddedMenus.length > 0) {
                report.step(`already performed`);
                report.abort();
                return;
            }
            menus.forEach(ahref => {
                ahref.classList.add(`modModified`);
                global.prefs.menuIconSwaps.forEach(iconSwap => {
                    if (ahref.innerText.trim().toLowerCase() === iconSwap.text.toLowerCase()) {
                        const newIcon = utils.createElement(`i`, {
                            class: `dds__icon dds__icon--${iconSwap.icon}`,
                            title: ahref.innerText,
                        });
                        ahref.innerText = ``;
                        ahref.appendChild(newIcon);
                        report.step(`added icon for ${iconSwap.text}`)
                    }
                });
            })
            report.finish();
        },
        modSideview: () => {
            const iAm = `customize.modSideview`;
            const sideEl = document.getElementById(`js-detail-nav-content`);
            const sideReproId = `detail-repro`;
            const sideReproEl = document.getElementById(sideReproId);
            const issueKeyEl = document.getElementById(`issuekey-val`);
            // report.start(iAm);
            if (!global.prefs.modSideview) {
                // report.step(`declined via prefs`);
                // report.abort();
                return;
            }
            if (!global.prefs.jiraApiKey) {
                // report.step(`no API key saved`, false);
                // report.abort();
                return;
            }
            if (!sideEl || !issueKeyEl) {
                // report.step(`no Sideview to modify`);
                // report.abort();
                return;
            }
            if (sideReproEl) {
                // report.step(`Repro Steps already added to sideview`);
                // report.abort();
                return;
            }
            const issueKey = issueKeyEl.innerText.trim();
            const urlPath = `https://jira.dell.com/rest/api/2/issue/${issueKey}`;
            const params = {
                "fields": {
                    "summary": "Get Request from rest API",
                    "project": {
                        "id": "DDSTM"
                    }
                }
            };
            utils.xhrAction(iAm, global.prefs.jiraApiKey, `GET`, urlPath, params, (e) => {
                const resp = JSON.parse(e);
                const reproSteps = resp.fields.customfield_10217;
                if (!reproSteps) {
                    // report.step(something)
                    return;
                }
                const reproHeader = utils.createElement(`h4`, {
                    class: `toggle-title`
                });
                reproHeader.innerText = `Repro Steps`;
                const reproEl = utils.createElement(`div`, {
                    id: sideReproId
                });
                reproEl.innerText = reproSteps;
                sideEl.prepend(reproEl);
                sideEl.prepend(reproHeader);
            })
            // report.finish();
        },
        moveComments: () => {
            report.start(`customize.moveComments`);
            if (!global.prefs.moveComments) {
                report.step(`declined via prefs`);
                report.abort();
                return;
            }

            const activityId = `activitymodule`;
            const addCommentId = `addcomment`;
            const sidebarId = `viewissuesidebar`;
            const peopleModuleId = `peoplemodule`;

            const addComment = document.querySelector(`#${addCommentId}`);
            const activity = document.querySelector(`#${activityId}`);
            const sidebar = document.querySelector(`#${sidebarId}`);
            const peopleModule = document.querySelector(`#${peopleModuleId}`);

            if (sidebar && !sidebar.querySelector(`#${addCommentId}`)) {
                sidebar.prepend(addComment);
                sidebar.prepend(activity);
                sidebar.prepend(peopleModule);
                report.step(`comments/activity moved`);
            } else if (sidebar && sidebar.querySelector(`#${addCommentId}`)) {
                report.step(`already successful`);
            } else if (!sidebar) {
                report.step(`nothing to rearrange`);
            }
            report.finish();
        },
        removeLinks: () => {
            report.start(`customize.removeLinks`);
            if (!global.prefs.removeLinks || !global.prefs.removals || global.prefs.removals.length === 0) {
                report.step(`declined via prefs`);
                report.abort();
                return;
            }
            const header = document.querySelector(`.aui-header-inner`);
            if (header && header.querySelectorAll(`.removedLink`).length > 0) {
                report.step(`already performed`);
                report.abort();
                return;
            }
            global.prefs.removals.forEach(fave => {
                const removalEl = utils.getElementByTextContent(fave, `a`);
                if (removalEl) {
                    removalEl.classList.add(`removedLink`);
                    report.step(`removed ${fave}`);
                }
            })
            report.finish();
        },
        shortLists: () => {
            report.start(`customize.shortLists`);
            if (!global.prefs.shortLists) {
                report.step(`declined via prefs`);
                report.abort();
                return;
            }
            const listEls = document.querySelectorAll(`span.issue-link-key`);
            if (listEls.length > 0) {
                report.step(`adjusting list display`);
                listEls.forEach(il => {
                    il.innerText = il.innerText.replace(`${global.ids.projectCode}-`, ``);
                });
            } else {
                report.step(`no lists to modify`);
            }
            report.finish();
        },
        useDDSClasses: () => {
            report.start(`customize.useDDSClasses`);
            if (global.prefs.useDDSClasses) {
                report.step(`applying classes for buttons`);
                document.querySelectorAll(`button:not(.dds__button)`).forEach(b => {
                    b.classList.add(`dds__button`);
                    b.style.color = `white`;
                });
            } else {
                report.step(`declined via prefs`);
            }
            report.finish();
        },
        collapseBotPosts: () => {
            report.start(`customize.collapseBotPosts`);
            if (!global.prefs.collapseBotPosts) {
                report.step(`declined via prefs`);
                report.abort();
                return;
            }
            const posts = document.querySelectorAll(`.activity-comment.expanded`);
            report.step(`Found ${posts.length} posts`);
            let moddedCount = 0;
            posts.forEach(p => {
                if (!p.classList.contains(`autoCollapsed`) && p.innerText.indexOf(`svc_prddeveloperexp`) > -1) {
                    try {
                        p.querySelector(`button`).click();
                        report.step(`collapsing botPost`);
                        p.classList.add(`autoCollapsed`);
                        moddedCount++;
                    } catch(e) {
                        report.step(`Couldn't collapse. ${e}`);
                    }
                }
        })
            report.step(`Modded ${moddedCount} posts`);
            report.finish();
        },
    },
    autofill: {
        defect: () => {
            report.start(`autofill.defect`);
            let fields = [];
            if (!global.prefs.autofills || global.prefs.autofills.length === 0) {
                report.step(`declined via prefs`);
                report.abort();
                return;
            }
            global.prefs.autofills.forEach(afill => {
                if (document.querySelector(afill.identifier)) {
                    fields = [
                        ...fields,
                        ...afill.fields,
                    ]
                } else {
                    report.step(`${afill.identifier} not open at this time`);
                }
            });
            if (fields.length > 0) {
                fields.forEach(field => {
                    const fieldEl = document.getElementById(field.id);
                    if (fieldEl && (fieldEl.value.length === 0 || fieldEl.value === `-1`)) {
                        fieldEl.value = field.value;
                    } else {
                        report.step(`already done for ${field.id}`);
                    }
                });
            }
            report.finish();
        },
        searchbar: () => {
            report.start(`autofill.searchbar`);
            if (!global.prefs.fillSearchProject) {
                report.step(`declined via prefs`);
                report.abort();
                return;
            }
            const projectEl = document.querySelector(`div[data-id="project"]`);
            const projectSelectionEl = document.querySelector(`#fieldpid`);
            if (!projectSelectionEl && projectEl) {
                report.step(`populating project selection`);
                projectEl.click();
                setTimeout(() => {
                    document.querySelector(`label[title="${global.ids.projectNameValue}"]`).click();
                    projectEl.click();
                });
            } else {
                report.step(`no need`);
            }
            report.finish();
        },
    },
    append: {
        copyLink: () => {
            report.start(`append.copyLink`);
            if (!global.prefs.addCopyLinks) {
                report.step(`declined via prefs`);
                report.abort();
                return;
            }
            const linkSelectors = [`.aui-nav-breadcrumbs .issue-link`, `.issuerow .summary .issue-link`, `a.js-key-link`, `a[title="View this issue"]`];
            const links = [];
            linkSelectors.forEach(linkSelector => {
                const linkElement = document.querySelectorAll(linkSelector);
                links.push(linkElement);
            });
            const appendLink = (ilink) => {
                if (ilink.parentElement.querySelectorAll(`.copyLink`).length > 0) {
                    report.step(`Already added for ${ilink.classList}`);
                    return;
                }
                const cicon = utils.createElement(`i`, {
                    class: `dds__icon dds__icon--copy-alt`
                });
                const clink = utils.createElement(`span`, {
                    class: `copyLink`,
                    title: `Copy link as Markdown. Double-click to copy for Gitlab link`,
                });
                clink.appendChild(cicon);
                clink.addEventListener(`click`, (e) => {
                    const summaryEl = document.getElementById(`summary-val`);
                    const sidebarEl = e.target.closest(`#ghx-detail-contents`);
                    const cardEl = e.target.closest(`.js-issue`);
                    const inSidebar = sidebarEl != null;
                    const inDraggable = cardEl != null;
                    const onDetailPage = window.location.href.indexOf(`browse`) > -1;
                    let linkText;
                    if (ilink.getAttribute(`title`)) {
                        linkText = ilink.getAttribute(`title`); // parent issue (ie we're looking at a Task of a Story)
                    } else if (summaryEl && (onDetailPage || inSidebar)) {
                        linkText = summaryEl.innerText;
                    } else if (inDraggable) {
                        linkText = cardEl.querySelector(`.ghx-summary`).innerText;
                    } else {
                        linkText = ilink.innerText;
                    }
                    const textToCopy = `[${linkText}](${ilink.href})`;
                    monkey.copyTextToClipboard(textToCopy);
                });
                clink.addEventListener(`dblclick`, () => {
                    let linkText = `JIRA#${ilink.innerText};`;
                    const linkTextSpaceIndex = linkText.indexOf(` `);
                    if(linkTextSpaceIndex > -1) {
                        linkText = linkText.substring(0, linkTextSpaceIndex) + `;`;
                    }
                    const textToCopy = `[${linkText}](${ilink.href})`;
                    monkey.copyTextToClipboard(textToCopy);
                });
                ilink.parentElement.appendChild(clink);
                report.step(`added copyLink for ${ilink}`);
            };
            links.forEach(nodeList => {
                nodeList.forEach(ilink => appendLink(ilink));
            });
            if (links.length === 0) {
                report.step(`no link modification needed`);
            }
            report.finish();
        },
        swimButtons: () => {
            report.start(`append.swimButtons`);
            if (!global.prefs.addCollapseButtons) {
                report.step(`declined via prefs`);
                report.abort();
                return;
            }
            document.querySelectorAll(`.monkeyButton`).forEach(mb => {
                mb.classList.remove(`dds__d-none`);
            });
            if (window.location.href.indexOf(`chart=`) > 0) {
                document.querySelectorAll(`.monkeyButton`).forEach(mb => {
                    mb.classList.add(`dds__d-none`);
                });
                report.step(`not needed on chart page`);
                report.abort();
                return;
            }
            if (document.querySelector(`.collapseAllLanes`)) {
                report.step(`swimlane controls already created`);
                report.abort();
                return;
            }

            // ADD COLLAPSE BUTTON
            const filterControlEl = document.querySelector(`#ghx-operations`);
            if (!filterControlEl) {
                report.step(`nothing to attach controls`);
                report.abort();
                return
            }
            const btnCollapseLanes = utils.createElement(`button`, {
                class: `dds__button dds__button--sm monkeyButton collapseAllLanes`,
            });
            btnCollapseLanes.innerText = `Collapse`;
            const handleCollapse = () => {
                document.querySelectorAll(`.ghx-swimlane:not(.ghx-closed)`).forEach(lane => {
                    lane.querySelector(`.ghx-heading-expander`).click();
                });
                document.querySelectorAll(`.ghx-expander:not([aria-expanded="false"]`).forEach(sprint => {
                    sprint.click();
                });
            };
            btnCollapseLanes.addEventListener(`click`, handleCollapse);
            filterControlEl.prepend(btnCollapseLanes);

            // ADD EXPAND BUTTON
            const btnExpandLanes = utils.createElement(`button`, {
                class: `dds__button dds__button--sm monkeyButton expandAllLanes`,
            });
            btnExpandLanes.innerText = `Expand`;
            const handleExpand = () => {
                document.querySelectorAll(`.ghx-closed`).forEach(lane => {
                    lane.querySelector(`.ghx-heading-expander`).click();
                });
                document.querySelectorAll(`.ghx-expander:not([aria-expanded="true"]`).forEach(sprint => {
                    sprint.click();
                });
            };
            btnExpandLanes.addEventListener(`click`, handleExpand);
            filterControlEl.prepend(btnExpandLanes);

            report.finish();
        },
        voteButtons: () => {
            report.start(`append.voteButtons`);
            if (!global.prefs.addVoteButtons) {
                report.step(`declined via prefs`);
                report.abort();
                return;
            }
            const issueRows = document.querySelectorAll(`.issuerow`);
            if (issueRows.length === 0) {
                report.step(`no rows to add vote buttons to`);
                report.abort();
                return;
            }
            issueRows.forEach(row => {
                const rowActionCell = row.querySelector(`.qrf-issue-actions`);
                const issueId = row.getAttribute(`data-issue-key`);
                if (rowActionCell && !rowActionCell.querySelector(`.addVoteBtn`)) {
                    const btnIcon = utils.createElement(`i`, {
                        class: `dds__icon dds__icon--add-cir`,
                        title: `Add your vote for this issue`,
                    });
                    const btn = utils.createElement(`button`, {
                        class: `dds__button dds__button--mini addVoteBtn`,
                    });
                    btn.appendChild(btnIcon);
                    btn.addEventListener(`click`, (e) => {
                        const dotMenu = e.target.parentElement.querySelector(`.qrf-issue-actions-trigger`);
                        dotMenu.click();
                        monkey.getContainer({
                            'el': `[data-issuekey="${issueId}"]`,
                            'max': 100,
                            'spd': 1000
                        }).then(function () {
                            const addVoteOption = utils.getElementByTextContent(`Add vote`, `a`);
                            addVoteOption.click();
                        });
                    });
                    rowActionCell.appendChild(btn);
                } else {
                    report.step(`already added vote buttons`);
                }
            });
            report.finish();
        },
    }
};

(function () { // Global Functions
    document.onmousemove = function () {
        if (!global.states.isMouseMoved) {
            global.states.isMouseMoved = true;
            setTimeout(function () {
                global.states.isMouseMoved = false;
            }, global.constants.TIMEOUT * 2);
            utils.initScript();
        }
    };
})(); // Global Functions
})();

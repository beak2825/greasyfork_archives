// ==UserScript==
// @name        wkcm2
// @description Community Mnemonics for WaniKani. Submit your own mnemonics and view other submissions.
// @namespace   wkcm2
// @match       https://*.wanikani.com/subject-lessons/*
// @match       https://*.wanikani.com/subjects/review
// @match       https://*.wanikani.com/level/*
// @match       https://*.wanikani.com/kanji*
// @match       https://*.wanikani.com/vocabulary*
// @match       https://*.wanikani.com/radicals*
// @require     https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1416982
// @homepage    https://github.com/Dakes/WaniKaniCommunityMnemonics2/
// @version     0.4.2
// @author      Daniel Ostertag (Dakes)
// @license     GPL-3.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/437197/wkcm2.user.js
// @updateURL https://update.greasyfork.org/scripts/437197/wkcm2.meta.js
// ==/UserScript==


/*
Copyright (C) 2022  Dakes (Daniel Ostertag) https://github.com/Dakes

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

/* globals React, ReactDOM */
var rollupUserScript = (function (exports) {
    'use strict';

    /**
     * Global constant values
     */
    const WKCM2_VERSION = "0.4.2";
    const SCRIPT_NAME = 'WKCM2';
    // Google sheet: https://docs.google.com/spreadsheets/d/13oZkp8eS059nxsYc6fOJNC3PjXVnFvUC8ntRt8fdoCs/edit?usp=sharing
    // google sheets apps script url, for sheet access
    const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbzvZIOvmZa8K3A4sqRRWjhsWo88HgmolOZQDypZqucUIFgjxjC_NInDKXa7lEjeqJ0k8w/exec";
    // Maximum number, how many mnemonics one user can submit for one item.
    const MNEM_MAX_COUNT = 5;
    // If date of cached item is older than this number of days, re-fetch.
    // NOTE: If too many people use WKCM2, it might be necessary to turn this up, so the API doesn't get spammed with requests.
    const CACHE_DAY_MAX_AGE = 7;
    // Only execute getall, if last getall is older than this number of days.
    const GET_ALL_CACHE_MAX_AGE = 30;
    const CACHE_FILL_IDENTIFIER = "wkcm2-fillCache";
    // getData refetch timeout. How long to wait with new execution of updateCM after previous getData fetch.
    // Especially, if the apps script is overloaded it can take a while (~5s). So it has to be enough time,
    // to allow for the data to arrive and prevent spamming of the apps script.
    const REFETCH_TIMEOUT = 10000; // in ms
    let isList = false;
    let isItem = false;
    // @ts-ignore;  A wrapper for the window, because unsafeWindow doesn't work in Firefox
    // @ts-ignore;  and window does not have access to wkof in some browsers?? (How even? idk, it worked before)
    let win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
    function setPageVars() {
        isList = (
        // true if on a level page
        /level\/[0-9]{1,3}/gi.test(window.location.pathname.slice(window.location.pathname.indexOf("com/") + 2)) ||
            // true if on a /kanji?difficulty=pleasant site
            /(kanji|vocabulary|radicals)\?(difficulty=[A-Za-z].*)/gi
                .test(window.location.pathname.slice(window.location.pathname.indexOf("com/") + 2) + window.location.search));
        isItem = /(kanji|vocabulary|radicals)\/.*/gi
            .test(window.location.pathname.slice(window.location.pathname.indexOf("com/") + 2));
    }
    setPageVars();

    /**
     * Functions to get information about the currently loaded page/item
     */
    /**
     * @returns The current item. (説得, stick, etc.)
     */
    function getItem() {
        let item = null;
        item = win.wkItemInfo.currentState.characters;
        if (item == undefined)
            item = win.wkItemInfo.currentState.meaning[0].toLowerCase();
        if (item == null) {
            let msg = "Error: getItem, item is null. ";
            console.log("WKCM2: " + msg);
            // TODO: maybe add flag, that marks the iframe for this item "unupdatable", after an error display
            updateIframe(null, msg, null);
        }
        return item;
    }
    /**
     * Returns radical, kanji or vocabulary
     * */
    function getItemType() {
        let itemType;
        if (isList)
            itemType = window.location.pathname.slice(1);
        else
            itemType = win.wkItemInfo.currentState.type;
        if (itemType == null) {
            console.error("WKCM2: getItemType, itemType null");
            return null;
        }
        if (itemType.toLowerCase().includes("vocabulary"))
            itemType = "vocabulary";
        if (itemType === "radicals")
            itemType = "radical";
        return itemType;
    }
    /**
     * When URL changes calls right init function
     * // callback with delay of "delay" ms
     * @param delay delay after URL change, to call functions.
     * @param callback Optional callback, extra function to execute.
     */
    function detectUrlChange(delay = 250, callback = function () {
    }) {
        const observer = new MutationObserver((mutations) => {
            if (window.location.href !== observerUrl.previousUrl) {
                setPageVars();
                observerUrl.previousUrl = window.location.href;
                setTimeout(function () {
                    if (isList)
                        initList();
                    else if (isItem) {
                        infoInjectorInit("meaning");
                        if (getItemType() != "radical")
                            infoInjectorInit("reading");
                    }
                    callback();
                }, delay);
            }
        });
        const config = { subtree: true, childList: true };
        // start listening to changes
        observer.observe(document, config);
    }
    var observerUrl;
    (function (observerUrl) {
        observerUrl.previousUrl = "";
    })(observerUrl || (observerUrl = {}));
    /**
     * Reexecutes callback function every "timeout" ms until classname exists.
     * @param selector selector to get element by id or classname
     * @param callback Callback function, that would create element found by selector
     * @param interval
     */
    function waitForClass(selector, callback, interval = 250, firstTimeout = 0) {
        if (timer.iter[selector] == undefined)
            timer.iter[selector] = 0;
        // other timer is still running
        if (timer.timer[selector])
            return;
        let callbackWrapper = async function () {
            let timeout = 0;
            let ele = document.querySelector(selector);
            timer.iter[selector]++;
            if (timer.iter[selector] <= 1)
                timeout = firstTimeout;
            if (ele || timer.iter[selector] >= timer.maxIter) {
                timer.iter[selector] = 0;
                timer.timer[selector] = clearInterval(timer.timer[selector]);
                return;
            }
            else
                setTimeout(async () => {
                    await callback();
                }, timeout);
        };
        timer.timer[selector] = setInterval(callbackWrapper, interval);
    }
    var timer;
    (function (timer_1) {
        // Array of timers with selector as key
        timer_1.timer = {};
        timer_1.iter = {};
        timer_1.maxIter = 25;
    })(timer || (timer = {}));

    /**
     * Miscellaneous utility function used by various functions.
     */
    /**
     * converts kanji -> k etc.
     * */
    function getShortItemType(type) {
        return getItemTypeLen(type, 1);
    }
    function getItemTypeLen(type, len = 99) {
        if (type === "kanji" || type === "k" || type === "kan") // @ts-ignore
            return "kanji".substring(0, len);
        else if (type === "vocabulary" || type === "v" || type === "voc") // @ts-ignore
            return "vocabulary".substring(0, len);
        else if (type === "radical" || type === "r" || type === "rad") // @ts-ignore
            return "radical".substring(0, len);
        else
            throw new Error("WKCM2: getShortItemType got wrong ItemType: " + type);
    }
    /**
     * converts meaning -> m, reading -> r
     * */
    function getShortMnemType(type) {
        if (type === "reading" || type === "r")
            return "r";
        else if (type === "meaning" || type === "m")
            return "m";
        else
            throw new Error("WKCM2: getShortMnemType got wrong ItemType: " + type);
    }
    function addClass(id, className = "disabled") {
        let ele = document.getElementById(id);
        if (ele == null)
            return false;
        ele.classList.add(className);
        return true;
    }
    function removeClass(id, className = "disabled") {
        let ele = document.getElementById(id);
        if (!ele)
            return false;
        ele.classList.remove(className);
        return true;
    }
    const memoize = (fn) => {
        const cache = new Map();
        const cached = function (val) {
            return cache.has(val)
                ? cache.get(val)
                : cache.set(val, fn.call(this, val)) && cache.get(val);
        };
        cached.cache = cache;
        return cached;
    };
    /**
     * Adds a Event Listener for a click event to the element with id id.
     * */
    function addClickEvent(id, func, params) {
        let div = document.getElementById(id);
        if (div)
            div.addEventListener("click", function () {
                func(...params);
            }, false);
    }
    /**
     * Adds the given HTML to an element searched by the querySelector search query. Checks, if the element exists.
     * @param eleOrSel Selector of element to add code to, or element directly.
     * @param html HTML to add
     * @param position InsertPosition. default: beforeend (Inside at end)
     */
    function addHTMLinEle(eleOrSel, html, position = "beforeend") {
        let element;
        if (typeof eleOrSel == "string") {
            if (eleOrSel[0] != "." && eleOrSel[0] != "#" && eleOrSel[1] != "#")
                eleOrSel = "#" + eleOrSel;
            element = document.querySelector(eleOrSel);
        }
        else {
            element = eleOrSel;
        }
        if (element)
            element.insertAdjacentHTML(position, html);
    }
    function waitForEle(id) {
        return new Promise(resolve => {
            if (document.getElementById(id))
                return resolve(document.getElementById(id));
            const observer = new MutationObserver(mutations => {
                if (document.getElementById(id)) {
                    resolve(document.getElementById(id));
                    observer.disconnect();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    /**
     * Handle the API response after inserting or modifying data
     * @param response
     * @param callback optional callback function to execute on success. Default: dataUpdateAfterInsert
     */
    function handleApiPutResponse(response, callback = dataUpdateAfterInsert) {
        if (response.status < 300) // < 200 Informational Response
         {
            callback();
            // do something to celebrate the successfull insertion of the request
        }
        else if (response.status >= 300) // includes error not ==
         {
            console.log("WKCM2: API access error: ", response.text());
            // do something to handle the failure
        }
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function insertStyle(css) {
      if (!css || typeof window === 'undefined') {
        return;
      }
      const style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.innerHTML = css;
      document.head.appendChild(style);
      return css;
    }

    var iframe = insertStyle(".cm-radical {\n  background-color: #0af;\n  background-image: linear-gradient(to bottom, #0af, #0093dd);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=\"#FF00AAFF\", endColorstr=\"#FF0093DD\", GradientType=0);\n}\n\n.cm-kanji {\n  background-color: #f0a;\n  background-image: linear-gradient(to bottom, #f0a, #dd0093);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=\"#FFFF00AA\", endColorstr=\"#FFDD0093\", GradientType=0);\n}\n\n.cm-vocabulary {\n  background-color: #a0f;\n  background-image: linear-gradient(to bottom, #a0f, #9300dd);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=\"#FFAA00FF\", endColorstr=\"#FF9300DD\", GradientType=0);\n}\n\n.cm-reading {\n  background-color: #555;\n  background-image: linear-gradient(to bottom, #555, #333);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=\"#FF555555\", endColorstr=\"#FF333333\", GradientType=0);\n  box-shadow: 0 -2px 0 rgba(0, 0, 0, 0.8) inset;\n}\n\n.cm-request {\n  background-color: #e1aa00;\n  color: black !important;\n  background-image: linear-gradient(to bottom, #e1aa00, #e76000);\n  background-repeat: repeat-x;\n}\n\n.cm-kanji, .cm-radical, .cm-reading, .cm-vocabulary, .cm-request {\n  padding: 1px 4px;\n  color: #fff;\n  font-weight: normal;\n  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);\n  white-space: nowrap;\n  border-radius: 3px;\n  box-shadow: 0 -2px 0 rgba(0, 0, 0, 0.2) inset;\n}\n\nbody {\n  font-size: 100% !important;\n  font-weight: 300 !important;\n  line-height: 1.5 !important;\n  /*Item Page has different background color. Item: #eee. Other: #fff*/\n  /*background-color: ${(isItem ? '#eee' : '#fff')} !important;*/\n  background-color: #fff !important;\n  font-family: \"Ubuntu\", Helvetica, Arial, sans-serif;\n}\n\n/* The scrollbar is ugly af. At least on Chrom*. Hide scrollbar in iframe, but it is still scrolable, if mnem is long.\n   TODO: display scrollbar again, only when mnem is long. (Maybe determine by line count. )\n */\n::-webkit-scrollbar {\n  display: none;\n}\n\n* {\n  -ms-overflow-style: none !important;\n  scrollbar-width: none !important;\n}\n\n/*\n.highlight-kanji.highlight-kanji { ${kanHighlight } }\n.highlight-vocabulary.highlight-vocabulary { ${vocHighlight} }\n.highlight-radical.highlight-radical { ${radHighlight} }\n.highlight-reading.highlight-reading { ${readHighlight} }\n*/");

    // Makes iframe (Mnemonics) pretty. background, hide scrollbar and most importantly highlighting, copied from list page
    function iframeCSS() {
        return `<style>${iframe}</style>`;
    }
    /**
     * Creates emty Iframe for CM user content later on
     * @param mnemType m, r or meaning, reading
     * */
    function getInitialIframe(mnemType) {
        let iframeId = "cm-iframe-" + mnemType;
        let iframeClass = "cm-mnem-text";
        let initialSrcdoc = getIframeSrcdoc("Loading Community Mnemonic ...");
        return `<iframe sandbox referrerpolicy='no-referrer' scrolling='auto' frameBorder='0' class='${iframeClass}' id='${iframeId}' srcdoc="${initialSrcdoc}"></iframe>`;
    }
    /**
     * wraps iframe update, to not update content, if it is the same as the currently displayed.
     * This reduces these annoying flashes, where the whole iframe content disappears for a moment.
     * @param text NOT the whole content, just the message, that will be visible.
     * */
    function updateIframe(mnemType, text, user = null) {
        if (mnemType == null) {
            updateIframe("meaning", text, user);
            updateIframe("reading", text, user);
            return;
        }
        let iframe = document.getElementById(`cm-iframe-${mnemType}`);
        if (iframe == null)
            return;
        let newIframeHtml = getIframeSrcdoc(text, user);
        let newIframeContent = /<body.*?>([\s\S]*)<\/body>/.exec(newIframeHtml)[1];
        let oldIframeContent = /<body.*?>([\s\S]*)<\/body>/.exec(iframe.srcdoc)[1];
        if (newIframeContent == oldIframeContent)
            return;
        iframe.srcdoc = newIframeHtml;
    }
    /**
     * Generates the content of the iframe, that will be set as it's srcdoc property.
     * Needs the WaniKani CSS an the actual body content.
     * */
    function getIframeSrcdoc(text, user = null) {
        if (typeof text != "string") {
            console.log("WKCM2 Error: getIframeSrcdoc, did not get text, but: ", typeof text, text);
            text = "";
        }
        let cssLinks = getWKcss();
        let cssString = "";
        for (const l of cssLinks)
            cssString = cssString + l.outerHTML;
        // override style to fix some oddities
        cssString = cssString + iframeCSS();
        cssString = cssString.replaceAll('"', "'");
        // just to be sure replace those signs here again. But those shouldn't be in the sheet to begin with.
        text = text.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
        text = Escaping.replaceMarkup(text);
        // text = escape(text);
        let userMsg = "";
        // user can be null, if it is a system message
        if (user != null && typeof user === "string" && user != "") {
            user = user.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
                .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
            userMsg = "by " + Escaping.getUserProfileLink(user);
        }
        if (user == "!")
            userMsg = "This is a request. It should have been deleted after submission of a mnemonic. If you are seeing this, please post in the forum, open an issue on GitHub, or just downvote it. ";
        let srcdoc = `<html><head>${cssString}</head><body><div class='col2'>${text}</div><div id='user-link'>${userMsg}</div></body></html>`;
        return srcdoc;
    }
    // getIframeSrcdoc ▲
    // getIframeSrcdoc helpers ▼
    /**
     * gets all stylesheets in link tags WaniKani uses, for use in iframes.
     * Memoizes result.
     * */
    function getWKcssUncached() {
        let css = [];
        let allLinks = Array.from(document.querySelectorAll("head link"));
        for (const link of allLinks) {
            // @ts-ignore
            if (link?.rel !== "stylesheet")
                continue;
            css.push(link);
        }
        return css;
    }
    const getWKcss = memoize(getWKcssUncached);

    /**
     * Functions to generate Messages, that are displayed.
     * And to process text, like escape deascape, etc.
     */
    // updateCMelements helpers ▼
    function getNoMnemMsg() {
        let msg = `No Community Mnemonic for this item exists yet. [br]Be the first to submit one.`;
        return msg;
    }
    function getRadicalReadingMessage() {
        let msg = `Radicals have no reading. `;
        return msg;
    }
    function getMnemRequestedMsg(users) {
        // TODO: make request color darker red, the more users requested
        let len = users.length;
        let msg = `A Mnemonic was [request]requested[/request] for this item. [br][request]Help the community by being the first to submit one![/request]`;
        if (len === 1)
            msg = `A Mnemonic was [request]requested[/request] by the user [request]${users[0]}[/request]. [br]Help them by being the first to submit one! `;
        else if (len > 1)
            msg = `A Mnemonic was [request]requested[/request] by the users [request]${users.slice(0, -1).join(', ') + ' and ' + users.slice(-1)}[/request]. [br]Help them by being the first to submit one! `;
        return msg;
    }
    /**
     * Replaces HTML encoded characters with their real counterpart.
     * Only used before editing, so that the user does not see the confusing HTML entities.
     * So this only lands in the textbox, not in the HTML, or iframe. It is used for comparisons as well.
     * */
    function decodeHTMLEntities(text) {
        if (text === "" || text == null)
            return "";
        if (!text || typeof text != "string") {
            return;
        }
        let entities = [
            ['amp', '&'], ['#x26', '&'], ['#38', '&'],
            ['apos', '\''], ['#x27', '\''], ['#39', '\''],
            ['#x2F', '/'], ['#47', '/'],
            ['lt', '<'], ['#60', '<'], ['#x3C', '<'],
            ['gt', '>'], ['#62', '>'], ['#x3E', '>'],
            ['nbsp', ' '],
            ['quot', '"'], ['#34', '"'], ['#x22', '"'],
            ['#39', "'"], ['#x27', "'"],
            ['#92', '\\'], ['#x5C', '\\'],
            ['#96', '`'], ['#x60', '`'],
            ['#35', '#'], ['#x23', '#'],
            ['#37', '%'], ['#x25', '%']
        ];
        for (let i = 0, max = entities.length; i < max; ++i)
            text = text.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);
        return text;
    }

    /**
     * Functions related to the initialization and usage of WKOF
     * https://community.wanikani.com/t/wanikani-open-framework-developer-thread/22231
     */
    // @ts-ignore
    const { wkof } = win;
    function checkWKOF_old() {
        var wkof_version_needed = '1.0.58';
        if (wkof && wkof.version.compare_to(wkof_version_needed) === 'older') {
            if (confirm(SCRIPT_NAME + ' requires Wanikani Open Framework version ' + wkof_version_needed + '.\nDo you want to be forwarded to the update page?'))
                window.location.href = 'https://greasyfork.org/en/scripts/38582-wanikani-open-framework';
            return false;
        }
        else if (!wkof) {
            if (confirm(SCRIPT_NAME + ' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?'))
                window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
            return false;
        }
        else
            return true;
    }
    async function waitForWKOF() {
        // https://codepen.io/eanbowman/pen/jxqKjJ
        let timeout = 2000;
        let start = Date.now();
        return new Promise(waitForFoo); // set the promise object within the ensureFooIsSet object
        // waitForFoo makes the decision whether the condition is met
        // or not met or the timeout has been exceeded which means
        // this promise will be rejected
        function waitForFoo(resolve, reject) {
            if (wkof)
                return resolve(true);
            else if ((Date.now() - start) >= timeout)
                return reject(false);
            else
                setTimeout(waitForFoo.bind(this, resolve, reject), 50);
        }
    }
    /**
     * checks, if script version saved is the same. If it is not, deletes cache.
     * */
    function resetWKOFcache(versionCheck = true) {
        if (versionCheck === false) {
            wkof.file_cache.delete(/^wkcm2-/);
            wkof.file_cache.save("wkcm2-version", WKCM2_VERSION);
            return;
        }
        wkof.file_cache.load("wkcm2-version").then(value => {
            // found
            if (WKCM2_VERSION != value) {
                // regex delete of all wkcm2 saves
                wkof.file_cache.delete(/^wkcm2-/);
                wkof.file_cache.save("wkcm2-version", WKCM2_VERSION);
            }
            return value;
        }, reason => {
            // version not saved, save current version
            wkof.file_cache.save("wkcm2-version", WKCM2_VERSION);
        });
    }

    let WKUser = null;
    let userApiKey = null;
    function setUsername() {
        try {
            if (wkof) {
                try {
                    WKUser = wkof.Apiv2.user;
                    if (WKUser !== undefined)
                        return WKUser;
                }
                catch (err) {
                    console.log("WKCM2: setUsername, ", err);
                    WKUser = wkof.user["username"];
                    return WKUser;
                }
            }
        }
        catch (err) {
            console.log("WKCM2: setUsername, wkof.user  ", err);
        }
        // backup method
        const userClass = "user-summary__username";
        // not working in Lesson & Review
        try {
            WKUser = document.getElementsByClassName(userClass)[0].innerHTML;
        }
        catch (err) {
            throw new Error("WKCM2 Warning: CMUser not set. \n" + err);
        }
        if (WKUser == null || typeof WKUser != "string" || WKUser == "")
            throw new Error("WKCM2 Error: WKUser not set: " + WKUser);
        return WKUser;
    }
    function setApiKey() {
        try {
            userApiKey = wkof.Apiv2.key;
        }
        catch (err) {
            throw new Error("WKCM2 Error: API key not set.");
        }
        return userApiKey;
    }

    /**
     * Create the textbox and all of its buttons for writing mnemonics
     * */
    const pencilSVG = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.3785 8.44975L11.4637 15.3647C11.1845 15.6439 10.8289 15.8342 10.4417 15.9117L7.49994 16.5L8.08829 13.5582C8.16572 13.1711 8.35603 12.8155 8.63522 12.5363L15.5501 5.62132M18.3785 8.44975L19.7927 7.03553C20.1832 6.64501 20.1832 6.01184 19.7927 5.62132L18.3785 4.20711C17.988 3.81658 17.3548 3.81658 16.9643 4.20711L15.5501 5.62132M18.3785 8.44975L15.5501 5.62132" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M5 20H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
`;
    function getCMForm(mnemType) {
        return /*HTML*/ `
<form id="cm-${mnemType}-form" class="cm-form cm-mnem-text" onsubmit="return false">
<div id="cm-${mnemType}-format" class="cm-format">
<div id="cm-format-${mnemType}-bold"      class="cm-btn cm-format-btn cm-format-bold"      title="bold"><b>b</b></div>
<div id="cm-format-${mnemType}-italic"    class="cm-btn cm-format-btn cm-format-italic"    title="italic"><i>i</i></div>
<div id="cm-format-${mnemType}-underline" class="cm-btn cm-format-btn cm-format-underline" title="underline"><u>u</u></div>
<div id="cm-format-${mnemType}-strike"    class="cm-btn cm-format-btn cm-format-strike"    title="strikethrough"><s>s</s></div>
<div id="cm-format-${mnemType}-newline"   class="cm-btn cm-format-btn cm-format-newline"   title="newline"><div>&#92;n</div></div>
<div id="cm-format-${mnemType}-qmark"     class="cm-btn cm-format-btn cm-format-qmark"     title="Question Mark"><div>?</div></div>
<div id="cm-format-${mnemType}-reading"   class="cm-btn cm-format-btn cm-reading"          title="reading">読</div>
<div id="cm-format-${mnemType}-rad"       class="cm-btn cm-format-btn cm-radical"          title="radical">部</div>
<div id="cm-format-${mnemType}-kan"       class="cm-btn cm-format-btn cm-kanji"            title="kanji">漢</div>
<div id="cm-format-${mnemType}-voc"       class="cm-btn cm-format-btn cm-vocabulary"       title="vocabulary">語</div></div>
<fieldset class="note-${mnemType} noSwipe">
<!-- Textarea (Textbox) -->
<textarea id="cm-${mnemType}-text" class="cm-text" maxlength="5000" placeholder="Submit a community mnemonic"></textarea>
<div class="flex items-center"><span id="cm-${mnemType}-chars-remaining" class="block" title="Characters Remaining">5000${pencilSVG}</span>
<!-- Save and Cancel Buttons -->
<div class="form-button-wrapper">
    <button type="submit" id="cm-${mnemType}-save" class="cm-btn cm-save-highlight disabled:cursor-not-allowed disabled:opacity-50">Save</button>
    <button type="button" id="cm-${mnemType}-cancel" class="cm-btn cm-cancel-highlight disabled:cursor-not-allowed disabled:opacity-50">Cancel</button></div>
</div>

</fieldset>
</form>`;
    }

    /**
     * Functions to generate the mnemonic div
     * but also to modify it, like toggle buttons
     */
    const leftArrowSVG = `
<svg viewBox="-4.5 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#333333"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>arrow_left [#335]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-345.000000, -6679.000000)" fill="#333333"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M299.633777,6519.29231 L299.633777,6519.29231 C299.228878,6518.90256 298.573377,6518.90256 298.169513,6519.29231 L289.606572,6527.55587 C288.797809,6528.33636 288.797809,6529.60253 289.606572,6530.38301 L298.231646,6538.70754 C298.632403,6539.09329 299.27962,6539.09828 299.685554,6538.71753 L299.685554,6538.71753 C300.100809,6538.32879 300.104951,6537.68821 299.696945,6537.29347 L291.802968,6529.67648 C291.398069,6529.28574 291.398069,6528.65315 291.802968,6528.26241 L299.633777,6520.70538 C300.038676,6520.31563 300.038676,6519.68305 299.633777,6519.29231" id="arrow_left-[#335]"> </path> </g> </g> </g> </g></svg>
`;
    const rightArrowSVG = `
<svg viewBox="-4.5 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#333333"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>arrow_right [#336]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-305.000000, -6679.000000)" fill="#333333"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M249.365851,6538.70769 L249.365851,6538.70769 C249.770764,6539.09744 250.426289,6539.09744 250.830166,6538.70769 L259.393407,6530.44413 C260.202198,6529.66364 260.202198,6528.39747 259.393407,6527.61699 L250.768031,6519.29246 C250.367261,6518.90671 249.720021,6518.90172 249.314072,6519.28247 L249.314072,6519.28247 C248.899839,6519.67121 248.894661,6520.31179 249.302681,6520.70653 L257.196934,6528.32352 C257.601847,6528.71426 257.601847,6529.34685 257.196934,6529.73759 L249.365851,6537.29462 C248.960938,6537.68437 248.960938,6538.31795 249.365851,6538.70769" id="arrow_right-[#336]"> </path> </g> </g> </g> </g></svg>
`;
    const upArrowSVG = `
<svg viewBox="0 -4.5 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#FFFFFF"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>arrow_up [#337]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-260.000000, -6684.000000)" fill="#FFFFFF"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M223.707692,6534.63378 L223.707692,6534.63378 C224.097436,6534.22888 224.097436,6533.57338 223.707692,6533.16951 L215.444127,6524.60657 C214.66364,6523.79781 213.397472,6523.79781 212.616986,6524.60657 L204.29246,6533.23165 C203.906714,6533.6324 203.901717,6534.27962 204.282467,6534.68555 C204.671211,6535.10081 205.31179,6535.10495 205.70653,6534.69695 L213.323521,6526.80297 C213.714264,6526.39807 214.346848,6526.39807 214.737591,6526.80297 L222.294621,6534.63378 C222.684365,6535.03868 223.317949,6535.03868 223.707692,6534.63378" id="arrow_up-[#337]"> </path> </g> </g> </g> </g></svg>
`;
    const downArrowSVG = `
<svg viewBox="0 -4.5 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#FFFFFF"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>arrow_down [#338]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-220.000000, -6684.000000)" fill="#FFFFFF"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.70754,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583" id="arrow_down-[#338]"> </path> </g> </g> </g> </g></svg>
`;
    function getHeader(mnemType) {
        return `Community ${mnemType.charAt(0).toUpperCase() + mnemType.slice(1)} Mnemonic`;
    }
    /**
     * Creates the initial HTML code for the individual Mnemonic types, including Iframes. But also all Buttons.
     * Does not include content
     */
    function getCMdivContent(mnemType) {
        const userContentIframe = getInitialIframe(mnemType);
        let header = getHeader(mnemType);
        return `
<div id="cm-${mnemType}" class="cm-content">
    <!--  <h2 class="subject-section__subtitle">${header}</h2>  -->
    <div id="cm-${mnemType}-prev"        class="cm-btn cm-prev disabled">${leftArrowSVG}</div>
    ${userContentIframe}
    <div id="cm-${mnemType}-next"         class="cm-btn cm-next disabled">${rightArrowSVG}</div>
    <div id="cm-${mnemType}-info"         class="cm-info">

    <div id="cm-${mnemType}-user-buttons" class="cm-user-buttons">
        <div id="cm-${mnemType}-edit"         class="cm-btn cm-edit-highlight cm-small-btn disabled" >Edit</div>
        <div id="cm-${mnemType}-delete"       class="cm-btn cm-delete-highlight cm-small-btn disabled">Delete</div>
        <div id="cm-${mnemType}-request"      class="cm-btn cm-request-highlight cm-small-btn disabled">Request</div>
    </div>

    <div class="cm-score">Score: <span id="cm-${mnemType}-score-num" class="cm-score-num">0</span></div>
    <div id="cm-${mnemType}-upvote"       class="cm-btn cm-upvote-highlight disabled">Upvote ${upArrowSVG}</div>
    <div id="cm-${mnemType}-downvote"     class="cm-btn cm-downvote-highlight disabled">Downvote ${downArrowSVG}</div>
    <div id="cm-${mnemType}-submit"       class="cm-btn cm-submit-highlight disabled">Submit Yours</div></div>
</div>
`;
    }
    function setScore(mnemType, score) {
        let scoreEle = document.getElementById(`cm-${mnemType}-score-num`);
        if (scoreEle != null) {
            // make sure score is number and not (potentially harmful) string
            if (!Number.isNaN(Number(score)))
                scoreEle.innerText = String(score);
            else
                scoreEle.innerText = "0";
        }
    }
    class Buttons {
        /**
         * Enable/Disable all buttons that depend on the Mnemonic being by the user, or not.
         * @param owner boolean. Owner of mnem: True, else False
         * */
        static toggleUserButtons(mnemType, owner) {
            if (owner == true) {
                removeClass(`cm-${mnemType}-edit`);
                removeClass(`cm-${mnemType}-delete`);
                addClass(`cm-${mnemType}-request`);
                addClass(`cm-${mnemType}-upvote`);
                addClass(`cm-${mnemType}-downvote`);
            }
            else if (owner == false) {
                addClass(`cm-${mnemType}-edit`);
                addClass(`cm-${mnemType}-delete`);
                addClass(`cm-${mnemType}-request`);
                removeClass(`cm-${mnemType}-upvote`);
                removeClass(`cm-${mnemType}-downvote`);
            }
        }
        /**
         * Disables or enables the arrows for prev and next mnem. Depending on amount of mnems available and active one.
         * */
        static toggleArrows(mnemType, length, index) {
            let left = `cm-${mnemType}-prev`;
            let right = `cm-${mnemType}-next`;
            // make array length match index, now both start at 0
            addClass(left);
            addClass(right);
            if (length > 0 && length != null)
                length = length - 1;
            else
                return;
            if (length > index)
                removeClass(right);
            if (length > 0 && index > 0)
                removeClass(left);
        }
        /**
         * Enables/Disables voring buttons depending on users vote
         * votesJson["mnemUser"][mnemIndex]{WKuser} <-- contains vote
         * */
        static toggleVotes(mnemType, votesJson, mnemUser, mnemIndex) {
            if (votesJson == null || mnemUser == WKUser)
                return;
            const downv = `cm-${mnemType}-downvote`;
            const upv = `cm-${mnemType}-upvote`;
            try {
                const userVote = Number(votesJson[mnemUser][mnemIndex][WKUser]);
                if (userVote >= 1)
                    addClass(upv);
                else if (userVote <= -1)
                    addClass(downv);
            }
            catch (err) {
                // catch votesJson access in case mnemUser or WKUser do not have and entries.
                //// console.log("WKCM2 Error in toggleVotes, mnem_div.ts:", err);
            }
        }
        static disableButtons(mnemType) {
            addClass(`cm-${mnemType}-edit`);
            addClass(`cm-${mnemType}-delete`);
            addClass(`cm-${mnemType}-request`);
            addClass(`cm-${mnemType}-upvote`);
            addClass(`cm-${mnemType}-downvote`);
            addClass(`cm-${mnemType}-submit`);
            addClass(`cm-${mnemType}-prev`);
            addClass(`cm-${mnemType}-next`);
        }
        static editCM(mnemType) {
            if (currentMnem.mnem[mnemType] == undefined)
                return;
            if (currentMnem.currentUser[mnemType] == undefined)
                return;
            if (currentMnem.currentUser[mnemType] !== WKUser)
                return;
            Textarea.submitting = false;
            let iframe = document.getElementById(`cm-iframe-${mnemType}`);
            if (!iframe)
                return;
            Buttons.disableButtons(mnemType);
            iframe.outerHTML = getCMForm(mnemType);
            Textarea.initEditButtons(mnemType);
            let textarea = document.getElementById(`cm-${mnemType}-text`);
            if (textarea) {
                // replace HTML entities, so user actually sees the sign, they used before. Like < instead of &#60;
                textarea.value = decodeHTMLEntities(currentMnem.mnem[mnemType]);
            }
        }
        static deleteCM(mnemType) {
            if (!confirm("Your mnemonic will be deleted. This can not be undone! Are you sure?"))
                return;
            addClass(`cm-${mnemType}-delete`);
            addClass(`cm-${mnemType}-edit`);
            if (currentMnem.mnem[mnemType] == undefined)
                return;
            if (currentMnem.currentUser[mnemType] !== WKUser)
                return;
            let item = getItem();
            let shortType = getShortItemType(getItemType());
            deleteMnemonic(mnemType, item, shortType).then(response => {
                handleApiPutResponse(response);
            }).catch(reason => console.log("WKCM2: requestCM failed: ", reason));
        }
        static requestCM(mnemType) {
            addClass(`cm-${mnemType}-request`);
            let shortType = getShortItemType(getItemType());
            requestMnemonic(mnemType, getItem(), shortType).then(response => {
                handleApiPutResponse(response);
            }).catch(reason => console.log("WKCM2: requestCM failed: ", reason));
        }
        static voteCM(mnemType, vote) {
            if (!currentMnem.currentUser)
                return;
            if (typeof currentMnem.currentUser[mnemType] != "string")
                return;
            if (!currentMnem.mnemIndex)
                return;
            if (Number.isNaN(Number(currentMnem.mnemIndex[mnemType])))
                return;
            let item = getItem();
            let shortType = getShortItemType(getItemType());
            if (Number(vote) >= 1)
                addClass(`cm-${mnemType}-upvote`);
            else if (Number(vote) <= -1)
                addClass(`cm-${mnemType}-downvote`);
            voteMnemonic(mnemType, item, shortType, vote).then(response => {
                handleApiPutResponse(response, function () {
                    return dataUpdateAfterInsert(undefined, undefined, undefined, undefined, undefined, currentMnem.mnemIndex[mnemType], mnemType);
                });
            }).catch(reason => console.log("WKCM2: requestCM failed:\n", reason));
        }
        static submitCM(mnemType) {
            // "Submit Yours" Button
            let iframe = document.getElementById("cm-iframe-" + mnemType);
            if (!iframe)
                return;
            // save edit mode (whether editing or submitting new)
            Textarea.submitting = true;
            iframe.outerHTML = getCMForm(mnemType);
            // Buttons.disableButtons(mnemType);
            Buttons.disableButtons(mnemType);
            Textarea.initEditButtons(mnemType);
        }
        static initInteractionButtons(mnemType) {
            addClickEvent(`cm-${mnemType}-edit`, Buttons.editCM, [mnemType]);
            addClickEvent(`cm-${mnemType}-delete`, Buttons.deleteCM, [mnemType]);
            addClickEvent(`cm-${mnemType}-request`, Buttons.requestCM, [mnemType]);
            addClickEvent(`cm-${mnemType}-upvote`, Buttons.voteCM, [mnemType, "1"]);
            addClickEvent(`cm-${mnemType}-downvote`, Buttons.voteCM, [mnemType, "-1"]);
            addClickEvent(`cm-${mnemType}-submit`, Buttons.submitCM, [mnemType]);
            addClickEvent(`cm-${mnemType}-prev`, switchCM, [mnemType, -1]);
            addClickEvent(`cm-${mnemType}-next`, switchCM, [mnemType, 1]);
        }
    }

    /**
     * Functions related to the update of displayed mnemonics
     * and the fetch of data belonging to displayed mnemonics
     */
    // Namespaces for global variables
    var currentMnem;
    (function (currentMnem) {
        // currentMnem.mnem saves the last refreshed mnem globally for edit & save functions
        // Reading from HTML doesn't really work, because characters have been unescaped.
        currentMnem.mnem = {};
        // Index of active mnem, of all mnems. (update & vote) {meaning: 0, reading: 0}
        currentMnem.mnemIndex = {};
        // user of currently displayed mnem. (edit & vote)
        currentMnem.currentUser = {};
        // Index of active mnem, of the (author) users mnems. (editSave) {meaning: 0, reading: 0}
        currentMnem.userIndex = {};
    })(currentMnem || (currentMnem = {}));
    /**
     * fetches Data, if not given. Will update at index given. updates both given mnemTypes, or just one, if string.
     * Then calls updateCMelements, which does the visual update of the content and buttons and stuff.
     * @param dataJson needed to bypass recursive getMnemonic call, once data got loaded.
     * False because it can be null, when no mnem is available. False: refetch from API
     * @param mnemType array by default to make calling the function more convenient. Will be executed for both values in array.
     * @param index index of Mnem to use
     * */
    function updateCM(dataJson = false, mnemType = ["meaning", "reading"], index = 0) {
        // display loading message
        /*
        if (typeof mnemType == "object")
            for (let ele of mnemType)
                updateIframe(ele, "Loading Community Mnemonic ...")
        */
        let type = getItemType();
        if (dataJson || dataJson === null) {
            if (typeof mnemType === "string")
                mnemType = [mnemType];
            else {
                // reset global mnem storage for save&editing when updating both types
                // use mnemType as key
                // mnemonics, for edit, save & cancel
                currentMnem.mnem = {};
                // user of currently displayed mnem. (edit & vote)
                currentMnem.currentUser = {};
                // Index of active mnem, of all mnems. (No matter user)
                currentMnem.mnemIndex = {};
                // Index of active mnem, of the users mnems. (Also other users; mnemUser)
                currentMnem.userIndex = {};
            }
            for (let ele of mnemType) // @ts-ignore
                updateCMelements(ele, type, dataJson, index);
        }
        else {
            let item = getItem();
            getData(item, getShortItemType(type)).then((dataJson) => {
                if (dataJson !== undefined)
                    updateCM(dataJson, mnemType, index);
            }).catch((reason) => {
                console.log("WKCM2: updateCM error: ", reason);
                setTimeout(function () {
                    updateCM(false, mnemType, index);
                }, REFETCH_TIMEOUT);
            });
        }
    }
    /**
     * function that is doing the updating of the iframe contents.
     * Getting called in updateCM from data promise to reduce clutter in nested .then()
     * @param mnemType reading or meaning
     * @param type kanji, vocabulary or radical
     * @param dataJson json containing data from the DB:
     * {Type: 'k', Item: '活', Meaning_Mnem: {...}, Reading_Mnem: '!', Meaning_Score: {...}, ...}
     * @param index Global Index of mnemonic.
     * */
    function updateCMelements(mnemType, type, dataJson, index = 0) {
        // check if cm type exists in HTML
        if (!document.querySelector("#cm-" + mnemType))
            return;
        // Radicals only have meaning, no reading. Disable Reading buttons and update Reading message
        if (mnemType == "reading" && type == "radical") {
            Buttons.disableButtons(mnemType);
            updateIframe(mnemType, getRadicalReadingMessage());
            return;
        }
        // initialize, set and/or reset index
        currentMnem.mnemIndex[mnemType] = index;
        // if mnemJson is undefined or null, no mnemonic exists for this item/type combo.
        //reset score display
        setScore(mnemType, 0);
        Buttons.disableButtons(mnemType);
        removeClass(`cm-${mnemType}-submit`);
        currentMnem.currentUser[mnemType] = null;
        currentMnem.mnem[mnemType] = null;
        if (dataJson != null) {
            // sanity check if Mnems are filled, or just contain empty jsons ("" keys length is 0)
            if ((Object.keys(dataJson["Meaning_Mnem"]).length == 0 || dataJson["Meaning_Mnem"] == "{}") &&
                (Object.keys(dataJson["Reading_Mnem"]).length == 0 || dataJson["Reading_Mnem"] == "{}")) {
                updateIframe(mnemType, getNoMnemMsg());
                removeClass(`cm-${mnemType}-request`);
                return;
            }
            let mnemSelector = mnemType.charAt(0).toUpperCase() + mnemType.slice(1) + "_Mnem";
            let scoreSelector = mnemType.charAt(0).toUpperCase() + mnemType.slice(1) + "_Score";
            let votesSelector = mnemType.charAt(0).toUpperCase() + mnemType.slice(1) + "_Votes";
            let mnemJson = jsonParse(dataJson[mnemSelector]);
            let scoreJson = jsonParse(dataJson[scoreSelector]); // Score != Votes
            let votesJson = jsonParse(dataJson[votesSelector]);
            // no mnem available for current item
            if (mnemJson == null) {
                updateIframe(mnemType, getNoMnemMsg());
                removeClass(`cm-${mnemType}-request`);
            }
            // request JSON: {"!": ["Anonymous", "Dakes"]}
            else if (Object.keys(mnemJson)[0] == "!" && Object.keys(mnemJson).length == 1) {
                updateIframe(mnemType, getMnemRequestedMsg(mnemJson["!"]));
                if (mnemJson["!"].includes(WKUser))
                    addClass(`cm-${mnemType}-request`);
                else
                    removeClass(`cm-${mnemType}-request`);
                // disable request button, if user already requested
            }
            // default case. Mnem available
            else {
                Buttons.toggleArrows(mnemType, getMnemCount(mnemJson), index);
                // save dataJson to pseodo global, to prevent reloading from cache. (is faster [only a bit])
                switchCM.dataJson = dataJson;
                let currentJsonUser = getNthDataUser(mnemJson, index);
                updateIframe(mnemType, ...currentJsonUser); // (mnemType, mnem, user)
                // to know which mnem to edit.
                currentMnem.currentUser[mnemType] = currentJsonUser[1];
                currentMnem.userIndex[mnemType] = getUserIndex(mnemJson, index, currentMnem.currentUser[mnemType]);
                let score = 0;
                try {
                    score = scoreJson[currentMnem.currentUser[mnemType]][currentMnem.userIndex[mnemType]];
                }
                catch (err) {
                    // ignore in cases: ScoreJson is null (empty). And user entry does not exist.
                }
                setScore(mnemType, score);
                Buttons.toggleUserButtons(mnemType, currentJsonUser[1] == WKUser);
                currentMnem.userIndex[mnemType] = getUserIndex(mnemJson, index, currentMnem.currentUser[mnemType]);
                Buttons.toggleVotes(mnemType, votesJson, currentJsonUser[1], currentMnem.userIndex[mnemType]);
                // save for editing only if the currently displayed mnem is by user
                if (currentJsonUser[1] == WKUser)
                    currentMnem.mnem[mnemType] = currentJsonUser[0];
                // disable submit button if user submitted too many mnems
                if (getUserMnemCount(mnemJson, WKUser) >= MNEM_MAX_COUNT)
                    addClass(`cm-${mnemType}-submit`);
            }
        }
        // no mnem available for both items
        else {
            updateIframe(mnemType, getNoMnemMsg()); // (mnem, user)
            removeClass(`cm-${mnemType}-request`);
            currentMnem.mnem[mnemType] = null;
        }
    }
    // updateCMelements ▲
    /**
     * Switch displayed mnemonic to next or previous
     * @param {*} mnemType reading/meaning
     * @param {*} summand to add to index (usually -1/+1)
     */
    function switchCM(mnemType, summand) {
        let idx = 0;
        if (!Number.isNaN(Number(currentMnem.mnemIndex[mnemType])))
            idx = Number(currentMnem.mnemIndex[mnemType]);
        let dataJson = false;
        if (Object.keys(switchCM.dataJson).length != 0)
            dataJson = switchCM.dataJson;
        let newIdx = idx + summand;
        if (newIdx < 0) {
            console.log("WKCM2 Error: switchCM; new Index is < 0: ", newIdx, idx, summand);
            newIdx = 0;
        }
        updateCM(dataJson, mnemType, newIdx);
        switchCM.dataJson = {};
    }
    (function (switchCM) {
        switchCM.dataJson = {};
    })(switchCM || (switchCM = {}));
    /**
     * @param mnemJson json of either Meaning or Reading mnemonic. NOT whole data json
     * @return total number of mnemonics
     * */
    function getMnemCount(mnemJson) {
        if (mnemJson == null)
            return 0;
        let mnemCount = 0;
        for (let user in mnemJson) {
            mnemCount = mnemCount + mnemJson[user].length;
        }
        return mnemCount;
    }
    /**
     * @param mnemJson json of either Meaning or Reading mnemonic. NOT whole data json
     * @param user user whose mnems to count
     * @return number of mnemonics user submitted
     * */
    function getUserMnemCount(mnemJson, user) {
        if (mnemJson == null)
            return 0;
        if (!mnemJson[user])
            return 0;
        return mnemJson[user].length;
    }
    /**
     * Get data point at position n and return in array with user (owner of data) in second element.
     * @param innerJson inner json of data. either Meaning or Reading mnemonic. Or Votes. NOT whole data json.
     * MUST be in the form: {"user": [1, 2, 3], "user2": [4, 5, 6]}
     * @param n number of mnem to get. (Global index)
     * @return Array of nth data point in json and user: [data, user]
     * */
    function getNthDataUser(innerJson, n) {
        if (n < 0) {
            console.log("WKCM2 Error: getNthDataUser got index < 0: ", n);
            n = 0;
        }
        if (innerJson == null)
            return [null, null];
        let count = 0;
        for (let user in innerJson) {
            for (let data of innerJson[user]) {
                if (count == n)
                    return [data, user];
                ++count;
            }
        }
        return [null, null];
    }
    /**
     * Get the index of the users individual mnem from the global mnem index.
     * Relevant for editing mnem, to overwrite the correct one in the sheet.
     * */
    function getUserIndex(mnemJson, n, user) {
        if (mnemJson == null)
            return 0;
        if (mnemJson[user] == null)
            return 0;
        let count = 0;
        for (let currentUser in mnemJson) {
            let userCount = 0;
            for (let data of mnemJson[currentUser]) {
                if (count == n && currentUser == user)
                    return userCount;
                ++userCount;
                ++count;
            }
        }
        return 0;
    }
    /**
     * Initializes Button functionality with EventListener click
     * */
    function initButtons(mnemType) {
        //// mnemType = getFullMnemType(mnemType);
        Buttons.initInteractionButtons(mnemType);
        //? Textarea.initEditButtons(mnemType);
    }
    /**
     * Textarea for writing Mnemonics
     */
    class Textarea {
        /**
         * Save button during Mnemonic writing. Submitting and edit.
         * Submit Mnemonic to Database Sheet.
         * */
        static editSaveCM(mnemType) {
            let textarea = Textarea.getTextArea(mnemType);
            if (!textarea)
                return;
            let newMnem = Escaping.replaceInNewMnem(textarea.value);
            // if newMnem empty "", nothing to save
            if (!newMnem)
                return;
            // if currentMnem.mnem[mnemType] wasn't set, no mnem exists for this, then set it to empty string.
            if (!currentMnem.mnem[mnemType])
                currentMnem.mnem[mnemType] = "";
            // nothing to save
            if (newMnem == decodeHTMLEntities(currentMnem.mnem[mnemType]))
                return;
            addClass(`cm-${mnemType}-save`);
            let type = getItemType();
            let item = getItem();
            // index of the mnemonic for this user in the DB. Needed to update the correct one
            let mnemUserIndexDB = -1;
            mnemUserIndexDB = currentMnem.userIndex[mnemType];
            // append new mnem if mode is submit
            if (Textarea.submitting)
                mnemUserIndexDB = -1;
            // restore iframe. needed by dataUpdate after insert.
            let editForm = document.getElementById(`cm-${mnemType}-form`);
            if (editForm) {
                editForm.outerHTML = getInitialIframe(mnemType);
                Buttons.disableButtons(mnemType);
            }
            // api call to put data
            submitMnemonic(mnemType, item, getShortItemType(type), mnemUserIndexDB, newMnem)
                .then(a => {
                addClass(`cm-${mnemType}-cancel`);
                // with undefined, uses default parameter.
                dataUpdateAfterInsert(undefined, undefined, undefined, undefined, undefined, currentMnem.mnemIndex[mnemType], mnemType);
            })
                .catch(reason => console.log("WKCM2: editSaveCM failed: ", reason));
            Textarea.submitting = false;
            currentMnem.userIndex[mnemType] = 0;
            currentMnem.mnem[mnemType] = null;
        }
        /**
         * Cancel button during Mnemonic writing. Submitting and edit.
         * Prompts for confirmation, if content is edited or not empty.
         * */
        static editCancelCM(mnemType) {
            let textarea = Textarea.getTextArea(mnemType);
            let cancelConfirm = true;
            // only open dialog if it has content and it was edited
            if (textarea) // && currentMnem.mnem[mnemType])
                if (textarea.value && decodeHTMLEntities(currentMnem.mnem[mnemType]) !== textarea.value)
                    cancelConfirm = confirm("Your changes will be lost. ");
            if (cancelConfirm) {
                let editForm = document.getElementById(`cm-${mnemType}-form`);
                if (!editForm)
                    return;
                Textarea.submitting = false;
                editForm.outerHTML = getInitialIframe(mnemType);
                updateCM(false, mnemType, currentMnem.mnemIndex[mnemType]);
            }
            currentMnem.mnem[mnemType] = {};
        }
        /**
         * Insert the tag "tag" in mnem writing field, at current cursor position, or around highlighted text.
         * */
        static insertTag(mnemType, tag) {
            let textarea = Textarea.getTextArea(mnemType);
            if (!textarea)
                return;
            let selectedText = Textarea.getSelectedText(textarea);
            let insertText = "[" + tag + "]" + selectedText + "[/" + tag + "]";
            if (textarea.setRangeText) {
                //if setRangeText function is supported by current browser
                textarea.setRangeText(insertText);
            }
            else {
                textarea.focus();
                document.execCommand('insertText', false /*no UI*/, insertText);
            }
            textarea.focus();
        }
        /**
         * Insert the text in mnem writing field, at current cursor position.
         * */
        static insertText(mnemType, text) {
            let textarea = Textarea.getTextArea(mnemType);
            if (!textarea)
                return;
            if (textarea.setRangeText) {
                //if setRangeText function is supported by current browser
                textarea.setRangeText(text);
            }
            else {
                textarea.focus();
                document.execCommand('insertText', false /*no UI*/, text);
            }
            textarea.focus();
        }
        static initEditButtons(mnemType) {
            mnemType = mnemType;
            addClickEvent(`cm-${mnemType}-save`, Textarea.editSaveCM, [mnemType]);
            addClickEvent(`cm-${mnemType}-cancel`, Textarea.editCancelCM, [mnemType]);
            addClickEvent(`cm-format-${mnemType}-bold`, Textarea.insertTag, [mnemType, "b"]);
            addClickEvent(`cm-format-${mnemType}-italic`, Textarea.insertTag, [mnemType, "i"]);
            addClickEvent(`cm-format-${mnemType}-underline`, Textarea.insertTag, [mnemType, "u"]);
            addClickEvent(`cm-format-${mnemType}-strike`, Textarea.insertTag, [mnemType, "s"]);
            addClickEvent(`cm-format-${mnemType}-newline`, Textarea.insertText, [mnemType, "[n]"]);
            addClickEvent(`cm-format-${mnemType}-qmark`, Textarea.insertText, [mnemType, "?"]);
            addClickEvent(`cm-format-${mnemType}-reading`, Textarea.insertTag, [mnemType, "read"]);
            addClickEvent(`cm-format-${mnemType}-rad`, Textarea.insertTag, [mnemType, "rad"]);
            addClickEvent(`cm-format-${mnemType}-kan`, Textarea.insertTag, [mnemType, "kan"]);
            addClickEvent(`cm-format-${mnemType}-voc`, Textarea.insertTag, [mnemType, "voc"]);
        }
        // Button functionality ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
        static getTextArea(mnemType) {
            return document.getElementById(`cm-${mnemType}-text`);
        }
        static getSelectedText(textArea) {
            let text = textArea.value;
            let indexStart = textArea.selectionStart;
            let indexEnd = textArea.selectionEnd;
            return text.substring(indexStart, indexEnd);
        }
    }
    // TODO: check if needed
    // ? @deprecated
    // true, if mnem is currently being written. (Textarea active)
    Textarea.submitting = false;

    /**
     * Functions related to local data update and processing
     */
    /**
     * Update the displayed Mnemonic & cache in the background.
     * If a new one is available. If no new one is available does noting.
     * @param item item to update (星). Will be set if null.
     * @param item type of item (kanji) Will be set if null.
     * @param cachedData old data json (currently in cache) will be updated, if new version is different.
     * @param wait number of ms to wait with execution, or false. (Because after insertion into sheet it takes a moment for the updated version to be returned. Annoyingly even when using promises. )
     * */
    async function dataBackgroundUpdate(item = null, type = null, cachedData = null, wait = false) {
        if (wait && typeof wait == "number") {
            setTimeout(function () {
                dataBackgroundUpdate(item, type, cachedData, wait = false);
            }, wait);
            return;
        }
        if (item == null)
            item = getItem();
        if (type == null)
            type = getItemType();
        let identifier = getCacheId(item, type);
        if (cacheExpired(identifier)) {
            getItemApi(item, type).then(responseJson => {
                // fetch worked
                // wkof.file_cache.save(identifier, responseJson);
                let reponseJsonCopy = JSON.parse(JSON.stringify(responseJson));
                // updateCM(reponseJsonCopy);
                if (!isEqualsJson(cachedData, responseJson)) {
                    wkof.file_cache.save(identifier, responseJson);
                    updateCM(reponseJsonCopy);
                }
                return responseJson;
            }).catch(reason => {
                // fetch failed
                // TODO: handle failed fetch
                console.log("WKCM2: Error, dataBackgroundUpdate, Fetch of data from spreadsheet failed: " + reason);
            });
        }
    }
    // dataBackgroundUpdate ▲
    /**
     * Update the displayed Mnemonic & cache. It will be called after an submission to the sheet.
     * So compared to dataBackgroundUpdate it expects an update, and will repeat the fetch a few times, until it gives up.
     * After the insertion into the sheet it takes a few moments (~1-2s) until the new data is returned.
     * @param item item to update (星). Will be set if null.
     * @param type of item (kanji) Will be set if null.
     * @param cachedData old data json (currently in cache) will be updated, if new version is different. Will be set if false.
     * @param tries number of times to retry before giving up, waits "wait"ms between executions.
     * @param wait number of ms to wait with execution, or false. (Because after insertion into sheet it takes a moment for the updated version to be returned. Annoyingly even when using promises. )
     * @param index Index to use for displayed mnemonic. So user sees their changed mnem directly after submission. Should only be used togetcher with mnemType.
     * @param mnemType just as index, mnemType to pass through.
     * */
    function dataUpdateAfterInsert(item = null, type = null, cachedData = false, tries = 10, wait = 1000, index = 0, mnemType = undefined) {
        if (tries < 0) {
            console.log("WKCM2: dataUpdateAfterInsert, Maximum number of tries reached, giving up. Currently displayed Mnemonic will not be updated. ");
            updateCM(undefined, mnemType, index);
            return Promise.resolve();
        }
        if (item == null)
            item = getItem();
        if (type == null)
            type = getItemType();
        let identifier = getCacheId(item, type);
        if (cachedData === false) {
            wkof.file_cache.load(identifier).then(cachedData => dataUpdateAfterInsert(item, type, cachedData, tries, wait, index, mnemType))
                .catch(err => {
                dataUpdateAfterInsert(item, type, null, tries, wait, index, mnemType);
            });
            return Promise.resolve();
        }
        else if (typeof cachedData != "boolean") {
            getItemApi(item, type).then(responseJson => {
                // fetch worked
                let reponseJsonCopy = JSON.parse(JSON.stringify(responseJson));
                // @ts-ignore
                if (!isEqualsJson(cachedData, responseJson)) {
                    wkof.file_cache.save(identifier, responseJson);
                    updateCM(reponseJsonCopy, mnemType, index);
                }
                else {
                    // retry after "wait" ms
                    setTimeout(function () {
                        dataUpdateAfterInsert(item, type, cachedData, --tries, wait + 250, index, mnemType);
                    }, wait);
                }
            }).catch(reason => {
                // fetch failed
                // TODO: handle failed fetch
                console.log("WKCM2: Error, dataUpdateAfterInsert, Fetch of data from spreadsheet failed: " + reason);
            });
        }
    }
    // dataUpdateAfterInsert ▲
    /**
     * wraps JSON.parse
     * @return JSON, null if invalid
     * */
    function jsonParse(jsonString) {
        let newJson = null;
        if (jsonString != "" && typeof jsonString == "string") {
            try {
                newJson = JSON.parse(jsonString);
                if (jsonParse.refetchCounter > 0)
                    jsonParse.refetchCounter = 0;
            }
            catch (err) {
                console.log("WKCM2: jsonParse, got invalid json string: ", jsonString);
                // sometimes fetch was faster then score calculation => #ERROR!
                // if found retry. But only a few times. (There may really be #ERROR! in DB)
                if (jsonString.includes("#ERROR!") || jsonString.includes("#NAME?")) {
                    if (jsonParse.refetchCounter < 5) {
                        deleteCacheItem().then(r => {
                            void getData();
                            jsonParse.refetchCounter++;
                        });
                    }
                }
            }
        }
        // for consistency if empty json, convert to null
        if (newJson != null)
            if (typeof newJson == "object")
                if (Object.keys(newJson).length == 0)
                    newJson = null;
        return newJson;
    }
    (function (jsonParse) {
        jsonParse.refetchCounter = 0;
    })(jsonParse || (jsonParse = {}));
    function isEqualsJson(obj1, obj2) {
        if (obj1 == null && obj2 == null)
            return true;
        else if (obj1 == null || obj2 == null)
            return false;
        let keys1 = Object.keys(obj1);
        let keys2 = Object.keys(obj2);
        //return true when the two json has same length and all the properties has same value key by key
        return keys1.length === keys2.length && Object.keys(obj1).every(key => obj1[key] == obj2[key]);
    }
    function hasRequest(dataJson) {
        if (dataJson == null)
            return false;
        if (dataJson["Meaning_Mnem"][2] == "!")
            return true;
        if (dataJson["Reading_Mnem"][2] == "!")
            return true;
        return false;
    }
    function mnemAvailable(dataJson) {
        if (dataJson == null)
            return false;
        if (dataJson["Meaning_Mnem"][2] && dataJson["Meaning_Mnem"][2] != "!")
            return true;
        if (dataJson["Reading_Mnem"][2] && dataJson["Reading_Mnem"][2] != "!")
            return true;
        return false;
    }
    /**
     * Functions for Escaping/Unescaping User content.
     * Or generating Strings with User content.
     */
    class Escaping {
        /**
         * Replace stuff, that should not land in DB. Or maybe unintended input by user.
         * Technically redundant, since this is handled better by apps script.
         * */
        static replaceInNewMnem(text) {
            // is handled by insertion apps script as well.
            // replace newlines with markup
            text = text.replace(/\n/g, '[n]').replace(/\r/g, '[n]');
            return text;
        }
        /**
         * Replace custom markup with actual HTML tags for highlighting.
         * Those are the only HTML tags, that should land in the iframe.
         * */
        static replaceMarkup(text) {
            const list = ["b", "i", "u", "s", "br"];
            for (const ele of list) {
                text = text.replaceAll("[" + ele + "]", "<" + ele + ">");
                text = text.replaceAll("[/" + ele + "]", "</" + ele + ">");
            }
            // [/span] used as closing tag for legacy data in db.
            text = text.replaceAll("[/span]", `</span>`);
            text = text.replaceAll("[kan]", `<span class="cm-kanji">`);
            text = text.replaceAll("[/kan]", `</span>`);
            text = text.replaceAll("[voc]", `<span class="cm-vocabulary">`);
            text = text.replaceAll("[/voc]", `</span>`);
            text = text.replaceAll("[rad]", `<span class="cm-radical">`);
            text = text.replaceAll("[/rad]", `</span>`);
            text = text.replaceAll("[read]", `<span class="cm-reading">`);
            text = text.replaceAll("[/read]", `</span>`);
            text = text.replaceAll("[request]", `<span class="cm-request">`);
            text = text.replaceAll("[/request]", `</span>`);
            text = text.replaceAll("[n]", `<br>`);
            text = text.replaceAll("[br]", `<br>`);
            // legacy replace \n, that are already in the DB. (saved literally as \\n)
            text = text.replaceAll("\n", `<br>`);
            text = text.replaceAll("\\n", `<br>`);
            return text;
        }
        static getUserProfileLink(user) {
            // Don't give Anonymous a profile link
            if (typeof user != "string" || user == "")
                return "";
            if (user == "Anonymous")
                return `<a>Anonymous</a>`;
            else if (user == "!")
                return "";
            else
                return `<a href="https://www.wanikani.com/users/${user}" target="_blank" >${user}</a>`;
        }
    }

    /**
     * Functions related to fetching and pulling data to and from the Google Sheets API.
     */
    /**
     * Abstraction layer from direct data fetch,
     * to make use of caches to make the script more responsive.
     * @param item Current Item. Optional, gets it if not given.
     * @param type Current Item Type (short), optional. gets it if not given.
     * @param fetchOnMiss False: default. Refetch from API on cache miss.
     * If false, interprets cache miss as not in DB and fills cache with null.
     * @returns Promise resolving to DataJson or null.
     */
    async function getData(item, type, fetchOnMiss = false) {
        if (type == undefined)
            type = getShortItemType(getItemType());
        if (item == undefined || item == "")
            item = getItem();
        if (item == null || type == null) {
            throw new Error("WKCM2: getData, item or type is null. " + item + type);
        }
        let identifier = getCacheId(item, type);
        // get from wkof cache
        return wkof.file_cache.load(identifier).then((value) => {
            getData.misses = 0;
            if (cacheExpired(identifier, CACHE_DAY_MAX_AGE))
                dataBackgroundUpdate(item, type, value);
            return value;
        }, async (reason) => {
            // cache miss
            if (!fetchOnMiss) {
                await wkof.file_cache.save(identifier, null);
                return null;
            }
            // fetch data from db, put in cache and return
            // ? maybe remove? is not used anyway
            getData.misses++;
            // protection against deadlock "just in case" something somewhere else at some point breaks.
            if (getData.misses > 1) {
                if (getData.misses > 10)
                    throw new Error("WKCM2: There was a problem with fetching the Mnemonic Data.: " + reason);
                return null;
            }
            try {
                const responseJson = await getItemApi(item, type);
                // fetch worked
                await wkof.file_cache.save(identifier, responseJson);
                let responseJsonCopy = JSON.parse(JSON.stringify(responseJson));
                // only toggle visual update if the original item is still displayed.
                let curTyIt = getShortItemType(getItemType()) + getItem();
                let prevTyIt = getShortItemType(type) + item;
                if (curTyIt == prevTyIt)
                    updateCM(responseJsonCopy);
                return responseJson;
            }
            catch (reason_1) {
                // fetch failed
                // TODO: handle failed fetch
                console.log("WKCM2: Error, getData, Fetch of data from spreadsheet failed: " + reason_1);
                return null;
            }
        });
    }
    (function (getData) {
        // static miss counter, to protect from infinite cache miss loop (only triggered when an error with the apps script exists)
        getData.misses = 0;
    })(getData || (getData = {}));
    /**
     * Fetch data from Sheet. Returned as json.
     * @param item required. kanji, vocabluary or radical string
     * @param type k, v, r or empty string to fetch all for that item
     * */
    async function getItemApi(item, type) {
        // TODO: sleep between failed fetches???
        let shortType = getShortItemType(type);
        let url = SHEET_API_URL + `?item=${item}&type=${shortType}&exec=get`;
        url = encodeURI(url);
        return fetch(url, { method: "GET", redirect: "follow" })
            .then(response => response.json()).catch(reason => {
            console.log("WKCM2: fetchData failed: " + reason);
            return null;
        })
            .then((responseJson) => {
            if (responseJson == null)
                return null;
            else {
                // Object.keys... .length on "" is 0. neat
                if (Object.keys(responseJson["Meaning_Mnem"]).length == 0 || responseJson["Meaning_Mnem"] == "{}")
                    if (Object.keys(responseJson["Reading_Mnem"]).length == 0 || responseJson["Reading_Mnem"] == "{}")
                        return null;
                return responseJson;
            }
        });
    }
    async function getAllApi() {
        let url = SHEET_API_URL + `?exec=getall`;
        url = encodeURI(url);
        return fetch(url, { method: "GET", redirect: "follow" })
            .then(response => {
            return response.json();
        }).catch(reason => {
            console.log("WKCM2: fillCache failed: ", reason);
            return null;
        });
    }
    async function submitMnemonic(mnemType, item, shortType, mnemIndexDB, newMnem) {
        let shortMnemType = getShortMnemType(mnemType);
        newMnem = encodeURIComponent(newMnem);
        let url = SHEET_API_URL +
            `?exec=put&item=${item}&type=${shortType}&apiKey=${encodeURIComponent(userApiKey)}&mnemType=${shortMnemType}&mnemIndex=${mnemIndexDB}&mnem=${newMnem}`;
        return fetch(url, { method: "POST", redirect: "follow" });
    }
    async function voteMnemonic(mnemType, item, shortType, vote) {
        let shortMnemType = getShortMnemType(mnemType);
        let url = SHEET_API_URL +
            `?exec=vote&item=${item}&type=${shortType}&mnemType=${shortMnemType}&apiKey=${userApiKey}&mnemUser=${currentMnem.currentUser[mnemType]}&mnemIndex=${currentMnem.userIndex[mnemType]}&vote=${vote}`;
        url = encodeURI(url);
        return fetch(url, { method: "POST", redirect: "follow" });
    }
    async function requestMnemonic(mnemType, item, shortType) {
        let shortMnemType = getShortMnemType(mnemType);
        let url = SHEET_API_URL + `?exec=request&item=${item}&type=${shortType}&apiKey=${userApiKey}&mnemType=${shortMnemType}`;
        url = encodeURI(url);
        return fetch(url, { method: "POST", redirect: "follow" });
    }
    async function deleteMnemonic(mnemType, item, shortType) {
        if (currentMnem.currentUser[mnemType] != WKUser)
            return;
        let shortMnemType = getShortMnemType(mnemType);
        let url = SHEET_API_URL +
            `?exec=del&item=${item}&type=${shortType}&mnemType=${shortMnemType}&apiKey=${userApiKey}&mnemIndex=${currentMnem.userIndex[mnemType]}`;
        url = encodeURI(url);
        return fetch(url, { method: "POST", redirect: "follow" });
    }

    /**
     * Functions related to cache access update etc.
     */
    // caching happens in getData using WaniKani Open Framework's wkof.file_cache
    function getCacheId(item, type) {
        type = getShortItemType(type);
        return "wkcm2-" + type + item;
    }
    /**
     * @param identifier wkof.file_cache identifier
     * @param maxAge Age of cache to compare against in days.
     * @return true if older than daydiff, else false
     * */
    function cacheExpired(identifier, maxAge = CACHE_DAY_MAX_AGE) {
        // 86400000ms == 1d
        let cachedDate = 0;
        try {
            if (wkof.file_cache.dir[identifier] === undefined)
                return true;
            cachedDate = Date.parse(wkof.file_cache.dir[identifier]["added"]);
        }
        catch (err) {
            console.log("WKCM2: cacheAgeOlder, ", err);
            return true;
        }
        let cacheAge = Math.floor((Date.now() - cachedDate) / 86400000);
        return cacheAge > maxAge;
    }
    /**
     * Only fills cache, if cache is expired.
     * */
    function fillCacheIfExpired() {
        wkof.file_cache.load(CACHE_FILL_IDENTIFIER).then(value => {
            // found
            if (cacheExpired(CACHE_FILL_IDENTIFIER, GET_ALL_CACHE_MAX_AGE)) {
                // regex; delete whole wkcm2 cache
                wkof.file_cache.delete(/^wkcm2-/);
                fillCache();
                wkof.file_cache.save("wkcm2-version", WKCM2_VERSION);
            }
        }, reason => {
            fillCache();
        });
    }
    /**
     * Fills the cache with all available items.
     * Deletes the current wkcm cache
     * runs async. in the background.
     * NOTE: Items, that are not in the DB are not fetched by getall. So they still are uncached.
     * But the No mnem available message is displayed prematurely, so it should be fine.
     * */
    async function fillCache() {
        getAllApi().then((responseJson) => {
            if (responseJson == null)
                return null;
            else {
                resetWKOFcache(false);
                for (let typeItem in responseJson) {
                    let identifier = getCacheId(responseJson[typeItem]["Item"], responseJson[typeItem]["Type"]);
                    wkof.file_cache.save(identifier, responseJson[typeItem]);
                }
                wkof.file_cache.save(CACHE_FILL_IDENTIFIER, "Cache Filled");
            }
        }).catch(err => console.log("WKCM2: fillCache, ", err));
    }
    async function deleteCacheItem(item, type) {
        if (type == undefined)
            type = getShortItemType(getItemType());
        if (item == undefined || item == "")
            item = getItem();
        let identifier = getCacheId(item, type);
        return wkof.file_cache.delete(identifier);
    }

    /**
     * Returns new elements for the legend on item list pages (.../kanji/, .../level/)
     * */
    function getLegendLi() {
        return `
<li class="subject-legend__item" title="A Community Mnemonic was Requested.">
    ${getBadge(true, true)}
    <div class="subject-legend__item-title">CM Requested</div>
</li>
<li class="subject-legend__item" title="A Community Mnemonic is available.">
    ${getBadge(false, true)}
    <div class="subject-legend__item-title">CM Available</div>
</li>`;
    }
    /**
     * Returns a badge for items in lists, whether a Mnemonic is available or requested
     * */
    function getBadge(request = false, legend = false) {
        if (!request)
            return `<span lang="ja" class="${getBadgeClassAvail(legend)}">有</span>`;
        else
            return `<span lang="ja" class="${getBadgeClassReq(legend)}">求</span>`;
    }
    function getBadgeClass(type = "available", legend = false) {
        if (legend)
            return "wkcm-legend-badge-" + type;
        else
            return `subject-character__badge ${getBadgeBaseClass(type)}`;
    }
    function getBadgeBaseClass(type = "") {
        return `wkcm-list-badge-cm-${type}`;
    }
    function getBadgeClassReq(legend = false) {
        return getBadgeClass("request", legend);
    }
    function getBadgeClassAvail(legend = false) {
        return getBadgeClass("available", legend);
    }

    /**
     * Functions for the item lists
     * (wanikani.com/vocabulary)
     */
    function initHeader() {
        addHTMLinEle(".subject-legend__items", getLegendLi(), "beforeend");
    }
    async function addBadgeToItems() {
        // cancel if they were already added
        if (document.querySelector(`[class*='${getBadgeBaseClass()}']`))
            return;
        let types = ["radical", "kanji", "vocabulary"];
        //let typeShort = getShortItemType(getItemType());
        // needed for "levels" Overview, where all three are present
        for (let type of types) {
            let itemList = document.querySelectorAll(`.subject-character--${type}`);
            for (let i = 0; i < itemList.length; i++) {
                if (typeof itemList[i] != "object" || itemList[i] == null) {
                    console.log(type, itemList[i]);
                    console.log(typeof itemList[i]);
                    continue;
                }
                let spanItem = itemList[i].querySelector(".subject-character__characters");
                let item = "";
                if (spanItem.innerText) {
                    item = spanItem.innerText;
                }
                else if (type == "radical") {
                    // Image Radical
                    let radImg = spanItem.querySelector("img.radical-image");
                    item = radImg.alt;
                }
                else {
                    continue;
                }
                await getData(item, getShortItemType(type), false).then((res) => {
                    if (hasRequest(res))
                        addBadge(itemList[i], getBadge(true), getBadgeBaseClass("request"));
                    if (mnemAvailable(res))
                        addBadge(itemList[i], getBadge(false), getBadgeBaseClass("available"));
                });
            }
        }
    }
    /**
     * Only add Badge if not already present.
     * @param node
     * @param badgeHTML
     * @param selector
     */
    function addBadge(node, badgeHTML, selector) {
        if (!node.querySelector(`.${selector}`)) {
            let existingBadge = node.querySelector('.subject-character__badge');
            if (existingBadge) {
                existingBadge.insertAdjacentHTML('afterend', badgeHTML);
            }
            else {
                node.insertAdjacentHTML('afterbegin', badgeHTML);
            }
        }
    }

    insertStyle(".cm-content {\n  height: 100%;\n  text-align: left;\n  display: inline-block;\n}\n\n#turbo-body .container #wkcm2 .cm-content {\n  padding-bottom: 50px;\n}\n\n.cm {\n  font-family: \"Open Sans\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  overflow: auto;\n}");

    insertStyle(".subject-legend__item {\n  flex: 0 0 17%;\n}\n\n.wkcm-legend-badge-request {\n  background-color: #e1aa00;\n}\n\n.wkcm-legend-badge-available {\n  background-color: #71aa00;\n}\n\n.wkcm-legend-badge-request, .wkcm-legend-badge-available {\n  width: 2em;\n  height: 2em;\n  line-height: 2.1;\n  color: #fff;\n  font-size: 16px;\n  border-radius: 50%;\n  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);\n  box-shadow: 0 -2px 0px rgba(0, 0, 0, 0.2) inset, 0 0 10px rgba(255, 255, 255, 0.5);\n  margin-bottom: 14px;\n  text-align: center;\n}\n\n.wkcm-list-badge-cm-request {\n  background-color: #e1aa00;\n  left: 30px;\n}\n@media screen and (max-width: 767px) {\n  .wkcm-list-badge-cm-request {\n    left: 0;\n    transform: translate(45%, 0%) !important;\n  }\n}\n\n.wkcm-list-badge-cm-available {\n  background-color: #71aa00;\n  left: 60px;\n}\n@media screen and (max-width: 767px) {\n  .wkcm-list-badge-cm-available {\n    left: 0;\n    transform: translate(45%, -112%) !important;\n  }\n}\n\n.subject-character--vocabulary.subject-character--grid .wkcm-list-badge-cm-request {\n  left: 0;\n  transform: translate(45%, 0%) !important;\n}\n.subject-character--vocabulary.subject-character--grid .wkcm-list-badge-cm-available {\n  left: 0;\n  transform: translate(45%, -112%) !important;\n}\n.subject-character--vocabulary.subject-character--grid .subject-character__characters {\n  padding-left: 40px;\n}\n\n@media screen and (max-width: 767px) {\n  .subject-character__characters {\n    padding-left: 40px;\n  }\n}");

    insertStyle(".cm-btn {\n  color: white;\n  font-size: 14px;\n  cursor: pointer;\n  filter: contrast(0.9);\n  border-radius: 3px;\n  box-shadow: 0 -2px 0 rgba(0, 0, 0, 0.2) inset;\n  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);\n  transition: text-shadow 0.15s linear;\n  text-align: center;\n  font-weight: normal;\n}\n\n#item-info .cm-submit-highlight, #item-info .cm-upvote-highlight, #item-info .cm-downvote-highlight, #supplement-info .cm-submit-highlight, #supplement-info .cm-upvote-highlight, #supplement-info .cm-downvote-highlight {\n  height: 15px;\n  padding: 1px 0 4px 0;\n}\n\n.cm-btn:hover {\n  filter: contrast(1.15) !important;\n}\n\n.cm-btn:active {\n  filter: contrast(1.2) !important;\n  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2) inset;\n}\n\n.cm-btn.disabled.cm-btn.disabled {\n  opacity: 0.3;\n  pointer-events: none;\n}\n\n.cm-prev {\n  padding-right: 10px;\n}\n\n.cm-prev, .cm-next {\n  margin: 0 0 0 0;\n  box-shadow: none !important;\n}\n.cm-prev svg, .cm-next svg {\n  height: 50px;\n  filter: drop-shadow(0 4px 0 rgba(0, 0, 0, 0.3));\n  transition: filter 0.2s ease, transform 0.2s ease;\n}\n\n.cm-prev:not(.disabled) svg, .cm-next:not(.disabled) svg {\n  filter: drop-shadow(0 2px 0 rgba(0, 0, 0, 0.3));\n}\n\n.cm-prev:hover:not(.disabled) svg,\n.cm-next:hover:not(.disabled) svg {\n  filter: drop-shadow(0 1px 0 rgba(0, 0, 0, 0.3));\n}\n\n.cm-prev:active:not(.disabled) svg,\n.cm-next:active:not(.disabled) svg {\n  filter: drop-shadow(0 1px 0 rgba(0, 0, 0, 0.3));\n  transform: translateY(3px);\n}\n\n.cm-btn.disabled svg {\n  filter: none;\n}\n\n.cm-prev {\n  float: left;\n}\n\n.cm-next {\n  float: right;\n}\n\n.cm-prev.disabled, .cm-next.disabled {\n  opacity: 0.25;\n}\n\n.cm-small-btn, .cm-submit-highlight, .cm-form-submit, .cm-form-cancel {\n  text-align: center;\n  font-size: 14px;\n  width: 75px;\n  margin-right: 10px;\n  float: left;\n  padding: 0 4px;\n}\n\n.cm-upvote-highlight, .cm-downvote-highlight {\n  width: 95px;\n  margin-right: 10px;\n  float: left;\n}\n.cm-upvote-highlight svg, .cm-downvote-highlight svg {\n  height: 1rem;\n  transform: translateY(0.25rem);\n}\n\n.cm-upvote-highlight {\n  background-image: linear-gradient(to bottom, #5c5, #46ad46);\n}\n\n.cm-downvote-highlight {\n  background-image: linear-gradient(to bottom, #c55, #ad4646);\n}\n\n.cm-delete-highlight {\n  background-image: linear-gradient(to bottom, #811, #6d0606);\n  margin-right: 10px;\n}\n\n.cm-edit-highlight {\n  background-image: linear-gradient(to bottom, #ccc, #adadad);\n}\n\n.cm-request-highlight {\n  background-image: linear-gradient(to bottom, #e1aa00, #d57602);\n}\n\n.cm-submit-highlight {\n  width: 125px;\n  margin-left: 75px;\n  float: right;\n  background-image: linear-gradient(to bottom, #616161, #393939);\n}\n\n.form-button-wrapper {\n  position: absolute;\n  padding-left: 84px;\n  transform: translateY(-26px);\n}\n.form-button-wrapper .cm-cancel-highlight, .form-button-wrapper .cm-save-highlight {\n  width: 98px;\n  background-image: linear-gradient(to bottom, #616161, #393939);\n  padding: 0 0 0 0;\n}\n\n/*Edit, delete, request are small buttons*/\n.cm-small-btn {\n  font-size: 12px;\n  width: 60px;\n  height: 13px;\n  line-height: 1;\n}\n@-moz-document url-prefix() {\n  .cm-small-btn {\n    padding-top: 2px;\n  }\n}\n\n.cm-submit-highlight.disabled, .cm-form-submit.disabled {\n  color: #8b8b8b !important;\n}");

    insertStyle(".cm-format-btn.cm-format-btn {\n  filter: contrast(0.8);\n  text-align: center;\n  width: 35px;\n  height: 30px;\n  font-size: 20px;\n  line-height: 30px;\n  margin-left: 5px;\n  float: left;\n  box-shadow: 0 -4px 0 rgba(0, 0, 0, 0.2) inset;\n}\n\n.cm-format-btn:active {\n  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.2) inset !important;\n}\n\n.cm-format .cm-kanji, .cm-format .cm-radical, .cm-format .cm-vocabulary, .cm-format .cm-reading {\n  font-weight: bold;\n  display: inline-block;\n  color: #fff;\n  text-align: center;\n  box-sizing: border-box;\n  line-height: 1;\n  padding-top: 7px;\n}\n\n.cm-format-btn.cm-format-bold, .cm-format-btn.cm-format-italic, .cm-format-btn.cm-format-underline, .cm-format-btn.cm-format-newline, .cm-format-btn.cm-format-qmark, .cm-format-btn.cm-format-strike {\n  background-color: #f5f5f5;\n  background-image: linear-gradient(to bottom, #7a7a7a, #4a4a4a);\n  background-repeat: repeat-x;\n}");

    insertStyle(".cm-form form {\n  min-height: 300px;\n}\n\n.cm-form fieldset {\n  padding: 1px;\n  height: 110px;\n}\n\n.cm-text {\n  overflow: auto;\n  word-wrap: break-word;\n  resize: none;\n  height: calc(100% - 30px);\n  width: 98%;\n}\n\n.counter-note {\n  padding: 0;\n  margin: 2px 10px 0 0;\n}\n\n.cm-mnem-text {\n  float: left;\n  width: calc(100% - 120px);\n  height: 100%;\n  min-height: 125px;\n}");

    insertStyle(".cm-user-buttons {\n  position: absolute;\n  margin-top: -16px;\n  margin-left: 80px;\n}\n\n.cm-info {\n  display: inline-block;\n  margin-top: 20px;\n  margin-left: 65px;\n}\n\n.cm-info div {\n  margin-bottom: 0;\n}\n\n.cm-score {\n  float: left;\n  width: 80px;\n}\n\n.cm-score-num {\n  color: #555;\n}\n\n.cm-score-num.pos {\n  color: #5c5;\n}\n\n.cm-score-num.neg {\n  color: #c55;\n}\n\n.cm-nomnem {\n  margin-top: -10px !important;\n}\n\n.cm-form fieldset {\n  clear: left;\n}\n\n.cm-format {\n  margin: 0 !important;\n}\n\n.cm-delete-text {\n  position: absolute;\n  opacity: 0;\n  text-align: center;\n}\n\n.cm-delete-text h3 {\n  margin: 0;\n}\n\n#cm-meaning-chars-remaining, #cm-reading-chars-remaining {\n  padding-left: 4px;\n}\n#cm-meaning-chars-remaining svg, #cm-reading-chars-remaining svg {\n  height: 1rem;\n  transform: translateY(0.2rem);\n}");

    insertStyle(".cm-radical {\n  background-color: #0af;\n  background-image: linear-gradient(to bottom, #0af, #0093dd);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=\"#FF00AAFF\", endColorstr=\"#FF0093DD\", GradientType=0);\n}\n\n.cm-kanji {\n  background-color: #f0a;\n  background-image: linear-gradient(to bottom, #f0a, #dd0093);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=\"#FFFF00AA\", endColorstr=\"#FFDD0093\", GradientType=0);\n}\n\n.cm-vocabulary {\n  background-color: #a0f;\n  background-image: linear-gradient(to bottom, #a0f, #9300dd);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=\"#FFAA00FF\", endColorstr=\"#FF9300DD\", GradientType=0);\n}\n\n.cm-reading {\n  background-color: #555;\n  background-image: linear-gradient(to bottom, #555, #333);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=\"#FF555555\", endColorstr=\"#FF333333\", GradientType=0);\n  box-shadow: 0 -2px 0 rgba(0, 0, 0, 0.8) inset;\n}\n\n.cm-request {\n  background-color: #e1aa00;\n  color: black !important;\n  background-image: linear-gradient(to bottom, #e1aa00, #e76000);\n  background-repeat: repeat-x;\n}\n\n.cm-kanji, .cm-radical, .cm-reading, .cm-vocabulary, .cm-request {\n  padding: 1px 4px;\n  color: #fff;\n  font-weight: normal;\n  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);\n  white-space: nowrap;\n  border-radius: 3px;\n  box-shadow: 0 -2px 0 rgba(0, 0, 0, 0.2) inset;\n}");

    run();
    // all code runs from here
    function run() {
        // Runs checks if elements exist before running init and waits for them. Then calls init.
        waitForWKOF().then(exists => {
            if (exists) {
                wkof.include('Apiv2').then(() => {
                    wkof.ready('Apiv2').then(() => {
                        init();
                    });
                });
            }
            else
                console.log("WKCM2: there was a problem with checking for wkof. Please check if it is installed correctly and running. ");
        }).catch(exists => {
            console.log("WKCM2: ERROR. WKOF not found.");
            checkWKOF_old();
        });
    }
    // Init ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
    /**
     * Runs the right code depending if the current page is Lesson, Review or List
     * */
    function init() {
        // resets cache on new version of WKCM2
        resetWKOFcache();
        // refills whole cache, if not already filled or old.
        fillCacheIfExpired();
        setUsername();
        setApiKey();
        if (isInitialized())
            return;
        if (isList) {
            fillCacheIfExpired();
            initList();
        }
        else {
            void infoInjectorInit("meaning");
            void infoInjectorInit("reading");
        }
        if (isList || isItem)
            detectUrlChange(500);
    }
    /**
     * Usese WKItemInfoInjector to inject HTML into page and call init
     * @param mnemType
     */
    async function infoInjectorInit(mnemType) {
        if (isInitialized())
            return;
        await sleep(100);
        let cm_div = document.createElement("div");
        cm_div.innerHTML = getCMdivContent(mnemType);
        // Create a handle for this injection
        const handle = win.wkItemInfo
            .under(mnemType)
            .spoiling(mnemType)
            .appendSubsection(getHeader(mnemType), cm_div);
        if (handle) {
            // Set up notification using the same selector configuration
            const wkItemInfoSelector = win.wkItemInfo
                .under(mnemType)
                .spoiling(mnemType);
            let notify = wkItemInfoSelector.notifyWhenVisible || wkItemInfoSelector.notify;
            notify(o => {
                waitForEle(`cm-${mnemType}`).then(() => {
                    initCM(mnemType);
                });
            });
        }
    }
    /**
     * initializes Buttons and starts first content update.
     */
    function initCM(mnemType) {
        initButtons(mnemType);
        updateCM(undefined, mnemType);
    }
    function initList() {
        if (isInitialized())
            return;
        waitForClass("." + getBadgeClassAvail(true), initHeader, 250);
        waitForClass(`[class*='${getBadgeBaseClass()}']`, addBadgeToItems, 100, 25);
    }
    /**
     * return true if initialized. False else
     * @param mnemType can be null. If null uses both.
     * @returns
     */
    function isInitialized(mnemType = null) {
        if (!isList) {
            if (mnemType == null)
                if (getItemType() == "radical")
                    return isInitialized("meaning");
                else
                    return isInitialized("reading") && isInitialized("meaning");
            if (document.querySelector("#wkcm2"))
                return true;
            if (document.querySelector(`#cm-${mnemType}`))
                return true;
        }
        else // For list
         {
            if (document.querySelector(".wkcm-list-badge-cm-request"))
                return true;
            if (document.querySelector(".wkcm-list-badge-cm-available"))
                return true;
        }
        return false;
    }

    exports.infoInjectorInit = infoInjectorInit;
    exports.initList = initList;

    return exports;

})({});

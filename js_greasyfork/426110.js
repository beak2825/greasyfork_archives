// ==UserScript==
// @name         MUTOGEN for interneturok
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mutogen for interneturok (changes marks on frontend only!)
// @author       Mew Forest
// @match        https://interneturok.ru/school/*
// @icon         https://www.google.com/s2/favicons?domain=interneturok.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426110/MUTOGEN%20for%20interneturok.user.js
// @updateURL https://update.greasyfork.org/scripts/426110/MUTOGEN%20for%20interneturok.meta.js
// ==/UserScript==

(function () {
    // nodes xpath:value
    let mutogens = {};
    let mutogenPreloader = null;
    let mutogenPreloaderEnabled = true;
    let currentURL = window.location.href;

    const cssId = 'css-mutogen';
    const cssAltRule = '[ng-hide="editMark"] {background: #fff7dd; border: 1px #fbb dotted;}'

    const possibilities = [
        { 'mark': '4', 'color': 'green' },
        { 'mark': '5', 'color': 'green' },
        { 'mark': '3', 'color': 'orange' },
        { 'mark': '-', 'color': 'blue' },
    ]


    // ref: https://stackoverflow.com/a/32623171/8363830 + https://stackoverflow.com/a/14284815/8363830
    function getXPath(el) {
        if (typeof el == "string") return document.evaluate(el, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!el || el.nodeType != 1) return ''
        if (el.id) return "//*[@id='" + el.id + "']"
        var sames = [].filter.call(el.parentNode.children, function (x) { return x.tagName == el.tagName })
        return getXPath(el.parentNode) + '/' + el.tagName.toLowerCase() + (sames.length > 1 ? '[' + ([].indexOf.call(sames, el) + 1) + ']' : '')
    }

    // ref: https://stackoverflow.com/a/22386463/8363830
    function addCSS(cssString) {
        if (document.getElementById(cssId) !== null) document.getElementById(cssId).remove()
        var headNode = document.getElementsByTagName('head')[0];
        var styleNode = document.createElement('style');
        styleNode.setAttribute('id', cssId);
        styleNode.innerHTML = cssString;
        headNode.appendChild(styleNode);
    }

    function changeMarkDispatcher(event) {
        if (event.altKey) {
            const markSpan = event.target.querySelector('[ng-hide="editMark"]');
            if (markSpan == null) return false;
            const markNode = markSpan.querySelector('[ng-if="(mark != \'R\')"]');
            if (markNode == null) return false;
            const markSpanXpath = getXPath(markSpan);
            const currentMark = markNode.innerText;
            let nextCaseIndex = possibilities.indexOf(possibilities.filter(x => x.mark == currentMark)[0]) + 1;
            if (nextCaseIndex == possibilities.length) nextCaseIndex = 0;
            const nextMark = possibilities[nextCaseIndex];
            console.log("Mutation mark:", markSpanXpath, "->", nextMark.mark);
            mutogens[markSpanXpath] = nextMark;
            saveMutogens();
            return false;
        };
    };

    function initMutogen() {
        console.info("☠ MUTOGEN initialized!\nPress CTRL+Q to display table.\nChange any mark: ALT+click\nReset all: CTRL+M");
        for (let td of document.querySelectorAll('td[ng-repeat="week in weeks"]')) {
            td.addEventListener('click', changeMarkDispatcher);
        }
    }

    function drawMutations() {
        for (let xPath in mutogens) {
            let markSpan = getXPath(xPath);
            if (markSpan == null) break;
            const markNode = markSpan.querySelector('[ng-if="(mark != \'R\')"]');
            if (markNode == null) break;
            // draw changes..
            markSpan.classList.remove("orange");
            markSpan.classList.remove("green");
            markSpan.classList.remove("blue");
            let nextMark = mutogens[xPath];
            markSpan.classList.add(nextMark.color);
            markNode.innerText = nextMark.mark;
        }
    }

    function initPreloader() {
        mutogenPreloader = setInterval(() => {
            if ((document.querySelector(".journal_table_body")?.children?.length > 0) && mutogenPreloaderEnabled) {
                initMutogen()
                mutogenPreloaderEnabled = false;
                clearInterval(mutogenPreloader);
            };
        }, 100);
    }

    function triggerWhenUrlChanges(f) {
        setInterval(() => { if (currentURL != window.location.href) f(); }, 100)
    }

    function saveMutogens() {
        localStorage.setItem('mutogens', JSON.stringify(mutogens));
    }

    function loadMutogens() {
        try {
            mutogens = JSON.parse(localStorage.getItem('mutogens'));
        } catch (error) {
            mutogens = {}
        }
        if (mutogens == null) mutogens = {}
    }

    // load saved state
    loadMutogens();

    // draw mutations
    setInterval(drawMutations, 100);
    initPreloader();
    triggerWhenUrlChanges(() => { mutogenPreloaderEnabled = true; initPreloader(); });

    // show table borders CTRL+Q
    // reset all CTRL+M
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.code == 'KeyQ') {
            console.log("Triggering MUTOGEN");
            const cssNode = document.getElementById(cssId);
            if (cssNode !== null) {
                document.getElementById(cssId).remove();
            } else {
                addCSS(cssAltRule);
            }
        }
        if (event.ctrlKey && event.code == 'KeyM') {
            console.log("Resetting MUTOGEN");
            mutogens = {};
            saveMutogens();
            location.reload();
        }

    });


})();


// ==UserScript==
// @name         Faircamp Playback Toggle
// @namespace    https://openuserjs.org/users/burn
// @version      2025-07-22
// @description  Use spacebar to toggle music playback in Faircamp based websites
// @author       Burn
// @include      *://*
// @grant        none
// @license      MIT
// @copyright    2025, burn (https://openuserjs.org/users/burn)
// @downloadURL https://update.greasyfork.org/scripts/543251/Faircamp%20Playback%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/543251/Faircamp%20Playback%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DBG = false;

    let storeName = GM_info.script.name,
        myLog = (msg) => {
            DBG && console.log(storeName + " | " + msg);
        },
        qS = (el, scope) => {
            scope = (scope instanceof HTMLElement) ? scope : document;
            return scope.querySelector(el) || false;
        },
        qSAll = (els, scope) => {
            scope = (scope instanceof HTMLElement) ? scope : document;
            return scope.querySelectorAll(els) || false;
        },
        hidden, visibilityChange, state,
        tabFocused = (evt) => {
            myLog("tab has focus!");
            if (document !== evt.target) {
                myLog("warning, document not equal to document. it is ");
                myLog(evt.target); // should be document
            }
            if (evt.target.body !== document.activeElement) {
                myLog("warning, document.activeElement not equal to document.body. it is ");
                myLog(evt.target.body); // should be document.body
            }
        },
        elmTarget = qS("#content > div.docked_player > div.elements > button.playback");
    if (!elmTarget) {
        myLog('track play button not found, exiting');
        return;
    }

    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden";
        visibilityChange = "visibilitychange";
        state = "visibilityState";
    } else if (typeof document.mozHidden !== "undefined") {
        hidden = "mozHidden";
        visibilityChange = "mozvisibilitychange";
        state = "mozVisibilityState";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
        state = "msVisibilityState";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
        state = "webkitVisibilityState";
    }

    if ('undefined' === typeof hidden) {
        myLog('document.hidden not found, exiting');
        return;
    }

    document.addEventListener(visibilityChange, (e) => {
        return (false === document[hidden]) && tabFocused(e);
    });
    window.addEventListener('keydown', (e) => {
        myLog("in keydown");
        if(e.key === " " && e.target === document.body) {
            myLog("keydown ok");
            e.preventDefault();
        }
    });
    qS('body').addEventListener("keyup", (e) => {
        myLog("in keyup");
        if (e.key === " " && e.target === document.body) {
            e.preventDefault();
            elmTarget.focus();
            elmTarget.click();
            elmTarget.blur();
            myLog("keyup ok");
        }
    });
})();

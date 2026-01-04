// ==UserScript==
// @name         AtoZ Status Bar Position DEV
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Moves the status bar to the right and makes it fixed so that scrolling will have it remain in view.
// @author       AlienZombie [2176352]
// @match        https://www.torn.com/*
// @require      https://greasyfork.org/scripts/404603-atoz-utilities-dev/code/AtoZ%20Utilities%20DEV.js?version=941646
// @grant        GM_addStyle
// @source       https://greasyfork.org/en/scripts/428294-atoz-status-bar-position-dev
// @downloadURL https://update.greasyfork.org/scripts/428294/AtoZ%20Status%20Bar%20Position%20DEV.user.js
// @updateURL https://update.greasyfork.org/scripts/428294/AtoZ%20Status%20Bar%20Position%20DEV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Startup(false, true);
    let thisScriptName = 'AtoZ Status Bar Position DEV';

    GM_addStyle(`.statusbar-fixed {position: fixed !important; left: 1050px !important;}`);

    lookForStatusBar();

    function lookForStatusBar() {
        let funcName = "lookForStatusBar";
        createDebugLog(thisScriptName, funcName, "Start");

        let statusBar = document.querySelector("div.user-information___1b87w");
        let clock = document.querySelector("div.tc-clock-tooltip");

        if (statusBar || clock) {
            setStatusbarLocation(statusBar, clock);
        }
        else {
            createDebugLog(thisScriptName, funcName, "Could not find the status bar!")
        }

        createDebugLog(thisScriptName, funcName, "End");
    }

    function setStatusbarLocation(statusBar, clock) {
        let funcName = "setStatusbarLocation";
        createDebugLog(thisScriptName, funcName, "Start");

        if (statusBar) {
            statusBar.classList.add("statusbar-fixed");
        }

        if (clock) {
            clock.classList.add("statusbar-fixed");
        }
        
        createDebugLog(thisScriptName, funcName, "End");
    }
})();
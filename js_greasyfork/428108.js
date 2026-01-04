// ==UserScript==
// @name         AtoZ Investment Profit DEV
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Subtracts the investments losses and fees from the profit to show total investments gains/losses
// @author       AlienZombie [2176352]
// @match        https://www.torn.com/personalstats.php*
// @require      https://greasyfork.org/scripts/404603-atoz-utilities-dev/code/AtoZ%20Utilities%20DEV.js?version=941646
// @grant        GM_addStyle
// @source       https://greasyfork.org/en/scripts/428108-atoz-investment-profit-dev
// @downloadURL https://update.greasyfork.org/scripts/428108/AtoZ%20Investment%20Profit%20DEV.user.js
// @updateURL https://update.greasyfork.org/scripts/428108/AtoZ%20Investment%20Profit%20DEV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Startup(true, true);
    let thisScriptName = 'AtoZ Investment Profit DEV';

    GM_addStyle(`.stock-losses {color: red !important;}`);
    GM_addStyle(`.stock-profits {color: green !important;}`);

    lookForInvestments();

    function lookForInvestments() {
        let funcName = "hitAPI";
        createDebugLog(thisScriptName, funcName, "Start");

        ajax("missionChecker", ajaxResponse);

        createDebugLog(thisScriptName, funcName, "End");
    }

    function ajaxResponse(page, json, uri, xhr, settings) {
        let funcName = "ajaxResponse";
        createDebugLog(thisScriptName, funcName, "Start");

        createDebugLog(thisScriptName, funcName, `Page: ${page}`);
        createDebugLog(thisScriptName, funcName, 'Json:');
        logDebugObject(json)
        createDebugLog(thisScriptName, funcName, `Uri: ${uri}`);
        createDebugLog(thisScriptName, funcName, 'Xhr:');
        createDebugLog(thisScriptName, funcName, xhr);
        createDebugLog(thisScriptName, funcName, 'Settings:');
        createDebugLog(thisScriptName, funcName, settings);

        createDebugLog(thisScriptName, funcName, "End");
    }
})();
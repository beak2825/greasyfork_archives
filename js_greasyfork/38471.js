// ==UserScript==
// @name         closeDoublePage
// @version      0.4.4
// @description  Closes the old tab, if a new one with the same URL emerges
// @author       CennoxX
// @namespace    https://greasyfork.org/users/21515
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[closeDoublePage]%20
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        window.close
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/38471/closeDoublePage.user.js
// @updateURL https://update.greasyfork.org/scripts/38471/closeDoublePage.meta.js
// ==/UserScript==
/* jshint esversion: 10 */
/* eslint quotes: ["warn", "double", {"avoidEscape": true}] */
/* eslint curly: "off" */

sessionStorage.setItem("firstTimeOpened",new Date());
GM_setValue("log", document.URL + "##" + sessionStorage.getItem("firstTimeOpened"));
var oldLogs = "";
setInterval(function() {
    var logs = GM_getValue("log");
    if (oldLogs != logs) {
        if (document.URL==logs.split("##")[0] && sessionStorage.getItem("firstTimeOpened") != logs.split("##")[1])
        {
            window.close()
        }
        else
        {
            oldLogs = logs;
        }
    }
}, 500);

// ==UserScript==
// @name         FCT_script
// @namespace    *.amazon.*
// @version      1.01
// @description  fc.tools.amazon.dev remote tools & enhancements
// @author       rzlotos
// @match        https://trans-logistics-eu.amazon.com/yms/shipclerk/*
// @match        https://fc.tools.amazon.dev/*
// @match        http://127.0.0.1/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        unsafeWindow
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465190/FCT_script.user.js
// @updateURL https://update.greasyfork.org/scripts/465190/FCT_script.meta.js
// ==/UserScript==
const version = 1.01;

const devParams = {

};

(function() {
    'use strict';
    unsafeWindow.window.fct_script_present = true; unsafeWindow.window.fct_script_version = version;
    unsafeWindow.window.addEventListener("DOMContentLoaded", (event) => { document.body.dispatchEvent(new Event('fct_script_loaded')); });
})();
// ==UserScript==
// @name         Bing Visited Link Color Changer
// @description  Change the color of visited links in Bing search results
// @version      1.2

// @author       mrz2sx9d_&_deepseek
// @match        *://www.bing.com/*
// @run-at       document-start
// @license      N/A

// @namespace    https://greasyfork.org/en/users/1440425-mrz2sx9d
// @icon         https://cdn5.cdn-telegram.org/file/GYFKQ6teEz1oplQ2oER_tcPBDhulewx-gkl8QaoeKIjOHl1IIAK9B7iSAvr44ZWI-znBB-uHOOjTK1Nc74BPoc1q7C3htfgcb_QGQMEbEjcVlikluCzhZEJnMWDQ1gZooFAESOkSU_XYyVjMscpfHkuisSgTIonskG9aTIs6dmQVaHQeeDnoSjwDw5AEa9MK4Z9PwytUL0q8X6Whsn-zG1gJ15ryOnu_iHzuCkMkUF8GyoloplAfE3_M2W6SLXyaOwpDS2TtbAcaciEc7GizbjkI4ERMOslEz0ztGm_1YHiMajRIG2nzQ6ccdDoPl7TECVO0OgOulwFAzuTevfZ8kA.jpg

// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setClipboard
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_download
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/528213/Bing%20Visited%20Link%20Color%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/528213/Bing%20Visited%20Link%20Color%20Changer.meta.js
// ==/UserScript==

/*
    Author: Zein Jour Wohlstand
    Github: https://github.com/mrz2sx9d
    Discord: Put your discord server support URL or your discord username here. 
    Greasyfork: https://greasyfork.org/en/users/1440425-mrz2sx9d
    Telegram: https://t.me/mrz2sx9d
    Ko-fi: -
    Website: -
    VERSION (20250227): 1.0 ORIGINAL FORMAT USING VIOLENT MONKEY; 1.1 CHANGE @namespace FROM "https://t.me/mrz2sx9d" TO "https://greasyfork.org/en/users/1440425-mrz2sx9d"; 1.2 CHANGE ORIGANAL FORMAT TO GREASYFORK FORMAT


*/

(function() {
    'use strict';

    // Add custom CSS to change visited link color in Bing search results
    const css = `
        .b_algo a:visited {
            color: #00FFFF !important;
        }
    `;

    // Inject the CSS into the page
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
})();

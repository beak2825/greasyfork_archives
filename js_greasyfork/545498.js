// ==UserScript==
// @name         Loader — Universal Auto Clicker GUI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  ko biết ghi gì
// @author       Minhbeo8 (hominz)
// @icon         https://i.postimg.cc/Jhcr8R5L/hominz-png-4.png
// @match        *://*/*
// @connect      raw.githubusercontent.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545498/Loader%20%E2%80%94%20Universal%20Auto%20Clicker%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/545498/Loader%20%E2%80%94%20Universal%20Auto%20Clicker%20GUI.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const sourceUrl = "https://raw.githubusercontent.com/Minhbeo8/autoclickGUI/refs/heads/main/autoclick.js";

    GM_xmlhttpRequest({
        method: "GET",
        url: `${sourceUrl}?t=${Date.now()}`,
        onload: function (response) {
            if (response.status === 200 && response.responseText) {
                new Function(
                    'GM_addStyle', 'GM_setValue', 'GM_getValue',
                    'GM_deleteValue', 'GM_listValues', 'GM_openInTab',
                    response.responseText
                )(
                    GM_addStyle, GM_setValue, GM_getValue,
                    GM_deleteValue, GM_listValues, GM_openInTab
                );
            } else {
                console.error("Không thể tải script:", response.status, response.statusText);
            }
        },
        onerror: function (err) {
            console.error("Lỗi kết nối khi tải script:", err);
        }
    });

})();
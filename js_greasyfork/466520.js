// ==UserScript==
// @name         Blooket AntiBan
// @description        Automatically use antiban.
// @author       Minesraft2
// @match        https://*.blooket.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @version 0.0.1.20230517180704
// @namespace https://greasyfork.org/users/1075712
// @downloadURL https://update.greasyfork.org/scripts/466520/Blooket%20AntiBan.user.js
// @updateURL https://update.greasyfork.org/scripts/466520/Blooket%20AntiBan.meta.js
// ==/UserScript==
(async () => {
    const original_open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        if (!arguments[1].includes("suspend")) original_open.apply(this, arguments)
    };
})();
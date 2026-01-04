// ==UserScript==
// @name         openloot发送
// @namespace    http://tampermonkey.net/
// @version      1
// @license GPL
// @description  openloot
// @author       从前跟你一样
// @grant        unsafeWindow
// @match        *://*/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @connect      vagrantup.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect       *
// @connect      127.0.0.1
// @connect      novelai.net
// @match        *://*/*
// @description  Save user settings
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues

// @downloadURL https://update.greasyfork.org/scripts/523817/openloot%E5%8F%91%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/523817/openloot%E5%8F%91%E9%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 监听URL变化
    let lastUrl = window.location.href;


    function checkCurrentSite(lastUrl) {


        console.log("当前URL：", lastUrl)

    }

    setInterval(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            checkCurrentSite(lastUrl);
        }
    }, 10);
})();

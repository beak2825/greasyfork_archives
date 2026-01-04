// ==UserScript==
// @name         monjsSDk
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  this is a temp test content
// @author       givingkwan
// @match        https://www.kdocs.cn/l/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kdocs.cn
// @grant        none
// @run-at       document-start
// @license      GPL
// @connect      https://kmon.kdocs.cn
// @downloadURL https://update.greasyfork.org/scripts/465765/monjsSDk.user.js
// @updateURL https://update.greasyfork.org/scripts/465765/monjsSDk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var secScript = document.createElement("script");
    secScript.setAttribute("type", "text/javascript");
    secScript.setAttribute("src", "https://volcengine-cache-weboffice.wpscdn.cn/app/kmon/mon-0.0.20-2023-05-19-11-44-c167d204.js");
    document.body.appendChild(secScript);

    setTimeout(function(){
        if (window.__MONJS__) {
            window.monjs = new window.__MONJS__({
                dsn: 'https://kmon.kdocs.cn/api/relay/store/QkngTouKX/',
                userid: window.__WPSENV__.user_id,
                ver: window.__WPSENV__.file_version,
                env: 'beta'
            }, {
                isEnableReport: true
            });
        }
    },3000)
})();
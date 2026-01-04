// ==UserScript==
// @name         华为应用市场直链
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       ywl
// @description  直接从华为应用市场直接下载APK
// @match        *://appgallery1.huawei.com/*
// @grant        GM_xmlhttpRequest                                
// @downloadURL https://update.greasyfork.org/scripts/404178/%E5%8D%8E%E4%B8%BA%E5%BA%94%E7%94%A8%E5%B8%82%E5%9C%BA%E7%9B%B4%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/404178/%E5%8D%8E%E4%B8%BA%E5%BA%94%E7%94%A8%E5%B8%82%E5%9C%BA%E7%9B%B4%E9%93%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var last_id = '';

    setInterval(function(){
        var node = document.querySelector('div[appid]');
        if (!node) {
            return;
        }

        var id = node.getAttribute('appid')
        if (id == last_id) {
            return;
        }

        console.log(id);
        last_id = id;

        var base;
        if (node) {
            var url = node.getAttribute('apkdownloadurl')
            if (url) {
                var idx = url.indexOf('?')
                if (idx > 0) {
                    base = url.substr(0, idx)
                }
            }
        }

        if (base) {
            var items = document.getElementsByClassName('right_install_text')
            if (items.length > 0) {
                var old = items[0]
                var elem = old.cloneNode(true);
                elem.href = base;
                elem.innerText = '下载';

                var parent = old.parentNode;
                parent.removeChild(old);
                parent.appendChild(elem);
            }}
    }, 500)
})();
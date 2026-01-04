// ==UserScript==
// @name         FastAdmin文档阅读助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  FastAdmin文档阅读助手，帮助记录上次阅读位置
// @author       IT老猫
// @match        https://doc.fastadmin.net/developer*
// @match        https://doc.fastadmin.net/doc*
// @require      https://cdn.bootcdn.net/ajax/libs/js-cookie/latest/js.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420403/FastAdmin%E6%96%87%E6%A1%A3%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/420403/FastAdmin%E6%96%87%E6%A1%A3%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('lprequestend', (event)=> {
        let last_read = { url: document.URL, title: document.title };
        Cookies.set('last_read', JSON.stringify(last_read));
    })
    window.addEventListener('load', (event)=> {
        let data = Cookies.get('last_read');
        if (!!data) {
            let last_read = JSON.parse(data);
            if (data.url == document.URL) return;
            if(confirm('找到上次阅读位置['+last_read.title+']，是否从上次位置阅读')){
                document.location.href = last_read.url;
                Cookies.remove('last_read');
            }
        } else {
            Cookies.set('last_read', { url: document.URL, title: document.title });
        }
    })
})();
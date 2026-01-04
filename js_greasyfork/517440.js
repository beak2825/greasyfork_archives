// ==UserScript==
// @name         优酷去短剧
// @namespace    http://tampermonkey.net/
// @version      2024-09-21
// @description  根据剧集标签，定时检测，自动去除优酷短剧的展示
// @author       jbts6
// @match        https://www.youku.com/channel/webtv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youku.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517440/%E4%BC%98%E9%85%B7%E5%8E%BB%E7%9F%AD%E5%89%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/517440/%E4%BC%98%E9%85%B7%E5%8E%BB%E7%9F%AD%E5%89%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hideDuanju() {
        var cols = document.querySelectorAll('.g-col');
        cols.forEach(i => {
            var tag = i.querySelector('.categorypack_tagtext');
            if (tag && tag.innerText === '短剧') {
                i.style = 'display: none';
            }
        })
    }
    setTimeout(() => {
        hideDuanju();
        setInterval(hideDuanju, 5000);
    }, 2000);

    // Your code here...
})();
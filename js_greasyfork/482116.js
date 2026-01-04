// ==UserScript==
// @name         水木帖子新标签页打开
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  水木帖子新标签页打开，只适用于 m.newsmth.net 网站
// @author       WWB
// @license      MIT
// @match        https://m.newsmth.net/board/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=newsmth.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482116/%E6%B0%B4%E6%9C%A8%E5%B8%96%E5%AD%90%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/482116/%E6%B0%B4%E6%9C%A8%E5%B8%96%E5%AD%90%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const rows = document.querySelectorAll('#m_main li');
    if(rows) {
        const posts = Array.from(rows).map(li => li.querySelector('a:first-child'));
        // console.log(posts.length);

        if (posts) {
            posts.forEach(a => {
                a.setAttribute('target', '_blank');
                // console.log(a.href);
            });

            // console.log(posts.length);
            // console.log("done!");
        }
    }
})();
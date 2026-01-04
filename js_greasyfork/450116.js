// ==UserScript==
// @name         Lvv2原文链接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  标题提供原文链接跳转
// @author       You
// @match        https://instant.lvv2.com/html/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lvv2.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450116/Lvv2%E5%8E%9F%E6%96%87%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/450116/Lvv2%E5%8E%9F%E6%96%87%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const href = document.querySelector("#_via a")?.href;
    const title = document.querySelector("h1")?.textContent;

    if(href && title) {
        const a = document.createElement('a');
        a.appendChild(document.createTextNode(title));
        a.href = href;
        document.querySelector(".tl_article_header h1").replaceChildren(a)
    }
})();
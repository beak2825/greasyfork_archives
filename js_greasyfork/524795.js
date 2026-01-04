// ==UserScript==
// @name         隐藏奶昔论坛构思特效
// @namespace    http://tampermonkey.net/
// @version      20250507
// @description  隐藏奶昔论坛构思特效。
// @author       agou
// @match        https://forum.naixi.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naixi.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524795/%E9%9A%90%E8%97%8F%E5%A5%B6%E6%98%94%E8%AE%BA%E5%9D%9B%E6%9E%84%E6%80%9D%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/524795/%E9%9A%90%E8%97%8F%E5%A5%B6%E6%98%94%E8%AE%BA%E5%9D%9B%E6%9E%84%E6%80%9D%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = /* css */`
        #blessing,
        .floating-greetings,
        .lantern-wrapper,
        .custom-wrapper,
        body > b{
            display: none !important;
        }
    `;
    document.head.appendChild(style);
})();
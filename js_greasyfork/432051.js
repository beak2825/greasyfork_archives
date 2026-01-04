// ==UserScript==
// @name         网页回到顶部 | Go Top
// @namespace    http://ekozhan.com/
// @version      0.2
// @description  页面一键回到顶部
// @author       eko.zhan
// @include      https://github.com*
// @match        *://*.youtube.com/*
// @include      *://*.bilibili.com*
// @icon         https://avatars3.githubusercontent.com/u/3312512

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432051/%E7%BD%91%E9%A1%B5%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8%20%7C%20Go%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/432051/%E7%BD%91%E9%A1%B5%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8%20%7C%20Go%20Top.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let _url = location.href;

    goTop();

    /**
     * go top function
     */
    function goTop(){
        let topBtn = document.createElement('div');
        topBtn.className = 'meg-gotop';
        topBtn.style = 'position:fixed;right:10px;bottom:10px;font-size:24px;font-weight:bolder;cursor: pointer;z-index:9986;';
        topBtn.onclick = function(){window.scrollTo(0, 0);};
        topBtn.innerHTML = '↑↑';
        document.querySelector('body').append(topBtn);
    }
})();
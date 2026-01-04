// ==UserScript==
// @name         GitHub Trending
// @version      0.2
// @description  添加 GitHub Trending 入口
// @author       hustcc
// @match        http://*.github.com/*
// @match        https://*.github.com/*
// @run-at       document-end
// @namespace https://atool.vip
// @downloadURL https://update.greasyfork.org/scripts/374847/GitHub%20Trending.user.js
// @updateURL https://update.greasyfork.org/scripts/374847/GitHub%20Trending.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const el = document.querySelector('body > div.position-relative.js-header-wrapper > header > div > div.HeaderMenu.d-lg-flex.flex-justify-between.flex-auto > nav > ul');
    if (el) {
        el.innerHTML = el.innerHTML + `<li><a class="js-selected-navigation-item HeaderNavlink px-2" data-selected-links="/trending" href="/trending">Trending</a></li>`;
    }
})();
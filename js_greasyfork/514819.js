// ==UserScript==
// @name         Hide ChatGPT Header
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏 https://chatgpt.com/ 页面顶部的共享栏
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514819/Hide%20ChatGPT%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/514819/Hide%20ChatGPT%20Header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 查找并隐藏目标元素
    const header = document.querySelector('.draggable.sticky.top-0.z-10.flex.min-h-[60px].items-center.justify-center.border-transparent.bg-token-main-surface-primary.pl-0.md\\:hidden');
    if (header) {
        header.style.display = 'none';
    }
})();

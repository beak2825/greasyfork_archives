// ==UserScript==
// @name         替换空格符
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  在金山文档粘贴时，替换掉不可见的分隔符
// @author       You
// @match        https://*.kdocs.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kdocs.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500391/%E6%9B%BF%E6%8D%A2%E7%A9%BA%E6%A0%BC%E7%AC%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/500391/%E6%9B%BF%E6%8D%A2%E7%A9%BA%E6%A0%BC%E7%AC%A6.meta.js
// ==/UserScript==
(function () {
    'use strict';
    document.body.addEventListener('paste', (event) => {
        let target = event.target;
        let paste = event.clipboardData?.getData('text');
        if (target.tagName === 'INPUT' && paste?.includes('\t')) {
            paste = paste?.replaceAll(/(\r|\n|\t)/g, ' ').replaceAll(/\s+/g, ' ') ?? '';
            event.preventDefault();
            target.value = paste;
            target.dispatchEvent(new Event('input'));
        }
    });
    // Your code here...
})();

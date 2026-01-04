// ==UserScript==
// @name         uugg disable model
// @namespace    http://tampermonkey.net/
// @version      2025-06-14
// @description  关闭每日弹窗。
// @author       netcan
// @match        https://www.uu-gg.one/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uu-gg.one
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539352/uugg%20disable%20model.user.js
// @updateURL https://update.greasyfork.org/scripts/539352/uugg%20disable%20model.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeModalDisplay() {
        const modal = document.getElementById('modal');
        if (modal && modal.style.display) {
            modal.style.removeProperty('display');
            console.log('Removed display property from #modal');
        }
    }

    // 初始尝试
    removeModalDisplay();

    // 如果页面是动态生成的，监听 DOM 变化
    const observer = new MutationObserver(removeModalDisplay);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });
})();
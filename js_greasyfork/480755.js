// ==UserScript==
// @name         Bullying Poor Binjie09
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Hide Advertisement Images
// @author       author
// @match        *.aichatos.xyz/*
// @match        https://chat.yqcloud.top/*
// @match        *.binjie.*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480755/Bullying%20Poor%20Binjie09.user.js
// @updateURL https://update.greasyfork.org/scripts/480755/Bullying%20Poor%20Binjie09.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hideElements() {
        var elements = document.querySelectorAll('.flex.items-center.flex-col.justify-center.mt-4.text-center');
        elements.forEach(function(element) {
            element.style.display = 'none';
        });
    }

    // 初始页面加载时隐藏元素
    hideElements();

    // 使用 MutationObserver 持续监听页面变化并隐藏元素
    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                hideElements();
            }
        }
    });

    // 配置 MutationObserver 监听整个文档树及其属性的变化
    observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true
    });

})();

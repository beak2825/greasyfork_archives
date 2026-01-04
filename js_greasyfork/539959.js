// ==UserScript==
// @name                      屏蔽百度云右上角云一朵、设备管理功能
// @namespace                 http://tampermonkey.net/
// @version                   0.1
// @description               依然是自用型脚本
// @author                    Kurisuame
// @match                     *://pan.baidu.com/*
// @license                   GPLv3   
// @downloadURL https://update.greasyfork.org/scripts/539959/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E4%BA%91%E5%8F%B3%E4%B8%8A%E8%A7%92%E4%BA%91%E4%B8%80%E6%9C%B5%E3%80%81%E8%AE%BE%E5%A4%87%E7%AE%A1%E7%90%86%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/539959/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E4%BA%91%E5%8F%B3%E4%B8%8A%E8%A7%92%E4%BA%91%E4%B8%80%E6%9C%B5%E3%80%81%E8%AE%BE%E5%A4%87%E7%AE%A1%E7%90%86%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectors = [
        'div.nd-chat-ai-btn.margin-left-26.wp-s-header__right-item',
        'div.nd-chat-with-sug',
        'div.nd-chat-normal'
    ];

    function hideElements() {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.display = 'none';
            });
        });
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        hideElements();
                    }
                });
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    hideElements();
})();
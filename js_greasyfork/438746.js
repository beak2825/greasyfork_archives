// ==UserScript==
// @name         🔥净化LeetCode复制内容、自动开启差别对比🔥
// @namespace    com.zhaolei
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @version      0.2
// @description  去除leetcode上烦人的复制小尾巴，自动开启差别比对(搬运自symant233作者的Beautify插件，对其功能进行了精简)。
// @author       zhaolei
// @match        *://leetcode-cn.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438746/%F0%9F%94%A5%E5%87%80%E5%8C%96LeetCode%E5%A4%8D%E5%88%B6%E5%86%85%E5%AE%B9%E3%80%81%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E5%B7%AE%E5%88%AB%E5%AF%B9%E6%AF%94%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/438746/%F0%9F%94%A5%E5%87%80%E5%8C%96LeetCode%E5%A4%8D%E5%88%B6%E5%86%85%E5%AE%B9%E3%80%81%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E5%B7%AE%E5%88%AB%E5%AF%B9%E6%AF%94%F0%9F%94%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!$) { var $ = window.jQuery; }
    function listeningCopyEvent() {
        self.addEventListener('copy', (e) => {
            const selection = document.getSelection()
            if (selection.toString() !== "") {
                e.preventDefault()
                e.clipboardData.setData('text', selection.toString())
            }
        })
    }
    listeningCopyEvent()
    function enableDiff () {
        const btn = document.querySelector('label[class*="Label-StyledSwitch"]');
        if (btn && !btn.getAttribute('beautify-data')) {
            btn.setAttribute('beautify-data', true);
            btn.click();
        }
    }
    setTimeout(() => {
        $('div[class*=second-section-container] > div:last-child button').click();
        new Promise(resolve => {
            const container = document.querySelector('div[class*="CodeAreaContainer"]');
            if (container) {
                new MutationObserver((mutationList) => {
                    mutationList.forEach((mutation) => {
                        if (mutation.oldValue) enableDiff();
                    });
                }).observe(container, {
                    attributes: true,
                    attributeOldValue: true,
                    subtree: true,
                });
            }
            resolve();
        });
    }, 2600);
})();
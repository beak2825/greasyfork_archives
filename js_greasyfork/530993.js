// ==UserScript==
// @name         F**K ai-bot
// @namespace    http://tampermonkey.net/
// @version      2025-03-27
// @description  就你tmd会禁用复制是吧？？坐在开源大山上到处拉屎，傻逼玩意，头给你掀掉
// @author       You
// @match        *://ai-bot.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530993/F%2A%2AK%20ai-bot.user.js
// @updateURL https://update.greasyfork.org/scripts/530993/F%2A%2AK%20ai-bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义需要删除的 CSS 规则的关键特征（检测目标选择器）
    const targetSelector = /body\s*\*\s*:not\(input\):not\(textarea\)/;

    // 遍历页面中所有 <style> 标签
    Array.from(document.querySelectorAll('style')).forEach(styleElement => {
        if (targetSelector.test(styleElement.textContent)) {
            styleElement.remove();
        }
    });

})();
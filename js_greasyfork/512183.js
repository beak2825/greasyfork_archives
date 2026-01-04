// ==UserScript==
// @name         kibana boss
// @namespace    http://tampermonkey.net/
// @version      2025-05-22
// @description  解决飘红
// @author       chenghui
// @match        https://kibana.startimes.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=startimes.me
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512183/kibana%20boss.user.js
// @updateURL https://update.greasyfork.org/scripts/512183/kibana%20boss.meta.js
// ==/UserScript==

let t = setInterval(function () {
    // 遍历所有的样式表
    for (let sheet of document.styleSheets) {
        // 遍历每个样式表中的规则
        for (let i = 0; i < sheet.cssRules.length; i++) {
            let rule = sheet.cssRules[i];
            if (rule.selectorText === '.eui-xScrollWithShadows') {
                // 移除 -webkit-mask-image 和 mask-image 样式
                rule.style.removeProperty('-webkit-mask-image');
                rule.style.removeProperty('mask-image');
            }
            if (rule.selectorText === '.euiYScrollWithShadows') {
                // 移除 -webkit-mask-image 和 mask-image 样式
                rule.style.removeProperty('-webkit-mask-image');
                rule.style.removeProperty('mask-image');
            }
        }
    }

}, 1000);
// ==UserScript==
// @name         AutoClickNextPlayBtn
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动点击21tb页面中的“下一节”按钮
// @match        https://pctt.21tb.com/*
// @icon         https://s1.aigei.com/src/img/png/a6/a6daaafab773440688c27bde4174427d.png?imageMogr2/auto-orient/thumbnail/!282x282r/gravity/Center/crop/282x282/quality/85/%7CimageView2/2/w/282&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:TgOqQv1a2FmaH6NTWLa1qsUnZXY=
// @grant        none
// @author       pctt
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514594/AutoClickNextPlayBtn.user.js
// @updateURL https://update.greasyfork.org/scripts/514594/AutoClickNextPlayBtn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hasClicked = false; // 标志位，防止多次点击同一按钮

    function clickNextButton() {
        let nextButton = document.querySelector('button.next-button');

        if (nextButton && !hasClicked) {
            console.log("找到按钮，10秒后点击...");
            setTimeout(function() {
                nextButton.click(); // 点击按钮
                console.log("已点击下一节按钮");
                hasClicked = true; // 设置标志位，防止多次点击
            }, 10000); // 10秒延迟
        }
    }

    // 创建一个观察器，监听DOM变化
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 检查是否有“下一节”按钮，并根据标志位执行点击
            let nextButton = document.querySelector('button.next-button');

            // 如果找到新的“下一节”按钮，则重置标志位
            if (nextButton && hasClicked) {
                hasClicked = false; // 重新设置为未点击，准备点击新的按钮
            }

            // 尝试点击按钮
            clickNextButton();
        });
    });

    // 配置观察器的选项
    let config = { childList: true, subtree: true };

    // 启动观察器，监听整个文档
    observer.observe(document.body, config);

    // 初次加载时立即尝试点击一次按钮
    clickNextButton();

})();

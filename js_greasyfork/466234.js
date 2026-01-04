// ==UserScript==
// @name         智慧树/知到|共享课课程十倍速
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将1.5倍速调整为10倍速，切换视频后需要点击右上角按钮
// @author       ChatGPT
// @match        *://studyvideoh5.zhihuishu.com/*
// @grant        none
// @icon         https://www.zhihuishu.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466234/%E6%99%BA%E6%85%A7%E6%A0%91%E7%9F%A5%E5%88%B0%7C%E5%85%B1%E4%BA%AB%E8%AF%BE%E8%AF%BE%E7%A8%8B%E5%8D%81%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/466234/%E6%99%BA%E6%85%A7%E6%A0%91%E7%9F%A5%E5%88%B0%7C%E5%85%B1%E4%BA%AB%E8%AF%BE%E8%AF%BE%E7%A8%8B%E5%8D%81%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateSpeedElement() {
        var speedElement = document.querySelector('div.speedTab.speedTab15[rate="1.5"]');
        if (speedElement) {
            speedElement.setAttribute('rate', '10');
            speedElement.textContent = 'X 10';
        }
    }

function addButton() {
    var button = document.createElement('button');
    button.textContent = '执行脚本';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.addEventListener('click', updateSpeedElement);
    document.body.appendChild(button);
}
    // 修改速度元素
    setTimeout(updateSpeedElement, 3000); // 3秒延迟

    // 添加按钮
    addButton();
})();
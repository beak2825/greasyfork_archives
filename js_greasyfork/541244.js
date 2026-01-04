// ==UserScript==
// @name         菜Gamer首页自动签到
// @namespace    https://caigamer.com/
// @version      1.3
// @description  在首页自动检测并点击签到按钮 (基于data属性)
// @author       Riki
// @license      CC-BY-4.0
// @match        https://caigamer.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541244/%E8%8F%9CGamer%E9%A6%96%E9%A1%B5%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/541244/%E8%8F%9CGamer%E9%A6%96%E9%A1%B5%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('【菜Gamer自动签到】脚本已启动 (优化版)，开始检测...');

    const timer = setInterval(() => {
        const signLink = document.getElementById('sg_sign');

        if (signLink) {
            // 【优化方案】直接使用网站自带的 'data-is_checked' 属性来判断
            const isChecked = signLink.getAttribute('data-is_checked');

            // 签到后的状态是 '1'。因此，只要状态不是 '1'，就说明需要签到。
            // 这包括了属性不存在(null)和属性值为'0'等所有未签到情况。
            if (isChecked !== '1') {
                console.log('【菜Gamer自动签到】检测到 data-is_checked 不为 "1"，判定为未签到，正在点击...');
                signLink.click();
            } else {
                console.log('【菜Gamer自动签到】检测到 data-is_checked="1"，判定为已签到，无需操作。');
            }

            // 找到按钮后，任务完成，停止检测
            clearInterval(timer);
        }
    }, 1000);

    // 60秒后自动停止
    setTimeout(() => {
        clearInterval(timer);
    }, 60000);

})();
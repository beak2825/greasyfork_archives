// ==UserScript==
// @name         龙外第二课堂抢课
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  自动尝试报名
// @author       RSPqfgn
// @license      MIT
// @match        http://lfls.sdedu.net/HwAdmin/ElectiveSign/StudentSign/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511114/%E9%BE%99%E5%A4%96%E7%AC%AC%E4%BA%8C%E8%AF%BE%E5%A0%82%E6%8A%A2%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/511114/%E9%BE%99%E5%A4%96%E7%AC%AC%E4%BA%8C%E8%AF%BE%E5%A0%82%E6%8A%A2%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let signTime = null; // 报名开始时间

    // 获取报名时间的函数
    function getSignTime() {
        const timeElement = document.querySelector('.col-md-8');
        if (timeElement) {
            const timeText = timeElement.textContent.trim();
            const match = timeText.match(/(\d{4})年(\d{1,2})月(\d{1,2})日 (\d{1,2}):(\d{1,2}):(\d{1,2})/);
            if (match) {
                signTime = new Date(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}`);
                console.log(`报名时间：${signTime}`);
            }
        }
    }

    // 尝试点击报名按钮的函数
    function trySignUp() {
        const button = document.querySelector('button[name="sign"].btn.bg-blue');

        // 检查按钮是否存在且未被禁用
        if (button && !button.disabled) {
            button.click(); // 点击按钮
            console.log('报名按钮已被点击！');
        }
    }

    // 定期检查报名时间和网页状态
    setInterval(() => {
        // 获取报名时间
        if (!signTime) {
            getSignTime();
        }

        // 检查当前时间与报名时间
        if (signTime) {
            if (new Date() >= signTime) {
                // 如果报名时间到了，尝试点击报名按钮
                        // 检查网页是否可访问
        if (document.readyState !== 'complete') {
            // 网页不可访问时，尝试刷新
            location.reload();
            console.log('网页不可访问，正在尝试刷新...');
        }
                trySignUp();
            } else {
                console.log(`距离报名还有 ${Math.round((signTime - new Date()) / 1000)} 秒`);
            }
        }

    }, 500); // 每1000毫秒（1秒）检查一次
})();

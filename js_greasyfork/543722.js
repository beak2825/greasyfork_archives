// ==UserScript==
// @name         理想论坛自动签到
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  自动刷新页面并点击签到按钮
// @author       dzmsjs
// @match        https://www.55188.com/plugin.php?id=sign
// @icon         https://www.55188.com/favicon.ico
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543722/%E7%90%86%E6%83%B3%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/543722/%E7%90%86%E6%83%B3%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 本脚本由ChatGPT辅助编写

    console.info('run plugin to automatically sign in');
    //定时刷新设置：
    // 设置目标时间：每天 09:03:00
    const targetHour = 11;
    const targetMinute = 0;
    const targetSecond = 30; //长时间不动页面时，系统会优化本程序执行，一分钟只执行一次，即第30秒

    // 每秒检测一次时间
    setInterval(() => {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();
        console.info(h, m, s);
        //console.info(h === targetHour && m === targetMinute);
        if (h === targetHour && m === targetMinute && s === targetSecond) {
            console.log('到达指定时间，刷新页面');
            location.reload();
        }
    }, 1000); // 每秒检查一次
    // 设置签到按钮的选择器（你需要根据具体页面结构修改）
    const SIGN_BUTTON_SELECTOR = '.qdleft .btn';
    // 等待页面加载完成
    window.addEventListener('load', () => {
        console.log('页面加载完成，准备签到');

        // 查找签到按钮
        const btn = document.querySelector(SIGN_BUTTON_SELECTOR);

        if (btn) {
            btn.click();
            console.log('找到签到按钮，点击完成');
        } else {
            console.log('未找到签到按钮，等待重试');
        }

        // 每24小时自动刷新（可自定义）
        // 以下属于版本1.0。    自1.1版本起，废弃使用
//        const REFRESH_INTERVAL_HOURS = 24;
//        const REFRESH_MS = REFRESH_INTERVAL_HOURS * 60 * 60 * 1000;
//        const test_reload = 20 * 1000; //测试自动刷新功能，时间间隔
//        setTimeout(() => {
//            console.log('定时刷新页面中...');
//            location.reload();
//        }, REFRESH_MS);
    });
})();

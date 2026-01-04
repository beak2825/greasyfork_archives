// ==UserScript==
// @name         Tekqart 自动签到
// @namespace    https://www.tekqart.com/
// @version      2.2
// @description  最优版：结合立即执行的效率与轮询的稳定性，实现快速与可靠的统一。
// @author       Riki
// @license      CC-BY-4.0
// @match        https://www.tekqart.com/
// @match        https://www.tekqart.com/forum.php
// @match        https://www.tekqart.com/plugin.php?id=zqlj_sign*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541245/Tekqart%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/541245/Tekqart%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getTodayStr() {
        const d = new Date();
        return d.getFullYear() + '-' +
               String(d.getMonth() + 1).padStart(2, '0') + '-' +
               String(d.getDate()).padStart(2, '0');
    }

    const today = getTodayStr();
    const STORAGE_KEY = 'tekqart_last_sign_date';
    const lastSignDate = localStorage.getItem(STORAGE_KEY);

    // --- 逻辑1：在主页或论坛页 ---
    if (location.pathname === '/' || location.pathname === '/forum.php') {
        if (lastSignDate === today) {
            console.log('【Tekqart 最优版】主页：今天已签到，终止。');
            return;
        }

        const findAndGo = () => {
            const signLink = document.querySelector('a[href="plugin.php?id=zqlj_sign"]');
            if (signLink) {
                console.log('【Tekqart 最优版】主页：找到“天天打卡”链接，跳转...');
                window.location.href = signLink.href;
                return true; // 表示任务完成
            }
            return false; // 表示未找到
        };

        // --- 快速通道 (Fast Path) ---
        // 立即尝试执行一次
        if (findAndGo()) {
            return; // 如果成功，脚本结束
        }

        // --- 后备计划 (Fallback Plan) ---
        // 如果立即执行失败，则启动轮询
        console.log('【Tekqart 最优版】主页：未立即找到链接，启动轮询模式...');
        const homeInterval = setInterval(() => {
            if (findAndGo()) {
                clearInterval(homeInterval);
            }
        }, 1000);

        setTimeout(() => clearInterval(homeInterval), 20000); // 20秒后轮询超时
        return;
    }

    // --- 逻辑2：在签到页 ---
    if (location.pathname === '/plugin.php' && location.search.includes('id=zqlj_sign')) {
        if (lastSignDate === today) {
            console.log('【Tekqart 最优版】签到页：今天已签到，跳回首页。');
            window.location.href = 'https://www.tekqart.com/';
            return;
        }

        const findAndSign = () => {
            const signBtn = document.querySelector('div.bm.signbtn.cl a.btna');
            if (signBtn) {
                console.log('【Tekqart 最优版】签到页：找到“点击打卡”按钮，点击...');
                signBtn.click();
                localStorage.setItem(STORAGE_KEY, today);

                setTimeout(() => {
                    window.location.href = 'https://www.tekqart.com/';
                }, 1500);
                return true; // 任务完成
            }
            return false; // 未找到
        };

        // --- 快速通道 (Fast Path) ---
        if (findAndSign()) {
            return;
        }

        // --- 后备计划 (Fallback Plan) ---
        console.log('【Tekqart 最优版】签到页：未立即找到按钮，启动轮询模式...');
        const signPageInterval = setInterval(() => {
            if (findAndSign()) {
                clearInterval(signPageInterval);
            }
        }, 1000);

        setTimeout(() => {
            clearInterval(signPageInterval);
            // 超时后如果还未执行，也跳回首页避免卡住
            if (!localStorage.getItem(STORAGE_KEY)) {
                console.log('【Tekqart 最优版】签到页：轮询超时，返回首页。');
                window.location.href = 'https://www.tekqart.com/';
            }
        }, 20000);
    }
})();
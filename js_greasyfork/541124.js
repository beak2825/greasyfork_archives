// ==UserScript==
// @name         SteamTools 自动签到
// @namespace    https://bbs.steamtools.net/
// @version      2.1
// @description  集大成者：流程化点击、智能判断已签到状态、拦截成功回调后记录并自动跳转回首页。
// @author       Riki
// @license      CC-BY-4.0
// @match        https://bbs.steamtools.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541124/SteamTools%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/541124/SteamTools%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'steamtools_last_sign_date_v2'; // 使用新key避免旧数据影响

    function getTodayStr() {
        const d = new Date();
        return d.getFullYear() + '-' +
               String(d.getMonth() + 1).padStart(2, '0') + '-' +
               String(d.getDate()).padStart(2, '0');
    }

    const today = getTodayStr();
    const lastSignDate = localStorage.getItem(STORAGE_KEY);

    // ★ 核心优化1：终极的“每日一次”判断。这是解决您返回首页后重复执行问题的关键。
    // 脚本每次运行（包括跳转回首页后），都会先检查这里。
    if (lastSignDate === today) {
        console.log('【SteamTools 终极版】检测到今天已签到/已处理，脚本终止。');
        return;
    }

    // ★ 核心优化2：更安全的函数拦截机制。
    // 我们不立即拦截，而是设置一个定时器，等待网站定义好该函数后再动手。
    let hookInstalled = false;
    const hookInstaller = setInterval(() => {
        if (typeof window.succeedhandle_signin === 'function' && !hookInstalled) {
            hookInstalled = true;
            const originalSucceed = window.succeedhandle_signin;
            window.succeedhandle_signin = function(href, message, param) {
                console.log('【SteamTools 终极版】拦截到签到成功回调！');
                console.log('记录签到日期并准备跳转回首页...');
                localStorage.setItem(STORAGE_KEY, today);

                // 执行跳转到首页
                window.location.href = 'https://bbs.steamtools.net/';

                // 为确保万一，仍然可以调用原始函数，尽管页面马上要跳转了
                if (typeof originalSucceed === 'function') {
                    // originalSucceed(href, message, param);
                }
            };
            clearInterval(hookInstaller); // 安装成功后停止
            console.log('【SteamTools 终极版】成功拦截succeedhandle_signin函数。');
        }
    }, 200); // 快速检测

    // 步骤1：点击主页“签到领奖”按钮
    const mainCheckInterval = setInterval(() => {
        const mainSignBtn = document.querySelector('a.sign.img_big');
        if (mainSignBtn && mainSignBtn.textContent.includes('签到领奖')) {
            console.log('【SteamTools 终极版】步骤1：找到主签到按钮，点击...');
            mainSignBtn.click();
            clearInterval(mainCheckInterval);
            processSignInPopup();
        }
    }, 1000);

    // 步骤2：处理弹窗，融合了两种判断
    function processSignInPopup() {
        const popupCheckInterval = setInterval(() => {
            const popup = document.getElementById('fwin_content_sign');
            if (!popup) return; // 弹窗还没出来，继续等

            // ★ 核心优化3：合并的弹窗处理逻辑，优先判断“已签到”状态
            const alertErrorDiv = popup.querySelector('div.alert_error p, div.c.cl p'); // 兼容两种可能的错误提示结构
            if (alertErrorDiv && alertErrorDiv.textContent.includes('您今日已经签过到')) {
                console.log('【SteamTools 终极版】检测到“已签到”提示，确认为已完成状态。');
                localStorage.setItem(STORAGE_KEY, today); // 同样记录，防止下次再点

                // 尝试关闭弹窗
                const closeBtn = document.querySelector('#fctrl_sign .flbc');
                if(closeBtn) closeBtn.click();

                clearInterval(popupCheckInterval); // 流程结束
                return;
            }

            // 如果没发现“已签到”提示，则执行签到操作
            const firstMood = popup.querySelector('.dcsignin_list li');
            const confirmBtn = popup.querySelector('button.pn.pnc');
            if (firstMood && confirmBtn) {
                console.log('【SteamTools 终极版】步骤2：弹窗加载，选择心情并提交...');
                firstMood.click();
                confirmBtn.click();
                // 点击后，我们不在这里记录成功，而是等待上面的“函数拦截”部分来处理
                // 因为拦截到回调才是真正的成功信号
                clearInterval(popupCheckInterval); // 提交动作完成，停止检测
            }
        }, 500);
    }
})();
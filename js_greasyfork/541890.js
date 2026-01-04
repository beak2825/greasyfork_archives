// ==UserScript==
// @name         通用网站自动签到工具
// @namespace    https://github.com/baolibaobao/
// @version      2.6 
// @description  一个通用的网站自动签到工具，支持Tampermonkey菜单手动触发和数据清除。
// @author       baobao
// @match        https://lixianla.com/*
// @match        https://70games.net/*
// @match        *://*/*
// @exclude      *://*/*/sg_sign.htm
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue // 确保这里有声明 GM_deleteValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541890/%E9%80%9A%E7%94%A8%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/541890/%E9%80%9A%E7%94%A8%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

// --- 全局配置与提示信息 ---
var APPNAME = "通用自动签到工具";
var ATTEMPT_SIGNIN_MSG = "-----------------------------\n[" + APPNAME + "]\n检测到未签到状态，尝试点击签到按钮。\n-----------------------------";
var ALREADY_SIGNED_MSG = "-----------------------------\n[" + APPNAME + "]\n今日已签到（通过本地存储判断），无需重复操作。\n-----------------------------";
var PAGE_ALREADY_SIGNED_MSG = "-----------------------------\n[" + APPNAME + "]\n页面显示已签到状态，更新本地记录。\n-----------------------------";
var NO_BUTTON_FOUND_MSG = "-----------------------------\n[" + APPNAME + "]\n未找到签到或已签到按钮。可能未登录或页面结构变化。\n-----------------------------";
var MANUAL_TRIGGER_MSG = "-----------------------------\n[" + APPNAME + "]\n通过菜单手动触发签到检查。\n-----------------------------";
var DATA_CLEARED_MSG = "-----------------------------\n[" + APPNAME + "]\n所有网站的签到记录已清除。\n-----------------------------";


(function () {
    'use strict';

    // --- 辅助函数 ---
    function isURL(x) {
        return window.location.href.indexOf(x) !== -1;
    }

    function getTodayDate() {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * 注册网站签到规则
     * @param {string} siteName - 网站名称，用于日志输出和存储键
     * @param {string} urlMatch - 用于isURL判断的URL片段
     * @param {Function} signinLogic - 实际执行签到操作的函数。
     * 返回 'attempted' (已点击), 'already_signed' (页面显示已签到), 'not_found' (未找到按钮)
     */
    function registerSignInRule(siteName, urlMatch, signinLogic) {
        if (isURL(urlMatch)) {
            const storageKey = `lastSignedDate_${siteName}`;
            const today = getTodayDate();

            // 1. 检查本地存储是否已签到 (这是脚本自身的记录)
            const lastSignedDate = GM_getValue(storageKey, '');
            if (lastSignedDate === today) {
                console.log(`[${siteName}]：${ALREADY_SIGNED_MSG}`);
                return true; // 今天已签到，无需操作
            }

            // 2. 如果本地未记录签到，则执行网站特定的签到逻辑
            const result = signinLogic(storageKey, today);

            if (result === 'attempted') {
                console.log(`[${siteName}]：${ATTEMPT_SIGNIN_MSG}`);
            } else if (result === 'already_signed') {
                // 页面显示已签到，更新本地记录
                GM_setValue(storageKey, today);
                console.log(`[${siteName}]：${PAGE_ALREADY_SIGNED_MSG}`);
            } else if (result === 'not_found') {
                console.log(`[${siteName}]：${NO_BUTTON_FOUND_MSG}`);
            }
            return true; // 表示该URL的逻辑已处理
        }
        return false; // 当前URL不匹配此规则
    }

    /**
     * 运行所有注册的签到规则
     * @param {boolean} isManualTrigger - 是否是手动触发
     */
    function runAllSignIns(isManualTrigger = false) {
        if (isManualTrigger) {
            console.log(MANUAL_TRIGGER_MSG);
        }

        // --- 网站签到规则列表 ---
        // 注意：这里的判断顺序很重要，先匹配具体的页面，再匹配通用域名

        // 离线啦签到主页逻辑
        let handled = registerSignInRule(
            "离线啦",
            "lixianla.com",
            function(storageKey, today) {
                // 修正：优先检查已签到状态
                let signedButtonIcon = document.querySelector('a.btn.ft i.icon-calendar-check-o');
                if (signedButtonIcon && signedButtonIcon.closest('a[role="button"]') && signedButtonIcon.closest('a[role="button"]').textContent.includes('已签到')) {
                    return 'already_signed'; // 页面显示已签到
                }

                // 只有在未显示已签到时，才去查找并点击“签到”按钮
                let checkinButton = document.querySelector('button.btn.btn-primary.ft');
                if (checkinButton && checkinButton.querySelector('span') && checkinButton.querySelector('span').textContent.includes('签到')) {
                    checkinButton.click();
                    return 'attempted'; // 尝试点击了
                }

                // 如果两者都没找到
                return 'not_found';
            }
        );
        if (handled) return;

        // 70games.net 签到逻辑
        handled = registerSignInRule(
            "70games.net", // 网站名称
            "70games.net", // 匹配的URL片段
            function(storageKey, today) {
                const signDiv = document.getElementById('sign');

                // 1. 优先检查是否已签到
                if (signDiv && signDiv.textContent.includes('已签')) {
                    return 'already_signed';
                }

                // 2. 如果未签到，检查是否有“签到”按钮并点击
                if (signDiv && signDiv.textContent.includes('签到')) {
                    signDiv.click(); // 点击签到按钮
                    return 'already_signed'; // 70games.net 签到后页面文本会立即变为“已签”
                }

                return 'not_found';
            }
        );
        if (handled) return;


        // --- 其他网站签到规则可在此处继续添加 ---


    }

    // --- 自动运行 (页面加载时执行) ---
    window.setTimeout(function () {
        runAllSignIns(false);
    }, 2800);

    // --- Tampermonkey 菜单命令 ---
    GM_registerMenuCommand("手动执行所有签到", () => {
        runAllSignIns(true);
    });

    GM_registerMenuCommand("清除所有签到记录", () => {
        if (confirm("确定要清除所有网站的签到记录吗？（用于测试）")) {
            // **核心删除逻辑：直接删除所有已知签到记录键**
            // 确保这些键名与你在 registerSignInRule 中使用的 storageKey 完全一致
            const keysToClear = [
                'lastSignedDate_离线啦',
                'lastSignedDate_70games.net'
                // 如果将来添加了其他网站，记得在这里也添加它们的 storageKey
            ];

            console.log("尝试清除以下签到记录:");
            let clearedCount = 0;
            keysToClear.forEach(key => {
                try {
                    GM_deleteValue(key);
                    console.log(`- 已尝试删除键：${key}`);
                    clearedCount++;
                } catch (e) {
                    console.error(`- 删除键 ${key} 失败：`, e);
                }
            });

            if (clearedCount > 0) {
                console.log(DATA_CLEARED_MSG);
                alert(DATA_CLEARED_MSG + "\n请刷新页面以重新检测签到状态。");
            } else {
                console.log("未找到任何需要清除的签到记录。");
                alert("未找到任何需要清除的签到记录。\n请刷新页面。");
            }
        }
    });

})();
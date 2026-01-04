// ==UserScript==
// @name         自动领取星级工会奖励
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  每周三中午12点起，登录后自动领取并关闭页面；未登录时提示；附清除按钮调试用。
// @author       鸢尾素
// @license      GPL-3.0-or-later
// @match        https://lostark.qq.com/cp/a20250303starclub/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536274/%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E6%98%9F%E7%BA%A7%E5%B7%A5%E4%BC%9A%E5%A5%96%E5%8A%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/536274/%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E6%98%9F%E7%BA%A7%E5%B7%A5%E4%BC%9A%E5%A5%96%E5%8A%B1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const storageKey = 'recGiftLastWeekCycle';

    // 🗓️ 获取当前周期 Key（以周三中午12点为起点）
    function getCurrentCycleKey() {
        const now = new Date();
        const day = now.getDay();
        const diffToWednesday = (day < 3 ? - (7 - 3 + day) : 3 - day);
        const wednesday = new Date(now);
        wednesday.setHours(12, 0, 0, 0);
        wednesday.setDate(now.getDate() + diffToWednesday);
        if (now < wednesday) wednesday.setDate(wednesday.getDate() - 7);
        return wednesday.toISOString().slice(0, 10) + "-12";
    }

    const currentCycleKey = getCurrentCycleKey();

    // 🧹 添加清除按钮
    function addResetButton() {
        const btn = document.createElement("button");
        btn.textContent = "🧹 清除领取记录";
        Object.assign(btn.style, {
            position: "fixed",
            bottom: "10px",
            right: "10px",
            zIndex: "9999",
            padding: "8px 12px",
            fontSize: "14px",
            background: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        });
        btn.onclick = () => {
            localStorage.removeItem(storageKey);
            alert("✅ 已清除记录，请刷新页面重试！");
        };
        document.body.appendChild(btn);
    }

    addResetButton();

    // 🔐 登录检测函数
    function isLoggedIn() {
        const role = document.querySelector('#milo-roleName');
        return role && role.textContent.trim().length > 0;
    }

    // 🚀 自动领取逻辑
    async function runAutoClaim() {
        if (localStorage.getItem(storageKey) === currentCycleKey) {
            console.log("✅ 本周期已执行过，跳过领取");
            return;
        }

        localStorage.setItem(storageKey, currentCycleKey);
        console.log("开始领取...");

        for (let i = 1; i <= 8; i++) {
            try {
                recMilestoneGift(i, 0);
                console.log(`✅ 尝试领取：recMilestoneGift(${i}, 0)`);
            } catch (e) {
                console.error(`❌ 领取失败：recMilestoneGift(${i}, 0)`, e);
            }
            await new Promise(res => setTimeout(res, 1000));
        }

        console.log("🎉 领取完毕，准备关闭页面...");
        setTimeout(() => {
            // 替代方法：跳转空白页再尝试关闭，提高兼容性
            window.location.href = "about:blank";
            setTimeout(() => window.close(), 500);
        }, 1000);
    }

    // 👀 等待登录状态变化
    function waitForLoginThenRun() {
        if (isLoggedIn()) {
            runAutoClaim();
            return;
        }

        alert("⚠️ 请先登录游戏角色再刷新页面或等待自动检测。");

        // 监听 #milo-roleName 变化
        const observer = new MutationObserver(() => {
            if (isLoggedIn()) {
                console.log("✅ 检测到登录，执行自动领取");
                observer.disconnect();
                runAutoClaim();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 🚫 屏蔽弹窗
    window.alert = function () {};
    window.confirm = function () { return true; };
    window.prompt = function () { return ""; };

    // 🚀 启动逻辑
    window.addEventListener('load', () => {
        waitForLoginThenRun();
    });
})();
/*
 * Copyright (C) 2025  鸢尾素
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
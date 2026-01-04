// ==UserScript==
// @name         Strict Prover Miner
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  严格模式下的自动挖矿脚本
// @author       Your Name
// @match        https://onprover.orochi.network/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533198/Strict%20Prover%20Miner.user.js
// @updateURL https://update.greasyfork.org/scripts/533198/Strict%20Prover%20Miner.meta.js
// ==/UserScript==

(function autoMine() {
    console.log("🛠️ Auto Prover Script Started");

    // 按钮文字匹配函数
    function isProverButton(el) {
        return el.tagName === "BUTTON" && el.innerText.trim() === "PROVER";
    }

    // 主检测函数
    function checkAndMine() {
        try {
            const buttons = document.querySelectorAll("button");
            const proverBtn = Array.from(buttons).find(isProverButton);

            if (proverBtn) {
                proverBtn.click();
                console.log("⛏️ 已点击 PROVER 按钮，开始挖矿");
            } else {
                console.log("⏳ 没有发现可点击的 PROVER 按钮，可能已在挖矿中");
            }
        } catch (error) {
            console.error("❌ 错误：", error);
        }
    }

    // 每 20 秒检测一次是否处于挖矿状态
    setInterval(checkAndMine, 20 * 1000);

    // 每 5 分钟刷新一次页面
    setInterval(() => {
        console.log("🔄 每5分钟刷新一次页面");
        location.reload();
    }, 5 * 60 * 1000);

    // 页面加载完成后检测挖矿状态
    window.addEventListener('load', () => {
        checkAndMine();
    });

    // 初始运行一次
    checkAndMine();
})();
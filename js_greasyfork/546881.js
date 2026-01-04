// ==UserScript==
// @name         IQRPG Auto Clicker (Boss版, 稀有度彩色显示)
// @namespace    https://iqrpg.com/
// @version      2.0
// @description  每10秒检测并点击指定元素（Boss区最小progress__overlay，width>0%），带浮动Switch开关（可拖动+记忆位置和状态+倒计时+目标显示+稀有度颜色）
// @author       You
// @match        https://*.iqrpg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546881/IQRPG%20Auto%20Clicker%20%28Boss%E7%89%88%2C%20%E7%A8%80%E6%9C%89%E5%BA%A6%E5%BD%A9%E8%89%B2%E6%98%BE%E7%A4%BA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546881/IQRPG%20Auto%20Clicker%20%28Boss%E7%89%88%2C%20%E7%A8%80%E6%9C%89%E5%BA%A6%E5%BD%A9%E8%89%B2%E6%98%BE%E7%A4%BA%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "iqrpg_auto_clicker_config";
    let config = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        enabled: true,
        posX: 20,
        posY: 80
    };

    let intervalId = null;
    let countdownId = null;
    let countdown = 10;

    // ================= 主逻辑 =================
    function checkAndClick() {
        let el = document.querySelector('div.margin-bottom-medium > a:nth-child(1)');
        if (el) {
            el.click();
            console.log('[IQRPG Auto Clicker] 已点击元素 div.margin-bottom-medium > a:nth-child(1):', el);
            updateTargetInfo("按钮", "--", "1");
        } else {
            // 找 Boss 区域
            const bossSection = Array.from(document.querySelectorAll(".main-section"))
                .find(sec => {
                    const title = sec.querySelector(".main-section__title p");
                    return title && title.textContent.trim() === "Boss";
                });

            let minEl = null;
            let minVal = Infinity;
            let bossName = "";
            let bossRarity = "1";

            if (bossSection) {
                // 在 Boss 区域里找 progress__overlay，要求 width > 0%
                const overlays = Array.from(bossSection.querySelectorAll("div.progress__overlay"))
                    .filter(div => {
                        const match = div.style.width.match(/([\d.]+)%/);
                        if (!match) return false;
                        const val = parseFloat(match[1]);
                        return val > 0;
                    });

                overlays.forEach(div => {
                    const match = div.style.width.match(/([\d.]+)%/);
                    if (match) {
                        const val = parseFloat(match[1]);
                        if (val > 0 && val < minVal) {
                            minVal = val;
                            minEl = div;
                            // 找 Boss 名称（支持 text-rarity-1 ~ text-rarity-4）
                            const bossDiv = div.closest(".boss");
                            if (bossDiv) {
                                const nameEl = bossDiv.querySelector("p[class^='text-rarity-']");
                                if (nameEl) {
                                    bossName = nameEl.textContent.trim();
                                    bossRarity = nameEl.className.match(/text-rarity-(\d)/)?.[1] || "1";
                                }
                            }
                        }
                    }
                });
            }

            if (minEl) {
                minEl.click();
                console.log(`[IQRPG Auto Clicker] 已点击 Boss《${bossName}》, 稀有度 ${bossRarity}, 最小百分比 ${minVal}%`, minEl);
                updateTargetInfo(bossName, minVal.toFixed(2) + "%", bossRarity);
            } else {
                console.log('[IQRPG Auto Clicker] 没有找到 Boss 区域内 width > 0% 的 progress__overlay');
                updateTargetInfo("未找到", "--", "1");
            }
        }
        countdown = 10; // 重置倒计时
    }

    function startAutoClicker() {
        if (!intervalId) {
            intervalId = setInterval(checkAndClick, 10 * 1000);
            console.log("[IQRPG Auto Clicker] 自动点击已开启 (间隔 10s)");
        }
        if (!countdownId) {
            countdownId = setInterval(updateCountdown, 1000);
        }
    }

    function stopAutoClicker() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        if (countdownId) {
            clearInterval(countdownId);
            countdownId = null;
        }
        console.log("[IQRPG Auto Clicker] 自动点击已停止");
    }

    function saveConfig() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }

    function updateCountdown() {
        if (countdown > 0) countdown--;
        countdownSpan.textContent = countdown + "s";
    }

    function updateTargetInfo(name, percent, rarity="1") {
        targetName.textContent = name;
        targetPercent.textContent = percent;
        // 稀有度颜色
        const colors = {
            "1": "white",
            "2": "limegreen",
            "3": "deepskyblue",
            "4": "gold"
        };
        targetName.style.color = colors[rarity] || "white";
    }

    // ================= UI面板 =================
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.left = config.posX + "px";
    panel.style.top = config.posY + "px";
    panel.style.zIndex = 99999;
    panel.style.background = "rgba(30,30,30,0.9)";
    panel.style.color = "#fff";
    panel.style.padding = "10px 14px";
    panel.style.borderRadius = "12px";
    panel.style.fontSize = "14px";
    panel.style.cursor = "move";
    panel.style.userSelect = "none";
    panel.style.boxShadow = "0 2px 8px rgba(0,0,0,0.4)";
    panel.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;">
            <span>自动点击事件：</span>
            <label class="switch">
                <input type="checkbox" id="autoClickToggle" ${config.enabled ? "checked" : ""}>
                <span class="slider"></span>
            </label>
        </div>
        <div style="margin-top:6px;">距离下次点击：<span id="countdownText">--s</span></div>
        <div style="margin-top:6px;">目标：<span id="targetName">--</span> (<span id="targetPercent">--</span>)</div>
    `;
    document.body.appendChild(panel);

    // === switch 样式 ===
    const style = document.createElement("style");
    style.textContent = `
        .switch {
            position: relative;
            display: inline-block;
            width: 42px;
            height: 22px;
        }
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #ccc;
            transition: .3s;
            border-radius: 22px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
        }
        .switch input:checked + .slider {
            background-color: #4CAF50;
        }
        .switch input:checked + .slider:before {
            transform: translateX(20px);
        }
    `;
    document.head.appendChild(style);

    const toggle = panel.querySelector("#autoClickToggle");
    const countdownSpan = panel.querySelector("#countdownText");
    const targetName = panel.querySelector("#targetName");
    const targetPercent = panel.querySelector("#targetPercent");

    toggle.addEventListener("change", () => {
        config.enabled = toggle.checked;
        saveConfig();
        if (config.enabled) {
            countdown = 10;
            startAutoClicker();
        } else {
            stopAutoClicker();
            countdownSpan.textContent = "--s";
            updateTargetInfo("--", "--", "1");
        }
    });

    // === 拖动功能 ===
    let dragging = false;
    let offsetX, offsetY;

    panel.addEventListener("mousedown", (e) => {
        if (e.target.tagName.toLowerCase() === "input") return; // 不干扰开关
        dragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
        if (dragging) {
            panel.style.left = (e.clientX - offsetX) + "px";
            panel.style.top = (e.clientY - offsetY) + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        if (dragging) {
            dragging = false;
            config.posX = panel.offsetLeft;
            config.posY = panel.offsetTop;
            saveConfig();
        }
    });

    // === 初始化 ===
    if (config.enabled) {
        countdown = 10;
        startAutoClicker();
    } else {
        countdownSpan.textContent = "--s";
        updateTargetInfo("--", "--", "1");
    }

    console.log("[IQRPG Auto Clicker] 脚本已启动");
})();

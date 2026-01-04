// ==UserScript==
// @name         B站评论区等级图片用户去重统计【累积统计+重复次数记录（除首次）+加速下拉+6/h归组+自动展开回复】 
// @namespace    http://tampermonkey.net/
// @version      2.4.2
// @description  自动下拉加载页面，并累积统计整个页面中评论区内的用户等级数据（包括翻页前的内容）。每个评论区只处理一次，累积所有数据：对同一用户在同一等级只计数一次，同时记录重复次数（即每个用户出现次数减 1）；等级1~5分别统计，等级6与h归为一组并单独记录h占比。遇到“点击查看”或“下一页”按钮时暂停下拉，先展开回复后再继续下拉。支持嵌套 shadow DOM。新增：控制面板按钮样式更醒目；覆盖层中增加累计用户（包括重复）统计。
// @author
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525669/B%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%AD%89%E7%BA%A7%E5%9B%BE%E7%89%87%E7%94%A8%E6%88%B7%E5%8E%BB%E9%87%8D%E7%BB%9F%E8%AE%A1%E3%80%90%E7%B4%AF%E7%A7%AF%E7%BB%9F%E8%AE%A1%2B%E9%87%8D%E5%A4%8D%E6%AC%A1%E6%95%B0%E8%AE%B0%E5%BD%95%EF%BC%88%E9%99%A4%E9%A6%96%E6%AC%A1%EF%BC%89%2B%E5%8A%A0%E9%80%9F%E4%B8%8B%E6%8B%89%2B6h%E5%BD%92%E7%BB%84%2B%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%9B%9E%E5%A4%8D%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/525669/B%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%AD%89%E7%BA%A7%E5%9B%BE%E7%89%87%E7%94%A8%E6%88%B7%E5%8E%BB%E9%87%8D%E7%BB%9F%E8%AE%A1%E3%80%90%E7%B4%AF%E7%A7%AF%E7%BB%9F%E8%AE%A1%2B%E9%87%8D%E5%A4%8D%E6%AC%A1%E6%95%B0%E8%AE%B0%E5%BD%95%EF%BC%88%E9%99%A4%E9%A6%96%E6%AC%A1%EF%BC%89%2B%E5%8A%A0%E9%80%9F%E4%B8%8B%E6%8B%89%2B6h%E5%BD%92%E7%BB%84%2B%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%9B%9E%E5%A4%8D%E3%80%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------------------- 配置参数 ----------------------
    const config = {
        autoScrollStep: 700,             // 每次下拉的像素值
        autoScrollDelay: 200,            // 下拉间隔时间（毫秒）
        updateIntervalTime: 2000,        // 定时更新统计数据的间隔（毫秒）
        expandClickDelay: 1000,          // 每次点击“点击查看”或“下一页”按钮后的等待时间（毫秒）
        scrollWaitAfterExpand: 1000,     // 展开完成后等待时间再恢复下拉（毫秒）
        observerDebounceDelay: 1000      // MutationObserver 的防抖延时（毫秒）
    };

    // ---------------------- 全局变量 ----------------------
    let isRunning = false;             // 当前是否正在统计
    let updateTimer = null;            // 定时更新统计的定时器
    let observer = null;               // MutationObserver 实例
    let observerDebounceTimeout = null; // 防抖定时器

    // 全局累积数据：记录各等级中已处理的评论用户
    const globalCounts = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6h": 0
    };
    const globalUnique = {
        "1": new Set(),
        "2": new Set(),
        "3": new Set(),
        "4": new Set(),
        "5": new Set(),
        "6h": new Set(), // 合并等级6与h
        "h": new Set()   // 专门记录标记为 "h" 的用户
    };
    let previousStats = null;  // 保存上一次统计结果（用于对比数据变化）

    // ---------------------- 工具函数 ----------------------
    /**
     * 递归查找指定选择器对应的所有元素，包括所有嵌套的 open shadow DOM 内的元素
     * @param {string} selector - CSS 选择器，如 "div#info" 或 "button"
     * @param {Node} root - 查找起始节点，默认为 document
     * @returns {Element[]} - 匹配的元素数组
     */
    function deepQuerySelectorAll(selector, root = document) {
        let results = Array.from(root.querySelectorAll(selector));
        const elements = root.querySelectorAll("*");
        for (const el of elements) {
            if (el.shadowRoot) {
                results = results.concat(deepQuerySelectorAll(selector, el.shadowRoot));
            }
        }
        return results;
    }

    /**
     * 获取按钮显示的文本内容。优先使用 innerText，如为空则尝试从内部 slot 获取。
     * @param {HTMLElement} btn
     * @returns {string}
     */
    function getButtonLabel(btn) {
        let label = btn.innerText && btn.innerText.trim();
        if (label) return label;
        const labelSpan = btn.querySelector("span.button__label");
        if (labelSpan) {
            const slotElem = labelSpan.querySelector("slot");
            if (slotElem && typeof slotElem.assignedNodes === "function") {
                label = slotElem.assignedNodes({ flatten: true })
                    .map(node => node.textContent)
                    .join("").trim();
                if (label) return label;
            }
            return labelSpan.textContent.trim();
        }
        return "";
    }

    /**
     * 检查页面中是否存在待展开的按钮（文本中包含“点击查看”或“下一页”，不区分大小写）。
     * @returns {boolean} 存在至少一个此类按钮返回 true，否则返回 false。
     */
    function hasExpansionButtons() {
        const buttons = deepQuerySelectorAll("button");
        return buttons.some(btn => {
            const label = getButtonLabel(btn);
            if (!label) return false;
            const lower = label.toLowerCase();
            return lower.includes("点击查看") || lower.includes("下一页");
        });
    }

    // ---------------------- 累积统计相关函数 ----------------------
    /**
     * 遍历当前页面中的评论区（div#info），提取用户ID和等级图片，
     * 对于未处理的评论区（未标记 data-processed），根据评论中等级信息更新全局累积数据。
     */
    function updateAggregatedData() {
        const infoAreas = deepQuerySelectorAll("div#info");
        infoAreas.forEach(info => {
            // 已处理过则跳过
            if (info.getAttribute("data-processed") === "true") return;
            const userNameElem = info.querySelector("div#user-name");
            if (!userNameElem) return;
            const userId = userNameElem.getAttribute("data-user-profile-id");
            if (!userId) return;
            const levelElem = info.querySelector("div#user-level img");
            if (!levelElem) return;
            const src = levelElem.getAttribute("src") || levelElem.getAttribute("data-src") || "";
            const match = src.match(/level_([1-6]|h)\.svg(\?.*)?$/i);
            if (match) {
                let level = match[1].toLowerCase();
                if (["1", "2", "3", "4", "5"].includes(level)) {
                    globalCounts[level] = (globalCounts[level] || 0) + 1;
                    globalUnique[level].add(userId);
                } else if (level === "6" || level === "h") {
                    globalCounts["6h"] = (globalCounts["6h"] || 0) + 1;
                    globalUnique["6h"].add(userId);
                    if (level === "h") {
                        globalUnique["h"].add(userId);
                    }
                }
            }
            // 标记为已处理，避免重复统计
            info.setAttribute("data-processed", "true");
        });
    }

    /**
     * 根据全局累积数据计算统计结果，返回统计数据对象。
     * @returns {object}
     */
    function getAggregatedStats() {
        const counts = {
            "1": globalUnique["1"].size,
            "2": globalUnique["2"].size,
            "3": globalUnique["3"].size,
            "4": globalUnique["4"].size,
            "5": globalUnique["5"].size
        };
        const count6h = globalUnique["6h"].size;
        const countH = globalUnique["h"].size;
        const totalUnique = Object.values(counts).reduce((sum, cnt) => sum + cnt, 0) + count6h;
        // 计算重复次数：每个等级重复次数 = 全部出现次数 - 唯一数
        const dup = {
            "1": (globalCounts["1"] || 0) - globalUnique["1"].size,
            "2": (globalCounts["2"] || 0) - globalUnique["2"].size,
            "3": (globalCounts["3"] || 0) - globalUnique["3"].size,
            "4": (globalCounts["4"] || 0) - globalUnique["4"].size,
            "5": (globalCounts["5"] || 0) - globalUnique["5"].size,
            "6h": (globalCounts["6h"] || 0) - globalUnique["6h"].size
        };
        const totalDup = Object.values(dup).reduce((sum, d) => sum + d, 0);
        // 计算累计所有出现的次数（包括重复），即全局累计的评论区数
        const totalIncludingDuplicates =
            (globalCounts["1"] || 0) +
            (globalCounts["2"] || 0) +
            (globalCounts["3"] || 0) +
            (globalCounts["4"] || 0) +
            (globalCounts["5"] || 0) +
            (globalCounts["6h"] || 0);
        return { counts, count6h, countH, totalUnique, duplicate: totalDup, duplicateByLevel: dup, totalIncludingDuplicates };
    }

    /**
     * 累积更新统计数据，并在控制台输出变化信息，同时更新页面右侧的覆盖层显示数据。
     */
    function updateStatistics() {
        updateAggregatedData();
        const data = getAggregatedStats();

        console.log("累计重复次数：", data.duplicate, "; 各等级重复情况：", data.duplicateByLevel);

        if (previousStats) {
            for (const level in data.counts) {
                const prev = previousStats.counts[level] || 0;
                const curr = data.counts[level] || 0;
                if (curr < prev) {
                    console.log(`统计减少：level_${level} 从 ${prev} 下降到 ${curr}。可能原因：页面更新或部分评论被替换。`);
                }
            }
            if (data.count6h < previousStats.count6h) {
                console.log(`统计减少：level_6/h 从 ${previousStats.count6h} 下降到 ${data.count6h}。可能原因：页面更新或评论折叠。`);
            }
            if (data.totalUnique < previousStats.totalUnique) {
                console.log(`总统计减少：总用户数从 ${previousStats.totalUnique} 下降到 ${data.totalUnique}。`);
            }
        }
        previousStats = data;
        updateOverlay(data);
    }

    /**
     * 更新或创建覆盖层，显示当前统计结果。
     * @param {object} data 统计数据对象
     */
    function updateOverlay(data) {
        let overlay = document.getElementById("levelStatsOverlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "levelStatsOverlay";
            overlay.style.position = "fixed";
            overlay.style.top = "60px";
            overlay.style.right = "10px";
            overlay.style.zIndex = "9999";
            overlay.style.backgroundColor = "rgba(0,0,0,0.7)";
            overlay.style.color = "#fff";
            overlay.style.padding = "10px";
            overlay.style.borderRadius = "5px";
            overlay.style.fontSize = "14px";
            overlay.style.lineHeight = "1.5";
            document.body.appendChild(overlay);
        }
        const { counts, count6h, countH, totalUnique, duplicate, duplicateByLevel, totalIncludingDuplicates } = data;
        let html = `<div style="font-weight:bold; margin-bottom:5px;">评论区等级统计</div>`;
        if (totalUnique === 0) {
            html += `<div>当前统计：0</div>`;
        } else {
            html += `<div>累计用户数（唯一）：${totalUnique}</div>`;
            html += `<div>累计用户（包括重复）：${totalIncludingDuplicates}</div>`;
            for (const level in counts) {
                const cnt = counts[level];
                const percent = totalUnique ? ((cnt / totalUnique) * 100).toFixed(2) : "0.00";
                html += `<div>level_${level}: ${cnt} 个 （${percent}%）</div>`;
            }
            if (count6h > 0) {
                const combinedPercent = totalUnique ? ((count6h / totalUnique) * 100).toFixed(2) : "0.00";
                const hPercent = count6h ? ((countH / count6h) * 100).toFixed(2) : "0.00";
                html += `<div>level_6/h: ${count6h} 个 （${combinedPercent}%）</div>`;
                html += `<div style="margin-left:10px;">其中 h: ${countH} 个 （${hPercent}% of 6/h）</div>`;
            }
            html += `<div style="margin-top:5px; color:#ff0;">累计重复次数（除首次）：${duplicate}</div>`;
        }
        overlay.innerHTML = html;
    }

    // ---------------------- 自动下拉与自动展开 ----------------------
    /**
     * 递归展开所有“点击查看”或“下一页”按钮对应的回复，
     * 直到页面中不再检测到此类按钮为止。
     */
    async function expandRepliesRecursively() {
        while (true) {
            const buttons = deepQuerySelectorAll("button").filter(btn => {
                const label = getButtonLabel(btn);
                return label && (label.toLowerCase().includes("点击查看") || label.toLowerCase().includes("下一页"));
            });
            if (buttons.length === 0) break;
            const btn = buttons[0];
            btn.scrollIntoView({ block: 'center', inline: 'nearest' });
            try {
                btn.click();
                console.log("点击展开按钮：", getButtonLabel(btn));
            } catch (e) {
                console.error("点击展开按钮失败：", e);
            }
            await new Promise(resolve => setTimeout(resolve, config.expandClickDelay));
        }
    }

    /**
     * 自动下拉加载页面的主循环：
     * 1. 检测是否存在待展开的按钮，若存在则暂停下拉并先展开回复；
     * 2. 否则执行下拉操作；
     * 3. 到达页面底部后结束循环。
     */
    async function autoScrollLoop() {
        while (isRunning) {
            if (hasExpansionButtons()) {
                console.log("检测到待展开按钮，暂停下拉等待展开...");
                await expandRepliesRecursively();
                console.log(`展开完成，等待 ${config.scrollWaitAfterExpand}ms 后恢复下拉...`);
                await new Promise(resolve => setTimeout(resolve, config.scrollWaitAfterExpand));
            } else {
                window.scrollBy(0, config.autoScrollStep);
            }
            // 若已经到达页面底部，则停止自动下拉
            if ((window.innerHeight + window.pageYOffset) >= document.body.scrollHeight - 10) {
                console.log("已到达页面底部，停止自动下拉。");
                break;
            }
            await new Promise(resolve => setTimeout(resolve, config.autoScrollDelay));
        }
    }

    // ---------------------- MutationObserver 监听 ----------------------
    /**
     * 启动 MutationObserver，监听 DOM 变化（子节点变化及 subtree），
     * 防抖后调用 updateStatistics() 更新统计数据。
     */
    function startObserver() {
        observer = new MutationObserver(() => {
            if (observerDebounceTimeout) clearTimeout(observerDebounceTimeout);
            observerDebounceTimeout = setTimeout(() => {
                updateStatistics();
            }, config.observerDebounceDelay);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ---------------------- 启动与暂停 ----------------------
    /**
     * 开始统计流程：
     * 1. 启动自动下拉加载；
     * 2. 启动定时更新统计数据；
     * 3. 启动 MutationObserver 监听 DOM 变化。
     */
    function startProcess() {
        if (isRunning) return;
        isRunning = true;
        console.log("开始实时统计……");
        // 启动自动下拉加载（异步循环）
        autoScrollLoop();
        // 启动定时更新统计数据
        updateTimer = setInterval(updateStatistics, config.updateIntervalTime);
        // 启动 DOM 变化监听
        startObserver();
    }

    /**
     * 暂停/取消统计流程：
     * 停止自动下拉、定时更新和 MutationObserver 监听。
     */
    function pauseProcess() {
        if (!isRunning) return;
        isRunning = false;
        console.log("暂停/取消统计");
        if (updateTimer) {
            clearInterval(updateTimer);
            updateTimer = null;
        }
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        if (observerDebounceTimeout) {
            clearTimeout(observerDebounceTimeout);
            observerDebounceTimeout = null;
        }
    }

    // ---------------------- 控制面板 ----------------------
    /**
     * 创建页面右上角的控制面板，包含“开始统计”和“暂停/取消”按钮。
     */
    function createControlPanel() {
        if (document.getElementById("controlPanel")) return;
        const panel = document.createElement("div");
        panel.id = "controlPanel";
        panel.style.position = "fixed";
        panel.style.top = "10px";
        panel.style.right = "10px";
        panel.style.zIndex = "10000";
        panel.style.backgroundColor = "rgba(0,0,0,0.7)";
        panel.style.padding = "10px";
        panel.style.borderRadius = "5px";
        panel.style.fontSize = "14px";
        panel.style.color = "#fff";

        const startBtn = document.createElement("button");
        startBtn.textContent = "开始统计";
        startBtn.style.marginRight = "5px";
        // 增加醒目样式
        startBtn.style.backgroundColor = "#4CAF50";  // 绿色背景
        startBtn.style.color = "#fff";
        startBtn.style.border = "none";
        startBtn.style.padding = "5px 10px";
        startBtn.style.borderRadius = "3px";
        startBtn.style.cursor = "pointer";
        startBtn.addEventListener("click", startProcess);
        panel.appendChild(startBtn);

        const pauseBtn = document.createElement("button");
        pauseBtn.textContent = "暂停/取消";
        // 增加醒目样式
        pauseBtn.style.backgroundColor = "#F44336";  // 红色背景
        pauseBtn.style.color = "#fff";
        pauseBtn.style.border = "none";
        pauseBtn.style.padding = "5px 10px";
        pauseBtn.style.borderRadius = "3px";
        pauseBtn.style.cursor = "pointer";
        pauseBtn.addEventListener("click", pauseProcess);
        panel.appendChild(pauseBtn);

        document.body.appendChild(panel);
    }

    // ---------------------- 初始化 ----------------------
    createControlPanel();

})();

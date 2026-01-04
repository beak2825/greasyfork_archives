// ==UserScript==
// @name         優化版風險等級顯示器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  攔截回應並顯示風險等級，支持拖動、測試和風險指示
// @author       Claude
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530628/%E5%84%AA%E5%8C%96%E7%89%88%E9%A2%A8%E9%9A%AA%E7%AD%89%E7%B4%9A%E9%A1%AF%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/530628/%E5%84%AA%E5%8C%96%E7%89%88%E9%A2%A8%E9%9A%AA%E7%AD%89%E7%B4%9A%E9%A1%AF%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // 初始位置 - 如果有儲存的位置則使用，否則預設
    const savedPosition = localStorage.getItem('riskIndicatorPosition');
    const initialPosition = savedPosition ? JSON.parse(savedPosition) : { top: 100 };

    // 建立主要容器
    const container = document.createElement("div");
    container.id = "risk-indicator-container";
    container.style.position = "fixed";
    container.style.top = `${initialPosition.top}px`;
    container.style.right = "0";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "row";
    container.style.alignItems = "flex-start";
    container.style.fontFamily = "'Arial', sans-serif";
    document.body.appendChild(container);

    // 建立展開後的詳細資訊面板
    const panel = document.createElement("div");
    panel.id = "risk-details-panel";
    panel.style.backgroundColor = "#222";
    panel.style.color = "#eee";
    panel.style.padding = "12px";
    panel.style.borderRadius = "6px 0 0 6px";
    panel.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    panel.style.width = "260px";
    panel.style.transform = "translateX(100%)";
    panel.style.transition = "transform 0.3s ease";
    panel.style.display = "flex";
    panel.style.flexDirection = "column";
    panel.style.gap = "8px";
    container.appendChild(panel);

    // 建立收起狀態的指示器
    const indicator = document.createElement("div");
    indicator.id = "risk-indicator";
    indicator.style.width = "8px";
    indicator.style.height = "120px";
    indicator.style.backgroundColor = "#555";
    indicator.style.borderRadius = "3px 0 0 3px";
    indicator.style.opacity = "0.8";
    indicator.style.cursor = "pointer";
    indicator.style.position = "absolute";
    indicator.style.right = "0";
    indicator.style.top = "40px"; // 在拖動區域下方
    indicator.style.zIndex = "-1"; // 確保在面板後面
    container.appendChild(indicator);

    // 加入標題和拖動區域
    const titleBar = document.createElement("div");
    titleBar.style.display = "flex";
    titleBar.style.justifyContent = "space-between";
    titleBar.style.alignItems = "center";
    titleBar.style.cursor = "move"; // 指示可拖動
    titleBar.style.padding = "4px 0";
    titleBar.style.marginBottom = "6px";
    titleBar.style.borderBottom = "1px solid #444";
    panel.appendChild(titleBar);

    // 加入標題
    const title = document.createElement("div");
    title.style.fontWeight = "bold";
    title.style.fontSize = "16px";
    title.innerHTML = "風險等級分析";
    titleBar.appendChild(title);

    // 加入關閉按鈕
    const closeBtn = document.createElement("div");
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "20px";
    closeBtn.style.lineHeight = "16px";
    closeBtn.innerHTML = "×";
    closeBtn.title = "收起面板";
    titleBar.appendChild(closeBtn);

    // 加入風險等級指示
    const riskLevel = document.createElement("div");
    riskLevel.id = "risk-level";
    riskLevel.style.display = "flex";
    riskLevel.style.alignItems = "center";
    riskLevel.style.gap = "8px";
    riskLevel.style.padding = "8px";
    riskLevel.style.borderRadius = "4px";
    riskLevel.style.backgroundColor = "#333";
    riskLevel.style.marginBottom = "8px";
    panel.appendChild(riskLevel);

    // 加入風險值橫條指示器
    const riskBarContainer = document.createElement("div");
    riskBarContainer.style.width = "100%";
    riskBarContainer.style.height = "30px";
    riskBarContainer.style.borderRadius = "4px";
    riskBarContainer.style.position = "relative";
    riskBarContainer.style.marginBottom = "12px";
    riskBarContainer.style.overflow = "hidden";
    panel.appendChild(riskBarContainer);

    // 風險橫條背景（漸變色）
    const riskBarBackground = document.createElement("div");
    riskBarBackground.style.width = "100%";
    riskBarBackground.style.height = "100%";
    riskBarBackground.style.background = "linear-gradient(to right, #2a9d8f, #859F3D, #FAB12F, #e63946)";
    riskBarBackground.style.borderRadius = "4px";
    riskBarContainer.appendChild(riskBarBackground);

    // 風險橫條中的標籤
    const riskBarLabels = document.createElement("div");
    riskBarLabels.style.display = "flex";
    riskBarLabels.style.justifyContent = "space-between";
    riskBarLabels.style.width = "100%";
    riskBarLabels.style.padding = "0 8px";
    riskBarLabels.style.fontSize = "10px";
    riskBarLabels.style.color = "#fff";
    riskBarLabels.style.textShadow = "0px 0px 2px #000";
    riskBarLabels.style.position = "absolute";
    riskBarLabels.style.top = "8px";
    riskBarLabels.style.boxSizing = "border-box";
    riskBarLabels.innerHTML = "<span>正常</span><span>低風險</span><span>中風險</span><span>高風險</span>";
    riskBarContainer.appendChild(riskBarLabels);

    // 風險值指示器
    const riskPointer = document.createElement("div");
    riskPointer.id = "risk-pointer";
    riskPointer.style.width = "4px";
    riskPointer.style.height = "30px";
    riskPointer.style.backgroundColor = "#fff";
    riskPointer.style.position = "absolute";
    riskPointer.style.left = "50%";
    riskPointer.style.top = "0px";
    riskPointer.style.transition = "left 0.5s ease";
    riskPointer.style.boxShadow = "0px 0px 5px rgba(0,0,0,0.5)";
    riskBarContainer.appendChild(riskPointer);

    // 加入難度指示
    const difficultyInfo = document.createElement("div");
    difficultyInfo.id = "difficulty-info";
    difficultyInfo.style.fontSize = "13px";
    difficultyInfo.style.padding = "8px";
    difficultyInfo.style.backgroundColor = "#333";
    difficultyInfo.style.borderRadius = "4px";
    panel.appendChild(difficultyInfo);

    // 加入解釋說明區域
    const explanation = document.createElement("div");
    explanation.id = "explanation";
    explanation.style.fontSize = "12px";
    explanation.style.marginTop = "8px";
    explanation.style.color = "#aaa";
    panel.appendChild(explanation);

    // 加入時間區域
    const timestamp = document.createElement("div");
    timestamp.id = "timestamp";
    timestamp.style.fontSize = "11px";
    timestamp.style.marginTop = "8px";
    timestamp.style.color = "#888";
    panel.appendChild(timestamp);

    // 風險等級判斷函式
    function getRiskColorAndLevel(difficulty) {
        // 處理 16 進制並轉換為 10 進制
        const decimalValue = hexToDecimal(difficulty);

        // 處理前綴為 0x 的十六進制值
        const cleanDifficulty = difficulty.startsWith("0x")
            ? difficulty.slice(2)
            : difficulty;
        // 移除前導零以判斷實際難度（零的數量）
        const trimmedDifficulty = cleanDifficulty.replace(/^0+/, "");
        const riskLevel = trimmedDifficulty.length;

        // 計算風險指示器的位置百分比 (反向：左邊正常，右邊高風險)
        let pointerPosition;

        if (trimmedDifficulty === "未知") {
            pointerPosition = 95; // 高風險位置
            return {
                color: "#e63946",
                ipRiskLevel: "未知",
                explanation: "無法判斷風險等級，請謹慎操作。",
                pointerPosition: pointerPosition,
                decimalValue: "未知"
            };
        }

        switch (riskLevel) {
            case 0:
            case 1:
            case 2:
                pointerPosition = 95; // 高風險位置（右側）
                return {
                    color: "#e63946",
                    ipRiskLevel: "高風險",
                    explanation: "此連線具有高風險特徵，可能存在安全隱患，建議謹慎使用。",
                    pointerPosition: pointerPosition,
                    decimalValue: decimalValue
                };
            case 3:
                pointerPosition = 65; // 中風險位置
                return {
                    color: "#FAB12F",
                    ipRiskLevel: "中風險",
                    explanation: "此連線具有某些風險特徵，建議注意使用。",
                    pointerPosition: pointerPosition,
                    decimalValue: decimalValue
                };
            case 4:
                pointerPosition = 35; // 低風險位置
                return {
                    color: "#859F3D",
                    ipRiskLevel: "低風險",
                    explanation: "此連線具有較低風險，但仍建議保持警覺。",
                    pointerPosition: pointerPosition,
                    decimalValue: decimalValue
                };
            case 5:
                pointerPosition = 5; // 正常位置（左側）
                return {
                    color: "#2a9d8f",
                    ipRiskLevel: "正常",
                    explanation: "此連線正常，未檢測到明顯風險特徵。",
                    pointerPosition: pointerPosition,
                    decimalValue: decimalValue
                };
            default:
                pointerPosition = 5; // 正常位置
                return {
                    color: "#2a9d8f",
                    ipRiskLevel: "奇怪！",
                    explanation: "檢測到異常值，但似乎為低風險。",
                    pointerPosition: pointerPosition,
                    decimalValue: decimalValue
                };
        }
    }

    // 16 進制轉 10 進制函數
    function hexToDecimal(hexValue) {
        try {
            // 處理前綴為 0x 的十六進制值
            const cleanHex = hexValue.startsWith("0x") ? hexValue.slice(2) : hexValue;

            // 如果不是有效的十六進制值，返回原始值
            if (!/^[0-9a-fA-F]+$/.test(cleanHex)) {
                return hexValue;
            }

            // 使用 parseInt 轉換為十進制，基數為 16
            const decimal = parseInt(cleanHex, 16);
            return decimal.toString();
        } catch (e) {
            return "轉換錯誤";
        }
    }

    // 更新風險顯示
    function updateRiskDisplay(difficulty) {
        const result = getRiskColorAndLevel(difficulty);
        const now = new Date();
        const timeString = now.toLocaleTimeString();

        // 更新收起狀態的指示條顏色
        indicator.style.backgroundColor = result.color;

        // 更新詳細資訊面板
        riskLevel.innerHTML = `
            <span style="font-size:16px; color:${result.color};">■</span>
            <span>${result.ipRiskLevel}</span>
        `;

        // 更新風險指標位置
        riskPointer.style.left = `${result.pointerPosition}%`;

        // 更新難度資訊
        difficultyInfo.innerHTML = `
            <div><strong>難度值:</strong> ${difficulty}</div>
            <div><strong>十進制值:</strong> ${result.decimalValue}</div>
        `;

        // 更新說明
        explanation.textContent = result.explanation;

        // 更新時間戳
        timestamp.textContent = `最後更新: ${timeString}`;
    }

    // 初始化未知風險
    updateRiskDisplay("未知");

    // 實現拖動功能
    let isDragging = false;
    let dragStartY = 0;
    let containerStartY = 0;

    titleBar.addEventListener("mousedown", function(e) {
        isDragging = true;
        dragStartY = e.clientY;
        containerStartY = parseInt(container.style.top, 10);
        document.body.style.userSelect = 'none'; // 防止拖動時選中文本
        e.preventDefault();
    });

    document.addEventListener("mousemove", function(e) {
        if (isDragging) {
            const newY = containerStartY + e.clientY - dragStartY;
            container.style.top = `${Math.max(0, Math.min(window.innerHeight - 150, newY))}px`;
        }
    });

    document.addEventListener("mouseup", function() {
        if (isDragging) {
            isDragging = false;
            document.body.style.userSelect = '';
            // 儲存位置
            localStorage.setItem('riskIndicatorPosition', JSON.stringify({
                top: parseInt(container.style.top, 10)
            }));
        }
    });

    // 滑鼠接近時展開面板
    document.addEventListener("mousemove", function(e) {
        const containerRect = container.getBoundingClientRect();
        const distanceX = Math.max(0, containerRect.left - e.clientX);

        if (distanceX < 20 &&
            e.clientY >= containerRect.top &&
            e.clientY <= containerRect.bottom) {
            panel.style.transform = "translateX(0)";
        } else if (distanceX > 100 ||
                  e.clientY < containerRect.top - 50 ||
                  e.clientY > containerRect.bottom + 50) {
            panel.style.transform = "translateX(100%)";
        }
    });

    // 點擊指示條展開面板
    indicator.addEventListener("click", function() {
        panel.style.transform = "translateX(0)";
    });

    // 關閉按鈕點擊事件
    closeBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        panel.style.transform = "translateX(100%)";
    });


    // 修改：攔截 fetch 請求（只針對 chat-requirements 請求）
    const originalFetch = window.fetch;
    window.fetch = async function() {
        const url = arguments[0];
        const response = await originalFetch.apply(this, arguments);

        // 只處理包含 chat-requirements 的請求
        if (typeof url === 'string' && url.includes('chat-requirements')) {
            const clonedResponse = response.clone();
            try {
                const data = await clonedResponse.json();
                if (data && data.proofofwork && data.proofofwork.difficulty) {
                    const difficulty = data.proofofwork.difficulty;
                    updateRiskDisplay(difficulty);
                }
            } catch (e) {
                // 忽略解析錯誤
            }
        }

        return response;
    };

    // 修改：攔截 XMLHttpRequest 請求（只針對 chat-requirements 請求）
    const origXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        const url = arguments[1];

        // 只處理包含 chat-requirements 的請求
        if (typeof url === 'string' && url.includes('chat-requirements')) {
            this.addEventListener("load", function() {
                try {
                    if (this.responseType === "" || this.responseType === "text") {
                        const data = JSON.parse(this.responseText);
                        if (data && data.proofofwork && data.proofofwork.difficulty) {
                            const difficulty = data.proofofwork.difficulty;
                            updateRiskDisplay(difficulty);
                        }
                    }
                } catch {
                    // 忽略解析錯誤
                }
            });
        }

        origXHROpen.apply(this, arguments);
    };
})();
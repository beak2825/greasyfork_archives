// ==UserScript==
// @name         POIID 任务监控提醒（中转+浮窗可拖动+历史记录）
// @namespace    http://tampermonkey.net/
// @version      1.8.0
// @description  监控 assign_task 请求并检查 poiId 是否存在飞书表格中，通过中转服务解决 CORS 限制，带可拖动浮窗、滚动查看200条历史记录与一键跳转。
// @match        *://tcs.jiyunhudong.com/workprocess/7194723673343820345*
// @match        *://tcs.jiyunhudong.com/workprocess/v2/7194723673343820345*
// @match        *://aup.jijixiangshangabc.com/workprocess/7194723673343820345*
// @match        *://aup.jijixiangshangabc.com/workprocess/v2/7194723673343820345*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      poi.yuyehk.cn
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542381/POIID%20%E4%BB%BB%E5%8A%A1%E7%9B%91%E6%8E%A7%E6%8F%90%E9%86%92%EF%BC%88%E4%B8%AD%E8%BD%AC%2B%E6%B5%AE%E7%AA%97%E5%8F%AF%E6%8B%96%E5%8A%A8%2B%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/542381/POIID%20%E4%BB%BB%E5%8A%A1%E7%9B%91%E6%8E%A7%E6%8F%90%E9%86%92%EF%BC%88%E4%B8%AD%E8%BD%AC%2B%E6%B5%AE%E7%AA%97%E5%8F%AF%E6%8B%96%E5%8A%A8%2B%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const proxyBaseUrl = "http://poi.yuyehk.cn:9017/query-poiid";
    const userPromptBase = "https://shujufuwubu.feishu.cn/share/base/query/shrcn3bGKwt66IAQbhKb0KS5h5c?value_商家id=";
    const checkedCache = new Set();
    let logContainer;

    // ===== 初始化浮窗 =====
    initFloatingLog();

    function initFloatingLog() {
        const style = document.createElement("style");
        style.textContent = `
            #poiid-log-panel {
                position: fixed;
                top: 10px;
                right: 10px;
                width: 340px;
                background: rgba(0, 0, 0, 0.75);
                color: #fff;
                font-size: 12px;
                padding: 8px;
                border-radius: 8px;
                z-index: 999999;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                cursor: move;
                user-select: none;
            }
            #poiid-log-panel h4 {
                margin: 0 0 5px 0;
                font-size: 13px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            #poiid-log-panel button {
                background: none;
                border: none;
                color: #fff;
                font-size: 14px;
                cursor: pointer;
            }
            #poiid-log-list {
                max-height: 120px; /* 约5条高度 */
                overflow-y: auto;
            }
            .poiid-log-item {
                border-bottom: 1px solid rgba(255,255,255,0.1);
                padding: 2px 0;
                word-break: break-all;
                cursor: pointer;
            }
            .poiid-log-item:hover {
                background: rgba(255,255,255,0.05);
            }
        `;
        document.head.appendChild(style);

        const panel = document.createElement("div");
        panel.id = "poiid-log-panel";
        panel.innerHTML = `
            <h4>
                POIID 监控日志
                <button id="poiid-log-close">✖</button>
            </h4>
            <div id="poiid-log-list"></div>
        `;
        document.body.appendChild(panel);

        logContainer = panel.querySelector("#poiid-log-list");

        // 关闭按钮
        panel.querySelector("#poiid-log-close").onclick = () => {
            panel.remove();
        };

        // 拖动功能
        makePanelDraggable(panel);
    }

    function makePanelDraggable(panel) {
        let offsetX, offsetY, isDragging = false;

        // 读取保存的位置
        const savedPos = localStorage.getItem("poiid-panel-pos");
        if (savedPos) {
            const pos = JSON.parse(savedPos);
            panel.style.top = pos.top + "px";
            panel.style.left = pos.left + "px";
            panel.style.right = "auto";
        }

        panel.addEventListener("mousedown", (e) => {
            if (e.target.tagName === "BUTTON") return;
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            panel.style.left = (e.clientX - offsetX) + "px";
            panel.style.top = (e.clientY - offsetY) + "px";
            panel.style.right = "auto";
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            localStorage.setItem("poiid-panel-pos", JSON.stringify({
                top: parseInt(panel.style.top),
                left: parseInt(panel.style.left)
            }));
        }
    }

    function addLog(message, highlight = false, poiId = null) {
        const time = new Date().toLocaleTimeString();
        const div = document.createElement("div");
        div.className = "poiid-log-item";
        div.style.color = highlight ? "#ff8080" : "#ddd";
        div.textContent = `[${time}] ${message}`;

        // 如果是敏感POIID日志，加点击跳转
        if (highlight && poiId) {
            div.addEventListener("click", () => {
                const link = userPromptBase + encodeURIComponent(poiId);
                window.open(link, "_blank");
            });
        }

        logContainer.prepend(div);

        // 最多保留200条历史
        while (logContainer.children.length > 200) {
            logContainer.removeChild(logContainer.lastChild);
        }
    }

    // ===== Hook XMLHttpRequest =====
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
        const url = this._url;

        this.addEventListener('load', function () {
            if (url.includes("/api/v2/assign_task/")) {
                try {
                    let responseData;
                    if (this.responseType === '' || this.responseType === 'text') {
                        responseData = JSON.parse(this.responseText);
                    } else if (this.responseType === 'json') {
                        responseData = this.response;
                    } else return;

                    const poiId = responseData?.data?.tasks?.[0]?.object_data?.submitApproveInfo?.merchantUid;
                    if (poiId) {
                        if (!checkedCache.has(poiId)) {
                            checkedCache.add(poiId);
                            addLog(`检测到商家ID：${poiId}，开始比对...`);
                            checkPoiIdViaProxy(poiId);
                        } else {
                            addLog(`跳过已检测过的商家ID：${poiId}`);
                        }
                    } else {
                        addLog("⚠️ 未找到商家id字段");
                    }
                } catch (e) {
                    addLog(`❌ JSON 解析失败：${e.message}`);
                }
            }
        });

        return originalSend.apply(this, arguments);
    };

    // ===== 检查 poiId =====
    function checkPoiIdViaProxy(poiId) {
        const url = `${proxyBaseUrl}?poiid=${encodeURIComponent(poiId)}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: (response) => {
                try {
                    const data = JSON.parse(response.responseText);
                    const items = data?.data?.items;
                    if (Array.isArray(items) && items.length > 0) {
                        const link = userPromptBase + encodeURIComponent(poiId);
                        GM_notification({
                            title: "POIID 监控提醒",
                            text: `发现敏感 poiId：${poiId}`,
                            timeout: 8000,
                            onclick: () => {
                                window.open(link, "_blank");
                            }
                        });
                        addLog(`🚨 发现敏感 poiId：${poiId}（点击查看）`, true, poiId);
                    } else {
                        addLog(`✅ 商家id ${poiId} 不在表格中`);
                    }
                } catch (err) {
                    addLog(`❌ 解析中转响应失败：${err.message}`);
                }
            },
            onerror: () => {
                addLog(`❌ 中转服务请求失败`);
            }
        });
    }
})();

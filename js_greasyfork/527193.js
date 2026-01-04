// ==UserScript==
// @name         替换API返回坐标（支持上传TXT坐标文件并持久化）
// @namespace    https://ff14risingstones.web.sdo.com/
// @version      0.0.1
// @description  拦截接口返回数据，并将其中的 x,y 坐标替换为自定义坐标。支持上传 TXT 坐标文件并保存到 localStorage，刷新页面后依然有效
// @author       Cindy-Master
// @match        https://ff14risingstones.web.sdo.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527193/%E6%9B%BF%E6%8D%A2API%E8%BF%94%E5%9B%9E%E5%9D%90%E6%A0%87%EF%BC%88%E6%94%AF%E6%8C%81%E4%B8%8A%E4%BC%A0TXT%E5%9D%90%E6%A0%87%E6%96%87%E4%BB%B6%E5%B9%B6%E6%8C%81%E4%B9%85%E5%8C%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/527193/%E6%9B%BF%E6%8D%A2API%E8%BF%94%E5%9B%9E%E5%9D%90%E6%A0%87%EF%BC%88%E6%94%AF%E6%8C%81%E4%B8%8A%E4%BC%A0TXT%E5%9D%90%E6%A0%87%E6%96%87%E4%BB%B6%E5%B9%B6%E6%8C%81%E4%B9%85%E5%8C%96%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let customCoords = [];
    const STORAGE_KEY = "customCoords";
    function loadCoordsFromStorage() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                customCoords = JSON.parse(stored);
            } catch (e) {
                console.error("读取持久化坐标失败：", e);
                customCoords = [];
            }
        }
    }
    loadCoordsFromStorage();

    function createUI() {
        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.top = "10px";
        container.style.right = "10px";
        container.style.zIndex = "9999";
        container.style.background = "rgba(255,255,255,0.9)";
        container.style.padding = "10px";
        container.style.border = "1px solid #ccc";
        container.style.fontSize = "12px";
        container.style.color = "#333";
        container.style.fontFamily = "Arial, sans-serif";

        container.innerHTML = `
            <div style="margin-bottom:5px;">上传坐标文件（TXT）：</div>
            <input type="file" id="coordsFile" accept=".txt">
            <div id="coordsStatus" style="margin-top:5px;color:#006600;"></div>
            <div style="margin-top:5px;">
                格式示例：<br>
                Contour 1:<br>
                (110, 182)<br>
                <br>
                Contour 2:<br>
                (108, 181)
            </div>
            <br>
            GitHub:https://github.com/Cindy-Master/FFXIV-StoneDeathPos
        `;
        document.body.appendChild(container);
        updateStatus();

        document.getElementById("coordsFile").addEventListener("change", handleFileSelect);
    }

    function updateStatus() {
        const statusEl = document.getElementById("coordsStatus");
        if (statusEl) {
            statusEl.innerText = `当前加载坐标：${customCoords.length}个`;
        }
    }

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            parseCoords(text);
        };
        reader.readAsText(file);
    }

    function parseCoords(text) {
        const lines = text.split(/\r?\n/);
        const coords = [];
        const regex = /^\(\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/;
        for (let line of lines) {
            line = line.trim();
            const match = line.match(regex);
            if (match) {
                coords.push({
                    point_x: match[1],
                    point_y: match[2]
                });
            }
        }
        customCoords = coords;
        // 保存到 localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customCoords));
        updateStatus();
        console.log("上传并保存的坐标数据：", customCoords);
    }

    window.addEventListener("DOMContentLoaded", createUI);
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
        if (this._url && this._url.includes("gaoNanDeadPoint5")) {
            this.addEventListener("readystatechange", function() {
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        let dataObj = JSON.parse(this.responseText);
                        if (customCoords.length > 0 && dataObj && Array.isArray(dataObj.data)) {
                            dataObj.data = customCoords.map((coord, index) => {
                                const origItem = dataObj.data[index] || {};
                                return Object.assign({}, origItem, {
                                    point_x: coord.point_x,
                                    point_y: coord.point_y
                                });
                            });
                        }
                        Object.defineProperty(this, "response", {
                            get: function() {
                                return JSON.stringify(dataObj);
                            }
                        });
                        Object.defineProperty(this, "responseText", {
                            get: function() {
                                return JSON.stringify(dataObj);
                            }
                        });
                    } catch (err) {
                        console.error("修改 API 返回数据失败：", err);
                    }
                }
            });
        }
        return originalSend.apply(this, arguments);
    };
})();

// ==UserScript==
// @name         M-Team Thumbnail Enhancer (成人列表页大图预览)
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  M-Team 列表页大图预览
// @author       Krad129, with Gemini
// @match        https://kp.m-team.cc/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/502090/M-Team%20Thumbnail%20Enhancer%20%28%E6%88%90%E4%BA%BA%E5%88%97%E8%A1%A8%E9%A1%B5%E5%A4%A7%E5%9B%BE%E9%A2%84%E8%A7%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/502090/M-Team%20Thumbnail%20Enhancer%20%28%E6%88%90%E4%BA%BA%E5%88%97%E8%A1%A8%E9%A1%B5%E5%A4%A7%E5%9B%BE%E9%A2%84%E8%A7%88%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // --- 1. 工具函数：等待 DOM 元素加载 ---
    function waitForElements(selector, expectedCount, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const elements = document.querySelectorAll(selector);
                if (elements.length >= expectedCount) {
                    clearInterval(interval);
                    resolve(elements);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    if (elements.length > 0) resolve(elements);
                    else reject(new Error("Timeout waiting for elements: " + selector));
                }
            }, 150);
        });
    }

    // --- 2. 核心注入逻辑 ---
    function injectThumbnail(row, dataItem, tdSelector) {
        if (!dataItem || !dataItem.imageList || !dataItem.imageList.length) return;

        // 定位目标 td (成人板块一般是第1列，DMM一般是第2列)
        const targetTd = row.querySelector(tdSelector);
        if (!targetTd || targetTd.getAttribute('data-enhanced')) return;

        // 获取原始的 Flex 容器
        const originalFlex = targetTd.querySelector('div.flex.items-center');
        if (!originalFlex) return;

        // 标记已处理
        targetTd.setAttribute('data-enhanced', 'true');

        // A. 建立包装盒 (垂直布局)
        const wrapper = document.createElement("div");
        Object.assign(wrapper.style, {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            padding: "6px 0"
        });

        // B. 清理原始布局中的占位和边距
        const placeholder = originalFlex.querySelector(".torrent-list__thumbnail-placeholder");
        if (placeholder) placeholder.style.display = "none";

        // 这里的类名 pl-[12px] 是馒头列表的特征代码
        const textDiv = originalFlex.querySelector(".pl-\\[12px\\]");
        if (textDiv) {
            textDiv.classList.remove('pl-[12px]');
            textDiv.style.paddingLeft = "4px";
            textDiv.style.width = "100%";
        }

        // C. 创建图片容器
        const imgDiv = document.createElement("div");
        imgDiv.style.marginTop = "10px";
        imgDiv.style.width = "100%";

        const img = document.createElement("img");
        img.src = dataItem.imageList[0];
        Object.assign(img.style, {
            display: "block",
            maxWidth: "100%",
            maxHeight: "500px",
            height: "auto",
            borderRadius: "4px",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        });

        img.onclick = (e) => {
            e.stopPropagation();
            window.open(`https://kp.m-team.cc/detail/${dataItem.id}`, "_blank");
        };

        // D. 物理重构 DOM
        targetTd.removeChild(originalFlex);
        wrapper.appendChild(originalFlex);
        imgDiv.appendChild(img);
        wrapper.appendChild(imgDiv);
        targetTd.appendChild(wrapper);
    }

    // --- 3. API 处理器配置 ---
    const API_HANDLERS = {
        "/api/torrent/search": async (responseData) => {
            if (!window.location.href.includes("/browse/adult")) return;
            try {
                const rows = await waitForElements("div.ant-spin-container table tbody tr", responseData.data.data.length);
                rows.forEach((row, index) => {
                    const item = responseData.data.data[index];
                    injectThumbnail(row, item, "td:nth-of-type(1)");
                });
            } catch (err) { console.warn("[M-Team Script]", err); }
        },
        "/api/dmm/showcase/fetchList": async (responseData) => {
            if (!window.location.href.includes("/showcaseDetail")) return;
            const listData = responseData.data.list || responseData.data.data;
            try {
                const rows = await waitForElements("div.ant-spin-container table tbody tr", listData.length);
                rows.forEach((row, index) => {
                    const item = listData[index];
                    injectThumbnail(row, item, "td:nth-of-type(2)");
                });
            } catch (err) { console.warn("[M-Team Script]", err); }
        }
    };

    // --- 4. 拦截 XHR (安全过滤版) ---
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
        const targetPaths = Object.keys(API_HANDLERS);
        const isTarget = this._url && targetPaths.some(path => this._url.includes(path));

        if (isTarget) {
            this.addEventListener("load", function () {
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        const data = JSON.parse(this.responseText);
                        if (data && data.code === "0") {
                            // 查找匹配的 handler 并执行
                            const handlerKey = targetPaths.find(p => this._url.includes(p));
                            if (API_HANDLERS[handlerKey]) API_HANDLERS[handlerKey](data);
                        }
                    } catch (e) {}
                }
            });
        }
        return originalSend.apply(this, arguments);
    };

    // --- 5. SPA 路由适配 (History API) ---
    const _historyWrap = function (type) {
        const orig = history[type];
        return function () {
            const rv = orig.apply(this, arguments);
            const e = new Event(type);
            window.dispatchEvent(e);
            return rv;
        };
    };
    history.pushState = _historyWrap('pushState');
    history.replaceState = _historyWrap('replaceState');

})();
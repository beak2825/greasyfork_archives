// ==UserScript==
// @name         查看交易所冰淇淋融化情况
// @namespace    https://github.com/gangbaRuby
// @version      1.0.0
// @license      AGPL-3.0
// @description  查看交易所此刻冰淇淋的融化情况
// @author       Rabbit House
// @match        *://www.simcompanies.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=simcompanies.com
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/544683/%E6%9F%A5%E7%9C%8B%E4%BA%A4%E6%98%93%E6%89%80%E5%86%B0%E6%B7%87%E6%B7%8B%E8%9E%8D%E5%8C%96%E6%83%85%E5%86%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/544683/%E6%9F%A5%E7%9C%8B%E4%BA%A4%E6%98%93%E6%89%80%E5%86%B0%E6%B7%87%E6%B7%8B%E8%9E%8D%E5%8C%96%E6%83%85%E5%86%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const targetIds = [153, 154];
    const targetRealms = [0, 1];
    let GLOBAL_REALM_ID = null;

    // 计算剩余量
    function calculateRemainingQuantity(entry, nowTime) {
        const decayTime = Date.parse(entry.datetimeDecayUpdated);
        const a = Math.abs(nowTime - decayTime);
        const o = Math.round(a / (1000 * 60) / 4) * 4 / 60;
        return Math.floor(entry.quantity * Math.pow(1 - 0.05, o));
    }

    // 创建浮动按钮，控制浮动框显示隐藏
    function createToggleButton() {
        if (document.getElementById("market-toggle-button")) return;

        const btn = document.createElement("div");
        btn.id = "market-toggle-button";
        btn.textContent = "查看交易所🍦融化情况";
        btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10001;
        background: #222;
        color: white;
        border-radius: 4px;
        padding: 6px 10px;
        font-size: 13px;d
        cursor: pointer;
        user-select: none;
        opacity: 0.85;
    `;
        btn.title = "点击显示/隐藏市场订单预览";

        btn.addEventListener("mouseenter", () => btn.style.opacity = "1");
        btn.addEventListener("mouseleave", () => btn.style.opacity = "0.85");

        // 拖动逻辑
        btn.onmousedown = function (e) {
            e.preventDefault();
            let shiftX = e.clientX - btn.getBoundingClientRect().left;
            let shiftY = e.clientY - btn.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                btn.style.left = pageX - shiftX + 'px';
                btn.style.top = pageY - shiftY + 'px';
                btn.style.bottom = 'auto';
                btn.style.right = 'auto';
            }

            function onMouseMove(e) {
                moveAt(e.pageX, e.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            document.onmouseup = function () {
                document.removeEventListener('mousemove', onMouseMove);
                document.onmouseup = null;
            };
        };

        btn.ondragstart = () => false;

        // 点击显示/隐藏窗口
        btn.onclick = () => {
            const box = document.getElementById("market-floating-box");
            if (!box) return;
            box.style.display = box.style.display === "none" ? "block" : "none";
        };

        // 设置初始位置和附加样式
        btn.style.position = 'fixed';
        btn.style.left = 'unset';
        btn.style.top = 'unset';
        btn.style.bottom = '20px';
        btn.style.right = '20px';

        document.body.appendChild(btn);
    }

    // 创建浮动框，支持拖拽
    function createFloatingBox(hiddenInitially = false) {
        if (document.getElementById("market-floating-box")) return;

        const box = document.createElement("div");
        box.id = "market-floating-box";
        box.style.cssText = `
            position: fixed;
            left: 10px;
            top: 50px;
            z-index: 9999;
            background: #222;
            color: #eee;
            padding: 10px;
            border-radius: 6px;
            max-height: 60vh;
            width: 520px;
            box-shadow: 0 0 12px rgba(0,0,0,0.7);
            overflow: hidden;
            user-select: none;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            font-size: 13px;
            display: ${hiddenInitially ? "none" : "block"};
        `;

        // 头部拖拽条
        const header = document.createElement("div");
        // 创建关闭按钮
        const closeBtn = document.createElement("span");
        closeBtn.textContent = "✖";
        closeBtn.title = "关闭窗口";
        closeBtn.style.cssText = `
            float: right;
            margin-left: 8px;
            color: #aaa;
            cursor: pointer;
            font-size: 14px;
        `;
        closeBtn.onmouseenter = () => closeBtn.style.color = "#fff";
        closeBtn.onmouseleave = () => closeBtn.style.color = "#aaa";
        closeBtn.onclick = () => {
            const box = document.getElementById("market-floating-box");
            if (box) box.style.display = "none";
        };


        header.textContent = "🍦 我的🍦😭";
        header.style.cssText = `
            cursor: move;
            padding: 6px 8px;
            background: #111;
            border-radius: 4px 4px 0 0;
            font-weight: bold;
            user-select: none;
        `;

        // 内容区，含表格和统计
        const content = document.createElement("div");
        content.id = "market-floating-content";
        content.style.cssText = `
            margin-top: 8px;
            max-height: calc(60vh - 40px);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;

        box.appendChild(header);
        header.appendChild(closeBtn); // 放入 header 最后
        box.appendChild(content);
        // 添加右下角缩放控件
        const resizer = document.createElement("div");
        resizer.style.cssText = `
            width: 12px;
            height: 12px;
            position: absolute;
            right: 2px;
            bottom: 2px;
            cursor: nwse-resize;
            background: #666;
            border-radius: 2px;
            z-index: 10000;
        `;
        box.appendChild(resizer);

        // 缩放逻辑
        resizer.addEventListener("mousedown", function (e) {
            e.preventDefault();
            document.body.style.userSelect = "none"; // 防止选中文字
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = box.offsetWidth;
            const startHeight = box.offsetHeight;

            function doDrag(e) {
                const newWidth = Math.max(300, startWidth + e.clientX - startX);
                const newHeight = Math.max(200, startHeight + e.clientY - startY);
                box.style.width = newWidth + "px";
                box.style.maxHeight = "unset";
                box.style.height = newHeight + "px";
            }

            function stopDrag() {
                document.removeEventListener("mousemove", doDrag);
                document.removeEventListener("mouseup", stopDrag);
                document.body.style.userSelect = "";
            }

            document.addEventListener("mousemove", doDrag);
            document.addEventListener("mouseup", stopDrag);
        });
        document.body.appendChild(box);

        // 拖拽逻辑
        dragElement(box, header);
    }

    // 拖拽函数，传入浮动元素和拖拽头部元素
    function dragElement(elmnt, dragHandle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        dragHandle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            let newTop = elmnt.offsetTop - pos2;
            let newLeft = elmnt.offsetLeft - pos1;

            // 限制不出屏幕（简易）
            newTop = Math.max(0, Math.min(window.innerHeight - elmnt.offsetHeight, newTop));
            newLeft = Math.max(0, Math.min(window.innerWidth - elmnt.offsetWidth, newLeft));

            elmnt.style.top = newTop + "px";
            elmnt.style.left = newLeft + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 渲染表格和统计，分两块显示，表格滚动独立
    function renderFloatingTable(data) {
        createFloatingBox();
        createToggleButton();

        const container = document.getElementById("market-floating-content");
        if (!data || data.length === 0) {
            container.innerHTML = "<b>暂无数据</b>";
            return;
        }

        // 表格和统计容器
        container.innerHTML = "";

        const tableContainer = document.createElement("div");
        tableContainer.style.cssText = `
            flex-grow: 1;
            overflow: auto;
            maxHeight: "calc(60vh - 80px)";
            background: #333;
            border-radius: 4px;
            padding: 6px;
        `;

        const summaryContainer = document.createElement("div");
        summaryContainer.style.cssText = `
            margin-top: 8px;
            maxHeight: 100px;
            overflow: auto;
            background: #111;
            border-radius: 4px;
            padding: 6px;
            font-size: 12px;
            line-height: 1.4;
            color: #ccc;
        `;

        // 处理数据，加入产品名和融化数
        const kindMap = { 153: "巧克力冰淇淋", 154: "苹果冰淇淋" };
        const processed = data.map(row => {
            const melt = row.quantity - row.estimatedRemaining;
            return {
                ...row,
                kindName: kindMap[row.kind] || `未知(${row.kind})`,
                melt,
            };
        });

        // 排序参数
        let sortKey = null;
        let sortAsc = true;

        // 创建表格
        const table = document.createElement("table");
        table.style.cssText = `
            border-collapse: collapse;
            width: 100%;
            table-layout: auto;
            color: #eee;
            user-select: none;
        `;

        // 表头
        const headers = [
            { label: "订单ID", key: "id" },
            { label: "产品名", key: "kindName" },
            { label: "品质", key: "quality" },
            { label: "单价", key: "price" },
            { label: "数量", key: "quantity" },
            { label: "剩余量", key: "estimatedRemaining" },
            { label: "融化数量", key: "melt" },
            { label: "公司名", key: "company" },
        ];

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        for (const h of headers) {
            const th = document.createElement("th");
            th.textContent = h.label;
            th.style.cssText = `
                border: 1px solid #555;
                padding: 4px 8px;
                background: #111;
                position: sticky;
                top: 0;
                z-index: 10;
                cursor: pointer;
                user-select: none;
            `;

            th.onclick = () => {
                if (sortKey === h.key) {
                    sortAsc = !sortAsc;
                } else {
                    sortKey = h.key;
                    sortAsc = true;
                }
                renderBody();
            };
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        table.appendChild(tbody);

        tableContainer.appendChild(table);
        container.appendChild(tableContainer);
        container.appendChild(summaryContainer);

        function renderBody() {
            tbody.innerHTML = "";

            let sorted = [...processed];
            if (sortKey) {
                sorted.sort((a, b) => {
                    const v1 = a[sortKey], v2 = b[sortKey];
                    if (typeof v1 === "number" && typeof v2 === "number") {
                        return sortAsc ? v1 - v2 : v2 - v1;
                    }
                    return sortAsc ? String(v1).localeCompare(String(v2)) : String(v2).localeCompare(String(v1));
                });
            }

            for (const row of sorted) {
                const tr = document.createElement("tr");
                for (const h of headers) {
                    const td = document.createElement("td");
                    td.style.cssText = `
                        border: 1px solid #555;
                        padding: 4px 8px;
                        white-space: nowrap;
                        max-width: 80px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        color: #eee;
                    `;
                    if (h.key === "price") {
                        td.textContent = row[h.key].toFixed(3);
                    } else {
                        td.textContent = row[h.key];
                    }
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);
            }

            renderSummary();
        }

        // 统计渲染
        function renderSummary() {
            summaryContainer.innerHTML = "";

            const summaryMap = new Map();
            const qualityTotalMap = new Map();
            let grandTotal = 0;

            for (const row of processed) {
                if (row.melt <= 0) continue;
                const company = row.company;
                const quality = row.quality;

                if (!summaryMap.has(company)) summaryMap.set(company, { total: 0, q: {} });
                const record = summaryMap.get(company);
                record.total += row.melt;
                record.q[quality] = (record.q[quality] || 0) + row.melt;

                qualityTotalMap.set(quality, (qualityTotalMap.get(quality) || 0) + row.melt);
                grandTotal += row.melt;
            }

            const lines = [];

            if (grandTotal > 0) {
                const sortedQualities = Array.from(qualityTotalMap.entries())
                    .sort(([a], [b]) => a - b)
                    .map(([q, amt]) => `Q${q}=${amt}`);
                lines.push(`<div>🏪 当前交易所融化：${sortedQualities.join("，")}（共 ${grandTotal}）</div>`);
            }

            if (summaryMap.size > 0) {
                lines.push(`<div>🧾 公司融化统计：</div>`);
                const sortedCompanies = Array.from(summaryMap.entries())
                    .sort(([, a], [, b]) => b.total - a.total);
                for (const [company, info] of sortedCompanies) {
                    const parts = Object.entries(info.q)
                        .sort(([a], [b]) => a - b)
                        .map(([q, amt]) => `Q${q}=${amt}`)
                        .join("，");
                    lines.push(`<div>${company}：${parts}（共 ${info.total}）</div>`);
                }
            }

            summaryContainer.innerHTML = lines.join("");
        }

        // 首次渲染
        renderBody();
    }

    // 拦截 fetch
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const url = args[0];
        const match = typeof url === 'string' && url.match(/\/api\/v3\/market\/(\d+)\/(\d+)\/$/);
        if (match) {
            const realm = parseInt(match[1]), id = parseInt(match[2]);
            if (targetRealms.includes(realm) && targetIds.includes(id)) {
                const response = await originalFetch(...args);
                response.clone().json().then(json => {
                    processMarketData(json, realm, id);
                });
                return response;
            }
        }
        return originalFetch(...args);
    };

    // 拦截 XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        this._isTargetMarketRequest = false;

        const match = typeof url === 'string' && url.match(/\/api\/v3\/market\/(\d+)\/(\d+)\/$/);
        if (match) {
            const realm = parseInt(match[1], 10);
            const id = parseInt(match[2], 10);
            if (targetRealms.includes(realm) && targetIds.includes(id)) {
                this._isTargetMarketRequest = true;
                this._realm = realm;
                this._id = id;
            }
        }
        return originalOpen.call(this, method, url, ...rest);
    };

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (...args) {
        if (this._isTargetMarketRequest) {
            this.addEventListener("load", () => {
                try {
                    const json = JSON.parse(this.responseText);
                    processMarketData(json, this._realm, this._id);
                } catch (e) {
                    console.error("JSON parse failed:", e);
                }
            });
        }
        return originalSend.call(this, ...args);
    };

    // 监听 DOM 变化，提取 realmId
    const domObserver = new MutationObserver(() => {
        const realmId = getRealmIdFromLink();
        if (realmId !== null && realmId !== GLOBAL_REALM_ID) {
            console.log('[RegionAutoUpdater] 获取到 realmId:', realmId);
            GLOBAL_REALM_ID = realmId;
            tryAutoRenderFromStorage();
        }
    });
    domObserver.observe(document.body, { childList: true, subtree: true });

    // 监听 URL 变化
    function addUrlChangeListener(callback) {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                callback(url);
            }
        }).observe(document, { subtree: true, childList: true });
    }

    addUrlChangeListener(url => {
        tryAutoRenderFromStorage();
    });

    // 获取 realmId 函数
    function getRealmIdFromLink() {
        const link = document.querySelector('a[href*="/company/"]');
        if (link) {
            const match = link.href.match(/\/company\/(\d+)\//);
            return match ? parseInt(match[1], 10) : null;
        }
        return null;
    }

    // 从 localStorage 读取数据渲染
    function tryAutoRenderFromStorage() {
        const match = location.pathname.match(/^\/zh-cn\/market\/resource\/(\d+)\/?$/);
        if (!match) return;

        const id = parseInt(match[1]);
        if (!targetIds.includes(id)) return;

        const realm = GLOBAL_REALM_ID !== null ? GLOBAL_REALM_ID : 0;

        const dataStr = localStorage.getItem(`marketFloating_${realm}_${id}`);
        if (dataStr) {
            try {
                const data = JSON.parse(dataStr);
                renderFloatingTable(data);
            } catch (e) {
                console.error("localStorage 数据解析失败", e);
            }
        } else {
            const container = document.getElementById("market-floating-content");
            if (container) container.innerHTML = "<b>暂无数据</b>";
        }
    }

    // 处理数据存储并渲染
    function processMarketData(json, realm, id) {
        const now = Date.now();
        const processed = json.map(entry => ({
            id: entry.id,
            kind: entry.kind,
            quality: entry.quality,
            price: entry.price,
            quantity: entry.quantity,
            estimatedRemaining: calculateRemainingQuantity(entry, now),
            datetimeDecayUpdated: entry.datetimeDecayUpdated,
            company: entry.seller?.company || "未知公司"
        }));
        localStorage.setItem(`marketFloating_${realm}_${id}`, JSON.stringify(processed));
        renderFloatingTable(processed);
    }

    // 页面首次尝试渲染
    tryAutoRenderFromStorage();
    createToggleButton();
    createFloatingBox(true);

    const localVersion = GM_info.script.version;
    const scriptUrl = 'https://sc.22-7.top/scripts/checkIceCreamMeltInMarket.user.js?t=' + Date.now();
    const downloadUrl = 'https://sc.22-7.top/scripts/checkIceCreamMeltInMarket.user.js';

    function compareVersions(v1, v2) {
        const a = v1.split('.').map(Number);
        const b = v2.split('.').map(Number);
        const len = Math.max(a.length, b.length);
        for (let i = 0; i < len; i++) {
            const n1 = a[i] || 0;
            const n2 = b[i] || 0;
            if (n1 > n2) return 1;
            if (n1 < n2) return -1;
        }
        return 0;
    }

    function checkUpdate() {
        fetch(scriptUrl)
            .then(r => r.text())
            .then(text => {
                const match = text.match(/@version\s+([0-9.]+)/);
                if (!match) return;

                const remoteVersion = match[1];
                if (compareVersions(remoteVersion, localVersion) > 0) {
                    if (confirm(`查看交易所冰淇淋融化情况插件发现新版本 v${remoteVersion}，是否前往更新？`)) {
                        window.open(downloadUrl, '_blank');
                    }
                }
            })
            .catch(err => {
                console.warn('检查更新失败：', err);
            });
    }

    setTimeout(checkUpdate, 3000);

})();

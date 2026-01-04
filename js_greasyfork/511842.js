// ==UserScript==
// @name         sb6657.cn斗鱼玩机器烂梗收集
// @namespace    http://tampermonkey.net/
// @version      2025.12.28.02
// @description  在斗鱼直播间 6657 添加一个按钮,提供在线搜索烂梗，复制和一键发送
// @author       sb6657.cn
// @match        https://www.douyu.com/*
// @match        https://www.douyu.com
// @match        https://www.douyu.com/room/*
// @include      https://*.douyu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      hguofichp.cn
// @connect      web-static-res-edge-speedtest-b1-hk.dahi.edu.eu.org
// @icon         https://apic.douyucdn.cn/upload/avatar_v3/202510/39e8bc3233ca412fa991a18bd024cfbc_middle.jpg
// @grant        GM_info
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511842/sb6657cn%E6%96%97%E9%B1%BC%E7%8E%A9%E6%9C%BA%E5%99%A8%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/511842/sb6657cn%E6%96%97%E9%B1%BC%E7%8E%A9%E6%9C%BA%E5%99%A8%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86.meta.js
// ==/UserScript==


(function() {
    'use strict';
    //当前版本
    const CURRENT_VERSION = GM_info?.script?.version || "0";
    console.log("sb6657.cn插件--当前版本:"+ CURRENT_VERSION);
    function querySelectorDeep(selector, root = document) {
        let found = root.querySelector(selector);
        if (found) return found;
        const all = root.querySelectorAll('*');
        for (let el of all) {
            if (el.shadowRoot) {
                const f = querySelectorDeep(selector, el.shadowRoot);
                if (f) return f;
            }
        }
        return null;
    }

    function createElement(tag, styles, textContent) {
        let element = document.createElement(tag);
        Object.assign(element.style, styles);
        if (textContent) element.innerText = textContent;
        return element;
    }

    // 1. 创建主面板容器
    let tableContainer = createElement("div", {
        fontSize: "14px", borderRadius: "10px", display: "none", position: "fixed",
        width: "380px", top: "150px", right: "20px", zIndex: "99999",
        backgroundColor: "#fefefe", border: "1px solid #ddd", maxHeight: "500px",
        display: "none", // 初始隐藏
        flexDirection: "column", // 使用 flex 布局确保滚动正常
        overflow: "hidden", boxShadow: "0 8px 16px rgba(0,0,0,0.15)"
    });
    tableContainer.style.display = "none";
    document.body.appendChild(tableContainer);

    // 2. 顶部工具栏 (高度降低至 35px，更紧凑)
    let searchContainer = createElement("div", {
        width: "100%", height: "40px", backgroundColor: "#f0f0f0",
        position: "relative", cursor: "move", flexShrink: "0"
    });
    tableContainer.appendChild(searchContainer);

    function createSvgBtn(marginLeft, paths, color, link, title, viewBox = "0 0 1024 1024") {
        let btn = createElement("button", {
            width: "30px", height: "30px", zIndex: "9995", position: "absolute",
            padding: "0", backgroundColor: "transparent", border: "none",
            top: "5px", left: marginLeft, cursor: "pointer"
        }, "");
        btn.title = title;
        let svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgIcon.setAttribute("viewBox", viewBox);
        svgIcon.setAttribute("width", "24");
        svgIcon.setAttribute("height", "24");

        paths.forEach(d => {
            let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", d);
            path.setAttribute("fill", color);
            svgIcon.appendChild(path);
        });

        let textLabel = createElement("span", {
            fontSize: "11px",
            color: "#000",
            whiteSpace: "nowrap",
            transform: "translateY(-5px)",
            display: "block"
        }, title);
        btn.appendChild(svgIcon);
        btn.appendChild(textLabel);
        btn.onclick = () => window.open(link, '_blank');
        searchContainer.appendChild(btn);
    }

    // 按钮组
    createSvgBtn("10px", ["M1077.36 507.05L922.79 369.21V163.44h-120.04v98.7L714.06 183 542.61 38 371.14 183 183.58 350.32 7.79 507.05l73.5 90.45L183.58 506.31l182.16-162.59 176.87-157.69 176.75 157.75 182.33 162.53 102.23 91.19z","M544.82 244.91L368.07 402.66 185.86 565.25v386.28c0 10.41 4.95 18.83 11.15 18.83h273.24v-257.71h149.22v257.71h273.24c6.14 0 11.15-8.48 11.15-18.89V565.25l-182.16-162.53-176.87-157.75z"], "#389f25", "https://sb6657.cn","首页", "0 0 1080 1024");
    createSvgBtn("45px", ["M395.77 586.57h-171.73c-22.42 0-37.89-22.44-29.91-43.38L364.77 95.27a32 32 0 0 1 29.9-20.6h287.96c22.72 0 38.21 23.02 29.63 44.06l-99.36 243.88h187.05c27.51 0 42.19 32.43 24.04 53.1l-458.6 522.56c-22.29 25.41-63.63 3.39-54.98-29.28l85.35-322.42z"], "#1296db", "https://cdn.hguofichp.cn/zfb.jpg","赞赏");
    createSvgBtn("80px", ["M517.12 954.88c244.59 0 442.88-198.29 442.88-442.88 0-244.59-198.29-442.88-442.88-442.88C272.52 69.12 74.24 267.4 74.24 512c0 244.59 198.28 442.88 442.88 442.88zM517.12 891.61c-209.65 0-379.61-169.96-379.61-379.61s169.96-379.61 379.61-379.61 379.61 169.96 379.61 379.61S726.77 891.61 517.12 891.61zM523.95 243.99c-54.66 0-97.18 16.71-127.55 50.11-30.37 31.89-44.8 74.4-44.8 127.55l59.98 0c0-37.2 8.35-66.05 25.06-87.31 18.22-25.06 46.31-37.2 84.27-37.2 31.89 0 56.95 8.35 74.41 26.57 16.71 16.7 25.81 40.24 25.81 70.61 0 21.26-7.59 41-22.78 59.98-4.55 6.07-13.67 15.19-25.81 27.33-41 36.45-66.06 65.3-76.69 88.08-9.11 18.98-13.67 41-13.67 66.05l0 17.47 60.74 0 0-17.47c0-20.5 4.56-38.73 14.43-55.43 7.59-13.67 18.98-27.34 35.68-41.76 33.41-29.61 53.91-49.35 61.5-58.46 18.98-25.06 28.85-54.67 28.85-88.83 0-45.55-14.43-81.24-42.52-107.05-32.69-30-71.4-42.91-120-42.91zM512.56 706.36c-12.91 0-23.54 3.8-32.65 12.91-9.11 8.35-12.91 18.98-12.91 31.89s3.8 23.54 12.91 32.65c9.11 8.35 19.74 12.91 32.65 12.91 12.91 0 23.54-4.56 32.65-12.91 9.11-8.36 13.67-18.99 13.67-32.65 0-12.91-4.56-23.54-12.91-31.89-9.11-9.1-20.5-12.91-13.41-12.91z"], "#000001", "https://www.wjx.cn/vm/rQUgnS0.aspx#","反馈");
    createSvgBtn("115px", ["M863.614042 0.282308H160.033093A159.997794 159.997794 0 0 0 0.035298 160.350679v703.651527a159.927218 159.927218 0 0 0 159.997795 159.997794h703.580949a159.927218 159.927218 0 0 0 160.068372-159.927218v-703.651526A159.997794 159.997794 0 0 0 863.614042 0.282308z m71.494383 835.13626a100.007444 100.007444 0 0 1-100.007443 100.007443h-646.484252a100.148597 100.148597 0 0 1-100.07802-99.936866v-646.484251a100.007444 100.007444 0 0 1 100.007444-100.007444h646.484251a99.936867 99.936867 0 0 1 100.07802 99.936867z","M681.525683 406.522848l-139.742229-139.742229a42.34613 42.34613 0 0 0-59.849197 0l-139.742229 139.742229a42.34613 42.34613 0 0 0 59.849198 59.849197l67.4715-67.400924v328.253085a42.34613 42.34613 0 1 0 84.69226 0V399.253429l67.4715 67.400923a42.34613 42.34613 0 0 0 59.849197-59.849197z"], "#0590DF", "https://web-static-res-edge-speedtest-b1-hk.dahi.edu.eu.org/scripts/511842/sb6657cn%E6%96%97%E9%B1%BC%E7%8E%A9%E6%9C%BA%E5%99%A8%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86.user.js","检查更新");


    function checkUpdate() {
        const CURRENT_VERSION = GM_info?.script?.version ;
        const metaUrl = "https://web-static-res-edge-speedtest-b1-hk.dahi.edu.eu.org/scripts/511842/sb6657cn%E6%96%97%E9%B1%BC%E7%8E%A9%E6%9C%BA%E5%99%A8%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86.meta.js";

        const updateTip = createElement("button", {
            position: "absolute",
            left: "145px",
            top: "12px",
            zIndex:99999,
            fontSize: "12px",
            color: "#ff5722",
            fontWeight: "bold",
            display: "none",
            cursor: "pointer"
        }, "● 检测到新版本");

        updateTip.onclick = () => {
            window.open(
                "https://web-static-res-edge-speedtest-b1-hk.dahi.edu.eu.org/scripts/511842/sb6657cn%E6%96%97%E9%B1%BC%E7%8E%A9%E6%9C%BA%E5%99%A8%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86.user.js",
                '_blank'
            );
        };

        searchContainer.appendChild(updateTip);

        // ✅ 用 GM_xmlhttpRequest 绕过 CORS
        GM_xmlhttpRequest({
            method: "GET",
            url: metaUrl + "?_=" + Date.now(),
            onload: function (res) {
                if (res.status !== 200) return;

                const text = res.responseText;
                const match = text.match(/@version\s+([^\s\n\r]+)/);

                if (match && match[1]) {
                    const latestVersion = match[1].trim();
                    if (latestVersion !== CURRENT_VERSION) {
                        updateTip.style.display = "block";
                        updateTip.animate([
                            { transform: 'scale(1)' },
                            { transform: 'scale(1.1)' },
                            { transform: 'scale(1)' }
                        ], { duration: 1000, iterations: Infinity });
                    }
                }
            },
            onerror: function (err) {
                console.error("[sb6657.cn插件GFPlugin] 更新检查失败", err);
            }
        });
    }

    // 建议放在 Master 逻辑内执行
    checkUpdate();


    // 关闭按钮
    let XButton = createElement("button", {
        width: "30px", height: "30px", zIndex: "5", position: "absolute",
        top: "2px", right: "5px", border: "none", backgroundColor: "transparent",
        fontSize: "100%", cursor: "pointer"
    }, "❌");
    searchContainer.appendChild(XButton);
    XButton.onclick = () => { tableContainer.style.display = "none"; };

    // 搜索栏容器
    let searchWrap = createElement("div", { padding: "8px", background: "#f7f7f7", display: "flex", gap: "5px", flexShrink: "0" });
    tableContainer.appendChild(searchWrap);
    let input = createElement("input", { flex: "1", padding: "4px", border: "1px solid #ccc", borderRadius: "4px" });
    input.placeholder = "搜索弹幕...";
    searchWrap.appendChild(input);
    let sBtn = createElement("button", { padding: "4px 10px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }, "搜索");
    searchWrap.appendChild(sBtn);
    // 添加回车键事件监听
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && document.activeElement === input) {
            event.preventDefault();
            sBtn.click(); // 触发按钮点击事件
        }
    });
    // 核心修复：表格滚动容器
    let scrollBox = createElement("div", {
        flex: "1", overflowY: "auto", overflowX: "hidden", background: "#fff"
    });
    tableContainer.appendChild(scrollBox);
    let table = createElement("table", { width: "100%", borderCollapse: "collapse" });
    scrollBox.appendChild(table);

    let cooldown = false;
    function sendBarrage(text) {
        if (cooldown) { showMsg("❌❌CD冷却中... ❌❌"); return; }
        const chatInput = querySelectorDeep('.ChatSend-txt');
        const sendBtn = querySelectorDeep('.ChatSend-button');
        if (chatInput && sendBtn) {
            chatInput.focus();
            chatInput.innerText = text;
            chatInput.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                sendBtn.click();
                cooldown = true;
                setTimeout(() => cooldown = false, 5000);
                showMsg("✔️✔️ 弹幕发送成功✔️✔️");
            }, 50);
        }
    }

    function render(data) {
        table.innerHTML = "";
        data.forEach((item, i) => {
            let tr = createElement("tr", { background: i % 2 ? "#fff" : "#f9f9f9" });
            tr.innerHTML = `<td style="padding:8px; font-size:100%;color:#000; border-bottom:1px solid #eee; cursor:pointer; word-break:break-all;">${item.barrage}</td>
                            <td style=" width:50px; border-bottom:0px solid #eee; text-align:center;">
                            <button class="s-go" style="background:#ff5722; color:#fff; border:none; padding:0px 8px; border-radius:5px; cursor:pointer; font-size:100%;">发送</button></td>`;
            tr.cells[0].onclick = () => { navigator.clipboard.writeText(item.barrage); showMsg("✔️✔️已复制✔️✔️"); };
            tr.querySelector('.s-go').onclick = (e) => { e.stopPropagation(); sendBarrage(item.barrage); };
            table.appendChild(tr);
        });
    }


    /* ===== 在线人数显示 ===== */
    // 创建外层容器
    let onlineCountEl = document.createElement("div");
    Object.assign(onlineCountEl.style, {
        position: "absolute",
        right: "40px",
        fontSize: "x-small",
        color: "#333",
        padding: "4px 8px",
        background: "#e8f5e9",
        borderRadius: "10px",
        zIndex: 9999,
        lineHeight: "1.4"
    });

    // 创建子元素
    const gfOnlineEl = document.createElement("div");
    gfOnlineEl.id = "gf-online";
    gfOnlineEl.innerText = "插件在线：--";

    const siteOnlineEl = document.createElement("div");
    siteOnlineEl.id = "site-online";
    siteOnlineEl.innerText = "网站在线：--";

    // 组装结构
    onlineCountEl.appendChild(gfOnlineEl);
    onlineCountEl.appendChild(siteOnlineEl);

    // 插入到页面（请确保 searchContainer 已正确定义）
    if (typeof searchContainer !== 'undefined' && searchContainer instanceof Element) {
        searchContainer.appendChild(onlineCountEl);
    } else {
        console.error("[sb6657.cn插件GFPlugin] 未找到有效的 searchContainer，无法插入在线人数面板");
    }
    function getOrCreateSid() {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let sid = Array.from({ length: 10 }, () =>
                             chars[Math.floor(Math.random() * chars.length)]
                            ).join('');
        return sid;
    }

    /* ===== 2. WebSocket 初始化（利用 BroadcastChannel 物理隔离） ===== */
    (function initGFWebSocket() {
        // 1. 核心修复：确保脚本只在最顶层窗口运行，不在 iframe 里运行
        if (window.top !== window.self) return;

        // 2. 增强型全局锁，挂载在 unsafeWindow 确保唯一性
        const targetWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
        if (targetWindow.__GF_WS_LOCK__) return;
        targetWindow.__GF_WS_LOCK__ = true;

        let wsManager = { instance: null, timer: null, delay: 3000 };
        const sid = getOrCreateSid();

        function connect() {
            try {
                const WS_URL = "wss://hguofichp.cn:10086/machine/GFPlugin/ws/" + sid;
                const WSCtor = (typeof unsafeWindow !== 'undefined' && unsafeWindow.WebSocket)
                ? unsafeWindow.WebSocket
                : (window.WebSocket || WebSocket);

                console.log("[sb6657.cn插件GFPlugin] 正在建立单标签页唯一连接...");
                const ws = new WSCtor(WS_URL);
                wsManager.instance = ws;

                ws.onopen = () => {
                    console.log("[sb6657.cn插件GFPlugin] WSS 连接成功");
                    wsManager.delay = 3000;
                };

                ws.onmessage = (e) => {
                    try {
                        const data = JSON.parse(e.data);
                        // 同步更新 UI
                        if (data.GFCount !== undefined) {
                            const el = document.getElementById("gf-online");
                            if (el) el.innerText = "插件在线：" + data.GFCount;
                        }
                        if (data.count !== undefined) {
                            const el = document.getElementById("site-online");
                            if (el) el.innerText = "网站在线：" + data.count;
                        }
                    } catch (err) {}
                };

                ws.onclose = (e) => {
                    if (e.code === 1000 || e.code === 1001) return;
                    console.warn("[sb6657.cn插件GFPlugin] WSS 断开重连中...");
                    clearTimeout(wsManager.timer);
                    wsManager.timer = setTimeout(connect, wsManager.delay);
                    wsManager.delay = Math.min(wsManager.delay * 2, 30000);
                };

                ws.onerror = () => ws.close();
            } catch (err) {
                console.error("[sb6657.cn插件GFPlugin] WS 启动失败:", err);
                targetWindow.__GF_WS_LOCK__ = false;
            }
        }

        window.addEventListener("beforeunload", () => {
            if (wsManager.instance) wsManager.instance.close(1000);
            targetWindow.__GF_WS_LOCK__ = false;
        });

        connect();
    })();
    sBtn.onclick = () => {
        const val = input.value.trim();
        if (!val) return;
        fetch("https://hguofichp.cn:10086/machine/Query", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ D: "油猴", barrage: val })
        }).then(r => r.json()).then(res => { if(res.code === 200) render(res.data); });
    };

    function showMsg(txt) {
        let m = createElement("div", { fontSize:"large",position: "fixed",top: "20%",left: "50%",transform: "translateX(-50%)",background: "#64ce83",color: "#fff",padding: "8px 16px",borderRadius: "4px",zIndex: "100000",opacity: "1",transition: "opacity 1s ease"}, txt);
        document.body.appendChild(m);
        setTimeout(() => {
            m.style.transition = "opacity 1s ease";
            m.style.opacity = "0";
            setTimeout(() => m.remove(), 1000);
        }, 1500);
    }

    function doInsertButton() {
        const toolbar = querySelectorDeep('.ChatToolBar__right');
        if (toolbar && !toolbar.querySelector('#meme-btn-id')) {
            const btn = createElement('button', { fontSize: "medium", padding: "2px 2px", marginRight: "20px", background: "#ff5d23", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }, "玩烂梗");
            btn.id = 'meme-btn-id';
            btn.onclick = () => {
                const isHidden = tableContainer.style.display === 'none';
                tableContainer.style.display = isHidden ? 'flex' : 'none';
            };
            toolbar.insertBefore(btn, toolbar.firstChild);
        }
    }
    setInterval(doInsertButton, 2000);

    (function enableDrag(container, handle) {
        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;

        handle.style.cursor = 'move';

        handle.addEventListener('pointerdown', (e) => {
            if (e.button !== undefined && e.button !== 0) return;
            if (e.target.closest('button, svg, path')) return;

            dragging = true;

            const rect = container.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            handle.setPointerCapture(e.pointerId);
            e.preventDefault();
        });

        handle.addEventListener('pointermove', (e) => {
            if (!dragging) return;

            container.style.left = (e.clientX - offsetX) + 'px';
            container.style.top  = (e.clientY - offsetY) + 'px';
            container.style.right = 'auto';
        });

        handle.addEventListener('pointerup', () => {
            dragging = false;
        });

        handle.addEventListener('pointercancel', () => {
            dragging = false;
        });
    })(tableContainer, searchContainer);

})();
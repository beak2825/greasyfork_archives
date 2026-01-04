// ==UserScript==
// @name         番号数据库 + Everything HTML解析 (10.0.0.2:4321)
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  查询本地数据库与Everything网页(10.0.0.2:4321)，显示ℹ️详情、🔍图片搜索、🧭本地文件结果（HTML解析，点击跳转）。数据库无结果时显示i/Y/N添加/备注框等功能。
// @author       Your Name
// @match        https://www.javbus.com/*
// @match        https://thisav.com/*
// @match        https://south-plus.org/*
// @match        https://missav.ws/*
// @match        https://javten.com/*
// @match        https://www.javlibrary.com/*
// @match        https://3xplanet.com/*
// @match        https://njav.tv/*
// @match        https://123av.com/*
// @match        https://mypikpak.com/*
// @match        https://javxspot.com/*
// @match        https://javfree.me/*
// @match        https://sukebei.nyaa.si/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      10.0.0.2
// @downloadURL https://update.greasyfork.org/scripts/523178/%E7%95%AA%E5%8F%B7%E6%95%B0%E6%8D%AE%E5%BA%93%20%2B%20Everything%20HTML%E8%A7%A3%E6%9E%90%20%2810002%3A4321%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523178/%E7%95%AA%E5%8F%B7%E6%95%B0%E6%8D%AE%E5%BA%93%20%2B%20Everything%20HTML%E8%A7%A3%E6%9E%90%20%2810002%3A4321%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const EVERYTHING_BASE = "http://10.0.0.2:4321";

    const regex = /\b\d{7}\b/g;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const processedNodes = new Set();

    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (processedNodes.has(node)) continue;
        processedNodes.add(node);

        if (regex.test(node.nodeValue)) {
            const codes = node.nodeValue.match(regex);
            codes.forEach(code => queryDatabase(code, node));
        }
    }

    // ---------------- 数据库查询 ----------------
    function queryDatabase(code, textNode) {
        const apiUrl = `http://localhost:5002/check-code?code=${code}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: res => {
                try {
                    const result = JSON.parse(res.responseText);
                    if (result.exists) {
                        const remark = result.data.remark || "无备注";
                        const worth = result.data.worth_watching == 0 ? "不值得观看" : "值得观看";
                        const text = result.data.ready_to_exe === 1
                            ? `待处理中, ${remark}`
                            : `备注: ${remark}，${worth}`;
                        showResult(code, textNode, text, true);
                    } else {
                        showResult(code, textNode, `${code}未找到`, false);
                    }
                } catch {
                    showResult(code, textNode, "解析错误", false);
                }
            },
            onerror: () => showResult(code, textNode, "查询失败", false)
        });
    }

    // ---------------- 结果显示 ----------------
    function showResult(code, textNode, text, hasData) {
        const resultSpan = document.createElement("span");
        resultSpan.style.marginLeft = "5px";
        resultSpan.style.color =
            text.includes("待处理中") ? "orange" :
            text.includes("未找到") ? "red" : "green";

        const fontSize = "10px";
        const buttonContainer = document.createElement("span");
        buttonContainer.style.marginLeft = "5px";

        // 🔍 javstore 搜索按钮
        const searchButton = createButton("🔍", fontSize, () =>
            window.open(`https://img.javstore.net/search/images/?q=${code}`, "_blank")
        );
        searchButton.title = "在 javstore.net 搜索图片";

        // ℹ️ 详情（点击展开/关闭）
        const detailButton = createButton("ℹ️", fontSize);
        detailButton.title = "点击查看详情";
        let detailBox = null;
        let isOpen = false;
        detailButton.addEventListener("click", () => {
            if (isOpen) {
                if (detailBox) detailBox.remove();
                isOpen = false;
                return;
            }
            isOpen = true;
            fetchDetails(code, detailButton, box => {
                detailBox = box;
                document.body.appendChild(box);
            });
        });

        // 🧭 Everything 查询按钮
        const evButton = createButton("🧭", fontSize, () => fetchEverythingHTML(code, evButton));
        evButton.title = "在 Everything (10.0.0.2:4321) 中查询本地文件";

        buttonContainer.appendChild(searchButton);
        buttonContainer.appendChild(detailButton);
        buttonContainer.appendChild(evButton);

        // 无数据库数据时额外按钮
        if (!hasData) {
            const remarkInput = document.createElement("input");
            remarkInput.type = "text";
            remarkInput.placeholder = "备注";
            remarkInput.style.width = "45px";
            remarkInput.style.fontSize = fontSize;
            remarkInput.style.marginLeft = "5px";

            const addY = createButton("Y", fontSize, () =>
                addCode(code, 1, 1, remarkInput.value.trim(), addY)
            );
            const addN = createButton("N", fontSize, () =>
                addCode(code, 0, 0, remarkInput.value.trim() || "UG", addN)
            );

            const imgButton = createButton("i", fontSize, e => {
                e.preventDefault();
                e.stopPropagation();
                let i = 0;
                const symbols = ["+", "-", "+", "-"];
                const intervalId = setInterval(() => {
                    imgButton.textContent = symbols[i++ % symbols.length];
                }, 300);
                fetchImage(code, imgButton, intervalId);
            });

            buttonContainer.appendChild(imgButton);
            buttonContainer.appendChild(addY);
            buttonContainer.appendChild(addN);
            buttonContainer.appendChild(remarkInput);
        }

        resultSpan.textContent = `[${text}] `;
        resultSpan.appendChild(buttonContainer);
        textNode.parentNode.insertBefore(resultSpan, textNode.nextSibling);
    }

    // ---------------- 公共函数 ----------------
    function createButton(text, size, onClick) {
        const b = document.createElement("button");
        b.textContent = text;
        b.style.fontSize = size;
        b.style.marginLeft = "5px";
        b.style.cursor = "pointer";
        if (onClick) b.addEventListener("click", onClick);
        return b;
    }

    // ---------------- 添加数据库 ----------------
    function addCode(code, ready, worth, remark, btn) {
        const apiUrl = `http://localhost:5002/add-code`;
        btn.textContent = "添加中...";
        btn.disabled = true;
        GM_xmlhttpRequest({
            method: "POST",
            url: apiUrl,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ code, ready_to_exe: ready, worth_watching: worth, remark }),
            onload: res => {
                try {
                    const r = JSON.parse(res.responseText);
                    if (r.success) {
                        const parent = btn.parentNode.parentNode;
                        parent.textContent = `[已添加]`;
                        parent.style.color = "green";
                    } else fail();
                } catch { fail(); }
                function fail() {
                    btn.textContent = "添加失败";
                    btn.style.color = "red";
                }
            },
            onerror: () => {
                btn.textContent = "添加失败";
                btn.style.color = "red";
            }
        });
    }

    // ---------------- 获取图片 ----------------
    function fetchImage(code, btn, id) {
        const apiUrl = `http://localhost:5002/get-image?code=${code}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: res => {
                clearInterval(id);
                btn.textContent = "i";
                try {
                    const r = JSON.parse(res.responseText);
                    if (r.image_url) window.open(r.image_url, "_blank");
                    else btn.textContent = "无图";
                } catch { btn.textContent = "错误"; }
            },
            onerror: () => {
                clearInterval(id);
                btn.textContent = "失败";
            }
        });
    }

    // ---------------- 展开详情框 ----------------
    function fetchDetails(code, button, callback) {
        const apiUrl = `http://localhost:5002/check-code?code=${code}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function (res) {
                try {
                    const r = JSON.parse(res.responseText);
                    if (!r.exists || !r.data) return;
                    const d = r.data;
                    const fields = [
                        { k: "actor", n: "演员" },
                        { k: "author", n: "作者" },
                        { k: "downloadable", n: "可下载" },
                        { k: "rating", n: "评分" },
                        { k: "screenshot_link", n: "截图链接" },
                        { k: "storage_location", n: "存储路径" }
                    ];
                    const box = document.createElement("div");
                    box.className = "detail-box";
                    box.style.position = "absolute";
                    box.style.background = "rgba(0,0,0,0.85)";
                    box.style.color = "#fff";
                    box.style.padding = "8px 10px";
                    box.style.borderRadius = "8px";
                    box.style.fontSize = "12px";
                    box.style.maxWidth = "280px";
                    box.style.whiteSpace = "pre-wrap";
                    box.style.zIndex = 9999;
                    box.style.lineHeight = "1.5";

                    let content = "";
                    fields.forEach(f => {
                        if (d[f.k]) content += `${f.n}: ${d[f.k]}\n`;
                    });
                    box.textContent = content || "无详细数据";

                    const rect = button.getBoundingClientRect();
                    box.style.top = `${rect.top + window.scrollY + 20}px`;
                    box.style.left = `${rect.left + window.scrollX}px`;
                    callback(box);
                } catch (e) {
                    console.error("详情加载错误:", e);
                }
            }
        });
    }

    // ---------------- Everything HTML 解析 ----------------
    function fetchEverythingHTML(keyword, button) {
        const apiUrl = `${EVERYTHING_BASE}/?search=${encodeURIComponent(keyword)}&count=20`;

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: res => {
                const htmlText = res.responseText;
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, "text/html");

                // 支持 trdata1 / trdata2 两种交替行
                const links = [
                    ...doc.querySelectorAll("tr.trdata1 td.file span nobr a"),
                    ...doc.querySelectorAll("tr.trdata2 td.file span nobr a")
                ];

                if (links.length === 0) {
                    showTooltip(button, "未找到结果");
                    return;
                }

                const box = document.createElement("div");
                box.className = "ev-html-box";
                box.style.position = "absolute";
                box.style.background = "rgba(0,0,0,0.85)";
                box.style.color = "#fff";
                box.style.padding = "8px";
                box.style.borderRadius = "6px";
                box.style.fontSize = "12px";
                box.style.maxWidth = "420px";
                box.style.maxHeight = "250px";
                box.style.overflowY = "auto";
                box.style.zIndex = 9999;

                links.forEach(a => {
                    const div = document.createElement("div");
                    div.textContent = a.textContent.trim();
                    div.style.cursor = "pointer";
                    div.style.marginBottom = "4px";
                    div.style.whiteSpace = "nowrap";
                    div.addEventListener("click", () => {
                        const href = a.getAttribute("href");
                        const url = href.startsWith("http") ? href : EVERYTHING_BASE + href;
                        window.open(url, "_blank");
                    });
                    box.appendChild(div);
                });

                const rect = button.getBoundingClientRect();
                box.style.top = `${rect.top + window.scrollY + 20}px`;
                box.style.left = `${rect.left + window.scrollX}px`;

                document.body.appendChild(box);

                const closeHandler = () => {
                    box.remove();
                    button.removeEventListener("click", closeHandler);
                };
                button.addEventListener("click", closeHandler, { once: true });
            },
            onerror: () =>
                showTooltip(button, "无法连接 Everything，请确认 http://10.0.0.2:4321 可访问。")
        });
    }

    // ---------------- 简易提示 ----------------
    function showTooltip(button, message) {
        const tip = document.createElement("div");
        tip.textContent = message;
        tip.style.position = "absolute";
        tip.style.background = "#222";
        tip.style.color = "#fff";
        tip.style.padding = "5px 8px";
        tip.style.borderRadius = "5px";
        tip.style.fontSize = "12px";
        tip.style.zIndex = 9999;

        const rect = button.getBoundingClientRect();
        tip.style.top = `${rect.top + window.scrollY + 20}px`;
        tip.style.left = `${rect.left + window.scrollX}px`;

        document.body.appendChild(tip);
        setTimeout(() => tip.remove(), 2000);
    }

})();

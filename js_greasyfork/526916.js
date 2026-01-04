// ==UserScript==
// @name         磁力链接批量选择工具（增加全选按钮）
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  增加全选按钮，并优化按钮透明度和放大效果
// @author       你的名字
// @match        *://*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/526916/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E6%89%B9%E9%87%8F%E9%80%89%E6%8B%A9%E5%B7%A5%E5%85%B7%EF%BC%88%E5%A2%9E%E5%8A%A0%E5%85%A8%E9%80%89%E6%8C%89%E9%92%AE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/526916/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E6%89%B9%E9%87%8F%E9%80%89%E6%8B%A9%E5%B7%A5%E5%85%B7%EF%BC%88%E5%A2%9E%E5%8A%A0%E5%85%A8%E9%80%89%E6%8C%89%E9%92%AE%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCheckboxes() {
        let links = document.querySelectorAll('a[href^="magnet:?"]');
        if (links.length === 0) return;

        // 避免重复添加
        if (document.getElementById("magnet-toolbar")) return;

        // 🌟 创建可折叠玻璃风工具栏
        let toolbar = document.createElement("div");
        toolbar.id = "magnet-toolbar";
        toolbar.style.position = "fixed";
        toolbar.style.bottom = "20px";
        toolbar.style.right = "20px";
        toolbar.style.background = "rgba(255, 255, 255, 0.4)";
        toolbar.style.backdropFilter = "blur(10px)";
        toolbar.style.border = "1px solid rgba(255, 255, 255, 0.3)";
        toolbar.style.padding = "12px";
        toolbar.style.borderRadius = "12px";
        toolbar.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
        toolbar.style.zIndex = "9999";
        toolbar.style.fontFamily = "Segoe UI, Arial, sans-serif";
        toolbar.style.display = "flex";
        toolbar.style.gap = "10px";
        toolbar.style.cursor = "grab"; // 🖱 让工具栏可拖拽
        toolbar.draggable = true;

        let style = document.createElement("style");
        style.innerHTML = `
            .fluent-btn {
                color: rgba(0, 0, 0, 0.6);
                background: rgba(255, 255, 255, 0.6);
                border: none;
                padding: 10px 15px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            .fluent-btn:hover {
                color: black;
                background: rgba(255, 182, 193, 0.8); /* 樱花粉 */
                transform: scale(1.05);
                box-shadow: 0 0 15px rgba(255, 182, 193, 0.6);
            }
            .fold-btn {
                width: 30px;
                height: 30px;
                background: rgba(255, 255, 255, 0.4);
                border: none;
                cursor: pointer;
                font-size: 18px;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: all 0.3s ease;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                border-radius: 50%;
            }
            .fold-btn:hover {
                background: rgba(255, 182, 193, 0.8); /* 樱花粉 */
                transform: scale(1.05);
                box-shadow: 0 0 10px rgba(255, 182, 193, 0.5);
            }
            .fold-btn.collapsed {
                transform: rotate(180deg);
            }
            .fluent-btn-container {
                display: flex;
                gap: 10px;
                flex-direction: row;
            }
            .toolbar-collapsed .fluent-btn-container {
                display: none;
            }
        `;
        document.head.appendChild(style);

        toolbar.innerHTML = `
            <button id="fold-toolbar" class="fold-btn">▶</button>
            <div class="fluent-btn-container">
                <button id="select-all" class="fluent-btn">全选</button>
                <button id="copy-selected" class="fluent-btn">复制选中</button>
                <button id="open-selected" class="fluent-btn">打开选中</button>
            </div>
        `;
        document.body.appendChild(toolbar);

        // ✨ 拖拽功能
        let isDragging = false, startX, startY, startLeft, startTop;

        toolbar.addEventListener("mousedown", (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = toolbar.offsetLeft;
            startTop = toolbar.offsetTop;
            toolbar.style.cursor = "grabbing";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            let deltaX = e.clientX - startX;
            let deltaY = e.clientY - startY;
            toolbar.style.left = `${startLeft + deltaX}px`;
            toolbar.style.top = `${startTop + deltaY}px`;
            toolbar.style.bottom = "auto"; // 防止固定在底部
            toolbar.style.right = "auto";  // 防止固定在右侧
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            toolbar.style.cursor = "grab";
        });

        // 🌟 折叠功能
        document.getElementById("fold-toolbar").addEventListener("click", () => {
            toolbar.classList.toggle("toolbar-collapsed");
            document.getElementById("fold-toolbar").classList.toggle("collapsed");
            document.getElementById("fold-toolbar").textContent = toolbar.classList.contains("toolbar-collapsed") ? "◁" : "▶";
        });

        // 🌟 全选/取消全选功能
        document.getElementById("select-all").addEventListener("click", () => {
            let allCheckboxes = document.querySelectorAll('a[href^="magnet:?"] + input');
            let allChecked = [...allCheckboxes].every(cb => cb.checked);
            allCheckboxes.forEach(cb => cb.checked = !allChecked);
        });

        // 🌟 遍历所有磁力链接，按标题分类
        let lastTitle = null;
        links.forEach(link => {
            let title = getNearestTitle(link);
            if (title && title !== lastTitle) {
                if (!title.querySelector(".season-checkbox")) {
                    let titleCheckbox = document.createElement("input");
                    titleCheckbox.type = "checkbox";
                    titleCheckbox.classList.add("season-checkbox");
                    titleCheckbox.style.marginLeft = "10px";
                    titleCheckbox.style.transform = "scale(1.5)";
                    titleCheckbox.dataset.group = title.innerText.trim();
                    title.appendChild(titleCheckbox);
                    titleCheckbox.addEventListener("change", function() {
                        let group = this.dataset.group;
                        document.querySelectorAll(`a[href^="magnet:?"][data-group="${group}"] + input`).forEach(cb => {
                            cb.checked = this.checked;
                        });
                    });
                }
                lastTitle = title;
            }

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.style.marginLeft = "5px";
            checkbox.dataset.group = lastTitle ? lastTitle.innerText.trim() : "";
            link.setAttribute("data-group", checkbox.dataset.group);
            link.after(checkbox);
        });

        // 复制选中的磁力链接
        document.getElementById("copy-selected").addEventListener("click", () => {
            let selectedLinks = [...document.querySelectorAll('a[href^="magnet:?"] + input:checked')]
                .map(cb => cb.previousSibling.href)
                .join("\n");
            if (selectedLinks) {
                GM_setClipboard(selectedLinks);
                alert("已复制选中的磁力链接！");
            } else {
                alert("未选择任何磁力链接！");
            }
        });

        // 打开选中的磁力链接
        document.getElementById("open-selected").addEventListener("click", () => {
            let selectedLinks = [...document.querySelectorAll('a[href^="magnet:?"] + input:checked')]
                .map(cb => cb.previousSibling.href);
            if (selectedLinks.length > 0) {
                selectedLinks.forEach(link => window.open(link, "_blank"));
            } else {
                alert("未选择任何磁力链接！");
            }
        });
    }

    function getNearestTitle(element) {
        let node = element;
        while (node && node !== document.body) {
            if (node.previousElementSibling && /^h[1-6]$/i.test(node.previousElementSibling.tagName)) {
                return node.previousElementSibling;
            }
            node = node.parentElement;
        }
        return null;
    }

    // 监听页面变化，动态添加复选框
    let observer = new MutationObserver(addCheckboxes);
    observer.observe(document.body, { childList: true, subtree: true });

    // 初次运行
    addCheckboxes();
})();

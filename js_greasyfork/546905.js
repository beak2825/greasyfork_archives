// ==UserScript==
// @name         MissAV Quick Copy & Javdb Search
// @namespace    zerobiubiu.top
// @version      1.0.2
// @description  为 MissAV 视频播放页面提供番号快速复制和一键跳转 JavDB 搜索功能。点击“复制番号”按钮即可将当前番号复制到剪贴板，点击“转到JavDB搜索”按钮即可在新标签页中搜索对应番号。
// @author       zerobiubiu
// @match        https://missav.ws/*/*-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.ws
// @run-at       document-idle
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546905/MissAV%20Quick%20Copy%20%20Javdb%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/546905/MissAV%20Quick%20Copy%20%20Javdb%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const selector = "body > div:nth-child(3) > div.sm\\:container.mx-auto.px-4.content-without-search.pb-12 > div > div.flex-1.order-first > div.mt-4 > div";

    // 番号提取
    function extractCode(pathname) {
        const filename = pathname.split("/").pop();
        if (/^FC2-PPV-\d+$/i.test(filename)) return filename;
        const parts = filename.split("-");
        return parts.length >= 2 ? parts[0] + "-" + parts[1] : filename;
    }

    // 复制文本到剪贴板
    function copyToClipboard(text) {
        return navigator.clipboard.writeText(text)
            .then(() => true)
            .catch(() => false);
    }

    // 页面内浮动提示
    function showToast(message, duration = 2000) {
        const toast = document.createElement("div");
        toast.textContent = message;
        Object.assign(toast.style, {
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "4px",
            fontSize: "14px",
            zIndex: 9999,
            transition: "opacity 0.3s",
            opacity: "1"
        });
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // 改进的打开新标签页函数
    async function openInNewTab(url) {

        console.log("openInNewTab 函数被触发")


        try {
            // 方法1: 使用模拟单击 a 标签
            const a = document.createElement('a');
            a.href = url;
            a.target = "_blank";
            a.style.display = "none"
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            console.log('执行 模拟单击 a 标签');
            return true;
        } catch (e) {
            console.log('window.open 失败:', e);
        }


        // try {
        //     // 方法1: 使用 window.open
        //     window.open(url, '_blank', 'noopener,noreferrer');
        //     console.log('执行 window.open');
        //     return true;

        // } catch (e) {
        //     console.log('window.open 失败:', e);
        // }

        // // 尝试多种方法打开新标签页
        // try {
        //     // 方法2: 使用 GM_openInTab（如果可用）
        //     if (typeof GM_openInTab !== 'undefined') {
        //         GM_openInTab(url, { active: true, setParent: true });
        //         console.log('执行 GM_openInTab');

        //         return true;
        //     }
        // } catch (e) {
        //     console.log('GM_openInTab 不可用:', e);
        // }

        // try {
        //     // 方法3: 创建隐形链接并点击
        //     const link = document.createElement('a');
        //     link.href = url;
        //     link.target = '_blank';
        //     link.rel = 'noopener noreferrer';
        //     link.style.display = 'none';
        //     document.body.appendChild(link);
        //     link.click();
        //     document.body.removeChild(link);
        //     console.log('执行 隐形链接');

        //     return true;
        // } catch (e) {
        //     console.log('链接点击方法失败:', e);
        // }

        // // 方法4: 在当前页面打开（最后的备选方案）
        // try {
        //     window.location.href = url;
        //     return true;
        // } catch (e) {
        //     console.log('所有方法都失败了:', e);
        //     return false;
        // }
    }

    // 创建通用按钮
    function createButton(label, svgElement, onClick) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "inline-flex items-center whitespace-nowrap shadow-sm text-sm text-nord4 leading-4 font-medium focus:outline-none hover:text-nord6 mr-2";
        button.appendChild(svgElement);
        button.appendChild(document.createTextNode(label));
        button.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
        });
        return button;
    }

    // 创建 SVG 元素（原生 SVG 对象）
    function createSVGClipboard() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.setAttribute("fill", "currentColor");
        svg.setAttribute("class", "bi bi-clipboard-check mr-1");
        svg.setAttribute("viewBox", "0 0 16 16");

        const path1 = document.createElementNS(svg.namespaceURI, "path");
        path1.setAttribute("fill-rule", "evenodd");
        path1.setAttribute("d", "M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0");

        const path2 = document.createElementNS(svg.namespaceURI, "path");
        path2.setAttribute("d", "M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z");

        const path3 = document.createElementNS(svg.namespaceURI, "path");
        path3.setAttribute("d", "M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z");

        svg.appendChild(path1);
        svg.appendChild(path2);
        svg.appendChild(path3);
        return svg;
    }

    function createSVGJavDB() {
        const svgStr = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-letter-j-small"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 8h4v6a2 2 0 1 1 -4 0" /></svg>`;
        const template = document.createElement("template");
        template.innerHTML = svgStr.trim();
        return template.content.firstChild;
    }

    function insertButtons(menu_bar) {
        const fanhao = extractCode(window.location.pathname);

        // 复制番号按钮，插到最前
        const copyBtn = createButton("复制番号", createSVGClipboard(), () => {
            copyToClipboard(fanhao).then(success => {
                showToast(success ? `番号 ${fanhao} 已复制` : "复制失败");
            });
        });
        menu_bar.prepend(copyBtn);

        // 跳转 JavDB 按钮，放到最后 - 改进版
        const javdbBtn = createButton("转到JavDB搜索", createSVGJavDB(), () => {
            const javdbUrl = `https://javdb.com/search?q=${encodeURIComponent(fanhao)}&f=all`;
            console.log('尝试打开 JavDB 链接:', javdbUrl);

            const success = openInNewTab(javdbUrl);
            if (success) {
                showToast(`正在跳转到 JavDB 搜索: ${fanhao}`);
            } else {
                showToast("跳转失败，请检查弹窗阻止设置");
                // 作为备选方案，复制链接到剪贴板
                copyToClipboard(javdbUrl).then(copied => {
                    if (copied) {
                        showToast("链接已复制到剪贴板，请手动打开");
                    }
                });
            }
        });
        menu_bar.appendChild(javdbBtn);

        console.log("✅ Copy 和 JavDB 按钮已插入 menu_bar");
    }

    // 监听 DOM 变化，直到找到目标元素
    const observer = new MutationObserver(() => {
        const menu_bar = document.querySelector(selector);
        if (menu_bar) {
            observer.disconnect();
            insertButtons(menu_bar);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
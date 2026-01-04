// ==UserScript==
// @name         知乎快捷键优化
// @namespace    https://github.com/Howardzhangdqs
// @version      0.9
// @description  知乎侧边栏加入快捷键对照表，帮助刚上手知乎键盘党的同学熟悉键盘使用。简化向下、向上滚动半屏的快捷键，优化滚动幅度和速度
// @author       HowardZhangdqs
// @match        *://www.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        GM_addStyle
// @license      WTFGL
// @downloadURL https://update.greasyfork.org/scripts/471487/%E7%9F%A5%E4%B9%8E%E5%BF%AB%E6%8D%B7%E9%94%AE%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/471487/%E7%9F%A5%E4%B9%8E%E5%BF%AB%E6%8D%B7%E9%94%AE%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** 右侧侧边栏改为快捷键对照表 */

    (() => {

        const $contentinfo = document.querySelector(`footer[role="contentinfo"]`);

        GM_addStyle(".ShortcutHintModal-hintList:first-child { border-right: none }");
        GM_addStyle(`.sideShortcutHint { font-family: Menlo, Monaco, Consolas, "Andale Mono", "lucida console", "Courier New", monospace }`);
        GM_addStyle(`.sideKeyHint { margin-bottom: 3px; }`);

        const shortCuts = [
            { shortcut: "V", text: "：赞同" },
            { shortcut: "D", text: "：反对" },
            { shortcut: "L", text: "：喜欢" },
            { shortcut: "C", text: "：展开 / 收起评论" },
            { shortcut: "O", text: "：展开 / 收起全文" },
            { shortcut: "F", text: "：收藏" },
            { shortcut: "S", text: "：分享" },
            { shortcut: "J", text: "：主内容下一项" },
            { shortcut: "K", text: "：主内容上一项" },
            { shortcut: "G", text: "：滚动到页面顶部" },
            { shortcut: "N", text: "：向下滚动半屏" },
            { shortcut: "M", text: "：向上滚动半屏" },
            { shortcut: "Shift + G", text: "：滚动到页面底部" },
            { shortcut: "Shift + U", text: "：向上滚动半屏" },
            { shortcut: "Shift + D", text: "：向下滚动半屏" },
            { shortcut: "Shift + S", text: "：侧边栏第一项" },
            { shortcut: "/", text: "：搜索" },
            { shortcut: "?", text: "：快捷键帮助" }
        ]

        const createNode = () => {
            const e_0 = document.createElement("div");
            e_0.setAttribute("class", "Card");
            const e_2 = document.createElement("div");
            e_2.setAttribute("class", "Modal-content");
            const e_3 = document.createElement("div");
            e_3.setAttribute("class", "ShortcutHintModal-hintListContainer");
            const e_4 = document.createElement("div");
            e_4.setAttribute("class", "ShortcutHintModal-hintList");


            for (let i in shortCuts) {
                const e_5 = document.createElement("div");
                e_5.setAttribute("class", "KeyHint sideKeyHint");
                const e_6 = document.createElement("code");
                e_6.setAttribute("class", "sideShortcutHint");
                e_6.appendChild(document.createTextNode(shortCuts[i].shortcut));
                e_5.appendChild(e_6);
                const e_7 = document.createElement("div");
                e_7.appendChild(document.createTextNode(shortCuts[i].text));
                e_5.appendChild(e_7);
                e_4.appendChild(e_5);
            }

            e_3.appendChild(e_4);
            e_2.appendChild(e_3);
            e_0.appendChild(e_2);
            return e_0;
        }

        $contentinfo.innerHTML = "";

        $contentinfo.appendChild(createNode());
    })();

    /** N、M作为快捷键 */

    (() => {
        document.addEventListener('keydown', (e) => {
            // 78 N 下半页; 77 M 上半页
            if (e.keyCode == 78 || e.keyCode == 77) {
                const pageHeight = document.documentElement.clientHeight;

                const scrollPosition = window.pageYOffset;

                const scrollDistance = pageHeight / 3;

                window.scrollTo({
                    top: scrollPosition + (e.keyCode == 77 ? -scrollDistance : scrollDistance),
                    behavior: 'smooth'
                });
            }
        });
    })();
})();
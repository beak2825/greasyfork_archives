// ==UserScript==
// @name         turnitin检查所有的按钮
// @namespace    http://tampermonkey.net/
// @version      2025-05-20-003
// @description  每次点击打开30个 .btn-primary 链接，按钮显示 当前/总共 个链接，点击继续
// @author       周利斌
// @match        https://www.turnitin.com/class/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/536580/turnitin%E6%A3%80%E6%9F%A5%E6%89%80%E6%9C%89%E7%9A%84%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/536580/turnitin%E6%A3%80%E6%9F%A5%E6%89%80%E6%9C%89%E7%9A%84%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentIndex = 0; // 当前打开的链接索引
    const maxPerClick = 30; // 每次最多打开的数量

    // 创建按钮
    const btn = document.createElement("button");
    btn.setAttribute("style", `
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 9999;
        padding: 8px 12px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    `.replace(/\s+/g, ' ').trim());

    document.body.appendChild(btn);

    // 获取所有链接
    const all_href = document.querySelectorAll(".btn-primary");
    const total = all_href.length;

    // 初始设置按钮文字
    updateButtonText();

    btn.addEventListener("click", function () {
        if (currentIndex >= total) {
            alert("所有链接都已打开完毕！");
            return;
        }

        function openBatch(startIndex, count) {
            let opened = 0;

            function openLink(index) {
                if (index < total && opened < count) {
                    const href = all_href[index].href;
                    if (href) {
                        window.open(href, '_blank');
                    }
                    opened++;
                    currentIndex++;
                    updateButtonText();
                    setTimeout(() => openLink(index + 1), 1000);
                }
            }

            openLink(startIndex);
        }

        openBatch(currentIndex, maxPerClick);
    });

    function updateButtonText() {
        btn.textContent = `${Math.min(currentIndex, total)}/${total} 个链接`;
    }
})();

// ==UserScript==
// @name         Linux.do一键滚动到底部和顶部（支持懒加载和拖拽）
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  实现网页滚动到底部、顶部，处理懒加载内容，支持按钮拖拽
// @match        https://linux.do/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510353/Linuxdo%E4%B8%80%E9%94%AE%E6%BB%9A%E5%8A%A8%E5%88%B0%E5%BA%95%E9%83%A8%E5%92%8C%E9%A1%B6%E9%83%A8%EF%BC%88%E6%94%AF%E6%8C%81%E6%87%92%E5%8A%A0%E8%BD%BD%E5%92%8C%E6%8B%96%E6%8B%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/510353/Linuxdo%E4%B8%80%E9%94%AE%E6%BB%9A%E5%8A%A8%E5%88%B0%E5%BA%95%E9%83%A8%E5%92%8C%E9%A1%B6%E9%83%A8%EF%BC%88%E6%94%AF%E6%8C%81%E6%87%92%E5%8A%A0%E8%BD%BD%E5%92%8C%E6%8B%96%E6%8B%BD%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建控制按钮
    function createButton(text, onClick, top) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            position: fixed;
            right: 20px;
            top: ${top}px;
            padding: 10px;
            z-index: 9999;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: move;
            opacity: 0.7;
            transition: opacity 0.3s;
        `;
        button.addEventListener('mouseover', () => button.style.opacity = '1');
        button.addEventListener('mouseout', () => button.style.opacity = '0.7');
        button.addEventListener('click', onClick);
        makeDraggable(button);
        return button;
    }

    // 使元素可拖拽
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.right = (parseInt(element.style.right) + pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 滚动函数（通用于顶部和底部）
    function smoothScroll(toTop) {
        return new Promise((resolve) => {
            let lastScrollHeight = document.documentElement.scrollHeight;
            let scrollAttempts = 0;
            const maxScrollAttempts = 50; // 最大滚动尝试次数

            function scroll() {
                if (toTop) {
                    window.scrollTo(0, 0);
                } else {
                    window.scrollTo(0, document.documentElement.scrollHeight);
                }
                scrollAttempts++;

                setTimeout(() => {
                    const currentScrollHeight = document.documentElement.scrollHeight;
                    if (currentScrollHeight !== lastScrollHeight && scrollAttempts < maxScrollAttempts) {
                        lastScrollHeight = currentScrollHeight;
                        scroll();
                    } else {
                        resolve();
                    }
                }, 300); // 等待0.3秒，给懒加载内容时间加载
            }
            scroll();
        });
    }

    // 创建并添加按钮
    const scrollTopButton = createButton('⬆️ 顶部', () => smoothScroll(true), 20);
    document.body.appendChild(scrollTopButton);

    const scrollBottomButton = createButton('⬇️ 底部', () => smoothScroll(false), 70);
    document.body.appendChild(scrollBottomButton);
})();

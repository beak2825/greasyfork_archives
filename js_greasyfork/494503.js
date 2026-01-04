// ==UserScript==
// @name         High Contrast Theme for E-Ink Displays and  page down
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Apply a high contrast black and white theme to all websites for better readability on e-ink displays
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license  MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/494503/High%20Contrast%20Theme%20for%20E-Ink%20Displays%20and%20%20page%20down.user.js
// @updateURL https://update.greasyfork.org/scripts/494503/High%20Contrast%20Theme%20for%20E-Ink%20Displays%20and%20%20page%20down.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 设置高对比度的黑白主题
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = `
            * {
                color: #000000 !important;
            }
            a, a * {
                color: #000000 !important;
            }
            input,select,option,button,textarea {
                color: #000000 !important;
            }
            input: focus,select: focus,option: focus,button: focus,textarea: focus,input: hover,select: hover,option: hover,button: hover,textarea: hover {
                color: #000000 !important;
            }
            input[type=button],input[type=submit],input[type=reset],input[type=image] {
                color: #000000 !important;
            }
    `;
    document.head.appendChild(css);


    // ========================== 翻页 ===================================
    const body = document.body;
    const positionCSS = "bottom:0;right:0";
    const sizeCSS = "width:15vmin;height:30vmin";
    const scrollRatio = 0.9;

    const Container = document.createElement("div");
    Container.style.cssText = `
        ${sizeCSS};
        ${positionCSS};
        position:fixed;
        display:flex;
        flex-direction:column;
        border-style:dashed;
        z-index:2147483647;
        border-width:2px;
    `;

    // 创建一个数组来存储具有overflow-y: auto的元素
    let elementsWithOverflowYAuto = [window];
    let el = window;
    // 设置一个标志变量来记录是否滚动
    let scrolled = false;
    let index = -1;

    init();

    function init() {
        // 创建一个数组来存储具有overflow-y: auto的元素
        elementsWithOverflowYAuto = [window];
        el = window;
        // 设置一个标志变量来记录是否滚动
        scrolled = false;
        index = -1;


        // 确认滚动元素
        setTimeout(() => {
            check();
        }, 80);

    }

    function check() {
        if (scrolled) {
            return;
        }
        index++;
        if (index == 1) {
            tryFindOverflowY();
        }
        if (index >= elementsWithOverflowYAuto.length) {
            el = window;
            return;
        }
        el = elementsWithOverflowYAuto[index];
        // 监听滚动事件
        el.addEventListener('scroll', function () {
            scrolled = true;
        });

        // 执行滚动操作
        el.scrollBy(0, 1);
        setTimeout(() => {
            check();
        }, 30);

    }


    function tryFindOverflowY() {
        // 获取所有元素.
        var allElements = document.querySelectorAll('*');
        let arr = [];
        // 遍历所有元素，检查它们的样式
        allElements.forEach(function (element) {
            // 获取元素的计算样式
            var style = getComputedStyle(element);

            // 检查overflow-y属性是否为auto
            if (style.overflowY === 'auto') {
                // 如果是，添加到结果数组中
                arr.push(element);
            }
        });
        arr.sort((a, b) => {
            return (b.clientHeight + b.clientWidth) - (a.clientHeight + a.clientWidth);
        })
        elementsWithOverflowYAuto = elementsWithOverflowYAuto.concat(arr);
    }

    const UpButton = document.createElement("div");
    UpButton.style.cssText = "flex:1";
    UpButton.addEventListener('click', () => {
        scroll(-scrollRatio * window.innerHeight);
    });

    const DownButton = document.createElement("div");
    DownButton.style.cssText = "flex:1;border-top-style:dashed;border-width:2px;";
    DownButton.addEventListener('click', () => {
        scroll(scrollRatio * window.innerHeight);
    });

    function scroll(y) {
        if (document.contains(el)) {
            el.scrollBy(0, y);
            return;
        }
        init();
        setTimeout(() => {
            if (document.contains(el)) {
                el.scrollBy(0, y);
            }
        }, 150);
    }

    Container.appendChild(UpButton);
    Container.appendChild(DownButton);
    body.appendChild(Container);

})();

// ==UserScript==
// @name         KDJ-AutoApply
// @namespace    http://tampermonkey.net/
// @version      20250115
// @description  -
// @author       Kahle
// @match        https://kdj.kuaishou.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/523782/KDJ-AutoApply.user.js
// @updateURL https://update.greasyfork.org/scripts/523782/KDJ-AutoApply.meta.js
// ==/UserScript==

/* 更新日志
* update 2024-11-25 解决其它界面显示按钮的bug
* update 2024-11-25 优化使用，消除可能的隐患
* update 2024-11-25 每次到了最后一页或第一页反向点
* update 2025-01-15 只申请首发
*/

(function() {
    'use strict';
    //alert('hello world');

    let btn = document.createElement("button");
    btn.innerHTML = "开始";
    btn.className = "ks-button ks-button--primary ks-button--mini is-plain";
    btn.style.marginLeft = '10px';

    // 创建一个新的 span 元素
    let newSpan = document.createElement("span");
    newSpan.style.marginLeft = '10px';

    // 保存当前 URL 参数
    let currentSearch = location.search;
    let start = false;

    let lastIndex = 1;
    let currIndex = 1;

    let next_class = 'button.btn-next'

    getParams();

    btn.onclick = function () {
        if(start == false) {
            start = true;
            btn.innerHTML = "停止";
            clickStart();
        }
        else {
            start = false;
            btn.innerHTML = "开始";
        }
    };

    // 观察 URL 参数的变化
    const observer = new MutationObserver(() => {
        if (currentSearch !== location.search) {
            currentSearch = location.search;
            getParams();
            const path = window.location.pathname;
            if(path == '/home/distribution/recruit-mode/distributor') {
                if(start){
                    if(currIndex != lastIndex) {
                        clickStart();
                        lastIndex = currIndex;
                    }
                }
            }
        }
    });

    // 启动监听
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // 解析 URL 参数为对象
    function getParams() {
        const path = window.location.pathname;
        if(path != '/home/distribution/recruit-mode/distributor') {
            newSpan.remove();
            btn.remove();
            start = false;
        }
        const params = new URLSearchParams(location.search);
        const result = {};
        for (const [key, value] of params.entries()) {
            result[key] = value;
            if(key == 'miniSeriesSaleType') {
                if(value == 0) {
                    // 目标元素的选择器
                    const targetSelector = '.header__logo';

                    const interval = setInterval(() => {
                        const targetElement = document.querySelector(targetSelector);
                        if (targetElement) {
                            clearInterval(interval); // 停止定时器

                            const oldSpan = document.querySelector('span')
                            for (const attr of oldSpan.attributes) {
                                // 将每个属性赋值到新的 span 元素上
                                newSpan.setAttribute(attr.name, attr.value);
                            }

                            // 将 span 元素添加到 div 中
                            targetElement.appendChild(newSpan);
                            targetElement.append(btn);
                        }
                    }, 500); // 每 500 毫秒检查一次
                }
                else {
                    start = false;
                    newSpan.remove();
                    btn.remove();
                }
            }
            else if(key == 'pageNum'){
                currIndex = value;
            }
        }
        return result;
    }



    async function clickStart(){
        await new Promise(resolve => setTimeout(resolve, 500));

        async function clickValidButtons() {
            const headers = document.getElementsByClassName('header');

            for(let i = 2; i < headers.length; i++) {
                const header = headers.item(i);

                const firstLine = header.innerText.split('\n')[0];

                if(firstLine === '首发'){
                    if(!header.childNodes.item(2).classList.contains('is-disabled')) {
                        header.childNodes.item(2).click();
                        console.log(header.innerText.split('\n')[1]);
                    }
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            let next = document.querySelector(next_class);
            if(next == null || next.disabled) {
                if(next_class == 'button.btn-next') {
                    next_class = 'button.btn-prev'
                }
                else {
                    next_class = 'button.btn-next'
                }

                next = document.querySelector(next_class);
            }
            next.click();
        }

        clickValidButtons();

        //         // 获取所有按钮元素
        //         const buttons = document.querySelectorAll('button');

        //         let next = document.querySelector(next_class);

        //         // 筛选出没有 'is-disabled' 类的有效按钮
        //         const validButtons = Array.from(buttons).filter(button => {
        //             const ariaDescribedby = button.getAttribute('aria-describedby');
        //             if (ariaDescribedby && ariaDescribedby.includes('ks-popper') && !button.classList.contains('is-disabled')) {
        //                 console.log('找到包含 aria-describedby="ks" 的按钮:', button);
        //                 return true;
        //             }
        //         });

        //         // 遍历有效按钮并点击，每个按钮之间间隔 1 秒
        //         async function clickValidButtons() {
        //             if(validButtons.length != 0) {
        //                 for (const button of validButtons) {
        //                     button.click(); // 点击按钮
        //                     console.log('点击了按钮:', button);
        //                     await new Promise(resolve => setTimeout(resolve, 1000)); // 等待 1 秒
        //                     if(!start) {
        //                         break;
        //                     }
        //                 }
        //             }

        //             if(!start) {
        //                 return;
        //             }

        //             await new Promise(resolve => setTimeout(resolve, 500));

        //             if(next == null || next.disabled) {
        //                 if(next_class == 'button.btn-next') {
        //                     next_class = 'button.btn-prev'
        //                 }
        //                 else {
        //                     next_class = 'button.btn-next'
        //                 }

        //                 next = document.querySelector(next_class);
        //             }
        //             next.click();
        //             console.log('点击了下一页')
        //         }

        // 调用函数执行有效按钮的点击操作
        //         clickValidButtons();
    }

})();
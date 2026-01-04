// ==UserScript==
// @name         有谱么 破解打印
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  启用本插件后，直接点击打印曲谱即可
// @author       AnnSir
// @match        http://*/*
// @match        *://yopu.co/view/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/466784/%E6%9C%89%E8%B0%B1%E4%B9%88%20%E7%A0%B4%E8%A7%A3%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/466784/%E6%9C%89%E8%B0%B1%E4%B9%88%20%E7%A0%B4%E8%A7%A3%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function() {

})();
(function() {
    'use strict';
    function toast(t){
        // 创建 toast 元素
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.top = '30%'; // 调整为偏上位置
        toast.style.left = '50%';
        toast.style.transform = 'translate(-50%, -50%)'; // 居中
        toast.style.padding = '20px 40px'; // 增加内边距
        toast.style.fontSize = '20px'; // 增加字体大小
        toast.style.backgroundColor = '#333';
        toast.style.color = '#fff';
        toast.style.borderRadius = '8px';
        toast.style.opacity = '0.9';
        toast.style.transition = 'opacity 0.5s ease';
        toast.style.zIndex = '10000';
        toast.innerText =t;

        document.body.appendChild(toast);

        // 显示并在几秒后自动消失
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 2000);
    }

    function deleteDialog(){
        // 找到所有dialog标签
        const dialogs = document.querySelectorAll('dialog');
        dialogs.forEach(dialog => {
            dialog.remove(); // 删除dialog标签及其子元素
        });
    }
    function addStyles() {
        const styleSheet = document.querySelector('style');
        const newStyles = `
                @media print {
                    .no-print {
                        display: none; /* 隐藏不打印的元素 */
                    }
                    h1, h2, p {
                        font-size: 12pt; /* 打印时字体大小 */
                    }
            button {
                display: none !important; /* 打印时隐藏按钮 */
            }
                }
            `;
        styleSheet.innerHTML += newStyles; // 将新样式添加到现有样式中
    }

    function modifyPage(){
        const headerElement = document.querySelector('header');
        // 检查是否存在 <header> 元素
        if (headerElement) {
            // 移除 <header> 元素及其子元素
            headerElement.remove();
        }
        // 修改 <html> 标签的 overflow 属性
        document.documentElement.style.overflow = 'scroll';
        //修改打印设置为允许打印，去除打印提示页
        const doNotPrintElem = document.querySelector('.no-print');
        if (doNotPrintElem) {
            doNotPrintElem.setAttribute("class","allow-print");
        }

        const printElems = document.querySelectorAll('div.print-sheet.svelte-10d563p');
        printElems.forEach(printElem => {
            printElem.remove();
        });
        // 选择所有 class 包含 "side" 的元素
        const sideElements = document.querySelectorAll('[class*="side"]');

        // 遍历每个元素并移除
        sideElements.forEach(element => {
            element.remove();
        });

        const panelElements = document.querySelectorAll('[class*="panel"]');

        // 遍历每个元素并移除
        panelElements.forEach(element => {
            element.remove();
        });
        // 创建一个观察者实例
        const observer = new MutationObserver((mutationsList) => {
            // 遍历所有变动
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 查找并移除所有 class 中包含 "at" 的 <g> 标签
                    const gElementsWithAtClass = document.querySelectorAll('g[class*="at"]');
                    gElementsWithAtClass.forEach(element => {
                        element.remove();
                    });

                    // 查找并移除所有 class 中包含 "at" 的 <g> 标签
                    const layoutElementsWithAtClass = document.querySelectorAll('div[class*="layout"]');
                    layoutElementsWithAtClass.forEach(element => {
                        element.style.width='750px'
                    });
                    // 查找所有 class 中包含 "main" 的 <div> 元素
                    const divElementsWithMainClass = document.querySelectorAll('div[class*="main"]');
                    divElementsWithMainClass.forEach(element => {
                        // 去除 height 属性
                        element.style.height = 'auto';
                    });
                    // 查找所有 class 中包含 "main" 的 <div> 元素
                    const sheetElementsWithMainClass = document.querySelectorAll('div[class*="sheet-container"]');
                    sheetElementsWithMainClass.forEach(element => {
                        // 去除 height 属性
                        element.style.flex='none';
                    });
                    const cursorElementsWithMainClass = document.querySelectorAll('div[class*="at-cursors"]');
                    cursorElementsWithMainClass.forEach(element => {
                        element.remove();
                    });
                }
            }
        });

        // 配置观察选项
        const config = { childList: true, subtree: true };
        // 开始观察文档的主体
        observer.observe(document.body, config);


    }

    // 查找包含 "修改我" 的元素
    const elements = Array.from(document.body.getElementsByTagName("*"));
    elements.forEach(element => {
        if (element.textContent.includes("打印曲谱")) {
            if (element.tagName.toLowerCase() === 'button') {
                // 修改按钮的点击事件
                element.addEventListener('click', function(event) {
                    deleteDialog();
                    addStyles();
                    toast('按下Ctrl+P打印曲谱');
                    modifyPage();
                });
            }
        }
    });


})();
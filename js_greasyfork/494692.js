// ==UserScript==
// @name         OpenAI ChatGPT新版UI切换
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  为未获得内测权限的用户开启新版UI，本插件预计将在新版UI正视上线后失效，ChatGPT新版UI切换
// @author       树梢上有只鸟
// @icon         https://chat.openai.com/favicon.ico
// @match        https://chat.openai.com/
// @match        https://chat.openai.com/？*
// @match        https://chat.openai.com/c/*
// @match        https://chat.openai.com/g/*
// @match        https://chat.openai.com/gpts
// @match        https://chat.openai.com/gpts/*
// @match        https://chat.openai.com/share/*
// @match        https://chat.openai.com/share/*/continue
// @match        https://chatgpt.com/
// @match        https://chatgpt.com/?*
// @match        https://chatgpt.com/c/*
// @match        https://chatgpt.com/g/*
// @match        https://chatgpt.com/gpts
// @match        https://chatgpt.com/gpts/*
// @match        https://chatgpt.com/share/*
// @match        https://chatgpt.com/share/*/continue
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494692/OpenAI%20ChatGPT%E6%96%B0%E7%89%88UI%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/494692/OpenAI%20ChatGPT%E6%96%B0%E7%89%88UI%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const addStyles = () => {
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = `
            .modal-overlay {
                z-index: 1500;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                visibility: hidden;
                opacity: 0;
                transition: all 0.3s;
            }
            .modal {
                background-color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 1001;
                position: relative;
                min-width: 300px;
                min-height: 150px;
                width: auto;
                transition: all 0.3s;
            }
            .modal>h2 {
                margin-bottom: 10px;
            }
            .close-btn, .confirm-btn, .cancel-btn {
                cursor: pointer;
                margin-top: 20px;
                transition: all 0.3s;
            }
            .close-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 16px;
                margin: 0;
                padding: 0;
                width: 20px;
                height: 20px;
                text-align: center;
                line-height: 20px;
                border-radius: 5px;
            }
            .close-btn:hover {
                background-color: #4CAF50;
                color: #fff;
            }
            .button-container {
                display: flex;
                justify-content: space-between;
            }
            .modal button {
                padding: 10px 25px;
                margin-right: 10px;
                border-radius: 10px;
                background-color: aliceblue;
            }
            .modal button:hover {
                background-color: #4CAF50;
                color: #fff;
            }
            .ui-button {
                padding: 8px 15px;
                border: none;
                border-radius: 5px;
                background-color: aliceblue;
                cursor: pointer;
                color: var(--text-secondary);
            }
            .ui-button:hover {
                background-color: #4CAF50;
                color: #fff;
            }
            .new-ui-button {
                width: 100%;
                height: 46px;
                border-width: 1px;
                border-radius: .5rem;
                margin-bottom: .5rem;
                font-size: .875rem;
                line-height: 1.25rem;
                text-align: left;
                padding-left: 10px;
                border-color: rgba(0, 0, 0, .1);
                background-color: #f9f9f9;
                color: #0d0d0d;
            }
            .new-ui-button:hover {
                background-color: hsla(0, 0%, 61%, .1);
            }
            .gpt-ui-button {
                width: 100%;
                height: 56px;
                border-radius: .5rem;
                margin-top: .5rem;
                font-size: .875rem;
                line-height: 1.25rem;
                text-align: left;
                padding: 13px;
                padding-left: 10px;
                border-color: rgba(0, 0, 0, .1);
                background-color: #f9f9f9;
                color: #0d0d0d;
            }
            .gpt-ui-button:hover {
                background-color: #ECECEC;
            }
            .button_icon {
                width: 17px;
                height: 17px;
                display: inline-block;
                margin-right: 8px;
                margin-left: 3px;
            }
            .gpt-ui-button>.button_icon {
                width: 30px;
                height: 30px;
                display: inline-block;
                margin-right: 8px;
                margin-left: -3px;
                border: 1px solid #d3d3d3;
                padding: 5px;
                border-radius: 50%;
            }
            bold {
                font-weight: bold;
            }
        `;
        document.head.appendChild(styleSheet);
    };

    // 创建并显示弹窗
    const showModal = (currentMode) => {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `<h2>是否切换UI模式？</h2>
                           <p>当前已 <bold>${currentMode ? '开启' : '关闭'}</bold> 新版UI</p>
                           <p>点击确定进行切换</p>
                           <div class="button-container">
                               <button class="cancel-btn">取消</button>
                               <button class="confirm-btn">确定</button>
                           </div>
                           <span class="close-btn">&times;</span>`;

        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);

        const closeBtn = modal.querySelector('.close-btn');
        const confirmBtn = modal.querySelector('.confirm-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');

        // 关闭弹窗
        const closeModal = () => {
            modalOverlay.style.opacity = '0';
            setTimeout(() => {
                modalOverlay.style.visibility = 'hidden';
                modalOverlay.remove(); // 从 DOM 中删除弹窗
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        // 确认并切换模式
        confirmBtn.addEventListener('click', function() {
            if (currentMode) {
                localStorage.setItem('STATSIG_LOCAL_STORAGE_INTERNAL_STORE_OVERRIDES_V3', '{"gates":{},"configs":{},"layers":{}}');
            } else {
                localStorage.setItem('STATSIG_LOCAL_STORAGE_INTERNAL_STORE_OVERRIDES_V3', '{"gates":{"chatgpt_fruit_juice":true},"configs":{},"layers":{}}');
            }
            location.reload();
            closeModal();
        });

        modalOverlay.style.visibility = 'visible';
        modalOverlay.style.opacity = '1';
    };

        // 按钮事件处理
    const addButton = () => {
        setTimeout(() => {
            const targetElement1 = document.querySelector('.flex.flex-col.pt-2.empty\\:hidden.juice\\:py-2.dark\\:border-white\\/20');
            const targetElement2 = document.querySelector('a[data-state="closed"]');
            var button = document.createElement('button');
            button.textContent = ' 切换UI模式'; // 在按钮文本前添加空格以分隔图标和文本

            // 创建 SVG 图标
            var svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgIcon.setAttribute("t", "1715701749676");
            svgIcon.setAttribute("class", "button_icon");
            svgIcon.setAttribute("viewBox", "0 0 1024 1024");
            svgIcon.setAttribute("version", "1.1");
            svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svgIcon.setAttribute("p-id", "4248");
            svgIcon.setAttribute("width", "20"); // 调整图标大小
            svgIcon.setAttribute("height", "20");

            var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M618.688 149.312l0 213.376L64 362.688 64 448l896 0L618.688 149.312zM405.312 874.688l0-213.376L960 661.312 960 576 64 576 405.312 874.688z");
            path.setAttribute("fill", "#000000");
            path.setAttribute("p-id", "4249");

            svgIcon.appendChild(path);
            button.insertBefore(svgIcon, button.firstChild); // 将 SVG 插入按钮文本之前

            button.addEventListener('click', function() {
                var currentMode = localStorage.getItem('STATSIG_LOCAL_STORAGE_INTERNAL_STORE_OVERRIDES_V3');
                var isModeEnabled = currentMode && currentMode.includes('chatgpt_fruit_juice":true');
                showModal(isModeEnabled);
            });

            if (targetElement1) {
                // 将按钮添加到 class="flex flex-col pt-2 empty:hidden juice:py-2 dark:border-white/20" 元素同级上方
                button.className = 'gpt-ui-button'; // 应用不同样式
                targetElement1.parentNode.insertBefore(button, targetElement1);
            } else if (targetElement2) {
                // 将按钮添加到 a[data-state="closed"] 元素后面
                button.className = 'new-ui-button'; // 应用不同样式
                targetElement2.insertAdjacentElement('afterend', button);
                } else {
                    // 默认位置
                button.className = 'ui-button';
                button.style.position = 'fixed';
                button.style.top = '8px';
                button.style.right = '140px';
                button.style.zIndex = '1000';
                document.body.appendChild(button);
            }
        }, 3000); // 延时3秒，等待页面加载
    };

    window.addEventListener('load', function() {
        addStyles();
        addButton();
    });
})();

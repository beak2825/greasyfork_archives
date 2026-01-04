// ==UserScript==
// @name         TEMU卖家中心导出库存价格
// @namespace    http://tampermonkey.net/
// @version      0.7.10
// @description  TEMU卖家中心导出库存价格, 屏蔽弹窗
// @author       HimekoEx
// @license      GPL-3.0
// @match        *://*.kuajingmaihuo.com/*
// @match        *://*.agentseller.temu.com/*
// @match        *://*.agentseller-us.temu.com/*
// @icon         https://bstatic.cdnfe.com/static/files/sc/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/497605/TEMU%E5%8D%96%E5%AE%B6%E4%B8%AD%E5%BF%83%E5%AF%BC%E5%87%BA%E5%BA%93%E5%AD%98%E4%BB%B7%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/497605/TEMU%E5%8D%96%E5%AE%B6%E4%B8%AD%E5%BF%83%E5%AF%BC%E5%87%BA%E5%BA%93%E5%AD%98%E4%BB%B7%E6%A0%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 排除特定URL
    const excludedUrlPrefix = 'https://seller.kuajingmaihuo.com/settle/seller-login';
    if (window.location.href.startsWith(excludedUrlPrefix)) {
        console.log('当前URL被排除, 脚本终止执行');
        return;
    }

    console.log('TEMU卖家中心导出库存价格...脚本启动');

    // 添加菜单级别的开关变量, 并从本地存储中获取上次的状态
    var removeDivsEnabled = GM_getValue('removeDivsEnabled', false);
    console.log('屏蔽弹窗:', removeDivsEnabled);

    // 切换 removeDivs 开关状态的函数, 并保存状态到本地存储
    function toggleRemoveDivs() {
        removeDivsEnabled = !removeDivsEnabled;
        GM_setValue('removeDivsEnabled', removeDivsEnabled);
        console.log('屏蔽弹窗 toggle:', removeDivsEnabled);
        location.reload();
    }

    function updateMenuCommand() {
        // 添加菜单命令, 用于切换开关状态
        GM_registerMenuCommand(removeDivsEnabled ? "屏蔽弹窗 ON" : "屏蔽弹窗 OFF", toggleRemoveDivs);
    }

    // 更新菜单状态, 确保与开关状态一致
    updateMenuCommand();

    // 拦截fetch请求
    const originalFetch = window.unsafeWindow.fetch;
    window.unsafeWindow.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);
        let url = args[0]; // 获取 fetch 的第一个参数
    
        // 如果 url 是 Request 对象, 提取实际的 URL
        if (url instanceof Request) {
            url = url.url;
        }

        // 确保 url 是字符串, 再调用 includes
        if (typeof url === 'string' && url.includes('/bg-visage-mms/product/skc/pageQuery')) {
            const clone = response.clone();
            clone.json().then(data => {
                console.log('拦截到的fetch响应:', data);
                // 如有需要, 可以将拦截到的数据存储在localStorage中
                localStorage.setItem('interceptedFetchData', JSON.stringify(data));
            }).catch(err => {
                console.error('解析fetch响应失败:', err);
            });
        }
        return response;
    };

    // 拦截XMLHttpRequest
    const originalOpen = window.unsafeWindow.XMLHttpRequest.prototype.open;
    window.unsafeWindow.XMLHttpRequest.prototype.open = function (...args) {
        this._url = args[1];
        originalOpen.apply(this, args);
    };

    const originalSend = window.unsafeWindow.XMLHttpRequest.prototype.send;
    window.unsafeWindow.XMLHttpRequest.prototype.send = function (...args) {
        this.addEventListener('load', function () {
            if (this._url.includes('/bg-visage-mms/product/skc/pageQuery')) {
                console.log('XMLHttpRequest加载事件URL:', this._url);
                const response = this.responseText;
                try {
                    const data = JSON.parse(response);
                    console.log('拦截到的XMLHttpRequest响应:', data);
                    // 如有需要, 可以将拦截到的数据存储在localStorage中
                    localStorage.setItem('interceptedXHRData', JSON.stringify(data));
                } catch (e) {
                    console.error('解析XMLHttpRequest响应失败:', e);
                }
            }
        });
        originalSend.apply(this, args);
    };

    // 删除特定div的函数
    function removeDivs() {
        if (!removeDivsEnabled) return; // 如果开关关闭, 则不执行操作

        const selectors = [
            'body > div[data-testid="beast-core-modal-mask"]',
            'body > div[data-testid="beast-core-modal"]',
            'body > div.MDL_mask_5-114-0',
            'body > div.MDL_outerWrapper_5-114-0',
            'body > div.MDL_mask_5-113-0',
            'body > div.MDL_outerWrapper_5-113-0',
            'div.sold-out-goods-list_container__1zO49',
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => element.remove());
        });
    }

    // 等待页面完全加载
    window.addEventListener('load', () => {
        console.log('页面已完全加载');
        removeDivs();

        // 如果在初始加载后动态加载元素, 使用MutationObserver
        const observer = new MutationObserver(() => {
            removeDivs();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // 5秒后停止观察
        setTimeout(() => {
            observer.disconnect();
            console.log('停止观察DOM变动');
        }, 5000);

        // 检查页面URL并在特定页面添加按钮
        const productListUrlPrefix = 'https://seller.kuajingmaihuo.com/goods/product/list'
        if (window.location.href.startsWith(productListUrlPrefix)) {
            console.log('在指定页面, 3秒后添加按钮');
            setTimeout(addButton, 3000);
        }
    });

    // 添加按钮的函数
    function addButton() {
        const parentDiv = document.querySelector('div.hooks_dividerLeftBlock__1d8oE');
        if (parentDiv) {
            const button = document.createElement('button');
            button.className = 'BTN_outerWrapper_5-113-0 BTN_primary_5-113-0 BTN_medium_5-113-0 BTN_outerWrapperBtn_5-113-0';
            button.setAttribute('data-testid', 'beast-core-button');
            button.setAttribute('type', 'button');
            button.style.marginLeft = '0px';
            button.style.marginRight = '8px';

            const buttonContent = document.createElement('div');
            buttonContent.className = 'product-migrate_btnContent__NRxKq';
            buttonContent.textContent = '导出库存&价格';

            button.appendChild(buttonContent);
            parentDiv.appendChild(button);

            // 添加按钮点击事件
            button.addEventListener('click', exportData);
            console.log('按钮已添加');
        } else {
            console.error('未找到目标父div, 无法添加按钮');
        }
    }

    // 导出数据的函数
    function exportData() {
        const data = localStorage.getItem('interceptedFetchData') || localStorage.getItem('interceptedXHRData');
        if (data) {
            const span = document.querySelector('span.elli_outerWrapper_5-109-0.elli_limitWidth_5-109-0');
            const fileName = span ? span.textContent.trim() : '库存价格数据';
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileName}.json`;
            a.click();
            URL.revokeObjectURL(url);
            console.log('数据已导出');

            // 清空存储的json数据
            localStorage.removeItem('interceptedFetchData');
            localStorage.removeItem('interceptedXHRData');
            console.log('存储的数据已清空');
        } else {
            console.error('没有找到要导出的数据');
        }
    }
})();

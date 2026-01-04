// ==UserScript==
// @name         工单自动更新
// @namespace    http://tampermonkey.net/
// @license     MIT
// @version      2025-04-13
// @description  运盟工单的自动化操作，协助工作人员简单化操作
// @author       FNG666
// @match        https://gongdan.yonmen.com:17040/index.html*
// @match        https://dolphin.yonmen.com/web/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yonmen.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/532484/%E5%B7%A5%E5%8D%95%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/532484/%E5%B7%A5%E5%8D%95%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const minTime = 3000;
    const maxTime = 5000;
    let refreshTime = generateTime(minTime, maxTime);
    let timer;
    let autoRefreshActive = localStorage.getItem('autoRefreshActive') === 'true';

    function clickSearchButton() {
        var elementsWithDataV = document.querySelectorAll('[data-v-9b60ccf4]');
        elementsWithDataV.forEach(function(element) {
            var buttons = element.querySelectorAll('button');
            buttons.forEach(function(button) {
                if (button.classList.contains('search-button')) {
                    button.click();
//                     console.log("dian");
                }
                else{
                    console.log("weidian");
                }
            });
        });
    };
    function generateTime(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.padding = '10px 20px';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        toast.style.color = 'white';
        toast.style.borderRadius = '5px';
        toast.style.fontSize = '24px';
        toast.style.zIndex = '9999';
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 4000);
    }

    function startAutoRefresh() {
        // 如果已经在定时中则返回
        if (timer) return;
        timer = setInterval(clickSearchButton,refreshTime);
        showToast(`已开启自动更新工单，ctrl+alt+e开启/关闭`);
    }
    //主程序 ${refreshTime / 1000} 秒刷新工单
    function stopAutoRefresh() {
        clearInterval(timer);
        timer = null;
        showToast('已关闭自动更新工单，ctrl+alt+e开启/关闭');
    }
    // 获取当前 URL 的哈希部分
    const hash = window.location.hash;
    // 只匹配 #/app/workBill
    if ((hash === '#/app/workBill') || (hash === '#/welcome/index')) {
        console.log("匹配成功：当前页面是 /app/workBill");


        // 初始状态处理
        if (autoRefreshActive) {
            startAutoRefresh();
        } else {
            showToast('未开启自动更新工单！ctrl+alt+e开启/关闭');
            console.log('未开启自动更新工单！ctrl+alt+e开启/关闭');
        }

        document.addEventListener('keydown', function (event) {
            if (event.ctrlKey && event.altKey && event.key === 'e') {
                autoRefreshActive = !autoRefreshActive; // 切换状态
                localStorage.setItem('autoRefreshActive', autoRefreshActive);
                if (autoRefreshActive) {
                    // 如果是固定时间，则注释这行代码
                    refreshTime = generateTime(minTime, maxTime); // 每次启用时重新生成刷新时间
                    startAutoRefresh();
                } else {
                    stopAutoRefresh();
                }
            }
        });

        window.onbeforeunload = function () {
            // 开启自动刷新的情况下，不执行删除
            if (!autoRefreshActive) {
                localStorage.removeItem('autoRefreshActive');
            }
        };
    } else {
        console.log("未匹配到 /app/workBill，停止执行脚本。");
    }






    // 添加按钮样式
    GM_addStyle(`
        #custom-dolphin-btn {
            position: fixed;
            top: 38.2%;
            left: 1.5%;
            transform: translateY(-50%);
            z-index: 9999;
            padding: 10px 15px;
            background-color: #ec6133;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }
        #custom-dolphin-btn:hover {
            background-color: #ff8355;
        }
    `);



    // 当前页面是工单系统首页时
    if (window.location.href.startsWith('https://gongdan.yonmen.com:17040/index.html#/app/workBillDetail')) {
        // 获取车牌号
        function getLicensePlate() {
            const plateElement = Array.from(document.querySelectorAll('.k-form-item-label'))
            .find(label => label.textContent.includes('车头号牌：'))
            ?.closest('.k-form-item')
            ?.querySelector('.form-item-text');
            return plateElement?.textContent?.trim() || null;
        }

        // 添加跳转按钮
        const btn = document.createElement('button');
        btn.id = 'custom-dolphin-btn';
        btn.textContent = '跳转到监控查询';
        document.body.appendChild(btn);

        btn.addEventListener('click', function() {
            const licensePlate = getLicensePlate();
            if (licensePlate) {
                console.log('获取到车牌号:', licensePlate);
                GM_setValue('licensePlate', licensePlate);
                window.open('https://dolphin.yonmen.com/web/#/entiremonitor');
            } else {
                alert('未能获取车牌号，请检查页面结构');
                console.error('车牌号元素未找到');
            }
        });
    }

    // 当前页面是监控页面时
    if (window.location.href.startsWith('https://dolphin.yonmen.com/web/#/entiremonitor')) {
        // 主处理函数
        function handleAutoQuery() {
            try {
                const licensePlate = GM_getValue('licensePlate');
                if (!licensePlate) {
                    throw new Error('未获取到车牌号');
                }

                console.log('开始自动查询流程，车牌号:', licensePlate);

                // 查找车牌输入框容器
                const searchKeySelect = document.querySelector('.select-wrap .search-key.k-select');
//                 console.log(searchKeySelect);
                if (!searchKeySelect) {
                    throw new Error('未找到车牌输入框容器');
                }

                //                 // 点击输入框容器以激活下拉
                //                 console.log('点击车牌输入框容器激活下拉...');
                //                 searchKeySelect.click();

                // 查找实际输入框
                const plateInput = searchKeySelect.querySelector('input.k-select-label[placeholder="请输入车牌号"]');
                if (!plateInput) {
                    throw new Error('未找到车牌输入框');
                }

                // 设置车牌号并触发事件
                console.log('设置车牌号:', licensePlate);
                plateInput.value = licensePlate;

                // 触发所有必要事件
                triggerAllEvents(plateInput);

                // 等待下拉框出现并选择第一项


            } catch (e) {
                console.error('自动查询出错:', e);
                retryHandler();
            }
        }


        // 触发所有必要事件
        function triggerAllEvents(element) {
            const events = ['input', 'change', 'keydown', 'keyup', 'focus', 'blur'];
            events.forEach(eventType => {
                const event = new Event(eventType, { bubbles: true });
                element.dispatchEvent(event);
            });
            console.log('已触发所有必要事件');
        }
        // 点击查询按钮
        function clickQueryButton() {
            // 查找查询按钮
            const queryButtons = document.querySelectorAll('.k-button-default span');
            let queryBtn = null;

            // 遍历找到包含"查询"文本的按钮
            queryButtons.forEach(btn => {
                if (btn.textContent.trim() === '查询') {
                    queryBtn = btn.closest('button');
                }
            });

            if (queryBtn) {
                queryBtn.click();
                console.log('已点击查询按钮');
            } else {
                console.error('未找到查询按钮');
                retryHandler();
            }
        }

        // 重试处理
        function retryHandler() {
            const retryDelay = 3000;
            console.log(`${retryDelay/1000}秒后重试...`);
            setTimeout(handleAutoQuery, retryDelay);
        }

        // 初始执行，等待5秒确保页面完全加载
        console.log('页面已加载，等待5秒后开始操作...');
        setTimeout(handleAutoQuery, 500);
    }

})();


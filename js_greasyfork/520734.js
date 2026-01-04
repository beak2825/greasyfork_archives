// ==UserScript==
// @name         B站快速收藏
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  按住收藏按钮，移动到收藏选项，松开按钮直接收藏
// @author       F_thx
// @match        https://www.bilibili.com/video/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520734/B%E7%AB%99%E5%BF%AB%E9%80%9F%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/520734/B%E7%AB%99%E5%BF%AB%E9%80%9F%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==

(function () {
    let mouseX = 0
    let mouseY = 0
    let timeOut = 1000
    const debugMode = 0
    'use strict';

    // 添加样式以隐藏bili-dialog-m
    const style = document.createElement('style');
    style.innerHTML = `
        #debug-info {
            position: fixed;
            top: 10px;
            left: 10px;
            color: red;
            z-index: 10001;
        }
        .wheelItem {
            color: var(--text2);
            background: var(--graph_bg_regular);
            height: 28px;
            line-height: 28px;
            border-radius: 14px;
            font-size: 13px;
            padding: 0 12px;
            box-sizing: border-box;
            transition: all .3s;
            display: inline-flex;
            align-items: center;
            cursor: pointer;
        }
    `;

    const style2 = document.createElement('style');
    style2.innerHTML = ``;
    style2.id = 'runtimeStyle'
    document.addEventListener('mousemove', function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    document.head.appendChild(style);
    document.head.appendChild(style2);

    // 创建调试信息元素
    const debugInfo = document.createElement('div');
    debugInfo.id = 'debug-info';
    document.body.appendChild(debugInfo);

    // 更新调试信息
    function updateDebugInfo(message) {
        if (!debugMode)return
        debugInfo.textContent = message;
    }

    // 获取收藏按钮
    const favButton = document.querySelector('div[title="收藏（E）"]');

    // 监听按住事件
    let holdTimeout;
    favButton.addEventListener('mousedown', function (event) {


        holdTimeout = setTimeout(() => {
            // 模拟点击收藏按钮以打开收藏夹页面
            document.querySelector('#runtimeStyle').innerHTML = `
            .bili-dialog-bomb {
                display: none !important;
            }
            `;
            favButton.click();
            setTimeout(() => {
                // 显示转盘菜单
                showWheelMenu();
            }, 50); // 等待收藏夹内容加载
        }, 300); // 0.5秒后显示转盘
    });

    favButton.addEventListener('mouseup', function (event) {
        clearTimeout(holdTimeout);
    });

    // 显示转盘菜单
    function showWheelMenu() {


        // 获取收藏夹列表
        let favList = document.querySelectorAll('body > div.bili-dialog-m > div > div > div.content > div > ul > li > label > span.fav-title');
        if (favList.length < 1) {
            setTimeout(showWheelMenu,50)
            timeOut += 50
            return
        }
        // 更新调试信息
        updateDebugInfo('收藏夹已开启 耗时'+timeOut+'ms');
        timeOut = 0


        // 创建并显示自定义转盘菜单
        const wheelMenu = document.createElement('div');
        wheelMenu.id = 'wheel-menu';
        wheelMenu.style.position = 'fixed';
        wheelMenu.style.top = '50%';
        wheelMenu.style.left = '50%';
        wheelMenu.style.transform = 'translate(-50%, -50%)';
        wheelMenu.style.zIndex = '10000';
        wheelMenu.style.background = 'white';
        wheelMenu.style.borderRadius = '50%';
        wheelMenu.style.width = '200px';
        wheelMenu.style.height = '200px';
        wheelMenu.style.display = 'flex';
        wheelMenu.style.flexDirection = 'column';
        wheelMenu.style.alignItems = 'center';
        wheelMenu.style.justifyContent = 'center';
        wheelMenu.style.left = (mouseX - wheelMenu.offsetWidth / 2) + 'px';
        wheelMenu.style.top = (mouseY - wheelMenu.offsetHeight / 2) + 'px';
        wheelMenu.classList.add('wheelMenu')
        wheelMenu.zIndex = '10202'
        let selectFavorit = false

        favList.forEach((fav, index) => {
            const favItem = document.createElement('div');
            favItem.textContent = fav.textContent;
            // favItem.style.padding = '10px 20px';
            // favItem.style.margin = '10px';
            // favItem.style.borderRadius = '15px';
            // favItem.style.cursor = 'pointer';
            // favItem.style.color = 'white';
            // favItem.style.fontSize = '16px';
            // favItem.style.background = 'rgba(0, 0, 0, 0.6)';
            // favItem.style.transition = 'background-color 0.2s ease';
            favItem.classList.add('wheelItem')
            if (fav.parentElement.querySelector('[type="checkbox"]').checked) { favItem.style.background = '#c8e4ff' }
            // 鼠标悬停效果
            favItem.addEventListener('mouseenter', function () {
                favItem.style.background = '#d8d8d8'
                if (fav.parentElement.querySelector('[type="checkbox"]').checked) { favItem.style.background = '#ffe4ff' }
            });

            favItem.addEventListener('mouseleave', function () {
                favItem.style.background = 'var(--graph_bg_regular)';
            });

            favItem.addEventListener('mouseup', function () {
                selectFavorit = true
                selectFavoriteAndConfirm(index + 1);
                document.querySelector('body > div.bili-dialog-m').removeChild(wheelMenu);
            });

            // // 根据角度分布项目，形成转盘布局
            // const angle = (index * 360) / numItems;
            // favItem.style.position = 'absolute';
            // favItem.style.transform = `rotate(${angle}deg) translate(120px) rotate(-${angle}deg)`;

            wheelMenu.appendChild(favItem);
        });

        document.querySelector('body > div.bili-dialog-m').appendChild(wheelMenu);


        // 监听取消操作
        document.addEventListener('mouseup', function cancelWheelMenu(event) {
            if (!selectFavorit) {
                try {
                    document.querySelector('body > div.bili-dialog-m').removeChild(wheelMenu);
                    let dialog = document.querySelector('body > div.bili-dialog-m');
                    if (dialog) {
                        const close = document.querySelector("body > div.bili-dialog-m > div > div > div.title > i");
                        if (close) {
                            close.click();
                        }
                    }
                    updateDebugInfo('操作已取消');
                    document.removeEventListener('mouseup', cancelWheelMenu);
                    setTimeout(() => {
                        document.querySelector('#runtimeStyle').innerHTML = ``;
                        updateDebugInfo('操作已取消 => 取消隐藏')
                    }, 500);
                } catch { }

            }
        });
    }

    // 模拟选择收藏夹并点击确认
    function selectFavoriteAndConfirm(index) {
        const checkbox = document.querySelector(`body > div.bili-dialog-m > div > div > div.content > div > ul > li:nth-child(${index}) > label`);
        const confirmButton = document.querySelector('button.btn.submit-move');

        if (checkbox && confirmButton) {
            checkbox.click();
            setTimeout(() => {
                confirmButton.click();
                updateDebugInfo('收藏夹已选择: ' + document.querySelectorAll('body > div.bili-dialog-m > div > div > div.content > div > ul > li > label > span.fav-title')[index - 1].textContent);

                let dialog = document.querySelector('body > div.bili-dialog-m');
                if (dialog) {
                    setTimeout(() => {
                        document.querySelector('#runtimeStyle').innerHTML = ``;
                        updateDebugInfo('收藏夹已选择 => 取消隐藏')
                    }, 500)
                }
            }, 100);


        }
    }
})();
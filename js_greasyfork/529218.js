// ==UserScript==
// @name    SteamDB促销界面DB链接批量复制
// @namespace    https://keylol.com/t957351-1-1
// @description    可配合Steam快速添加购物车脚本(432190)使用实现将游戏批量加入购物车的功能
// @version      0.1
// @author    sjx01
// @match    https://steamdb.info/sales/*
// @icon    https://store.steampowered.com/favicon.ico
// @grant    GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529218/SteamDB%E4%BF%83%E9%94%80%E7%95%8C%E9%9D%A2DB%E9%93%BE%E6%8E%A5%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/529218/SteamDB%E4%BF%83%E9%94%80%E7%95%8C%E9%9D%A2DB%E9%93%BE%E6%8E%A5%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
/*    GM_registerMenuCommand('打开SteamDB促销界面', () => { window.open('https://steamdb.info/sales', '_blank') });
     // 注册菜单命令
    GM_registerMenuCommand("显示该页面所有DB链接", showPopup);

    function showPopup() {
        // 创建遮罩层
        let overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        document.body.appendChild(overlay);

        // 创建弹出窗口
        let popup = document.createElement('div');
        popup.id = 'popup';
        popup.style.backgroundColor = '#222';
        popup.style.color = '#fff';
        popup.style.padding = '20px';
        popup.style.borderRadius = '10px';
        popup.style.zIndex = '10000';
        popup.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        popup.style.position = 'relative';
        popup.style.maxWidth = '90%'; // 限制最大宽度为屏幕宽度的90%
        popup.style.maxHeight = '90%'; // 限制最大高度为屏幕高度的90%
        popup.style.overflowY = 'auto'; // 添加滚动条以处理溢出内容

        // 添加内容
        let links = Array.from(document.querySelectorAll("td>a.b")).map(x => x.href); //获取DB链接列表
        let content = links.join("\n");
        let textArea = document.createElement('textarea');
        textArea.style.width = '100%';
        textArea.style.height = 'auto'; // 设置高度为自动，以便根据内容调整
        textArea.style.minHeight = '200px'; // 设置最小高度
        textArea.style.maxWidth = '300px' // 设置最大宽度
        textArea.style.margin = '22px 0';
        textArea.style.padding = '10px';
        textArea.style.boxSizing = 'border-box';
        textArea.value = content;
        textArea.readOnly = true;
        popup.appendChild(textArea);

        // 添加复制按钮(如果DB链接不为空)
        if (links.length > 0) {
            let copyButton = document.createElement('button');
            copyButton.textContent = '复制DB链接';
            copyButton.style.margin = '5px 2.5px';
            copyButton.style.color = '#39c5bb';
            copyButton.onclick = function() {
                textArea.select();
                document.execCommand('copy');
            };
            popup.appendChild(copyButton);
        }

        // 添加跳转按钮(如果DB链接不为空)
        if (links.length > 0) {
            let goButton = document.createElement('button');
            goButton.textContent = '跳转到购物车';
            goButton.style.margin = '5px 2.5px';
            goButton.style.color = '#39c5bb';
            goButton.onclick = function() {
                window.open('https://store.steampowered.com/cart/', '_blank');
            };
            popup.appendChild(goButton);
        }

        // 添加关闭按钮(固定位置为右上角)
        let closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '0';
        closeButton.style.right = '0';
        closeButton.style.margin = '10px';
        closeButton.style.padding = '5px 10px';
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = '#444';
        closeButton.style.color = '#39c5bb';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = function() {
            overlay.remove();
            popup.remove();
        };
        popup.appendChild(closeButton);

        // 将弹出窗口添加到遮罩层中
        overlay.appendChild(popup);
        // 根据内容调整弹出窗口大小
        function adjustPopupSize() {
            popup.style.width = 'auto'; // 初始宽度为自动
            popup.style.height = 'auto'; // 初始高度为自动
            // 强制更新布局以获取正确的滚动宽度和高度
            textArea.style.overflowY = 'hidden'; // 暂时隐藏滚动条
            let contentWidth = textArea.scrollWidth + 40; // 加上padding
            let contentHeight = textArea.height + 120; // 加上padding、按钮和边距的高度
            textArea.style.overflowY = 'auto'; // 恢复滚动条
            // 设置弹出窗口的宽度和高度，确保不超过屏幕大小的90%
            popup.style.width = `${Math.min(contentWidth, window.innerWidth * 0.9)}px`;
            popup.style.height = `${Math.min(contentHeight, window.innerHeight * 0.9)}px`;
        }

        // 在内容加载后调整大小
        window.setTimeout(adjustPopupSize, 0);
        // 阻止滚动事件传播到原页面
        overlay.addEventListener('wheel', function(event) {
            event.stopPropagation();
        });
    } */

    //使用 MutationObserver 来监听表格的DOM变化
    const observer = new MutationObserver(mutations => {
        // 重置定时器
        clearTimeout(timeoutId);
        // 设置一个新的定时器，等待一段时间后检查表格是否还有变化
        timeoutId = setTimeout(() => {
            // 检查表格行是否有变化
            const newRows = document.querySelectorAll('tr.app');
            const newRowsSet = new Set(newRows);
            // 遍历新行，为未添加按钮的行添加按钮
            newRows.forEach(row => {
                if (!row.querySelector('.add-button')) {
                    const btn = document.createElement('button');
                    btn.style.color = '#39c5bb';
                    btn.className = 'add-button';
                    btn.textContent = '+';
                    btn.title = '将该游戏添加到待复制自选DB链接列表中';
                    const cell = document.createElement('td');
                    cell.appendChild(btn);
                    row.appendChild(cell);
                    // 为按钮添加点击事件
                    btn.addEventListener('click', function() {
                        const link = row.querySelector('td>a.b').href;
                        if (!links_.includes(link)) {
                            links_.push(link);
                        }
                    });
                }
            });
        },1500); // 等待1.5秒
    });

    // 配置 observer 选项
    const config = {
        childList: true, // 监听子元素变动
        subtree: true, // 监听所有下级节点变动
        attributes: false, // 不监听属性变动
        characterData: false // 不监听文本内容变动
    };
    // 选择需要观察变动的节点
    const targetNode = document.querySelector('table'); // 观测<table>标签内的变化
    // 开始观察已配置的变动
    observer.observe(targetNode, config);
    // 存储DB链接的数组
    const links_ = [];
    // 定时器ID，用于重置等待时间
    let timeoutId = null;

    //创建各个功能按钮
    const container = document.querySelector('.dt-search');
    if (container) {
        // 在搜索框前面添加键全部复制按钮
        const copyBtn0 = document.createElement('button');
        copyBtn0.style.color = '#39c5bb';
        copyBtn0.id = 'copy-links-btn';
        copyBtn0.title = '复制当前页面所有的DB链接到剪贴板'; // 鼠标悬停提示
        copyBtn0.textContent = '复制所有DB链接';
        container.insertBefore(copyBtn0, container.firstChild);
        //给按钮添加点击监听事件
        copyBtn0.addEventListener('click', function() {
            const links0 = Array.from(document.querySelectorAll("td>a.b")).map(x => x.href).join("\n"); //提取所有链接并复制到剪贴板
            navigator.clipboard.writeText(links0).then(() => {
                alert('链接已复制到剪贴板！');
            }).catch(err => {
                console.error('复制失败:', err);
            });
        });

        //在搜索框前面添加自选复制按钮
        const copyBtn1 = document.createElement('button');
        copyBtn1.style.color = '#39c5bb';
        copyBtn1.id = 'copy-links-btn';
        copyBtn1.title = '复制当前页面选择(+)的DB链接到剪贴板'; // 鼠标悬停提示
        copyBtn1.textContent = '复制自选DB链接';
        container.insertBefore(copyBtn1, container.firstChild);
        //给按钮添加点击监听事件
        copyBtn1.addEventListener('click', function() {
            const linksText = links_.join("\n");
            navigator.clipboard.writeText(linksText).then(() => {
                alert('链接已复制到剪贴板！');
            }).catch(err => {
                console.error('复制失败:', err);
            });
        });

        // 在搜索框前面添加跳转到购物车按钮
        const jumpBtn = document.createElement('button');
        jumpBtn.id = 'jump-to-page-btn';
        jumpBtn.title = '跳转到购物车页面'; // 鼠标悬停提示
        jumpBtn.textContent = '🛒';
        container.insertBefore(jumpBtn, container.firstChild);
        //给按钮添加点击监听事件
        jumpBtn.addEventListener('click', function() {
            window.open('https://store.steampowered.com/cart/', '_blank');
        });
    }
})();

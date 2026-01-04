// ==UserScript==
// @name         【微赞直播】新版微赞自动化辅助脚本
// @namespace    https://mdhyy.cn/
// @version      2025年6月25日
// @description  在打开微赞后台时，可以在【话题列表页】或【新版话题管理页】自己指定，是否自动打开旧版本管理界面。进入首页后自动打开【视频直播列表】，详情帮助请在相关页面按F1查看。
// @author       明灯花月夜
// @match        https://live.vzan.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519651/%E3%80%90%E5%BE%AE%E8%B5%9E%E7%9B%B4%E6%92%AD%E3%80%91%E6%96%B0%E7%89%88%E5%BE%AE%E8%B5%9E%E8%87%AA%E5%8A%A8%E5%8C%96%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/519651/%E3%80%90%E5%BE%AE%E8%B5%9E%E7%9B%B4%E6%92%AD%E3%80%91%E6%96%B0%E7%89%88%E5%BE%AE%E8%B5%9E%E8%87%AA%E5%8A%A8%E5%8C%96%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 弹窗显示的文本
    var displayText = "-";

    const currentUrl = window.location.href;
    if(currentUrl.includes('https://live.vzan.com/admin/index.html?zbid=') && currentUrl.includes('Live/Topic')){
        displayText = "这里是801【视频列表页-辅助功能】：\n<br>这个页面可以使用回车键进行搜索，点击管理直播时可以选择直接跳转到旧版后台。";
    }else if(currentUrl.includes('https://live.vzan.com/admin/index.html?zbid=') && currentUrl.includes('TopicManage/TopicSetHome')){

    }

    // 将换行符 (\n) 替换为 HTML 的 <br> 标签
    var textWithBreaks = displayText.replace(/\n/g, '<br/>');

    // 创建弹窗元素
    var popup = document.createElement('div');
    popup.id = 'f1-popup';
    popup.style.position = 'fixed';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.maxWidth = '400px';
    popup.style.width = 'auto';
    popup.style.height = 'auto';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = '#333';
    popup.style.border = 'none';
    popup.style.borderRadius = '8px';
    popup.style.color = 'white';
    popup.style.zIndex = '10000';
    popup.style.textAlign = 'left';
    popup.style.display = 'none';
    popup.style.whiteSpace = 'pre-wrap';
    popup.innerHTML = textWithBreaks;

    // 将弹窗添加到文档中
    document.body.appendChild(popup);

    // 监听键盘事件
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            // 阻止默认的回车键行为
            event.preventDefault();

            // 查找搜索按钮并点击
            var searchButton = document.querySelector('button.el-button.fliterBtn.el-button--primary');
            // 获取输入框元素
            var inputElement = document.querySelector('input[placeholder="请输入直播名称"]');
            // 获取输入框的值
            var inputValue = inputElement ? inputElement.value : '';

            if (searchButton) {
                searchButton.click();
                if (inputValue.trim() !== '') {
                    showModal("回车→搜索，已帮您按下搜索键，搜索内容："+inputValue);
                } else {
                    showModal("回车→搜索，已帮您按下搜索键");
                }
            }
        }

        if (event.key === 'F1') {
            // 切换弹窗的显示和隐藏
            event.preventDefault();
            var currentDisplay = popup.style.display;
            popup.style.display = currentDisplay === 'none' ? 'block' : 'none';
        }
    });

    // 创建开关和文本
    function createToggle() {
        const currentUrl = window.location.href;
        const isCorrectPage = currentUrl.includes('https://live.vzan.com/admin/index.html?zbid=') && currentUrl.includes('TopicManage/TopicSetHome');

        const toggleDiv = document.createElement('div');
        toggleDiv.style.position = 'fixed';
        if (isCorrectPage) {
            toggleDiv.style.top = '80px';
            toggleDiv.style.right = '10px';
        }else{
            toggleDiv.style.top = '10px';
            toggleDiv.style.left = '10px';
        }

        toggleDiv.style.zIndex = '99999999';
        toggleDiv.style.backgroundColor = '#fff';
        toggleDiv.style.border = '3px solid #ccc';
        toggleDiv.style.borderRadius = '8px';
        toggleDiv.style.padding = '10px';
        toggleDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        const toggleLabel = document.createElement('label');
        toggleLabel.textContent = '自动跳转到旧版话题管理: ';
        const toggleCheckbox = document.createElement('input');
        toggleCheckbox.type = 'checkbox';
        toggleCheckbox.checked = localStorage.getItem('autoRedirectEnabled') === 'true';
        toggleLabel.appendChild(toggleCheckbox);

        toggleDiv.appendChild(toggleLabel);
        document.body.appendChild(toggleDiv);

        // 监听开关状态变化
        toggleCheckbox.addEventListener('change', function() {
            showModal("自动跳转旧版本后台功能："+(toggleCheckbox.checked?"已打开":"已关闭"));
            localStorage.setItem('autoRedirectEnabled', toggleCheckbox.checked);
        });

        // Make the toggle draggable
        makeDraggable(toggleDiv);
    }

    // Function to make an element draggable
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(element.id + "header")) {
            document.getElementById(element.id + "header").onmousedown = dragMouseDown;
        } else {
            element.onmousedown = dragMouseDown;
        }

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
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.width = element.style.width;
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 跳转函数
    function redirectToNewUrl() {
        const currentUrl = window.location.href;
        const isCorrectPage = currentUrl.includes('https://live.vzan.com/admin/index.html?zbid=') && currentUrl.includes('TopicManage/TopicSetHome');

        if (isCorrectPage) {
            const queryParams = new URLSearchParams(window.location.search);
            const zbid = queryParams.get('zbid');
            const hash = window.location.hash;
            const topicIdMatch = hash.match(/topicId=([0-9]+)/);
            const topicId = topicIdMatch ? topicIdMatch[1] : null;

            if (zbid && topicId) {
                const newUrl = `https://live.vzan.com/nlive/navmenu?zid=${zbid}&tid=${topicId}&backurl=TopicEditV2`;

                // 如果开关为开启状态，则跳转
                if (document.querySelector('input[type="checkbox"]').checked) {
                    showModal('正在跳转到旧版管理界面...');
                    window.location.href = newUrl;
                }
            } else {
                console.log('zbid or topicId is missing in the URL');
            }
        }
    }

    function showCountdown() {
        var countdownDiv = document.createElement('div');
        countdownDiv.style.position = 'fixed';
        countdownDiv.style.top = '0';
        countdownDiv.style.left = '50%';
        countdownDiv.style.transform = 'translate(-50%, 0)';
        countdownDiv.style.width = '100%';
        countdownDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        countdownDiv.style.color = '#fff';
        countdownDiv.style.textAlign = 'center';
        countdownDiv.style.padding = '10px 0';
        countdownDiv.style.zIndex = '9999';
        countdownDiv.style.fontSize = '24px';
        countdownDiv.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(countdownDiv);

        var countdown = 4;

        var updateCountdown = function() {
            countdownDiv.textContent = '801微赞助手：倒计时: ' + countdown + ' 秒后，跳转直播列表界面。';
            countdown -= 1;

            if (countdown < 0) {
                clearInterval(intervalId);
                document.body.removeChild(countdownDiv);
            }
        };

        var intervalId = setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    function showModal(message) {
        var existingModal = document.querySelector('.modal');
        if (existingModal) {
            document.body.removeChild(existingModal);
        }

        var modalDiv = document.createElement('div');
        modalDiv.classList.add('modal');
        modalDiv.style.position = 'fixed';
        modalDiv.style.top = '0';
        modalDiv.style.left = '50%';
        modalDiv.style.transform = 'translateX(-50%)';
        modalDiv.style.width = '100%';
        modalDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modalDiv.style.color = '#fff';
        modalDiv.style.textAlign = 'center';
        modalDiv.style.padding = '10px 0';
        modalDiv.style.zIndex = '9999';
        modalDiv.style.fontSize = '24px';
        modalDiv.style.fontFamily = 'Arial, sans-serif';
        modalDiv.textContent = "801微赞助手："+message;
        document.body.appendChild(modalDiv);

        var delay = 2500;

        var closeModal = function() {
            document.body.removeChild(modalDiv);
        };

        setTimeout(closeModal, delay);
    }

    // 等待DOM加载完毕后添加开关
    window.addEventListener('load', function() {
        const currentUrl = window.location.href;
        const isCorrectPage = currentUrl.includes('https://live.vzan.com/admin/index.html?zbid=') && currentUrl.includes('TopicManage/TopicSetHome');
        const isCorrectPage2 = currentUrl.includes('https://live.vzan.com/admin/index.html?zbid=') && currentUrl.includes('#/Live/Topic');

        if (isCorrectPage||isCorrectPage2) {
            createToggle();
        }
        redirectToNewUrl();

        // 检查是否为登录页面
        if (currentUrl.includes('/login')||currentUrl.includes('workbench')) {
            localStorage.setItem('isLoggedOut', '0');
            showModal('状态重置，下次打开【直播管理】界面，会自动跳转到【视频直播列表】');
        }

        var isLoggedOut = localStorage.getItem('isLoggedOut');
        if (isLoggedOut === '0') {
            if (currentUrl.includes('industry-center/agent-promotion/liveTopic')) {
                showCountdown();
                setTimeout(function() {
                    const queryParams = new URLSearchParams(window.location.search);
                    const zbid = queryParams.get('zbid');
                    var storedZbid = zbid;
                    var redirectUrl = 'https://live.vzan.com/admin/index.html?zbid=' + storedZbid + '#/Live/Topic';
                    window.location.href = redirectUrl;
                    localStorage.setItem('isLoggedOut', '1');
                }, 4000);
            }
        }
    });
})();
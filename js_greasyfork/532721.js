// ==UserScript==
// @name         松鼠ADB拨号
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在智能硬件经销商管理系统中为每个手机号码旁增加一个ADB拨号按钮并隐藏特定电话图标，需要配合ADB Call软件才能拨打号码
// @author       付正则
// @match        https://agent.songshuai.com/*
// @grant        none
// @license      
// @downloadURL https://update.greasyfork.org/scripts/532721/%E6%9D%BE%E9%BC%A0ADB%E6%8B%A8%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/532721/%E6%9D%BE%E9%BC%A0ADB%E6%8B%A8%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用MutationObserver监控DOM变化，确保动态加载的内容也能被处理
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                handleDOMChanges();
            }
        });
    });

    // 配置MutationObserver
    const config = {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
    };

    // 开始观察整个文档
    observer.observe(document.body, config);

    // 初始处理
    handleDOMChanges();

    // 处理DOM变化，为手机号码旁添加按钮并隐藏特定电话图标
    function handleDOMChanges() {
        // 查找所有包含手机号码的元素
        const phoneElements = document.querySelectorAll('span[data-v-7007dcae=""]');
        const userDivs = document.querySelectorAll('div.user');
        const backupSpans = document.querySelectorAll('span.backup-phone');
        const phoneIcons = document.querySelectorAll('a.icon-phone');

        // 处理span标签
        phoneElements.forEach((phoneElement) => {
            addCallButton(phoneElement);
        });

        // 处理div.user标签
        userDivs.forEach((userDiv) => {
            const phoneText = userDiv.textContent.trim();
            if (isValidPhoneNumber(phoneText)) {
                addCallButton(userDiv);
            }
        });

        // 处理span.backup-phone标签
        backupSpans.forEach((backupSpan) => {
            // 获取span中的文本，过滤掉图片等其他元素
            const phoneText = backupSpan.textContent.trim().replace('学生-', '');
            if (isValidPhoneNumber(phoneText)) {
                addCallButton(backupSpan);
            }
        });

        // 隐藏特定的电话图标
        phoneIcons.forEach((phoneIcon) => {
            phoneIcon.style.display = 'none';
        });
    }

    // 添加拨号按钮
    function addCallButton(element) {
        // 检查是否已经添加了按钮，避免重复添加
        if (!element.nextElementSibling || !element.nextElementSibling.classList.contains('adb-call-button')) {
            const phoneNumber = element.textContent.trim().replace('学生-', '');
            if (isValidPhoneNumber(phoneNumber)) {
                // 创建ADB拨号按钮
                const adbButton = document.createElement('button');
                adbButton.textContent = '📲';
                adbButton.className = 'adb-call-button';
                adbButton.style.marginLeft = '2px';
                adbButton.style.padding = '2px 2px';
                adbButton.style.color = 'white';
                adbButton.style.border = '1px solid white';
                adbButton.style.borderRadius = '2px';
                adbButton.style.cursor = 'pointer';
                // 设置透明背景
                adbButton.style.backgroundColor = 'transparent';
                // 添加鼠标悬停效果
                adbButton.style.transition = 'background-color 0.3s';
                adbButton.onmouseover = function() {
                    this.style.backgroundColor = '#4CAF50';
                };
                adbButton.onmouseout = function() {
                    this.style.backgroundColor = 'transparent';
                };

                // 添加点击事件
                adbButton.onclick = function() {
                    callPhoneNumber(phoneNumber);
                    copyToClipboard(phoneNumber);
                };

                // 将按钮插入到手机号码元素旁边
                element.parentNode.insertBefore(adbButton, element.nextSibling);
            }
        }
    }

    // 验证手机号码格式
    function isValidPhoneNumber(phoneNumber) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phoneNumber);
    }

    // 修改后的callPhoneNumber函数
    function callPhoneNumber(phoneNumber) {
        console.log(`正在使用ADB拨打: ${phoneNumber}`);

        // 发送HTTP请求到本地Python服务器
        fetch('http://localhost:5000/call', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone: phoneNumber }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('响应:', data);
        })
        .catch(error => {
            console.error('请求失败:', error);
            alert('请求失败:', error);
        });
    }

    // 复制到剪切板
    function copyToClipboard(phoneNumber) {
        navigator.clipboard.writeText(phoneNumber)
            .then(() => {
                console.log(`已复制到剪切板: ${phoneNumber}`);
                // 可选：显示复制成功的提示
                //alert(`已复制到剪切板: ${phoneNumber}`);
            })
            .catch(err => {
                console.error('复制失败:', err);
            });
    }
})();
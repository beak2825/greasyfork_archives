// ==UserScript==
// @name         南宁青年大学习自动登录学习脚本
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  自动点击按钮，然后自动登录不同用户
// @author       Simeng
// @match        http://qndxx.bestcood.com/nanning/daxuexi
// @grant        GM_notification
// @require      https://cdn.staticfile.net/xlsx/0.16.9/xlsx.full.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496732/%E5%8D%97%E5%AE%81%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/496732/%E5%8D%97%E5%AE%81%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let users = [];
    let isAutoLearningEnabled = false;

    function getCurrentUserIndex() {
        return localStorage.getItem('currentUserIndex') ? parseInt(localStorage.getItem('currentUserIndex'), 10) : 0;
    }

    function setCurrentUserIndex(index) {
        localStorage.setItem('currentUserIndex', index);
    }

    function createFileUploadInterface() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.xlsx';
        fileInput.style.position = 'fixed';
        fileInput.style.top = '10px';
        fileInput.style.left = '10px';
        fileInput.style.zIndex = '1000';
        fileInput.addEventListener('change', handleFileUpload);
        document.body.appendChild(fileInput);

        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            users = JSON.parse(storedUsers);
            if (isAutoLearningEnabled) {
                startAutoLearning();
            }
        }
    }

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                users = XLSX.utils.sheet_to_json(firstSheet);
                GM_notification({
                    text: '上传成功！已加载用户，请点击“开始自动学习”',
                    title: '自动登录学习脚本'
                });
                localStorage.setItem('users', JSON.stringify(users));
                setCurrentUserIndex(0);
                if (isAutoLearningEnabled) {
                    startAutoLearning();
                }
            };
            reader.readAsArrayBuffer(file);
        }
    }

    function startAutoLearning() {
        if (!isAutoLearningEnabled) {
            isAutoLearningEnabled = true;
            loginNextUser();
        }
    }

    function loginNextUser() {
        const currentUserIndex = getCurrentUserIndex();

        if (currentUserIndex >= users.length) {
            isAutoLearningEnabled = false;
            return;
        }

        const user = users[currentUserIndex];
        simulateLogin(user['姓名'], user['学习编号']);
    }

    function simulateLogin(username, userId) {
        document.querySelector('#userName').value = username;
        document.querySelector('#userId').value = userId;

        document.querySelector('#btn-login').click();

        GM_notification({
            text: `用户 ${username} 已登录 (序号: ${getCurrentUserIndex() + 1})`,
            title: '自动登录学习脚本'
        });
    }

    function createStartAutoLearningButton() {
        const startButton = document.createElement('button');
        startButton.textContent = '开始自动学习';
        startButton.style.position = 'fixed';
        startButton.style.top = '50px';
        startButton.style.left = '10px';
        startButton.style.zIndex = '1000';
        startButton.addEventListener('click', startAutoLearning);
        document.body.appendChild(startButton);
    }

    function handleLogout() {
        const currentUserIndex = getCurrentUserIndex();
        setCurrentUserIndex(currentUserIndex + 1);
        loginNextUser();
    }

    window.addEventListener('load', function() {
        createFileUploadInterface();
        createStartAutoLearningButton();

        const loginForm = document.querySelector('.xuexi-loginctx');
        if (loginForm) {
            loginNextUser();
        }

        const logoutLink = document.querySelector('a.sign-out');
        if (logoutLink) {
            logoutLink.addEventListener('click', function() {
                handleLogout();
            });
            logoutLink.click();
        }
    });

    // 查找按钮
    const learnButton = document.querySelector('#btn-learn-start');

    if (learnButton) {
        const userOrg = document.querySelector('.user-org');
        if (userOrg && userOrg.textContent.trim() === '南宁市-XX县-XX学校-XX班') { //这里修改成登录显示的
            if (learnButton.classList.contains('btn-start')) {
                // 开始学习按钮存在
                learnButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    // 快速刷新网页
                    setTimeout(function() {
                        location.reload();
                    }, 1);
                }, { once: true });
                learnButton.click();
            } else if (learnButton.classList.contains('btn-start-again')) {
                // 再学一次按钮存在
                const logoutLink = document.querySelector('a.sign-out');
                if (logoutLink) {
                    logoutLink.addEventListener('click', function() {
                        setTimeout(function() {
                            const currentUserIndex = getCurrentUserIndex();
                            setCurrentUserIndex(currentUserIndex + 1);
                            loginNextUser();
                        }, 1); // 这里可以调整等待时间
                    });
                    logoutLink.click();
                }
            }
        } else {
            GM_notification({
                text: '当前用户不符合要求，将自动退出登录。',
                title: '自动登录学习脚本',
                timeout: 3000
            });
            const logoutLink = document.querySelector('a.sign-out');
            if (logoutLink) {
                logoutLink.addEventListener('click', function() {
                    handleLogout();
                });
                logoutLink.click();
            }
        }
    }
})();
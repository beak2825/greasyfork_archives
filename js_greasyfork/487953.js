// ==UserScript==
// @name         GitHub Auto Signup
// @version      0.6.3
// @description  Automate github signup
// @author       Young Jimmy
// @match        https://github.com/signup*
// @match        https://github.com/signup?source=login
// @match        https://github.com/login?return_to=*device*
// @match        https://github.com/account_verifications?recommend_plan=true
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @license      MIT
// @namespace https://greasyfork.org/users/1218336
// @downloadURL https://update.greasyfork.org/scripts/487953/GitHub%20Auto%20Signup.user.js
// @updateURL https://update.greasyfork.org/scripts/487953/GitHub%20Auto%20Signup.meta.js
// ==/UserScript==
 
 
 
(function() {
    'use strict';
    // 创建日志框
    var logBox = document.createElement("div");
    logBox.style.position = "fixed";
    logBox.style.width = "200px";
    logBox.style.height = "200px";
    logBox.style.overflowY = "scroll";
    logBox.style.border = "1px solid black";
    logBox.style.padding = "5px";
    logBox.style.backgroundColor = "rgba(255, 255, 255, 0.5)"; // 半透明白色背景
    logBox.style.zIndex = "9999";
    logBox.style.bottom = "0"; // 放在页面左下角
    document.body.appendChild(logBox);
 
    // 让日志框可以拖动
    logBox.onmousedown = function(event) {
        event.preventDefault();
 
        var shiftX = event.clientX - logBox.getBoundingClientRect().left;
        var shiftY = event.clientY - logBox.getBoundingClientRect().top;
 
        logBox.style.position = 'absolute';
        document.body.append(logBox);
        moveAt(event.pageX, event.pageY);
 
        function moveAt(pageX, pageY) {
            logBox.style.left = pageX - shiftX + 'px';
            logBox.style.top = pageY - shiftY + 'px';
        }
 
        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }
 
        document.addEventListener('mousemove', onMouseMove);
 
        logBox.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            logBox.onmouseup = null;
        };
    };
 
    logBox.ondragstart = function() {
        return false;
    };
 
    // 将日志添加到框中的函数
    unsafeWindow.logMessage = function(message) {
        var p = document.createElement("p");
        p.textContent = message;
        logBox.appendChild(p);
        logBox.scrollTop = logBox.scrollHeight; // 自动滚动到底部
    };
    // Delay function
    function delay(time) {
        return new Promise(function(resolve) {
            setTimeout(resolve, time);
        });
    }
 
    // Wait for label with specific content to exist
    function labelReady(content) {
        return new Promise((resolve, reject) => {
            new MutationObserver((mutationRecords, observer) => {
                Array.from(document.querySelectorAll('label')).forEach((element) => {
                    if (element.textContent.trim() === content) {
                        logMessage(`Label with content "${content}" found.`);
                        resolve(element);
                        observer.disconnect();
                    }
                });
            })
                .observe(document.documentElement, {childList: true, subtree: true});
        });
    }
 
    function generatePassword(length) {
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
 
        // Ensure the length is at least 4 to accommodate all character types.
        if (length < 4) {
            logMessage("Password length must be at least 4.");
            return null;
        }
 
        let password = "";
        password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
        password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
        password += numbers.charAt(Math.floor(Math.random() * numbers.length));
        password += symbols.charAt(Math.floor(Math.random() * symbols.length));
 
        for (let i = 4, n = lowercase.length + uppercase.length + numbers.length + symbols.length; i < length; ++i) {
            let randomPickedSet;
            switch(Math.floor(Math.random() * 4)) {
                case 0:
                    randomPickedSet = lowercase;
                    break;
                case 1:
                    randomPickedSet = uppercase;
                    break;
                case 2:
                    randomPickedSet = numbers;
                    break;
                case 3:
                    randomPickedSet = symbols;
                    break;
            }
            password += randomPickedSet.charAt(Math.floor(Math.random() * randomPickedSet.length));
        }
 
        // Shuffle the result to ensure randomness
        password = password.split('').sort(function(){return 0.5-Math.random()}).join('');
 
        return password;
    }
 
    function generateUsername(length) {
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
 
    // Wait for element to exist
    function elementReady(selector) {
        return new Promise((resolve, reject) => {
            let el = document.querySelector(selector);
            if (el) { resolve(el); }
            new MutationObserver((mutationRecords, observer) => {
                // Query for elements matching the specified selector
                Array.from(document.querySelectorAll(selector)).forEach((element) => {
                    resolve(element);
                    //Once we have resolved we don't need the observer anymore.
                    observer.disconnect();
                });
            })
                .observe(document.documentElement, {childList: true, subtree: true});
        });
    }
 
    async function signup() {
        const password = generatePassword(12);
        const username = generateUsername(Math.floor(Math.random() * 5) + 8);
 
        logMessage("Waiting for label...");
        await labelReady("Enter your email*");
        logMessage('start get eamil')
        let email = await getEmail();
        logMessage('API get email '+ email)
        logMessage("Starting signup process...");
                localStorage.setItem('email', email);
        localStorage.setItem(email, password);
        await elementReady(".js-continue-container").then(element => element.click());
        await delay(1000);
 
        await elementReady("#email").then(element => element.value = email);
        await elementReady(".mx-1").then(element => element.click());
        await elementReady("#email-container .js-continue-button").then(element => element.click());
        await delay(1000);
 
        await elementReady("#password").then(element => {element.click(); element.value = password;});
        await elementReady(".mx-1").then(element => element.click());
        await elementReady("#password-container .js-continue-button").then(element => element.click());
        await delay(1000);
 
        await elementReady("#login").then(element => {element.click(); element.value = username;});
        await elementReady(".mx-1").then(element => element.click());
        await elementReady("#username-container .js-continue-button").then(element => element.click());
        await elementReady("#opt-in-container .js-continue-button").then(element => element.click());
        await elementReady("button[name=button]").then(element => element.click());
        observeAttributeChange('.js-octocaptcha-form-submit', (node) => {
            return !node.hasAttribute('disabled') && !node.hasAttribute('hidden');
        }).then((node) => {
            node.click();
        }).catch((error) => {
            console.error(error);
        });
        await labelReady("Email preferences*");
        await elementReady("#opt_in").then(element => element.click());
        await elementReady('#opt_in').then(element =>{ element.checked= false;});
        await elementReady('#opt_in').then(element =>{ element.checked= false;});
        await elementReady("button[name=button]").then(element => element.click());
 
        logMessage("Signup process completed.");
 
        // Store the email in localStorage after signup
        localStorage.setItem('email', email);
        localStorage.setItem(email, password);
 
    }
 
    async function getEmail() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://127.0.0.1:9191/get_email",
                onload: function(response) {
                    const data = JSON.parse(response.responseText);
                    if (data.account) {
                        resolve(data.account);
                    } else {
                        reject('Failed to get email');
                    }
                }
            });
        });
    }
 
    async function getVerificationCode(email) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `http://127.0.0.1:9191/get_verification_code?account=${email}`,
                onload: function(response) {
                    logMessage(response.responseText)
                    const data = JSON.parse(response.responseText);
                    if (data.verification_code) {
                        resolve(data.verification_code);
                    } else {
                        reject('Failed to get verification code');
                    }
                }
            });
        });
    }
    function observeAttributeChange(selector, condition) {
        return new Promise((resolve, reject) => {
            // 获取目标节点
            const targetNode = document.querySelector(selector);
 
            if (!targetNode) {
                reject('No element found with the given selector.');
                return;
            }
 
            // 检查元素是否已经满足条件
            if (condition(targetNode)) {
                resolve(targetNode); // 如果已经满足，直接返回该元素
                return;
            }
 
            // 设置观察器配置项
            const config = { attributes: true };
 
            // 创建一个观察器实例并传入回调函数
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (condition(targetNode)) {
                        observer.disconnect(); // 停止观察
                        resolve(targetNode); // 返回符合条件的DOM元素
                    }
                });
            });
 
            // 开始观察目标节点
            observer.observe(targetNode, config);
        });
    }
 
 
 
    async function fillVerificationCode(code) {
        const codeInputs = Array.from(document.querySelectorAll('.form-control.input-monospace'));
        const codeArray = code.split('');
        codeInputs.forEach((input, index) => {
            if (codeArray[index]) {
                input.value = codeArray[index];
                input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            }
        });
    }
 
 
 
    async function checkVerificationCode(email) {
        while (true) {
            try {
                const code = await getVerificationCode(email);
                if (code) {
                    fillVerificationCode(code);
                    break;
                }
            } catch (error) {
                console.error(error);
            }
            await delay(3000);
        }
    }
 
    logMessage("Script loaded, waiting for page load...");
    window.addEventListener('load', async function() {
 
 
 
        logMessage("Page loaded, starting script...");
        if (window.location.href === 'https://github.com/login?return_to=https%3A%2F%2Fgithub.com%2Flogin%2Fdevice') {
            window.location.replace('https://github.com/signup?source=login');
        }
        if (window.location.href === 'https://github.com/signup?source=login' || window.location.href ==='https://github.com/signup') {
 
            signup();
        } else if (window.location.href === 'https://github.com/account_verifications?recommend_plan=true') {
            // Retrieve the email from localStorage on the verification page
            let email = localStorage.getItem('email');
            logMessage('checkVerificationCode '+ email)
            if (email) {
                checkVerificationCode(email);
            }
        }
    }, false);
 
})();
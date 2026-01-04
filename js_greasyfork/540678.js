// ==UserScript==
// @name 自动识别验证码登录
// @namespace http://tampermonkey.net/
// @version 0.5
// @description 自动识别登录页面的验证码并填写
// @author Echo
// @match */page/auth/login
// @match */app/auth/
// @match https://192.168.0.150:31529/page/auth/login
// @match http://192.168.0.15:888/app/auth/
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @connect api.jfbym.com
// @connect 192.168.0.150
// @connect 192.168.0.15
// @license
// @downloadURL https://update.greasyfork.org/scripts/540678/%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E9%AA%8C%E8%AF%81%E7%A0%81%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/540678/%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E9%AA%8C%E8%AF%81%E7%A0%81%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const USERNAME = "8001";
    const PASSWORD = "123456";
    const TOKEN = "NKv4vBU8XXSKFaw56lBm0eMmZYk+0+KYKkSaPNgVqQY";
    const CAPTCHA_TYPE = "10110";

    // 定义不同端的元素选择器
    const SELECTORS = {
        PC: {
            username: 'input[placeholder="请输入账户"]',
            password: 'input[placeholder="请输入密码"]',
            captcha: 'input[placeholder="请输入验证码"]',
            captchaImage: 'img[src*="captcha"]'
        },
        APP: {
            username: 'uni-view[class="u-form"] uni-view.u-form-item:nth-child(1) input',  // 请根据实际APP端的选择器修改
            password: 'uni-view[class="u-form"] uni-view.u-form-item:nth-child(2) input',  // 请根据实际APP端的选择器修改
            captcha: 'uni-view[class="u-form"] uni-view.u-form-item:nth-child(3) input',    // 请根据实际APP端的选择器修改
            captchaImage: 'img[src*="captcha"]'
        }
    };

    // 判断当前是PC端还是APP端
    function getCurrentPlatform() {
        const currentUrl = window.location.href;
        return currentUrl.includes('192.168.0.150') ? 'PC' : 'APP';
    }

    // 获取当前平台的选择器
    function getCurrentSelectors() {
        return SELECTORS[getCurrentPlatform()];
    }

    // 等待元素出现的函数
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }
                
                if (Date.now() - startTime >= timeout) {
                    reject(new Error(`等待元素 ${selector} 超时`));
                    return;
                }
                
                setTimeout(checkElement, 100);
            };
            
            checkElement();
        });
    }

    // 封装函数：设置输入框值并触发事件
    function setValueWithEvent(element, value) {
        if (element) {
            element.value = value;
            // 触发多个事件以确保兼容性
            const events = ['input', 'change', 'keydown', 'keyup', 'blur'];
            events.forEach(eventType => {
                const event = new Event(eventType, { bubbles: true });
                element.dispatchEvent(event);
            });
            console.log(`已设置 ${element.name || '元素'} 的值并触发事件`);
        }
    }

    // 获取并识别验证码的函数
    async function getAndRecognizeCaptcha(captchaImage, captchaInput) {
        let captchaUrl = captchaImage.src;
        console.log("获取验证码图片URL:", captchaUrl);
        
        if (captchaUrl.startsWith('//')) {
            captchaUrl = window.location.protocol + captchaUrl;
        } else if (captchaUrl.startsWith('/')) {
            captchaUrl = window.location.origin + captchaUrl;
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: captchaUrl,
                responseType: 'blob',
                onload: function(response) {
                    let reader = new FileReader();
                    reader.onloadend = function() {
                        let base64data = reader.result.split(',')[1];
                        recognizeCaptcha(base64data, function(captchaText) {
                            console.log("验证码：", captchaText);
                            setValueWithEvent(captchaInput, captchaText);
                            resolve(captchaText);
                        });
                    };
                    reader.readAsDataURL(response.response);
                },
                onerror: function(error) {
                    console.error('获取验证码图片失败', error);
                    reject(error);
                }
            });
        });
    }

    // 等待页面加载完成
    window.addEventListener('load', async function() {
        try {
            const selectors = getCurrentSelectors();
            console.log("当前平台:", getCurrentPlatform());

            // 等待所有必需的元素出现
            const [usernameInput, passwordInput, captchaImage, captchaInput] = await Promise.all([
                waitForElement(selectors.username),
                waitForElement(selectors.password),
                waitForElement(selectors.captchaImage),
                waitForElement(selectors.captcha)
            ]);

            // 设置用户名和密码
            setValueWithEvent(usernameInput, USERNAME);
            setValueWithEvent(passwordInput, PASSWORD);

            // 首次获取并识别验证码
            await getAndRecognizeCaptcha(captchaImage, captchaInput);

            // 监听验证码图片点击事件
            captchaImage.addEventListener('click', async function() {
                console.log("验证码图片被点击，重新获取验证码...");
                // 等待一小段时间确保图片已更新
                await new Promise(resolve => setTimeout(resolve, 500));
                try {
                    await getAndRecognizeCaptcha(captchaImage, captchaInput);
                } catch (error) {
                    console.error("刷新验证码失败：", error);
                }
            });

        } catch (error) {
            console.error("等待元素出现失败：", error);
        }
    });

    // 调用验证码识别API
    function recognizeCaptcha(base64Image, callback) {
        let url = "https://api.jfbym.com/api/YmServer/customApi";
        let data = {
            "token": TOKEN,
            "type": CAPTCHA_TYPE,
            "image": base64Image
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                try {
                    let result = JSON.parse(response.responseText);
                    if (result.code === 10000 && result.data) {
                        callback(result.data.data);
                    } else {
                        console.error('验证码识别失败', result);
                    }
                } catch (e) {
                    console.error('解析验证码识别结果失败', e);
                }
            },
            onerror: function(error) {
                console.error('验证码识别请求失败', error);
            }
        });
    }
})();
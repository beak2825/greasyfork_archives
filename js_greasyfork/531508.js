// ==UserScript==
// @name         TUTU自动识别填充网页验证码
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  使用自部署的ddddocr服务自动识别填写网页验证码，支持智能定位验证码输入框
// @author       徐徐图之
// @license      GPL License
// @match        http://*/*
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/531508/TUTU%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E5%A1%AB%E5%85%85%E7%BD%91%E9%A1%B5%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/531508/TUTU%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E5%A1%AB%E5%85%85%E7%BD%91%E9%A1%B5%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // TUTU OCR配置 - 需要替换成你的服务地址
    let OCR_API_URL = "https://ocr.5886666.xyz:88/ocr/base64";
    let lastProcessedImage = null;
    
    // 全局变量添加节流控制
    let isProcessing = false;
    let lastCheckTime = 0;
    const THROTTLE_INTERVAL = 3000; // 3秒内不重复处理
    let captchaFound = false; // 记录是否找到过验证码
    
    // 添加新的全局变量以更科学地控制检查行为
    let consecutiveEmptyChecks = 0;  // 连续没有找到验证码的次数
    const MAX_EMPTY_CHECKS = 5;      // 最大连续空检查次数
    let checkInterval = null;        // 存储定时器ID便于停止
    let pageFullyLoaded = false;     // 标记页面是否完全加载
    
    // 使用多种方式尝试TUTU OCR识别验证码
    async function recognizeCaptcha(base64Image) {
        // 尝试POST请求带查询参数
        const tryPostWithQueryParam = async () => {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",  // 使用POST方法
                    url: OCR_API_URL + "?image_base64=" + encodeURIComponent(base64Image),  // 以查询参数形式传递
                    responseType: "json",
                    onload: function(response) {
                        if (response.status === 200 && response.response?.result) {
                            console.log("POST请求带查询参数成功");
                            resolve({ success: true, result: response.response.result });
                        } else {
                            console.log("POST请求带查询参数失败:", response.status, response.responseText);
                            resolve({ success: false });
                        }
                    },
                    onerror: function() {
                        resolve({ success: false });
                    }
                });
            });
        };

        // 尝试表单格式
        const tryFormData = async () => {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: OCR_API_URL,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: "image_base64=" + encodeURIComponent(base64Image),
                    responseType: "json",
                    onload: function(response) {
                        if (response.status === 200 && response.response?.result) {
                            resolve({ success: true, result: response.response.result });
                        } else {
                            console.log("表单请求失败:", response.status, response.responseText);
                            resolve({ success: false });
                        }
                    },
                    onerror: function() {
                        resolve({ success: false });
                    }
                });
            });
        };

        // 尝试JSON格式
        const tryJsonBody = async () => {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: OCR_API_URL,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify({ image_base64: base64Image }),
                    responseType: "json",
                    onload: function(response) {
                        if (response.status === 200 && response.response?.result) {
                            resolve({ success: true, result: response.response.result });
                        } else {
                            console.log("JSON请求失败:", response.status, response.responseText);
                            resolve({ success: false });
                        }
                    },
                    onerror: function() {
                        resolve({ success: false });
                    }
                });
            });
        };

        // 按顺序尝试不同方法
        let result = await tryPostWithQueryParam();  // 首先尝试这个新方法
        if (result.success) return result.result;
        
        result = await tryFormData();
        if (result.success) return result.result;
        
        result = await tryJsonBody();
        if (result.success) return result.result;
        
        // 所有方法都失败了
        console.log("所有识别方法都失败了");
        return "";
    }

    // 查找验证码图片
    function findCaptchaImage() {
        // 原有的检测方法
        const images = document.getElementsByTagName('img');
        for (let img of images) {
            if (isCaptchaImage(img)) {
                return img;
            }
        }
        
        // 针对特定网站的特殊检测
        if (window.location.hostname.includes('zlweb.top')) {
            console.log("在zlweb.top网站上使用特殊检测方法");
            
            // 查找登录表单中的图片
            const loginForms = document.querySelectorAll('form');
            for (let form of loginForms) {
                // 查找表单内的所有图片
                const formImages = form.querySelectorAll('img');
                if (formImages.length > 0) {
                    console.log("在表单中找到图片，可能是验证码");
                    // 返回第一个尺寸合适的图片
                    for (let img of formImages) {
                        if (img.complete && img.naturalWidth > 0 && img.naturalWidth <= 250 && 
                            img.naturalHeight > 0 && img.naturalHeight <= 150) {
                            return img;
                        }
                    }
                }
            }
            
            // 查找与验证码输入框相邻的图片
            const inputFields = document.querySelectorAll('input[type="text"]');
            for (let input of inputFields) {
                // 检查输入框的placeholder、id或name
                if (input.placeholder?.includes('验证码') || 
                    input.id?.toLowerCase().includes('captcha') || 
                    input.name?.toLowerCase().includes('captcha')) {
                    
                    // 查找同一容器内的图片
                    const container = input.parentElement;
                    if (container) {
                        const nearbyImages = container.querySelectorAll('img');
                        if (nearbyImages.length > 0) {
                            return nearbyImages[0];
                        }
                    }
                }
            }
        }
        
        return null;
    }

    // 判断是否为验证码图片
    function isCaptchaImage(img) {
        if (!img.complete || !img.naturalWidth || !img.naturalHeight) return false;
        
        // 调整大小限制，某些验证码可能略大于当前限制
        // 从仅限100x200扩大到150x250
        if (img.naturalHeight > 150 || img.naturalWidth > 250) return false;
        
        // 扩展关键词列表
        const keywords = [
            'captcha', 'verify', 'verification', 'code', 'yzm', '验证码', 'validate', 
            'security', 'seccode', 'checkcode', 'vcode', 'verifycode', 'check', 
            'auth', 'authcode', 'verify_code', 'verifCode'
        ];
        const attrs = ['src', 'id', 'class', 'alt', 'title', 'name'];
        
        // 检查图片周围的文本
        if (img.parentElement) {
            const parentText = img.parentElement.textContent || '';
            if (parentText.includes('验证码') || 
                parentText.includes('code') || 
                parentText.includes('check') ||
                parentText.includes('verification')) {
                return true;
            }
            
            // 检查周围元素
            const siblings = Array.from(img.parentElement.children);
            for (let sibling of siblings) {
                if (sibling !== img) {
                    const siblingText = sibling.textContent || '';
                    if (siblingText.includes('验证码') || 
                        siblingText.includes('code') || 
                        siblingText.includes('verify')) {
                        return true;
                    }
                }
            }
            
            // 检查附近的输入框
            const nearbyInput = img.parentElement.querySelector('input[type="text"]');
            if (nearbyInput) {
                return true;  // 图像旁边有文本输入框，很可能是验证码
            }
        }
        
        // 检查图片URL
        if (img.src) {
            const srcLower = img.src.toLowerCase();
            if (srcLower.includes('captcha') || 
                srcLower.includes('verify') || 
                srcLower.includes('code') || 
                srcLower.includes('check') ||
                srcLower.includes('yzm') ||
                srcLower.includes('rand') ||
                srcLower.includes('random') ||
                /\.(php|aspx|ashx|cgi)\?/.test(srcLower)) {  // 动态生成的图片
                return true;
            }
        }
        
        // 检查原始属性
        for (let attr of attrs) {
            if (img[attr]) {
                for (let keyword of keywords) {
                    if (img[attr].toLowerCase().includes(keyword.toLowerCase())) {
                        return true;
                    }
                }
            }
        }
        
        // 针对特定网站的特殊检测
        if (window.location.hostname.includes('zlweb.top')) {
            // 针对 zlweb.top 网站的特殊处理
            // 检查登录表单中的所有图片
            const loginForms = document.querySelectorAll('form');
            for (let form of loginForms) {
                if (form.method?.toLowerCase() === 'post' && 
                    (form.action?.includes('login') || form.action?.includes('admin'))) {
                    const formImages = form.querySelectorAll('img');
                    if (formImages.length > 0 && formImages[0] === img) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    // 查找验证码输入框
    function findCaptchaInput() {
        // 首先尝试通过标签文本查找
        const labels = document.getElementsByTagName('td');
        for (let label of labels) {
            if (label.textContent === '验证码:' || label.textContent === '验证码：') {
                const nextInput = label.nextElementSibling?.querySelector('input');
                if (nextInput) return nextInput;
            }
        }

        // 查找带有验证码标签的输入框
        const inputs = document.getElementsByTagName('input');
        for (let input of inputs) {
            if (input.type === 'hidden' || input.style.display === 'none') continue;
            
            // 排除two-step passcode输入框
            if (input.id?.toLowerCase().includes('passcode') || 
                input.name?.toLowerCase().includes('passcode')) {
                continue;
            }

            // 检查输入框及其父元素的特征
            const parentText = input.parentElement?.textContent || '';
            if (input.type === 'text' && (
                parentText.includes('验证码') ||
                input.placeholder?.includes('验证码') ||
                input.id?.toLowerCase().includes('captcha') ||
                input.name?.toLowerCase().includes('captcha') ||
                input.className?.toLowerCase().includes('captcha')
            )) {
                return input;
            }
        }

        return null;
    }

    // 将图片转换为base64
    async function imageToBase64(img) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
            resolve(base64);
        });
    }

    // 清理识别文本
    function cleanRecognizedText(text) {
        if (!text) return '';
        // 移除冒号和其他非字母数字字符，保留空格
        let cleaned = text.replace(/[^a-zA-Z0-9\s]/g, '');
        // 移除多余空格
        cleaned = cleaned.replace(/\s+/g, '');
        return cleaned.trim();
    }

    // 自动填充识别结果
    function fillCaptcha(input, text) {
        input.value = text;
        const events = ['input', 'change', 'keyup', 'keydown', 'keypress'];
        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            input.dispatchEvent(event);
        });
        
        // 尝试React特殊处理
        try {
            for (const key in input) {
                if (key.startsWith('__reactEventHandlers') && input[key].onChange) {
                    const changeEvent = new Event('change', { bubbles: true });
                    input[key].onChange(changeEvent);
                }
            }
        } catch (e) {
            // React处理失败，忽略错误
        }
    }

    // 显示提示消息
    let messageTimeout = null;
    function showMessage(msg, isError = false) {
        if (messageTimeout) {
            clearTimeout(messageTimeout);
        }
        const existingMsg = document.querySelector('.ocr-message');
        if (existingMsg) {
            existingMsg.remove();
        }

        // 只在成功时显示消息
        if (!isError) {
            const div = document.createElement('div');
            div.className = 'ocr-message';
            div.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                padding: 10px 20px;
                background-color: #44ff44;
                color: white;
                border-radius: 5px;
                z-index: 9999;
                font-size: 14px;
                transition: opacity 0.5s;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            `;
            div.textContent = msg;
            document.body.appendChild(div);

            messageTimeout = setTimeout(() => {
                div.style.opacity = '0';
                setTimeout(() => div.remove(), 500);
            }, 2000);
        } else {
            // 错误只记录到控制台
            console.error(msg);
        }
    }

    // 主要处理流程
    async function processCaptcha() {
        // 节流控制
        const now = Date.now();
        if (isProcessing || now - lastCheckTime < THROTTLE_INTERVAL) {
            return;
        }
        
        lastCheckTime = now;
        isProcessing = true;
        
        try {
            const captchaImg = findCaptchaImage();
            const captchaInput = findCaptchaInput();

            if (!captchaImg || !captchaInput) {
                // 没有找到验证码，增加空检查计数
                consecutiveEmptyChecks++;
                
                // 只在第一次和最后一次记录日志
                if (consecutiveEmptyChecks === 1 || consecutiveEmptyChecks === MAX_EMPTY_CHECKS) {
                    console.log(`未找到验证码图片或输入框 (${consecutiveEmptyChecks}/${MAX_EMPTY_CHECKS})`);
                }
                
                // 如果连续多次没找到验证码，且页面已完全加载，则暂停定时检查
                if (consecutiveEmptyChecks >= MAX_EMPTY_CHECKS && pageFullyLoaded) {
                    stopChecking();
                }
                
                isProcessing = false;
                return;
            }
            
            // 找到验证码，重置空检查计数
            consecutiveEmptyChecks = 0;
            // 记录已找到验证码
            captchaFound = true;

            // 检查是否是相同的图片
            const currentSrc = captchaImg.src;
            if (currentSrc === lastProcessedImage && captchaInput.value) {
                isProcessing = false;
                return;
            }
            lastProcessedImage = currentSrc;

            await new Promise(resolve => {
                if (captchaImg.complete) {
                    resolve();
                } else {
                    captchaImg.onload = resolve;
                    setTimeout(resolve, 2000);
                }
            });

            const base64Image = await imageToBase64(captchaImg);
            let recognizedText = await recognizeCaptcha(base64Image);
            recognizedText = cleanRecognizedText(recognizedText);
            
            if (recognizedText && recognizedText.length > 0) {
                console.log("识别结果:", recognizedText);
                fillCaptcha(captchaInput, recognizedText);
                showMessage(`验证码识别成功: ${recognizedText}`);
            } else {
                console.log("识别失败或结果为空");
            }
        } catch (error) {
            console.error("处理验证码发生错误:", error);
        } finally {
            isProcessing = false;
        }
    }

    // 停止检查函数
    function stopChecking() {
        if (checkInterval) {
            console.log("没有检测到验证码，停止定时检查");
            clearInterval(checkInterval);
            checkInterval = null;
        }
    }

    // 重新开始检查函数
    function resumeChecking() {
        if (!checkInterval) {
            console.log("检测到用户交互或页面变化，重新开始检查验证码");
            consecutiveEmptyChecks = 0;
            checkInterval = setInterval(processCaptcha, 5000);
        }
    }

    // 监听页面变化
    function observePageChanges() {
        let debounceTimer = null;
        const debounceDelay = 500;
        
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;
            let modalDetected = false;
            
            // 如果已经在处理中，不需要再次触发
            if (isProcessing) return;
            
            for (let mutation of mutations) {
                // 检查新添加的节点
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // 元素节点
                            const element = node;
                            
                            // 检查是否是弹窗
                            if (element.className && (
                                element.className.includes('modal') || 
                                element.className.includes('popup') || 
                                element.className.includes('dialog') || 
                                element.className.includes('layer') ||
                                element.className.includes('login') ||
                                element.className.includes('captcha') ||
                                element.className.includes('verification')
                            )) {
                                shouldProcess = true;
                                modalDetected = true;
                                break;
                            }
                            
                            // 检查元素样式是否像弹窗
                            const style = window.getComputedStyle(element);
                            if (style.position === 'fixed' || style.position === 'absolute') {
                                if (parseInt(style.zIndex) > 100) {
                                    shouldProcess = true;
                                    modalDetected = true;
                                    break;
                                }
                            }
                            
                            // 检查是否包含图片或输入框
                            if (element.tagName === 'IMG' || 
                                element.querySelector('img') || 
                                element.querySelector('input[type="text"]')) {
                                shouldProcess = true;
                                break;
                            }
                        }
                    }
                }
                
                // 检查属性变化，特别是图片src的变化
                if (mutation.type === 'attributes') {
                    const target = mutation.target;
                    
                    // 检查图片src变化
                    if (mutation.attributeName === 'src' && target.tagName === 'IMG') {
                        shouldProcess = true;
                        break;
                    }
                    
                    // 检查元素可见性变化
                    if (['style', 'class', 'display', 'visibility'].includes(mutation.attributeName)) {
                        const style = window.getComputedStyle(target);
                        const wasHidden = target.dataset.wasHidden === 'true';
                        const isHidden = style.display === 'none' || style.visibility === 'hidden';
                        
                        if (wasHidden && !isHidden) {
                            // 元素从隐藏变为可见
                            target.dataset.wasHidden = 'false';
                            shouldProcess = true;
                            
                            // 检查是否是弹窗
                            if (target.className && (
                                target.className.includes('modal') || 
                                target.className.includes('popup') || 
                                target.className.includes('dialog')
                            )) {
                                modalDetected = true;
                            }
                        } else if (!wasHidden && isHidden) {
                            target.dataset.wasHidden = 'true';
                        }
                    }
                }
            }
            
            if (shouldProcess) {
                // 检测到显著的DOM变化，重新开始检查
                consecutiveEmptyChecks = 0;
                resumeChecking();
                
                // 使用防抖，避免短时间内多次触发
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    if (modalDetected) {
                        setTimeout(processCaptcha, 800);
                    } else {
                        processCaptcha();
                    }
                }, debounceDelay);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'style', 'class', 'display', 'visibility']
        });
    }

    // 监听XHR请求
    function monitorXHRRequests() {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            // 监听登录和验证码相关的URL
            if (url.toLowerCase().includes('login') || 
                url.toLowerCase().includes('captcha') || 
                url.toLowerCase().includes('verify')) {
                
                const originalOnreadystatechange = this.onreadystatechange;
                this.onreadystatechange = function() {
                    if (this.readyState === 4) {
                        console.log("检测到可能的登录/验证码请求:", url);
                        // 在请求完成后尝试检测验证码
                        setTimeout(processCaptcha, 500);
                        setTimeout(processCaptcha, 1000);
                    }
                    if (originalOnreadystatechange) {
                        originalOnreadystatechange.apply(this, arguments);
                    }
                };
            }
            originalOpen.apply(this, arguments);
        };
        
        // 如果网站使用fetch
        if (window.fetch) {
            const originalFetch = window.fetch;
            window.fetch = function() {
                const url = arguments[0]?.url || arguments[0];
                if (typeof url === 'string' && (
                    url.toLowerCase().includes('login') || 
                    url.toLowerCase().includes('captcha') || 
                    url.toLowerCase().includes('verify'))) {
                    
                    console.log("检测到可能的fetch登录/验证码请求:", url);
                    // 在请求完成后尝试检测验证码
                    setTimeout(processCaptcha, 500);
                    setTimeout(processCaptcha, 1000);
                }
                return originalFetch.apply(this, arguments);
            };
        }
    }

    // 修改initialize函数，整合所有初始化逻辑
    function initialize() {
        // 检查API地址是否有效
        if (!OCR_API_URL || OCR_API_URL === "http://192.168.31.52:8000/ocr/base64") {
            console.log("使用默认的OCR服务地址，确保该地址可访问");
        }

        // 注册油猴菜单命令
        GM_registerMenuCommand('立即识别验证码', () => {
            resumeChecking(); // 手动检查时也重新启动自动检查
            processCaptcha();
        });

        GM_registerMenuCommand('设置API地址', () => {
            const newUrl = prompt("请输入你的TUTU OCR服务地址：", OCR_API_URL);
            if (newUrl) {
                OCR_API_URL = newUrl;
                location.reload();
            }
        });

        GM_registerMenuCommand('配置说明', () => {
            alert(`使用说明：
1. 确保你的TUTU OCR服务已经正确部署并可访问
2. 可以通过"设置API地址"菜单项设置OCR服务地址
3. 脚本会自动识别页面中的验证码，包括弹窗中的验证码
4. 也可以通过油猴菜单手动触发识别
5. 识别成功才会显示提示，失败时不显示错误提示
6. 如有问题请查看控制台日志
7. 脚本会在检测不到验证码时自动停止运行，有交互时自动恢复`);
        });

        // 读取保存的API地址
        const savedApiUrl = GM_getValue("ocrApiUrl");
        if (savedApiUrl) {
            OCR_API_URL = savedApiUrl;
        }
        
        // 等待页面完全加载
        if (document.readyState === 'complete') {
            pageFullyLoaded = true;
        } else {
            window.addEventListener('load', () => {
                pageFullyLoaded = true;
                // 页面加载完成后再次检查验证码
                setTimeout(processCaptcha, 1000);
            });
        }
        
        // 首次运行
        setTimeout(processCaptcha, 1000);

        // 监听页面变化
        observePageChanges();
        
        // 监听XHR请求
        monitorXHRRequests();
        
        // 设置用户交互监听
        setupUserInteractionMonitoring();
        
        // 定时检查，但保存定时器ID以便之后停止
        checkInterval = setInterval(() => {
            // 如果已确认不需要再检查，则清除定时器
            if (captchaFound && lastProcessedImage) {
                stopChecking();
            } else {
                processCaptcha();
            }
        }, 5000);
        
        // 添加页面可见性监听，在用户切换回页面时重新启动检查
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                consecutiveEmptyChecks = 0; // 重置计数
                resumeChecking();
            }
        });
    }

    // 启动脚本
    initialize();

    // 修改点击监听
    document.addEventListener('click', (event) => {
        // 判断点击的是不是按钮类元素
        const target = event.target;
        if (target.tagName === 'BUTTON' || 
            (target.tagName === 'INPUT' && target.type === 'submit') ||
            target.tagName === 'A' || 
            target.className?.includes('btn') || 
            target.className?.includes('button')) {
            
            // 检测到用户交互，重新启动检查
            consecutiveEmptyChecks = 0;
            resumeChecking();
            
            // 延迟检查验证码，给弹窗时间显示
            setTimeout(processCaptcha, 500);
            setTimeout(processCaptcha, 1000);
        }
    }, true);

    // 添加用户交互事件监听，任何用户操作都可能触发验证码出现
    function setupUserInteractionMonitoring() {
        const interactionEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
        
        let interactionTimeout = null;
        const handleUserInteraction = () => {
            if (interactionTimeout) {
                clearTimeout(interactionTimeout);
            }
            
            // 只在脚本已经停止检查的情况下恢复检查
            if (!checkInterval) {
                consecutiveEmptyChecks = 0;
                resumeChecking();
                
                // 立即检查一次
                processCaptcha();
                
                // 如果5秒内没有找到验证码，再次暂停检查
                interactionTimeout = setTimeout(() => {
                    if (consecutiveEmptyChecks >= MAX_EMPTY_CHECKS) {
                        stopChecking();
                    }
                }, 5000);
            }
        };
        
        // 添加事件监听
        interactionEvents.forEach(eventType => {
            document.addEventListener(eventType, handleUserInteraction, { passive: true });
        });
    }
})();

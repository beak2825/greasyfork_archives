// ==UserScript==
// @name         自动提取政和验证码
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  接着奏乐接着舞 Find an img with src containing "api-uaa/v1/validate/code", get Base64, and send it for captcha code
// @match        *://*/*
// @match        *://*/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/506916/%E8%87%AA%E5%8A%A8%E6%8F%90%E5%8F%96%E6%94%BF%E5%92%8C%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/506916/%E8%87%AA%E5%8A%A8%E6%8F%90%E5%8F%96%E6%94%BF%E5%92%8C%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==
/**
 * 新增：初始化API预热方法
 * 在脚本加载时自动向 api.xiaojingjing.top:8443 发送一次请求，用以预热该服务。
 */
function initializeAPI() {
    console.log("初始化API预热请求：开始连接 api.xiaojingjing.top:8443");
    GM_xmlhttpRequest({
        method: "GET", // 采用GET请求仅仅为了预热服务
        url: "https://api.xiaojingjing.top:8443/ocr",
        timeout: 5000, // 设置一个合适的超时时间
        onload: function(response) {
            console.log("API预热完成：", response.status);
        },
        onerror: function(error) {
            console.error("API预热失败：", error);
        }
    });
}

// 在脚本加载时立即调用初始化API预热方法
initializeAPI();

// 显示识别结果弹框，并在 3 秒后自动关闭，带进度条
function showCaptchaResultPopup(resultText) {
    // 首先检查是否已有弹框存在，如果存在，则移除之前的弹框
    const existingModal = document.querySelector('.captcha-result-modal');
    if (existingModal) {
        existingModal.remove();  // 移除之前的弹框
    }

    // 创建新的弹框容器
    const modal = document.createElement('div');
    modal.className = 'captcha-result-modal';  // 给弹框加一个类名，方便以后查找
    modal.style.position = 'fixed';
    modal.style.top = '10px';
    modal.style.right = '20px';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.color = 'white';
    modal.style.padding = '10px 20px';  // 减小弹框的高度
    modal.style.borderRadius = '10px';
    modal.style.zIndex = '999999'; // 确保在页面最上层
    modal.style.width = '250px'; // 设置弹框宽度
    modal.style.boxSizing = 'border-box';

    // 创建弹框标题
    const title = document.createElement('h3');
    title.innerText = '验证码识别结果';
    title.style.margin = '0 0 5px';
    title.style.fontSize = '16px';  // 减小字体大小
    modal.appendChild(title);

    // 创建弹框内容
    const content = document.createElement('p');
    content.innerText = resultText;  // 展示识别结果
    content.style.fontSize = '14px';  // 减小字体大小
    modal.appendChild(content);

    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.innerText = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.padding = '0px';
    closeButton.style.backgroundColor = '#FF4D4F'; // 红色背景
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '50%'; // 圆形按钮
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '20px';  // 增大字体
    closeButton.style.width = '20px';  // 定义宽度
    closeButton.style.height = '20px'; // 定义高度
    closeButton.style.transition = 'background-color 0.3s';  // 添加平滑过渡效果

    // 绑定关闭按钮事件
    closeButton.addEventListener('click', function () {
        modal.remove();  // 关闭弹框
    });

    // 将关闭按钮添加到弹框
    modal.appendChild(closeButton);

    // 创建进度条容器
    const progressBarContainer = document.createElement('div');
    progressBarContainer.style.height = '5px';
    progressBarContainer.style.backgroundColor = '#444';
    progressBarContainer.style.borderRadius = '5px';
    progressBarContainer.style.overflow = 'hidden';
    modal.appendChild(progressBarContainer);

    // 创建进度条
    const progressBar = document.createElement('div');
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = '#4caf50'; // 进度条颜色
    progressBar.style.width = '100%';  // 初始进度为 100%
    progressBarContainer.appendChild(progressBar);

    // 将弹框添加到页面
    document.body.appendChild(modal);

    // 设置倒计时，3秒后自动关闭
    let timeLeft = 5; // 5 秒倒计时
    let interval;

    // 更新进度条和倒计时
    function updateProgressBar() {
        timeLeft -= 0.05;
        progressBar.style.width = (timeLeft / 5) * 100 + '%';  // 更新进度条

        if (timeLeft <= 0) {
            clearInterval(interval);  // 清除定时器
            modal.remove();  // 关闭弹框
        }
    }

    // 启动进度条更新定时器
    interval = setInterval(updateProgressBar, 50); // 每 50 毫秒更新一次进度条

    // 鼠标悬浮时暂停进度条和倒计时
    modal.addEventListener('mouseover', () => {
        clearInterval(interval);  // 暂停进度条更新
    });

    // 鼠标离开时重新开始进度条
    modal.addEventListener('mouseleave', () => {
        interval = setInterval(updateProgressBar, 50);  // 恢复进度条更新
    });
}


// 处理图片验证码
function processImageCaptcha(imgElement) {
    if (!imgElement || !imgElement.src) return;
    // 打印图片信息
    console.log('识别图像验证码:', imgElement.src);
    // 将图片转换为 Base64 编码
    getBase64Code(imgElement).then(base64 => {
        // 这里可以调用识别 API 来处理 Base64 编码的图片
        // 发送 Base64 编码给服务器进行识别
        if (base64) sendImageForOCR(imgElement, base64);
    }).catch(error => {
        console.error('图片转换失败:', error);
    });
}

// 获取图片的 Base64 编码
function getBase64Code(element) {
    return new Promise((resolve, reject) => {
        // 确保图片加载完成
        if (element.complete) {
            // 如果图片已经加载完，直接获取宽高
            resolve(getImageBase64(element));
        } else {
            element.onload = function () {
                resolve(getImageBase64(element));
            };
            element.onerror = function () {
                reject('图片加载失败');
            };
        }
    });
}


// 用于判断图像是否跨域的函数
function isCrossOrigin(src) {
    const link = document.createElement('a');
    link.href = src;

    // 如果源与当前页面的主机不同，则认为是跨域资源
    return link.origin !== window.location.origin;
}
function isValidBase64(base64) {
    // 判断 base64 长度是否小于 20，或者不包含 data:image/ 前缀
    if (base64.length < 20 || !base64.startsWith('data:image/')) {
        return false;  // 无效的 base64 数据
    }
    return true;  // 基本有效的图片数据
}

// 获取图片的 Base64 编码
function getImageBase64(element) {
    return new Promise((resolve, reject) => {
        const src = element.src;
        // 静态,单个图片 0 英文+数字  1 算数
        if (src.includes("type=0") || src.includes("type=1")) {
            try {
                // 判断图像是否为跨域资源（简单的判断方法：如果资源是外部域名，可能是跨域）
                if (isCrossOrigin(src)) {
                    element.crossOrigin = 'Anonymous'; // 仅在跨域时设置
                }
                // 创建一个 canvas 元素
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                // 确保 canvas 的尺寸与图片相同
                canvas.width = element.naturalWidth;
                canvas.height = element.naturalHeight;
                console.log("验证码宽高:", element.naturalWidth, element.naturalHeight);
                // 将图片绘制到 canvas 上
                context.drawImage(element, 0, 0, element.naturalWidth, element.naturalHeight);

                // 尝试直接转换，如果失败，可能存在跨域
                let base64 = canvas.toDataURL("image/png");
                console.log(isValidBase64(base64))
                if (isValidBase64(base64)) {
                    resolve(base64);
                } else {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: src,
                        responseType: 'arraybuffer',
                        onload: function (response) {
                            if (response.status === 200) {
                                // 获取图像的二进制数据
                                const binary = new Uint8Array(response.response);
                                // 将二进制数据转成 base64 编码
                                base64 = "data:image/png;base64," + btoa(String.fromCharCode.apply(null, binary));

                                // 保存原始的事件处理器
                                const clickEvent = element.onclick;

                                // 替换 img 元素的 src 并触发图像加载
                                element.src = base64;

                                // 确保图片加载完成后执行其他操作
                                element.onload = function() {
                                    console.log("图片已更新并加载完毕");

                                    // 重新绑定原始的点击事件
                                    if (clickEvent) {
                                        element.onclick = clickEvent;
                                    }

                                    // 你可以在这里添加其他的事件处理逻辑
                                    element.addEventListener('click', () => {
                                        console.log("图片被点击了");
                                        // 你可以在这里放置自定义的点击事件处理逻辑
                                    });
                                };

                                // 返回 base64 编码的图片数据
                                console.log("替换后的 base64:", base64);
                                resolve(base64);
                            } else {
                                reject("无法加载图片: " + src);
                            }
                        },
                        onerror: function () {
                            reject("请求图片失败: " + src);
                        }
                    });
                }
            } catch (e) {
                reject(e);
            }
        } else {
            console.log("当前是 gif 验证码,图片地址:", src);
            // gif 2 中文 3 英文+ 数字
            GM_xmlhttpRequest({
                method: 'GET',
                url: src,
                responseType: 'arraybuffer',
                onload: function (response) {
                    if (response.status === 200) {
                        // 获取图像的二进制数据
                        const binary = new Uint8Array(response.response);
                        // 将二进制数据转成 base64 编码
                        const base64 = "data:image/gif;base64," + btoa(String.fromCharCode.apply(null, binary));

                        // 保存原始的事件处理器
                        const clickEvent = element.onclick;

                        // 替换 img 元素的 src 并触发图像加载
                        element.src = base64;

                        // 确保图片加载完成后执行其他操作
                        element.onload = function() {
                            console.log("图片已更新并加载完毕");

                            // 重新绑定原始的点击事件
                            if (clickEvent) {
                                element.onclick = clickEvent;
                            }

                            // 你可以在这里添加其他的事件处理逻辑
                            element.addEventListener('click', () => {
                                console.log("图片被点击了");
                                // 你可以在这里放置自定义的点击事件处理逻辑
                            });
                        };

                        // 返回 base64 编码的图片数据
                        console.log("替换后的 base64:", base64);
                        resolve(base64);
                    } else {
                        reject("无法加载图片: " + src);
                    }
                },
                onerror: function () {
                    reject("请求图片失败: " + src);
                }
            });
        }
    });
}

// 发送图片到服务器进行 OCR 识别
function sendImageForOCR(imgElement, base64) {
    console.log("准备发送图片进行识别，图片 URL:", imgElement.src);
    console.log("准备发送图片进行识别，图片 base64:", base64);

    try {

        // 创建 JSON 对象
        const requestData = {
            image: base64
        };
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.xiaojingjing.top:8443/ocr",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                "User-Agent": navigator.userAgent
            },
            data: JSON.stringify(requestData),
            onload: function (response) {
                console.log('识别结果:', response.responseText);
                const jsonResponse = JSON.parse(response.responseText);
                // 检查 code 是否为 200
                if (response.status === 200) {
                    const inputElement = findClosestInput(imgElement);
                    if (inputElement) {
                        // 关闭输入框的验证
                        disableInputValidation(inputElement);
                        // 获取识别结果
                        const captchaText = jsonResponse.result;
                        console.log('识别结果:', captchaText);

                        // 判断是否包含计算表达式
                        if (imgElement.src.includes("type=1")) {
                            // 如果包含数学运算，进行计算
                            const result = evaluateMathExpression(captchaText);
                            console.log('计算结果:', result);
                            inputElement.value = result;  // 填充计算结果
                            // 在页面上展示识别结果的弹框
                            showCaptchaResultPopup(captchaText.replace('=', '') + '=' + result);
                        } else {
                            // 否则，直接填充识别结果
                            inputElement.value = captchaText;

                            if(imgElement.src.includes("type=3")||!imgElement.src.includes("type")){
                                // 在页面上展示识别结果的弹框
                                showCaptchaResultPopup(captchaText+"\n动态验证码识别率较低,如有错误,请点击图片重试!");
                            }else{
                                // 在页面上展示识别结果的弹框
                                showCaptchaResultPopup(captchaText);
                            }

                        }
                        // 手动触发 input 事件，以便页面检测到输入的变化
                        const event = new Event('input', {bubbles: true});
                        inputElement.dispatchEvent(event);
                        // 如果还有其他事件检测输入，可以一并触发
                        const changeEvent = new Event('change', {bubbles: true});
                        inputElement.dispatchEvent(changeEvent);
                        console.log('验证码已填充至输入框:', inputElement.value);
                    } else {
                        console.log('未查询到输入框!');
                    }
                } else {
                    console.error('识别错误!:', jsonResponse);
                }
            }, onerror: function (error) {
                console.error('识别错误:', error);
            }
        });
    } catch (error) {
        console.error("识别异常:", error);
    }
}


// 计算数学表达式
function evaluateMathExpression(expression) {
    try {
        // 使用 JavaScript 的 eval 函数计算表达式
        // 移除等号并计算
        return eval(expression.replace('=', '').replace('x', '*').replace('X', '*').replace('÷', '/').trim());
    } catch (e) {
        console.error('计算错误:', e);
        return '';
    }
}

// 禁用输入框的验证
function disableInputValidation(inputElement) {
    inputElement.removeAttribute('required');
    inputElement.removeAttribute('minlength');
    inputElement.removeAttribute('maxlength');
    inputElement.removeAttribute('pattern');
    // 移除错误提示标题
    inputElement.removeAttribute('title');
    // 如果输入框是属于一个表单，禁用整个表单的验证
    const form = inputElement.closest('form');
    if (form) {
        // 禁用表单验证
        form.setAttribute('novalidate', 'true');
    }
}

// 给图片添加左键点击事件
function addImageClickListener(imgElement) {
    if (!imgElement) return;
    // 给图片添加左键点击事件
    imgElement.addEventListener('click', function (e) {
        // 确保是左键点击
        if (e.button === 0) {
            // 左键点击
            console.log('点击了图片:', imgElement.src);
            processImageCaptcha(imgElement);
        }
    });
}

// 定义从 img 元素开始逐级向上查找最近的 input 元素的函数
function findClosestInput(element) {
    while (element) {
        element = element.parentElement;
        if (!element) break;
        const inputs = element.getElementsByTagName('input');
        if (inputs.length > 0) {
            // 返回找到的最后一个 input 元素
            return inputs[inputs.length - 1];
        }
    }
    return null;
}

// 检查页面上的验证码图像，并触发识别
function checkForCaptchaImages() {
    // 选择所有图片验证码元素
    $("canvas,img,input[type='image']").each(function () {
        // 确保是可见的图片，并且没有处理过
        const imgElement = this;
        if ($(imgElement).is(":visible") && !$(imgElement).data('processed')) {
            const imgSrc = imgElement.src;
            // 只处理包含 'api-uaa/v1/validate/code' 的图片
            if (imgSrc && imgSrc.includes('api-uaa/v1/validate/code')) {
                // 标记为已处理
                $(imgElement).data('processed', true);
                // 给图片添加左键点击事件
                addImageClickListener(imgElement);
                // 进行识别
                processImageCaptcha(imgElement);
            }
        }
    });
}


// 监听图片的变化，确保图像更新后重新触发识别
function observeImageChanges() {
    const observer = new MutationObserver(() => {
        checkForCaptchaImages();
    });
    // 监听 img 和 canvas 元素的变化
    observer.observe(document.body, {
        childList: true, subtree: true,
    });
}

// 开始监听图像变化
observeImageChanges();

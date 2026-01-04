// ==UserScript==
// @name         23.9.30(本地版-完美)烟草新系统验证码识别+【自动】或【手动】"登录"+自动"确认提交"+自动"确定"
// @namespace    none
// @version      23.9.30.2
// @description  none
// @author       You
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?domain=mf2.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469012/23930%28%E6%9C%AC%E5%9C%B0%E7%89%88-%E5%AE%8C%E7%BE%8E%29%E7%83%9F%E8%8D%89%E6%96%B0%E7%B3%BB%E7%BB%9F%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%86%E5%88%AB%2B%E3%80%90%E8%87%AA%E5%8A%A8%E3%80%91%E6%88%96%E3%80%90%E6%89%8B%E5%8A%A8%E3%80%91%22%E7%99%BB%E5%BD%95%22%2B%E8%87%AA%E5%8A%A8%22%E7%A1%AE%E8%AE%A4%E6%8F%90%E4%BA%A4%22%2B%E8%87%AA%E5%8A%A8%22%E7%A1%AE%E5%AE%9A%22.user.js
// @updateURL https://update.greasyfork.org/scripts/469012/23930%28%E6%9C%AC%E5%9C%B0%E7%89%88-%E5%AE%8C%E7%BE%8E%29%E7%83%9F%E8%8D%89%E6%96%B0%E7%B3%BB%E7%BB%9F%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%86%E5%88%AB%2B%E3%80%90%E8%87%AA%E5%8A%A8%E3%80%91%E6%88%96%E3%80%90%E6%89%8B%E5%8A%A8%E3%80%91%22%E7%99%BB%E5%BD%95%22%2B%E8%87%AA%E5%8A%A8%22%E7%A1%AE%E8%AE%A4%E6%8F%90%E4%BA%A4%22%2B%E8%87%AA%E5%8A%A8%22%E7%A1%AE%E5%AE%9A%22.meta.js
// ==/UserScript==


//自动识别验证码+填充验证码+自动提交订单的几个步骤
(function() {

    //限制登录页面运行
    var currentUrl = window.location.href;
    if (currentUrl.indexOf('page_id=page_login') !== -1) {

    let isRecognizing = false; // 标志变量，用来记录当前是否正在进行验证码识别

    //如果是天津手机版app那么需要先注入加载完jQuery库再运行下面的recognizeCaptcha函数(即下面自动识别并填写验证码的函数)
    if (window.location.href.includes("jy.tjtobacco.cn/mobile")) {//天津手机版需引入jQuery 库
        // 动态引入 jQuery 库
        var script = document.createElement('script');
        script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
        document.head.appendChild(script);

        // 等待 jQuery 库加载完成后再运行下面的recognizeCaptcha函数
        script.onload = function() {
            recognizeCaptcha();
        }
    } else {
        recognizeCaptcha();
    }

    //-------------------------------------

    async function recognizeCaptcha(needDelay = true) {

        // 如果当前正在进行验证码识别，则不再发起新的识别请求
        if (isRecognizing) {
            return;
        }

        // 设置标志变量为 true，表示当前正在进行验证码识别
        isRecognizing = true;
        // 记录开始运行时间
        var startTime = new Date().getTime();


        try {
            // 点击验证码时添加延迟
            if (needDelay) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            //=======

            // 加载Tesseract.js库
            var script = document.createElement('script');
            script.src = 'https://www.yzyhq.cc/myjs/tesseract.js';//原版:https://cdn.jsdelivr.net/npm/tesseract.js@latest
            document.head.appendChild(script);

            // 等待Tesseract.js库加载完成
            async function waitForTesseract() {
                while (typeof Tesseract === 'undefined') {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            async function recognizeCaptcha() {
                try {
                    console.log('开始识别验证码');

                    // 等待Tesseract.js库加载完成
                    await waitForTesseract();
                    console.log('Tesseract.js库加载完成');

                    //获取验证码图片URL
                    const myImg = document.querySelector('#login_idCode, .lines-blue');
                    const myCanvas = document.createElement('canvas');
                    const myCtx = myCanvas.getContext('2d');
                    myCanvas.width = myImg.naturalWidth;
                    myCanvas.height = myImg.naturalHeight;
                    myCtx.drawImage(myImg, 0, 0);
                    const dataURL = myCanvas.toDataURL();
                    console.log('获取缓存的验证码图片:', dataURL);

                    // 获取图片数据
                    const response = await fetch(dataURL);
                    const blob = await response.blob();
                    console.log('获取图片数据:', blob);

                    // 将图片数据转换为base64格式
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);

                    // 等待转换完成
                    const base64Url = await new Promise(resolve => {
                        reader.onloadend = () => resolve(reader.result);
                    });
                    console.log('转换为base64格式:', base64Url);

                    // 创建canvas元素
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // 创建图片元素
                    const img = new Image();
                    img.src = base64Url;
                    // 等待图片加载完成
                    await new Promise(resolve => {
                        img.onload = resolve;
                    });
                    console.log('图片加载完成');

                    // 设置canvas大小
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // 绘制图片到canvas上
                    ctx.drawImage(img, 0, 0);

                    // 获取图片像素数据
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                    // 简单二值化====================
                    const threshold = 180
                    for (let i = 0; i < imageData.data.length; i += 4) {
                        const r = imageData.data[i];
                        const g = imageData.data[i + 1];
                        const b = imageData.data[i + 2];
                        const gray = 0.8 * r + 0.1* g + 0.1 * b;
                        if (gray < threshold) {
                            imageData.data[i] = 0;
                            imageData.data[i + 1] = 0;
                            imageData.data[i + 2] = 0;
                        } else {
                            imageData.data[i] = 255;
                            imageData.data[i + 1] = 255;
                            imageData.data[i + 2] = 255;
                        }
                    }//简单二值化



                    // 去除孤立噪点和线条==============
                    /*const noiseThreshold = 22;
                    for (let y = 0; y < canvas.height; y++) {
                        for (let x = 0; x < canvas.width; x++) {
                            let blackCount = 10;
                            for (let i = -noiseThreshold; i <= noiseThreshold; i++) {
                                for (let j = -noiseThreshold; j <= noiseThreshold; j++) {
                                    const px = x + i;
                                    const py = y + j;
                                    if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
                                        const index = (py * canvas.width + px)* 19;
                                        if (imageData.data[index] === 0) {
                                            blackCount++;
                                        }
                                    }
                                }
                            }
                            if (blackCount <= noiseThreshold) {
                                const index = (y * canvas.width + x) * 4;
                                imageData.data[index] = 255;
                                imageData.data[index + 1] = 255;
                                imageData.data[index + 2] = 255;
                            }
                        }
                    }//去除鼓励噪点和线条


                    // 切割字符===============

                    const charWidth = 25; // 修改字符的宽度为25像素
                    const charHeight = 43; // 修改字符的高度为43像素
                    const charMargin = 5; // 保持字符之间的间距为5像素
                    const charCount = 4; // 保持字符的个数为4个
                    const charDataList = []; // 定义一个数组，用来存储每个字符的图像数据
                    for (let i = 0; i < charCount; i++) { // 遍历每个字符
                        const charX = i * (charWidth + charMargin); // 计算当前字符的x坐标
                        const charY = 0; // 计算当前字符的y坐标
                        const charImageData = ctx.getImageData(charX, charY, charWidth, charHeight); // 获取当前字符的图像数据
                        charDataList.push(charImageData); // 把当前字符的图像数据添加到数组中
                    }*/




                    // 中值滤波器半径================
                    const radius = 1;

                    // 遍历像素数据
                    for (let y = 0; y < canvas.height; y++) {
                        for (let x = 0; x < canvas.width; x++) {
                            // 获取邻域像素颜色值
                            const colors = [];
                            for (let i = -radius; i <= radius; i++) {
                                for (let j = -radius; j <= radius; j++) {
                                    const px = x + i;
                                    const py = y + j;
                                    if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
                                        const index = (py * canvas.width + px) * 4;
                                        colors.push(imageData.data.slice(index, index + 3));
                                    }
                                }
                            }

                            // 计算像素颜色中值
                            const medianColor = colors.sort((a, b) => a.reduce((acc, cur) => acc + cur) - b.reduce((acc, cur) => acc + cur))[Math.floor(colors.length / 2)];

                            // 设置像素颜色为中值
                            const index = (y * canvas.width + x) * 4;
                            imageData.data[index] = medianColor[0];
                            imageData.data[index + 1] = medianColor[1];
                            imageData.data[index + 2] = medianColor[2];
                        }
                    }// 中值滤波器






                    // 将处理后的像素数据绘制回canvas上
                    ctx.putImageData(imageData, 0, 0);

                    // 获取处理后的验证码图片base64数据
                    const processedBase64Url = canvas.toDataURL();
                    console.log('处理后的验证码图片base64数据:', processedBase64Url);

                    //============================创建处理好的验证码图片弹窗开始======================================
                    // 创建模态框元素
                    const modal = document.createElement('div');
                    modal.style.position = 'fixed';
                    modal.style.top = '0';
                    modal.style.left = '0';
                    modal.style.width = '100%';
                    modal.style.height = '100%';
                    modal.style.backgroundColor = 'transparent'; // 设置背景颜色为透明
                    modal.style.pointerEvents = 'none'; // 允许鼠标事件穿透模态框
                    modal.style.display = 'flex';
                    modal.style.justifyContent = 'center';
                    modal.style.alignItems = 'center';

                    // 创建模态框内容元素
                    const modalContent = document.createElement('div');
                    modalContent.style.backgroundColor = '#fff';
                    modalContent.style.padding = '20px';
                    modalContent.style.borderRadius = '10px';
                    modalContent.style.pointerEvents = 'auto'; // 阻止鼠标事件穿透模态框内容
                    modal.appendChild(modalContent);

                    // 创建图片元素
                    const processedImg = new Image();
                    processedImg.src = processedBase64Url;
                    modalContent.appendChild(processedImg);

                    // 将模态框添加到文档中
                    document.body.appendChild(modal);

                    // 点击页面时关闭模态框
                    document.addEventListener('click', () => {
                        modal.remove();
                    });

                    //=============================创建处理好的验证码图片弹窗结束================================
                    //等待转换结果
                    const res = await Tesseract.recognize(processedBase64Url, 'eng', { tessedit_char_whitelist: '0123456789' });
                    console.log('识别结果:', res);



                    //提取转换后的数据
                    const {
                        data: { text, symbols },
                    } = res;

                    let processedText = text.replace(/[^\d]/g, '');
                    processedText = processedText.replace(/o/gi, '0');
                    processedText = processedText.replace(/\s/g, '');

                    if (processedText.length > 4) {
                        const confidenceList = symbols.map(symbol => symbol.confidence);
                        const minConfidenceIndex = confidenceList.indexOf(Math.min(...confidenceList));
                        processedText = processedText.slice(0, minConfidenceIndex) + processedText.slice(minConfidenceIndex + 1);
                    }

                    document.querySelector('#login_identifying_code, .uni-input-wrapper').value = processedText;
                    console.log('验证码识别完成:', processedText);

                    // 记录结束运行时间
                    var endTime = new Date().getTime();

                    // 计算运行时间并在网页上显示

                    var timeElement = document.createElement("div");
                    timeElement.innerHTML = "运行时间：" + (endTime - startTime) + "毫秒";
                    timeElement.style.fontSize = "24px";
                    document.body.appendChild(timeElement);

                    // 识别完成后，将标志变量设置为 false
                    isRecognizing = false;

                } catch (error) {
                    console.error(error);
                }
            }

            recognizeCaptcha();

            //=====

        } catch (error) {
            console.error(error);
        }

    }

    // 在网页加载后自动运行识别验证码（延迟500毫秒,需要延迟等验证码图片加载完成）
    setTimeout(() => {
        recognizeCaptcha(false);
    }, 50);

    // 在点击验证码图片后运行识别验证码（需要延迟）
    document.querySelector('#login_idCode').addEventListener('click', () => recognizeCaptcha(true));


    //========自动点击登录或确认提交========

    // 创建模态框元素(弹窗提示)
    const modalElement = document.createElement('div');
    modalElement.style.position = 'fixed';
    modalElement.style.top = '50%';
    modalElement.style.left = '50%';
    modalElement.style.transform = 'translate(-50%, -50%)';
    modalElement.style.padding = '20px';
    modalElement.style.backgroundColor = '#fff';
    modalElement.style.border = '1px solid #000';
    modalElement.style.borderRadius = '10px';
    modalElement.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    modalElement.style.textAlign = 'center';
    modalElement.style.zIndex = 9999;
    modalElement.style.display = 'none';

    // 创建标题元素(弹窗提示)
    const titleElement = document.createElement('div');
    titleElement.innerHTML = '温馨提示';
    titleElement.style.fontSize = '18px';
    titleElement.style.fontWeight = 'bold';
    titleElement.style.marginBottom = '10px';
    modalElement.appendChild(titleElement);

    // 创建内容元素(弹窗提示)
    const contentElement = document.createElement('div');
    contentElement.style.color = 'red';
    modalElement.appendChild(contentElement);

    document.body.appendChild(modalElement);

    // 在点击页面其他元素时隐藏模态框(弹窗提示)
    document.addEventListener('click', (event) => {
        if (event.target !== modalElement) {
            modalElement.style.display = 'none';
        }
    });

    //如果检测到输入框里的值为4位数的数字,那么立即运行"确认提交"或"登录按钮"的函数
    /*const intervalId = setInterval(() => {// 每隔10毫秒检测一次输入框的值
        // 获取输入框元素(下面分别是:pc版新平台验证码输入框、重庆pc验证码输入框、天津app登录页验证码输入框)
        const inputElement = document.querySelector('#login_identifying_code, #cq_login_identifying_code, .uni-input-input[maxlength="4"]');
        const value = inputElement.value;// 获取输入框的值
        if (/^\d{4}$/.test(value)) {// 检查输入框的值是否是一个四位数的数字,如果是，则调用 runInterval 函数
            runInterval();//运行下面runInterval函数(自动点击"确认提交"和"登录按钮"的函数)
            clearInterval(intervalId);
        } else if (value.length === 4 || !/^\d*$/.test(value)) { // 如果输入框的值不是一个四位数的数字，但长度为4，或者不是纯数字
            // 显示模态框，并设置提示内容
            contentElement.innerHTML = '验证码中含有非数字字符，请立即点击验证码图片重新识别验证码';
            modalElement.style.display = 'block';

            // 清除定时器，停止检测
            clearInterval(intervalId);
        }
    }, 10);*/


    //自动点击"确认提交"和"登录按钮"打包成函数,这里应该不需要.btn_success.dialog_submit_btn排除属性为隐藏的情况(因为是在验证码识别后才会触发运行)
    /*function runInterval() {
        //识别完验证码后立即点击"确认提交"或"登录"
        var interval = setInterval(function() {//下面元素分别是天津订购页确认订单按钮+新平台pc版登录按钮+天津手机版登录按钮
            var element = document.querySelector('.btn_success.dialog_submit_btn, #(手动去掉变自动)login_Toindexbtn, uni-view.wrapper > uni-button');
            if (element) {
                element.click();
                clearInterval(interval);
            }
        }, 50);//这里设置1000的时候正常

        // 在运行完 runInterval 函数后，每隔 9 毫秒检测一次页面中是否提示"验证码无效",如果提示无效则模拟点击验证码图片重新识别验证码并重新点击"登录或者确认提交函数"
        let count = 0;
        const checkIntervalId = setInterval(() => {
            // 如果页面中检测到了 class="msg_error_txt" 这个元素并且文本内容为"验证码无效"（表示验证码填写错误）
            const msgErrorElement = document.querySelector('.msg_error_txt');
            if (msgErrorElement && msgErrorElement.textContent === "验证码无效") {
                count++;
                if (count <= 2) {
                    // 自动点击验证码图片触发验证码重新识别
                    document.querySelector('img#login_idCode').click();
                    clearInterval(checkIntervalId);

                    // 再次调用 runInterval 函数来自动点击登录按钮
                    setTimeout(function() {
                        runInterval();
                    }, 2000); // 延迟2秒后运行runInterval函数(延迟2秒是因为,识别完成需要2秒左右)

                } else {
                    clearInterval(checkIntervalId);
                }
            }
        }, 2010);//这里设置2010毫秒,是为了等前面识别完和登录完成



    }*/

    //天津点击确认提交后自动点击确定
    /*var interval = setInterval(function() {
        var element = document.querySelector('#layui-layer4 > div.layui-layer-btn.layui-layer-btn- > a');
        if (element && element.style.display !== 'none') {//排除属性为隐藏的情况(这里应该不需要排除,因为是在验证码识别后才会触发运行)
            element.click();
            clearInterval(interval);
        }
    }, 50);*/

 }//只在登陆页面运行

})();

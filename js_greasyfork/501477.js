// ==UserScript==
// @name         批量enhance放大
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Create a button to select files and simulate dragging them onto a webpage element
// @author       axing
// @match        https://novelai.net/image
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/501477/%E6%89%B9%E9%87%8Fenhance%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/501477/%E6%89%B9%E9%87%8Fenhance%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义默认值
    const DEFAULT_DELAY = 1000;//默认等待时间
    const DEFAULT_STRENGTH = 0.3;//默认重绘幅度
    const DEFAULT_SCALE_FACTOR = 1.5; // 默认尺寸大小倍率

    // 从油猴存储中获取用户设置的值，如果没有设置，则使用默认值
    let delay = GM_getValue('dragDelay', DEFAULT_DELAY);
    let strength = GM_getValue('dragStrength', DEFAULT_STRENGTH);
    let scaleFactor = GM_getValue('scaleFactor', DEFAULT_SCALE_FACTOR);

    // 创建按钮
    let button = document.createElement("button");
    button.innerHTML = "选择文件";
    button.style.position = "fixed";
    button.style.bottom = "10px";
    button.style.right = "10px";
    button.style.zIndex = "9999";
    document.body.appendChild(button);

    // 创建拖放区域
    let dropArea = document.createElement("div");
    dropArea.innerHTML = "拖动文件到此区域";
    dropArea.style.position = "fixed";
    dropArea.style.bottom = "50px";
    dropArea.style.right = "10px";
    dropArea.style.width = "100px";
    dropArea.style.height = "100px";
    dropArea.style.border = "2px dashed #ccc";
    dropArea.style.display = "flex";
    dropArea.style.alignItems = "center";
    dropArea.style.justifyContent = "center";
    dropArea.style.zIndex = "99999"; // 确保设置为最高层级
    dropArea.style.backgroundColor = "rgba(255, 255, 255, 0.8)"; // 可选：添加背景色以增强可见性
    document.body.appendChild(dropArea);

    // 阻止默认行为
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // 添加拖放事件
    dropArea.addEventListener("drop", handleDrop, false);

    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;

        handleFiles(files);
    }


    async function handleFiles(files) {
        let fileArray = Array.from(files);
        let fileNames = fileArray.map(file => file.name);
        console.log(fileNames);

        // 对每个文件执行两次拖放操作
        for (let file of files) {
            for (let i = 0; i < 2; i++) {
                await 文件拖入网页([file], i);
            }
            await 修改参数();
            await 生成大图();
            }
    }





    // 添加按钮点击事件
    button.addEventListener("click", async function() {
        // 创建文件输入框
        let fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.multiple = true;
        fileInput.style.display = "none";

        // 添加文件选择事件
        fileInput.addEventListener("change", async function() {
            let files = fileInput.files;
            if (files.length === 0) return;
            let fileNames = Array.from(files).map(file => file.name);
            console.log(fileNames);

            // 对每个文件执行两次拖放操作
            for (let file of files) {
                for (let i = 0; i < 2; i++) {
                    await 文件拖入网页([file], i);
                }
                await 修改参数();
                await 生成大图();
                console.log("完成_____________________");
            }
        });

        // 触发文件选择对话框
        fileInput.click();
    });

    // 定义 async 函数以模拟拖放文件到网页
    async function 文件拖入网页(files, index) {
        let targetElement = document.querySelector("#__next > div.sc-a2d0901c-0.gkbaSQ > div.sc-7a0ddb82-0.bcbLQo");
        if (!targetElement) {
            console.error("目标元素未找到!");
            return;
        }

        // 模拟拖放事件
        let dataTransfer = new DataTransfer();
        for (let file of files) {
            dataTransfer.items.add(file);
        }

        let dragEnterEvent = new DragEvent('dragenter', {
            bubbles: true,
            cancelable: true,
            dataTransfer: dataTransfer
        });

        let dragOverEvent = new DragEvent('dragover', {
            bubbles: true,
            cancelable: true,
            dataTransfer: dataTransfer
        });

        let dropEvent = new DragEvent('drop', {
            bubbles: true,
            cancelable: true,
            dataTransfer: dataTransfer
        });

        // 触发拖放事件
        targetElement.dispatchEvent(dragEnterEvent);
        targetElement.dispatchEvent(dragOverEvent);
        targetElement.dispatchEvent(dropEvent);

        console.log("文件已拖放到目标元素");

        // 延迟指定时间后执行下一步操作
        await new Promise(resolve => setTimeout(resolve, delay));

        let targetElement2;
        if (index == 0) {
            targetElement2 = document.querySelector("body > div:nth-child(21) > div > div.sc-b8ec890b-17.dBXrlS.modal.modal-large > div > div > div:nth-child(4) > div:nth-child(2) > button");
        } else {
            targetElement2 = document.querySelector("body > div:nth-child(21) > div > div.sc-b8ec890b-17.dBXrlS.modal.modal-large > div > div > div:nth-child(2) > div:nth-child(3) > button:nth-child(1)");
        }

        if (!targetElement2) {
            console.error("目标按钮未找到!");
            return;
        }

        console.log("点击按钮:");
        console.log(targetElement2);
        targetElement2.click();
    }
    async function 修改参数(){
        
        let targetElementXPath = '/html/body/div[1]/div[2]/div[4]/div[1]/div[3]/div[2]/div/div[5]/div/div[2]/div[1]/input';
        let Strength选择器 = document.evaluate(targetElementXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        let 尺寸X = '/html/body/div[1]/div[2]/div[4]/div[1]/div[3]/div[3]/div/div[2]/div[2]/input[1]';
        let 尺寸X选择器 = document.evaluate(尺寸X, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let 尺寸Y = '/html/body/div[1]/div[2]/div[4]/div[1]/div[3]/div[3]/div/div[2]/div[2]/input[2]';
        let 尺寸Y选择器 = document.evaluate(尺寸Y, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;


        console.log("Strength选择器",Strength选择器);
        await 修改值(Strength选择器,strength);
        await 修改值(尺寸X选择器,scaleFactor * 尺寸X选择器.value);
        await 修改值(尺寸Y选择器,scaleFactor * 尺寸Y选择器.value);
    };




    // 模拟点击元素
    async function 生成大图() {
        await new Promise(resolve => setTimeout(resolve, delay));
        // 记录已经点击过的元素
        const clickedElements = new Set();

        // 获取可点击的元素
        //const element = document.querySelector("#__next > div.sc-a2d0901c-0.gkbaSQ > div:nth-child(4) > div.sc-d09fe33a-0.isLCYD > div:nth-child(5) > button:not([disabled])");
        const xpath = "/html/body/div[1]/div[2]/div[4]/div[1]/div[5]/button[not(@disabled)]";
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        console.log(`Found clickable element`);
        console.log(`element`, element);

        // 如果组内存在点击过的元素，那么不执行
        if (element && !clickedElements.has(element)) {
            try {
                element.click(); // 点击
                console.log('已经点击'); // 打印日志
                clickedElements.add(element); // 添加元素到组内
                await waitForElementEnabled(element); // 等待延迟
            } catch (error) {
                console.error('Error clicking element:', error);
            }
        }
        clickedElements.clear(); // 清空已点击的元素集合
    }

    // 等待元素重新变回可点击状态
    async function waitForElementEnabled(element) {
        return new Promise(resolve => {
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (!element.disabled) {
                            observer.disconnect();
                            resolve();
                        }
                    }
                }
            });
            observer.observe(element, { attributes: true });
        });
    }

    // 辅助函数：延迟执行
    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }















    async function 修改值(textField,新值){
        await new Promise(resolve => setTimeout(resolve, delay));
        let lastValue = textField.value;
        textField.value= 新值;
        let event = new Event('input', { bubbles: true })
        let tracker = textField._valueTracker
        if(tracker) {
            tracker.setValue(lastValue)
        }
        textField.dispatchEvent(event)
    };
    // 添加油猴选项页面链接
    GM_registerMenuCommand('设置拖动延迟', function() {
        let newDelay = prompt('请输入拖动延迟时间（毫秒）：', delay);
        if (newDelay !== null && !isNaN(newDelay)) {
            delay = parseInt(newDelay, 10);
            GM_setValue('dragDelay', delay);
        }
    });

    GM_registerMenuCommand('设置重绘尺度', function() {
        let newStrength = prompt('重绘大小(0-1.0的小数)：', strength);
        if (newStrength !== null && !isNaN(newStrength)) {
            strength = parseFloat(newStrength); // 使用 parseFloat 处理小数
            GM_setValue('dragStrength', strength);
        }
    });

    GM_registerMenuCommand('设置尺寸大小倍率', function() {
        let newScaleFactor = prompt('请输入尺寸大小倍率（如 1.0）：', scaleFactor);
        if (newScaleFactor !== null && !isNaN(newScaleFactor)) {
            scaleFactor = parseFloat(newScaleFactor); // 使用 parseFloat 处理小数
            GM_setValue('scaleFactor', scaleFactor);
        }
    });
})();

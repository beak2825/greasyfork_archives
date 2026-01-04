// ==UserScript==
// @name         自动跑csv
// @namespace    http://tampermonkey.net/
// @version      2024-04-11
// @description  try to take over the world!
// @author       You
// @match        https://novelai.net/image
// @icon         https://www.google.com/s2/favicons?sz=64&domain=novelai.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492014/%E8%87%AA%E5%8A%A8%E8%B7%91csv.user.js
// @updateURL https://update.greasyfork.org/scripts/492014/%E8%87%AA%E5%8A%A8%E8%B7%91csv.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局配置
    const config = {
        seed: Math.floor(Math.random() * 1000000), // 设置随机种子
        delay: 10, // 输入延迟时间（毫秒）
        运行模式: 2, //1为每个种子运行X次后，跳到下一个prompt，2为每次跳到下一个prompt，然后再换种子
        是否启用修改种子:1 ,//1为启用
        replacementMap: {
            "XXXXX": ",", // 替换映射表
            // 可以添加更多的替换对
        }


    };

    let isRunning = false; // 标记脚本是否正在运行
    let shouldStop = false; // 标记是否应该停止脚本

    // 创建按钮
    const goButton = createButton('跑文本框', handleClick);
    document.body.appendChild(goButton);

    // 创建一个包含文本输入框和按钮的容器
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '70px';
    container.style.right = '300px';
    document.body.appendChild(container);

    var input3 = document.createElement('textarea'); // 使用textarea元素，支持多行输入
    input3.placeholder = '在此输入随机种子';
    input3.style.width = '50px'; // 调整输入框宽度
    input3.style.height = '100px'; // 调整输入框高度
    container.appendChild(input3);
    input3.value = Math.floor(Math.random() * 1000000);




    var input2 = document.createElement('textarea'); // 使用textarea元素，支持多行输入
    input2.placeholder = '在此输入运行次数';
    input2.style.width = '20px'; // 调整输入框宽度
    input2.style.height = '100px'; // 调整输入框高度
    container.appendChild(input2);
    input2.value = 4;

    var input = document.createElement('textarea'); // 使用textarea元素，支持多行输入
    input.placeholder = '在此输入文本';
    input.style.width = '200px'; // 调整输入框宽度
    input.style.height = '100px'; // 调整输入框高度
    container.appendChild(input);



    // 创建run按钮
    const runButton = document.createElement('button');
    runButton.textContent = 'run';
    runButton.style.position = "fixed";
    runButton.style.bottom = "50px";
    runButton.style.right = "150px";
    runButton.style.zIndex = "9999";
    runButton.style.backgroundColor = "#007bff";
    runButton.style.color = "#ffffff";
    runButton.style.border = "none";
    runButton.style.borderRadius = "5px";
    runButton.style.padding = "10px 20px";
    runButton.style.cursor = "pointer";
    document.body.appendChild(runButton);

    // run按钮点击事件
    runButton.addEventListener('click', async function() {
        runButton.disabled = true; // 禁用run按钮

        //document.querySelectorAll('.kXFbYD').click();//重置随机种子

        // 循环点击.eAZElA选择器
        for (let i = 0; i < input2.value.trim(); i++) {
            await clickElements();
            console.log('测试循环:', i);
        }

        runButton.disabled = false; // 启用run按钮
    });

    // 创建按钮的工具函数
    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.position = "fixed";
        button.style.bottom = "100px";
        button.style.right = "150px";
        button.style.zIndex = "9999";
        button.style.backgroundColor = "#007bff";
        button.style.color = "#ffffff";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.padding = "10px 20px";
        button.style.cursor = "pointer";
        button.addEventListener('click', onClick);
        return button;
    }


    // 按钮点击事件处理函数
    async function handleClick() {
        if (isRunning) {
            shouldStop = true; // 设置停止标记
            return;
        }

        isRunning = true; // 设置运行标记
        goButton.textContent = '正在运行中'; // 改变按钮文本


        config.seed = Math.floor(Math.random() * 1000000)//设置新的随机种子
        var text = input.value.trim();
        if (text !== '') {
            var dataArray = text.split('\n'); // 使用换行符分割文本为数组
            console.log('转换后的数组:', dataArray);
            // 这里可以对数组进行任何你想要的操作
        } else {
            console.log('文本框不能为空');
            return
        }
        if (config.运行模式 == 1){
            修改prompt(dataArray);
        }else{
            修改prompt2(dataArray);
        }
        

        resetScriptState(); // 重置脚本状态

    }

    async function 修改种子(seedField,y){
        if(config.是否启用修改种子 !== 1){
            return
        }
        if (seedField.length >= 3) {
            let lastValue = seedField[2].value;
            seedField[2].value= parseInt(input3.value.trim()) + y ;
            let event = new Event('input', { bubbles: true })
            let tracker = seedField[2]._valueTracker
            if(tracker) {
                tracker.setValue(lastValue)
            }
            seedField[2].dispatchEvent(event)
        }
    }

    async function 修改prompt(dataArray){

        const textField = document.querySelector('.kyIdtk');
        console.log(`进入设置正式环节`, dataArray)
            for (let i = 0; i < dataArray.length ; i++) {
                for(let i2 = 0;i2 < input2.value.trim() ; i2++){
                    if (shouldStop) break; //
                    await 修改种子(document.querySelectorAll('.cuolnK'),i2);
                    const data = dataArray[i].replace(new RegExp(Object.keys(config.replacementMap).join('|'), "g"), match => config.replacementMap[match]);


                    let lastValue = textField.value;
                    textField.value= data;
                    let event = new Event('input', { bubbles: true })
                    let tracker = textField._valueTracker
                    if(tracker) {
                        tracker.setValue(lastValue)
                    }
                    textField.dispatchEvent(event)

                    //await simulateDelete(textField);
                    //await simulateInput(textField, data);
                    await clickElements();
                }
            }
    }

    async function 修改prompt2(dataArray){

        const textField = document.querySelector('.kyIdtk');
        console.log(`进入设置正式环节`, dataArray)
        for(let i2 = 0;i2 < input2.value.trim() ; i2++){
            await 修改种子(document.querySelectorAll('.cuolnK'),i2);
            for (let i = 0; i < dataArray.length ; i++) {

                if (shouldStop) break; //

                const data = dataArray[i].replace(new RegExp(Object.keys(config.replacementMap).join('|'), "g"), match => config.replacementMap[match]);


                let lastValue = textField.value;
                textField.value= data;
                let event = new Event('input', { bubbles: true })
                let tracker = textField._valueTracker
                if(tracker) {
                    tracker.setValue(lastValue)
                }
                textField.dispatchEvent(event)

                //await simulateDelete(textField);
                //await simulateInput(textField, data);
                await clickElements();
            }
        }
    }







    // 模拟点击元素
    async function clickElements() {
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

    // 重置脚本状态
    function resetScriptState() {
        isRunning = false;
        shouldStop = false;
        goButton.textContent = '跑文本框';
    }


    // 监听文件下载事件
    window.addEventListener('load', function() {
        var downloadLinks = document.querySelectorAll('a[download]');
        downloadLinks.forEach(function(link) {
            // 获取原始文件名
            var originalFileName = link.getAttribute('download');
            // 修改文件名为您想要的名称
            var newFileName = "new_filename.extension"; // 修改成您想要的名称
            // 设置新的文件名
            link.setAttribute('download', newFileName);
        });
    });




})();
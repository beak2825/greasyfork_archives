// ==UserScript==
// @name         sophia 考试快速选题
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  若页面存在 <a id="submitMyMilestone" ...>Submit Milestone</a> 按钮，在页面左下角添加 a、b、c、d 四个红底按钮，点击按钮后勾选对应的 input 元素并为 input 和 label 添加 checked 类，同时处理单选逻辑，通过点击答案选项让 HTML 自动激活保存按钮；在按钮 d 后面添加“手动保存”按钮，点击 a、b、c、d 按钮完成操作后等待 250 毫秒自动点击保存按钮及其父级 div；勾选答案时点击指定 div，点击 a、b、c、d 后对 <div class="question" tabindex="0"> 做两次点击事件。新增键盘按键 a,b,c,d 快捷选择对应选项。按钮移至左下角。
// @author       3588
// @match        https://app.sophia.org/spcc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526244/sophia%20%E8%80%83%E8%AF%95%E5%BF%AB%E9%80%9F%E9%80%89%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/526244/sophia%20%E8%80%83%E8%AF%95%E5%BF%AB%E9%80%9F%E9%80%89%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 检查页面是否存在指定按钮
    const submitMilestoneButton = document.getElementById('submitMyMilestone');
    if (!submitMilestoneButton) {
        console.log('Sophia Script: "Submit Milestone" button not found. Script will not run.');
        return; // 如果不存在指定按钮，脚本不执行后续操作
    }
    console.log('Sophia Script: "Submit Milestone" button found. Initializing script.');

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    // 修改这里：将按钮定位到左下角
    buttonContainer.style.bottom = '10px'; // 原来是 top
    buttonContainer.style.left = '10px';
    buttonContainer.style.zIndex = '9999'; // 确保按钮在最上层

    // 定义按钮文本和对应的 input ID 后缀
    const buttonDetails = [
        { text: 'a', key: 'a', inputIndex: 0 },
        { text: 'b', key: 'b', inputIndex: 1 },
        { text: 'c', key: 'c', inputIndex: 2 },
        { text: 'd', key: 'd', inputIndex: 3 }
    ];

    const choiceButtons = {}; // 用于存储按钮引用，方便键盘事件调用

    buttonDetails.forEach(detail => {
        const button = document.createElement('button');
        button.textContent = detail.text;
        button.id = `sophia_quick_select_${detail.text}`; // 给按钮添加ID，方便键盘事件查找
        // 设置按钮字体大小为 50px
        button.style.fontSize = '50px';
        button.style.padding = '10px 20px'; // 增加内边距，使按钮更大更易点击
        button.style.marginRight = '10px'; // 增加按钮间距
        button.style.backgroundColor = 'red'; // 设置按钮背景为红色
        button.style.color = 'white'; // 设置文字颜色为白色，提高对比度
        button.style.border = 'none'; // 移除边框
        button.style.borderRadius = '5px'; // 添加圆角
        button.style.cursor = 'pointer'; // 设置鼠标指针为手型

        button.addEventListener('click', function () {
            console.log(`Sophia Script: Button "${detail.text}" clicked.`);
            const inputId = `answer_cb_${detail.inputIndex}`;
            const inputElement = document.getElementById(inputId);

            if (inputElement) {
                // 取消所有选项的勾选和 checked 类
                const allInputs = document.querySelectorAll('input[name="answer_cb"]');
                allInputs.forEach(input => {
                    if (input.id !== inputId) {
                        input.checked = false;
                        input.classList.remove('checked');
                        const label = document.querySelector(`label[for="${input.id}"]`);
                        if (label) {
                            label.classList.remove('checked');
                        }
                    }
                });

                // 模拟点击当前选项来让页面自动处理激活逻辑
                // 这个 click() 很重要，它会触发 Sophia 页面的内部逻辑来识别答案已被选中
                try {
                    console.log(`Sophia Script: Clicking input element: ${inputId}`);
                    inputElement.click();
                } catch (error) {
                    console.error('Sophia Script: Error clicking input element:', error);
                }

                // 再次确保勾选当前选项并添加 checked 类 (Sophia的click可能不会立即更新checked状态)
                inputElement.checked = true;
                inputElement.classList.add('checked');
                const labelElement = document.querySelector(`label[for="${inputId}"]`);
                if (labelElement) {
                    labelElement.classList.add('checked');
                }
                console.log(`Sophia Script: Input ${inputId} and its label should now be checked.`);


                // 假设要点击的 div 的 XPath，你需要根据实际情况修改
                // 注意: XPath 非常脆弱，如果页面结构改变，这里可能会失效
                // 建议使用更可靠的选择器，如 ID 或稳定的 class 组合
                const divXpath = '/html/body/div[3]/div[2]/div[2]/div[1]/div[2]/div/div/div/div[3]/div[2]/div[3]';
                try {
                    const divResult = document.evaluate(divXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    const targetDiv = divResult.singleNodeValue;
                    if (targetDiv) {
                        console.log('Sophia Script: Found targetDiv by XPath, attempting click.');
                        targetDiv.click();
                    } else {
                        console.warn('Sophia Script: Did not find targetDiv by XPath:', divXpath);
                    }
                } catch (error) {
                    console.error('Sophia Script: Error finding or clicking targetDiv by XPath:', error);
                }


                // 对 <div class="question" tabindex="0"> 做两次点击事件
                const questionDiv = document.querySelector('div.question[tabindex="0"]');
                if (questionDiv) {
                    console.log('Sophia Script: Found questionDiv, attempting two clicks.');
                    for (let j = 0; j < 2; j++) {
                        try {
                            questionDiv.click();
                        } catch (error) {
                            console.error('Sophia Script: Error clicking <div class="question" tabindex="0">:', error);
                        }
                    }
                } else {
                    console.warn('Sophia Script: Did not find <div class="question" tabindex="0">.');
                }

                // 等待 250 毫秒后自动点击保存按钮及其父级 div
                setTimeout(() => {
                    // 通过 XPath 查找保存按钮和其父级 div
                    // 注意: XPath 非常脆弱
                    const saveButtonXPath = '/html/body/div[3]/div[2]/div[2]/div[1]/div[2]/div/div/div/div[3]/div[2]/div[1]/button';
                    let saveButton;
                    try {
                        const saveResult = document.evaluate(saveButtonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                        saveButton = saveResult.singleNodeValue;
                    } catch (error) {
                        console.error('Sophia Script: Error evaluating XPath for save button:', error);
                    }

                    const submitDiv = saveButton ? saveButton.parentNode : null;

                    if (saveButton && submitDiv) {
                        console.log('Sophia Script: Found save button and its parent div. Attempting clicks.');
                        try {
                            // 点击保存按钮
                            saveButton.click();
                            console.log('Sophia Script: Clicked save button.');

                            // 点击保存按钮的父级 div
                            // submitDiv.click(); // 通常点击按钮本身就足够了，父级div的点击可能不需要或引起意外行为
                            // console.log('Sophia Script: Clicked parent div of save button.');
                        } catch (error) {
                            console.error('Sophia Script: Error clicking save button or its parent div:', error);
                        }
                    } else {
                        if (!saveButton) console.warn('Sophia Script: Did not find save button using XPath:', saveButtonXPath);
                        if (saveButton && !submitDiv) console.warn('Sophia Script: Found save button, but it has no parentNode.');
                    }
                }, 250);
            } else {
                console.warn(`Sophia Script: Input element with ID "${inputId}" not found.`);
            }
        });
        buttonContainer.appendChild(button);
        choiceButtons[detail.key] = button; // 存储按钮引用
    });

    // 添加“手动保存”按钮
    const saveCustomButton = document.createElement('button');
    saveCustomButton.textContent = '手动保存';
    saveCustomButton.style.fontSize = '50px';
    saveCustomButton.style.padding = '10px 20px';
    saveCustomButton.style.marginRight = '5px';
    saveCustomButton.style.backgroundColor = 'green'; // 设置按钮背景为绿色
    saveCustomButton.style.color = 'white';
    saveCustomButton.style.border = 'none';
    saveCustomButton.style.borderRadius = '5px';
    saveCustomButton.style.cursor = 'pointer';

    saveCustomButton.addEventListener('click', function () {
        console.log('Sophia Script: "手动保存" button clicked.');
        // 通过 XPath 查找保存按钮和其父级 div
        const saveButtonXPath = '/html/body/div[3]/div[2]/div[2]/div[1]/div[2]/div/div/div/div[3]/div[2]/div[1]/button';
        let saveButton;
        try {
            const saveResult = document.evaluate(saveButtonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            saveButton = saveResult.singleNodeValue;
        } catch (error) {
            console.error('Sophia Script: Error evaluating XPath for manual save button:', error);
        }
        const submitDiv = saveButton ? saveButton.parentNode : null;

        if (saveButton && submitDiv) {
            console.log('Sophia Script: Manual save - Found save button and its parent div. Attempting clicks.');
            try {
                // 点击保存按钮
                saveButton.click();
                console.log('Sophia Script: Manual save - Clicked save button.');

                // 点击保存按钮的父级 div
                // submitDiv.click(); // 如上，可能不需要
                // console.log('Sophia Script: Manual save - Clicked parent div of save button.');
            } catch (error) {
                console.error('Sophia Script: Manual save - Error clicking elements:', error);
            }
        } else {
            if (!saveButton) console.warn('Sophia Script: Manual save - Did not find save button using XPath:', saveButtonXPath);
            if (saveButton && !submitDiv) console.warn('Sophia Script: Manual save - Found save button, but it has no parentNode.');
        }
    });
    buttonContainer.appendChild(saveCustomButton);

    // 将按钮容器添加到页面
    document.body.appendChild(buttonContainer);
    console.log('Sophia Script: Buttons added to page.');

    // 添加键盘快捷键监听
    document.addEventListener('keydown', function(event) {
        // 防止在输入框或文本区域中触发快捷键
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
            return;
        }

        const key = event.key.toLowerCase(); // 获取按下的键，并转换为小写
        if (choiceButtons[key]) {
            console.log(`Sophia Script: Keyboard shortcut "${key}" pressed.`);
            event.preventDefault(); // 阻止可能的默认浏览器行为 (例如，'a' 可能用于快速查找)
            choiceButtons[key].click(); // 模拟点击对应的按钮
        }
    });
    console.log('Sophia Script: Keyboard listener added.');

})();

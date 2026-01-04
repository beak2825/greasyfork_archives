// ==UserScript==
/* jshint esversion: 8 */
// @license MIT
// @name         MAERSK
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  my demo!
// @author       Fish
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @match        https://www.maersk.com.cn/book/
// @icon         https://www.google.com/s2/favicons?domain=maersk.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538989/MAERSK.user.js
// @updateURL https://update.greasyfork.org/scripts/538989/MAERSK.meta.js
// ==/UserScript==

(function() {

    //输入框配置
    //起运港
    const originName = "nansha";
    //目的港
    const destinationName = "mombasa";
    //货物名
    const commodityName = "Garments, apparel, new";
    //柜型
    const cntrType = "40 Dry High";
    //重量
    const weightNum = "20000";
    //柜量
    const cntrNum = "3";
    //航次离港日期
    const dateStr = "10 Jun";
    //是否启动提交订舱功能（true为提交，false为不提交，注意：真实下单，谨慎开启提交订舱）
    const isSubmit = false;

    // 延迟配置
    const CONFIG = {
        maxRetries: 3000, // 最大重试次数
        retryDelay: 5000, // 重试延迟
        pageLoadDelay: 20000, // 页面加载等待时间（必须20s以上）
        elementCheckDelay: 2000 // 元素检查延迟
    };

    var isStart = true;
    if(isStart){
        setTimeout(() => {
            inputInformation();
        },5000);
    }
    document.addEventListener('click', function(event) {
        // 检查点击的元素是否包含所有指定类名
        if (event.target.classList.contains("booking__container--form--submit-btn")) {
            event.preventDefault();
            setTimeout(() => {
                init();
            },5000);
        }
    });
    // 工具函数：等待指定时间
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 工具函数：在shadow DOM中查找元素
    const findShadowElement = (root, selectors) => {
        let element = root;
        for (const selector of selectors) {
            if (!element) return null;
            if (element.shadowRoot) {
                element = element.shadowRoot.querySelector(selector);
            } else {
                element = element.querySelector(selector);
            }
        }
        return element;
    };

    // 工具函数：输入并选择选项
    const inputAndSelect = async (root, selectors, text, optionSelector, delay = 2000) => {
        try {
            // 查找输入框
            const inputElement = findShadowElement(root, selectors);
            if (!inputElement) {
                console.error("元素未找到: ",selectors.join(' > '));
                return;
            }

            // 输入内容
            await simulateManualInput(inputElement, text);
            await wait(delay);

            // 查找并点击选项
            const option = findShadowElement(root, optionSelector);
            if (option) {
                option.click();
                await wait(1000);
            } else {
                console.error("选项未找到: ",optionSelector.join(' > '));
            }
        } catch (error) {
            console.error('输入并选择过程中出错:', error);
        }
    };


    async function inputInformation() {
        try {
            // 1. 输入出发地
            await inputAndSelect(
                document,
                ["#mdsorigindestination", "#origin", "#mc-input-origin"],
                originName,
                ["#mdsorigindestination", "#origin", "#listbox > mc-option", "mc-button"]
            );

            // 2. 输入目的地
            await inputAndSelect(
                document,
                ["#mdsorigindestination", "#destination", "#mc-input-destination"],
                destinationName,
                ["#mdsorigindestination", "#destination", "#listbox > mc-option", "mc-button"]
            );

            // 3. 输入商品
            await inputAndSelect(
                document,
                ["#mdsCommodity > mc-c-commodity", "input"],
                commodityName,
                ["#mdsCommodity > mc-c-commodity", "#listbox > mc-option", "mc-button"]
            );

            // 4. 输入集装箱类型
            await inputAndSelect(
                document,
                [
                    "#mdscontainerselect > mc-c-container-select",
                    "div > mc-c-container-selection-input",
                    "div > div.container__row > mc-typeahead",
                    "input"
                ],
                cntrType,
                [
                    "#mdscontainerselect > mc-c-container-select",
                    "div > mc-c-container-selection-input",
                    "div > div.container__row > mc-typeahead",
                    "#listbox > mc-option",
                    "mc-button"
                ]
            );

            // 5. 输入重量
            const weightInput = findShadowElement(
                document,
                [
                    "#mdscontainerselect > mc-c-container-select",
                    "div > mc-c-container-selection-input",
                    "#weight",
                    "#mc-input-weight"
                ]
            );
            if (weightInput) {
                await simulateManualInput(weightInput, weightNum);
                await wait(1000);
            } else {
                console.error("重量输入框未找到");
            }

            // 6. 输入集装箱数量
            const countInput = findShadowElement(
                document,
                [
                    "#mdscontainerselect > mc-c-container-select",
                    "div > mc-c-container-selection-input",
                    "div > div.container__row > mc-number-stepper",
                    "input"
                ]
            );
            if (countInput) {
                await simulateManualInput(countInput, cntrNum);
                await wait(1000);
            } else {
                console.error("集装箱数量输入框未找到");
            }

            // 7. 选择价格所有者
            const priceRadio = findShadowElement(
                document,
                ["#priceOwner", "label > input[type=radio]"]
            );
            if (priceRadio) {
                priceRadio.click();
                await wait(CONFIG.elementCheckDelay);
            } else {
                console.error("价格选项未找到");
            }

            // 8. 选择最早出发日期
            const datePicker = document.querySelector("#earliestDepartureDatePicker > div > div > a");
            if (datePicker) {
                datePicker.click();
                await wait(CONFIG.elementCheckDelay);
            } else {
                console.error("日期选择器未找到");
            }

            // 9. 点击继续按钮
            const continueButton = findShadowElement(
                document,
                ["#od3cpContinueButton", "div > button"]
            );
            if (continueButton) {
                continueButton.click();
                console.log("表单提交成功");
            } else {
                console.error("继续按钮未找到");
            }

        } catch (error) {
            console.error("表单输入过程中出错:", error);
        }
    }
    async function simulateManualInput(input, text) {
        if (!input || input.disabled || input.readOnly) {
            console.warn("无效的输入元素");
            return;
        }
        // 聚焦输入框
        input.focus();

        // 清空现有内容（模拟用户全选删除）
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 200));
        const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        // 逐个字符输入
        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            // 1. 键盘按下
            input.dispatchEvent(new KeyboardEvent("keydown", {
                key: char,
                bubbles: true,
                composed: true
            }));

            // 2. 实际插入字符
            setValue.call(input, input.value + char);

            // 3. 输入事件（完整参数）
            input.dispatchEvent(new InputEvent("input", {
                inputType: "insertText",
                data: char,
                bubbles: true,
                composed: true,
                view: window
            }));

            // 4. 键盘释放
            input.dispatchEvent(new KeyboardEvent("keyup", {
                key: char,
                bubbles: true
            }));

            // 随机延迟（模拟人类输入速度）
            await randomDelay();
        }

        // 最后触发change事件（模拟用户完成输入）
        input.dispatchEvent(new Event("change", { bubbles: true }));
        input.dispatchEvent(new Event('blur', { bubbles: true })); // 关键！
        // 等待可能存在的异步校验
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("输入完成:", input.value);
    }
    // 在循环外部定义延迟函数
    async function randomDelay(min = 50, max = 150) {
        return new Promise(resolve => {
            setTimeout(resolve, min + Math.random() * (max - min));});
    }

    // 工具函数：点击元素（支持 shadow DOM）
    const clickElement = async (selector, shadowPath = [], waitTime = 1000) => {
        try {
            let element = document.querySelector(selector);

            // 遍历 shadow DOM 路径
            for (const shadowSelector of shadowPath) {
                if (!element || !element.shadowRoot) {
                    throw new Error("元素未找到或没有 shadowRoot: ",shadowSelector);
                }
                element = element.shadowRoot.querySelector(shadowSelector);
            }

            if (element) {
                element.click();
                console.log("成功点击:", selector,shadowPath.length ? ' -> ' + shadowPath.join(' -> ') : '');
                await wait(waitTime);
                return true;
            }
            throw new Error("元素未找到:",selector,shadowPath.length ? ' -> ' + shadowPath.join(' -> ') : '');
        } catch (error) {
            console.error('点击元素时出错:', error);
            return false;
        }
    };

    async function init(retryCount = 0) {
        try {
            const currentUrl = window.location.href;
            // 等待页面加载
            await wait(CONFIG.pageLoadDelay);
            if (currentUrl === "https://www.maersk.com.cn/book/sailings") {
                await sailings();
            } else if (currentUrl === "https://www.maersk.com.cn/book/") {
                const btn = document.querySelector('.booking__container--form--submit-btn');
                if (btn) {
                    console.log("找到继续按钮，准备点击");

                    // 添加一次性事件监听器
                    const clickHandler = async () => {
                        console.log("按钮点击事件触发");
                        await wait(CONFIG.retryDelay);
                        await init();
                    };

                    btn.addEventListener('click', clickHandler, { once: true });
                    btn.click();
                } else {
                    console.warn("未找到继续按钮");
                    if (retryCount < CONFIG.maxRetries) {
                        await wait(CONFIG.retryDelay);
                        await init(retryCount + 1);
                    } else {
                        console.error("达到最大重试次数，停止尝试");
                    }
                }
            } else {
                console.warn("当前不在预订流程页面:", currentUrl);
            }
        } catch (error) {
            console.error("初始化过程中出错:", error);
        } finally {
            isStart = false;
        }
    }
    async function sailings(retryCount = 0) {
        try {
            console.log("开始选择航次...");
            // 等待页面加载完成
            await wait(4000);
            const cards = document.querySelectorAll('[class="sailings__card"]');
            if (!cards.length) {
                throw new Error("未找到航次卡片");
            }
            console.log("找到" ,cards.length," 个航次卡片");
            let dateFound = false;
            for (const card of cards) {
                const dateElement = card.querySelector('h3');
                if (!dateElement) continue;

                const dateText = dateElement.textContent.trim();
                console.log("检查航次日期:", dateText);

                if (dateText.includes(dateStr)) {
                    console.log("找到匹配日期的航次:", dateText);

                    const btn = card.querySelector('[class="button--block"]');
                    if (btn) {
                        console.log("点击选择航次按钮");
                        btn.click();
                        dateFound = true;

                        // 等待操作完成
                        await wait(5000);
                        await additional();
                        break;
                    } else {
                        console.warn("找到匹配日期的卡片，但未找到选择按钮");
                    }
                }
            }
            if (!dateFound) {
                console.warn("未找到匹配日期的航次，尝试返回上一步");
                // 返回上一步
                const backSuccess = await clickElement(
                    "#sailings > div.mds-step-indicator.is-framed.is-mds > mc-step-indicator > mc-step-indicator-item:nth-child(1) > span > div",
                    [],
                    10000
                );
                if (backSuccess) {
                    console.log("成功返回上一步");
                    // 点击继续按钮
                    const continueSuccess = await clickElement(
                        "#od3cpContinueButton",
                        ["div > button"]
                    );
                    if (continueSuccess) {
                        console.log("已点击继续按钮，将在5秒后重试选择航次");
                        await wait(5000);
                        if (retryCount < CONFIG.maxRetries) {
                            await sailings(retryCount + 1);
                        } else {
                            console.error("达到最大重试次数，停止选择航次");
                        }
                    }
                }
            }
        } catch (error) {
            console.error("选择航次过程中出错:", error);
        }
    }
    async function additional() {
        try {
            console.log("开始执行附加操作...");
            // 1. 点击主按钮
            await clickElement("#main > main > section > mc-button", ["div > button"],5000);
            // 2. 点击日期选择器
            await clickElement("#containerPickupDatePicker > article > section", [], 500);
            // 3. 点击日历中的"今天"按钮
            await clickElement(
                "#main > main > section > form > section:nth-child(1) > section > div.container-haulage-settings > article > section.container-haulage-settings--main-dateRef > mc-modal > div > div.pickup-details-body--calendar > mc-calendar",
                ["div > div.body > div.body-days > mc-button.today.with-indicator", "div > button"],
                500
            );
            // 4. 点击模态框中的按钮
            await clickElement(
                "#main > main > section > form > section:nth-child(1) > section > div.container-haulage-settings > article > section.container-haulage-settings--main-dateRef > mc-modal > mc-button:nth-child(2)",
                ["div > button"],
                500
            );
            // 5. 再次点击主按钮
            await clickElement("#main > main > section > mc-button", ["div > button"], 3000);
            // 6. 勾选条款
            await clickElement("#terms", ["label > div"]);
            console.log("所有附加操作已完成");
            // 7. 提交订舱
            if(isSubmit){
                await clickElement("#main > main > section > form > mc-button", ["div > button > div > span > slot.label"]);
            }
        } catch (error) {
            console.error("执行附加操作时出错:", error);
        }
    }
})();
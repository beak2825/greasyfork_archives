// ==UserScript==
/* jshint esversion: 8 */
// @license MIT
// @name         MAERSK API
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  my demo! (优化版本)
// @author       Fish
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @match        https://www.maersk.com.cn/book/
// @icon         https://www.google.com/s2/favicons?domain=maersk.com.cn
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/539839/MAERSK%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/539839/MAERSK%20API.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取页面上下文中的 window 对象
    const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // 配置变量
    let originName = "nansha";
    let destinationName = "mombasa";
    let commodityName = "Garments, apparel, new";
    let cntrType = "40 Dry High";
    let weightNum = "20000";
    let cntrNum = "1";
    let dateStr = "10 Jun";
    let monitorId = null;
    //是否自动订舱（否则获取价格回调修改）
    let autoBooking = true;
    //每个多少秒执行自动订舱
    let intervalTime = 1;
    const isSubmit = true;

    // 延迟配置
    const CONFIG = {
        maxRetries: 5,
        retryDelay: 5000,
        pageLoadDelay: 20000,
        elementCheckDelay: 2000,
        API_HOST: 'http://dlv.ylt56.com:8892',
        token:'16dc7aa3890301a92d0654c205a70db7',
    };
    let retries = 0;

    let isStart = true;

    // 工具函数：等待指定时间
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 工具函数：安全查询选择器
    const safeQuerySelector = (selector) => {
        try {
            return pageWindow.document.querySelector(selector);
        } catch (e) {
            console.error(`无效的选择器: ${selector}`, e);
            return null;
        }
    };

    // 工具函数：在shadow DOM中查找元素（修复选择器问题）
    const findShadowElement = (root, selectors) => {
        if (!root) return null;

        let element = root;
        for (const selector of selectors) {
            if (!element) return null;

            try {
                if (element.shadowRoot) {
                    element = element.shadowRoot.querySelector(selector);
                } else {
                    element = element.querySelector(selector);
                }
            } catch (e) {
                console.error(`无效的选择器: ${selector}`, e);
                return null;
            }

            if (!element) {
                console.warn(`未找到元素: ${selector}`);
                return null;
            }
        }
        return element;
    };

    // 工具函数：输入并选择选项（简化选择器路径）
    const inputAndSelect = async (selectors, text, optionSelectors, delay = 2000) => {
        try {
            // 查找输入框
            const inputElement = findShadowElement(pageWindow.document, selectors);
            if (!inputElement) {
                console.error("输入元素未找到: ", selectors.join(' > '));
                return false;
            }

            console.log(`准备输入: ${text}`);
            await simulateManualInput(inputElement, text);
            await wait(delay);

            // 查找并点击选项
            const option = findShadowElement(pageWindow.document, optionSelectors);
            if (option) {
                console.log("点击选项");
                option.click();
                await wait(1000);
                return true;
            }

            console.error("选项未找到: ", optionSelectors.join(' > '));
            return false;
        } catch (error) {
            console.error('输入并选择过程中出错:', error);
            return false;
        }
    };

    // 在页面上下文中模拟手动输入
    async function simulateManualInput(input, text) {
        if (!input || input.disabled || input.readOnly) {
            console.warn("无效的输入元素");
            return;
        }

        // 聚焦输入框
        input.focus();
        await wait(200);

        // 清空现有内容
        input.value = "";
        const inputEvent = new pageWindow.Event("input", { bubbles: true });
        input.dispatchEvent(inputEvent);

        await wait(200);

        // 逐个字符输入
        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            // 键盘按下
            const keydownEvent = new pageWindow.KeyboardEvent("keydown", {
                key: char,
                bubbles: true,
                composed: true
            });
            input.dispatchEvent(keydownEvent);

            // 更新值
            input.value += char;

            // 输入事件
            const inputCharEvent = new pageWindow.InputEvent("input", {
                inputType: "insertText",
                data: char,
                bubbles: true,
                composed: true,
                view: pageWindow
            });
            input.dispatchEvent(inputCharEvent);

            // 键盘释放
            const keyupEvent = new pageWindow.KeyboardEvent("keyup", {
                key: char,
                bubbles: true
            });
            input.dispatchEvent(keyupEvent);

            // 随机延迟（模拟人类输入速度）
            await wait(50 + Math.random() * 100);
        }

        // 触发change事件
        const changeEvent = new pageWindow.Event("change", { bubbles: true });
        input.dispatchEvent(changeEvent);

        // 触发blur事件
        const blurEvent = new pageWindow.Event('blur', { bubbles: true });
        input.dispatchEvent(blurEvent);

        await wait(500);
        console.log("输入完成:", text);
    }

    const clickElement = async (selector, shadowPath = [], waitTime = 1000) => {
        try {
            let element = pageWindow.document.querySelector(selector);

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

    // 初始化函数
    if (isStart) {
        getMaersk();
    }

    async function getMaersk() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${CONFIG.API_HOST}/foreign/monitor/maersk`,
            headers: {
                "Authorization": CONFIG.token
            },
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.code == 200) {
                        const maersk = result.maersk;
                        retries = 0;
                        originName = maersk.outsetName;
                        destinationName = maersk.destName;
                        commodityName = maersk.goodsName;
                        cntrType = maersk.cntrTypeMaersk;
                        dateStr = maersk.dateStr;
                        monitorId = maersk.monitorId;
                        autoBooking = maersk.autoBooking;
                        intervalTime = maersk.intervalTime;
                        if(autoBooking){
                            CONFIG.maxRetries = 20;
                        }else{
                            CONFIG.maxRetries = 5;
                        }
                        setTimeout(() => {
                            inputInformation();
                        }, autoBooking?5000:intervalTime*1000);
                    } else {
                        console.log('获取数据失败:', result.message);
                        wait(1000*60*60).then(getMaersk);
                    }
                } catch (e) {
                    console.log('解析数据失败:', e);
                    console.error("错误详情:", e.stack);
                    console.log("响应内容:", response.responseText);
                }
            },
            onerror: function(error) {
                console.log('请求失败:', error);
            }
        });
    }

    // 在页面上下文中添加点击事件监听
    pageWindow.document.addEventListener('click', function(event) {
        if (event.target.classList.contains("booking__container--form--submit-btn")) {
            event.preventDefault();
            setTimeout(() => {
                init(retries);
            }, 5000);
        }
    });

    async function inputInformation() {
        console.log("开始输入表单信息...");

        try {
            // 1. 输入出发地
            await inputAndSelect(
                ["#mdsorigindestination", "#origin", "#mc-input-origin"],
                originName,
                ["#mdsorigindestination", "#origin", "#listbox > mc-option", "mc-button"]
            );

            // 2. 输入目的地
            await inputAndSelect(
                ["#mdsorigindestination", "#destination", "#mc-input-destination"],
                destinationName,
                ["#mdsorigindestination", "#destination", "#listbox > mc-option", "mc-button"]
            );

            // 3. 输入商品
            await inputAndSelect(
                ["#mdsCommodity > mc-c-commodity", "input"],
                commodityName,
                ["#mdsCommodity > mc-c-commodity", "#listbox > mc-option", "mc-button"]
            );

            // 4. 输入集装箱类型
            await inputAndSelect(
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
                pageWindow.document,
                [
                    "#mdscontainerselect > mc-c-container-select",
                    "div > mc-c-container-selection-input",
                    "#weight",
                    "#mc-input-weight"
                ]
            );
            if (weightInput) {
                console.log("输入重量:", weightNum);
                await simulateManualInput(weightInput, weightNum);
            } else {
                console.error("重量输入框未找到");
            }

            // 6. 输入集装箱数量
            const countInput = findShadowElement(
                pageWindow.document,
                [
                    "#mdscontainerselect > mc-c-container-select",
                    "div > mc-c-container-selection-input",
                    "div > div.container__row > mc-number-stepper",
                    "input"
                ]
            );
            if (countInput) {
                console.log("输入集装箱数量:", cntrNum);
                await simulateManualInput(countInput, cntrNum);
            } else {
                console.error("集装箱数量输入框未找到");
            }

            // 7. 选择持约方
            const priceRadio = findShadowElement(
                pageWindow.document,
                ["#priceOwner", "label > input[type=radio]"]
            );
            if (priceRadio) {
                console.log("选择持约方");
                priceRadio.click();
                await wait(CONFIG.elementCheckDelay);
            } else {
                console.error("持约方选项未找到");
            }

            // 8. 选择最早出发日期
            const datePicker = safeQuerySelector("#earliestDepartureDatePicker > div > div > a");
            if (datePicker) {
                console.log("点击日期选择器");
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

    async function init(retryCount = 0) {
        try {
            const currentUrl = pageWindow.location.href;
            await wait(CONFIG.pageLoadDelay);
            if (currentUrl === "https://www.maersk.com.cn/book/sailings") {
                console.log("在航次选择页面");
                await sailings();
            } else if (currentUrl === "https://www.maersk.com.cn/book/") {
                if (retryCount >= CONFIG.maxRetries) {
                    await wait(CONFIG.retryDelay);
                    await getMaersk();
                }else {
                    const btn = document.querySelector('.booking__container--form--submit-btn');
                    if (btn) {
                        console.log("找到继续按钮，准备点击:",retryCount);
                        const clickHandler = async () => {};
                        btn.addEventListener('click', clickHandler, { once: true });
                        btn.click();
                        retries=retryCount + 1;
                    } else {
                        console.warn("未找到继续按钮");
                        if (retryCount < CONFIG.maxRetries) {
                            await wait(5000);
                            await init(retryCount + 1);
                        } else {
                            console.error("达到最大重试次数，停止尝试");
                        }
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
            await wait(8000);

            const cards = pageWindow.document.querySelectorAll('[class="sailings__card"]');
            if (!cards || cards.length === 0) {
                throw new Error("未找到航次卡片");
            }

            console.log(`找到 ${cards.length} 个航次卡片`);
            let dateFound = false;
            let leaveDate ="";
            let arriveDate ="";
            let shipName = "";
            let priceDnd = "";
            let postData ={};
            for (const card of cards) {
                const dateElement = card.querySelector('h3');
                if (!dateElement) continue;

                const dateText = dateElement.textContent.trim();
                console.log(`检查航次日期: ${dateText}`);

                if (dateText.includes(dateStr)) {
                    console.log(`找到匹配日期的航次: ${dateText}`);
                    if(autoBooking){
                        const btn = card.querySelector('[class="button--block"]');
                        if (btn) {
                            console.log("点击选择航次按钮");
                            btn.click();
                            dateFound = true;

                            // 等待操作完成
                            await wait(5000);
                            await additional();
                        } else {
                            console.warn("找到匹配日期的卡片，但未找到选择按钮");
                        }
                    }else{
                        //获取价格回调更新
                        leaveDate = card.querySelector("header > dl > div.dl__item.dl__item--departure > dd > time").textContent;
                        arriveDate = card.querySelector("header > dl > div.dl__item.dl__item--arrival > dd > time").textContent;
                        shipName = card.querySelector("header > dl > div.dl__item.dl__item--vessel > dd").textContent.trimStart();
                        priceDnd = card.querySelector(" div.sailings__card__item  > div > div > div.sailings--price.sailings--dnd > p:nth-child(1)");
                        if(!priceDnd){
                            break;
                        }
                        const currencyAndPrice =priceDnd.textContent;
                        const [currency, price] = currencyAndPrice.trim().split(/\s+/)
                        console.log("离港时间:",leaveDate)
                        console.log("到港时间:",arriveDate)
                        console.log("航次:",shipName)
                        console.log("币种跟价格:",currencyAndPrice)
                        postData = {
                            id:monitorId,
                            ship_name :shipName,
                            leave_date : leaveDate,
                            arrive_date: arriveDate,
                            currency:currency,
                            price:parseFloat(price)
                        }
                    }
                    break;
                }
            }
            if(!autoBooking && priceDnd){
                await GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${CONFIG.API_HOST}/foreign/monitor/updatePrice`,
                    headers: {
                        "Authorization": CONFIG.token ,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    data: JSON.stringify(postData),
                    onload: function(response) {
                        try {
                            const result = JSON.parse(response.responseText);
                            if (result.code==0) {
                                console.log('数据上传成功:', postData.id);
                            } else {
                                console.error('数据上传失败:', result.message);
                            }
                        } catch (e) {
                            console.error('解析响应失败:', e);
                        }
                    },
                    onerror: function(error) {
                        console.error('上传请求失败:', error);
                    }
                });
                await wait(1000);
            }
            if (!dateFound) {
                const backSuccess = await clickElement(
                    "#sailings > div.load-more > mc-button",
                    ["div > button"],
                    1000
                );
                if(backSuccess){
                    await wait(2000);
                    await sailings(retryCount);
                }else {
                    await wait(2000);
                    await returnHome(retryCount);
                }
            }
        } catch (error) {
            console.error("选择航次过程中出错:", error);
        }
    }

    async function returnHome(retryCount){
        console.log("未找到匹配日期的航次，尝试返回上一步");
        const backSuccess = await clickElement(
            "#sailings > div.mds-step-indicator.is-framed.is-mds > mc-step-indicator > mc-step-indicator-item:nth-child(1) > span > div",
            [],
            10000
        );
        if (backSuccess) {
            console.log("返回上一步成功，重新获取数据查询");
            await getMaersk();
        }
    }

    async function additional() {
        try {
            console.log("开始执行附加操作...");

            // 1. 点击主按钮
            await clickElement("#main > main > section > mc-button", ["div > button"], 5000);

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
            //检查是否还有未订舱柜量
            let checkFullCabin = false;
            await GM_xmlhttpRequest({
                method: 'GET',
                url: `${CONFIG.API_HOST}/foreign/monitor/checkFullCabin?id=${monitorId}`,
                headers: {
                    "Authorization": CONFIG.token
                },
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.checkFullCabin) {
                            checkFullCabin = result.checkFullCabin;
                        }
                    } catch (e) {
                        console.log('获取失败:', e);
                    }
                },
                onerror: function(error) {
                    console.log('获取失败:', error);
                }
            });
            await wait(2000);
            console.log(checkFullCabin===false?"该订舱已经没有可订的柜量":"存在可订柜量");
            // 7. 提交订舱
            if (isSubmit && checkFullCabin) {
                await clickElement("#main > main > section > form > mc-button", ["div > button > div > span > slot.label"]);
                await wait(1000);
                await GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${CONFIG.API_HOST}/foreign/monitor/booked?id=${monitorId}`,
                    headers: {
                        "Authorization": CONFIG.token
                    },
                    onload: function(response) {
                        try {
                            const result = JSON.parse(response.responseText);
                            if (result.code===200) {
                                console.log(result.msg);
                            }else{
                                console.log(result.msg);
                            }
                        } catch (e) {
                            console.log('获取失败:', e);
                        }
                    },
                    onerror: function(error) {
                        console.log('获取失败:', error);
                    }
                });
            }

            //返回继续订别的舱
            await wait(2000);
            pageWindow.location.href = 'https://www.maersk.com.cn/book';

        } catch (error) {
            console.error("执行附加操作时出错:", error);
        }
    }
})();
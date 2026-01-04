// ==UserScript==
// @name         REI Auto Checkout with Immediate Continue Click
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  自动填充REI结账页面表单，并在填充完信用卡信息后立即点击Continue按钮
// @author       You
// @match        https://www.rei.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/509989/REI%20Auto%20Checkout%20with%20Immediate%20Continue%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/509989/REI%20Auto%20Checkout%20with%20Immediate%20Continue%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 执行标志，防止重复执行关键函数
    let isHandleOrderSummaryExecuted = false;
    let isFillCreditCardInfoExecuted = false;

    let modalHandled = false;          // 标志：是否已处理 "Continue with this address" 按钮
    let lastUrl = '';                  // 初始化 lastUrl
    let selectedPaymentOption = '';    // 存储用户选择的支付方式

    // 常用的first name和last name列表
    const firstNames = ['John', 'Michael', 'David', 'James', 'Robert', 'William', 'Mark', 'Charles', 'Joseph', 'Thomas'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Hernandez'];

    // 轮询检查'Add to Cart'按钮是否存在，仅在产品页面下执行
    const checkAddToCartButton = setInterval(() => {
        const currentUrl = window.location.href;
        if (currentUrl.includes('https://www.rei.com/product/')) {  // 仅在产品页面下执行
            const addToCartButton = document.querySelector('#add-to-cart-button');

            if (addToCartButton) {
                clearInterval(checkAddToCartButton); // 停止轮询

                // 替换为自定义支付选项弹出框
                addToCartButton.addEventListener('click', (event) => {
                    event.preventDefault();  // 防止默认添加到购物车行为
                    showPaymentOptions();
                });
            }
        }
    }, 500); // 每半秒检查一次

    // 自定义支付选项选择框
    function showPaymentOptions() {
        console.log('显示支付选项弹出框');
        // 创建弹出框的容器
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.zIndex = '9999';
        modal.style.backgroundColor = '#fff';
        modal.style.padding = '20px';
        modal.style.border = '1px solid #ccc';
        modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        modal.style.textAlign = 'center';

        // 创建标题
        const title = document.createElement('h3');
        title.innerText = '请选择支付方式';
        modal.appendChild(title);

        // 创建支付按钮列表
        const paymentOptions = [
            { text: '信用卡结账', value: 'credit_card' },
            { text: '礼品卡结账', value: 'gift_card' },
            { text: '折扣码 + 信用卡结账', value: 'coupon_credit_card' },
            { text: '折扣码 + 礼品卡结账', value: 'coupon_gift_card' },
            { text: '取消', value: 'cancel' }  // 添加取消按钮
        ];

        paymentOptions.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option.text;
            button.style.margin = '10px';
            button.style.padding = '10px 20px';
            button.style.cursor = 'pointer';
            button.onclick = () => {
                if (option.value === 'cancel') {
                    console.log('用户选择停止操作');
                    document.body.removeChild(modal);  // 移除弹出框
                    return;
                }
                selectedPaymentOption = option.value;
                console.log(`您选择了 "${option.text}"`);
                document.body.removeChild(modal);  // 移除弹出框
                window.location.href = 'https://www.rei.com/checkout#membership';  // 跳转到结账页面
            };
            modal.appendChild(button);
        });

        // 将弹出框添加到页面
        document.body.appendChild(modal);
    }

    // 检查URL变化并执行相应操作
    function checkUrlAndExecute() {
        const checkUrlInterval = setInterval(() => {
            const currentUrl = window.location.href;

            // 检查是否是新URL
            if (currentUrl !== lastUrl) {
                console.log('检测到新的 URL: ' + currentUrl);
                lastUrl = currentUrl;

                // 检测到 Membership 页面，执行操作
                if (currentUrl.includes('https://www.rei.com/checkout#membership')) {
                    console.log('已跳转到 Membership 页面');
                    clickMembershipContinueButton();  // 尽快点击 Membership 页面上的 Continue 按钮
                }
                // 检测到 Shipping Options 页面，执行操作
                else if (currentUrl.includes('https://www.rei.com/checkout#shipping-options')) {
                    console.log('已跳转到 Shipping Options 页面');
                    clickShippingContinueButton();  // 尽快点击 Shipping Options 页面上的 Continue 按钮
                }
                // 检测到 Contact Billing 页面，执行自动填充表单
                else if (currentUrl.includes('https://www.rei.com/checkout#contact-billing')) {
                    console.log('已跳转到 Contact Billing 页面');
                    startAutofill();  // 尽快自动填充表单
                }
                // 检测到 Order Summary 页面，根据用户选择的支付方式执行不同操作
                else if (currentUrl.includes('https://www.rei.com/checkout#order-summary')) {
                    console.log('已跳转到 Order Summary 页面');
                    handleOrderSummary();  // 根据用户选择的支付方式执行操作
                }
            }
        }, 500); // 每半秒检查一次URL

        // 立即执行一次检测
        setTimeout(() => {
            lastUrl = '';  // 重置 lastUrl，确保立即检测
        }, 0);
    }

    // 处理 Order Summary 页面上的操作，根据用户选择的支付方式进行不同的操作
    function handleOrderSummary() {
        if (isHandleOrderSummaryExecuted) {
            console.log('handleOrderSummary 已执行，跳过');
            return;
        }
        isHandleOrderSummaryExecuted = true;  // 设置标志，防止重复执行

        switch (selectedPaymentOption) {
            case 'credit_card':
                console.log('处理信用卡结账的操作');
                fillCreditCardInfo();  // 填充信用卡信息
                break;
            case 'gift_card':
                console.log('处理礼品卡结账的操作');
                // TODO: 在这里添加礼品卡结账的操作步骤
                break;
            case 'coupon_credit_card':
                console.log('处理折扣码 + 信用卡结账的操作');
                // TODO: 在这里添加折扣码 + 信用卡结账的操作步骤
                break;
            case 'coupon_gift_card':
                console.log('处理折扣码 + 礼品卡结账的操作');
                // TODO: 在这里添加折扣码 + 礼品卡结账的操作步骤
                break;
            default:
                console.log('无效的支付选项');
        }
    }

    // 填充信用卡信息并点击 Continue 按钮
    function fillCreditCardInfo() {
        if (isFillCreditCardInfoExecuted) {
            console.log('fillCreditCardInfo 已执行，跳过');
            return;
        }
        isFillCreditCardInfoExecuted = true;  // 设置标志，防止重复执行

        console.log('开始填充信用卡信息');

        // 定义信用卡信息的选择器和对应的值
        const creditCardInfo = {
            '#credit_card_id': '5236497965032819',
            '#expr_month': '12',      // 12月
            '#expr_year': '2024',      // 2024年
            '#security_code': '112'
        };

        let fieldsFilled = 0;
        const totalFields = 4;

        function fieldFilled() {
            fieldsFilled++;
            console.log(`已填充 ${fieldsFilled} / ${totalFields} 个字段`);
            if (fieldsFilled === totalFields) {
                console.log('所有信用卡字段已填充，等待1秒后开始点击 Continue 按钮');
                setTimeout(() => {
                    clickCcContinueButton();
                }, 1000);  // 等待1秒
            }
        }

        // 按照顺序填充信用卡号 -> 月份 -> 年份 -> 安全码
        // 1. 填充信用卡号
        waitForElement('#credit_card_id', () => {
            clickAndFillField('#credit_card_id', creditCardInfo['#credit_card_id']);
            fieldFilled();
        });

        // 2. 填充有效月份
        waitForElement('#expr_month', () => {
            selectDropdownOption('#expr_month', creditCardInfo['#expr_month']);
            fieldFilled();
        });

        // 3. 填充有效年份
        waitForElement('#expr_year', () => {
            selectDropdownOption('#expr_year', creditCardInfo['#expr_year']);
            fieldFilled();
        });

        // 4. 填充安全码
        waitForElement('#security_code', () => {
            clickAndFillField('#security_code', creditCardInfo['#security_code']);
            fieldFilled();
        });
    }

    // 点击信用卡信息页面的 Continue 按钮一次（整合用户提供的代码）
    function clickCcContinueButton() {
        console.log('尝试点击信用卡信息页面的 Continue 按钮');
        const opButton = document.querySelector('op-button[data_ui="cc-continue"]');
        if (opButton) {
            const shadow = opButton.shadowRoot;
            let continueButton;
            if (shadow) {
                continueButton = shadow.querySelector('button[data-ui="cc-continue"]');
            } else {
                continueButton = opButton.querySelector('button[data-ui="cc-continue"]');
            }
            if (continueButton) {
                // 使用完整的鼠标事件模拟点击
                simulateFullMouseClick(continueButton);
                console.log('已手动点击 Continue 按钮');
            } else {
                console.log('Continue 按钮未找到');
            }
        } else {
            console.log('<op-button data_ui="cc-continue"> 未找到');
        }
    }

    // 检查元素是否在视口中可见
    function isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // 使用XPath选择元素（保留，如果需要）
    function getElementByXPath(xpath) {
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue;
    }

    // 模拟完整的鼠标点击函数
    function simulateFullMouseClick(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // 模拟鼠标移动到按钮
        const mouseMoveEvent = new MouseEvent('mousemove', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });
        element.dispatchEvent(mouseMoveEvent);
        console.log('已模拟 mousemove 事件');

        // 模拟鼠标按下
        const mouseDownEvent = new MouseEvent('mousedown', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });
        element.dispatchEvent(mouseDownEvent);
        console.log('已模拟 mousedown 事件');

        // 模拟鼠标抬起
        const mouseUpEvent = new MouseEvent('mouseup', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });
        element.dispatchEvent(mouseUpEvent);
        console.log('已模拟 mouseup 事件');

        // 模拟点击
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });
        element.dispatchEvent(clickEvent);
        console.log('已模拟 click 事件');
    }

    // 通用的字段点击和填充函数
    function clickAndFillField(selector, value) {
        const field = document.querySelector(selector);
        if (field) {
            field.scrollIntoView({ behavior: "smooth", block: "center" });  // 滚动到输入框
            field.click();
            console.log(`已点击输入框: ${selector}`);

            // 等待点击事件完成后再进行输入
            setTimeout(() => {
                field.focus();  // 聚焦到输入框
                field.value = '';  // 清空输入框
                field.setAttribute('value', value);  // 设置 value 属性

                // 模拟逐个字符输入
                for (let i = 0; i < value.length; i++) {
                    let char = value[i];

                    // 模拟按键按下事件
                    const keydownEvent = new KeyboardEvent('keydown', {
                        bubbles: true,
                        cancelable: true,
                        key: char,
                        charCode: char.charCodeAt(0),
                        keyCode: char.charCodeAt(0)
                    });
                    field.dispatchEvent(keydownEvent);

                    // 插入字符
                    document.execCommand('insertText', false, char);

                    // 模拟按键松开事件
                    const keyupEvent = new KeyboardEvent('keyup', {
                        bubbles: true,
                        cancelable: true,
                        key: char,
                        charCode: char.charCodeAt(0),
                        keyCode: char.charCodeAt(0)
                    });
                    field.dispatchEvent(keyupEvent);
                }

                // 手动触发输入完成事件
                field.dispatchEvent(new Event('input', { bubbles: true }));
                field.dispatchEvent(new Event('change', { bubbles: true }));

                console.log(`成功输入字段: ${selector}, 值: ${value}`);
            }, 500);  // 点击完成后等待500毫秒再开始输入
        } else {
            console.error(`未找到输入框: ${selector}`);
        }
    }

    // 选择 select 下拉框的选项
    function selectDropdownOption(selectSelector, optionValue) {
        const selectElement = document.querySelector(selectSelector);
        if (selectElement) {
            selectElement.scrollIntoView({ behavior: "smooth", block: "center" });  // 滚动到选择框
            selectElement.focus();  // 聚焦
            console.log(`已点击选择框: ${selectSelector}`);

            // 模拟鼠标点击选择框
            selectElement.click();
            console.log(`已点击选择框: ${selectSelector}`);

            // 设置选择框的值
            setTimeout(() => {
                selectElement.value = optionValue;  // 设置选项值
                triggerChangeEvent(selectElement);  // 触发选择事件
                console.log(`选择框 ${selectSelector} 已选择: ${optionValue}`);
            }, 500);  // 等待500毫秒再进行选择
        } else {
            console.error(`未找到选择框: ${selectSelector}`);
        }
    }

    // 触发事件函数，确保选择框触发变化
    function triggerChangeEvent(element) {
        const events = ['input', 'change', 'blur', 'focus'];
        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            element.dispatchEvent(event);
            console.log(`已触发 ${eventType} 事件`);
        });
    }

    // 启动流程：按照顺序填充信用卡号、月份、年份、安全码
    function startProcess() {
        const monthSelector = '#expr_month';
        const yearSelector = '#expr_year';
        const securityCodeSelector = '#security_code';
        const creditCardSelector = '#credit_card_id';  // 新增信用卡号选择器

        // 1. 填充信用卡号
        waitForElement(creditCardSelector, () => {
            clickAndFillField(creditCardSelector, '5236497965032819');  // 填充信用卡号5236497965032819
        });

        // 2. 填充有效月份
        waitForElement(monthSelector, () => {
            selectDropdownOption(monthSelector, '12');  // 选择12月
        });

        // 3. 填充有效年份
        waitForElement(yearSelector, () => {
            selectDropdownOption(yearSelector, '2024');  // 选择2024年
        });

        // 4. 填充安全码
        waitForElement(securityCodeSelector, () => {
            clickAndFillField(securityCodeSelector, '112');  // 填充安全码112
        });
    }

    // 等待页面加载并执行操作
    function waitForElement(selector, callback, maxAttempts = 20, interval = 500) {
        let attempts = 0;
        const checkExist = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(checkExist);
                console.log(`找到元素: ${selector}`);
                callback(element);
            } else {
                attempts++;
                if (attempts >= maxAttempts) {
                    clearInterval(checkExist);
                    console.error(`等待元素 ${selector} 超时`);
                }
            }
        }, interval);  // 每 interval 毫秒检查一次
    }

    // 启动URL检测并执行相应操作
    checkUrlAndExecute();

    // 启动自动填充表单
    function startAutofill() {
        const checkFormFields = setInterval(() => {
            if (document.querySelector('#email') && !modalHandled) {
                autofillForm();  // 填充表单
                clearInterval(checkFormFields);  // 停止轮询
            }
        }, 250);  // 每 250 毫秒检查一次表单字段，减少延迟
    }

    // 自动填充表单函数，仅在结账页面执行
    function autofillForm() {
        console.log('开始自动填充表单');
        const randomEmail = generateRandomEmail();
        fillField('#email', randomEmail);

        const phoneNumber = '313' + Math.floor(1000000 + Math.random() * 9000000);
        fillField('#phone', phoneNumber);

        // 随机获取 first name 和 last name
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        fillField('#first_name', randomFirstName);
        fillField('#last_name', randomLastName);

        fillField('#address_line_one', '6215 NE 92nd Dr');
        fillField('#city', 'Portland');
        fillField('#state_province_id', 'OR');  // Oregon
        fillField('#postal_code', '97253');

        const checkBoxField = document.querySelector('#email-opt-in');
        if (checkBoxField && !checkBoxField.checked) {
            checkBoxField.click();
            console.log('已勾选 email-opt-in');
        }

        const shippingCheckBox = document.querySelector('input[aria-label="Shipping address is the same as billing"]');
        if (shippingCheckBox && !shippingCheckBox.checked) {
            shippingCheckBox.click();
            console.log('已勾选 Shipping address is the same as billing');
        }

        // 点击 Continue 按钮
        clickContinueButton();
        checkModalButton(); // 检查是否出现 "Continue with this address" 按钮
    }

    // 生成随机邮箱函数
    function generateRandomEmail() {
        const randomStr = Math.random().toString(36).substring(2, 10);  // 生成随机字符串
        return randomStr + '@blueothotel.com';
    }

    // 填充字段并触发事件
    function fillField(selector, value) {
        const field = document.querySelector(selector);
        if (field) {
            field.focus();
            field.value = value;
            triggerChangeEvent(field);
            console.log(`已填充字段: ${selector}, 值: ${value}`);
        } else {
            console.error(`字段 ${selector} 未找到，无法填充`);
        }
    }

    // 点击 Continue 按钮
    function clickContinueButton() {
        const continueButton = document.querySelector('button[data-ui="continue"]');

        if (continueButton && !modalHandled) {
            continueButton.scrollIntoView({ behavior: "smooth", block: "center" });
            continueButton.click();
            console.log('已点击 Continue 按钮');
        } else {
            console.log('Continue 按钮未找到或 Address Verification 弹窗已处理');
        }
    }

    // 点击 "Continue with this address" 按钮
    function checkModalButton() {
        const checkModalInterval = setInterval(() => {
            const modalButton = document.querySelector('button[title="Continue with this address"]');
            if (modalButton) {
                modalButton.scrollIntoView({ behavior: "smooth", block: "center" });
                modalButton.click();
                modalHandled = true;  // 设置标志，表示已处理 "Continue with this address" 按钮
                clearInterval(checkModalInterval);  // 停止检查
                console.log('已点击 "Continue with this address" 按钮');
            }
        }, 250);  // 每 250 毫秒检查一次
    }

    // 点击 Shipping Options 页面上的 Continue 按钮
    function clickShippingContinueButton() {
        const shippingContinueButton = document.querySelector('button[data-ui="continue"]');
        if (shippingContinueButton) {
            shippingContinueButton.scrollIntoView({ behavior: "smooth", block: "center" });
            shippingContinueButton.click();
            console.log('已点击 Shipping Options 页面的 Continue 按钮');
        } else {
            console.log('继续尝试找到 Shipping Options 页面的 Continue 按钮...');
            setTimeout(clickShippingContinueButton, 250);  // 继续尝试
        }
    }

    // 点击 Membership 页面上的 Continue 按钮
    function clickMembershipContinueButton() {
        const membershipButton = document.querySelector('button[data-ui="continue-without-link"]');

        if (membershipButton) {
            membershipButton.scrollIntoView({ behavior: "smooth", block: "center" });  // 平滑滚动至按钮
            membershipButton.click();  // 点击按钮
            console.log('已点击 Membership 页面的 "Continue without membership" 按钮');
        } else {
            console.log('未找到 Membership 页面的 Continue 按钮，继续尝试...');
            setTimeout(clickMembershipContinueButton, 250);  // 继续尝试
        }
    }

    // 点击信用卡信息页面的 Continue 按钮一次（整合用户提供的代码）
    function clickCcContinueButton() {
        console.log('尝试点击信用卡信息页面的 Continue 按钮');
        const opButton = document.querySelector('op-button[data_ui="cc-continue"]');
        if (opButton) {
            const shadow = opButton.shadowRoot;
            let continueButton;
            if (shadow) {
                continueButton = shadow.querySelector('button[data-ui="cc-continue"]');
            } else {
                continueButton = opButton.querySelector('button[data-ui="cc-continue"]');
            }
            if (continueButton) {
                // 使用完整的鼠标事件模拟点击
                simulateFullMouseClick(continueButton);
                console.log('已手动点击 Continue 按钮');
            } else {
                console.log('Continue 按钮未找到');
            }
        } else {
            console.log('<op-button data_ui="cc-continue"> 未找到');
        }
    }

    // 检查元素是否在视口中可见
    function isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // 使用XPath选择元素（保留，如果需要）
    function getElementByXPath(xpath) {
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue;
    }

    // 模拟完整的鼠标点击函数
    function simulateFullMouseClick(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // 模拟鼠标移动到按钮
        const mouseMoveEvent = new MouseEvent('mousemove', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });
        element.dispatchEvent(mouseMoveEvent);
        console.log('已模拟 mousemove 事件');

        // 模拟鼠标按下
        const mouseDownEvent = new MouseEvent('mousedown', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });
        element.dispatchEvent(mouseDownEvent);
        console.log('已模拟 mousedown 事件');

        // 模拟鼠标抬起
        const mouseUpEvent = new MouseEvent('mouseup', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });
        element.dispatchEvent(mouseUpEvent);
        console.log('已模拟 mouseup 事件');

        // 模拟点击
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });
        element.dispatchEvent(clickEvent);
        console.log('已模拟 click 事件');
    }

    // 通用的字段点击和填充函数
    function clickAndFillField(selector, value) {
        const field = document.querySelector(selector);
        if (field) {
            field.scrollIntoView({ behavior: "smooth", block: "center" });  // 滚动到输入框
            field.click();
            console.log(`已点击输入框: ${selector}`);

            // 等待点击事件完成后再进行输入
            setTimeout(() => {
                field.focus();  // 聚焦到输入框
                field.value = '';  // 清空输入框
                field.setAttribute('value', value);  // 设置 value 属性

                // 模拟逐个字符输入
                for (let i = 0; i < value.length; i++) {
                    let char = value[i];

                    // 模拟按键按下事件
                    const keydownEvent = new KeyboardEvent('keydown', {
                        bubbles: true,
                        cancelable: true,
                        key: char,
                        charCode: char.charCodeAt(0),
                        keyCode: char.charCodeAt(0)
                    });
                    field.dispatchEvent(keydownEvent);

                    // 插入字符
                    document.execCommand('insertText', false, char);

                    // 模拟按键松开事件
                    const keyupEvent = new KeyboardEvent('keyup', {
                        bubbles: true,
                        cancelable: true,
                        key: char,
                        charCode: char.charCodeAt(0),
                        keyCode: char.charCodeAt(0)
                    });
                    field.dispatchEvent(keyupEvent);
                }

                // 手动触发输入完成事件
                field.dispatchEvent(new Event('input', { bubbles: true }));
                field.dispatchEvent(new Event('change', { bubbles: true }));

                console.log(`成功输入字段: ${selector}, 值: ${value}`);
            }, 500);  // 点击完成后等待500毫秒再开始输入
        } else {
            console.error(`未找到输入框: ${selector}`);
        }
    }

    // 启动脚本
    startProcess();

    // 选择 select 下拉框的选项
    function selectDropdownOption(selectSelector, optionValue) {
        const selectElement = document.querySelector(selectSelector);
        if (selectElement) {
            selectElement.scrollIntoView({ behavior: "smooth", block: "center" });  // 滚动到选择框
            selectElement.focus();  // 聚焦
            console.log(`已点击选择框: ${selectSelector}`);

            // 模拟鼠标点击选择框
            selectElement.click();
            console.log(`已点击选择框: ${selectSelector}`);

            // 设置选择框的值
            setTimeout(() => {
                selectElement.value = optionValue;  // 设置选项值
                triggerChangeEvent(selectElement);  // 触发选择事件
                console.log(`选择框 ${selectSelector} 已选择: ${optionValue}`);
            }, 500);  // 等待500毫秒再进行选择
        } else {
            console.error(`未找到选择框: ${selectSelector}`);
        }
    }

    // 触发事件函数，确保选择框触发变化
    function triggerChangeEvent(element) {
        const events = ['input', 'change'];
        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            element.dispatchEvent(event);
            console.log(`已触发 ${eventType} 事件`);
        });
    }

})();

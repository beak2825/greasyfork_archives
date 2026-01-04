// ==UserScript==
// @name         REI Auto Checkout with Immediate Continue Click
// @namespace    http://tampermonkey.net/
// @version      6.9
// @description  自动填充REI结账页面表单，并在填充完信用卡信息后立即点击Continue按钮
// @author       You
// @match        https://www.rei.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/510599/REI%20Auto%20Checkout%20with%20Immediate%20Continue%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/510599/REI%20Auto%20Checkout%20with%20Immediate%20Continue%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = '';

    // 配置可修改的地址信息
    const addressInfo = {
        address: 'sss 6215 NE 92nd Dr',
        city: 'Portland',
        state: 'OR',
        postalCode: '97253',
    };

    // 配置可修改的信用卡信息
    const creditCardInfo = {
        cardNumber: '5236497965032819',
        expirationMonth: '12',
        expirationYear: '2024',
        securityCode: '112'
    };
    // 配置可修改的礼品卡资料
    const giftCards = [
        { cardNumber: '6051500002108386127', pin: '5840' },
        { cardNumber: '6051500002108381111', pin: '1111' },
        { cardNumber: '6051500002108382222', pin: '2222' }
    ];
    // 设置折扣码组
const couponCodes = [
    { code: 'DISCOUNT10'},
    { code: 'FREESHIP'},
    { code: 'EXTRA5'}
    ];

    // firstName 和 lastName 列表
    const firstNames = ['John', 'Michael', 'David', 'James', 'Robert', 'William', 'Charles', 'Thomas', 'Christopher', 'Matthew'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Martinez', 'Davis', 'Lopez', 'Wilson'];

    // 开始 URL 检测并执行相应操作
    const checkUrlAndExecute = () => {
        const checkUrlInterval = setInterval(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                console.log('检测到新的 URL: ' + currentUrl);
                lastUrl = currentUrl;

                if (currentUrl.includes('https://www.rei.com/checkout#membership')) {
                    clickMembershipContinueButton();
                } else if (currentUrl.includes('https://www.rei.com/checkout#contact-billing')) {
                    waitForContactAndBillingText();
                } else if (currentUrl.includes('https://www.rei.com/checkout#shipping-options')) {
                    clickContinueButton();
                } else if (currentUrl.includes('https://www.rei.com/checkout#order-summary')) {
                    handleOrderSummary();
                }
            }
        }, 500);
    };

    // 点击含有 'add to cart' 文本的按钮时，500ms 后跳转到 membership 页面
    const addToCartButtons = document.querySelectorAll('button');
    addToCartButtons.forEach(button => {
        if (button.innerText.toLowerCase().includes('add to cart')) {
            button.addEventListener('click', () => {
                setTimeout(() => {
                    window.location.href = 'https://www.rei.com/checkout#membership';
                }, 500);
            });
        }
    });

    // 处理订单摘要
function handleOrderSummary() {
    console.log('处理结账的操作');
    fillCreditCardInfo();
    monitorGiftCardInput(); // 开始监测礼品卡输入框
}

let isGiftCardInputDetected = false; // 状态变量，用于检测输入框是否已填充
let isApplyCardClicked = false; // 状态变量，用于检测是否已点击 Apply Card 按钮

// 监测 #giftCardNumberInput 输入框
function monitorGiftCardInput() {
    const giftCardInputInterval = setInterval(() => {
        const giftCardInput = document.querySelector('#giftCardNumberInput');
        if (giftCardInput && !isGiftCardInputDetected) {
            console.log('检测到礼品卡输入框，开始填充礼品卡信息');
            fillGiftCardInfo(); // 填充礼品卡信息
            isGiftCardInputDetected = true; // 更新状态，防止再次填充

            // 检查应用卡按钮是否已点击
            const applyCardButton = document.getElementById('redeem_gift_card');
            if (applyCardButton && isApplyCardClicked) {
                applyCardButton.click(); // 点击 Apply Card 按钮
                console.log('已点击 Apply Card 按钮');
                isApplyCardClicked = false; // 重置状态，允许重新检测
            }
        }
    }, 500); // 每500ms检查一次
}

// 填充礼品卡信息
function fillGiftCardInfo() {
    const randomCard = giftCards[Math.floor(Math.random() * giftCards.length)];
    fillField('#giftCardNumberInput', randomCard.cardNumber);
    fillField('#giftCardPinInput', randomCard.pin);

    // 延迟1秒后点击应用卡按钮
    setTimeout(() => {
        const applyCardButton = document.getElementById('redeem_gift_card');
        if (applyCardButton) {
            applyCardButton.click();
            console.log('已点击 Apply Card 按钮');
            isApplyCardClicked = true; // 更新状态为已点击
            checkForError(); // 检查是否出现错误
        }
    }, 1000);
}

// 检查是否出现错误消息
function checkForError() {
    setTimeout(() => {
        const errorMessage = document.querySelector('raw.content'); // 根据实际情况调整选择器
        if (errorMessage && errorMessage.textContent.includes("We're sorry, an error occurred when applying that card.")) {
            console.log('出现错误，清空礼品卡输入框并更换信息');
            document.querySelector('#giftCardNumberInput').value = '';
            document.querySelector('#giftCardPinInput').value = '';
            isGiftCardInputDetected = false; // 重置状态，允许重新填充

            // 重新填充礼品卡信息
            fillGiftCardInfo();
        } else {
            // 继续检测输入框
            isGiftCardInputDetected = false; // 在未出现错误时重置状态，继续检测
        }
    }, 2000); // 根据需要调整延迟时间
}


    // 填充信用卡信息
    function fillCreditCardInfo() {
        console.log('开始填充信用卡信息');
        fillField('#credit_card_id', creditCardInfo.cardNumber);
        fillField('#expr_month', creditCardInfo.expirationMonth);
        fillField('#expr_year', creditCardInfo.expirationYear);
        fillField('#security_code', creditCardInfo.securityCode);

        // 延迟1秒后点击继续按钮
        setTimeout(() => {
            clickContinueButton();
            scrollToThreeFifth(); // 滚动到页面五分之三处
        }, 1000);
    }

    // 应用礼品卡
    function applyGiftCard() {
        console.log('开始应用礼品卡');
        const applyGiftCardButton = document.querySelector('button.accordion__toggle-btn[data-ui="redeem-gift-card-link"]');
        if (applyGiftCardButton) {
            applyGiftCardButton.click();
            console.log('已点击 Apply gift cards and bonus cards');
            setTimeout(() => {
                fillGiftCardInfo();
            }, 500);
        }
    }


    // 在 https://www.rei.com/checkout#order-summary 页面滚动到页面的五分之三处
    function scrollToThreeFifth() {
        const scrollPosition = document.body.scrollHeight * 0.6;
        window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        console.log('已滚动到页面的五分之三处');
    }

    // 点击所有页面上的 Continue 按钮，识别方式为包含 "continue" 文本
    function clickContinueButton() {
        const buttons = Array.from(document.querySelectorAll('button'));
        const continueButton = buttons.find(button => button.innerText.toLowerCase().includes('continue'));
        if (continueButton) {
            continueButton.click();
            console.log('已点击 Continue 按钮');
        } else {
            console.log('Continue 按钮未找到');
        }
    }

    // 点击 Membership 页面的 Continue 按钮，识别基于文本
    function clickMembershipContinueButton() {
        const buttons = Array.from(document.querySelectorAll('button'));
        const membershipButton = buttons.find(button => button.innerText.toLowerCase().includes('continue without membership'));
        if (membershipButton) {
            membershipButton.click();
            console.log('已点击 Membership 页面的 "Continue without membership" 按钮');
        } else {
            setTimeout(clickMembershipContinueButton, 250);
        }
    }

    // 等待并识别 Contact and Billing 文本，识别到后开始自动填充，并监测“Address Verification”文本的出现
    function monitorAddressVerificationText() {
        const targetNode = document.body;

        const config = { childList: true, subtree: true };

        const callback = (mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const addressVerificationText = document.body.innerText.toLowerCase().includes('address verification');
                    if (addressVerificationText) {
                        clickContinueWithAddressButton();
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    // 在进入到 contact-billing 页面时调用监控函数
    function waitForContactAndBillingText() {
        const interval = setInterval(() => {
            const contactAndBillingText = document.body.innerText.toLowerCase().includes('contact and billing');
            if (contactAndBillingText) {
                clearInterval(interval);
                console.log('已识别到 "Contact and Billing" 文本，开始填充表单');
                startAutofill();
                monitorAddressVerificationText(); // 开始监控 Address Verification 文本
            }
        }, 300);
    }

    // 点击含有特定文本的 "Continue with this address" 按钮
    function clickContinueWithAddressButton() {
        const continueWithAddressButton = document.querySelector('button[title="Continue with this address"]');
        if (continueWithAddressButton) {
            continueWithAddressButton.click();
            console.log('已点击 "Continue with this address" 按钮');
        } else {
            console.log('"Continue with this address" 按钮未找到');
        }
    }

    // 自动填充表单
    function startAutofill() {
        const randomEmail = generateRandomEmail();
        const randomFirstName = getRandomElement(firstNames);
        const randomLastName = getRandomElement(lastNames);
        const randomPhoneNumber = generateRandomPhoneNumber();

        fillField('#email', randomEmail);
        fillField('#phone', randomPhoneNumber);
        fillField('#first_name', randomFirstName);
        fillField('#last_name', randomLastName);
        fillField('#address_line_one', addressInfo.address);
        fillField('#city', addressInfo.city);
        fillField('#state_province_id', addressInfo.state);
        fillField('#postal_code', addressInfo.postalCode);

        // 点击“Shipping address is the same as billing”复选框
        const shippingSameCheckbox = document.querySelector('input[type="checkbox"][aria-label="Shipping address is the same as billing"]');
        if (shippingSameCheckbox && !shippingSameCheckbox.checked) {
            shippingSameCheckbox.click();
            console.log('已勾选 Shipping address is the same as billing 复选框');
        }

        clickContinueButton();
    }

    // 填充表单字段的通用方法
    function fillField(selector, value) {
        const field = document.querySelector(selector);
        if (field) {
            field.value = value;
            field.dispatchEvent(new Event('input', { bubbles: true }));
            console.log(`已填充字段: ${selector}, 值: ${value}`);
        } else {
            console.error(`字段 ${selector} 未找到`);
        }
    }

    function generateRandomEmail() {
        return Math.random().toString(36).substring(2, 10) + '@blueothotel.com';
    }

    function generateRandomPhoneNumber() {
        return '313' + Math.floor(1000000 + Math.random() * 9000000);
    }

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    checkUrlAndExecute();
})();

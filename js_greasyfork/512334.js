// ==UserScript==
// @name         Jellycat 结账填充完整版
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  在Jellycat结账页面自动填充邮箱、地址，检测配送选项并点击“Add to Bag”后跳转购物车
// @match        https://us.jellycat.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512334/Jellycat%20%E7%BB%93%E8%B4%A6%E5%A1%AB%E5%85%85%E5%AE%8C%E6%95%B4%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/512334/Jellycat%20%E7%BB%93%E8%B4%A6%E5%A1%AB%E5%85%85%E5%AE%8C%E6%95%B4%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const firstNames = ['John', 'Michael', 'David', 'James', 'Robert', 'William', 'Mark', 'Paul', 'Steven', 'Joseph'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Hernandez'];

    const addressInfo = {
        address1: '26D Columbia Cir',
        city: 'Merrimack',
        state: 'NH',
        postalCode: '03054',
        phone: '313' + Math.floor(1000000 + Math.random() * 9000000)
    };

    function generateEmailPrefix() {
        const letters = Math.random().toString(36).substring(2, 7);
        const numbers = Math.floor(10000 + Math.random() * 90000);
        return letters + numbers;
    }

    function selectRandomName() {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        return { firstName, lastName };
    }

    function fillField(inputElement, value) {
        Object.defineProperty(inputElement, 'value', {
            configurable: true,
            get: function() {
                return value;
            },
            set: function(newValue) {
                return value;
            }
        });

        ['input', 'change', 'blur', 'focus'].forEach(eventType => {
            inputElement.dispatchEvent(new Event(eventType, { bubbles: true }));
        });

        console.log(`填充了字段：${value}`);
    }

    function acceptCookies() {
        const acceptCookiesButton = document.getElementById('onetrust-accept-btn-handler');
        if (acceptCookiesButton) {
            acceptCookiesButton.click();
            console.log('点击了“Accept Cookies”按钮');
        } else {
            setTimeout(acceptCookies, 500);
        }
    }

    function fillEmailAndClickContinue() {
        if (window.location.href.includes('/checkout')) {
            const emailInput = document.querySelector('#email');
            if (emailInput) {
                const emailPrefix = generateEmailPrefix();
                const email = emailPrefix + '@blueothotel.com';
                console.log(`邮箱已填充：${email}`);
                fillField(emailInput, email);
                clickContinueButton();
            } else {
                console.log('邮箱输入框未找到，等待500ms后重试...');
                setTimeout(fillEmailAndClickContinue, 500);
            }
        }
    }

    function clickContinueButton() {
        const continueButton = [...document.querySelectorAll('button')].find(button => button.textContent.toLowerCase().includes('continue'));
        if (document.body.textContent.includes('Terms and Conditions')) {
            console.log('已找到“Terms and Conditions”，滚动到页面底部');
            scrollToBottom();
            return;
        }

        if (continueButton) {
            console.log('点击“continue”按钮');
            continueButton.click();

            setTimeout(() => {
                if (!document.body.textContent.includes('Terms and Conditions')) {
                    clickContinueButton();  // 继续尝试点击“continue”按钮
                }
            }, 300);
        } else {
            console.log('未找到“continue”按钮，等待300ms后重试...');
            setTimeout(clickContinueButton, 300);
        }
    }

    function scrollToBottom() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }

    function observeShippingText(callback) {
        const observer = new MutationObserver(() => {
            const shippingText = document.body.textContent.includes("Need to ship outside of the USA or Canada? For other shipping destinations, please visit our international site");
            if (shippingText) {
                observer.disconnect();
                console.log('检测到页面包含“Need to ship outside of the USA or Canada...”的文本');
                callback();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    function fillAddressAndCheckShippingOptions() {
        const { firstName, lastName } = selectRandomName();
        console.log(`选择的名字：${firstName} ${lastName}`);

        const firstNameInput = document.querySelector('#firstNameInput');
        const lastNameInput = document.querySelector('#lastNameInput');
        const addressLine1Input = document.querySelector('#addressLine1Input');
        const cityInput = document.querySelector('#cityInput');
        const stateSelect = document.querySelector('#provinceCodeInput');
        const postalCodeInput = document.querySelector('#postCodeInput');
        const phoneInput = document.querySelector('#phoneInput');

        if (firstNameInput && lastNameInput && addressLine1Input && cityInput && stateSelect && postalCodeInput && phoneInput) {
            fillField(firstNameInput, firstName);
            fillField(lastNameInput, lastName);
            fillField(addressLine1Input, addressInfo.address1);
            fillField(cityInput, addressInfo.city);

            Object.defineProperty(stateSelect, 'value', {
                configurable: true,
                get: function() {
                    return addressInfo.state;
                },
                set: function(newValue) {
                    return addressInfo.state;
                }
            });
            stateSelect.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`州已填充：${addressInfo.state}`);

            fillField(postalCodeInput, addressInfo.postalCode);
            fillField(phoneInput, addressInfo.phone);

            console.log('所有地址字段已快速填充完成');
            detectShippingOptionsAndContinue();
        } else {
            console.log('部分地址输入框未找到，等待300ms后重试...');
            setTimeout(fillAddressAndCheckShippingOptions, 300);
        }
    }

    function detectShippingOptionsAndContinue() {
        const shippingOptionDesc = document.querySelector('.shippingOption-desc');
        if (shippingOptionDesc) {
            console.log('检测到配送选项，继续点击“continue”按钮');
            clickContinueButton();
        } else {
            console.log('未找到配送选项，等待300ms后重试...');
            setTimeout(detectShippingOptionsAndContinue, 300);
        }
    }

    function observeAddToBag() {
        const observer = new MutationObserver(() => {
            const addToBagButton = document.querySelector('input[type="submit"][value*="Add to Bag"]');
            if (addToBagButton) {
                addToBagButton.addEventListener('click', () => {
                    console.log('检测到点击了“Add to Bag”按钮，1秒后跳转到购物车页面');
                    setTimeout(() => {
                        window.location.href = 'https://us.jellycat.com/cart.php';
                    }, 1000);  // 延迟1000ms以确保操作完成
                });
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    acceptCookies();
    fillEmailAndClickContinue(); // 只在 /checkout 页面执行邮箱填充
    observeShippingText(() => {
        fillAddressAndCheckShippingOptions();
    });
    observeAddToBag();  // 使用MutationObserver检测并在点击“Add to Bag”后跳转到购物车页面
})();

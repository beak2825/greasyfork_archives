// ==UserScript==
// @name         auto write card info
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  none
// @author       kinger
// @match        https://checkout.stripe.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509406/auto%20write%20card%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/509406/auto%20write%20card%20info.meta.js
// ==/UserScript==

//TODO:添加根据国家地区自动填写地址，名称自动填写zhiyang

(function() {
    'use strict';

    console.log('银行卡自动填写脚本已启动');

    //对输入框中的内容进行处理
    function dowithInputText(text)
    {
        //将所有的/替换为|
        text = text.replace(/\//g, '|');
        //正则匹配所有的CVV
        let matches = text.match(/\d{16}\|(\d{1}|\d{2})\|(\d{2}|\d{4})\|(\d{3}|\d{4})/g);
        return matches?.join('\n') || text;
    }

    // 创建面板函数
    function createPanel() {
        // 检查面板是否已存在
        if (document.getElementById('autofill-panel')) {
            console.log('面板已存在，跳过创建');
            return;
        }

        // 创建面板
        var panel = document.createElement('div');
        panel.id = 'autofill-panel';
        panel.style.position = 'fixed';
        panel.style.top = '20px';
        panel.style.right = '20px';
        panel.style.width = '350px';
        panel.style.backgroundColor = 'white';
        panel.style.border = '2px solid #ccc';
        panel.style.padding = '15px';
        panel.style.zIndex = '10000';
        panel.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
        panel.style.fontSize = '14px';
        panel.style.borderRadius = '8px';
        panel.style.opacity = '0.95';
        panel.style.fontFamily = 'Arial, sans-serif';

        // 创建标题
        var title = document.createElement('h3');
        title.textContent = '银行卡自动填写';
        title.style.marginTop = '0';
        title.style.marginBottom = '10px';
        panel.appendChild(title);

        // 创建文本区域
        var textarea = document.createElement('textarea');
        textarea.id = 'card-input';
        textarea.rows = 8;
        textarea.cols = 40;
        textarea.placeholder = '每行输入一张卡，格式：\n卡号|月|年|CVC';
        textarea.style.width = '100%';
        textarea.style.boxSizing = 'border-box';
        textarea.style.padding = '5px';
        textarea.style.fontSize = '14px';
        panel.appendChild(textarea);

        // 创建提交按钮
        var button = document.createElement('button');
        button.id = 'submit-button';
        button.textContent = '填入卡号';
        button.style.marginTop = '10px';
        button.style.width = '100%';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.fontSize = '16px';
        button.style.borderRadius = '4px';
        panel.appendChild(button);

        // 将面板添加到页面
        document.body.appendChild(panel);
        console.log('面板已创建并添加到页面');

        // 按钮事件
        button.addEventListener('click', async function() {
            var lines = dowithInputText(textarea.value.trim()).split('\n').filter(line => line.trim() !== '');
            if (lines.length === 0) {
                alert('没有可处理的卡号信息。');
                return;
            }

            var cardData = lines[0];
            // 移除已处理的卡号
            lines.shift();
            textarea.value = lines.join('\n');

            // 解析卡号信息
            var parts = cardData.split('|');
            if (parts.length !== 4) {
                alert('卡号格式不正确，应为：卡号|月|年|CVC');
                return;
            }

            var cardNumber = parts[0].trim();
            var month = parts[1].trim();
            var year = parts[2].trim();
            var cvc = parts[3].trim();
            var name = 'zhi yang'
            //如果年份是4位，则取后两位
            if (year.length === 4) year = year.slice(-2);

            console.log(`填入卡号信息：${cardNumber} | ${month}/${year} | ${cvc}`);

            var cardNumberField = document.getElementById('cardNumber');
            var cardExpiryField = document.getElementById('cardExpiry');
            var cardCvcField = document.getElementById('cardCvc');
            var billingNameField = document.getElementById("billingName");

            if (cardNumberField && cardExpiryField && cardCvcField && billingNameField) {
                try {
                    await setNativeValue(cardNumberField, cardNumber);
                    console.log('卡号已填写');

                    await setNativeValue(cardExpiryField, `${month}/${year}`);
                    console.log('到期日已填写');

                    await setNativeValue(cardCvcField, cvc);
                    console.log('CVC已填写');

                    await setNativeValue(billingNameField, name);
                    console.log('name已填写');

                    //alert('卡号信息已填入表单。');
                } catch (error) {
                    console.error('填写表单时出错:', error);
                    alert('填写表单时出错，请检查控制台日志。');
                }
            } else {
                console.error('未找到表单字段，请确认页面是否正确。');
                alert('未找到表单字段，请确认页面是否正确。');
            }
        });
    }

    // 触发完整事件
    async function setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element.__proto__, 'value').set;
        if (valueSetter) {
            valueSetter.call(element, value);
        } else {
            element.value = value;
        }

        const inputEvent = new Event('input', { bubbles: true });
        element.dispatchEvent(inputEvent);

        const changeEvent = new Event('change', { bubbles: true });
        element.dispatchEvent(changeEvent);

        const blurEvent = new Event('blur', { bubbles: true });
        element.dispatchEvent(blurEvent);

        //insure tbe event finish
        await delay(50);
    }

    // delay
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // listen DOM
    var observer = new MutationObserver(function(mutations, me) {
        // check
        if (document.getElementById('cardNumber') && document.getElementById('cardExpiry') && document.getElementById('cardCvc') && document.getElementById("billingName")) {
            console.log('create ui');
            createPanel();
            me.disconnect(); // stop listen
            return;
        }
    });

    // listening
    observer.observe(document, {
        childList: true,
        subtree: true
    });

})();

// ==UserScript==
// @name         自动填充闯关
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  自动填充全国大学生职业规划大赛生涯闯关系统
// @author       BaoPaper
// @match        https://zgs.chsi.com.cn/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518060/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E9%97%AF%E5%85%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/518060/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E9%97%AF%E5%85%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听快捷键 b 按下事件
    document.addEventListener('keydown', function(event) {
        if (event.key === 'b' || event.key === 'B') {
            // 阻止默认事件，防止 e 键被浏览器处理
            event.preventDefault();

            // 执行所有功能
            fillInputsAndTextareas();
        }
    });

    // 执行所有功能
    function fillInputsAndTextareas() {
        // 设置所有 input 的值为 123 或根据 placeholder 填充
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type !== 'checkbox' && input.type !== 'radio' && input.type !== 'button') {
                const placeholder = input.getAttribute('placeholder');
                const lengthMatch = placeholder && placeholder.match(/\（(\d+)～(\d+)字\）/);

                if (lengthMatch) {
                    // 如果有字数范围，生成相应长度的随机字符
                    const minLength = parseInt(lengthMatch[1]);
                    const maxLength = parseInt(lengthMatch[2]);
                    const randomLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
                    const randomText = generateRandomText(randomLength);

                    const setter = Object.getOwnPropertyDescriptor(
                        Object.getPrototypeOf(input),
                        'value'
                    ).set;
                    setter.call(input, randomText);

                    let inputEvent = new Event('input', {
                        'bubbles': true,
                        'cancelable': true,
                        'composed': true
                    });
                    input.dispatchEvent(inputEvent);
                } else {
                    // 如果没有字数范围，直接填充 "123"
                    const setter = Object.getOwnPropertyDescriptor(
                        Object.getPrototypeOf(input),
                        'value'
                    ).set;
                    setter.call(input, '123');

                    let inputEvent = new Event('input', {
                        'bubbles': true,
                        'cancelable': true,
                        'composed': true
                    });
                    input.dispatchEvent(inputEvent);
                }
            }
        });

        // 为每个符合条件的 textarea 根据 placeholder 填充对应长度的随机文本
        const textareas = document.querySelectorAll('textarea[placeholder*="请输入"]');
        textareas.forEach(textarea => {
            const placeholder = textarea.getAttribute('placeholder');
            const match = placeholder.match(/\（(\d+)～(\d+)字\）/);

            if (match) {
                const minLength = parseInt(match[1]);
                const maxLength = parseInt(match[2]);
                const randomLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

                // 生成指定长度的随机文本
                const randomText = generateRandomText(randomLength);

                // 设置 textarea 的值
                const setter = Object.getOwnPropertyDescriptor(
                    Object.getPrototypeOf(textarea),
                    'value'
                ).set;
                setter.call(textarea, randomText);

                // 创建并触发 input 事件，模拟用户输入
                let event = new Event('input', {
                    'bubbles': true,
                    'cancelable': true
                });
                textarea.dispatchEvent(event);
            }
        });

        // 为每个符合条件的 input 获取独立的人名并填充
        const nameInputs = document.querySelectorAll('input[placeholder="请输入(2～10字)"]');
        nameInputs.forEach((input, index) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://api.mir6.com/api/sjname',
                onload: function(response) {
                    const name = response.responseText.trim();
                    const setter = Object.getOwnPropertyDescriptor(
                        Object.getPrototypeOf(input),
                        'value'
                    ).set;
                    setter.call(input, name);

                    let event = new Event('input', {
                        'bubbles': true,
                        'cancelable': true
                    });
                    input.dispatchEvent(event);
                },
                onerror: function(error) {
                    console.error(`API 请求失败 for input ${index + 1}:`, error);
                }
            });
        });
    }

    // 生成指定长度的随机文本
    function generateRandomText(length) {
        const characters = '你我它是好哈。？！';
        let text = '';
        for (let i = 0; i < length; i++) {
            text += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return text;
    }

    // 留给你空间继续编写代码
    // TODO: 在此添加新的功能代码

})();
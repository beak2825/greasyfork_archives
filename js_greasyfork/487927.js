// ==UserScript==
// @name         显示密码
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Modify element attribute from type="password" to type="text"
// @author       Your Name
// @match        *://*/*ogin*
// @match        *://*/*signin*
// @match        *://*/*signup*
// @match        *://*/*regist*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487927/%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/487927/%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==
// 实现原理：将密码输入框样式修改为text

(function() {
    'use strict';

    // 创建按钮和提示元素
    const addButtonAndMessage = () => {
        const button = document.createElement('button');
        button.innerHTML = '显示密码';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.addEventListener('click', hideDisplay);
        button.style.padding = '15px'; // 设置按钮内边距
        button.style.borderRadius = '5px'; // 设置按钮圆角

        document.body.appendChild(button);

        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '80px';
        message.style.right = '10px';
        message.style.padding = '10px';
        message.style.backgroundColor = '#4CAF50'; // 绿色背景，可以根据需要调整颜色
        message.style.color = 'white';
        message.style.zIndex = '9998';
        message.style.display = 'none';
        document.body.appendChild(message);

        return message;
    };

    const xpathExpression = '//*[@type="password"]'; // 这里是修改密码输入框样式的xpath定位，如果没有成功可以尝试修改为你的密码输入框
	const hideDisplay = () => {
    // 获取目标元素
    var targetElement = document.evaluate(xpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    // 如果目标元素存在
    if (targetElement) {
        // 判断当前输入框类型
        if (targetElement.type === 'password') {
            // 如果当前是密码输入框，则修改为文本输入框
            targetElement.type = 'text';
            // 显示成功消息
            showMessage('密码已显示');
        } else {
            // 如果当前是文本输入框，则修改为密码输入框
            showMessage('密码显示失败');
        }
    }
};


    // 显示消息
    const showMessage = (text) => {
        const message = addButtonAndMessage();
        message.textContent = text;
        message.style.display = 'block';

        // 3秒后隐藏消息
        setTimeout(() => {
            message.style.display = 'none';
        }, 3000);
    };

    // 等待页面加载完成后添加按钮和提示元素
    window.addEventListener('load', addButtonAndMessage);
})();
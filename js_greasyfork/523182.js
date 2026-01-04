// ==UserScript==
// @name         妖火论坛快捷回复插件
// @namespace    https://yaohuo.me
// @version      1.4
// @description  在妖火论坛帖子页面右侧添加快捷回复按钮
// @author       GodPoplar
// @match        https://yaohuo.me/bbs-*
// @match        https://www.yaohuo.me/bbs-*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523182/%E5%A6%96%E7%81%AB%E8%AE%BA%E5%9D%9B%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/523182/%E5%A6%96%E7%81%AB%E8%AE%BA%E5%9D%9B%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前页面是否有 class="retextarea" 的元素
    const retextareaElement = document.querySelector('.retextarea');
    if (!retextareaElement) return;

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.width='300px';
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '40%';
    buttonContainer.style.left = '70%';
    buttonContainer.style.zIndex = '9999';
    buttonContainer.style.backgroundColor = '#f9f9f9';
    buttonContainer.style.border = '1px solid #ccc';
    buttonContainer.style.padding = '10px';
    buttonContainer.style.borderRadius = '5px';

    // 定义快捷回复的内容
    const replies = ['感谢分享', '感谢','多谢分享','多谢!', '666','恭喜','冲冲冲','加油!','已阅','同问','一样','等等','带带','帮顶','不至于','不清楚','不知道','O(∩_∩)O哈哈~','交给楼上','对-_-','吃~~','没了','没有','ε=(´ο｀*)))唉','[url=https://werun.id/#/register?code=gWOx5EBA]10元500g,可免流可翻,点击注册免费2天15g[/url]'];

    // 创建按钮并添加功能
    replies.forEach(reply => {
        const button = document.createElement('button');
        button.textContent = reply;
        button.style.marginRight = '5px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = '#007bff';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '3px';

        // 按钮点击事件
        button.addEventListener('click', () => {
            // 设置第一个 .retextarea 的 value 值
            retextareaElement.value = reply;

            // 模拟点击 type="submit" 的 input 元素
            const submitButton = document.querySelector('input[type="submit"]');
            if (submitButton) {
                submitButton.click();
            } else {
                alert('未找到提交按钮');
            }
        });

        // 将按钮添加到容器中
        buttonContainer.appendChild(button);
    });

    // 将容器添加到页面顶部
    document.body.appendChild(buttonContainer);
})();

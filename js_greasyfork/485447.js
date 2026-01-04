// ==UserScript==
// @name         渐变生成工具脚本
// @namespace    http://tampermonkey.net/
// @version      2024-01-22
// @description  增加了复制单个颜色代码的功能
// @author       番薯怪人
// @match        https://www.learnui.design/tools/gradient-generator.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=learnui.design
// @license      AGPL-3.0-or-later
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/485447/%E6%B8%90%E5%8F%98%E7%94%9F%E6%88%90%E5%B7%A5%E5%85%B7%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/485447/%E6%B8%90%E5%8F%98%E7%94%9F%E6%88%90%E5%B7%A5%E5%85%B7%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 选择父级容器
    const actions = document.querySelector("#content > div > div.actions");
    // 创建一个新的flex容器元素
    const colorContainer = document.createElement('div');
    colorContainer.classList.add('color-container');
    colorContainer.setAttribute('id', 'color-container');

    // 将flex容器添加到<div class="actions">中
    actions.appendChild(colorContainer);

    // 监听值变化
    const copy_css = document.getElementById("copy-css");

    // 初始化时显示初始颜色项
    let gradientString = copy_css.getAttribute("data-clipboard-text");
    let colorCodes = gradientString.match(/#[0-9a-fA-F]{6}/g) || [];
    addItems(colorCodes, colorContainer);

    // 创建一个MutationObserver实例，并指定回调函数
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // 检查是否是data-clipboard-text属性的变化
            if (mutation.attributeName === "data-clipboard-text") {
                // 执行你的处理逻辑
                const newTextValue = mutation.target.getAttribute("data-clipboard-text");
                // console.log("data-clipboard-text 变化了，新值为: ", newTextValue);
                gradientString = newTextValue;
                // 使用正则表达式匹配颜色代码7
                colorCodes = gradientString.match(/#[0-9a-fA-F]{6}/g) || [];
                // console.log(colorCodes);
                addItems(colorCodes, colorContainer);
            }
        });
    });

    // 配置观察选项
    const config = { attributes: true };

    // 启动观察器，并传入目标元素和观察选项
    observer.observe(copy_css, config);

    // 在不需要监听时，可以调用disconnect方法停止观察
    // observer.disconnect();


    // 添加一些子元素到flex容器中
    function addItems(colorArr, fatherContainer) {
        fatherContainer.innerHTML = '';
        for (let i = 0; i < colorArr.length; i++) {
            fatherContainer.innerHTML += `
        <div class='color-item' style="background:${colorArr[i]}">${colorArr[i]}</div>
        `;
        }
    }

    function handleClick(e) {
        // console.log(e.target);
        const target = e.target;
        // 检查点击的是否是颜色项
        if (target.classList.contains('color-item')) {
            // 获取颜色值
            const colorValue = target.textContent;

            // 将文本写入剪贴板
            navigator.clipboard.writeText(colorValue)
                // .then(() => {
                //     // 提示用户已复制到剪贴板
                //     alert('颜色值已复制到剪贴板: ' + colorValue);
                // })
                .catch((error) => {
                    console.error('无法复制到剪贴板: ', error);
                });
        }
    }

    colorContainer.addEventListener('click', handleClick);

    // 使用GM_addStyle添加CSS样式
    // GM_addStyle('#dropbox{display:none; width:400px;height:200px;padding:8px; ......}')
    GM_addStyle(`
        #color-container{
            display:flex;
            justify-content: center;
            flex-wrap: wrap;
            flex-direction: row;
            width: 100%;
            height: 44px;
            margin: 15px 0;
        }
        .color-item{
            font-family: "Rajdhani", "DIN", sans-serif;
            font-size: 16px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
            color: white;
            flex: 1;
            height: 100%;
            line-height: 44px;
            text-align: center;
        }
    `);
})();
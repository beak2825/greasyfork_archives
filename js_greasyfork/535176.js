// ==UserScript==
// @name         网页标题自定义修改
// @namespace    http://www.wukui.fun/
// @version      1.0
// @description  在页面左上角添加一个直角三角形按钮，点击后可以修改当前页面的标题。
// @author       吴奎
// @match        *://*/*
// @grant        none
// @license      MIT license
// @downloadURL https://update.greasyfork.org/scripts/535176/%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/535176/%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建直角三角形按钮（短边紧贴视口边缘，缩小一半）
    const createTriangleButton = () => {
        const button = document.createElement('div');
        button.style.position = 'fixed';
        button.style.top = '0';
        button.style.left = '0';
        button.style.width = '0';
        button.style.height = '0';
        button.style.borderBottom = '20px solid transparent'; // 下边透明
        button.style.borderLeft = '20px solid #007bff';       // 左边蓝色，形成直角三角形
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';
        button.title = '点击修改标题';
        return button;
    };

    // 创建标题编辑框
    const createTitleEditor = () => {
        const editor = document.createElement('div');
        editor.style.position = 'fixed';
        editor.style.top = '30px'; // 调整位置以适应缩小的按钮
        editor.style.left = '5px'; // 调整位置以适应缩小的按钮
        editor.style.padding = '5px'; // 缩小编辑框内边距
        editor.style.backgroundColor = '#fff';
        editor.style.border = '1px solid #ccc';
        editor.style.borderRadius = '3px';
        editor.style.boxShadow = '0 1px 5px rgba(0, 0, 0, 0.1)';
        editor.style.zIndex = '9999';
        editor.style.display = 'none'; // 默认隐藏
        editor.innerHTML = `
            <input type="text" id="custom-title-input" style="width: 150px; padding: 3px; margin-bottom: 5px;" placeholder="输入自定义标题">
            <button id="save-title-btn" style="padding: 3px 8px; background-color: #007bff; color: #fff; border: none; border-radius: 2px; cursor: pointer;">保存</button>
        `;
        return editor;
    };

    // 初始化组件
    const triangleButton = createTriangleButton();
    const titleEditor = createTitleEditor();

    // 添加到页面
    document.body.appendChild(triangleButton);
    document.body.appendChild(titleEditor);

    // 点击三角形按钮显示/隐藏编辑框
    triangleButton.addEventListener('click', () => {
        if (titleEditor.style.display === 'none') {
            titleEditor.style.display = 'block';
        } else {
            titleEditor.style.display = 'none';
        }
    });

    // 保存按钮逻辑
    document.getElementById('save-title-btn').addEventListener('click', () => {
        const customTitle = document.getElementById('custom-title-input').value.trim();
        if (customTitle) {
            document.title = customTitle; // 修改页面标题
            titleEditor.style.display = 'none'; // 隐藏编辑框
        } else {
            alert('请输入有效的标题！');
        }
    });
})();
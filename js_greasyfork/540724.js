// ==UserScript==
// @name         网页右下角输入框保存（兼容版）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在网页右下角添加输入框，保存并读取内容（兼容 GM 和 GM_ API）
// @author       WT L
// @license      MIT
// @match        *://*/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/540724/%E7%BD%91%E9%A1%B5%E5%8F%B3%E4%B8%8B%E8%A7%92%E8%BE%93%E5%85%A5%E6%A1%86%E4%BF%9D%E5%AD%98%EF%BC%88%E5%85%BC%E5%AE%B9%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/540724/%E7%BD%91%E9%A1%B5%E5%8F%B3%E4%B8%8B%E8%A7%92%E8%BE%93%E5%85%A5%E6%A1%86%E4%BF%9D%E5%AD%98%EF%BC%88%E5%85%BC%E5%AE%B9%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 兼容 GM4+ 的异步 API 和老版同步 API
    const getValue = typeof GM?.getValue === 'function'
        ? (key, def) => GM.getValue(key, def)
        : (key, def) => Promise.resolve(GM_getValue(key, def));

    const setValue = typeof GM?.setValue === 'function'
        ? (key, val) => GM.setValue(key, val)
        : (key, val) => Promise.resolve(GM_setValue(key, val));

    // 等待页面完全加载
    function onReady(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    onReady(async () => {
        // 创建容器
        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#9aa19536',
            padding: '5px',
            borderRadius: '6px',
            zIndex: '999999',
        });

        // 创建输入框
        const input = document.createElement('input');
        input.type = 'text';
        Object.assign(input.style, {
            marginRight: '3px',
            padding: '4px 6px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '150px',
        });

        // 创建按钮
        const button = document.createElement('button');
        button.innerText = '√';
        Object.assign(button.style, {
            padding: '4px 8px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            'background-color': 'rgb(133 168 205 / 72%)',
        });

        // 把元素插到页面里
        container.append(input, button);
        document.body.appendChild(container);

        // 读取已保存内容
        try {
            const saved = await getValue('savedText', '');
            input.value = saved;
        } catch (e) {
            console.error('读取保存内容失败', e);
        }

        // 点击保存
        button.addEventListener('click', async () => {
            try {
                await setValue('savedText', input.value);
                alert('已保存：' + input.value);
            } catch (e) {
                console.error('保存失败', e);
                alert('保存失败，请看控制台');
            }
        });
    });
})();

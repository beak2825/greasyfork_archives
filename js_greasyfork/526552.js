// ==UserScript==
// @name         获取jable.tv当前页面番号
// @namespace    https://jable.tv/
// @version      0.1
// @description  获取jable.tv当前页面番号，任何页面 
// @author       You
// @match        https://jable.tv/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526552/%E8%8E%B7%E5%8F%96jabletv%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E7%95%AA%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/526552/%E8%8E%B7%E5%8F%96jabletv%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E7%95%AA%E5%8F%B7.meta.js
// ==/UserScript==

window.onload = function () {
    'use strict';
    const list = [];
    const getTitles = () => {
        alert('提取番号成功');
        const titles = document.querySelectorAll('.detail .title');
        const titleArray = Array.from(titles).map(title => title.textContent);
        const titleArray2 = titleArray.map(title => title.split(' ')[0]);

        // 只添加不在 list 中的新标题
        const newTitles = titleArray2.filter(title => !list.includes(title));
        list.push(...newTitles);

        console.log('Titles:', list);
    }
    // 增加一个按钮，点击按钮后，获取titles
    const button = document.createElement('button');
    button.textContent = '提取当前页面番号';
    button.addEventListener('click', getTitles);
    button.style.position = 'fixed';
    button.style.top = '40px';
    button.style.right = '10px';
    button.style.zIndex = '99999';
    button.style.backgroundColor = 'red';
    button.style.color = 'white';
    document.body.appendChild(button);

    // 清空list按钮
    const clearButton = document.createElement('button');
    clearButton.textContent = '清空列表';
    clearButton.addEventListener('click', () => {
        list.length = 0;
        alert('列表已清空');
    });
    clearButton.style.position = 'fixed';
    clearButton.style.top = '80px';
    clearButton.style.right = '10px';
    clearButton.style.zIndex = '99999';
    clearButton.style.backgroundColor = 'red';
    clearButton.style.color = 'white';
    document.body.appendChild(clearButton);

    // 保存到本地文件
    const saveButton = document.createElement('button');
    saveButton.textContent = '保存到本地';
    saveButton.addEventListener('click', () => {
        const content = list.join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'jable.txt';
        a.click();
    });
    saveButton.style.position = 'fixed';
    saveButton.style.top = '120px';
    saveButton.style.right = '10px';
    saveButton.style.zIndex = '99999';
    saveButton.style.backgroundColor = 'red';
    document.body.appendChild(saveButton);
};
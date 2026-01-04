// ==UserScript==
// @name         宽带山论坛根据关键字屏蔽帖子
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Hide elements containing specific keywords, notify the user with fade-in effect, and apply italic to restored elements
// @author       YourName
// @match        https://*kdslife.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527074/%E5%AE%BD%E5%B8%A6%E5%B1%B1%E8%AE%BA%E5%9D%9B%E6%A0%B9%E6%8D%AE%E5%85%B3%E9%94%AE%E5%AD%97%E5%B1%8F%E8%94%BD%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/527074/%E5%AE%BD%E5%B8%A6%E5%B1%B1%E8%AE%BA%E5%9D%9B%E6%A0%B9%E6%8D%AE%E5%85%B3%E9%94%AE%E5%AD%97%E5%B1%8F%E8%94%BD%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 关键词数组
    const keywords = ['哪吒', 'exampleKeyword1', 'exampleKeyword2'];

    // 存储屏蔽的关键词及屏蔽的 li 元素
    let hiddenKeywords = [];
    let hiddenElements = [];

    // 遍历所有的 span.n3 a 元素
    document.querySelectorAll('span.n3 a').forEach(anchor => {
        const text = anchor.textContent.trim().toLowerCase(); // 获取文本并转换为小写
        keywords.forEach(keyword => {
            if (text.includes(keyword.toLowerCase())) {
                // 如果文本包含关键词，则隐藏父元素 .main_List li.i2
                const parentLi = anchor.closest('.main_List li.i2');
                if (parentLi && !hiddenElements.includes(parentLi)) {
                    parentLi.style.display = 'none'; // 隐藏该条目
                    hiddenElements.push(parentLi); // 记录已隐藏的元素
                    if (!hiddenKeywords.includes(keyword)) {
                        hiddenKeywords.push(keyword); // 记录被屏蔽的关键词
                    }
                }
            }
        });
    });

    // 在 #login-bar>.i3 内部前面添加提示元素 #nottoshow
    const loginBar = document.querySelector('#login-bar > .i3');
    if (loginBar && hiddenElements.length > 0) {
        const nottoshow = document.createElement('div');
        nottoshow.id = 'nottoshow';
        nottoshow.style.cursor = 'pointer';
        nottoshow.style.padding = '10px';
        nottoshow.style.position = 'fixed';
        nottoshow.style.bottom = '10px';
        nottoshow.style.right = '10px';
        nottoshow.style.fontSize = '10px';
        nottoshow.style.lineHeight = '15px';
        nottoshow.style.color = 'rgb(159 167 173)';
        nottoshow.style.borderRadius = '5px';
        nottoshow.style.zIndex = '9999'; // 确保提示框在顶部

        // 使用 innerHTML 设置内容，并添加换行
        nottoshow.innerHTML = `已屏蔽关键词:<br>${hiddenKeywords.join(', ')} 共${hiddenElements.length}条<br>双击此处重新显示`;
        document.body.appendChild(nottoshow); // 直接添加到 body 中，而非 loginBar

        // 双击 #nottoshow 恢复隐藏的条目，并添加淡入效果
        nottoshow.addEventListener('dblclick', () => {
            hiddenElements.forEach((li, index) => {
                li.style.transition = 'opacity 2s'; // 设置过渡效果
                li.style.opacity = '0';  // 先将元素设置为透明
                li.style.display = ''; // 显示元素

                // 在 2秒后，淡入效果恢复
                setTimeout(() => {
                    li.style.opacity = '1'; // 恢复不透明

                    // 为恢复的 a 元素添加斜体样式
                    const anchor = li.querySelector('a');
                    if (anchor) {
                        anchor.style.fontStyle = 'italic'; // 为 a 标签添加斜体
                    }
                }, 20); // 确保过渡生效
            });

            // 清空屏蔽关键词数组和已隐藏的元素
            hiddenKeywords = [];
            hiddenElements = [];
            // 更新提示内容
            nottoshow.innerHTML = '没有屏蔽任何内容'; // 使用 innerHTML 更新内容
        });
    }
})();
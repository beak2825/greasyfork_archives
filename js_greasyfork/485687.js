// ==UserScript==
// @name        划词视频解析
// @namespace    http://rc.cq.cn/
// @version      1.0
// @description  在网页上划词弹出视频播放按钮，点击按钮进行视频在线解析播放
// @author       zlcqrc
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485687/%E5%88%92%E8%AF%8D%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/485687/%E5%88%92%E8%AF%8D%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 声明一个按钮变量，并创建一个按钮元素。
    const searchIcon = document.createElement('button');
    // 设置按钮的样式，包括位置、显示方式、背景颜色、文字颜色、边框、内边距和鼠标指针样式。
    searchIcon.style.position = 'absolute';
    searchIcon.style.display = 'none';
    searchIcon.style.backgroundColor = '#4CAF50';
    searchIcon.style.color = '#ffffff';
    searchIcon.style.border = 'none';
    searchIcon.style.padding = '10px 20px';
    searchIcon.style.cursor = 'pointer';

    // 为按钮添加点击事件监听器，当用户点击按钮时执行以下操作：
    // 1. 获取当前选中的文字。
    // 2. 如果选中的文字不为空，使用 im1907.top URL格式打开一个新的标签页进行视频解析播放。
    // 3. 清除当前的选中文字。
    // 4. 隐藏按钮。
    searchIcon.addEventListener('mousedown', function() {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            const url = `https://im1907.top/?jx=${encodeURIComponent(selectedText)}`;
            window.open(url, '_blank');
            clearSelection();
            searchIcon.style.display = 'none'; // 隐藏按钮
        }
    });

    // 将按钮添加到网页的body元素中。
    document.body.appendChild(searchIcon);

    // 当用户在网页上拖动鼠标选中文字时，如果选中的文字不为空，显示按钮，并根据鼠标位置定位按钮的位置。
    document.addEventListener('mouseup', function(e) {
        if (e.button === 0) {
            const selection = window.getSelection();
            if (selection.type === 'Range' && selection.toString().length > 0) {
                searchIcon.style.display = 'block';
                searchIcon.textContent = ('解析播放' + selection); // 为按钮设置初始文本内容
                searchIcon.style.top = `${e.pageY}px`;
                searchIcon.style.left = `${e.pageX}px`;
            } else {
                searchIcon.style.display = 'none';
            }
        }
    });

    // 这个函数用于清除当前选中的文字。它使用了window.getSelection()和document.selection两种方法来兼容不同的浏览器。
    function clearSelection() {
        if (window.getSelection) {
            if (window.getSelection().empty) {
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {
            document.selection.empty();
        }
    }
})();
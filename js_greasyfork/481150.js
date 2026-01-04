// ==UserScript==
// @name         XTRF Column Width
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  limit the maxium width of XTRF view table
// @author       LL-Floyd
// @match        https://langlinking.s.xtrf.eu/xtrf/faces/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xtrf.eu
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481150/XTRF%20Column%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/481150/XTRF%20Column%20Width.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', function () {
        setTimeout(function () {
            // 创建固定在右上角的容器
            let container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '5.5%'; // 距离顶部5.5%
            container.style.right = '10px'; // 距离右侧10px
            container.style.zIndex = '1000'; // 确保在最上层

            // 创建文本标签
            let label = document.createElement('label');
            label.textContent = '请输入最大宽度：';
            label.style.marginRight = '5px'; // 为了美观，添加一些右边距
            container.appendChild(label);

            // 创建输入框
            let input = document.createElement('input');
            input.type = 'number';
            input.style.width = '80px'; // 输入框宽度
            input.style.height = '18px'; // 输入框高度

            // 设置默认值
            let defaultWidth = 140;

            // 从LocalStorage检索并设置之前保存的宽度值
            let savedWidth = localStorage.getItem('tableMaxWidth');
            if (savedWidth) {
                input.value = savedWidth;
                applyWidthToTable(savedWidth);
            } else {
                // 如果LocalStorage中没有保存的值，则使用默认值
                input.value = defaultWidth;
                applyWidthToTable(defaultWidth);
            }

            container.appendChild(input);

            // 创建按钮
            let button = document.createElement('button');
            button.textContent = '确认';
            button.style.height = '24px'; // 按钮高度
            container.appendChild(button);

            // 设置按钮点击和输入框回车键事件
            let setWidth = function () {
                let maxWidth = input.value;
                // 检查输入值是否在 50 到 1000 的范围内
                if (maxWidth >= 50 && maxWidth <= 1000) {
                    applyWidthToTable(maxWidth);
                    // 保存宽度值到LocalStorage
                    localStorage.setItem('tableMaxWidth', maxWidth);
                } else {
                    alert('请输入一个在 50 到 1000 之间的值。');
                }
            };
            button.addEventListener('click', setWidth);
            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    setWidth();
                }
            });

            // 将容器添加到文档中
            document.body.appendChild(container);
        }, 1000); // 延迟1秒执行

        // 应用宽度到表格
        function applyWidthToTable(width) {
            let columns = document.querySelectorAll('.x-table th, .x-table td');
            columns.forEach(function (column) {
                column.style.maxWidth = width + 'px';
                column.style.overflowWrap = 'break-word';
            });
        }
    });
})();

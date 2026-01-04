// ==UserScript==
// @name         ColorSpace配色结果保存为MATLAB元胞
// @namespace    plusv
// @version      1.1
// @description  键盘按任意键即可执行。
// @match        https://mycolor.space/?hex=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468080/ColorSpace%E9%85%8D%E8%89%B2%E7%BB%93%E6%9E%9C%E4%BF%9D%E5%AD%98%E4%B8%BAMATLAB%E5%85%83%E8%83%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/468080/ColorSpace%E9%85%8D%E8%89%B2%E7%BB%93%E6%9E%9C%E4%BF%9D%E5%AD%98%E4%B8%BAMATLAB%E5%85%83%E8%83%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isKeyDown = false; // 标记是否按下了任意键
    document.addEventListener('keydown', function(event) {
        if (!isKeyDown) {
            isKeyDown = true; // 标记已按下任意键，避免重复执行
            const palettes = document.querySelectorAll('.color-palette');
            let output = '';
            let rowIndex = 1; // 行索引
            palettes.forEach(palette => {
                const colorBoxes = palette.querySelectorAll('.color-box');
                const colors = []; // 存储颜色值的数组
                colorBoxes.forEach(colorBox => {
                    const value = colorBox.querySelector('.name').value;
                    const rgbValue = hexToRgb(value); // 将颜色值转换为 RGB 格式
                    const r = rgbValue[0];
                    const g = rgbValue[1];
                    const b = rgbValue[2];
                    colors.push(`${r}, ${g}, ${b}`); // 把 RGB 格式的颜色值添加到数组中
                });
                output += `Clist{${rowIndex}}=[${colors.join('; ')}];\n`; // 把颜色值数组转换为 MATLAB 矩阵格式，并添加到输出字符串中
                rowIndex++; // 更新行索引
            });

            // 创建一个 Blob 对象，用于保存输出结果
            const blob = new Blob([output], { type: 'text/plain' });

            // 创建一个链接，用于下载保存的文件
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'PlusVColor.txt';

            // 模拟点击链接来下载文件
            link.click();

            // 将十六进制颜色值转换为 RGB 格式的函数
            function hexToRgb(hex) {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return [r, g, b];
            }
        }
    });
    document.addEventListener('keyup', function(event) {
        isKeyDown = false; // 标记按键已松开，可以再次执行
    });
})();
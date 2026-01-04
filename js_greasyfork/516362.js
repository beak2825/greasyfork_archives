// ==UserScript==
// @name         Modify Text Selection Background Color 修改复制选中文字的背景色
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  修改网页选中复制文字的背景色为指定的十六进制颜色，并通过设置菜单直接选择颜色
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      Skyee
// @downloadURL https://update.greasyfork.org/scripts/516362/Modify%20Text%20Selection%20Background%20Color%20%E4%BF%AE%E6%94%B9%E5%A4%8D%E5%88%B6%E9%80%89%E4%B8%AD%E6%96%87%E5%AD%97%E7%9A%84%E8%83%8C%E6%99%AF%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/516362/Modify%20Text%20Selection%20Background%20Color%20%E4%BF%AE%E6%94%B9%E5%A4%8D%E5%88%B6%E9%80%89%E4%B8%AD%E6%96%87%E5%AD%97%E7%9A%84%E8%83%8C%E6%99%AF%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义颜色数组
    const colors = [
        { name: '橙黄色', hex: '#fde69a' },
        { name: '淡蓝色', hex: '#d6edff' },
        { name: '黄色', hex: '#FFFF00' }
    ];

    // 获取当前颜色，默认为橙黄色
    let selectionBackgroundColor = GM_getValue('selectionColor', '#fde69a');

    // 添加样式，修改选中文字的背景色
    GM_addStyle(`
        ::selection {
            background-color: ${selectionBackgroundColor} !important;
            color: black !important;  // 文本颜色为黑色，确保可读性
        }
        ::-moz-selection {
            background-color: ${selectionBackgroundColor} !important;
            color: black !important;
        }
    `);

    // 创建 Tampermonkey 设置菜单项，列出每个颜色作为菜单选项
    colors.forEach((color, index) => {
        GM_registerMenuCommand(`选择 ${color.name} 作为背景色`, function() {
            // 更新背景颜色
            GM_setValue('selectionColor', color.hex);
            selectionBackgroundColor = color.hex;

            // 刷新页面以应用新颜色
            GM_addStyle(`
                ::selection {
                    background-color: ${selectionBackgroundColor} !important;
                    color: black !important;
                }
                ::-moz-selection {
                    background-color: ${selectionBackgroundColor} !important;
                    color: black !important;
                }
            `);

            alert(`选中文字的背景色已更改为：${color.name} (${color.hex})`);
        });
    });

    // 提示用户当前背景颜色
    console.log(`当前选中文字的背景颜色：${selectionBackgroundColor}`);
})();

// ==UserScript==
// @name        Google RHS Order
// @namespace   Violentmonkey Scripts
// @match       https://www.google.*/*
// @version     1.1.1
// @license     MIT
// @author      Benature
// @description Sort RHS in Google
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @icon        https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png
// @homepageURL https://github.com/Benature
// @downloadURL https://update.greasyfork.org/scripts/484378/Google%20RHS%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/484378/Google%20RHS%20Order.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义默认设置
    const defaultSettings = {
        substrings: ['Obsidian', 'cubox', 'diigo', 'c4g', 'monica']
    };

    // 读取用户设置
    const settings = GM_getValue('userSettings', defaultSettings);

    // 注册菜单命令以允许用户更改设置
    GM_registerMenuCommand('Change Substrings', function() {

        console.log('substrings: ', settings.substrings);
        // 这里可以添加代码来弹出一个对话框，让用户输入新的子字符串
        // 例如，使用prompt()函数来获取用户输入
        const newSubstrings = prompt('Enter new substrings (comma-separated):', settings.substrings.join(', '));

        // 保存新的设置
        GM_setValue('userSettings', {
            substrings: newSubstrings.split(',').map(sub => sub.trim())
        });

        // 重新加载脚本以应用新的设置
        GM_notification('Substrings updated.', 'Substrings have been updated. Please reload the page to apply changes.');
    });


    // 自定义排序函数
    function customSort(a, b) {
        const substrings = settings.substrings;
        // 获取子元素的ID
        var aId = a.id;
        var bId = b.id;

        // 检查子元素的ID是否包含子字符串
        var aMatches = substrings.filter(sub => aId.includes(sub));
        var bMatches = substrings.filter(sub => bId.includes(sub));
        console.log(a, b)
        console.log(aMatches, bMatches)

        // 如果a和b都包含子字符串，比较子字符串的索引
        if (aMatches.length && bMatches.length) {
            var aIndex = substrings.indexOf(aMatches[0]);
            var bIndex = substrings.indexOf(bMatches[0]);

            // 如果索引相同，比较ID的自然顺序
            if (aIndex === bIndex) {
                return aId.localeCompare(bId);
            }
            return aIndex - bIndex;
        }

        // 如果a包含子字符串而b不包含，a在前
        if (aMatches.length && !bMatches.length) {
            return -1;
        }

        // 如果b包含子字符串而a不包含，b在前
        if (!aMatches.length && bMatches.length) {
            return 1;
        }

        // 如果都不包含子字符串，比较ID的自然顺序
        return aId.localeCompare(bId);
    }



    function sortChildrenById(containerId) {
        // 获取包含子元素的div
        var container = document.getElementById(containerId);

        // 检查div是否存在
        if (container) {
            // 获取所有具有id属性的子元素
            // var childrenWithId = Array.from(container.querySelectorAll('[id]'));
            var childrenWithId = Array.from(container.children).filter(child => child.id); // 只获取有id的子元素

            // 移除所有子元素
            container.innerHTML = '';

            // 根据ID对子元素进行排序
            childrenWithId.sort(customSort);

            // 重新插入排序后的子元素
            childrenWithId.forEach(function(child) {
                container.appendChild(child);
            });
        }
    }

    // 等待DOM完全加载后再运行排序函数
    function waitForDomReady() {
        // 检查DOM是否已经加载完成
        if (document.readyState === 'complete') {
            // 如果DOM已经加载完成，执行排序函数
            sortChildrenById('rhs');
        } else {
            // 如果DOM还未加载完成，等待100ms后再次检查
            setTimeout(waitForDomReady, 100);
        }
    }

    // 开始等待DOM加载
    waitForDomReady();
})();
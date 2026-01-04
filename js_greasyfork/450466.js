// ==UserScript==
// @name         去除广告
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  去除必应搜索引擎搜索结果中的广告项
// @author       fightingHawk
// @match        *://*.bing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450466/%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/450466/%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

/*
脚本原理：将输入框中的搜索内容的末尾拼接一个' -广告'来实现去除页面中含有‘广告’的结果
整体流程：
    
    1. 获取当前页面的广告标签数组，通过判断数组长度来得出当前搜索页面结果中是否含有广告
        1.1. 如果长度为0则说明当前页面没有广告，则不进行任何操作
        1.2. 如果长度不为0则说明当前页面有广告，则继续执行
    2. 执行去除广告的函数
        2.1. 获取表单元素
        2.2. 先获取输入框中的字符串，判断是否以' -广告'结尾。
            2.2.1. 如果是则不进行任何操作
            2.2.2. 如果不是将输入框中的字符串末尾拼接上' -广告'
        2.3. 重新设置输入框的值
        2.4. 提交表单
*/

(function() {
    'use strict';

    let input = document.getElementById('sb_form_q'); // 获取输入框元素
    let value = input.value; // 获取输入框中的值
    // 如果不满足则执行下面的语句
    let advertising = document.getElementsByClassName('b_adSlug b_opttxt b_divdef'); // 获取广告标签元素数组，此class属性值仅为‘必应’搜索结果中的广告元素专用class
    let advertisingCount = advertising.length; // 获取广告标签元素数组长度
    if (advertisingCount != 0) {
        // 若长度不为0，说明当前搜索结果中有广告，则执行以下函数去广告
        delAdvertising(input, value);
    }
})();

// 去除广告的函数
function delAdvertising(input, value) {
    let form = document.getElementById('sb_form'); // 获取表单元素
    let reg = / -广告$/; // 定义正则表达式，以' -广告'结尾
    let newValue = value;
    let result = reg.test(value); // 匹配字符串是否满足正则表达式
    if (!result) {
        newValue = value + ' -广告'; // 拼接新字符串，结尾加上' -广告'
    }
    input.setAttribute('value', newValue); // 重新设置输入框中的值
    form.submit(); // 提交表单
}
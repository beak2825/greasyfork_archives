// ==UserScript==
// @name         下载客户信息
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键下载客户信息
// @author       You
// @match        *://alicrm.alibaba.com/?*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=alibaba.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482068/%E4%B8%8B%E8%BD%BD%E5%AE%A2%E6%88%B7%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/482068/%E4%B8%8B%E8%BD%BD%E5%AE%A2%E6%88%B7%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
   // 找到具有类名为 "ui-header-main maheader-clearfix new-header-cgs" 的 div 元素
    var headerDiv = document.querySelector('.ui-header-main.maheader-clearfix.new-header-cgs');

    // 检查是否找到了匹配的元素
    if (headerDiv) {
        // 创建按钮元素
        var myButton = document.createElement('button');
        myButton.textContent = '点击下载客户信息';
        myButton.style.margin = '10px';
        myButton.style.fontSize = '16px'; // 设置按钮字体大小
        myButton.style.padding = '8px 16px'; // 设置按钮内边距
        myButton.style.borderColor = "#f26d5f";

        // 将按钮添加到 headerDiv 元素中
        headerDiv.appendChild(myButton);

        // 添加按钮点击事件的监听器
        myButton.addEventListener('click', function() {
           var results = [];


// 选择具有类名为 "contact-card-container" 的第一个元素
var contactCardContainer = document.querySelector('.contact-card-container');

// 检查是否找到了匹配的元素
if (contactCardContainer) {
    // 选择具有类名为 "row" 的所有元素
    var rows = contactCardContainer.querySelectorAll('.row');

    // 遍历每个 "row" 元素
    rows.forEach(function(row, index) {
        // 在每个 "row" 元素中选择具有类名为 "label" 的元素
        var label = row.querySelector('.label');

        // 在每个 "row" 元素中选择具有类名为 "value" 的元素
        var value = row.querySelector('.value');
        console.log(label.textContent + ":" + value.textContent);
        results.push(label.textContent + ":" + value.textContent);
        if (index < rows.length-1) {
            results.push('\n');
        }


        // 检查是否找到了 "label" 和 "value" 元素
    });

}



// 查找所有class为"show-details-item-content"的div元素
var showDetailsDivs = document.querySelectorAll('.show-details-item-content');
// 循环遍历每个找到的div
showDetailsDivs.forEach(function(div) {
    // 查找当前div下class为"row"的子div
    var rowDivs = div.querySelectorAll('.row');

    // 循环遍历每个rowDiv
    rowDivs.forEach(function(rowDiv, index) {
        // 查找当前rowDiv下class为"label"和"value"的子div
        var labelDiv = rowDiv.querySelector('.label');
        var valueDiv = rowDiv.querySelector('.value');

        // 输出名称和值
        var label = labelDiv ? labelDiv.textContent.trim() : "";
        var value = valueDiv ? valueDiv.textContent.trim() : "";
                // 假设你有一个包含字符串的变量
var yourString =label + ": " + value;

// 判断原字符串是否包含 "备注: -"
if (yourString.includes("备注:-")) {
  // 如果包含，使用 replace 方法进行替换
  yourString = yourString.replace("备注:-", "");
}

        console.log(label + ": " + value);
        results.push(label + ": " + value);
        if (index < rowDivs.length-1) {
            results.push('\n');
        }



// 输出替换后的结果
console.log("替换后的字符串:", yourString);


    });
});

console.log(results.join(''));

// 将结果数组转换为字符串
var csvContent1 = results.join('');

var csvContent2 = csvContent1.replace("备注:-", "");
var csvContent = csvContent2.replace("备注: -", "");

// 生成随机文件名
var randomFileName = 'contact_data_' + Math.random().toString(36).substring(7) + '.txt';

// 创建一个Blob对象，指定数据和文件类型
var blob = new Blob([csvContent], { type: 'text/txt' });

// 创建一个下载链接
var downloadLink = document.createElement('a');
downloadLink.href = window.URL.createObjectURL(blob);
downloadLink.download = randomFileName; // 使用随机文件名

// 将下载链接添加到文档中并触发点击
document.body.appendChild(downloadLink);
downloadLink.click();

// 移除下载链接
document.body.removeChild(downloadLink);
        });
    } else {
        console.log('未找到具有类名 "ui-header-main maheader-clearfix new-header-cgs" 的元素。');
    }


})();
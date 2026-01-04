// ==UserScript==
// @name        暨珠水电费网站优化
// @namespace   http://tampermonkey.net/
// @version     1.21
// @description 功能1:禁止网页中的弹窗；功能2:由于自带的显示剩余度数和钱不准，计算真实剩余的度数（假定用户只会没钱的时候充钱）
// @author      Ray
// @match       https://zhsdcx.jnu.edu.cn/*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497912/%E6%9A%A8%E7%8F%A0%E6%B0%B4%E7%94%B5%E8%B4%B9%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/497912/%E6%9A%A8%E7%8F%A0%E6%B0%B4%E7%94%B5%E8%B4%B9%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

 
    // 禁用 window.confirm
    window.confirm = function() {
        console.log("阻止了一个 confirm 弹窗");
        return null; // 返回true，模拟用户点击了“取消”
    };


    // 获取元素
var element = document.querySelector("#ext-element-11");

// 检查元素是否存在
/*    var button = document.createElement('button');
    button.innerHTML = '查询水电费';
button.style.position = 'absolute'; // 或者 'absolute' 如果您想要相对于某个容器定位
button.style.top = '10px'; // 距离顶部 10px
button.style.left = '50%'; // 居中
button.style.zIndex = '9999';
button.style.padding = '10px';
button.style.backgroundColor = '#008CBA';
button.style.color = 'white';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.cursor = 'pointer';

document.body.appendChild(button);
     button.onclick = function() {
        // This function searches for the table and then looks for the column with the header "充值量"
function getRechargeAmount() {
    // Get all table elements on the page
    const tables = document.querySelectorAll('table');

    // Iterate over each table
    tables.forEach(table => {
        // Get all rows in the table
        const rows = table.rows;

        // Iterate over each row
        for (let i = 0; i < rows.length; i++) {
            // Get all cells in the row
            const cells = rows[i].cells;

            // Iterate over each cell
            for (let j = 0; j < cells.length; j++) {
                // Check if the cell contains the header "充值量"
                if (cells[j].innerText.includes('充值量')) {
                    // Found the header, now get the value from the same column in subsequent rows
                    for (let k = i + 1; k < rows.length; k++) {
                        console.log('充值量:', rows[k].cells[j].innerText);
                    }
                    return; // Exit the function after processing the column
                }
            }
        }
    });
}

// Execute the function to print the recharge amounts to the console
getRechargeAmount();
    };*/


})();
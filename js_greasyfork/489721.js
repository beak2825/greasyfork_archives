// ==UserScript==
// @name         TheAppleWiki JB Table Filter
// @namespace    http://tampermonkey.net/
// @version      2024-03-13
// @description  快速筛选系统版本，方便寻找越狱工具。
// @author       tom-snow
// @match        https://theapplewiki.com/wiki/Jailbreak/*.x
// @icon         https://www.google.com/s2/favicons?sz=64&domain=theapplewiki.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489721/TheAppleWiki%20JB%20Table%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/489721/TheAppleWiki%20JB%20Table%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var wikitables = document.getElementsByClassName("wikitable"); // 取得页面所有表格
    for (let tableId = 0; tableId < wikitables.length; tableId++){ // 对所有表格进行遍历处理
        var table = wikitables[tableId]; // 取得表格对象
        var versionTitleCell = table.rows[0].cells[0]; // 取得表格首个单元格，用于放筛选下拉框
        table.id = "table_" + versionTitleCell.textContent.trim().replace(" ", "_"); // 为表格设置 id ，方便后续定位对象
        var versions = ["Show All"]; // 存放表格内“系统版本号”数据
        for (let rowId = 2; rowId < table.rows.length; rowId++){
            var firstCellText = table.rows[rowId].cells[0].textContent.trim(); // 取得每行第一个单元格文本
            const versionRegex = /^\d+\.\d+(\.\d+)?$/;
            if (versionRegex.test(firstCellText)){ // 判断是否满足版本号格式
                versions.push(firstCellText); // 满足则添加到版本号列表
            }
        }
        const selectElement = document.createElement('select'); // 创建下拉框对象
        const brElement = document.createElement('br'); // 添加个换行对象
        selectElement.id = "dropdown_" + versionTitleCell.textContent.trim().replace(" ", "_"); // 给下拉框绑定 id
        selectElement.addEventListener('change', function(event) { // 绑定值变化的事件及触发的函数
            selectChanged(event);
        });
        versions.forEach(option => { // 将各个版本号插件下拉框选项并且添加到下拉框对象中
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
        });
        versionTitleCell.appendChild(brElement);
        versionTitleCell.appendChild(selectElement); // 添加下拉框对象到表格首个单元格
    }

    /***
    * 触发事件后找到对应的数据表格，然后判断行号
    */
    function selectChanged(event){ // 定义下拉框值变化触发的函数
        var selectId = event.target.id; // 触发事件的下拉框 id
        var value = event.target.value; // 变化后的值
        var table = document.getElementById(selectId.replace("dropdown_", "table_")); // 找到对应表格
        if (value === "Show All"){ // 选项值是显示全部就把各行的 hidden 参数设置为 false 以显示所有行
            for (let rowId = 2; rowId < table.rows.length; rowId++){
                table.rows[rowId].hidden = false;
            }
        } else {
            var rowIdMax = 99999999; // 定义一个最大数据行号备用，超过此行号后的行不显示
            var foundFlag = false; // 定义一个标志位，意味着找到了对应系统版本号的行（当标志位为 true 期间展示对应行）
            for (let rowId = 2; rowId < table.rows.length; rowId++){
                if (rowId >= rowIdMax ){ foundFlag = false ;} // 超过数据最大行号后把标志位置为 false
                var firstCell = table.rows[rowId].cells[0]; // 每行第一个 td
                var firstCellText = firstCell.textContent.trim(); // 取得其内文本
                if (firstCellText === value){ // 第一个 td 文本等于下拉框当前值后设置最大数据行号并且将标志位置为 true
                    rowIdMax = rowId + firstCell.rowSpan;
                    foundFlag = true;
                }
                if (foundFlag) { // 根据标志位确定当前行显示与否
                    table.rows[rowId].hidden = false;
                } else {
                    table.rows[rowId].hidden = true;
                }
            }
        }
    }
})();
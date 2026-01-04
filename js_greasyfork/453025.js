// ==UserScript==
// @name         生意参谋复制
// @namespace    http://sycm.taobao.com/
// @icon         https://img.alicdn.com/tps/TB14m1NKFXXXXXMaXXXXXXXXXXX-48-48.ico
// @version      0.1.4
// @description  天猫生意参谋推广费一键复制
// @author       You
// @match        *://sycm.taobao.com/*
// @grant    GM_registerMenuCommand
// @grant    GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453025/%E7%94%9F%E6%84%8F%E5%8F%82%E8%B0%8B%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/453025/%E7%94%9F%E6%84%8F%E5%8F%82%E8%B0%8B%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const INCLUDES = ['万相台花费','直通车花费','引力魔方花费','淘宝客佣金'];

    function getData(area) {
        // 标题区域
        let title = area.getElementsByClassName("ant-table-thead")[0];
        // 日期列表
        let dataLabel = title.getElementsByClassName("dateLabel");
        let result = ``;
        for(let i=0;i<dataLabel.length;i++){
            let temp = dataLabel[i].innerText;
            result =`${temp}\t${result}`;
        }
        return `日期\t${result}`;
    }

    function getValue(area) {
        // 数据区
        let row = area.getElementsByClassName("ant-table-row  ant-table-row-level-0");
        // 遍历测试
        let result = ``;
        for(let i=0;i<18;i++){
            let cells = row[i].getElementsByClassName("ant-table-fixed-columns-in-body");
            let title = ``;
            if (cells.length>1){
                title = cells[1].innerText;
            }else{
                title = cells[0].innerText;
            }
            if (!INCLUDES.includes(title)){
                continue;
            }
            console.log(title);
            let temp = ``;
            let values = row[i].getElementsByClassName("value");
            for(let j=0;j<values.length;j++){
                temp = `${values[j].innerText}\t${temp}`;
            }
            temp = `${title}\t${temp}`;
            console.log(temp);
            result = `${result}\n${temp}`;
        }
        return result;
    }

    function coverToeVrtical(s) {
        let data = function(){
            let result = [];
            let rows = s.split("\n");
            for (const row of rows){
                result.push(row.split("\t"));
            }
            return result;
        }();
        let result = function () {
            let result = ``;
            let slen = data[0].length;
            for (let i=0;i<slen;i++){
                for(const row of data){
                    result += `${row[i]}\t`;
                }
                result += "\n";
            }
            return result;
        }();
        return result;
    }

    function getPay() {
        // 报表区域
        let area = document.getElementsByClassName("table-container")[0];
        // 获取日期部分
        let aData = getData(area);
        let aValue = getValue(area);
        let rel = aData+aValue
        // 返回字符串
        return coverToeVrtical(rel);
    }

    GM_registerMenuCommand("一键复制推广数据",function(){
        GM_setClipboard(getPay());
        alert("复制成功");
    });
})();
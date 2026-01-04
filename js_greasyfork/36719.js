// ==UserScript==
// @name         企业监管信息
// @namespace    http://114.215.104.68
// @version      0.1.3
// @description  扩展监管信息页面
// @author       IPE_he
// @match        http://oa.ipe.org.cn:89/sitemanage/*
// @grant        none
//@updateURL     https://greasyfork.org/zh-CN/scripts/36719-%E4%BC%81%E4%B8%9A%E7%9B%91%E7%AE%A1%E4%BF%A1%E6%81%AF
// @downloadURL https://update.greasyfork.org/scripts/36719/%E4%BC%81%E4%B8%9A%E7%9B%91%E7%AE%A1%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/36719/%E4%BC%81%E4%B8%9A%E7%9B%91%E7%AE%A1%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var s = document.getElementsByClassName('recordView');    //定位到‘查看’属性
    //企业列表是页面上第10个表
    var allTbody = document.getElementsByTagName('tbody');
    var s1 = allTbody[9];
    var recordHtml = '<div><span>fdsfsd</span></div>';
    var newHtml;
    var htmlList = [];
    function MyinsertRow(tbodyname) {
        for (let i = 1, l = tbodyname.rows.length; i < l; i = i + 1) {
            var newRow = tbodyname.insertRow(i * 2);
            newRow.style.height = '100px';
            var newCell = newRow.insertCell(0);
            newCell.colSpan = '11';
            getRviewHtml(s[i - 1], newCell);
            //console.log(i-1);
            //console.log(htmlList.length);  //显示为0
            //newCell.innerHTML = newHtml;
        }
    }

    function formatHtml(oldrViewhtml) {
        var oldTr = oldrViewhtml.getElementsByTagName('td');
        //直接取2,3(信用代码);4,5（机构代码）;6,7（地址）;12,13（违法事实）；14,15（处罚手段）；18,19监管记录来源；最后是详情17；获取值，然后填入新的单元格中，详情直接填入innerHTML。试试
        //建立第一行，6单元格
        var tab0 = document.createElement('table');
        var tr0_0 = tab0.insertRow();
        var cell_0 = tr0_0.insertCell();
        var cell_1 = tr0_0.insertCell();
        cell_0.innerText = oldTr[2].innerText;
        cell_1.innerText = oldTr[3].innerText;

        var cell_2 = tr0_0.insertCell();
        var cell_3 = tr0_0.insertCell();
        cell_2.innerText = oldTr[4].innerText;
        cell_3.innerText = oldTr[5].innerText;

        var cell_4 = tr0_0.insertCell();
        var cell_5 = tr0_0.insertCell();
        cell_4.innerText = oldTr[6].innerText;
        cell_5.innerText = oldTr[7].innerText;
        //建立第二行，6单元格
        var tr0_1 = tab0.insertRow();
        var cell_6 = tr0_1.insertCell();
        var cell_7 = tr0_1.insertCell();
        cell_6.innerText = oldTr[12].innerText;
        cell_7.innerText = oldTr[13].innerText;

        var cell_8 = tr0_1.insertCell();
        var cell_9 = tr0_1.insertCell();
        cell_8.innerText = oldTr[14].innerText;
        cell_9.innerText = oldTr[15].innerText;

        var cell_10 = tr0_1.insertCell();
        var cell_11 = tr0_1.insertCell();
        cell_10.innerText = oldTr[oldTr.length - 24].innerText;
        cell_11.innerText = oldTr[oldTr.length - 23].innerText;
        //建立第二个表格，存放监管详情，为了增加导航条，所以放在div里
        var div0 = document.createElement('div');
        var tab1 = document.createElement('table');
        var tr1_0 = tab1.insertRow();
        var cell_12 = tr1_0.insertCell();
        cell_12.innerHTML = oldTr[17].innerHTML;
        div0.appendChild(tab1);
        //CSS这个改变不知道对不对
        //div0.style.cssText = 'height : 200px; overflow-y: scroll;'
        div0.style.height = '200px';
        div0.style.overflowY = 'scroll';
        var tab0_parent = document.createElement('table');
        var div0_parent = document.createElement('div');
        tab0_parent.appendChild(tab0);
        div0_parent.appendChild(div0);
        tab0_parent.bgColor = '#cccccc';
        return tab0_parent.innerHTML + div0_parent.innerHTML; //因为取的是包含的HTML元素，这样会导致最外层的一个标签作为容器本身的元素而不被传递
    }

    function callback(result,newCell) {
        //code that depends on 'result'
        var recordHtml = result;
        var newHtml = formatHtml(recordHtml);
        htmlList.push(newHtml);
        newCell.innerHTML = newHtml;
    }

    function getRviewHtml(recordViewVal,newCell) {
        var xh = new XMLHttpRequest();
        xh.onload = function () {
            callback(xh.response,newCell);
        };
            //return recordHtml;
        xh.open('get', recordViewVal.href, true);
        xh.responseType = 'document';
        xh.send(null);
    }
    MyinsertRow(s1);
    //getRviewHtml(s[0]);
})();
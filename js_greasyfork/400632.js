// ==UserScript==
// @name         vcsource
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       liangdong
// @match        https://data.cvsource.com.cn/cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400632/vcsource.user.js
// @updateURL https://update.greasyfork.org/scripts/400632/vcsource.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var allCsvTxt = "";

    var fixedColumn1 = "";
    var fixedColumn2 = "";
    var fixedColumn3 = "";

    var getFixedColumn = function (index) {
        var fixedElements = document.querySelectorAll(".ant-table-fixed-left")[1].querySelectorAll(".ant-table-row");
        return fixedElements[index - 1].innerText;
    }

    var getAllFieldText = function () {
        // 固定列元素
        var fixedElements = document.querySelectorAll(".ant-table-fixed-left")[1].querySelectorAll(".ant-table-row");
        var scrollElements = document.querySelectorAll(".ant-table-scroll")[1].querySelectorAll(".ant-table-row");

        var totalNum = fixedElements.length;
        if (totalNum <= 0) {
            return;
        }

        var extSize = 0;
        var cloumnText = "";
        var columnSize = 0;
        var i = 0;
        var j = 0;
        var k = 0;
        var thisCvsTxt = "";
        var ename = "";
        for (i = 0; i < totalNum; i++) {
            console.log("第" + (i+1)+ "行");

            thisCvsTxt = "";

            ename = fixedElements[i].innerText;
            ename = ename.split("\n");
            // 简称
            thisCvsTxt += "\"";
            thisCvsTxt += ename[ename.length - 3];
            thisCvsTxt += "\",";

            // 全称
            thisCvsTxt += "\"";
            thisCvsTxt += ename[ename.length - 1];
            thisCvsTxt += "\",";

            // 滚动列

            //总列数
            columnSize = scrollElements[i].querySelectorAll("td").length;
            for (j = 1; j < columnSize; j++) {
                // 判断是否...
                extSize = scrollElements[i].querySelectorAll("td")[j].querySelectorAll(".ant-tooltip-inner>div>div").length;
                cloumnText = "";
                if (extSize == 0) {
                    // 没有额外的，只有文字
                    // console.log("正常文字");
                    cloumnText = scrollElements[i].querySelectorAll("td")[j].innerText;
                } else {
                    for (k = 0; k < extSize; k++) {
                        cloumnText += scrollElements[i].querySelectorAll("td")[j].querySelectorAll(".ant-tooltip-inner>div>div")[k].innerText;
                        if(k != extSize -1){
                            cloumnText += "\r\n";
                        }
                    }
                    console.log("第"+(j+1)+"列");
                    console.log("！！额外文字");
                    console.log(cloumnText);
                }

                thisCvsTxt += "\"";
                thisCvsTxt += cloumnText;
                thisCvsTxt += "\",";
            }

            thisCvsTxt = thisCvsTxt.substring(0, thisCvsTxt.length - 1);
            thisCvsTxt += "\r\n";
            //console.log(thisCvsTxt);

            allCsvTxt += thisCvsTxt;
            //console.log(allCsvTxt);
        }
    }

    var save = function () {
        //encodeURIComponent解决中文乱码
        let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(allCsvTxt);
        //通过创建a标签实现
        let link = document.createElement("a");
        link.href = ret;
        //对下载的文件命名
        link.download = "json数据表.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function replaceAll(str, oldSubStr, newSubStr) {
        if (str != null && oldSubStr != null && newSubStr != null) {
            return str.replace(new RegExp(oldSubStr, 'gm'), newSubStr)
        }
    }

    function fake_click(obj) {
        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent(
            "click", true, false, window, 0, 0, 0, 0, 0
            , false, false, false, false, 0, null
        );
        obj.dispatchEvent(ev);
    }

    function export_raw(name, data) {
        data = "\ufeff" + data;
        var urlObject = window.URL || window.webkitURL || window;

        var export_blob = new Blob([data]);

        var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = name;
        fake_click(save_link);
    }

    function getCurrentPage() {
        return parseInt(document.querySelectorAll(".ant-pagination-item-active")[document.querySelectorAll(".ant-pagination-item-active").length - 1].innerText || 0);
    }

    function getTotalpage() {
        return parseInt(document.querySelectorAll(".ant-pagination-item")[document.querySelectorAll(".ant-pagination-item").length - 1].innerText || 0);
    }

    function clickNext() {
        document.querySelectorAll(".ant-pagination-next")[document.querySelectorAll(".ant-pagination-next").length - 1].click();
    }

    function checkSameText() {
        var col1 = getFixedColumn(1);
        var col2 = getFixedColumn(2);
        var col3 = getFixedColumn(3);
        if(col1 == fixedColumn1 && col2 == fixedColumn2 && col3 == fixedColumn3){
            return true;
        }

        fixedColumn1 = col1;
        fixedColumn2 = col2;
        fixedColumn3 = col3;

        return false;
    }

    function main() {
        var totalpage = getTotalpage();

        var intval = setInterval(function () {
            if(!checkSameText()){
                // 内容不重复
                //获取内容
                var currentPage = getCurrentPage();
                console.log("第" + currentPage + "页，共" + totalpage + "页");
                getAllFieldText();

                if(currentPage < totalpage){
                    // 不是最后一页
                    // 点击下一页
                    console.log("下一页")
                    clickNext();
                } else {
                    // 最后一页完成了
                    clearInterval(intval);
                    alert("全部读取完毕，按确定导出文件");
                    export_raw("data.csv", allCsvTxt);
                }

            }


        }, 1000)

    }

    document.onkeydown = function(event){
        var e = event || window.event;
        if (e.keyCode == 123 && e.ctrlKey) {
            main();
        }
    }

})();
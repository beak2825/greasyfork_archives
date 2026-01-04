// ==UserScript==
// @name         批量下载360测评报告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  批量下载360测评报告1.1
// @author       WJX问卷星
// @match        https://www.wjx.cn/newwjx/activitystat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=natapp4.cc
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439803/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD360%E6%B5%8B%E8%AF%84%E6%8A%A5%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/439803/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD360%E6%B5%8B%E8%AF%84%E6%8A%A5%E5%91%8A.meta.js
// ==/UserScript==

//自动下载相关代码
try {
    function zutodown() {
        if (window.location.href.indexOf("autodown=1") == -1) return;
        window.curidx = 4;
        openall_pic();
        if (window.location.href.indexOf("view360report.aspx") > -1)
            GenerateReport(1);
        else
            GenerateReport();
        if ($(".layui-layer-iframe iframe")[0]) {
            setTimeout(function () {
                $(".layui-layer-iframe iframe")[0].contentWindow.document.getElementById('ddlPaper_1').click();
                $(".layui-layer-iframe iframe")[0].contentWindow.document.getElementById('btnSubmit').click();
            }, 1000)
        }
        setTimeout(function () {
            window.close()
        }, 8000)
        return;
    }
    function openautodownweb(index) {
        if (window.location.href.indexOf("batchdown=1") == -1) return;
        console.log(index)
        setTimeout(function () {
            var linkarr = $("#ctl02_ContentPlaceHolder1_divTotalReport > div > div.table_scroll > table .que_td a").toArray();
            if (linkarr.length == 0 || !linkarr[index]) return;
            var link = linkarr[index].href + "&autodown=1";
            window.open(link);
            index++;
            if (index < linkarr.length)
                openautodownweb(index);
        }, 1000)
    }
    $(function () {
        openautodownweb(0);
        zutodown();
    })
} catch (ex) { }
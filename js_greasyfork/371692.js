// ==UserScript==
// @name         提取bilibili视频链接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  从网页中格式化输出所需内容。
// @author       陈庚
// @match        https://space.bilibili.com/*
// @grant        none
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/371692/%E6%8F%90%E5%8F%96bilibili%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/371692/%E6%8F%90%E5%8F%96bilibili%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==



'use strict';

$("body").prepend("<button onclick='myF()'>点我</button>");


window.myF = function () {
    var myArr = new Array();
    var i = 0;
    //alert($(".cube-list").find("a.title").length);
    var str = $(".cube-list").find("a.title").each(function () {
        myArr[i] = $(this).attr("href");
        i++;
    });


    function arrayToCsv(data, args = {}) {
        let columnDelimiter = args.columnDelimiter || ',';
        let lineDelimiter = args.lineDelimiter || '\n';

        return data.reduce((csv, row) => {
            const rowContent = Array.isArray(row) ? row.reduce((rowTemp, col) => {
                let ret = rowTemp ? rowTemp + columnDelimiter : rowTemp;
                if (col) {
                    let formatedCol = col.toString().replace(new RegExp(lineDelimiter, 'g'), ' ');
                    ret += /,/.test(formatedCol) ? `"${formatedCol}"` : formatedCol;
                }
                return ret;
            }, '') : row;
            return (csv ? csv + lineDelimiter : '') + rowContent;
        }, '');
    }

    const BOM = '\uFEFF';

    function exportCsv(inputData, filename = 'export.csv') {
        const csv = arrayToCsv(inputData);

        if (navigator.msSaveOrOpenBlob) {
            let blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            let uri = encodeURI(`data:text/csv;charset=utf-8,${BOM}${csv}`);
            let downloadLink = document.createElement('a');
            downloadLink.href = uri;
            downloadLink.download = filename;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    }

    exportCsv(myArr);
}
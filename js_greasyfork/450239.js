// ==UserScript==
// @name         save table
// @namespace    http://tampermonkey.net/
// @version      0.5
// @match        http://fvp-showtool.sf-express.com/*
// @match        http://fvp-showtool.sit.sf-express.com/*
// @description  help someone save html table to xls easy~
// @author       vector
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450239/save%20table.user.js
// @updateURL https://update.greasyfork.org/scripts/450239/save%20table.meta.js
// ==/UserScript==
(function () {

    var tableId = "hello"

    function HtmlExportToExcel(tableid, filename) {
        if (getExplorer() === 'ie' || getExplorer() === undefined) {
            console.warn("自动保存xls暂不支持IE");
        } else {
            HtmlExportToExcelForEntire(tableid, filename)
        }
    }

    function getExplorer() {
        var explorer = window.navigator.userAgent;
        //ie
        if (explorer.indexOf("MSIE") >= 0) {
            return 'ie';
        }
        //firefox
        else if (explorer.indexOf("Firefox") >= 0) {
            return 'Firefox';
        }
        //Chrome
        else if (explorer.indexOf("Chrome") >= 0) {
            return 'Chrome';
        }
        //Opera
        else if (explorer.indexOf("Opera") >= 0) {
            return 'Opera';
        }
        //Safari
        else if (explorer.indexOf("Safari") >= 0) {
            return 'Safari';
        }
    }



    var HtmlExportToExcelForEntire = (function () {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style>table td {font-size: 12px;width: 200px;height: 30px;text-align: center;border:1px 1px;}</style></head><body><table border="1">{table}</table></body></html>',
            base64 = function (s) {
                return window.btoa(unescape(encodeURIComponent(s)))
            },
            format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                    return c[p];
                })
            }
        return function (table, name) {
            if (!table.nodeType) {
                table = document.getElementById(table);
            }
            // table.style='mso-number-format:@'
            fillt(table);

            var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
            var a = document.createElement("a");
            a.href = uri + base64(format(template, ctx));
            a.download = name + ".xls";
            a.click();
        }
    })()

    function fillt(table) {

        var tds = table.getElementsByTagName("td")
        for (let i = 0; i < tds.length; i++) {
            tds[i].innerText = '`'+tds[i].innerText
            // tds[i].style="mso-number-format: @;"
            // tds[i].style='margin: 0 8px;color:blue;cursor:pointer;'
        }
    }


    function genBtn() {
        var btn = document.createElement('input');
        btn.className = 'size2';
        btn.style = 'margin-left: 10px; background-color: #73bcfc';
        btn.value = '下载到本地';
        btn.type = "button";
        btn.onclick = function () {
            var input = document.querySelector("#FactRouteAllTrack_waybillNo")
            var wo = input.value; // 单号
            var type =  document.querySelector("#type").value;

            var xlsname;
            if (!wo) {
                window.confirm("请输入单号查询");
                return;
            }
            xlsname = wo;
            if (type) {
                xlsname = wo + '_' + type;
            }
            //下载整个表格
            HtmlExportToExcel(tableId, xlsname);
        };
        return btn;
    }

    function createDownloadBtn() {
        var dom = document.querySelector("#query fieldset");
        if (dom) {
            dom.lastChild.appendChild(genBtn())
        }
    }

    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    setTimeout(function () {
        createDownloadBtn()
    }, 1000);

    // createDownloadBtn();
})();
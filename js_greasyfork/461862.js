// ==UserScript==
// @name         click table and download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @include      *
// @description  help someone save html table to xls easy~
// @author       vector
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461862/click%20table%20and%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/461862/click%20table%20and%20download.meta.js
// ==/UserScript==
(function () {


    function HtmlExportToExcel(tableEle, filename) {
        if (getExplorer() === 'ie' || getExplorer() === undefined) {
            console.warn("自动保存xls暂不支持IE");
        } else {
            HtmlExportToExcelForEntire(tableEle, filename)
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
        return function (tableEle, name) {
            table = tableEle
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
            tds[i].innerText = '`' + tds[i].innerText
        }
    }


    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function genAllTableBtn() {
        let htmlTableElements = document.querySelectorAll('table');
        console.log('find ', htmlTableElements.length, 'table ele')
        confirm('current page find' + htmlTableElements.length + ' table')
        htmlTableElements.forEach((v, k, p) => {
            v.style.border = 'groove';
            // this.border = 'groove';

            v.onclick = function () {
                const tableId = this.getAttribute('id');
                console.log(tableId)
                // todo 等待增加蒙版效果
                HtmlExportToExcel(v, guid());
            };


        })

    }

    function setBtn() {
        const btnhtml = `<div id="bdbox" style="box-shadow: 0 0 6px 3px #00000038;z-index: 99999997;bottom: 100px;position: fixed;right: 50px;background: #fff;padding: 0 10px;border-radius: 5px;"><div id="bddown" style="text-align: center;font-size: 14px;padding: 8px 15px;background: #54be99;color: #fff;margin: 10px 0;border-radius: 3px;">准备下载</div></div>`;
        document.body.insertAdjacentHTML('afterbegin', btnhtml);
        document.querySelector("#bddown").onclick = (event) => {
            console.log("为每个表格生成一个下载按钮")
            genAllTableBtn()
        }
    }

    setTimeout(function () {
        setBtn();
    }, 1000);

})();
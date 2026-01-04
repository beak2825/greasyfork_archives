// ==UserScript==
// @name         八一农大课程表提取
// @namespace    io.longhorn3683.script.byaucourse
// @version      2025-04-28
// @description  支持导入WakeUp课程表
// @author       Longhorn3683
// @match        http://10.1.4.41/jsxsd/kbcx/kbxx_xzb
// @match        https://http-10-1-4-41-80.webvpn.byau.edu.cn/jsxsd/kbcx/kbxx_xzb
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @homepage     https://longhorn3683.github.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534058/%E5%85%AB%E4%B8%80%E5%86%9C%E5%A4%A7%E8%AF%BE%E7%A8%8B%E8%A1%A8%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/534058/%E5%85%AB%E4%B8%80%E5%86%9C%E5%A4%A7%E8%AF%BE%E7%A8%8B%E8%A1%A8%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var data = [
        ["课程名称", "星期", "开始节数", "结束节数", "老师", "地点", "周数"],
    ];

    let className;

    var downloadButton = document.createElement("input");
    downloadButton.type = "button";
    downloadButton.value = "导出课表";
    downloadButton.style = "margin-top: 5px;margin-bottom: 5px;";
    downloadButton.className = "button el-button";

    var tutorial = document.createElement("div");
    tutorial.innerHTML = '先查询班级再点击导出课表按钮，该按钮会导出查询到的第一个班级的课表';

    var queryButton = document.getElementById("Form1");
    queryButton.appendChild(tutorial);
    queryButton.appendChild(downloadButton);

    downloadButton.onclick = function () {
        var iframeWindow = window.document.getElementById("fcenter").contentWindow;
        cell(iframeWindow.document.getElementsByTagName("td"));
        function cell(array){
            for(var i=44; i<86; i++) {
                course(array[i].getElementsByClassName("kbcontent1"));
                function course(array2){
                    className = array[43].innerText;
                    for(var j=0; j<array2.length; j++) {
                        let text = array2[j].innerText;
                        let result = text.replace(className, "").replace("\n\n", "\n");
                        const myArray = result.split("\n");
                        let name = myArray[0];
                        let day = (Math.floor((i-44)/6))+1;
                        let start = (((i-44)%6)+1)*2-1;
                        let end = (((i-44)%6)+1)*2;
                        let teacher = myArray[1].replace(" ", "").replace(/\(.*\)/, "");
                        let week = myArray[1].match(/(?<=\()(.+?)(?=\))/g);
                        let place = myArray[2];
                        console.log(data);
                        data = data.concat([[name, day, start, end, teacher, place, week[0].replace("周", "").replace(",", "、")]]);
                    }
                };
            }
        };
        var csv = convertToCSV(data);
        downloadCSV(csv);
    }

    function convertToCSV(data) {
        var csv = '';
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            for (var j = 0; j < row.length; j++) {
        var val = row[j] === null ? '' : row[j].toString();
                if (val.indexOf(',') !== -1 || val.indexOf('"') !== -1 || val.indexOf('\n') !== -1) {
                    val = '"' + val.replace(/"/g, '""') + '"';
                }
                if (j > 0) {
                    csv += ',';
                }
                csv += val;
            }
            csv += '\n';
        }
        return csv;
    }

    function downloadCSV(csv) {
        var link = document.createElement('a');
        link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        link.download = `${className}课表.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

})();
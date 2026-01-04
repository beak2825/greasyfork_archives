// ==UserScript==
// @name         财政部报告备案测试版
// @namespace    阿牧
// @version      0.1
// @description  测试
// @author       阿牧
// @license      MIT
// @match        http://acc.mof.gov.cn/home/
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/460374/%E8%B4%A2%E6%94%BF%E9%83%A8%E6%8A%A5%E5%91%8A%E5%A4%87%E6%A1%88%E6%B5%8B%E8%AF%95%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/460374/%E8%B4%A2%E6%94%BF%E9%83%A8%E6%8A%A5%E5%91%8A%E5%A4%87%E6%A1%88%E6%B5%8B%E8%AF%95%E7%89%88.meta.js
// ==/UserScript==

(function () {
    const dom = document.createElement("div");
    dom.innerHTML = "<hr>" + '以下是报告明细';
    document.getElementsByTagName("body")[0].append(dom);


    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://acc.mof.gov.cn/qrc/api/cpabreport/page');
    xhr.send("reportYear=2023&qrcStatus=1,C2&pageNo=1&pageSize=500");
    xhr.onload = function() {
        const res = JSON.parse(this.responseText);
        var rplists = res.data;
        var htmlstr = "";
        for(var i=0;i <rplists.length;i++){
            var rplist = rplists[i];
            htmlstr += "<tr height='50 px'>";
            htmlstr += "<td>" + rplist.clientName+ "</td>";
            htmlstr += "<td><a target='_blank' href='http://172.16.10.34:8000/oa/bbsj.php?rpnoid=" + rplist.fileNo+ "&rprq=" + rplist.reportDate+ "&fwmid=" + rplist.backNumber+ "' >" + rplist.fileNo+ "</a></td>";
            htmlstr += "<td>" + rplist.reportDate+ "</td>";
            htmlstr += "<td>" + rplist.backNumber+ "</td>";
            htmlstr += "</tr>";
        }
        const dom = document.createElement("div");
        dom.classname = 'fg1 gov-table-body';
        dom.innerHTML = "<table width='100%'><tr height='50 px'><td>单位</td><td>文号</td><td>日期</td><td>防伪</td></tr>" + htmlstr + "</table>";
        document.getElementsByTagName("body")[0].append(dom);
    };

})();
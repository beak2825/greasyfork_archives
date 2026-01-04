// ==UserScript==
// @name         QQ群群员数据导出
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  导出QQ群群员名称，QQ号等相关数据
// @author       bbbbbbw
// @match        https://qun.qq.com/member.html
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/379332/QQ%E7%BE%A4%E7%BE%A4%E5%91%98%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/379332/QQ%E7%BE%A4%E7%BE%A4%E5%91%98%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {

    var scrollInterval, groupSize, exportButton;

    exportButton = document.createElement('button');
    exportButton.innerHTML = '导出成员';
    exportButton.id = "exportFile";
    exportButton.style = "background-color: red;";

    setInterval(addExportButton, 200);

    function addExportButton() {
        if (document.getElementById("exportFile") === null) {
            document.getElementById("groupMemberTit").appendChild(exportButton);
            document.querySelector('#exportFile').addEventListener('click', startExporting);
        }
    }

    function startExporting() {
        if (document.getElementById("groupSelectResult").className.split(" ").includes("hide")) { // 全部群员
            groupSize = document.getElementById("groupMemberNum").innerHTML;
        } else { // 筛选过的群员
            groupSize = parseInt(document.getElementById("groupSelectResult").innerText.match("[0-9]+")[0]);
        }

        if (groupSize == 0) {
            alert("成员数为0，无法导出");
        } else {
            scrollInterval = setInterval(scroll, 200);
        }
    }

    function scroll() { // 加载全部
        var membersInfo = document.getElementById("groupMember").getElementsByTagName("tr");
        var noOfLastMember = membersInfo[membersInfo.length - 1].getElementsByTagName("td")[1].innerHTML;
        scrollBy(0, 500);
        if (groupSize == noOfLastMember) {
            clearInterval(scrollInterval);
            scrollTo(0, 0);
            getMemberInfo();
        }
    }

    function getMemberInfo(){
        var inValue = "成员,成员类别,群名片,QQ号,性别,Q龄,入群时间,等级(积分),最后发言,\n";
        var allMembersInfo = document.getElementById("groupMember").getElementsByTagName("tr");
        for (var i=1; i<allMembersInfo.length; i++) {
            var tempMember = allMembersInfo[i].getElementsByTagName("td");
            for (var j=2; j<=9; j++) {
                inValue += tempMember[j].innerText + ",";
                if (j == 2) {
                    if (tempMember[j].getElementsByClassName("group-master-a").length == 1) {
                        inValue += "群主,"
                    } else if (tempMember[j].getElementsByClassName("group-manage-a").length == 1) {
                        inValue += "管理员,"
                    } else {
                        inValue += "群员,"
                    }
                }
            }
            inValue += "\n";
        }
        saveAsCsv(inValue);
    }

    function saveAsCsv(inValue) {
        var uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(inValue);
        var link = document.createElement("a");
        link.href = uri;
        link.download = "成员表.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
　　}
})();
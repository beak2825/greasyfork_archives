// ==UserScript==
// @name         列表增加AI按钮
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  在网页表格添加一个“AI审批”的按钮，点击按钮可快速跳转AI审批页面。
// @author       huxl
// @match        https://jwtz.ndrc.gov.cn/jwtz/todo_userAudit_getToDoUserAuditList*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508987/%E5%88%97%E8%A1%A8%E5%A2%9E%E5%8A%A0AI%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/508987/%E5%88%97%E8%A1%A8%E5%A2%9E%E5%8A%A0AI%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==




(function() {
    'use strict';
    // Your code here...
    setTimeout(aiApprove, 500);
})();

function aiApprove(){
    var table = document.getElementById('enterpriseList');
    if(table){
        var thead = table.getElementsByTagName('thead')[0]; // 获取第一个thead元素
        var tbody = table.getElementsByTagName('tbody')[0]; // 获取第一个tbody元素
        var newThHtml = '<th class="th sorting_disabled" width="120px" rowspan="1" colspan="1" style="width: 86px;"><span>操作</span></th>';
        // 创建新div元素
        var newTh = document.createElement('th');
        newTh.innerHTML = newThHtml;
        newTh.setAttribute('class', 'th sorting_disabled');
        newTh.setAttribute('width', '120px');
        newTh.setAttribute('rowspan', '1');
        newTh.setAttribute('colspan', '1');
        newTh.setAttribute('style', 'width: 86px;');
        // 将新div插入到已存在div的后面
        var tr = thead.getElementsByTagName('tr')[0];
        tr.appendChild(newTh);//表头增加一列


        // 获取tbody中的所有行
        var rows = tbody.getElementsByTagName('tr');

        // 遍历每一行
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            // 在这里处理每一行
            var a = row.getElementsByTagName('a')[0];
            var onclickValue = a.getAttribute('onclick');

            var aValue = onclickValue.replaceAll("preUserAudit('","https://test.fgw.sz.gov.cn:8002/aiOdi/aisChat/#/investmentReview?examine_id=").replaceAll("')","");
            //console.log(aValue); // 打印行的文本内容

            var newA = document.createElement('a');
            newA.setAttribute('class', 'btn-icon btn on');
            newA.setAttribute('target', '_blank');
            newA.setAttribute('href', aValue);
            newA.innerHTML = 'AI 比对';
            var newTd = document.createElement('td');
            newTd.appendChild(newA);
            row.appendChild(newTd);
        }
    }
}
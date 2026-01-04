// ==UserScript==
// @name         大学生毕业论文管理系统开题批量审阅脚本::co2.cnki.net
// @namespace    https://greasyfork.org/
// @version      0.52
// @description  知网大学生毕业论文管理系统
// @author       Lynn
// @match        https://co2.cnki.net/*
// @icon         https://co2.cnki.net/favicon.ico
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/480885/%E5%A4%A7%E5%AD%A6%E7%94%9F%E6%AF%95%E4%B8%9A%E8%AE%BA%E6%96%87%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E5%BC%80%E9%A2%98%E6%89%B9%E9%87%8F%E5%AE%A1%E9%98%85%E8%84%9A%E6%9C%AC%3A%3Aco2cnkinet.user.js
// @updateURL https://update.greasyfork.org/scripts/480885/%E5%A4%A7%E5%AD%A6%E7%94%9F%E6%AF%95%E4%B8%9A%E8%AE%BA%E6%96%87%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E5%BC%80%E9%A2%98%E6%89%B9%E9%87%8F%E5%AE%A1%E9%98%85%E8%84%9A%E6%9C%AC%3A%3Aco2cnkinet.meta.js
// ==/UserScript==

function openwin(title, te = "审核"){
    var ifra = document.querySelectorAll("[title='" + title + "']");
    var ifra2;
    var nestedDocument = ifra[0].contentDocument;
    var nestedDocument2;
    var nodelist = getNodeListByText(te, true, nestedDocument);
    for (var i = 0; i < nodelist.length; i++) {
        if (nodelist[i].matches("a.listA")) {
            /*nodelist[i].click();
            break;*/
            var hrefValue = nodelist[i].getAttribute("href");
            hrefValue = hrefValue.replace("javascript:", "");
            eval(hrefValue);
            /*            ifra2 = document.querySelectorAll("[title='题目详细信息']");
            nestedDocument2 = ifra2[0].contentDocument;*/
        }
    }
}

function openwinxq(title, te = "详情"){
    var ifra = document.querySelectorAll("[title='" + title + "']");
    var ifra2;
    var nestedDocument = ifra[0].contentDocument;
    var nestedDocument2;
    var nodelist = getNodeListByText(te, true, nestedDocument);
    for (var i = 0; i < nodelist.length; i++) {
        if (nodelist[i].matches("a.listA")) {
            /*nodelist[i].click();
            break;*/
            var hrefValue = nodelist[i].getAttribute("href");
            hrefValue = hrefValue.replace("javascript:", "");
            eval(hrefValue);
            /*            ifra2 = document.querySelectorAll("[title='题目详细信息']");
            nestedDocument2 = ifra2[0].contentDocument;*/
        }
    }
}

function openwin2(title, te = "审核"){
    var ifra = document.querySelectorAll("[title='" + title + "']");
    var ifra2;
    var nestedDocument = ifra[0].contentDocument;
    var nestedDocument2;
    var nodelist = getNodeListByText(te, true, nestedDocument);
    if (nodelist.length == 0 && te != "审核")
        nodelist = getNodeListByText("审核", true, nestedDocument);
    for (var i = 0; i < nodelist.length; i++) {
        if (nodelist[i].matches("a.listA")) {
            /*nodelist[i].click();
            break;*/
            var hrefValue = nodelist[i].getAttribute("onClick");
            //hrefValue = hrefValue.replace("javascript:", "");
            eval(hrefValue);
            /*            ifra2 = document.querySelectorAll("[title='题目详细信息']");
            nestedDocument2 = ifra2[0].contentDocument;*/
        }
    }
}

function openwin21(title, te = "审核") {
    const iframes = document.querySelectorAll("[title='" + title + "']");
    if (iframes.length === 0) return;

    const nestedDocument = iframes[0].contentDocument;
    const rows = nestedDocument.querySelectorAll("tr.datagrid-row");

    for (const row of rows) {
        const cell = row.querySelector('td[field="分配评阅专家成绩Text"] > div');
        const detailLink = row.querySelector('a.listA[onclick^="getIsTeaAppraise"]');

        if (cell && cell.textContent.trim() === "等待录入" && detailLink) {
            detailLink.click();
        }
    }
}

function openwin3(title, te = "审核") {
    const iframes = document.querySelectorAll("[title='" + title + "']");
    if (iframes.length === 0) return;

    const nestedDocument = iframes[0].contentDocument;
    const rows = nestedDocument.querySelectorAll("tr.datagrid-row");

    for (const row of rows) {
        const statusCell = row.querySelector('td[field="指导成绩意见是否录入"] > div');
        const detailLink = row.querySelector('a.listA[onclick^="getIsTeaAppraise"]');

        if (statusCell && statusCell.textContent.trim() !== "已录入" && detailLink) {
            detailLink.click();
        }
    }
}

function runInPageContext(code) {
    const script = document.createElement('script');
    script.textContent = code;
    document.body.appendChild(script);
    script.remove();
}

function passORfail(op,comment=""){
    var node;
    var nestedDocument;
    var text;
    if (op == 1)
    {
        text = "rdoPass0";
    }
    else
    {
        text = "rdoUnPass0"
    }
    var ifra = document.activeElement;
    nestedDocument = ifra.contentDocument;
    node = nestedDocument.getElementById(text);
    node.click();
    //node = nestedDocument.getElementById("txtAuditSuggest0");
    var iframeJ = ifra.contentWindow.jQuery;
    if (op == 1)
    {
        iframeJ('#txtAuditSuggest0').textbox("setText",comment);
    }

    node = nestedDocument.getElementById("btnSubmit0");
    node.click();
}

function suggestion(sel){
    var node;
    var nestedDocument;
    var text;
    var oldval;
    var ifra = document.activeElement;
    nestedDocument = ifra.contentDocument;
    //node = nestedDocument.getElementById("txtAuditSuggest0");
    var iframeJ = ifra.contentWindow.jQuery;

    oldval = iframeJ('#txtAuditSuggest0').textbox("getText");
    oldval += sel;
    iframeJ('#txtAuditSuggest0').textbox("setText",oldval);
}


function authTogether(title,comment="无"){
    var ifraList = document.querySelectorAll("[title='" + title + "']");
    var node;
    var nestedDocument;
    for (var i = 0; i < ifraList.length; i++) {
        nestedDocument = ifraList[i].contentDocument;
        node = nestedDocument.getElementById("rdoPass0");
        node.click();
        //node = nestedDocument.getElementById("txtAuditSuggest0");
        var iframeJ = ifraList[i].contentWindow.jQuery;
        iframeJ('#txtAuditSuggest0').textbox("setText",comment);
        node = nestedDocument.getElementById("btnSubmit0");
        node.click();
    }
}


function authTogether2(title,comment="无"){
    var ifraList = document.querySelectorAll("[title='" + title + "']");
    var node;
    var nestedDocument;
    for (var i = 0; i < ifraList.length; i++) {
        nestedDocument = ifraList[i].contentDocument;
        node = nestedDocument.getElementById("rdoPass0");
        node.click();
        //node = nestedDocument.getElementById("txtAuditSuggest0");
        var iframeJ = ifraList[i].contentWindow.jQuery;
        iframeJ('#txt_624_zdjsjy').textbox("setText",comment);
        node = nestedDocument.getElementById("btnSubmit0");
        node.click();
    }
}

function authTogether3(title){
    var ifraList = document.querySelectorAll("[title='" + title + "']");
    var node;
    var nestedDocument;
    for (var i = 0; i < ifraList.length; i++) {
        nestedDocument = ifraList[i].contentDocument;
        node = nestedDocument.getElementById("rdoPass0");
        node.click();
        //node = nestedDocument.getElementById("txtAuditSuggest0");
        //var iframeJ = ifraList[i].contentWindow.jQuery;
        //iframeJ('#txt_624_zdjsjy').textbox("setText",comment);
        //node = nestedDocument.getElementById("btnSubmit0");
        //node.click();
    }
}

function downloadAll(title,comment="无"){
    var ifraList = document.querySelectorAll("[title='" + title + "']");
    var node;
    var nestedDocument;
    var nodelist;
    for (var i = 0; i < ifraList.length; i++) {
        nestedDocument = ifraList[i].contentDocument;

        //node = nestedDocument.querySelectorAll("a.listA.margl");;
        node = getNodeListByText("下载毕业论文", false, nestedDocument);
        for (var j = 0; j < node.length; j++) {
            if (node[j].matches("a.listA.margl")) {
                eval(node[j].getAttribute("OnClick"))
/*                var hrefValue = eval(node.getAttribute("OnClick"));
                hrefValue = hrefValue.replace("javascript:", "");
                (hrefValue);*/
                break;
            }
        }
    }
}

/**
 * 修改版 addShutcut
 * 支持传入标题数组，优先匹配存在的标题
 */
function addShutcut(titles, comment = "该生毕业设计开题报告通过审核，建议继续推进研究和实施。") {
    // 1. 如果传入的是字符串，转换成数组；如果是数组则直接使用
    var titleArray = Array.isArray(titles) ? titles : [titles];
    var ifraList = [];

    // 2. 遍历标题数组，寻找第一个存在的 iframe 列表
    for (var k = 0; k < titleArray.length; k++) {
        ifraList = document.querySelectorAll("[title='" + titleArray[k] + "']");
        // 如果找到了对应的 iframe，就停止遍历，以此为准
        if (ifraList.length > 0) {
            break;
        }
    }

    // 3. 如果遍历完所有标题都没找到 iframe，直接返回
    if (ifraList.length === 0) return;

    // --- 以下保持原有逻辑不变 ---
    var nestedDocument;
    var node;
    var st = "150px";
    var button;
    for (var i = 0; i < ifraList.length; i++) {
        nestedDocument = ifraList[i].contentDocument;
        // 注意：这里需要确保 iframe 已经加载完成，否则 contentDocument 可能为空或找不到元素
        if (!nestedDocument) continue;

        node = nestedDocument.querySelector(".designTable_radio");
        if (node != null) {
            // 防止重复添加按钮 (可选优化，原脚本未做此判断，此处保持原样逻辑)

            button = nestedDocument.createElement("button");
            button.addEventListener('click', function() {
                passORfail(1,comment)});
            button.innerText = "通过";
            button.style.width = st;
            node.appendChild(button);

            button = nestedDocument.createElement("button");
            button.addEventListener('click', function() {
                suggestion("专有名词首字母应大写,缩写词应整体大写；")});
            button.innerText = "大小写";
            button.style.width = st;
            node.appendChild(button);

            button = nestedDocument.createElement("button");
            button.addEventListener('click', function() {
                suggestion("参考文献格式不规范或个数不足；")});
            button.innerText = "参考文献";
            button.style.width = st;
            node.appendChild(button);

            button = nestedDocument.createElement("button");
            button.addEventListener('click', function() {
                suggestion( "进度格式不规范或条目不足；")});
            button.innerText = "日期";
            button.style.width = st;
            node.appendChild(button);

            button = nestedDocument.createElement("button");
            button.addEventListener('click', function() {
                suggestion( "题目不合规范，")});
            button.innerText = "题目";
            button.style.width = st;
            node.appendChild(button);

            button = nestedDocument.createElement("button");
            button.addEventListener('click', function() {
                passORfail(0)});
            button.innerText = "不通过";
            button.style.width = st;
            node.appendChild(button);
        }
    }
}

/**
 * 修改版 addShutcut2
 * 同样支持传入标题数组
 */
function addShutcut2(titles, comment = "该生毕业设计开题报告通过审核，建议继续推进研究和实施。") {
    // 1. 处理数组输入
    var titleArray = Array.isArray(titles) ? titles : [titles];
    var ifraList = [];

    // 2. 查找存在的 iframe
    for (var k = 0; k < titleArray.length; k++) {
        ifraList = document.querySelectorAll("[title='" + titleArray[k] + "']");
        if (ifraList.length > 0) {
            break;
        }
    }

    if (ifraList.length === 0) return;

    // --- 以下保持原有逻辑不变 ---
    var nestedDocument;
    var node;
    var nodeList;
    var st = "150px";
    var button;
    for (var i = 0; i < ifraList.length; i++) {
        nestedDocument = ifraList[i].contentDocument;
        if (!nestedDocument) continue;

        nodeList = nestedDocument.querySelectorAll(".designTable_radio");
        if (nodeList[1]!=null)
        {
            node = nodeList[1];
            button = nestedDocument.createElement("button");
            button.style.width = st;
            button.addEventListener('click', function() {
                passORfail(1,comment)});
            button.innerText = "通过";
            button.style.width = st;
            node.appendChild(button);

            button = nestedDocument.createElement("button");
            button.style.width = st;
            button.addEventListener('click', function() {
                suggestion("专有名词首字母应大写,缩写词应整体大写；")});
            button.innerText = "大小写";
            node.appendChild(button);

            button = nestedDocument.createElement("button");
            button.style.width = st;
            button.addEventListener('click', function() {
                suggestion("参考文献格式不规范或个数不足；")});
            button.innerText = "参考文献";
            node.appendChild(button);

            button = nestedDocument.createElement("button");
            button.style.width = st;
            button.addEventListener('click', function() {
                suggestion( "进度格式不规范或条目不足；")});
            button.innerText = "日期";
            node.appendChild(button);

            button = nestedDocument.createElement("button");
            button.addEventListener('click', function() {
                suggestion( "题目不合规范，")});
            button.innerText = "题目";
            button.style.width = st;
            node.appendChild(button);

            button = nestedDocument.createElement("button");
            button.style.width = st;
            button.addEventListener('click', function() {
                suggestion( "请修改后再次提交。")});
            button.addEventListener('click', function() {
                passORfail(0)});
            button.innerText = "不通过"
            node.appendChild(button);
        }
    }
}


function main() {
    var nodeList;
    var button;
    var st = "90px";
    nodeList = getNodeListByText("审核学生申报的题目");
    if (nodeList.length > 1)
    {
        for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i].matches("a.tabs-inner")) {
                nodeList[i + 1].innerText = "核审学生申报的题目";
                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {
                    openwin("审核学生申报的题目")});
                button.innerText = "点开所有审核   "
                nodeList[i].appendChild(button);
                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {authTogether("题目详细信息","该生毕业设计开题报告通过审核，建议继续推进研究和实施。")});
                button.innerText = "  全部自动审核";
                nodeList[i].appendChild(button);
            }
        }
    }
    nodeList = getNodeListByText("被分配审核任务书", );
    if (nodeList.length > 1)
    {
        for (i = 0; i < nodeList.length; i++) {
            if (nodeList[i].matches("a.tabs-inner")) {
                nodeList[i + 1].innerText = "分被配审核任务书";
                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {
                    openwin("被分配审核任务书")});
                button.innerText = "点开所有审核"
                nodeList[i].appendChild(button);

                button = document.createElement("button");
                //button.style.width = st;
                /*        button.addEventListener('click', function() {authTogether("任务书详细信息")});
        button.innerText = "全部自动审核"
        nodeList[i].appendChild(button);*/

                button = document.createElement("button");
                //button.style.width = st;
                button.addEventListener('click', function() {addShutcut("审核任务书详情","该生毕业设计任务书通过审核，建议继续推进研究和实施。")});
                button.innerText = "加按钮"
                nodeList[i].appendChild(button);


            }
        }
    }
    nodeList = getNodeListByText("审核任务书", );
    if (nodeList.length > 1)
    {
        for (i = 0; i < nodeList.length; i++) {
            if (nodeList[i].matches("a.tabs-inner")) {
                nodeList[i + 1].innerText = "核审任务书";
                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {
                    openwin("审核任务书")});
                button.innerText = "点开所有审核"
                nodeList[i].appendChild(button);

                button = document.createElement("button");
                //button.style.width = st;
                /*        button.addEventListener('click', function() {authTogether("任务书详细信息")});
        button.innerText = "全部自动审核"
        nodeList[i].appendChild(button);*/

                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {addShutcut(["审核任务书详情", "任务书详细信息", "查看任务书"],"该生毕业设计任务书通过审核，建议继续推进研究和实施。")});
                //button.addEventListener('click', function() {addShutcut("审核任务书详情","该生毕业设计任务书通过审核，建议继续推进研究和实施。")});
                button.innerText = "加按钮"
                nodeList[i].appendChild(button);
            }
        }
    }
    nodeList = getNodeListByText("审核题目", );
    if (nodeList.length > 1)
    {
        for (i = 0; i < nodeList.length; i++) {
            if (nodeList[i].matches("a.tabs-inner")) {
                nodeList[i + 1].innerText = "核审题目";
                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {
                    openwin2("审核题目","被分配审核")});
                button.innerText = "点开所有审核"
                nodeList[i].appendChild(button);

                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {authTogether("审核题目详情","该生毕业设计选题通过审核，建议继续推进研究和实施。")});
                button.innerText = "全部自动审核";
                nodeList[i].appendChild(button);


                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {addShutcut2("审核题目详情","该生毕业设计选题通过审核，建议继续推进研究和实施。")});
                button.innerText = "加按钮"
                nodeList[i].appendChild(button);
            }
        }
    }
    nodeList = getNodeListByText("需要修改的任务书等待处理");
    if (nodeList.length > 0)
    {
        for (i = 0; i < nodeList.length; i++) {
            if (nodeList[i].matches("a.tabs-inner")) {
                nodeList[i + 1].innerText = "要需修改的任务书等待处理";
                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {openwin("需要修改的任务书等待处理")});
                button.innerText = "点开所有审核"
                nodeList[i].appendChild(button);
                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {authTogether("任务书详细信息","该生毕业设计任务书通过审核，建议继续推进研究和实施。")});
                button.innerText = "全部自动审核"
                nodeList[i].appendChild(button);

                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {addShutcut("任务书详细信息","该生毕业设计任务书通过审核，建议继续推进研究和实施。")});
                button.innerText = "加按钮"
                nodeList[i].appendChild(button);
            }
                }
    }
    nodeList = getNodeListByText("审核开题报告");
    if (nodeList.length > 0)
    {
                for (i = 0; i < nodeList.length; i++) {
            if (nodeList[i].matches("a.tabs-inner")) {
        nodeList[i + 1].innerText = "核审开题报告";
        button = document.createElement("button");
        button.style.width = st;
        button.addEventListener('click', function() {openwin("审核开题报告")});
        button.innerText = "点开所有审核"
        nodeList[i].appendChild(button);
        button = document.createElement("button");
        button.style.width = st;
        button.addEventListener('click', function() {authTogether("任务书详细信息","该生毕业设计任务书通过审核，建议继续推进研究和实施。")});
        button.innerText = "全部自动审核"
        nodeList[i].appendChild(button);
        button = document.createElement("button");
        button.style.width = st;
        button.addEventListener('click', function() {authTogether("题目详细信息","该生毕业设计开题报告通过审核，建议继续推进研究和实施。")});
        button.innerText = "  全部自动审核";
        nodeList[i].appendChild(button);
        button = document.createElement("button");
        //button.style.width = st;
        button.addEventListener('click', function() {addShutcut("开题报告详情")});
        button.innerText = "加按钮"
        nodeList[i].appendChild(button);
            }
                }
    }
    nodeList = getNodeListByText("被分配审核开题报告");
    if (nodeList.length > 0)
    {
                for (i = 0; i < nodeList.length; i++) {
            if (nodeList[i].matches("a.tabs-inner")) {
        nodeList[i + 1].innerText = "被配分核审开题报告";
        button = document.createElement("button");
        button.style.width = st;
        button.addEventListener('click', function() {openwin("被分配审核开题报告")});
        button.innerText = "点开所有审核"
        nodeList[i].appendChild(button);
        button = document.createElement("button");
        button.style.width = st;
        button.addEventListener('click', function() {authTogether("开题报告详情","该生毕业设计开题报告通过审核，建议继续推进研究和实施。")});
        button.innerText = "全部自动审核"
        nodeList[i].appendChild(button);

        button = document.createElement("button");
        //button.style.width = st;
        button.addEventListener('click', function() {addShutcut("开题报告详情")});
        button.innerText = "加按钮"
        nodeList[i].appendChild(button);
            }
                }
    }
    nodeList = getNodeListByText("审核中期检查");
    if (nodeList.length > 0)
    {
                for (i = 0; i < nodeList.length; i++) {
            if (nodeList[i].matches("a.tabs-inner")) {
        nodeList[i + 1].innerText = "核审中期检查";
        button = document.createElement("button");
        button.style.width = st;
        button.addEventListener('click', function() {openwin("审核中期检查")});
        button.innerText = "点开所有审核"
        nodeList[i].appendChild(button);
        button = document.createElement("button");
        button.style.width = st;
        button.addEventListener('click', function() {authTogether2("中期检查详情","请加快进度完成毕设。")});
        button.innerText = "全部自动审核"
        nodeList[i].appendChild(button);

        button = document.createElement("button");
        //button.style.width = st;
        button.addEventListener('click', function() {addShutcut("中期检查详情")});
        button.innerText = "加按钮"
        nodeList[i].appendChild(button);
            }}
    }
        nodeList = getNodeListByText("审核毕业论文（设计）");
    if (nodeList.length > 0)
    {
        for (i = 0; i < nodeList.length; i++) {
            if (nodeList[i].matches("a.tabs-inner")) {
                nodeList[i + 1].innerText = "核审毕业论文（设计）";
                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {openwin("审核毕业论文（设计）")});
                button.innerText = "点开所有审核"
                nodeList[i].appendChild(button);

                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {authTogether3("毕业论文（设计）详情")});
                button.innerText = "全部点通过";
                nodeList[i].appendChild(button);

            }
                }
    }
    nodeList = getNodeListByText("导师评阅学生");

    if (nodeList.length > 0)
    {
        for (i = 0; i < nodeList.length; i++) {
            if (nodeList[i].matches("a.tabs-inner")) {
                nodeList[i + 1].innerText = "导师阅评学生";
                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {openwin3("导师评阅学生", "查看详情")});
                button.innerText = "点开所有查看详情"
                nodeList[i].appendChild(button);
                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {downloadAll("评阅专家成绩", "查看详情")});
                button.innerText = "全部下载"
                nodeList[i].appendChild(button);
                break;
            }
        }

    }

    nodeList = getNodeListByText("评阅学生");

    if (nodeList.length > 0)
    {
        for (i = 0; i < nodeList.length; i++) {
            if (nodeList[i].matches("a.tabs-inner")) {
                nodeList[i + 1].innerText = "阅评学生";
                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {openwin21("评阅学生", "查看详情")});
                button.innerText = "点开所有查看详情"
                nodeList[i].appendChild(button);
                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {downloadAll("评阅专家成绩", "查看详情")});
                button.innerText = "全部下载"
                nodeList[i].appendChild(button);
                break;
            }
        }
    }


    nodeList = getNodeListByText("审核指导记录");

    if (nodeList.length > 0)
    {
        for (i = 0; i < nodeList.length; i++) {
            if (nodeList[i].matches("a.tabs-inner")) {
                nodeList[i + 1].innerText = "核审指导记录";
                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {openwin("审核指导记录")});
                button.innerText = "点开所有审阅"
                nodeList[i].appendChild(button);
                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {authTogether("查看指导记录","该生指导记录正常，审核通过")});
                button.innerText = "全部自动审核"
                nodeList[i].appendChild(button);
                //break;
            }
        }

    }

    nodeList = getNodeListByText("审核毕业论文（设计）最终版");
        if (nodeList.length > 0)
    {
        for (i = 0; i < nodeList.length; i++) {
            if (nodeList[i].matches("a.tabs-inner")) {
                nodeList[i + 1].innerText = "核审毕业论文（设计）最终版";
                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {openwin("审核毕业论文（设计）最终版")});
                button.innerText = "所有详情"
                button.innerText = "所有审核"
                nodeList[i].appendChild(button);
                button = document.createElement("button");
                button.style.width = st;
                button.addEventListener('click', function() {authTogether("毕设（论文）详情","学生已按照盲审及答辩意见对论文进行修改，最终版论文格式规范，查重率符合要求，同意通过。")});
                button.innerText = "全部自动审核"
                nodeList[i].appendChild(button);
                //break;
            }
        }

    }

}


function getNodeByText(text, allEqual = true, doc = document, cssSelector = '*', ) {
    let targetNodeList = getNodeListByText(text, allEqual, doc, cssSelector);
    return (targetNodeList.length > 0) ? targetNodeList[0] : null;
}

/**
 * 获取给定文本和选择器对应的节点列表
 *
 * @param {string} text 目标文本
 * @param {string} cssSelector css选择器
 * @param {boolean} allEqual 全等
 * @return {array(domNode)} 文本和选择器对应的节点列表 没有时返回null
 */
function getNodeListByText(text, allEqual = true, doc=document, cssSelector = '*') {
    return Array.from(doc.querySelectorAll(cssSelector)).filter(v => allEqual ? (v.innerText == text) : v.innerText.includes(text));
}

console.log('script loaded');

var wait = (ms) => {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
        now = Date.now();
    }
}

let hrefChangeWatcher = setInterval(() => {
    main();
}, 100);

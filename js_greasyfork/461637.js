// ==UserScript==
// @name         XJTU ehall 成绩查询增强
// @namespace    https://github.com/MiracleHYH/Enhance-XJTU-EHALL
// @version      0.2
// @description  增加显示成绩详情以及排名信息
// @author       Miracle
// @match        http://ehall.xjtu.edu.cn/new/thirdAppIndexShell.html
// @match        http://ehall.xjtu.edu.cn/jwapp/sys/cjcx/*default/index.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.xjtu.edu.cn
// @grant        none
// @run-at       document-end
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/461637/XJTU%20ehall%20%E6%88%90%E7%BB%A9%E6%9F%A5%E8%AF%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/461637/XJTU%20ehall%20%E6%88%90%E7%BB%A9%E6%9F%A5%E8%AF%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

var $, grades = {};

function query_pm(info, data) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', 'http://ehall.xjtu.edu.cn/jwapp/sys/cjcx/modules/cjcx/jxbxspmcx.do', true);
    httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    httpRequest.send(data);
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            let res = JSON.parse(httpRequest.responseText).datas.jxbxspmcx.rows[0];
            info += `排名：${res.PM}/${res.ZRS}`;
            alert(info);
        }
    };
}

function query() {
    let courseId = $("#queryInfo_courseId").val();
    //console.log(grades[courseId])
    if (courseId.length == 0 || typeof(grades[courseId]) == 'undefined') {
        alert("课程号错误");
        return;
    }
    //console.log(courseId);
    //console.log(grades[courseId]);
    let info = ""
    let sycj = grades[courseId].SYCJ_DISPLAY.length>0 ? grades[courseId].SYCJ_DISPLAY : grades[courseId].SYCJ;
    if (sycj != null) info += `实验成绩：${sycj}\n`;
    let pscj = grades[courseId].PSCJ;
    if (pscj != null) info += `平时成绩：${pscj} --- ${grades[courseId].PSCJXS}%\n`;
    let qzcj = grades[courseId].QZCJ;
    if (qzcj != null) info += `期中成绩：${qzcj} --- ${grades[courseId].QZCJXS}%\n`;
    let qmcj = grades[courseId].QMCJ;
    if (qmcj != null) info += `期末成绩：${qmcj} --- ${grades[courseId].QMCJXS}%\n`;
    for (let i = 1; i <= 10; ++ i) {
        let qtcj = grades[courseId][`QTCJ${i}_DISPLAY`].length>0 ? grades[courseId][`QTCJ${i}_DISPLAY`] : grades[courseId][`QTCJ${i}`];
        if (qtcj != null) info += `其他成绩${i}：${qtcj}\n`;
    }
    info += `总成绩：${grades[courseId].ZCJ}\n`;
    query_pm(info, `JXBID=${grades[courseId].JXBID}&XNXQDM=${grades[courseId].XNXQDM}`);
}

function addQuery() {
    setTimeout(function(){
        $("article>section>div#cjcx-index-search").after($(
        '<div style="position: relative; z-index: 358;"><div class="bh-advancedQuery bh-mb-16" style="overflow: hidden;"><div class="bh-advancedQuery-quick"><div class="bh-advancedQuery-inputGroup bh-clearfix" style="padding-bottom: 8px;background: #fff;"><div class="bh-advancedQuery-quick-search-wrap"><input id="queryInfo_courseId" type="text" class="bh-form-control" placeholder="请输入课程号查询成绩详情"><i class="iconfont icon-search" style="position: absolute;left: 6px;top: 6px;"></i></div><a id="queryInfo" class="bh-btn bh-btn bh-btn-primary bh-btn-small">成绩详情查询</a></div></div></div></div>'
        ));
        $("#queryInfo").bind("click", query);
    }, 500);
}


function redirectToReal() {
    let url = document.getElementById("thirdpartyFrame").src;
    if (typeof(url) == 'undefined') {
        setTimeout(function(){redirectToReal()}, 500);
        return;
    }
    location.replace(url);
}

function main() {
    if ($("div.bh-headerBar-title").length == 0) {
        setTimeout(function(){main()}, 500);
        return;
    }
    $("div.bh-headerBar-title").text("成绩查询 增强版");
    $("div.bh-headerBar-nav-item.bh-active").bind('click', addQuery);

    addQuery()

    // 获取成绩
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'http://ehall.xjtu.edu.cn/jwapp/sys/cjcx/modules/cjcx/xscjcx.do', true);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            JSON.parse(httpRequest.responseText).datas.xscjcx.rows.forEach((item) => {
                grades[item.KCH] = item;
            });
        }
    };
}

(function() {
    'use strict';
    if (window.location.href == 'http://ehall.xjtu.edu.cn/new/thirdAppIndexShell.html') {
        setTimeout(function(){redirectToReal()}, 0);
    } else {
        $ = window.$;
        setTimeout(function(){main()}, 0);
    }
})();

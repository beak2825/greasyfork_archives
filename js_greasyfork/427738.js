// ==UserScript==
// @name         hjj sync-Jira
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Jira转测试时，自动填写内容。
// @author       HongJunJie
// @include      *://59.61.83.130:32080/*
// @grant        none
// require      https://www.jq22.com/demo/jQueryZoom20160828/js/zoom.js
// require      http://demo.htmleaf.com/1607/201607201705/js/lightense.js
// @downloadURL https://update.greasyfork.org/scripts/427738/hjj%20sync-Jira.user.js
// @updateURL https://update.greasyfork.org/scripts/427738/hjj%20sync-Jira.meta.js
// ==/UserScript==

// 分配动作
function assigneeClick(otherId) {
    var assignee = $('#assignee');
    assignee.val(otherId);
    assignee.change();
}

// 添加分配按钮
function addAssigneeBtn(commentAssignIssue) {
    var assignee = $('#assignee');
    var reporter = $("a[id^='issue_summary_reporter']");

    let reporterMap = new Map();
     //key相当于reporterId

    if (reporter.length > 0) { // 如果有报告人
        var reporterId   = reporter.attr("ID").replace("issue_summary_reporter_", "");
        var reporterName = reporter.text();
        reporterMap.set(reporterId, reporterName);
    }

    // map的使用
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map
    //reporterMap.set("sunting", "孙婷");
    reporterMap.set("zhenghongqin", "郑鸿钦");
    reporterMap.set("yanzhipeng", "闫志鹏");
    reporterMap.set("hehongsheng","何宏盛");
    reporterMap.set("hongshiming","洪世明");
    reporterMap.set("lushaochuan","卢少川");
    reporterMap.set("linliting", "林俐婷");
    reporterMap.set("zhongyan","钟艳");
    reporterMap.set("wangbaoyun", "王宝云");

    reporterMap.forEach(function(value, key) {
        assignee.after('&emsp;<a id="assignee2'+key+'" class="subText">' + value + '</a>&nbsp;');
        $('#assignee2'+key).click(function(){
            assigneeClick(key);
        });
    });
    if (commentAssignIssue) {
        $('#assignee2wangbaoyun').click(); // 设置事件并点击一下，需要将 reporterMap 最后一人设置为默认的转单人。
    }
}



(function() {
    var commentAssignIssue = $("h3.formtitle").text().trim() == "转测试";
    // 补充分配按钮
    addAssigneeBtn(commentAssignIssue);

    //"转测试"页面
    if (commentAssignIssue) {
        //缺陷归属
        var customfield_10050 = $("#customfield_10050");
        if (customfield_10050) {
            customfield_10050.val($("#customfield_10020").val());
            var now = new Date();
            $("#customfield_10061").val(now.getFullYear() + '年' + (now.getMonth() + 1) + '月');
        }

        //默认“解决:”
        $('[name="resolution"]').val("1");
    }

    //方便复制文本
    //description.before('<h3>'+window.location.href+'</h3>');
    $("#issue_header_summary b").after(" " + window.location.href);
    var description = $("#issue_header_summary .formtitle");
    description.text($("#issuedetails a[id*='issue_key_']").text() + " " + $("#issue_header_summary .formtitle").text());

    // TODO 图片查看器
    window.addEventListener('load', function () {
        var el = document.querySelectorAll('img');
        //Lightense(el);
    }, false);

    //备注
    $('label[for="comment"]').after('&emsp;<input type="button" id="addComment" class="lnk ico-add" value="插入模板"/>');
    $("#addComment").click(function(){
        var myDate = new Date();
        var comment = ''
        + '*开发始止时间：\n'
        + myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate() + ' - ' + myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate() + '\n'
        + '*是否存在脚本。\n'
        + '是\n'
        + '*是否存在参数配置。\n'
        + '是\n'
        + '*测试步骤特殊说明。\n'
        + '是\n'
        + '*缺陷原因、处理方式。\n'
        + '是\n'
        + '*是否可以复测。\n'
        ;
        $("#comment").val(comment);
    });
    //$('textarea#comment[rows="15"]').attr('rows', "7");

    //环境 environment
    if ($('textarea#environment').val() == '') {
        //$('textarea#environment').val('产业扶持3期');
    }

})();


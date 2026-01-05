// ==UserScript==
// @name          EasyAssess for HITwh
// @namespace     http://www.sdou.net
// @description   Assess all your instructors by one click.
// @require       http://libs.baidu.com/jquery/1.10.2/jquery.min.js
// @include       http://222.194.14.94:8080/*
// @author        Shindo
// @version       0.12
// @copyright     2016+, Shindo
// @downloadURL https://update.greasyfork.org/scripts/20601/EasyAssess%20for%20HITwh.user.js
// @updateURL https://update.greasyfork.org/scripts/20601/EasyAssess%20for%20HITwh.meta.js
// ==/UserScript==

var callbacks = {
    "stumain.aspx": callback_stuMain,
    "studetail.aspx": callback_stuDetail,
};

function callback_stuMain() {
    if ($(document.body).text().indexOf("没有需要评价的课程") != -1)
        return;

    var rules = [
        // "count": [人数下限, 人数上限], "rule": [极优, 优, 差, 良]
        {  "count": [1, 2],   "rule": [ 1, 0, 0, Number.MAX_SAFE_INTEGER ] },
        {  "count": [3, 4],   "rule": [ 1, 1, 0, Number.MAX_SAFE_INTEGER ] },
        {  "count": [5, 6],   "rule": [ 1, 2, 0, Number.MAX_SAFE_INTEGER ] },
        {  "count": [7, 9],   "rule": [ 1, 3, 0, Number.MAX_SAFE_INTEGER ] },
        {  "count": [10, 10], "rule": [ 2, 3, 0, Number.MAX_SAFE_INTEGER ] },
        {  "count": [11, 12], "rule": [ 2, 4, 1, Number.MAX_SAFE_INTEGER ] },
        {  "count": [13, 15], "rule": [ 2, 5, 1, Number.MAX_SAFE_INTEGER ] },
        {  "count": [16, 17], "rule": [ 3, 5, 1, Number.MAX_SAFE_INTEGER ] },
        {  "count": [18, 19], "rule": [ 3, 6, 1, Number.MAX_SAFE_INTEGER ] },
        {  "count": [20, Number.MAX_SAFE_INTEGER], "rule": [ 3, 7, 1, Number.MAX_SAFE_INTEGER ] }
    ];

    var ruleToRadioIndex = {
        0: 5, // 极优
        1: 4, // 优
        2: 1, // 差
        3: 3  // 良
    };

    $("#pro > tbody > tr:first").after(
        "<tr>" +
        "  <td><hr></td>" +
        "</tr>" +
        "<tr>" +
        "  <td style='text-align: center;'>" +
        "    <button id='oneClick_assess' type='button' style='color: blue; font-size: 14px;'>一键评教</button>" +
        "    <button id='oneClick_clear' type='button' style='font-size: 14px;'>清除所有</button>" +
        "  </td>" +
        "</tr>" +
        "<tr>" +
        "  <td id='oneClick_done' style='text-align: center; font-size: 14px;'></td>" +
        "</tr>"
    );

    $("#oneClick_clear").click(function() {
        var gridView = $("#GridView1");
        gridView.find("input[type=radio]").prop("checked", false);
    });

    $("#oneClick_assess").click(function() {
        var gridView = $("#GridView1");
        var cellCount = gridView.find("tbody > tr").length - 1;
        var internalCount = parseInt(gridView.find("tbody > tr:last > td:first").text());

        if (cellCount != internalCount) {
            alert("请刷新后重试！\n\n" +
                  "------------------Debug----------------\n" +
                  "[Info]\nAssert failed: cellCount == internalCount\n\n" +
                  "[Values]\ncellCount = " + cellCount + "\ninternalCount = " + internalCount);
            return;
        }

        for (var i = 0; i < rules.length; i++) {
            var count = rules[i].count;
            var rule = rules[i].rule.slice(0);

            if (count[0] <= cellCount && cellCount <= count[1]) {
                var remaining = cellCount;
                var assessResult = {};
                var assessRank = 0; // 从极优开始

                while (remaining > 0) {
                    var rand = Math.floor(Math.random() * cellCount);
                    if (assessResult[rand] === undefined) {
                        assessResult[rand] = assessRank;
                        remaining--;

                        if (--rule[assessRank] == 0) {
                            assessRank++;
                        }
                    }
                }

                var selections = gridView.find("tr").slice(1).find("td:last");
                if (selections.length != cellCount) {
                    alert("请刷新后重试！\n\n" +
                          "------------------Debug----------------\n" +
                          "[Info]\nAssert failed: selections.length == internalCount\n\n" +
                          "[Values]\nselections.length = " + selections.length + "\ninternalCount = " + internalCount);
                    return;
                }

                for (var j = 0; j < cellCount; j++) {
                    var spans = $(selections[j]).find("span");
                    spans.eq(ruleToRadioIndex[assessResult[j]])
                        .find("input[type=radio]:first").prop("checked", true);
                }

                $("#oneClick_done").html("<p style='color:green'>已按照评价比例要求随机勾选，点击\"<b>提交</b>\"按钮完成评教。</p>" +
                                         "<p style='color:blue'>如对随机评价结果不满意，请手动改选评价或再次点击\"<b>一键评教</b>\"。</p>");
            }
        }
    });
}

function callback_stuDetail() {
    if ($(document.body).text().indexOf("没有需要评价的课程") != -1)
        return;

    var rules = {
        // 选项个数: 要选中的option的value
        8: 5,
        5: 10,
    };

    $("table:last > tbody > tr:last").after(
        "<tr>" +
        "  <td><hr></td>" +
        "</tr>" +
        "<tr>" +
        "  <td style='text-align: center;'>" +
        "    <button id='oneClick_assess' type='button' style='color: blue; font-size: 14px;'>一键评教</button>" +
        "    <button id='oneClick_clear' type='button' style='font-size: 14px;'>清除所有</button>" +
        "  </td>" +
        "</tr>" +
        "<tr>" +
        "  <td id='oneClick_done' style='text-align: center; font-size: 14px;'></td>" +
        "</tr>"
    );

    $("#oneClick_clear").click(function() {
        $("select").each(function() {
            $(this).val(" -1");
        });
    });

    $("#oneClick_assess").click(function() {
        $("select").each(function() {
            var count = $(this).find("option").length;
            if (rules[count] !== undefined) {
                $(this).val(rules[count]);
            }
        });

        $("#oneClick_done").html("<p style='color:green'>已将全部分项评价为<b>极优<b>或<b>肯定会</b>，点击\"<b>提交</b>\"按钮完成评教。</p>" +
                                 "<p style='color:blue'>如对自动评价结果不满意，请手动改选评价。</p>");
    });
}

(function() {
    'use strict';

    for (var url in callbacks) {
        if (location.href.toLowerCase().indexOf(url) != -1)
            callbacks[url]();
    }
})();
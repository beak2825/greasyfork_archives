// ==UserScript==
// @name         鲤城自动答题
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  鲤城自动答题11
// @homepage https://greasyfork.org/zh-CN/scripts/427785
// @author       You
// @match        http://cs.homlin.com/*
// @icon         http://homlin.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427785/%E9%B2%A4%E5%9F%8E%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/427785/%E9%B2%A4%E5%9F%8E%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (self.frameElement != null) return;

    document.body.innerHTML = "";
    $("html").css("overflow", "hidden");
    $("body").append(`<div id="topTitle" style="padding:20px;display:block;font-size:24px;color:#FFFFFF;background-color:#e2231a;text-align:center">
    已完成<label id="thisWeekLabel">0</label>
    目标:<input type="tel" id="target" value="800" style="width:70px;">
    正确率:<input type="tel" id="accuracy" value="100" style="width:70px;">
    </div>
<a class="abtn" id="js_btn_start">开始工作</a>
<iframe src="http://cs.homlin.com/exam/unittest/index.htm" style="width:99%;height:800px" id="fr"></iframe>`);

    let running = false;
    let queryData = { type1: 40, type2: 30, type3: 30 };
    let thisWeek = 0;
    let targetTopic = 0;
    let accuracy = 100;
    let TopicCates=[];
    function gotoNextURL(url) {
        window.setTimeout(function () { $("#fr").attr("src", "http://cs.homlin.com/" + url); }, 500);
    }

    $("#js_btn_start").click(function () {
        $("#js_btn_start").text((running = !running) ? "结束工作" : "开始工作");
        if (running) {
            gotoNextURL("exam/mycount.htm");
            targetTopic = parseInt($("#target").val());
            accuracy = parseInt($("#accuracy").val())
        } else {

        }
    });
    $("#fr").load(async function () {
        if (running == false) return;
        if ($("#fr").attr("src").indexOf("exam/mycount.htm") > 0) {
            if (TopicCates.length == 0) {
                await fetch("/exam/loadTopicCates.do?pid=").then(function (response) {
                    return response.json();
                }).then(function (data) {
                    TopicCates = data;
                    queryData.cateIndex = TopicCates[TopicCates.length - 1].id;
                });
            }
            //获取题数
            let weekText = $("#fr").contents().find("h3:contains(本周)").next().text().trim();
            let r = weekText.match(/答题：(\d*)\n/);
            thisWeek = r ? r[1] : 0;
            $("#thisWeekLabel").text(thisWeek);
            if (thisWeek > targetTopic) {
                $("#js_btn_start").text("任务结束");
                running = false;
            } else {
                gotoNextURL("exam/test_sjmn.htm");
            }
        }
        if ($("#fr").attr("src").indexOf("exam/test_sjmn.htm") > 0) {
            queryData.type1=40+Math.ceil( Math.random()*10);
            $.ajax({
                type: "GET", url: "/exam/test_sjmn/data_topics.do"
                , data: queryData
                , success: function (resp) {
                    var rights = [];
                    var wrongs = [];
                    resp.result[0].data.forEach(function (val, index, arr) {
                        if (Math.random() * 100 < accuracy)
                            rights.push(val.id);
                        else
                            wrongs.push(val.id);
                    });
                    resp.result[1].data.forEach(function (val, index, arr) {
                        if (Math.random() * 100 < accuracy)
                            rights.push(val.id);
                        else
                            wrongs.push(val.id);
                    });
                    resp.result[2].data.forEach(function (val, index, arr) {
                        if (Math.random() * 100 < accuracy)
                            rights.push(val.id);
                        else
                            wrongs.push(val.id);
                    });
                    var data = { jsonstring: JSON.stringify({ rights: rights, wrongs: wrongs }) };
                    $.post("/exam/topic/logs.do", data, function (json) {
                        gotoNextURL("exam/mycount.htm");
                    }, "json"
                    );
                }
                , dataType: "json"
            });
        }
        $("#fr").contents().find("html").css("overflow", "hidden");
    });

})();
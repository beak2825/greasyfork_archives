// ==UserScript==
// @name         2ccc助手屏蔽垃圾回复
// @namespace    https://greasyfork.org/scripts/445588
// @version      0.7.20220617
// @description  bbs.2ccc.com功能增强，屏蔽其中的垃圾机器人回复
// @author       HUIANG
// @match        *.bbs.2ccc.com/*
// @homepage     http://bbs.2ccc.com/topic.asp?topicid=630046
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445588/2ccc%E5%8A%A9%E6%89%8B%E5%B1%8F%E8%94%BD%E5%9E%83%E5%9C%BE%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/445588/2ccc%E5%8A%A9%E6%89%8B%E5%B1%8F%E8%94%BD%E5%9E%83%E5%9C%BE%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function () {
    //console.time();
    var url = window.location.href;
    var match = {
        ccc_topic    : url.match(/2ccc.com\/topic/),
        ccc_pageno   : url.match(/2ccc.com\/\?pageno|2ccc.com\/$/)
    };

    var robot_name = "(tuhemm|nihaosv|mikhop|lxbfYeaa|uthekk|njftjx|taishanwa)";

    if (match["ccc_topic"]) {
        var op_obj = document.querySelector("body > table:nth-child(7) > tbody > tr > td:nth-child(3) > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(1) > a")
        var op = op_obj.innerHTML.replace(/<[^<>]+>/g, "");
        var table_list = document.querySelectorAll("body > table:nth-child(7) > tbody > tr > td:nth-child(3) > table");
        if (table_list) {
            EnumTopicTables(table_list, op);
        }
        var subject_obj = document.querySelector("body > table:nth-child(7) > tbody > tr > td:nth-child(3) > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > font");
        document.title = escape2Html(subject_obj.innerHTML) + " - 盒子论坛 v2.1";
    }

    function escape2Html(str) {
        var arrEntities={'lt':'<', 'gt':'>', 'nbsp':' ', 'amp':'&', 'quot':'"'};
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all,t){return arrEntities[t];});
    }

    function EnumTopicTables(table_list, op) {
        for (var i = 0, len = table_list.length; i < len; i++) {
            var replyer = table_list[i].querySelector("td:nth-child(1) > a");
            if (replyer) {
                var robot_exist = replyer.innerHTML.search(robot_name) > -1;
                if (robot_exist) {
                    table_list[i].style.display = "none";
                }
                var replyerIsop = replyer.innerHTML.search(op) > -1;
                if (replyerIsop) {
                    var replyer_label = table_list[i].querySelector("tbody > tr:nth-child(1) > td:nth-child(1)");
                    console.log(replyer_label.innerHTML);
                    if (replyer_label.innerHTML=="作者：") {
                        replyer_label.innerHTML = "<p id='user_replyer'" +
                                                  "style='float:center;width=100%;" +
                                                  "color:red;text-align:center;" +
                                                  "border-radius:10px;border-width:1px;border-style:solid;border-color:red;" +
                                                  "'>" + "楼主" + "</p>";
                    }
                }
            }
            var account_label = table_list[i].querySelector("tr:nth-child(2) > td > font");
            if (account_label) {
                var disable_account = account_label.innerHTML.search("禁用账号") > -1;
                if (disable_account) {
                    table_list[i].style.display = "none";
                }
            }
        }
    }

    if (match["ccc_pageno"]) {
        var page_table_list = document.querySelectorAll(".child > table > tbody > tr");
        if (page_table_list) {
            removePagenoRobotByKeyword(page_table_list);
        }
    }

    function removePagenoRobotByKeyword(table_list) {
        for (var i = 0, len = table_list.length; i < len; i++) {
            var text_label = table_list[i].querySelector("td:nth-child(3) > a");
            if (text_label) {
                var robot_exist = text_label.innerHTML.search(robot_name) > -1;
                if (robot_exist) {
                    table_list[i].style.display = "none";
                }
            }
        }
    }
    //console.timeEnd();
})();
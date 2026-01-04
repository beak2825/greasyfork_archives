// ==UserScript==
// @name         adnmb Luck Draw
// @namespace    http://adnmb.com/
// @version      0.3
// @description  抽奖
// @author       unknown
// @match        https://adnmb2.com/t/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/377873/adnmb%20Luck%20Draw.user.js
// @updateURL https://update.greasyfork.org/scripts/377873/adnmb%20Luck%20Draw.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = "https://adnmb2.com/api/thread/";
    var id = "1";
    var page = 1;
    var maxpage = 0;
    var count = 0;
    var size = 20;
    var allReply = [];
    var distinctReply = [];
    var poUserId = "";

    init();

    function init() {
        insertBtn();
        getThreadId();
    }

    function insertBtn() {
        if ($(".h-threads-info").length > 0) {
            var html = "<br /> <span><button onclick='beginDraw()' id='unknown-draw'>抽奖</button></span>" +
                "<span><input type='text' id='draw-key' placeholder='串中需要出现的关键字，用/分割开，为空即抽取所有字' /></span>" +
                "<span id='luck-text'></span>";
            $(".h-threads-info").eq(0).html($(".h-threads-info").eq(0).html() + html);
        }
    }
    function getThreadId() {
        if ($(".h-threads-item").length > 0) {
            id = $(".h-threads-item").data("threadsId");
        }
    }

    function beginDraw() {
        page = 1;
        maxpage = 0;
        count = 0;
        size = 20;
        allReply = [];
        distinctReply = [];
        if ($("#unknown-draw").length > 0) {
            $("#unknown-draw").text("正在抽取。。请等待");
        }
        $.ajax({
            type: 'get',
            url: url + "id/" + id + "/page/" + page,
            async: true,
            data: "",
            datatype: "json",
            success: function (result) {
                count = parseInt(result.replyCount);
                poUserId = result.userid;
                maxpage = Math.ceil((count + 0.0) / size);
                allReply = allReply.concat(result.replys);
                page++;
                if (page <= maxpage) {
                    getAllReply();
                } else {
                    dealReplay();
                }
            },
            error: function (result) {
            }
        });

    }
    window.beginDraw = beginDraw;

    function getAllReply() {
        $.ajax({
            type: 'get',
            url: url + "id/" + id + "/page/" + page,
            async: true,
            data: "",
            datatype: "json",
            success: function (result) {
                allReply = allReply.concat(result.replys);
                page++;
                if (page <= maxpage) {
                    getAllReply();
                }
                else {
                    dealReplay();
                }
            },
            error: function (result) {

            }
        });
    }

    function dealReplay() {
        var useKey = false;
        var keystr = $("#draw-key").val();
        var keys = [];
        if (keystr && keystr.trim() != "") {
            useKey = true;
            keys = keystr.split('/');
        }


        allReply.forEach(function (value, index, array) {
            var isEqual = false;
            var hasKey = false;
            if (useKey) {
                for (var l = 0; l < keys.length; l++) {
                    if (value.content.indexOf(keys[l]) != -1) {
                        hasKey = true;
                        break;
                    }
                }
                if (!hasKey) {
                    return;
                }
            }
            for (var i = 0; i < distinctReply.length; i++) {
                if (value.admin == '1' || poUserId == value.userid || distinctReply[i].userid == value.userid) {
                    isEqual = true;
                    break;
                }
            }
            if (!isEqual && value.admin == '0') {
                distinctReply.push(value);
            }
        });
        console.log(distinctReply.length);
        luckDraw();
    }

    function luckDraw() {
        var text = "";
        if (distinctReply.length == 0) {
            text = "没有符合条件的串";
        } else {
            var num = Math.floor(Math.random() * (distinctReply.length));
            var luckDog = distinctReply[num];
            text = "不重复串数：" + distinctReply.length + "," +
                "幸运号码：" + num + "," +
                "幸运者id:" + luckDog.id;
            console.log("幸运号码：" + num);
            console.log(luckDog);
        }
        if ($("#luck-text").length > 0) {
            $("#luck-text").text(text);
        }
        if ($("#unknown-draw").length > 0) {
            $("#unknown-draw").text("抽奖");
        }
    }
    // Your code here...
})();
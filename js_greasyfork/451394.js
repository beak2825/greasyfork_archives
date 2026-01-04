// ==UserScript==
// @name         52破解水区小助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  52破解水区小助手，查看可回复时间、已回复数量等
// @author       vincentye
// @match        *://www.52pojie.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=52pojie.cn
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/moment.js/2.29.4/moment.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451394/52%E7%A0%B4%E8%A7%A3%E6%B0%B4%E5%8C%BA%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/451394/52%E7%A0%B4%E8%A7%A3%E6%B0%B4%E5%8C%BA%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function () {
    'use strict';

    $("#fastpostsubmit").attr("disabled","true");
    $("#fastpostsubmit").click(function () {
        if($("#fastpostsubmit").attr("disabled")){
            alert('稍等')
        }
        var t = moment();
        localStorage.setItem('editTime', t)
        addReplyData();
    })
    // 设置最后提交时间
    var lastTime = localStorage.getItem('editTime')
    var t = moment(lastTime).format("HH:mm:ss")
    $("body").append(`<div id="lastTime" style="position:fixed;top:90px;right:500px;font-size:14px;width:500px;height:40px；background:black">最后发表时间${t}<div/>`)
    //设置读秒倒计时
    $("body").append('<div id="timewrap" style="position:fixed;top:30px;right:500px;font-size:14px;width:500px;height:40px；background:black">正在获取数据...<div/>')
    var coundDown;
    if (lastTime) {
        var starttime = moment(lastTime).add(43, 's');
        coundDown = setInterval(function () {
            var nowtime = moment();
            var leftTime = moment.duration(moment(starttime).valueOf() - moment(nowtime).valueOf()).as('seconds');
            if (leftTime > 0) {
                $('#timewrap').html(`<p>距离下一次回复还有：${leftTime}秒</p>`);
            } else {
                $("#fastpostsubmit").removeAttr("disabled");
                $('#timewrap').html('<p>可以发表</p>');
            }
        }, 1000);
    } else {
        $("#fastpostsubmit").removeAttr("disabled");
        $('#timewrap').html('<p>可以发表</p>');
        clearInterval(coundDown)
    }
    //设置当前自然时回复数
    $("body").append('<p id="replyWrap" style="position:fixed;top:60px;right:500px;font-size:14px;width:500px;height:40px；background:black"></p>');
    //设置一个按钮校正回复数
    $("body").append('<button id="reducesubmit" style="position:fixed;top:60px;right:650px;font-size:14px;width:100px;height:40px；background:black">减一回复</button>');
    $('#reducesubmit').click(function(){
        reduceReplyData()
    })
    var momentObj = moment(new Date()).add('year', 0)
    var dateTime = momentObj.format("YYYY-MM-DD HH")
    var reduceReplyData = function(){
        var a = JSON.parse(localStorage.getItem('replyData'))
        a.replyNum = parseInt(a.replyNum)-1;
        localStorage.setItem('replyData', JSON.stringify(a))
        initReplyData();
    }
    var addReplyData = function () {
        var a = JSON.parse(localStorage.getItem('replyData'))
        a.dateTime = dateTime;
        a.replyNum = parseInt(a.replyNum)+1;
        localStorage.setItem('replyData', JSON.stringify(a))
        initReplyData();
    }
    var initReplyData = function () {
        var replyData = localStorage.getItem('replyData')
        if (replyData) {
            replyData = JSON.parse(replyData)
            if (replyData.dateTime != dateTime) {
                replyData = {
                    dateTime: dateTime,
                    replyNum: 0
                }
            }
        } else {
            replyData = {
                dateTime: dateTime,
                replyNum: 0
            }
        }
        localStorage.setItem('replyData',JSON.stringify(replyData))
        $("#replyWrap").html(`${replyData.dateTime}时 发表了 ${replyData.replyNum} 条回复`);
    }
    initReplyData();
})();
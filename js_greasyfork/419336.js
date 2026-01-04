// ==UserScript==
// @name         广二师自动晨午检 - product
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to take over the world!
// @author       欧先森
// @match        https://tb.gdei.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419336/%E5%B9%BF%E4%BA%8C%E5%B8%88%E8%87%AA%E5%8A%A8%E6%99%A8%E5%8D%88%E6%A3%80%20-%20product.user.js
// @updateURL https://update.greasyfork.org/scripts/419336/%E5%B9%BF%E4%BA%8C%E5%B8%88%E8%87%AA%E5%8A%A8%E6%99%A8%E5%8D%88%E6%A3%80%20-%20product.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('执行广二师自动晨午检');
    let name = localStorage.getItem('tbName');
    let pwd = localStorage.getItem('tbPwd');
    if (!name || !pwd) {
        $.modal.msg('请输入账号和密码');
        name = prompt('账号：');
        pwd = prompt('密码：');
        localStorage.setItem('tbName', name);
        localStorage.setItem('tbPwd', pwd);
    }
    function automaticCwj() {
        const url = window.location.href;
        console.log(url);
        if (url=== 'https://tb.gdei.edu.cn/login') {
            document.querySelector('.uname').value = name;
            document.querySelector('.pword').value  = pwd;
            document.querySelector('#btnSubmit').click();
        } else {
            fetch('https://tb.gdei.edu.cn/index').then((res) => {
                console.log('res.url',res.url)
                if (res.url == "https://tb.gdei.edu.cn/login") {
                    console.log('openlogin');
                    window.location.href="https://tb.gdei.edu.cn/login";
                }
                else {
                    setTimeout(getTodayCwjTime, 1000);
                }
            },
                                                       (err) => {
                console.log('err',err);
                 window.location.href="https://tb.gdei.edu.cn/login";
            }
                                                      )
        }

    }
    function getTodayCwjTime() {
        console.log('run getTodayCwjTime');
        $.ajax({
            type: "get",
            url: "/system/mrcj/getcjtime",
            success: function (r) {
                console.log('r', r);
                if (r == "无权限") {
                    $.modal.msg('无权限');
                } else {
                    if (r == "您今天还未午检" || r == "您今天还未晨检") {
                        $("#cwj").addClass("label-warning");
                        // 运行晨午检
                        runCwj();
                    } else {
                        $("#cwj").addClass("label-info");
                    }
                    $.modal.msg(r);
                    $("#cwj").html(r);
                }
            }
        });
    }

    //一键晨午检
    function runCwj() {
        $.ajax({
            type: "get",
            url: "/system/mrcj/yjcwj",
            success: function (r) {
                if (r == "0") {
                    $.modal.msg("您没有此权限！");
                }
                else if (r == "1") {
                    $.modal.msg("您今天已经晨检！");
                    $("#cwj").addClass("label-info");
                    $("#cwj").html("今天晨检成功了");
                }
                else if (r == 2) {
                    $.modal.msg("您今天已经午检！");
                    $("#cwj").addClass("label-info");
                    $("#cwj").html("今天午检成功了");
                }
                else if (r == "3") {
                    $.modal.msg("出错了，请前往新增填报晨午检！");
                }
                else if (r == "succC") {
                    $.modal.msg("您今天一键晨检成功！");
                    $("#cwj").addClass("label-info");
                    $("#cwj").html("您今天晨检成功");
                }
                else if (r == "succW") {
                    $.modal.msg("您今天一键午检成功！");
                    $("#cwj").addClass("label-info");
                    $("#cwj").html("您今天午检成功");
                }
                else {
                    $.modal.msg("出错了，请前往新增填报晨午检！");
                }
            }
        });
    }

    function timeoutFunc(config, func) {
        config.runNow && func()
        let nowTime = new Date().getTime()
        let timePoints = config.time.split(':').map(i => parseInt(i))
        let recent = new Date().setHours(...timePoints)
        recent >= nowTime || (recent += 24 * 3600000)
        setTimeout(() => {
            func()
            setInterval(func, config.interval * 3600000)
        }, recent - nowTime)
    }
    timeoutFunc({
        interval: 1, //间隔天数，间隔为整数
        runNow: false, //是否立即运行
        time: "7:10:00"
    }, automaticCwj);
    timeoutFunc({
        interval: 1, //间隔天数，间隔为整数
        runNow: false, //是否立即运行
        time: "7:10:50"
    }, automaticCwj);
    timeoutFunc({
        interval: 1, //间隔天数，间隔为整数
        runNow: false, //是否立即运行
        time: "7:11:20"
    }, automaticCwj);
    timeoutFunc({
        interval: 1,
        runNow: false,
        time: "11:10:00"
    }, automaticCwj);
    timeoutFunc({
        interval: 1,
        runNow: false,
        time: "11:11:10"
    }, automaticCwj);
     timeoutFunc({
        interval: 1,
        runNow: false,
        time: "11:12:00"
    }, automaticCwj);
    // Your code here...
})();
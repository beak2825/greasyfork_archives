// ==UserScript==
// @name         b站直播间自动打卡bot
// @license MIT 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       me
// @description  b站直播间自动打卡
// @match        https://t.bilibili.com/*
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437177/b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%A1bot.user.js
// @updateURL https://update.greasyfork.org/scripts/437177/b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%A1bot.meta.js
// ==/UserScript==
var success = 0;
var fail = 0;
var html = "<div href='javascript:void(0)' target='_blank' style='z-index:999999;position: absolute;left: 5px;top: 160px;color: #fff;background-color: #A8C6F2;width: 50px;text-align: center;cursor: pointer;padding: 6px 0px;border-width: 1px;border-style: solid;border-color: #A8C6F2;border-image: initial;border-radius: 2px;font-size: 12px;' class='80497718'>打卡</div><div class='90545623' style='z-index:999999;width: 133px;min-height: 100px;background-color:#fff;box-shadow: rgb(0 0 0 / 15%) 0px 2px 8px;border-radius: 4px;padding: 5px 10px; position: absolute; left: 68px; top: 160px;display:none;' role='tooltip'><div>";
(function () {
    'use strict';
    // Your code here...
    var uid = getCookie("DedeUserID");
    var csrf = getCookie("bili_jct");
    $("body").append(html);
    var key = getCookie("key");
    console.log(key)
    $(".80497718").on("click", () => {
        Swal.fire({
            title: '你确定吗?',
            text: "点击确定开始打卡!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '确定'
          }).then((result) => {
            if (result.isConfirmed) {
                run(key,signin);
            }
          })
    });
    function run(key, method) {
        var v = key;
        if (!v) {
            //alert("直播间打卡脚本运行中,请勿关闭当前页面,按F12可以查看进度");
            method();
        }
    }

    function setCookie(name, value, second) {
        if (!second) {
            second = 7 * 24 * 60 * 60;//默认7天
        }
        var exp = new Date();
        exp.setTime(exp.getTime() + second * 1000);
        document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + ";path=/";
    }
    //读取cookies

    function signin() {
        console.log("运行中，请保证网络通畅");
        $.ajax({
            url: 'https://api.live.bilibili.com/xlive/web-ucenter/user/MedalWall',
            data: { target_id: uid },
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                signineachroom(data);
                return;
            }
        })
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }

    async function signineachroom(data) {
        var l = data.data.list.length;
        for (var i = 0; i < data.data.list.length; i++) {
            await sleep(1000);
            var target_id = data.data.list[i].medal_info.target_id;
            var target_name = data.data.list[i].target_name;
            $.ajax({
                url: 'https://api.bilibili.com/x/space/acc/info',
                data: { mid: target_id },
                type: 'GET',
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    var formdata = new FormData();
                    var time = new Date().getTime();
                    formdata.append("roomid", data.data.live_room.roomid)
                    formdata.append("msg", "打卡")
                    formdata.append("bubblt", "0")
                    formdata.append("color", "16777215");
                    formdata.append("mod", "1")
                    formdata.append("rnd", time)
                    formdata.append("fontsize", 25)
                    formdata.append("csrf", csrf)
                    formdata.append("csrf_token", csrf)
                    $.ajax({
                        url: 'https://api.live.bilibili.com/msg/send',
                        data: formdata,
                        type: 'POST',
                        contentType: false,
                        processData: false,
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (data) {
                            if (data.msg == "") {
                                console.log(target_name + "的房间打卡成功,还有" + (l - i) + "个房间")
                                success = success + 1;
                            }
                            else {
                                console.log(target_name + "的房间打卡失败,原因：" + data.msg)
                                fail = fail + 1;
                            }
                            if ((l - i) == 0) {
                                console.log("完成");
                                alert("打卡完成,成功：" + success + ",失败：" + fail);
                                var tim_sec = 24 * 60 * 60 - (new Date().getHours() * 60 * 60 + new Date().getMinutes() * 60 + new Date().getSeconds());
                                setCookie("key", "1", tim_sec);
                            }
                        },
                        error: function (data) {
                            console.log(data)
                        }
                    })
                }
            })
        }
    }
})();

// ==UserScript==
// @name         冲鸭计划
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       mumumi
// @match        *://market.m.taobao.com/app/mofun-activity/free-buy/index.html*
// @match        *://login.m.taobao.com/login.htm?redirectURL=https%3a%2f%2fmarket.m.taobao.com%2fapp%2fmofun-activity%2ffree-buy%2findex.html%23%2f
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      wxpusher.zjiecode.com
// @downloadURL https://update.greasyfork.org/scripts/392088/%E5%86%B2%E9%B8%AD%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/392088/%E5%86%B2%E9%B8%AD%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==
(function() {
    'use strict';
return;
    // Your code here...
    var username = "",
        password = "",
        token = "",
        uids = [""],
        oriTime = "06:30:00";
    var dd = 0;
    String.prototype.format = function(args) {
        var result = this;
        if (arguments.length > 0) {
            if (arguments.length == 1 && typeof (args) == "object") {
                for (var key in args) {
                    if(args[key]!=undefined){
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            }
            else {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] != undefined) {
                        var re = new RegExp("({)" + i + "(})", "g");
                        result = result.replace(re, arguments[i]);
                    }
                }
            }
        }
        return result;
    }
    function GetNextDelay() {
        var now = new Date();
        var y = now.getFullYear();
        var m = now.getMonth() + 1;
        var d = now.getDate();
        var nowHour = now.getHours();
        var tarTime = new Date("{0}-{1}-{2} {3}".format(y, m, d, oriTime));
        now = parseInt(now.getTime() / 1000);
        tarTime = parseInt(tarTime.getTime() / 1000 + dd * 24 * 3600);
        while (tarTime < now) {
            tarTime += ((nowHour < 18 || nowHour == 23) ? 21600 : 3600);
        }
        console.log(new Date(now * 1000), new Date(tarTime * 1000));
        var delay = tarTime - now;
        console.log(delay);
        return delay;
    }
    function sleep(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                return;
        }
    }
    function GetDate() {
        var date = new Date();
        var mon = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        return "" + mon + "月" + day + "日";
    }
    function WaitReady(retry = 3) {
        var cnt = 0;
        while (cnt < retry) {
            cnt++;
            if (document.readyState != "complete") {
                sleep(1000);
            }
        }
    }
    function WechatAlert(msg, href) {
        if (window.location.href != href) return;
        try {
            console.log(msg);
            var jsonData = {appToken:token,content:msg,contentType:1,topicIds:[],uids:uids,url:null};
            GM_xmlhttpRequest({
                method: 'POST',
                url: "http://wxpusher.zjiecode.com/api/send/message",
                headers: {"Content-Type": "application/json"},
                data: JSON.stringify(jsonData),
                onload: function (response) {
                    console.log(response.responseText);
                }
            });
        } catch(e) {}
    }
    function CheckAndAlert() {
        var msg = "";
        try {
            if ($("iframe[src^='//login']").length > 0) {
                console.log("jump", $("iframe[src^='//login']"));
                window.location.href = "https://login.m.taobao.com/login.htm?redirectURL=https%3a%2f%2fmarket.m.taobao.com%2fapp%2fmofun-activity%2ffree-buy%2findex.html%23%2f";
            }
            if ($("#loginForm").length > 0) {
                $("#username").delay(1000).val(username);
                $("#password").delay(1000).val(password);
                $("#btn-submit").delay(2000).click();
            }
            WaitReady(8);
            if ($("#loginForm").length > 0) {
                //点击验证按钮，再登录，应该会跳转
                var btn = $("body > div.km-dialog.km-dialog-ios7.km-dialog-alert > div.km-dialog-buttons > span");
                if (btn.length > 0) {
                    btn.click();
                    sleep(1000);
                }
                btn = $("div.sm-ico");
                if (btn.length > 0) {
                    btn.click();
                    sleep(15000);
                }
                $("#password").focus();
                btn = $("div.sm-ico");
                if (btn.length > 0) {
                    btn.click();
                    sleep(1000);
                }
                btn = $("#btn-submit");
                if (btn.length > 0) {
                    btn.click();
                    sleep(1000);
                }
            }
            if ($("#loginForm").delay(10000).length > 0 && document.readyState == "complete") {
                msg = "冲鸭计划[js]\r\n日期：{0}\r\n状态：{1}".format(GetDate(), "尚未登录");
            } else {
                var el;
                var dateStr = "", state = "", cmd = "", proc = "";
                el = $("#root > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > span:nth-child(2)");
                if (el.length > 0) {
                    dateStr = el.text().split(" ")[0].trim();
                    console.log(dateStr);
                }
                el = $("#root > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > span");
                if (el.length > 0) {
                    state = el.text().trim();
                }
                el = $("#root > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > span:nth-child(2)");
                if (el.length > 0) {
                    cmd = el.text().trim();
                }
                el = $("#root > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > span:nth-child(2)");
                if (el.length > 0) {
                    proc = el.text().trim();
                }
                if ("{0}{1}{2}{3}".format(dateStr, state, cmd, proc) == "") {
                    msg = "冲鸭计划[js]\r\n日期：{0}\r\n状态：{1}".format(GetDate(), "未知异常");
                } else {
                    if (state != "已完成") {
                        msg = "冲鸭计划[js]\r\n日期：{0}({2}天)\r\n状态：{1}\r\n{3}".format(dateStr, state, proc, cmd);
                    } else {
                        if (new Date().getHours() >= 18) {
                            dd = 1;
                        } else if (new Date().getHours() > 5) {
                            msg = "冲鸭计划[js]\r\n日期：{0}({2}天)\r\n状态：{1}".format(dateStr, state, proc);
                        }
                    }
                    console.log("冲鸭计划[js]\r\n日期：{0}({2}天)\r\n状态：{1}\r\n{3}".format(dateStr, state, proc, cmd));
                }
            }
        } catch(err) {
            msg = "冲鸭计划[js]\r\n日期：{0}\r\n状态：{1}\r\n异常：{2}".format(GetDate(), "捕获异常", err);
        }
        if (msg != "") {
            var ti = self.setTimeout(function() { WechatAlert(msg, window.location.href); window.clearInterval(ti); }, 50000);
        }
        return;
    }
    $(document).ready(function() {
        var ntv = self.setInterval(function() {
            CheckAndAlert();
            self.setInterval(function() {if (window.location.href != "https://market.m.taobao.com/app/mofun-activity/free-buy/index.html#/") { window.location.href = "https://market.m.taobao.com/app/mofun-activity/free-buy/index.html#/"; } else { location.reload(); }}, GetNextDelay()*1000);
            window.clearInterval(ntv);
        }, 20000)
    });
})();
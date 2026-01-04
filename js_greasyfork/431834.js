// ==UserScript==
// @name        更换厦航设备信息
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  机器人账号的设备信息
// @author       You
// @match        https://ecipuia.xiamenair.com/api/v1/oauth2/authorize*
// @grant        GM_xmlhttpRequest
// @connect    *
// @downloadURL https://update.greasyfork.org/scripts/431834/%E6%9B%B4%E6%8D%A2%E5%8E%A6%E8%88%AA%E8%AE%BE%E5%A4%87%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/431834/%E6%9B%B4%E6%8D%A2%E5%8E%A6%E8%88%AA%E8%AE%BE%E5%A4%87%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    navigator.logging = function () {
        if (document.getElementById("msg-or-email-code").style.display !== "none") {
            alert("请刷新页面");
            return
        }

        let phone = document.querySelectorAll('[placeholder="请输入白鹭卡号/用户名/证件号码/手机号"]')[0].value;
        let password = document.querySelectorAll('[placeholder="请输入密码"]')[0].value;

        GM_xmlhttpRequest({
            method: "post",
            url: 'http://micro-service.spider.htairline.com/redis_forward/',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "db=0&method=hget&name=auto_order:mf:account_device&key=" + phone + "/" + password,
            onload: function (res) {
                if (res.status === 200) {
                    let result = res.responseText;
                    console.log(result);
                    result = JSON.parse(result);
                    let deviceMsg = result.msg;
                    if (deviceMsg) {
                        localStorage.xmair_fingerprint = deviceMsg
                        console.log("设备信息替换完毕");
                        document.getElementById("login-btn-1").click();
                    } else {
                        alert("账号密码错误")
                    }
                } else {
                    console.log('失败');
                }
            },
            onerror: function (err) {
                console.log('error');
            },
            ontimeout: function (err) {
                console.log('ontimeout');
            },
            onabort: function (err) {
                console.log('onabort ');
            }
        });


    };

    document.getElementsByClassName("plane")[0].innerHTML = '<button style="font-size: 400%;position: absolute;left: 0;color: red;" onclick="navigator.logging()">机器人账号,请点击我进行登录</button>'

})();
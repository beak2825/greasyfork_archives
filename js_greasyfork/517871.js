// ==UserScript==
// @name         海航H5登录(2025-04-15_2)
// @namespace    http://tampermonkey.net/
// @version      2025-04-15_2
// @description  海航H5登录账号
// @author       MZ
// @match        https://m.hnair.com/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hnair.com
// @grant        GM_xmlhttpRequest
// @connect      conversationserver.spider.htairline.com
// @downloadURL https://update.greasyfork.org/scripts/517871/%E6%B5%B7%E8%88%AAH5%E7%99%BB%E5%BD%95%282025-04-15_2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517871/%E6%B5%B7%E8%88%AAH5%E7%99%BB%E5%BD%95%282025-04-15_2%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.LoginPage = function () {
        let quNarOwnLogging = document.getElementById("quNarOwnLogging");
        if(quNarOwnLogging){
            return
        }
        let selectDiv = $("<h1 id='quNarOwnLogging' style='position: fixed;bottom: 10%;right: 40%;z-index: 9999;background: red;'></h1>")
        let selectElement = $("<button class='hna-feather-button red-red-white font_16 login-view-button' style='font-size: 25px'>机器人H5账号登录按钮</button>");
        selectDiv.append(selectElement);
        $("body").append(selectDiv);
        clearInterval(window.HuH5Id);

        document.getElementById("quNarOwnLogging").onclick = function () {
            console.log("点击了我");

            let phone = document.querySelectorAll('[placeholder="金鹏卡号/手机号/邮箱/身份证/永居证/护照"]');
            let password = document.querySelectorAll('[placeholder="登录密码"]');
            if (!phone || !password) {
                alert("海航页面有变化, 联系技术修改");
                return
            }

            phone = phone[0].value;
            password = password[0].value;
            if (!phone || !password) {
                alert("请填写账号密码");
                return
            }

            GM_xmlhttpRequest({
                method: "get",
                url: "http://conversationserver.spider.htairline.com/hu_wx/get_phone_cookie?phone=" + phone + "&password=" + password,
                onload: function (res) {
                    if (res.status === 200) {
                        let result = res.responseText;
                        console.log(result);
                        result = JSON.parse(result);
                        let code = result.code;
                        if (code === 200) {
                            let deviceMsg = result.data;
                            // 准备登录账号
                            localStorage.setItem("hna_cache_user_secret", deviceMsg["secret"])
                            localStorage.setItem("hna_cache_user_token", deviceMsg["token"]);
                            location.href = "";
                        } else {
                            alert(result.msg)
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


        }
    }

    window.LogoutPage = function () {
        let logoutBtn = document.getElementsByClassName("logout-btn");
        if (logoutBtn.length > 0) {
            logoutBtn[0].remove()
        }

        let quNarOwnLogging = document.getElementById("huLogout");
        if(quNarOwnLogging){
            return
        }
        let selectDiv = $("<h1 id='huLogout' style='position: fixed;bottom: 10%;right: 40%;z-index: 9999;background: red;'></h1>")
        let logOutElement = $("<button class='hna-feather-button red-red-white font_16 login-view-button' style='font-size: 25px'>账号退出</button>");
        selectDiv.append(logOutElement);
        $("body").append(selectDiv);
        clearInterval(window.HuH5Id);

        document.getElementById("huLogout").onclick = function () {
            localStorage.removeItem("hna_cache_user_secret");
            localStorage.removeItem("hna_cache_user_token");
            location.href = "";
        }
    }

    $(document).ready(function () {

        window.HuH5Id = setInterval(function () {
            if (location.href.indexOf("m.hnair.com/#/login") !== -1) {
                // 登录账号
                setTimeout(function () {
                    window.LoginPage();
                }, 500)
            } else if (location.href.indexOf('m.hnair.com/#/user/settings') !== -1) {
                // 退出账号页面
                 setTimeout(function () {
                    window.LogoutPage();
                }, 50)
            }
        }, 500)
    })
})();
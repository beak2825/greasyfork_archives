// ==UserScript==
// @name         去哪儿网自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  去哪儿网的cookie获取
// @author       You
// @match        https://www.qunar.com/
// @include      *://*.qunar.com/*
// @match        https://flight.qunar.com/
// @match        https://www.qunar.com/?eval=*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qunar.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/441394/%E5%8E%BB%E5%93%AA%E5%84%BF%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/441394/%E5%8E%BB%E5%93%AA%E5%84%BF%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function autoLogging() {

        navigator.setCookie = function (cname, cvalue, exdays, domain) {
            let d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            let expires = "expires=" + d.toGMTString();
            document.cookie = cname + "=" + cvalue + ";Path=/;domain=" + domain + ";" + expires;
        }

        navigator.clearCookie = function () {
            var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            if (keys) {
                for (var i = keys.length; i--;) {
                    console.log(keys[i]);
                    document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
                }

            }
        }

        /**
         * 添加cookie
         * @param allCookie
         */
        navigator.addPhoneCookie = function (allCookie) {
            navigator.clearCookie();
            for (let cookieName in allCookie) {
                if (!allCookie.hasOwnProperty(cookieName)) {
                    continue
                }
                navigator.setCookie(cookieName, allCookie[cookieName], 1, ".qunar.com");
            }
            // 刷新页面
            location.href = "https://flight.qunar.com/";
        }

        /**
         * 选择登录手机号进行登录操作
         */
        navigator.selectLoggingPhone = function () {
            let selectValue = $("#selectPhone option:selected").val();
            if (selectValue === "-请选择登录账号-") {
                return
            }
            console.log(selectValue);
            if (document.cookie.length > 200) {
                alert("请先点击 饼干 的清空按钮, 再进行切换账号");
                return
            }

            GM_xmlhttpRequest({
                method: "get",
                url: "http://conversationserver.spider.htairline.com/qu_nar/logging_cookie?phone=" + selectValue,
                onload: function (result) {
                    result = JSON.parse(result.response);
                    console.log("获取登录账号的cookie")

                    if (result.code !== 200) {
                        console.log(result.msg);
                        return
                    } else if (!result.data.is_logging) {
                        alert("账号" + selectValue + "目前处于掉线状态, 无法登录")
                        return
                    }
                    // 添加cookie
                    navigator.addPhoneCookie(result.data.cookies);
                },
                onerror: function (err) {
                    debugger;
                    console.log('error');
                },
                ontimeout: function (err) {
                    debugger;
                    console.log('ontimeout');
                },
                onabort: function (err) {
                    debugger;
                    console.log('onabort ');
                }
            });
        }


        /**
         * 添加手机号
         * @param allPhone
         */
        function addSelect(allPhone) {

            let selectDiv = $("<div id='quNarOwnLogging' style='position: fixed;top: 10%;right: 0;font-size: 35px;z-index: 9999;'></div>")

            let selectElement = $("<select id=\"selectPhone\"  style='font-size: 30px;border: 1px;border: solid;border-radius: 30px;text-align: center;text-align-last: center;'></select>");

            let isAdd = false;

            for (let phoneIndex in allPhone) {
                if (!allPhone.hasOwnProperty(phoneIndex)) {
                    continue
                }
                if (phoneIndex === "0") {
                    selectElement.append($("<option>-请选择登录账号-</option>"));
                }
                selectElement.append($("<option>" + allPhone[phoneIndex] + "</option>"));
                isAdd = true;
            }

            selectDiv.append(selectElement);
            selectDiv.append("<br>");
            selectDiv.append("<button style='margin-left: 15px;margin-top: 10px;background: red;border-radius: 15px;color: white;border: solid;padding: 5px;font-size: 30px;' id=\"click\" onclick=\"navigator.selectLoggingPhone()\">点击自动登录</button>");

            selectDiv.append("<a style='border: 1px solid;position: fixed; font-size: 14px;right: 50px;top: 10px;' href='https://user.qunar.com/passport/login.jsp?ret=https%3A%2F%2Fwww.qunar.com%2F' target=\"view_window\">登录其他账号</a>");


            if (isAdd) {
                $("body").append(selectDiv);
            }
        }

        GM_xmlhttpRequest({
            method: "get",
            url: "http://conversationserver.spider.htairline.com/qu_nar/get_all_phone",
            onload: function (result) {
                result = JSON.parse(result.response);
                console.log("获取所有的登录账号");

                if (result.code !== 200) {
                    console.log(result.msg);
                    return
                }
                // 添加选择框
                addSelect(result.data.phone_li);
            }
        });
    }

    function hideLogout() {
        // 隐藏登录按钮
        if (document.getElementsByName("__loginInfo_r__")) {
            $("#__loginInfo_r__").hide();
            setInterval(function () {
                $("#__loginInfo_r__").hide();
            }, 5000);
        }

        if (document.getElementsByName("logout")) {
            $("#logout").hide();
            setInterval(function () {
                $("#logout").hide();
            }, 5000);
        }

        var aTag = document.querySelector("#userInfo-li > a");
        if (aTag) {
            aTag.style.display = "none";
        }

        aTag = document.querySelector("#header-btns > div > a:nth-child(3)");
        if (aTag) {
            aTag.style.display = "none";
        }

        aTag = document.querySelector("body > div.header > div > a.login");
        if (aTag) {
            aTag.style.display = "none";
        }
    }

    hideLogout();

    setInterval(function () {
        hideLogout();
    }, 200);

    // document 加载完毕后执行下面代码
    $(document).ready(function () {
        if ('/' === window.location.pathname && ['www.qunar.com', "flight.qunar.com"].indexOf(location.host) !== -1) {
            autoLogging();
        }
    })
})();
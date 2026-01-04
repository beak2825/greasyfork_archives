// ==UserScript==
// @name         淘宝网/飞猪登录
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  淘宝网的cookie获取
// @author       You
// @match        https://www.taobao.com/
// @match        https://www.taobao.com/?eval=*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=.taobao.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/476247/%E6%B7%98%E5%AE%9D%E7%BD%91%E9%A3%9E%E7%8C%AA%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/476247/%E6%B7%98%E5%AE%9D%E7%BD%91%E9%A3%9E%E7%8C%AA%E7%99%BB%E5%BD%95.meta.js
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
                if (["_m_h5_tk", "_m_h5_tk_enc"].indexOf(cookieName) !== -1) {
                    continue
                }
                navigator.setCookie(cookieName, allCookie[cookieName], 1, ".taobao.com");
            }
            // 刷新页面
            location.reload();
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
                url: "http://conversationserver.spider.htairline.com/fei_zhu/logging_cookie?phone=" + selectValue,
                onload: function (result) {
                    result = JSON.parse(result.response);
                    console.log("获取登录账号的cookie")

                    if (result.code !== 200) {

                        if (result.msg.indexOf("已掉线") !== -1) {
                            alert("账号已掉线,请自行扫描二维码登录, 登录成功后 请在淘宝首页(https://www.taobao.com/)点击【保存登录信息】");
                        }
                        console.log(result.msg);
                        return
                    }
                    // 添加cookie
                    navigator.addPhoneCookie(result.data);
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
            let selectDiv = document.createElement("div");
            selectDiv.setAttribute('id', 'quNarOwnLogging');
            selectDiv.setAttribute('style', 'position: fixed; top: 10%; right: 0;font-size: 20px;');


            let selectElement = "<select id=\"selectPhone\">";

            let li = [selectElement];

            let isAdd = false;

            for (let phoneIndex in allPhone) {
                if (!allPhone.hasOwnProperty(phoneIndex)) {
                    continue
                }
                if (phoneIndex === "0") {
                    li.push("<option>-请选择登录账号-</option>");
                }
                li.push("<option>" + allPhone[phoneIndex] + "</option>");
                isAdd = true;
            }

            li.push("</select>")
            li.push("<button style='margin-left: 10px;' id=\"click\" onclick=\"navigator.selectLoggingPhone()\">点击自动登录</button>");
            selectDiv.innerHTML = li.join("\n");

            if (isAdd) {
                document.getElementsByTagName("body")[0].appendChild(selectDiv);
            }else{
                alert("账号已掉线,请自行扫描二维码登录, 登录成功后 请在淘宝首页(https://www.taobao.com/)点击【保存登录信息】");
            }
        }

        GM_xmlhttpRequest({
            method: "get",
            url: "http://conversationserver.spider.htairline.com/fei_zhu/get_all_phone",
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


    // document 加载完毕后执行下面代码
    $(document).ready(function () {
        if ('/' === window.location.pathname) {
            autoLogging();
        }
    })


})();
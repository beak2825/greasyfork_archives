// ==UserScript==
// @name         财务登录
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  自动登录财务账号
// @author       Mz_xing
// @match        http://127.0.0.1:5089/cookie/init
// @match        https://mp.yeepay.com/auth/signin*
// @match        https://nhlms.cloudpnr.com/merconsole/*
// @match        https://travel.17u.cn/settlement/user/login
// @match        https://www.etravelb2b.com/settlement/user/login
// @match        https://mppm.qunar.com/qunarMerchantManager/login.do*
// @match        https://tbooking.ctrip.com/ntbooking/ntpage/login*
// @match        https://b2c.csair.com/B2C40/modules/bookingnew/manage/login.html*
// @match        https://b2c.csair.com/B2CWeb/modules/ordernew/accountnew/searchBalance.html
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/455217/%E8%B4%A2%E5%8A%A1%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/455217/%E8%B4%A2%E5%8A%A1%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {

    'use strict';

    // navigator.conversationServer = "http://127.0.0.1:5089";
    navigator.conversationServer = "http://conversationserver.spider.htairline.com";

    navigator.setCookie = function (cName, cValue, exSeconds, domain) {
        let d = new Date();
        d.setTime(d.getTime() + (exSeconds * 1000));
        let expires = "expires=" + d.toGMTString();
        document.cookie = cName + "=" + cValue + ";Path=/;domain=" + domain + ";" + expires;
    }

    navigator.getCookie = function (cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return "";
    }
    navigator.clearCookie = function () {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (!keys) {
            return
        }
        for (var i = keys.length; i--;) {
            console.log(keys[i]);
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
    }

    navigator.selectLoggingPhone = function () {
        console.log("你点击了登录");
        let selectTag = $("#selectPhone option:selected");
        if (selectTag.val() === "-请选择登录账号-") {
            return
        }

        if (document.cookie.length > 1200) {
            alert("请先点击 饼干 的清空按钮, 再进行切换账号");
            return
        }

        // 获取渠道
        let channel = selectTag.attr("channel");
        let selectPhone = selectTag.attr("phone");

        // 获取token
        let financial_token = document.getElementById("token").value;
        if (!financial_token) {
            alert("请输入认证token");
            return
        }
        localStorage.setItem("financial_token", financial_token);

        // 获取登录cookie
        GM_xmlhttpRequest({
            method: "get",
            url: navigator.conversationServer + "/cookie/" + channel + "/getPhoneCookie?phone=" + selectPhone + "&token=" + financial_token,
            onload: function (result) {
                let data = JSON.parse(result.response);
                console.log("设置了 手机号: " + selectPhone);

                if (data.code !== 200) {
                    let errorMessage = data.msg || "系统异常";
                    console.log("cookie获取失败", errorMessage);
                    alert("财务登录失败,原因:" + errorMessage);
                    return
                }
                let resultInfo = data["data"]
                let allCookie = resultInfo["cookies"];

                if (channel === "yeepay") {
                    setTimeout(function () {
                        console.log("易宝更换cookieo")
                        for (let cookieName in allCookie) {
                            if (!allCookie.hasOwnProperty(cookieName)) {
                                continue
                            }
                            if(cookieName === "SHRIOSESSIONID"){
                                localStorage.setItem("SHRIOSESSIONIDHTLM", allCookie[cookieName])
                            }
                        }
                        // // 重新访问页面
                        // location.href = resultInfo["href"]
                    }, 1000);
                } else {
                    if (channel === "17u" || channel === "etravelb2b") {
                        if (!allCookie.hasOwnProperty("ACCESS_TOKEN")) {
                            console.log("无ACCESS_TOKEN");
                            return;
                        }
                        localStorage.setItem(
                            "TC.ACCESS_TOKEN",
                            JSON.stringify({
                                "value": allCookie["ACCESS_TOKEN"],
                                "expire": null
                            })
                        )
                    } else if(channel === "cloud_pnr"){
                        if (!allCookie.hasOwnProperty("ACCESS_TOKEN")) {
                            console.log("无ACCESS_TOKEN");
                            return;
                        }
                        localStorage.setItem("token", allCookie["ACCESS_TOKEN"])
                        // 隐藏登录按钮
                        document.getElementById("ownLogging").style.display = "none"
                    } else {
                        for (let cookieName in allCookie) {
                            if (!allCookie.hasOwnProperty(cookieName)) {
                                continue
                            }
                            navigator.setCookie(
                                cookieName, allCookie[cookieName], 180, resultInfo["domain"]
                            );
                        }
                    }
                    // 重新访问页面
                    navigator.setCookie("miao_cz", "1", 20, ".csair.com");
                    location.href = resultInfo["href"]
                }

            }
        });
    }

    navigator.addSelect = function (allPhoneLi, channel) {

        let selectDiv = $("<div id='ownLogging' style='position: fixed;top: 1%;left: 1%;z-index: 99999;border-radius: 10px;background: #E4E7ED;height: 200px;width: 400px;padding: 5px;border: 1px #444;border: 1px solid #E4E7ED;'></div>")

        let inputTag = $('<div style="padding: 10px 5px"><label for="token">财务token:</label><input style="width: 70%;margin-left: 5px;height: 40px;padding: 10px 10px 10px 10px;font-size: 14px;color: #333333;background: #FFFFFF;border: 1px solid #EDEDED;border-radius: 3px;" type="text" name="token" id="token" placeholder="请输入token(见企业微信群)"></div>')
        selectDiv.append(inputTag);

        let selectElement = $("<select style='margin-left: 5px;font-size: 20px;padding-left: 5px;background: #FFFFFF;border: 1px solid #EDEDED;border-radius: 3px;' id='selectPhone'></select>");

        let isAdd = false;

        for (let phoneIndex in allPhoneLi) {
            if (!allPhoneLi.hasOwnProperty(phoneIndex)) {
                continue
            }
            if (phoneIndex === "0") {
                selectElement.append($("<option>-请选择登录账号-</option>"));
            }

            let phoneInfo = allPhoneLi[phoneIndex];
            // 手机号
            let phone = phoneInfo["phone"];
            // 账号提示
            let tip = phoneInfo["tip"] || phone;

            selectElement.append($("<option channel='" + channel + "' phone='" + phone + "'>" + tip + "</option>"));
            isAdd = true;
        }

        let selectAccountDiv = $('<div style="padding: 10px 5px;"></div>');
        selectAccountDiv.append($('<label for="token">选择登录账号:</label>'));
        selectAccountDiv.append(selectElement);
        selectDiv.append(selectAccountDiv);

        selectDiv.append("<div style='padding: 10px 5px;text-align: center;'><button style='width:40%;height:40px;font-size:18px;color:#FFFFFF;background:#22AB38;border-radius:3px;border:0 none;' id=\"click\" onclick=\"navigator.selectLoggingPhone()\">点击自动登录</button></div>");

        if (isAdd) {
            $("body").append(selectDiv);

        }
    }

    navigator.getChannel = function () {
        let hostLi = location.host.split(".");
        let host = hostLi.slice(hostLi.length - 2).join(".");

        let channel;
        switch (host) {
            case 'yeepay.com':
                // 易宝
                channel = "yeepay";
                break
            case '17u.cn':
                // 同程旅行
                channel = "17u";
                localStorage.setItem("TC.ACCESS_TOKEN", "")
                break
            case 'etravelb2b.com':
                // 易旅行
                channel = "etravelb2b";
                localStorage.setItem("TC.ACCESS_TOKEN", "")
                break
            case 'qunar.com':
                // 去哪儿
                channel = "qu_nar";
                break
            case 'ctrip.com':
                // 携程
                channel = "ctrip";
                break
            case 'csair.com':
                // 南航
                channel = "cz";
                break
            case 'cloudpnr.com':
                channel = "cloud_pnr";
                if(location.href.indexOf("merconsole/#/login") === -1){
                    channel = "";
                }
                break
        }
        return channel
    }

    if(location.href === 'https://b2c.csair.com/B2CWeb/modules/ordernew/accountnew/searchBalance.html'){
        // 判断cookie
        let a = navigator.getCookie("miao_cz");
        if(a){
            navigator.setCookie("miao_cz", "1", 0, ".csair.com")
            setTimeout(function () {
                location.reload();
            }, 3000)
        }else{
            document.getElementById("ownLogging").style.display = "none";
        }
    }

    // 根据渠道获取手机号
    let channel = navigator.getChannel();
    if(!channel){
        return
    }


    GM_xmlhttpRequest({
        method: "get",
        url: navigator.conversationServer + "/cookie/" + channel + "/getAllPhone",
        onload: function (result) {
            result = JSON.parse(result.response);
            console.log("获取所有的登录账号");

            if (result.code !== 200) {
                console.log(result.msg);
                return
            }
            // 添加选择框
            navigator.addSelect(result["data"]["phone_li"], channel);

            // 自动填充token
            let financial_token = localStorage.getItem("financial_token");
            if (financial_token) {
                document.getElementById("token").value = financial_token
            }
        }
    });
})();
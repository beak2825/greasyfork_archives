// ==UserScript==
// @name         财务cookie保存
// @namespace    http://tampermonkey.net/
// @version      0.1.5.4
// @description  自动保存财务帐号信息
// @author       Mz_xing
// @match        http://127.0.0.1:5089/cookie/init2
// @match        https://mas.chinapnr.com/gau/login.do*
// @match        https://nhlms.cloudpnr.com/merconsole/*
// @match        https://mp.yeepay.com/bc-mp/trade/orderReceiver/query*
// @match        https://travel.17u.cn/*
// @match        https://www.etravelb2b.com/*
// @match        https://mppm.qunar.com/qunarMerchantManager/banlanceshow.do*
// @match        https://mp.yeepay.com/*
// @match        https://flight-agent.meituan.com/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/455218/%E8%B4%A2%E5%8A%A1cookie%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/455218/%E8%B4%A2%E5%8A%A1cookie%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function () {

    'use strict';

    // navigator.conversationServer = "http://127.0.0.1:5089"
    navigator.conversationServer = "http://conversationserver.spider.htairline.com"


    navigator.setCookie = function (cName, cValue, exSeconds, domain) {
        let d = new Date();
        d.setTime(d.getTime() + (exSeconds * 1000));
        let expires = "expires=" + d.toGMTString();
        document.cookie = cName + "=" + cValue + ";Path=/;domain=" + domain + ";" + expires;
    }

    navigator.getCookie = function (cName) {
        let name = cName + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    // 易旅行,同程 替换退出按钮
    navigator.updateLogout = function () {
        navigator.logoutId = setInterval(function () {
            let logoutLi = document.getElementsByClassName("logout");
            if (logoutLi.length > 0) {

                let profile = document.getElementsByClassName("profile");
                profile = profile[0];

                let removeChild;
                for (let childNode of profile.children) {
                    if (childNode.innerText === '登出') {
                        removeChild = childNode;
                        break
                    }
                }
                profile.removeChild(removeChild);

                let aEle = document.createElement("a");
                aEle.setAttribute("href", "https://" + location.host + "/settlement/user/login");
                aEle.setAttribute(
                    "style",
                    "color: rgb(255, 255, 255);text-decoration: none;padding:10px;border: 3px solid #e80505;background: #0a58e6;margin: 10px;"
                );
                aEle.innerText = "登出";
                profile.appendChild(aEle)

                clearInterval(navigator.logoutId);
            }
        }, 100);
    }

    navigator.getChannel = function () {
        let hostLi = location.host.split(".");
        let host = hostLi.slice(hostLi.length - 2).join(".");

        let channel;
        switch (host) {
            case 'yeepay.com':

                channel = "yeepay";
                if(location.href.indexOf("auth/signin") !== -1){
                    channel = "";
                }
                break
            case 'chinapnr.com':
                channel = "china_pnr";
                break
            case 'cloudpnr.com':
                channel = "cloud_pnr";
                break
            case 'meituan.com':
                channel = "mei_tuan";
                break
            case '17u.cn':
                // 同程旅行
                channel = "17u";
                navigator.updateLogout();
                break
            case 'etravelb2b.com':
                // 易旅行
                channel = "etravelb2b";
                navigator.updateLogout();
                break
            case 'qunar.com':
                // 去哪儿
                channel = "qu_nar";
                throw Error("不支持去哪儿的保存会话功能");
        }

        return channel
    }


    navigator.saveCookie = function (channel) {

        // 保存cookie
        GM_xmlhttpRequest({
            method: "get",
            url: navigator.conversationServer + "/cookie/" + channel + "/setPhoneCookie",
            headers: {"Cookie": document.cookie},
            onload: function (result) {
                result = JSON.parse(result.response);
                console.log("保存cookie结果", result);
                if (result.code !== 200) {
                    console.log(result.msg);
                } else {
                    // 保存成功,清除保存cookie方法
                    clearInterval(navigator.DemoId)
                }
            }
        });
    }

    /**
     * 是否允许保存cookie
     * @param channel
     * @returns {HTMLElement|boolean}
     */
    navigator.isSaveCookie = function (channel) {
        if (channel === "yeepay") {
            return document.cookie.indexOf("SHRIOSESSIONIDHTLM") !== -1
        } else if (channel === "china_pnr") {
            return document.getElementById("main")
        } else if (channel === "cloud_pnr") {
            // https://nhlms.cloudpnr.com/merconsole/#/login
            if(location.href.indexOf("merconsole/#/login") !== -1){
                return false
            }
            let messageNodeLi = document.getElementsByClassName("message");
            if (!messageNodeLi) {
                return false
            }
            if (messageNodeLi[0].innerText.indexOf("账户号") === -1) {
                return false
            }
            let access_token = (localStorage.getItem("token") || "").trim();
            if (!access_token) {
                return false
            }
            // 保存cookie
            navigator.setCookie("ACCESS_TOKEN", access_token, 120, "nhlms.cloudpnr.com")
            return true
        } else if (channel === "qu_nar") {
            return document.getElementsByClassName("menuParent").length > 0
        } else if (channel === "17u" || channel === "etravelb2b") {
            let nameTag = document.getElementsByClassName("name");
            if (nameTag.length > 0) {
                let access_token = localStorage.getItem("TC.ACCESS_TOKEN");
                access_token = JSON.parse(access_token);

                let domain;
                if (channel === "17u") {
                    domain = "17u.cn";
                } else {
                    domain = "etravelb2b.com";
                }
                // 保存cookie
                navigator.setCookie(
                    "ACCESS_TOKEN",
                    access_token["value"],
                    120,
                    domain
                )
                return true
            } else {
                return false
            }

        }else if(channel === "mei_tuan"){
            return document.cookie.indexOf("epassport_token") !== -1
        }
        return false
    }

    navigator.DemoId = setInterval(function () {
        // 根据渠道获取手机号
        let channel = navigator.getChannel();
        if (!channel) {
            clearInterval(navigator.DemoId);
            return
        }

        if (navigator.isSaveCookie(channel)) {
            navigator.saveCookie(channel);
        }

    }, 5000)


})();
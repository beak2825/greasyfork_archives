// ==UserScript==
// @name         漫咖统一后台自动跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  方便公司后台之间的跳转
// @author       You
// @match        http://admin.akemanga.com/*
// @match        http://game.center.1kxun.mobi/*
// @match        http://points.1kxun.mobi/*
// @match        http://jp.forum.1kxun.mobi/*
// @match        https://jpforum.akemanga.com/*
// @match        http://bigdata.1kxun.com/*
// @match        http://release.bigdata.1kxun.com/*
// @match        http://utils.1kxun.mobi/*
// @match        http://thirdparty.1kxun.mobi/*
// @match        http://yingshi.partners.1kxun.mobi/*
// @match        http://push.1kxun.mobi/*
// @match        http://feedbacks.1kxun.mobi/*
// @match        http://admin.tcad.wedolook.com/*
// @match        http://tcconfig.1kxun.com/*
// @match        http://reports.akemanga.com/*
// @match        http://web.1kxun.mobi/*
// @match        http://admin.fiction.1kxun.mobi/*
// @match        http://admin.showfun.mobi/*
// @match        http://admin.station.1kxun.mobi/*
// @match        http://admin.mall.1kxun.mobi/*
// @match        http://auto.build.1kxun.com/*
// @match        http://pay.1kxun.mobi/*
// @match        http://account.1kxun.mobi/*
// @match        http://manga.hk/business/index/index/*
// @match        http://manga.hk/photoshop/index/index/*
// @match        http://mycard.1kxun.mobi/*
// @match        http://indonesia.1kxun.mobi/*
// @match        http://video.build.1kxun.com/*
// @match        http://sm.1kxun.com/*
// @match        http://messages.1kxun.mobi/*
// @match        http://admin.ip.1kxun.mobi/*
// @match        http://network.monitor.1kxun.mobi/*
// @match        http://partners.tvbox.1kxun.mobi/*
// @match        http://admin.ws.1kxun.mobi/*
// @match        http://admin.en.dailymanga.mobi/*
// @match        http://music.1kxun.mobi/*
// @match        http://feedbacks.dailymanga.mobi/*
// @match        http://tcconfig.dailymanga.mobi/*
// @match        http://message.dailymanga.mobi/*
// @match        http://ps.manga.zhizuo.info/*
// @match        http://www.akemanga.com/index/*
// @match        http://business.akemanga.com/*
// @match        http://ip.1kxun.com/*
// @match        http://resource.akemanga.com/*
// @match        http://browser.1kxun.com/*
// @match        http://content.manager.1kxun.com/*
// @match        http://management.1kxun.mobi/projects/index
// @match        http://management.1kxun.mobi/index/login
// @match        http://management.1kxun.mobi/index/index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1kxun.mobi
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456652/%E6%BC%AB%E5%92%96%E7%BB%9F%E4%B8%80%E5%90%8E%E5%8F%B0%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/456652/%E6%BC%AB%E5%92%96%E7%BB%9F%E4%B8%80%E5%90%8E%E5%8F%B0%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var username = ""
    var password = ""
    var domain = document.domain
    console.log("domain=" + domain)
    var originalUrl = window.location.href
    console.log("originalUrl=" + originalUrl)
    console.log("当前 GM originalUrl:" + GM_getValue("originalUrl"))
    console.log("当前 GM originalDomain:" + GM_getValue("originalDomain"))
    // GM_setValue("originalUrl", "")
    // GM_setValue("originalDomain", "")
    //return
    // 已经登录了，刷新页面要清空
    if (originalUrl == "http://management.1kxun.mobi/index/index") {
        console.log("需要跳转到项目列表")
        window.location.href = "http://management.1kxun.mobi/projects/index"
        return true
    }
    if (domain == "management.1kxun.mobi") {
        if (GM_getValue("originalUrl") == "") {
            return
        }
        var pathname = window.location.pathname
        if (pathname == "/index/login") {
            console.log("当前 /index/login")
            document.getElementById("inputUsername").value= username
            document.getElementById("inputPassword").value= password
            document.getElementsByClassName("btn btn-lg btn-primary btn-block")[0].click()
        } else if (pathname == "/projects/index") {
            console.log("当前 /projects/index")
            $('a').each(function(){
                var href = $(this).attr('href');
                console.log(href);
                if (href == '/index/login') {
                    console.log("需跳转")
                    window.location.href = "http://management.1kxun.mobi/index/login"
                    return true
                } else {
                    var originalDomain = GM_getValue("originalDomain")
                    console.log("originalDomain=" + originalDomain)
                    if (href.includes(originalDomain)) {
                        console.log("跳转到对应的后台")
                        var tempUrl = href + "&_from=script"
                        console.log("tempUrl=" + tempUrl)
                        window.location.href = href + "&_from=script"
                        return true
                    } else {
                        console.log("else")
                    }
                }
            });
        }
    } else {
        if (window.location.href.includes("_from=script")) {
            var originalUrl2 = GM_getValue("originalUrl")
            console.log("重定向开始")
            console.log("originalUrl2=" + originalUrl2)
            window.location.href=originalUrl2
            GM_setValue("originalUrl", "")
            GM_setValue("originalDomain", "")
            console.log("已清理 originalUrl=" + GM_getValue("originalUrl"))
        } else {
            console.log("我的链接是：" + originalUrl)
            $('a').each(function(){
                var href = $(this).attr('href');
                console.log(href);
                if (href == '/index/login') {
                    console.log("未登录需跳转")
                    if (isNeedRedirect()) {
                        console.log("存储 originalUrl=" + originalUrl)
                        GM_setValue("originalUrl", originalUrl)
                        console.log("存储 originalDomain=" + domain)
                        GM_setValue("originalDomain", domain)
                    }
                    window.location.href = "http://management.1kxun.mobi/projects/index";
                    return true
                }
            });
        }
    }
})();

function isNeedRedirect() {
    var domain = document.domain
    if (domain == "auto.build.1kxun.com") {
        if (window.location.href == "http://auto.build.1kxun.com/apps/index") {
            return true
        } else {
            return getQueryVariable("id") != ""
        }
    } else if (domain == "feedbacks.1kxun.mobi") {
        return getQueryVariable("udid_id") != ""
    } else if (domain == "admin.akemanga.com") {
        return getQueryVariable("page") != ""
    } else if (domain == "jp.forum.1kxun.mobi") {
        return getQueryVariable("page") != ""
    } else if (domain == "jpforum.akemanga.com") {
        return getQueryVariable("page") != ""
    } else{
        return false
    }
}

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
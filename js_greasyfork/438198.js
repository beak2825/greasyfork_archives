// ==UserScript==
// @name         🔥持续更新🔥 自用脚本--去广告
// @license MIT
// @namespace    https://gitee.com/flyinghat/tampermonkey-self.git
// @version      0.3.1
// @icon         data:image/png;base64,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
// @description  自用脚本
// @author       FlyingHat
// @match        *://*.baidu.com/*
// @match        *://*.jianshu.com/*
// @match        *://*.jb51.net/*
// @match        *://*.csdn.net/*
// @match        *://*.json.cn/*
// @match        *://*.360doc.com/*
// @match        *://*.sohu.com/*
// @match        *://*.zhihu.com/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/438198/%F0%9F%94%A5%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%F0%9F%94%A5%20%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC--%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/438198/%F0%9F%94%A5%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%F0%9F%94%A5%20%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC--%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

var dom = {};
var $;
dom.query = jQuery.noConflict(true);
dom.query(document).ready(function (a) {
    "use strict";
    var time = 100;
    $=a;
    // 当观察到变动时执行的回调函数
    var callback = function () {
        // Use traditional 'for loops' for IE 11
        switch (location.host) {
            case "www.baidu.com":
                baidu();
                break;
            case "baike.baidu.com":
                baidu_baike();
                break;
            case "tieba.baidu.com":
                baidu_tieba();
                break;
            case "fanyi.baidu.com":
                baidu_fanyi();
                break;
            case "www.jianshu.com":
                jianshu();
                break;
            case "www.jb51.net":
                jb51();
                break;
            case "blog.csdn.net":
                csdn();
                break;
            case "www.json.cn":
                json();
                break;
            case "www.360doc.com":
                doc360();
                break;
            case "www.sohu.com":
            case "news.sohu.com":
                sohu();
                break;
            case "zhuanlan.zhihu.com":
            case "www.zhihu.com":
                zhihu();
                break;
            default:
                break;
        }
    };
    // callback();
    setInterval(callback, time);
});
function zhihu(){
    $(".css-1ynzxqw").remove();
    $(".Modal-closeButton").click();
}
function baidu_tieba(){
    $(".j_click_stats").parent().parent().remove();
    $(".mediago-content").parent().parent().remove();
    $(".fengchao-wrap-feed").remove();
    $("#aside").remove();
    $("#aside-ad").remove();
    $("#content_wrap").css("width","100%");
    $(".forum_content ").css("background","none");
    $(".right_section").remove();
    $(".left_section").css("width","100%");

}
function sohu(){
    $("#left-bottom-god").remove();
    $("#right-side-bar").remove();
    $("#articleAllsee").remove();
    $(".groom-read").hide();

}
function doc360(){
    // $("#registerOrLoginLayer").remove();
    $("#outerdivifartad1").remove();
    $(".floatqrcode").remove();
    $("#arttopbdad").remove();
    $(".clear360doc").remove();
    $(".atfixednav").remove();
    if( $(".a_left").children("div").length===3){
        $(".a_left").children("div").last().remove();
    }

}
function json(){
    $(".tool ul").remove();
    $("footer").remove();
    $("main").css("height","88%");
}
function baidu() {
    $("#s-hotsearch-wrapper").remove();
    $("#content_right").remove();
    $("#content_left")
        .children()
        .each(function (i, item) {
        var temp = $(item).find(".ec-tuiguang");
        if (temp.length > 0) {
            $(item).remove();
        } else {
            var temp1 = $(item).find(".c-gap-left");
            for (var a = 0; a < temp1.length; a++) {
                if (temp1[a].innerText == "广告") {
                    $(item).remove();
                    break;
                }
            }
        }
    });
}

function baidu_baike() {
    $("#side-share").remove();
    $(".right-ad").remove();
    $(".lemmaWgt-promotion-vbaike").remove();
    $(".lemmaWgt-promotion-slide").remove();
    $("#side_box_unionAd").remove();
}

function baidu_fanyi() {
    $(".app-guide").remove();
    $(".desktop-guide").remove();
    $(".footer.cleafix").remove();
    $("#sideBannerContainer").remove();
    $("#footer-products-container").remove();
    $("#transOtherRight").remove();
    $(".footer").remove();
}
function jianshu() {
    $(".aside").remove();
    $("aside").remove();
    $("._3Pnjry").remove();
    $("._1F7CTF").remove();
    $('section[aria-label="baidu-ad"]').remove();
}
function jb51() {
    $("#submenu").remove();
    $("#topbar").remove();
    $("#header").remove();
    $(".google-auto-placed").remove();
    $(".pt10.clearfix").remove();
    $(".lbd.clearfix").remove();
    $(".lbd_bot.clearfix").remove();
    $(".mtb10.clearfix").remove();
    $(".main-right").remove();
    $(".main-left").css("width", "100%");
    $("#content .jb51code").css("width", "100%");
    $("#right-share").remove();
    $("#ewm").remove();
    $(".art_xg").remove();
    $(".tags.clearfix").remove();
    $(".main.clearfix").remove();
    $("#content .clearfix").remove();
    $(".right .mt10,.js-tad").remove();
    $(".clearfix .mainlr,.topimg").remove();
    $(".clearfix .dxy776,.dxy370").remove();
    $("#con_all").remove();
    // books
    $(".softsfwtl").remove();
    $(".da").remove();
    $(".tonglan").remove();
}
function csdn() {
    $("#csdn-toolbar").remove();
    $("#rightAside").remove();
    $(".blog_container_aside").remove();
    $("#toolBarBox").remove();
    $(".csdn-side-toolbar ").remove();
    $("#blogColumnPayAdvert").remove();
    $(".article-info-box").remove();
    $("#mainBox").css("width", "100%");
    $("#mainBox").css("margin", "0 auto");
    $("#mainBox main").css("width", "100%");
    $(".passport-login-container").remove();
    $(".passport-auto-tip-login-container").remove();
    $("code").removeAttr("onclick");
    $(".signin").remove();
    $(".comment-box-old").remove();
    var eles = document.getElementsByTagName("*");
    for (var i = 0; i < eles.length; i++) {
        eles[i].style.userSelect = "text";
    }
    $(".type_download").each(function (i, item) {
        var temp = $(item).find("a");
        if (temp.length > 0) {
            for (var c = 0; c < temp.length; c++) {
                var child = temp[c];
                var chref = $(child).attr("href");
                if (chref && chref.indexOf("download.csdn.net")) {
                    $(item).remove();
                    break;
                }
            }
        }
    });
    var article_content=document.getElementById("article_content");
    article_content&&article_content.removeAttribute("style");

    var follow_text=document.getElementsByClassName('follow-text')[0];
    follow_text && follow_text.parentElement && follow_text.parentElement.parentElement && follow_text.parentElement.parentElement.removeChild(follow_text.parentElement);

    var hide_article_box=document.getElementsByClassName(' hide-article-box')[0];
    hide_article_box && hide_article_box.parentElement&&hide_article_box.parentElement.removeChild(hide_article_box);
}

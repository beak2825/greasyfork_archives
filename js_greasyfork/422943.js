// ==UserScript==
// @name         殁漂遥无用元素清理[JS]
// @icon         https://mpyit.com/favicon.ico
// @namespace    mpyitOptimizing
// @version      2.01.4
// @description  mpyit.com 浏览体验优化
// @author       殁漂遥
// @include      *://*mpyit.com/*
// @include      *://acold.xyz/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-latest.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/422943/%E6%AE%81%E6%BC%82%E9%81%A5%E6%97%A0%E7%94%A8%E5%85%83%E7%B4%A0%E6%B8%85%E7%90%86%5BJS%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/422943/%E6%AE%81%E6%BC%82%E9%81%A5%E6%97%A0%E7%94%A8%E5%85%83%E7%B4%A0%E6%B8%85%E7%90%86%5BJS%5D.meta.js
// ==/UserScript==

(function () {
    let complete_url = window.location.href, valiable = complete_url.split("?")[0]; $("body").append("<input value='2' id='page-number' type='hidden'>"), $("#topnav").find("div:visible img").first().parent().remove(), $("#post:hidden").remove(), $(".footer_top").remove(), $(".link").remove(), $(".link_b").remove(), $("div[class*='footer_bottom']").remove(), window.history.pushState({}, 0, valiable);
})();
$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "https://api.axzjl.com/se7en/public/mpyitStyle",
        success: function (result) {
            let mpyit = result.data;
            GM_addStyle(mpyit.css); eval(mpyit.remove); eval(mpyit.replace);
            let is_home = (window.location.pathname.length <= 2);
            if (is_home) { adTag(mpyit.ad); }
            else {
                let verify_code_string = "";
                $(".entry_title_box").css("padding", "0"), $(".entry_box_s").children("div").last().remove(), $("div[class='top'][id='top']").remove(), $("#comment_mail_notify").removeAttr("checked");
                let verify_code = $("#entry input[type!='submit']");
                if (verify_code.length > 0) {
                    let param = {};
                    if (verify_code_string.length <= 0) $.ajax({ url: "https://api.axzjl.com/se7en/public/mpyit", success: function (r) { param[verify_code.attr('name')] = r.data.verify; getDownload(param); } });
                    else param[verify_code.attr('name')] = verify_code_string; getDownload(param);
                }
            }
        }
    });
    $("#post").find(".category a").each(function (index, item) { let category = $(item).html(); if (jQuery.inArray(category, ["大牌推荐", "正版"]) != -1) $(item).parent().parent().append("<span style='padding:2px;border-radius:5px;background-color:#f00;font-size:13px;color:#fff;font-weight:600;'>广告</span>"); });
    document.body.oncopy = function () { return; }; $(".entry img").click(function () { return false; });
    let scroll_allow = true;
    $(window).scroll(function () {
        if ($(document).scrollTop() + $(window).height() >= $(document).height()) {
            if (scroll_allow == false) { return; } let this_url = window.location.href; let reg = /\.html/; let page_div = "";
            if (reg.test(this_url) == false) { scroll_allow = false; let page_url = "", has_page = /\/page\/\d{1,9}/; if (has_page.test(this_url)) { let e = this_url.match(has_page)[0], a = parseInt(e.match(/\d{1,9}/)[0]) + 1; page_div = "page-" + a, page_url = this_url.replace(e, "/page/" + a) } else { let e = parseInt($("#page-number").val()); page_div = "page-" + e, page_url = this_url + "/page/" + e, $("#page-number").val(e + 1) } $("#wrapper").append("<div id='post' class='" + page_div + "'></div>"), $.ajax({ url: page_url, type: "GET", success: function (e) { let a, p = e.search(/\<div id\=\"post\"\>/); -1 == p ? (p = e.search(/\<div id\=\"content\"\>/), a = e.search(/\<div id\=\"sidebar\"\>/)) : a = e.search(/\<div id\=\"pagenavi/), $("." + page_div).css({ margin: " 0 auto", float: "none" }), $("." + page_div).html(e.slice(p, a)), $("." + page_div + " #map").remove(), $("." + page_div + " #words").remove(), $("." + page_div + " #pagenavi").remove(), $("." + page_div + " #post").find("div").first().remove(), $("." + page_div + " #post > div").each(function (e, a) { /post-\S{1,} post/.test($(this).attr("class")) || $(this).remove() }), $("." + page_div + " #post p a[href*='cdn/html/helppay']").parents("p").remove(), scroll_allow = !0 }, error: function (e) { window.reload() } }); }
        }
    });
});
function getUrlParam(t) { let e = new RegExp("(^|&)" + t + "=([^&]*)(&|$)"), n = window.location.search.substr(1).match(e); return null != n ? unescape(n[2]) : "" } function adTag(ad_mark) { $("div[class*='post'] .info").each(function (t, e) { let n = $(this).contents(); let reg = new RegExp(ad_mark); reg.test(n[3].data) && $(this).prev().append('&nbsp;<span style="font-size:10px;border-radius:5px;background:#F00;padding: 0.25em 0.25em;font-weight:400;color:#FFF;">广告</span>') }) } function feedback() { let t = $("#post a[href='cdn/html/qqqun']"); 0 == t.length && (t = $("#post > div a:contains('假冒')")), t.parent().html('<span style="color:#009900;">在使用该脚本时遇到问题请及时到 <a href="https://greasyfork.org/zh-CN/scripts/422943-%E6%AE%81%E6%BC%82%E9%81%A5/feedback" target="_blank" style="color:#FB7299;font-weight:700;">这里</a> 反馈</span>') } function rubbishRemove() { $("#post > div > p").remove(), $("#post").nextAll().remove() }
function getDownload(param) {$.ajax({ url: window.location.href, type: "POST", data: param, success: function (r) { let cur = $("div.erphpdown-content-vip").nextAll("div")[0]; let nd = $(r).find("div.erphpdown-content-vip").nextAll("div")[0]; $(cur).html($(nd).html()); $(cur).css({ "background-color": "#e7f2ff", "text-align": "center" }); } });}

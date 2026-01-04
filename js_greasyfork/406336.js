// ==UserScript==
// @name         百度搜索去广告+百度页面美化【代码精简高效】
// @description  代码极度精简，无垃圾推广！快速去除百度结果页的顽固广告和右边栏，采用居中布局，页面显示更加美观；为了精简代码以及提高性能，没有加任何定时器脚本，没有任何购物推荐啥的，最大程度减少系统资源消耗。
// @icon         http://baidu.com/favicon.ico
// @namespace    https://greasyfork.org/zh-CN/users/393603-tsing
// @version      4.1
// @author       Tsing
// @run-at       document-start
// @include      *://www.baidu.com/s?*
// @include      *://ipv6.baidu.com/s?*
// @include      *://www.baidu.com/baidu?*
// @include      *://ipv6.baidu.com/baidu?*
// @include      *://www.baidu.com/
// @include      *://ipv6.baidu.com/
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      GNU
// @copyright    该脚本完全由 Tsing@greasyfork 原创，谢绝抄袭部分或全部代码！如有借鉴代码，请声明并标注脚本链接。如发现有人抄袭，欢迎举报，谢谢。
// @downloadURL https://update.greasyfork.org/scripts/406336/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A%2B%E7%99%BE%E5%BA%A6%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96%E3%80%90%E4%BB%A3%E7%A0%81%E7%B2%BE%E7%AE%80%E9%AB%98%E6%95%88%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/406336/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A%2B%E7%99%BE%E5%BA%A6%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96%E3%80%90%E4%BB%A3%E7%A0%81%E7%B2%BE%E7%AE%80%E9%AB%98%E6%95%88%E3%80%91.meta.js
// ==/UserScript==

(function() {
    /* global $ */
    'use strict';
    var style_tag = document.createElement('style');
    var white_style = '#s_main, .s-top-nav, .s-hotsearch-wrapper, #content_right{display:none;} #container #content_left{width:1000px !important;} @media screen and (min-width: 1921px){#container.sam_newgrid{padding-left:0 !important; width:1000px !important;} .wrapper_new #s_tab.s_tab .s_tab_inner{padding-left:0 !important; margin-left:-36px;} .wrapper_new #head .s_form:not(div#s_fm.s_form), .s-isindex-wrap{margin-left:-60px !important;} .wrapper_new #s_tab, #page > div, #ent_sug{width:1000px !important;} .foot-container_2X1Nt div{width:1000px !important;}} .new-pmd.c-container, #container #content_left .result-op, #container #content_left .result{width:980px !important;} .new-pmd .c-span12{width:970px !important;} .new-pmd .c-span9{width:820px !important;} #container .c-container h3.t > a:first-child, #container .c-container h3.t > a:first-child em, #container .c-container .c-title > a:first-child, #container .c-container .c-title > a:first-child em{text-decoration:none !important; line-height:1.3 !important} .nums, .new_search_tool_conter{width:1000px !important;} #container.sam_newgrid{margin-left:unset !important; margin:0 auto !important;} #container #content_left .result-op, #container #content_left .result{border-radius:10px !important; box-shadow:0 0 6px #eeeeff; border-left:1px solid #eeeeee; padding:10px 10px 15px 20px !important; transition:margin-bottom 0.6s, padding-bottom 0.6s, box-shadow 0.6s;} #container #content_left .result-op:hover, #container #content_left .result:hover{box-shadow:1px 1px 10px #cccccc; border-radius:0;} .new-pmd .c-border{box-shadow:unset !important} .wrapper_new #s_tab, #page > div, #ent_sug{padding-left:0 !important; width:1080px; margin:0 auto !important;} #ent_sug{margin-top:140px !important;} #help{display:block; width:1080px; margin:0 auto; float:unset !important; padding-left:unset !important;} #head .head_wrapper{width:1080px; margin:0 auto !important;} .wrapper_new #head .s_form:not(div#s_fm.s_form), .s-isindex-wrap{margin-left:-128px;} .wrapper_new #head .s_form{padding-left:0 !important;} .slowmsg1{left:400px !important; top:120px !important; box-shadow:none !important; border:none !important; background:none !important;} div[class^="re-box_"]{box-shadow:none !important;}';
    style_tag.innerHTML = white_style;
    document.head.appendChild(style_tag);
    document.addEventListener ("DOMContentLoaded", kill_baidu_ad);
    function kill_baidu_ad () {
        unsafeWindow.$(document).ajaxSuccess(function(e, xhr, opt) { // Microsoft Edge 和 Safari 不支持 $(document).ajaxSuccess()
            document.head.appendChild(style_tag);
            $('#content_left>div').has('span:contains("广告")').remove();
            setTimeout(function () { $('.c-container').has('.f13>span:contains("广告")').remove(); }, 2100); // 去除顽固性的延迟加载广告，一般延迟2秒左右。例如搜索“淘宝”，当页面加载完毕之后在搜索结果最前或最后会再插入一个广告。
        });
        $("#head_wrapper").addClass("s-ps-islite"); // 登录了账号之后首页有可能出现资讯信息流，以下强制关闭。
        if(document.getElementsByClassName("hide-feed").length){ $("#s-user-setting-menu .show-feed:first").css("display", "none"); setTimeout(function () { document.getElementsByClassName("hide-feed")[0].click(); }, 1000); } // 不允许开启资讯信息流，原生click()才可以实现
        if(document.getElementsByClassName("set-hide").length){ setTimeout(function () { document.getElementsByClassName("set-hide")[0].click(); $("#s-user-setting-menu .set-show:first").css("display", "none");}, 1000); } // 关闭热榜
    }
})();
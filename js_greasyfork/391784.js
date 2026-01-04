// ==UserScript==
// @name         多吉搜索直达按钮 + 多吉搜索页面美化 + 百度搜索结果页去顽固广告
// @description  在百度、360、搜狗、必应、谷歌等搜索结果页加入多吉搜索按钮，一键跳转到 dogedoge.com 检索相同关键词；支持去除百度结果页面的广告和右边栏；给多吉搜索结果页增加谷歌搜索按钮，并对页面提供简洁样式美化功能。为了精简代码以及提高性能，没有加任何定时器脚本，最大程度减少系统资源消耗。
// @icon         https://www.dogedoge.com/assets/doge_ico.png
// @namespace    https://greasyfork.org/zh-CN/users/393603-tsing
// @version      4.4
// @author       Tsing
// @run-at       document-start
// @include      *://ipv6.baidu.com/s?*
// @include      *://www.baidu.com/s?*
// @include      *://www.baidu.com/baidu?*
// @include      *://ipv6.baidu.com/baidu?*
// @include      *://www.baidu.com/
// @include      *://ipv6.baidu.com/
// @include      *://www.so.com/s?*
// @include      *://www.sogou.com/web?*
// @include      *://www.sogou.com/sie*
// @include      *://www.sogou.com/sogou*
// @include      *://www.sogou.com/tx*
// @include      *://*.bing.com/search?*
// @include      *://www.google.com/search?*
// @include      *://www.google.com.*/search?*
// @include      *://magi.com/search?*
// @include      *://*.dogedoge.com/results?*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @note         2019.10.31 V1.0 在百度搜索的结果页加入多吉搜索按钮。
// @note         2019.11.06 V2.0 听取多吉搜索开发者 @nicoljiang 的建议，给检索关键词进行 urlencode 编码，并新增支持360、搜狗、必应搜索。给多吉搜索选择一个特征色号：#dd2248，保证视觉统一性。
// @note         2019.11.16 V2.1 感谢多吉搜索首页（https://dogedoge.com）推广该脚本！本次去除了各搜索引擎结果页面上按钮偶尔出现的下划线，新增了部分颜色动效，和原网站的一致性更高。
// @note         2019.11.20 V2.2 新增支持谷歌搜索引擎，感谢Greasy Fork站点网友 @魏信壹 的建议 。
// @note         2019.11.23 V3.0 当用户修改输入框中的检索内容然后直接点击多吉按钮时，可以实时更新多吉搜索的检索式。同时在多吉搜索的结果页面新增了一个Google的搜索按钮。
// @note         2019.11.24 V3.1 给多吉搜索的结果页面新增简约样式美化功能（内容加宽+居中显示+动态投影），并支持随时开启和关闭。
// @note         2019.12.01 V3.2 修复反单引号（`）导致的极少数不兼容问题，修复多吉搜索样式美化中的一些漏网之鱼，新增支持最近比较火的Magi搜索，去除百度结果页面的广告和右边栏，新增脚本菜单项。
// @note         2020.06.29 V4.0 由于百度搜索样式改版，进行了适配，同时调整了搜狗和必应的样式适配；谷歌页面的多吉按钮变成小图片，调整排版后颜值更高，且与原网页的融合度更高；彻底解决百度用Ajax调整网页内容导致的广告顽固和样式丢失。
// @note         2020.06.29 V4.1 判断百度搜索有没有关闭搜索预测，避免在首页上生成多吉按钮。
// @note         2020.06.29 V4.2 修复了一个bug。
// @note         2020.07.15 V4.3 谷歌搜索框有一个像素被遮挡，已经修复；新增百度 baidu.com/baidu? 域的支持；优化脚本逻辑，适配度更高。
// @note         2020.07.21 V4.4 百度搜索页面样式改版导致按钮高度变化，已经修复。
// @downloadURL https://update.greasyfork.org/scripts/391784/%E5%A4%9A%E5%90%89%E6%90%9C%E7%B4%A2%E7%9B%B4%E8%BE%BE%E6%8C%89%E9%92%AE%20%2B%20%E5%A4%9A%E5%90%89%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96%20%2B%20%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%A1%B5%E5%8E%BB%E9%A1%BD%E5%9B%BA%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/391784/%E5%A4%9A%E5%90%89%E6%90%9C%E7%B4%A2%E7%9B%B4%E8%BE%BE%E6%8C%89%E9%92%AE%20%2B%20%E5%A4%9A%E5%90%89%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96%20%2B%20%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%A1%B5%E5%8E%BB%E9%A1%BD%E5%9B%BA%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    /* global $ */
    'use strict';

    var hostname = window.location.hostname;

    if(hostname.match(RegExp(/baidu.com/))){
        // 百度搜索
        var style_tag_baidu = document.createElement('style');
        var style_text_baidu = '#content_right{display:none;} #dogedoge{cursor: pointer; width: 112px; height: 40px; line-height: 41px; background-color: #4e6ef2; border-radius: 10px; font-size: 17px; box-shadow: none; font-weight: 400; border: 0; outline: 0; letter-spacing: normal; color: #ffffff; margin-left:5px;} #dogedoge:hover{background: #4662D9;} .wrapper_new #head.fix-head .s_btn_wr #dogedoge{height: 40px; line-height: 41px;}';
        style_tag_baidu.innerHTML = style_text_baidu; // 移除百度右侧栏 and 定义按钮样式（如果直接使用.s_btn样式，则按钮的value值会自动变成“百度一下”）
        document.head.appendChild(style_tag_baidu);

        document.addEventListener ("DOMContentLoaded",show_button_baidu); // 参考：https://stackoverflow.com/questions/26268816/how-to-get-a-greasemonkey-script-to-run-both-at-run-at-document-start-and-at-r
        function show_button_baidu () {
            unsafeWindow.$(document).ajaxSuccess(function(e, xhr, opt) { // 点击百度一下按钮，采用的是ajax更新网页内容和url，所以必须等ajax完成才能执行去广告等脚本。绑定ajax完成事件，参考：https://www.jquery123.com/ajaxSuccess/
                console.log("AJAX detected");
                if($("#lg").is(":hidden") && !$("#dogedoge").length){ // 不是百度首页则加入按钮
                    var url_baidu = "https://www.dogedoge.com/results?q=" + encodeURIComponent($("#kw").val()) + "&from=TsingScript";
                    $("#su").parent().after('<span class="bg s_btn_wr"><input type="button" id="dogedoge" value="多吉搜索" title="使用多吉搜索引擎检索该关键词" onclick="window.open(\''+ url_baidu +'\')"></span>');
                }
                document.head.appendChild(style_tag_baidu);
                $('#content_left>div').has('span:contains("广告")').remove();// 去除常规广告
                setTimeout(function () { $('.c-container').has('.f13>span:contains("广告")').remove(); }, 2100); // 去除顽固性的延迟加载广告，一般延迟2秒左右。例如搜索“淘宝”，当页面加载完毕之后在搜索结果最前或最后会再插入一个广告。
            });

            $("#kw").change(function(){ // 用户修改页面上输入框中的内容，然后直接点击多吉按钮，需要实时更新检索词。
                var url_baidu = "https://www.dogedoge.com/results?q=" + encodeURIComponent($("#kw").val()) + "&from=TsingScript";
                if($("#lg").is(":hidden")){ // 判断百度搜索有没有关闭预测，避免在首页上生成多吉按钮。
                    if($("#dogedoge").length){
                        $("#dogedoge").attr('onclick', "window.open('"+ url_baidu +"')");
                    }else{
                        $("#su").parent().after('<span class="bg s_btn_wr"><input type="button" id="dogedoge" value="多吉搜索" title="使用多吉搜索引擎检索该关键词" onclick="window.open(\''+ url_baidu +'\')"></span>');
                    }
                }
            });
        }

    }else if(hostname.match(RegExp(/so.com/))){
        // 360搜索
        document.addEventListener ("DOMContentLoaded", show_button_360);
        function show_button_360 () {
            var url_360 = "https://www.dogedoge.com/results?q=" + encodeURIComponent($("#keyword").val()) + "&from=TsingScript";
            $(".adv-search-wrap").after('<span class="adv-search-wrap"><a href="' + url_360 + '" target="_blank" title="使用多吉搜索引擎检索该关键词" id="dogedoge" style="display:block; background:#19b955;height:38px;line-height:38px;width:90px;text-align:center; text-decoration:none; color:#ffffff;font-size:14px;" onmouseover="this.style.background=\'#1bc550\'" onmouseout="this.style.background=\'#19b955\'">多吉搜索</a></span>');
            $("#keyword").change(function(){
                var url_360_new = "https://www.dogedoge.com/results?q=" + encodeURIComponent($("#keyword").val()) + "&from=TsingScript";
                $("#dogedoge").attr('href',url_360_new);
            });
        }

    }else if(hostname.match(RegExp(/sogou.com/))){
        // 搜狗搜索
        var style_tag_sogou = document.createElement('style');
        style_tag_sogou.innerHTML = '#voice-btn{right:60px !important;} #searchBtn{right:100px !important;}';
        document.head.appendChild(style_tag_sogou);

        document.addEventListener ("DOMContentLoaded", show_button_sogou);
        function show_button_sogou () {
            var url_sogou = "https://www.dogedoge.com/results?q=" + encodeURIComponent($("#upquery").val()) + "&from=TsingScript";
            $("#searchBtn").after('<input type="button" value="多吉搜索" class="sbtn1" id="dogedoge" style="right:0px" title="使用多吉搜索引擎检索该关键词" onclick="window.open(\''+ url_sogou +'\')">');
            $("#upquery").change(function(){
                var url_sogou_new = "https://www.dogedoge.com/results?q=" + encodeURIComponent($("#upquery").val()) + "&from=TsingScript";
                $("#dogedoge").attr('onclick', "window.open('"+ url_sogou_new +"')");
            });
        }

    }else if(hostname.match(RegExp(/bing.com/))){
        // 必应搜索
        document.addEventListener ("DOMContentLoaded", show_button_bing);
        function show_button_bing () {
            var url_bing = "https://www.dogedoge.com/results?q=" + encodeURIComponent($("#sb_form_q").val()) + "&from=TsingScript";
            $("#sb_form").append('<a href="'+ url_bing + '" target="_blank" title="使用多吉搜索引擎检索该关键词" id="dogedoge" class="b_searchboxForm" style="display:inline-block; width:100px; height:36px; line-height:36px; margin:0 0 0 10px; padding:5px; color:#444; font-size:17px; font-weight:500; text-align:center; text-decoration:none; border-radius:6px;">多吉搜索</a>');
            $("#sb_form_q").change(function(){
                var url_bing_new = "https://www.dogedoge.com/results?q=" + encodeURIComponent($("#sb_form_q").val()) + "&from=TsingScript";
                $("#dogedoge").attr('href',url_bing_new);
            });
        }

    }else if(hostname.match(RegExp(/google.com/))){
        // 谷歌搜索
        document.addEventListener ("DOMContentLoaded", show_button_google);
        function show_button_google () {
            var url_google = "https://www.dogedoge.com/results?q=" + encodeURIComponent($(".gLFyf.gsfi:first").val()) + "&from=TsingScript";
            $(".RNNXgb:first").append('<div style="display:inline-block; height:100%; width:45px; border:3px solid #ffffff; box-sizing:border-box; border-radius:30px;"><button id="dogedoge" type="button" style="height:100%; line-height:80%; border:none; outline:none; font-size:15px; cursor:pointer; color:#ffffff; background:#ffffff; margin-left:-10px;" onclick="window.open(\''+ url_google + '\')" title="使用多吉搜索引擎检索该关键词"><img width="22px" height="22px" alt="DogeDoge" src="https://www.dogedoge.com/assets/new_logo_header.min.png"></button></div>');
            $(".gLFyf.gsfi:first").change(function(){
                var url_google_new = "https://www.dogedoge.com/results?q=" + encodeURIComponent($(".gLFyf.gsfi:first").val()) + "&from=TsingScript";
                $("#dogedoge").attr('onclick','window.open("'+ url_google_new + '")');
            });
        }

    }else if(hostname.match(RegExp(/magi.com/))){
        // Magi搜索
        document.addEventListener ("DOMContentLoaded", show_button_magi);
        function show_button_magi () {
            var url_magi = "https://www.dogedoge.com/results?q=" + encodeURIComponent($("#search-input").val()) + "&from=TsingScript";
            $("#search-bar").after('<button id="dogedoge" type="button" style="display:block; width:100px; height:40px; margin-left:580px; margin-top:-40px; border:none; outline:none; border-radius:.2rem; background-color:#14A2F5; cursor:pointer; color:#ffffff;" onclick="window.open(\''+ url_magi + '\')" title="使用多吉搜索引擎检索该关键词">多吉搜索</button>');
            $("#search-input").change(function(){
                var url_magi_new = "https://www.dogedoge.com/results?q=" + encodeURIComponent($("#search-input").val()) + "&from=TsingScript";
                $("#dogedoge").attr('onclick','window.open("'+ url_magi_new + '")');
            });
        }

    }else if(hostname.match(RegExp(/dogedoge.com/))){
        // 多吉搜索样式美化，立即执行。
        var style_text = '.results_links_deep{box-shadow:0 0 5px #eeeeee} .results_links_deep:hover{border:1px solid #dddddd; box-shadow:0 0 10px #cccccc; transition:all 0.2s;} .cw{margin:0 auto; max-width:920px;} .results--main{max-width:920px} .c-base{max-width:920px; margin:0 auto;} .zci__body{width:60% !important;} .serp__results,.header__search-wrap,.content__internal,.zcm-wrap,.zci__main{padding-left: 0;} .header__logo-wrap{left:-60px;width:auto;} .header__search{left:0}';
        var style_tag = document.createElement('style');
        style_tag.id = "dogedoge_tsing_style";
        var show_active_btn = true; // 默认打开样式美化开关

        // GM_deleteValue("tsing_style_on");
        var storage = GM_getValue("tsing_style_on"); // 文档：https://www.tampermonkey.net/documentation.php
        if(storage){ // 判断有没有本地存储数据
            if(storage == "open"){ // 配置信息：打开样式美化
                style_tag.innerHTML = style_text;
                document.head.appendChild(style_tag);
            }else if(storage == "close"){ // 配置信息：关闭样式美化
                style_tag.innerHTML = "";
                document.head.appendChild(style_tag);
                show_active_btn = false;
            }else{ // 一般不会出现这种异常情况
                GM_setValue("tsing_style_on","open");
            }
        }else{ // 本地存储数据为空
            GM_setValue("tsing_style_on","open"); // 新用户没有配置数据，则默认开启样式美化。配置数据存放位置：https://stackoverflow.com/questions/16823686/where-does-gm-setvalue-store-data
            style_tag.innerHTML = style_text;
            document.head.appendChild(style_tag);
        }

        document.addEventListener ("DOMContentLoaded", show_google_button); // This is the equivalent of @run-at document-end
        function show_google_button () { // 给多吉搜索增加一个Google按钮
            var dogedoge_to_google = "https://www.google.com/search?q=" + encodeURIComponent($("#search_form_input").val()) + "&from=TsingScript";
            $("#search_form").after('<button id="dogedoge" type="button" style="display:block; height:44px; width:80px; margin-top:-44px; margin-left:596px; font-size:1.2em; color:#222222; background:#ffffff; outline:none; border:1px solid rgba(0,0,0,0.15); border-radius:4px; box-shadow:0 2px 3px rgba(0,0,0,0.06); cursor:pointer;" onclick="window.open(\''+ dogedoge_to_google + '\')" title="使用谷歌搜索该关键词">Google</button>');
            $("#search_form_input").change(function(){
                var dogedoge_to_google_new = "https://www.google.com/search?q=" + encodeURIComponent($("#search_form_input").val()) + "&from=TsingScript";
                $("#dogedoge").attr('onclick','window.open("'+ dogedoge_to_google_new + '")');
            });
        }

        window.addEventListener ("load", show_style_switch); // 页面完全加载后执行
        function show_style_switch(){
            // 加一个美化样式开关，刷新页面
            var btn_open = '<div id="style_switch" class="dropdown dropdown--region is-active"><div class="dropdown__switch switch js-region-filter-switch is-on"><span class="switch__knob"></span></div><a id="style_status" style="text-decoration:none; color:#666666;" title="内容加宽+居中显示+动态投影 by Tsing">已启用样式美化</a></div>';
            var btn_close = '<div id="style_switch" class="dropdown dropdown--region is-active has-inactive-region"><div class="dropdown__switch switch js-region-filter-switch"><span class="switch__knob"></span></div><a id="style_status" style="text-decoration:none; color:#bbbbbb;" title="内容加宽+居中显示+动态投影 by Tsing">已关闭样式美化</a></div>';

            if(show_active_btn){
                $("#chinese-only").after(btn_open);
            }else{
                $("#chinese-only").after(btn_close);
            }

            $('#style_switch').click(function () {
                if ($(this).children(".dropdown__switch").hasClass("is-on")) {
                    $(this).addClass('has-inactive-region');
                    $(this).children(".dropdown__switch").removeClass('is-on');
                    console.log("Switch Off");
                    $("#dogedoge_tsing_style").text("");
                    $("#style_status").text("已关闭样式美化");
                    $("#style_status").css("color","#bbbbbb");
                    GM_setValue("tsing_style_on","close");
                } else {
                    $(this).removeClass('has-inactive-region');
                    $(this).children(".dropdown__switch").addClass('is-on');
                    console.log("Switch On");
                    $("#dogedoge_tsing_style").text(style_text);
                    $("#style_status").text("已启用样式美化");
                    $("#style_status").css("color","#666666");
                    GM_setValue("tsing_style_on","open");
                }
            });
        }
    }

    GM_registerMenuCommand ("欢迎提出建议和意见", menu_func, ""); // 注册脚本的菜单选项
    function menu_func () {
        window.open("https://greasyfork.org/zh-CN/scripts/391784/feedback");
    }

    console.log("%cThanks for using DogeDoge script, enjoy your time here."," font-size:14px; background:#444; border-radius:3px; padding:2px 5px; color:#ffff66; margin:10px 0;","--by Tsing");

})();
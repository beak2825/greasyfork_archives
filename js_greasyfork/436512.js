// ==UserScript==
// @name         百度、搜狗搜索结果去广告
// @description  百度、搜狗搜索结果去除广告
// @namespace    https://greasyfork.org/zh-CN/users/848213-sanrice
// @version      1.10
// @author       sanrice
// @license      MIT License
// @run-at       document-start
// @include      *://ipv6.baidu.com/s?*
// @include      *://www.baidu.com/s?*
// @include      *://www.baidu.com/baidu?*
// @include      *://ipv6.baidu.com/baidu?*
// @include      *://www.baidu.com/
// @include      *://ipv6.baidu.com/
// @include      *://www.sogou.com/web?*
// @include      *://www.sogou.com/sie*
// @include      *://www.sogou.com/sogou*
// @include      *://www.sogou.com/tx*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @note         2022.1.5 百度、搜狗搜索结果去广告
// @downloadURL https://update.greasyfork.org/scripts/436512/%E7%99%BE%E5%BA%A6%E3%80%81%E6%90%9C%E7%8B%97%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/436512/%E7%99%BE%E5%BA%A6%E3%80%81%E6%90%9C%E7%8B%97%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
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
                document.head.appendChild(style_tag_baidu);
                $('#content_left>div').has('span:contains("广告")').remove();// 去除常规广告
                setTimeout(function () { $('.c-container').has('.f13>span:contains("广告")').remove(); }, 2100); // 去除顽固性的延迟加载广告，一般延迟2秒左右。例如搜索“淘宝”，当页面加载完毕之后在搜索结果最前或最后会再插入一个广告。
            });
        }

    }else if(hostname.match(RegExp(/sogou.com/))){
        // 搜狗搜索
        document.addEventListener ("DOMContentLoaded", show_button_sogou);
        function show_button_sogou () {
            $(".right").remove();
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

    }

    GM_registerMenuCommand ("欢迎提出建议和意见", menu_func, ""); // 注册脚本的菜单选项
    function menu_func () {
        window.open("https://greasyfork.org/zh-CN/scripts/436512-%E7%99%BE%E5%BA%A6-%E6%90%9C%E7%8B%97%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%8E%BB%E5%B9%BF%E5%91%8A/feedback");
    }

    console.log("%cThanks for using DogeDoge script, enjoy your time here."," font-size:14px; background:#444; border-radius:3px; padding:2px 5px; color:#ffff66; margin:10px 0;","--by Tsing");

})();
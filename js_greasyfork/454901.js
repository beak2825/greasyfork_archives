// ==UserScript==
// @name         百度搜索增加一个便条
// @namespace    http://www.funnyai.com
// @license MIT
// @version      1.0
// @icon         https://www.baidu.com/favicon.ico
// @description  百度搜索页面修改
// @author       happyli
// @homepageURL  https://github.com/codelumos/tampermonkey-scripts
// @match        *://*.baidu.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant       GM_xmlhttpRequest
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/454901/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%8A%A0%E4%B8%80%E4%B8%AA%E4%BE%BF%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/454901/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%8A%A0%E4%B8%80%E4%B8%AA%E4%BE%BF%E6%9D%A1.meta.js
// ==/UserScript==

const dom = {};
dom.query = jQuery.noConflict(true);
dom.query(document).ready(function ($) {
    'use strict';

    const detection_cycle = 500;
    const cycle_callbacks = [];
    const {hostname, pathname} = location;

    function no_display(item) {
        const no_display_css = item + " {display: none;}";
        GM_addStyle(no_display_css);
    }

    function add_search_note(){
        var key=$("#kw").val();
        var div = document.getElementById('happy');
        if (div) div.remove();
        $( "<div id='happy' style='width:800px;height:380px;border:1px dotted blue;overflow:auto'>...</div>" ).insertBefore( $( "#content_left" ) );

        GM_xmlhttpRequest({
            method: "GET",
            url: "http://www.funnyai.com/note/mini_fulltext.php?key="+encodeURIComponent(key),
            data: "",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                $("#happy").html(response.responseText);
                //var json = $.parseJSON(response);
            }
        });

    }

    function add_sidebar_switcher(item) {
        if (!document.querySelector(item) || document.querySelector("#sidebar_switcher")) {
            return;
        }
        $(item).before("<span id='sidebar_switcher' style='margin-top: 40px; margin-right:40px; float:right'></span>");
        $("#sidebar_switcher").append("<button id='sidebar-btn'>显示</button>");
        let show_sidebar = GM_getValue("show_sidebar", false);
        if (show_sidebar) {
            $("#sidebar-btn").html("隐藏");
        } else {
            $(item).css("display", "none");
        }
        document.querySelector("#sidebar-btn").addEventListener("click", function () {
            return change_sidebar_status(item);
        }, true);
    }

    function change_sidebar_status(item) {
        let show_sidebar = GM_getValue("show_sidebar", false);
        if (show_sidebar) {
            GM_setValue("show_sidebar", false);
            $(item).css("display", "none");
            $("#sidebar-btn").html("显示");
        } else {
            GM_setValue("show_sidebar", true);
            $(item).css("display", "");
            $("#sidebar-btn").html("隐藏");
        }
    }

    function anti_ad_baidu() {
        add_sidebar_switcher("#content_right");
        // 百度视频搜索
        if (pathname.startsWith("/sf/vsearch")) {
            no_display(".ecom_pingzhuan"); // 品牌广告
            no_display("div[id*='_canvas']"); // 品牌广告
        } else {
            // 百度搜索
            no_display("[tpl='feed-ad']"); // 资讯条目广告

            no_display("#top-ad"); // 超级品牌
            no_display(".ec-pc_comp_banner_cc_float_video-fwc"); // 品牌视频广告
            no_display("[tpl='sp_hot_sale']"); // 全网热卖
            no_display("[tpl='short_video']"); // 视频大全
            no_display("[tpl='sp_rank']"); // 单品榜
            no_display("[tpl*='game-page']"); // 百度游戏
            no_display("[tpl*='b2b_prod']"); // 百度爱采购
            no_display(".pc-btn-des"); // 安全下载提示文字
            // 右侧栏广告
            $("#content_right > div").each(function () {
                if ($(this).attr("id") === undefined) {
                    $(this).css("display", "none");
                }
            });
            // 条目广告
            $("#content_left > div").each(function () {
                if ($(this).attr("id") === undefined && $(this).attr("class") === undefined) {
                    $(this).css("display", "none");
                }
            });

            $("span").each(function () {
                // 将官网移动为第一条搜索结果
                if ($(this).hasClass("c-text-blue")) {
                    $("#content_left").prepend($(this).parents(".result"));
                }
                // 去除“安全下载”按钮
                else if ($(this)[0].innerHTML === "安全下载") {
                    $(this).css("display", "none");
                } else if ($(this)[0].innerHTML === " 普通下载 ") {
                    $(this).html("下载");
                    $(this).addClass("c-btn-primary");
                    $(this).css("margin-left", "0px");
                }
            });

            // 百度资讯搜索
            no_display(".ecom_pingzhuan"); // 品牌广告
            // 延迟出现条目广告
            $("a").each(function () {
                if ($(this)[0].innerHTML === "广告") {
                    $(this).parents(".result").remove();
                }
            });
        }
    }

    switch (hostname.split(".")[0]) {
        // 百度搜索
        case "www":
            anti_ad_baidu();
            cycle_callbacks.push(function () {
                anti_ad_baidu();
            });

            setTimeout(()=>{
                add_search_note();

                document.querySelector('#kw')
                    .addEventListener('keypress', function (e) {
                    if (e.key === 'Enter') {
                        setTimeout(()=>{
                            add_search_note();
                        },2000);
                    }
                });

                document.querySelector('#su')
                    .addEventListener('click', function (e) {
                    setTimeout(()=>{
                        add_search_note();
                    },2000);
                });

            },500);
            break;

        // 百度百科
        case "baike":
            no_display(".J-search-ad"); // 条目广告

            $("#side_box_unionAd").remove(); // 品牌广告
            no_display(".bottom-recommend-wrapper"); // 猜你喜欢
            break;


        // 百度图片搜索
        case "image":
            no_display("#pnlBeforeContent"); // 品牌广告
            no_display(".newfcImgli"); // 条目广告
            break;

    }

    if (!cycle_callbacks.length) {
        return;
    }

    cycle_callbacks.forEach(f => f());
    setInterval(() => cycle_callbacks.forEach(f => f()), detection_cycle);
});
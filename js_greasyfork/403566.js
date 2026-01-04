// ==UserScript==
// @name         百度去广告
// @namespace    http://tampermonkey.net/
// @version      9.22.1400
// @description  百度去广告（首页、搜索结果）
// @author       lidonghui
// @author       xiaojian
// @match        *://www.baidu.com/*
// @match        *://zhidao.baidu.com/*
// @match        *://wenku.baidu.com/*
// @match        *://jingyan.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403566/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/403566/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取当前地址url
    var url = location.href;
    // 正则匹配首页部分
    var baidusearch = /www.baidu.com/i;
    if (baidusearch.test(url)) {
        function clearAD() {
            // 搜索结果推广广告
            $(".ec_tuiguang_ppouter").parents().map(function() {
                var thisid = $(this).attr("id");
                var id = new RegExp('300');
                if (thisid != undefined && thisid != "undefined") {
                    if (id.test(thisid)) {
                        $("#" + thisid).remove();
                    }
                }
            });
            // 百度推广广告
            $(".c-abstract").parents().map(function() {
                var thisid1 = $(this).attr("id");
                var id1 = new RegExp('400');
                var id2 = new RegExp('500');
                if (thisid1 != undefined && thisid1 != "undefined") {
                    if (id1.test(thisid1) || id2.test(thisid1)) {
                        $("#" + thisid1).remove();
                    }
                }
            });
            // 列表广告
            $(".ad-icon").map(function() {
                if ($(this).text() == "广告") {
                    $(this).parents(".s-nativead-item").remove();
/*                     while(!element.hasClass("s-nativead-item")) {
                        element = element.parent();
                    }
                    element.remove(); */
//                    $(this).parent().parent().parent().parent().remove();
                }
            });
            // 列表广告
            $("span.m").map(function() {
                if ($(this).text() == "广告") {
                    $(this).parent().parent().parent().remove();
                }
            });
            // 列表广告
            $("span").map(function() {
                if ($(this).text() == "广告") {
                    $(this).parent().parent().remove();
                }
            });

            // 搜索页第一条广告（估计是新增的）
            //$("#1").remove()

            // 首页右边广告
            $(".ad-block").parent().parent().parent().remove();
            if ($("#content_right").children("div").get(0) != undefined && $("#content_right").children("div").get(0) != "undefined") {
                $($("#content_right").children("div").get(0)).remove();
            };
            // 百度右边整体隐藏
//             $(".hit_top_new").remove();
//             $("#content_right").remove();
//             $("#wrapper_wrapper").css("background-color", "#F5F5F5");
//             $(".result ").css("background-color", "#fff");
//             $(".result ").css("padding", "20px");
//             $(".result ").css("border-radius", "5px");
//             $(".result ").css("box-shadow", "0 0 20px 2px rgba(0, 0, 0, .1)");
//             $("#rs").css("background-color", "#F5F5F5");
//             $(".result-op ").css("background-color", "#fff");
//             $(".result-op ").css("padding", "20px");
//             $(".result-op ").css("border-radius", "5px");
//             $(".result-op ").css("box-shadow", "0 0 20px 2px rgba(0, 0, 0, .1)");
            // 登录首页
//             $("#s_top_wrap").remove();
//             $("#s_upfunc_menus").remove();
//             $("#u_sp").remove();
//             $("#bottom_container").remove();
//             // 未登录首页
//             $("#qrcode").remove();
//             $("#ftCon").remove();
//             // 搜索页-反馈
//             $("#foot").remove();

        }
        // 启动定时器
        setInterval(function() {
            clearAD();
        }, 1000);
    }
    // 百度知道搜索列表
    var baiduzhidao = /zhidao.baidu.com\/search/i;
    if (baiduzhidao.test(url)) {
        function clearzdAD() {
            // 知道列表广告
            if (document.getElementsByClassName("bannerdown")[0] != undefined && document.getElementsByClassName("bannerdown")[0] != "undefined") {
                document.getElementsByClassName("bannerdown")[0].innerHTML = "";
            }
            document.getElementsByClassName("aside-inner")[0].innerHTML = "";
            document.getElementsByClassName("wgt-bottom-ask")[0].innerHTML = "";
            document.getElementsByClassName("wgt-bottom-ask")[0].style.height = "0px";
        }
        clearzdAD();
    }
    // 百度知道
    var baiduzhidaodet = /zhidao.baidu.com\/question/i;
    if (baiduzhidaodet.test(url)) {
        function clearzddetAD() {
            document.getElementById("qb-side").innerHTML = "";
            document.getElementsByClassName("qb-section")[0].nextElementSibling.innerHTML = "";
        }
        clearzddetAD();
    }
    // 百度文库
    var baiduwenku = /wenku.baidu.com\/search/i;
    if (baiduwenku.test(url)) {
        function clearwkAD() {
            document.getElementsByClassName("aside")[0].style.display = 'none';
            document.getElementsByClassName("search-topicBox-wrap")[0].style.display = 'none';
            document.getElementById("fengchaoad").style.display = 'none';
            document.getElementById("wkad5").style.display = 'none';
        }
        setInterval(function() {
            clearwkAD();
        }, 1000);
    }
    // 文库文档页面
    var baiduwenkudet = /wenku.baidu.com\/view/i;
    if (baiduwenkudet.test(url)) {
        function clearwkdetAD() {
            document.getElementById("ggbtm").style.display = 'none';
            document.getElementById("wkgg").style.display = 'none';
            document.getElementsByClassName("main")[0].nextElementSibling.innerHTML = "";

        }
        setInterval(function() {
            clearwkdetAD();
        }, 1000);
    }
    // 文库首页
    var baiduwenkudet = /wenku.baidu.com/i;
    if (baiduwenkudet.test(url)) {
        function clearwkinAD() {
            document.getElementById("banner-ad1").style.display = 'none';
            document.getElementById("banner-ad2").style.display = 'none';
        }
        setInterval(function() {
            clearwkinAD();
        }, 1000);
    }
    // 百度经验
    var baidujingyan = /jingyan.baidu.com/i;
    if (baidujingyan.test(url)) {
        function clearjyAD() {
            var iframe = $('iframe');
            for (var i = 0; i < iframe.length; i++) {
                iframe.remove();
            };
        }
        setInterval(function() {
            clearjyAD();
        }, 1000);
    }
})();
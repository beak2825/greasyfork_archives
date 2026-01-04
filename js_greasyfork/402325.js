// ==UserScript==
// @name         东方资讯等美化
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  东方资讯、东方影视大全、头条视频、头条图片、东方养生等美化
// @author       AN drew
// @match        *://mini.eastday.com/*
// @match        *://kan.eastday.com/*
// @match        *://video.eastday.com/*
// @match        *://miniimg.eastday.com/*
// @match        *://yangsheng.eastday.com/*
// @exclude      http://mini.eastday.com/
// @exclude      https://mini.eastday.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402325/%E4%B8%9C%E6%96%B9%E8%B5%84%E8%AE%AF%E7%AD%89%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/402325/%E4%B8%9C%E6%96%B9%E8%B5%84%E8%AE%AF%E7%AD%89%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.href.indexOf("https")==-1)
        $(".section").attr("style","padding-top:48px;");
    else
        $(".gg_cnt_detail").attr("style","height:0px;");

    if(window.location.href.indexOf("kan.eastday.com/play") > -1)
        $("html").css({"overflow":"hidden"})

    $(".recommend").attr("style","display:none");
    $(".aside").attr("style","display:none");
    $(".bottom_over_cnt").attr("style","display:none");
    $(".J-bdsharebuttonbox-wrap").attr("style","display:none");
    $(".pagination").attr("style","visibility:hidden");

    if(window.location.href.indexOf("http://kan.eastday.com/shortvideo") == -1)
        $(".main_content").attr("style","display:flex;justify-content:center;align-items:center;");

    $(".main-labie").hide()
    $("#toolbar").attr("style","position:relative; left:-20px;");
    $(".articlepage").attr("style","position:relative; left:-20px;");
    $("#ny_xypxf").hide()
    $("#first-img-down").hide()
    $("#toolbar").attr("style","margin-left:620px");

    $(".index_b").attr("style","display:none");
    $("#sy_tbrb").attr("style","display:none");
    $("body > div.con_index > div:nth-child(2)").attr("style","display:none");
    $("#index_dy_bottom").attr("style","display:none");
    $(".index_ad").attr("style","display:none");
    $(".detail_fixed_gg").attr("style","display:none");
    $("#error_bottom").attr("style","display:none");
    $(".ad36_dbgg").attr("style","display:none");
    $(".left_list").attr("style","display:none");
    $(".i_des_ad").attr("style","display:none");
    $(".i_ad").attr("style","display:none");
    $(".p_right").attr("style","display:none");
    $(".gg").attr("style","display:none");
    $("#detail_ad2").attr("style","display:none");
    $(".left_bottom").attr("style","display:none");
    $(".cnxh_con").attr("style","display:none");
    $(".dbdcp_cb").attr("style","display:none");
    $("#wrap > div:nth-child(3) > div > div > div.p_left > div > div > div > div.g_title.clearfix").attr("style","display:none");
    $("#wrap > div:nth-child(3) > div > div > div.p_left > div > div > div > div.guess_like > div.g_title.clearfix").attr("style","display:none");
    $(".rmbq_con.rmbq").attr("style","display:none");
    $("#yxxf_area").hide()
    setInterval(function(){
        var $topmec = $(".topmec").clone()
        $topmec.css("display","block")
        $(".topmec").remove()
        $topmec.prependTo(".layout-main")
        $topmec.css({"all":"initial"})
        $topmec.css({"width": "100%",
                          "height": "40px",
                          "color": "#E5E5E5",
                          "z-index": "99",
                          "line-height": "40px",
                          "overflow": "hidden"})

        $topmec.find(".curTitle").css({"float": "left",
                                            "font-size": "20px",
                                            "margin-left": "20px",
                                            "height": "42px",
                                            "overflow": "hidden",
                                            "position": "relative"})

        $topmec.find(".scroll").css({"position": "absolute",
                                          "font-size": "18px",
                                          "color": "#333",
                                          "font-weight": "700"})

        $topmec.find(".tousu").css({"float": "right",
                                         "font-size": "12px",
                                         "margin-right": "12px"})
    },1)
    


    $(".left-c").css({"margin-top":"10px","margin-bottom":"10px"})
    $("#sy_tbrb").hide()


    if(window.location.href.indexOf("yangsheng.eastday.com") == -1)
    {
        $(".content").attr("style","display:flex;justify-content:center;align-items:center;");
    }
    else
    {
        $(".side-left-up").css({"width":"1000px"})
    }

    console.log($(".page").children().eq(-2).get(0))
    var $last=$(".page").children().eq(-3)
    var $fake=$(".page").children().eq(-2)
    var $next=$(".page").children().eq(-1)

    $fake.hide()

    if($last.hasClass("cur"))
    {
        $next.css({"background-color":"#ddd","cursor":"default"})
        $next.attr({"href":"javascript:alert('已到最后一页')","target":"_self"})
    }

    if(window.location.href.indexOf("miniimg.eastday.com") == -1)
        $(".main").attr("style","display:flex;justify-content:center;align-items:center;");

    $(".layout_xxtj").attr("style","display:none");
    $(".hot_recommend").attr("style","display:none");
    $(".rightCon").attr("style","display:none");

    $(".dsp_yxxf").hide()
    $(".side-right").hide()
    $("#yxxf").hide()
    $("#right-module").hide()
    $(".bui-left.single-mode").hide()
    $(".screen_bottom").hide()
    $("#ad_bottom_right").hide()
    $(".dy_ad_line").hide()
    $("iframe").hide()
    $(".detail_p2").hide()
    $(".scroll-wrap.detail-scroll-wrap").hide()
    $(".scroll-wrap.topic-scroll-wrap").hide()
    $(".main .left").css({"margin-top":"80px","margin-left":"10%","width":"100%","height":"500px"})


    setInterval(function(){
        $(".barrage").hide()
        $(".ad-container").hide()
        $(".right").remove()
        $(".xin_dsp").hide()
        $(".Toreplay").hide()
        $(".ad_dsp").hide()
        $(".zt_l_ad").hide()
        $("[class*='degg']").hide()
        $(".ad-left").hide()
        $("#foot_right_fixed").hide()
        $("[id*='list_top_ad']").hide()
        $("[id*='BAIDU_DUP']").hide()
        $("[id*='BAIDU_SSP']").hide()
        $(".dy_s_advert").parent().hide()
        $(".g_div").hide()
        $(".bottom_gad").hide()
        $(".ad_left").hide()
        $(".ad36_dbdcp").hide()
    },1)


    // Your code here...
})();
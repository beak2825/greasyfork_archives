// ==UserScript==
// @name         [HAN] 52pojie 论坛优化
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  论坛精简
// @author       hanfly
// @match        *.52pojie.cn/thread*
// @icon         https://www.google.com/s2/favicons?domain=52pojie.cn
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/426141/%5BHAN%5D%2052pojie%20%E8%AE%BA%E5%9D%9B%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/426141/%5BHAN%5D%2052pojie%20%E8%AE%BA%E5%9D%9B%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==



$(document).ready(function(){
    //左侧个人信息
    //$(".pls.favatar").children(".tns.xg2").hide();
    $(".pls.favatar").children("p").not(".side-star").hide();
    $(".xg1.customstatus").hide();
    $(".md_ctrl.limit-1").hide();
    $(".p_pop.blk.bui.card_gender_2").hide();
    $(".p_pop.blk.bui.card_gender_1").hide();
    $(".p_pop.blk.bui.card_gender_0").hide();
    $(".dnch_eo_pt").hide();
    $(".tns.xg2").hide();
    $(".side-group").hide();
    $(".tip.tip_4").hide();
    $(".pil.cl").hide();
    $(".xl.xl2.o.cl").hide();
    $(".md_ctrl").hide();
    $(".xg1").hide();
    $(".side-star").css({"margin":"-20px 2px 0px 0px","float":"right"});
    //$(".tns.xg2").nextAll().hide();
    $(".psth.xs1.ple").hide();
    $(".plc.plm").hide();
    $(".xl.xl2.o.cl").hide();
    $(".steam_connect_user_bar").hide();
    $(".pti").find("a").hide();
    $(".authi").children("span").hide();
    $(".authi").children("img").hide();
    $(".show").remove();
    $(".poston").remove();
    //$(".authi").children("a").remove();
    $(".pi").children("strong").hide();
    //$(".pti").hide();
    //$(".authi").children("em").css({"float":"right"});
    //$(".authi").find("em:first").prev().remove();
    $(".pstatus").next("br").remove();
    $(".pstatus").next("br").remove();
    $(".pstatus").hide();
    $(".quote").prev("br").hide();
    $(".quote").next("br").hide();
    //$("blockquote").children("br:first").remove();
    $(".t_f").css("padding","11px 150px 0px 0px");
    $(".quote").css({"margin":"3px 10px 3px -20px"});
    $(".psth.xs1").css({"margin":"5px 0 0 -20px","padding":"0px 45px 0px 8px"});
    $(".xi2.xw1").css({"margin":"0 0 0 5px","color":"#3333336b"});
    $(".rate").prev("h3").hide();
    $(".rate").hide();
    //$(".authi").css({"color":"#dadada","margin":"-7px -13px 0px"});
    $(".psta.vm").css("width","130px");
    $(".avatar").not(".avatar.avtm").css({"margin":"9px 0px 0px 0px","text-align":"left"});
    $(".po.hin").hide();
    $(".ratc").hide();
    $(".keke_ds").hide();
    $("#copyright").hide();
    $("#fj").hide();
    $(".modact").hide();
    $(".cm").hide();
    $(".tip.tip_4t").hide();
    $(".tip.tip_4").hide();
    $(".mbn").not(".mbn.savephotop").hide();
    $("[smilieid]").css({"max-height":"20px","margin":"-5px 5px"});
    $(".t_fsz").css('min-height','20px');

    $(".subforum_left_title_right_down").hide();
    $(".subforum_left_title_right_up").hide();
    $("#thread_subject").css("max-width","880px");
    $(".avtm").not(".avatar.avtm").children("img").css({"height":"25px","width":"25px","padding":"0px","background":"none","box-shadow":"none"});
    $(".pls").find(".pi").css({"margin":"0px 0px -30px 28px","height":"0px","border-bottom":"0"});
    $(".pls").find(".authi").css({"margin":"-7px -13px 0px"});
    $(".pls").not(".pls.favatar").css({"border-right":"5px solid rgb(75 142 210)"});
    $(".plc").find(".pi").css({"margin":"0px -10px -30px","height":"0px","border-bottom":"0"});
    $(".plc").find(".pi").find("a").css({"margin-top":"-10px","padding":"3px"});
    $(".plc").find(".authi").css({"color":"#dadada","margin":"-7px 0px 0px","float":"right"});
    $(".pct").css("padding-bottom","0em");
    $('.rwd.cl').css('margin','20px 0 10px 0');
    $(".original_text_style1").hide();
    //$(".y").hide();
    $(".pstl.xs1.cl").css({"padding":"0"})
    //$(".pls").css("vertical-align","inherit")
})
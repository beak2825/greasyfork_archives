// ==UserScript==
// @name         [HAN] chiphell 页面精简
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  chiphell 页面精简
// @author       hanfly
// @match        *.chiphell.com/thread-*
// @match        *.chiphell.com/forum*
// @grant        none
// @icon         https://www.chiphell.com/favicon-16x16.png
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/418784/%5BHAN%5D%20chiphell%20%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/418784/%5BHAN%5D%20chiphell%20%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==


 //   $(".md_ctrl").remove();
 //   $(".pil.cl").remove();
 //   $(".plc.plm").remove();
 //   $(".pm2").remove();
 //   $(".pstatus").remove();
 //   $(".po.hin").remove();
 //   $(".tns.xg2").remove();
 //   $(".xl.xl2.o.cl").remove();
    //$(".pi").remove();
    //删除子元素
 //   $(".pls.favatar").children("p").remove();
    //追加样式
 //   $(".avatar").css("width","50px");
    //$(".pct").css("padding","10px 0px 0px 0px");

//$(document).ready(function(){
//    $(".bdshare-slide-button-box.bdshare-slide-style-r3").remove();
//})

$(document).ready(function(){
    $(".bdshare-slide-button-box.bdshare-slide-style-r3").remove();
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
    $(".pls").not(".pls.favatar").css({"border-right":"5px solid rgb(159 31 36)"});
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

//个人回复框改造
$(document).ready(function(){
$('.plhin').each(function(){
    var tr3 = $(this);
    var a = $(this).find('a')
    var keyword = a.attr("href");
    var banID = $(this).find('.locked').text();
    var banAvatar = $(this).find(".avatar").text();
    //var img = $(this).find('img[class=zoom]');
    //var imgwidth = img.attr("width");
    //console.log(imgwidth)
    //console.log(banID);

    if (keyword.startsWith('space-uid-294339'))
    {
        var oldname = tr3.find('a[class=xw1]').text();
        var name = '<a href="space-uid-294339.html" target="_blank" class="xw1" ><span style="color: rgb(251, 114, 153);">👑</span></a>'
        oldname = tr3.find('a[class=xw1]').replaceWith(name);
        tr3.find('.plc').css('color','#fb7299');
    }
    if (banID.includes('作者被禁止或删除'))
    {
        tr3.remove();
    }
    if (banAvatar.includes('头像被屏蔽'))
    {
        tr3.remove();
    }
    //else if (imgwidth < 101){
    //   console.log(imgwidth);
    //    img.css({"width":"25"})
    //}
});
    })
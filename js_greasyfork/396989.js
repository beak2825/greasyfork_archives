// ==UserScript==
// @name         [HAN] keylol 论坛优化
// @namespace    http://tampermonkey.net/
// @version      4.8
// @description  直接取消标题的超链接，选取标题方便淘宝搜索
// @author       hanfly
// @match        *.keylol.com/t*
// @match        *.keylol.com/f*
// @match        *.keylol.com/forum.php?mod*
// @grant        none
// @icon         https://keylol.com/favicon.ico
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/396989/%5BHAN%5D%20keylol%20%E8%AE%BA%E5%9D%9B%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/396989/%5BHAN%5D%20keylol%20%E8%AE%BA%E5%9D%9B%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

//直接取消标题的超链接，选取标题方便淘宝搜索
(function() {
    var html = document.getElementsByClassName('subforum_left_title_left_down')[0].innerHTML
    document.getElementsByClassName('subforum_left_title_left_down')[0].innerHTML=html.replace('href', 'g')
})();

//引用回复改造
$(document).ready(function(){
$('blockquote').each(function(){
    var td = $(this);
    var keyword = $(this).children('span:first').text();
    if(keyword.includes('发表于'))
    {
        keyword=keyword.replace(/发表于(.*)$/gm,"：");
        td.find('span:first').replaceWith(keyword);
        td.children("br:first").remove()
    }
});
    })

//页面精简优化
$(document).ready(function(){
    //左侧个人信息
    $(".pls.favatar").children(".tns.xg2").hide();
    $(".pls.favatar").children("p").addClass("ttmtt_level").hide();
    $(".xg1.customstatus").hide();
    $(".md_ctrl.limit-1").hide();
    $(".p_pop.blk.bui.card_gender_2").hide();
    $(".p_pop.blk.bui.card_gender_1").hide();
    $(".p_pop.blk.bui.card_gender_0").hide();

    $(".psth.xs1.ple").hide();
    $(".plc.plm").hide();
    $(".xl.xl2.o.cl").hide();
    $(".steam_connect_user_bar").hide();
    $(".pti").find("a").hide();
    $(".authi").children("span").hide();
    $(".authi").children("img").hide();
    $(".show").remove();
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
    $(".quote").css({"margin":"3px 10px 3px -20px","padding":"3px 10px 3px 36px","background":"#FFFFFF url(https://keylol.com/static/image/common/quote_proper_left.png) no-repeat 13px 0px"});
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
    $("[smilieid]").css({"max-height":"20px","margin":"0 5px"});
    $(".t_fsz").css('min-height','20px');

    $(".subforum_left_title_right_down").hide();
    $(".subforum_left_title_right_up").hide();
    $("#thread_subject").css("max-width","880px");
    $(".avtm").not(".avatar.avtm").children("img").css({"height":"25px","width":"25px","padding":"0px","background":"none","box-shadow":"none","border-radius": "50%","margin-top": "1px"});
    $(".pls").find(".pi").css({"margin":"0px 0px -30px 28px","height":"0px","border-bottom":"0"});
    $(".pls").find(".authi").css({"margin":"-7px -13px 0px"});
    $(".pls").not(".pls.favatar").css({"border-right":"5px solid #66bbff"});
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

    if (keyword.startsWith('suid-189172'))
    {
        var oldname = tr3.find('a[class=xw1]').text();
        var name = '<a href="suid-189172" target="_blank" class="xw1" ><span style="color: rgb(251, 114, 153);">👑</span></a>'
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

//欢乐时光等提醒
$(document).ready(function(){
$('tbody').each(function(){
    var td = $(this);
    //td.find("th[class=common]").nextAll().children().remove();
    td.find("th[class=common]").children("img").hide();
    var keyword = $(this).find('.xst').text();
    if(keyword.includes('欢乐时光'))
    {
        td.find("td:first").nextAll().css("background-color","#fb7299");
        td.find("td:first").css("background-color","#fb7299");
    }
    if(keyword.includes('Play at Home'))
    {
        td.find("td:first").nextAll().css("background-color","rgb(0 162 255 / 44%)");
        td.find("td:first").css("background-color","rgb(0 162 255 / 44%)");
    }
    if(keyword.includes('Plus会员免费'))
    {
        td.find("td:first").nextAll().css("background-color","rgb(0 162 255 / 44%)");
        td.find("td:first").css("background-color","rgb(0 162 255 / 44%)");
    }
});
    })
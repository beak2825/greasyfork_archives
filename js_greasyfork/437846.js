// ==UserScript==
// @name         [HAN] keylol 论坛优化
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  直接取消标题的超链接，选取标题方便淘宝搜索
// @author       han
// @match        *.keylol.com/t*
// @match        *.keylol.com/f*
// @match        *.keylol.com/forum.php?mod*
// @grant        none
// @icon         https://keylol.com/favicon.ico
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/437846/%5BHAN%5D%20keylol%20%E8%AE%BA%E5%9D%9B%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/437846/%5BHAN%5D%20keylol%20%E8%AE%BA%E5%9D%9B%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

//直接取消标题的超链接，选取标题方便淘宝搜索
(function() {
    var html = document.getElementsByClassName('subforum_left_title_left_down')[0].innerHTML
    document.getElementsByClassName('subforum_left_title_left_down')[0].innerHTML=html.replace('href', 'g')
    //var div = document.getElementsByTagName('span');
    //div.innerHTML = div.innerHTML.replace(/发表于(.*)$/gm,"：");
    //document.getElementsByTagName('span')[0].innerHTML = document.getElementsByTagName('span')[0].innerHTML.replace(/发表于(.*)$/gm,"：");
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
    //$(".pls.favatar").children(".tns.xg2").hide();//积分
    $(".pls.favatar").children("p").hide();
    $(".xg1.customstatus").hide();//个人签名
    //$(".md_ctrl.limit-1").hide();//勋章
   //$(".p_pop.blk.bui.card_gender_2").hide();
    //$(".p_pop.blk.bui.card_gender_1").hide();
   // $(".p_pop.blk.bui.card_gender_0").hide();

    //$(".psth.xs1.ple").hide();//评分
    $(".sign").hide();//个性签名
    $(".xl.xl2.o.cl").hide();
    //$(".steam_connect_user_bar").hide();//个人资料
    //$(".pti").find("a").hide();//只看该作者
    //$(".authi").children("span").hide();
    //$(".authi").children("img").hide();
    //$(".pi").children("strong").hide();//发表时间
    //$(".pti").hide();//发表时间
    //$(".authi").children("em").css({"margin":"0px 0 0px 880px"});
    //$(".authi").find("em:first").prev().remove();
   // $(".pstatus").next("br").hide();
    $(".pstatus").next("br").hide();
    //$(".pstatus").hide();
   // $(".quote").prev("br").hide();
    $(".quote").next("br").hide();
    //$("blockquote").children("br:first").remove();
    $(".t_f").css("padding","11px 110px 0px 0px");
    $(".quote").css({"margin":"3px 10px 3px -20px","padding":"3px 10px 3px 36px","background":"#FFFFFF url(https://keylol.com/static/image/common/quote_proper_left.png) no-repeat 13px 0px"});
    $(".psth.xs1").css({"margin":"5px 0 0 -20px","padding":"0px 45px 0px 8px"});
    $(".xi2.xw1").css({"margin":"0 0 0 5px","color":"#3333336b"});
    $(".rate").prev("h3").hide();
    //$(".rate").hide();//评分详情
    $(".authi").css({"color":"#3e3e3e","margin":"-7px 13px 0px" ,"font-size":"12px"});//文字
    $(".authi").find(".authicn.vm").hide();
    $(".psta.vm").css("width","130px");
    $(".avatar").not(".avatar.avtm").css({"margin":"9px 0px 0px 0px","text-align":"left"});
    //$(".po.hin").hide();//点评回复
    //$(".ratc").hide();//弹出窗口
    $(".keke_ds").hide();
    //$("#copyright").hide();//转载说明
    //$(".modact").hide();//主题操作记录
    //$(".cm").hide();点评内容
    $(".tip.tip_4t").hide();
    $(".tip.tip_4").hide();
    $(".mbn").not(".mbn.savephotop").hide();
    $("[smilieid]").css({"width":"20px","max-height":"25px","margin":"0 5px"});
    $(".t_fsz").css('min-height','20px');
    //$(".subforum_left_title_right_down").hide();//顶部收藏主题和复制链接
    $(".subforum_left_title_right_up").hide();
    //$("#thread_subject").css("max-width","880px");//帖子标题
    $(".avtm").not(".avatar.avtm").children("img").css({"height":"50px","width":"50px","padding":"0px","background":"none","box-shadow":"none"});//用户图片大小
    $(".ad").css({"background-color": "#6bf"});//
    $(".pls").find(".pi").css({"margin":"0px 0px -30px 28px","height":"0px","border-bottom":"0"});
    //$(".pls").not(".pls.favatar").css({"border-right":"7px solid #66bbff"});//分割线
    $(".plc").find(".pi").css({"margin":"0 0 -15px 0","height":"16px","border-bottom":"0"});//个人信息
    $(".plc").find(".pi").find("a").css({"margin-top":"-15x","padding":"3px"});
    $(".pct").css("padding-bottom","0em");
    $(".original_text_style1").hide();
    //$(".y").hide();
    //$(".pstl.xs1.cl").css({"padding":"0"})//点评
    //$(".pls").css("vertical-align","inherit")
})

//个人回复框改造
$(document).ready(function(){
$('.plhin').each(function(){
    var tr3 = $(this);
    var medal_1 = '<img style="margin-bottom:5px" src="https://blob.keylol.com/common/usergroup/s6.png">';
    var medal_2 = '<img style="margin-bottom:5px" src="static/image/common/medal_md2016_7COR.png">';
    var medal = medal_1 + medal_2;
    var keyword = $(this).find('a[class=avtm]').attr("href");
    var banID = $(this).find('.locked').text();
    //var img = $(this).find('img[class=zoom]');
    //var imgwidth = img.attr("width");
    //console.log(imgwidth)
    //console.log(banID);
    if (keyword.startsWith('suid-342784'))
    {
        tr3.css({'box-shadow':'rgb(250 179 225) 0px 0px 15px, rgb(248 175 229) 0px 0px 3px 1px','margin':'10px 0'});
        //tr3.find('div:first').append('<div style="margin-left:0px">' + medal + '</div>');
        tr3.find('a[class=xw1]').css('color','#fb7299');
        tr3.find('tr[class=ad]').hide();
    }
    //else if (banID.includes('作者被禁止或删除'))
    //{
    //    tr3.remove();
    //}
    //else if (imgwidth < 101){
    //   console.log(imgwidth);
    //    img.css({"width":"25"})
    //}
});
    })

//欢乐时光提醒
$(document).ready(function(){
$('tbody').each(function(){
    var td = $(this);
    td.find("th[class=common]").nextAll().children().remove();
    td.find("th[class=common]").children("img").hide();
    var keyword = $(this).find('a').text();
    if(keyword.includes('欢乐时光'))
    {
        td.find("td:first").nextAll().css("background-color","#fb7299");
        td.find("td:first").css("background-color","#fb7299");
        //td.find("th[class=common]").nextAll().children().remove();
        //td.find("th[class=common]").children("img").remove();
    }
});
    })
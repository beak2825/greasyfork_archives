// ==UserScript==
// @name         avmoo快速浏览
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  让你能够快速浏览avmoo中的内容
// @author       You
// @match        *://javlog.com/*
// @match        *://avmoo.com/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368290/avmoo%E5%BF%AB%E9%80%9F%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/368290/avmoo%E5%BF%AB%E9%80%9F%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    console.log('加载avmoo快速浏览脚本');
    //遮罩div
    var pos_div=$('<div style="width:100%;height:100%;left:0;top:0; position:absolute;opacity:0;background:#99CCFF;z-index:20;"></div>');
    var check_spn =$('<span data style="position:absolute;left: 40px;top: 150px;z-index: 40;width: 100px;font: 16px 微软雅黑;background: #2774D8;color: #FFF;text-align: center;cursor:pointer;">查看</span>');
    var search_spn =$('<span data style="position:absolute;left: 40px;top: 180px;z-index: 40;width: 100px;font: 16px 微软雅黑;background: #2774D8;color: #FFF;text-align: center;cursor:pointer;">搜种</span>');
    check_spn.click(function(){
        showIframe($(this).attr('data'),1000,800);
    });
    search_spn.click(function(){
        var url = 'https://btso.pw/search/'+ $(this).attr('data');
        console.log(url);
        showIframe(url,1000,800);
    });

    pos_div.append(check_spn);
    pos_div.append(search_spn);
    //鼠标移入，显示该项
    pos_div.mouseover(function(){
        $(this).css('opacity','0.85');
    });
    pos_div.mouseout(function(){
        $(this).css('opacity','0');
    });
    //插入到页面中
    $('.item .photo-frame').append(pos_div);
    //遍历a标签获取链接和番号
    $('.movie-box').each(function(){
        //遍历所有a标签链接，赋给check_spn
        $(this).find('span:eq(0)').attr('data',$(this).attr('href'));
        $(this).removeAttr('href');
        //获取所有番号给search_spn
        $(this).find('span:eq(1)').attr('data',$(this).find('date:eq(0)').html());
    });

})();


function showIframe(url,w,h){
    //添加iframe
    var if_w = w;
    var if_h = h;
    //allowTransparency='true' 设置背景透明
    $("<iframe width='" + if_w + "' height='" + if_h + "' id='YuFrame1' name='YuFrame1' style='position:absolute;z-index:999;'  frameborder='no' marginheight='0' marginwidth='0' allow Transparency='true' security='restricted' sandbox=''></iframe>").prependTo('body');
    var st=document.documentElement.scrollTop|| document.body.scrollTop;//滚动条距顶部的距离
    var sl=document.documentElement.scrollLeft|| document.body.scrollLeft;//滚动条距左边的距离
    var ch=document.documentElement.clientHeight;//屏幕的高度
    var cw=document.documentElement.clientWidth;//屏幕的宽度
    var objH=$("#YuFrame1").height();//浮动对象的高度
    var objW=$("#YuFrame1").width();//浮动对象的宽度
    var objT=Number(st)+(Number(ch)-Number(objH))/2;
    var objL=Number(sl)+(Number(cw)-Number(objW))/2;
    $("#YuFrame1").css('left',objL);
    $("#YuFrame1").css('top',objT);
    $("#YuFrame1").attr("src", url);
    //添加背景遮罩
    $("<div id='YuFrame1Bg' style='background-color: Gray;display:block;z-index:998;position:absolute;left:0px;top:0px;filter:Alpha(Opacity=30);/* IE */-moz-opacity:0.4;/* Moz + FF */opacity: 0.4; '/>").prependTo('body');
    var bgWidth = Math.max($("body").width(),cw);
    var bgHeight = Math.max($("body").height(),ch);
    $("#YuFrame1Bg").css({width:bgWidth,height:bgHeight});
    //点击背景遮罩移除iframe和背景
    $("#YuFrame1Bg").click(function() {
        $("#YuFrame1").remove();
        $("#YuFrame1Bg").remove();
    });
}

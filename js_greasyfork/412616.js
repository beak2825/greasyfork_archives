// ==UserScript==
// @name         91wii彩色快捷回复
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @match        https://www.91wii.com/*
//@grant unsafeWindow

// @downloadURL https://update.greasyfork.org/scripts/412616/91wii%E5%BD%A9%E8%89%B2%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/412616/91wii%E5%BD%A9%E8%89%B2%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
jQuery.noConflict();
(function($){
    //.....
   //清空select
$("select#study_fastpost").empty();
//加上想说的话
$("select#study_fastpost").append("<option selected='selected' value=''>91wii彩色快捷回复</option>").append("<option value='[color=FF0000]楼[/color][color=ED0012]主[/color][color=DB0024]发[/color][color=C80037]贴[/color][color=B60049]辛[/color][color=A4005B]苦[/color][color=92006D]了[/color][color=800080]，[/color][color=6D0092]谢[/color][color=5B00A4]谢[/color][color=4900B6]楼[/color][color=3700C8]主[/color][color=2400DB]分[/color][color=1200ED]享[/color][color=0000FF]！[/color]'>楼主发贴辛苦了，谢谢楼主分享！</option>").append("<option value='[color=FF0000]楼主太[/color][color=CC0033]厉害了[/color][color=990066]！楼主[/color][color=660099]，I*[/color][color=3300CC]老*虎[/color][color=0000FF]*U！[/color]'>楼主太厉害了！楼主，I*老*虎*U！</option>").append("<option value='[color=FF0000]这[/color][color=E80017]东[/color][color=D1002E]西[/color][color=B90046]我[/color][color=A2005D]收[/color][color=8B0074]了[/color][color=74008B]！[/color][color=5D00A2]谢[/color][color=4600B9]谢[/color][color=2E00D1]楼[/color][color=1700E8]主[/color][color=0000FF]！[/color]'>这东西我收了！谢谢楼主！</option>").append("<option value='[color=FF0000]我[/color][color=E6001A]看[/color][color=CC0033]不[/color][color=B2004C]错[/color][color=990066]噢[/color] [color=660099]谢[/color][color=4C00B2]谢[/color][color=3300CC]楼[/color][color=1A00E6]主[/color][color=0000FF]！[/color]'>我看不错噢 谢谢楼主！</option>").append("<option value='[color=FF0000]既[/color][color=F4000B]然[/color][color=E90016]你[/color][color=DE0021]诚[/color][color=D3002C]信[/color][color=C80037]诚[/color][color=BC0043]意[/color][color=B1004E]的[/color][color=A60059]推[/color][color=9B0064]荐[/color][color=90006F]了[/color][color=85007A]，[/color][color=7A0085]那[/color][color=6F0090]我[/color][color=64009B]就[/color][color=5900A6]勉[/color][color=4E00B1]为[/color][color=4300BC]其[/color][color=3700C8]难[/color][color=2C00D3]的[/color][color=2100DE]看[/color][color=1600E9]看[/color][color=0B00F4]吧[/color][color=0000FF]！[/color]'>既然你诚信诚意的推荐了，那我就勉为其难的看看吧！</option>").append("<option value='[color=FF0000]其[/color][color=F0000F]实[/color][color=E1001E]我[/color][color=D2002D]一[/color][color=C3003C]直[/color][color=B4004B]觉[/color][color=A5005A]得[/color][color=960069]楼[/color][color=870078]主[/color][color=780087]的[/color][color=690096]品[/color][color=5A00A5]味[/color][color=4B00B4]不[/color][color=3C00C3]错[/color][color=2D00D2]！[/color][color=1E00E1]呵[/color][color=0F00F0]呵[/color][color=0000FF]！[/color]'>其实我一直觉得楼主的品味不错！呵呵！</option>").append("<option value='[color=FF0000]感[/color][color=E3001C]谢[/color][color=C60039]楼[/color][color=AA0055]主[/color][color=8E0071]的[/color][color=71008E]无[/color][color=5500AA]私[/color][color=3900C6]分[/color][color=1C00E3]享[/color][color=0000FF]！[/color]'>感谢楼主的无私分享！</option>").append("<option value='[color=FF0000]楼[/color][color=E3001C]主[/color][color=C60039]，[/color][color=AA0055]大[/color][color=8E0071]恩[/color][color=71008E]不[/color][color=5500AA]言[/color][color=3900C6]谢[/color][color=1C00E3]了[/color][color=0000FF]！[/color]'>楼主，大恩不言谢了！</option>").append("<option value='[color=FF0000]楼[/color][color=E3001C]主[/color][color=C60039]，[/color][color=AA0055]我[/color][color=8E0071]太[/color][color=71008E]崇[/color][color=5500AA]拜[/color][color=3900C6]你[/color][color=1C00E3]了[/color][color=0000FF]！[/color]'>楼主，我太崇拜你了！</option>").append("<option value='[color=FF0000]社[/color][color=EE0011]区[/color][color=DD0022]不[/color][color=CC0033]能[/color][color=BB0044]没[/color][color=AA0055]有[/color][color=990066]像[/color][color=880077]楼[/color][color=770088]主[/color][color=660099]这[/color][color=5500AA]样[/color][color=4400BB]的[/color][color=3300CC]人[/color][color=2200DD]才[/color][color=1100EE]啊[/color][color=0000FF]！[/color]'>社区不能没有像楼主这样的人才啊！</option>").append("<option value='[color=FF0000]这[/color][color=E80017]个[/color][color=D1002E]帖[/color][color=B90046]子[/color][color=A2005D]不[/color][color=8B0074]回[/color][color=74008B]对[/color][color=5D00A2]不[/color][color=4600B9]起[/color][color=2E00D1]自[/color][color=1700E8]己[/color][color=0000FF]！[/color]'>这个帖子不回对不起自己！</option>");
//替换function

function fastpost() {
    document.querySelector("div#fastposteditor.hasfsl").style.display="none";
     //x上限，y下限
    var x = 842;
    var y = 821;
    var rand = parseInt(Math.random() * (x - y + 1) + y);
    //var rand2 = parseInt(Math.random() * (x - y + 1) + y);
    console.log(rand);
    //$("#fastpostmessage").val($(":selected").val());
    //$("button#fastpostsubmit.pn.pnc.vm").click();
    //$("fastpostmessage").value = "{:1_"+rand+":}"+"{:1_"+rand2+":}"+$("study_fastpost").value;
    $("fastpostmessage").value = "{:1_"+rand+":}"+$("study_fastpost").value;
    document.querySelector("button#fastpostsubmit.pn.pnc.vm").click();
}




addJS_Node (fastpost);

function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type                         ="text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}//添加新的js脚本覆盖原有函数
})(jQuery);
})();
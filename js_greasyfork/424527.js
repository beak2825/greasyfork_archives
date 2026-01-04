// ==UserScript==
// @name BetterNMF
// @namespace ewtowit
// @author ewtowit
// @description 网易我的世界论坛简单优化和扩展
// @match https://mc.netease.com/*
// @version 2NaCl
// @license CC BY 4.0
// @downloadURL https://update.greasyfork.org/scripts/424527/BetterNMF.user.js
// @updateURL https://update.greasyfork.org/scripts/424527/BetterNMF.meta.js
// ==/UserScript==
(function () {
  "use strict";
  //在手机视图时访问PC视图
    if (document.getElementsByTagName('meta')['viewport']) {
         var go_href = location.href + "?mobile=no";
        window.open(go_href);
     };
   //jq support
   let $ = jQuery;
   //给标签加个属性，用于检查
   //$('html').attr('Nayt','Cute');
   //移除栏目（帖子都看不了了挂着作甚）
    $('.md-module , .md').hide();
    //移除底部
    $("div#OPD-COPYRIGHT").hide()
    //看板绵羊
    $('.stone-man').css('background','url(https://z3.ax1x.com/2021/05/23/gXtY5t.png) no-repeat bottom center/ contain');
    //add avatar
    $('.avatar').css('margin','10px 15px');
    $('.authi > a.xw1').each(function(){
        var userpageurl = $(this).attr('href');//Like: ' //mc.netease.com/home.php?mod=space&uid=114514
        var uid = userpageurl.substring(40);
        var avataradd = '<div><div class="avatar"><a href="https://mc.netease.com/home.php?mod=space&uid=' + uid  + '" class="avtm" target="_blank"><img src="' + 'https://mc-uc.netease.com//avatar.php?uid=' + uid + '&size=middle' + '"></a></div></div>';
        $(this).parent().parent().after(avataradd);
    });
    //添加隐藏链接
   $('.user-info > p').append('<a>——————</a><a href="https://mc.netease.com/home.php?mod=space&do=space&view=me">我的空间</a><a href="https://mc.netease.com/forum.php?mod=misc&action=showdarkroom">小黑屋</a><a href="https://mc.netease.com/misc.php?mod=ranklist">排行榜</a><a href="https://mc.netease.com/home.php?mod=space&do=thread&view=me&type=thread&from=&filter=recyclebin">被回收帖</a><a href="https://mc.netease.com/member.php?mod=switchstatus">切换在线状态</a><a href="https://mc.netease.com/group.php">小组</a><a href="https://mc.netease.com/home.php?mod=medal">勋章</a>');
    //关闭签到提醒
    $('#plugin_notice').hide();
   //隐藏版块
   if($(location).attr('href')=='https://mc.netease.com/'){
   $('.fl').append('<div class="bm bmw  flg cl"><div class="bm_h cl"><h2>隐藏版块</h2></div><div id="category_38" class="bm_c" style=""><table cellspacing="0" cellpadding="0" class="fl_tb"><tr><td class="fl_g" width="49.9%"><div class="forumblock-wrapper"><div class="fl_icn_g" style="width: 160px;"><a href="//mc.netease.com/forum-111-1.html"><img src="data/attachment/common/69/common_111_icon.png" align="left" alt="开发者版" /></a></div><dl style="margin-left: 160px;"><dt><a href="//mc.netease.com/forum-111-1.html">开发者版</a></dt><em class="xw0 xi1" title="fid"> (111)</em></dt><dd><p class="xg2">进行开发者问题的讨论互助</p></dd></dl></div></td><td class="fl_g" width="49.9%"><div class="forumblock-wrapper"><div class="fl_icn_g" style="width: 160px;"><a href="//mc.netease.com/forum-51-1.html"><img src="data/attachment/common/a6/common_54_icon.png" align="left" alt="版主之城" /></a></div><dl style="margin-left: 160px;"><dt><a href="//mc.netease.com/forum-51-1.html">版主之城</a><em class="xw0 xi1" title="fid"> (51)</em></dt><dd><p class="xg2">看看就行</p></dd></dl></div></td></tr></table></div></div>');
   };
   
})();
// ==UserScript==
// @name         晓东CAD论坛+CSDN博客精简
// @version      1.0.2
// @description  晓东论坛去广告+自动签到; CSDN博客去广告
// @author       yxpxa
// @match        *://blog.csdn.net/*
// @match        *://bbs.xdcad.net/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at       document-end
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/376549/%E6%99%93%E4%B8%9CCAD%E8%AE%BA%E5%9D%9B%2BCSDN%E5%8D%9A%E5%AE%A2%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/376549/%E6%99%93%E4%B8%9CCAD%E8%AE%BA%E5%9D%9B%2BCSDN%E5%8D%9A%E5%AE%A2%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function(){
  'use strict';
  var $ = $ || window.$;
  var ss = window.location.href;
  if (/[//]blog.csdn.net[/]/.test(ss)) removeCSDN();
  if (/[//]bbs.xdcad.net[/]/.test(ss)) tremtXDCAD();

//****************** 晓东 CAD 论坛精简 ******************
function tremtXDCAD(){
var delnote=[
  '#forum_rules_14',   //板块警告提示
  '#toptb',    //页面最顶一行
  "#connectlike", //首页水平广告
  '#diy1',  //友情链接？
  '#study_nge_div', //首页图片和flash
  '.a_mu',  //顶端横幅广告
  '#olgift_window_7ree',  //礼包悬浮div
  '.zzza_tixing',  //摇一摇手机悬浮div
  '.a_cn'  //晓东开源函数悬浮div
  ];
$(delnote.join(',')).remove();

//只保留两个置顶帖，其他置顶帖干掉
var zhuti = $("#threadlisttableid").children();
var j=0, sum=2; //只留 2 个置顶帖子
for(var i=0,len=zhuti.length;i<len;i++){
  if(/stickthread/.test(zhuti[i].id)){
    if (j<=sum) j++;
    if (j>sum) zhuti[i].remove();
  }
}

//精简个人信息
if (/net[/]thread/.test(ss)){
  $('.a_pr,.a_pt').remove();
  $('.plc.plm').remove();
  var yh = $('.pls.favatar');
  for(var i=0,len=yh.length;i<len;i++){
    $(yh[i].children).each(function(){
      if (/签到|礼包/.test($(this).text())) $(this).remove();
    });
  }
}

//每天0点以后，自动选择心情并提交
if (/xdcad.net[/]plugin.php/.test(ss)){
  if (/您今天已经签到过了/.test($('h1.mt').text())){
    window.location.href='http://bbs.xdcad.net/forum.php';
  }else{
    $('#kx').click();
    $(':submit.btn').click();
  }
}
}

//****************** CSDN 博客净化 ******************
function removeCSDN(){

//删除广告节点
var delnote=['#kp_box_57','#dmp_ad_58','.pulllog-box','.meau-gotop-box','.fourth_column','.light-box','.blog-column-pay'];
$(delnote.join(',')).remove();

//广告父节点删除
$('#cpro_u2734133,.pos-box').parent().remove();

//保留前5个最热门的相关文章，其余内容和广告删除
var recmd = $('.recommend-box').children();
var j=0,sum=5;
for (var i=0,len=recmd.length;i<len;i++){
  if (recmd[i].innerText===""){
    recmd[i].remove(); //首先删除广告植入
 }else if(j<sum){
   j++;
 }else{
   recmd[i].remove(); //删除超过sum=5条以后内容
 }
}

//以下修改 article_content 的高度为自动，原网站超出高度被隐藏了。
$('#article_content').css({'height':'auto','overflow':'auto'});
//移除博文里'更多内容'的按钮，移除用户归档模块
$(".hide-article-box.text-center,#asideArchive").remove();

//精简联系我们 ，完全删除会导致左侧悬挂不能自动适应屏幕位置。
$(".contact-info,.bg-gray").remove();
$(".allow-info-box").html('<p>CSDN 广告去除 小蜜蜂  2019</p>');

//清空页面右侧悬挂，里面有广告和乱入的评论
$(".recommend-fixed-box").remove();
}
})();

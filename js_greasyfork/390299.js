// ==UserScript==
// @name         zswlxy
// @namespace    http://tampermonkey.net/
// @match https://zswlxy.zsskjxh.org.cn/*
// @description 中山会计继教刷课
// @version  1.01
// @grant GM_setValue
// @grant GM_getValue
// @icon https://www.zswlxy.com.cn/kjwx/webassets/css/images/zxlogin.png
// @downloadURL https://update.greasyfork.org/scripts/390299/zswlxy.user.js
// @updateURL https://update.greasyfork.org/scripts/390299/zswlxy.meta.js
// ==/UserScript==
$(function() {

 if (location.pathname.search('toStudy') > -1) { //toStudy页面
  var ccg = GM_getValue("ccg")
  popCodeW= function() {};
  playerKZ.popCodeW= function() {};
  playerKZ.popUp = function() {}; //使题目弹窗方法失效
  player.on('ended', function() { //重写onEnded
   console.log('结束播放');
   $(".global_top_label_other:contains(学习课程)").click() //退回toCourse界面
  });
  setTimeout(function() {
   //todo:errorCode
   player.play(); //开始播放
   player.mute(); //静音
   var interval = setInterval(function() {
    if (player.getDuration() > 0) {
     var startPoint = parseInt(player.getDuration() * ccg);
     if (startPoint > 30) {
      startPoint -= 30;
     } //预留30s，防止时长不足
     player.seek(startPoint * ccg - 20); //根据比例seek
     clearInterval(interval);
    }
   }, 500);
  }, 1000); //延时1秒进行，确保加载防止error
 }

 if (location.pathname.search('toCourse') > -1) { //toCourse页面
  var lessons = $("tr:contains(继续学习)");
  if (lessons.length < 1) {
   lessons = $("tr:contains(开始学习)")
  }
  var next = $(lessons[0]).find("a");
  if (next == null) {
   alert("本课程学习完毕，请进行考试！");
   return;
  }
  GM_setValue("ccg", $(lessons[0]).find("span")[0].innerHTML / $(lessons[0]).find("span")[1].innerHTML); //已学时长比例
  next.click();
 }

 //todo:已购买的年度科目跳转
 /*function getUrlParam(name) {//获得url参数
     var param = location.href.match("(?<=" + name + "=).*?(?=&|$)")[0];
     return param == null ? null : param
 }*/
})// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.tampermonkey.net/index.php?version=4.17.6161&ext=fire&updated=true
// @icon         https://www.google.com/s2/favicons?sz
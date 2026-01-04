// ==UserScript==
// @name         学习爱国播放量 刷刷刷！
// @version      0.1
// @description  每小时保底10次 至多20次 完全随机 一天17小时
// @namespace    https://www.fanxingna.top
// @author       fx
// @connect      article.xuexi.cn/articles/index.html?*
// @include      https://article.xuexi.cn/articles/index.html?*
// @downloadURL https://update.greasyfork.org/scripts/407113/%E5%AD%A6%E4%B9%A0%E7%88%B1%E5%9B%BD%E6%92%AD%E6%94%BE%E9%87%8F%20%E5%88%B7%E5%88%B7%E5%88%B7%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/407113/%E5%AD%A6%E4%B9%A0%E7%88%B1%E5%9B%BD%E6%92%AD%E6%94%BE%E9%87%8F%20%E5%88%B7%E5%88%B7%E5%88%B7%EF%BC%81.meta.js
// ==/UserScript==


var num=Math.floor(Math.random()*6+3);
setInterval(function () {
    var date=new Date();
    var aa=date.getHours();
  if(aa<=22&&aa>=7){
    var showTimeInterval=setInterval(function () {
    var redList = document.querySelectorAll(".dplayer-play-icon");
    redList[0].click();
    window.location.href=window.location.href;
 },num*60*1000)
}else{
clearInterval(showTimeInterval);
    window.location.href=window.location.href;}
},60*60*1000)
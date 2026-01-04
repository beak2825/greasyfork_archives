// ==UserScript==
// @name         twitter个人页面自动关闭（旧UI）
// @description  twitterr个人页面自动关闭 适用于旧UI
// @version      1.1
// @namespace   https://space.bilibili.com/482343
// @author      超神越鬼
// @license     超神越鬼
// @include      https://twitter.com/*
//@exclude https://twitter.com/
//@exclude https://twitter.com/home
// @grant        window.close
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/403551/twitter%E4%B8%AA%E4%BA%BA%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%EF%BC%88%E6%97%A7UI%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/403551/twitter%E4%B8%AA%E4%BA%BA%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%EF%BC%88%E6%97%A7UI%EF%BC%89.meta.js
// ==/UserScript==
var e,i,oa,j,z=1;
var sy = 6; //推文数量小于sy个自动关闭
var sjdy = 365; //最新推特发布时间大于sjdy天自动关闭
var ziji = GM_getValue("ziji","在这里输入自己的推特名防止误关自己的");
GM_setValue("ziji", ziji);
function gb(){
 window.close();
}
e = location.href.split(".com/")[1];
/* 已屏蔽的自动关闭，已关注的不操作*/
if (e.indexOf("/")>-1 || e.indexOf("?")>-1 || e.indexOf("=")>-1 || e.indexOf(ziji)>-1)return;
var topics = document.getElementsByTagName('span');
for (i = 0; i < topics.length; i++) {
     var a = topics[i];
     if (a.textContent.indexOf("正在关注")>-1 || a.textContent.indexOf("已屏蔽")>-1 ){
          if (a.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("class")=="ProfileNav-item ProfileNav-item--userActions u-floatRight u-textRight with-rightCaret "){
               var oValue = getComputedStyle(a.parentElement,null).display;
               if (oValue=="block"){
                    if (a.textContent.indexOf("正在关注")>-1){console.log("已关注");return;}
                    if (a.textContent.indexOf("已屏蔽")>-1 ){console.log("已屏蔽");gb();}
               }}}}

/* 无推文自动关闭 */
e = document.getElementsByTagName("h3");
for ( i=0;i<e.length;i++){
     oa = e[i].innerText;
     if (oa!=null){if (oa.indexOf("没有推文")>-1){
          console.log("无推文自动关闭");
          gb();
     }}
}
//推文数量少于 sy 个自动关闭
e = document.getElementsByClassName('ProfileNav-value');
for ( i=0;i<e.length;i++){
     if (e[i].previousSibling.previousSibling!=null){
          if(e[i].previousSibling.previousSibling.innerText.indexOf("推文")>-1){
               //console.log(e[i]);
               oa = e[i].innerText;
               if (oa!=null){
                    if (oa<sy){
                         console.log("推文少于 ",sy," 自动关闭");
                         gb();
                    }
               }
          }
     }
}

//最新推特发布时间大于sjdy天自动关闭
i = 0;
e = document.getElementsByClassName('tweet-timestamp js-permalink js-nav js-tooltip');
for (oa=0;oa<e.length;oa++){
     z = 0;
     i = Math.floor(e[oa].firstChild.getAttribute("data-time-ms")/86400000);
     j = Math.floor(new Date().getTime()/86400000);
     console.log("最新推特相差天数：",j-i);
     if (j-i<sjdy)return;
     if (oa>15)break;
}
if (z)return;
console.log("最推发布时间大于 ",sjdy," 天");
gb();
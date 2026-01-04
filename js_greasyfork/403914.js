// ==UserScript==
// @name         twitter个人页面自动关闭（新UI）
// @description  twitterr个人页面自动关闭 适用于新UI
// @version      1.0
// @namespace   https://space.bilibili.com/482343
// @author      超神越鬼
// @license     超神越鬼
// @include      https://twitter.com/*
//@exclude https://twitter.com/
//@exclude https://twitter.com/home
// @grant        window.close
// @grant GM_setValue
// @grant GM_getValue
//@run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/403914/twitter%E4%B8%AA%E4%BA%BA%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%EF%BC%88%E6%96%B0UI%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/403914/twitter%E4%B8%AA%E4%BA%BA%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%EF%BC%88%E6%96%B0UI%EF%BC%89.meta.js
// ==/UserScript==
var sy = 6; //推文数量小于sy个自动关闭
var sjdy = 365; //最新推特发布时间大于sjdy天自动关闭
var ziji = GM_getValue("ziji","在这里输入自己的推特名防止误关自己的");
GM_setValue("ziji", ziji);
var e,i,oa,j,z=1,zzz=0,fl,debugx = 0;
function gb(){
     zzz=1;
     window.close();
}
function pd(){
     //推文数量少于 sy 个自动关闭
     e = document.getElementsByClassName('css-901oao css-bfa6kz r-111h2gw r-1qd0xha r-n6v787 r-16dba41 r-1sf4r6n r-bcqeeo r-qvutc0');
     if (e.length==0)return;
     oa = e[0].innerText.split(" 推文")[0];
     if (oa<sy){
          console.log("推文数量:   ",oa,"  少于 ",sy,"  自动关闭");
          gb();
          return;
     }
     //最新推特发布时间大于sjdy天自动关闭
     i = 0;
     e = document.getElementsByTagName('time');
     if (e.length==0)return;
     for (oa=0;oa<e.length;oa++){
          i = new Date(e[oa].getAttribute("datetime"));
          j = new Date();
          fl = Math.floor((j-i)/86400000);
          console.log("最新推特相差天数：",fl);
          if (fl<sjdy){zzz=1;return}
     }
     console.log("最推发布时间大于 ",sjdy," 天");
     gb();
}
var int=setInterval(function (){
     if(zzz){clearInterval(int);return}
     e = location.href.split(".com/")[1];
     /* 已屏蔽的自动关闭，已关注的不操作*/
     if (e.indexOf("/")>-1 || e.indexOf("?")>-1 || e.indexOf("=")>-1 || e.indexOf(ziji)>-1){zzz=1;return}
     var topics = document.getElementsByTagName('span');
     fl = document.querySelector("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-yfoy6g.r-18bvks7.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div.css-1dbjc4n.r-obd0qt.r-18u37iz.r-1w6e6rj.r-1wtj0ep > div > div > div > div > div > span > span")
     if (debugx)console.log("判断  : ", fl);
     if (fl==null) return;
     if (fl.textContent.indexOf("正在关注")>-1){console.log("已关注");zzz=1;return;}
     if (fl.textContent.indexOf("已屏蔽")>-1 ){console.log("已屏蔽");gb();}
    pd();
},500);

// ==UserScript==
// @name 自用解析辅助脚本
// @description 脚本功能目前有：给“解析脚本”添加自定义接口（需要配合jxb解析脚本 822以上版本 才有效果）。
// @author 江小白
// @version 963540817.4
// @match *://*.le.com/*
// @match *://*.qq.com/*
// @match *://*.1905.com/*
// @match *://*.acfun.cn/*
// @match *://*.mgtv.com/*
// @match *://*.pptv.com/*
// @match *://*.youku.com/*
// @match *://*.iqiyi.com/*
// @match *://*.ixigua.com/*
// @match *://*.tv.sohu.com/*
// @match *://*.bilibili.com/*
// @include *://*.le.com/*
// @include *://*.qq.com/*
// @include *://*.1905.com/*
// @include *://*.acfun.cn/*
// @include *://*.mgtv.com/*
// @include *://*.pptv.com/*
// @include *://*.youku.com/*
// @include *://*.iqiyi.com/*
// @include *://*.ixigua.com/*
// @include *://*.tv.sohu.com/*
// @include *://*.bilibili.com/*
// @grant none
// @noframes
// @run-at document-body
// @namespace https://greasyfork.org/users/866655
// @downloadURL https://update.greasyfork.org/scripts/439358/%E8%87%AA%E7%94%A8%E8%A7%A3%E6%9E%90%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/439358/%E8%87%AA%E7%94%A8%E8%A7%A3%E6%9E%90%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function(){'use strict';if(self!=top){return false;}else{if(document.querySelector("\u6c5f\u5c0f\u767d\u81ea\u5b9a\u4e49\u63a5\u53e3")==null){document.head.appendChild(document.createElement("\u6c5f\u5c0f\u767d\u81ea\u5b9a\u4e49\u63a5\u53e3"));
let 生效网址关键字=/(?:youku|tudou|qq|1905|mgtv|iqiyi|sohu|le|pptv|bilibili|acfun|ixigua)/i;if(location.href.match(生效网址关键字)&&!(location.href.match(/^https?:\/\/(?:www|m)\.iqiyi\.com\/(?:a_|kszt\/)/)&&document.title.match(new RegExp("在线观看")))&&!(location.href.match(/^https?:\/\/(?:www|m)\.iqiyi\.com\/v_/)&&document.title.match(new RegExp("名师课堂")))){
/* ** 自定义修改 Josn 全局播放器地址 （必须是 https 类型）** */
let 电脑json全局播放器="https://api.ldjx.cc/wp-api/ifr.php?isDp=1&vid=";
let 手机json全局播放器="https://player.laoyam3u8.com/aliplayer/?url=";
/* ********填入想屏蔽的接口名称，屏蔽多个用 | 隔开********** */
let 全局自定义屏蔽接口=/(?:百域阁|无名)/i;
/* ****************************************************** */
localStorage.setItem('电脑Json全局播放器',电脑json全局播放器);localStorage.setItem('手机Json全局播放器',手机json全局播放器);if(location.host.match(生效网址关键字)){let zdyjkb=[
/* ************** 根据以下格式，自己添加接口**************** */
{name:"测试",url:"https://m.kuo2.cn/?url="},
{name:"盘古",url:"https://www.pangujiexi.cc/jiexi.php?url="},
{name:"8090",url:"https://www.8090g.cn/?url="},
{name:"4K",url:"https://jx.4kdv.com/?url="},
{name:"九八",url:"https://jx.youyitv.com/?url="},
{name:"黑云",url:"https://jiexi.380k.com/?url="},
{name:"33T",url:"https://www.33tn.cn/?url="},
{name:"17K",url:"https://17kyun.com/api.php?url="},
{name:"52",url:"https://jx.52damu.com/?url="},

  


];localStorage.setItem('江小白自定义接口',JSON.stringify(zdyjkb));let zdyjkpbobj=setInterval(function(){try{if(document.querySelector("ul#httpsvipul>li:last-of-type")){const zdyjkpb=document.querySelectorAll('ul#httpsvipul>li');for(let zdyjkpbi=0;zdyjkpbi<zdyjkpb.length;zdyjkpbi++){const zdyjkpbmsa=zdyjkpb[zdyjkpbi].querySelectorAll('a4');for(let zdyjkpbia=0;zdyjkpbia<zdyjkpbmsa.length;zdyjkpbia++){if(zdyjkpbmsa[zdyjkpbia].innerText.match(全局自定义屏蔽接口)){zdyjkpb[zdyjkpbi].setAttribute('style','display:none!important');}};};clearInterval(zdyjkpbobj);}else{}}catch(e){clearInterval(zdyjkpbobj);}},1234);}}}else{return false;}}})();


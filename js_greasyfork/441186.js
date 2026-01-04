// ==UserScript==
// @name 解析辅助脚本
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
// @match *://*.film.sohu.com/*
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
// @include *://*.film.sohu.com/*
// @include *://*.bilibili.com/*
// @grant none
// @noframes
// @run-at document-body
// @namespace https://greasyfork.org/users/881956
// @downloadURL https://update.greasyfork.org/scripts/441186/%E8%A7%A3%E6%9E%90%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/441186/%E8%A7%A3%E6%9E%90%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function(){'use strict';if(self!=top){return false;}else{if(document.querySelector("\u6c5f\u5c0f\u767d\u81ea\u5b9a\u4e49\u63a5\u53e3")==null){document.head.appendChild(document.createElement("\u6c5f\u5c0f\u767d\u81ea\u5b9a\u4e49\u63a5\u53e3"));
let 生效网址关键字=/(?:youku|tudou|qq|1905|mgtv|iqiyi|sohu|le|pptv|bilibili|acfun|ixigua)/i;if(location.href.match(生效网址关键字)&&!(location.href.match(/^https?:\/\/(?:www|m)\.iqiyi\.com\/(?:a_|kszt\/)/)&&document.title.match(new RegExp("在线观看")))&&!(location.href.match(/^https?:\/\/(?:www|m)\.iqiyi\.com\/v_/)&&document.title.match(new RegExp("名师课堂")))){
/* ** 自定义修改 Josn 全局播放器地址 （必须是 https 类型）** */
let 电脑json全局播放器="https://api.ldjx.cc/wp-api/ifr.php?isDp=1&vid=";
let 手机json全局播放器="https://player.laoyam3u8.com/aliplayer/?url=";
/* ********填入想屏蔽的接口名称，屏蔽多个用 | 隔开********** */
let 全局自定义屏蔽接口=/(?:百域阁)/i;
/* ****************************************************** */
localStorage.setItem('电脑Json全局播放器',电脑json全局播放器);localStorage.setItem('手机Json全局播放器',手机json全局播放器);if(location.host.match(生效网址关键字)){let zdyjkb=[
/* ************** 根据以下格式，自己添加接口**************** */
{name:"邦宁",url:"https://video.isyour.love/player/getplayer?url=%s",vip:"强制搜索",jj:"1",diy:"hotpink",j:"电脑"},
{name:"电影狗",url:"https://www.dianyinggou.com/so/%s",vip:"强制搜索",jj:"1",diy:"hotpink",j:"电脑"},
{name:"网电",url:"http://www.wbdy.tv/index.php?m=vod-search&wd=%s",vip:"强制搜索",jj:"1",diy:"hotpink",j:"电脑"},
{name:"APP",url:"https://app.movie/index.php/vod/search.html?wd=%s&submit=",vip:"强制搜索"},
{name:"诺讯",url:"https://www.nunxun.com/index.php/vod/search.html?wd=",vip:"强制搜索"},


{name:"虾米",url:"https://jx.xmflv.com/?url="},
{name:"左岸",url:"https://jx.jsonplayer.com/player/?url="},
//{name:"扶风",url:"https://player.maqq.cn/?url="},
{name:"人人迷",url:"https://jx.blbo.cc:4433/?url="},
//{name:"酷爱",url:"https://json.icu/?url="},
//{name:"特狗",url:"https://cache.tegouys.com/bfq4/analysis.php?v="},
//{name:"PPJ蓝光",url:"https://bf.ppjbk.cn/?url="},
//{name:"夫妻",url:"https://play.fuqizhishi.com/?url="},
//{name:"PPJ解析",url:"https://jx.ppjbk.cn/?url="},
//{name:"PPJ弹幕",url:"https://bf.ppjbk.cn/bf/?url="},
//{name:"对接",url:"https://jx.pchj.net/dashi/kk.php?url="},
{name:"又加",url:"https://cv.htoo.vip/?url="},
//{name:"淘影B",url:"https://jx.1080jx.top/jxvip/?url="},
//{name:"淘影C",url:"https://jx.1080jx.top/m3u8/?url="},
//{name:"淘影E",url:"https://jx.1080jx.top/api/?url="},
//{name:"淘影F",url:"https://jx.1080jx.top/jiexi/?url="},
//{name:"万能",url:"https://vip.legendwhb.cn/m3u8.php?url="},
//{name:"盘古",url:"https://panguapi.ntryjd.net/pangu2021/?url="},
{name:"盘古1",url:"https://www.pangujiexi.cc/jiexi.php?url="},
{name:"4K",url:"https://jx.4kdv.com/?url="},
//{name:"2K",url:"https://vip.2ktvb.com/player/?url="},
//{name:"全网",url:"https://jx.iztyy.com/Bei/?url="},
{name:"8090",url:"https://www.8090g.cn/?url="},
//{name:"诺讯",url:"https://www.nunxun.com/?url="},
{name:"冰豆",url:"https://api.qianqi.net/vip/?url="},
//{name:"宝莲",url:"https://danmu.8old.cn/vip/?url="},
{name:"七哥",url:"https://jx.nnxv.cn/tv.php?url="},
{name:"M3U8",url:"https://jx.m3u8.tv/jiexi/?url="},
{name:"夜幕1",url:"https://www.yemu.xyz/v/c.php?url="},
//{name:"夜幕2",url:"https://www.yemu.xyz/v/dmgs.php?url="},
//{name:"夜幕3",url:"https://www.yemu.xyz/v/d.php?url="},
//{name:"夜幕4",url:"https://www.yemu.xyz/v/e.php?url="},
//{name:"夜幕5",url:"https://www.yemu.xyz/v/bili.php?url="},
//{name:"猪蹄1",url:"https://api.iztyy.com/jiexi/?url="},
//{name:"猪蹄2",url:"https://jx.iztyy.com/svip/?url="},
//{name:"猪蹄3",url:"https://jx.iztyy.com/Bei/?url="},
{name:"PM",url:"https://www.playm3u8.cn/jiexi.php?url="},
{name:"云视",url:"https://ckmov.ccyjjd.com/ckmov/?url="},
//{name:"解析",url:"https://parse.mw0.cc/Bei/?url="},
//{name:"忆梦",url:"https://v.anlhr.cn/?url="},
//{name:"看猫",url:"https://jxi.maonius.cn/?url="},
//{name:"追剧",url:"https://vip123kan.vip/m3u8.php?url="},
//{name:"猫解",url:"https://www.mtosz.com/m3u8.php?url="},
{name:"dm",url:"https://dmjx.m3u8.tv/?url="},
//{name:"星一",url:"https://play.xing1.club/dm.php?url="},
//{name:"97",url:"https://jx.973973.xyz/?url="},
//{name:"全名",url:"https://api.nobij.top/?url="},
//{name:"腾讯云",url:"https://api.jhdyw.vip/?url="},
//{name:"听乐",url:"https://jx.dj6u.com/?url=",ua:"",re:""},
//{name:"鲨鱼",url:"https://dp.favnow.com/?url="},
//{name:"爱看",url:"https://pla.akmeiju.com/m3u8.php?url="},
{name:"盘古云",url:"https://go.yh0523.cn/y.cy?url="},
{name:"CK",url:"https://www.ckplayer.vip/jiexi/?url="},
//{name:"解析la",url:"https://api.jiexi.la/?url="},
//{name:"老板",url:"https://vip.laobandq.com/jiexi.php?url="},
{name:"17云",url:"https://www.1717yun.com/jx/ty.php?url="},
{name:"001",url:"https://www.administratorw.com/admin.php?url="},
//{name:"H8",url:"https://www.h8jx.com/jiexi.php?url="},
//{name:"星驰",url:"https://vip.swuii.top/?url="},
//{name:"云端",url:"https://sb.5gseo.net/?url="},
//{name:"PL",url:"https://jx.playerjy.com/?url="},

//{name:"盒子",url:"https://jx5.178du.com//p1//?url="},
//{name:"多线",url:"https://jx.178du.com/jx2.php?url="},
{name:"OK",url:"https://okjx.cc/?url="},
{name:"七彩",url:"https://www.xymav.com/?url="},
{name:"小七",url:"https://2.08bk.com/?url="},
//{name:"白玉",url:"https://jx.baiyu.buzz/?url="},
//{name:"CC",url:"https://thinkibm.vercel.app/?url="},
//{name:"660",url:"https://660e.com/?url="},
//{name:"618",url:"https://jx.618g.com/?url="},
{name:"2090",url:"https://m2090.com/?url="},
{name:"BL",url:"https://svip.bljiex.cc/?v="},
//{name:"全网2",url:"https://api.xdiaosi.com/?url="},
//{name:"大幕",url:"https://jx.52damu.com/?url="},




];localStorage.setItem('江小白自定义接口',JSON.stringify(zdyjkb));let zdyjkpbobj=setInterval(function(){try{if(document.querySelector("ul#httpsvipul>li:last-of-type")){const zdyjkpb=document.querySelectorAll('ul#httpsvipul>li');for(let zdyjkpbi=0;zdyjkpbi<zdyjkpb.length;zdyjkpbi++){const zdyjkpbmsa=zdyjkpb[zdyjkpbi].querySelectorAll('a4');for(let zdyjkpbia=0;zdyjkpbia<zdyjkpbmsa.length;zdyjkpbia++){if(zdyjkpbmsa[zdyjkpbia].innerText.match(全局自定义屏蔽接口)){zdyjkpb[zdyjkpbi].setAttribute('style','display:none!important');}};};clearInterval(zdyjkpbobj);}else{}}catch(e){clearInterval(zdyjkpbobj);}},1234);}}}else{return false;}}})();


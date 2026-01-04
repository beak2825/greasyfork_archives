// ==UserScript==
// @name 解析辅助脚本
// @description 脚本功能目前有：给“解析脚本”添加自定义接口（需要配合jxb解析脚本--才有效果）。
// @author 江小白
// @version 虎年养老版本
// @include /^https?:\/\/(?:(?:www\.ixigua\.com\/|m\.ixigua\.com\/video\/)\d{10,}(?:\?id=\d{10,}|$)|(?:v(?:-wb)?|m)\.youku\.com\/.+?\/id_|\w+?\.wasu\.c.+?\/[pP]lay\/show\/id\/\d|www\.fun\.tv\/vplay\/g-|m\.fun\.tv\/mplay\/\?mid=|\w+?\.miguvideo\.com\/.+?\/detail\.html\?cid=\d|[^\/]+?\.tudou\.com\/(?:v\/|.+?\/id_)|v\.qq\.com\/(?:x\/(?:cover|page)|.+?\/p\/topic)\/|(?:3g|m)\.v\.qq\.com|w(?:ww)?\.mgtv\.com\/[a-z]\/|www\.mgtv\.com\/act\/|m\.mgtv\.com\/b\/|www\.iqiyi\.com\/(?:[vw]_|kszt\/)|www\.iq\.com\/play\/|m\.iqiyi\.com\/(?:v_|$)|tw\.iqiyi\.com\/v_|tv\.sohu\.com\/v\/|m\.tv\.sohu\.com\/(?:u\/|v|phone_play_film\?aid=)|film\.sohu\.com\/album\/|www\.le\.com\/ptv\/vplay\/|m\.le\.com\/vplay_|[vm]\.pptv\.com\/show\/|(?:vip|m)\.1905\.com\/(?:m\/vod|play)\/|www\.ixigua\.com\/|(?:player|live)\.bilibili\.com\/|www\.bilibili\.com\/(?:(?:cheese|bangumi)\/play|blackboard|.*?video)\/|m\.bilibili\.com\/bangumi\/play\/|www\.acfun\.cn\/(?:.+?\/ac|bangumi\/)|m\.acfun\.cn\/v\/|.+?(?:\.m(?:3u8|p4)\?\w+?=|(?:search|jx|url|id|v|&[^\/]+?|_\w+?|\.html\?\w+?)[&#=\?]https?(?::\/\/|%3A%2F%2F)[^\/]+?\.(?:youku|fun|miguvideo|wasu|tudou|qq|mgtv|iqiyi|iq|sohu|le|pptv|1905|bilibili|acfun|ixigua)\.))/
// @grant none
// @noframes
// @run-at document-body
// @namespace https://greasyfork.org/users/979384
// @downloadURL https://update.greasyfork.org/scripts/454776/%E8%A7%A3%E6%9E%90%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/454776/%E8%A7%A3%E6%9E%90%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function(){'use strict';if(self!=top){return false;}else{if(!document.querySelector("\u6c5f\u5c0f\u767d\u81ea\u5b9a\u4e49\u63a5\u53e3")){document.head.appendChild(document.createElement("\u6c5f\u5c0f\u767d\u81ea\u5b9a\u4e49\u63a5\u53e3"));if(location.href.match(/^https?:\/\/(?:(?:www\.ixigua\.com\/|m\.ixigua\.com\/video\/)\d{10,}(?:\?id=\d{10,}|$)|(?:v(?:-wb)?|m)\.youku\.com\/.+?\/id_|\w+?\.wasu\.c.+?\/[pP]lay\/show\/id\/\d|www\.fun\.tv\/vplay\/g-|m\.fun\.tv\/mplay\/\?mid=|\w+?\.miguvideo\.com\/.+?\/detail\.html\?cid=\d|[^\/]+?\.tudou\.com\/(?:v\/|.+?\/id_)|v\.qq\.com\/(?:x\/(?:cover|page)|.+?\/p\/topic)\/|(?:3g|m)\.v\.qq\.com|w(?:ww)?\.mgtv\.com\/[a-z]\/|www\.mgtv\.com\/act\/|m\.mgtv\.com\/b\/|www\.iqiyi\.com\/(?:[vw]_|kszt\/)|www\.iq\.com\/play\/|m\.iqiyi\.com\/(?:v_|$)|tw\.iqiyi\.com\/v_|tv\.sohu\.com\/v\/|m\.tv\.sohu\.com\/(?:u\/|v|phone_play_film\?aid=)|film\.sohu\.com\/album\/|www\.le\.com\/ptv\/vplay\/|m\.le\.com\/vplay_|[vm]\.pptv\.com\/show\/|(?:vip|m)\.1905\.com\/(?:m\/vod|play)\/|www\.ixigua\.com\/|(?:player|live)\.bilibili\.com\/|www\.bilibili\.com\/(?:(?:cheese|bangumi)\/play|blackboard|.*?video)\/|m\.bilibili\.com\/bangumi\/play\/|www\.acfun\.cn\/(?:.+?\/ac|bangumi\/)|m\.acfun\.cn\/v\/|.+?(?:\.m(?:3u8|p4)\?\w+?=|(?:search|jx|url|id|v|&[^\/]+?|_\w+?|\.html\?\w+?)[&#=\?]https?(?::\/\/|%3A%2F%2F)[^\/]+?\.(?:youku|fun|miguvideo|wasu|tudou|qq|mgtv|iqiyi|iq|sohu|le|pptv|1905|bilibili|acfun|ixigua)\.))/)){
/* ** 自定义修改 Josn 全局播放器地址 （必须是 https 类型）** */
let 电脑json全局播放器="https://auete.com/api/dp.php?url=";
let 手机json全局播放器="https://auete.com/api/dp.php?url=";
/* ********填入想屏蔽的接口名称，屏蔽多个用 | 隔开********** */
let 全局自定义屏蔽接口=/百域阁/i;
/* ****************************************************** */
localStorage.setItem('电脑Json全局播放器',电脑json全局播放器);localStorage.setItem('手机Json全局播放器',手机json全局播放器);if(location.host.match(/(?:youku|fun|miguvideo|wasu|tudou|qq|mgtv|iqiyi|iq|sohu|le|pptv|1905|bilibili|acfun|ixigua)/)){function 自动点击(zdya,zdyb){try{if(location.host.match(zdya)){sessionStorage.setItem('自定义点击接口',JSON.stringify(zdyb.split("|")));}}catch(e){}};
/* *******填入想自动点击的接口名称，多个接口用 | 隔开******* */
//写法例子：           自动点击('qq','腾讯|高天|扶风|牛逼|虾米|布米米');





/* ****************************************** */let zdyjkb=[
/* **************** 自定义添加接口 ************************* */
//       {name:"自动点击",vip:"自动点击",jxb:"原",jj:"1",diy:"burlywood",j:"电脑",sj:"0",title:"根据 自定义设置 的 解析接口数组，进行 自动点击接口"},
//       {name:"PAR",url:"https://jx.parwix.com:4433/player/?url="},







{name:"77",url:"https://jx.mmkv.cn/tv.php?url=",ys:"2"},
{name:"虾米",url:"https://jx.xmflv.com/?url="},
{name:"速云",url:"https://api.jhdyw.vip/?url="},
{name:"麦田",url:"https://jx.blbo.cc:4433/?url="},
{name:"思云",url:"https://jiexi.xm1314.top/?url="},
{name:"诺丽",url:"https://jxx.ys6.net:6115/vip/?url="},
{name:"4kDv",url:"https://jx.4kdv.com/?url="},
{name:"人人迷",url:"https://jx.renrenmi.cc/?url="},
{name:"ckp",url:"https://www.ckplayer.vip/jiexi/?url="},
{name:"M3U8",url:"https://jx.m3u8.tv/jiexi/?url="},
{name:"看看",url:"https://jx.m3u8.pw/?url="},
{name:"高速",url:"https://jsap.attakids.com/?url="},
{name:"爱西",url:"https://api.jiexi.la/?url="},
{name:"ok",url:"https://okjx.cc/?url="},
{name:"高一",url:"https://jx.parwix.com:4433/player/?url="},
{name:"高二",url:"https://jx.aidouer.net/?url="},
{name:"高三",url:"https://jx.blbo.cc:4433/?url="},
{name:"弹幕",url:"https://jx.playerjy.com/?url="},
{name:"北川",url:"https://gj.bcwzg.com/?url="},
{name:"错开",url:"https://www.ckplayer.vip/jiexi/?url="},
{name:"沉落",url:"https://chenluo6.chenluo.org/chenluopg/?url="},
{name:"PM",url:"https://www.playm3u8.cn/jiexi.php?url="},
{name:"贝布",url:"https://mp4.beibuvip.com:21443/?url="},



    
{name:"邦宁",url:"https://video.ihelpy.net/player/getplayer?url=%s",vip:"强制搜索",jj:"1",jjjj:"qq|1905|pptv"},
{name:"鸭奈飞",url:"https://yanetflix.com/vodsearch/-------------.html?wd=%s",vip:"强制搜索"},
{name:"素白白",url:"https://www.subaibaiys.com/grabble?q=%s",vip:"强制搜索"},
{name:"大米星球",url:"https://www.dmxq.fun/vodsearch/-------------.html?wd=%s",vip:"强制搜索"},
{name:"稀饭影视",url:"https://www.xifanys.com/yingpiansearch/-------------.html?wd=%s",vip:"强制搜索"},






/* **************** 自定义添加接口 ************************* */
];localStorage.setItem('江小白自定义接口',JSON.stringify(zdyjkb));let zdyjkpbobj=setInterval(function(){try{if(document.querySelector("ul#httpsvipul>li:last-of-type")){const zdyjkpb=document.querySelectorAll('ul#httpsvipul>li');for(let zdyjkpbi=0;zdyjkpbi<zdyjkpb.length;zdyjkpbi++){const zdyjkpbmsa=zdyjkpb[zdyjkpbi].querySelectorAll('a4');for(let zdyjkpbia=0;zdyjkpbia<zdyjkpbmsa.length;zdyjkpbia++){if(zdyjkpbmsa[zdyjkpbia].innerText.match(全局自定义屏蔽接口)){zdyjkpb[zdyjkpbi].setAttribute('style','display:none!important');}};};clearInterval(zdyjkpbobj);}else{}}catch(e){clearInterval(zdyjkpbobj);}},1234);}}}else{return false;}}})();
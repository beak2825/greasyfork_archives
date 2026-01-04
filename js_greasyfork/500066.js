// ==UserScript==
// @name         全网视频解析
// @namespace    https://palhube666.wodemo.com/
// @version      0.3
// @description  支持在via里使用，推荐在via/vie浏览器里使用该脚本
// @author       呆毛飘啊飘
// @license MIT
// @run-at       document-end
// @match        *
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/500066/%E5%85%A8%E7%BD%91%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/500066/%E5%85%A8%E7%BD%91%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {


GM_registerMenuCommand('全屏播放', function(){window.location.replace(GM_getValue('源','https://jx.xyflv.cc/?url=')+window.location.href);})

GM_registerMenuCommand('源1', function(){GM_setValue('源','https://jx.xyflv.cc/?url=');via.toast('更换成功,请刷新');})
GM_registerMenuCommand('源2', function(){GM_setValue('源','https://jx.xmflv.com/?url=');via.toast('更换成功,请刷新');})
GM_registerMenuCommand('源3', function(){GM_setValue('源','https://huayong.net/vip4/?url=');via.toast('更换成功,请刷新');})
var kk='f';

var str=window.location.host;
if(str.indexOf("iqiyi.com") != -1){
//爱奇艺iqiyi.com
 GM_setValue('控件1','.m-video-player-wrap');
 GM_setValue('控件2','.m-box');
 var kk='t';
}
if(str.indexOf("youku.com") != -1){
//优酷youke.com
 GM_setValue('控件1','.ykplayer');
 GM_setValue('控件2','.player');
var kk='t';
}
if(str.indexOf("le.com") != -1){
//乐视le.com
 GM_setValue('控件1','#j-player');
 GM_setValue('控件2','.play');
var kk='t';
}
if(str.indexOf("v.qq.com") != -1){
//腾讯视频m.v.qq.com
 GM_setValue('控件1','#player');
 GM_setValue('控件2','.player');
var kk='t';
}
if(str.indexOf("tv.sohu.com") != -1){
//搜狐tv.sohu.com
 GM_setValue('控件1','.x-player');
 GM_setValue('控件2','.player');
var kk='t';
}
if(str.indexOf("mgtv.com") != -1){
//芒果视频mgtv.com
 GM_setValue('控件1','.video-area');
 GM_setValue('控件2','.card-box');
var kk='t';
}


if(kk.indexOf("t") != -1){
via.toast('不要相信播放器里的广告！！调用的是第三方播放器，本人不对其内容担保！！！如果解析失败，请在脚本设置里更换源');
function showIframe(ele,url){
var a = document.createElement("iframe");
a.src=url;
a.style='height:100%;width:100%;border: medium none;padding:0;';
ele.insertBefore(a,ele.children[0])
};


var kj1 = GM_getValue('控件1');
var kj2 = GM_getValue('控件2');

var ele=document.querySelector(kj1);
ele.outerHTML='';
var ele=document.querySelector(kj2);

var y=GM_getValue('源','https://jx.xyflv.cc/?url=');
y=y+window.location.href;
showIframe(ele,y);
//via.toast(y);
}
})();
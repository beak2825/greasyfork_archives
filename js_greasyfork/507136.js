// ==UserScript==
// @name         【双指缩放网页】　
// @namespace    https://greasyfork.org/
// @version      241015.18
// @description  手势缩放网页，用于手机浏览器，仅在via、X浏览器测试过
// @author       You
// @license      MIT
// @run-at       document-end
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/507136/%E3%80%90%E5%8F%8C%E6%8C%87%E7%BC%A9%E6%94%BE%E7%BD%91%E9%A1%B5%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/507136/%E3%80%90%E5%8F%8C%E6%8C%87%E7%BC%A9%E6%94%BE%E7%BD%91%E9%A1%B5%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

let viewportContent,minScale=0.3;

const metaViewport=(viewportWidth)=>{
viewportContent=`width=${viewportWidth},user-scalable=no`;
}
/*若同时使用强制缩放相关的脚本，放大网页会左右滚动，需重置*/
const setViewport=()=>document.querySelector('meta[name=viewport]').setAttribute('content',viewportContent),

setZoom=(scale)=>document.body.style.zoom = formatNumber(scale),

hostName=window.location.hostname;

let scale=GM_getValue(hostName+'_jsSetZoom', false);

//测试网页能否自适应屏幕
metaViewport('device-width');
if(!document.querySelector('meta[name=viewport]')){
let e = document.createElement('meta');e.setAttribute('name', 'viewport');e.setAttribute('content', viewportContent);document.head.appendChild(e);
}
let initialScrollWidth=document.body.scrollWidth;
setZoom('1.1');
let zoomScrollWidth=document.body.scrollWidth;
let isAdaptive=initialScrollWidth>zoomScrollWidth+20||initialScrollWidth<=window.screen.availWidth+20;
setZoom('1');

if(isAdaptive){
//隐藏水平滚动条
GM_addStyle("body{overflow-x:hidden;}img{max-width:100%;height:auto}");
}else{
metaViewport(initialScrollWidth);
setViewport();
minScale=1;
}

scale&&setZoom(scale);

// 定义一个变量来存储初始的触摸点位置和缩放级别
let initialDistance = 0;
let initialScale = 1;

// 定义一个函数来处理触摸开始事件
function handleTouchStart(event) {
  // 确保触摸点的数量为2
  if (event.touches.length === 2) {
    // 计算两个触摸点之间的距离
    initialDistance = Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
    // 存储初始的缩放级别
    initialScale = document.body.style.zoom || 1;
  }
}

// 定义一个函数来处理触摸移动事件
function handleTouchMove(event) {
  if (event.touches.length === 2) {
	setViewport();
    // 阻止默认事件，例如页面的滚动
    event.preventDefault();
    // 计算新的触摸点距离
    let currentDistance = Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
    // 计算缩放比例的变化
    let scale = Math.max(Math.min(parseFloat((currentDistance / initialDistance) * initialScale),2),minScale);
    // 应用新的缩放级别到页面
    setZoom(scale);
  }
}

// 为触摸事件添加监听器
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);

GM_registerMenuCommand(`【临时设置缩放比】`,function(){
let e=prompt('请输入缩放比，建议0.3~1.5之间','0.75');
e&&setZoom(e);
});

GM_registerMenuCommand('【记住当前缩放比】',function(){
let e=document.body.style.zoom;e&&GM_setValue(hostName+'_jsSetZoom',e);
});

GM_registerMenuCommand('【取消记忆缩放比】',function(){GM_deleteValue(hostName+'_jsSetZoom');});

function formatNumber(a, b = 3) {
    // 检查 a 是否是整数
    if (Math.floor(a) == a) {
        return a;
    }
    // 如果不是整数，则使用 toFixed 并转换回数字类型
    return Number(Number(a).toFixed(b));
}

})();
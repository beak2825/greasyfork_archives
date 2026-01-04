// ==UserScript==
// @name         倍速控制器
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  对哔哩哔哩，爱奇艺,优酷的广告加速和视频倍速（最高16倍速），同时有控制面板，快捷键(字母键盘上的数字键)1~9,分别对应9种速度,广告可以跳过,多个广告需要多按几下。
// @author       五等份的商鞅
// @match        *
// @match        *://*
// @match        *://*/*
// @match        *://*/*/*
// @match        *://*/*/*/*
// @match        *://*/*/*/*/*
// @match        *://*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*
// @match        *://*/*/*/*/*/*/*/*
// @icon         https://cas.pxc.jx.cn/lyuapServer/favicon.ico
// @grant        none
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/453358/%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/453358/%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function(){setTimeout(function(){var videos=document.querySelectorAll('video');if(videos.length != 0){var timeId;var getRate=function(){return localStorage.getItem('rate')};var rate=getRate()||2;var setRate=function(t){localStorage.setItem('rate',t);rate=t};setRate(rate);var aid=document.createElement('aid');var panel=document.createElement('panel');if(document.URL.split('/')[2].split('.')[1]==='youku'){document.querySelector('body').insertAdjacentElement('beforebegin',aid);document.querySelector('body').insertAdjacentElement('beforebegin',panel)}else{document.querySelector('video').insertAdjacentElement('beforebegin',aid);document.querySelector('video').insertAdjacentElement('beforebegin',panel)}aid.style="float:left;position:fixed;top:50%;left:50%;width:200px;height:200px;border-radius:50%;text-align:center;line-height:200px;font-size:40px;color:#fff;background-color:rgba(251,215,0,1);transform:translateX(-50%) translateY(-50%);transition:all 1s";aid.onclick=function(){aid.style.display='none'};var tips=function(){aid.innerHTML=`x${document.querySelectorAll('video')[0].playbackRate}倍速`;aid.style.display='block';setTimeout(function(){aid.style.display='none'},3000)};tips();panel.innerHTML=`<li><span>默认播放速度:</span><input type="number" value="${getRate()}"></li><li><span>当前播放速度:</span><input type="number" value="${document.querySelectorAll('video')[0].playbackRate}"></li><li><div>倍速快捷键:</div><div>[0]:呼出悬浮菜单;</div><div>[1]:1倍速;</div><div>[2]:1.25倍速;</div><div>[3]:1.75倍速;</div><div>[4]:2倍速;</div><div>[5]:3倍速;</div><div>[6]:4倍速;</div><div>[7]:5倍速;</div><div>[8]:8倍速;</div><div>[9]:16倍速</div></li>`;panel.style="float:left;position:absolute;left:0;top:0;padding:2px 0;list-style:none;background-color:rgba(255,255,204,1);transition:all 1s;";let panelItem=document.querySelectorAll('panel>li');let panelItemInput=document.querySelectorAll('panel>li input');for(var n=0;n<panelItem.length;n++){panelItem[n].style=`width:20vmin;margin:1vmin;background-color:pink;`};panelItemInput[0].style.width='5vmin';panelItemInput[1].style.width='5vmin';panel.onmouseover=function(){panel.style.transform='rotate(0deg)';clearTimeout(timeId)};panel.onmouseout=function(){timeId=setTimeout(function(){ panel.style.transform='rotate(90deg)'},2000)};var changeRate=function(){document.querySelectorAll('video')[0].playbackRate=rate;panelItemInput[1].value=rate};panelItemInput[0].onchange=function(){if(this.value>16) this.value=16;if(this.value<= 0) this.value=1;setRate(this.value)};panelItemInput[1].onchange=function(){if(this.value>16) this.value=16;if(this.value <= 0) this.value=1;rate=this.value;changeRate();tips()};panel.style.zIndex=100;panel.style.transformOrigin='1vmin 0';panel.style.transform='rotate(90deg)';aid.style.zIndex=100;document.querySelectorAll('video')[0].oncanplay=changeRate;document.querySelectorAll('video')[0].onchange=changeRate;window.onkeydown=function(){switch(event.keyCode){case 48:panel.style.transform='rotate(0deg)';setTimeout(function(){ panel.style.transform='rotate(90deg)'},3000);break;case 49:rate=1;changeRate();tips();break;case 50:rate=1.5;changeRate();tips();break;case 51:rate=1.75;changeRate();tips();break;case 52:rate=2;changeRate();tips();break;case 53:rate=3;changeRate();tips();break;case 54:rate=4;changeRate();tips();break;case 55:rate=5;changeRate();tips();break;case 56:rate=8;changeRate();tips();break;case 57:rate=16;changeRate();tips();break}};changeRate()}},2000)})()
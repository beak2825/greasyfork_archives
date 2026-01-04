// ==UserScript==
// @name         B站倍播快捷键_好用!
// @version      9.911.911
// @description  在哔哩哔哩网站上播放视频时，按下x键减速播放，按下c键加速播放，按下z原速播放或上一次速度播放。每次步进为0.2。此外按下f键全屏播放或退出全屏。带记忆功能。按键记忆：z、x、c这三个键在键盘上依次排列，即原速档、减速档、加速档。跟开车一样这样就好记多了。操作举例：按下x键2次，当前播放速度为0.6，紧接着再按下z键，这时候回到1倍速，再按下z键，这时再回到0.6倍速。
// @description:zh 非全屏按下f后全屏、全屏状态下按下f退出全屏。
// @author       Alan669
// @icon         https://i1.hdslb.com/bfs/face/a809a3b8407840ae00032360108261fcf503d38a.jpg@96w_96h_1c_1s.webp
// @match        https://www.bilibili.com/*
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL
// @namespace https://greasyfork.org/en/scripts/439781
// @downloadURL https://update.greasyfork.org/scripts/439781/B%E7%AB%99%E5%80%8D%E6%92%AD%E5%BF%AB%E6%8D%B7%E9%94%AE_%E5%A5%BD%E7%94%A8%21.user.js
// @updateURL https://update.greasyfork.org/scripts/439781/B%E7%AB%99%E5%80%8D%E6%92%AD%E5%BF%AB%E6%8D%B7%E9%94%AE_%E5%A5%BD%E7%94%A8%21.meta.js
// ==/UserScript==
!function(){"use strict";var a=1;console.log("B站倍播快捷键 启动成功！");function b(){var b=[document.querySelector(".reply-box-textarea"),document.querySelector(".bpx-player-dm-input"),document.querySelector(".nav-search-input")];function c(b){a=b}for(var d;of;b)d.addEventListener("focus",function(){c(0)}),d.addEventListener("blur",function(){c(1)})}window.addEventListener("load",b);var c=new MutationObserver(b);c.observe(document.body,{childList:!0});var d=document.querySelector("video")?document.querySelector("video"):document.querySelector("bwp-video");var e=GM_getValue("a",10);var f=GM_getValue("b",10);setInterval(function(){d.playbackRate=e/10},600),document.addEventListener("keydown",function(b){if(("KeyX"===b.code||"KeyC"===b.code||"KeyZ"===b.code)&&a){var c=!1;e=Math.round(10*d.playbackRate),"KeyX"===b.code?e-=2:"KeyC"===b.code?e+=2:"KeyZ"===b.code&&(c=!0,e=1===d.playbackRate?f:10),2>e?e=2:e>80&&(e=80),GM_setValue("a",e),d.playbackRate=e/10,c||(f=e,GM_setValue("b",f))}"f"===b.code&&(document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement)&&(document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen&&document.webkitExitFullscreen())}),setInterval(function(){var a=document.getElementsByClassName("bpx-player-ctrl-playbackrate-result")[0].textContent.replace("x","");parseFloat(a)&&(e=Math.round(10*parseFloat(a)),GM_setValue("a",e))},2e3)}();
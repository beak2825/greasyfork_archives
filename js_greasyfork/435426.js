// ==UserScript==
// @name         zhdj_auto_paly
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  适合北矿的小煤球刷dk喔。免去点击烦恼！
// @description  try to take over the world!
// @author       coderBigOrange
// @include      https://zhdj.cumtb.edu.cn/ybdy/*
// @include      https://zhdj.cumtb.edu.cn/user/lesson
// @include      https://zhdj.cumtb.edu.cn/zsdy/*
// @license      GPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435426/zhdj_auto_paly.user.js
// @updateURL https://update.greasyfork.org/scripts/435426/zhdj_auto_paly.meta.js
// ==/UserScript==

(()=>{function e(){const e=$(".public_btn").children("a"),n=e.length;2===n?e.eq(1).click():1===n?e.eq(0).click():setTimeout((()=>{$(".public_btn").children("a").eq(0).click(),player.play()}),1e3)}!async function(){await new Promise((e=>{setTimeout((()=>e()),1e3)})),console.log("welcome"),function(){const e=document.getElementsByClassName("plyr__controls__item plyr__progress__container"),n=document.getElementsByClassName("video_red1")[0];e.length&&(n.nextElementSibling?setTimeout((function(){n.nextElementSibling.children[0].click()}),3e3):setTimeout((function(){window.location.href="/user/lesson"}),5e3))}(),function(){const e=$(".study_plan2");if(e){const n=/(.+)\n学时/,t=Array.from(e).map((e=>n.exec(e.innerText)[1])).indexOf("未完成");-1!==t&&(console.log(e[t].innerText),setTimeout((()=>{e[t].children[0].click()}),3e3))}}(),e(),player.on("pause",e)}()})();
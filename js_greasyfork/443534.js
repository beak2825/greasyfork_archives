// ==UserScript==
// @name         青年大学习跳过+自动生成截图
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.4
// @description  跳过视频 点击一键下载完成截图
// @author       Remkeeper
// @match        *://h5.cyol.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at document-idle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/443534/%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0%E8%B7%B3%E8%BF%87%2B%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/443534/%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0%E8%B7%B3%E8%BF%87%2B%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==

document.getElementsByClassName('section3')[0].className = "section3 topindex2"
console.log('成功跳过视频')
var url=document.location.href;
var url_num=url.indexOf('m.html');
var pic_url = url.slice(0,url_num)+"images/end.jpg";
var down = document.createElement("a");
down.style.fontSize="25px";
down.style.width="448px"
down.style.height="700px"
down.style.position="absolute"
down.href=pic_url;
down.download="end.jpg";
document.getElementsByClassName('section3')[0].appendChild(down)
document.getElementsByClassName('section3')[0].style.background="url(https://s1.328888.xyz/2022/04/18/rgNqy.png)";
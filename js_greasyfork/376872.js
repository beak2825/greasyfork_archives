// ==UserScript==
// @name         色影无忌论坛图片自适应显示大图
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  xitek forum view photos as large as possible
// @author       joshatt
// @match        http://forum.xitek.com/thread*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376872/%E8%89%B2%E5%BD%B1%E6%97%A0%E5%BF%8C%E8%AE%BA%E5%9D%9B%E5%9B%BE%E7%89%87%E8%87%AA%E9%80%82%E5%BA%94%E6%98%BE%E7%A4%BA%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/376872/%E8%89%B2%E5%BD%B1%E6%97%A0%E5%BF%8C%E8%AE%BA%E5%9D%9B%E5%9B%BE%E7%89%87%E8%87%AA%E9%80%82%E5%BA%94%E6%98%BE%E7%A4%BA%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
var allphotos=document.getElementById('nv_forum');
var visiblehigh=document.documentElement.clientHeight-5;
var right_wide=document.querySelector('td.plc').offsetWidth-70;
allphotos.innerHTML=allphotos.innerHTML.replace(/width\:\s*640px|max-width\:\s*640px/g,"max-height:"+visiblehigh.toString()+"px;max-width:"+right_wide+"px");
})();
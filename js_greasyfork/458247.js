// ==UserScript==
// @name         视频倍速
// @namespace    https://viayoo.com/
// @version      0.2
// @description  视频倍速播放，支持0.5，1，1.5，2，4，8，16倍速播放
// @author       呆毛飘啊飘
// @run-at       document-start
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458247/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/458247/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    var bfq = document.createElement('div');
    bfq.id = "bfq";
    bfq.style.position="fixed"
    bfq.style.left="20px"
    bfq.style.top="20px"
    bfq.style['z-index']="999999"
    bfq.innerHTML =`<select id="engine" onchange="javascript:funcspbf()">
<option value= "0.5">0.5倍速</option>
<option value= "1">1倍速</option>
<option value= "1.5">1.5倍速</option>
<option value= "2">2倍速</option>
<option value= "4">4倍速</option>
<option value= "8">8倍速</option>
<option value= "16">16倍速</option>
</select>`
var jss = document.createElement("script");
    jss.type = "text/javascript";
    jss.innerHTML = "function funcspbf(){var engine = document.getElementById('engine');document.querySelector('video').playbackRate = engine.options[engine.selectedIndex].value;}";
    document.body.appendChild(jss);
    document.body.appendChild(bfq);
})();
// ==UserScript==
// @name         so-net 遊戲ID自動輸入 for 公主連結
// @namespace    https://github.com/Kutinging/svp.so-ne
// @version      1.1
// @description  公主連結ID自動輸入
// @author       ThanatosDi , S.Dot
// @match        http://www.svp.so-net.tw/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374044/so-net%20%E9%81%8A%E6%88%B2ID%E8%87%AA%E5%8B%95%E8%BC%B8%E5%85%A5%20for%20%E5%85%AC%E4%B8%BB%E9%80%A3%E7%B5%90.user.js
// @updateURL https://update.greasyfork.org/scripts/374044/so-net%20%E9%81%8A%E6%88%B2ID%E8%87%AA%E5%8B%95%E8%BC%B8%E5%85%A5%20for%20%E5%85%AC%E4%B8%BB%E9%80%A3%E7%B5%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
   document.querySelector("select#game_no").value = "SON009"
   document.querySelector("input#user_id").value="(遊戲UID)"
   document.querySelector("input#user_id").focus();
   document.querySelector("input#vp_no").focus();
   var form = document.getElementsByTagName('form')[0];
   var label = document.createElement("div");
   var span = (document.createElement("span"));
   span.className = 'f_size';
   var t = document.createTextNode("► 4.");
   span.appendChild(t);
   var t2 = document.createTextNode("腳本開發人員 : ThanatosDi , S.Dot");
   label.appendChild(span)
   label.appendChild(t2)
   form.insertBefore(label,document.getElementById('btn_conf'));
})();

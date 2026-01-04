// ==UserScript==
// @name         popcatbutton
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  好領好用好刺激的%貓腳本
// @author       fei-shun
// @match        https://popcat.click/
// @icon         https://i.imgur.com/NyeVFuF.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430947/popcatbutton.user.js
// @updateURL https://update.greasyfork.org/scripts/430947/popcatbutton.meta.js
// ==/UserScript==

    var time = 55;//改速度，數字越低越哈壓苦，建議最低38，再低一定出事
    let btn = document.createElement("button");
    var body = document.getElementsByTagName("body")[0];
    let nbtn = document.createElement("button");

(function() {
    'use strict';
    btn.innerHTML = "開始";
    body.appendChild(btn);
    btn.style.cssText = 'position: relative; top: -300px; left: 50px';
    nbtn.innerHTML = "停止";
    body.appendChild(nbtn);
    nbtn.style.cssText = 'position: relative; top: -300px; left: 50px';

    btn.onclick =()=>{ btn.disabled = true,startclick(); }
})();

   function startclick(){
        var timeoutID=setInterval(()=>{document.dispatchEvent(new Event("keydown"))},time)
        nbtn.onclick =()=>{ clearInterval(timeoutID),btn.disabled = false,Exit(); }
  }

  function Exit(){
      return 0;
  }
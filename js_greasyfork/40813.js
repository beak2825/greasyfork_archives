// ==UserScript==
// @name         bitcointalk ICO 过滤
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  none
// @author       hearinleaf
// @match        https://bitcointalk.org/index.php*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/40813/bitcointalk%20ICO%20%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/40813/bitcointalk%20ICO%20%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==
window.onload=cfa;

function cfa(){
var ii=document.getElementsByClassName("leftimg").length;
for (var i=0; i<ii; i=i+2)
  {
  var tmp = document.getElementsByClassName("leftimg")[i].parentNode.childNodes[5].innerText;
      if (tmp.match(/ICO/i) || tmp.match(/SALE/i) || tmp.match(/AIRDROP/i) || tmp.match(/POS/i) !== null) {
          document.getElementsByClassName("leftimg")[i].parentNode.childNodes[5].innerText = "GOOD DAY";
          document.getElementsByClassName("leftimg")[i].parentNode.childNodes[5].style.color = 'red';
      }
  }
}

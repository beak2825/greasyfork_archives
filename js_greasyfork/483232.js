// ==UserScript==
// @name         tajisakusoumago-Esc
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  ESC有効化
// @author       tube
// @match        http://sintyaku.pa.land.to/daken2/tajitaji.htm
// @match        http://sintyaku.pa.land.to/daken2/tajisakumagosou.htm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=land.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483232/tajisakusoumago-Esc.user.js
// @updateURL https://update.greasyfork.org/scripts/483232/tajisakusoumago-Esc.meta.js
// ==/UserScript==

(function() {
   document.addEventListener('keydown',function(e){
if(e.key == 'Escape'){document.querySelector("#start > input").click();}
})
})();
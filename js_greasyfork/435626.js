// ==UserScript==
// @name         谷歌居中
// @namespace    http://tampermonkey.net/
// @version 1.3
// @description  Center the Google search results.
// @author       GDUFXRT
// @match        https://www.google.com/search*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435626/%E8%B0%B7%E6%AD%8C%E5%B1%85%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/435626/%E8%B0%B7%E6%AD%8C%E5%B1%85%E4%B8%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    var cssStyle = `@media(min-width:1410px)
  {#extabar {display: flex;justify-content: left;}
   #slim_appbar {width: 1280px;margin-left:0;box-sizing: border-box;display:flex;justify-content:center}
   #searchform .tsf{margin:0 auto}
   .MUFPAc{margin-left:0}
   .mw{margin:0 auto}
   #fbar{text-align:center}
   .GyAeWb{display:flex;justify-content:space-around}
    #main{display:flex;justify-content:center;}
   #topabar{max-width:1197px;margin:0 auto;min-width:1100px}

   	.GLcBOb{justify-content:center;display: flex;}
    .D6j0vc{width:auto}}`;

    style.innerText = cssStyle;
    document.querySelector('head').appendChild(style);
  
})();
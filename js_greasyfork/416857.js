// ==UserScript==
// @name         cancle scorll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Lalala
// @match       https://ks.wjx.top/wjx/join/complete.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416857/cancle%20scorll.user.js
// @updateURL https://update.greasyfork.org/scripts/416857/cancle%20scorll.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style=" html {-ms-overflow-style:none;overflow:-moz-scrollbars-none;}html::-webkit-scrollbar{width:0px}";
    var ele=document.createElement("style");
    ele.innerHTML=style;
    document.getElementsByTagName('head')[0].appendChild(ele);
    // Your code here...
})();
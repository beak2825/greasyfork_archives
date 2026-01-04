// ==UserScript==
// @name         小米枪手机
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://item.mi.com/product/10000091.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368042/%E5%B0%8F%E7%B1%B3%E6%9E%AA%E6%89%8B%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/368042/%E5%B0%8F%E7%B1%B3%E6%9E%AA%E6%89%8B%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
var AdblockBanner=document.getElementById("J_buyBtnBox");
setInterval(()=>{
     AdblockBanner.click();
console.log(1);
})
    // Your code here...
})();
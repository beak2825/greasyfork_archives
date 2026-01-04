// ==UserScript==
// @name         自动打开 sa 登陆
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *sa.alibaba-inc.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399414/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%20sa%20%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/399414/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%20sa%20%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
window.onload=function(){

    setTimeout(()=>{var buttons = document.getElementsByTagName("button");
console.log(buttons)
buttons[6].click();},500)
}
    // Your code here...
})();
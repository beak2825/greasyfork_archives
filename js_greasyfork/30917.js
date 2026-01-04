// ==UserScript==
// @name         Subeta Auto-Roaming
// @description  This script automatically roams random shops and stops when you are going to buy an item and resumes after.
// @version      1
// @match        *://subeta.net/shop.php?shop*
// @grant        none
// @icon         https://subeta.net/favicon.ico
// @icon64       https://img.subeta.net/items/bottle_apothecary_09.gif
// @namespace https://greasyfork.org/users/133026
// @downloadURL https://update.greasyfork.org/scripts/30917/Subeta%20Auto-Roaming.user.js
// @updateURL https://update.greasyfork.org/scripts/30917/Subeta%20Auto-Roaming.meta.js
// ==/UserScript==


var timeout;
 timeout = setTimeout(function () {
    var items = [32,41,36,17,20,6,26,9,5,19,47,11,31,2,22,14,46,23,25,21,12,44,29,49,40,27,34,28,37,24,45,39,42,4,16,30];
    var item = items[Math.floor(Math.random()*items.length)];
    var shoplink = "https://subeta.net/shop.php?shopid=" + item;
    window.location.href = shoplink;
},5030);
document.onmousemove = function(){
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    var items = [32,41,36,17,20,6,26,9,5,19,47,11,31,2,22,14,46,23,25,21,12,44,29,49,40,27,34,28,37,24,45,39,42,4,16,30];
    var item = items[Math.floor(Math.random()*items.length)];
    var shoplink = "https://subeta.net/shop.php?shopid=" + item;
    window.location.href = shoplink;
},5330);
};
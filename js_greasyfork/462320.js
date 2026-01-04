// ==UserScript==
// @name         hacks-
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Auto Seacher
// @author       You
// @match        https://www.bing.com/*=hacks-*
// @match        https://www.bing.com/search?FORM=U523DF&PC=U523&q=hacks-*
// @match        https://www.bing.com/search?q=hacks-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462320/hacks-.user.js
// @updateURL https://update.greasyfork.org/scripts/462320/hacks-.meta.js
// ==/UserScript==

(function() {
    'use strict';
var delay = 5000

function search(){
function timeout(i){
    setTimeout(function(){
document.title = delay/1000 - i
},i*1000)
}
for(var i=0;i<=delay/1000;i++){
timeout(i)
}

setTimeout(() => {
 var str = "https://www.bing.com/search?FORM=U523DF&PC=U523&q=hacks-"+Math.random()
window.open(str,"_self")
},delay)
}
search()
setInterval(search(),delay)
})();
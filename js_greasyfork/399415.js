// ==UserScript==
// @name         自动点击 arthas
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *start.alibaba-inc.com/arthas/web-console*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399415/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%20arthas.user.js
// @updateURL https://update.greasyfork.org/scripts/399415/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%20arthas.meta.js
// ==/UserScript==



(function() {

$(document).ready(function(){
 document.getElementsByClassName("btn-warning")[0].click()

    let t = setInterval(()=>{
if(document.getElementsByClassName("btn btn-xs btn-primary")[0]){
document.getElementsByClassName("btn btn-xs btn-primary")[0].click();
    clearInterval(t)
}
    },200);
});



})();
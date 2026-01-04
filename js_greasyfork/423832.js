// ==UserScript==
// @name         TSJ script
// @namespace    https://home.gamer.com.tw/homeindex.php?owner=shehrichi
// @version      0.3
// @description  hello world
// @author       You
// @match        https://forum.gamer.com.tw/C.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423832/TSJ%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/423832/TSJ%20script.meta.js
// ==/UserScript==

var start = function(){
    setInterval(tsj_show , 500);
}
var tsj_show = function(){
    var list = document.getElementsByClassName(" lazyloaded");

    for (var i = 0; i < list.length; i++) {
        var url = list[i];
        var url2 = new URL(url.src);
        if(url2.searchParams.has("v")){
            url2.searchParams.delete("v");
            url.src = url2.href;
        }
    }
}
window.addEventListener('load', start);
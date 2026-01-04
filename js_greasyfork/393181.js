// ==UserScript==
// @name         numberGuessor
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       numberGuessorGroup
// @match        http://louhau.com/estar/public/games/guess.asp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393181/numberGuessor.user.js
// @updateURL https://update.greasyfork.org/scripts/393181/numberGuessor.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function red(){
    document.getElementsByTagName("p")[0].innerHTML = "<p align='center'><font color=red>不用猜了，我告訴你，這個數字是 "+myNumber+"<br>　<br>　</font></p>";document.getElementById("display").innerHTML = "<b>"+String.fromCodePoint(Math.round(Math.random() * 20901) + 19968)+String.fromCodePoint(Math.round(Math.random() * 20901) + 19968)+"</b>";
     document.getElementsByTagName("input")[2].value = String.fromCodePoint(Math.round(Math.random() * 20901) + 19968)+String.fromCodePoint(Math.round(Math.random() * 20901) + 19968);
    }
    setInterval(red,1);


})();
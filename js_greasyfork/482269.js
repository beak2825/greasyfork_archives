// ==UserScript==
// @name        mazda 6 forum remove top banner image - collapse header bar 
// @namespace   english
// @description  mazda 6 forum remove top banner image - collapse headerbar 
// @include     http*://*mazda6club.com*
// @version     1.3
// @run-at document-end
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482269/mazda%206%20forum%20remove%20top%20banner%20image%20-%20collapse%20header%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/482269/mazda%206%20forum%20remove%20top%20banner%20image%20-%20collapse%20header%20bar.meta.js
// ==/UserScript==

 

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '        html .p-header-banner-placeholder {   height: 50px; }html .p-header-banner img{display:none;} p,div,html,i,a,u,span{font-family:"STALKER1","PT Mono",Tahoma;}html{font-size: 120%;}      ';

document.getElementsByTagName('head')[0].appendChild(style);

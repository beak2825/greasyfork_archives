// ==UserScript==
// @name        zz Greasy Fork Hide Images (make smaller) 
// @namespace   english
// @description  Greasy Fork Hide Images (make smaller)  
// @include     http*://*greasyfork.org*
// @version     1.2
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371981/zz%20Greasy%20Fork%20Hide%20Images%20%28make%20smaller%29.user.js
// @updateURL https://update.greasyfork.org/scripts/371981/zz%20Greasy%20Fork%20Hide%20Images%20%28make%20smaller%29.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '             img{max-width:25px !important ;height:auto  !important ;}    ';
document.getElementsByTagName('head')[0].appendChild(style);




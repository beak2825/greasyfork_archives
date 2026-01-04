// ==UserScript==
// @name        Calendar add icons
// @namespace   english
// @description Calendar add icons material design 
// @include     http*://*calendar.google.com*
// @include     http*://*mail.google.com*
// @include     http*://*inbox.google.com*
// @include     http*://*trello.com* 

// @version     1.14
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371187/Calendar%20add%20icons.user.js
// @updateURL https://update.greasyfork.org/scripts/371187/Calendar%20add%20icons.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML =  '               .DPvwYc,body .DPvwYc, html body span.DPvwYc,html body span.NXNZhd{     font-family: "Material Icons Extended" !important;   font: "Material Icons Extended" !important; }  .icon-lg, .icon-sm {     font-family: trellicons !important;}                ';

document.getElementsByTagName('head')[0].appendChild(style);






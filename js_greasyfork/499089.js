// ==UserScript==
// @name        green unread labels for outlook 365 
// @namespace   english
// @description        green unread labels for outlook 365  microsoft 
// @include     http*://*outlook.office365.com*
// @version     1.1
// @run-at document-end
// @license MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/499089/green%20unread%20labels%20for%20outlook%20365.user.js
// @updateURL https://update.greasyfork.org/scripts/499089/green%20unread%20labels%20for%20outlook%20365.meta.js
// ==/UserScript==


// Main - CSS hides two classes - video add box, and call to action box under it. - also social media

 
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '         html .DLvHz{    background: #373502;}       ';



document.getElementsByTagName('head')[0].appendChild(style);





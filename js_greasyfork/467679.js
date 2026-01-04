// ==UserScript==
// @name        beehaw.org change font to make it readable 
// @namespace   english
// @description beehaw.org change font to make it readable 2
// @include     http*://*beehaw.org*
// @version     1.3
// @run-at document-end
// @license MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/467679/beehaworg%20change%20font%20to%20make%20it%20readable.user.js
// @updateURL https://update.greasyfork.org/scripts/467679/beehaworg%20change%20font%20to%20make%20it%20readable.meta.js
// ==/UserScript==


var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML =   '     html,body,p,div,b,strong,i,a{font-family:"STALKER1","PT Mono",Tahoma;}html  {font-size:111%;}        ' ;

document.getElementsByTagName('head')[0].appendChild(style);

 
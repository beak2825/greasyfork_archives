// ==UserScript==
// @name        Create button to open forum / post in BeeHaw 
// @namespace   english
// @description Create button to open forum / post in BeeHaw.org
// @include     http*://*midwest.social*
// @version     1.7
// @run-at document-end
// @license MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/468252/Create%20button%20to%20open%20forum%20%20post%20in%20BeeHaw.user.js
// @updateURL https://update.greasyfork.org/scripts/468252/Create%20button%20to%20open%20forum%20%20post%20in%20BeeHaw.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '                               ';
document.getElementsByTagName('head')[0].appendChild(style);


var url2 = document.head.querySelector('[property="og:url"][content]').content; 

 


console.log("@@@ PUKKA - URL of this page: " . url2  );

console.log("@@@ PUKKA -  6 7 " );


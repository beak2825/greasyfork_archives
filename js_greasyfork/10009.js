// ==UserScript==
// @name        Kingdom hearts insider hide audio play
// @namespace   english
// @description Kingdom hearts insider hide audio play  - http://pushka.com/coding-donation
// @include     http*://*khinsider.com*
// @version     1.4
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/10009/Kingdom%20hearts%20insider%20hide%20audio%20play.user.js
// @updateURL https://update.greasyfork.org/scripts/10009/Kingdom%20hearts%20insider%20hide%20audio%20play.meta.js
// ==/UserScript==


// Main - CSS hides some block elements and expands other main divs to 100% 
 

var style = document.createElement('style');
style.type = 'text/css';


style.innerHTML = '    audio{display:none;}    ';


document.getElementsByTagName('head')[0].appendChild(style);

 
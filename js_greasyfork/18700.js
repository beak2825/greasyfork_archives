// ==UserScript==
// @name        zz Reddit shine extension Chrome - remove orange anoying thing
// @namespace   english
// @description  remove orange anoying thing
// @include     http*://*reddit.com*
// @version     1.4
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/18700/zz%20Reddit%20shine%20extension%20Chrome%20-%20remove%20orange%20anoying%20thing.user.js
// @updateURL https://update.greasyfork.org/scripts/18700/zz%20Reddit%20shine%20extension%20Chrome%20-%20remove%20orange%20anoying%20thing.meta.js
// ==/UserScript==


// Main - CSS hides some block elements and expands other main divs to 100% 
 

var style = document.createElement('style');
style.type = 'text/css';


style.innerHTML = '        .shine-prompt{display:none !important;} .shine-bright-nav {display:none !important; position: absolute!important; right: -99999px!important;}      ';
   

document.getElementsByTagName('head')[0].appendChild(style);

 
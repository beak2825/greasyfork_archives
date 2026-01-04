// ==UserScript==
// @name        Hide all images - Facebook messenger 
// @namespace   english
// @description Hide all images - Facebook messenger - make all tiny thumbnails
// @include     http*://*messenger.com*
// @version     1.10
// @run-at document-end
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/370080/Hide%20all%20images%20-%20Facebook%20messenger.user.js
// @updateURL https://update.greasyfork.org/scripts/370080/Hide%20all%20images%20-%20Facebook%20messenger.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '          img, body img, html img, body div img, video{width:15px !important;height:auto !important;} div{background-size: 22px !important;}  .sp_N1ER1bkS1OC{filter:sepia(100%);}          ';
document.getElementsByTagName('head')[0].appendChild(style);

 
 
var favicon_link_html = document.createElement('link');
favicon_link_html.rel = 'icon';
favicon_link_html.href = 'https://pushka.com/favicon.ico';
favicon_link_html.type = 'image/x-icon';

try { 
  document.getElementsByTagName('head')[0].appendChild( favicon_link_html ); 
}
catch(e) { }



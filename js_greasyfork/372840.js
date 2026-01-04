// ==UserScript==
// @name        smalify images - Facebook  
// @namespace   english
// @description smalify images - Facebook   - make all tiny thumbnails
// @include     http*://*facebook.com*
// @version     1.6
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/372840/smalify%20images%20-%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/372840/smalify%20images%20-%20Facebook.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '          img, body img, html img, body div img,video{width:35px !important;height:auto !important;} div{background-size: 35px !important;}  .sp_N1ER1bkS1OC{filter:sepia(100%);} html body ._605a ._4ooo:not(._1ve7),html body ._605a ._4ooo {        width: 33px !important;} .iyyx5f41 svg{display:none;}        ';
document.getElementsByTagName('head')[0].appendChild(style);

 
 
var favicon_link_html = document.createElement('link');
favicon_link_html.rel = 'icon';
favicon_link_html.href = 'https://pushka.com/favicon.ico';
favicon_link_html.type = 'image/x-icon';

try { 
  document.getElementsByTagName('head')[0].appendChild( favicon_link_html ); 
}
catch(e) { }



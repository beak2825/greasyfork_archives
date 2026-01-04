// ==UserScript==
// @name        Gmail dark loading screen
// @namespace   english
// @description  Gmail dark loading screen 2
// @include     http*://*mail.google.com*
// @version     1.9
// @license MIT
// @run-at       document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/499713/Gmail%20dark%20loading%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/499713/Gmail%20dark%20loading%20screen.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '    .la-c.la-l {   background: #c5221f  !important ;  }.la-c.la-r {   background: #fbbc04  !important ;  } html .la-b .la-l, html  .la-b .la-r, html   .la-b .la-m {  background: #0e0e0e   ;}  #loading{ /*\n*/  background: #323232  !important ;/*\n*/}/*\n*//*\n*/#loading .la-k .la-m {/*\n*/  background: #323232  !important ;/*\n*/}/*\n*//*\n*/#loading .la-k .la-l, .la-k .la-r {/*\n*/  border: 3px none #3e3e3e !important ; /*\n*/}/*\n*//*\n*/#loading #nlpt { /*\n*/  background-color: #6d6d6d  !important ; /*\n*/}/*\n*//*\n*/#loading .msg{ filter: invert(1); }                               /*\n*/.la-i > div { /*\n*/	animation: none !important; /*\n*/} /*\n*/#loading, #stb { /*\n*/	background-color: bg !important; /*\n*/} /*\n*/.la-k .la-m, /*\n*/.la-i > .la-m { /*\n*/	background: bg !important; /*\n*/} /*\n*/.la-k .la-l, .la-k .la-r { /*\n*/	border: 3px none bg !important; /*\n*/} /*\n*/.msg, .msgb { /*\n*/	color: txt !important; /*\n*/} /*\n*/.submit_as_linkm, #loading a { /*\n*/	color: lin !important; /*\n*/} /*\n*/            ';
document.getElementsByTagName('head')[0].appendChild(style);





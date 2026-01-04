// ==UserScript==
// @name        NAB no images Dark Night Mode Theme 
// @namespace   english
// @description NAB no images Dark Night Mode Theme - simple remove banner 
// @include     http*://*nab.com.au*
// @version     1.5
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371980/NAB%20no%20images%20Dark%20Night%20Mode%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/371980/NAB%20no%20images%20Dark%20Night%20Mode%20Theme.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '               html{    filter: invert(85%)hue-rotate(180deg)grayscale(60%)contrast(120%);}.swiper-container { /*\n*/    display: none !important ;/*\n*/}img{max-width:25px !important ;height:auto  !important ;} .section-container>.inner-container, .section-container>.outer-background>.inner-container {/*\n*/ /*\n*/    display: none;/*\n*/}  html .ib-f5 .ib-header .banner {/*\n*/   /*\n*/     filter: invert(114%)hue-rotate(180deg)grayscale(0%)contrast(100%)saturate(100%);/*\n*/}div#ibFooter.rendered {/*\n*/   /*\n*/    filter: invert(114%)hue-rotate(180deg)grayscale(0%)contrast(100%)saturate(100%);/*\n*/}/*\n*/ body, html, html body, html.gr__ib_nab_com_au {/*\n*/    background: #808080 !important;/*\n*/    background-color: #808080 !important;/*\n*/    background-image: none important;/*\n*/}   ';
document.getElementsByTagName('head')[0].appendChild(style);




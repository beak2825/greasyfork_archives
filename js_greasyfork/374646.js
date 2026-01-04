// ==UserScript==
// @name        square full width - Facebook messenger 
// @namespace   english
// @description square full width - Facebook messenger - make all tiny thumbnails
// @include     http*://*messenger.com*
// @version     1.5
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/374646/square%20full%20width%20-%20Facebook%20messenger.user.js
// @updateURL https://update.greasyfork.org/scripts/374646/square%20full%20width%20-%20Facebook%20messenger.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '        ._nd_:last-of-type ._3058._52mr:last-of-type, ._nd_:last-of-type ._3058._52mr:last-of-type ._4br2, ._nd_:last-of-type ._3058:last-of-type ._52mr, ._nd_:last-of-type ._3058:last-of-type ._52mr ._4br2,._nd_ ._hh7 ,#cch_f26585bb9b3593c ._43by._43by {/*\n*/    border-bottom-right-radius: 1.3em;/*\n*/    background-color: rgb(193, 193, 193) !important;/*\n*/    color: #2d2d2d !important;/*\n*/    width: 80% !important;/*\n*/    border-radius: 0 !important;    max-width: 100% !important;/*\n*/}._29_7:last-of-type ._3058._52mr:last-of-type, ._29_7:last-of-type ._3058._52mr:last-of-type ._4br2, ._29_7:last-of-type ._3058:last-of-type ._52mr, ._29_7:last-of-type ._3058:last-of-type ._52mr ._4br2 ,._29_7:first-of-type ._3058._52mr:first-of-type, ._29_7:first-of-type ._3058._52mr:first-of-type ._mxz, ._29_7:first-of-type ._3058:first-of-type ._52mr, ._29_7:first-of-type ._3058:first-of-type ._52mr ._mxz,._o46 ._3058{/*\n*/     width: 80% !important ;/*\n*/    max-width: 100% !important ;/*\n*/    border-radius: 0 !important ;/*\n*/    background-color: #ccc !important ;    font-size: 107%;/*\n*/} ._nd_ ._hh7 a {    color: #000 !important ;}        ';
document.getElementsByTagName('head')[0].appendChild(style);

 



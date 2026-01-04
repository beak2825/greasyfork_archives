// ==UserScript==
// @name        Microsoft outlook 365 Collapsed collapse mode
// @namespace   english
// @description Microsoft outlook 365 Collapsed collapse mode 2
// @include     http*://*outlook.office.com/mail*
// @include     http*://*outlook.office365.com*
// @version     1.13
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/393605/Microsoft%20outlook%20365%20Collapsed%20collapse%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/393605/Microsoft%20outlook%20365%20Collapsed%20collapse%20mode.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';



style.innerHTML = '            html[dir=ltr] ._1yIHkYLrqDZpAMQ3L2YILh {/*\n*/   /*\n*/    height: 25px !important ;/*\n*/    overflow: hidden !important ;/*\n*/}/*\n*/._1TnOsM1wnHJpzR7rE1uLms { /*\n*/        zoom: 0.8  !important ; top: -8px !important ;/*\n*/}/*\n*//*\n*/._3J_S6fOI4B5tFT8R6qMqT7 {/*\n*/  /*\n*/    max-width: 7em !important ;/*\n*/}._3CkppxCH8qP59F-gLT9K7W, ._3CVfKgKkHqB5r8nCZCwRgG, ._2xXg2ADA-nqWnn548WmZba, ._33kDu8YhkrBqlQy3HACYoN {/*\n*/   /*\n*/    display: none;/*\n*/}html .K-Brlvoj9Ktve7eorIo6T { /*\n*/    display: none !important;/*\n*/}._2tnEGP9DHJVPH8DDvff-9A, ._2mXnm2n6WGzdKWTbrXEerf {/*\n*/   /*\n*/    max-width: 6em !important ;/*\n*/    top: -24px !important ;/*\n*/    position: relative !important ;/*\n*/    left: 110px !important ;/*\n*/    max-width: 12em !important ; /*\n*/}html[dir=ltr] ._2XbfIjkVHlkD2bctMJchtb { /*\n*/    z-index: 9999 !important ;/*\n*/} ._3CkppxCH8qP59F-gLT9K7W, ._3CVfKgKkHqB5r8nCZCwRgG, ._2xXg2ADA-nqWnn548WmZba, ._33kDu8YhkrBqlQy3HACYoN { display: none;}   html[dir=ltr] ._3CkppxCH8qP59F-gLT9K7W, html[dir=ltr] ._3CVfKgKkHqB5r8nCZCwRgG, html[dir=ltr] ._2xXg2ADA-nqWnn548WmZba, html[dir=ltr] ._33kDu8YhkrBqlQy3HACYoN {       max-width: 68px;     padding-left: 2px  !important ; } html[dir] ._1NIrJErhaIVqeFtMeVT1nt, html[dir] ._18LAllQi61d4a4XNAr9prg {    padding: 3px 0 12px 0  !important ;} ._3zJzxRam-s-FYVZNqcZ0BW span {    max-width: 7em !important ;    overflow: hidden !important ;    display: inline-block !important ;}  html[dir] ._2-6Yr-35EHcBYQQ-DulaxW:hover, html[dir] ._2-6Yr-35EHcBYQQ-DulaxW:hover .BhPfnAozjPbC0qXGRuQqr, html[dir] ._2-6Yr-35EHcBYQQ-DulaxW:hover ._2XbfIjkVHlkD2bctMJchtb  {z-index:99999  !important ;}     '  ;
document.getElementsByTagName('head')[0].appendChild(style);

// ==UserScript==
// @name        microsoft outlook website 365 Collapsed collapse mode
// @namespace   english
// @description microsoft outlook website 365 Collapsed collapse mode 2
// @include     http*://*outlook.office.com/mail*
// @include     http*://*outlook.office365.com*
// @version     1.9
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/393539/microsoft%20outlook%20website%20365%20Collapsed%20collapse%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/393539/microsoft%20outlook%20website%20365%20Collapsed%20collapse%20mode.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';



style.innerHTML = '            html[dir=ltr] ._1yIHkYLrqDZpAMQ3L2YILh {/*\n*/   /*\n*/    height: 23px !important ;/*\n*/    overflow: hidden !important ;/*\n*/}/*\n*/._1TnOsM1wnHJpzR7rE1uLms { /*\n*/    top: -12px !important ;/*\n*/}/*\n*//*\n*/._3J_S6fOI4B5tFT8R6qMqT7 {/*\n*/  /*\n*/    max-width: 7em !important ;/*\n*/}._3CkppxCH8qP59F-gLT9K7W, ._3CVfKgKkHqB5r8nCZCwRgG, ._2xXg2ADA-nqWnn548WmZba, ._33kDu8YhkrBqlQy3HACYoN {/*\n*/   /*\n*/    display: none;/*\n*/}html .K-Brlvoj9Ktve7eorIo6T { /*\n*/    display: none !important;/*\n*/}._2tnEGP9DHJVPH8DDvff-9A, ._2mXnm2n6WGzdKWTbrXEerf {/*\n*/   /*\n*/    max-width: 6em !important ;/*\n*/    top: -24px !important ;/*\n*/    position: relative !important ;/*\n*/    left: 120px !important ;/*\n*/    max-width: 9em !important ; /*\n*/}html[dir=ltr] ._2XbfIjkVHlkD2bctMJchtb { /*\n*/    z-index: 9999 !important ;/*\n*/} ._3CkppxCH8qP59F-gLT9K7W, ._3CVfKgKkHqB5r8nCZCwRgG, ._2xXg2ADA-nqWnn548WmZba, ._33kDu8YhkrBqlQy3HACYoN { display: none;} html ._3zsve4Dj3IzGN1UkKP1vTT,html ._2w33pJvkmet3fVYAp0m4xf, ._3J_S6fOI4B5tFT8R6qMqT7, ._3zJzxRam-s-FYVZNqcZ0BW {       top: -4px;    position: relative;} html[dir=ltr] ._3CkppxCH8qP59F-gLT9K7W, html[dir=ltr] ._3CVfKgKkHqB5r8nCZCwRgG, html[dir=ltr] ._2xXg2ADA-nqWnn548WmZba, html[dir=ltr] ._33kDu8YhkrBqlQy3HACYoN {     display: none  !important ;}      '  ;
document.getElementsByTagName('head')[0].appendChild(style);

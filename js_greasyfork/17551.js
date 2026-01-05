// ==UserScript==
// @name         Improve usability of docs on sass-lang.com
// @namespace    http://sass-lang.com/documentation/
// @version      1.0
// @description  Make documentation page on sass-lang.com more usable by fixing the TOC to the right side of the viewport.
// @author       http://github.com/BriceShatzer
// @match        http://sass-lang.com/documentation/file.SASS_REFERENCE.html
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/17551/Improve%20usability%20of%20docs%20on%20sass-langcom.user.js
// @updateURL https://update.greasyfork.org/scripts/17551/Improve%20usability%20of%20docs%20on%20sass-langcom.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

GM_addStyle('#toc{position: fixed; right: 0;top: 0; overflow-y: scroll; margin-left:0;height: 100%;}');

GM_addStyle('#content{padding-right:'+document.getElementById('toc').scrollWidth+'px;}');
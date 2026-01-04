// ==UserScript==
// @name         Better Center Justified Google
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make google search results page center-justified
// @author       Matchy
// @match        https://www.google.com/search*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/418494/Better%20Center%20Justified%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/418494/Better%20Center%20Justified%20Google.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    var cssStyle = '@media(min-width:1410px){#extabar {display: flex;justify-content: center;} #slim_appbar {width: 1280px;margin:0 auto;padding-left: 150px;box-sizing: border-box;} #searchform .tsf{margin:0 auto} #hdtb-s{display:flex;justify-content:center}.mw{margin:0 auto} #fbar{text-align:center}.lEXIrb{display:flex;justify-content:center;max-width: none !important }#rcnt{display:flex;margin-left:auto;margin-right:auto}}';

    style.innerText = cssStyle;
    document.querySelector('head').appendChild(style);
})();
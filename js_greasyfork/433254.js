// ==UserScript==
// @name         EFP Read Content Resize
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reduce EFP Read Content to 60% width
// @author       Simona Francini
// @match        *://efpfanfic.net/viewstory.php*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433254/EFP%20Read%20Content%20Resize.user.js
// @updateURL https://update.greasyfork.org/scripts/433254/EFP%20Read%20Content%20Resize.meta.js
// ==/UserScript==

(function() {
    'use strict';

    addGlobalStyle('#wrap { width:60% }');

    function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
}
})();
// ==UserScript==
// @name         Remove Gallery and Magnifier Buttons
// @namespace    yourNamespace
// @version      1.0
// @description  Removes gallery and magnifier buttons from the page
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/463827/Remove%20Gallery%20and%20Magnifier%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/463827/Remove%20Gallery%20and%20Magnifier%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    // Hide gallery button
    GM_addStyle('.pv-float-bar-button-gallery { display: none !important; }');
  
    // Hide magnifier button
    GM_addStyle('.pv-float-bar-button-magnifier { display: none !important; }');
})();

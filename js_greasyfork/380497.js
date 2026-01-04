// ==UserScript==
// @name         Make page editable
// @namespace    http://www.sunamo.cz/
// @version      0.1
// @description  Make page editable with keyboard shortcut (contenteditable="true" feature)
// @author       sunamo
// @match        http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380497/Make%20page%20editable.user.js
// @updateURL https://update.greasyfork.org/scripts/380497/Make%20page%20editable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var h1 = document.getElementsByTagName("html")[0];
    var att = document.createAttribute("contenteditable");
    att.value = "true";
    h1.setAttributeNode(att);
})();
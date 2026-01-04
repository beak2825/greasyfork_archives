// ==UserScript==
// @name         Make All Contents Right to Left
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make your browser Arabic one
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/415474/Make%20All%20Contents%20Right%20to%20Left.user.js
// @updateURL https://update.greasyfork.org/scripts/415474/Make%20All%20Contents%20Right%20to%20Left.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.setAttribute("style", "unicode-bidi: bidi-override;direction: rtl;text-align: left;");
})();
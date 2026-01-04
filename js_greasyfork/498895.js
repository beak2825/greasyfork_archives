// ==UserScript==
// @name         kpolyakov - Show Awnsers
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Autoclick for right awnsers on kpolykov tests
// @author       @dsvl0
// @match        https://kpolyakov.spb.ru/school/test*
// @match        https://kpolyakov.spb.ru/school/egetest*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spb.ru
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498895/kpolyakov%20-%20Show%20Awnsers.user.js
// @updateURL https://update.greasyfork.org/scripts/498895/kpolyakov%20-%20Show%20Awnsers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('[value="1"]').forEach(v => v.click())

})();
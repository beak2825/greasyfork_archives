// ==UserScript==
// @name         HPMOR Dark Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  HPMOR dark theme
// @author       Guy Geva
// @match        http://www.hpmor.com/chapter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407713/HPMOR%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/407713/HPMOR%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('invertable').style['background-color'] = 'rgb(42,47,52)';
})();
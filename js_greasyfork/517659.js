// ==UserScript==
// @name         Dialektai na Twānkstas Prūsas Wirdeīns
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  display:
// @author       ChatGPT
// @match        https://wirdeins.twanksta.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twanksta.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517659/Dialektai%20na%20Tw%C4%81nkstas%20Pr%C5%ABsas%20Wirde%C4%ABns.user.js
// @updateURL https://update.greasyfork.org/scripts/517659/Dialektai%20na%20Tw%C4%81nkstas%20Pr%C5%ABsas%20Wirde%C4%ABns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select the "dialektai" element by its ID
    const dialektai = document.getElementById('dialektai');

    // Set its display property to make it visible
    if (dialektai) {
        dialektai.style.display = '';
    }
})();

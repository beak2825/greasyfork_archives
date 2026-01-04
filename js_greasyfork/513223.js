// ==UserScript==
// @name         Hide/Show All Divs Except Chat Mine-Craft.io - Mine-Craft.fun
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hide UI (Press U)
// @author       Junes
// @match        https://mine-craft.io/*
// @match        https://mine-craft.fun/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513223/HideShow%20All%20Divs%20Except%20Chat%20Mine-Craftio%20-%20Mine-Craftfun.user.js
// @updateURL https://update.greasyfork.org/scripts/513223/HideShow%20All%20Divs%20Except%20Chat%20Mine-Craftio%20-%20Mine-Craftfun.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let isDivVisible = true;
    function toggleDivVisibility() {
        const divs = document.querySelectorAll('div');
        divs.forEach(div => {
            if (!div.closest('#chat')) {
                div.style.visibility = isDivVisible ? 'hidden' : 'visible';
            } else {
                div.style.visibility = 'visible';
            }
        });
        isDivVisible = !isDivVisible;
    }
    document.addEventListener('keydown', (event) => {
        const chatInput = document.getElementById('chat-input');
        if (chatInput && chatInput === document.activeElement) {
            return;
        }
        if (event.key === 'U' || event.key === 'u') {
            toggleDivVisibility();
        }
    });
})();
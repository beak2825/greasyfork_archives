// ==UserScript==
// @name         Mostrar perfis premium Fatal Model
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove o blur de perfis premium no fatalmodel.com
// @author       Angel333119
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473468/Mostrar%20perfis%20premium%20Fatal%20Model.user.js
// @updateURL https://update.greasyfork.org/scripts/473468/Mostrar%20perfis%20premium%20Fatal%20Model.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Seleciona todos os elementos com a classe "item-card-v2" que também têm a classe "not-allowed"
    const censoredProfiles = document.querySelectorAll('.item-card-v2.not-allowed');

    // Remove a classe "not-allowed" para remover o efeito de blur
    censoredProfiles.forEach(profile => {
        profile.classList.remove('not-allowed');
    });
})();
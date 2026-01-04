// ==UserScript==
// @name         Remove Udrob Footer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove the donation footer on Udrob.com
// @author       WnB
// @match        *://*.udrob.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505158/Remove%20Udrob%20Footer.user.js
// @updateURL https://update.greasyfork.org/scripts/505158/Remove%20Udrob%20Footer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour supprimer l'élément avec l'id "footer"
    function removeFooter() {
        const footerElement = document.getElementById('footer');
        if (footerElement) {
            footerElement.remove();
        }
    }

    // Attendre que la page soit complètement chargée
    window.addEventListener('load', removeFooter);

    // Au cas où le contenu est chargé dynamiquement après la page
    const observer = new MutationObserver(removeFooter);
    observer.observe(document.body, { childList: true, subtree: true });
})();

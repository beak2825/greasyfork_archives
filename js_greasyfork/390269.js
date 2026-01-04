// ==UserScript==
// @name         Komica: ID Search
// @version      1.0.1
// @description  Click ID to Search with Expand Observer on Komica.
// @author       Hayao-Gai
// @namespace	 https://github.com/HayaoGai
// @icon         https://i.imgur.com/ltLDPGc.jpg
// @include      http*://*.komica.org/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390269/Komica%3A%20ID%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/390269/Komica%3A%20ID%20Search.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    const domain = "https://komica-cache.appspot.com/?search=ID&q=";

    window.addEventListener("load", () => {
        searchID();
        observerReady();
    });

    function searchID() {
        // thread id
        document.querySelectorAll(".id:not(.search)").forEach(id => {
            id.classList.add("search");
            addListener(id);
        });
        // popup id
        document.querySelectorAll(".popup_area .id:not(.listener)").forEach(id => {
            id.classList.add("listener");
            addListener(id);
        });
    }

    function addListener(target) {
        target.addEventListener("click", function() {
            const number = this.getAttribute("data-id");
            window.open(`${domain}${number}`);
        });
    }

    function observerReady() {
        // expand
        document.querySelectorAll(".-expand-thread").forEach(expand => observerSystem(expand.closest(".thread")));
        // popup
        document.querySelectorAll(".popup_area").forEach(popup => observerSystem(popup));
    }

    function observerSystem(target) {
        const Mutation = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        const config = { attributes: true, childList: true, characterData: true };
        const observer = new Mutation(searchID);
        observer.observe(target, config);
    }

})();

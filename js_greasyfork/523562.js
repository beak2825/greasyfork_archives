// ==UserScript==
// @name         Cartel Empire - Chained Slots
// @namespace    baccy.ce
// @version      0.1
// @description  Stops the bet buttons from disabling, allowing you to effectively 'chain' spins and get through your tokens faster
// @author       Baccy
// @match        https://cartelempire.online/Casino/Slots
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523562/Cartel%20Empire%20-%20Chained%20Slots.user.js
// @updateURL https://update.greasyfork.org/scripts/523562/Cartel%20Empire%20-%20Chained%20Slots.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function observeElement(target, callback) {
        if (!target) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    callback(mutation.target);
                }
            });
        });

        observer.observe(target, { attributes: true });
    }

    ['bet1000', 'bet10000', 'bet100000'].forEach((id) => {
        const element = document.querySelector(`#${id}`);
        observeElement(element, (target) => {
            if (target.hasAttribute('disabled')) target.removeAttribute('disabled');
        });
    });
})();
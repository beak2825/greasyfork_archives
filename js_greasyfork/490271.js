// ==UserScript==
// @name         Check DOIP
// @namespace    https://github.com/R0g3rT
// @version      1.1.3
// @description  burn rubber not your soul!!
// @author       R0g3rT
// @match        https://partner.jifeline.com/portal/*
// @icon         https://raw.githubusercontent.com/R0g3rT/Traccar-GPX-export/main/logo/logo.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490271/Check%20DOIP.user.js
// @updateURL https://update.greasyfork.org/scripts/490271/Check%20DOIP.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function searchForElement() {
        var targetText = '[Remote]->[Server] DOIP => Found DoIP gateway [002C] with VIN';
        var elements = document.querySelectorAll('*');

        var vinFound = false;

        elements.forEach(function (element) {
            if (element.textContent.includes(targetText)) {
                var vinRegex = /VIN \[([A-Z0-9]+)\]/;

                var vinMatch = element.textContent.match(vinRegex);

                if (vinMatch && !vinFound) {
                    var vin = vinMatch[1];

                    var currentTicket = window.location.href;
                    var ticketKey = 'ticket_' + currentTicket;

                    if (!localStorage.getItem(ticketKey)) {
                        localStorage.setItem(ticketKey, true);
                        vinFound = true;
                    }
                }
            }
        });

        var buttons = document.querySelectorAll('app-ticket-vehicle-profile button.btn.border-0.p-0.text-truncate.dropdown-toggle');

        buttons.forEach(function (button) {
            var buttonText = button.textContent.trim();
            if (buttonText === "BMW ENET (100%)" || buttonText === "Mini ENET (100%)") {
                if (vinFound || localStorage.getItem('ticket_' + window.location.href)) {
                    button.style.color = "turquoise";
                } else {
                    button.removeAttribute('style');
                }
            } else {
                button.removeAttribute('style'); // Reset color if button text changes
            }
        });
    }

    var observer = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                searchForElement();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    searchForElement();
})();

// ==UserScript==
// @name         Synottip - Přesměrování na live zápas - Finální verze
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Přidá tlačítko pro Synottip
// @author       Michal
// @match        https://sport.synottip.cz/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484538/Synottip%20-%20P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20na%20live%20z%C3%A1pas%20-%20Fin%C3%A1ln%C3%AD%20verze.user.js
// @updateURL https://update.greasyfork.org/scripts/484538/Synottip%20-%20P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20na%20live%20z%C3%A1pas%20-%20Fin%C3%A1ln%C3%AD%20verze.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton() {
        const selectors = document.querySelectorAll('[id^="tooltip_eventlist_"], [id^="tooltip_evtinfocol_"]');

        selectors.forEach(selector => {
            const existingButton = selector.parentElement.querySelector('.tampermonkey-generated');
            if (!existingButton) {
                const container = selector.parentElement;
                const id = selector.id.match(/\d+/)[0];
                const link = `https://sport.synottip.cz/live/live-zapas/${id}`;
                const button = document.createElement('a');
                button.href = link;
                button.target = '_blank';
                button.innerText = 'Live url';
                button.classList.add('tampermonkey-generated');

                button.style.display = 'block';
                button.style.textAlign = 'center';
                button.style.margin = '10px auto';
                button.style.padding = '8px 16px';
                button.style.border = '1px solid #ff5800';
                button.style.borderRadius = '4px';
                button.style.color = '#ff5800';
                button.style.textDecoration = 'none';
                button.style.fontWeight = 'bold';

                container.insertBefore(button, selector.nextSibling);
            }
        });

        setButtonWidth();
    }

    function setButtonWidth() {
        const buttons = document.querySelectorAll('.tampermonkey-generated');
        let maxWidth = 0;

        buttons.forEach(button => {
            const width = button.offsetWidth;
            if (width > maxWidth) {
                maxWidth = width;
            }
        });

        buttons.forEach(button => {
            button.style.width = maxWidth + 'px';
        });
    }

    createButton();
    setInterval(createButton, 2000);
})();
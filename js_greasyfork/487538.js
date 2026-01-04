// ==UserScript==
// @name         Audible Virtual Voice Remover
// @namespace    https://www.briansbookblog.com
// @version      0.34
// @description  Remove Virtual Voice from Audible.com's browsing pages.
// @author       Brian @ briansbookblog.com
// @match        https://www.audible.com/*
// @match        https://www.audible.co.uk/*
// @match        https://www.audible.ca/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/487538/Audible%20Virtual%20Voice%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/487538/Audible%20Virtual%20Voice%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkboxId = 'enableCheckbox';

    function modifyURL() {
    const checkbox = document.getElementById(checkboxId);

    if (checkbox) {
        const currentUrl = new URL(window.location.href);
        const keywordsParam = currentUrl.searchParams.get('keywords');
        const isChecked = checkbox.checked;

        if (isChecked) {
            if (keywordsParam && !keywordsParam.includes("-virtual_voice")) {
                currentUrl.searchParams.set('keywords', keywordsParam + ' -virtual_voice');
            } else {
                currentUrl.searchParams.set('keywords', '-virtual_voice');
            }
        } else {
            if (keywordsParam && keywordsParam.includes("-virtual_voice")) {
                currentUrl.searchParams.set('keywords', keywordsParam.replace(/-virtual_voice/g, ''));
            }
        }

        window.location.href = currentUrl.toString();
    }
}

    function addCheckbox() {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = checkboxId;
        checkbox.style.marginRight = '5px';

        const label = document.createElement('label');
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' Remove Virtual Voice'));
        label.addEventListener('change', modifyURL);

        const heading = document.createElement('h2');
        heading.id = 'a-virtualvoice';
        heading.className = 'bc-text bc-pub-relative bc-accordion-header-text bc-size-base bc-text-bold bc-box bc-box-padding-mini bc-accordion-header-inner bc-accordion-header-content';
        heading.appendChild(document.createTextNode('Virtual Voice'));


        const parentElement = document.querySelector('#left-1 > form > section > div.bc-accordion.bc-color-border-base.bc-accordion-borderless.bc-accordion-icon-position-');
        if (parentElement) {
            parentElement.insertBefore(label, parentElement.firstChild);
            parentElement.insertBefore(heading, parentElement.firstChild);
}

    }

    addCheckbox();
})();
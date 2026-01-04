// ==UserScript==
// @name         WhatsApp On Google Maps
// @name:es      WhatsApp En Google Maps
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds WhatsApp button to phones in Google Maps
// @description:es Agrega un boton de WhatsApp a los teléfonos en Google Maps
// @author       JuaniElias
// @match        https://www.google.com/maps*
// @match        https://maps.google.com/maps*
// @icon         https://www.google.com/images/branding/product/ico/maps15_bnuw3a_32dp.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537589/WhatsApp%20On%20Google%20Maps.user.js
// @updateURL https://update.greasyfork.org/scripts/537589/WhatsApp%20On%20Google%20Maps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to detect phone number and add WhatsApp button
    function addWhatsAppButton() {
        const areaCode = '';
        let numberNoZero;
        let whatsapp;

        // Looks for phone number in the sidebar (adjust selector as needed)
        const phoneButton = document.querySelector('button[data-item-id^="phone:tel:"]');
        if (!phoneButton || phoneButton.dataset.hasWhatsAppButton) return;

        const phoneElement = phoneButton.parentElement;

        console.log(phoneElement);

        const phoneMatch = phoneElement.textContent.match(/\+?\d[\d\s()-]{7,}/);
        console.log(phoneMatch);

        if (!phoneMatch) return;

        let number = phoneMatch[0].replace(/[\s()-]/g, '');

        //Removing leading 0
        if(number.charAt(0) === '0') {
            numberNoZero = number.substring(1);
            whatsapp = areaCode + numberNoZero;
        }
        else if(number.charAt(0) === '+'){
            whatsapp = number.substring(1);
        }
        else whatsapp = number;

        const btn = document.createElement('a');
        btn.className = 'whatsapp-btn';
        btn.href = `https://wa.me/${whatsapp}`;
        btn.target = '_blank';
        btn.textContent = '📞 WhatsApp';
        btn.style.display = 'inline-block'
        btn.style.marginLeft = '22px';
        btn.style.backgroundColor = '#25D366';
        btn.style.textDecoration = 'none';
        btn.style.fontWeight = 'bold';
        btn.style.borderRadius = '15px';
        btn.style.padding = '5px';
        btn.style.color = 'transparent';
        btn.style.textShadow = '0 0 0 white';

        phoneElement.insertAdjacentElement('afterend', btn);
        phoneButton.dataset.hasWhatsAppButton = true;
    }

    // Start observing
    const observer = new MutationObserver(() => {
        addWhatsAppButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();

// ==UserScript==
// @name         Enviar texto a WhatsApp
// @namespace    https://greasyfork.org/en/users/247131
// @author       ALi3naTEd0
// @version      1.0
// @description  Envía texto seleccionado a WhatsApp al presionar Ctrl + X
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515108/Enviar%20texto%20a%20WhatsApp.user.js
// @updateURL https://update.greasyfork.org/scripts/515108/Enviar%20texto%20a%20WhatsApp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Obtener o solicitar el código de país y número de teléfono
    function getPhoneNumber() {
        let countryCode = localStorage.getItem('whatsappCountryCode');
        let phoneNumber = localStorage.getItem('whatsappPhoneNumber');

        // Si no están guardados, solicitarlos al usuario
        if (!countryCode) {
            countryCode = prompt("Ingresa el código de país (por ejemplo, para México usa 52):", "52");
            if (countryCode) localStorage.setItem('whatsappCountryCode', countryCode);
        }
        if (!phoneNumber) {
            phoneNumber = prompt("Ingresa tu número de teléfono sin el código de país:");
            if (phoneNumber) localStorage.setItem('whatsappPhoneNumber', phoneNumber);
        }

        return `+${countryCode}${phoneNumber}`;
    }

    // Ejecutar la acción al presionar Ctrl + X
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'x') {
            let selectedText = window.getSelection().toString().trim();
            if (selectedText) {
                let encodedText = encodeURIComponent(selectedText);
                let phoneNumber = getPhoneNumber();
                let whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
                window.open(whatsappUrl, '_blank');
            }
        }
    });
})();
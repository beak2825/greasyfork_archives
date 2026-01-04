// ==UserScript==
// @name         GDTallerTitle
// @namespace    http://gdtaller.com/
// @version      0.1
// @description  Change the page title of ORs with useful data
// @author       SrGeneroso
// @match        https://app.gdtaller.com/app/app_albaranes_or_form.php?cod=*&tab=1
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487460/GDTallerTitle.user.js
// @updateURL https://update.greasyfork.org/scripts/487460/GDTallerTitle.meta.js
// ==/UserScript==

;(function () {
    'use strict';
    window.addEventListener('load', function () {
        // Extract the matricula value from the text content of the div
        var extractedData = document.getElementById('divDatosVehiculo_1')?.textContent;
        var matriculaMatch = extractedData.match(/Matrícula:\s*(\S+)/);
        var matricula = matriculaMatch ? matriculaMatch[1] : false;

        // Extract the client name from the first bold element within the div with id 'divDatosCliente_1'
        var clientData = document.querySelector('#divDatosCliente_1 > b:nth-child(1)')?.textContent;
        var clientMatch = clientData?.split(' ')[0];
        var firstName = clientMatch ? clientMatch : false;

        // Extract the order number or status from the element with id 'css_titulopagina'
        var orderElement = document.getElementById('css_titulopagina')?.textContent;
        var orderNumberMatch = orderElement?.match(/\d{4}$/);
        var orderNumber = orderElement === 'Borrador' ? '*' : parseFloat(orderElement.match(/\d{4}$/)[0]).toString();

        // Check if we have at least one piece of data to set as the title
        if (matricula || firstName) {
            // Set the title to a literal string with the matricula and first name, if available
            document.title = 'OR-' + (orderNumber || '') + ' ' + (matricula || '') + ' ' + (firstName || '');
        } else if (orderNumber) {
            // If there is no matricula or first name, but there is an order number, set the title with the order number
            document.title = 'OR-' + orderNumber;
        } else {
            // If there is no matricula, first name, or order number, set a default title
            document.title = 'GDTaller OR';
        }
    }, false);
})();

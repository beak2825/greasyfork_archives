// ==UserScript==
// @name         Total Comprobantes AFIP
// @namespace    http://tampermonkey.net/
// @version      2024-11-28
// @description  Muestra un label con la suma de pesos totales para los comprobantes generados.
// @author       @AcademicoMDP
// @match        https://fe.afip.gob.ar/rcel/jsp/buscarComprobantesGenerados.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gob.ar
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519156/Total%20Comprobantes%20AFIP.user.js
// @updateURL https://update.greasyfork.org/scripts/519156/Total%20Comprobantes%20AFIP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the totals
    let total = 0;
    const tds = document.querySelectorAll(".jig_table tbody tr[class] td[title^='Importe']")
    tds.forEach(td => {
        const value = parseFloat(td.textContent.trim());
        if (!isNaN(value)) {
            total += value;
        }
    })

    // Format as Currency
    const formattedTotal = Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS'}).format(total)

    // Create floating label
    const floatingLabel = document.createElement('div');
    floatingLabel.textContent = `Total: ${formattedTotal}`;
    floatingLabel.style.position = 'fixed';
    floatingLabel.style.top = '10px';
    floatingLabel.style.right = '10px';
    floatingLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    floatingLabel.style.color = 'white';
    floatingLabel.style.padding = '10px 15px';
    floatingLabel.style.borderRadius = '5px';
    floatingLabel.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    floatingLabel.style.zIndex = '1000';
    floatingLabel.style.fontSize = '14px';

    // Append label to body
    document.body.appendChild(floatingLabel);
})();
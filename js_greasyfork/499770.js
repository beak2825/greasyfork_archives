// ==UserScript==
// @name         Ocultar Assuntos Repetidos
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Ocultar linhas com assuntos repetidos no e-desk, priorizando linhas 'Em Andamento'
// @author       MaxwGPT
// @match        https://nebrasil.e-desk.com.br/Portal/ListaSolicitacao.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499770/Ocultar%20Assuntos%20Repetidos.user.js
// @updateURL https://update.greasyfork.org/scripts/499770/Ocultar%20Assuntos%20Repetidos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function ocultarAssuntosRepetidos() {
        const rows = document.querySelectorAll('tr.rgRow');
        const assuntos = new Map();

        rows.forEach(row => {
            const assuntoCell = row.cells[9];
            const statusCell = row.cells[4]; // Ajuste para a coluna correta do status

            if (assuntoCell && statusCell) {
                const assunto = assuntoCell.textContent.trim();
                const status = statusCell.textContent.trim();

                if (assuntos.has(assunto)) {
                    const existingRow = assuntos.get(assunto);
                    const existingStatusCell = existingRow.cells[4];
                    const existingStatus = existingStatusCell.textContent.trim();

                    if (existingStatus !== 'Em Andamento' && status === 'Em Andamento') {
                        existingRow.style.display = 'none';
                        assuntos.set(assunto, row);
                    } else {
                        row.style.display = 'none';
                    }
                } else {
                    assuntos.set(assunto, row);
                }
            }
        });
    }

    window.addEventListener('load', ocultarAssuntosRepetidos);
    setInterval(() => {
        location. Reload();
    }, 120000);
})();

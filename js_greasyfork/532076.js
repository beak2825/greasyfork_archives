// ==UserScript==
// @name         RFEVB Seeding Points Calculator
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Calculate seeding points (factor >= 7) for beach volleyball players with search support
// @author       You
// @match        http://rfevb.com/ranking-voley-playa-masculino
// @match        https://rfevb.com/ranking-voley-playa-masculino
// @match        http://www.rfevb.com/ranking-voley-playa-masculino
// @match        https://www.rfevb.com/ranking-voley-playa-masculino
// @match        http://rfevb.com/ranking-voley-playa-femenino
// @match        https://rfevb.com/ranking-voley-playa-femenino
// @match        http://www.rfevb.com/ranking-voley-playa-femenino
// @match        https://www.rfevb.com/ranking-voley-playa-femenino
// @grant        none
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/532076/RFEVB%20Seeding%20Points%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/532076/RFEVB%20Seeding%20Points%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("RFEVB Seeding Points Calculator iniciado");

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        console.log("Página cargada, inicializando script...");

        // Add CSS for our custom elements
        const style = document.createElement('style');
        style.textContent = `
            .seeding-header {
                font-weight: bold;
                margin-top: 10px;
                color: #0099ee;
            }
            .seeding-total {
                font-weight: bold;
                color: #0099ee;
                margin-top: 5px;
                border-top: 1px solid #ddd;
                padding-top: 5px;
            }
            .highlighted-row {
                background-color: #e8f4ff !important;
            }
            .loading {
                color: #888;
                font-style: italic;
            }
        `;
        document.head.appendChild(style);

        // Create column header for seeding points
        setTimeout(function() {
            addSeedingHeaderColumn();
            processAllRows();
        }, 1000);

        // Override the getDatos function to add our functionality after search
        interceptGetDatosFunction();

        // Override the existing mostrarTorneosJugador function to add our seeding calculation
        const originalMostrarTorneosJugador = window.mostrarTorneosJugador;
        window.mostrarTorneosJugador = function(idpersona) {
            // Call the original function
            originalMostrarTorneosJugador(idpersona);

            // Add our seeding calculation after a slight delay to let modal open
            setTimeout(() => {
                calculateSeedingInModal(idpersona);
            }, 1000);
        };

        console.log("Script inicializado correctamente");
    });

    // Function to intercept the getDatos function that's called when searching
    function interceptGetDatosFunction() {
        if (typeof window.getDatos === 'function') {
            console.log("Interceptando función getDatos");

            // Store the original function
            const originalGetDatos = window.getDatos;

            // Replace with our wrapper function
            window.getDatos = function() {
                console.log("getDatos interceptado");

                // Call the original function
                originalGetDatos.apply(this, arguments);

                // Wait for the results to load, then add our seeding data
                setTimeout(function() {
                    console.log("Procesando resultados después de getDatos");
                    addSeedingHeaderColumn();
                    processAllRows();
                }, 1500); // Longer timeout to ensure the table has updated
            };

            console.log("Función getDatos interceptada con éxito");
        } else {
            console.warn("No se encontró la función getDatos. Probando método alternativo.");

            // If getDatos isn't defined yet, try again later
            setTimeout(interceptGetDatosFunction, 1000);
        }
    }

    // Function to add the seeding header column
    function addSeedingHeaderColumn() {
        const headerRow = document.querySelector('#tablajson thead tr');
        if (headerRow) {
            // Check if the seeding header already exists
            let seedingHeaderExists = false;
            const headerCells = headerRow.querySelectorAll('th');

            headerCells.forEach(cell => {
                if (cell.textContent.trim() === 'Seeding') {
                    seedingHeaderExists = true;
                }
            });

            if (!seedingHeaderExists) {
                const headerCell = document.createElement('th');
                headerCell.textContent = 'Seeding';
                headerRow.appendChild(headerCell);
                console.log("Columna añadida al encabezado");
            } else {
                console.log("Columna de Seeding ya existe en el encabezado");
            }
        } else {
            console.error("No se encontró la fila de encabezado de la tabla");
        }
    }

    // Process all rows in the table
    function processAllRows() {
        console.log("Procesando todas las filas");

        // Get all rows in the table
        const rows = document.querySelectorAll('#tablajson tbody tr');
        console.log(`Encontradas ${rows.length} filas en la tabla`);

        // Process each row
        rows.forEach(row => {
            // Check if we need to add a seeding cell
            let seedingCell;
            let lastCell = row.querySelector('td:last-child');

            // If the last cell already has seeding data, don't recalculate
            if (lastCell && lastCell.classList.contains('seeding-cell')) {
                if (lastCell.textContent.trim() !== 'Calculando...' && !lastCell.textContent.trim().includes('Error')) {
                    console.log("Esta fila ya tiene datos de seeding válidos");
                    return;
                }
                // Use the existing cell if it's loading or has an error
                seedingCell = lastCell;
            } else {
                // Create a new seeding cell
                seedingCell = document.createElement('td');
                seedingCell.classList.add('seeding-cell');
                seedingCell.innerHTML = '<span class="loading">Calculando...</span>';
                row.appendChild(seedingCell);
            }

            // Get player info for this row
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                const playerId = cells[1].textContent.trim();
                const playerName = cells[2].textContent.trim();

                // Calculate seeding for this player
                calculateAndDisplaySeeding(playerId, playerName, seedingCell);
            }
        });
    }

    // Helper function to properly parse Spanish formatted numbers (1.680 -> 1680)
    function parseSpanishNumber(numStr) {
        // Remove all thousand separators (periods) and then parse
        return parseInt(numStr.replace(/\./g, ''));
    }

    // Function to calculate seeding points directly from API
    function calculateAndDisplaySeeding(playerId, playerName, seedingCell) {
        console.log(`Calculando puntos de seeding para: ${playerName} (${playerId})`);

        // Set loading state
        seedingCell.innerHTML = '<span class="loading">Calculando...</span>';

        const auxFecha = document.getElementById('fechaRanking').value;
        console.log(`Fecha de ranking: ${auxFecha}`);

        fetch(`https://intranet.rfevb.com/webservices/rfevbcom/vplaya/vp-torneos-deportista-html.php?IdPersona=${playerId}&fechaHasta=${auxFecha}`)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                let seedingPoints = 0;
                let tournamentCount = 0;

                // Find tournament rows with factor >= 7
                const rows = doc.querySelectorAll('table tr');
                console.log(`Encontrados ${rows.length} torneos para analizar`);

                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length >= 6) {
                        const factorText = cells[4].textContent.trim();
                        const factor = parseFloat(factorText);

                        if (factor >= 7) {
                            const pointsText = cells[6].textContent.trim();
                            const points = parseSpanishNumber(pointsText);
                            if (!isNaN(points)) {
                                seedingPoints += points;
                                tournamentCount++;
                                console.log(`Torneo con factor ${factor}: ${points} puntos`);
                            }
                        }
                    }
                });

                console.log(`Total puntos seeding: ${seedingPoints} de ${tournamentCount} torneos`);

                // Update the seeding cell with the result
                seedingCell.innerHTML = `${seedingPoints.toLocaleString('es-ES')}`;
                seedingCell.title = `Calculado de ${tournamentCount} torneos con factor ≥ 7`;
            })
            .catch(error => {
                console.error('Error fetching player data:', error);
                seedingCell.innerHTML = 'Error';
                seedingCell.title = error.message;
            });
    }

    // Function to calculate and display seeding points in the modal
    function calculateSeedingInModal(playerId) {
        const modal = document.querySelector('#mymodalexp .modal-body');
        if (!modal) {
            console.error("No se encontró el modal");
            return;
        }

        // Check if we already added seeding calculation
        if (modal.querySelector('.seeding-header')) {
            console.log("Cálculo de seeding ya añadido al modal");
            return;
        }

        console.log(`Calculando puntos de seeding en modal para jugador: ${playerId}`);

        let seedingPoints = 0;
        let seedingTournaments = [];

        // Find all tournament rows in the modal
        const rows = modal.querySelectorAll('table tr');
        console.log(`Encontradas ${rows.length} filas en el modal`);

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 6) {
                const factorText = cells[4].textContent.trim();
                const factor = parseFloat(factorText);

                if (factor >= 7) {
                    const tournamentId = cells[0].textContent.trim();
                    const tournamentDate = cells[1].textContent.trim();
                    const tournamentName = cells[2].textContent.trim();

                    const pointsText = cells[6].textContent.trim();
                    const points = parseSpanishNumber(pointsText);

                    if (!isNaN(points)) {
                        seedingPoints += points;
                        seedingTournaments.push({
                            id: tournamentId,
                            date: tournamentDate,
                            name: tournamentName,
                            factor: factor,
                            points: points
                        });

                        // Highlight this row
                        row.classList.add('highlighted-row');
                        console.log(`Torneo válido: ${tournamentName}, factor ${factor}, ${points} puntos`);
                    }
                }
            }
        });

        console.log(`Total puntos seeding en modal: ${seedingPoints} de ${seedingTournaments.length} torneos`);

        // Create and append seeding summary
        const seedingHeader = document.createElement('div');
        seedingHeader.className = 'seeding-header';
        seedingHeader.textContent = 'Torneos para seeding (factor ≥ 7):';

        const seedingList = document.createElement('ul');
        seedingList.style.marginLeft = '20px';

        seedingTournaments.forEach(tournament => {
            const listItem = document.createElement('li');
            listItem.textContent = `${tournament.name} (Factor ${tournament.factor}): ${tournament.points.toLocaleString('es-ES')} puntos`;
            seedingList.appendChild(listItem);
        });

        const seedingTotal = document.createElement('div');
        seedingTotal.className = 'seeding-total';
        seedingTotal.innerHTML = `TOTAL PUNTOS SEEDING: ${seedingPoints.toLocaleString('es-ES')}`;

        // Add elements to modal
        modal.appendChild(document.createElement('hr'));
        modal.appendChild(seedingHeader);
        modal.appendChild(seedingList);
        modal.appendChild(seedingTotal);

        console.log("Información de seeding añadida al modal correctamente");
    }
})();
// ==UserScript==
// @name         ITACA MD2 docent.edu.gva.es - Importador de Calificaciones y Observaciones
// @namespace    https://lpla.github.io/
// @version      0.3.1
// @description  Importa calificaciones y observaciones desde un archivo Excel a la plataforma "mòdul docent 2" (MD2) de ITACA.
// @author       lpla
// @match        https://docent.edu.gva.es/md-front/www/*
// @require      https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js
// @grant        none
// @supportURL   https://github.com/lpla/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/498102/ITACA%20MD2%20docentedugvaes%20-%20Importador%20de%20Calificaciones%20y%20Observaciones.user.js
// @updateURL https://update.greasyfork.org/scripts/498102/ITACA%20MD2%20docentedugvaes%20-%20Importador%20de%20Calificaciones%20y%20Observaciones.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función que detecta si se está en la vista de un aula basándose en la URL.
    // Se espera que la URL tenga el formato:
    // #centre/<centro>/grup/<grupo>/avaluacio/<evaluacion>/dades/<datos>
    function isInClassroom() {
        const hash = window.location.hash;
        const regex = /^#centre\/\d+\/grup\/\d+\/avaluacio\/\d+\/dades\/[\d;A-Z,]+$/;
        return regex.test(hash);
    }

    // Función que crea el disclaimer con el espaciado adecuado.
    function getDisclaimerElement() {
        const disclaimer = document.createElement('p');
        disclaimer.style.fontSize = '0.6em';
        disclaimer.style.margin = '10px 0';
        disclaimer.style.color = 'white';
        disclaimer.textContent = "Todos los datos introducidos se procesan en este ordenador y no se mandan ni se procesan en ningún servidor externo.";
        return disclaimer;
    }

    // Crear contenedor principal del plugin (ancho ampliado)
    const pluginContainer = document.createElement('div');
    pluginContainer.id = 'pluginContainer';
    pluginContainer.style.position = 'fixed';
    pluginContainer.style.top = '10px';
    pluginContainer.style.left = '10px';
    pluginContainer.style.zIndex = '10000';
    pluginContainer.style.background = '#576670';  // BLAU secundari
    pluginContainer.style.color = 'white';
    pluginContainer.style.border = '1px solid #ccc';
    pluginContainer.style.fontFamily = 'sans-serif';
    pluginContainer.style.width = '350px';  // Ancho ampliado

    // Encabezado con botón de minimizar/restaurar
    const pluginHeader = document.createElement('div');
    pluginHeader.id = 'pluginHeader';
    pluginHeader.style.background = '#576670';
    pluginHeader.style.cursor = 'pointer';
    pluginHeader.style.padding = '5px';
    pluginHeader.style.display = 'flex';
    pluginHeader.style.justifyContent = 'space-between';
    pluginHeader.style.alignItems = 'center';

    const headerTitle = document.createElement('span');
    headerTitle.textContent = 'Importador de Calificaciones';
    pluginHeader.appendChild(headerTitle);

    // Pequeño texto de autoría debajo del título
    const devCredit = document.createElement('div');
    devCredit.style.fontSize = '0.6em';
    devCredit.style.margin = '10px 0';
    devCredit.style.textAlign = 'center';
    devCredit.innerHTML = 'Desarrollado por <a href="https://github.com/lpla" target="_blank" style="color: white; text-decoration: underline;">lpla</a>; soporte Excel por <a href="https://docs.sheetjs.com" target="_blank" style="color: white; text-decoration: underline;">SheetJS</a>';

    // Botón para minimizar/restaurar
    const minimizeButton = document.createElement('button');
    minimizeButton.id = 'minimizeButton';
    minimizeButton.textContent = '–';
    minimizeButton.style.background = 'transparent';
    minimizeButton.style.color = 'white';
    minimizeButton.style.border = 'none';
    minimizeButton.style.cursor = 'pointer';
    minimizeButton.style.fontSize = '16px';
    pluginHeader.appendChild(minimizeButton);

    pluginContainer.appendChild(pluginHeader);
    // Insertar el crédito debajo del header
    pluginContainer.appendChild(devCredit);

    // Contenedor del contenido del plugin (se actualizará según el modo)
    const pluginContent = document.createElement('div');
    pluginContent.id = 'pluginContent';
    pluginContent.style.padding = '5px';
    pluginContent.style.background = '#576670';
    pluginContainer.appendChild(pluginContent);
    document.body.appendChild(pluginContainer);

    // Contenedor de controles (selector de archivo e inputs) a mostrar en aula
    const controlsContainer = document.createElement('div');
    // Selector de archivo
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx, .xls';
    fileInput.style.width = '100%';
    controlsContainer.appendChild(fileInput);
    // Contenedor de configuración (inputs para columnas y mensaje de estado)
    const configDiv = document.createElement('div');
    configDiv.style.marginTop = '5px';
    configDiv.innerHTML = `
        <label style="display:block; margin-bottom:5px;">
            Columna de nombres: <input type="number" id="col-name" min="1" value="1" style="width:50px;">
        </label>
        <label style="display:block; margin-bottom:5px;">
            Columna de notas: <input type="number" id="col-mark" min="1" value="2" style="width:50px;">
        </label>
        <label style="display:block; margin-bottom:5px;">
            Columna de observaciones: <input type="number" id="col-observation" min="1" value="3" style="width:50px;">
        </label>
        <div id="statusMsg" style="margin-top:5px; font-weight:bold;"></div>
    `;
    controlsContainer.appendChild(configDiv);
    fileInput.addEventListener('change', handleFile, false);

    // Función para actualizar la interfaz del plugin según la URL
    function updatePluginUI() {
        if (!isInClassroom()) {
            // No se está en aula: mostrar instrucciones
            if (pluginContent.getAttribute('data-mode') !== 'instructions') {
                pluginContent.innerHTML = '';
                const instructions = document.createElement('p');
                instructions.style.padding = '5px';
                instructions.style.color = 'white';
                instructions.textContent = 'Primero, acceda a la pantalla de las calificaciones de un grupo en una evaluación concreta para usar esta herramienta.';
                pluginContent.appendChild(instructions);
                pluginContent.appendChild(getDisclaimerElement());
                pluginContent.setAttribute('data-mode', 'instructions');
            }
        } else {
            // Se está en aula: mostrar los controles si aún no se han mostrado
            if (pluginContent.getAttribute('data-mode') !== 'controls') {
                pluginContent.innerHTML = '';
                pluginContent.appendChild(controlsContainer);
                pluginContent.appendChild(getDisclaimerElement());
                pluginContent.setAttribute('data-mode', 'controls');
            }
        }
    }
    // Usar el evento hashchange para actualizar la UI y llamar a updatePluginUI inmediatamente.
    window.addEventListener("hashchange", updatePluginUI);
    updatePluginUI();

    // Funcionalidad de minimizar/restaurar
    minimizeButton.addEventListener('click', function() {
        if (pluginContent.style.display === 'none') {
            pluginContent.style.display = 'block';
            minimizeButton.textContent = '–';
        } else {
            pluginContent.style.display = 'none';
            minimizeButton.textContent = '+';
        }
    });

    // Función para mostrar mensajes de estado que desaparecen a los 5 segundos.
    // Se usa BLAU (#19afe0) para mensajes normales y ROSA (#d1a16d) para errores.
    function showStatus(message, isError=false) {
        const statusMsg = document.getElementById('statusMsg');
        if (statusMsg) {
            statusMsg.textContent = message;
            statusMsg.style.backgroundColor = isError ? '#d1a16d' : '#19afe0';
            statusMsg.style.color = 'white';
            statusMsg.style.padding = '3px';
            setTimeout(() => {
                statusMsg.textContent = '';
                statusMsg.style.backgroundColor = 'transparent';
            }, 5000);
        }
    }

    function handleFile(e) {
        const file = e.target.files[0];
        if (!file) {
            showStatus('No se ha seleccionado ningún archivo.', true);
            return;
        }
        console.log("Archivo seleccionado:", file);
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {type: 'array'});
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
                // Se asume que la primera fila contiene cabeceras
                const studentData = jsonData.slice(1);
                // Obtener índices configurados (los valores se introducen en base 1 y se convierten a base 0)
                const colName = parseInt(document.getElementById('col-name').value, 10) - 1;
                const colMark = parseInt(document.getElementById('col-mark').value, 10) - 1;
                const colObservation = parseInt(document.getElementById('col-observation').value, 10) - 1;
                showStatus('Procesando datos...');
                await fillMarksAndObservations(studentData, colName, colMark, colObservation);
                showStatus('Proceso completado.');
            } catch (error) {
                console.error('Error al procesar el archivo:', error);
                showStatus('Error al procesar el archivo.', true);
            }
        };
        reader.onerror = function(e) {
            console.error('Error al leer el archivo:', e);
            showStatus('Error al leer el archivo.', true);
        };
        reader.readAsArrayBuffer(file);
    }

    function normalizeName(name) {
        return name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/-/g, ' ')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ');
    }

    function extractMark(mark) {
        if (typeof mark === 'string' || mark instanceof String) {
            const match = mark.match(/^\d+/);
            return match ? match[0] : '';
        }
        return '';
    }

    function levenshtein(a, b) {
        const tmp = [];
        if (a.length === 0) { return b.length; }
        if (b.length === 0) { return a.length; }
        for (let i = 0; i <= b.length; i++) { tmp[i] = [i]; }
        for (let j = 0; j <= a.length; j++) { tmp[0][j] = j; }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                tmp[i][j] = b[i - 1] === a[j - 1] ?
                    tmp[i - 1][j - 1] :
                    Math.min(tmp[i - 1][j - 1] + 1, Math.min(tmp[i][j - 1] + 1, tmp[i - 1][j] + 1));
            }
        }
        return tmp[b.length][a.length];
    }

    function formatExcelName(name) {
        const parts = name.trim().split(/\s+/);
        if (parts.length > 2) {
            const firstName = parts.slice(0, parts.length - 2).join(' ');
            const lastNames = parts.slice(parts.length - 2).join(' ');
            return `${lastNames}, ${firstName}`;
        } else {
            const firstName = parts[0];
            const lastNames = parts.slice(1).join(' ');
            return `${lastNames}, ${firstName}`;
        }
    }

    function formatAlternativeExcelName(name) {
        const parts = name.trim().split(/\s+/);
        const firstName = parts.slice(0, -1).join(' ');
        const lastName = parts.slice(-1).join(' ');
        return `${lastName}, ${firstName}`;
    }

    async function fillMarksAndObservations(studentData, colName, colMark, colObservation) {
        for (const row of studentData) {
            const name = row[colName];
            const mark = row[colMark];
            const observation = row[colObservation];
            if (name && mark) {
                const isAlreadyFormatted = (typeof name === 'string' && name.includes(','));
                let formattedName = isAlreadyFormatted ? name.trim() : formatExcelName(name);
                const normalizedExcelName = normalizeName(formattedName);
                const extractedMark = extractMark(mark);
                const nameElements = document.evaluate(`//div[@class='imc-nom']/p`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                let exactMatch = false;
                let bestMatch = null;
                let bestMatchDistance = Infinity;

                for (let i = 0; i < nameElements.snapshotLength; i++) {
                    const nameElement = nameElements.snapshotItem(i);
                    const normalizedHtmlName = normalizeName(nameElement.textContent);
                    if (normalizedExcelName === normalizedHtmlName) {
                        exactMatch = true;
                        bestMatch = nameElement;
                        bestMatchDistance = 0;
                        break;
                    }
                }

                if (!exactMatch && !isAlreadyFormatted) {
                    const alternativeFormat = formatAlternativeExcelName(name);
                    const normalizedAlternativeExcelName = normalizeName(alternativeFormat);
                    for (let i = 0; i < nameElements.snapshotLength; i++) {
                        const nameElement = nameElements.snapshotItem(i);
                        const normalizedHtmlName = normalizeName(nameElement.textContent);
                        if (normalizedAlternativeExcelName === normalizedHtmlName) {
                            exactMatch = true;
                            bestMatch = nameElement;
                            bestMatchDistance = 0;
                            break;
                        }
                        const distance = levenshtein(normalizedAlternativeExcelName, normalizedHtmlName);
                        if (distance < bestMatchDistance) {
                            bestMatch = nameElement;
                            bestMatchDistance = distance;
                        }
                    }
                }

                if (!exactMatch) {
                    for (let i = 0; i < nameElements.snapshotLength; i++) {
                        const nameElement = nameElements.snapshotItem(i);
                        const normalizedHtmlName = normalizeName(nameElement.textContent);
                        const distance = levenshtein(normalizedExcelName, normalizedHtmlName);
                        if (distance < bestMatchDistance) {
                            bestMatch = nameElement;
                            bestMatchDistance = distance;
                        }
                    }
                }

                if (bestMatch && bestMatchDistance <= 15) {
                    const markInputElement = bestMatch.parentNode.nextElementSibling.querySelector('input');
                    if (markInputElement) {
                        markInputElement.value = extractedMark;
                        markInputElement.dispatchEvent(new Event('input', { bubbles: true }));
                        markInputElement.dispatchEvent(new Event('change', { bubbles: true }));
                        markInputElement.dispatchEvent(new Event('blur', { bubbles: true }));
                    } else {
                        console.warn('No se encontró el input para la nota del alumno:', formattedName);
                    }

                    if (observation) {
                        const studentRow = bestMatch.closest('li');
                        if (studentRow) {
                            const obsButton = studentRow.querySelector('div.imc-qualificacio > a');
                            if (obsButton) {
                                obsButton.click();
                                const modal = document.getElementById('imc-modul-observacions-avanzada');
                                if (modal && window.getComputedStyle(modal).display !== 'none') {
                                    const textarea = modal.querySelector('textarea.imc-f-observacions-avanzada');
                                    if (textarea) {
                                        textarea.value = observation;
                                        textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                        textarea.dispatchEvent(new Event('change', { bubbles: true }));
                                        textarea.dispatchEvent(new Event('blur', { bubbles: true }));
                                    } else {
                                        console.warn('No se encontró el textarea de observaciones para el alumno:', formattedName);
                                    }
                                    const finalizeButton = modal.querySelector('a.imc-bt-finalitza');
                                    if (finalizeButton) {
                                        finalizeButton.click();
                                    } else {
                                        console.warn('No se encontró el botón "Finaliza" en el modal de observaciones.');
                                    }
                                } else {
                                    console.warn('Modal de observaciones no se abrió para el alumno:', formattedName);
                                }
                            } else {
                                console.warn('No se encontró el botón de observaciones para el alumno:', formattedName);
                            }
                        } else {
                            console.warn('No se encontró la fila del alumno para las observaciones:', formattedName);
                        }
                    }
                } else {
                    console.warn('No se encontró coincidencia para el alumno:', formattedName);
                }
            }
        }
        const updateButton = document.getElementById('imc-bt-guarda-avaluacio');
        if (updateButton) {
            updateButton.disabled = false;
            updateButton.click();
        } else {
            console.warn('No se encontró el botón de guardar evaluación.');
        }
    }
})();

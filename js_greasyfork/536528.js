// ==UserScript==
// @name         NotebookLM - Cargar Fuentes desde Lista (Botón Flotante con Textarea)
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Carga una lista de enlaces como fuentes en NotebookLM simulando las acciones del usuario (Botón Flotante con Textarea).
// @author       Tú
// @match        https://notebooklm.google.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536528/NotebookLM%20-%20Cargar%20Fuentes%20desde%20Lista%20%28Bot%C3%B3n%20Flotante%20con%20Textarea%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536528/NotebookLM%20-%20Cargar%20Fuentes%20desde%20Lista%20%28Bot%C3%B3n%20Flotante%20con%20Textarea%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Añadir estilos para el botón flotante y el overlay
    GM_addStyle(`
        #cargar-enlaces-flotante {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 9999;
            padding: 10px 20px;
            font-size: 16px;
            background-color: #f0f0f0;
            color: #333;
            border: 1px solid #ccc;
            border-radius: 5px;
            cursor: pointer;
        }

        #cargar-enlaces-flotante:disabled {
            cursor: not-allowed;
            opacity: 0.6;
        }

        #lista-enlaces-input-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: none; /* Inicialmente oculto */
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }

        #lista-enlaces-container {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            width: 80%;
            max-width: 500px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        #lista-enlaces-header {
            margin-top: 0;
            text-align: center;
        }

        #lista-enlaces-input {
            width: 100%;
            height: 200px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            padding: 5px;
        }

        #cargar-enlaces-validar-button, #cargar-enlaces-cancelar-button {
            padding: 10px 20px;
            font-size: 16px;
            background-color: #f0f0f0;
            color: #333;
            border: 1px solid #ccc;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px;
        }

        #cargar-enlaces-validar-button:disabled {
            cursor: not-allowed;
            opacity: 0.6;
        }

        #cargar-enlaces-cancelar-button {
            background-color: #ddd;
        }
    `);

    const ESPERA_MS = 1000; // 1 segundo de espera (ajustable)
    let contadorFuentes = 0;

    function esperarElemento(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                }
            }, 100);
            setTimeout(() => {
                clearInterval(interval);
                reject(new Error(`Timeout waiting for element: ${selector}`));
            }, timeout);
        });
    }

    async function añadirFuente(enlace) {
        try {
            // 1. Pulsar el botón "Añadir"
            const botonAñadirSpan = Array.from(document.querySelectorAll('span.mdc-button__label')).find(
                el => el.textContent.trim() === 'Añadir' || el.textContent.trim() === 'Add source'
            );
            if (botonAñadirSpan) {
                const botonAñadir = botonAñadirSpan.closest('button');
                if (botonAñadir) {
                    botonAñadir.click();
                    console.log('Pulsado botón "Añadir".');
                    await new Promise(resolve => setTimeout(resolve, ESPERA_MS));
                } else {
                    throw new Error('No se encontró el botón "Añadir".');
                }
            } else {
                throw new Error('No se encontró el span "Añadir".');
            }

            // 2. Pulsar el botón "Sitio web"
            const botonSitioWebSpan = Array.from(document.querySelectorAll('span')).find(
                el => el.textContent.trim() === 'Sitio web' || el.textContent.trim() === 'Website'
            );
            if (botonSitioWebSpan) {
                const botonSitioWeb = botonSitioWebSpan.closest('.mdc-evolution-chip');
                if (botonSitioWeb) {
                    botonSitioWeb.click();
                    console.log('Pulsado botón "Sitio web".');
                    await new Promise(resolve => setTimeout(resolve, ESPERA_MS));
                } else {
                    throw new Error('No se encontró el botón "Sitio web".');
                }
            } else {
                throw new Error('No se encontró el span "Sitio web".');
            }

            // 3. En la nueva ventana, añadir el enlace en el campo
            const campoEnlace = await esperarElemento('input[formcontrolname="newUrl"], input[aria-label="Añadir página web o archivo de Google Drive"], #mat-input-0, #mat-input-1', 5000);
            if (campoEnlace) {
                campoEnlace.value = enlace;
                campoEnlace.dispatchEvent(new Event('input', { bubbles: true }));
                await new Promise(resolve => setTimeout(resolve, 300));
                console.log(`Introducido enlace: ${enlace}`);
            } else {
                throw new Error('No se encontró el campo de la URL.');
            }

            // 4. Pulsar el botón "Insertar"
            const botonInsertarSpan = Array.from(document.querySelectorAll('span.mdc-button__label')).find(
                el => el.textContent.trim() === 'Insertar' || el.textContent.trim() === 'Insert'
            );
            if (botonInsertarSpan) {
                const botonInsertar = botonInsertarSpan.closest('button');
                if (botonInsertar) {
                    botonInsertar.click();
                    console.log('Pulsado botón "Insertar".');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    throw new Error('No se encontró el botón "Insertar".');
                }
            } else {
                throw new Error('No se encontró el span "Insertar".');
            }

            contadorFuentes++;

        } catch (error) {
            console.error(`Error al añadir la fuente ${enlace}: ${error}`);
        }
    }

    async function cargarEnlaces(links) {
        const botonFlotante = document.getElementById('cargar-enlaces-flotante');
        const overlay = document.getElementById('lista-enlaces-input-overlay');
        const textArea = document.getElementById('lista-enlaces-input');


        contadorFuentes = 0;
        for (const enlace of links) {
            console.log(`Procesando enlace: ${enlace}`);
            await añadirFuente(enlace);
        }

        if (botonFlotante) {
            botonFlotante.disabled = false;
            botonFlotante.textContent = `Se añadieron ${contadorFuentes} fuentes`;
        }
        alert(`Se añadieron ${contadorFuentes} fuentes.`);
        overlay.style.display = 'none'; // Ocultar el overlay después de cargar
    }

    // Crear el botón flotante
    const botonFlotante = document.createElement('button');
    botonFlotante.id = 'cargar-enlaces-flotante';
    botonFlotante.textContent = 'Cargar Enlaces';
    botonFlotante.addEventListener('click', () => {
        // Al hacer clic en el botón flotante, mostrar el overlay
        const overlay = document.getElementById('lista-enlaces-input-overlay');
        overlay.style.display = 'flex';
    });
    document.body.appendChild(botonFlotante);

    // Crear el overlay con el textarea y los botones de validar/cancelar
    const overlayInput = document.createElement('div');
    overlayInput.id = 'lista-enlaces-input-overlay';
    const container = document.createElement('div');
    container.id = 'lista-enlaces-container';
    const header = document.createElement('h3');
    header.id = 'lista-enlaces-header';
    header.textContent = 'Ingresa los enlaces (uno por línea)';
    const textArea = document.createElement('textarea');
    textArea.id = 'lista-enlaces-input';
    textArea.placeholder = 'https://ejemplo.com/pagina1\nhttps://ejemplo.com/pagina2';
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    const validarButton = document.createElement('button');
    validarButton.id = 'cargar-enlaces-validar-button';
    validarButton.textContent = 'Validar';
    const cancelarButton = document.createElement('button');
    cancelarButton.id = 'cargar-enlaces-cancelar-button';
    cancelarButton.textContent = 'Cancelar';

    // Establecer el comportamiento de los botones
    validarButton.addEventListener('click', () => {
        const rawInput = textArea.value;
        const links = rawInput
            .split('\n')
            .map(link => link.trim())
            .filter(link => link !== '');

        if (links.length > 0) {
            cargarEnlaces(links); // Llamar a la función cargarEnlaces con la lista
        } else {
            alert('No se ingresaron enlaces válidos.');
            overlayInput.style.display = 'none';
        }
    });

    cancelarButton.addEventListener('click', () => {
        overlayInput.style.display = 'none'; // Ocultar el overlay al cancelar
    });

    // Ensamblar la interfaz del overlay
    container.appendChild(header);
    container.appendChild(textArea);
    buttonContainer.appendChild(validarButton);
    buttonContainer.appendChild(cancelarButton);
    container.appendChild(buttonContainer);
    overlayInput.appendChild(container);
    document.body.appendChild(overlayInput);

})();

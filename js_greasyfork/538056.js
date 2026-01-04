// ==UserScript==
// @name         Script de Encuestas Automaticas de la Evaluacion Docente UAN 2025
// @namespace    https://github.com/HectorUwO
// @version      1.0.1 // Incremento de versión por cambio de metadatos
// @description  Abre encuestas y selecciona automáticamente la primera opción. Espera la acción del usuario para terminar/salir y abre la encuesta siguiente.
// @author       HectorUwO
// @match        https://alumnos.piida.uan.mx/evaluacion-docente/unidades*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538056/Script%20de%20Encuestas%20Automaticas%20de%20la%20Evaluacion%20Docente%20UAN%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/538056/Script%20de%20Encuestas%20Automaticas%20de%20la%20Evaluacion%20Docente%20UAN%202025.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function esperarElemento(selector, timeout = 10000, raiz = document) {
        const inicio = Date.now();
        while (Date.now() - inicio < timeout) {
            const elemento = raiz.querySelector(selector);
            if (elemento) {
                await delay(150);
                return elemento;
            }
            await delay(200);
        }
        console.warn(`[Script] Elemento no encontrado después de ${timeout}ms: ${selector}`);
        return null;
    }

    async function esperarQueElementoDesaparezca(selector, timeout = 15000, raiz = document) {
        const inicio = Date.now();
        while (Date.now() - inicio < timeout) {
            if (!raiz.querySelector(selector)) {
                await delay(200);
                return true;
            }
            await delay(500);
        }
        console.warn(`[Script] Elemento ${selector} todavía presente después de ${timeout}ms. (Esperando acción del usuario)`);
        return false;
    }

    async function responderEncuestas() {
        console.log("[Script] Iniciando proceso de respuesta de encuestas...");
        const filas = document.querySelectorAll('tr.el-table__row');

        if (filas.length === 0) {
            console.log("[Script] No se encontraron filas de encuestas.");
            return;
        }
        console.log(`[Script] Se encontraron ${filas.length} filas de encuestas.`);

        for (const [index, fila] of filas.entries()) {
            console.log(`\n[Script] Procesando fila ${index + 1}/${filas.length}...`);

            const celdaCol4 = fila.querySelector('td.el-table_1_column_4');
            if (!celdaCol4) {
                console.warn("[Script] No se encontró la celda 'el-table_1_column_4' en la fila:", fila);
                continue;
            }

            const enlace = celdaCol4.querySelector('a');
            if (!enlace) {
                console.warn("[Script] No se encontró el enlace (<a>) en la celda:", celdaCol4);
                continue;
            }

            enlace.click();
            console.log("[Script] Enlace clickeado, esperando modal...");

            const modalActivoSelector = 'div.modal.show[role="dialog"]';
            const modalActivo = await esperarElemento(modalActivoSelector);

            if (!modalActivo) {
                console.warn("[Script] Modal no encontrado o no apareció a tiempo. Saltando a la siguiente.");
                const botonCerrarFallback = document.querySelector('.modal.show button.close, .modal.show [data-dismiss="modal"]');
                if (botonCerrarFallback) botonCerrarFallback.click();
                await esperarQueElementoDesaparezca(modalActivoSelector, 5000);
                continue;
            }
            console.log("[Script] Modal detectado.");

            const cuerpoDelModal = modalActivo.querySelector('.modal-body');
            if (!cuerpoDelModal) {
                console.warn("[Script] Cuerpo del modal (.modal-body) no encontrado dentro del modal activo. Saltando a la siguiente.");
                const botonCerrarFallback = modalActivo.querySelector('button.close, [data-dismiss="modal"]');
                if (botonCerrarFallback) botonCerrarFallback.click();
                await esperarQueElementoDesaparezca(modalActivoSelector, 5000);
                continue;
            }

            await delay(700);

            const gruposDeRadio = cuerpoDelModal.querySelectorAll('div[role="radiogroup"].el-radio-group');
            if (gruposDeRadio.length === 0) {
                console.warn("[Script] No se encontraron grupos de radio (el-radio-group) en el modal.");
            } else {
                console.log(`[Script] Se encontraron ${gruposDeRadio.length} grupos de radio.`);
            }

            gruposDeRadio.forEach((grupo, i) => {
                const primeraOpcionInner = grupo.querySelector('label.el-radio .el-radio__inner');
                if (primeraOpcionInner) {
                    primeraOpcionInner.click();
                    console.log(`[Script] Opción 1 seleccionada en grupo ${i + 1}.`);
                } else {
                    console.warn(`[Script] No se encontró la primera opción '.el-radio__inner' en el grupo ${i + 1}:`, grupo);
                }
            });

            console.log("[Script] Selección de opciones automática completada. POR FAVOR, HAZ CLIC EN 'TERMINAR EVALUACIÓN' O 'SALIR' EN EL MODAL.");

            const modalCerrado = await esperarQueElementoDesaparezca(modalActivoSelector);
            if (modalCerrado) {
                console.log("[Script] Modal cerrado por el usuario. Pasando a la siguiente encuesta.");
            } else {
                console.warn("[Script] ¡Atención! El modal no se cerró a tiempo. Esto podría indicar un problema o que el usuario está tardando mucho.");
            }
            await delay(1500);
        }
        console.log("[Script] Proceso de respuesta de encuestas completado.");
    }

    window.addEventListener('load', () => {
        console.log("[Script] Página cargada. Iniciando script de encuestas en 3 segundos...");
        setTimeout(responderEncuestas, 3000);
    });

})();
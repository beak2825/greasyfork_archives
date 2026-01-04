// ==UserScript==
// @name         Modificar datos académicos SIA UNAL (completo)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Modifica texto y elimina secciones del SIA UNAL: promedios, estado bloqueado, causas de bloqueo, asignaturas, etc.
// @author       Tú
// @match        https://sia.unal.edu.co/ServiciosApp/faces/inicioServicios*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540947/Modificar%20datos%20acad%C3%A9micos%20SIA%20UNAL%20%28completo%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540947/Modificar%20datos%20acad%C3%A9micos%20SIA%20UNAL%20%28completo%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const aplicarCambios = setInterval(() => {
        let cambios = false;

        // 1. Cambiar periodo académico
        const spansPeriodo = document.querySelectorAll('span.promedios-anio');
        if (spansPeriodo.length > 0) {
            spansPeriodo.forEach(span => {
                span.textContent = '2024-2S';
            });
            cambios = true;
        }

        // 2. Cambiar promedio acumulado
        const spansPromedio = document.querySelectorAll('span.promedios-valor');
        spansPromedio.forEach(span => {
            if (span.textContent.includes('2.6')) {
                span.textContent = span.textContent.replace('2.6', '3.6');
                cambios = true;
            }
        });

        // 3. Eliminar "ESTADO BLOQUEADO"
        const estados = document.querySelectorAll('span.estado-expediente');
        estados.forEach(span => {
            if (span.textContent.includes('ESTADO BLOQUEADO')) {
                span.remove();
                cambios = true;
            }
        });

        // 4. Eliminar "Causas de bloqueo"
        const causas = document.querySelectorAll('span.salto');
        causas.forEach(span => {
            if (span.textContent.includes('Causas de bloqueo')) {
                span.remove();
                cambios = true;
            }
        });

        // 5. Eliminar bloque de asignaturas
        const asignaturas = document.querySelector('#pt1\\:r1\\:0\\:pgl62');
        if (asignaturas) {
            asignaturas.remove();
            cambios = true;
        }

        // Detener intervalo si ya aplicó cambios
        if (cambios) {
            clearInterval(aplicarCambios);
        }

    }, 500); // Intenta cada 500ms
})();
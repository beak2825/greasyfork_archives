// ==UserScript==
// @name         MZ - Ocultar datos desfasados
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Oculta Peso, Altura, Pie y Temporada de nacimiento en toda la web de ManagerZone sin afectar otros datos
// @license      oz
// @match        https://www.managerzone.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540770/MZ%20-%20Ocultar%20datos%20desfasados.user.js
// @updateURL https://update.greasyfork.org/scripts/540770/MZ%20-%20Ocultar%20datos%20desfasados.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function ocultarDatos() {
        document.querySelectorAll("td, div, span, p, strong, b").forEach(el => {
            let texto = el.textContent.trim().toLowerCase();

            if (["peso:", "altura:", "pie:", "nacido", "temporada de nacimiento"].some(dato => texto.startsWith(dato))) {
                el.style.display = "none";

                let siguienteElemento = el.nextElementSibling;
                if (siguienteElemento) {
                    siguienteElemento.style.display = "none"; // Oculta el valor asociado (ej: "65 kg", "178 cm", "Zurdo")
                }
            }
        });
    }

    // Ejecutar al inicio
    ocultarDatos();

    // Detectar cambios dinámicos y volver a aplicar
    const observer = new MutationObserver(() => ocultarDatos());
    observer.observe(document.body, { childList: true, subtree: true });

})();

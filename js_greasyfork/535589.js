// ==UserScript==
// @name         Cinecalidad Auto Modificar enlaces de acortalink (con Base64 encode)
// @namespace    https://cinecalidad
// @version      1.5
// @description  Cambia los enlaces de "s.php?i=" a "r.php?l=" en acortalink.me en Cinecalidad, codificando el valor en Base64 antes de insertarlo en "l". Maneja tanto URLs correctas como mal formadas.
// @author       IgnaV
// @license      MIT
// @include      *://*.cinecalidad.*/ver-pelicula/*
// @include      *://*.cinecalidad.*/ver-el-episodio/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cinecalidad.ec
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535589/Cinecalidad%20Auto%20Modificar%20enlaces%20de%20acortalink%20%28con%20Base64%20encode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535589/Cinecalidad%20Auto%20Modificar%20enlaces%20de%20acortalink%20%28con%20Base64%20encode%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.self !== window.top) return;

    function modificarEnlaces() {
        console.log("🚀 Buscando enlaces en la página...");

        // Seleccionar tanto enlaces bien formados como mal formados
        let links = document.querySelectorAll("a[href*='s.php?i='], a[href*='s.php/?i=']");

        links.forEach(link => {
            try {
                let urlString = link.href;

                // Corregir URLs mal formadas (s.php/?i= → s.php?i=)
                urlString = urlString.replace('s.php/?i=', 's.php?i=');

                // Extraer el parámetro i
                let url;
                try {
                    url = new URL(urlString);
                } catch (e) {
                    // Si falla la creación de URL, intentar extraer manualmente
                    const match = urlString.match(/[?&]i=([^&]+)/);
                    if (match && match[1]) {
                        const domainMatch = urlString.match(/https?:\/\/[^\/]+/);
                        const domain = domainMatch ? domainMatch[0] : 'https://acortalink.me';
                        url = new URL(`${domain}/s.php?i=${match[1]}`);
                    } else {
                        console.error("❌ No se pudo extraer el parámetro i de:", urlString);
                        return;
                    }
                }

                let paramI = url.searchParams.get("i");

                if (paramI) {
                    let encodedParam;
                    try {
                        encodedParam = btoa(paramI);
                    } catch (e) {
                        console.error("❌ Error al codificar en Base64:", e);
                        return;
                    }

                    let newUrl = `https://acortalink.me/r.php?l=${encodedParam}`;

                    if (link.href !== newUrl) { // Evita cambiar enlaces repetidamente
                        console.log(`🔗 Modificando: ${link.href} → ${newUrl}`);
                        link.href = newUrl;
                    }
                }
            } catch (error) {
                console.error("❌ Error procesando un enlace:", error);
            }
        });

        console.log("✅ Enlaces modificados correctamente.");
    }

    // Ejecutar cuando la página cargue
    window.addEventListener("load", modificarEnlaces);

    // Monitorear cambios dinámicos en la página (para sitios con AJAX o cambios de DOM)
    const observer = new MutationObserver(modificarEnlaces);
    observer.observe(document.body, { childList: true, subtree: true });

})();
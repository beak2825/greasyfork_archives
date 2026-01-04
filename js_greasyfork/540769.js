// ==UserScript==
// @name         MZ - Cambiar imagen de estadio
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Reemplaza la imagen del estadio en ManagerZone solo si es "Arcángel"
// @license      oz
// @match        https://www.managerzone.com/?p=team
// @match        https://www.managerzone.com/?p=stadium
// @match        https://www.managerzone.com/?p=match&sub=result&mid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540769/MZ%20-%20Cambiar%20imagen%20de%20estadio.user.js
// @updateURL https://update.greasyfork.org/scripts/540769/MZ%20-%20Cambiar%20imagen%20de%20estadio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL de la imagen personalizada del estadio
    const nuevaImagen = "https://s3.abcstatics.com/abc/www/multimedia/espana/2024/08/20/cordobacf-estadio-arcangel-RjFpGGQUih7bNOBIXE8CGlL-1200x840@diario_abc.jpg";

    function cambiarImagenEstadio() {
        // Página del equipo
        if (window.location.href.includes("?p=team")) {
            document.querySelectorAll('div[style*="background-image"]').forEach(div => {
                if (div.style.backgroundImage.includes("img/soccer/stadium/basic/")) {
                    div.style.backgroundImage = `url("${nuevaImagen}")`;
                }
            });
        }

        // Página del estadio
        if (window.location.href.includes("?p=stadium")) {
            document.querySelectorAll('img.stadium-image').forEach(img => {
                if (img.src.includes("img/soccer/stadium/basic/")) {
                    img.src = nuevaImagen;
                }
            });
        }

        // Página de resultados (solo si el estadio es "Arcángel")
        if (window.location.href.includes("?p=match&sub=result&mid=")) {
            document.querySelectorAll('strong[style="display: block; text-align: center"]').forEach(strong => {
                if (strong.textContent.trim().toLowerCase() === "arcángel") {
                    let img = strong.parentElement.querySelector('img.stadium-image');
                    let div = strong.parentElement.querySelector('div[style*="background-image"]');

                    // Si es una imagen <img>, cambiar la src
                    if (img && img.src.includes("img/soccer/stadium/basic/")) {
                        img.src = nuevaImagen;
                    }

                    // Si es un div con background-image, cambiar el fondo
                    if (div && div.style.backgroundImage.includes("img/soccer/stadium/basic/")) {
                        div.style.backgroundImage = `url("${nuevaImagen}")`;
                    }
                }
            });
        }
    }

    // Ejecutar la función al inicio
    cambiarImagenEstadio();

    // Observar cambios dinámicos en la página
    const observer = new MutationObserver(() => cambiarImagenEstadio());
    observer.observe(document.body, { childList: true, subtree: true });

})();

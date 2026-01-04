// ==UserScript==
// @name         MZ - Página Equipo Personalizada Ampliada
// @namespace    https://managerzone.com/
// @version      1.8
// @description  Ajusta la sección de ligas del equipo con más espacio y banderas personalizadas. Arregla visibilidad de flechas.
// @license      oz
// @match        https://www.managerzone.com/?p=team
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540767/MZ%20-%20P%C3%A1gina%20Equipo%20Personalizada%20Ampliada.user.js
// @updateURL https://update.greasyfork.org/scripts/540767/MZ%20-%20P%C3%A1gina%20Equipo%20Personalizada%20Ampliada.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const orden = [
        "Liga:",
        "Liga Sub23:",
        "Liga Sub21:",
        "Liga Sub18:",
        "Liga Mundial:",
        "Liga Mundial Sub23:",
        "Liga Mundial Sub21:",
        "Liga Mundial Sub18:"
    ];

    // Inyectar estilos personalizados
    const style = document.createElement("style");
    style.innerHTML = `
        dl.dataList, dl.dataList dd {
            width: 350px !important;
        }

        dl.dataList dd {
            display: flex;
            align-items: center;
        }

        span.teamExpText.clippable {
            min-width: 190px !important;
            max-width: none !important;
            white-space: nowrap !important;
            overflow: visible !important;
            text-overflow: unset !important;
            display: inline-block !important;
        }

        /* Asegurar que las flechas sean visibles */
        img[src*="arrow_up.gif"],
        img[src*="arrow_right.gif"],
        img[src*="arrow_down.gif"] {
            display: inline !important;
            visibility: visible !important;
            opacity: 1 !important;
            width: auto !important;
            height: auto !important;
        }
    `;
    document.head.appendChild(style);

    const crearBandera = (src, alt, title, margin = "") => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = alt;
        img.title = title;
        img.style.margin = margin;
        return img;
    };

    const banderaES = () => crearBandera("img/flags/s_es.gif", "España", "España");
    const banderaPT = () => crearBandera("https://www.managerzone.com/img/flags/s_pt.gif", "Portugal", "Portugal", "0 3px");
    const banderaMZ = () => crearBandera("https://www.managerzone.com/img/flags/s_dc.gif", "MZ World", "MZ World", "0 3px 0 0");

    const procesar = () => {
        const dds = Array.from(document.querySelectorAll("dd"));
        const ligas = dds.filter(dd => dd.querySelector("span.teamExpText"));

        const ligasInfo = [];

        ligas.forEach(dd => {
            const label = dd.querySelector("span.teamExpText");
            if (!label) return;

            const originalText = label.textContent.trim();
            let nuevoTexto = originalText;

            if (originalText === "Liga Mundial U23:") nuevoTexto = "Liga Mundial Sub23:";
            if (originalText === "Liga Mundial U21:") nuevoTexto = "Liga Mundial Sub21:";
            if (originalText === "Liga Mundial U18:") nuevoTexto = "Liga Mundial Sub18:";

            label.textContent = nuevoTexto;

            // Limpiar nombre de liga
            const link = dd.querySelector("a");
            if (link) {
                link.innerHTML = link.innerHTML
                    .replace(/Iberia - /, '')    // Quitar "Iberia - "
                    .replace(/Div/, 'div');      // Reemplazar "Div" por "div"
            }

            // Eliminar bandera antigua (si no es flecha)
            const imgs = dd.querySelectorAll("img");
            imgs.forEach(img => {
                if (!img.src.includes("arrow_")) {
                    img.remove();
                }
            });

            // Insertar nuevas banderas
            if (nuevoTexto === "Liga:") {
                label.insertAdjacentElement("afterend", crearBandera("img/flags/s_es.gif", "España", "España", "0 3px 0 0"));
            } else if (["Liga Sub23:", "Liga Sub21:", "Liga Sub18:"].includes(nuevoTexto)) {
                label.insertAdjacentElement("afterend", banderaPT());
                label.insertAdjacentElement("afterend", banderaES());
            } else if (nuevoTexto.startsWith("Liga Mundial")) {
                label.insertAdjacentElement("afterend", banderaMZ());
            }

            ligasInfo.push({ dd, labelText: nuevoTexto });
        });

        // Reordenar los elementos según el orden deseado
        ligasInfo.sort((a, b) => orden.indexOf(a.labelText) - orden.indexOf(b.labelText));
        const parent = ligasInfo[0]?.dd?.parentElement;
        ligasInfo.forEach(info => parent.appendChild(info.dd));
    };

    // Esperar a que el DOM esté listo
    const observer = new MutationObserver((_, obs) => {
        if (document.querySelector("span.teamExpText")) {
            obs.disconnect();
            procesar();
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();

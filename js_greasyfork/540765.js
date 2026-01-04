// ==UserScript==
// @name         MZ - Limpieza
// @namespace    https://managerzone.com/
// @version      1.8
// @description  Página de Equipo más limpia (y otras)
// @match        https://www.managerzone.com/*
// @license oz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540765/MZ%20-%20Limpieza.user.js
// @updateURL https://update.greasyfork.org/scripts/540765/MZ%20-%20Limpieza.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function eliminarBloqueSiEmpiezaCon(tituloBuscado) {
        const bloques = Array.from(document.querySelectorAll('div'));

        bloques.forEach(div => {
            const strong = div.querySelector('strong');
            if (!strong || strong.textContent.trim() !== tituloBuscado) return;

            const primerHijo = div.firstElementChild;
            const contieneTituloCorrecto =
                (primerHijo?.tagName === 'SPAN' && primerHijo.querySelector('strong')?.textContent.trim() === tituloBuscado) ||
                (primerHijo?.tagName === 'STRONG' && primerHijo.textContent.trim() === tituloBuscado);

            if (contieneTituloCorrecto) {
                div.remove();
            }
        });
    }

    function eliminarElementoPorId(id) {
        const el = document.getElementById(id);
        if (el) {
            el.remove();
            return true;
        }
        return false;
    }

    function reemplazarTextoStatsXente() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.nodeValue.includes("Stats Xente")) {
                node.nodeValue = node.nodeValue.replace(/Stats Xente/g, "Stats");
            }
        }
    }

    function eliminarElementos() {
        eliminarBloqueSiEmpiezaCon("Racha:");
        eliminarBloqueSiEmpiezaCon("Copa:");

        const eliminadoELO = eliminarElementoPorId("eloHistoryButton");
        const eliminadoTablaShowMenu = eliminarElementoPorId("showMenu");

        reemplazarTextoStatsXente();

        return eliminadoELO || eliminadoTablaShowMenu;
    }

    const observer = new MutationObserver(() => {
        eliminarElementos();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const interval = setInterval(() => {
        const eliminado = eliminarElementos();
        if (eliminado) {
            clearInterval(interval);
        }
    }, 500);

    window.addEventListener('load', () => {
        setTimeout(eliminarElementos, 1000);
    });
})();

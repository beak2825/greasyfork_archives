// ==UserScript==
// @name         Navegación rápida automática
// @namespace    https://wilhen-scripts.com
// @version      1.1
// @description  Automatiza el avance en páginas con pasos intermedios, detectando botones y temporizadores para continuar rápidamente. El usuario puede activar los dominios que desee.
// @author       Wilhen Gutierrez
// @match        *://*/*
// @grant        none
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABK0lEQVR4nO3XwQ3CMAwE0O7///Z1YjDkZKqZbi6aXUs84RxllgMZK/YJggULFixYMC9jgfC2m5jGXQ8pgf8DyQuADgAAqAPCCxIAArz6HP0BkBzzB4kiAAMnKwCjEAAcAIaSAAHBhBzAOAABuQJYAgOc6AAH4AGcC4HgNKAJBmACsDYBiADsDgBiAGsDMApYDcK+BBD8BMDUwKgVgMA/EAHAAa4DkDwGAHuAkg0WAGoAOB+QBqwGQAMbEAdzANAnjOAE5ABhzA7AAVmA0gA4cROjEAEqE2VQA9EwB6QFg9M1PV8y/0gtmtQ2RjsUkJpAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/545395/Navegaci%C3%B3n%20r%C3%A1pida%20autom%C3%A1tica.user.js
// @updateURL https://update.greasyfork.org/scripts/545395/Navegaci%C3%B3n%20r%C3%A1pida%20autom%C3%A1tica.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
     === CONFIGURACIÓN DEL USUARIO ===
     Añade aquí los dominios donde quieras que el script se active.
     Ejemplo:
         const sitios = [
             "tradicionesde.net",
             "ejemplo.com"
         ];
     Por defecto está vacío para cumplir con políticas de publicación.
    */
    const sitios = [
        // "tradicionesde.net"
    ];

    function dominioPermitido() {
        return sitios.some(d => window.location.hostname.includes(d));
    }

    if (!dominioPermitido()) return;

    const observer = new MutationObserver(() => {
        const boton = document.querySelector(
            'a.continuar, a.siguiente, button.continuar, button.siguiente, .btn, [id*="continuar"], [class*="continuar"]'
        );
        if (boton) {
            console.log("[Navegación Rápida] Botón detectado, avanzando...");
            boton.click();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const enlace = document.querySelector('a[href]');
    if (enlace && enlace.hostname !== window.location.hostname) {
        window.location.href = enlace.href;
    }
})();

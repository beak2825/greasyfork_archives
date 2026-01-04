// ==UserScript==
// @name         Drawaria Pincel Transparente con UI (Simulador)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Añade pincel con transparencia a Drawaria.online y botón para activar/desactivar y ajustar transparencia.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/543832/Drawaria%20Pincel%20Transparente%20con%20UI%20%28Simulador%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543832/Drawaria%20Pincel%20Transparente%20con%20UI%20%28Simulador%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Drawaria Transparency Script] Script cargado. Intentando inicializar...");

    // --- Crear UI flotante ---
    function createControlPanel() {
        const wrapper = document.createElement('div');
        wrapper.id = 'transparentBrushControlPanel'; // Añadimos un ID para identificarlo
        wrapper.style.position = 'fixed';
        wrapper.style.top = '30px';
        wrapper.style.right = '30px';
        wrapper.style.zIndex = '9999';
        wrapper.style.background = '#222c';
        wrapper.style.padding = '13px 20px 10px 20px';
        wrapper.style.borderRadius = '10px';
        wrapper.style.fontFamily = 'sans-serif';
        wrapper.style.color = '#fff';
        wrapper.style.userSelect = 'none';
        wrapper.style.boxShadow = '0 1px 6px #0008';
        wrapper.style.cursor = 'grab'; // Indica que se puede arrastrar

        const title = document.createElement('h3');
        title.textContent = 'Pincel Transparente';
        title.style.margin = '0 0 10px 0';
        title.style.textAlign = 'center';
        title.style.fontSize = '1.1em';
        title.style.color = '#ccc';

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Pincel: OFF';
        toggleBtn.style.margin = '0 0 8px 0';
        toggleBtn.style.width = '100%';
        toggleBtn.style.padding = '7px 0';
        toggleBtn.style.background = '#492';
        toggleBtn.style.border = 'none';
        toggleBtn.style.borderRadius = '7px';
        toggleBtn.style.color = '#fff';
        toggleBtn.style.fontWeight = 'bold';
        toggleBtn.style.cursor = 'pointer';

        const label = document.createElement('label');
        label.textContent = 'Opacidad:';
        label.style.marginRight = '8px';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0.05';
        slider.max = '1';
        slider.step = '0.01';
        slider.value = '0.3';
        slider.style.width = '70px';
        slider.style.verticalAlign = 'middle'; // Alinea con el texto

        const percent = document.createElement('span');
        percent.textContent = '30%';
        percent.style.display = 'inline-block';
        percent.style.minWidth = '35px'; // Evita que se mueva al cambiar el valor
        percent.style.textAlign = 'right';

        wrapper.appendChild(title);
        wrapper.appendChild(toggleBtn);
        wrapper.appendChild(document.createElement('br'));
        wrapper.appendChild(label);
        wrapper.appendChild(slider);
        wrapper.appendChild(percent);

        document.body.appendChild(wrapper);

        console.log("[Drawaria Transparency Script] Panel de control creado.");
        return {wrapper, toggleBtn, slider, percent};
    }

    // --- Funcionalidad de Arrastrar el Panel ---
    function makeDraggable(element) {
        let isDragging = false;
        let offsetX, offsetY;

        element.addEventListener('mousedown', (e) => {
            // Solo arrastra si el clic no es en un botón o slider
            if (e.target === element || e.target.tagName === 'H3') {
                isDragging = true;
                offsetX = e.clientX - element.getBoundingClientRect().left;
                offsetY = e.clientY - element.getBoundingClientRect().top;
                element.style.cursor = 'grabbing';
                e.preventDefault(); // Evita la selección de texto
                console.log("[Drawaria Transparency Script] Empezando a arrastrar.");
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;

            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
            element.style.right = 'auto'; // Desactiva right para que left tome control
            element.style.bottom = 'auto'; // Desactiva bottom

            // Limitar el movimiento para que no se salga de la ventana
            const panelRect = element.getBoundingClientRect();
            if (panelRect.left < 0) element.style.left = '0px';
            if (panelRect.top < 0) element.style.top = '0px';
            if (panelRect.right > window.innerWidth) element.style.left = `${window.innerWidth - panelRect.width}px`;
            if (panelRect.bottom > window.innerHeight) element.style.top = `${window.innerHeight - panelRect.height}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'grab';
                console.log("[Drawaria Transparency Script] Terminando de arrastrar.");
            }
        });
    }

    // --- MAIN ---
    let transparentMode = false;
    let customAlpha = 0.3; // Valor inicial
    let ctx;

    // UI
    const {wrapper, toggleBtn, slider, percent} = createControlPanel();
    makeDraggable(wrapper); // Hacer el panel arrastrable

    toggleBtn.addEventListener('click', function() {
        transparentMode = !transparentMode;
        toggleBtn.textContent = transparentMode ? 'Pincel: ON' : 'Pincel: OFF';
        toggleBtn.style.background = transparentMode ? '#2a5' : '#492';
        console.log(`[Drawaria Transparency Script] Pincel transparente: ${transparentMode ? 'ON' : 'OFF'}`);
    });

    slider.oninput = function() {
        customAlpha = parseFloat(slider.value);
        percent.textContent = Math.round(customAlpha*100) + "%";
        console.log(`[Drawaria Transparency Script] Opacidad ajustada a: ${customAlpha}`);
    };

    // Espía el contexto para manipular la opacidad
    function hookBrush() {
        const canvas = document.querySelector('canvas');
        if (!canvas) {
            console.log("[Drawaria Transparency Script] No se encontró el canvas. Reintentando...");
            return false;
        }
        if (!canvas.getContext) {
            console.log("[Drawaria Transparency Script] El canvas no soporta getContext. Reintentando...");
            return false;
        }

        ctx = canvas.getContext('2d');
        if (!ctx) {
            console.log("[Drawaria Transparency Script] No se pudo obtener el contexto 2D. Reintentando...");
            return false;
        }
        if (ctx._pincelTransparenteHooked) {
            console.log("[Drawaria Transparency Script] Contexto ya enganchado.");
            return true;
        }

        // Guardamos las referencias originales a los métodos
        const origStroke = ctx.stroke;
        const origFill = ctx.fill;

        // Sobrescribimos stroke
        ctx.stroke = function() {
            let prevAlpha = ctx.globalAlpha;
            if (transparentMode) {
                ctx.globalAlpha = customAlpha;
            }
            origStroke.apply(this, arguments); // Usamos 'this' para asegurar el contexto correcto
            ctx.globalAlpha = prevAlpha;
        };

        // Sobrescribimos fill
        ctx.fill = function() {
            let prevAlpha = ctx.globalAlpha;
            if (transparentMode) {
                ctx.globalAlpha = customAlpha;
            }
            origFill.apply(this, arguments); // Usamos 'this' para asegurar el contexto correcto
            ctx.globalAlpha = prevAlpha;
        };

        ctx._pincelTransparenteHooked = true; // Marca para evitar doble enganche
        console.log("[Drawaria Transparency Script] Canvas context enganchado exitosamente!");
        return true;
    }

    // Prueba hook cada segundo hasta éxito
    let tryTimes = 0;
    const maxRetries = 60; // Intentar durante 60 segundos
    function tryHook() {
        if (!hookBrush()) {
            tryTimes++;
            if (tryTimes < maxRetries) {
                setTimeout(tryHook, 1000);
            } else {
                console.error("[Drawaria Transparency Script] No se pudo enganchar el canvas después de varios intentos. Asegúrate de estar en Drawaria.online.");
            }
        }
    }

    // Esperar a que el DOM esté completamente cargado antes de intentar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryHook);
    } else {
        tryHook(); // Si ya está cargado, ejecutar inmediatamente
    }

})();
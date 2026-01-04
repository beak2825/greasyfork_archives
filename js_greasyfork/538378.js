// ==UserScript==
// @name         Drawaria Drawing Controls (Always Visible)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Forces Drawaria's drawing controls to be always visible.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538378/Drawaria%20Drawing%20Controls%20%28Always%20Visible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538378/Drawaria%20Drawing%20Controls%20%28Always%20Visible%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Inyectar CSS para forzar la visibilidad y funcionalidad ---
    // Usamos !important para anular cualquier estilo inline o de media query
    const style = document.createElement('style');
    style.innerHTML = `
        #drawcontrols {
            display: flex !important; /* Asegura que el contenedor principal sea visible */
            pointer-events: auto !important; /* Permite interacción con el ratón */
            opacity: 1 !important; /* Asegura que no sea transparente */
            /* Puedes ajustar la posición si se superpone con otros elementos
               Ejemplos: */
            /* bottom: 0 !important; */
            /* left: 50% !important; */
            /* transform: translateX(-50%) !important; */
            /* width: auto !important; */
        }

        /* Asegurar que los botones dentro de drawcontrols también sean visibles y funcionales */
        #drawcontrols .drawcontrols-button,
        #drawcontrols .drawcontrols-toolstoggle,
        #drawcontrols .drawcontrols-dialogbutton {
            display: flex !important; /* O flex si usan flexbox para alinear contenido */
            pointer-events: auto !important;
            opacity: 1 !important;
        }

        /* Anular estilos de "deshabilitado" que el juego pueda aplicar */
        #drawcontrols.drawcontrols-disabled,
        #drawcontrols .drawcontrols-button.drawcontrols-disabled {
            color: initial !important; /* Restablece el color normal */
            pointer-events: auto !important;
            opacity: 1 !important;
        }

        /* Asegurar que el canvas sea interactivo */
        #canvas {
            pointer-events: auto !important;
        }
    `;
    document.head.appendChild(style);

    // --- Lógica de dibujo local en el canvas ---
    const canvas = document.querySelector('#canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let drawing = false;
        let lastX = 0;
        let lastY = 0;

        // Establecer propiedades de dibujo iniciales (se actualizarán con los controles)
        ctx.strokeStyle = '#000000'; // Color de línea por defecto (negro)
        ctx.lineWidth = 5;           // Ancho de línea por defecto
        ctx.lineJoin = 'round';      // Tipo de unión de línea
        ctx.lineCap = 'round';       // Tipo de extremo de línea

        canvas.addEventListener('mousedown', (e) => {
            drawing = true;
            const rect = canvas.getBoundingClientRect();
            lastX = e.clientX - rect.left;
            lastY = e.clientY - rect.top;

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!drawing) return;

            const rect = canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;

            ctx.lineTo(currentX, currentY);
            ctx.stroke();

            lastX = currentX;
            lastY = currentY;
        });

        canvas.addEventListener('mouseup', () => {
            drawing = false;
            ctx.closePath();
        });

        canvas.addEventListener('mouseout', () => {
            if (drawing) {
                drawing = false;
                ctx.closePath();
            }
        });
    } else {
        console.warn("Drawaria Local Drawing Controls: Canvas element with ID 'canvas' not found.");
    }

    // --- Hacer que los controles de dibujo actualicen el contexto de dibujo LOCAL ---
    // Usamos MutationObserver para esperar a que jQuery esté disponible y los elementos del DOM se carguen.
    // También escuchamos los eventos click y input de los controles.
    const observer = new MutationObserver((mutations, obs) => {
        // Ejecutar solo si jQuery está cargado
        if (typeof jQuery === 'undefined') {
            return;
        }

        // Una vez que jQuery esté listo, podemos desconectar el observer si lo deseamos.
        // O lo mantenemos para capturar elementos que se puedan añadir dinámicamente.
        // Para este caso, lo mantendremos para mayor robustez con elementos dinámicos.

        const drawControls = jQuery('#drawcontrols');
        if (drawControls.length === 0) {
            return; // Los controles aún no están en el DOM
        }

        // 1. Deshabilitar cualquier clase de "deshabilitado" que el juego pueda añadir dinámicamente
        drawControls.removeClass('drawcontrols-disabled');
        drawControls.find('.drawcontrols-button').removeClass('drawcontrols-disabled');


        // 2. Capturar clics en los botones de color
        drawControls.off('click.userScriptColors', '.drawcontrols-color').on('click.userScriptColors', '.drawcontrols-color', function(e) {
            e.stopPropagation(); // Evita que el evento llegue a los manejadores del juego
            e.preventDefault();  // Previene cualquier acción por defecto (como cambiar el cursor real del juego)

            const color = jQuery(this).css('background-color');
            if (canvas && canvas.getContext) {
                canvas.getContext('2d').strokeStyle = color;
                console.log('Local drawing color changed to:', color);

                // Puedes añadir un feedback visual, como un borde al color seleccionado
                drawControls.find('.drawcontrols-color').css('border', '');
                jQuery(this).css('border', '2px solid white');
            }
        });

        // 3. Capturar cambios en el slider de ancho de línea
        drawControls.off('input.userScriptWidth', '#drawwidthrange').on('input.userScriptWidth', '#drawwidthrange', function(e) {
            e.stopPropagation();
            e.preventDefault();

            const rangeValue = parseFloat(jQuery(this).val());
            let lineWidth = 5; // Valor por defecto

            // Mapeo simple de los valores del rango a los tamaños del pincel de Drawaria
            // Basado en LINEWIDTHLIST=[5,12,45] en el JS del juego
            if (rangeValue <= 0.5) {
                lineWidth = 5;
            } else if (rangeValue <= 1.5) {
                lineWidth = 12;
            } else {
                lineWidth = 45;
            }

            if (canvas && canvas.getContext) {
                canvas.getContext('2d').lineWidth = lineWidth;
                console.log('Local drawing line width changed to:', lineWidth);
            }
        });

        // 4. Implementar la funcionalidad de la goma de borrar (Eraser)
        // El botón de goma de borrar tiene la clase drawcontrols-button y el ícono fas fa-eraser
        drawControls.off('click.userScriptEraser', '.drawcontrols-button .fas.fa-eraser').on('click.userScriptEraser', '.drawcontrols-button .fas.fa-eraser', function(e) {
            e.stopPropagation();
            e.preventDefault();

            if (canvas && canvas.getContext) {
                const currentCtx = canvas.getContext('2d');
                // Para borrar, podemos cambiar el color del trazo al color de fondo del canvas (blanco)
                currentCtx.strokeStyle = '#FFFFFF';
                // Opcional: ajustar el ancho de la goma para que se note la diferencia
                currentCtx.lineWidth = 20; // Un ancho mayor para la goma
                console.log('Local drawing set to Eraser mode (white color).');
            }
        });

        // 5. Implementar la funcionalidad de Limpiar todo (Clear All)
        // El botón de limpiar todo tiene la clase drawcontrols-button y el ícono fas fa-trash-alt
        drawControls.off('click.userScriptClear', '.drawcontrols-button .fas.fa-trash-alt').on('click.userScriptClear', '.drawcontrols-button .fas.fa-trash-alt', function(e) {
            e.stopPropagation();
            e.preventDefault();

            if (canvas && canvas.getContext) {
                const currentCtx = canvas.getContext('2d');
                currentCtx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar todo el canvas
                console.log('Local canvas cleared.');

                // Después de limpiar, restablecer el color a negro por defecto
                currentCtx.strokeStyle = '#000000';
                currentCtx.lineWidth = 5;
            }
        });

        // 6. Asegurar que los botones de toolstoggle (como el color picker o pressure settings) también sean visibles
        // Estos botones tienen la clase .drawcontrols-toolstoggle y .drawcontrols-dialogbutton
        drawControls.off('click.userScriptToggleTools', '.drawcontrols-toolstoggle, .drawcontrols-dialogbutton').on('click.userScriptToggleTools', '.drawcontrols-toolstoggle, .drawcontrols-dialogbutton', function(e) {
            // Permitimos la propagación para estos botones para que el juego pueda abrir sus modales/popups
            // Sin embargo, si quieres que *solo* sean visuales y no activen nada del juego,
            // puedes añadir e.stopPropagation() y e.preventDefault() aquí también.
            // Para "funcionales" en el sentido de que abran sus modales, no los bloqueamos.
            console.log('Tool toggle/dialog button clicked. Game\'s original handler might open a modal.');
        });


        // Desconectar el observer si ya hemos configurado todos los eventos principales.
        // Sin embargo, mantenerlo conectado puede ser útil si el juego reconstruye partes del DOM.
        // Para este script, lo dejaremos funcionando para que re-aplique los listeners si es necesario.
        // obs.disconnect();
    });

    // Iniciar el observer en el body para detectar cambios en el DOM
    observer.observe(document.body, { childList: true, subtree: true });

    // Forzar la remoción de la clase 'drawcontrols-disabled' en la carga inicial y cada vez que aparezca
    // (Útil si el juego añade la clase después de que se carga el script)
    window.addEventListener('load', () => {
        const drawControlsElement = document.querySelector('#drawcontrols');
        if (drawControlsElement) {
            drawControlsElement.classList.remove('drawcontrols-disabled');
        }
    });

    // Usar jQuery para asegurar que el 'drawcontrols' se muestre en cuanto se detecte.
    // Esto es un 'fallback' por si el observer no lo pilla a tiempo o si se usa jQuery en el juego.
    // Asegurarse de que jQuery esté cargado antes de intentar usarlo.
    if (typeof jQuery !== 'undefined') {
        jQuery(document).ready(function() {
            jQuery('#drawcontrols').css({
                'display': 'flex',
                'pointer-events': 'auto',
                'opacity': '1'
            }).removeClass('drawcontrols-disabled');
            jQuery('#drawcontrols').find('.drawcontrols-button').removeClass('drawcontrols-disabled');
            jQuery('#canvas').css('pointer-events', 'auto');
        });
    }

})();
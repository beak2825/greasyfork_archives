// ==UserScript==
// @name Split.COM AutoSpacer
// @namespace http://tampermonkey.net/
// @version 1.7
// @description Presiona espacio 9 veces instantáneamente
// @author Your Name
// @match *://*/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/523516/SplitCOM%20AutoSpacer.user.js
// @updateURL https://update.greasyfork.org/scripts/523516/SplitCOM%20AutoSpacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crear el menú flotante
    const menu = document.createElement('div');
    menu.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        z-index: 9999;
        user-select: none;
        cursor: move;
        transition: opacity 0.3s ease, box-shadow 0.3s ease;
        border: 2px solid #666;
    `;

    // Variables
    let activationKey = 'R';
    let isMenuVisible = true;
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Función para actualizar el menú
    function updateMenu() {
        menu.innerHTML = `
            <div style="text-align: center; padding: 5px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <div style="
                        background-color: #555;
                        padding: 3px 8px;
                        border-radius: 3px;
                        margin-bottom: 5px;
                        cursor: move;
                        width: 100%;
                        text-align: center;
                    ">
                        ↔️ Arrastra aquí para mover ↔️
                    </div>
                    <button id="toggleVisibility" style="
                        background: none;
                        border: none;
                        color: white;
                        cursor: pointer;
                        padding: 2px;
                        margin-left: 5px;
                    ">⛰︎⛴︎⛩︎</button>
                </div>
                <div style="font-weight: bold; margin-bottom: 5px;">Split.COM AutoSpacer</div>
                <div style="margin-bottom: 5px;">
                    Tecla actual: <button style="
                        background-color: #444;
                        border: 1px solid #666;
                        color: white;
                        padding: 2px 8px;
                        border-radius: 3px;
                        cursor: pointer;
                    ">[${activationKey}]</button>
                </div>
                <div style="font-size: 0.8em; color: #aaa;">Click en la tecla para cambiar</div>
            </div>`;

        const button = menu.querySelector('button:not(#toggleVisibility)');
        button.onclick = changeKey;

        const visibilityButton = menu.querySelector('#toggleVisibility');
        visibilityButton.onclick = (e) => {
            e.stopPropagation();
            isMenuVisible = !isMenuVisible;
            menu.style.opacity = isMenuVisible ? "1" : "0.2";
        };
    }

    // Función para simular espacios instantáneos
    function pressSpacesInstantly(x, y) {
        // Simular clic en la posición inicial
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y
        });
        document.elementFromPoint(x, y)?.dispatchEvent(clickEvent);

        // Presionar los 9 espacios instantáneamente
        for (let i = 0; i < 9; i++) {
            const event = new KeyboardEvent('keydown', {
                key: ' ',
                code: 'Space',
                keyCode: 32,
                which: 32,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);

            const upEvent = new KeyboardEvent('keyup', {
                key: ' ',
                code: 'Space',
                keyCode: 32,
                which: 32,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(upEvent);
        }
    }

    // Funciones para mover el menú
    function dragStart(e) {
        if (e.type === "mousedown") {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === menu || e.target.closest('div')) {
                isDragging = true;
                menu.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
                menu.style.opacity = '0.8';
            }
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            setTranslate(currentX, currentY, menu);
        }
    }

    function dragEnd() {
        isDragging = false;
        menu.style.boxShadow = 'none';
        menu.style.opacity = isMenuVisible ? '1' : '0.2';
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }

    // Inicializar
    updateMenu();
    document.body.appendChild(menu);

    // Eventos
    menu.addEventListener("mousedown", dragStart, false);
    document.addEventListener("mousemove", (event) => {
        if (isDragging) {
            drag(event);
        } else {
            mouseX = event.clientX;
            mouseY = event.clientY;
        }
    });
    document.addEventListener("mouseup", dragEnd, false);

    // Escuchar eventos de teclado
    document.addEventListener('keydown', function(event) {
        if (event.key.toUpperCase() === activationKey) {
            pressSpacesInstantly(mouseX, mouseY);
            event.preventDefault();
        }
    });

    // Función para cambiar la tecla
    function changeKey(e) {
        e.stopPropagation();
        const newKey = prompt('Ingresa la nueva tecla de activación:', activationKey);
        if (newKey && newKey.length === 1) {
            activationKey = newKey.toUpperCase();
            updateMenu();
            const confirmation = document.createElement('div');
            confirmation.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 15px;
                border-radius: 5px;
                font-family: Arial, sans-serif;
                z-index: 10000;
            `;
            confirmation.textContent = `¡Tecla cambiada a [${activationKey}]!`;
            document.body.appendChild(confirmation);
            setTimeout(() => confirmation.remove(), 2000);
        }
    }
})();
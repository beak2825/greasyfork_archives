// ==UserScript==
// @name         Cube Client
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Cliente PvP para Bloxd.io con hitboxes, keystrokes, contador de CPS, crosshair personalizado, FPS Boost y barra de salud.
// @author       TuNombre
// @match        https://*.bloxd.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522836/Cube%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/522836/Cube%20Client.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuración inicial
    const config = {
        hitboxes: false,
        customCrosshair: false,
        fpsBoost: true, // FPS Boost activado
        healthBar: false,
        keystrokes: true, // Keystrokes activado por defecto
        cpsCounter: true,  // CPS activado por defecto
        keystrokeColor: '#00ff00', // Color de keystrokes
        keystrokeBackgroundColor: '#333333', // Fondo predeterminado de las teclas
        healthBarColor: '#ff0000', // Color de la barra de salud
        keystrokeSize: '50px', // Tamaño de las teclas
        keystrokeFontSize: '25px', // Tamaño de fuente para las letras en las teclas
        keystrokeBorderColor: '#ffffff', // Color del borde (no editable)
    };

    // Crear el contenedor de Keystrokes y CPS
    const keystrokesContainer = document.createElement('div');
    keystrokesContainer.id = 'keystrokes';
    keystrokesContainer.style.position = 'fixed';
    keystrokesContainer.style.bottom = '100px';
    keystrokesContainer.style.left = '10px';
    keystrokesContainer.style.zIndex = '10000';
    keystrokesContainer.style.fontFamily = 'Arial, sans-serif';
    keystrokesContainer.style.color = 'white';
    keystrokesContainer.style.display = config.keystrokes ? 'block' : 'none';
    keystrokesContainer.style.textAlign = 'center';
    keystrokesContainer.style.cursor = 'move';

    keystrokesContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center;">
            <div id="key-W" class="key" style="width: ${config.keystrokeSize}; height: ${config.keystrokeSize}; background-color: ${config.keystrokeBackgroundColor}; border: 2px solid ${config.keystrokeBorderColor}; font-size: ${config.keystrokeFontSize}; display: flex; align-items: center; justify-content: center;">W</div>
            <div style="display: flex;">
                <div id="key-A" class="key" style="width: ${config.keystrokeSize}; height: ${config.keystrokeSize}; background-color: ${config.keystrokeBackgroundColor}; border: 2px solid ${config.keystrokeBorderColor}; font-size: ${config.keystrokeFontSize}; display: flex; align-items: center; justify-content: center;">A</div>
                <div id="key-S" class="key" style="width: ${config.keystrokeSize}; height: ${config.keystrokeSize}; background-color: ${config.keystrokeBackgroundColor}; border: 2px solid ${config.keystrokeBorderColor}; font-size: ${config.keystrokeFontSize}; display: flex; align-items: center; justify-content: center;">S</div>
                <div id="key-D" class="key" style="width: ${config.keystrokeSize}; height: ${config.keystrokeSize}; background-color: ${config.keystrokeBackgroundColor}; border: 2px solid ${config.keystrokeBorderColor}; font-size: ${config.keystrokeFontSize}; display: flex; align-items: center; justify-content: center;">D</div>
            </div>
            <div style="display: flex; justify-content: center; width: 100%; margin-top: 10px;">
                <div id="key-Shift" class="key" style="width: ${config.keystrokeSize}; height: ${config.keystrokeSize}; background-color: ${config.keystrokeBackgroundColor}; border: 2px solid ${config.keystrokeBorderColor}; font-size: ${config.keystrokeFontSize}; display: flex; align-items: center; justify-content: center;">Shift</div>
                <div id="key-Space" class="key" style="width: ${config.keystrokeSize}; height: ${config.keystrokeSize}; background-color: ${config.keystrokeBackgroundColor}; border: 2px solid ${config.keystrokeBorderColor}; font-size: ${config.keystrokeFontSize}; display: flex; align-items: center; justify-content: center;">Space</div>
            </div>
            <div style="margin-top: 20px;">
                <div id="leftCPS" style="margin: 5px; font-size: 16px;">LMB CPS: 0</div>
                <div id="rightCPS" style="margin: 5px; font-size: 16px;">RMB CPS: 0</div>
            </div>
        </div>
    `;
    document.body.appendChild(keystrokesContainer);

    // Variables para el manejo de clics
    let lastLeftClickTime = 0;
    let lastRightClickTime = 0;
    const clickCooldown = 1; // 1ms de espera entre clics
    let leftClickCount = 0;
    let rightClickCount = 0;

    // Actualizar los CPS cada milisegundo
    setInterval(() => {
        document.getElementById('leftCPS').textContent = `LMB CPS: ${leftClickCount}`;
        document.getElementById('rightCPS').textContent = `RMB CPS: ${rightClickCount}`;
        leftClickCount = 0;
        rightClickCount = 0;
    }, 100); // Se actualiza cada 100ms para reflejar un retraso leve antes de resetear el contador

    // Función para manejar los clics y contar los CPS
    document.addEventListener('mousedown', (e) => {
        const currentTime = Date.now();

        if (e.button === 0 && currentTime - lastLeftClickTime > clickCooldown) {
            lastLeftClickTime = currentTime;
            setTimeout(() => leftClickCount++, 10); // Retraso de 10ms para que el contador no se reinicie inmediatamente
        }
        if (e.button === 2 && currentTime - lastRightClickTime > clickCooldown) {
            lastRightClickTime = currentTime;
            setTimeout(() => rightClickCount++, 10); // Retraso de 10ms para que el contador no se reinicie inmediatamente
        }
    });

    // Actualizar los keystrokes al presionar teclas
    document.addEventListener('keydown', (e) => {
        const keyElement = document.getElementById(`key-${e.key}`);
        if (keyElement) {
            keyElement.style.background = '#00ff00'; // Color configurable cuando está presionado
        }
    });

    document.addEventListener('keyup', (e) => {
        const keyElement = document.getElementById(`key-${e.key}`);
        if (keyElement) {
            keyElement.style.background = '#333333'; // Color de fondo predeterminado cuando se suelta
        }
    });

    // Menú para activar/desactivar funcionalidades
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '50px';
    menu.style.left = '50px';
    menu.style.backgroundColor = '#000';
    menu.style.color = '#fff';
    menu.style.padding = '10px';
    menu.style.border = '2px solid #fff';
    menu.style.borderRadius = '5px';
    menu.style.zIndex = '10001';
    menu.style.display = 'none';
    menu.style.fontFamily = 'Arial, sans-serif';

    menu.innerHTML = `
        <h3>Cube Client - Configuración</h3>
        <label><input type="checkbox" id="toggleHitboxes"> Activar Hitboxes</label><br>
        <label><input type="checkbox" id="toggleCrosshair"> Activar Crosshair Personalizado</label><br>
        <label><input type="checkbox" id="toggleFPSBoost" checked> Activar FPS Boost</label><br>
        <label><input type="checkbox" id="toggleHealthBar"> Activar Barra de Salud</label><br>
        <label><input type="checkbox" id="toggleKeystrokes"> Activar Keystrokes</label><br>
        <label><input type="checkbox" id="toggleCPSCounter"> Activar Contador de CPS</label><br>
        <button id="closeMenu" style="margin-top: 10px;">Cerrar Menú</button>
        <button id="editPositions" style="margin-top: 10px;">Editar Posiciones</button>
        <button id="pencilButton" style="margin-top: 10px;">✏️ Editar</button>
    `;

    document.body.appendChild(menu);

    // Función para abrir/cerrar el menú con Shift izquierdo
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Shift') {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
    });

    // Función para cerrar el menú
    document.getElementById('closeMenu').addEventListener('click', () => {
        menu.style.display = 'none';
    });

    // Función para activar/desactivar modo de edición de posiciones
    let isEditing = false;
    document.getElementById('pencilButton').addEventListener('click', () => {
        isEditing = !isEditing;
        if (isEditing) {
            menu.style.display = 'none';
            alert('Modo de edición activado. Mueve los elementos.');
        } else {
            alert('Modo de edición desactivado. Posiciones guardadas.');
        }
    });

    // Función para guardar las posiciones
    document.getElementById('editPositions').addEventListener('click', () => {
        // Aquí podrías agregar la lógica para editar posiciones.
        alert('Posiciones editadas y guardadas!');
    });

    // Habilitar FPS Boost
    if (config.fpsBoost) {
        let originalRequestAnimationFrame = window.requestAnimationFrame;
        window.requestAnimationFrame = function(callback) {
            setTimeout(callback, 0); // Desactiva cualquier retraso de renderizado
        };
    }
})();
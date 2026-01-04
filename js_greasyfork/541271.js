// ==UserScript==
// @name         MooMoo.io Purple Health + Night Mode
// @version      1.1
// @description  Light purple health bars + toggleable night mode. Client-side only.
// @author       Im_Troller
// @match        *://*.moomoo.io/*
// @grant        none
// @namespace    https://greasyfork.org/users/721571
// @downloadURL https://update.greasyfork.org/scripts/541271/MooMooio%20Purple%20Health%20%2B%20Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/541271/MooMooio%20Purple%20Health%20%2B%20Night%20Mode.meta.js
// ==/UserScript==

// Configuración inicial
const LIGHT_PURPLE = "#CBC3E3";
const NIGHT_MODE_BG = "rgba(10, 10, 20, 0.7)";
let nightModeEnabled = false;

// Aplicar barras de salud moradas
let replaceInterval = setInterval(() => {
    if (CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = ((oldFunc) => function() { 
            if (this.fillStyle == "#8ecc51") this.fillStyle = LIGHT_PURPLE;
            return oldFunc.call(this, ...arguments); 
        })(CanvasRenderingContext2D.prototype.roundRect);
        clearInterval(replaceInterval);
    }
}, 10);

// Crear menú UI
function createMenu() {
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '10px';
    menu.style.left = '10px';
    menu.style.zIndex = '9999';
    menu.style.padding = '8px';
    menu.style.background = 'rgba(0,0,0,0.5)';
    menu.style.borderRadius = '5px';
    menu.style.color = 'white';
    menu.style.fontFamily = 'Arial, sans-serif';
    menu.style.fontSize = '14px';
    
    const title = document.createElement('div');
    title.textContent = 'Im_Troller Mods';
    title.style.marginBottom = '5px';
    title.style.fontWeight = 'bold';
    
    const nightModeBtn = document.createElement('button');
    nightModeBtn.textContent = 'Night Mode: OFF';
    nightModeBtn.style.padding = '3px 6px';
    nightModeBtn.style.cursor = 'pointer';
    
    nightModeBtn.onclick = function() {
        nightModeEnabled = !nightModeEnabled;
        nightModeBtn.textContent = `Night Mode: ${nightModeEnabled ? 'ON' : 'OFF'}`;
        document.body.style.backgroundColor = nightModeEnabled ? NIGHT_MODE_BG : '';
    };
    
    menu.appendChild(title);
    menu.appendChild(nightModeBtn);
    document.body.appendChild(menu);
}

// Esperar a que el cuerpo del juego cargue
const bodyObserver = new MutationObserver(() => {
    if (document.body) {
        createMenu();
        bodyObserver.disconnect();
    }
});
bodyObserver.observe(document.documentElement, { childList: true });
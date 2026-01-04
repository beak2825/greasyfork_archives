// ==UserScript==
// @name         Modo Nocturno Automático para Roblox
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Activa automáticamente un tema oscuro en Roblox si es de noche (20:00 - 06:00)
// @author       Tu Nombre
// @match        *://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514210/Modo%20Nocturno%20Autom%C3%A1tico%20para%20Roblox.user.js
// @updateURL https://update.greasyfork.org/scripts/514210/Modo%20Nocturno%20Autom%C3%A1tico%20para%20Roblox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configurar la hora de inicio y fin del modo nocturno
    const startHour = 20; // 20:00 (8:00 PM)
    const endHour = 6;    // 06:00 (6:00 AM)
    
    // Obtener la hora actual
    const currentHour = new Date().getHours();
    
    // Aplicar modo nocturno si es de noche
    if (currentHour >= startHour || currentHour < endHour) {
        // Estilo para el modo nocturno
        const nightModeStyles = `
            body, .navbar, .container, .section { background-color: #1e1e1e !important; color: #d4d4d4 !important; }
            a, .text-link { color: #4e9aef !important; }
            .navbar { background-color: #333 !important; }
            .content { background-color: #2b2b2b !important; }
            .card, .tile { background-color: #3a3a3a !important; border-color: #555 !important; }
        `;
        
        // Crear una hoja de estilo e insertarla en la página
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = nightModeStyles;
        document.head.appendChild(styleSheet);

        // Mostrar mensaje en la consola
        console.log("Modo nocturno activado en Roblox.");
    }
})();

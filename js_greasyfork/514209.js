// ==UserScript==
// @name         Estilo Personalizado para Roblox
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Cambia el fondo de la página de inicio de Roblox y oculta algunos elementos
// @author       Tu Nombre
// @match        *://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514209/Estilo%20Personalizado%20para%20Roblox.user.js
// @updateURL https://update.greasyfork.org/scripts/514209/Estilo%20Personalizado%20para%20Roblox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cambia el fondo de la página principal a un color suave
    document.body.style.backgroundColor = "#f0f8ff";

    // Oculta la barra de anuncios si existe
    const adsBanner = document.querySelector(".ad-banner");
    if (adsBanner) {
        adsBanner.style.display = "none";
    }

    // Modifica el color de la barra de navegación superior
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        navbar.style.backgroundColor = "#333";
        navbar.style.color = "#fff";
    }
})();
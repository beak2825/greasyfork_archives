// ==UserScript==
// @name         Barra de Progreso Personalizada para Duolingo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Muestra una barra de progreso en la parte superior de Duolingo mientras estudias o completas lecciones
// @author       Tu Nombre
// @match        *://www.duolingo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514211/Barra%20de%20Progreso%20Personalizada%20para%20Duolingo.user.js
// @updateURL https://update.greasyfork.org/scripts/514211/Barra%20de%20Progreso%20Personalizada%20para%20Duolingo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crear el contenedor de la barra de progreso
    const progressBarContainer = document.createElement("div");
    progressBarContainer.style.position = "fixed";
    progressBarContainer.style.top = "0";
    progressBarContainer.style.left = "0";
    progressBarContainer.style.width = "100%";
    progressBarContainer.style.height = "8px";
    progressBarContainer.style.backgroundColor = "#ddd";
    progressBarContainer.style.zIndex = "1000";
    document.body.appendChild(progressBarContainer);

    // Crear la barra de progreso
    const progressBar = document.createElement("div");
    progressBar.style.height = "100%";
    progressBar.style.width = "0%";
    progressBar.style.backgroundColor = "#4caf50";
    progressBar.style.transition = "width 0.3s";
    progressBarContainer.appendChild(progressBar);

    // Actualizar la barra de progreso
    function updateProgress() {
        const currentXp = parseInt(document.querySelector("[data-test='profile-xp']").textContent) || 0;
        const dailyGoalXp = 50; // Cambia esto según tu meta diaria de XP
        const progress = Math.min((currentXp / dailyGoalXp) * 100, 100);
        progressBar.style.width = progress + "%";
    }

    // Actualizar la barra de progreso cada 5 segundos
    setInterval(updateProgress, 5000);
})();

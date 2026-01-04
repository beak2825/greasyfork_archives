// ==UserScript==
// @name         Chess.com Anti-Misclick
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Ajoute un délai anti-misclick sur Chess.com avec bouton d'activation
// @author       Yglsan
// @match        https://www.chess.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      OpenGPL 3.0
// @downloadURL https://update.greasyfork.org/scripts/489425/Chesscom%20Anti-Misclick.user.js
// @updateURL https://update.greasyfork.org/scripts/489425/Chesscom%20Anti-Misclick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selectedSquare = null;
    let lastClickTime = 0;
    const clickDelay = 750; // Délai en millisecondes
    const highlightColor = "rgba(255, 0, 0, 0.5)";
    let antiMisclickEnabled = GM_getValue("chessAntiMisclickEnabled", true);

    // Fonction de bascule
    function toggleMisclickProtection() {
        antiMisclickEnabled = !antiMisclickEnabled;
        GM_setValue("chessAntiMisclickEnabled", antiMisclickEnabled);
        updateButton();
    }

    // Mise à jour du bouton
    function updateButton() {
        const button = document.getElementById("chessAntiMisclickButton");
        if (!button) return;
        button.textContent = antiMisclickEnabled ? "🔴 Anti-Misclick ON" : "⚫ Anti-Misclick OFF";
        button.style.backgroundColor = antiMisclickEnabled ? "#28a745" : "#dc3545";
    }

    // Création du bouton
    function createButton() {
        const button = document.createElement("button");
        button.id = "chessAntiMisclickButton";
        button.textContent = antiMisclickEnabled ? "🔴 Anti-Misclick ON" : "⚫ Anti-Misclick OFF";
        Object.assign(button.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: "9999",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            color: "white",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
            backgroundColor: antiMisclickEnabled ? "#28a745" : "#dc3545"
        });
        button.onclick = toggleMisclickProtection;
        document.body.appendChild(button);
    }

    // Gestion des clics
    function handleClick(event) {
        if (!antiMisclickEnabled) return;

        const square = event.target.closest('[data-piece], .square');
        if (!square) return;

        const now = Date.now();
        
        if (selectedSquare) {
            if (now - lastClickTime < clickDelay) {
                event.stopImmediatePropagation();
                event.preventDefault();
                resetSelection();
                console.log("Mouvement annulé (anti-misclick)");
                return false;
            }
            resetSelection();
        } else {
            selectedSquare = square;
            lastClickTime = now;
            highlightSquare(square);
            console.log("Sélection:", square);
        }
    }

    // Surbrillance
    function highlightSquare(square) {
        const originalBg = square.style.backgroundColor;
        square.style.backgroundColor = highlightColor;
        
        setTimeout(() => {
            if (square === selectedSquare) {
                square.style.backgroundColor = originalBg;
            }
        }, clickDelay);
    }

    // Réinitialisation
    function resetSelection() {
        if (selectedSquare) {
            selectedSquare.style.backgroundColor = "";
            selectedSquare = null;
        }
    }

    // Initialisation
    function init() {
        createButton();
        document.addEventListener('click', handleClick, true);
    }

    // Attente du chargement complet
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
// ==UserScript==
// @name         Lichess Anti-Misclic
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Ajoute un délai anti-misclick sur Lichess avec un bouton d'activation
// @author       yglsan
// @match        https://lichess.org/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      OpenGPL 3.0 
// @downloadURL https://update.greasyfork.org/scripts/489259/Lichess%20Anti-Misclic.user.js
// @updateURL https://update.greasyfork.org/scripts/489259/Lichess%20Anti-Misclic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selectedSquare = null;
    let lastClickTime = 0;
    const clickDelay = 750; // Délai en millisecondes (750ms = 0.75s)
    const highlightColor = "rgba(255, 0, 0, 0.5)"; // Couleur de la case sélectionnée
    let antiMisclickEnabled = GM_getValue("antiMisclickEnabled", true); // Charge l'état enregistré

    // Fonction pour basculer l'état de la protection anti-misclick
    function toggleMisclickProtection() {
        antiMisclickEnabled = !antiMisclickEnabled;
        GM_setValue("antiMisclickEnabled", antiMisclickEnabled);
        updateButton();
    }

    // Mise à jour du texte et couleur du bouton
    function updateButton() {
        const button = document.getElementById("toggleMisclickButton");
        if (!button) return;
        button.innerText = antiMisclickEnabled ? "🔴 Anti-Misclick ON" : "⚫ Anti-Misclick OFF";
        button.style.backgroundColor = antiMisclickEnabled ? "#28a745" : "#dc3545"; // Vert pour ON, Rouge pour OFF
    }

    // Fonction pour injecter Bootstrap et ajouter le bouton d'activation/désactivation
    function injectBootstrapAndButton() {
        // Ajouter Bootstrap si non déjà présent
        if (!document.querySelector('link[href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';
            document.head.appendChild(link);
        }

        // Création du bouton flottant
        const button = document.createElement("button");
        button.id = "toggleMisclickButton";
        button.innerText = antiMisclickEnabled ? "🔴 Anti-Misclick ON" : "⚫ Anti-Misclick OFF";
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.zIndex = "1000";
        button.style.padding = "10px 15px";
        button.style.border = "none";
        button.style.borderRadius = "10px";
        button.style.backgroundColor = antiMisclickEnabled ? "#28a745" : "#dc3545";
        button.style.color = "white";
        button.style.fontSize = "14px";
        button.style.cursor = "pointer";
        button.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.3)";
        button.onclick = toggleMisclickProtection;
        document.body.appendChild(button);
    }

    // Appel à la fonction d'injection de Bootstrap et du bouton
    document.addEventListener("DOMContentLoaded", injectBootstrapAndButton);

    // Écouteur de clics sur l'échiquier
    document.addEventListener('click', (event) => {
        if (!antiMisclickEnabled) return; // Si désactivé, ne fait rien

        const now = Date.now();
        const square = event.target.closest('.square');

        if (!square) return;

        if (selectedSquare) {
            if (now - lastClickTime < clickDelay) {
                console.log("⏳ Misclick détecté : mouvement annulé !");
                resetSelection();
                return;
            }
            console.log(`✅ Coup validé : ${selectedSquare.dataset.san} -> ${square.dataset.san}`);
            resetSelection();
        } else {
            selectedSquare = square;
            lastClickTime = now;
            highlightSquare(selectedSquare);
            console.log(`🎯 Pièce sélectionnée sur ${square.dataset.san}`);
        }
    });

    // Mise en surbrillance de la case sélectionnée
    function highlightSquare(square) {
        square.style.backgroundColor = highlightColor;
        setTimeout(() => {
            if (square === selectedSquare) {
                square.style.backgroundColor = "";
            }
        }, clickDelay);
    }

    // Réinitialisation de la sélection
    function resetSelection() {
        if (selectedSquare) {
            selectedSquare.style.backgroundColor = "";
        }
        selectedSquare = null;
    }

    // Mise à jour de l'état du bouton à chaque changement de l'activation
    updateButton();
})();


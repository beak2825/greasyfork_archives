// ==UserScript==
// @name         Générateur d'URLs Mangas Origines (Bleu Foncé)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Génère des URLs de chapitres avec une interface améliorée et une police bleu foncé
// @author       Toi
// @match        *://mangas-origines.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527117/G%C3%A9n%C3%A9rateur%20d%27URLs%20Mangas%20Origines%20%28Bleu%20Fonc%C3%A9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527117/G%C3%A9n%C3%A9rateur%20d%27URLs%20Mangas%20Origines%20%28Bleu%20Fonc%C3%A9%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Création du conteneur de l'interface utilisateur
    let container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.width = "260px";
    container.style.backgroundColor = "#ffffff";
    container.style.padding = "15px";
    container.style.border = "2px solid #333";
    container.style.borderRadius = "10px";
    container.style.zIndex = "9999";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.color = "#003366"; // Bleu foncé
    container.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.3)";

    // Champs de saisie + styles améliorés
    container.innerHTML = `
        <h3 style="text-align: center; font-size: 16px; color: #003366;">📜 Générateur d'URLs</h3>
        <label>📖 Oeuvre :</label>
        <input type="text" id="oeuvre" placeholder="Ex: solo-leveling" style="width: 100%; padding: 5px; margin-top: 3px; color: #003366;"><br><br>
        <label>📍 Du chapitre :</label>
        <input type="number" id="start" min="1" value="1" style="width: 80px; padding: 5px; margin-top: 3px; color: #003366;">
        <label>➡️</label>
        <input type="number" id="end" min="1" value="5" style="width: 80px; padding: 5px; margin-top: 3px; color: #003366;"><br><br>
        <button id="generate" style="width: 100%; padding: 8px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Générer URLs</button>
        <textarea id="output" rows="5" cols="40" readonly style="width: 100%; margin-top:10px; padding: 5px; font-size: 12px; color: #003366;"></textarea>
        <button id="copy" style="width: 100%; padding: 8px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 5px;">📋 Copier</button>
    `;

    document.body.appendChild(container);

    // Fonction pour générer les URLs
    document.getElementById("generate").addEventListener("click", function() {
        let oeuvre = document.getElementById("oeuvre").value.trim();
        let start = parseInt(document.getElementById("start").value, 10);
        let end = parseInt(document.getElementById("end").value, 10);
        let output = document.getElementById("output");

        if (!oeuvre) {
            alert("❌ Veuillez entrer le nom de l'œuvre.");
            return;
        }

        if (start > end) {
            alert("❌ Le chapitre de début doit être inférieur ou égal au chapitre de fin.");
            return;
        }

        let urls = [];
        for (let i = start; i <= end; i++) {
            urls.push(`https://mangas-origines.fr/oeuvre/${oeuvre}/chapitre-${i}`);
        }

        output.value = urls.join("\n");
    });

    // Fonction pour copier les URLs
    document.getElementById("copy").addEventListener("click", function() {
        let output = document.getElementById("output");
        output.select();
        document.execCommand("copy");
        alert("📋 URLs copiées dans le presse-papiers !");
    });

})();

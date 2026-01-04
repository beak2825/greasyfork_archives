// ==UserScript==
// @name         Bite VIP - Crear skin con 99999 oro
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simula oro y sube skin automáticamente en Bite VIP
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541755/Bite%20VIP%20-%20Crear%20skin%20con%2099999%20oro.user.js
// @updateURL https://update.greasyfork.org/scripts/541755/Bite%20VIP%20-%20Crear%20skin%20con%2099999%20oro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Esperar que cargue la interfaz
    const waitFor = (selector, callback) => {
        const interval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                callback(el);
            }
        }, 500);
    };

    // Insertar botón nuevo
    waitFor("body", () => {
        const btn = document.createElement("button");
        btn.innerText = "Crear Skin 99999 Oro";
        btn.style.position = "fixed";
        btn.style.top = "80px";
        btn.style.right = "20px";
        btn.style.zIndex = "9999";
        btn.style.padding = "10px";
        btn.style.background = "#ffd700";
        btn.style.color = "#000";
        btn.style.border = "2px solid #000";
        btn.style.borderRadius = "10px";
        btn.onclick = () => {
            try {
                // Simula oro
                let oroDisplay = document.querySelector('.gold-counter');
                if (oroDisplay) oroDisplay.innerText = "99999";

                // Selecciona la calidad más alta (4K si hay)
                let calidad = document.querySelector("select[name='quality']");
                if (calidad) calidad.value = calidad.options[calidad.options.length - 1].value;

                // Aplica color según selección
                const selectedColor = document.querySelector('.selected-color')?.dataset?.color;
                if (selectedColor === "1") {
                    console.log("Borde blanco seleccionado");
                } else if (selectedColor === "2") {
                    console.log("Borde negro seleccionado");
                }

                // Clic en botón Upload
                const uploadBtn = [...document.querySelectorAll("button")].find(b => b.innerText.toLowerCase().includes("upload"));
                if (uploadBtn) {
                    uploadBtn.click();
                    alert("✅ Skin enviada con oro simulado.");
                } else {
                    alert("❌ Botón 'Upload' no encontrado.");
                }
            } catch (err) {
                alert("Error al crear skin: " + err);
            }
        };

        document.body.appendChild(btn);
    });
})();

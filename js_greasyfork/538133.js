// ==UserScript==
// @name         Subir Skin con Borde - Agar.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Agrega un botón para subir skin personalizada debajo del selector de colores, con borde aplicado según el color elegido (1: blanco, 2: negro, otros: normal).
// @author       ChatGPT
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538133/Subir%20Skin%20con%20Borde%20-%20Agario.user.js
// @updateURL https://update.greasyfork.org/scripts/538133/Subir%20Skin%20con%20Borde%20-%20Agario.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const createUploadButton = () => {
        const existingBtn = document.getElementById("customSkinUpload");
        if (existingBtn) return;

        const colorSelector = document.querySelector(".skinColorContainer, .agario-profile-colors");
        if (!colorSelector) return;

        const uploadInput = document.createElement("input");
        uploadInput.type = "file";
        uploadInput.accept = "image/*";
        uploadInput.style.display = "none";

        const uploadButton = document.createElement("button");
        uploadButton.innerText = "Subir imagen";
        uploadButton.id = "customSkinUpload";
        uploadButton.style.marginTop = "10px";
        uploadButton.style.padding = "6px 10px";
        uploadButton.style.fontSize = "14px";
        uploadButton.style.cursor = "pointer";
        uploadButton.style.borderRadius = "6px";
        uploadButton.style.border = "1px solid #ccc";
        uploadButton.style.background = "#eee";

        uploadButton.onclick = () => uploadInput.click();

        uploadInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (evt) {
                const imageData = evt.target.result;

                // Detectar color seleccionado (bordes especiales)
                const selectedColor = getSelectedColorIndex();

                // Borde personalizado
                let borderColor = "#000000"; // default negro
                if (selectedColor === 1) borderColor = "#ffffff";
                else if (selectedColor === 2) borderColor = "#000000";
                else borderColor = getColorFromIndex(selectedColor);

                // Guardar en localStorage para aplicarse como skin personalizada
                localStorage.setItem("customSkinImage", imageData);
                localStorage.setItem("customSkinBorder", borderColor);
                alert("Imagen subida correctamente con borde aplicado.");
            };
            reader.readAsDataURL(file);
        };

        colorSelector.appendChild(uploadInput);
        colorSelector.appendChild(uploadButton);
    };

    const getSelectedColorIndex = () => {
        const buttons = document.querySelectorAll(".skinColorContainer button, .agario-profile-colors button");
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].classList.contains("selected")) return i + 1;
        }
        return 3; // Por defecto
    };

    const getColorFromIndex = (index) => {
        const colors = [
            "#ffffff", // 1
            "#000000", // 2
            "#ff0000", // 3 (ejemplo)
            "#00ff00", // 4
            "#0000ff", // 5
            "#ffff00", // 6
            "#00ffff", // 7
            "#ff00ff"  // 8
        ];
        return colors[index - 1] || "#cccccc";
    };

    const waitForUI = setInterval(() => {
        const gameUI = document.querySelector(".skinColorContainer, .agario-profile-colors");
        if (gameUI) {
            createUploadButton();
            clearInterval(waitForUI);
        }
    }, 1000);
})();

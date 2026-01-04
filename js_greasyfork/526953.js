// ==UserScript==
// @name         Fix Manga Puzzle Page
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Reorganiza automáticamente las piezas del manga desordenado, permite subir imágenes y descargar la imagen recompuesta.
// @author       TuNombre
// @match        *://*/*  // Ajusta esto según la URL específica del sitio web
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/526953/Fix%20Manga%20Puzzle%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/526953/Fix%20Manga%20Puzzle%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Fix Manga Puzzle Page script loaded");

    function fixPuzzle() {
        console.log("fixPuzzle called");
        const container = document.querySelector(".puzzle-container"); // Ajusta este selector según el sitio
        if (!container) {
            console.log("No puzzle container found");
            return;
        }
        let pieces = Array.from(container.querySelectorAll("img"));
        console.log("Found puzzle pieces:", pieces.length);
        pieces.sort((a, b) => {
            let matchA = a.src.match(/(\\d+)\\.jpg/);
            let matchB = b.src.match(/(\\d+)\\.jpg/);
            let numA = parseInt(matchA?.[1] || "0", 10);
            let numB = parseInt(matchB?.[1] || "0", 10);
            return numA - numB;
        });
        container.innerHTML = "";
        pieces.forEach(piece => container.appendChild(piece));
    }

    function createUploadUI() {
        console.log("createUploadUI called");
        if (document.getElementById("uploadContainer")) {
            console.log("Upload container already exists");
            return;
        }
        const uploadContainer = document.createElement("div");
        uploadContainer.id = "uploadContainer";
        uploadContainer.style.position = "fixed";
        uploadContainer.style.top = "20px";
        uploadContainer.style.left = "20px";
        uploadContainer.style.background = "#fff";
        uploadContainer.style.padding = "15px";
        uploadContainer.style.border = "2px solid black";
        uploadContainer.style.borderRadius = "8px";
        uploadContainer.style.zIndex = "10000";
        uploadContainer.style.color = "black";
        uploadContainer.style.display = "flex";
        uploadContainer.style.flexDirection = "column";
        uploadContainer.style.alignItems = "center";
        uploadContainer.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
        uploadContainer.style.width = "250px";

        const title = document.createElement("h3");
        title.textContent = "Subir Imagen";
        title.style.marginBottom = "10px";
        uploadContainer.appendChild(title);

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.style.marginBottom = "10px";
        input.addEventListener("change", handleImageUpload);

        const previewContainer = document.createElement("div");
        previewContainer.id = "previewContainer";
        previewContainer.style.marginTop = "10px";
        previewContainer.style.width = "200px";
        previewContainer.style.height = "200px";
        previewContainer.style.border = "2px solid black";
        previewContainer.style.display = "flex";
        previewContainer.style.alignItems = "center";
        previewContainer.style.justifyContent = "center";
        previewContainer.style.overflow = "hidden";
        previewContainer.style.background = "#f0f0f0";

        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Descargar Imagen";
        downloadButton.style.padding = "5px 10px";
        downloadButton.style.cursor = "pointer";
        downloadButton.style.marginTop = "10px";
        downloadButton.addEventListener("click", downloadImage);

        uploadContainer.appendChild(input);
        uploadContainer.appendChild(previewContainer);
        uploadContainer.appendChild(downloadButton);
        document.body.appendChild(uploadContainer);
        console.log("Upload UI created");
    }

    function handleImageUpload(event) {
        console.log("handleImageUpload called");
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            let existingImg = document.getElementById("recomposedImage");
            if (existingImg) {
                existingImg.src = e.target.result;
            } else {
                const img = new Image();
                img.src = e.target.result;
                img.style.maxWidth = "100%";
                img.style.height = "auto";
                img.id = "recomposedImage";
                const previewContainer = document.getElementById("previewContainer");
                previewContainer.innerHTML = "";
                previewContainer.appendChild(img);
            }
        };
        reader.readAsDataURL(file);
    }

    function downloadImage() {
        console.log("downloadImage called");
        const img = document.getElementById("recomposedImage");
        if (!img) {
            alert("No hay imagen para descargar");
            return;
        }
        const link = document.createElement("a");
        link.href = img.src;
        link.download = "recomposed_image.jpg";
        link.click();
    }

    document.addEventListener("DOMContentLoaded", () => {
        console.log("DOM content loaded");
        createUploadUI();
        fixPuzzle();
    });
})();

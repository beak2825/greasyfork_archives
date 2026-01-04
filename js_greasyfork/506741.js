// ==UserScript==
// @name         Allegro Image Downloader
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Pobierz obrazy z ofert Allegro w pełnej rozdzielczości
// @author       Paweł Kaczmarek
// @match        https://allegro.pl/oferta/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/506741/Allegro%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/506741/Allegro%20Image%20Downloader.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function tuTworzymyButton() {
        let button = document.createElement("button");
        button.innerText = "Pobierz zdjęcia";
        button.style.position = "relative";
        button.style.zIndex = "9999";
        button.style.marginTop = "10px";
        button.style.padding = "10px 20px";
        button.style.backgroundColor = "#ff5a00";
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.fontSize = "16px";
        button.style.borderRadius = "5px";
        button.onclick = tuPokazujemyModal;
        return button;
    }

    function tuPokazujemyModal() {
        let modal = document.createElement("div");
        modal.style.position = "fixed";
        modal.style.top = "50%";
        modal.style.left = "50%";
        modal.style.transform = "translate(-50%, -50%)";
        modal.style.backgroundColor = "#fff";
        modal.style.padding = "35px";
        modal.style.zIndex = "10000";
        modal.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
        modal.style.maxHeight = "80%";
        modal.style.maxWidth = "80%";
        modal.style.overflowY = "auto";
        modal.style.display = "grid";
        modal.style.gridTemplateColumns = "repeat(auto-fill, minmax(150px, 1fr))";
        modal.style.gridGap = "10px";

        let tuZamykamy = document.createElement("button");
        tuZamykamy.innerText = "x";
        tuZamykamy.style.position = "absolute";
        tuZamykamy.style.top = "5px";
        tuZamykamy.style.right = "5px";
        tuZamykamy.style.backgroundColor = "#ff5a00";
        tuZamykamy.style.color = "#fff";
        tuZamykamy.style.border = "none";
        tuZamykamy.style.cursor = "pointer";
        tuZamykamy.style.fontSize = "16px";
        tuZamykamy.style.borderRadius = "50%";
        tuZamykamy.style.width = "30px";
        tuZamykamy.style.height = "30px";
        tuZamykamy.style.zIndex = "9999";
        tuZamykamy.onclick = function() { document.body.removeChild(modal); };
        modal.appendChild(tuZamykamy);

        let images = tuObrazki();
        images.forEach(src => {
            let imgWrapper = document.createElement("div");
            imgWrapper.style.position = "relative";
            imgWrapper.style.overflow = "hidden";
            imgWrapper.style.border = "1px solid #ddd";
            imgWrapper.style.borderRadius = "5px";
            imgWrapper.style.padding = "5px";
            imgWrapper.style.backgroundColor = "#f9f9f9";

            let img = document.createElement("img");
            img.src = src;
            img.style.width = "100%";
            img.style.height = "auto";
            img.style.objectFit = "cover";
            imgWrapper.appendChild(img);

            let tuPobieramy = document.createElement("button");
            tuPobieramy.innerText = "Pobierz";
            tuPobieramy.style.position = "absolute";
            tuPobieramy.style.bottom = "10px";
            tuPobieramy.style.left = "50%";
            tuPobieramy.style.transform = "translateX(-50%)";
            tuPobieramy.style.padding = "5px 10px";
            tuPobieramy.style.backgroundColor = "#ff5a00";
            tuPobieramy.style.color = "#fff";
            tuPobieramy.style.border = "none";
            tuPobieramy.style.cursor = "pointer";
            tuPobieramy.style.borderRadius = "3px";
            tuPobieramy.onclick = function() { GM_download(src, tuMagia(src)); };
            imgWrapper.appendChild(tuPobieramy);

            modal.appendChild(imgWrapper);
        });

        if (images.length > 1) {
            let tuWiecejPobieramy = document.createElement("button");
            tuWiecejPobieramy.innerText = "Pobierz wszystkie";
            tuWiecejPobieramy.style.marginTop = "20px";
            tuWiecejPobieramy.style.padding = "10px 20px";
            tuWiecejPobieramy.style.backgroundColor = "#ff5a00";
            tuWiecejPobieramy.style.color = "#fff";
            tuWiecejPobieramy.style.border = "none";
            tuWiecejPobieramy.style.cursor = "pointer";
            tuWiecejPobieramy.style.gridColumn = "span 2";
            tuWiecejPobieramy.style.justifySelf = "center";
            tuWiecejPobieramy.onclick = function() {
                images.forEach(src => GM_download(src, tuMagia(src)));
            };
            modal.appendChild(tuWiecejPobieramy);
        }

        document.body.appendChild(modal);
    }

    function tuObrazki() {
        let images = [];
        let galleryDiv = document.querySelector('div[data-box-name="showoffer.gallery"]');
        if (galleryDiv) {
            let buttons = galleryDiv.querySelectorAll('button:not([aria-label])');
            buttons.forEach(button => {
                let img = button.querySelector('img');
                if (img) {
                    let src = img.src.replace('/s128/', '/original/') + '.jpg';
                    images.push(src);
                }
            });
        }
        return images;
    }

    function tuMagia(src) {
        return src.split('/').pop();
    }

    function tuPatrzymy() {
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    let galleryDiv = document.querySelector('div[data-box-name="showoffer.gallery"]');
                    if (galleryDiv && !galleryDiv.querySelector("button.download-button")) {
                        let tuPobieramy = tuTworzymyButton();
                        tuPobieramy.classList.add("download-button");
                        galleryDiv.appendChild(tuPobieramy);
                    }
                }
            });
        });

        let config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    }

    tuPatrzymy();
})();

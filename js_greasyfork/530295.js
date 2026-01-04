// ==UserScript==
// @name         [DC] Show Image Forum
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Affiche l'aperçu de l'image d'un lien jpg/jpeg/pnh et gif.
// @author       Mnemoria
// @match        https://www.dreadcast.net/Forum/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/530295/%5BDC%5D%20Show%20Image%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/530295/%5BDC%5D%20Show%20Image%20Forum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let previewImage = document.createElement("img");
    previewImage.style.position = "fixed";
    previewImage.style.maxWidth = "300px";
    previewImage.style.maxHeight = "300px";
    previewImage.style.border = "1px solid #ccc";
    previewImage.style.background = "white";
    previewImage.style.padding = "5px";
    previewImage.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.5)";
    previewImage.style.display = "none";
    previewImage.style.zIndex = "1000";
    document.body.appendChild(previewImage);

    let hoverTimer;

    function extractImageLinks(text) {
        const regex = /\[img=(https?:\/\/.+?\.(?:jpg|jpeg|png|gif))(?:\s+taille=\d+)?\]/gi;
        let matches, links = new Set();
        while ((matches = regex.exec(text)) !== null) {
            links.add(matches[1]);
        }
        return Array.from(links);
    }

    function showPreview(url, x, y) {
        previewImage.src = url;
        previewImage.style.display = "block";
        previewImage.style.top = (y + 10) + "px";
        previewImage.style.left = (x + 10) + "px";
    }

    function hidePreview() {
        previewImage.style.display = "none";
    }

    document.addEventListener("mouseup", function(event) {
        let selection = window.getSelection().toString().trim();
        if (selection.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i)) {
            hoverTimer = setTimeout(() => {
                showPreview(selection, event.clientX, event.clientY);
            }, 1000);
        }
    });

    document.addEventListener("mousedown", function() {
        clearTimeout(hoverTimer);
        hidePreview();
    });

})();
// ==UserScript==
// @name         Img Downloader
// @namespace    https://greasyfork.org/users/1429467
// @version      1.0
// @description  Ajoute un bouton de téléchargement en haut à droite des images sur vos sites web favoris :p
// @author       Lakfu Sama
// @match        *://*.youtube.com/*
// @match        *://*.instagram.com/*
// @match        *://*.twitter.com/*
// @match        *://*.tiktok.com/*
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525423/Img%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/525423/Img%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoShowButtons = true; // Par défaut, les boutons DL sont visibles

    // Fonction pour créer un bouton de téléchargement
    function createDownloadButton(url) {
        let button = document.createElement("button");
        button.innerText = "DL";
        button.style.position = "absolute";
        button.style.top = "5px";
        button.style.right = "5px";
        button.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        button.style.color = "white";
        button.style.border = "none";
        button.style.padding = "5px 10px";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.fontSize = "12px";
        button.style.zIndex = "1000";
        button.style.opacity = "0.8";
        button.style.transition = "opacity 0.2s";
        button.style.display = autoShowButtons ? "block" : "none";

        // Effet de survol pour rendre le bouton plus visible
        button.onmouseover = () => button.style.opacity = "1";
        button.onmouseout = () => button.style.opacity = "0.8";

        // Action du bouton pour télécharger la vidéo ou l'image
        button.onclick = () => {
            // Si l'URL est une ressource blob, cela peut être problématique (à contourner)
            if (url.startsWith("blob:")) {
                alert("Le téléchargement de vidéos blob n'est pas supporté directement. Utilisez un outil de téléchargement adapté.");
            } else {
                // Utilisation d'un proxy pour contourner le blocage direct des ressources
                let proxyUrl = "https://api.allorigins.win/raw?url="; // Utilisation d'un proxy CORS alternatif
                let finalUrl = proxyUrl + encodeURIComponent(url); // Encode l'URL pour éviter tout problème
                let a = document.createElement("a");
                a.href = finalUrl;
                a.download = "file"; // Nom générique pour le fichier
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        };

        return button;
    }

    // Fonction pour ajouter le bouton de téléchargement uniquement pour les vidéos et images valides
    function addDownloadButtons() {
        console.log("Recherche de vidéos et images...");

        // Vérification des vidéos dans les balises <video>
        document.querySelectorAll("video").forEach(video => {
            if (!video.dataset.hasDownloadButton && video.src) {
                console.log("Vidéo trouvée: ", video.src);
                let button = createDownloadButton(video.src);
                video.style.position = "relative";
                video.parentNode.appendChild(button);
                video.dataset.hasDownloadButton = "true";
            }
        });

        // Vérification des vidéos dans les tweets Twitter (balises <div> avec des liens de vidéo)
        document.querySelectorAll("div[data-testid='tweet']").forEach(tweet => {
            const video = tweet.querySelector("video"); // Cherche la vidéo dans le tweet
            if (video && !video.dataset.hasDownloadButton && video.src) {
                console.log("Vidéo Twitter trouvée: ", video.src);
                let button = createDownloadButton(video.src);
                video.style.position = "relative";
                video.parentNode.appendChild(button);
                video.dataset.hasDownloadButton = "true";
            }
        });

        // Vérification des vidéos intégrées dans les <iframe> (ex. YouTube)
        document.querySelectorAll("iframe").forEach(iframe => {
            if (!iframe.dataset.hasDownloadButton && iframe.src && iframe.src !== "about:blank") {
                console.log("Iframe trouvée: ", iframe.src);

                if (iframe.src.includes("youtube.com/embed/") || iframe.src.includes("vimeo.com")) {
                    let videoUrl = iframe.src;
                    let button = createDownloadButton(videoUrl);
                    iframe.style.position = "relative";
                    iframe.parentNode.appendChild(button);
                    iframe.dataset.hasDownloadButton = "true";
                }
            }
        });

        // Vérification des vidéos dans des <object> ou <embed> (cas plus anciens)
        document.querySelectorAll("object, embed").forEach(element => {
            if (!element.dataset.hasDownloadButton && element.data) {
                console.log("Vidéo object/embed trouvée: ", element.data);
                let button = createDownloadButton(element.data);
                element.style.position = "relative";
                element.parentNode.appendChild(button);
                element.dataset.hasDownloadButton = "true";
            }
        });

        // Vérification des images (mais pas les petites)
        document.querySelectorAll("img").forEach(img => {
            if (!img.dataset.hasDownloadButton && img.src) {
                // Exclure les petites images (taille < 100x100)
                let imgWidth = img.naturalWidth;
                let imgHeight = img.naturalHeight;
                if (imgWidth > 100 && imgHeight > 100) {
                    console.log("Image trouvée: ", img.src);
                    let button = createDownloadButton(img.src);
                    img.style.position = "relative";
                    img.parentNode.appendChild(button);
                    img.dataset.hasDownloadButton = "true";
                }
            }
        });
    }

    // Observer pour les vidéos et images chargées dynamiquement (scroll infini)
    const observer = new MutationObserver(addDownloadButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    // Touche "D" pour afficher/cacher les boutons DL
    document.addEventListener('keydown', function(event) {
        if (event.key.toLowerCase() === 'd') {
            autoShowButtons = !autoShowButtons;
            document.querySelectorAll("button").forEach(button => {
                if (button.innerText === "DL") {
                    button.style.display = autoShowButtons ? "block" : "none";
                }
            });
        }
    });

    console.log("Script DL activé :\n[D] Afficher/Cacher les boutons de téléchargement");

    // Appel immédiat pour initialiser le script
    addDownloadButtons();
})();
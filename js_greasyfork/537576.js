// ==UserScript==
// @name         Pearltrees - Telecharger des pages de manuels
// @namespace    http://tampermonkey.net/
// @version      2025-05-28
// @description  Permet de telecharger des pages de manuels displayes sur pearltrees
// @author       Tonboti @Github
// @match        https://www.pearltrees.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pearltrees.com
// @grant        none
// @license      CC-NC
// @esversion    8
// @downloadURL https://update.greasyfork.org/scripts/537576/Pearltrees%20-%20Telecharger%20des%20pages%20de%20manuels.user.js
// @updateURL https://update.greasyfork.org/scripts/537576/Pearltrees%20-%20Telecharger%20des%20pages%20de%20manuels.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function downloadImagePearltrees() {

        var images = document.querySelectorAll(".synthesis");
        var titres = document.querySelectorAll(".full-title");

        // On cast la NodeList en Array, et ensuite on filtre seulement les elements visibles a l'ecran
        var imageVisible = Array.from(images).filter((image) => image.getBoundingClientRect().x > 0 && image.getBoundingClientRect().x + 100 < window.innerWidth )[0]

        var titreVisible = Array.from(titres).filter((titre) => titre.getBoundingClientRect().x > 0 && titre.getBoundingClientRect().x + 100 < window.innerWidth )[0]
        var contenuTitre = Array.from(titreVisible.children).reduce((acc, val) => val !== "" ? acc + val.innerText : acc, "")

        // On cherche a creer un truc comme ca :
        // <a href="${imageVisible.src}" download id="download" hidden>${titre du node}</a>
        // pour ensuite faire document.getElementById("download").click() pour telecharger le fichier

        const url = imageVisible.src;
        const filename = contenuTitre.split("").map((ele) => ele === "." ? "_" : ele).join("");
        console.log(filename)


        try {
            const response = await fetch(url, {mode : 'cors'});
            const blob = await response.blob();

            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();

            URL.revokeObjectURL(a.href); // Nettoyage
        } catch (error) {
            console.error("Erreur de téléchargement :", error);
        }

    }

    function addDownloadButton () {
        const buttonContainers = document.querySelectorAll(".header-container .information-bar .node-action-bar div");
        const btnContainer = Array.from(buttonContainers).filter((buttonContainer) => buttonContainer.getBoundingClientRect().x > 0 && buttonContainer.getBoundingClientRect().x + 100 < window.innerWidth )[0]

        const button = document.createElement("div");
        button.className = "nodeaction-download nodeaction-reader-download sprite-nodeaction-reader-download";
        button.setAttribute("data-original-title", "");
        button.title = "";
        button.style.zIndex = 99;
        button.style.position = "initial";

        // styles ajoutes par .nodeaction, mais nodeaction fait des erreurs et tt onclick
        button.style.marginLeft = "5px";
        button.style.marginRight = "5px";
        button.style.cursor = "pointer";
        button.style.float = "left";


        button.addEventListener('click', ()=>{
            downloadImagePearltrees()
        })

        btnContainer.appendChild(button);

        // console.log(btnContainer)
    }



    function checkUrl() {
        // on verifie si l'une des perles est en focus
        if (document.querySelector(".swipe-container")) {
            // on obtient le createur de la perle
            // si c'est un truc de manuel, alors c'est bordas, magnard ...
            var publisher = document.querySelector("#medal-publisher-button .medal-txt").innerText

            // lookup table des editeurs
            // TODO : a completer avec les editeurs manquants
            const existingPublishers = ["Bordas", "Magnard", "Hachette Éducation", "Nathan", "Nathan Technique", "Fontaine Picard"]

            if (existingPublishers.filter((ele) => ele === publisher).length !== 0) {
                // Si il n'y a pas de timeout, le bouton s'ajoute au container precedent
                window.setTimeout(addDownloadButton, 200)
            }
        }
    }

    checkUrl();
    window.addEventListener('popstate', checkUrl);
    const pushState = history.pushState;
    const replaceState = history.replaceState;
    history.pushState = function() {
        pushState.apply(history, arguments);
        checkUrl();
    };
    history.replaceState = function() {
        replaceState.apply(history, arguments);
        checkUrl();
    };

})();
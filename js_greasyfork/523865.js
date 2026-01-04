// ==UserScript==
// @name        DOWNLOADER UQLOAD
// @namespace   Violentmonkey Scripts
// @match       https://*.uqload.cx/*
// @grant       none
// @version     1.3
// @author      a.blasters
// @description 14/01/2025 19:10:50
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523865/DOWNLOADER%20UQLOAD.user.js
// @updateURL https://update.greasyfork.org/scripts/523865/DOWNLOADER%20UQLOAD.meta.js
// ==/UserScript==

// Création du bouton
var button = document.createElement("button");
button.innerHTML = "DOWNLOAD";
button.style.position = "fixed";
button.style.bottom = "50px";
button.style.right = "50px";
button.style.zIndex = "1000";
button.style.backgroundColor = "blue";
button.style.color = "white";

// Ajout de l'événement de clic pour rediriger
button.onclick = function() {
    window.location.href = "https://9xbud.com/" + location.href;
};

// Ajout du bouton au corps du document
document.body.appendChild(button);
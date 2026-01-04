// ==UserScript==
// @name         Photo(By)Pass
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Download Disneyland Paris Photopass picture without overlay or watermark and full original resolution from camera. (Only tested with attraction pictures)
// @author       Msama
// @match        *disneyphotopass.eu/photos/detail/*
// @match        *www.disneyphotopass.eu/photos/detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=disneyphotopass.eu
// @grant        GM_download
// @grant        unsafeWindow
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453561/Photo%28By%29Pass.user.js
// @updateURL https://update.greasyfork.org/scripts/453561/Photo%28By%29Pass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getKey() {
        const active = document.querySelector(".tns-slide-active .slider-item");
        if (active) {
            return active.getAttribute("data-picture-key");
        }
        return null;
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            btn.disabled = true;
            btn.textContent = "Téléchargement...";
            btn.style.background = "#555";
            btn.style.cursor = "not-allowed";
            btn.style.opacity = "0.7";
        } else {
            btn.disabled = false;
            btn.textContent = "Télécharger photo originale";
            btn.style.background = "#111";
            btn.style.cursor = "pointer";
            btn.style.opacity = "1";
        }
    }

    function download() {
        var pKey = getKey();
        if (!pKey) {
            alert('Impossible de récupérer la clé de la photo.');
            return;
        }

        setLoadingState(true);

        GM_download({
            url: "https://www.disneyphotopass.eu/Imaging/GetGraphic.ashx?flex=true&key=" + pKey + "&region=fr-FR&maxdim=9900",
            name: pKey + ".jpg",
            onerror: function() { setLoadingState(false); alert("Erreur pendant le téléchargement."); },
            ontimeout: function() { setLoadingState(false); alert("Échec du téléchargement."); },
            onload: function() { setLoadingState(false); }
        });
    }

    var btn = document.createElement('button');
    btn.textContent = 'Télécharger photo originale';
    btn.style.position = 'fixed';
    btn.style.left = '50%';
    btn.style.bottom = '20px';
    btn.style.transform = 'translateX(-50%)';
    btn.style.zIndex = '999999';
    btn.style.padding = '16px 22px';
    btn.style.border = 'none';
    btn.style.borderRadius = '10px';
    btn.style.background = '#111';
    btn.style.color = '#fff';
    btn.style.fontSize = '18px';
    btn.style.fontWeight = 'bold';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
    btn.addEventListener('click', download);

    document.addEventListener('readystatechange', function() {
        if (document.readyState === 'complete') { document.body.appendChild(btn); }
    });
    if (document.readyState === 'complete') { document.body.appendChild(btn); }

})();
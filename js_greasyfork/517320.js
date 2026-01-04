// ==UserScript==
// @name         Vision Sport on Example v1.4
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Fetch and display data from a Vision Sport URL specified in the hash of Example domain
// @match        https://example.com/*
// @grant        GM_xmlhttpRequest
// @connect      www.vision-sport.fr
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517320/Vision%20Sport%20on%20Example%20v14.user.js
// @updateURL https://update.greasyfork.org/scripts/517320/Vision%20Sport%20on%20Example%20v14.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkce pro získání URL z hash
    function getFetchUrl() {
        const hash = window.location.hash;
        return hash && hash.startsWith('#') ? hash.substring(1) : null;
    }

    // Funkce pro načtení dat s prodlevou (2,5 sekundy)
    function fetchData() {
        const url = getFetchUrl();
        if (!url) {
            console.error("URL for fetch is missing in the hash.");
            return;
        }

        setTimeout(() => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    displayData(response.responseText);
                },
                onerror: function(error) {
                    console.error("Failed to fetch data:", error);
                }
            });
        }, 2500); // 2500 ms prodleva
    }

    // Funkce pro zobrazení dat na stránce
    function displayData(data) {
        const dataContainer = document.createElement('div');
        dataContainer.style.position = 'fixed';
        dataContainer.style.top = '50px';
        dataContainer.style.left = '50%';
        dataContainer.style.transform = 'translateX(-50%)';
        dataContainer.style.backgroundColor = 'white';
        dataContainer.style.padding = '15px';
        dataContainer.style.border = '1px solid black';
        dataContainer.style.borderRadius = '5px';
        dataContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        dataContainer.style.zIndex = '1000';
        dataContainer.style.width = '80%';
        dataContainer.style.maxHeight = '80vh';
        dataContainer.style.overflowY = 'auto';

        dataContainer.innerHTML = `<h3>Fetched Data:</h3><pre>${data}</pre>`;
        
        document.body.appendChild(dataContainer);
    }

    // Spuštění načtení dat při načtení stránky
    fetchData();

    // Detekce změny hash části URL
    window.addEventListener('hashchange', fetchData);
})();

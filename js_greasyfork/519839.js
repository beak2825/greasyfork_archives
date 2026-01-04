// ==UserScript==
// @name         Přepsání URL - Kabaddi
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Skript pro přidání tlačítka na stránku, které přepíše URL bez refreshování
// @author       Michal
// @match        https://www.sportstiger.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519839/P%C5%99eps%C3%A1n%C3%AD%20URL%20-%20Kabaddi.user.js
// @updateURL https://update.greasyfork.org/scripts/519839/P%C5%99eps%C3%A1n%C3%AD%20URL%20-%20Kabaddi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        const button = document.createElement('button');
        button.textContent = 'Přepsání Live URL';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#007bff';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
            const currentUrl = window.location.href;
            if (currentUrl.includes('/info/upcoming')) {
                const newUrl = currentUrl.replace('/info/upcoming', '/stats/live');
                window.history.pushState({}, '', newUrl);
                alert('URL byla přepsána na: ' + newUrl);
            } else {
                alert('Aktuální URL nelze přepsat.');
            }
        });

        document.body.appendChild(button);
    }, 3000);
})();
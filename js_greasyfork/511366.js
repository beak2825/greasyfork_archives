// ==UserScript==
// @name         Filtrar ciudades IMSERSO
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Muestra solo las ciudades origen de Galicia y establece el valor de plazas a 2
// @author       xxdamage
// @match        https://reservasacc.turismosocial.com/*
// @icon         https://img.michollo.com/deals/kzhDmpGk3.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511366/Filtrar%20ciudades%20IMSERSO.user.js
// @updateURL https://update.greasyfork.org/scripts/511366/Filtrar%20ciudades%20IMSERSO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function filtrarCiudades() {
        const allowedCities = ['La Coruña', 'Orense', 'Pontevedra', 'Lugo'];
        const dropdown = document.getElementById('origenId-items');
        if (dropdown) {
            const menuItems = dropdown.getElementsByTagName('a');
            for (let i = 0; i < menuItems.length; i++) {
                const menuItem = menuItems[i];
                const cityName = menuItem.textContent.trim();
                if (!allowedCities.includes(cityName)) {
                    menuItem.style.display = 'none';
                } else {
                    menuItem.style.display = '';
                }
            }
        }
    }

    function observarDropdown() {
        const dropdownButton = document.getElementById('origenId-button');
        if (dropdownButton) {
            dropdownButton.addEventListener('click', function() {
                const dropdown = document.getElementById('origenId-items');
                if (dropdown) {
                    filtrarCiudades();
                }
            });
        }
    }

    function establecerPlazasPorDefecto() {
        const plazasInput = document.getElementById('plazasId');
        if (plazasInput) {
            plazasInput.focus();
            plazasInput.click();
            plazasInput.value = "2";
            plazasInput.setAttribute('aria-valuenow', '2');
            plazasInput.dispatchEvent(new Event('input', { bubbles: true }));
            plazasInput.dispatchEvent(new Event('change', { bubbles: true }));
            plazasInput.blur();
        }
    }

    function observarCambiosDOM() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    observarDropdown();
                    establecerPlazasPorDefecto();
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    window.onload = function() {
        observarDropdown();
        establecerPlazasPorDefecto();
        observarCambiosDOM();
    };

})();
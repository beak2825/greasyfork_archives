// ==UserScript==
// @name         Cheredak fees checker V CIS
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Fees check
// @author       Ahmed Esslaoui
// @match        https://cherdak.console3.com/*
// @icon         https://assets-global.website-files.com/643d3ad915724c257639f659/64709690d3b6b46a21ba91b0_favicon.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488030/Cheredak%20fees%20checker%20V%20CIS.user.js
// @updateURL https://update.greasyfork.org/scripts/488030/Cheredak%20fees%20checker%20V%20CIS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        const rideUUIDSelector = '#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div > div > dd:nth-child(13)';
        const driverIDSelector = '#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(2) > div > div.styles__InfoWrapper-ioCrot.vJNBD > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > dd > a';
        const buttonPlacementSelector = '#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(2) > div > div.styles__InfoWrapper-ioCrot.vJNBD > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > dt';
        const rideUUIDElement = document.querySelector(rideUUIDSelector);
        const driverIDElement = document.querySelector(driverIDSelector);
        const buttonPlacementElement = document.querySelector(buttonPlacementSelector);
        if (rideUUIDElement && driverIDElement && buttonPlacementElement) {
            const rideUUID = rideUUIDElement.textContent.trim();
            const driverID = driverIDElement.textContent.trim();
            const button = document.createElement('button');
            button.innerHTML = 'Check Fees &#8620;';
            button.style.padding = '10px 15px';
            button.style.height = '50px';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.background = 'linear-gradient(90deg, rgba(167,233,47,1) 0%, rgba(70,252,180,1) 100%)';
            button.style.color = 'black';
            button.style.fontSize = '16px';
            button.style.fontWeight = 'bold';
            button.style.cursor = 'pointer';
            button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
            button.style.marginTop = '10px';
            button.style.transition = 'color 0.3s, box-shadow 0.3s';
            button.addEventListener('mouseenter', () => {
                button.style.color = 'white';
                button.style.boxShadow = '0 6px 9px rgba(0, 0, 0, 0.3)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.color = 'black';
                button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
            });
            button.addEventListener('click', () => {
                const url = `https://cherdak.console3.com/mena/user-balance/user-balance-transaction?sourceUUID=${rideUUID}&userId=${driverID}`;
                window.open(url, '_blank').focus();
            });
            buttonPlacementElement.parentElement.insertBefore(button, buttonPlacementElement.nextSibling);
        }
    }, 3000);
})();

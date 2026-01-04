// ==UserScript==
// @name         Ali Stores Daily Check-In
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Open URLs and perform actions on each page
// @author       @syncNtune
// @match        https://sale.aliexpress.com/*__mobile/*
// @icon         https://img.alicdn.com/tfs/TB1j4.DHQT2gK0jSZFkXXcIQFXa-73-96.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504223/Ali%20Stores%20Daily%20Check-In.user.js
// @updateURL https://update.greasyfork.org/scripts/504223/Ali%20Stores%20Daily%20Check-In.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Define the CSS to be added
    var css = 'body { zoom: 0.3; }';

    // Create a style element
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));

    // Add the style element to the document body
    document.body.appendChild(style);

    const urls = [
		// 9999/12/12
        'https://s.click.aliexpress.com/e/_DkLwoOn',
        // 2050/09/23
        'https://s.click.aliexpress.com/e/_Dl1ASMT',
		// 2029/12/31
        'https://s.click.aliexpress.com/e/_DmM44n1',
		// 2028/01/01
        'https://s.click.aliexpress.com/e/_DCCOcAf',
        // 2026/07/31
        'https://s.click.aliexpress.com/e/_DcZAu03',
        // 2025/12/31
        'https://s.click.aliexpress.com/e/_DCbSkC3',
		// 2025/12/31
        'https://s.click.aliexpress.com/e/_DBRUdJN',
		// 2025/09/30
        'https://s.click.aliexpress.com/e/_Dk5yRZt',
        // 2035/02/01
        'https://s.click.aliexpress.com/e/_DBIlQwl',

        // 2023/03/03-2030/10/30
        'https://s.click.aliexpress.com/e/_DnFY0Q5',



		/*

		// 2025/02/28
        'https://s.click.aliexpress.com/e/_DDtoe43',
        // 2025/02/28
        'https://s.click.aliexpress.com/e/_DlOuAqB',
        // 2025/02/28
        'https://s.click.aliexpress.com/e/_Dl5T2mf',
        // 2025/02/28
        'https://s.click.aliexpress.com/e/_DDTDBVv',
        // 2025/02/28
        'https://s.click.aliexpress.com/e/_DBVs70J',
        // 2025/06/18
        'https://s.click.aliexpress.com/e/_DdMb3ZX',
        // 2030/12/31
        'https://s.click.aliexpress.com/e/_DBu9o4t',
		// 2025/03/31
        'https://s.click.aliexpress.com/e/_DczLuu7',

        // 2025/02/28 - 2025/02/28
        'https://s.click.aliexpress.com/e/_DE8NFCR',
        // 2025/01/31
        'https://s.click.aliexpress.com/e/_DCMYMEr',
        // 2025/01/31
        // 'https://s.click.aliexpress.com/e/_DDDyntv',




        // 2024/12/31
        https://s.click.aliexpress.com/e/_DBzBzhP
        // 2024/12/31
        https://s.click.aliexpress.com/e/_DeMn5Sp
        // 2024/12/31
        https://s.click.aliexpress.com/e/_DEcFTVR
        // 2024/12/31
        'https://s.click.aliexpress.com/e/_DmmFrhh',
        // 2024/12/31
        'https://s.click.aliexpress.com/e/_Dmp2i0F',

        // 2024/09/22
        'https://s.click.aliexpress.com/e/_Dn3n0Ef',
        // 2024/09/01
        'https://s.click.aliexpress.com/e/_DeIrQX1',
        // 2024/09/30
        'https://s.click.aliexpress.com/e/_DEIqkKX',
        // 2024/07/31
        'https://s.click.aliexpress.com/e/_DBpXOzN',
        // 2024/04/30
        // 'https://s.click.aliexpress.com/e/_DEz9S3D',
        // 2023/11/30
        // 'https://s.click.aliexpress.com/e/_DdO2j4P',
        // 2024/04/30
        // 'https://s.click.aliexpress.com/e/_Dlt2OoL',
        // 2024/01/31
        // 'https://s.click.aliexpress.com/e/_DBZaHr9'
        // 2024/05/31
        // 'https://s.click.aliexpress.com/e/_DekdzVp',



        */
  // Add the rest of your URLs here
    ];

    function openURLs(index) {
        if (index >= urls.length) {
            console.log('All URLs opened');
            return;
        }

        const newTab = window.open(urls[index], '_blank');
        index++;

        const checkInterval = setInterval(() => {
            try {
                if (newTab.location.href !== 'about:blank') {
                    clearInterval(checkInterval);
                    // console.log('Redirected URL:', newTab.location.href);

                    // Emulate button click if possible
                    const checkInButton = newTab.document.querySelector('.ci-button');
                    if (checkInButton) {
                        checkInButton.click();
                        console.log('Clicked the Check-in button.');

                        // Generate a random redirection wait time between 1000ms and 3500ms
                        const randomRedirectionTime = Math.floor(Math.random() * 1000 + 3500);
                        console.log(randomRedirectionTime);

                        // Pause for the randomly generated time after click
                        setTimeout(() => {
                            newTab.close();
                            openURLs(index);
                        }, randomRedirectionTime);
                    } else {
                        console.log('Check-in button not found.');
                        newTab.close();
                        openURLs(index);
                    }
                }
            } catch (err) {
                // Permission denied to access cross-origin frame (Most likely due to redirect)
            }
        }, Math.floor(Math.random() * 501) + 3000); // Random redirection wait time between 1000ms and 3500ms
    }

    function addButton() {
        const button = document.createElement('button');
        button.textContent = 'Launch URLs';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = '10px';
        button.style.padding = '10px 20px';
        button.style.fontSize = '160px';
        button.style.fontWeight = 'bold';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';
        button.addEventListener('click', () => {
            openURLs(0);
        });
        document.body.appendChild(button);
    }

    addButton();

})();
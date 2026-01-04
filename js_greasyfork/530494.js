// ==UserScript==
// @name         LR7 IP & Flag Checker
// @namespace    https://www.landriders7th.com/rcmt/
// @version      0.2
// @description  An attempt to make an IP Tool that works across multiple random chat sites [>~0]/
// @author       LandRiders7th
// @license      WTFPL
// @match        *://*.uhmegle.com/video/
// @match        *://*.omegleweb.com/video
// @match        *://*.omegleapp.mevideo/
// @match        *://*.thundr.com/video
// @match        *://*.emeraldchat.com/app
// @match        *://*.joingy.com
// @match        *://*.chitchat.gg
// @match        *://*.chatroulette.com/app
// @match        *://*.camsurf.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530494/LR7%20IP%20%20Flag%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/530494/LR7%20IP%20%20Flag%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a div element for displaying IP information
    const infoDiv = document.createElement('div');
    infoDiv.id = 'infoDiv';
    infoDiv.style.position = 'fixed'; // Make the div position fixed
    infoDiv.style.top = '440px'; // Position it near the top
    infoDiv.style.right = '10px'; // Align it to the right side
    infoDiv.style.background = '#000';
    infoDiv.style.color = '#f39d9e';
    infoDiv.style.padding = '3px';
    infoDiv.style.border = '1px solid #333';
    infoDiv.style.borderRadius = '7px';
    infoDiv.style.zIndex = '9999';
    infoDiv.style.userSelect = 'text'; // Make the words selectable
    infoDiv.setAttribute('draggable', true); // Make the div draggable
    infoDiv.style.fontSize = '18px'; // Adjust font size
    document.body.appendChild(infoDiv);

    // Create a button for copying the IP
    const blockaButton = document.createElement('button');
    blockaButton.textContent = 'copy IP';
    blockaButton.style.position = 'fixed';
    blockaButton.style.top = '640px'; // Position it below the 'infoDiv' (adjusted for clarity)
    blockaButton.style.right = '20px'; // Align it to the right side
    blockaButton.style.padding = '3px';
    blockaButton.style.border = 'none';
    blockaButton.style.background = '#ffffff';
    blockaButton.style.color = '#f39d9e';
    blockaButton.style.borderRadius = '15px';
    blockaButton.style.cursor = 'pointer';
    blockaButton.style.zIndex = '9999';
    blockaButton.style.fontSize = '20px'; // Adjust font size
    document.body.appendChild(blockaButton);

    blockaButton.addEventListener('click', function() {
        const ip = infoDiv.innerText.match(/IP: (\d+\.\d+\.\d+\.\d+)/);
        if (ip && ip[1]) {
            const ipToCopy = ip[1];
            navigator.clipboard.writeText(ipToCopy)
                .then(() => {
                    alert(`IP ${ipToCopy} is Copied [>~0]/`);
                })
                .catch(err => {
                    console.error('Unable to copy IP [._.]: ', err);
                });
        } else {
            alert('Theres No IP to copy [-~-]');
        }
    });

    // Create a button for skipping
    const skipButton = document.createElement('button');
    skipButton.textContent = 'Skip';
    skipButton.style.position = 'fixed';
    skipButton.style.top = '640px'; // Position it right below the 'copy' button
    skipButton.style.right = '100px'; // Align it to the right side
    skipButton.style.padding = '3px';
    skipButton.style.border = 'none';
    blockaButton.style.background = '#ffffff';
    blockaButton.style.color = '#f39d9e';
    skipButton.style.borderRadius = '15px';
    skipButton.style.cursor = 'pointer';
    skipButton.style.zIndex = '9999';
    skipButton.style.fontSize = '20px'; // Adjust font size
    document.body.appendChild(skipButton);

    skipButton.addEventListener('click', function() {
        const popup = window.open('', 'CountryCodes', 'width=1200,height=750');
        popup.document.write('<label for="countryCodes">Enter Country Codes (separated by commas): </label>');
        popup.document.write('<input type="text" id="countryCodes"><br><br>');
        popup.document.write('<label for="cityNames">Enter City Names (separated by commas): </label>');
        popup.document.write('<input type="text" id="cityNames"><br><br>');
        popup.document.write('<button id="okButton">Ok</button>');

        const countryCodesInput = popup.document.getElementById('countryCodes');
        const cityNamesInput = popup.document.getElementById('cityNames');
        const okButton = popup.document.getElementById('okButton');

        const savedCountryCodes = JSON.parse(localStorage.getItem('savedCountryCodes')) || [];
        const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
        countryCodesInput.value = savedCountryCodes.join(', ');
        cityNamesInput.value = savedCities.join(', ');

        okButton.addEventListener('click', function() {
            const countryCodes = countryCodesInput.value.split(',').map(code => code.trim());
            const cityNames = cityNamesInput.value.split(',').map(name => name.trim());
            localStorage.setItem('savedCountryCodes', JSON.stringify(countryCodes));
            localStorage.setItem('savedCities', JSON.stringify(cityNames));
            popup.close();
        });
    });

    window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection;
    let pc;

    window.RTCPeerConnection = function (...args) {
        pc = new window.oRTCPeerConnection(...args);
        pc.oaddIceCandidate = pc.addIceCandidate;

        pc.addIceCandidate = function (iceCandidate, ...rest) {
            const fields = iceCandidate.candidate.split(' ');
            if (fields[7] === 'srflx') {
                console.log(fields[4]);
                httpGet(fields[4]);
                const countryCode = checkCountryFlag();
                if (countryCode) {
                    console.log('Country code from flag:', countryCode);
                    httpCheckFlag(countryCode); // Check if the country is allowed
                }
            }
            return pc.oaddIceCandidate(iceCandidate, ...rest);
        };

        return pc;
    };

    function httpGet(ip) {
        const url = `https://ipinfo.io/${ip}?token=e46f8cedb64fd5`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Data from ipinfo.io:', data);

                displayInfo(data);
            })
            .catch(error => console.error('Request ERROR! Make sure you have AdBlock off!', error));
    }

    function displayInfo(data) {
        infoDiv.innerHTML =
            '- Look what I found [8.0] -<br>' +
            'IP: ' + data.ip + '<br>City: ' + data.city + '<br>Region: ' + data.region + '<br>Country: ' + data.country + '<br>postal: ' + data.postal + '<br>loc: ' + data.loc ;;
    }

    function checkCountryFlag() {
        const countryFlag = document.getElementById('countryFlag');
        if (countryFlag) {
            const flagClass = countryFlag.className;
            const countryCode = flagClass.match(/flags-([A-Za-z]{2})/); // Extract the country code from the class
            if (countryCode) {
                return countryCode[1]; // Return the country code (e.g., 'US', 'GB', etc.)
            }
        }
        return null; // Return null if no country flag found
    }

    function httpCheckFlag(countryCode) {
        if (localStorage.getItem('savedCountryCodes')) {
            const savedCountryCodes = JSON.parse(localStorage.getItem('savedCountryCodes'));
            if (savedCountryCodes.includes(countryCode)) {
                console.log('Country allowed to connect.');
            }
        }
    }
})();
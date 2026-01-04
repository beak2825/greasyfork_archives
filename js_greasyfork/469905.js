// ==UserScript==
// @name         Show Location on ChatGPT
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  个人使用，加了一个两秒后自动关闭
// @author       Daotin
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chat.openai.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469905/Show%20Location%20on%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/469905/Show%20Location%20on%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the list of regions to check against
    const regions = [
        "Albania",
        "Algeria",
        "Andorra",
        "Angola",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas",
        "Bangladesh",
        "Barbados",
        "Belgium",
        "Belize",
        "Benin",
        "Bhutan",
        "Bolivia",
        "Bosnia and Herzegovina",
        "Botswana",
        "Brazil",
        "Brunei",
        "Bulgaria",
        "Burkina Faso",
        "Cabo Verde",
        "Canada",
        "Chile",
        "Colombia",
        "Comoros",
        "Congo (Congo-Brazzaville)",
        "Costa Rica",
        "Côte d'Ivoire",
        "Croatia",
        "Cyprus",
        "Czechia (Czech Republic)",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic",
        "Ecuador",
        "El Salvador",
        "Estonia",
        "Fiji",
        "Finland",
        "France",
        "Gabon",
        "Gambia",
        "Georgia",
        "Germany",
        "Ghana",
        "Greece",
        "Grenada",
        "Guatemala",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Holy See (Vatican City)",
        "Honduras",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iraq",
        "Ireland",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Kuwait",
        "Kyrgyzstan",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands",
        "Mauritania",
        "Mauritius",
        "Mexico",
        "Micronesia",
        "Moldova",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Morocco",
        "Mozambique",
        "Myanmar",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands",
        "New Zealand",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "North Macedonia",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Palestine",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Poland",
        "Portugal",
        "Qatar",
        "Romania",
        "Rwanda",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Vincent and the Grenadines",
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "South Africa",
        "South Korea",
        "Spain",
        "Sri Lanka",
        "Suriname",
        "Sweden",
        "Switzerland",
        "Taiwan",
        "Tanzania",
        "Thailand",
        "Timor-Leste (East Timor)",
        "Togo",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Tuvalu",
        "Uganda",
        "Ukraine (with certain exceptions)",
        "United Arab Emirates",
        "United Kingdom",
        "United States of America",
        "Uruguay",
        "Vanuatu",
        "Zambia"
    ];

    // Your code here...
    // Make an HTTP request to https://chat.openai.com/cdn-cgi/trace
    fetch('https://chat.openai.com/cdn-cgi/trace')
        .then(response => response.text())
        .then(data => {
        // Extract the user's location and IP address from the returned string
        const locationRegex = /loc=([a-zA-Z]+)/;
        const countryCode = data.match(locationRegex)[1];
        const ipRegex = /ip=([0-9\.]+)/;
        const ipAddress = data.match(ipRegex)[1];

        // Make an HTTP request to the REST Countries API to get the full country name
        fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
            .then(response => response.json())
            .then(data => {
            const countryName = data[0]?.name?.official || data[0]?.name?.common;

            // 循环regions，判断countryName是否包含regions中的元素
            const isInRegion = regions.some(region => countryName.includes(region));

            // Display the user's location and IP address at the top of the browser
            const locationDiv = document.createElement('div');
            locationDiv.textContent = `Your location: ${countryName} (${ipAddress}) ${isInRegion ? '✅' : '⛔'}`;
            locationDiv.style.position = 'fixed';
            locationDiv.style.top = '10px';
            locationDiv.style.left = '50%';
            locationDiv.style.transform = 'translateX(-50%)';
            locationDiv.style.padding = '10px 20px';
            locationDiv.style.backgroundColor = isInRegion ? '#10a37fb3' : '#ef4146b3';
            locationDiv.style.color = '#fff';
            locationDiv.style.fontSize = '16px';
            locationDiv.style.fontWeight = 'bold';
            locationDiv.style.textAlign = 'center';
            locationDiv.style.zIndex = '9999';
            locationDiv.style.borderRadius = '8px';
            document.body.appendChild(locationDiv);

            // Add a close button to the locationDiv
            const closeButton = document.createElement('div');
            closeButton.textContent = '×';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '-3px';
            closeButton.style.right = '-6px';
            closeButton.style.backgroundColor = 'rgba(231, 195, 195, 0.5)';
            closeButton.style.border = 'none';
            closeButton.style.color = '#fff';
            closeButton.style.fontSize = '16px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.borderRadius = '50%';
            closeButton.style.width = '16px';
            closeButton.style.height = '16px';
            closeButton.style.lineHeight = '16px';
            closeButton.style.textAlign = 'center';
            locationDiv.appendChild(closeButton);

            // Add a click event listener to the closeButton to remove the locationDiv
            closeButton.addEventListener('click', () => {
                locationDiv.remove();
            });
            // Add a setTimeout function to automatically remove the locationDiv after 2 seconds
            setTimeout(() => {
                locationDiv.remove();
            }, 2000);
        });
    });
})();

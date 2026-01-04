// ==UserScript==
// @name         Platesmania Information Autofill
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Autofills "extra information" field on the upload form with location and date.
// @author       You
// @match        *://platesmania.com/*/add*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/524820/Platesmania%20Information%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/524820/Platesmania%20Information%20Autofill.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let defaultLocation = 'Missing location tag - Please define a Default Location in line 15 of the script. See the instructions of the userscript for more information';
    // let defaultLocation = '';

    const geoCodeAPIkey = 'REPLACE THIS TEXT WITH YOUR API KEY';

    function fetchMapInfo() {
        console.log('Checking for map link and date stamp...');
        const mapLinkElement = document.querySelector('#fotodiv a[href^="https://www.google.com/maps"]');
        const dateStampElementsBase = document.querySelectorAll('#fotodiv span[onclick^="appdop"]');
        if (!dateStampElementsBase.length) {
            console.warn('Date stamp not found.');
            return;
        }
        console.warn('Date stamps found:', dateStampElementsBase);
        if (!mapLinkElement) {
            console.warn('Map link not found.');
        } else {
            console.warn('Map link found:', mapLinkElement);
        }
        const dates = Array.from(dateStampElementsBase)
        .map(el => {
            const rawDate = el.getAttribute('onclick')?.match(/\d{4}[.:]\d{2}[.:]\d{2}/); // Match YYYY.MM.DD or YYYY:MM:DD
            if (rawDate) {
                return new Date(rawDate[0].replace(/[.:]/g, '-'));
            }
            return null;
        })
        .filter(date => date && !isNaN(date.getTime()));
        if (!dates.length) {
            console.warn('No valid dates found in date stamps.');
            return;
        }
        const earliestDate = new Date(Math.min(...dates));
        console.log('Earliest date:', earliestDate);
        const formattedDate = earliestDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const dateObj = new Date(formattedDate);
        const options = { year: 'numeric', month: 'long' };
        const formattedDateNew = dateObj.toLocaleDateString('en-US', options);
        console.log(formattedDateNew); // Expected output format: "December 2024"
        let locationInfo = '';
        if (mapLinkElement) {
            const mapLink = mapLinkElement.getAttribute('href');
            console.log('Map link:', mapLink);
            const url = new URL(mapLink);
            const lat = url.searchParams.get('q').split(',')[0];
            const lon = url.searchParams.get('q').split(',')[1];
            console.log('Latitude:', lat);
            console.log('Longitude:', lon);
            console.log('Date stamp (earliest):', formattedDateNew);
            fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}&api_key=${geoCodeAPIkey}&accept-language=en`)
                .then(response => {
                console.log('API response received.');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
                .then(data => {
                console.log('API response data:', data);
                const { road, municipality, town, village, county, state, country, suburb, city } = data.address;
                console.log('Location:', road, municipality, town, village, county, state, suburb, city, country);
                if (road && /\d/.test(road)) {
                    locationInfo += road + ' @ ';
                }
                if (municipality) {
                    locationInfo += municipality + ', ';
                } else if (town) {
                    locationInfo += town + ', ';
                } else if (village) {
                    locationInfo += village + ', ';
                } else if (city) {
                    locationInfo += city + ', ';
                } else if (suburb) {
                    locationInfo += suburb + ', ';
                }
                if (state) locationInfo += state + ', ';
                if (country) locationInfo += country + ' - ';
                locationInfo += formattedDateNew;
                const infoText = locationInfo.replace(/, undefined/g, '').replace(/, $/g, '');
                const dopTextArea = document.querySelector('textarea[name="dop"]');
                if (dopTextArea) {
                    dopTextArea.value = infoText;
                    console.log('Information added to textarea:', infoText);
                }
            })
                .catch(error => console.error('Error fetching map info:', error));
        } else {
            console.log('No map link found. Using default location.');
            if ($defaultLocation != '') {
                locationInfo = `${defaultLocation} - ${formattedDateNew}`;
            }
            else {
                locationInfo = `${formattedDateNew}`;
            }
            const dopTextArea = document.querySelector('textarea[name="dop"]');
            if (dopTextArea) {
                dopTextArea.value = locationInfo;
                console.log('Default location and/or date added to textarea:', locationInfo);
            }
        }
    }
    const observer = new MutationObserver(fetchMapInfo);
    observer.observe(document.body, { childList: true, subtree: true });
})();
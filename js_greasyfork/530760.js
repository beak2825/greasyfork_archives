// ==UserScript==
// @name         Better Real Estate
// @namespace    https://github.com/ChenglongMa/tampermonkey-scripts
// @version      1.0.4
// @description  Enhance real estate websites with additional features
// @author       Chenglong Ma
// @match        *://*.realestate.com.au/*
// @match        *://*.domain.com.au/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=realestate.com.au
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530760/Better%20Real%20Estate.user.js
// @updateURL https://update.greasyfork.org/scripts/530760/Better%20Real%20Estate.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    function getPropertyAddress() {
        const addressElement = document.querySelector('h1.property-info-address, div[data-testid="listing-details__button-copy-wrapper"] > h1');
        if (!addressElement) return undefined;
        return addressElement.textContent;
    }

    async function getPropertyLink(address) {
        // Step 1: Construct the GET request URL
        const query = encodeURIComponent(address);
        const requestUrl = `https://suggest.realestate.com.au/consumer-suggest/suggestions?max=1&type=address%2Csuburb%2Cpostcode%2Cstate%2Cregion&src=reax-multi-intent-search-modal&query=${query}`;

        try {
            // Step 2: Fetch the JSON response
            const response = await fetch(requestUrl);
            const data = await response.json();

            // Step 3: Extract the property URL from the JSON response
            const propertyUrl = data._embedded.suggestions[0].source.url;

            // Step 4: Fetch the HTML content of the property URL
            const propertyResponse = await fetch(propertyUrl);
            const propertyHtml = await propertyResponse.text();

            // Step 5: Parse the HTML and extract the href value of the <a> tag with class containing "PropertyLinkWrapper"
            const parser = new DOMParser();
            const doc = parser.parseFromString(propertyHtml, 'text/html');
            return doc.querySelector('a[class*="PropertyLinkWrapper"]').href;
        } catch (error) {
            console.error('Error fetching property link:', error);
        }
    }

    async function enhancePropertyProfile(propertyLink) {
        const propertyResponse = await fetch(propertyLink, {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "en-AU,en-US;q=0.9,en;q=0.8,zh;q=0.7,zh-TW;q=0.6,zh-CN;q=0.5",
                "priority": "u=0, i",
                "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Microsoft Edge\";v=\"134\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1"
            },
            "referrer": "https://www.property.com.au/dashboard/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "no-cors",
            "credentials": "include"
        });

        const propertyHtml = await propertyResponse.text();
        const parser = new DOMParser();
        const propertyDoc = parser.parseFromString(propertyHtml, 'text/html');

        // 1. Extract overlay profile
        const overlayProfile = {};
        const overlayTiles = propertyDoc.querySelectorAll('div[class*="OverlayTiles__TileHeader"]');
        overlayTiles.forEach((overlayTile) => {
            const [title, value] = overlayTile.innerText.split("\n\n");
            overlayProfile[title] = value;
        })
        console.log("overlayProfile", overlayProfile);

        // 2. Extract property value profile - property.com.au
        const propertyValueProfile = {};
        const estimatedValueElement = propertyDoc.querySelector('p[data-testid="valuation-sub-brick-price-text"]');
        if (estimatedValueElement) {
            propertyValueProfile['Estimated Value'] = estimatedValueElement.textContent;
        }
        const estimatedValueRangeElement = propertyDoc.querySelector('div[data-testid="valuation-sub-brick-estimate-range"]');
        if (estimatedValueRangeElement) {
            const [low, high] = estimatedValueRangeElement.innerText.split("\n\n");
            propertyValueProfile['Low'] = low;
            propertyValueProfile['High'] = high;
        }

        // 3. Extract Floor area size
        const floorAreaElement = propertyDoc.querySelector('div[title="Floor area"]');
        const propertyInfoElement = document.querySelector('ul[class*="property-info__primary-features"]');
        if (propertyInfoElement) {
            const infoContainer = propertyInfoElement.firstElementChild;
            console.log("infoContainer", infoContainer);
            console.log("floorAreaElement", floorAreaElement);
            infoContainer.appendChild(floorAreaElement);
        }


        // 4. Extract property value profile - findbesthouse.com.au
        const findBestHouseValueProfile = {};

    }

    function getFindBestHouseLink(address) {
        // Encode the address to be URL-friendly
        const encodedAddress = address
            .replace(/[^a-zA-Z0-9]+/g, '-') // Replace non-alphanumeric characters with '-'
            .replace(/^-+|-+$/g, '') // Remove leading and trailing '-'
            .toLowerCase();
        // Construct the URL
        return `https://www.findbesthouse.com/en/property/${encodedAddress}`;
    }

    function getGoogleMapLink(address) {
        const encodedAddress = encodeURIComponent(address);
        return `https://www.google.com/maps/place/${encodedAddress}`;
    }

    function addLinkButtons(propertyLink, findBestHouseLink, mapLink) {
        const rightPanel = document.querySelector('div[class="contact-agent-panel"], div[data-testid="listing-details__agent-details"]');
        if (!rightPanel) return;

        let stackDiv = rightPanel.querySelector('div[class^="Stack__StackContainer"], div[class="css-jmaqhc"]');
        if (!stackDiv) {
            stackDiv = rightPanel.lastElementChild;
        }
        if (!stackDiv) return;

        // Create a new button element
        const propertyComAuButton = document.createElement('button');
        const findBestHouseButton = document.createElement('button');
        const mapButton = document.createElement('button');

        const lastButton = stackDiv.querySelector('button[class*="SaveButton__StyledButton"], button[data-testid="listing-details__phone-cta-button"], button');

        if (lastButton) {
            propertyComAuButton.className = lastButton.className;
            findBestHouseButton.className = lastButton.className;
            mapButton.className = lastButton.className;
        }
        propertyComAuButton.title = 'View in property.com.au';
        propertyComAuButton.textContent = 'View in property.com.au';
        const address = getPropertyAddress();

        propertyComAuButton.addEventListener('click', function () {
            if (propertyLink) {
                window.open(propertyLink, '_blank');
            }
        });

        findBestHouseButton.title = 'View in FindBestHouse.com.au';
        findBestHouseButton.textContent = 'View in FindBestHouse.com.au';

        findBestHouseButton.addEventListener('click', function () {
            if (findBestHouseLink) {
                window.open(findBestHouseLink, '_blank');
            }
        });

        mapButton.title = 'View in Google Map';
        mapButton.textContent = 'View in Google Map';
        mapButton.addEventListener('click', function () {
            if (mapLink) {
                window.open(mapLink, '_blank');
            }
        })

        // Append the new button to the stackDiv
        stackDiv.appendChild(propertyComAuButton);
        stackDiv.appendChild(findBestHouseButton);
        stackDiv.appendChild(mapButton);
    }

    // Entry point
    const propertyAddress = getPropertyAddress();
    if (!propertyAddress) return;
    const propertyLink = await getPropertyLink(propertyAddress);
    const findBestHouseLink = getFindBestHouseLink(propertyAddress);
    const mapLink = getGoogleMapLink(propertyAddress);
    addLinkButtons(propertyLink, findBestHouseLink, mapLink);
    // await enhancePropertyProfile(propertyLink); // TODO: property.com.au cannot be fetched.
})();
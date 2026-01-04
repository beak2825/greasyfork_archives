// ==UserScript==
// @name         Dexscreener Avatar Improve
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Enable avatar in Dexscreen
// @author       0xWood
// @match        https://dexscreener.com/ethereum/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488792/Dexscreener%20Avatar%20Improve.user.js
// @updateURL https://update.greasyfork.org/scripts/488792/Dexscreener%20Avatar%20Improve.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fetchLpInformationBatch(lpAddresses) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.dexscreener.com/latest/dex/pairs/ethereum/${lpAddresses.join(',')}`,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data && data.pairs.length > 0) {
                    data.pairs.forEach(pair => {
                        const baseTokenAddress = pair.baseToken.address;
                        const avatarImageUrl = `https://dd.dexscreener.com/ds-data/tokens/ethereum/${baseTokenAddress}.png?size=lg`;
                        const elements = document.querySelectorAll(`a[href*="/ethereum/${pair.pairAddress.toLowerCase()}"]`);
                        elements.forEach(element => {
                            appendAvatarImageToElement(avatarImageUrl, element);
                        });
                    });
                }
            }
        });
    }

    function appendAvatarImageToElement(imageUrl, element) {
        const existingImg = element.parentNode.querySelector('img');
        if (!existingImg) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.cssText = 'height: 20px; width: 20px; margin-left: 5px;align-self: center;margin: 0 5px;';
            img.onerror = function() {
                this.style.display = 'none';
                const fallbackDiv = document.createElement('div');
                fallbackDiv.style.cssText = 'width: 25px; height: 20px; margin-right: 5px;';
                element.parentNode.insertBefore(fallbackDiv, element);
            };
            element.parentNode.insertBefore(img, element);
        }
    }

    const processElements = () => {
        const lpAddresses = [];
        document.querySelectorAll('a[href*="/ethereum/"]').forEach(element => {
            if (!element.hasAttribute('data-avatar-not-proccessed')) {
                element.setAttribute('data-avatar-not-proccessed', 'true');
                const href = element.getAttribute('href');
                const addressLpMatch = href.match(/\/ethereum\/(0x[a-fA-F0-9]+)/);
                if(addressLpMatch && addressLpMatch[1]) {
                    lpAddresses.push(addressLpMatch[1]);
                }
            }
        });
        if(lpAddresses.length > 0) {
            fetchLpInformationBatch(lpAddresses);
        }
    };

    window.addEventListener('load', processElements);
    setInterval(processElements, 1000);
})();

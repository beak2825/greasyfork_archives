// ==UserScript==
// @name         Character Card Loader
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Load character cards from Muah AI to Perchance Chatbot
// @author       Jackie
// @match        https://card.muah.ai/*
// @match        https://perchance.org/ai-chat-roleplay*
// @match        https://*.perchance.org/ai-chat-roleplay*
// @match        https://characterhub.org/characters/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527998/Character%20Card%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/527998/Character%20Card%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getQueryParam(param) {
        return new URLSearchParams(window.location.search).get(param);
    }

    if (window.location.hostname.includes('muah.ai')) {
    setTimeout(() => {
        const downloadButton = document.querySelector('.download-button a.btn-download');
        if (downloadButton) {
            const newButton = downloadButton.cloneNode(true);
            const cardUrl = new URL(downloadButton.href).searchParams.get('url');
            if (!cardUrl) return;

            extractCharacterData(cardUrl).then(cardData => {
                console.log("Extracted JSON:", cardData); // Corrected console log

                if (cardData?.spec === "muah_x_card") {
                    newButton.textContent = 'Muah X Cards Not Supported';
                } else {
                    newButton.href = `https://perchance.org/ai-chat-roleplay?data=Muah_Character_Card_Bot~d361ea75cfaf9a6bc9a472ae052e8f78.gz&characterCard=${encodeURIComponent(cardUrl)}`;
                    newButton.textContent = 'Import to Perchance';
                }
                downloadButton.parentNode.appendChild(newButton);
            }).catch(err => console.error("Error extracting character data:", err));
        }
    }, 250);
}

    if (window.location.hostname.includes('characterhub.org')) {
    setTimeout(() => {
        const container = document.querySelector('.download-buttons.text-center.justify-center.always-top.mb-0.mt-2');

        if (container) {
            // Clone the third child
            const thirdChild = container.children[2];
            const clone = thirdChild.cloneNode(true);

            // Modify the first child (tooltip text)
            const tooltip = clone.querySelector('.tooltiptext.text-xs');
            if (tooltip) {
                tooltip.innerText = 'A link that imports the character into Perchance';
            }

            // Modify the second child (the <a> tag)
            const link = clone.querySelector('a');
            if (link) {
                link.style.backgroundColor = 'lightblue';
                const originalImgSrc = document.querySelector("#avatar-and-buttons > div:nth-child(1) > a > img").src;
                const characterCardUrl = originalImgSrc.replace(/avatar\.webp.*$/, 'chara_card_v2.png');
                link.href = `https://perchance.org/ai-chat-roleplay?data=Muah_Character_Card_Bot~d361ea75cfaf9a6bc9a472ae052e8f78.gz&characterCard=${encodeURIComponent(characterCardUrl)}`;

                // Modify the image source
                const imgDiv = link.querySelector('div img');
                if (imgDiv) {
                    imgDiv.src = 'https://perchance.org/favicon-16x16-white-bg.png';
                }
            }

            // Append the clone to the container (you can choose the desired position)
            container.appendChild(clone);
        }
    }, 250);
}



    function extractCharacterData(url) {
        return fetch(url).then(response => response.blob()).then(blob => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const uint8Array = new Uint8Array(event.target.result);
                    let index = 8;
                    while (index < uint8Array.length) {
                        const length = (uint8Array[index] << 24) | (uint8Array[index + 1] << 16) | (uint8Array[index + 2] << 8) | uint8Array[index + 3];
                        const type = String.fromCharCode(...uint8Array.slice(index + 4, index + 8));
                        if (type === "tEXt") {
                            const data = new TextDecoder().decode(uint8Array.slice(index + 8, index + 8 + length));
                            if (data.startsWith("chara\0")) {
                                resolve(JSON.parse(atob(data.substring(6))));
                                return;
                            }
                        }
                        index += length + 12;
                    }
                    reject("No character data found.");
                };
                reader.onerror = () => reject("Error reading file.");
                reader.readAsArrayBuffer(blob);
            });
        });
    }

    if (window.location.hostname.includes('perchance.org')) {
        setTimeout(() => {
            const characterCardUrl = getQueryParam('characterCard');
            if (characterCardUrl) {
                const messageInput = document.querySelector("#messageInput");
                if (messageInput) {
                    messageInput.value = "!readimage " + decodeURIComponent(characterCardUrl);
                    document.querySelector("#sendButton").click();
                }
            }
        }, 500);
    }
})();

// ==UserScript==
// @name         Tinder Unblur with Names
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Unblur Tinder fast match teasers and show names
// @match        https://tinder.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521179/Tinder%20Unblur%20with%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/521179/Tinder%20Unblur%20with%20Names.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getAuthToken() {
        return localStorage.getItem("TinderWeb/APIToken");
    }

    async function unblur() {
        const authToken = getAuthToken();
        if (!authToken) {
            console.error("Tinder Unblur: Auth token not found.");
            return;
        }

        try {
            const response = await fetch("https://api.gotinder.com/v2/fast-match/teasers", {
                headers: {
                    "X-Auth-Token": authToken,
                    "Platform": "android",
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.error(`Tinder Unblur: Fetch error - ${response.statusText}`);
                return;
            }

            const data = await response.json();
            const teasers = data?.data?.results;

            if (!teasers || !Array.isArray(teasers)) {
                console.error("Tinder Unblur: Invalid teaser data.");
                return;
            }

            const teaserEls = document.querySelectorAll(
                ".Expand.enterAnimationContainer > div:nth-child(1)"
            );

            teasers.forEach((teaser, index) => {
                const teaserEl = teaserEls[index];
                if (teaserEl && teaser.user && teaser.user.photos && teaser.user.photos.length > 0) {
                    const photo = teaser.user.photos[0];
                    const teaserImage = `https://preview.gotinder.com/${teaser.user._id}/original_${photo.id}.jpeg`;
                    teaserEl.style.backgroundImage = `url(${teaserImage})`;
                    teaserEl.style.filter = 'none';

                    // Añadir el nombre
                    const nameDiv = document.createElement('div');
                    nameDiv.textContent = teaser.user.name || "Sin nombre";
                    nameDiv.style.position = 'absolute';
                    nameDiv.style.bottom = '10px';
                    nameDiv.style.left = '10px';
                    nameDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                    nameDiv.style.color = 'white';
                    nameDiv.style.padding = '5px 10px';
                    nameDiv.style.borderRadius = '5px';
                    nameDiv.style.fontSize = '14px';
                    nameDiv.style.fontWeight = 'bold';
                    nameDiv.style.zIndex = '1000';

                    // Añadir edad si está disponible
                    if (teaser.user.birth_date) {
                        const age = new Date().getFullYear() - new Date(teaser.user.birth_date).getFullYear();
                        nameDiv.textContent += `, ${age}`;
                    }

                    // Remover cualquier nombre existente antes de añadir el nuevo
                    const existingName = teaserEl.querySelector('.tinder-name-overlay');
                    if (existingName) {
                        existingName.remove();
                    }

                    nameDiv.classList.add('tinder-name-overlay');
                    teaserEl.appendChild(nameDiv);
                }
            });

            console.log("Tinder Unblur: Images unblurred and names added successfully.");
        } catch (error) {
            console.error("Tinder Unblur: Error during unblur process.", error);
        }
    }

    window.addEventListener('load', () => {
        setTimeout(unblur, 3000);
    });

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                unblur();
            }
        }
    });

    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);

    const unblurButton = document.createElement('button');
    unblurButton.textContent = 'Desbloquear Imágenes y Mostrar Nombres';
    unblurButton.style.position = 'fixed';
    unblurButton.style.top = '10px';
    unblurButton.style.left = '50%';
    unblurButton.style.transform = 'translateX(-50%)';
    unblurButton.style.zIndex = '9999';
    unblurButton.style.backgroundColor = '#FE3C72';
    unblurButton.style.color = '#FFFFFF';
    unblurButton.style.border = 'none';
    unblurButton.style.borderRadius = '20px';
    unblurButton.style.padding = '10px 20px';
    unblurButton.style.fontSize = '16px';
    unblurButton.style.cursor = 'pointer';
    unblurButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    unblurButton.style.transition = 'background-color 0.3s ease, transform 0.3s ease';

    unblurButton.addEventListener('mouseover', function() {
        unblurButton.style.backgroundColor = '#FF6B81';
        unblurButton.style.transform = 'translateX(-50%) scale(1.05)';
    });

    unblurButton.addEventListener('mouseout', function() {
        unblurButton.style.backgroundColor = '#FE3C72';
        unblurButton.style.transform = 'translateX(-50%) scale(1)';
    });

    unblurButton.addEventListener('click', () => {
        unblur();
        unblurButton.textContent = '¡Desbloqueado!';
        setTimeout(() => {
            unblurButton.textContent = 'Desbloquear Imágenes y Mostrar Nombres';
        }, 2000);
    });

    document.body.appendChild(unblurButton);
})();
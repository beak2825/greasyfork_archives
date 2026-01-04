// ==UserScript==
// @name         Website YEETER Macaroni EATER
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  no explanation needed.
// @author       Aadoxide
// @match        *://*/*
// @icon         https://img.icons8.com/?size=256&id=EggHJUeUuU6C&format=png
// @license      WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475427/Website%20YEETER%20Macaroni%20EATER.user.js
// @updateURL https://update.greasyfork.org/scripts/475427/Website%20YEETER%20Macaroni%20EATER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyIntenseAttraction() {
        const allElements = document.querySelectorAll('*');
        allElements.forEach((element) => {
            element.style.transition = 'all 0.2s ease-in-out';
            element.style.transform = 'scale(0.8) rotate(360deg)';
        });

        function updatePositions() {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            allElements.forEach((element) => {
                const rect = element.getBoundingClientRect();
                const deltaX = centerX - (rect.left + rect.width / 2);
                const deltaY = centerY - (rect.top + rect.height / 2);
                const newTransform = `translate(${deltaX}px, ${deltaY}px)`;

                if (
                    rect.top > window.innerHeight ||
                    rect.left > window.innerWidth ||
                    rect.bottom < 0 ||
                    rect.right < 0 ||
                    rect.bottom > window.innerHeight ||
                    rect.right > window.innerWidth
                ) {
                    element.style.transform = newTransform;
                } else {
                    element.style.transform += newTransform;
                }
            });

            if (!document.body.classList.contains('stopAttraction')) {
                requestAnimationFrame(updatePositions);
            }
        }

        updatePositions();
    }

    function applyGravityEffect() {
        const allElements = document.querySelectorAll('*');
        allElements.forEach((element) => {
            element.style.transition = 'all 3s ease-in-out';
            element.style.transform = 'translateY(100vh)';
        });
    }

    function fadeScreenToBlack() {
        const body = document.querySelector('body');
        body.style.transition = 'all 3s ease-in-out';
        body.style.backgroundColor = 'black';
        body.style.zIndex = '9999';
    }

    function redirectToImageSource() {
        window.location.href = 'https://cdn.discordapp.com/attachments/779931446991126541/1081614891116417104/1677947459418.png';
    }

    function runTheAbomination() {
            applyGravityEffect();
            setTimeout(applyIntenseAttraction, 300);
            setTimeout(fadeScreenToBlack, 3300);
            setTimeout(redirectToImageSource, 6300);
    }

    runTheAbomination()
})();
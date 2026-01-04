// ==UserScript==
// @name         Gamdle Image Viewer
// @namespace    https://github.com/xCymylx/
// @license      MIT
// @version      1.0.0
// @description  Show Gamedle.wtf answer images
// @author       Cymyl
// @match        https://www.gamedle.wtf/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamedle.wtf
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535909/Gamdle%20Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/535909/Gamdle%20Image%20Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Extract and clean a background image URL
    function extractCleanUrl(styleUrl) {
        const match = styleUrl.match(/url\(["']?(.*?\/)([^/_]+)[^/]*\.(\w+)["']?\)/);
        return match ? `${match[1]}${match[2]}.${match[3]}` : null;
    }

    // Extract original image URL from backgroundImage style
    function extractOriginalUrl(styleUrl) {
        const match = styleUrl.match(/url\(["']?(.*?)["']?\)/);
        return match ? match[1] : null;
    }

    // Set up or re-setup the button
    function createButton() {
        let button = document.getElementById('cheatButton');
        if (button) return; // already created

        button = document.createElement('button');
        button.id = 'cheatButton';
        button.className = 'eightbit-btn eightbit-btn--skip';
        button.innerText = 'Cheat!';

        button.onclick = () => {
            const lens = document.querySelector('.zoomLens');
            if (!lens || !lens.style.backgroundImage) return;

            const cleanedBgUrl = extractCleanUrl(lens.style.backgroundImage);
            const originalBgUrl = extractOriginalUrl(lens.style.backgroundImage);

            if (cleanedBgUrl) {
                lens.style.backgroundImage = `url("${cleanedBgUrl}")`;
                console.log(`zoomLens background image changed to: ${cleanedBgUrl}`);
            }

            const mainImg = document.getElementById('mainimg');
            if (mainImg && originalBgUrl) {
                const cleanedSrc = originalBgUrl.replace(/\/([^/_]+)[^/]*\.(\w+)$/, '/$1.$2');
                mainImg.src = cleanedSrc;
                console.log(`Main image src changed to: ${cleanedSrc}`);
            }
        };

        const container = document.querySelector('.button-container');
        if (container) {
            container.appendChild(button);
        } else {
            document.body.appendChild(button); // fallback
        }
    }

    // Observe dynamic content changes and ensure the button exists
    const observer = new MutationObserver(() => {
        const lens = document.querySelector('.zoomLens');
        if (lens && lens.style.backgroundImage) {
            createButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

})();
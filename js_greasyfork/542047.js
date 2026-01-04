// ==UserScript==
// @name         Libgen Series ID Switcher
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description Adds buttons to switch series ID on libgen.gl
// @match        https://libgen.gl/series.php?id=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542047/Libgen%20Series%20ID%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/542047/Libgen%20Series%20ID%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract current ID from URL
    const currentUrl = window.location.href;
    const idMatch = currentUrl.match(/id=(\d+)/);
    if (!idMatch) return;

    const currentId = parseInt(idMatch[1]);

    // Create navigation container
    const navContainer = document.createElement('div');
    navContainer.style.position = 'fixed';
    navContainer.style.top = '10px';
    navContainer.style.right = '10px';
    navContainer.style.zIndex = '9999';
    navContainer.style.backgroundColor = '#f0f0f0';
    navContainer.style.padding = '10px';
    navContainer.style.borderRadius = '5px';
    navContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';

    // Create input field
    const idInput = document.createElement('input');
    idInput.type = 'number';
    idInput.value = currentId;
    idInput.style.width = '80px';
    idInput.style.marginRight = '5px';
    idInput.style.padding = '5px';

    // Create previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = '◄';
    prevButton.style.marginRight = '5px';
    prevButton.style.padding = '5px 10px';

    // Create next button
    const nextButton = document.createElement('button');
    nextButton.textContent = '►';
    nextButton.style.marginRight = '5px';
    nextButton.style.padding = '5px 10px';

    // Create random button
    const randomButton = document.createElement('button');
    randomButton.textContent = '🎲';
    randomButton.style.padding = '5px 10px';
    randomButton.title = 'Random ID';

    // Create go button
    const goButton = document.createElement('button');
    goButton.textContent = 'GO';
    goButton.style.padding = '5px 10px';
    goButton.style.marginLeft = '5px';

    // Add elements to container
    navContainer.appendChild(prevButton);
    navContainer.appendChild(nextButton);
    navContainer.appendChild(idInput);
    navContainer.appendChild(goButton);
    navContainer.appendChild(randomButton);

    // Add container to page
    document.body.appendChild(navContainer);

    // Function to navigate to new ID
    function navigateToId(newId) {
        if (isNaN(newId) || newId < 1) return;
        window.location.href = `https://libgen.gl/series.php?id=${newId}`;
    }

    // Event listeners
    prevButton.addEventListener('click', () => {
        const newId = currentId - 1;
        idInput.value = newId;
        navigateToId(newId);
    });

    nextButton.addEventListener('click', () => {
        const newId = currentId + 1;
        idInput.value = newId;
        navigateToId(newId);
    });

    goButton.addEventListener('click', () => {
        const newId = parseInt(idInput.value);
        navigateToId(newId);
    });

    randomButton.addEventListener('click', () => {
        // Random ID between 1 and 10000 (adjust range as needed)
        const randomId = Math.floor(Math.random() * 10000) + 1;
        idInput.value = randomId;
        navigateToId(randomId);
    });

    idInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const newId = parseInt(idInput.value);
            navigateToId(newId);
        }
    });
})();
// ==UserScript==
// @name         Autosoydueler 0.0.2.
// @namespace    http://tampermonkey.net/
// @version      2024-08-25
// @description  Autosoyduels for (You).
// @author       You
// @match        https://soyjak.party
// @icon         https://files.catbox.moe/we34si.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505078/Autosoydueler%20002.user.js
// @updateURL https://update.greasyfork.org/scripts/505078/Autosoydueler%20002.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (function() {
    // Array of random image URLs
    const imageUrls = [
'https://files.catbox.moe/o65dcm.png', 'https://files.catbox.moe/lo0f95.png', 'https://files.catbox.moe/o5y1d2.png', 'https://files.catbox.moe/3m8djk.jpg', 'https://files.catbox.moe/huadv1.png', 'https://files.catbox.moe/4kf3gd.png', 'https://files.catbox.moe/1mekw2.png', 'https://files.catbox.moe/ilsqfp.png', 'https://files.catbox.moe/oh5isy.png', 'https://files.catbox.moe/pvmlw6.png', 'https://files.catbox.moe/m2qqvr.png', 'https://files.catbox.moe/o9n3zn.png', 'https://files.catbox.moe/al8p5u.jpeg', 'https://files.catbox.moe/4ie4c3.png', 'https://files.catbox.moe/z7e1gz.png', 'https://files.catbox.moe/sr4x00.gif', 'https://files.catbox.moe/0oo9we.png', 'https://files.catbox.moe/8bn2k3.png', 'https://files.catbox.moe/911hj5.gif', 'https://files.catbox.moe/ahq4ct.png', 'https://files.catbox.moe/9kmta5.gif', 'https://files.catbox.moe/x9czr0.png', 'https://files.catbox.moe/0ldwzs.png', 'https://files.catbox.moe/mef5zr.png', 'https://files.catbox.moe/truy4j.gif', 'https://files.catbox.moe/omz7ld.png', 'https://files.catbox.moe/4evtxq.png', 'https://files.catbox.moe/jnvcr3.png', 'https://files.catbox.moe/jadvn9.gif', 'https://files.catbox.moe/9f2m4h.gif', 'https://files.catbox.moe/3ty6hr.gif', 'https://files.catbox.moe/43mydp.png', 'https://files.catbox.moe/zkm2ba.gif', 'https://files.catbox.moe/2u1sru.png', 'https://files.catbox.moe/50scst.png', 'https://files.catbox.moe/rl6tb4.png', 'https://files.catbox.moe/rcyoo7.png', 'https://files.catbox.moe/4qxqve.png', 'https://files.catbox.moe/6720cv.png', 'https://files.catbox.moe/d7nzww.gif', 'https://files.catbox.moe/6eawxf.png', 'https://files.catbox.moe/xq6ff5.png', 'https://files.catbox.moe/vzhlzc.png', 'https://files.catbox.moe/xu5lmv.png', 'https://files.catbox.moe/8rde5g.png', 'https://files.catbox.moe/i1b6ub.png', 'https://files.catbox.moe/9nv3lk.gif', 'https://files.catbox.moe/fcwjtz.gif', 'https://files.catbox.moe/8d3az8.gif', 'https://files.catbox.moe/8da7hi.png', 'https://files.catbox.moe/735xzo.png', 'https://files.catbox.moe/pqhbvh.png', 'https://files.catbox.moe/0kwdex.gif', 'https://files.catbox.moe/9roa4i.png', 'https://files.catbox.moe/nuzieo.gif', 'https://files.catbox.moe/g15z1u.gif', 'https://files.catbox.moe/z8hsk4.gif', 'https://files.catbox.moe/2ggbd4.png', 'https://files.catbox.moe/2svgzp.png', 'https://files.catbox.moe/3zym3y.png', 'https://files.catbox.moe/sya05l.png'
    ];

    // Helper function to get a random item from an array
    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Function to simulate a file drop on the dropzone
    async function simulateFileDrop() {
        const randomImageUrl = getRandomItem(imageUrls);
        const imageName = randomImageUrl.split('/').pop();
        // Fetch the image data
        try {
            const response = await fetch(randomImageUrl, { mode: 'cors' });
            if (!response.ok) {
                console.error('Failed to fetch image:', randomImageUrl);
                return;
            }

            const blob = await response.blob();
            const file = new File([blob], imageName, { type: blob.type });


            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);


            const dropzone = document.querySelector('.dropzone');
            if (dropzone) {
                const dropEvent = new DragEvent('drop', {
                    dataTransfer: dataTransfer,
                    bubbles: true,
                    cancelable: true
                });
                dropzone.dispatchEvent(dropEvent);
            } else {
                console.error('Dropzone element not found.');
            }
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    }

    function clickQuoteButtons() {
        const buttons = document.querySelectorAll('a.post_quote');
        buttons.forEach(button => {
            if (!button.dataset.clicked) {
                button.click();
                button.dataset.clicked = 'true';
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                clickQuoteButtons();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function populateForm() {
        simulateFileDrop();

        setTimeout(() => {
            const submitButton = document.querySelector('input[name="post"]');
            if (submitButton) {
                submitButton.click();
            } else {
                console.error('Submit button not found.');
            }
        }, 2000); //2 seconds for the soicacas that cant read ms
    }
    clickQuoteButtons();
    setInterval(populateForm, 13000);
})();

})();
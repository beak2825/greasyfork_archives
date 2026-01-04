// ==UserScript==
// @name         instagram DM Resizer
// @namespace    instagramDMResizer
// @version      1.0.0
// @description  Set your Instagram DM Sizes
// @author       Runterya
// @homepage     https://github.com/Runteryaa
// @match        *://*.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// @license      MIT
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/487312/instagram%20DM%20Resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/487312/instagram%20DM%20Resizer.meta.js
// ==/UserScript==

console.log("InstagramDMResizer")

window.addEventListener('load', () => {
    if (!localStorage.getItem('defaultDM')) {
        localStorage.setItem('defaultDM', 400);
    }

    const findDMDiv = () => {
        const defaultDMWidth = parseFloat(localStorage.getItem('defaultDM'));
        const targetElement = document.querySelector('[aria-label="Thread list"]');
        const dmContainer = targetElement.firstChild;
        dmContainer.style.width = defaultDMWidth + 'px';
        dmContainer.classList.remove('x13tiff3');

        let resetDM = document.getElementById('resetDM');
        if (!resetDM) {
            const resetDM = document.createElement('button');

            resetDM.textContent = 'Reset DM Size'
            resetDM.id = 'resetDM'
            resetDM.style.padding = '5px'
            resetDM.style.cursor = 'pointer'
            resetDM.addEventListener('click', () => {
                localStorage.setItem('defaultDM', 400);
            });

            const dminfo = document.querySelector('[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x6s0dn4 x1swvt13 x1pi30zi"]');
            dminfo.insertBefore(document.createElement('br'), dminfo.firstChild);
            dminfo.insertBefore(document.createElement('br'), dminfo.firstChild);
            dminfo.insertBefore(resetDM, dminfo.firstChild);

        }


        // Create a drag bar
        let dragBar = document.getElementById('dragBar');
        if (!dragBar) {
            // Create a drag bar
            dragBar = document.createElement('div');
            dragBar.id = 'dragBar';
            dragBar.style.width = '10px';
            dragBar.style.height = '100%';
            dragBar.style.position = 'absolute';
            dragBar.style.right = '-1px';
            dragBar.style.top = '0';
            dragBar.style.cursor = 'ew-resize';
            dmContainer.appendChild(dragBar);
        }

        let isDragging = false;
        let startX = 0;
        let startWidth = defaultDMWidth;

        // Event listeners for drag bar
        dragBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX;
            startWidth = parseFloat(getComputedStyle(dmContainer, null).getPropertyValue('width'));
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const width = startWidth + (e.pageX - startX);
            dmContainer.style.width = width + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            localStorage.setItem('defaultDM', parseFloat(dmContainer.style.width));
        });
    }

    setInterval(() => {
        findDMDiv();
    }, 1000);

    // Mutation observer to handle changes in the DOM
    new MutationObserver(() => {
        // Here you can handle changes in the DOM if needed
    }).observe(document.body, { childList: true, subtree: true });
});


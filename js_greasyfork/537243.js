// ==UserScript==
// @name         Google One
// @namespace    https://chat.openai.com/
// @version      1.3
// @description  Adds Google One Premium-style ring around avatars and shows a bigger premium ring on avatar click
// @match        *://*.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537243/Google%20One.user.js
// @updateURL https://update.greasyfork.org/scripts/537243/Google%20One.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // SVG for the small premium ring around all avatars
    const smallRingSVG = `
        <svg class="google-premium-ring" focusable="false" height="40px" version="1.1"
             viewBox="0 0 40 40" width="40px" xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink" style="position:absolute;top:0;left:0;z-index:1;">
            <path d="M4.02,28.27C2.73,25.8,2,22.98,2,20c0-2.87,0.68-5.59,1.88-8l-1.72-1.04C0.78,13.67,0,16.75,0,20
                     c0,3.31,0.8,6.43,2.23,9.18L4.02,28.27z" fill="#F6AD01"></path>
            <path d="M32.15,33.27C28.95,36.21,24.68,38,20,38c-6.95,0-12.98-3.95-15.99-9.73l-1.79,0.91C5.55,35.61,
                     12.26,40,20,40c5.2,0,9.93-1.98,13.48-5.23L32.15,33.27z" fill="#249A41"></path>
            <path d="M33.49,34.77C37.49,31.12,40,25.85,40,20c0-5.86-2.52-11.13-6.54-14.79l-1.37,1.46C35.72,9.97,
                     38,14.72,38,20c0,5.25-2.26,9.98-5.85,13.27L33.49,34.77z" fill="#3174F1"></path>
            <path d="M20,2c4.65,0,8.89,1.77,12.09,4.67l1.37-1.46C29.91,1.97,25.19,0,20,0l0,0C12.21,0,5.46,4.46,
                     2.16,10.96L3.88,12C6.83,6.08,12.95,2,20,2" fill="#E92D18"></path>
        </svg>`;

    // SVG for the bigger ring shown on avatar click
    const bigRingSVG = `
        <svg focusable="false" xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88" fill="none" style="position: absolute; top: 0; left: 0; z-index: 10; pointer-events: none;">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.54186 25.1943C13.4332 11.4946 27.619 2.09524 44.0001 2.09524C54.8512 2.09524 64.7391 6.21967 72.1814 12.9864L73.6119 11.4618C65.8019 4.33354 55.4184 0 44.0002 0C26.862 0 12.012 9.81177 4.75195 24.1118L6.54186 25.1943Z" fill="#E92D18"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M72.2777 74.9259C80.6525 67.264 85.9049 56.2454 85.9049 44C85.9049 31.7078 80.6122 20.6517 72.1814 12.9863L73.6118 11.4618C82.4565 19.5136 88.0001 31.13 88.0001 44C88.0001 56.87 82.4783 68.4636 73.6783 76.4936L72.2777 74.9259Z" fill="#3174F1"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.7633 63.2399L4.88354 64.1953C12.21 78.3418 26.9718 87.9989 44 87.9989C55.44 87.9989 65.8465 83.6424 73.6565 76.4924L72.2718 74.9311C64.8192 81.7468 54.8952 85.9048 43.9999 85.9048C27.7925 85.9048 13.734 76.7036 6.7633 63.2399Z" fill="#249A41"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.54202 25.1938L4.75292 24.1118C1.71646 30.0736 0 36.85 0 44C0 51.15 1.76 58.1465 4.90646 64.1965L6.76859 63.25C3.78227 57.4858 2.09524 50.9399 2.09524 44C2.09524 37.2376 3.69708 30.8493 6.54202 25.1938Z" fill="#F6AD01"></path>
        </svg>`;

    // Add CSS for small avatar ring
    const style = document.createElement('style');
    style.textContent = `
        .avatar-wrapper {
            position: relative;
            width: 40px;
            height: 40px;
        }
        .avatar-wrapper img {
            position: absolute;
            top: 4px;
            left: 4px;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            z-index: 2;
        }
    `;
    document.head.appendChild(style);

    // Wrap avatars with small ring
    function wrapAvatar(img) {
        if (img.closest('.avatar-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'avatar-wrapper';
        wrapper.innerHTML = smallRingSVG;

        const clone = img.cloneNode(true);
        wrapper.appendChild(clone);
        img.replaceWith(wrapper);
    }

    function processAvatars() {
        document.querySelectorAll('img.gb_P:not(.processed-avatar)').forEach(img => {
            img.classList.add('processed-avatar');
            wrapAvatar(img);
        });
    }

    // Big ring injection around clicked avatar in profile dropdown
    function injectBigRingAroundAvatar() {
        const avatar = document.querySelector('div.XS2qof img');

        if (!avatar || avatar.dataset.ringApplied === "true") return;

        const parent = avatar.closest('div.XS2qof');
        if (!parent) return;

        parent.style.position = 'relative';
        avatar.dataset.ringApplied = "true";

        const wrapper = document.createElement('div');
        wrapper.style.width = '88px';
        wrapper.style.height = '88px';
        wrapper.style.position = 'relative';

        avatar.style.position = 'relative';
        avatar.style.zIndex = '5';

        const ring = document.createElement('div');
        ring.innerHTML = bigRingSVG;

        avatar.parentNode.insertBefore(wrapper, avatar);
        wrapper.appendChild(avatar);
        wrapper.appendChild(ring);
    }

    // Observers and intervals
    const observerSmall = new MutationObserver(processAvatars);
    observerSmall.observe(document.body, { childList: true, subtree: true });

    const observerBig = new MutationObserver(() => {
        injectBigRingAroundAvatar();
    });
    observerBig.observe(document.body, { childList: true, subtree: true });

    setInterval(() => {
        injectBigRingAroundAvatar();
    }, 1000);

    // Initial call
    processAvatars();

})();
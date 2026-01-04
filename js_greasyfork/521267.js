// ==UserScript==
// @name         GeoGuessr Random Copyright Overlay (NMPZ only)
// @description  Overlay random copyrights on NMPZ to discourage copyright meta, very initial beta for testing
// @namespace    https://www.geoguessr.com/
// @version      0.1
// @author       bober
// @match        https://www.geoguessr.com/*
// @grant        none
// @run-at       document-start
// @license GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/521267/GeoGuessr%20Random%20Copyright%20Overlay%20%28NMPZ%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521267/GeoGuessr%20Random%20Copyright%20Overlay%20%28NMPZ%20only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addRandomCopyrightOverlay() {
        // Wait until the main canvas is available
        const interval = setInterval(() => {
            const svCanvas = document.querySelector('canvas');
            if (svCanvas && svCanvas.offsetWidth > 0 && svCanvas.offsetHeight > 0) {
                clearInterval(interval);

                // Create overlay container
                const overlay = document.createElement('div');
                Object.assign(overlay.style, {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    pointerEvents: 'none',
                    width: svCanvas.offsetWidth + 'px',
                    height: svCanvas.offsetHeight + 'px',
                    overflow: 'hidden',
                    zIndex: '9999'
                });

                let parent = svCanvas.parentNode;
                if (window.getComputedStyle(parent).position === 'static') {
                    parent.style.position = 'relative';
                }
                parent.appendChild(overlay);

                function randomYear() {
                    return Math.floor(Math.random() * 14) + 2010;
                }

                function randomPosition(maxWidth, maxHeight) {
                    const x = Math.floor(Math.random() * maxWidth);
                    const y = Math.floor(Math.random() * maxHeight);
                    return { x, y };
                }

                overlay.style.perspective = '1000px';

                // Lower the vanishing point by adding an offset to canvasCenterY
                const verticalOffset = 200; // Adjust this value as needed
                const canvasCenterX = svCanvas.offsetWidth / 2;
                const canvasCenterY = (svCanvas.offsetHeight / 2) + verticalOffset;

                const maxAngle = 40;
                const skewFactor = 5;

                function randomFontSize() {
                    // Random size between 10px and 20px
                    const size = Math.floor(Math.random() * 6) + 10;
                    return size + 'px';
                }

                function addFakeCopyright() {
                    const fake = document.createElement('span');
                    fake.textContent = `© ${randomYear()} Google`;

                    // Randomize font size
                    const fontSize = randomFontSize();

                    Object.assign(fake.style, {
                        position: 'absolute',
                        color: 'rgba(255,255,255,0.2)',
                        fontSize: fontSize,
                        fontFamily: 'Arial, sans-serif',
                        background: 'transparent',
                        padding: '0',
                        borderRadius: '0',
                        whiteSpace: 'nowrap',
                        transformOrigin: 'center center'
                    });

                    const pos = randomPosition(svCanvas.offsetWidth - 60, svCanvas.offsetHeight - 10);
                    const dx = pos.x - canvasCenterX;
                    const dy = pos.y - canvasCenterY;

                    const angleY = -(dx / canvasCenterX) * maxAngle;
                    const angleX = -(dy / canvasCenterY) * maxAngle;

                    const skewXAngle = (dy / canvasCenterY) * skewFactor;
                    const skewYAngle = (dx / canvasCenterX) * skewFactor;

                    fake.style.left = pos.x + 'px';
                    fake.style.top = pos.y + 'px';
                    fake.style.transform = `translate(-50%, -50%) rotateX(${angleX}deg) rotateY(${angleY}deg) skewX(${skewXAngle}deg) skewY(${skewYAngle}deg)`;

                    overlay.appendChild(fake);
                }

                for (let i = 0; i < 20; i++) {
                    addFakeCopyright();
                }
            }
        }, 1000);
    }

    window.addEventListener('load', () => {
        addRandomCopyrightOverlay();
    });

})();

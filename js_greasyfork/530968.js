// ==UserScript==
// @name         Make Torn Twerk
// @namespace    http://tampermonkey.net/
// @version      69.420
// @description  I was bored so I made Torn twerk
// @author       Weav3r
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/530968/Make%20Torn%20Twerk.user.js
// @updateURL https://update.greasyfork.org/scripts/530968/Make%20Torn%20Twerk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        const button = document.createElement('div');
        button.innerHTML = '🍑';
        button.style.position = 'fixed';
        button.style.top = '50%';
        button.style.right = '20px';
        button.style.width = '50px';
        button.style.height = '50px';
        button.style.borderRadius = '50%';
        button.style.backgroundColor = '#f44336';
        button.style.color = 'white';
        button.style.fontSize = '24px';
        button.style.display = 'flex';
        button.style.justifyContent = 'center';
        button.style.alignItems = 'center';
        button.style.cursor = 'pointer';
        button.style.zIndex = '2147483647';
        button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        button.style.transition = 'transform 0.2s';

        button.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });

        let twerking = false;
        let twerkInterval;
        let intensity = 0;
        const maxIntensity = 15;
        let twerkPhase = 0;

        function setupTwerkElements() {
            const existingTwerkElements = document.querySelectorAll('.twerk-overlay, .twerk-bottom');
            existingTwerkElements.forEach(el => el.remove());

            const mainContent = document.getElementById('mainContainer') || document.body;

            const overlay = document.createElement('div');
            overlay.className = 'twerk-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.pointerEvents = 'none';
            overlay.style.zIndex = '2147483646';
            document.body.appendChild(overlay);

            const pageHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );

            const bottomIndicator = document.createElement('div');
            bottomIndicator.className = 'twerk-bottom';
            bottomIndicator.style.position = 'fixed';
            bottomIndicator.style.bottom = '0';
            bottomIndicator.style.left = '0';
            bottomIndicator.style.width = '100%';
            bottomIndicator.style.height = '40%';
            bottomIndicator.style.background = 'linear-gradient(to bottom, rgba(244, 67, 54, 0) 0%, rgba(244, 67, 54, 0.05) 100%)';
            bottomIndicator.style.pointerEvents = 'none';
            bottomIndicator.style.zIndex = '2147483645';
            bottomIndicator.style.display = 'none';
            document.body.appendChild(bottomIndicator);

            return { overlay, bottomIndicator };
        }

        function twerkPage() {
            const bottomIndicator = document.querySelector('.twerk-bottom');

            if (bottomIndicator) {
                bottomIndicator.style.display = 'block';
            }

            const bounce = Math.sin(twerkPhase * 2) * (intensity * 0.8);
            const popOut = Math.max(0, Math.sin(twerkPhase * 2)) * (intensity * 0.5);

            if (bottomIndicator) {
                bottomIndicator.style.transform = `translateZ(0) translateY(${bounce}px) scaleX(${1 + popOut * 0.02}) scaleY(${1 + popOut * 0.05})`;
                bottomIndicator.style.transformOrigin = 'center bottom';
            }

            document.body.style.perspective = '1000px';

            const tilt = Math.sin(twerkPhase) * (intensity * 0.4);
            document.body.style.transform = `perspective(1000px) rotateX(${tilt}deg)`;
            document.body.style.transformOrigin = 'center 70%';

            const allElements = document.querySelectorAll('div, p, span, img, table, a');

            const viewportHeight = window.innerHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            allElements.forEach(element => {
                if (element === button) return;

                const rect = element.getBoundingClientRect();

                if (rect.top > viewportHeight * 0.6) {
                    const bottomRatio = (rect.top - (viewportHeight * 0.6)) / (viewportHeight * 0.4);

                    const elementBounce = bounce * bottomRatio * 1.5;
                    const elementPopOut = popOut * bottomRatio * 1.5;

                    element.style.transform = `translateY(${elementBounce}px) scale(${1 + elementPopOut * 0.01})`;
                    element.style.transformOrigin = 'center bottom';
                }
            });

            twerkPhase += 0.2;
        }

        function resetPage() {
            document.body.style.transform = 'none';
            document.body.style.perspective = 'none';

            const allElements = document.querySelectorAll('div, p, span, img, table, a');
            allElements.forEach(element => {
                if (element === button) return;
                element.style.transform = '';
            });

            const bottomIndicator = document.querySelector('.twerk-bottom');
            if (bottomIndicator) {
                bottomIndicator.style.display = 'none';
            }

            twerkPhase = 0;
        }

        button.addEventListener('click', function() {
            if (twerking) {
                clearInterval(twerkInterval);
                resetPage();
                twerking = false;
                intensity = 0;
                button.innerHTML = '🍑';

                const twerkElements = document.querySelectorAll('.twerk-overlay, .twerk-bottom');
                twerkElements.forEach(el => el.remove());

            } else {
                twerking = true;
                button.innerHTML = '🛑';
                intensity = 8;

                setupTwerkElements();

                twerkInterval = setInterval(function() {
                    twerkPage();
                }, 30);
            }
        });

        button.addEventListener('mousedown', function() {
            if (twerking) {
                const intensityInterval = setInterval(function() {
                    if (intensity < maxIntensity) {
                        intensity += 0.5;
                    }
                }, 100);

                document.addEventListener('mouseup', function clearIntensity() {
                    clearInterval(intensityInterval);
                    document.removeEventListener('mouseup', clearIntensity);
                });
            }
        });

        document.body.appendChild(button);
    });
})();
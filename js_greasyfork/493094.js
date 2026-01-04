// ==UserScript==
// @name         NBA.com - Complete Spoiler Blocker and Element Remover
// @version      1.2
// @description  Enhances NBA.com by hiding video lengths and adding fictitious durations to the progress bar to prevent spoilers. It also removes hover elements and their backgrounds in the video player.
// @author       You
// @match        *://*.nba.com/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1291378
// @downloadURL https://update.greasyfork.org/scripts/493094/NBAcom%20-%20Complete%20Spoiler%20Blocker%20and%20Element%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/493094/NBAcom%20-%20Complete%20Spoiler%20Blocker%20and%20Element%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(showToast, 500); // Delaying the toast display by 500 milliseconds

        if (window.location.href === 'https://www.nba.com/') {
            // Inject CSS to hide specific elements as soon as the page starts loading.
            const css = '.MaxWidthContainer_mwc__ID5AG { display: none !important; }';
            const head = document.head || document.getElementsByTagName('head')[0];
            const style = document.createElement('style');
            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            head.appendChild(style);
        }

        if (!window.location.search.includes('watchLive=true')) {
            function getRandomMaxLength() {
                const threeHoursInSeconds = 3 * 60 * 60;
                const oneHourInSeconds = 60 * 60;
                return threeHoursInSeconds + Math.floor(Math.random() * oneHourInSeconds);
            }

            const standardMaxLength = getRandomMaxLength();

            function randomizeProgressBar() {
                const progressBar = document.getElementById('progress-bar');
                const rangeInput = document.querySelector('.sc-beqWaB.bpZMgR input[type="range"]');
                if (progressBar && rangeInput) {
                    progressBar.max = standardMaxLength;
                    rangeInput.max = standardMaxLength;
                    rangeInput.setAttribute('aria-valuemax', standardMaxLength);
                }
            }

            function hideTimeElements() {
                const timePattern = /\b\d{2}:\d{2}:\d{2}\b/;
                const spans = document.querySelectorAll('span');
                spans.forEach(span => {
                    if (timePattern.test(span.innerText)) {
                        span.style.display = 'none';
                    }
                });
            }

            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' || mutation.type === 'attributes') {
                        hideTimeElements();
                    }
                });
            });

            observer.observe(document.body, {
                attributes: true,
                childList: true,
                subtree: true
            });

            setInterval(randomizeProgressBar, 1000);
            hideTimeElements();
        }

        function removeHoverElements() {
            // Hiding the primary container that includes the hover elements and their backgrounds
            const containers = document.querySelectorAll('.sc-hneQBV');
            containers.forEach(container => container.style.display = 'none');
        }

        const hoverObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    removeHoverElements();
                }
            });
        });

        hoverObserver.observe(document.body, { childList: true, subtree: true });

        removeHoverElements(); // Initial check and remove any existing elements on load

        function showToast() {
            const toast = document.createElement('div');
            toast.textContent = 'NBA Spoiler Blocker has been activated!';
            toast.style.position = 'fixed';
            toast.style.top = '20px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.padding = '10px 20px';
            toast.style.color = '#FFF';
            toast.style.background = '#FF0000';
            toast.style.borderRadius = '5px';
            toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
            toast.style.zIndex = '99999';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }
    });
})();

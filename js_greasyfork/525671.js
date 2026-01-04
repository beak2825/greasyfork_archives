// ==UserScript==
// @name         Gelbooru "Index" Button & Page Swiping
// @namespace    https://gelbooru.com/
// @version      2.0
// @description  Adds an "Index" button on post pages, allowing you to return to a search starting from the ID of the current post you're on, and provides swiping next/previous on mobile
// @match        https://gelbooru.com/index.php?page=post&s=view*
// @icon         https://gelbooru.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525671/Gelbooru%20%22Index%22%20Button%20%20Page%20Swiping.user.js
// @updateURL https://update.greasyfork.org/scripts/525671/Gelbooru%20%22Index%22%20Button%20%20Page%20Swiping.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ensure we're on gelbooru
    if (location.hostname !== 'gelbooru.com') return;

    (function addIndexButton() {
        const url = new URL(window.location.href);
        const urlParams = url.searchParams;

        const currentId = urlParams.get('id');
        if (!currentId) return;

        urlParams.delete('id');
        urlParams.set('s', 'list');

        const rawTags = urlParams.get('tags') || '';
        let decodedTags = decodeURIComponent(rawTags);

        const newIdSearch = 'id:=<' + currentId;

        const idSearchRegex = /id:=<\d+/i;
        if (idSearchRegex.test(decodedTags)) {
            decodedTags = decodedTags.replace(idSearchRegex, newIdSearch);
        } else {
            decodedTags = decodedTags.trim();
            if (decodedTags) decodedTags += ' ';
            decodedTags += newIdSearch;
        }

        urlParams.set('tags', decodedTags.trim());

        const finalUrl = `${url.origin}${url.pathname}?${urlParams.toString()}`;

        const box = document.createElement('div');
        box.className = 'alert alert-info';
        box.style.textAlign = 'center';
        box.style.margin = '10px 0px';
        box.style.padding = '10px';

        const indexLink = document.createElement('a');
        indexLink.textContent = 'Index';
        indexLink.href = finalUrl;

        box.appendChild(indexLink);

        const navContainers = document.querySelectorAll('.alert.alert-info');
        if (navContainers.length > 0) {
            navContainers[navContainers.length - 1].insertAdjacentElement('afterend', box);
        } else {
            const mainBody = document.querySelector('.mainBodyPadding');
            if (mainBody) mainBody.appendChild(box);
        }
    })();

    (function addSwipeNavigation() {
        if (typeof navigatePrev !== 'function' || typeof navigateNext !== 'function') {
            return;
        }

        let startX = 0;
        const threshold = 50; //works on my machine, can't be bothered to see how this feels on different resolutions

        document.addEventListener('touchstart', (e) => {
            if (e.changedTouches.length > 0) {
                startX = e.changedTouches[0].screenX;
            }
        });

        document.addEventListener('touchend', (e) => {
            if (e.changedTouches.length > 0) {
                const endX = e.changedTouches[0].screenX;
                const diffX = endX - startX;

                if (diffX > threshold) {
                    showArrowOverlay('left', navigatePrev);
                } else if (diffX < -threshold) {
                    showArrowOverlay('right', navigateNext);
                }
            }
        });

        function showArrowOverlay(direction, callback) {
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.zIndex = '999999';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';

            const arrowWrapper = document.createElement('div');
            arrowWrapper.style.animation = 'arrowAnimation 0.3s forwards ease-out';
            arrowWrapper.style.display = 'flex';
            arrowWrapper.style.alignItems = 'center';
            arrowWrapper.style.justifyContent = 'center';

            const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            arrowSvg.setAttribute('viewBox', '0 0 100 100');
            arrowSvg.setAttribute('width', '120');
            arrowSvg.setAttribute('height', '120');

            const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            bgCircle.setAttribute('cx', '50');
            bgCircle.setAttribute('cy', '50');
            bgCircle.setAttribute('r', '45');
            bgCircle.setAttribute('fill', 'rgba(0,0,0,0.3)');
            arrowSvg.appendChild(bgCircle);

            const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            arrowPath.setAttribute('fill', 'none');
            arrowPath.setAttribute('stroke', 'white');
            arrowPath.setAttribute('stroke-width', '10');

            if (direction === 'left') {
                arrowPath.setAttribute('d', 'M70 20 L30 50 L70 80');
            } else { // right
                arrowPath.setAttribute('d', 'M30 20 L70 50 L30 80');
            }
            arrowSvg.appendChild(arrowPath);

            arrowWrapper.appendChild(arrowSvg);
            overlay.appendChild(arrowWrapper);
            document.body.appendChild(overlay);

            setTimeout(() => {
                document.body.removeChild(overlay);
                callback();
            }, 100);
        }

        const styleEl = document.createElement('style');
        styleEl.textContent = `
@keyframes arrowAnimation {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}`;
        document.head.appendChild(styleEl);
    })();
})();

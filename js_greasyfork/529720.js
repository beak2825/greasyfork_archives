// ==UserScript==
// @name         Cobalt Tools (YouTube Bulk Downloader)
// @description  Integrates a cobalt.tools button into YouTube channel pages, directing users to a bulk video download page.
// @icon         https://raw.githubusercontent.com/exyezed/cobalt-tools/refs/heads/main/extras/cobalt-tools.png
// @version      1.1
// @author       exyezed
// @namespace    https://github.com/exyezed/cobalt-tools/
// @supportURL   https://github.com/exyezed/cobalt-tools/issues
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529720/Cobalt%20Tools%20%28YouTube%20Bulk%20Downloader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529720/Cobalt%20Tools%20%28YouTube%20Bulk%20Downloader%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const customStyle = document.createElement('style');
    customStyle.textContent = `
        .cobalt-tools-text {
            font-family: 'IBM Plex Mono', monospace !important;
            font-weight: 500 !important;
        }
    `;
    document.head.appendChild(customStyle);

    function getChannelIdentifier() {
        const url = window.location.href;
        let identifier = '';

        if (url.includes('/channel/')) {
            identifier = url.split('/channel/')[1].split('/')[0];
        } else if (url.includes('/@')) {
            identifier = url.split('/@')[1].split('/')[0];
        }

        return identifier;
    }

    function createCobaltButton() {
        const containerDiv = document.createElement('div');
        containerDiv.className = 'yt-flexible-actions-view-model-wiz__action cobalt-tools-container';

        const buttonViewModel = document.createElement('button-view-model');
        buttonViewModel.className = 'yt-spec-button-view-model cobalt-tools-view-model';

        const button = document.createElement('button');
        button.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--outline yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--enable-backdrop-filter-experiment cobalt-tools-button';
        button.setAttribute('aria-disabled', 'false');
        button.setAttribute('aria-label', 'open in cobalt.tools');
        button.id = 'cobalt-tools-button';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.gap = '8px';

        button.addEventListener('click', () => {
            const identifier = getChannelIdentifier();
            if (identifier) {
                const url = `https://cobaltapis.vercel.app/channel/${identifier}`;
                window.open(url, '_blank');
            }
        });

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "12");
        svg.setAttribute("viewBox", "0 0 24 16");
        svg.setAttribute("fill", "none");
        svg.style.flexShrink = "0";
        svg.style.display = "flex";
        svg.style.alignItems = "center";

        const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "M0 15.6363L0 12.8594L9.47552 8.293L0 3.14038L0 0.363525L12.8575 7.4908V9.21862L0 15.6363Z");
        path1.setAttribute("fill", "currentColor");

        const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path2.setAttribute("d", "M11.1425 15.6363V12.8594L20.6181 8.293L11.1425 3.14038V0.363525L24 7.4908V9.21862L11.1425 15.6363Z");
        path2.setAttribute("fill", "currentColor");

        svg.appendChild(path1);
        svg.appendChild(path2);

        const buttonText = document.createElement('div');
        buttonText.className = 'yt-spec-button-shape-next__button-text-content cobalt-tools-text';
        buttonText.textContent = 'cobalt';
        buttonText.style.display = 'flex';
        buttonText.style.alignItems = 'center';

        const touchFeedback = document.createElement('yt-touch-feedback-shape');
        touchFeedback.style.borderRadius = 'inherit';
        touchFeedback.className = 'cobalt-tools-feedback-shape';

        const touchFeedbackDiv = document.createElement('div');
        touchFeedbackDiv.className = 'yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response cobalt-tools-feedback-response';
        touchFeedbackDiv.setAttribute('aria-hidden', 'true');

        const strokeDiv = document.createElement('div');
        strokeDiv.className = 'yt-spec-touch-feedback-shape__stroke cobalt-tools-feedback-stroke';

        const fillDiv = document.createElement('div');
        fillDiv.className = 'yt-spec-touch-feedback-shape__fill cobalt-tools-feedback-fill';

        touchFeedbackDiv.appendChild(strokeDiv);
        touchFeedbackDiv.appendChild(fillDiv);
        touchFeedback.appendChild(touchFeedbackDiv);

        button.appendChild(svg);
        button.appendChild(buttonText);
        button.appendChild(touchFeedback);

        buttonViewModel.appendChild(button);
        containerDiv.appendChild(buttonViewModel);

        return containerDiv;
    }

    function createDownloadButton() {
        if (document.querySelector('.cobalt-tools-container')) {
            return;
        }

        const joinButton = document.querySelector('.yt-flexible-actions-view-model-wiz__action');
        if (joinButton) {
            const cobaltButton = createCobaltButton();
            joinButton.parentNode.insertBefore(cobaltButton, joinButton.nextSibling);
        }
    }

    function checkAndAddButton() {
        const joinButton = document.querySelector('.yt-flexible-actions-view-model-wiz__action');
        const cobaltButton = document.querySelector('.cobalt-tools-container');

        if (joinButton && !cobaltButton) {
            createDownloadButton();
        }
    }

    const observer = new MutationObserver((mutations) => {
        checkAndAddButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    checkAndAddButton();
    console.log('Cobalt Tools (YouTube Bulk Downloader) is running');
})();
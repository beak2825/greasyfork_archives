// ==UserScript==
// @name         Youtube Downloader
// @namespace    http://qweren.neocities.org/
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1024px-YouTube_full-color_icon_%282017%29.svg.png
// @version      Release
// @description  Adds a download button (That actually looks good) that redirects to yt1s.com.
// @author       qweren
// @match        *://www.youtube.com/watch?v=*
// @grant        none
// @run-at document-body
// @license      CC-BY-NC-SA
// @downloadURL https://update.greasyfork.org/scripts/473086/Youtube%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/473086/Youtube%20Downloader.meta.js
// ==/UserScript==

(function() {
    // Function to append the button and tooltip
    function appendButtonAndTooltip() {
        const menu = document.getElementById("top-level-buttons-computed");

        // Remove existing download button
        const existingDownloadButton = document.querySelector('.style-scope.ytd-download-button-renderer');
        if (existingDownloadButton) existingDownloadButton.remove();

        const containerDiv = document.createElement('div');
        containerDiv.className = 'tooltip-container';

        const newButton = document.createElement('button');
        newButton.style.marginLeft = "8px";
        newButton.innerHTML = `<svg height='24' viewBox='0 0 24 24' width='24' focusable='false'><path fill='white' d='M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z'></path></svg>`;
        newButton.setAttribute("id", "download-button");

        const tooltip = document.createElement('tp-yt-paper-tooltip');
        tooltip.setAttribute('fit-to-visible-bounds', '');
        tooltip.setAttribute('offset', '8');
        tooltip.style = 'inset: 44px auto auto 187.258px;';
        tooltip.textContent = 'Download';
        tooltip.classList.remove('hidden');
        containerDiv.appendChild(tooltip);

        const currentLink = encodeURIComponent(window.location.href);
        const redirectURL = `https://yt1s.com/en/youtube-to-mp4?q=${currentLink}`;

        newButton.addEventListener('click', () => window.open(redirectURL, '_blank'));
        newButton.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading ';

        containerDiv.appendChild(newButton);
        menu.appendChild(containerDiv);
    }

    // Append the button and tooltip when the page loads
    setTimeout(appendButtonAndTooltip, 5000);

    setInterval(function () {
        if(document.getElementById("container")){
            if(!document.getElementById("download-button")){
                appendButtonAndTooltip();
            }
        }
    }, 6000);
})();
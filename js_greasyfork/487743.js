// ==UserScript==
// @name         Panopto Caption Downloader
// @namespace    https://github.com/Joshua-Baca
// @version      1.0
// @copyright    2024, Panopto Caption Downloader
// @license      MIT
// @description  Download Panopto video captions easily.
// @icon         https://www.panopto.com/wp-content/themes/panopto/library/images/favicons/favicon-96x96.png
// @author       Joshua-Baca
// @match        https://*.panopto.com/Panopto/Pages/Viewer.aspx?id=*
// @match        https://*.panopto.com/Panopto/Pages/Viewer.aspx?pid=*
// @match        https://*.panopto.eu/Panopto/Pages/Viewer.aspx?id=*
// @match        https://*.panopto.eu/Panopto/Pages/Viewer.aspx?pid=*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/487743/Panopto%20Caption%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/487743/Panopto%20Caption%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Defined the available languages for caption download.
    const languages = [
        "English (United States)", "English (United Kingdom)", "Español (México) [Spanish]",
        "Español (España) [Spanish]", "Deutsch [German]", "Français [French]",
        "Nederlands [Dutch]", "ไทย [Thai]", "简体中文 [Simplified Chinese]",
        "繁體中文 [Traditional Chinese]", "한국어 [Korean]", "日本語 [Japanese]",
        "Русский [Russian]", "Português [Portuguese]", "Język polski [Polish]",
        "English (Australia)", "Dansk [Danish]", "Suomi [Finnish]",
        "Magyar [Hungarian]", "Norsk [Norwegian]", "Svenska [Swedish]",
        "Italiano [Italian]", "Cymraeg [Welsh]", "Default"
    ];

    // Extract 'id' and 'pid' parameters from the URL to determine which video's captions to download.
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') || '';
    const pid = urlParams.get('pid') || '';

    // Construct the URL for downloading the captions based on the video's ID and selected language.
    const constructCaptionsUrl = (languageIndex) => {
        // Constructs the URL dynamically based on whether 'pid' or 'id' is present.
        let url = `https://${window.location.hostname}/Panopto/Pages/Transcription/GenerateSRT.ashx`;
        url += pid ? `?pid=${pid}` : `?id=${id}`;
        if (languageIndex != languages.length - 1) {
            url += `&language=${languageIndex}`;
        }
        return url;
    };
    // Function to download the captions, with an option to remove timestamps.
    const downloadCaptions = (url, filename, removeTimestamps) => {
        // Makes a request to download the captions and optionally removes timestamps from the content.
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                let content = response.responseText;
                if (removeTimestamps) {
                    content = content.replace(/^\d+\s+\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}\s+/gm, '');
                }
                const blob = new Blob([content], { type: 'text/plain' });
                const downloadUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = filename || 'download.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(downloadUrl);
            }
        });
    };

    // Displays a modal window for the user to interact with, including selecting language and downloading captions.
    const showModal = () => {

        // Checks if the modal already exists, if not, creates and configures it.
        let modal = document.getElementById('panoptoCaptionsModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'panoptoCaptionsModal';
            modal.style = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                           width: 60%; height: 70%; background-color: white; z-index: 10000;
                           overflow: auto; border-radius: 8px; padding: 20px; display: flex;
                           flex-direction: column; align-items: center; justify-content: space-between; border: 2px solid black;`;

            // Instructions for the user.
            const instructionText = document.createElement('p');
            instructionText.innerHTML = "If your language isn't showing up, select 'Default' as this may be how the captions were processed.<br>There are current issues with gathering captions from playlists, this is still work in progress. <br> Please select the language of the captions you want to download: ";
            instructionText.style = `text-align: center; width: 100%; margin-bottom: 20px;`;

            // Dropdown for language selection.
            const languageDropdown = document.createElement('select');
            languages.forEach((lang, index) => {
                let option = new Option(lang, index.toString());
                languageDropdown.options.add(option);
            });

            // Label element associated with the checkbox input.
             const removeTimestampsLabel = document.createElement('label');
            removeTimestampsLabel.htmlFor = 'removeTimestamps';
            removeTimestampsLabel.textContent = "Click here to remove timestamps from download";
            removeTimestampsLabel.style = `display: block; margin-top: 10px;`;

            // Checkbox for the user to choose whether to remove timestamps.
            const removeTimestampsCheckbox = document.createElement('input');
            removeTimestampsCheckbox.type = 'checkbox';
            removeTimestampsCheckbox.id = 'removeTimestamps';
            removeTimestampsCheckbox.style = 'margin-bottom: 10px;';

            /* Creates an iframe element. The iframe is used to display a preview of the captions
            within the modal, allows the user to see the captions before downloading.*/
            const iframe = document.createElement('iframe');
            iframe.style = `width: 100%; height: calc(100% - 60px); border: none; margin-top: 20px;`;

            // Button to initiate the download of captions.
            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = 'Download Captions';
            downloadBtn.onclick = () => {
                const languageIndex = languageDropdown.value;
                const captionsUrl = constructCaptionsUrl(languageIndex);
                const videoTitleElement = document.getElementById('deliveryTitle');
                const videoTitle = videoTitleElement ? videoTitleElement.innerText.trim() : 'DefaultTitle';
                const sanitizedTitle = videoTitle.replace(/[^a-zA-Z0-9]/g, '_') + '.txt';
                const removeTimestamps = removeTimestampsCheckbox.checked;
                downloadCaptions(captionsUrl, sanitizedTitle, removeTimestamps);
            };

            // Close button to dismiss the modal.
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.onclick = () => { modal.style.display = 'none'; };
            closeButton.style = `margin-top: 20px;`;

            modal.appendChild(instructionText);
            modal.appendChild(languageDropdown);
            modal.appendChild(removeTimestampsLabel);
            modal.appendChild(removeTimestampsCheckbox);
            modal.appendChild(downloadBtn);
            modal.appendChild(iframe);
            modal.appendChild(closeButton);

            document.body.appendChild(modal);

            iframe.src = constructCaptionsUrl(0);
            languageDropdown.onchange = () => {
                const selectedLanguageIndex = languageDropdown.value;
                iframe.src = constructCaptionsUrl(selectedLanguageIndex);
            };
        } else {
            modal.style.display = 'flex';
        }
    };

    // Adds a button to the page that when clicked, shows the modal for downloading captions.
    const addButton = () => {
        // Checks if the button already exists, if not, creates and places it on the page.
        let button = document.getElementById('viewCaptionsBtn');
        if (!button) {
            button = document.createElement('button');
            button.id = 'viewCaptionsBtn';
            button.textContent = 'View Captions';
            button.style = `position: fixed; bottom: 20px; left: 20px; z-index: 1000;`;
            button.onclick = showModal;

            document.body.appendChild(button);
        }
    };

    // Call addButton to ensure the button is added to the page when the script runs.
    addButton();
})();

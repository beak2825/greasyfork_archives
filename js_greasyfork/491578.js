// ==UserScript==
// @name         ⚙️Coub Downloading
// @namespace    Wizzergod
// @version      1.0.3
// @description  Add 3 Buttons to download Video,audio,loop when click button you can open it in new tab by click mouse button or right click selet open in new tab to preview.
// @icon            https://www.google.com/s2/favicons?sz=64&domain=coub.com
// @author          Wizzergod
// @license         MIT
// @match        *://*.coub.com/*
// @match        *://coub.com/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/491578/%E2%9A%99%EF%B8%8FCoub%20Downloading.user.js
// @updateURL https://update.greasyfork.org/scripts/491578/%E2%9A%99%EF%B8%8FCoub%20Downloading.meta.js
// ==/UserScript==

(function ()
{
    'use strict';

    function addButton(container, text, url)
    {
        const button = document.createElement('a');
        button.innerText = text;
        button.classList.add('coubdl-button');
        button.href = url;
        button.addEventListener('click', function (event)
        {
            event.preventDefault();
            downloadFile(url, getFileNameFromUrl(url));
        });
        container.appendChild(button);
    }

    function downloadFile(url, fileName)
    {
        GM_download(
        {
            url: url,
            name: fileName
        });
    }

    function getFileNameFromUrl(url)
    {
        const matches = url.match(/\/([^\/?#]+)[^\/]*$/);
        return matches && matches[1];
    }

    function addControls()
    {
        const coubContainers = document.querySelectorAll('.coub');

        coubContainers.forEach(container =>
        {
            const permalink = container.dataset.permalink;
            if (!permalink)
            {
                return;
            }

            const descriptionControls = container.querySelector('.coub__description');
            if (!descriptionControls)
            {
                return;
            }

            const existingControls = container.querySelector('.coubdl-button-group');
            if (existingControls)
            {
                return;
            }

            const controlsContainer = document.createElement("div");
            controlsContainer.classList.add("coubdl-button-group");

            const dataContainer = container.querySelector(
                '.data script[type="text/json"]'
            );
            if (dataContainer)
            {
                const data = JSON.parse(dataContainer.textContent);
                if (data && data.file_versions && data.file_versions.html5)
                {
                    const html5Data = data.file_versions.html5;

                    if (
                        html5Data.video &&
                        html5Data.video.high &&
                        html5Data.video.high.url
                    )
                    {
                        const videoUrl = html5Data.video.high.url;
                        addButton(controlsContainer, "⬇️ Video", videoUrl);
                    }

                    if (
                        html5Data.audio &&
                        html5Data.audio.high &&
                        html5Data.audio.high.url
                    )
                    {
                        const audioUrl = html5Data.audio.high.url;
                        addButton(controlsContainer, "⬇️ Audio", audioUrl);
                    }
                }

                if (
                    data &&
                    data.file_versions &&
                    data.file_versions.share &&
                    data.file_versions.share.default
                )
                {
                    const loopedUrl = data.file_versions.share.default;
                    addButton(controlsContainer, "⬇️ Looped Video", loopedUrl);
                }
            }

            descriptionControls.prepend(controlsContainer);
        });
    }

    function observeChanges()
    {
        const observer = new MutationObserver((mutations) =>
        {
            mutations.forEach((mutation) =>
            {
                Array.from(mutation.addedNodes).forEach((node) =>
                {
                    if (node.nodeType === Node.ELEMENT_NODE)
                    {
                        addControls();
                    }
                });
            });
        });

        observer.observe(document.body,
        {
            childList: true,
            subtree: true,
        });
    }

    function init()
    {
        addControls();
        observeChanges();
    }

    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
        .coubdl-button-group {
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
            width: 100%;
            position: relative;
        }

        .coubdl-button {
            padding: 4px 8px;
            color: #000;
            background: #fff0;
            line-height: 1;
            border-radius: 0px;
            text-decoration: none;
            border: none;
            display: inline-block;
            transition: background-color 0.3s ease;
        }

        .coubdl-button:hover,
        .coubdl-button:active,
        .coubdl-button:focus {
            color: #0332FF;
        }
    `;
    document.head.appendChild(style);

    init();

})();

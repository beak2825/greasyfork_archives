// ==UserScript==
// @name         Civitai Image Downloader
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Downloads Civitai images with full metadata in a text file. Needs clipboard permission to save metadata. (Clipboard text is restored after)
// @author       cyaoeu
// @match        https://civitai.com/images/*
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542574/Civitai%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/542574/Civitai%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sanitizeFolderName(name) {
        return name.replace(/[^a-zA-Z0-9]/g, '_');
    }

    function addDownloadButton() {
        // Find the Tip button container
        const tipButtonContainer = document.querySelector('div.flex.gap-1[class*="@max-md:hidden"]');
        if (!tipButtonContainer) {
            console.error('Tip button container not found!');
            return;
        }

        // Create the Download button
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download Image + Metadata';
        downloadButton.style.cssText = `
            --badge-radius:var(--mantine-radius-sm);--badge-bg:var(--mantine-color-gray-filled);--badge-color:var(--mantine-color-white);--badge-bd:calc(0.0625rem * var(--mantine-scale)) solid transparent;font-size:12px;font-weight:600;line-height:1.5;padding-right:calc(0.75rem * var(--mantine-scale))
        `;
        downloadButton.classList = "h-9 min-w-9 rounded-full normal-case m_347db0ec mantine-Badge-root civitai-image-downloader-button";
        downloadButton.title = 'Download the image and its metadata as a text file';
        tipButtonContainer.appendChild(downloadButton);

        downloadButton.addEventListener('click', function() {
            // Extract image ID from URL
            const url = window.location.href;
            const imageIdMatch = url.match(/\/images\/(\d+)/);
            if (!imageIdMatch) {
                alert('Could not find image ID in the URL!');
                return;
            }
            const imageId = imageIdMatch[1];

            // Extract username from DOM
            const userLink = document.querySelector('a[href^="/user/"]');
            if (!userLink) {
                alert('Could not find username!');
                return;
            }
            const usernameElement = userLink.querySelector('p[data-size="md"]');
            if (!usernameElement) {
                alert('Could not find username element!');
                return;
            }
            const username = sanitizeFolderName(usernameElement.textContent.trim());

            // Extract image URL from DOM
            const imageElement = document.querySelector('img[class*="EdgeImage_image"]');
            if (!imageElement) {
                alert('Could not find image element!');
                return;
            }
            const imageUrl = imageElement.src;

            // Extract metadata from __NEXT_DATA__
            const nextDataScript = document.getElementById('__NEXT_DATA__');
            if (!nextDataScript) {
                alert('Could not find __NEXT_DATA__!');
                return;
            }
            const nextData = JSON.parse(nextDataScript.textContent);
            const imageData = nextData.props.pageProps.trpcState.json.queries.find(q => q.state.data?.id === parseInt(imageId))?.state.data;
            if (!imageData) {
                alert('Could not find image data in __NEXT_DATA__!');
                return;
            }
            const meta = imageData.meta || {};

            // Log for debugging
            console.log('Extracted metadata:', meta);

            // Extract resources from DOM
            let resourcesText = '';
            const resourcesP = Array.from(document.querySelectorAll('p.mantine-Text-root')).find(p => p.textContent === 'Resources used');
            if (resourcesP) {
                const resourcesUl = resourcesP.nextElementSibling;
                if (resourcesUl && resourcesUl.tagName === 'UL') {
                    resourcesText += 'Resources used:\n';
                    const resources = resourcesUl.querySelectorAll('li');
                    resources.forEach(resource => {
                        const name = resource.querySelector('a p.underline')?.textContent.trim() || '';
                        const version = resource.querySelector('a p.text-xs')?.textContent.trim() || '';
                        const type = resource.querySelector('div.mantine-Badge-root')?.textContent.trim() || '';
                        resourcesText += `- ${name} (${type}): ${version}\n`;
                    });
                    resourcesText += '\n';
                }
            }

            // click copy all button

            const copyAllButton = document.querySelector("p.mantine-focus-auto.flex.cursor-pointer.items-center.gap-1.text-xs.m_b6d8b162.mantine-Text-root");

            let prevText = "";
            let copiedText = "";
            navigator.clipboard.readText().then(clipText => {
                prevText = clipText
                copyAllButton.click();
                navigator.clipboard.readText().then(clipText => {
                    copiedText = clipText
                });
            });

            // hacky wait for promise to fulfill
            setTimeout(() => {
                // Format metadata text
                let metadataText = resourcesText;

                const metadataContainer = document.querySelector('div.mantine-Card-root.flex.flex-col.gap-3.rounded-xl.m_e615b15f.mantine-Card-root.m_1b7284a3.mantine-Paper-root');
                metadataText += "Positive prompt: \n" + copiedText.split("Steps")[0].replace("Negative prompt", "\nNegative prompt") + "Steps" + copiedText.split("Steps")[1]
                    .replace(/TI: \[object Object\], /g, '') // Remove TI: [object Object]
                    .replace(/,/g, '') // Remove all commas
                    .replace(/(Steps|CFG scale|Sampler|Seed|Size|Model|Schedule type|Noise Schedule|Resharpen Enabled|Resharpen Scaling|Cos Denoising strength|SD upscale overlap|Resharpen Sharpness|SD upscale upscaler|ADetailer model):/g, '\n$1:'); // Add newlines before keys

                // Create Blob for metadata
                const metadataBlob = new Blob([metadataText], { type: 'text/plain' });
                // restore clipboard
                navigator.clipboard.writeText(prevText);

                // Download image
                GM_download({
                    url: imageUrl,
                    name: `civitai/${username}/${username}_${imageId}.jpg`,
                    saveAs: false,
                    conflictAction: "overwrite"
                });

                // Download metadata
                const metadataUrl = URL.createObjectURL(metadataBlob);
                GM_download({
                    url: metadataUrl,
                    name: `civitai/${username}/${username}_${imageId}.txt`,
                    saveAs: false,
                    conflictAction: "overwrite",
                    onload: () => URL.revokeObjectURL(metadataUrl)
                });
            }, 100)
        });

    }

    window.addEventListener('load', addDownloadButton());

})();


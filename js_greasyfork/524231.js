// ==UserScript==
// @name         BlockadeFarm
// @namespace    https://github.com/onlypuppy7/
// @version      1.0
// @description  Simplifies the process of extracting images from Blockadelabs skybox generator.
// @author       onlypuppy7
// @match        https://skybox.blockadelabs.com/*
// @license      GPL-3.0
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/524231/BlockadeFarm.user.js
// @updateURL https://update.greasyfork.org/scripts/524231/BlockadeFarm.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const originalCreateObjectURL = URL.createObjectURL;
    const blobItems = [];
    const pendingBlobItems = [];
    let menuCreated = false;

    URL.createObjectURL = function (blob) {
        const blobUrl = originalCreateObjectURL.call(this, blob);
        console.log(`[Blob] Created blob URL: ${blobUrl}`, blob);

        if (!menuCreated) {
            pendingBlobItems.push({ blob, blobUrl });
        } else {
            addBlobToMenu(blob, blobUrl);
        }

        return blobUrl;
    };

    function createMenu() {
        const menu = document.createElement('div');
        menu.id = 'blobMenu';
        menu.style.position = 'fixed';
        menu.style.top = '10%';
        menu.style.right = '10px';
        menu.style.zIndex = '10000';
        menu.style.backgroundColor = '#FFF';
        menu.style.border = '1px solid #CCC';
        menu.style.borderRadius = '8px';
        menu.style.padding = '10px';
        menu.style.width = '300px';
        menu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        menu.style.maxHeight = '80%';
        menu.style.overflowY = 'auto';

        const title = document.createElement('h3');
        title.textContent = 'BlockadeFarm by onlypuppy7';
        title.style.margin = '0 0 10px 0';
        title.style.fontSize = '16px';
        title.style.color = '#333';
        title.style.textAlign = 'center';

        menu.appendChild(title);

        const toolsLabel = document.createElement('h3');
        toolsLabel.textContent = 'Tools:';
        toolsLabel.style.margin = '0 0 10px 0';
        toolsLabel.style.fontSize = '16px';
        toolsLabel.style.color = '#333';
        toolsLabel.style.textAlign = 'center';

        menu.appendChild(toolsLabel);

        const resetButtonContainer = document.createElement('div');
        resetButtonContainer.style.marginBottom = '5px';
        resetButtonContainer.style.display = 'flex';
        resetButtonContainer.style.justifyContent = 'center';

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Available Generations';
        resetButton.style.backgroundColor = '#FF5733';
        resetButton.style.color = '#FFF';
        resetButton.style.border = 'none';
        resetButton.style.padding = '2px 2px';
        resetButton.style.borderRadius = '5px';
        resetButton.style.cursor = 'pointer';
        resetButton.style.width = '90%';

        resetButton.onclick = () => {
            delete localStorage["available-generations"];
            location.reload(true);
        };

        resetButtonContainer.appendChild(resetButton);
        menu.appendChild(resetButtonContainer);

        const linksContainer = document.createElement('div');
        linksContainer.id = 'linksContainer';
        menu.appendChild(linksContainer);

        createMenuLink(linksContainer, "Convert To Cubemap", "https://jaxry.github.io/panorama-to-cubemap/");

        const blobsLabel = document.createElement('h3');
        blobsLabel.textContent = 'Detected Skyboxes:';
        blobsLabel.style.margin = '0 0 10px 0';
        blobsLabel.style.fontSize = '16px';
        blobsLabel.style.color = '#333';
        blobsLabel.style.textAlign = 'center';

        menu.appendChild(blobsLabel);

        const container = document.createElement('div');
        container.id = 'blobContainer';
        menu.appendChild(container);

        document.body.appendChild(menu);

        menuCreated = true;

        processPendingBlobs();

        const infoLabel = document.createElement('h3');
        infoLabel.textContent = 'Enjoy!';
        infoLabel.style.margin = '0 0 10px 0';
        infoLabel.style.fontSize = '16px';
        infoLabel.style.color = '#333';
        infoLabel.style.textAlign = 'center';

        menu.appendChild(infoLabel);
    };

    function addBlobToMenu(blob, blobUrl) {
        const extension = blob.type.split('/')[2] || 'bin';
        const fileName = `panorama.${extension}`;

        if (blobItems.find((item) => item.blobUrl === blobUrl)) return;

        blobItems.push({ blob, blobUrl });

        createMenuLink(document.getElementById('blobContainer'), fileName, blobUrl);
    }

    function createMenuLink(container, labelName, url) {
        const linkEntry = document.createElement('div');
        linkEntry.style.display = 'flex';
        linkEntry.style.justifyContent = 'space-between';
        linkEntry.style.alignItems = 'center';
        linkEntry.style.marginBottom = '8px';
        linkEntry.style.borderBottom = '1px solid #EEE';
        linkEntry.style.paddingBottom = '5px';

        const link = document.createElement('a');
        link.textContent = labelName;
        link.href = url;
        link.download = labelName;
        link.style.color = '#007BFF';
        link.style.textDecoration = 'none';
        link.style.overflow = 'hidden';
        link.style.textOverflow = 'ellipsis';
        link.style.whiteSpace = 'nowrap';
        link.target = '_blank';

        linkEntry.appendChild(link);
        container.appendChild(linkEntry);
    };

    function processPendingBlobs() {
        while (pendingBlobItems.length > 0) {
            const { blob, blobUrl } = pendingBlobItems.shift();
            addBlobToMenu(blob, blobUrl);
        }
    }

    const observer = new MutationObserver(() => {
        if (!document.getElementById('blobMenu')) {
            menuCreated = false;
            createMenu();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    createMenu();

    console.log("Userscript to intercept blob requests and add a download menu is running...");
})();
// ==UserScript==
// @name         Sketchfab Unity Asset Payload Creator
// @namespace    com.zallist.unity-game-asset-download
// @version      0.1
// @description  Creates a Unity Asset Payload on Sketchfab when the Download link is pressed
// @author       Zallist
// @match        https://sketchfab.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454630/Sketchfab%20Unity%20Asset%20Payload%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/454630/Sketchfab%20Unity%20Asset%20Payload%20Creator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function getModelInfo() {
        var url = window.location.origin + window.location.pathname;
        var idMatch = (/-(\w+)$/).exec(url);

        if (idMatch.length < 1) {
            return null;
        }

        var id = idMatch[1];
        var model = window.prefetchedData['/i/models/' + id];
        var download = window.prefetchedData['/i/models/' + id + "/download"];

        if (!model) {
            console.error("Could not find model in window.prefetchedData['/i/models/' + id]");
            return null;
        }

        if (!download) {
            console.error("Could not find model in window.prefetchedData['/i/models/' + id]");
            return null;
        }

        var archiveLink = download.latest.source[0];

        if (!archiveLink) {
            console.error("Could not find archiveLink");
            return null;
        }

        var downloadLinkReq = await fetch(archiveLink.url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'origin'
        });

        var downloadLink = await downloadLinkReq.json();

        if (!downloadLink.url) {
            console.error("Could not find downloadLink");
            return null;
        }

        return {
            model: model,
            archiveLink: archiveLink,
            downloadLink: downloadLink
        };
    }

    async function getUnityImportPayload() {
        var modelInfo = await getModelInfo();

        if (!modelInfo) {
            return null;
        }

        function getLicense(license) {
            switch (license.url.toLowerCase()) {
                case 'http://creativecommons.org/licenses/by/4.0/':
                    return 'CC-BY 4.0';
                case 'http://creativecommons.org/licenses/by-nd/4.0/':
                    return 'CC-BY 4.0 NoDerivatives';
                case 'http://creativecommons.org/licenses/by-nc/4.0/':
                    return 'CC-BY 4.0 NonCommercial';
                case 'http://creativecommons.org/licenses/by-sa/4.0/':
                    return 'CC-BY 4.0 ShareAlike';
                case 'http://creativecommons.org/licenses/by-nc-sa/4.0/':
                    return 'CC-BY 4.0 NonCommercial ShareAlike';
                case 'http://creativecommons.org/licenses/by-nc-nd/4.0/':
                    return 'CC-BY 4.0 NonCommercial NoDerivatives';
                case 'http://creativecommons.org/publicdomain/zero/1.0/':
                    return 'CC0';
            }

            return license.fullname;
        }

        return {
            name: modelInfo.model.name,
            license: getLicense(modelInfo.model.license),
            creatorName: modelInfo.model.user.displayName,
            url: modelInfo.model.viewerUrl,
            downloadUrl: modelInfo.downloadLink.url
        };
    }

    async function appendPayloadToPage() {
        var payload = await getUnityImportPayload();

        if (!payload) {
            return;
        }

        var downloadLinkHeader = document.getElementsByClassName('c-download__header')[0];
        var sendToUnity = document.createElement('div');
        sendToUnity.style.fontSize = '10px';
        sendToUnity.style.marginBottom = '0.5em';

        var unityPayloadHeader = document.createElement('div');
        unityPayloadHeader.innerText = 'Unity Asset Payload';
        unityPayloadHeader.style.fontWeight = 'bold';

        var unityPayloadContainer = document.createElement('div');
        unityPayloadContainer.style.width = '100%';

        var unityPayloadTextArea = document.createElement('textarea');
        unityPayloadTextArea.style.width = '100%';
        unityPayloadTextArea.rows = 3;
        unityPayloadTextArea.readonly = 'readonly';

        unityPayloadContainer.appendChild(unityPayloadTextArea);

        sendToUnity.appendChild(unityPayloadHeader);
        sendToUnity.appendChild(unityPayloadContainer);

        downloadLinkHeader.after(sendToUnity);

        unityPayloadTextArea.innerText = 'unity-asset-payload::' + JSON.stringify(payload);

        unityPayloadTextArea.onclick = function () {
            this.focus();
            this.select();
        };
    }

    document.arrive('.c-download__header', appendPayloadToPage);
})();
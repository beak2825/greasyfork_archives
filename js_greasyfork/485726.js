// ==UserScript==
// @name         Syntax Library Audio Player
// @namespace    http://tampermonkey.net/
// @version      2024-01-25
// @description  A syntax library audio player - play audio straight from the audio page!
// @author       You
// @match        https://www.syntax.eco/library/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=syntax.eco
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485726/Syntax%20Library%20Audio%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/485726/Syntax%20Library%20Audio%20Player.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const assetInfo = document.querySelector('#asset-info');
    const assetID = assetInfo.getAttribute('data-asset-id');
    var isaudio = false;

    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
    const btnid = makeid(20);
    const audid = makeid(20);

    async function getAssetType() {
        const response = await fetch('https://www.syntax.eco/public-api/v1/asset/' + assetID);
        const data = await response.json();
        return data.data.asset_type;
    }

    async function th() {
        const assetType = await getAssetType();
        if (assetType !== 0) {
            if (assetType === "Audio") {
                isaudio = true;
            }
        }
    }

    await th();
    if (isaudio) {
        var button;
        var audio;

        const img = document.querySelector(`img[src*="/Thumbs/Asset.ashx?assetId=` + assetID + `&x=420&y=420"]`);
        var html = '<btn id="' + btnid + '" style="right: 1rem; bottom: 1rem;" class="position-absolute bottom-right btn btn-primary fw-bold w-30 btn-sm">Play</btn>';
        img.insertAdjacentHTML('afterend', html);

        button = document.querySelector(`#` + btnid);
        var html2 = '<audio id="' + audid + '" src="https://www.syntax.eco/asset?id=' + assetID + '" alt="My Audio"></audio>';
        img.insertAdjacentHTML('afterend', html2);

        audio = document.querySelector(`#` + audid);
        var isPlaying = false;

        function togglePlay() {
            isPlaying ? audio.pause() : audio.play();
        };

        audio.onplaying = function() {
            isPlaying = true;
            button.innerText = "Pause";
        };
        audio.onpause = function() {
            isPlaying = false;
            button.innerText = "Play";
        };

        button.addEventListener('click', togglePlay);

        // Prevent the audio from autoplaying
        audio.addEventListener('loadedmetadata', () => {
            audio.playbackState = 'paused';
        });
    }

})();
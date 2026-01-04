// ==UserScript==
// @name         Remember Dropout Captions
// @namespace    https://theonlytails.com/
// @version      2024-04-26
// @description  Remembers your caption selection between videos on Dropout.tv
// @author       theonlytails
// @match        *://www.dropout.tv/*
// @grant        none
// @run-at       document-idle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/489089/Remember%20Dropout%20Captions.user.js
// @updateURL https://update.greasyfork.org/scripts/489089/Remember%20Dropout%20Captions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const iframe = document.getElementById("watch-embed");

    if (iframe) {
        iframe.src += "&api=1";

        const player = new VHX.Player("watch-embed");
        player.on("loadeddata", (event) => {
            const languages = player.getSubtitles();

            if (languages.length > 0)
                player.setSubtitle(languages[0].language);
        })
    }
})();
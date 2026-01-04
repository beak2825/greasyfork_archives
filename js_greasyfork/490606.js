// ==UserScript==
// @name         SampleFocus Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Download unlimited samples from SampleFocus
// @author       JJTV
// @match        https://samplefocus.com/**
// @icon         https://i.imgur.com/WedmtXe.png
// @downloadURL https://update.greasyfork.org/scripts/490606/SampleFocus%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/490606/SampleFocus%20Downloader.meta.js
// ==/UserScript==

function removeAllClickEventListeners(elementId) {
    var oldElement = document.getElementById(elementId);
    var newElement = oldElement.cloneNode(true);

    var div = document.createElement('a');
    div.href=oldElement.href;
    div.innerText = "DL";
    div.target = '_blank';

    oldElement.parentNode.replaceChild(div, oldElement);
}

(function() {
    'use strict';

    document.onscroll = () => {
        const sample_cards = [...document.getElementsByClassName("sample-card")];
        sample_cards.forEach((card, idx) => {
            const card_url = card.getElementsByTagName("audio")[0].src
            const download_btn = card.getElementsByClassName("download-sample-link")[0]
            if (!download_btn){
                return;
            }
            download_btn.href = card_url
            download_btn.style.backgroundColor = "green";
            download_btn.id = "ses" + idx;
            removeAllClickEventListeners("ses"+idx);
            console.log("Edited DL Link");
        })
    }
})();

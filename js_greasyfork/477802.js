// ==UserScript==
// @name         Youtube AdBlock ban bypass
// @namespace    http://tampermonkey.net/
// @version      0.32
// @description  Bypass youtubes new ad block restrictions
// @author       Obelous
// @match        https://www.youtube.com/w*
// @match        https://www.youtube-nocookie.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477802/Youtube%20AdBlock%20ban%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/477802/Youtube%20AdBlock%20ban%20bypass.meta.js
// ==/UserScript==

let currentPageUrl = window.location.href;

window.addEventListener('beforeunload', function () {
    currentPageUrl = window.location.href;
});

document.addEventListener('yt-navigate-finish', function () {
    const newUrl = window.location.href;
    if (newUrl !== currentPageUrl) {
        location.reload();
    }
});

function splitUrl(str) {
    return str.split('=')[1];
}

function run() {
    console.log("Loaded");
    const block = document.querySelector('.yt-playability-error-supported-renderers');
    block.parentNode.removeChild(block);
    const url = "https://youtube.com/embed/" + splitUrl(window.location.href) + "?autoplay=1";
    const oldplayer = document.getElementById("error-screen");
    const player = document.createElement('iframe');
    player.setAttribute('src', url);
    player.setAttribute('allowfullscreen', "allowfullscreen");
    player.setAttribute('mozallowfullscreen', "mozallowfullscreen");
    player.setAttribute('msallowfullscreen', "msallowfullscreen");
    player.setAttribute('oallowfullscreen', "oallowfullscreen");
    player.setAttribute('webkitallowfullscreen', "webkitallowfullscreen");
    player.setAttribute('frameborder',"0");
    player.style = "height:100%;width:100%;border-radius:12px;";
    player.id = "youtube-iframe";
    oldplayer.appendChild(player);
    console.log('Finished');
}

(function() {
    'use strict';
    //|             |||
    // RUN DELAY    VVV
    setTimeout(run, 700);
})();
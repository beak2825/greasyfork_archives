// ==UserScript==
// @name            YouTube mp3 Conv
// @namespace       https://www.rcyoutube.com/
// @author          Addon Developer
// @license         MIT
// @version         2.0
// @icon            https://www.rcyoutube.com/userscript/icon.png
// @description     The YouTube mp3 Conv generates a Download on YouTube.com. Convert YouTube to mp3 and download the file to your device.
// @match           http://www.youtube.com/*
// @match           https://www.youtube.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/464959/YouTube%20mp3%20Conv.user.js
// @updateURL https://update.greasyfork.org/scripts/464959/YouTube%20mp3%20Conv.meta.js
// ==/UserScript==

(function() {
    const div = document.createElement('div');
    div.innerHTML = 'Download';
    div.style.backgroundColor = '#ff0000';
    div.style.color = '#ffffff';
    div.style.border = 'none';
    div.style.borderRadius = '5px';
    div.style.padding = '4px 8px';
    div.style.fontSize = '14px';
    div.style.height = '20px';
    div.style.width = '70px';
    div.style.zIndex = '9999';
    div.style.position = 'fixed';
    div.style.top = '15px';
    div.style.left = '190px';
    div.style.cursor = 'pointer';
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    div.onclick = function() {
        window.open("https://www.rcyoutube.com/convert?v=" + window.location.href, '_blank');
    }

    document.body.appendChild(div);
})();

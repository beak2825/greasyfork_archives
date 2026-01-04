// ==UserScript==
// @name         croxyproxy video stream opener
// @name:tr      croxyproxy video akışı açıcı
// @namespace    http://tampermonkey.net/
// @version      2024-01-14
// @description  croxyproxy to open streaming videos outside the proxy
// @description:tr croxyproxy için proxy dışında video akışı açmaya yarar
// @author       anonimbiri
// @license MIT
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=39.161
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481822/croxyproxy%20video%20stream%20opener.user.js
// @updateURL https://update.greasyfork.org/scripts/481822/croxyproxy%20video%20stream%20opener.meta.js
// ==/UserScript==

var list = [
    'streamtape.com',
    'tapenoads.com',
    'doodstream.com',
    'dood.ws',
    'ds2play.com',
    'doodstream.top',
    'd0o0d.com',
    'do0od.com',
    'streamvid.net',
    'wolfstream.tv',
    'vtbe.to',
    'rapidcloud.cc',
    'streamhub.to',
];

window.addEventListener("load", () => {
    const urlValue = new URL(document.querySelector('input[name="url"]').value);
    if (list.includes(urlValue.hostname)) {
        window.location.href = urlValue.href;
    }
});
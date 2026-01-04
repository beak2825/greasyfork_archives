// ==UserScript==
// @name        Y2Mate.is
// @namespace   https://en.y2mate.is/
// @version     2.1.5
// @author      Y2Mate.is
// @description Mirror of official Y2Mate userscript
// @copyright   2023, Y2Mate.is
// @icon        https://y2mate.is/assets/icons/favicon.ico
// @icon64      https://y2mate.is/assets/icons/favicon.ico
// @homepage    https://y2mate.is/extensions/chrome-extension.html
// @match       *://*.youtube.com/*
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/485672/Y2Mateis.user.js
// @updateURL https://update.greasyfork.org/scripts/485672/Y2Mateis.meta.js
// ==/UserScript==

if (document.domain === 'www.youtube.com') {
    setInterval(check, 1000)

    function check() {
        const elem = document.getElementById("y2mate_downloader")
        if (elem === null && document.readyState === 'complete') {
            addButton()
        }
    }

    function addButton() {

        var params = new URLSearchParams(document.location.search);
        var youtubeId = params.get('v');

        const icon = 'https://y2mate.is/assets/icons/favicon.ico';
        const gotoy2mate = 'https://y2mate.is/watch?v='+youtubeId+'&utm_source=chrome_extension';
      
        const div_embed = document.querySelector(`#actions`);

        const target = '_blank';
        const start = `border: none; background: inherit; cursor: pointer; margin: 5px 0 0 0;`;

        if (div_embed) {
            let div_elem = document.createElement('div');
            div_elem.id = "y2mate_downloader"
            div_elem.innerHTML += `<a href="${gotoy2mate}" style="cursor:pointer" target="${target}"><button style="${start}" type="button" title="Convert with Y2Mate.is"><img style="border-radius: 5px; width: 28px; height: 28px;" src="${icon}">`

            for (var i = 0; i < div_embed.childNodes.length; i++) {
                div_embed.childNodes[2].before(div_elem);
            }
        }
    }
}

// ==UserScript==
// @name        Y2Mate.tools
// @namespace   https://y2mate.tools/
// @version     2.1.6
// @author      BetaTester704
// @description This userscript assists Y2Mate.tools to convert video links online.
// @match       *://*.youtube.com/*
// @license     Unlicense
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/459232/Y2Matetools.user.js
// @updateURL https://update.greasyfork.org/scripts/459232/Y2Matetools.meta.js
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

        const icon = 'https://y2mate.tools/theme/youtube/images/logo.png';
        const gotoy2mate = "https://www.youtube-y2mate.com/watch?v="+youtubeId;
        const div_embed = document.querySelector(`.ytd-page-manager #info #info-contents:not([hidden]) #top-level-buttons-computed,.ytd-page-manager #actions .actions-inner #top-level-buttons-computed,.ytd-page-manager #actions #actions-inner #top-level-buttons-computed`);

        const target = '_blank';
        const start = `border: none;margin: 0px -8px 0px 0px;background: inherit;cursor: pointer;position: relative;flex: 1;display: flex;align-items: center;justify-content: right`;

        if (div_embed) {
            let div_elem = document.createElement('div');
            div_elem.id = "y2mate_downloader"
            div_elem.innerHTML += `<a href="${gotoy2mate}" style="cursor:pointer" target="${target}"><button style="${start}" type="button" title="Convert with Y2Mate.tools"><img style="border-radius: 3px; width: 45px; height: 35px;" src="${icon}">`

            for (var i = 0; i < div_embed.childNodes.length; i++) {
                div_embed.childNodes[2].before(div_elem);
            }
        }
    }
}

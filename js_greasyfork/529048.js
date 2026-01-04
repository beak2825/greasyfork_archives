// ==UserScript==
// @name         Netflix One Pace Font (ImpressBT)
// @license      MIT
// @description  Styles the Netflix Subtitles to look like One Pace
// @namespace    okthx
// @author       okthx
// @version      1.0.1
// @homepage     https://twitter.com/nathangamz
// @match        https://www.netflix.com/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/529048/Netflix%20One%20Pace%20Font%20%28ImpressBT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529048/Netflix%20One%20Pace%20Font%20%28ImpressBT%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Insert the Impress BT font into the page's head
    let fontLink = document.createElement("link");
    fontLink.href = "https://fonts.cdnfonts.com/css/impress-bt";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    // Apply custom style to Netflix subtitles
    let fontStyle = `
.player-timedtext-text-container * {
    font-family: 'Impress BT', sans-serif !important;
    font-size: 40px !important;
    font-weight: 500 !important;
    text-shadow: -3px 0px 0 #000, 3px 0px 0 #000, 0px -3px 0 #000, 0px 3px 0 #000,
                 -3px -3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, 3px 3px 0 #000,
                 0px 0px 6px rgba(0,0,0,0.4) !important;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    color: white !important;
}
`;
    let newStyle = document.createElement("style");
    newStyle.innerHTML = fontStyle;
    document.head.appendChild(newStyle);
})();

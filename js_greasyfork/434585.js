// ==UserScript==
// @name         CheaterMad No Download Delay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  none
// @author       ShaqimaK
// @match        https://cheatermad.com/download/*
// @icon         https://www.google.com/s2/favicons?domain=cheatermad.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434585/CheaterMad%20No%20Download%20Delay.user.js
// @updateURL https://update.greasyfork.org/scripts/434585/CheaterMad%20No%20Download%20Delay.meta.js
// ==/UserScript==

(function() {
    bb_download_delay = 0;
    document.querySelector("#bb-timing-seconds").remove();
    document.querySelector("#post-1823 > div > div > p.bb-timing-block.timing-info > span").remove();
})();
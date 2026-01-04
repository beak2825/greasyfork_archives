// ==UserScript==
// @name         Cool Math Ad Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes ads on Cool Math Games after 5 seconds (you can change the interval)
// @author       You
// @match        *://*.coolmathgames.com/*
// @grant        none
// @run-at       document-ready
// @require      https://code.jquery.com/jquery-3.5.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/413969/Cool%20Math%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/413969/Cool%20Math%20Ad%20Remover.meta.js
// ==/UserScript==

setInterval(function() {
    try {
        jQuery('.ad-wrapper, #block-gamepagegamejam2020').remove();
    }
    catch(err) {
        console.log(err);
    }
}, 5000);
setTimeout(function() {
    removePrerollAndDisplayGame();
}, 3000);
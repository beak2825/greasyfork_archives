// ==UserScript==
// @name         Torn Hide Crime Results
// @namespace    https://github.com/SOLiNARY
// @version      0.1
// @description  Hides crime outcome (success/fail) info.
// @author       Ramin Quluzade, Silmaril [2665762]
// @license      MIT License
// @match        https://www.torn.com/loader.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477977/Torn%20Hide%20Crime%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/477977/Torn%20Hide%20Crime%20Results.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const styles = 'div.outcomePanel___yyL3R { display: none; }';
    let style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = styles;
    while (document.head == null){
        await sleep(50);
    }
    document.head.appendChild(style);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();
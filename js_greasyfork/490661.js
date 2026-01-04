// ==UserScript==
// @name         Torn Crimes Hide Stories
// @namespace    https://github.com/1208nn
// @version      0.4.2
// @description  Hides torn's crime stories but keeps outcome (success/fail) info. Thanks to https://greasyfork.org/scripts/477977
// @author       1208nn
// @match        https://www.torn.com/loader.php?sid=crimes*
// @icon         https://www.torn.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490661/Torn%20Crimes%20Hide%20Stories.user.js
// @updateURL https://update.greasyfork.org/scripts/490661/Torn%20Crimes%20Hide%20Stories.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    const styles = 'p.story___GmRvQ { display: none; } div.divider___RUQMk { display: none; }';
    let style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = styles;
    while (document.head == null) {
        await sleep(50);
    }
    document.head.appendChild(style);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();
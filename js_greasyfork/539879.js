// ==UserScript==
// @name         Remove Premium Ribbon on Windy.com
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Removes the "Get Premium" ribbon/element on Windy.com
// @author       cokoryu@outlook.com
// @match        https://www.windy.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539879/Remove%20Premium%20Ribbon%20on%20Windycom.user.js
// @updateURL https://update.greasyfork.org/scripts/539879/Remove%20Premium%20Ribbon%20on%20Windycom.meta.js
// ==/UserScript==

(function() {
    'use strict';
     // Select the element containing the watermark using its CSS class
    const style = document.createElement('style');
    style.innerHTML = `
        .get-premium {
            display: none  !important;
        }
    `;
    document.head.appendChild(style);
})();
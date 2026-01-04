// ==UserScript==
// @name         Disable Card Skimming Selling
// @namespace    http://tampermonkey.net/
// @version      2025-04-29
// @license       MIT
// @description  Disable Card Skimming Selling as requested
// @author       NichtGersti [3380912]
// @match        https://www.torn.com/loader.php?sid=crimes
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534446/Disable%20Card%20Skimming%20Selling.user.js
// @updateURL https://update.greasyfork.org/scripts/534446/Disable%20Card%20Skimming%20Selling.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.head.insertAdjacentHTML("beforeend", `<style>.cardskimming-root .virtualList___noLef :nth-child(2) .commitButtonSection___wJfnI button { display:none; }</style>`)
})();
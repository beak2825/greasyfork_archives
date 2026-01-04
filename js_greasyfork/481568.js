// ==UserScript==
// @name         V3rm Bloxflip Ad Remover
// @namespace    https://v3rm.net/
// @version      2023-12-07
// @description  Remove those ads that show up on every thread.
// @author       Luke
// @match        https://v3rm.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481568/V3rm%20Bloxflip%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/481568/V3rm%20Bloxflip%20Ad%20Remover.meta.js
// ==/UserScript==

(function() {
    document.querySelector("center:has(a[href='https://bloxflip.com/a/v3rm']").remove();
})();
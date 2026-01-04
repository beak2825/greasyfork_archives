// ==UserScript==
// @name         Use Security Key AutoClick
// @namespace    christhielen
// @version      1.0
// @description  automatically click "use security key"
// @author       Chris Thielen
// @license      MIT
// @match        https://*.duosecurity.com/frame/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469789/Use%20Security%20Key%20AutoClick.user.js
// @updateURL https://update.greasyfork.org/scripts/469789/Use%20Security%20Key%20AutoClick.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const submitButtons = [...document.querySelectorAll('button[type="submit"]')];
    const button = submitButtons.find(x => x.innerText.toLowerCase().includes('use security key'));
    button && button.click();
})();


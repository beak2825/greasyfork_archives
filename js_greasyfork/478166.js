// ==UserScript==
// @name         Čína Basketbal - Přesměrování do live url
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Přesměrování do detailu
// @author       Michal
// @match        https://live.leisu.com/lanqiu/shujufenxi-*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478166/%C4%8C%C3%ADna%20Basketbal%20-%20P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20do%20live%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/478166/%C4%8C%C3%ADna%20Basketbal%20-%20P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20do%20live%20url.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    const idMatch = currentUrl.match(/(\d+)$/);

    if (idMatch) {
        const id = idMatch[1];

        const redirectUrl = `https://tracker.namitiyu.com/en/basketball?profile=eNo3FYuVmTEH5&id=${id}`;

        window.location.href = redirectUrl;
    }
})();
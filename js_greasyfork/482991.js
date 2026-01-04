// ==UserScript==
// @name         Webtiles Extend Module Loader
// @description  Load the WEM from other Webtiles sites as well.
// @version      1.2
// @author       ASCIIPhilia
// @match        https://crawl.kelbi.org/*
// @match        http://crawl.akrasiac.org:8080/*
// @match        https://underhound.eu:8080/*
// @match        https://cbro.berotato.org:8443/*
// @match        http://lazy-life.ddo.jp:8080/*
// @match        https://crawl.xtahua.com/*
// @match        https://crawl.project357.org/*
// @match        http://joy1999.codns.com:8081/*
// @match        https://crawl.nemelex.cards/*
// @match        https://cnc.abstr.net/*
// @namespace https://greasyfork.org/users/663409
// @downloadURL https://update.greasyfork.org/scripts/482991/Webtiles%20Extend%20Module%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/482991/Webtiles%20Extend%20Module%20Loader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function waitFor(checkFunction, checkDelay = 100) {
        return new Promise(resolve => {
            let i = setInterval(_ => {
                try {
                    let check = checkFunction();
                    check ? clearInterval(i) || resolve(check) : void 0
                } catch (e) {}
            }, checkDelay);
        });
    }

    !async function () {
        await waitFor(_ => unsafeWindow.$, 100);
        $.getScript("https://dcssem.abstr.net/webtiles_module/release/1.0/script.js");
    }();
})();
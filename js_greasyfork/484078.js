// ==UserScript==
// @name        Mp4Hydra Remove Ads / No Adverts
// @namespace   https://greasyfork.org/
// @version     1.01
// @description Remove the ads from mp4hydra.org
// @author      paleocode
// @match       https://mp4hydra.org/*
// @icon        https://mp4hydra.org/favicon-32x32.png
// @license     MIT
// @run-at      document-start
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/484078/Mp4Hydra%20Remove%20Ads%20%20No%20Adverts.user.js
// @updateURL https://update.greasyfork.org/scripts/484078/Mp4Hydra%20Remove%20Ads%20%20No%20Adverts.meta.js
// ==/UserScript==
(function () {
    new MutationObserver((_, observer) => {
        const jqueryScriptTag = document.querySelector('div.lower');
        if (jqueryScriptTag) {
            jqueryScriptTag.remove();
            observer.disconnect();
        }
    }).observe(document.documentElement, { childList: true, subtree: true });

    new MutationObserver((_, observer) => {
        const jqueryScriptTag = document.querySelector('div.upper');
        if (jqueryScriptTag) {
            jqueryScriptTag.remove();
            observer.disconnect();
        }
    }).observe(document.documentElement, { childList: true, subtree: true });
})();
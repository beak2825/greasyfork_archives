// ==UserScript==
// @name         ylilauta-anti-adblock-toast-bullshit
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Vittuun ne keltaset mainoslootat perkele
// @author       Harras Mainosten Vihaaja :)
// @match        *://ylilauta.org/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442828/ylilauta-anti-adblock-toast-bullshit.user.js
// @updateURL https://update.greasyfork.org/scripts/442828/ylilauta-anti-adblock-toast-bullshit.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const venaa_sopsyn_homoilut = () => {
    return new Promise(resolve => {
        if (document.querySelector('.toast-root')) {
            return resolve(document.querySelector('.toast-root'));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector('.toast-root')) {
                resolve(document.querySelector('.toast-root'));
                // observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

venaa_sopsyn_homoilut().then((elm) => {
    if (elm.textContent.includes('Error loading advertisements')) {
        console.log('Jutku koijattu', elm)
        elm.children[0].click();
    }
});
})();
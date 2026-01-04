// ==UserScript==
// @name        r34.app premium
// @match       https://r34.app/*
// @grant       none
// @version     1.0
// @description Enable "premium" features on r34.app
// @license MIT
// @namespace https://greasyfork.org/users/2810
// @downloadURL https://update.greasyfork.org/scripts/485397/r34app%20premium.user.js
// @updateURL https://update.greasyfork.org/scripts/485397/r34app%20premium.meta.js
// ==/UserScript==

window.addEventListener('load', () => {
    const appRoot = document.getElementById('__nuxt');
    new MutationObserver((mutations, observer) => {
        for (const mutation of mutations) {
            if (!mutation.attributeName) return;
            if (mutation.attributeName === 'data-v-app') {
                observer.disconnect();
                appRoot.__vue_app__.config.globalProperties.$auth.$state = {
                    'loggedIn': true,
                    'user': { 'is_subscription_valid': true }
                };
            }
        }
    }).observe(appRoot, { 'attributes': true });
});

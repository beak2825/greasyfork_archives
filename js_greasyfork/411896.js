// ==UserScript==
// @name         TwitterHideAds
// @version      1.11
// @author       Addie
// @description:en Hide ads on Twitter web
// @match        https://*twitter.com/home
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/690175
// @description Hide ads on Twitter web
// @downloadURL https://update.greasyfork.org/scripts/411896/TwitterHideAds.user.js
// @updateURL https://update.greasyfork.org/scripts/411896/TwitterHideAds.meta.js
// ==/UserScript==

'use strict'

const i18n = [
    'Promoted',
    'Sponsored',
    'Sponsorisé',
]

const hideAds = () => {
    [...document.querySelectorAll('[aria-label="Timeline: Your Home Timeline"] article span')]
        .filter( el => i18n.includes(el.innerText.trim()) )
        .map( el => el.closest('[aria-label="Timeline: Your Home Timeline"]>div>div') )
        .forEach( el => {
            if (!el.classList.contains('hidden-by-twitter-hide-ads')) {
                console.log('Ad hidden:');
                console.log(el);
                el.classList.add('hidden-by-twitter-hide-ads');
            }
        });
}

let hideAdsInterval = setInterval(hideAds, 500);

GM_addStyle(`

div.hidden-by-twitter-hide-ads {
    display: none !important;
}

`)

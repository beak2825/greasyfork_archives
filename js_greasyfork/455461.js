// ==UserScript==
// @name         Remove Offerup Ads
// @namespace    https://offerup.com
// @version      0.2
// @description  Kill Offerup Ads from view
// @author       MRF
// @match        https://offerup.com*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455461/Remove%20Offerup%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/455461/Remove%20Offerup%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const killAds = () => {
        const first = document.querySelector("a[href^='/item/detail']")
        if (!first) return null
        const parent = first.parentNode
        const items = [...parent.querySelectorAll("a")]
        const reg = new RegExp('/item/detail')
        const ads = items.filter( x => !x.getAttribute('href').toLowerCase().match(reg))
        ads.map(x => {
            x.style.opacity = '0.05'
        })
    }

    setInterval(killAds, 3000)
    /* ads resist initial styles */
    setTimeout(killAds, 500)

    return null
})();
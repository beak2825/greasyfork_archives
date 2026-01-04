// ==UserScript==
// @name         Remove Facebook Marketplace Ads
// @namespace    https://facebook.com
// @version      0.5
// @description  Kill Facebook Ads from view
// @author       MRF
// @match        https://facebook.com/marketplace/*
// @match        https://*.facebook.com/marketplace/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455499/Remove%20Facebook%20Marketplace%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/455499/Remove%20Facebook%20Marketplace%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const killAds = () => {
        let outside = null;
        let items = [];

        const first = document.querySelector("a[href^='/marketplace/item']")
        if (!first) return null
        const parent = first.closest('[style]').parentNode

        if (!parent || !first) return false
        items = items.concat([...parent.querySelectorAll("a")])

        if (parent && parent.parentNode && parent.parentNode.nextElementSibling) {
          outside = parent.parentNode.nextElementSibling
          items.concat([...outside.querySelectorAll('a')])
        }

        const reg = new RegExp('/marketplace/item')
        const ships = items.filter( x => x.innerHTML.contains('Ships to you') || x.innerHTML.contains('Sponsored'))
        const ads = items.filter( x => !x.getAttribute('href').toLowerCase().match(reg))

        const combined = ads.concat(ships)
       // console.log(ads)
        combined.map(x => {
            x.parentNode.style.opacity = '0.1'
        })
    }

    setInterval(killAds, 1000)

    return null
})();
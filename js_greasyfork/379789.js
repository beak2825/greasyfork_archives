// ==UserScript==
// @name        Washington Post Ad Blocker
// @namespace   TWP.AdBlocker
// @include     https://www.washingtonpost.com/*
// @version     2.0.1
// @description Remove ads from the Washington Post
// @downloadURL https://update.greasyfork.org/scripts/379789/Washington%20Post%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/379789/Washington%20Post%20Ad%20Blocker.meta.js
// ==/UserScript==

;(function () {

    // don't run in iframe
    if (window.top != window.self) return

    document.head.innerHTML += `<style>${[
        'wp-ad',
        '#leaderboard-wrapper',
        '.outbrain-wrapper',
        '[data-qa="article-body-ad"]',
        '[moat-id*="ad/flex"]',
        '[moat-id*="ad/leaderboard"]',
        '[data-qa="paywall"]',
        'aside>div.dn.db-ns:first-child' // remove the blank on the right side
    ].join(',')}{display: none !important;}</style>`

})()
// ==UserScript==
// @name        twitter.com to nitter
// @description redirects and rewrites all twitter urls to nitter
// @namespace   azzurite
// @match       *://*/*
// @grant       none
// @version     1.0.0
// @license     GPLv3
// @author      -
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/471792/twittercom%20to%20nitter.user.js
// @updateURL https://update.greasyfork.org/scripts/471792/twittercom%20to%20nitter.meta.js
// ==/UserScript==

const NITTER_URL = 'nitter.privacydev.net'
const TWITTER_URL = 'twitter.com'

function redirectToNitter () {
    document.querySelectorAll('a[href*="'+ TWITTER_URL +'"]').forEach((element) => {
        element.href = element.href.replace(TWITTER_URL, NITTER_URL)
        element.textContent = element.textContent.replace(TWITTER_URL, NITTER_URL)
    })
}

if (location.hostname.includes(TWITTER_URL)) location.replace(`https://` + NITTER_URL + location.pathname);

document.addEventListener(`DOMContentLoaded`, () => {
    (new MutationObserver((mutations) => {
        let runCheck = false
        for (let mutation of mutations) {
            if (mutation.addedNodes.length || mutation.attributeName === 'href') {
                runCheck = true
                break
            }
        }
        if (runCheck) {
            redirectToNitter()
        }
    })).observe(document.querySelector('body'), {attributeFilter: ['href'], childList: true, subtree: true})

    redirectToNitter();
});

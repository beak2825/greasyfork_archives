// ==UserScript==
// @name         Redirect Twitter To Nitter
// @namespace    brazenvoid
// @version      1.0.3
// @description  Convert twitter URLs to Nitter URLs
// @author       brazenvoid
// @include      *
// @exclude      https://twitter.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/418162/Redirect%20Twitter%20To%20Nitter.user.js
// @updateURL https://update.greasyfork.org/scripts/418162/Redirect%20Twitter%20To%20Nitter.meta.js
// ==/UserScript==

const NITTER_URL = 'nitter.net'
const TWITTER_URL = 'twitter.com'

function redirectToNitter () {
    document.querySelectorAll('a[href*="'+ TWITTER_URL +'"]').forEach((element) => {
        element.href = element.href.replace(TWITTER_URL, NITTER_URL)
        element.textContent = element.textContent.replace(TWITTER_URL, NITTER_URL)
    })
}

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

redirectToNitter()
// ==UserScript==
// @name          Shows latest tweet
// @namespace     https://greasyfork.org/users/57176
// @match         https://twitter.com/**
// @match         https://x.com/**
// @icon          https://abs.twimg.com/favicons/twitter.2.ico
// @grant         none
// @version       1.0.5
// @author        peng-devs
// @description   Automatically switch to 'Following' section when visit Twitter homepage.
// @allFrames     true
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/458259/Shows%20latest%20tweet.user.js
// @updateURL https://update.greasyfork.org/scripts/458259/Shows%20latest%20tweet.meta.js
// ==/UserScript==

const NAME = 'show-latest-tweet'

function main() {
  const xpath = "//span[contains(text(), 'Following')]"

  const observer = new MutationObserver((_, observer) => {
    if (document.location.pathname !== '/home') return

    const span = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    if (!span) return

    console.log(`[${NAME}] 'Following' found`, span)

    span.click()
    observer.disconnect()
  })

  observer.observe(document.body, { childList: true, subtree: true })
}

main()
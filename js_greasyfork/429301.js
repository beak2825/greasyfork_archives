// ==UserScript==
// @name        Rllmuk De-embed Twitter
// @description Replaces embedded Twitter posts with a link
// @namespace   https://github.com/insin/greasemonkey/
// @version     3
// @grant       none
// @match       https://www.rllmukforum.com/index.php?/topic/*
// @match       https://rllmukforum.com/index.php?/topic/*
// @downloadURL https://update.greasyfork.org/scripts/429301/Rllmuk%20De-embed%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/429301/Rllmuk%20De-embed%20Twitter.meta.js
// ==/UserScript==

let $style = document.createElement('style')
$style.appendChild(document.createTextNode(`
iframe[data-embed-src*="url=https://twitter.com"], iframe[src*="url=https://twitter.com"] {
  display: none !important;
}
`))
document.querySelector('head').appendChild($style)

function processIframes() {
  document.querySelectorAll(`iframe[data-embed-src*="url=https://twitter.com"], iframe[src*="url=https://twitter.com"]`).forEach($iframe => {
    let link = ($iframe.dataset.embedSrc || $iframe.src).match(/https:\/\/twitter\.com\/[^/]+(\/status(?:es)?\/\d+)?/)?.[0]
    if (link) {
      $iframe.insertAdjacentHTML('afterend', `<a href="${link}" target="_blank">${link}</a>`)
      $iframe.remove()
    } else {
      $iframe.style.setProperty('display', 'revert', 'important')
    }
  })
}

processIframes()

// Watch for posts being replaced when paging
new MutationObserver(mutations =>
  mutations.forEach(mutation => {
    if (mutation.oldValue == 'true') {
      processIframes()
    }
  })
).observe(document.querySelector('div.cTopic'), {
  attributes: true,
  attributeFilter: ['animating'],
  attributeOldValue: true,
})

// Watch for new posts being loaded into the current page
new MutationObserver(mutations => {
  mutations.forEach(mutation =>
    mutation.addedNodes.forEach(processIframes)
  )
}).observe(document.querySelector('#elPostFeed > form'), {
  childList: true,
})
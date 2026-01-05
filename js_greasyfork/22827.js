// ==UserScript==
// @name        Batoto Image Link
// @namespace   Doomcat55
// @description Batoto - click on image to go to next page
// @include     http://bato.to/reader*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22827/Batoto%20Image%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/22827/Batoto%20Image%20Link.meta.js
// ==/UserScript==
// allow pasting

const reader = document.getElementById('reader')

function updateClick() {
  const nextPage = reader.querySelector('.moderation_bar li:nth-of-type(6) a:not([title*="Settings"])')
  const pageImage = reader.querySelector('div > img[src*="img.bato.to/comics/"]')
  if (nextPage && pageImage) {
    pageImage.onclick = () => {
      window.location.hash = nextPage.hash.substr(1)
    }
  }
}

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length) updateClick()
  })
})

observer.observe(reader, { childList: true, subtree: true })
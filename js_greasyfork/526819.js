// ==UserScript==
// @name Apple Podcasts URLs
// @description Extract and copy all episode URLs from Apple Podcasts to clipboard for pasting into yt-dlp
// @match https://podcasts.apple.com/*/podcast/*/id*
// @license Apache-2.0
// @version 0.0.1.20250213205050
// @namespace https://greasyfork.org/users/1128769
// @downloadURL https://update.greasyfork.org/scripts/526819/Apple%20Podcasts%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/526819/Apple%20Podcasts%20URLs.meta.js
// ==/UserScript==

// Select the node that will be observed for mutations
const targetNode = document.querySelector('.content-container')

// Options for the observer (which mutations to observe)
const config = { attributes: false, childList: true, subtree: false }

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
  loaded = document.querySelectorAll('.episode')
  if (typeof total !== 'undefined' && loaded.length < total)
    document
      .querySelector('#scrollable-page')
      .scrollTo(0, targetNode.scrollHeight)
  else {
    urls = [...loaded].map(e => e.querySelector('a').href).join(' ')
    console.log(urls)
    alert(urls)
    navigator.clipboard.write([new ClipboardItem({ 'text/plain': urls })])
  }
}

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback)

window.onload = event => {
  btn = document.querySelector(`a[href*="/podcast/id"]`)
  if (btn) {
    total = parseInt(btn.text.replace(/\D/g, ''))
    btn.click()

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config)
  } else callback()
}

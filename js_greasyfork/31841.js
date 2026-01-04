// ==UserScript==
// @name         pinterest - switch to gif
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  try to take over the world!
// @author       emattias
// @match        https://www.pinterest.se/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31841/pinterest%20-%20switch%20to%20gif.user.js
// @updateURL https://update.greasyfork.org/scripts/31841/pinterest%20-%20switch%20to%20gif.meta.js
// ==/UserScript==

function processGifNode(node) {
  const img = node.nextSibling.querySelector('img')
  const src = img.getAttribute('src')
  if (src) {
    const newSrc = src.replace(/(.+)\/\d{1,3}x\/(.+)\.jpg/gi, '/originals/gif')
    img.setAttribute('src', newSrc)

    if (node.classList.contains('playIndicatorPill')) {
      node.remove()
    }
  }
}


var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes
        .forEach((node) => {
          const gifNodes = node.querySelectorAll('.gifType')
          if (gifNodes.length > 0) {
            gifNodes
              .forEach(processGifNode)
          }
        })
      }
    });
});

// pass in the target node, as well as the observer options
observer.observe(document.querySelector('.appContent'), { childList: true, subtree: true });
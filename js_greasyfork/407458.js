// ==UserScript==
// @name    theoldreader link disabler
// @description     Disable links to third-party sites on theoldreader.com
// @version  1
// @match    https://theoldreader.com/*
// @grant    none
// @namespace https://greasyfork.org/users/668680
// @downloadURL https://update.greasyfork.org/scripts/407458/theoldreader%20link%20disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/407458/theoldreader%20link%20disabler.meta.js
// ==/UserScript==


// Disable links within content of feed posts
unsafeWindow.blankshield.open = function(e,t,n) {}

// Disable links of titles of feed posts
function disableClicks(event) { event.preventDefault() }

function disableClicksForThirdPartyLinks(anchorElement) {
  let href = anchorElement.href;
  if (!(href.startsWith("https://theoldreader.com") || href.startsWith("/"))) {
    anchorElement.addEventListener("click", disableClicks)
  }
}

let targetNode = document.querySelector("div.content-cell")

for (let element of targetNode.querySelectorAll("a[href]")) {
  disableClicksForThirdPartyLinks(element)
}

function mutationsCallback(mutations) {
  for (let mutation of mutations) {
    for (let node of mutation.addedNodes) {
      if (!(node instanceof HTMLElement)) continue;
      if (node.matches("a[href]")) {
        disableClicksForThirdPartyLinks(node)
      }
      for (let element of node.querySelectorAll("a[href]")) {
        disableClicksForThirdPartyLinks(element)
      }
    }
  }
}

let observer = new MutationObserver(mutationsCallback)

observer.observe(targetNode, {childList:true, subtree:true}) // Mind the letter cases, childList and subtree.

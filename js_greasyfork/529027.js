// ==UserScript==
// @name        lib:textjack
// @version     7
// @match       *://*/*
// @run-at      document-start
// @author      rssaromeo
// @license     GPLv3
// @include     *
// @grant       none
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHJQTFRFAAAAEIijAo2yAI60BYyuF4WaFIifAY6zBI2wB4usGIaZEYigIoiZCIyrE4igG4iYD4mjEomhFoedCoqpDIqnDomlBYyvE4efEYmiDYqlA42xBoytD4mkCYqqGYSUFYidC4qoC4upAo6yCoupDYqmCYur4zowOQAAACZ0Uk5TAO////9vr////1+/D/+/L+/Pf/////+f3///////H4////////+5G91rAAACgUlEQVR4nM2Y22KjIBCGidg1264liZqDadK03X3/V2wNKHMC7MpF/xthHD5mgERAqZhWhfYqH6K+Qf2qNNf625hCoFj9/gblMUi5q5jLkXLCKudgyiRm0FMK82cWJp1fLbV5VmvJbCIc0GCYaFqqlDJgADdBjncqAXYobm1xh72aFMflbysteFfdy2Yi1XGOm5HGBzQ1dq7TzEoxjeNTjQZb7VA3e1c7+ImgasAgQ9+xusNVNZIo5xmOMgihIS2PbCQIiHEUdTvhxCcS/kPomfFI2zHy2PkWmA6aNatIJpKFJyekyy02xh5Y3DI9T4aOT6VhIUrsNTFp1pf79Z4SIIVDegl6IJO6cHiL/GimIZDhgTu/BlYWCQzHMl0zBWT/T3KAhtxOuUB9FtBrpsz0RV4xsjHmW+UCaffcSy/5viMGer0/6HdFNMZBq/vjJL38H9Dqx4Fuy0Em12DbZy+9pGtiDijbglwAehyj11n0tRD3WUBm+lwulE/8h4BuA+iWAQQnteg2Xm63WQLTpnMnpjdge0Mgu/GRPsV4xdjQ94Lfi624fabhDkfUqIKNrM64Q837v8yL0prasepCgrtvw1sJpoqanGEX7b5mQboNW8eawXaWXTMfMGxub472hzWzHSn6Sg2G9+6TAyRruE71s+zAzjWaknoyJCQzwxrghH2k5FDT4eqWunuNxyN9QCGcxVod5oADbYnIUkDTGZEf1xDJnSFteQ3KdsT8zYDMQXcHxsevcLH1TrsABzkNPyA/L7b0jg704viMMlpQI96WsHknCt/3YH0kOEo9zcGkwrFK39ck72rmoehmKqo2RKlilzSy/nJKEV45CT38myJp456fezktHjN5aeMAAAAASUVORK5CYII=
// @description 3/5/2025, 7:16:43 PM
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/529027/lib%3Atextjack.user.js
// @updateURL https://update.greasyfork.org/scripts/529027/lib%3Atextjack.meta.js
// ==/UserScript==

let obslist = []
var textJackList = []
var usedElems = []
Object.assign(window, console)
const a = loadlib("allfuncs")

function replaceText(text) {
  // log(obslist)
  var oldtext = text
  for (var cb of textJackList) {
    text = cb(text)
    if (text !== oldtext) {
      // error("changed", text, oldtext)
      return (text = replaceText(text))
    }
  }
  return text
}

function checkNode(node) {
  log(node.children, node.childNodes, node.nodeType, "checkNode")
  if (node.nodeType === Node.TEXT_NODE) {
    // Filter text for text nodes
    var newtext = replaceText(node.textContent)
    if (node.textContent != newtext) {
      // trace("changed")
      node.textContent = newtext
      // log(1, node.textContent, newtext)
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // debugger
    // If it's an element, check its text content
    for (var child of node.childNodes) {
      checkNode(child)
    }
    // Observe any shadow roots
    if (node.shadowRoot) {
      createObserver(node.shadowRoot)
    }
  } else {
    // log(node.children, node.childNodes)
    for (var child of node.childNodes) {
      checkNode(child)
    }
  }
}

// Function to handle text changes
function handleTextChange(mutations) {
  disableObservers()
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        checkNode(node)
      })
    } else if (mutation.type === "characterData") {
      // Filter text for character data changes
      // error("Asdasasdjkasdkhasdd", mutation)
      var text = mutation.target.textContent
      var newtext = replaceText(text)
      if (newtext !== text) {
        trace("changed")
        mutation.target.textContent = newtext
      }
    }
  })
  enableObservers()
}

// Create a MutationObserver for the main document
function createObserver(elem) {
  if (usedElems.includes(elem)) return
  log(elem, "asdkasdkasdklklsda")
  var obs = new MutationObserver((mutations) => {
    warn(mutations)
    handleTextChange(mutations)
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        // If the added node is a shadow host, observe its shadow root
        if (node.nodeType === Node.ELEMENT_NODE && node.shadowRoot) {
          createObserver(node.shadowRoot)
        }
      })
    })
  })

  obslist.push([
    obs,
    elem,
    {
      childList: true,
      subtree: true,
      characterData: true,
    },
  ])
}
// Function to enable all observers
function enableObservers() {
  try {
    disableObservers()
  } catch (e) {}
  // warn(obslist, 1)
  obslist.forEach(([observer, target, opts]) =>
    observer.observe(target, opts)
  )
}

// Function to disable all observers
function disableObservers() {
  // warn(obslist, 0)
  obslist.forEach(([observer]) => observer.disconnect())
}

// Optionally, filter existing text content on page load
function filterExistingText(node) {
  disableObservers()
  if (node.nodeType === Node.TEXT_NODE) {
    var text = node.textContent
    var newtext = replaceText(text)
    if (newtext !== text) {
      // trace("changed")
      node.textContent = newtext
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    node.childNodes.forEach(filterExistingText)
    // If the element has a shadow root, filter its content
    if (node.shadowRoot) {
      filterExistingText(node.shadowRoot)
    }
  }
  enableObservers()
}

// Filter existing text in the document
var waitingForBody = false
if (document.body) {
  setup()
} else {
  waitingForBody = true
}

loadlib("libloader").savelib("textjack", function newTextJack(cb) {
  textJackList.push(cb)
  if (document.body) {
    setup()
  } else {
    waitingForBody = true
  }
})
a.bodyload().then(() => {
  if (waitingForBody) {
    setup()
  }
})

function setup() {
  createObserver(document.body)
  filterExistingText(document.body)
}

// ==UserScript==
// @name GeoGuessr Party Settings Bookmarklet Generator
// @namespace   ggpsbg
// @description Generate bookmarklets to save your current GeoGuessr party settings and share them
// @version 0.2
// @match https://www.geoguessr.com/*
// @require https://update.greasyfork.org/scripts/460322/1408713/Geoguessr%20Styles%20Scan.js
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541937/GeoGuessr%20Party%20Settings%20Bookmarklet%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/541937/GeoGuessr%20Party%20Settings%20Bookmarklet%20Generator.meta.js
// ==/UserScript==

function generateLink() {
  fetch("https://www.geoguessr.com/api/v4/parties/v2")
    .then((response) => response.json())
    .then((response) => {
      let parent = document.querySelectorAll("[class^=settings-modal_column]")[2].querySelector("[class^=settings-modal_section]")
    
      parent.querySelector(".ggpsbg-message").innerText = "Here is a bookmarklet to the current settings, you can copy it or drag and drop it yo your bookmarks"
    
      parent.querySelector(".ggpsbg-link").innerText = "Settings"
      parent.querySelector(".ggpsbg-link").href = "javascript: fetch('https://www.geoguessr.com/api/v4/parties/v2/game-settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(" + JSON.stringify(response.gameSettings).replaceAll('"', "'") + ") });"
    })
}

function onMutations(mutations) {
  if (!location.pathname.includes("/party")) return

  for (let mutation of mutations) {
    if (mutation.type === "childList") {
      if (mutation.addedNodes && mutation.addedNodes.length == 1 && mutation.addedNodes[0].className && mutation.addedNodes[0].className.startsWith && mutation.addedNodes[0].className.startsWith("overlay-modal_contentCon")) {
        scanStyles()
          .then(() => {
            let parent = document.querySelectorAll("[class^=settings-modal_column]")[2].querySelector("[class^=settings-modal_section]")

            let buttonGroup = document.createElement("div")
            buttonGroup.className = cn("status-section_buttonGroup__")

            let button = document.createElement("button")
            button.className = cn("button_button__") + " " + cn("button_variantTertiary__")
            button.addEventListener("click", generateLink)
            button.innerText = "Generate bookmarklet "

            buttonGroup.appendChild(button)
            parent.appendChild(buttonGroup)

            let div = document.createElement("div")
            div.className = "ggpsbg-message"
            parent.appendChild(div)

            let a = document.createElement("a")
            a.className = "ggpsbg-link"
            parent.appendChild(a)
         })
      }
    }
  }
}

window.addEventListener("load", (event) => {
  let observer = new MutationObserver(onMutations)

  let config = {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["title"],
  }

  observer.observe(document.body, config)
})

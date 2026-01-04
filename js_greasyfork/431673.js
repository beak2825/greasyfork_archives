// ==UserScript==
// @name         Neocodex: copy list of results
// @author       Tombaugh Regio
// @version      1.0
// @description  What it says on the tin
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neocodex.us/forum/index.php
// @grant        GM.setClipboard
// @downloadURL https://update.greasyfork.org/scripts/431673/Neocodex%3A%20copy%20list%20of%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/431673/Neocodex%3A%20copy%20list%20of%20results.meta.js
// ==/UserScript==

let arrayOfItems = []

function getResults() {
  arrayOfItems = []
  const searchResults = document.querySelector(".ipsList_inline.ipsList_reset.short").querySelectorAll("li")
  for (const item of searchResults) {
    let profit = 0
    if (item.querySelector('font[color="green"]')) {
      profit = parseInt(item.querySelector('font[color="green"]').textContent.match(/[\d,]+/)[0].split(",").join(""))
    }
    
    if (profit > 10000) arrayOfItems.push(item.querySelector(".desc a").textContent.trim())
  }
  
  let results = `"`
  
  results += arrayOfItems.join(`", "`) + `"`
  
  GM.setClipboard(results)
  
  document.querySelector('select[name="search_order"]').value = "profit_percentage"
}

const resultsButton = document.createElement("button")
resultsButton.textContent = "Get results"
resultsButton.style.margin = "0 0.5em"
resultsButton.onclick = getResults

Array.from(document.querySelectorAll(".general_box.alt.clear h3")).reverse()[0].appendChild(resultsButton)
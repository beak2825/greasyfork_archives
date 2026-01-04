// ==UserScript==
// @name        Negg Cave Solver
// @namespace   Neopets
// @match        *://www.neopets.com/shenkuu/neggcave/
// @match        *://thedailyneopets.com/articles/negg-solver/
// @version     1.1
// @author      themagicteeth
// @grant       GM_openInTab
// @grant       GM_setValue
// @grant       GM_getValue
// @description Adds a button to automatically copy page source, and open solution page
// @downloadURL https://update.greasyfork.org/scripts/431167/Negg%20Cave%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/431167/Negg%20Cave%20Solver.meta.js
// ==/UserScript==


function makeButton(text) {
  const copyButton = document.createElement("button")  // Create the button element
  copyButton.innerText = text // Button text
  copyButton.style.margin = "0 0.5em"  // Styling for the button
  return copyButton
}

// Set onClick of button to open the link in new tab
function setOnClick(button, url) {
  button.onclick = e => {
    GM_openInTab(url)
  }
}

if (!document.URL.includes("thedailyneopets")) {
  GM_setValue("source", document.documentElement.outerHTML)
}

// Negg cave
if (document.URL.includes("neggcave")) {
  const beforeButton = document.getElementById("mnc_popup_generic_wrongdate")  // Location to place the button
  const newButton = makeButton("Get the solution!")
  beforeButton.after(newButton)
  setOnClick(newButton, "https://thedailyneopets.com/articles/negg-solver/")
}

if (document.URL.includes("negg-solver")) {
  document.getElementById("PageSourceBox").value = GM_getValue("source")
}
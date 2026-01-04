// ==UserScript==
// @name         Handy Buttons
// @namespace    Neopets
// @version      1.3.1
// @description  Adds a button to automatically copy page source, and open various helpful pages that need the source HTML
// @match        *://www.neopets.com/books_read.phtml?pet_name=*
// @match        *://items.jellyneo.net/tools/book-checklist/
// @match        *://www.neopets.com/moon/books_read.phtml?pet_name=*
// @match        *://items.jellyneo.net/tools/booktastic-checklist/
// @match        *://www.neopets.com/gourmet_club.phtml?pet_name=*
// @match        *://items.jellyneo.net/tools/gourmet-checklist/
// @match        *://www.neopets.com/dome/*
// @match        *://battlepedia.jellyneo.net/?go=challenger_checklist
// @match        *://www.neopets.com/neoboards/preferences.phtml
// @match        *://www.jellyneo.net/avatars/
// @match        *://www.neopets.com/safetydeposit.phtml
// @match        *://items.jellyneo.net/tools/sdb-price-checker/
// @match        *://www.neopets.com/market.phtml?type=your*
// @match        *://items.jellyneo.net/tools/shop-stock-price-checker/
// @match        *://www.neopets.com/shenkuu/neggcave/
// @match        *://thedailyneopets.com/articles/negg-solver/
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @author       themagicteeth
// @downloadURL https://update.greasyfork.org/scripts/432903/Handy%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/432903/Handy%20Buttons.meta.js
// ==/UserScript==

/**
 * Each "block" for a page does the following:
 * 1. Checks if the URL contains a unique string
 * 2. Creates a button, with an onclick action for the desired page
 * 3. Opens the page in a new tab, and pastes the source (sometimes) into the input field
 */


/** HELPER FUNCTIONS */

// Create a generic button
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

// We dont want to copy the source of Jellyneo or TDN
if (!document.URL.includes("jellyneo") && !document.URL.includes("thedailyneopets")) {
  GM_setValue("source", document.documentElement.outerHTML)
}


/** BUTTONS!!!!!!!!!! */

// Safety deposit box
if (document.URL.includes("safetydeposit")) {
  const beforeButton = document.evaluate("//b[contains(., 'Your Safety Deposit Box')]", document, null, XPathResult.ANY_TYPE, null).iterateNext()
  const newButton = makeButton("Check prices on this page")
  beforeButton.after(newButton)
  setOnClick(newButton, "https://items.jellyneo.net/tools/sdb-price-checker/")
}

if (document.URL.includes("sdb-price-checker")) {
  document.getElementById("price-check-code").value = GM_getValue("source")
}

// Shop
if (document.URL.includes("market")) {
  const beforeButton = document.querySelector("img[name='keeperimage']")
  const newButton = makeButton("Check prices on this page")
  newButton.style.display = "block"
  beforeButton.after(newButton)
  setOnClick(newButton, "https://items.jellyneo.net/tools/shop-stock-price-checker/")
}

if (document.URL.includes("shop-stock-price-checker")) {
  document.getElementById("price-check-code").value = GM_getValue("source")
}

// Booktastic books
if (document.URL.includes("moon")) {
  const beforeButton = document.querySelector("#content > table > tbody > tr > td.content > center:nth-child(11) > p > a > img")
  const newButton = makeButton("Check needed books!")
  newButton.style.display = "block"
  beforeButton.after(newButton)
  setOnClick(newButton, "https://items.jellyneo.net/tools/booktastic-checklist/")
}

// Book club
if (document.URL.includes("books_read") && !document.URL.includes("moon")) {
  const beforeButton = document.querySelector("#content > table > tbody > tr > td.content > center:nth-child(7) > p > a > img")
  const newButton = makeButton("Check needed books!")
  newButton.style.display = "block"
  newButton.style.margin = "1em  0.5em"
  beforeButton.after(newButton)
  setOnClick(newButton, "https://items.jellyneo.net/tools/book-checklist/")
}

// Book club and Booktastic books
if (document.URL.includes("book-checklist") || document.URL.includes("booktastic-checklist")) {
  document.getElementById("checklist-hide-boring").checked = true

  // Change this if you want
  // 10 DOES NOT WORK ON BOOKTASTICK BOOKS!!!
  // 1: name, 2: price, 3: release, 4: SDB order, 5: price, 9: added to item DB, 10: category/shop
  document.getElementById("checklist-sort-by").value = 2

  document.getElementById("checklist-code").value = GM_getValue("source")
}

// Gourmet club
if (document.URL.includes("gourmet_club")) {
  const beforeButton = document.querySelector("#content > table > tbody > tr > td.content > div > img")
  const newButton = makeButton("Check needed foods!")
  newButton.style.display = "block"
  newButton.style.margin = "1em  0.5em"
  beforeButton.after(newButton)
  setOnClick(newButton, "https://items.jellyneo.net/tools/gourmet-checklist/")
}

if (document.URL.includes("gourmet-checklist")) {
  document.getElementById("checklist-hide-yuck").checked = true

  // Change this if you want
  // 1: name, 2: rarity, 3: release, 4: SDB order, 5: price, 9: added to item DB, 10: category/shop
  document.getElementById("checklist-sort-by").value = 2

  document.getElementById("checklist-code").value = GM_getValue("source")
}

// Battledome
if (document.URL.includes("dome")) {
  const beforeButton = document.getElementById("bdNav")
  const newButton = makeButton("Check missing challengers!")
  newButton.style.display = "block"
  newButton.style.margin = "0 auto"
  beforeButton.after(newButton)
  setOnClick(newButton, "http://battlepedia.jellyneo.net/?go=challenger_checklist")
}

if (document.URL.includes("challenger_checklist")) {
  document.querySelector("textarea[name='challengerHTML']").value = GM_getValue("source")
}

// Avatars
if (document.URL.includes("neoboards")) {
  const beforeButton = document.querySelector("#content > table > tbody > tr > td.content > form > table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(2) > select")
  const newButton = makeButton("Check missing avatars!")
  newButton.style.display = "block"
  newButton.style.margin = ".5em"
  beforeButton.after(newButton)
  setOnClick(newButton, "https://www.jellyneo.net/avatars/")

}

if (document.URL.includes("avatars")) {
  document.getElementById("avatarInput").value = GM_getValue("source")
  document.querySelector("input[name='excludeRetired'").checked = true
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

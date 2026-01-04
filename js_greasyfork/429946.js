// ==UserScript==
// @name        block fucking harry potter
// @namespace   chad
// @include     *://www.fanfiction.net/*
// @version     1.3
// @grant       none
// @description removes harry potter listings on fanfiction.net
// @downloadURL https://update.greasyfork.org/scripts/429946/block%20fucking%20harry%20potter.user.js
// @updateURL https://update.greasyfork.org/scripts/429946/block%20fucking%20harry%20potter.meta.js
// ==/UserScript==


const blocked = ["Harry Potter"]

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

let listingElements = document.getElementsByClassName("z-list")

if (!(listingElements.length > 0 && window.location.href.split("/")[3] != "u" && (isNumeric(window.location.href.split("/")[5]) || window.location.href.split("/")[3] == "search") )) {
  throw new Error("Not on a crossover or search page")
}

function addCSS(css='') {
  style = document.createElement('style')
  document.head.append(style)
  style.textContent = css
  return style
}

class Listing {
  constructor(element) {
    this.element = element
    let text = element.querySelector(".z-padtop2").textContent
    // parse fandom(s)
    if (text.startsWith("Crossover - ")) {
      this.fandom = text.substring("Crossover - ".length, text.lastIndexOf(" - Rated: "))
    } else {
      this.fandom = text.substring(0, text.lastIndexOf(" - Rated: "))
    }
  }
  
  hide() {
    this.element.classList.add("hidden")
  }
}

let listings = []

for (let listing of listingElements) {
  listings.push(new Listing(listing))
}

addCSS(".hidden {display: none}")


for (let listing of listings) {
  for (let fandom of blocked) {
    if (listing.fandom.contains(fandom)) {
     listing.hide()
    }
  }
}
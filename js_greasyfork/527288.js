// ==UserScript==
// @name        FurAffinity - Seamless Fav
// @namespace   proot
// @match       https://www.furaffinity.net/*
// @grant       none
// @version     1.0
// @author      a proot
// @license     MIT
// @description Fav submissions without reloading the page
// @downloadURL https://update.greasyfork.org/scripts/527288/FurAffinity%20-%20Seamless%20Fav.user.js
// @updateURL https://update.greasyfork.org/scripts/527288/FurAffinity%20-%20Seamless%20Fav.meta.js
// ==/UserScript==

let favURLMatcher = /https?:\/\/www\.furaffinity\.net\/(?:un)?fav\//;
let favButtonMatcher = /\/(?:un)?fav\/[0-9]+/;
let favTextMatcher = /href="(\/(?:un)?fav\/.*?)">(.*?)<\/a>/;

function allFavButtons() {
  return [...document.getElementsByTagName("a")].filter(a => favButtonMatcher.exec(a.href))
}

document.addEventListener("click", function (e) {
  e = e || window.event;
  let element = e.target || e.srcElement;

  if (element.tagName == 'A' && favURLMatcher.match(element.href)) {
    (async () => {
      allFavButtons().forEach(e => {
        // e.style.opacity = 0.5
        e.style.setProperty('color', '#808080', 'important')
        e.style.pointerEvents = "none"
      })
      let r = await fetch(element.href)
      let match = favTextMatcher.exec(await r.text())
      allFavButtons().forEach(e => {
        // e.style.opacity = 1
        e.style.color = ""
        e.style.pointerEvents = ""
        e.innerText = match[2].replace(" ", "")
        e.href = match[1]
      })
    })()
    e.preventDefault()
  }
})
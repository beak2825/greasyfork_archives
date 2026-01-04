// ==UserScript==
// @name GeoGuessr Highscore Human Readable Dates
// @namespace   gghrd
// @description Display the date on the highscores of a map in a human readable format
// @version 0.3
// @match https://www.geoguessr.com/*
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529177/GeoGuessr%20Highscore%20Human%20Readable%20Dates.user.js
// @updateURL https://update.greasyfork.org/scripts/529177/GeoGuessr%20Highscore%20Human%20Readable%20Dates.meta.js
// ==/UserScript==

function format(date) {
  /*
  sv-SE 2025-12-31
  en-GB 31/12/2025
  en-US 12/31/2025 💀

  year: 'numeric' | '2-digit'
  month: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long'
  day: 'numeric' | '2-digit'
  */
  return date.toLocaleDateString("sv-SE", { day: "2-digit", month: "2-digit", year: "2-digit" })
}

function onMutations (mutations) {
  if (!location.pathname.includes("/maps/")) return

  for (let mutation of mutations) {
    if (mutation.type === "childList") {
      if (mutation.target.nodeName == "TBODY" && mutation.addedNodes && mutation.addedNodes.length) {
        for (let addedNode of mutation.addedNodes) {
          for (let node of addedNode.querySelectorAll("[class*=map-highscore_date]")) {
            let span = node.querySelector("span")
            span.innerText = format(new Date(span.title))
          }
        }
      }
    } else if (mutation.type === "attributes") {
      if (mutation.attributeName === "title" && mutation.target.parentNode.className.includes("map-highscore_date")) {
        let span = mutation.target
        span.innerText = format(new Date(span.title))
      }
    } else {
      console.log(mutation)
    }
  }
}

window.addEventListener("load", (event) => {
  for (let node of document.body.querySelectorAll("[class*=map-highscore_date]")) {
    let span = node.querySelector("span")
    span.innerText = format(new Date(span.title))
  }

  let observer = new MutationObserver(onMutations);

  let config = {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["title"],
  };

  observer.observe(document.body, config);
});

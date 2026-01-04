// ==UserScript==
// @name         CSTimer Success Rate
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Shows the success rate percentage for cstimer sessions where it is under 95% (best for bld events)
// @author       You
// @match        https://cstimer.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cstimer.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494508/CSTimer%20Success%20Rate.user.js
// @updateURL https://update.greasyfork.org/scripts/494508/CSTimer%20Success%20Rate.meta.js
// ==/UserScript==

function showRate() {
  var text = document.querySelector("#stats > div.stattl > div > table > tbody > tr:nth-child(1) > th").innerText

  if (text.includes("successrate")) {
    return
  }

  var solveCount = text.slice(7, text.indexOf("\n"))

  var solveCountArray = solveCount.split("/")

  var successrate = Number(solveCountArray[0]) / Number(solveCountArray[1]) * 100

  var solveElement = document.querySelector("#stats > div.stattl > div > table > tbody > tr:nth-child(1) > th")

  var startingSegment = solveElement.innerHTML.slice(0, solveElement.innerHTML.indexOf("<"))

  var endSegment = solveElement.innerHTML.slice(solveElement.innerHTML.indexOf("<"))
if (successrate > 95 || solveCountArray[1] == "0") {
      return
  }

  solveElement.innerHTML = startingSegment + "<br>successrate: " + successrate.toFixed(1) + "%" + endSegment

}

document.addEventListener("keydown", showRate)

document.addEventListener("click", showRate)

window.addEventListener("load", showRate)
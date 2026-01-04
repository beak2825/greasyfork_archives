// ==UserScript==
// @name     AP Score Reveal
// @namespace   dev.josephgeis.apreveal
// @author      Joseph Geis
// @homepageURL https://josephgeis.dev/
// @description Hides AP exam scores, allowing you to reveal your scores one-by-one.
// @license     MIT
// @version     1.0.1
// @grant       none
// @include  https://apscore.collegeboard.org/scores/view-your-scores*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/429761/AP%20Score%20Reveal.user.js
// @updateURL https://update.greasyfork.org/scripts/429761/AP%20Score%20Reveal.meta.js
// ==/UserScript==

var preStyles = document.createElement("style")
preStyles.type = "text/css"
preStyles.appendChild(
  document.createTextNode(".row-fluid.item > .span5:nth-child(2) { opacity: 0; }")
)
document.head.appendChild(preStyles)

document.addEventListener("DOMContentLoaded", () => {
  let scoreFields = document.querySelectorAll(".row-fluid.item > .span5:nth-child(2) > span")

  for (field of scoreFields) {
    let scoreText = field.querySelector("em")

    scoreText.hidden = true

    let button = document.createElement("button")

    let unhide = () => {
      scoreText.hidden = !scoreText.hidden
      button.remove()
    }

    button.addEventListener("click", unhide)
    button.appendChild(
      document.createTextNode("Show")
    )

    field.appendChild(button)
  }
  
  preStyles.remove();
})


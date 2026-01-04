// ==UserScript==
// @name         AP Score Hider
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  Hides AP Exam scores on the College Board website until you click on them. As a bonus, display confetti when you click on a passing exam.
// @author       Samathingamajig
// @match        https://apstudents.collegeboard.org/view-scores*
// @icon         https://www.google.com/s2/favicons?domain=collegeboard.org
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js
// @downloadURL https://update.greasyfork.org/scripts/429680/AP%20Score%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/429680/AP%20Score%20Hider.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  // Grab all of the boxes that contain scores
  document.body.style.opacity = "0%"; // Hide the entire page until we can hide the scores themselves
  let ccontainers = [];
  let counter = 0;
  while ((ccontainers = document.querySelectorAll(".apscores-card-col-left.display-flex")).length == 0) {
    await new Promise((res) => setTimeout(res, 10)); // Wait 10 ms
    if (++counter >= 500) {
      document.body.style.opacity = "100%";
      return; // Exit program after 5 seconds of loading
    }
  } // Wait for page to load

  for (let i = 0; i < ccontainers.length; i++) {
    // Iterate through all the score boxes
    const ccontainer = ccontainers[i];
    const container = ccontainer.querySelector(".apscores-badge.apscores-badge-score");
    if (!container) continue; // Might've accidentally selected an award
    ccontainer.style.opacity = "0%"; // Hide the score number
    ccontainer.parentNode.children[1].style.opacity = "0%"; // Hide the sidebar of a score
    setTimeout(() => {
      ccontainer.style.transition = ccontainer.parentNode.children[1].style.transition = "opacity 500ms";
    }, 600);
    ccontainer.parentNode.parentNode.style.cursor = "pointer"; // Makes the mouse display a pointer when you hover over the place the score should be
    ccontainer.parentNode.children[1].style.pointerEvents = "none"; // Make the sidebar not clickable

    const clickListener = (e) => {
      e.stopPropagation();
      const container = ccontainer.querySelector(".apscores-badge.apscores-badge-score"); // Have to do this again because reference gets messed
      const scoreNode = container.childNodes[1]; // Grab the text box that holds the score number
      const score = parseInt(scoreNode.nodeValue); // Get the score as a number (not a string)
      console.log(score);
      if (score >= 3) {
        const { left, top } = ccontainer.getBoundingClientRect();

        // Display confetti if score is >= 3, and the higher the score, the more confetti.
        // This function comes from the `@require` section in the top of this file
        window.confetti({
          particleCount: 400 * [0.25, 0.5, 1][score - 3],
          spread: 160,
          startVelocity: 50 * [0.6, 0.8, 1][score - 3],
          origin: {
            x: (left + ccontainer.offsetWidth / 2) / window.innerWidth,
            y: (top + ccontainer.offsetHeight / 2) / window.innerHeight,
          },
        });
      }
      ccontainer.style.opacity = "100%"; // Show the score number
      ccontainer.parentNode.children[1].style.opacity = "100%"; // Show the sidebar of a score
      ccontainer.parentNode.children[1].style.pointerEvents = ""; // Make the sidebar clickable again
      ccontainer.parentNode.parentNode.style.cursor = ""; // Don't show a pointer on hover anymore
      ccontainer.parentNode.parentNode.removeEventListener("click", clickListener); // Delete the click listener so confetti doesn't show multiple times
    };
    ccontainer.parentNode.parentNode.addEventListener("click", clickListener); // Listen for a "click" event on each container in this loop
  }
  document.body.style.opacity = "100%"; // Reshow the page after hiding the scores and adding the click listeners
})();

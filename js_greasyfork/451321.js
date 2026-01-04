// ==UserScript==
// @name        Bypass "Calculation of totals has been disabled" for canvas
// @namespace   https://boehs.org
// @match       https://*.instructure.com/courses/*/grades
// @grant       none
// @version     1.1.0
// @author      Evan Boehs
// @description Calculates totals when canvas doesn't want to
// @supportURL  https://gist.github.com/boehs/883fda113facb902ac440cab26b09cb9
// @license     GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/451321/Bypass%20%22Calculation%20of%20totals%20has%20been%20disabled%22%20for%20canvas.user.js
// @updateURL https://update.greasyfork.org/scripts/451321/Bypass%20%22Calculation%20of%20totals%20has%20been%20disabled%22%20for%20canvas.meta.js
// ==/UserScript==

function update() {
  let totalCurrent = 0
  let totalPossible = 0
  const assignments = document.querySelectorAll("tr.student_assignment:not(.group_total)")
  assignments.forEach(assignment => {
    const possible = Number((assignment.querySelector(".possible.points_possible").textContent || "").trim())
    const current = Number((assignment.querySelector(".assignment_score .grade").textContent.replace(/((hat-)|[^0-9-.])/g,"") || "").trim())
    if (!isNaN(possible + current)) {
      totalPossible += possible
      totalCurrent += current
    }
  })
  const percent = ((totalCurrent / totalPossible) * 100).toFixed(2)
  
  document.getElementById("student-grades-final").innerHTML = `${percent}% <sub>
  <span>(Bypassed)</span>
  <br/>
  <span>NOTE: This script does not support weights yet</span>
  </sub>`
}

if (document.getElementById("student-grades-final").textContent.trim() == 'Calculation of totals has been disabled') {
  const observer = new MutationObserver(update)
  
  observer.observe(document.getElementById("grades_summary"), { childList:true, subtree:true })
  
  update()
}
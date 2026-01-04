// ==UserScript==
// @name         AtCoder Submission Notes
// @namespace    https://greasyfork.org/users/your-username
// @version      2.1.0
// @description  Add notes to AtCoder submissions
// @author       zerozero-0-0
// @match        https://atcoder.jp/contests/*/submissions/me*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527638/AtCoder%20Submission%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/527638/AtCoder%20Submission%20Notes.meta.js
// ==/UserScript==
 
(function () {
  "use strict";
 
  const contestIdMatch = location.pathname.match(/contests\/([^/]+)/);
  const contestId = contestIdMatch ? contestIdMatch[1] : "unknown_contest";
 
  const table = document.querySelector("table");
  if (!table) return;
 
  const headerRow = table.querySelector("thead tr");
  if (headerRow && !headerRow.querySelector(".note-header")) {
    const noteHeader = document.createElement("th");
    noteHeader.textContent = "Note";
    noteHeader.className = "note-header";
    headerRow.appendChild(noteHeader);
  }
 
  const rows = Array.from(document.querySelectorAll("tbody tr"));
 
  rows.forEach((row) => {
    const dataIdElement = row.querySelector("[data-id]");
    const submissionId = dataIdElement ? dataIdElement.getAttribute("data-id") : "unknown_submission";
    const noteKey = `atcoder_note_${contestId}_row_${submissionId}`;
 
    const td = document.createElement("td");
    td.style.minWidth = "200px";
 
    const textarea = document.createElement("textarea");
    textarea.style.width = "100%";
    textarea.style.height = "50px";
    textarea.value = localStorage.getItem(noteKey) || "";
 
    textarea.addEventListener("input", (event) => {
      localStorage.setItem(noteKey, event.target.value);
    });
 
    td.appendChild(textarea);
    row.appendChild(td);
  });

})();
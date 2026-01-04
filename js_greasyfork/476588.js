// ==UserScript==
// @name        Who is Hiring Checklist
// @namespace   Violentmonkey Scripts
// @match       https://news.ycombinator.com/item
// @grant       none
// @version     1.0
// @author      Giovanni d'Amelio
// @description 10/2/2023, 5:09:54 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/476588/Who%20is%20Hiring%20Checklist.user.js
// @updateURL https://update.greasyfork.org/scripts/476588/Who%20is%20Hiring%20Checklist.meta.js
// ==/UserScript==

const comments = document.querySelectorAll("tr.comtr");

const APPLIED = "☑ Applied";
const NOT_APPLIED = "☐ Not Applied";

// Add the buttons if it is a Who is hiring thread
if (document.querySelector("span.titleline").textContent.includes("Who is hiring?")) {
  renderButtons();
}

// Listen for clicks on all the buttons
const commentTree = document.querySelector("table.comment-tree");
commentTree.addEventListener("click", (event) => {
  if (!event.target.classList.contains("checklist")) {
    return;
  }

  event.preventDefault();
  const link = event.target;

  // Save the id to localstorage
  const id = link.getAttribute("data-id");
  if (localStorage.getItem(`applied-to-${id}`)) {
    localStorage.removeItem(`applied-to-${id}`);
  } else {
    localStorage.setItem(`applied-to-${id}`, true);
  }

  // Delete the button and the | before it
  if (link.previousSibling.nodeType === Node.TEXT_NODE) {
    link.parentNode.removeChild(link.previousSibling);
  }
  link.parentNode.removeChild(link);

  // Rerender the buttons
  // TODO: it is pretty lazy to rerender all the buttons just to update one, but it is plenty fast enough...
  renderButtons();
});

// Render all the buttons
function renderButtons() {
  // Add a button to each comment
  comments.forEach((tr) => {
    const span = tr.querySelector("span.navs");
    const id = tr.getAttribute("id");

    // Don't add the button if one already exists
    if (tr.querySelector("a.checklist")) {
      return
    }

    // Create a new <a> element
    const link = document.createElement("a");
    link.href = "#";
    link.classList.add("checklist");
    link.setAttribute("data-id", id);

    // Set the text based on localStorage
    if (localStorage.getItem(`applied-to-${id}`)) {
      link.textContent = APPLIED;
    } else {
      link.textContent = NOT_APPLIED;
    }

    // Append the <a> element to the span
    span.append("| ")
    span.appendChild(link);
  });
}
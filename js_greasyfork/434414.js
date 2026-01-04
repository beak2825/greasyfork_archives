// ==UserScript==
// @name          AO3: Add Confirmation before Posting Works
// @author        Quihi
// @version       1.0
// @namespace     https://greasyfork.org/en/users/812553-quihi
// @description   Adds a confirmation to the "Post" button on Archive of Our Own.
// @match         https://archiveofourown.org/*works*/*
// @match     	  https://www.archiveofourown.org/*works*/*
// @downloadURL https://update.greasyfork.org/scripts/434414/AO3%3A%20Add%20Confirmation%20before%20Posting%20Works.user.js
// @updateURL https://update.greasyfork.org/scripts/434414/AO3%3A%20Add%20Confirmation%20before%20Posting%20Works.meta.js
// ==/UserScript==

// when posting a work
try {
  document.getElementById("work-form").querySelectorAll("input[name='post_button']")[0].setAttribute("data-confirm", "Are you sure you're ready to post this?");
}
catch (error) {}

// when posting a chapter
try {
  document.getElementById("chapter-form").querySelectorAll("input[name='post_without_preview_button']")[0].setAttribute("data-confirm", "Are you sure you're ready to post this?");
}
catch (error) {}

// when editing a draft
try {
  document.getElementById("previewpane").querySelectorAll("input[name='post_button']")[0].setAttribute("data-confirm", "Are you sure you're ready to post this?");
}
catch (error) {}

// other times editing a chapter
try {
  document.getElementsByClassName("edit_chapter")[0].querySelectorAll("input[name='post_button']")[0].setAttribute("data-confirm", "Are you sure you're ready to post this?");
}
catch (error) {}

// other times editing a chapter
try {
  document.getElementsByClassName("edit_chapter")[0].querySelectorAll("input[name='update_button']")[0].setAttribute("data-confirm", "Are you sure you're ready to post this?");
}
catch (error) {}

// other times editing a work
try {
  document.getElementsByClassName("edit_work")[0].querySelectorAll("input[name='update_button']")[0].setAttribute("data-confirm", "Are you sure you're ready to post this?");
}
catch (error) {}

// on the drafts page
try {
  let draftspage = document.getElementsByClassName("works-drafts dashboard region")[0];
  let buttons = draftspage.getElementsByClassName("actions");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].children[3].children[0].setAttribute("data-confirm", "Are you sure you're ready to post this?");
  }
}
catch (error) {}

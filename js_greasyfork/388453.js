// ==UserScript==
// @name        MetaFilter number all comments
// @version     17
// @grant       none
// @match         *://*.metafilter.com/*
// @description On MetaFilter.com, adds a comment number like "comment 1 of 30" to each comment.
// @namespace   https://greasyfork.org/users/324881
// @downloadURL https://update.greasyfork.org/scripts/388453/MetaFilter%20number%20all%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/388453/MetaFilter%20number%20all%20comments.meta.js
// ==/UserScript==

function addCountToComments() {
  let allCommentDivs = document.getElementsByClassName('comments'); // Get all divs with className 'comments'
  allCommentDivs = Array.from(allCommentDivs).filter( function(div) { return div.previousSibling.tagName == 'A'; }); // Some "comment" divs are not actually comments. All comments, and only comments, are preceeded by an anchor tag. So this filters down to only real comment divs.
  for (let [i,divToHighlight] of allCommentDivs.entries()) { // Loop over the remaining divs.
    setTimeout(function() { // Drop each div's DOM changes on the event loop so we don't block it.
      let existingSpan = divToHighlight.getElementsByClassName('tehhundUserScriptCommentCount'); // Check for existing number spans in the current div.
      for (let currentSpan of existingSpan) { currentSpan.remove(); } // Remove any existing number spans from the current div. In theory there should only be 1 but we'll add a for-of loop just in case something went wrong and added more than 1.
      divToHighlight.querySelector('.smallcopy').innerHTML += '<span class=\'tehhundUserScriptCommentCount\'>Comment ' + (i+1) + ' of ' + allCommentDivs.length + '. </span>'; // Now add a number span.
    },0)
  }
}

function runIfCommentAdded(mutationsList, observer) { // When a mutation event occurs, check if it was adding a comment and if so renumber the comments.
  for (let mutation of mutationsList) { // Loop over all mutations for this event.
    try {
      if (mutation.target.previousSibling.tagName == 'A') { // If the target's previousSibling is an anchor tag, it's probably an added comment so renumber the comments. Otherwise do nothing.
        addCountToComments();
      }
    } catch(e) { /* previousSibling is null if the mutation was adding a Favorite, and that throws an error on the console every time. This try/catch discards the error. */ }
  }
}

setTimeout(addCountToComments, 100); // The script sometimes breaks if it runs right away, so give the page 100 ms to be ready.

// After the initial run, observe the main content div for changes such as new comments and run addCountToComments() again.
const mutationObserver = new MutationObserver(runIfCommentAdded);
mutationObserver.observe(document.getElementById('posts'), { attributes: true, childList: true, subtree: true })
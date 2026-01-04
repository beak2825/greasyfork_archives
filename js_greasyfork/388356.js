// ==UserScript==
// @name        MetaFilter highlight selected comment
// @version     14
// @grant       none
// @match       *://*.metafilter.com/*
// @description On MetaFilter.com, adds a border to the selected comment to make it stand out visually, and adds "selected comment" to the small text to make it easy to search if you lose your place.
// @namespace   https://greasyfork.org/users/324881
// @downloadURL https://update.greasyfork.org/scripts/388356/MetaFilter%20highlight%20selected%20comment.user.js
// @updateURL https://update.greasyfork.org/scripts/388356/MetaFilter%20highlight%20selected%20comment.meta.js
// ==/UserScript==

// on load, run highlight and attach event listeners
if (window.location.hash.substring(1) != "") highlightSelectedComment(window.location.hash.substring(1)); // Highlight selected comment on first load. No need to remove highlight on first load as it won't exist.
window.addEventListener('hashchange', handleHashChangeEvent); // Run every time the hash changes.

function handleHashChangeEvent(event) {
  if (event.oldURL.split('#')[1] != null) removeSelectedCommentHighlight(event.oldURL.split('#')[1]);
  if (event.newURL.split('#')[1] != null) highlightSelectedComment(event.newURL.split('#')[1]);
}

function highlightSelectedComment(newHash) {
  let divToHighlight = getTargetDiv(newHash);
  divToHighlight.style.outline = '.2em solid #9cc754';
  divToHighlight.style.outlineOffset = '.2em';
  //divToHighlight.lastChild.innerHTML += '<span class=\'tehhundUserScriptSelectedComment\'>Selected comment. </span>';
  divToHighlight.querySelector('.smallcopy').innerHTML += '<span class=\'tehhundUserScriptSelectedComment\'>Selected comment. </span>';
}

function removeSelectedCommentHighlight(oldHash) {
  let commentDiv = getTargetDiv(oldHash);

  // Remove styles
  commentDiv.style.outline = '';
  commentDiv.style.outlineOffset = '';

  // Remove 'Selected comment' text
  let allSelectedCommentsSpans = commentDiv.getElementsByClassName('tehhundUserScriptSelectedComment');
  for (selectedCommentSpan of allSelectedCommentsSpans) {
    selectedCommentSpan.remove();
  }
}

function getTargetDiv(hash) {
  let anchor = document.getElementsByName(hash)[0];
  let targetDiv = anchor.nextSibling;
  return targetDiv;
}
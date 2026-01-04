// ==UserScript==
// @name         Fix Fake Hyperlinks
// @namespace    https://greasyfork.org/en/users/689296
// @version      0.3.0
// @description  Replaces <a href=''> and <a href='#'> with <a>
// @author       l4vr0vatyahoo@gmail.com
// @icon         https://avatars1.githubusercontent.com/u/55962744
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @require      https://code.jquery.com/jquery-1.11.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/411641/Fix%20Fake%20Hyperlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/411641/Fix%20Fake%20Hyperlinks.meta.js
// ==/UserScript==
const undesiredHrefs = new Set().add('').add('#');

// Avoid conflicts when loading jQuery
this.$ = window.jQuery.noConflict(true);

// Method to run on page load, to find and fix fake hyperlinks
function findAndFixFakeHyperlinks() {
  emptyHyperlinks = $("a[href='#'],a[href='']");
  emptyHyperlinks.removeAttr('href');
  emptyHyperlinks.css('cursor', 'pointer');
}

// Method to run when a node gets added or changed
function detectAndFixFakeHyperlinks(mutatedNode) {
  if (
    mutatedNode.tagName == 'A' &&
    mutatedNode.attributes['href'] != undefined &&
    undesiredHrefs.has(mutatedNode.attributes['href'].value)
  ) {
    const jQMutatedNode = $(mutatedNode);
    jQMutatedNode.removeAttr('href');
    jQMutatedNode.css('cursor', 'pointer');
  }
}

// Main script to run when page is loaded
function runFixFakeHyperlinks() {
  // Find and fix fake hyperlinks (first-pass)
  console.log("Finding and fixing fake hyperlinks!");
  findAndFixFakeHyperlinks();
  
  // Set up a monitor to update whenever new anchor tags get added
  const observer = new MutationObserver(
   function(mutations) {
    mutations.forEach(function(mutation) {
      detectAndFixFakeHyperlinks(mutation.target);
      mutation.addedNodes.forEach(detectAndFixFakeHyperlinks);
    })
  });

  observer.observe(document, {
    childList: true,
    attributes: true,
    subtree: true
  });
  
  // In case the observer misses events,
  // wait a few seconds and fix again globally
  setTimeout(findAndFixFakeHyperlinks, 5000)
}

runFixFakeHyperlinks();
// ==UserScript==
// @name Remove Twitter Promote Button
// @namespace http://voilentmonkey.net/
// @version 0.1
// @description Removes the "Promote" button on Twitter
// @author Razor7100 on Github
// @match https://twitter.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/465606/Remove%20Twitter%20Promote%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/465606/Remove%20Twitter%20Promote%20Button.meta.js
// ==/UserScript==
function deleteButtons() {
  const buttons = document.querySelectorAll('.css-4rbku5.css-18t94o4.css-1dbjc4n.r-1niwhzg.r-sdzlij.r-1phboty.r-rs99b7.r-1loqt21.r-1s2bzr4.r-2yi16.r-1qi8awa.r-1ny4l3l.r-ymttw5.r-o7ynqc.r-6416eg.r-lrvibr');

  buttons.forEach(button => {
    button.remove();
  });
}

// Attach the MutationObserver when the page is finished loading
window.addEventListener('load', () => {
  // Select the node that will be observed for mutations
  const targetNode = document.body;

  // Options for the observer (which mutations to observe)
  const config = { attributes: false, childList: true, subtree: true };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver((mutationsList, observer) => {
    deleteButtons();
  });

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

  // Delete any buttons that are already in the DOM
  deleteButtons();
});

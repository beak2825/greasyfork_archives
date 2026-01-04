// ==UserScript==
// @name     Edible KYM comments
// @license MIT
// @description   Adds an "Eat" button to every comment on the website Know Your Meme, which deletes the html of that comment when clicked.
// @version  1
// @match        *://knowyourmeme.com/
// @include  https://knowyourmeme.com/*
// @grant    none
// @run-at   document-end
// @namespace https://greasyfork.org/users/841963
// @downloadURL https://update.greasyfork.org/scripts/468843/Edible%20KYM%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/468843/Edible%20KYM%20comments.meta.js
// ==/UserScript==


// Step 1: create button
var tempElement = document.createElement('div');
tempElement.innerHTML = '<div class="edible-link-container" style="display: inline-block;padding-left: 8px;"><a class="reply-link small orange button" href="" onclick="event.preventDefault(); this.parentNode.parentNode.parentNode.parentNode.remove();">Eat</a></div>';


// Step 2: get comments
var comments = document.getElementsByClassName("comment");


// Step 3: clone button to each comment
for (var i = 0; i < comments.length; i++) {
  comments[i].children[1].children[5].appendChild(tempElement.firstChild.cloneNode(true));
}


// Step 4: Create a MutationObserver to watch for changes
var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    var newNodes = Array.from(mutation.addedNodes);
    var traverseAndAppend = function (node) {
      if (node instanceof Element && node.classList.contains("comment")) {
        node.children[1].children[5].appendChild(tempElement.firstChild.cloneNode(true));
      }
      var childNodes = Array.from(node.childNodes);
      childNodes.forEach(function (childNode) {
        traverseAndAppend(childNode);
      });
    };
    newNodes.forEach(function (newNode) {
      traverseAndAppend(newNode);
    });
  });
});


// Step 5: Configure and start observing for changes
var config = { childList: true, subtree: true };
observer.observe(document.body, config);

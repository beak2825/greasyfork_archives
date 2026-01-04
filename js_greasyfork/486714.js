// ==UserScript==
// @name        Ignore User in altcoinstalks.com forum
// @namespace   Ignore User in altcoinstalks
// @match       https://www.altcoinstalks.com/index.php?*
// @grant       none
// @version     1.1
// @author      bitmover
// @license     MIT
// @description 2/2/2024, 12:32:37 PM
// @downloadURL https://update.greasyfork.org/scripts/486714/Ignore%20User%20in%20altcoinstalkscom%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/486714/Ignore%20User%20in%20altcoinstalkscom%20forum.meta.js
// ==/UserScript==


// Add all user you want to ignore in the list below //
const ignoredUsers = ['satoshi','Nakamoto'];

function removeUserPosts(ignoredUsers){
  const quickModForm = document.getElementById('quickModForm');
  const allPosts = quickModForm.querySelectorAll("[class^=windowbg]");

  for (let user of ignoredUsers){
    for (let post of allPosts) {
      if (post.querySelector('.poster h4').innerText === " "+user) {
        post.querySelector('ul').innerHTML = 'user is currently ignored';
        post.querySelector('.post').innerHTML = 'user is currently ignored';
        post.querySelector('.moderatorbar').innerHTML = '';
      }
    }
  }
}


function removeUserTopics(ignoredUsers){
  const tableGrid = document.getElementById('messageindex');
  const allTopics = tableGrid.querySelectorAll("tr:not(.catbg)");
    for (let post of allTopics) {
      if (ignoredUsers.some(user => post.querySelector('p').innerText.includes(user))) {
        post.innerHTML = '';
      }
    }
}
const url = window.location.href;
if (url.includes("board")) {
  removeUserTopics(ignoredUsers);
} else if (url.includes("topic")) {
  removeUserPosts(ignoredUsers);
} else {
}
// ==UserScript==
// @name        Hide Smashboards User
// @namespace   http://smashboards.com/members/nqztv.238332/
// @description Hides all posts on smashboards from specified users.
// @include     /^https?://.*smashboards\.com/.*$/
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3633/Hide%20Smashboards%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/3633/Hide%20Smashboards%20User.meta.js
// ==/UserScript==

//MODIFY THIS LINE ONLY!!! Add usernames of people you don't want to see!
var users = ["user1", "user2", "etc", "Z'zgashi"];

function hideAllPostsFromUser(username) {
  var posts = document.getElementsByTagName("li");

  for (var i = 0; i < posts.length; i++) {
    if (posts[i].getAttribute("data-author") === username) {
      posts[i].style.display = "none";
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  for (var i = 0; i < users.length; i++) {
    hideAllPostsFromUser(users[i]);
  }
});
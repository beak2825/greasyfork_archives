// ==UserScript==
// @name         Add A Link To Hide All Reddit Posts
// @namespace    AddALinkToHideAllRedditPosts
// @version      1.0.1
// @description  Add a link to hide all Reddit posts listed in currently logged-on user's page tab (Overview, Submitted, Downvoted, etc.). This script will auto-navigate to the next page (if any) and will continue hiding any hideable posts until the last page.
// @author       jcunews
// @include      *://*.reddit.com/user/*/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33302/Add%20A%20Link%20To%20Hide%20All%20Reddit%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/33302/Add%20A%20Link%20To%20Hide%20All%20Reddit%20Posts.meta.js
// ==/UserScript==

var hideLinks = document.querySelectorAll('.thing .hide-button a'), linkIndex = 0, hidePostsInProgress = false;
if (hideLinks.length) {
  var rActionsTrigger = r.actions.trigger;
  r.actions.trigger = function(name, object) {
    if (hidePostsInProgress && (name === "legacy:change-state")) {
      var oldPostCallback = object.post_callback;
      object.post_callback = function(){
        var result, nextLink;
        if (oldPostCallback) {
          result = oldPostCallback.apply(this, arguments);
        }
        if (hidePostsInProgress) {
          if (++linkIndex < hideLinks.length) {
            hideLinks[linkIndex].click();
          } else {
            nextLink = document.querySelector(".nav-buttons .next-button a");
            if (nextLink) {
              nextLink.click();
            } else {
              hidePostsInProgress = false;
              delete sessionStorage.hidePostsInProgress;
            }
          }
          return result;
        }
      };
    }
    return rActionsTrigger.apply(this, arguments);
  };
  var menuArea = document.querySelector(".menuarea > .spacer");
  var link = document.createElement("A");
  link.textContent = "Hide All Posts";
  link.style.marginLeft = "2ex";
  link.href = "#";
  link.onclick = function() {
    if (!hidePostsInProgress) {
      hidePostsInProgress = true;
      sessionStorage.hidePostsInProgress = 1;
      hideLinks[0].click();
    }
    return false;
  };
  menuArea.appendChild(link);
  if (hidePostsInProgress = sessionStorage.hidePostsInProgress) {
    hideLinks[0].click();
  }
} else {
  hidePostsInProgress = false;
  delete sessionStorage.hidePostsInProgress;
}

// ==UserScript==
// @name           Add Link To Expand YouTube Community Comments
// @version        1.1
// @namespace      AddLinkToExpandYouTubeCommunityComments
// @description    Add a link to expand YouTube Community comment contents and replies
// @author         jcunews
// @include        https://www.youtube.com/comments*
// @downloadURL https://update.greasyfork.org/scripts/27245/Add%20Link%20To%20Expand%20YouTube%20Community%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/27245/Add%20Link%20To%20Expand%20YouTube%20Community%20Comments.meta.js
// ==/UserScript==

function expandCommentsInPage() {
  var i, eles = document.querySelectorAll('#yt-comments-list .comment-entry'), ele;
  for (i = eles.length-1; i >= 0; i--) {
    ele = eles[i].querySelector(".expand");
    if (ele) {
      eles[i].click();
    }
    ele = eles[i].querySelector(".show-more");
    if (ele) {
      eles[i].click();
    }
  }
}

var btn = document.createElement("A");
btn.textContent = "Expand All Comments";
btn.style = "margin-left:2ex";
btn.href="javascript:void(0)";
btn.onclick = expandCommentsInPage;
document.querySelector("#ytch-root .tabs-container").appendChild(btn);

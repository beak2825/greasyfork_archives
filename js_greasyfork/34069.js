// ==UserScript==
// @name         YouTube Auto Insert User Name Into Comment Reply Box
// @namespace    YouTubeAutoInsertUserNameIntoCommentReplyBox
// @version      1.0.1
// @description  Automatically insert the user name whom you're replying to into the comment reply's edit box.
// @author       jcunews
// @include      https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34069/YouTube%20Auto%20Insert%20User%20Name%20Into%20Comment%20Reply%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/34069/YouTube%20Auto%20Insert%20User%20Name%20Into%20Comment%20Reply%20Box.meta.js
// ==/UserScript==

addEventListener("click", function(ev, ele, author) {
  ele = ev.target;
  if (!ele.classList.contains("comment-renderer-reply")) return;
  ele = ele.parentNode.parentNode;
  author = ele.parentNode.querySelector(".comment-author-text");
  if (!author || !(ele = ele.querySelector(".comment-simplebox-text"))) return;
  ele.innerHTML = "+" + author.outerHTML + ": ";
});

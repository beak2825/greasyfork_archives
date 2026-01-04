// ==UserScript==
// @name        vas3k.club userscript
// @name:ru     vas3k.club userscript
// @namespace   Violentmonkey Scripts
// @match       *://vas3k.club/*
// @grant       none
// @version     1.1
// @author      Aracturat
// @homepageURL https://github.com/Aracturat/vas3k.club-userscript
// @description Vas3k.club userscript
// @description:ru Vas3k.club userscript
// @downloadURL https://update.greasyfork.org/scripts/421218/vas3kclub%20userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/421218/vas3kclub%20userscript.meta.js
// ==/UserScript==

// Кнопки "свернуть" \ "развернуть" для комментариев  

function createHideCommentButton(subcomments) {
  const hide = `<i class="fas fa-minus"></i>&nbsp;свернуть`;
  const expand = `<i class="fas fa-plus"></i>&nbsp;развернуть`;
  
  const hideCommentsButton = document.createElement("span");
  hideCommentsButton.classList.add("comment-reply-button");
  hideCommentsButton.innerHTML = hide;
    
  let expanded = true;
  
  hideCommentsButton.addEventListener('click', e => {
    subcomments.style.display = expanded ? 'none' : 'block';
    hideCommentsButton.innerHTML = expanded ? expand : hide;
    expanded = !expanded;
  });
  
  return hideCommentsButton;
}

function getSubcomments(comment) {
  let subcomments = comment.nextElementSibling;
  
  if (!subcomments) {
    return null;
  }
  
  if (subcomments.className === 'clearfix') {
    subcomments = subcomments.nextElementSibling;
  }
  
  if (subcomments.tagName === 'FORM') {
    return null;
  }
  
  return subcomments;
}

[...document.querySelectorAll(".comment")].forEach(comment => {
  const subcomments = getSubcomments(comment);
  if (!subcomments) {
    return;
  }
  
  const commentFooter = comment.querySelector(".comment-footer");
  const hideCommentsButton = createHideCommentButton(subcomments);
  
  commentFooter.prepend(hideCommentsButton);
});

[...document.querySelectorAll(".comment-replies .reply")].forEach(comment => {
  const subcomments = getSubcomments(comment);
  if (!subcomments) {
    return;
  }
  
  const commentFooter = comment.querySelector(".reply-footer");
  const hideCommentsButton = createHideCommentButton(subcomments);
  
  commentFooter.prepend(hideCommentsButton);
});
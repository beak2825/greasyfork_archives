// ==UserScript==
// @name         dw comment spacer
// @namespace    https://greasyfork.org/en/users/36620
// @version      0.1.0
// @description  add extra line breaks to desired comments
// @author       scriptfairy
// @include      https://*.dreamwidth.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416221/dw%20comment%20spacer.user.js
// @updateURL https://update.greasyfork.org/scripts/416221/dw%20comment%20spacer.meta.js
// ==/UserScript==

function add_breaks(el) {
    el.innerHTML = el.innerHTML.replace(/<br>/g,'<br><br>').replace(/<br\/>/g,'<br><br>').replace(/<br><br><br><br>/g, '<br><br>');
}


let comments = document.querySelectorAll('div[id^="comment-cmt"]');

for (let i = 0; i < comments.length; i++) {
  let comment = comments[i];
  let id = comment.id;
  let header = comment.querySelector(".header .comment-info");
  
  let trigger = document.createElement('span');
  trigger.classList.add("commentpermalink");
  // trigger.style.float = "right";
  trigger.innerHTML = "(<a class='" + id + "'>add line breaks</a>)";
  
  header.appendChild(trigger);
};

let triggers = document.querySelectorAll('a[class*="comment-cmt"]');
for (let i = 0; i < triggers.length; i++) {
  let trigger = triggers[i];
  let id = trigger.classList[0].trim();
  let comment_body = document.querySelector('div[id*="' + id + '"]');
  trigger.onclick = function() {add_breaks(comment_body);};
}
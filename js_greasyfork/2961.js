// ==UserScript==
// @name        Hacker News Author Highlight
// @namespace   http://cantcode.com
// @description Makes the author name more apparent when scrolling through comments.
// @include     https://news.ycombinator.com/item?id=*
// @include     http://news.ycombinator.com/item?id=*
// @version     1.5
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/2961/Hacker%20News%20Author%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/2961/Hacker%20News%20Author%20Highlight.meta.js
// ==/UserScript==

// Colors
const colors = {
  bg: "#8000FF",
  fg: "#fff",
  newUserFg: "#00FF00",
}

// Author
const subtextLinks = document
  .querySelector("table .subtext")
  .getElementsByTagName("a");
const author = subtextLinks[0].textContent;

// Author Comments
const commentAuthors = document.querySelectorAll(
  '.comhead a[href="user?id=' + author + '"]',
);

const updateAuthor = (authorElement) => {
  authorElement.style.backgroundColor = colors.bg;
  authorElement.style.color = colors.fg;
  authorElement.style.padding = "1px 2px";
  authorElement.style.borderRadius = "3px";

  // Override HN's embedded <font> for new users
  if (authorElement.innerHTML.includes('color=')) {
    authorElement.style.color = colors.newUserFg;
    authorElement.innerText = author;
  }
};

commentAuthors.forEach(updateAuthor);
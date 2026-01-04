// ==UserScript==
// @name         Hacker News blockquote styling
// @version      1.2
// @description  Adds styling to blockquotes in Hacker News comments
// @author       Ryan Buening
// @license      MIT
// @namespace    https://github.com/ryanbuening/userscripts
// @match        https://news.ycombinator.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/437613/Hacker%20News%20blockquote%20styling.user.js
// @updateURL https://update.greasyfork.org/scripts/437613/Hacker%20News%20blockquote%20styling.meta.js
// ==/UserScript==

const [head] = document.getElementsByTagName('head');
const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
.comment-quote {
	background: #46464620;
	font-style: italic;
	color: #464646;
	border-left-width: 3px;
	border-left-color: #46464650;
	border-left-style: solid;
	padding: 2px;
	padding-left: 5px;
}`;
head.appendChild(style);

document.querySelectorAll('.commtext').forEach(comment => {
  let quoteDiv = null;
  comment.childNodes.forEach(node => {
    const commentLine = node.textContent || node.innerText;
    if (quoteDiv || commentLine.match(/^>/)) {
      if (commentLine.startsWith('>')) {
        const quoteText = commentLine.substring(commentLine.indexOf('>') + 1);
        if (node.textContent) {
          node.textContent = quoteText;
        } else {
          node.innerText = quoteText;
        }
      }

      if (!quoteDiv) {
        quoteDiv = document.createElement('div');
        quoteDiv.classList.add('comment-quote');
        node.parentNode.insertBefore(quoteDiv, node);
      }

      quoteDiv.appendChild(node);

      if (!commentLine.match(/^>+\s*$/)) {
        quoteDiv = null;
      }
    }
  });
});

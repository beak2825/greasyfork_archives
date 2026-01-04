// ==UserScript==
// @name        Better quotes for Hacker News
// @namespace   3v1n0.net
// @match       https://news.ycombinator.com/*
// @grant       none
// @version     0.4
// @author      Marco Trevisan
// @description Use more readable block quotes in Hacker News
// @downloadURL https://update.greasyfork.org/scripts/425598/Better%20quotes%20for%20Hacker%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/425598/Better%20quotes%20for%20Hacker%20News.meta.js
// ==/UserScript==

const [head] = document.getElementsByTagName('head');
style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
.comment-quote {
	background: #46464620;
	font-style: italic;
	color: #464646;
  border-left-width:: 3px;
  border-left-color: #46464650;
  border-left-style: solid;
  padding: 2px;
  padding-left: 5px;
};
`;
head.appendChild(style);

document.querySelectorAll('.commtext').forEach(c => {
  let quoteDiv = null;
  c.childNodes.forEach(node => {
    const commentLine = node.textContent || node.innerText;
    if (quoteDiv || commentLine.match(/^>+\s/)) {
      if (commentLine.startsWith('>')) {
        const quoteText = commentLine.substring(commentLine.indexOf(' '));

        if (node.textContent)
          node.textContent = quoteText;
        else
          node.innerText = quoteText;
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
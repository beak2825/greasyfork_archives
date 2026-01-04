// ==UserScript==
// @name        Wide New Reddit (Dynamic)
// @namespace   Violentmonkey Scripts
// @match       *://www.reddit.com/*
// @match       *://new.reddit.com/*
// @grant       none
// @version     1.0
// @author      Hou Rui
// @license     GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon        https://www.redditstatic.com/desktop2x/img/favicon/favicon-96x96.png
// @description Make new reddit layout fill screen width. Obtain class names dynamically to avoid breaks. 28/02/2023, 4:05:40 pm
// @downloadURL https://update.greasyfork.org/scripts/460909/Wide%20New%20Reddit%20%28Dynamic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/460909/Wide%20New%20Reddit%20%28Dynamic%29.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// inject styles
function makeElementWide(element) {
  const className = element.className.split(' ')[0];
  console.info("CLASSNAME: " + className);
  addGlobalStyle(`div.${className} { max-width: none !important; width: 100% !important; }`)
  // element.style.maxWidth = 'none';
  // element.style.width = '100%';
}


// for front page
function makeFrontPageWide() {
  const newPostInput = document.querySelector("input[name='createPost']");
  if (newPostInput === null) { return; }
  if (newPostInput.parentElement === null) { return; }
  let leftColumn = newPostInput.parentElement.parentElement;
  if (leftColumn === null) { return; }
  makeElementWide(leftColumn);
}


// for post page
function makePostPageWide() {
  const postContainer = document.querySelector("div[data-testid='post-container']");
  if (postContainer === null) { return; }
  let leftColumn = postContainer.parentElement;
	if (leftColumn === null) { return; }
  makeElementWide(leftColumn);
  makeElementWide(leftColumn.parentElement);
}

makeFrontPageWide();
makePostPageWide();

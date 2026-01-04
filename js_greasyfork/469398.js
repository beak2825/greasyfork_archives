
// ==UserScript==
// @name        Reddit Protest
// @namespace   Violentmonkey Scripts
// @match       https://www.reddit.com/*
// @grant       none
// @version     1.8
// @author      soot
// @homepage    https://greasyfork.org/en/scripts/469398-reddit-protest
// @description The purpose of this userscript is to protest Reddit's 
//              decision to monetize access to its data. This simple 
//              script downvotes and clicks the links of promoted posts
//              (ads) as you scroll. The goal is to increase the 
//              Cost-Per-Click for Reddit's advertisers while also 
//              creating the impression of negative user sentiment
//              towards the ads.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/469398/Reddit%20Protest.user.js
// @updateURL https://update.greasyfork.org/scripts/469398/Reddit%20Protest.meta.js
// ==/UserScript==
var spans = document.getElementsByTagName('span');
var promoted, parentDiv, link, tab, button;
var clickedLinks = [];
var alreadyDownvoted = false;
var isScrolling = false;
var linkOpened = false;

function findParentDiv(element) {
  if (!element) {
    return null;
  }

  parentDiv = element.parentElement;
  while (parentDiv) {
    if (parentDiv.tagName.toLowerCase() === 'div' && parentDiv.querySelector('a')) {
      return parentDiv;
    }
    parentDiv = parentDiv.parentElement;
  }

  return null;
}


function getAncestorDiv(element) {
  if (!element) {
    return null;
  }

  return element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
}



function findDownvoteButton() {

    if (parentDiv.tagName.toLowerCase() === 'div') {
      var buttons = parentDiv.getElementsByTagName("button");
      for (var i = 0; i < buttons.length; ++i) {
        if (buttons[i].getAttribute("aria-label") === "downvote"){
          if (buttons[i].getAttribute("aria-pressed") === "false") {
            alreadyDownvoted = false;
            button = buttons[i];
            return button;
          }
          else
            alreadyDownvoted = true;
        }
      }
    }

  return null;
}


function getLink() {
  var links = parentDiv.getElementsByTagName('a');
  for (var i = 0; i < links.length; ++i) {
    if (links[i].href.includes("www.reddit.com"))
      continue;
    else {
      link = links[i];
      return link;
    }
  }
}


function openAndCloseWindow(url) {
  if (!clickedLinks.includes(url)) {
    clickedLinks.push(url);
    var newTab = window.open(url);
    console.log(url);
    newTab.close();
  }
}


function downvote() {
  if (button) {
    alreadyDownvoted = true;
    button.click();
    button = null;
  }
}

function protest(){
  setTimeout(function(){
    if (parentDiv) {
      findDownvoteButton();
      if (!alreadyDownvoted) {
        downvote();
        getLink();
        openAndCloseWindow(link.href);
      }
    }
  }, 100);
}


function handleScroll() {
  if (isScrolling) {
    return;
  }

  isScrolling = true;

  for (var i = 0; i < spans.length; i++) {
    if (spans[i].textContent === 'promoted' && spans[i].getBoundingClientRect().bottom > 0) {
      promoted = spans[i];
      parentDiv = getAncestorDiv(promoted);
      protest();
    }
  }

  isScrolling = false;
}


window.addEventListener("scroll", function() {
  if (!isScrolling) {
    handleScroll();

    setTimeout(function() {
      isScrolling = false;
    }, 500);
  }
});

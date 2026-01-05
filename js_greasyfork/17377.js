// ==UserScript==
// @name        FIMFiction - Clickable Read Flow
// @namespace   Selbi
// @include     http*://*fimfiction.net/story/*/*/*
// @include     http*://*fimfiction.net/chapter/*
// @version     3.2
// @grant       none
// @description Adds the ability to scroll through a story by clicking on paragraphs
// @downloadURL https://update.greasyfork.org/scripts/17377/FIMFiction%20-%20Clickable%20Read%20Flow.user.js
// @updateURL https://update.greasyfork.org/scripts/17377/FIMFiction%20-%20Clickable%20Read%20Flow.meta.js
// ==/UserScript==

(function() {
  "use strict";
  
  // Get elements
  let chapterBody = document.getElementById("chapter-body");
  let paragraphOptionsCloseButton = document.querySelector("#paragraph-options a:last-child");

  // Install scroll event listener when clicking on paragraphs
  const MARGIN_TOP = 20;
  const BOOKMARK_BOX_MARGIN = 80;
  const DOUBLE_CLICK_TOLERANCE = 10;
  fQuery.addScopedEventListener(chapterBody, "p", "click", clickEventListener);
  
  function clickEventListener() {
    if (window.getSelection().toString().length == 0) { // Prevent scroll when anything is selected
      let y = getTargetY(this);
      if (Math.abs(y - window.scrollY) < DOUBLE_CLICK_TOLERANCE) {
        scrollToY(y - BOOKMARK_BOX_MARGIN);
      } else {
        scrollToY(y);
        paragraphOptionsCloseButton.click();      
      }  
    }
  }

  function getTargetY(elem) {
    let y = Math.round(elem.getBoundingClientRect().top + window.scrollY - MARGIN_TOP);
    return y;
  }

  function scrollToY(y) {
    window.scrollTo({top: y});
  }

  // Styling
  function addGlobalStyle(css) {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  addGlobalStyle(`
    #chapter-body p:hover {
      cursor: pointer;
      transition: all 200ms ease;
      color: white !important;
    }

    #chapter_toolbar_container {
      padding-bottom: 0px !important;
    }
  `);
})();

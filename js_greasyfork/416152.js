// ==UserScript==
// @name        pr0gramm - Nav-Buttons
// @namespace   Selbi
// @match       https://pr0gramm.com/*
// @grant       none
// @version     1.0
// @author      Selbi
// @description Adds clickable left/right buttons for easy browsing (for those too lazy to use their keyboards)
// @downloadURL https://update.greasyfork.org/scripts/416152/pr0gramm%20-%20Nav-Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/416152/pr0gramm%20-%20Nav-Buttons.meta.js
// ==/UserScript==

(function() {
  
  // Scroller
  function scroll(selector) {
    let node = document.querySelector(selector);
    if (node != null) {
      node.click();
    } else {
      document.querySelector("#stream > .stream-row > a:first-child").click();
    }
  }

  // Buttons
  let body = document.querySelector("body");
  
  let wrapper = document.createElement("div");
  wrapper.classList.add("clickArrowsWrapper");
  document.querySelector("body").appendChild(wrapper);

  let left = document.createElement("div");
  left.classList.add("clickArrow")
  left.innerHTML = "&#9668;";
  left.onclick = function(){scroll(".stream-prev")};
  wrapper.appendChild(left);
  
  let right = document.createElement("div");
  right.classList.add("clickArrow")
  right.innerHTML = "&#9658;";
  right.onclick = function(){scroll(".stream-next")};
  wrapper.appendChild(right);

  // Style
  let style = document.createElement('style');
  document.querySelector("head").appendChild(style); 
  style.type = 'text/css';
  style.innerHTML = `
    .clickArrowsWrapper {
      position: fixed;
      bottom: 0;
      right: 0;
      display: inline-flex;
    }

    .clickArrow {
      width: 6vw;
      font-size: 6vw;
      text-align: center;
      opacity: 0.02;
      transition: 0.1s ease;
      user-select: none;
      color: gray;
    }

    .clickArrow:hover {
      opacity: 0.8;
      cursor: pointer;
    }
  `;
})();

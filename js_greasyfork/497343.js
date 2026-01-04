// ==UserScript==
// @name         YouTube swap comments and recommendations
// @namespace    https://github.com/zenpk/scripts-tampermonkey
// @version      0.4
// @description  Provide a button to swap the comments section (bottom) and the recommendations section (right)
// @author       zenpk
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497343/YouTube%20swap%20comments%20and%20recommendations.user.js
// @updateURL https://update.greasyfork.org/scripts/497343/YouTube%20swap%20comments%20and%20recommendations.meta.js
// ==/UserScript==

(function () {
  const timeoutValue = 200;
  function waitForLoaded() {
    const shareButton = document.querySelector(
      `#actions-inner > #menu > ytd-menu-renderer > #top-level-buttons-computed > yt-button-view-model`
    );
    console.log(
      `[Swap script] trying to find the share button: ${shareButton}`
    );
    if (shareButton) {
      addSwapButton();
    } else {
      setTimeout(waitForLoaded, timeoutValue);
    }
  }

  waitForLoaded();

  let swapped = false;
  let buttonParent;
  let swapButton;
  let comments;
  let contents;
  let commentsParent;
  let contentsParent;
  let commentsParentWidth;
  let contentsParentWidth;
  let commentsParentWidthBackup;
  let contentsParentWidthBackup;
  function addSwapButton() {
    buttonParent = document.querySelector(
      "#above-the-fold > #top-row > #owner"
    );
    swapButton = document.createElement("button");
    swapButton.innerHTML = "Swap";
    swapButton.addEventListener("click", swapSections);
    swapButton.classList.add(
      "yt-spec-button-shape-next",
      "yt-spec-button-shape-next--tonal",
      "yt-spec-button-shape-next--mono",
      "yt-spec-button-shape-next--size-m",
      "yt-spec-button-shape-next--icon-leading"
    );
    swapButton.style.marginLeft = "0.75rem";
    swapButton.style.maxWidth = "fit-content";
    buttonParent.appendChild(swapButton);
    comments = document.querySelector("#comments");
    contents = document.querySelector(
      "#related > ytd-watch-next-secondary-results-renderer > #items > ytd-rich-grid-renderer > #contents"
    );
    if (!contents) {
      contents = document.querySelector(
        "ytd-page-manager > ytd-watch-flexy > #columns > #secondary > #secondary-inner"
      );
    }
    commentsParent = comments.parentNode;
    contentsParent = contents.parentNode;
    commentsParentWidthBackup = commentsParent.style.width;
    contentsParentWidthBackup = contentsParent.style.width;

    function swapSections() {
      if (swapped) {
        commentsParent.removeChild(contents);
        contentsParent.removeChild(comments);
        commentsParent.appendChild(comments);
        contentsParent.appendChild(contents);
        commentsParent.style.width = commentsParentWidthBackup;
        contentsParent.style.width = contentsParentWidthBackup;
      } else {
        commentsParent.style.width = commentsParent.offsetWidth;
        contentsParent.style.width = contentsParent.offsetWidth;
        commentsParent.removeChild(comments);
        contentsParent.removeChild(contents);
        commentsParent.appendChild(contents);
        contentsParent.appendChild(comments);
      }
      swapped = !swapped;
    }
  }
})();

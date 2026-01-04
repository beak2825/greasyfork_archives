// ==UserScript==
// @name        Expand collapsed GitHub code blocks
// @namespace   http://tampermonkey.net/
// @description Adds click event and distinct hover style to collapsed code indicator
// @match       https://github.com/*
// @version     1.3
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/405005/Expand%20collapsed%20GitHub%20code%20blocks.user.js
// @updateURL https://update.greasyfork.org/scripts/405005/Expand%20collapsed%20GitHub%20code%20blocks.meta.js
// ==/UserScript==

// Use with violentmonkey
// https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/
// https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag?hl=en

(function () {
  "use strict";

  GM_addStyle(`
      .is-hovered.blob-code.blob-code-inner.blob-code-hunk {
          background-color: #ffedde !important;
      }`);

  makeCollapsedRegionsClickableAfterLoad();
})();

function makeCollapsedRegionsClickableAfterLoad() {
  let isLoading = false;

  const diffContainers = [
    ...document.querySelectorAll(".js-diff-progressive-container"),
  ];
  if (diffContainers.some((c) => showsLoadingIndicator(c))) {
    isLoading = true;
  }

  if (isLoading == true) {
    window.setTimeout(makeCollapsedRegionsClickableAfterLoad, 5);
  } else {
    makeCollapsedRegionsClickable();
  }
}

function makeCollapsedRegionsClickable() {
  const expandables = document.querySelectorAll(".js-expandable-line");

  expandables.forEach((expandable) => {
    let line = expandable.querySelector(
      ".blob-code.blob-code-inner.blob-code-hunk"
    );

    line = recreateNode(line);
    line.style.cursor = "pointer";
    line.addEventListener("click", () => expandCodeBlock(expandable));
  });
}

function expandCodeBlock(line) {
  line.querySelector(".blob-num-expandable").children[0].click();
  window.setTimeout(makeCollapsedRegionsClickableAfterLoad, 800);
}

function showsLoadingIndicator(container) {
  return container.querySelectorAll(".diff-progressive-loader").length > 0;
}

function recreateNode(el, withChildren) {
  if (withChildren) {
    const clone = el.cloneNode(true);
    el.parentNode.replaceChild(clone, el);
    return clone;
  } else {
    var newEl = el.cloneNode(false);
    while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
    el.parentNode.replaceChild(newEl, el);
    return newEl;
  }
}

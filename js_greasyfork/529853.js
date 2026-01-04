// ==UserScript==
// @name         Medium to Freedium
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  Freedium: Your paywall breakthrough for Medium! (Original: https://gist.github.com/Diegiwg/4d00ed615687432b93902d3aa0cf56b3)
// @author       Diegiwg
// @match        https://medium.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freedium.cfd
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529853/Medium%20to%20Freedium.user.js
// @updateURL https://update.greasyfork.org/scripts/529853/Medium%20to%20Freedium.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function replaceHomepageLinkWithButton(functionToExecute) {
    const homepageLink = document.querySelector('[aria-label="Homepage"]');

    if (!homepageLink) {
      console.log('Element with aria-label "Homepage" not found.');
      return;
    }
    const newButton = document.createElement("button");

    newButton.className = homepageLink.className;
    newButton.innerHTML = "Medium to Freedium";
    newButton.style = "color: rgb(18 102 49); font-size: 2rem;";

    newButton.addEventListener("click", functionToExecute);

    homepageLink.replaceWith(newButton);
  }

  function callback() {
    // Create the full-screen loading overlay
    const loadingOverlay = document.createElement("div");
    loadingOverlay.style.position = "fixed";
    loadingOverlay.style.top = "0";
    loadingOverlay.style.left = "0";
    loadingOverlay.style.width = "100%";
    loadingOverlay.style.height = "100%";
    loadingOverlay.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    loadingOverlay.style.display = "flex";
    loadingOverlay.style.justifyContent = "center";
    loadingOverlay.style.alignItems = "center";
    loadingOverlay.style.zIndex = "9999";

    // Create the loading indicator
    const loadingIndicator = document.createElement("span");
    loadingIndicator.textContent = "Loading...";
    loadingIndicator.style.fontSize = "24px";
    loadingIndicator.style.fontWeight = "bold";

    loadingOverlay.appendChild(loadingIndicator);
    document.body.appendChild(loadingOverlay);

    setTimeout(function () {
      window.location.href = "https://freedium.cfd/" + window.location.href;
    }, 100);
  }

  replaceHomepageLinkWithButton(callback);
})();

// ==UserScript==
// @name         Crunchyroll Random Anime Button
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Adds a "Random Anime" button to Crunchyroll's top navigation bar
// @icon         https://github.com/noahbds/crunchyroll-random-anime/blob/main/icons/randomimg.png?raw=true
// @author       Noahbds
// @match        https://www.crunchyroll.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521056/Crunchyroll%20Random%20Anime%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/521056/Crunchyroll%20Random%20Anime%20Button.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const iconUrl =
    "https://github.com/noahbds/crunchyroll-random-anime/blob/main/icons/randomimg.png?raw=true";

  function createRandomAnimeButton() {
    if (document.querySelector(".erc-random-header-button")) return;

    const searchButton = document.querySelector(
      'a.erc-search-header-button-old, a[aria-label="Search"]'
    );

    let actionsContainer = null;
    let insertBeforeNode = null;

    if (searchButton) {
      const searchWrapper = searchButton.closest(
        "div.nav-horizontal-layout__action-item--KZBne, div"
      );
      insertBeforeNode =
        searchWrapper || searchButton.parentElement || searchButton;
      actionsContainer = insertBeforeNode && insertBeforeNode.parentElement;
    }

    if (!actionsContainer) {
      actionsContainer = document.querySelector(
        "div.nav-horizontal-layout__actions, div.nav-horizontal-layout__action-items, header"
      );
    }

    if (!actionsContainer) {
      const anyAction = document.querySelector(
        'a.erc-header-tile, div.erc-header-svg, a[role="button"][data-t="header-tile"]'
      );
      actionsContainer = anyAction && anyAction.parentElement;
    }

    if (!actionsContainer) return;

    const actionWrapper = document.createElement("div");
    actionWrapper.className = "nav-horizontal-layout__action-item--KZBne";

    const randomButton = document.createElement("a");
    randomButton.href =
      "https://www.crunchyroll.com/fr/random/anime?random_ref=topbar";
    randomButton.className =
      "erc-header-tile state-icon-only erc-random-header-button";
    randomButton.tabIndex = 0;
    randomButton.setAttribute("data-t", "header-tile");
    randomButton.setAttribute("aria-label", "Random Anime");

    const buttonDiv = document.createElement("div");
    buttonDiv.className = "erc-header-svg";

    const buttonIcon = document.createElement("img");
    buttonIcon.src = iconUrl;
    buttonIcon.alt = "Random Anime";
    buttonIcon.style.cssText =
      "width: 24px; height: 24px; display: inline-block; vertical-align: middle;";

    const buttonText = document.createElement("span");
    buttonText.className = "erc-random-header-text";
    buttonText.textContent = "Random Anime";
    buttonText.style.cssText = "margin-left:8px; font-size:14px;";

    buttonDiv.appendChild(buttonIcon);
    randomButton.appendChild(buttonDiv);
    randomButton.appendChild(buttonText);
    actionWrapper.appendChild(randomButton);

    try {
      if (
        insertBeforeNode &&
        insertBeforeNode.parentElement === actionsContainer
      ) {
        actionsContainer.insertBefore(actionWrapper, insertBeforeNode);
      } else {
        actionsContainer.appendChild(actionWrapper);
      }
    } catch (e) {
      actionsContainer.appendChild(actionWrapper);
    }
  }

  const observer = new MutationObserver((mutations, obs) => {
    if (document.body) {
      createRandomAnimeButton();
    }
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
  });
})();
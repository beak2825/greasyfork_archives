// ==UserScript==
// @name         MouseHunt - Gifting Buttons
// @author       Tran Situ (tsitu)
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      1.3
// @description  Adds buttons to easily ignore, accept, or return all free gifts
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/376572/MouseHunt%20-%20Gifting%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/376572/MouseHunt%20-%20Gifting%20Buttons.meta.js
// ==/UserScript==

(function() {
  const observerTarget = document.querySelector("#overlayPopup");
  if (observerTarget) {
    MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver;

    const observer = new MutationObserver(function() {
      // Callback
      const claimableExists = document.querySelector(
        ".giftSelectorView-tabContent.selectClaimableGift"
      );
      if (claimableExists) {
        // Disconnect and reconnect later to prevent infinite mutation loop
        observer.disconnect();

        // Render buttons if 'Claim Free Gifts' dialog is in DOM
        buildUI();

        observer.observe(observerTarget, {
          childList: true,
          subtree: true
        });
      }
    });

    // Observe mutations in <div id="overlayPopup">
    observer.observe(observerTarget, {
      childList: true,
      subtree: true
    });
  }

  function buildUI() {
    // Remove existing buttonSpans
    document.querySelectorAll(".tsitu-gift-buttons").forEach(el => el.remove());

    // Generate buttons for each unique item container
    const uniqueItems = document.querySelectorAll(
      ".giftSelectorView-claimableGift-title-itemName"
    );
    if (uniqueItems && uniqueItems.length > 0) {
      uniqueItems.forEach(el => {
        generateButtons(
          el.parentElement.parentElement,
          el.parentElement.parentElement,
          15
        );
      });
    }

    // Generate buttons for the entire container
    generateButtons(
      document
        .querySelector(".giftSelectorView-tabContent.selectClaimableGift")
        .querySelector(".giftSelectorView-actionContainer"),
      document,
      0
    );
  }

  /**
   * @param {Element} target Location to append generated buttons
   * @param {Element} rowContainer Location to query for friendRows
   * @param {Number} bottomMargin px margin to give bottom of buttonSpan
   */
  function generateButtons(target, rowContainer, bottomMargin) {
    const rows = rowContainer.querySelectorAll(
      ".giftSelectorView-friendRow-actionContainer"
    );

    const ignoreAllButton = document.createElement("button");
    ignoreAllButton.innerText = "Ignore All";
    ignoreAllButton.addEventListener("click", function() {
      for (let row of rows) {
        const button = row.querySelector(
          ".giftSelectorView-friendRow-action.ignore:not(.selected):not(.disabled)"
        );
        if (button) button.click();
      }
    });

    const unignoreAllButton = document.createElement("button");
    unignoreAllButton.innerText = "↩️";
    unignoreAllButton.addEventListener("click", function() {
      for (let row of rows) {
        const button = row.querySelector(
          ".giftSelectorView-friendRow-action.ignore.selected"
        );
        if (button) button.click();
      }
    });

    const acceptAllButton = document.createElement("button");
    acceptAllButton.innerText = "Accept All";
    acceptAllButton.addEventListener("click", function() {
      for (let i = 0; i < rows.length; i++) {
        // Oldest first
        const row = rows[rows.length - i - 1];
        const button = row.querySelector(
          ".giftSelectorView-friendRow-action.claim:not(.selected):not(.disabled)"
        );
        if (button) button.click();
      }
    });

    const unacceptAllButton = document.createElement("button");
    unacceptAllButton.innerText = "↩️";
    unacceptAllButton.addEventListener("click", function() {
      for (let row of rows) {
        const button = row.querySelector(
          ".giftSelectorView-friendRow-action.claim.selected"
        );
        if (button) button.click();
      }
    });

    const returnAllButton = document.createElement("button");
    returnAllButton.innerText = "Return All";
    returnAllButton.addEventListener("click", function() {
      for (let i = 0; i < rows.length; i++) {
        // Oldest first
        const row = rows[rows.length - i - 1];
        const button = row.querySelector(
          ".giftSelectorView-friendRow-action.return:not(.selected):not(.disabled)"
        );
        if (button) button.click();
      }
    });

    const unreturnAllButton = document.createElement("button");
    unreturnAllButton.innerText = "↩️";
    unreturnAllButton.addEventListener("click", function() {
      for (let row of rows) {
        const button = row.querySelector(
          ".giftSelectorView-friendRow-action.return.selected"
        );
        if (button) button.click();
      }
    });

    const buttonSpan = document.createElement("span");
    buttonSpan.className = "tsitu-gift-buttons";
    buttonSpan.style.cssFloat = "left";
    buttonSpan.style.marginBottom = bottomMargin + "px";

    buttonSpan.appendChild(ignoreAllButton);
    buttonSpan.appendChild(unignoreAllButton);
    buttonSpan.appendChild(document.createTextNode("\u00A0\u00A0"));
    buttonSpan.appendChild(acceptAllButton);
    buttonSpan.appendChild(unacceptAllButton);
    buttonSpan.appendChild(document.createTextNode("\u00A0\u00A0"));
    buttonSpan.appendChild(returnAllButton);
    buttonSpan.appendChild(unreturnAllButton);
    target.appendChild(buttonSpan);
  }
})();

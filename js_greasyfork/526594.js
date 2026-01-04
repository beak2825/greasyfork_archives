// ==UserScript==
// @name         Export Bet Details
// @namespace    https://torn.report/userscripts/
// @version      0.1
// @description  Adds a button on the Torn Bookie page to export bet details for use on the torn.report/bookie page.
// @author       Skeletron [318855]
// @match        https://www.torn.com/page.php?sid=bookie
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/526594/Export%20Bet%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/526594/Export%20Bet%20Details.meta.js
// ==/UserScript==

const container = createContainer("torn.report - Bets Details");

const descriptionContent = `
<p>Export your bets details here to use on the Bookie page!</p>
<p>If this is your first time, scroll down completely to load all bets, then click "Copy to Clipboard".</p>
<p>To update, you only need to scroll down to where you reached last time.</p>
<p>Once copied, paste them on the Bookie page using the paste icon in the top right.</p>
`;

const description = createDescription(descriptionContent);
const buttonWrapper = createButtonWrapper("start");
const button = createButton("Copy to Clipboard", 150);

buttonWrapper.appendChild(button);
description.appendChild(buttonWrapper);
container.appendChild(description);

(function () {
  "use strict";

  const bets = {};

  const targetNode = document.querySelector("#react-root");
  const observerOptions = { childList: true, subtree: true };
  const observer = new MutationObserver(handleMutations);

  observer.observe(targetNode, observerOptions);

  button.addEventListener("click", () => {
    const betList = targetNode.querySelectorAll("li.disabled");
    const processText = (text) =>
      text
        ? text.getAttribute("title").replace(/\n/g, " ").replace(/\s+/g, " ")
        : null;

    for (const bet of betList) {
      const id = bet
        .querySelector("a")
        .getAttribute("href")
        .replace("#/your-bets/", "");
      const game = bet.querySelector("li.game").title;
      const name = bet.querySelector("p").title;

      const wonStick = bet.querySelector("li.won .text");
      const lostStick = bet.querySelector("li.lost .text");
      const refundedStick = bet.querySelector("li.refunded .text");
      const pendingStick = bet.querySelector("li.pending .text");

      bets[id] = {
        game,
        name,
        won: processText(wonStick),
        lost: processText(lostStick),
        refunded: processText(refundedStick),
        pending: processText(pendingStick),
      };
    }
    copyToClipboard(JSON.stringify(bets));
  });
})();

function handleMutations(mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      for (const node of mutation.addedNodes) {
        if (node.classList && node.classList.contains("bookie-popular-wrap")) {
          node
            .insertAdjacentElement("beforebegin", container)
            .insertAdjacentElement("afterend", createDelimiter());
          observer.disconnect();
          break;
        }
      }
    }
  }
}

function createContainer(text) {
  const container = document.createElement("div");
  container.classList.add("tutorial-cont");

  const titleContainer = document.createElement("div");
  titleContainer.classList.add("title-gray", "top-round");
  titleContainer.setAttribute("role", "heading");
  titleContainer.setAttribute("aria-level", "5");

  const title = document.createElement("span");
  title.classList.add("tutorial-title");
  title.textContent = text;

  titleContainer.appendChild(title);
  container.appendChild(titleContainer);
  return container;
}

function createDescription(content) {
  const description = document.createElement("div");
  description.classList.add(
    "tutorial-desc",
    "bottom-round",
    "cont-gray",
    "p10"
  );
  description.innerHTML = content;
  return description;
}

function createButtonWrapper(justify) {
  const buttonWrapper = document.createElement("div");
  buttonWrapper.style.cssText = `display: flex; justify-content: ${justify}; margin-top: 10px;`;
  return buttonWrapper;
}

function createButton(text, width) {
  const button = document.createElement("button");
  button.classList.add("torn-btn");
  button.textContent = text;
  button.style.width = `${width}px`;
  return button;
}

function createDelimiter() {
  const delimiter = document.createElement("hr");
  delimiter.classList.add("delimiter-999", "m-top10", "m-bottom10");
  return delimiter;
}

function updateButtonText(text) {
  button.textContent = text;
  setTimeout(() => {
    button.textContent = "Copy to Clipboard";
  }, 2000);
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      updateButtonText("Done!");
    })
    .catch((err) => {
      console.error(err);
      updateButtonText("Error Copying!");
    });
}

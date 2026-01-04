// ==UserScript==
// @name         Cloudia Tarjouspalvelu
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Automatically selects categories based on provided ID's
// @author       Petri Liuska
// @match        https://tarjouspalvelu.fi/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tarjouspalvelu.fi
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535114/Cloudia%20Tarjouspalvelu.user.js
// @updateURL https://update.greasyfork.org/scripts/535114/Cloudia%20Tarjouspalvelu.meta.js
// ==/UserScript==
(function () {
  "use strict";

  function addControlButton() {
    const wrapper = document.createElement("div");
    wrapper.className = "gro-wrapper";

    const controlButton = document.createElement("button");
    controlButton.className = "gro-button";

    controlButton.addEventListener("click", () => {
      init();
    });

    // Append the button to the wrapper
    wrapper.appendChild(controlButton);

    // Append the wrapper to the body
    document.body.appendChild(wrapper);

    // Add CSS styles
    const style = document.createElement("style");
    style.textContent = `
		.gro-wrapper {
			position: fixed;
			right: 15px;
			top: 50%;
			transform: translateY(-50%);
			z-index: 9999;
		}

		.gro-button {
			all: unset;
			background-color: #e81202;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			width: 50px;
			height: 50px;
			border: none;
			border-radius: 50%;
			background-image: url('https://groteski.fi/wp-content/themes/groteski23/assets/dist/logos/Groteski_logo_ikoni_porcelain.png');
			background-position: center center;
			background-size: cover;
			background-repeat: no-repeat;
		}

		.gro-button:hover {
			background-color: #e81202;
		}
	`;

    document.head.appendChild(style);
  }

  function findAndClickCPVcheckbox() {
    const checkbox = document.querySelector("input#cpv-koodit-cb");
    if (checkbox) {
      console.log("Found CPV checkbox", checkbox);

      checkbox.click();

      return true;
    } else {
      console.log("CPV checkbox not found");

      return false;
    }
  }

  function findAndClickCheckbox(searchText) {
    const xpath = `//li[contains(@role, 'treeitem')]//span[contains(@class, 'fancytree-title') and contains(text(), '${searchText}')]`;
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const titleSpan = result.singleNodeValue;

    if (titleSpan) {
      console.log("titleSpan", titleSpan);

      const treeNode = titleSpan.closest(".fancytree-node");

      if (treeNode) {
        const checkbox = treeNode.querySelector('[role="checkbox"]');

        if (checkbox) {
          console.log("Found checkbox, clicking it", checkbox);

          checkbox.click();

          return true;
        } else {
          console.log("Checkbox not found");

          return false;
        }
      } else {
        console.log("Tree node not found");

        return false;
      }
    }

    console.log("Element not found");

    return false;
  }

  function findAndClickExpander(searchText) {
    const xpath = `//li[contains(@role, 'treeitem')]//span[contains(@class, 'fancytree-title') and contains(text(), '${searchText}')]`;
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const titleSpan = result.singleNodeValue;

    if (titleSpan) {
      console.log("titleSpan", titleSpan);

      const treeNode = titleSpan.closest(".fancytree-node");

      if (treeNode) {
        const expander = treeNode.querySelector(".fancytree-expander");

        if (expander) {
          console.log("Found expander, clicking it", expander);

          expander.click();

          return true;
        } else {
          console.log("Expander not found");

          return false;
        }
      } else {
        console.log("Tree node not found");

        return false;
      }
    }
  }

  async function waitAndClick(searchText, type = "checkbox") {
    const maxAttempts = 10;
    const interval = 1000;

    let attempts = 0;

    const checkInterval = setInterval(() => {
      attempts++;

      console.log(`Attempt ${attempts} to find: ${searchText}`);

      if (attempts >= maxAttempts) {
        console.log("Max attempts reached. Element not found.");

        clearInterval(checkInterval);

        return;
      }

      if (type === "checkbox" && findAndClickCheckbox(searchText)) {
        console.log(`Successfully found and clicked: ${searchText}`);

        clearInterval(checkInterval);
      } else if (type === "expander" && findAndClickExpander(searchText)) {
        console.log(`Successfully found and clicked expander: ${searchText}`);

        clearInterval(checkInterval);
      }
    }, interval);
  }

  async function init() {
    const idChains = [
      ["48000000-8", "48200000-0"],
      ["79000000-4", "79300000-7", "79340000-9"],
      ["79900000-3", "79960000-1"],
      ["92000000-1", "92100000-2", "92110000-5", "92111000-2"],
      ["39000000-2", "39200000-4", "39290000-1", "39294000-9", "39294100-0"],
    ];

    if (!findAndClickCPVcheckbox()) {
      console.log("findAndClickCPVcheckbox failed, exiting");

      return;
    }

    for (const ids of idChains) {
      console.log("ids", ids);

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        console.log("id", id);

        const isFinalId = i === ids.length - 1;

        if (isFinalId) {
          await waitAndClick(id, "checkbox");
        } else {
          await waitAndClick(id, "expander");
        }
      }
    }

    console.log("All clicked");
  }

  addControlButton();
})();

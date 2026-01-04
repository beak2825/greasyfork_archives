// ==UserScript==
// @name         Gender Filter on Chaturbate
// @namespace    https://example.com/
// @version      2.5
// @description  Hide room cards based on gender toggles
// @match        https://chaturbate.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaturbate.com
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542810/Gender%20Filter%20on%20Chaturbate.user.js
// @updateURL https://update.greasyfork.org/scripts/542810/Gender%20Filter%20on%20Chaturbate.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  // Default filter state
  const DEFAULT_STATE = {
    male: true,
    female: true,
    trans: true,
    couple: true,
  };

  // Load saved state or fall back to defaults
  const genderFilterState = await GM.getValue("genderFilterState", DEFAULT_STATE);

  // Get gender from a room card
  const getCardGender = (card) => {
    if (card.querySelector("span.camAltTextColor.genderm")) return "male";
    if (card.querySelector("span.camAltTextColor.genderf")) return "female";
    if (card.querySelector("span.camAltTextColor.genders")) return "trans";
    if (card.querySelector("span.camAltTextColor.genderc")) return "couple";
    return "unknown";
  };

  // Hide/show based on toggle state
  const updateCardVisibility = (card) => {
    const gender = getCardGender(card);
    card.style.display = genderFilterState[gender] ? "" : "none";
  };

  // Apply filtering to all cards
  const applyGenderFilters = () => {
    document.querySelectorAll("li.roomCard").forEach(updateCardVisibility);
  };

  // Observe dynamically loaded cards
  const observeNewCards = () => {
    const observer = new MutationObserver((mutations) =>
      mutations.forEach((m) =>
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;

          if (node.matches?.("li.roomCard")) {
            updateCardVisibility(node);
          } else {
            node.querySelectorAll?.("li.roomCard").forEach(updateCardVisibility);
          }
        })
      )
    );

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  // UI injection
  const injectGenderFilters = () => {
    const panel = document.querySelector(".homepageFilterPanel");
    if (!panel) return;

    const filterBlock = document.createElement("div");
    filterBlock.className = "filterSection";
    filterBlock.dataset.testid = "filter-gender-section";
    filterBlock.innerHTML = `
            <div class="filterSectionHeader" data-testid="filter-gender-header">FILTER GENDER</div>
            <div class="filterSectionOptions" style="display: flex; gap: 6px; flex-wrap: wrap;">
                <a href="#" class="filterOption genderToggle" data-gender="female">Female</a>
                <a href="#" class="filterOption genderToggle" data-gender="male">Male</a>
                <a href="#" class="filterOption genderToggle" data-gender="trans">Trans</a>
                <a href="#" class="filterOption genderToggle" data-gender="couple">Couples</a>
            </div>
        `;

    // Add it at the top of the filter panel
    panel.insertBefore(filterBlock, panel.firstChild);

    // Set initial active styles
    filterBlock.querySelectorAll(".genderToggle").forEach((el) => {
      const gender = el.dataset.gender;
      el.classList.toggle("active", genderFilterState[gender]);

      el.addEventListener("click", async (e) => {
        e.preventDefault();
        genderFilterState[gender] = !genderFilterState[gender];
        el.classList.toggle("active", genderFilterState[gender]);
        applyGenderFilters();
        await GM.setValue("genderFilterState", genderFilterState);
      });
    });

    // Inject minimal styles for active toggle
    const style = document.createElement("style");
    style.textContent = `
        :root {
        --icon-f: url("https://web.static.mmcdn.com/images/ico-female.svg");
        --icon-m: url("https://web.static.mmcdn.com/images/ico-male.svg");
        --icon-t: url("https://web.static.mmcdn.com/images/ico-trans.svg");
        --icon-c: url("https://web.static.mmcdn.com/images/ico-couple.svg");
        }

        .filterOption.genderToggle {
            width: 16px;
            height: 16px;
            padding: 16px !important;
            background-repeat: no-repeat;
            background-size: contain;
            text-indent: -999px;
            overflow: hidden;
        }

        .filterOption.genderToggle.active {
            background-color: #1e90ff;
            color: white !important;
            border-radius: 3px;
        }

        .filterOption.genderToggle[data-gender="female"] { background-image: var(--icon-f); }

        .filterOption.genderToggle[data-gender="male"] { background-image: var(--icon-m); }

        .filterOption.genderToggle[data-gender="trans"] { background-image: var(--icon-t); }

        .filterOption.genderToggle[data-gender="couple"] { background-image: var(--icon-c); }
        `;
    document.head.appendChild(style);
  };

  // Run on DOM ready
  const init = () => {
    scanExistingCards();
    observeNewCards();
    injectGenderFilters();
  };

  // Initial scan
  const scanExistingCards = () => {
    document.querySelectorAll("li.roomCard").forEach(updateCardVisibility);
  };

  // Wait for page to be ready
  const waitForPanel = setInterval(() => {
    if (document.querySelector(".homepageFilterPanel")) {
      clearInterval(waitForPanel);
      init();
    }
  }, 300);
})();

// ==UserScript==
// @name         Bedre Synonymet.dk
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Fjerner Facebook-reklamer fra hele synonymet.dk. Tilføjer en korrekt overskrift med Æ, Ø og Å (m.m.) samt en mulighed for filtrering.
// @match        https://synonymet.dk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=synonymet.dk
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/541855/Bedre%20Synonymetdk.user.js
// @updateURL https://update.greasyfork.org/scripts/541855/Bedre%20Synonymetdk.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const log = {
    success: (msg) => console.log(`✅ ⟩ ${msg}`),
    fail: (msg) => console.log(`❌ ⟩ ${msg}`),
    timeout: (msg) => console.log(`⏰ ⟩ ${msg}`),
  };
  const isWordPage = location.pathname.startsWith("/ord/");
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  log.success("Script initialized");

  function removeFacebookAds() {
    const fbSection = $("#fbw_id-2");
    if (!fbSection) return false;

    const parentCol = fbSection.closest("div.col");
    (parentCol || fbSection).remove();
    log.success("Facebook section removed");
    return true;
  }

  function fixWordDisplay() {
    if (!isWordPage) return;

    const heading = $("h2.wp-block-heading");
    const match = location.pathname.match(/\/ord\/([^\/]+)\//);

    if (!heading || !match?.[1]) {
      log.fail("Unable to correct heading — missing <h2> or URL word");
      return;
    }

    const correctWord = decodeURIComponent(match[1]).toUpperCase();
    const currentMatch = heading.textContent.match(/Synonym for (.+)/i);
    const currentWord = currentMatch?.[1]?.trim() || "[unknown]";

    heading.innerHTML = `Synonym for <strong>${correctWord}</strong>`;

    const regex = new RegExp(
      `\\b${currentWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "g"
    );
    let fixedCount = 0;

    $$("p").forEach((p) => {
      const original = p.innerHTML;
      const updated = original.replace(
        regex,
        `<strong>${correctWord}</strong>`
      );
      if (updated !== original) {
        p.innerHTML = updated;
        fixedCount++;
      }
    });

    log.success(
      `Word corrected to "${correctWord}" and ${fixedCount} paragraph(s) fixed`
    );
  }

  function createUI() {
    const targetRow = $("div.row.mt-5.justify-content-md-center.text-center");
    if (!targetRow || $("#search-form")) return;

    targetRow.innerHTML = `
        <form id="search-form" method="get" action="https://synonymet.dk/wp-admin/admin-post.php" onsubmit="setAutoComplete(true);return true;">
          <input type="hidden" name="action" value="search">
          <div class="input-group input-group-lg mb-3">
            <input id="ord" type="search" class="form-control" placeholder="Søg efter synonymer" aria-describedby="searchterm" name="ord" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">
            <span class="input-group-btn">
              <button class="btn btn-primary" type="submit"><i class="fa fa-search" aria-hidden="true"></i> Søg</button>
            </span>
          </div>
          <div class="input-group input-group-lg mb-2">
            <select id="filter-length" class="form-control" disabled>
              <option value="">Indlæser...</option>
            </select>
            <span class="input-group-btn">
              <button id="clear-filter" class="btn btn-secondary" type="button" disabled>Ryd</button>
            </span>
          </div>
          <div id="status-text" class="text-muted small">Synonymer indlæses...</div>
        </form>
      `;

    log.success("UI created");

    $("#search-form").addEventListener("submit", (e) => {
      const input = $("#ord");
      if (!input?.value.trim()) {
        e.preventDefault();
        log.fail("Search prevented - empty query not allowed");
      }
    });

    waitForSynonyms();
  }

  function waitForSynonyms() {
    let lastCount = 0;
    let stableChecks = 0;
    const maxChecks = 50; // 5 sekunder (max)
    let checkCount = 0;

    const checkSynonyms = () => {
      // Stationær
      let synonymElements = $$(".wordcloud-span");
      let formatType = "wordcloud";

      // Mobil
      if (synonymElements.length === 0) {
        synonymElements = $$(".list-group-item");
        formatType = "list";
      }

      const currentCount = synonymElements.length;

      if (currentCount > 0) {
        if (currentCount === lastCount) {
          stableChecks++;
          if (stableChecks >= 3) {
            enableFiltering(synonymElements, formatType);
            return;
          }
        } else {
          lastCount = currentCount;
          stableChecks = 0;
        }
      }

      checkCount++;
      if (checkCount < maxChecks) {
        setTimeout(checkSynonyms, 100);
      } else {
        log.timeout("Timeout waiting for synonyms, enabling filtering anyway");
        let fallbackElements = $$(".wordcloud-span");
        let fallbackFormat = "wordcloud";
        if (fallbackElements.length === 0) {
          fallbackElements = $$(".list-group-item");
          fallbackFormat = "list";
        }
        enableFiltering(fallbackElements, fallbackFormat);
      }
    };

    checkSynonyms();
  }

  function sortListAlphabetically(elements) {
    if (elements.length === 0) return;

    const parent = elements[0].parentElement;
    if (!parent) return;

    const sortedElements = Array.from(elements).sort((a, b) => {
      const textA = a.textContent.trim().toLowerCase();
      const textB = b.textContent.trim().toLowerCase();
      return textA.localeCompare(textB, "da", { sensitivity: "base" });
    });

    elements.forEach((el) => el.remove());

    sortedElements.forEach((el) => parent.appendChild(el));

    log.success(`Sorted ${sortedElements.length} synonyms alphabetically`);
  }

  function enableFiltering(elements, formatType) {
    const filterSelect = $("#filter-length");
    const clearButton = $("#clear-filter");
    const statusText = $("#status-text");

    if (!filterSelect || !clearButton) return;

    if (formatType === "list") {
      sortListAlphabetically(elements);
      elements = $$(".list-group-item");
    }

    const getTextContent = (element) => {
      if (formatType === "list") {
        return element.textContent.trim();
      } else {
        return element.textContent;
      }
    };

    const lengths = Array.from(elements, (el) => getTextContent(el).length);
    const uniqueLengths = [...new Set(lengths)].sort((a, b) => a - b);

    filterSelect.innerHTML =
      '<option value="">Alle antal tegn</option>' +
      uniqueLengths
        .map((len) => `<option value="${len}">${len} tegn</option>`)
        .join("");

    filterSelect.disabled = false;
    clearButton.disabled = false;

    const filterWords = () => {
      const targetLength = filterSelect.value.trim();
      const targetNum = targetLength ? parseInt(targetLength) : null;
      let hiddenCount = 0,
        shownCount = 0;

      elements.forEach((element) => {
        const textContent = getTextContent(element);
        const shouldHide = targetNum && textContent.length !== targetNum;
        element.style.display = shouldHide ? "none" : "";
        shouldHide ? hiddenCount++ : shownCount++;
      });

      if (formatType === "list") {
        elements.forEach((el) => {
          el.style.borderRadius = "";
        });

        const visibleElements = Array.from(elements).filter(
          (el) => el.style.display !== "none"
        );

        if (visibleElements.length > 0) {
          visibleElements[0].style.borderTopLeftRadius = ".25rem";
          visibleElements[0].style.borderTopRightRadius = ".25rem";

          const lastElement = visibleElements[visibleElements.length - 1];
          lastElement.style.borderBottomLeftRadius = ".25rem";
          lastElement.style.borderBottomRightRadius = ".25rem";
        }
      }

      if (statusText) {
        if (targetLength) {
          statusText.textContent = `Viser ${shownCount} ord med ${targetLength} tegn (skjuler ${hiddenCount} ord)`;
        } else {
          statusText.textContent = `Viser ${shownCount} ord`;
        }
      }
    };

    filterSelect.addEventListener("change", filterWords);
    clearButton.addEventListener("click", () => {
      filterSelect.value = "";
      filterWords();
    });

    if (statusText) {
      statusText.textContent = `Viser ${elements.length} ord`;
    }

    if (elements.length > 0) {
      log.success(
        `Filtering enabled for ${formatType}! ${
          elements.length
        } words (${Math.min(...lengths)}-${Math.max(...lengths)} letter(s))`
      );
    } else {
      log.fail("No words found — filtering disabled.");
    }
  }

  function setupMainPageValidation() {
    const searchInput = $("#ord");
    if (!searchInput) return;

    const form = searchInput.closest("form");
    if (form) {
      form.addEventListener("submit", (e) => {
        if (!searchInput.value.trim()) {
          e.preventDefault();
          log.fail("Search prevented — empty query not allowed");
        }
      });
      log.success("Main page search validation added");
    }
  }

  removeFacebookAds();

  if (isWordPage) {
    fixWordDisplay();
    createUI();
  } else {
    setupMainPageValidation();
  }

  const observer = new MutationObserver(() => {
    if (removeFacebookAds()) observer.disconnect();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  setTimeout(() => {
    observer.disconnect();
    log.timeout("Observer stopped after 10 seconds");
  }, 10000);
})();

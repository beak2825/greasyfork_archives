// ==UserScript==
// @name         Outline Amazon-owned bookstores
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Warn about Amazon-owned stores in results list to avoid buying from them.
// @author       Coaxial
// @match        https://www.bookfinder.com/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bookfinder.com
// @grant        none
// @homepage     https://github.com/coaxial/tampermonkey-scripts
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/464153/Outline%20Amazon-owned%20bookstores.user.js
// @updateURL https://update.greasyfork.org/scripts/464153/Outline%20Amazon-owned%20bookstores.meta.js
// ==/UserScript==

"use strict";

const amazonBookstores = ["AbeBooks", "Amazon.*", "Book Depository", "ZVAB"];
const amazonBookstoresRegex = new RegExp(amazonBookstores.join("|"));
const resultRowsSelector =
  "tr.results-table-first-LogoRow, tr.results-table-LogoRow";
const fadedOpacity = 0.25;

// Build the fragment to show in the result row's "Notes" section.
const warningFragment = () => {
  // Will result in
  // <span style="font-weight: bold;">
  //   <span style="font-size: 1.25em;">⚠️  </span>
  //   <span>Amazon-owned business</span>
  //   <span style="font-size: 1.25em;"> ⚠️</span>
  // </span>
  // <br>
  const fragment = document.createDocumentFragment();
  const container = fragment.appendChild(document.createElement("span"));
  // Split in several elements to have discrete <span>s to make emojis a little
  // bigger.
  const prefix = document.createElement("span");
  prefix.textContent = "⚠️ ";
  prefix.style.fontSize = "1.25em";
  const note = document.createElement("span");
  note.textContent = "Amazon-owned business";
  const suffix = document.createElement("span");
  suffix.textContent = " ⚠️";
  suffix.style.fontSize = "1.25em";
  fragment.appendChild(document.createElement("br"));
  container.appendChild(prefix);
  container.appendChild(note);
  container.appendChild(suffix);
  container.style.fontWeight = "bold";

  return fragment;
};

// Extract the store name as a string from a result row.
const extractStoreName = (result) =>
  result.querySelector("img").attributes.alt.value;

const isAmazonOwned = (storeName) => amazonBookstoresRegex.test(storeName);

// Find all result rows for search.
const extractResultRows = () => document.querySelectorAll(resultRowsSelector);

// Add the Amazon warning to the result row.
const appendWarning = (result) => {
  result.style.opacity = fadedOpacity;
  result.querySelector(".item-note").prepend(warningFragment());
};

// Do it!
extractResultRows().forEach((row) => {
  const storeName = extractStoreName(row);

  if (isAmazonOwned(storeName)) {
    appendWarning(row);
  }
});

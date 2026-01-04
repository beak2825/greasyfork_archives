// ==UserScript==
// @name         Github search on Google
// @version      2.1.0
// @description  Adds a button to search github.com with Google
// @author       Alexyoe
// @namespace    https://github.com/Alexyoe/Github-on-Google-Search
// @license      MIT
// @include      http*://www.google.*/search*
// @include      http*://google.*/search*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/462358/Github%20search%20on%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/462358/Github%20search%20on%20Google.meta.js
// ==/UserScript==

// Settings
const settings = {
  // Choose exactly one: "icon" or "label"
  displayMode: "icon",
  btnPosition: "start", // "start", "end", or "afterai"
  fixSize: false,
};

// Start Code
const queryRegex = /q=[^&]+/g;
const siteRegex = /\+site(?:%3A|\:).+\.[^&+]+/g;
const githubUrl = "+site%3Agithub.com";

// Github SVG
let githubIcon =
  '<svg class="DCxYpf" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';
const isImageSearch = /[?&]tbm=isch/.test(location.search);

// Trusted Types for CSP
if (typeof trustedTypes !== "undefined") {
  const p = trustedTypes.createPolicy("html", { createHTML: (x) => x });
  githubIcon = p.createHTML(githubIcon);
}


// Main function to run on load. Waits for nav to load.
(function waitForNav() {
  const nav = Array.from(
    document.querySelectorAll('div[role="navigation"]')
  ).find((n) => n.querySelector('div[role="listitem"] a'));
  if (!nav) return setTimeout(waitForNav, 200);

  // Grab the first wrapper <div role="listitem"> that isn't selected or "AI Mode"
  const sampleItem = Array.from(
    document.querySelectorAll('div[role="listitem"]')
  ).find((item) => {
    const isSelected = item.querySelector('[selected], [aria-current="page"]');
    const text = item.textContent.trim();
    return !isSelected && text !== "AI Mode";
  });
  if (!sampleItem) return; // bail if nothing there

  // Clone the entire wrapper.
  const newItem = sampleItem.cloneNode(true);

  // Inside that clone, find the <a>
  const btn = newItem.querySelector("a");
  btn.href = window.location.href.replace(queryRegex, (m) =>
    m.search(siteRegex) >= 0 ? m.replace(siteRegex, githubUrl) : m + githubUrl
  );

  // find their inner div (jsname) or fallback to the <a>
  const inner = btn.querySelector("div[jsname]") || btn;

  // Clear the inner div
  inner.innerHTML = "";

  if (settings.displayMode === "label") {
    const textWrapper = document.createElement("span");
    textWrapper.textContent = "Github";
    textWrapper.className = "R1QWuf";
    inner.appendChild(textWrapper);
  } else {
    const iconWrapper = document.createElement("span");
    iconWrapper.className = "R1QWuf";
    iconWrapper.style.lineHeight = "17px";
    iconWrapper.innerHTML = githubIcon;
    inner.appendChild(iconWrapper);
  }

  // Insert the wrapper at the requested position
  const first = nav.querySelector(':scope div[role="listitem"]');
  if (settings.btnPosition === "start") {
    first ? first.before(newItem) : nav.prepend(newItem);
  } else if (settings.btnPosition === "end") {
    nav.append(newItem);
  } else {
    first ? first.after(newItem) : nav.append(newItem);
  }

  // optional: prevent wrapping
  if (settings.fixSize) {
    nav.style.maxWidth = "inherit";
    nav.style.overflowX = "auto";
    nav.style.whiteSpace = "nowrap";
  }
})();


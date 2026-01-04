// ==UserScript==
// @name         Reddit on Google Search (forked from Alexyoe's original script)
// @version      1.1.0
// @description  Adds a button to search Reddit via Google Search
// @author       mefengl (original author: Alexyoe)
// @namespace    https://github.com/mefengl/Reddit-on-Google-Search
// @license      MIT
// @include      http*://www.google.*/search*
// @include      http*://google.*/search*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/488155/Reddit%20on%20Google%20Search%20%28forked%20from%20Alexyoe%27s%20original%20script%29.user.js
// @updateURL https://update.greasyfork.org/scripts/488155/Reddit%20on%20Google%20Search%20%28forked%20from%20Alexyoe%27s%20original%20script%29.meta.js
// ==/UserScript==

function useOption(optionName, defaultValue, type = "boolean", enumOptions = []) {
  let value = GM_getValue(optionName, defaultValue);

  if (type === "boolean") {
    GM_registerMenuCommand(`Toggle ${optionName} (currently ${value ? "Enabled" : "Disabled"})`, () => {
      GM_setValue(optionName, !value);
      window.location.reload();
    });
  } else if (type === "enum") {
    GM_registerMenuCommand(`Cycle ${optionName} (currently ${value})`, () => {
      const currentIndex = enumOptions.indexOf(value);
      const nextIndex = (currentIndex + 1) % enumOptions.length;
      GM_setValue(optionName, enumOptions[nextIndex]);
      window.location.reload();
    });
  }

  return value;
}

// Settings
const iconVisible = useOption("iconVisible", true); // Toggle icon visibility
const nameVisible = useOption("nameVisible", true); // Toggle name visibility
const btnPosition = useOption("btnPosition", "end", "enum", ["start", "end"]); // Start or End
const fixSize = useOption("fixSize", false);  // Expands the search buttons bar

// Start Code
const queryRegex = /q=[^&]+/g;
const siteRegex = /\+site(?:%3A|\:).+\.[^&+]+/g;
const redditUrl = "+site%3Areddit.com";
const hackerNewsUrl = "+site%3Anews.ycombinator.com";
let redditIcon =
  '<svg class="DCxYpf" foscusable="false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="..."></path></svg>';
let hackerNewsIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"><path d="M416 96v320H96V96h320m32-32H64v384h384V64z" fill="currentColor"/><path d="M296.7 159H342l-63.9 120v72h-39.9v-72L172 159h47.1l39.7 83.6 37.9-83.6z" fill="currentColor"/></svg>';
const isImageSearch = /[?&]tbm=isch/.test(location.search);

// Allow importing SVG
if (typeof trustedTypes !== "undefined") {
  const policy = trustedTypes.createPolicy("html", {
    createHTML: (input) => input,
  });
  redditIcon = policy.createHTML(redditIcon);
  hackerNewsIcon = policy.createHTML(hackerNewsIcon);
}

// Main function runs on load
(function () {
  // Create the main link element
  const el = document.createElement("a");
  el.className = isImageSearch ? "NZmxZe" : "nPDzT T3FoJb";

  // Create the div element for the text
  const hackerNewsEl = document.createElement("a");
  hackerNewsEl.className = isImageSearch ? "NZmxZe" : "nPDzT T3FoJb";

  [el, hackerNewsEl].forEach((el, index) => {
    const icon = index === 0 ? redditIcon : hackerNewsIcon;
    const siteUrl = index === 0 ? redditUrl : hackerNewsUrl;
    const text = index === 0 ? "Reddit" : "Hacker News";

    const mainDiv = document.createElement("div");
    mainDiv.className = "GKS7s";

    // Create the span to wrap the icon and title
    const span = document.createElement("span");
    span.style.cssText = "display:inline-flex;gap:5px;";
    span.className = isImageSearch ? "m3kSL" : "FMKtTb UqcIvb";

    // create the div to hold our SVG
    const iconDiv = document.createElement("div");
    iconDiv.style.cssText = nameVisible
      ? "height:16px;width:16px;display:block;fill:white;"
      : "height:16px;width:16px;display:block;margin:auto;fill:white;";
    iconDiv.innerHTML = icon;

    // Create the text node to hold the button title
    const textNode = document.createTextNode(text);
    // Add iconDiv to the span element
    if (iconVisible) {
      span.appendChild(iconDiv);
    }
    // Add textNode to the span element
    if (nameVisible) {
      if (!isImageSearch) {
        span.appendChild(textNode);
      }
    }

    // Add span to the mainDiv
    mainDiv.appendChild(span);
    // Add mainDiv to the main link element
    el.appendChild(mainDiv);
    // Add text node last if isImageSearch is true
    if (isImageSearch) {
      el.appendChild(textNode);
    }

    // Add site:reddit.com to the query
    el.href = window.location.href.replace(queryRegex, (match) =>
      match.search(siteRegex) >= 0
        ? match.replace(siteRegex, siteUrl)
        : match + siteUrl
    );
  });

  // Insert the link into Google search
  if (isImageSearch) {
    let menuBar = document.querySelector(".T47uwc");
    menuBar.insertBefore(el, menuBar.children[menuBar.childElementCount - 1]);
  } else {
    let menuBar = document.querySelectorAll(".IUOThf")[0];
    switch (btnPosition) {
      case "start":
        menuBar.insertBefore(el, menuBar.children[0]);
        menuBar.insertBefore(hackerNewsEl, menuBar.children[1]);
        break;
      case "end":
        menuBar.appendChild(el);
        menuBar.appendChild(hackerNewsEl);
        break;
      default:
        menuBar.appendChild(el);
        menuBar.appendChild(hackerNewsEl);
        break;
    }
  }

  // Fix Sizing
  if (fixSize) {
    const buttonBox = document.querySelector(".xhjkHe");
    buttonBox.style.maxWidth = "inherit";
  }
})();

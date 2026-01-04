// ==UserScript==
// @author      topher200@gmail.com
// @name        Graphite GitHub button
// @description Add a button to go from app.graphite.com to github.com
// @match       https://app.graphite.dev/*
// @match       https://app.graphite.com/*
// @version      0.7.0
// @run-at      document-idle
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @namespace https://app.graphite.dev
// @downloadURL https://update.greasyfork.org/scripts/458355/Graphite%20GitHub%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/458355/Graphite%20GitHub%20button.meta.js
// ==/UserScript==

const PATH_REGEX = /^\/github\/pr\/([\w-]+)\/([\w-]+)\/(\d+).*$/;
const SELECTOR =
  '[class^="PullRequestTitleBar_container_"] > div:nth-child(1) > div:nth-child(2)';

/**
 * Finds the "Review changes" button to use as a style template,
 * then creates and appends a new "Open in GitHub" button
 * that matches its appearance.
 *
 * Assumes PATH_REGEX is defined in the script's outer scope.
 *
 * @param {HTMLElement} toolbar - The toolbar element to append the button to.
 */
const addButton = (toolbar) => {
  // --- 1. Get PR info ---
  const [_, org, repo, pr] = window.location.pathname.match(PATH_REGEX);
  const gitHubLink = `https://github.com/${org}/${repo}/pull/${pr}`;

  // --- 2. Check if button already exists ---
  if (document.getElementById("gitHubLink") != null) {
    return;
  }

  // --- 3. Find the "Review changes" button to use as a style template ---
  const reviewSpan = document.evaluate(
    "//span[normalize-space()='Review changes']", // Use XPath to find the text node
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  if (!reviewSpan) {
    console.error(
      'Tampermonkey Script: Could not find "Review changes" span to clone styles.'
    );
    return;
  }

  const templateButton = reviewSpan.closest("button");

  if (!templateButton) {
    console.error(
      'Tampermonkey Script: Could not find parent "Review changes" button to clone styles.'
    );
    return;
  }

  // --- 4. Get the class names from the template button's inner spans ---
  // We need to replicate the <span class="..."><span class="..."><span...
  const templateInnerSpan = templateButton.querySelector("span");
  const templateTextSpan = templateInnerSpan
    ? templateInnerSpan.querySelector("span")
    : null;

  if (!templateInnerSpan || !templateTextSpan) {
    console.error(
      "Tampermonkey Script: Could not find inner span structure of template button."
    );
    return;
  }

  // --- 5. Create the new "Open in GitHub" link ---
  const anchorEl = document.createElement("a");
  anchorEl.setAttribute("id", "gitHubLink");
  anchorEl.setAttribute("href", gitHubLink);

  // --- 6. Copy all classes and data attributes from the template button ---
  anchorEl.className = templateButton.className;
  for (const attr of templateButton.attributes) {
    if (attr.name.startsWith("data-")) {
      anchorEl.setAttribute(attr.name, attr.value);
    }
  }
  // Ensure it's treated as a button role for accessibility, though it's a link
  anchorEl.setAttribute("role", "button");

  // --- 7. Re-create the inner span structure for correct styling ---
  const span1 = document.createElement("span");
  span1.className = templateInnerSpan.className; // e.g., "Button_gdsButtonContents__5B2fy"

  const span2 = document.createElement("span");
  span2.className = templateTextSpan.className; // e.g., "Button_gdsButtonText__5kyh_"

  const span3 = document.createElement("span");
  span3.appendChild(document.createTextNode("Open in GitHub"));

  span2.appendChild(span3);
  span1.appendChild(span2);
  anchorEl.appendChild(span1);

  // --- 8. Append the new button to the toolbar ---
  toolbar.appendChild(anchorEl);
};

const toolbarObserver = new MutationObserver((_, observer) => {
  const toolbar = document.querySelector(SELECTOR);
  if (toolbar) {
    observer.disconnect();
    addButton(toolbar);
  }
});

let lastPathname;
const routeChangeObserver = new MutationObserver(() => {
  const { pathname } = window.location;

  if (pathname !== lastPathname) {
    lastPathname = pathname;

    if (pathname.match(PATH_REGEX)) {
      // Check immediately if toolbar exists
      const toolbar = document.querySelector(SELECTOR);
      if (toolbar) {
        addButton(toolbar);
      } else {
        // Otherwise, observe for its appearance
        toolbarObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
    } else {
      // Disconnect toolbarObserver if the path no longer matches
      toolbarObserver.disconnect();
    }
  }
});

routeChangeObserver.observe(document.body, { childList: true, subtree: true });

// ==UserScript==
// @name        Github => Graphite button
// @description Add a button to go from app.graphite.dev to github.com
// @match       http*://www.github.com/*
// @match       http*://github.com/*
// @version      0.3.1
// @run-at      document-start
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @namespace https://www.github.com
// @downloadURL https://update.greasyfork.org/scripts/509840/Github%20%3D%3E%20Graphite%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/509840/Github%20%3D%3E%20Graphite%20button.meta.js
// ==/UserScript==

const PATH_REGEX = /^\/([^\/]+)\/([^\/]+)\/pull\/([^\/]+).*$/;
const SELECTOR =
  '[class^="gh-header-actions"]';

const addButton = (toolbar) => {
  const [_, org, repo, pr] = window.location.pathname.match(PATH_REGEX);
  const graphiteLink = `https://app.graphite.dev/github/pr/${org}/${repo}/${pr}/`;

  if (document.getElementById("graphiteLink") != null) {
    return;
  }

  const anchorEl = document.createElement("a");
  anchorEl.setAttribute("id", "graphiteLink");
  anchorEl.setAttribute("href", graphiteLink);
  anchorEl.setAttribute("target", "_blank");
  anchorEl.setAttribute(
    "class",
    "Button--secondary Button--small Button"
  );
  anchorEl.appendChild(document.createTextNode("Graphite ↗️"));

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
      toolbarObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }
});

routeChangeObserver.observe(document.body, { childList: true, subtree: true });

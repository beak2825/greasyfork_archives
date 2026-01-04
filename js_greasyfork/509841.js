// ==UserScript==
// @name        Graphite => GitHub button
// @description Add a button to go from app.graphite.dev to github.com
// @match       https://app.graphite.dev/*
// @version      0.3.3
// @run-at      document-start
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @namespace https://app.graphite.dev
// @downloadURL https://update.greasyfork.org/scripts/509841/Graphite%20%3D%3E%20GitHub%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/509841/Graphite%20%3D%3E%20GitHub%20button.meta.js
// ==/UserScript==

const PATH_REGEX = /^\/github\/pr\/([^\/]+)\/([^\/]+)\/([^\/]+).*$/;
const SELECTOR =
  '[class^="PullRequestTitleBar_container_"] > div:nth-child(1) > div:nth-child(2)';

const addButton = (toolbar) => {
  const [_, org, repo, pr] = window.location.pathname.match(PATH_REGEX);
  const gitHubLink = `https://github.com/${org}/${repo}/pull/${pr}`;

  if (document.getElementById("gitHubLink") != null) {
    return;
  }

  const anchorEl = document.createElement("a");
  anchorEl.setAttribute("id", "gitHubLink");
  anchorEl.setAttribute("href", gitHubLink);
  anchorEl.setAttribute("target", "_blank");
  anchorEl.setAttribute(
    "style",
    "background: #f0f0f333; padding: 6px; border-radius: 4px; flex-shrink: 0;"
  );
  anchorEl.appendChild(document.createTextNode("GitHub ↗️"));

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

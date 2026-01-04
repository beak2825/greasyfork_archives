// ==UserScript==
// @name         GitHub Repo Creation Date
// @namespace    npm/vite-plugin-monkey
// @version      0.1.1
// @author       pacexy <pacexy@gmail.com>
// @description  Display creation date of repositories on GitHub
// @license      MIT
// @icon         https://github.com/favicon.ico
// @homepage     https://github.com/pacexy/userscript-github-repo-creation-date#readme
// @homepageURL  https://github.com/pacexy/userscript-github-repo-creation-date#readme
// @source       https://github.com/pacexy/userscript-github-repo-creation-date.git
// @supportURL   https://github.com/pacexy/userscript-github-repo-creation-date/issues
// @match        https://github.com/*/*
// @downloadURL https://update.greasyfork.org/scripts/541901/GitHub%20Repo%20Creation%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/541901/GitHub%20Repo%20Creation%20Date.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const name = "userscript-github-repo-creation-date";
  async function fetchRepo(owner, name2) {
    const response = await fetch(`https://ungh.cc/repos/${owner}/${name2}`);
    return response.json();
  }
  function parseCurrentPath() {
    const [, owner, name2] = window.location.pathname.split("/");
    if (!owner || !name2) {
      throw new Error("Invalid URL format");
    }
    return { owner, name: name2 };
  }
  function formatDate(date, format = "short") {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: format,
      day: format === "long" ? "numeric" : void 0
    });
  }
  function inject(date) {
    const container = document.createElement("span");
    container.id = name;
    container.title = `Created on ${formatDate(date, "long")}`;
    container.textContent = `(${formatDate(date)})`;
    container.style.color = "var(--fgColor-disabled)";
    container.style.marginLeft = "8px";
    const root = document.querySelector(".Layout-sidebar h2");
    if (!root) {
      throw new Error("Root element not found");
    }
    root.append(container);
  }
  async function run() {
    const { owner, name: name2 } = parseCurrentPath();
    const { repo } = await fetchRepo(owner, name2);
    inject(repo.createdAt);
  }
  run();

})();
// ==UserScript==
// @name        GitHub Creation Date
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*/*
// @grant       none
// @version     1.0
// @author      -
// @description Displays the creation date of a GitHub repository when clicked.
// @run-at      document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527825/GitHub%20Creation%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/527825/GitHub%20Creation%20Date.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const createButton = (text, styles = {}) => {
    const button = document.createElement("button");
    button.textContent = text;
    Object.assign(button.style, {
      marginLeft: "10px",
      padding: "3px 6px",
      cursor: "pointer",
      backgroundColor: "#0366d6",
      color: "#fff",
      border: "none",
      borderRadius: "3px",
      fontSize: "12px",
      lineHeight: "1.5",
      ...styles,
    });
    return button;
  };

  const fetchRepoInfo = async (owner, repo) => {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const response = await fetch(apiUrl, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch repository info (Status: ${response.status})`
      );
    }
    return response.json();
  };

  const init = () => {
    const repoTitleComponent = document.querySelector(
      'div[id="repo-title-component"]'
    );
    if (!repoTitleComponent) {
      console.error("Could not find the repository title component.");
      return;
    }

    const button = createButton("Creation Date");
    repoTitleComponent.appendChild(button);

    button.addEventListener("click", async () => {
      const [, owner, repo] = window.location.pathname.split("/");

      if (!owner || !repo) {
        alert("Invalid repository URL.");
        return;
      }

      try {
        const repoInfo = await fetchRepoInfo(owner, repo);
        alert(
          `'${repo}' was created on: ${new Date(
            repoInfo.created_at
          ).toLocaleString()}`
        );
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    });
  };

  init();
})();

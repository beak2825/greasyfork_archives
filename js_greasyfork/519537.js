// ==UserScript==
// @name         GitHub Repo Size
// @namespace    https://github.com/
// @version      1.2
// @description  Show GitHub Repo size in side panel
// @license      MIT
// @author       cscnk52 & ChatPGT
// @match        https://github.com/*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      api.github.com
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/519537/GitHub%20Repo%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/519537/GitHub%20Repo%20Size.meta.js
// ==/UserScript==

(function () {
  "use strict";

  if (!/https:\/\/github\.com\/[^\/]+\/[^\/]+$/.test(window.location.href)) {
    return;
  }

  const token = GM_getValue("token", null);
  const apiUrl = `https://api.github.com/repos${window.location.pathname}`;

  GM_registerMenuCommand("config token", function () {
    const currentToken = token
      ? `current Token: ${token}`
      : "No Token configured";
    const newToken = prompt(`${currentToken}\nEnter new Token:`);

    if (newToken) {
      GM_setValue("token", newToken);
      alert("Token update!");
    } else if (newToken === "") {
      alert("Token unchanged!");
    }
  });

  function fetchRepoSize() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: apiUrl,
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Mozilla/5.0",
          Authorization: `Bearer ${token}`,
        },
        onload: function (response) {
          if (response.status === 200) {
            const repoData = JSON.parse(response.responseText);
            if (repoData && repoData.size) {
              let size = repoData.size;
              let sizeDisplay;

              if (size >= 0.9 * 1024 * 1024) {
                sizeDisplay = (size / (1024 * 1024)).toFixed(2) + " GB";
              } else if (size >= 0.9 * 1024) {
                sizeDisplay = (size / 1024).toFixed(2) + " MB";
              } else {
                sizeDisplay = size.toFixed(2) + " KB";
              }

              resolve(sizeDisplay);
            } else {
              resolve("Size not available");
            }
          } else if (response.status === 401) {
            resolve("Error: Token invalid");
          } else if (response.status === 403) {
            resolve("Error: Token permissions are insufficient");
          } else if (response.status === 429) {
            resolve(
              "Error: GitHub API limit reached. Configure a token to fix.",
            );
          } else {
            resolve(`Error: HTTP Code ${response.status}`);
          }
        },
        onerror: function (error) {
          reject(`Error: ${error}`);
        },
      });
    });
  }

  async function displayRepoSize() {
    try {
      const text = await fetchRepoSize();
      const formattedText = text.replace(
        /(\d+(\.\d+)?)/g,
        "<strong>$1</strong>",
      );
      const sizeElement = document.createElement("div");
      sizeElement.className = "mt-2";

      sizeElement.innerHTML = `
            <a href="#" data-view-component="true" class="Link Link--muted">
                <svg aria-hidden="true" height="16" viewBox="0 0 24 24" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo-size mr-2">
                  <path d="M12 0C6.61 0 2 2.192 2 5.302v13.396C2 21.798 6.596 24 12 24c5.394 0 10-2.196 10-5.302V5.302C22 2.194 17.391 0 12 0m0 1.674c4.821 0 8.286 1.884 8.286 3.628 0 1.753-3.479 3.628-8.286 3.628-4.816 0-8.286-1.88-8.286-3.628 0-1.747 3.47-3.628 8.286-3.628m-8.286 6.65C5.251 9.519 8.141 10.605 12 10.605c3.453 0 6.476-.884 8.286-2.281V12c0 1.752-3.476 3.628-8.286 3.628-4.816 0-8.286-1.88-8.286-3.628zm0 6.698c1.82 1.404 4.848 2.28 8.286 2.28 3.402 0 6.43-.859 8.286-2.28v3.676c0 1.743-3.46 3.628-8.286 3.628-4.815 0-8.286-1.882-8.286-3.628z"/>
                </svg>
                ${formattedText}
            </a>
        `;

      const mt2Divs = document.querySelectorAll("div.mt-2");

      mt2Divs.forEach((div) => {
        if (div.querySelector("svg.octicon.octicon-repo-forked.mr-2")) {
          div.insertAdjacentElement("afterend", sizeElement);
          return;
        }
      });
    } catch (error) {
      console.error("Error displaying repo size:", error);
    }
  }

  displayRepoSize();
})();

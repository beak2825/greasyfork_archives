// ==UserScript==
// @name         Reddit India Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Search for the OP username and see if they have posted in India subreddit, if they have block them.
// @author       loki1488
// @license MIT
// @match        *://www.reddit.com/r/*/comments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488870/Reddit%20India%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/488870/Reddit%20India%20Remover.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Function to extract OP username from the page
  function getOPUsername() {
    const opElement = document.querySelector(".top-matter .author");
    if (opElement) {
      return opElement.innerText;
    }
    return null;
  }

  // Function to perform a search and count the results
  async function countSearchResults(username) {
    if (!username) {
      console.log("OP username not found.");
      return;
    }
    console.log(`Looking up OP... ${username}`);
    const searchURL = `https://www.reddit.com/search/?q=author:${username}+india&restrict_sr=&sort=relevance&t=all`;
    fetch(searchURL)
      .then((response) => response.text())
      .then(async (data) => {
        const searchResultCount = data.match(
          /<p class="info">there doesn't seem to be anything here<\/p>/g
        );
        // console.log(`Search results for ${username}: ${searchResultCount}`);
        if (!searchResultCount) {
          console.log(`${username} is indian`);
          showToast(`💩 ...What's that smell?`, 7000);

          const { accountUhs, accountIds } = await retrieveBlockDetails(
            username
          );
          blockUser(username, accountIds[0], accountUhs[0]);
        } else {
          console.log(`${username} is human`);
          return;
        }
      })
      .catch((error) => console.error("Error fetching search results:", error));
  }

  async function retrieveBlockDetails(username) {
    try {
      const profileURL = `https://www.reddit.com/user/${username}`;
      const response = await fetch(profileURL);
      const data = await response.text();

      const accountIdRegex =
        /data-fullname="([^"]+)" data-event-action="gild"/g;
      const accountIdMatches = data.match(accountIdRegex);
      const accountIds = accountIdMatches
        ? accountIdMatches.map((match) => match.replace(accountIdRegex, "$1"))
        : [];
      // console.log("Account IDs:", accountIds);

      const accountUhRegex = /name="uh" value="([^"]+)"/g;
      const accountUhMatches = data.match(accountUhRegex);
      const accountUhs = accountUhMatches
        ? accountUhMatches.map((match) => match.replace(accountUhRegex, "$1"))
        : [];
      // console.log("Account UHs:", accountUhs);

      return { accountUhs, accountIds };
    } catch (error) {
      console.error("Error fetching search results:", error);
      return { accountUhs: [], accountIds: [] }; // Return empty arrays if an error occurs
    }
  }

  function blockUser(user, accountId, accountUh) {
    const blockUserURL = "https://www.reddit.com/api/block_user";
    const blockUserData = `id=&executed=blocked&account_id=${accountId}&r=u_${user}&uh=${accountUh}&renderstyle=html`;

    fetch(blockUserURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: blockUserData,
    })
      .then((response) => {
        if (response.ok) {
          console.log("Blocked");
          countBlocked();
        } else {
          console.error("Error blocking user:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error blocking user:", error);
      });
  }

  function countBlocked() {
    // https://www.reddit.com/prefs/blocked/
    const blockedURL = `https://www.reddit.com/prefs/blocked/`;
    fetch(blockedURL)
      .then((response) => response.text())
      .then((data) => {
        const currentBlocked = (data.match(/togglebutton/g) || []).length;
        console.log(`Total blocked: ${currentBlocked} `);
        showToast(`${currentBlocked} 🇮🇳 Sars?? Blocked`, 7000);
      })
      .catch((error) => console.error("Error fetching search results:", error));
  }

  // CSS styles for the toast notifications
  const toastStyles = `
    #toastContainer {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
    }

    .toast {
        background-color: #333;
        color: #fff;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
				font-size:20px;
    }
`;

  // Function to create and show a toast notification
  function showToast(message, duration = 3000) {
    // Create the toast container if it doesn't exist
    let toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toastContainer";
      document.body.appendChild(toastContainer);
    }

    // Create the toast element
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = message;

    // Append toast to container
    toastContainer.appendChild(toast);

    // Remove toast after duration
    setTimeout(() => {
      toast.remove();
    }, duration);
  }

  // Inject CSS styles
  const styleElement = document.createElement("style");
  styleElement.textContent = toastStyles;
  document.head.appendChild(styleElement);

  // Main function
  async function main() {
    const opUsername = getOPUsername();
    countSearchResults(opUsername);
  }

  // Execute main function
  main();
})();

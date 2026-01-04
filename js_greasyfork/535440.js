// ==UserScript==
// @name         Badge Picker Upgrades
// @namespace    https://github.com/encumber/SteamBadgeShowcaseTools/blob/main/BadgePickerUpgrades.userscript.js
// @version      1.1
// @description  removes the names of each of the badges and turns it into a neat array of columns to allow for you to be able to view more at once, useful for people with more badges
// @author       Nitoned
// @match        https://steamcommunity.com/*/*/edit/showcases
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535440/Badge%20Picker%20Upgrades.user.js
// @updateURL https://update.greasyfork.org/scripts/535440/Badge%20Picker%20Upgrades.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to dynamically add or remove styles
const styleElement = document.createElement("style");
document.head.appendChild(styleElement);

function updateStyles(content) {
  let styles = `
    /* Shared Boilerplate CSS */
    .group_list_results {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    overflow: auto; /* Enable scrolling for overflow */
    max-height: 90%; /* Ensure badges stay within the newmodal bounds */
    padding: 10px;
    padding-bottom: 50px;
    box-sizing: border-box;
  }
  .group_list_option {
    flex: 1 0 calc(100% / var(--columns) - 10px);
    box-sizing: border-box;
    padding: 5px;
    margin: 0;
    text-align: center;
  }
  .badge_icon img {
    width: 80px;
    height: 80px;
    display: block;
    margin: 0 auto;
  }
  .group_list_groupname {
    display: none !important;
  }
  .search-container {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    position: absolute;
    top: 25px;
    right: calc(5%);
  }
  .search-container input {
    margin-left: 10px;
    padding: 5px;
    font-size: 14px;
  }
  .search-container button {
    margin-left: 5px;
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
  }
  .newmodal {
    overflow: hidden;
    position: relative;
    max-height: 100%; /* Restricts badges to fit within the modal */
	left: 50px !important;
    right: 40px !important;
    top: 30px !important;
	bottom: 40px !important;
  }
  `;

  switch (content) {
    case "Choose a badge to feature":
      styles += `
        .group_list_groupname {
          display: none !important;
        }
      `;
      break;

    case "Select a Group to Feature":
      styles += `
        .group_list_groupname {
          visibility: hidden;
          position: absolute;
        }
        .group_list_option {
         padding: 30px !important;
         }
    text-align: center;
        .group_list_option:hover .group_list_groupname {
          visibility: visible;
          display: block;
          position: absolute;
          background: rgba(0, 0, 0, 0.75);
          color: #fff;
          padding: 5px;
          border-radius: 4px;
          z-index: 10;
          white-space: nowrap;
        }
        .group_list_option .playerAvatar {
    width: 48px !important;
    height: 48px !important;
}
.playerAvatar img, .friend_block_holder .friend_block_avatar img, .friend_activity .friend_block_avatar img {
    width: 48px !important;
    height: 48px !important;
}
      `;
      break;

    case "Select an achievement to feature":
      styles += `
        .achievement_list_desc {
          visibility: hidden;
          position: absolute;
        }
        .group_list_option:hover .achievement_list_desc {
          visibility: visible;
          display: block;
          position: absolute;
          background: rgba(0, 0, 0, 0.75);
          color: #fff;
          padding: 5px;
          border-radius: 4px;
          z-index: 10;
          white-space: normal;
        }
      `;
      break;

    case "Select a Game You've Publicly Reviewed":
      // No additional styles needed for this context
      break;

    default:
      styles = ""; // Unload styles
      break;
  }

  styleElement.textContent = styles;
}

// Function to manage the addition of search functionality
function addSearchFunctionality(content) {
  // Remove search bar for "Select a Game You've Publicly Reviewed"
  if (content === "Select a Game You've Publicly Reviewed") return;

  const existingSearchContainer = document.querySelector(".search-container");
  if (existingSearchContainer) return; // Avoid adding duplicate search boxes

  const titleText = Array.from(document.querySelectorAll(".title_text")).find(
    (el) => el.textContent.trim() === content
  );

  if (titleText) {
    const searchContainer = document.createElement("div");
    searchContainer.className = "search-container";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search...";

    const searchButton = document.createElement("button");
    searchButton.textContent = "Search";

    searchContainer.appendChild(document.createTextNode("Search:"));
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchButton);

    titleText.parentNode.insertBefore(searchContainer, titleText.nextSibling);

    const badges = document.querySelectorAll(".group_list_option");

    const filterBadges = () => {
      const query = searchInput.value.toLowerCase().trim();
      badges.forEach((badge) => {
        const badgeName = badge.getAttribute("data-badge-name") || "";
        const groupName = badge.getAttribute("data-group-name") || "";
        const achievementDesc = badge.getAttribute("data-achievement-desc") || "";

        if (
          query === "" ||
          badgeName.includes(query) ||
          groupName.includes(query) ||
          achievementDesc.includes(query)
        ) {
          badge.style.display = "";
        } else {
          badge.style.display = "none";
        }
      });
    };

    searchButton.addEventListener("click", filterBadges);
    searchInput.addEventListener("input", filterBadges);
  }
}

// Function to prepare group names and set hover/search functionality
function prepareGroupNames() {
  document.querySelectorAll(".group_list_option").forEach((option) => {
    const groupNameElement = option.querySelector(".group_list_groupname");
    if (groupNameElement) {
      const groupName = groupNameElement.textContent.trim();
      option.setAttribute("data-group-name", groupName.toLowerCase()); // Add for search
      option.setAttribute("title", groupName); // Add hover text to the option itself
    }
  });
}

// Function to prepare badge, group, and achievement descriptions
function prepareBadgeData() {
  document.querySelectorAll(".group_list_option").forEach((option) => {
    const groupNameElement = option.querySelector(".group_list_groupname");
    const badgeIcon = option.querySelector(".badge_icon");
    const achievementDescElement = option.querySelector(".achievement_list_desc");

    if (groupNameElement) {
      const groupName = groupNameElement.textContent.trim();
      option.setAttribute("data-group-name", groupName.toLowerCase()); // Add for search
      option.setAttribute("title", groupName); // Set hover text directly
    }

    if (badgeIcon) {
      const badgeName = badgeIcon.getAttribute("title") || "";
      option.setAttribute("data-badge-name", badgeName.toLowerCase());
    }

    if (achievementDescElement) {
      const achievementDesc = achievementDescElement.innerText.trim(); // Includes children like <b> and <div>
      option.setAttribute("data-achievement-desc", achievementDesc.toLowerCase());
    }
  });
}

// MutationObserver to monitor DOM changes
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (
      mutation.type === "childList" &&
      mutation.addedNodes.length > 0 &&
      Array.from(mutation.addedNodes).some((node) =>
        node.querySelector
          ? node.querySelector(".title_text")
          : node.className === "title_text"
      )
    ) {
      const titleText = Array.from(document.querySelectorAll(".title_text")).find(
        (el) =>
          [
            "Choose a badge to feature",
            "Select a Game You've Publicly Reviewed",
            "Select an achievement to feature",
            "Select a Group to Feature",
          ].includes(el.textContent.trim())
      );

      if (titleText) {
        const content = titleText.textContent.trim();
        updateStyles(content); // Update styles based on the title
        prepareBadgeData(); // Prepare badge data
        if (content === "Select a Group to Feature") {
          prepareGroupNames(); // Handle group-specific hover/search immediately
        }
        addSearchFunctionality(content); // Add search functionality
      } else {
        // If the modal is no longer present, unload styles and clean up
        updateStyles(""); // Unload styles
        document.querySelector(".search-container")?.remove();
      }
    }
  }
});

// Run the group name preparation immediately on load
if (document.querySelector(".title_text")) {
  const content = document.querySelector(".title_text").textContent.trim();
  updateStyles(content);
  prepareBadgeData();
  if (content === "Select a Group to Feature") {
    prepareGroupNames();
  }
  addSearchFunctionality(content);
}

// Start observing the document for changes
observer.observe(document.body, { childList: true, subtree: true });




})();

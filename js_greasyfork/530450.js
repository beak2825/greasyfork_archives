// ==UserScript==
// @name         Enhanced Pull Request Overview
// @namespace    http://tampermonkey.net/
// @version      2025-04-04
// @description  GitHub should have added this years ago
// @author       mxt-mischa
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530450/Enhanced%20Pull%20Request%20Overview.user.js
// @updateURL https://update.greasyfork.org/scripts/530450/Enhanced%20Pull%20Request%20Overview.meta.js
// ==/UserScript==

GM_addStyle(`
.branch-information {
  backgroundColor: var(--bgColor-accent-muted, var(--color-accent-subtle));
  color: var(--fgColor-accent, var(--color-accent-fg));
  borderRadius: var(--borderRadius-medium);
}

.branch-row {
  border-top: none;
  padding-top: 0 !important;
}

.pr-review-emoji {
  font-size: 8pt;
  position: absolute;
  top: -37%;
  right: 0;
  background-color: transparent;
}

.reviewer {
  display: flex;
  align-items: center;
  gap: 1px;
  position: relative;
}
`);

// `https://github.com/AUTHOR/REPOSITORY/pull/PR_NUMBER`
function getReviews(doc) {
    const reviewElement = doc.querySelector(`.discussion-sidebar-item.sidebar-assignee`);
    const reviewerElements = Array.from(reviewElement.querySelectorAll("p"));

    return reviewerElements.map(getReviewFromElement).filter(Boolean);
}

function getReviewFromElement(element) {
    const userElement = element.querySelector(`span[data-hovercard-type="user"]`);
    if (!userElement) {
        return;
    }

    const username = userElement.getAttribute("data-assignee-name");
    const avatar = `https://avatars.githubusercontent.com/${username}?size=28`;

    const approved = element.querySelector(`svg.color-fg-success`) ? true : false;
    const pending = element.querySelector(`svg.hx_dot-fill-pending-icon`) ? true : false;
    const denied = element.querySelector(`svg.color-fg-danger`) ? true : false;
    const comment = element.querySelector(`svg.color-fg-muted`) ? true : false;

    return {
        username,
        avatar,
        approved,
        pending,
        denied,
        comment,
    };
}

async function fetchPullRequestDOM(pullRequestUrl) {
    try {
        const res = await fetch(pullRequestUrl);
        const htmlString = await res.text();
        const parser = new DOMParser();
        return parser.parseFromString(htmlString, "text/html");
    } catch (error) {
        console.error("Failed to fetch PR content:", error);
        return null;
    }
}

function getTargetBranch(doc) {
    // Look for the branch information in the PR header
    const branchInfoElement = doc.querySelector(".commit-ref.base-ref a span.css-truncate-target");

    if (branchInfoElement) {
        return branchInfoElement.textContent.trim();
    }

    // Fallback: try alternative selectors if the first one fails
    const baseBranchElement = doc.querySelector(".base-ref span:last-child");
    if (baseBranchElement) {
        return baseBranchElement.textContent.trim();
    }

    // Second fallback: try to find it in the PR description
    const prDescription = doc.querySelector(".pull-request-meta-info");
    if (prDescription) {
        const branchText = prDescription.textContent;
        const branchMatch = branchText.match(/into\s+(\S+)\s+from/i);
        if (branchMatch && branchMatch[1]) {
            const targetBranch = branchMatch[1];
            console.debug("Target branch:", targetBranch);
            return targetBranch;
        }
    }

    // If we can"t find it, return a default value
    console.debug("Target branch not found!");
    return "";
}

function getSourceBranch(doc) {
    const sourceBranchElement = doc.querySelector(".commit-ref.head-ref a span.css-truncate-target");

    if (sourceBranchElement) {
        return sourceBranchElement.textContent.trim();
    }

    // Fallback: try alternative selectors if the first one fails
    const headBranchElement = doc.querySelector(".head-ref span:last-child");
    if (headBranchElement) {
        return headBranchElement.textContent.trim();
    }

    // Second fallback: try to find it in the PR description
    const prDescription = doc.querySelector(".pull-request-meta-info");
    if (prDescription) {
        const branchText = prDescription.textContent;
        const branchMatch = branchText.match(/from\s+(\S+)\s+/i);
        if (branchMatch && branchMatch[1]) {
            const sourceBranch = branchMatch[1];
            console.debug("Source branch:", sourceBranch);
            return sourceBranch;
        }
    }

    console.debug("Source branch not found!");
    return "";
}

function getBranchRow(doc, branchRow) {
  // And get the target branch
  const targetBranch = getTargetBranch(doc);
  // And the source branch
  const sourceBranch = getSourceBranch(doc);

  // add a new row to the PR element to display the source and target branches
  branchRow.innerHTML = "";
  branchRow.className = `Box-row Box-row--focus-gray p-3 mt-1 js-navigation-item js-issue-row navigation-focus`;
  branchRow.classList.add("branch-row");

  // Create span for target branch with GitHub"s branch styling
  const targetBranchSpan = document.createElement("span");
  targetBranchSpan.classList.add("v-align-middle", "branch-information");
  targetBranchSpan.textContent = targetBranch;

  // Create arrow element
  const arrowSpan = document.createElement("span");
  arrowSpan.textContent = " ← ";
  arrowSpan.style.margin = "0 4px";

  // Create span for source branch with GitHub"s branch styling
  const sourceBranchSpan = document.createElement("span");
  sourceBranchSpan.classList.add("v-align-middle", "branch-information");
  sourceBranchSpan.textContent = sourceBranch;

  // Add all elements to the row
  branchRow.appendChild(targetBranchSpan);
  branchRow.appendChild(arrowSpan);
  branchRow.appendChild(sourceBranchSpan);

  return branchRow;
}

/**
 * Look for the container with PR items - with fallback selectors
 * @returns
 */
function findPrContainer() {
  console.debug(`Checking for PR container..`);

  const toolbar = document.querySelector(`div[id="js-issues-toolbar"]`);
  if (!toolbar) {
    return;
  }

  return toolbar.parentElement.querySelector("div.js-navigation-container");
}

/**
 * Check if GitHub"s content has finished loading by looking for key indicators
 */
async function waitForGitHubContent() {
    try {
        const prContainer = findPrContainer();
        console.debug("GitHub content appears to have loaded!");
        return prContainer;
    } catch (error) {
        console.error("Failed to find GitHub content:", error);
    }
}

async function enrichPullRequests() {
    try {
        console.debug("Starting to find PR elements...");

        // Wait for GitHub content to be ready
        const prContainer = await waitForGitHubContent();

        // Find all pull request items
        const prElements = prContainer.querySelectorAll(":scope > div");
        console.info(`Found ${prElements.length} PR elements`);

        if (prElements.length === 0) {
            console.warn("No PR elements found, GitHub content may still be loading");
            return;
        }

        // Process each pull request
        prElements.forEach(async element => {
            try {
                if (element.getAttribute("processed-pr") === "true") {
                    return;
                }

                element.setAttribute("processed-pr", "true");

                const linkElement = element.querySelector(".Link--primary");
                if (!linkElement) {
                    console.warn("Could not find link element for PR", element);
                    return;
                }

                const pullRequestUrl = linkElement.href;
                console.debug("Processing PR:", pullRequestUrl);

                // Fetch DOM content and extract reviews
                const doc = await fetchPullRequestDOM(pullRequestUrl);
                const reviews = getReviews(doc);

                // Add a new row to the PR element to display the source and target branches
                const branchRow = element.firstElementChild.cloneNode(false);
                getBranchRow(doc, branchRow);
                element.appendChild(branchRow);

                const newRow = element.firstElementChild.cloneNode(false);
                newRow.innerHTML = "";
                newRow.className = `Box-row Box-row--focus-gray p-3 mt-1 js-navigation-item js-issue-row rgh-seen-4769791504 navigation-focus`;
                newRow.classList.add("branch-row");

                // Create a container for the avatars and emojis
                const avatarContainer = document.createElement("div");
                avatarContainer.style.display = "flex";
                avatarContainer.style.gap = "4px";

                reviews.forEach(review => {
                    // Create the avatar element
                    const avatar = document.createElement("img");
                    avatar.className = "avatar avatar-user v-align-text-bottom mr-1 rgh-small-user-avatars";
                    avatar.src = review.avatar;
                    avatar.width = 24;
                    avatar.height = 24;
                    avatar.loading = "lazy";
                    avatar.title = `${review.username}`; // Add tooltip with the username

                    // Determine the emoji based on the review status
                    let emoji = "";
                    if (review.approved) {
                        emoji = "✅"; // Checkmark for approved
                    } else if (review.denied) {
                        emoji = "❌"; // Cross for denied
                    } else if (review.pending) {
                        emoji = "⏳"; // Hourglass for pending
                    } else if (review.comment) {
                        emoji = "💬";
                    }

                    // Create a span to hold the avatar, emoji, and username
                    const reviewerElement = document.createElement("span");
                    reviewerElement.classList.add("reviewer");

                    // Create a span for the emoji and style it
                    const emojiSpan = document.createElement("span");
                    emojiSpan.classList.add("pr-review-emoji");
                    emojiSpan.textContent = emoji;

                    // Add the avatar and emoji to the reviewer element
                    reviewerElement.appendChild(avatar);
                    reviewerElement.appendChild(emojiSpan);

                    // Add the reviewer element to the container
                    avatarContainer.appendChild(reviewerElement);
                });

                newRow.appendChild(avatarContainer);

                // Append the avatar container to the pull request element
                element.appendChild(newRow);
            } catch (prError) {
                console.error("Error processing individual PR:", prError);
            }
        });
    } catch (error) {
        console.error("Error in enrichPullRequests:", error);
    }
}


function isPrPage() {
    return location.pathname.includes("pulls");
}

function main() {
  if (!isPrPage()) {
    return;
  }

  const container = findPrContainer(document);
  if (!container) {
    return;
  }

  console.debug("Found PR container!");

  enrichPullRequests();
}

console.info("Enhanced Pull Request Overview loading...");

const INTERVAL_DELAY_IN_MS = 2500;
setInterval(() => main(), INTERVAL_DELAY_IN_MS);

main();
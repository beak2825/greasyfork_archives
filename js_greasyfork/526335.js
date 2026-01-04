// ==UserScript==
// @name         LTT FP Exclusive videos on youtube
// @namespace    https://greasyfork.org/en/users/1388191-masapa
// @version      0.5
// @description  Shows LTT floatplane exclusive videos on youtube feed
// @author       Masapa
// @match        https://www.youtube.com/*
// @icon         https://raw.githubusercontent.com/2fasvg/2fasvg.github.io/master/assets/img/logo/floatplane.com/floatplane.com.svg
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/526335/LTT%20FP%20Exclusive%20videos%20on%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/526335/LTT%20FP%20Exclusive%20videos%20on%20youtube.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const FLOATPLANE_API =
    "https://www.floatplane.com/api/v3/content/creator?id=59f94c0bdd241b70349eb72b&channel=6413623f5b12cca228a28e78&limit=10&fetchAfter=0&search=&sort=DESC&hasVideo=false&hasAudio=false&hasPicture=false&hasText=false";

  function createVideoCard(post) {
    const card = document.createElement("div");
    card.className = "style-scope ytd-rich-grid-row";
    card.style.margin = "0 8px 0 8px";

    const container = document.createElement("div");
    container.style.width = "100%";

    // Thumbnail section
    const thumbnailContainer = document.createElement("div");
    thumbnailContainer.style.position = "relative";
    thumbnailContainer.style.aspectRatio = "16/9";
    thumbnailContainer.style.backgroundColor = "#f1f1f1";
    thumbnailContainer.style.borderRadius = "12px";
    thumbnailContainer.style.overflow = "hidden";

    const link = document.createElement("a");
    link.href = `https://www.floatplane.com/post/${post.id}`;
    link.target = "_blank";
    link.style.display = "block";
    link.style.width = "100%";
    link.style.height = "100%";

    const thumbnail = document.createElement("img");
    if (post.thumbnail && post.thumbnail.path) {
      thumbnail.src = post.thumbnail.path;
    } else {
      // Default thumbnail for text-only posts
      thumbnail.src = post.creator.icon.path;
    }
    thumbnail.style.width = "100%";
    thumbnail.style.height = "100%";
    thumbnail.style.objectFit = "cover";

    // Type indicator
    const typeIndicator = document.createElement("div");
    typeIndicator.style.position = "absolute";
    typeIndicator.style.bottom = "4px";
    typeIndicator.style.right = "4px";
    typeIndicator.style.background = "rgba(0, 0, 0, 0.8)";
    typeIndicator.style.color = "white";
    typeIndicator.style.padding = "3px 4px";
    typeIndicator.style.borderRadius = "4px";
    typeIndicator.style.fontSize = "12px";
    typeIndicator.style.fontWeight = "500";
    typeIndicator.style.lineHeight = "12px";

    if (post.metadata.hasVideo) {
      typeIndicator.textContent = formatDuration(post.metadata.videoDuration);
    } else if (post.metadata.hasPicture) {
      typeIndicator.textContent = "Image";
    } else {
      typeIndicator.textContent = "Post";
    }
    thumbnailContainer.appendChild(typeIndicator);

    // Info section
    const infoContainer = document.createElement("div");
    infoContainer.style.padding = "12px 0";
    infoContainer.style.display = "flex";
    infoContainer.style.gap = "12px";

    const creatorIcon = document.createElement("img");
    creatorIcon.src = post.creator.icon.childImages[1].path;
    creatorIcon.style.width = "36px";
    creatorIcon.style.height = "36px";
    creatorIcon.style.borderRadius = "50%";
    creatorIcon.style.marginTop = "2px";

    const textContainer = document.createElement("div");
    textContainer.style.flex = "1";
    textContainer.style.minWidth = "0";

    const titleLink = document.createElement("a");
    titleLink.href = `https://www.floatplane.com/post/${post.id}`;
    titleLink.style.color = "inherit";
    titleLink.style.textDecoration = "none";
    titleLink.target = "_blank";

    const titleDiv = document.createElement("div");
    titleDiv.style.fontWeight = "500";
    titleDiv.style.marginBottom = "4px";
    titleDiv.style.fontSize = "14px";
    titleDiv.style.lineHeight = "20px";
    titleDiv.style.color = "var(--yt-spec-text-primary)";
    titleDiv.style.display = "-webkit-box";
    titleDiv.style.webkitLineClamp = "2";
    titleDiv.style.webkitBoxOrient = "vertical";
    titleDiv.style.overflow = "hidden";
    titleDiv.style.textOverflow = "ellipsis";
    titleDiv.textContent = post.title;

    const metaContainer = document.createElement("div");
    metaContainer.style.color = "#606060";
    metaContainer.style.fontSize = "12px";
    metaContainer.style.lineHeight = "18px";

    const creatorName = document.createElement("div");
    creatorName.textContent = post.creator.title;
    creatorName.style.overflow = "hidden";
    creatorName.style.textOverflow = "ellipsis";
    creatorName.style.whiteSpace = "nowrap";

    const stats = document.createElement("div");
    stats.textContent = `${post.likes} likes • ${
      post.comments
    } comments • ${getTimeAgo(new Date(post.releaseDate))}`;
    stats.style.overflow = "hidden";
    stats.style.textOverflow = "ellipsis";
    stats.style.whiteSpace = "nowrap";

    // Assemble the elements
    link.appendChild(thumbnail);
    thumbnailContainer.appendChild(link);

    titleLink.appendChild(titleDiv);
    metaContainer.appendChild(creatorName);
    metaContainer.appendChild(stats);
    textContainer.appendChild(titleLink);
    textContainer.appendChild(metaContainer);
    infoContainer.appendChild(creatorIcon);
    infoContainer.appendChild(textContainer);

    container.appendChild(thumbnailContainer);
    container.appendChild(infoContainer);
    card.appendChild(container);

    return card;
  }

  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
      }
    }

    return "just now";
  }

  function createFloatplaneSection(videos) {
    const section = document.createElement("div");
    section.id = "floatplane-section";
    section.className = "style-scope ytd-rich-grid-renderer";
    section.style.marginBottom = "24px";

    const contentContainer = document.createElement("div");
    contentContainer.style.padding = "0 24px";

    // Create header container for logo and text
    const headerContainer = document.createElement("div");
    headerContainer.style.display = "flex";
    headerContainer.style.alignItems = "center";
    headerContainer.style.gap = "8px";
    headerContainer.style.margin = "0 0 16px 0";

    // Create logo
    const logo = document.createElement("img");
    logo.src =
      "https://raw.githubusercontent.com/2fasvg/2fasvg.github.io/master/assets/img/logo/floatplane.com/floatplane.com.svg";
    logo.style.height = "20px";
    logo.style.width = "auto";
    logo.style.filter = "var(--yt-spec-icon-active-other)"; // This will make the logo match YouTube's theme

    // Create heading
    const heading = document.createElement("h2");
    heading.style.color = "var(--yt-spec-text-primary)";
    heading.style.fontSize = "16px";
    heading.style.fontFamily = "Roboto, Arial, sans-serif";
    heading.style.lineHeight = "22px";
    heading.style.fontWeight = "400";
    heading.textContent = "Latest from FP Exclusives";

    // Assemble header
    headerContainer.appendChild(logo);
    headerContainer.appendChild(heading);

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(5, 1fr)";
    grid.style.gap = "16px";
    grid.style.maxWidth = "100%";
    grid.style.margin = "0 auto";

    videos.forEach((video) => {
      grid.appendChild(createVideoCard(video));
    });

    contentContainer.appendChild(headerContainer);
    contentContainer.appendChild(grid);
    section.appendChild(contentContainer);

    return section;
  }

  function insertFloatplaneSection() {
    if (document.getElementById("floatplane-section")) return false;

    const shortsSections = document.querySelectorAll(
      "ytd-rich-section-renderer"
    );
    const shortsSection = Array.from(shortsSections).find((section) => {
      return section.querySelector("#title")?.textContent?.includes("Shorts");
    });

    if (!shortsSection) return false;

    GM_xmlhttpRequest({
      method: "GET",
      url: FLOATPLANE_API,
      headers: {
        Accept: "application/json",
      },
      onload: function (response) {
        try {
          if (document.getElementById("floatplane-section")) return;

          const videos = JSON.parse(response.responseText);
          const section = createFloatplaneSection(videos);
          shortsSection.parentNode.insertBefore(section, shortsSection);
        } catch (error) {
          console.error("Error creating Floatplane section:", error);
        }
      },
    });

    return true; // Return true if we found the shorts section and attempted insertion
  }

  function initFloatplane() {
    let isProcessing = false;
    let retryCount = 0;
    const MAX_RETRIES = 5;

    const checkAndInsert = () => {
      if (isProcessing) return;
      isProcessing = true;

      try {
        // If we find and insert the section, reset retry count
        if (insertFloatplaneSection()) {
          retryCount = 0;
        } else if (retryCount < MAX_RETRIES) {
          // If not found and we haven't hit max retries, try again
          retryCount++;
          setTimeout(checkAndInsert, 1000);
        }
      } finally {
        isProcessing = false;
      }
    };

    // Function to handle navigation changes
    const handleNavigation = () => {
      retryCount = 0; // Reset retry count on navigation
      const existingSection = document.getElementById("floatplane-section");
      if (existingSection) {
        existingSection.remove();
      }
    };

    // Initial check
    checkAndInsert();

    // Watch for navigation and DOM changes
    const observer = new MutationObserver((mutations) => {
      if (document.getElementById("floatplane-section")) return;

      for (const mutation of mutations) {
        if (
          mutation.type === "childList" &&
          document.querySelector("ytd-rich-section-renderer")
        ) {
          checkAndInsert();
          break;
        }
      }
    });

    // Observe the main content area
    const contentArea =
      document.querySelector("ytd-rich-grid-renderer") || document.body;
    observer.observe(contentArea, {
      childList: true,
      subtree: true,
    });

    // Watch for URL changes
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        handleNavigation();
      }
    }).observe(document.querySelector("title"), {
      subtree: true,
      characterData: true,
    });

    // Watch for YouTube's navigation events
    window.addEventListener("yt-navigate-start", handleNavigation);
    window.addEventListener("yt-navigate-finish", handleNavigation);
    window.addEventListener("popstate", handleNavigation);
    window.addEventListener("load", handleNavigation);
  }

  // Initialize when the page loads
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFloatplane);
  } else {
    initFloatplane();
  }
})();

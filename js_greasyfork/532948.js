// ==UserScript==
// @name         YouTube Hotkeys
// @namespace    Violentmonkey Scripts
// @version      2.0
// @description  Navigate YouTube with leader key 'i' followed by other keys
// @author       dpi0
// @author       You
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        window.close
// @homepageURL https://github.com/dpi0/scripts/blob/main/greasyfork/youtube-hotkeys.js
// @supportURL  https://github.com/dpi0/scripts/issues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/532948/YouTube%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/532948/YouTube%20Hotkeys.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Configuration with default values
  const DEFAULT_LEADER_KEY = "i";
  const TIMEOUT = 2000; // Time window in ms to press the second key after leader key

  // Get leader key from GM storage, or use default if not set
  let LEADER_KEY = GM_getValue("leaderKey", DEFAULT_LEADER_KEY);

  // Setup Violentmonkey/Tampermonkey menu commands
  GM_registerMenuCommand("🔑 Change Leader Key", promptForLeaderKey);
  GM_registerMenuCommand("🗘 Reset Leader Key", resetLeaderKey);

  // Function to prompt user for new leader key
  function promptForLeaderKey() {
    const newKey = prompt("Enter a new leader key:", LEADER_KEY);
    if (newKey && newKey.length === 1) {
      LEADER_KEY = newKey.toLowerCase();
      GM_setValue("leaderKey", LEADER_KEY);
      showNotification(`Leader key changed to '${LEADER_KEY}'`);
    } else if (newKey) {
      alert("Leader key must be a single character.");
    }
  }

  // Function to reset leader key to default
  function resetLeaderKey() {
    LEADER_KEY = DEFAULT_LEADER_KEY;
    GM_setValue("leaderKey", LEADER_KEY);
    showNotification(`Leader key reset to '${LEADER_KEY}'`);
  }

  // Navigation and action functions
  function navigateToHome() {
    window.location.href = "https://www.youtube.com/";
  }

  function navigateToSubscriptions() {
    window.location.href = "https://www.youtube.com/feed/subscriptions";
  }

  function navigateToHistory() {
    window.location.href = "https://www.youtube.com/feed/history";
  }

  function navigateToWatchLater() {
    window.location.href = "https://www.youtube.com/playlist?list=WL";
  }

  function navigateToLikedVideos() {
    window.location.href = "https://www.youtube.com/playlist?list=LL";
  }

  function navigateToTrending() {
    window.location.href = "https://www.youtube.com/feed/trending";
  }

  function navigateToLibrary() {
    window.location.href = "https://www.youtube.com/feed/library";
  }

  function navigateToChannelVideos() {
    // Fixed function to work on both channel pages and video pages
    if (window.location.pathname.includes("/watch")) {
      // If on a video page, find the channel link
      const channelLink =
        document.querySelector("#top-row ytd-video-owner-renderer a") ||
        document.querySelector("ytd-channel-name a") ||
        document.querySelector("a.ytd-channel-name");

      if (channelLink) {
        // Get the channel URL and append /videos
        let channelUrl = channelLink.href;
        if (!channelUrl.endsWith("/videos")) {
          channelUrl = channelUrl.split("?")[0]; // Remove any query parameters
          channelUrl = channelUrl.endsWith("/")
            ? channelUrl + "videos"
            : channelUrl + "/videos";
        }
        window.location.href = channelUrl;
      } else {
        showNotification("Channel link not found on this video page!");
      }
    } else if (
      window.location.pathname.includes("/channel/") ||
      window.location.pathname.includes("/c/") ||
      window.location.pathname.includes("/user/") ||
      window.location.pathname.includes("/@")
    ) {
      // If already on a channel page, navigate to videos section
      // Extract the channel name/ID from the URL
      const channelPath = window.location.pathname.split("/")[1]; // Get the @CHANNEL_NAME part
      window.location.href = `https://www.youtube.com/${channelPath}/videos`;
    } else {
      showNotification("Not on a video or channel page!");
    }
  }

  function navigateToChannelPlaylists() {
    // Fixed function to work on both channel pages and video pages
    if (window.location.pathname.includes("/watch")) {
      // If on a video page, find the channel link
      const channelLink =
        document.querySelector("#top-row ytd-video-owner-renderer a") ||
        document.querySelector("ytd-channel-name a") ||
        document.querySelector("a.ytd-channel-name");

      if (channelLink) {
        // Get the channel URL and append /playlists
        let channelUrl = channelLink.href;
        if (!channelUrl.endsWith("/playlists")) {
          channelUrl = channelUrl.split("?")[0]; // Remove any query parameters
          channelUrl = channelUrl.endsWith("/")
            ? channelUrl + "playlists"
            : channelUrl + "/playlists";
        }
        window.location.href = channelUrl;
      } else {
        showNotification("Channel link not found on this video page!");
      }
    } else if (
      window.location.pathname.includes("/channel/") ||
      window.location.pathname.includes("/c/") ||
      window.location.pathname.includes("/user/") ||
      window.location.pathname.includes("/@")
    ) {
      // If already on a channel page, navigate to playlists section
      // Extract the channel name/ID from the URL
      const channelPath = window.location.pathname.split("/")[1]; // Get the @CHANNEL_NAME part
      window.location.href = `https://www.youtube.com/${channelPath}/playlists`;
    } else {
      showNotification("Not on a video or channel page!");
    }
  }

  function triggerSaveButton() {
    // Only works on watch pages
    if (!window.location.pathname.includes("/watch")) {
      showNotification("This only works on video pages!");
      return;
    }

    // Try to find the Save button using various selectors
    const saveButton =
      document.querySelector('button[aria-label="Save to playlist"]') ||
      document.querySelector('ytd-button-renderer[id="save-button"]') ||
      document.querySelector('ytd-menu-renderer button[aria-label="Save"]') ||
      document.querySelector('button.ytd-menu-renderer[aria-label="Save"]') ||
      document.querySelector('button[aria-label="Save"]');

    if (saveButton) {
      saveButton.click();
      showNotification("Save to playlist popup triggered");
    } else {
      showNotification("Save button not found!");
    }
  }

  function navigateToNextVideo() {
    // Only works on watch pages
    if (!window.location.pathname.includes("/watch")) {
      showNotification("This only works on video pages!");
      return;
    }

    // Try to find the "Next" button and click it
    const nextButton = findNextButton();
    if (nextButton) {
      nextButton.click();
      // No need for notification as the page will navigate
    } else {
      showNotification("Next video button not found!");
    }
  }

  function navigateToPreviousVideo() {
    // Only works on watch pages
    if (!window.location.pathname.includes("/watch")) {
      showNotification("This only works on video pages!");
      return;
    }

    // YouTube doesn't have a standard "Previous video" button
    // This is just a placeholder, as YouTube doesn't have a native "previous video" button
    showNotification("Previous video navigation not supported by YouTube");
  }

  function toggleSidebar() {
    // Find and click the guide button (hamburger menu)
    const guideButton =
      document.querySelector("#guide-button") ||
      document.querySelector('button[aria-label="Guide"]') ||
      document.querySelector('button[aria-label="Menu"]');

    if (guideButton) {
      guideButton.click();
      showNotification("Toggled sidebar");
    } else {
      showNotification("Sidebar toggle button not found!");
    }
  }

  function copyVideoUrlWithTimestamp() {
    // Only works on watch pages
    if (!window.location.pathname.includes("/watch")) {
      showNotification("This only works on video pages!");
      return;
    }

    // Get current video time
    const video = document.querySelector("video");
    if (!video) {
      showNotification("Video element not found!");
      return;
    }

    const currentTime = Math.floor(video.currentTime);
    const currentUrl = window.location.href.split("&t=")[0]; // Remove any existing timestamp
    const urlWithTimestamp = `${currentUrl}&t=${currentTime}s`;

    // Copy to clipboard
    try {
      navigator.clipboard
        .writeText(urlWithTimestamp)
        .then(() => {
          showNotification("Video URL with timestamp copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          showNotification("Failed to copy URL");
        });
    } catch (e) {
      // Fallback for browsers that don't support clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = urlWithTimestamp;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showNotification("Video URL with timestamp copied to clipboard!");
    }
  }

  // Helper function to find the Next button
  function findNextButton() {
    // YouTube's UI changes frequently, so we need multiple selectors
    const selectors = [
      ".ytp-next-button", // Old UI next button
      "a.ytp-next-button", // Another variation
      ".ytd-watch-next-secondary-results-renderer button", // Newer UI
      'button[aria-label="Next"]', // Generic aria-label approach
      'ytd-button-renderer button[aria-label="Next"]', // More specific
      // Add more selectors as YouTube's UI changes
    ];

    for (const selector of selectors) {
      const button = document.querySelector(selector);
      if (button) return button;
    }

    return null;
  }

  function copyShortenedUrl() {
    if (!window.location.pathname.includes("/watch")) {
      showNotification("This only works on video pages!");
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("v");
    if (!videoId) {
      showNotification("Video ID not found!");
      return;
    }

    const shortUrl = `https://youtu.be/${videoId}`;
    try {
      navigator.clipboard
        .writeText(shortUrl)
        .then(() => {
          showNotification("Shortened URL copied to clipboard!");
        })
        .catch((err) => {
          console.error("Clipboard write failed:", err);
          fallbackCopyToClipboard(shortUrl);
        });
    } catch (e) {
      fallbackCopyToClipboard(shortUrl);
    }

    function fallbackCopyToClipboard(text) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showNotification("Shortened URL copied to clipboard!");
    }
  }

  function navigateToCommunityTab() {
    const base = window.location.origin;
    let channelPath = null;

    if (window.location.pathname.includes("/watch")) {
      const channelLink =
        document.querySelector("#top-row ytd-video-owner-renderer a") ||
        document.querySelector("ytd-channel-name a") ||
        document.querySelector("a.ytd-channel-name");

      if (channelLink) {
        const url = new URL(channelLink.href);
        channelPath = url.pathname;
      }
    } else {
      const match = window.location.pathname.match(
        /^\/(channel|c|user|@[^\/]+)(\/.*)?$/,
      );
      if (match) {
        channelPath = `/${match[1]}`;
      }
    }

    if (channelPath) {
      window.location.href = `${base}${channelPath}/community`;
    } else {
      showNotification("Unable to resolve channel path for community tab.");
    }
  }

  function showHelpModal() {
    // Remove existing modal if present
    const existing = document.getElementById("yt-hotkey-help-modal");
    if (existing) existing.remove();

    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "yt-hotkey-help-modal";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    overlay.style.zIndex = "10000";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";

    // Modal content
    const modal = document.createElement("div");
    modal.style.backgroundColor = "#fff";
    modal.style.borderRadius = "8px";
    modal.style.padding = "20px 30px";
    modal.style.maxWidth = "600px";
    modal.style.maxHeight = "80vh";
    modal.style.overflowY = "auto";
    modal.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    modal.style.fontFamily = "Arial, sans-serif";

    const title = document.createElement("h2");
    title.textContent = "YouTube Leader Key Hotkeys";
    title.style.marginTop = "0";

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    const rows = Object.entries(HOTKEYS).map(([key, fn]) => {
      const row = document.createElement("tr");

      const keyCell = document.createElement("td");
      keyCell.textContent = `i + ${key}`;
      keyCell.style.fontWeight = "bold";
      keyCell.style.padding = "4px 8px";
      keyCell.style.borderBottom = "1px solid #ddd";
      keyCell.style.whiteSpace = "nowrap";

      const descCell = document.createElement("td");
      descCell.textContent = fn.name
        .replace(/navigateTo|copy|toggle|trigger|show/i, "")
        .replace(/([A-Z])/g, " $1")
        .trim();
      descCell.style.padding = "4px 8px";
      descCell.style.borderBottom = "1px solid #ddd";
      descCell.style.textTransform = "capitalize";

      row.appendChild(keyCell);
      row.appendChild(descCell);
      return row;
    });

    rows.forEach((row) => table.appendChild(row));

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.style.marginTop = "16px";
    closeBtn.style.padding = "8px 16px";
    closeBtn.style.border = "none";
    closeBtn.style.background = "#cc0000";
    closeBtn.style.color = "white";
    closeBtn.style.borderRadius = "4px";
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = () => overlay.remove();

    modal.appendChild(title);
    modal.appendChild(table);
    modal.appendChild(closeBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  // Shows a brief notification to the user
  function showNotification(message, duration = 2000) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.left = "50%";
    notification.style.transform = "translateX(-50%)";
    notification.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    notification.style.color = "white";
    notification.style.padding = "10px 20px";
    notification.style.borderRadius = "4px";
    notification.style.zIndex = "9999";
    notification.style.fontFamily = "Arial, sans-serif";
    notification.style.textAlign = "center";
    notification.style.maxWidth = "80%";

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transition = "opacity 0.5s ease";
      setTimeout(() => document.body.removeChild(notification), 500);
    }, duration);
  }

  // Hotkey mappings with functions - Updated per user preference
  const HOTKEYS = {
    h: navigateToHome, // i -> h for home
    s: navigateToSubscriptions, // i -> s for subscriptions
    e: navigateToHistory, // i -> e for history
    w: navigateToWatchLater, // i -> w for watch later
    l: navigateToLikedVideos, // i -> l for liked videos
    t: navigateToTrending, // i -> t for trending
    L: navigateToLibrary, // i -> L (capital) for library
    y: copyVideoUrlWithTimestamp, // i -> y for copy URL with timestamp
    v: navigateToChannelVideos, // i -> a for channel videos
    q: navigateToChannelPlaylists, // i -> q for channel playlists
    n: navigateToNextVideo, // i -> n for next video
    p: navigateToPreviousVideo, // i -> p for previous video
    Tab: toggleSidebar, // i -> Tab for toggle sidebar
    S: triggerSaveButton, // i -> s (capital) for Save to playlist popup
    Y: copyShortenedUrl, // i -> Y (capital) for shortened URL
    C: navigateToCommunityTab, // i -> C (capital) for community tab
    "?": showHelpModal,
  };

  // State variables
  let leaderPressed = false;
  let leaderTimer = null;

  // Function to handle keydown events
  function handleKeyDown(event) {
    // Check if user is typing in an input field
    if (isInputField(event.target)) {
      return;
    }

    // Get the key that was pressed (preserve case)
    const key = event.key;

    // If leader key is pressed
    if (key.toLowerCase() === LEADER_KEY) {
      // Prevent default action (like mini player)
      event.preventDefault();
      event.stopPropagation();

      // Set the leader state
      leaderPressed = true;

      // Clear any existing timer
      if (leaderTimer) {
        clearTimeout(leaderTimer);
      }

      // Set a timeout to reset the leader state
      leaderTimer = setTimeout(() => {
        leaderPressed = false;
      }, TIMEOUT);

      return;
    }

    // If a key is pressed after the leader key
    if (leaderPressed && HOTKEYS[key]) {
      // Prevent default action
      event.preventDefault();
      event.stopPropagation();

      // Execute the function associated with the key
      HOTKEYS[key]();

      // Reset leader state
      leaderPressed = false;
      clearTimeout(leaderTimer);
    }
  }

  // Helper function to check if the active element is an input field
  function isInputField(element) {
    const tagName = element.tagName.toLowerCase();
    const type = element.type ? element.type.toLowerCase() : "";

    return (
      (tagName === "input" &&
        (type === "text" ||
          type === "password" ||
          type === "email" ||
          type === "number" ||
          type === "search" ||
          type === "tel" ||
          type === "url")) ||
      tagName === "textarea" ||
      element.isContentEditable
    );
  }

  // Add event listener for keydown
  document.addEventListener("keydown", handleKeyDown, true);

  // Show initial notification about the leader key on first load
  const firstRun = GM_getValue("firstRun", true);
  if (firstRun) {
    setTimeout(() => {
      showNotification(
        `YouTube Leader Key Navigation activated! Leader key is '${LEADER_KEY}'`,
        5000,
      );
      GM_setValue("firstRun", false);
    }, 2000);
  }

  // Logging for debugging
  console.log(
    `YouTube Leader Key Navigation loaded with leader key '${LEADER_KEY}'`,
  );
})();

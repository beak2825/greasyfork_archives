// ==UserScript==
// @name         Bluesky Keyboard Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add Twitter/Mastodon-style keyboard shortcuts to Bluesky
// @author       You
// @match        https://bsky.app/*
// @match        https://deer.social/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/537483/Bluesky%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/537483/Bluesky%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Add CSS styles
  const css = `
    .shortcuts-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .shortcuts-content {
      background: white;
      border-radius: 16px;
      padding: 24px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    [data-colormode="dark"] .shortcuts-content {
      background: #16181c;
      color: #e7e9ea;
    }

    .shortcuts-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #eff3f4;
    }

    [data-colormode="dark"] .shortcuts-header {
      border-bottom-color: #2f3336;
    }

    .shortcuts-title {
      font-size: 20px;
      font-weight: 700;
      margin: 0;
    }

    .shortcuts-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      color: #536471;
      transition: background-color 0.2s;
    }

    .shortcuts-close:hover {
      background: rgba(15, 20, 25, 0.1);
    }

    [data-colormode="dark"] .shortcuts-close:hover {
      background: rgba(231, 233, 234, 0.1);
    }

    .shortcuts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    @media (max-width: 640px) {
      .shortcuts-grid {
        grid-template-columns: 1fr;
      }
    }

    .shortcuts-section {
      margin-bottom: 24px;
    }

    .shortcuts-section h3 {
      font-size: 16px;
      font-weight: 700;
      margin: 0 0 12px 0;
      color: #0f1419;
    }

    [data-colormode="dark"] .shortcuts-section h3 {
      color: #e7e9ea;
    }

    .shortcut-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }

    .shortcut-description {
      font-size: 15px;
      color: #536471;
    }

    .shortcut-keys {
      display: flex;
      gap: 4px;
    }

    .shortcut-key {
      background: #f7f9fa;
      border: 1px solid #cfd9de;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 12px;
      font-weight: 600;
      font-family: monospace;
      color: #0f1419;
    }

    [data-colormode="dark"] .shortcut-key {
      background: #202327;
      border-color: #2f3336;
      color: #e7e9ea;
    }

    .shortcuts-footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #eff3f4;
      text-align: center;
      font-size: 14px;
      color: #536471;
    }

    [data-colormode="dark"] .shortcuts-footer {
      border-top-color: #2f3336;
    }

    .shortcuts-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1d9bf0;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10001;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    }

    .shortcuts-notification.show {
      opacity: 1;
      transform: translateY(0);
    }

    .shortcuts-notification.error {
      background: #f91880;
    }

    [data-colormode="dark"] .shortcuts-notification {
      background: #1d9bf0;
    }

    [data-colormode="dark"] .shortcuts-notification.error {
      background: #f91880;
    }
  `;

  // Inject CSS
  const styleSheet = document.createElement("style");
  styleSheet.textContent = css;
  document.head.appendChild(styleSheet);

  class BlueskyKeyboardShortcuts {
    constructor() {
      this.gPressed = false;
      this.gTimeout = null;
      this.failureCount = {};
      this.currentFeedIndex = 0;
      this.shortcuts = {
        navigation: {
          "g+h": { action: "home", description: "Go to Home" },
          "g+e": { action: "explore", description: "Go to Explore" },
          "g+n": { action: "notifications", description: "Go to Notifications" },
          "g+c": { action: "chat", description: "Go to Chat" },
          "g+f": { action: "feeds", description: "Go to Feeds" },
          "g+l": { action: "lists", description: "Go to Lists" },
          "g+p": { action: "profile", description: "Go to Profile" },
          "g+s": { action: "settings", description: "Go to Settings" },
        },
        feeds: {
          "alt+↓": { action: "nextFeed", description: "Next feed" },
          "alt+↑": { action: "prevFeed", description: "Previous feed" },
        },
        general: {
          "/": { action: "search", description: "Focus search" },
          "shift+?": {
            action: "help",
            description: "Show keyboard shortcuts",
          },
          "escape": { action: "closeModal", description: "Close modal" },
        },
      };

      // Add numbered feed shortcuts
      for (let i = 1; i <= 9; i++) {
        this.shortcuts.feeds[i.toString()] = {
          action: "feed",
          feedIndex: i - 1,
          description: `Go to feed ${i}`,
        };
      }

      this.init();
    }

    init() {
      this.bindEvents();
      this.createHelpModal();
      console.log("Bluesky Keyboard Shortcuts loaded! Press Shift+? for help");
    }

    bindEvents() {
      document.addEventListener("keydown", (e) => this.handleKeyDown(e), true);
      document.addEventListener("keyup", (e) => this.handleKeyUp(e));
    }

    isTyping() {
      const activeElement = document.activeElement;
      if (!activeElement) return false;

      return (
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.contentEditable === "true" ||
        activeElement.closest('[contenteditable="true"]') ||
        activeElement.closest('[data-testid="textInput"]') ||
        activeElement.closest('[data-testid="composer"]') ||
        activeElement.closest('[aria-multiline="true"]') ||
        activeElement.closest('textarea') ||
        activeElement.closest('input[type="text"]') ||
        activeElement.closest('input[type="search"]')
      );
    }

    showNotification(message, isError = false) {
      const notification = document.createElement("div");
      notification.className = `shortcuts-notification ${isError ? 'error' : ''}`;
      notification.textContent = message;
      document.body.appendChild(notification);

      // Trigger animation
      setTimeout(() => notification.classList.add("show"), 10);

      // Remove after 2 seconds
      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 300);
      }, 2000);
    }

    trackFailure(action) {
      this.failureCount[action] = (this.failureCount[action] || 0) + 1;
      if (this.failureCount[action] >= 10) {
        this.showNotification(`${action} shortcut appears to be broken`, true);
        this.failureCount[action] = 0; // Reset counter
      }
    }

    handleKeyDown(e) {
      // Always allow escape to close modals
      if (e.key === "Escape") {
        e.preventDefault();
        this.closeHelp();
        return;
      }

      // Handle Shift + ? for help (works even when typing)
      if (e.shiftKey && e.key === "?") {
        e.preventDefault();
        this.showHelp();
        return;
      }

      // Handle / for search (only when not typing)
      if (e.key === "/" && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey && !this.isTyping()) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.focusSearch();
        return;
      }

      // Skip other shortcuts if typing
      if (this.isTyping()) {
        return;
      }

      // Handle Alt + Arrow keys for feed navigation
      if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.key === "ArrowDown") {
          this.navigateToNextFeed();
        } else {
          this.navigateToPrevFeed();
        }
        return;
      }

      // Handle G key sequences
      if (e.key.toLowerCase() === "g" && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        this.gPressed = true;
        
        // Clear any existing timeout
        if (this.gTimeout) {
          clearTimeout(this.gTimeout);
        }
        
        // Reset after 1 second
        this.gTimeout = setTimeout(() => {
          this.gPressed = false;
          this.gTimeout = null;
        }, 1000);
        return;
      }

      // Handle G + letter combinations
      if (this.gPressed && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const combination = `g+${e.key.toLowerCase()}`;
        if (this.shortcuts.navigation[combination]) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          this.executeAction(this.shortcuts.navigation[combination]);
          this.gPressed = false;
          if (this.gTimeout) {
            clearTimeout(this.gTimeout);
            this.gTimeout = null;
          }
          return;
        }
      }

      // Handle number keys for feeds (only when not typing)
      if (/^[1-9]$/.test(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey && !this.gPressed) {
        const shortcut = this.shortcuts.feeds[e.key];
        if (shortcut) {
          e.preventDefault();
          this.executeAction(shortcut);
          return;
        }
      }
    }

    handleKeyUp(e) {
      // Additional key up handling if needed
    }

    executeAction(shortcut) {
      switch (shortcut.action) {
        case "home":
          this.navigateTo("/", "home");
          break;
        case "explore":
          this.navigateTo("/search", "explore");
          break;
        case "notifications":
          this.navigateTo("/notifications", "notifications");
          break;
        case "chat":
          this.navigateTo("/messages", "chat");
          break;
        case "feeds":
          this.navigateTo("/feeds", "feeds");
          break;
        case "lists":
          this.navigateTo("/lists", "lists");
          break;
        case "profile":
          this.navigateToProfile();
          break;
        case "settings":
          this.navigateTo("/settings", "settings");
          break;
        case "feed":
          this.navigateToFeed(shortcut.feedIndex);
          break;
        case "nextFeed":
          this.navigateToNextFeed();
          break;
        case "prevFeed":
          this.navigateToPrevFeed();
          break;
        case "search":
          this.focusSearch();
          break;
        case "help":
          this.showHelp();
          break;
        case "closeModal":
          this.closeHelp();
          break;
      }
    }

    focusSearch() {
      try {
        // Look for search input in various locations
        const searchSelectors = [
          'input[placeholder*="Search" i]',
          'input[aria-label*="Search" i]',
          'input[type="search"]',
          '[data-testid="searchInput"]',
          '[data-testid="searchTextInput"]',
          'input[name*="search" i]',
          'input[id*="search" i]',
          // Look in header/navigation areas
          'header input[type="text"]',
          'nav input[type="text"]',
          // Generic text inputs that might be search
          'input[type="text"]:not([data-testid*="composer"]):not([aria-label*="post" i])',
        ];

        for (const selector of searchSelectors) {
          const searchInput = document.querySelector(selector);
          if (searchInput && searchInput.offsetParent !== null) { // Check if visible
            searchInput.focus();
            searchInput.select();
            return;
          }
        }

        // If no search input found, try to navigate to search page first
        this.navigateTo("/search", "search");
        
        // Then try to focus search input after a brief delay
        setTimeout(() => {
          for (const selector of searchSelectors) {
            const searchInput = document.querySelector(selector);
            if (searchInput && searchInput.offsetParent !== null) {
              searchInput.focus();
              searchInput.select();
              return;
            }
          }
        }, 200);

      } catch (error) {
        console.log("Search focus error:", error);
        this.trackFailure("search");
      }
    }

    navigateTo(path, action) {
      try {
        // Look for navigation links in the sidebar
        const navSelectors = [
          `nav a[href="${path}"]`,
          `a[href="${path}"]`,
          `a[href$="${path}"]`,
          `[data-testid="homeTab"] a`,
          `[data-testid="searchTab"] a`, 
          `[data-testid="notificationsTab"] a`,
          `[data-testid="messagesTab"] a`,
          `[data-testid="feedsTab"] a`,
          `[data-testid="listsTab"] a`,
          `[data-testid="settingsTab"] a`,
        ];

        for (const selector of navSelectors) {
          const link = document.querySelector(selector);
          if (link && (link.href.endsWith(path) || link.href.includes(path))) {
            link.click();
            return;
          }
        }

        // Fallback: use history API for SPA navigation
        if (window.history && window.history.pushState) {
          const newUrl = window.location.origin + path;
          window.history.pushState({}, "", newUrl);
          window.dispatchEvent(new PopStateEvent("popstate"));
          return;
        }

        // If we get here, navigation failed
        this.trackFailure(action);
      } catch (error) {
        console.log("Navigation error:", error);
        this.trackFailure(action);
      }
    }

    navigateToProfile() {
      try {
        // Look for the user's own profile link in the sidebar
        const profileSelectors = [
          'nav a[href*="/profile/"][aria-label*="Profile"]',
          'nav a[href*="/profile/"] img[alt*="avatar"]',
          '[data-testid="profileTab"] a',
          'nav a[href*="/profile/"]:not([href*="/profile/undefined"])',
        ];

        // Try to find the user's own profile by looking at the current user context
        const userMenuButton = document.querySelector('[data-testid="userMenu"], [aria-label*="Account menu"], button[aria-haspopup="menu"]');
        if (userMenuButton) {
          const userHandle = this.getCurrentUserHandle();
          if (userHandle) {
            const userProfileLink = document.querySelector(`a[href="/profile/${userHandle}"], a[href$="/profile/${userHandle}"]`);
            if (userProfileLink) {
              userProfileLink.click();
              return;
            }
          }
        }

        // Try the profile selectors
        for (const selector of profileSelectors) {
          const profileLink = document.querySelector(selector);
          if (profileLink) {
            profileLink.click();
            return;
          }
        }

        // Fallback: construct profile URL from user handle
        const userHandle = this.getCurrentUserHandle();
        if (userHandle) {
          this.navigateTo(`/profile/${userHandle}`, "profile");
          return;
        }

        this.trackFailure("profile");
      } catch (error) {
        console.log("Profile navigation error:", error);
        this.trackFailure("profile");
      }
    }

    getFeedLinks() {
      // Look for feeds in the right sidebar or main feed area
      const feedSelectors = [
        // Right sidebar feed links
        'aside a[href*="/feed/"]',
        '[data-testid="rightColumn"] a[href*="/feed/"]',
        // Feed tabs or buttons in the main area
        '[role="tablist"] a[href*="/feed/"]',
        '[role="tablist"] button[data-testid*="feed"]',
        // My Feeds or pinned feeds section
        '[data-testid="myFeeds"] a',
        '[data-testid="savedFeeds"] a',
        '[data-testid="pinnedFeeds"] a',
        // General feed links in sidebars
        'nav a[href*="/feed/"]',
        // Feed selector dropdown or menu
        '[data-testid="feedSelector"] a',
        '[aria-label*="feed" i] a[href*="/feed/"]',
        // Look for "Following", "Discover", etc. tabs
        '[role="tab"][href*="/feed/"]',
        'button[role="tab"][data-testid*="feed"]',
      ];

      let feedLinks = [];
      
      for (const selector of feedSelectors) {
        const links = document.querySelectorAll(selector);
        if (links.length > 0) {
          const validLinks = Array.from(links).filter(link => {
            const href = link.href || link.getAttribute('data-href') || '';
            return href.includes('/feed/') && 
                   !href.includes('undefined') &&
                   href !== window.location.href;
          });
          if (validLinks.length > 0) {
            feedLinks = validLinks;
            break;
          }
        }
      }

      // If no feed links found, look for tab-like elements or buttons
      if (feedLinks.length === 0) {
        const tabSelectors = [
          '[role="tablist"] [role="tab"]',
          '[role="tablist"] button',
          '[data-testid*="tab"]',
          'nav button[data-testid*="feed"]',
        ];

        for (const selector of tabSelectors) {
          const tabs = document.querySelectorAll(selector);
          if (tabs.length > 0) {
            feedLinks = Array.from(tabs);
            break;
          }
        }
      }

      return feedLinks;
    }

    navigateToFeed(index) {
      try {
        const feedLinks = this.getFeedLinks();
        
        if (feedLinks[index]) {
          feedLinks[index].click();
          this.currentFeedIndex = index;
        } else {
          this.navigateTo("/feeds", `feed-${index + 1}`);
        }
      } catch (error) {
        console.log("Feed navigation error:", error);
        this.trackFailure(`feed-${index + 1}`);
      }
    }

    navigateToNextFeed() {
      try {
        const feedLinks = this.getFeedLinks();
        if (feedLinks.length === 0) {
          this.trackFailure("nextFeed");
          return;
        }

        this.currentFeedIndex = (this.currentFeedIndex + 1) % feedLinks.length;
        feedLinks[this.currentFeedIndex].click();
      } catch (error) {
        console.log("Next feed navigation error:", error);
        this.trackFailure("nextFeed");
      }
    }

    navigateToPrevFeed() {
      try {
        const feedLinks = this.getFeedLinks();
        if (feedLinks.length === 0) {
          this.trackFailure("prevFeed");
          return;
        }

        this.currentFeedIndex = this.currentFeedIndex <= 0 ? feedLinks.length - 1 : this.currentFeedIndex - 1;
        feedLinks[this.currentFeedIndex].click();
      } catch (error) {
        console.log("Previous feed navigation error:", error);
        this.trackFailure("prevFeed");
      }
    }

    getCurrentUserHandle() {
      try {
        const handleSelectors = [
          '[data-testid="userMenu"] [data-testid="handle"]',
          '[aria-label*="Account menu"] + * [data-testid="handle"]',
          'nav [data-testid="handle"]',
          '[data-testid="profileTab"] a',
        ];

        for (const selector of handleSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            if (element.href && element.href.includes('/profile/')) {
              const match = element.href.match(/\/profile\/(.+?)(?:\?|$)/);
              if (match) return match[1];
            }
            const text = element.textContent;
            if (text && text.startsWith('@')) {
              return text.substring(1);
            }
          }
        }

        if (window.location.pathname.includes('/profile/')) {
          const match = window.location.pathname.match(/\/profile\/(.+?)(?:\/|$)/);
          if (match) return match[1];
        }

        return null;
      } catch (error) {
        console.log("Error getting user handle:", error);
        return null;
      }
    }

    createHelpModal() {
      const modal = document.createElement("div");
      modal.className = "shortcuts-modal";
      modal.style.display = "none";
      modal.id = "keyboard-shortcuts-modal";

      modal.innerHTML = `
        <div class="shortcuts-content">
          <div class="shortcuts-header">
            <h2 class="shortcuts-title">Keyboard shortcuts</h2>
            <button class="shortcuts-close" aria-label="Close">&times;</button>
          </div>
          
          <div class="shortcuts-grid">
            <div class="shortcuts-section">
              <h3>Navigation</h3>
              ${Object.entries(this.shortcuts.navigation)
                .map(
                  ([key, shortcut]) => `
                <div class="shortcut-item">
                  <span class="shortcut-description">${shortcut.description}</span>
                  <div class="shortcut-keys">
                    ${this.formatShortcutKey(key)}
                  </div>
                </div>
              `
                )
                .join("")}
              <div class="shortcut-item">
                <span class="shortcut-description">Focus search</span>
                <div class="shortcut-keys">
                  <span class="shortcut-key">/</span>
                </div>
              </div>
            </div>
            
            <div class="shortcuts-section">
              <h3>Feeds</h3>
              <div class="shortcut-item">
                <span class="shortcut-description">Next feed</span>
                <div class="shortcut-keys">
                  <span class="shortcut-key">Alt</span>
                  <span class="shortcut-key">↓</span>
                </div>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-description">Previous feed</span>
                <div class="shortcut-keys">
                  <span class="shortcut-key">Alt</span>
                  <span class="shortcut-key">↑</span>
                </div>
              </div>
              ${Object.entries(this.shortcuts.feeds)
                .filter(([key]) => /^[1-9]$/.test(key))
                .slice(0, 5)
                .map(
                  ([key, shortcut]) => `
                <div class="shortcut-item">
                  <span class="shortcut-description">${shortcut.description}</span>
                  <div class="shortcut-keys">
                    <span class="shortcut-key">${key}</span>
                  </div>
                </div>
              `
                )
                .join("")}
              ${
                Object.keys(this.shortcuts.feeds).filter(k => /^[1-9]$/.test(k)).length > 5
                  ? `<div class="shortcut-item">
                      <span class="shortcut-description">And more...</span>
                      <div class="shortcut-keys">
                        <span class="shortcut-key">6-9</span>
                      </div>
                    </div>`
                  : ""
              }
            </div>
          </div>
          
          <div class="shortcuts-footer">
            Press <strong>Shift + ?</strong> to toggle this help
          </div>
        </div>
      `;

      // Add click handlers
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeHelp();
        }
      });

      modal
        .querySelector(".shortcuts-close")
        .addEventListener("click", () => this.closeHelp());

      document.body.appendChild(modal);
    }

    formatShortcutKey(key) {
      if (key === "shift+?") {
        return `
          <span class="shortcut-key">Shift</span>
          <span class="shortcut-key">?</span>
        `;
      }
      if (key.includes("+")) {
        return key
          .split("+")
          .map((k) => `<span class="shortcut-key">${k.toUpperCase()}</span>`)
          .join("");
      }
      return `<span class="shortcut-key">${key.toUpperCase()}</span>`;
    }

    showHelp() {
      const modal = document.getElementById("keyboard-shortcuts-modal");
      if (modal) {
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
      }
    }

    closeHelp() {
      const modal = document.getElementById("keyboard-shortcuts-modal");
      if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "";
      }
    }
  }

  // Initialize when DOM is ready
  function initShortcuts() {
    if (document.querySelector('#keyboard-shortcuts-modal')) {
      return; // Already initialized
    }
    new BlueskyKeyboardShortcuts();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initShortcuts);
  } else {
    initShortcuts();
  }

  // Handle SPA navigation - reinitialize if needed
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(() => {
        if (!document.querySelector('#keyboard-shortcuts-modal')) {
          initShortcuts();
        }
      }, 100);
    }
  }).observe(document, { subtree: true, childList: true });

})();

// ==UserScript==
// @name         e621 Enhanced Navigation & Shortcuts
// @namespace    https://github.com/Webscratcher/UserScripts
// @version      1.3.7
// @license      GPL3
// @description  Enhances e621 with keyboard shortcuts for voting, favoriting, and navigation. Features auto-skip for blacklisted content, improved pool navigation, and smart behavior that disables shortcuts when typing or using video player.
// @author       Webscratcher
// @match        https://e621.net/posts*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e621.net
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/535582/e621%20Enhanced%20Navigation%20%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/535582/e621%20Enhanced%20Navigation%20%20Shortcuts.meta.js
// ==/UserScript==

// Configuration
const CONFIG = {
  shortcuts: {
    UPVOTE: { key: "KeyU", requiresShift: false },
    DOWNVOTE: { key: "KeyU", requiresShift: true },
    LIKE_AND_FAVORITE: { key: "KeyL", requiresShift: false },
    FAVORITE_AND_CONTINUE: { key: "KeyL", requiresShift: true },
    TOGGLE_FAVORITES: { key: "KeyI", requiresShift: false },
    TOGGLE_BLACKLIST: { key: "KeyB", requiresShift: false },
    NEXT_POST: { key: "ArrowRight", requiresShift: false },
    PREV_POST: { key: "ArrowLeft", requiresShift: false },
    TOGGLE_AUTOSKIP: { key: "KeyP", requiresShift: false },
  },
  selectors: {
    voteBox: "#ptbr-wrapper > div.ptbr-vote",
    upvoteButton: "button:first-child",
    downvoteButton: "button:nth-child(3)",
    favoriteButton: "div.ptbr-favorite > button",
    unvaforiteButton: "div.ptbr-favorite > button",
    imageViewer: "img#image",
    wikiButtons: "a.tag-list-wiki",
    navigation: {
      next: "div#nav-links-top > div > ul > li > a.nav-link.next",
      prev: "div#nav-links-top > div > ul > li > a.nav-link.prev",
      searchField: "textarea#tags",
    },
    blacklist: {
      box: "section#blacklist-box > a",
      collapse: "#blacklist-collapse",
      blacklistedContent: "#image-container.blacklisted",
    },
    pool: {
      nav: "#nav-links-top",
      link: "div.pool-nav > ul > li > span > a",
    },
  },
  delays: {
    defaultSleep: 2,
    voteDelay: 1,
    autoSkipDelay: 3, // 3 seconds countdown before skipping
  },
};

// Utility functions
class Utils {
  static async sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }

  static isElementVisible(element) {
    if (!element) return false;

    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();

    return !(
      style.display === "none" ||
      style.visibility === "hidden" ||
      parseFloat(style.opacity) < 0.01 ||
      (rect.width === 0 && rect.height === 0)
    );
  }

  static isInteractiveElementFocused() {
    const activeElement = document.activeElement;
    if (!activeElement) return false;

    const interactiveElements = ["INPUT", "TEXTAREA", "SELECT", "VIDEO"];
    return (
      (interactiveElements.includes(activeElement.tagName) ||
        activeElement.isContentEditable) &&
      Utils.isElementVisible(activeElement)
    );
  }

  static async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
    }
  }
}

// DOM Manager for caching and managing DOM elements
class DOMManager {
  constructor() {
    this.elements = new Map();
    this.initializeElements();
  }

  initializeElements() {
    Object.entries(CONFIG.selectors).forEach(([key, selector]) => {
      if (typeof selector === "string") {
        this.elements.set(key, document.querySelector(selector));
      }
    });
  }

  getElement(key) {
    if (!this.elements.has(key) && key.split(".").length == 2) {
      let selector = CONFIG.selectors[key.split(".")[0]];
      const secondKey = key.split(".")[1];
      if (selector && selector[secondKey] !== null) {
        selector = selector[secondKey];
        this.elements.set(key, document.querySelector(selector));
      }
    }
    return this.elements.get(key);
  }

  getMetaData(key) {
    const metaTag = document.querySelector(`meta[name="${key}"]`);
    if (!metaTag) return null;

    return metaTag.getAttribute("content");
  }
}

// Vote Manager
class VoteManager {
  constructor(domManager) {
    this.dom = domManager;
  }
  
  getVoteScore() {
    const voteBox = this.dom.getElement("voteBox");
    return voteBox.dataset.vote;
  }

  isAlreadyUpvoted() {
    return this.getVoteScore() == "1";
  }

  isAlreadyDownvoted() {
    return this.getVoteScore() == "-1";
  }

  isAlreadyFavorited() {
    const favoriteButton = this.dom.getElement("favoriteButton");
    return favoriteButton.attributes["favorited"].value == "true";
  }

  async upvote() {
    if (!this.isAlreadyUpvoted()) {
      const upvoteButton = this.dom
        .getElement("voteBox")
        ?.querySelector(CONFIG.selectors.upvoteButton);
      upvoteButton?.click();
      await Utils.sleep(CONFIG.delays.voteDelay);
      return;
    }
    return;
  }

  async downvote() {
    if (!this.isAlreadyDownvoted()) {
      const downvoteButton = this.dom
        .getElement("voteBox")
        ?.querySelector(CONFIG.selectors.downvoteButton);
      downvoteButton?.click();
      await Utils.sleep(CONFIG.delays.voteDelay);
      return;
    }
    return;
  }

  async favorite(disableUnfavorite = false) {
    if (!this.isAlreadyFavorited()) {
      const favoriteButton = this.dom.getElement("favoriteButton");
      favoriteButton?.click();
      await Utils.sleep(CONFIG.delays.voteDelay);
      return;
    } else if (this.isAlreadyFavorited() && !disableUnfavorite) {
      const unfavoritedButton = this.dom.getElement("unfavoriteButton");
      unfavoritedButton?.click();
      await Utils.sleep(CONFIG.delays.voteDelay);
      return;
    }
    return;
  }
}

// Navigation Manager
class NavigationManager {
  constructor(domManager) {
    this.dom = domManager;
  }

  goToNext() {
    const nextButton = document.querySelector(CONFIG.selectors.navigation.next);
    nextButton?.click();
  }

  goToPrev() {
    const prevButton = document.querySelector(CONFIG.selectors.navigation.prev);
    prevButton?.click();
  }
}

class UserActions {
  constructor(domManager) {
    this.domManager = domManager;
    this.LOCAL_STORAGE_KEY = "myCachedUsername";
    this.EXPIRATION_MS = 24 * 60 * 60 * 1000; // 1 day
  }

  // 1. Try to read the username from the meta tag
  getUsernameFromMeta() {
    const metaData = this.domManager.getMetaData("current-user-name");
    if (!metaData) {
      return null;
    } else {
      return metaData;
    }
  }

  // 2. Store username in localStorage with an expiration
  storeUsername(username) {
    const data = {
      username,
      expires: Date.now() + this.EXPIRATION_MS,
    };
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(data));
  }

  // 3. Retrieve username from localStorage if it's not expired
  getStoredUsername() {
    const raw = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (!raw) return null;

    const { username, expires } = JSON.parse(raw);
    if (Date.now() > expires) {
      localStorage.removeItem(this.LOCAL_STORAGE_KEY);
      return null;
    }
    return username;
  }

  // 4. Main function to obtain the username
  getUsername() {
    // First, check localStorage
    let username = this.getStoredUsername();
    if (username) return username;

    // Then, check the meta tag
    username = this.getUsernameFromMeta();
    if (!username) {
      // Fallback to asking the user
      username = prompt("Please enter your username:")?.trim() || "";
    }

    if (username) this.storeUsername(username);
    return username;
  }

  // 5. Check if "-fav:<username>" is present in the search field and remove it if found
  ignoreFavoritePosts(wasShiftHeld = false, wasCtrlHeld = false) {
    const searchField = document.querySelector(
      CONFIG.selectors.navigation.searchField,
    );
    if (!searchField) return;

    const username = this.getUsername(); // Assume this.getUsername() retrieves the username
    if (!username) return;

    const negativeFavTag = `-fav:${username}`;
    const positiveFavTag = `fav:${username}`;

    // Regex to match the exact negative tag: '-fav:<username>' preceded by start or space,
    // and followed by space or end of string
    const negativeRegex = new RegExp(`(^|\\s)${negativeFavTag}(?=$|\\s)`, "g");
    // Regex to match the exact positive tag: 'fav:<username>' preceded by start or space,
    // and followed by space or end of string
    const positiveRegex = new RegExp(`(^|\\s)${positiveFavTag}(?=$|\\s)`, "g");

    // Helper to remove all occurrences (positive or negative) from the input
    const removeAllFavTags = (val) => {
      return val
        .replace(negativeRegex, "") // remove any negative
        .replace(positiveRegex, "") // remove any positive
        .replace(/\s+/g, " ") // normalize multiple spaces
        .trim();
    };

    // Helper to remove only the negative tag
    const removeNegativeFav = (val) => {
      return val.replace(negativeRegex, "").replace(/\s+/g, " ").trim();
    };

    // Helper to remove only the positive tag
    const removePositiveFav = (val) => {
      return val.replace(positiveRegex, "").replace(/\s+/g, " ").trim();
    };

    let currentValue = searchField.value || "";

    if (wasCtrlHeld) {
      // 1) CTRL key held: remove ALL fav tags
      currentValue = removeAllFavTags(currentValue);
    } else if (wasShiftHeld) {
      // 2) SHIFT key held => toggle "fav:<username>"
      if (positiveRegex.test(currentValue)) {
        // Already has 'fav:<username>', so remove it
        currentValue = removePositiveFav(currentValue);
      } else {
        // Remove any '-fav:<username>' first, then prepend 'fav:<username>'
        currentValue = removeNegativeFav(currentValue);
        currentValue = currentValue
          ? `${positiveFavTag} ${currentValue}`.trim()
          : positiveFavTag;
      }
    } else {
      // 3) NO SHIFT => toggle "-fav:<username>"
      if (negativeRegex.test(currentValue)) {
        // Already has '-fav:<username>', so remove it
        currentValue = removeNegativeFav(currentValue);
      } else {
        // Remove any 'fav:<username>' first, then prepend '-fav:<username>'
        currentValue = removePositiveFav(currentValue);
        currentValue = currentValue
          ? `${negativeFavTag} ${currentValue}`.trim()
          : negativeFavTag;
      }
    }

    // Update the input field
    searchField.value = currentValue;

    // Finally, find a button in the same parent container and click it to trigger the new search
    const parent = searchField.parentElement;
    if (parent) {
      const button = parent.querySelector("button");
      if (button) button.click();
    }
  }
}

// Blacklist Manager
class BlacklistManager {
  constructor(domManager) {
    this.dom = domManager;
  }

  async openBlacklist() {
    const element = document.querySelector(CONFIG.selectors.blacklist.collapse);
    if (element?.classList.contains("hidden")) {
      element.click();
      await Utils.sleep(CONFIG.delays.defaultSleep);
    }
  }

  async toggleBlacklist() {
    const toggles = ["disable", "re-enable"];
    for (const toggle of toggles) {
      const selector = `${CONFIG.selectors.blacklist.box}${toggle}-all-blacklists`;
      const element = document.querySelector(selector);

      if (element && Utils.isElementVisible(element)) {
        element.click();
        await Utils.sleep(CONFIG.delays.defaultSleep);
        break;
      }
    }
  }

  isImageBlacklisted() {
    // Check for the blacklisted image placeholder
    return (
      document.querySelector(CONFIG.selectors.blacklist.blacklistedContent) !==
      null
    );
  }
}

// Pool Manager
class PoolManager {
  constructor(domManager) {
    this.dom = domManager;
  }

  addCopyPoolID() {
    const navBar = this.dom.getElement("pool.nav");
    const poolLink = navBar?.querySelector(CONFIG.selectors.pool.link);

    if (!poolLink) return;

    const poolId = poolLink.href.split("/").pop();
    const copyButton = this.createCopyButton(poolId);
    navBar.appendChild(copyButton);
  }

  createCopyButton(poolId) {
    const container = document.createElement("div");
    container.className = "pool-nav";
    container.style.textAlign = "center";

    const button = document.createElement("a");
    button.textContent = `Copy Pool-ID: ${poolId}`;
    button.style.cursor = "pointer";
    button.addEventListener("click", async () => {
      const success = await Utils.copyToClipboard(poolId);
      alert(success ? `Copied Pool ID: ${poolId}` : "Failed to copy pool ID");
    });

    container.appendChild(button);
    return container;
  }
}

// Auto-Skip Manager
class AutoSkipManager {
  constructor(domManager, navigationManager, blacklistManager) {
    this.dom = domManager;
    this.navigationManager = navigationManager;
    this.blacklistManager = blacklistManager;
    this.skipTimer = null;
    this.isPaused = false;
    this.progressBarElement = null;
    this.progressBarContainer = null;
    this.pauseIndicatorElement = null;
    this.skipTimeout = CONFIG.delays.autoSkipDelay * 1000;
    this.startTime = 0;
    this.enabled = true;
  }

  createProgressBar() {
    // Only create if we're on a blacklisted image
    if (!this.blacklistManager.isImageBlacklisted()) {
      return null;
    }

    const navBar = this.dom.getElement("pool.nav");
    if (!navBar) return null;

    // Create container for the progress bar
    const container = document.createElement("div");
    container.className = "pool-nav auto-skip-container";
    container.style.textAlign = "center";
    container.style.display = "block";
    container.style.marginTop = "10px";

    // Add title
    const title = document.createElement("div");
    title.textContent = "Auto-skipping blacklisted image";
    title.style.marginBottom = "5px";
    title.style.fontWeight = "bold";
    container.appendChild(title);

    // Create progress bar container
    const progressBarContainer = document.createElement("div");
    progressBarContainer.style.width = "100%";
    progressBarContainer.style.height = "20px";
    progressBarContainer.style.backgroundColor = "#444";
    progressBarContainer.style.borderRadius = "3px";
    progressBarContainer.style.overflow = "hidden";

    // Create the progress bar (starts full)
    this.progressBarElement = document.createElement("div");
    this.progressBarElement.style.height = "100%";
    this.progressBarElement.style.width = "100%";
    this.progressBarElement.style.backgroundColor = "#ff0000"; // Red progress bar
    this.progressBarElement.style.transition = "width 0.1s linear";
    this.progressBarElement.style.float = "right"; // Right-to-left effect

    progressBarContainer.appendChild(this.progressBarElement);
    container.appendChild(progressBarContainer);

    // Create pause indicator
    this.pauseIndicatorElement = document.createElement("div");
    this.pauseIndicatorElement.style.marginTop = "5px";
    this.pauseIndicatorElement.style.fontSize = "12px";
    this.pauseIndicatorElement.textContent = "Press P to pause";
    container.appendChild(this.pauseIndicatorElement);

    // Append container after the pool ID button
    navBar.appendChild(container);

    this.progressBarContainer = container;
    return container;
  }

  updateProgressBar(secondsRemaining) {
    if (this.progressBarElement) {
      // Convert remaining seconds to percentage (from 100% to 0%)
      const percentRemaining = (secondsRemaining / this.skipTimeout) * 100;
      this.progressBarElement.style.width = `${percentRemaining}%`;
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    if (this.pauseIndicatorElement) {
      this.pauseIndicatorElement.textContent = this.isPaused
        ? "Paused (Press P to resume)"
        : "Press P to pause";
    }
  }

  toggle() {
    this.enabled = !this.enabled;

    // If disabled while running, clear any active timer and remove progress bar
    if (!this.enabled && this.skipTimer) {
      clearInterval(this.skipTimer);
      this.skipTimer = null;

      if (this.progressBarContainer && this.progressBarContainer.parentNode) {
        this.progressBarContainer.parentNode.removeChild(
          this.progressBarContainer,
        );
        this.progressBarContainer = null;
      }
    } else if (this.enabled && this.blacklistManager.isImageBlacklisted()) {
      // If we're enabling and on a blacklisted image, start the skip
      this.startAutoSkipCountdown();
    }

    // Show a notification about the state change
    const status = this.enabled ? "enabled" : "disabled";
    this.showNotification(`Auto-skip ${status}`);
  }

  showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.position = "fixed";
    notification.style.top = "10px";
    notification.style.left = "50%";
    notification.style.transform = "translateX(-50%)";
    notification.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    notification.style.color = "white";
    notification.style.padding = "10px 20px";
    notification.style.borderRadius = "5px";
    notification.style.zIndex = "10000";

    document.body.appendChild(notification);

    // Remove notification after 2 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 2000);
  }

  startAutoSkipCountdown() {
    // If auto-skip is disabled or already a timer running, don't start
    if (!this.enabled || this.skipTimer) return;

    // Only create and start timer if we're on a blacklisted image
    if (!this.blacklistManager.isImageBlacklisted()) return;

    // Make sure we have a progress bar
    if (!this.progressBarContainer) {
      this.createProgressBar();
    }

    // Reset state
    this.isPaused = false;
    if (this.pauseIndicatorElement) {
      this.pauseIndicatorElement.textContent = "Press P to pause";
    }

    this.startTime = Date.now();

    this.skipTimer = setInterval(() => {
      if (!this.isPaused) {
        const elapsed = Date.now() - this.startTime;
        const remainingTime = Math.max(this.skipTimeout - elapsed, 0);

        this.updateProgressBar(remainingTime);

        if (elapsed >= this.skipTimeout) {
          clearInterval(this.skipTimer);
          this.skipTimer = null;

          // Remove the progress bar container
          if (
            this.progressBarContainer &&
            this.progressBarContainer.parentNode
          ) {
            this.progressBarContainer.parentNode.removeChild(
              this.progressBarContainer,
            );
            this.progressBarContainer = null;
          }

          // Navigate to next post
          this.navigationManager.goToNext();
        }
      }
    }, 50); // Update every 50ms for smooth animation
  }

  checkAndStartSkip() {
    // Check if current image is blacklisted and start timer if needed
    if (this.blacklistManager.isImageBlacklisted() && this.enabled) {
      // Clean up any existing progress bar
      if (this.progressBarContainer && this.progressBarContainer.parentNode) {
        this.progressBarContainer.parentNode.removeChild(
          this.progressBarContainer,
        );
        this.progressBarContainer = null;
      }

      // Clear any existing timer
      if (this.skipTimer) {
        clearInterval(this.skipTimer);
        this.skipTimer = null;
      }

      // Start a fresh countdown
      this.startAutoSkipCountdown();
    } else if (
      !this.blacklistManager.isImageBlacklisted() &&
      this.progressBarContainer
    ) {
      // If we're not on a blacklisted image but have a progress bar, remove it
      if (this.progressBarContainer.parentNode) {
        this.progressBarContainer.parentNode.removeChild(
          this.progressBarContainer,
        );
        this.progressBarContainer = null;
      }

      // Clear any existing timer
      if (this.skipTimer) {
        clearInterval(this.skipTimer);
        this.skipTimer = null;
      }
    }
  }
}

// Shortcut Manager
class ShortcutManager {
  constructor(
    voteManager,
    navigationManager,
    blacklistManager,
    userActions,
    autoSkipManager,
  ) {
    this.voteManager = voteManager;
    this.navigationManager = navigationManager;
    this.blacklistManager = blacklistManager;
    this.userActions = userActions;
    this.autoSkipManager = autoSkipManager;
    this.initializeShortcuts();
  }

  initializeShortcuts() {
    document.addEventListener("keydown", this.handleKeydown.bind(this));
  }

  async handleKeydown(event) {
    // Handle shortcuts based on configuration
    const shortcuts = CONFIG.shortcuts;
    const { code, shiftKey, ctrlKey, altKey } = event;

    // Allow to switch pages even if an interactive element is focused
    if (altKey && code === shortcuts.NEXT_POST.key) {
      this.navigationManager.goToNext();
    } else if (altKey && code === shortcuts.PREV_POST.key) {
      this.navigationManager.goToPrev();
    }

    if (Utils.isInteractiveElementFocused()) return;

    // Always respect the toggle auto-skip key press
    if (code === shortcuts.TOGGLE_AUTOSKIP.key) {
      // If a skip timer is active, just toggle pause state
      if (this.autoSkipManager.skipTimer) {
        this.autoSkipManager.togglePause();
      } else {
        // Otherwise, toggle the auto-skip feature
        this.autoSkipManager.toggle();
      }
      return;
    }

    // Generic shortcuts
    if (!shiftKey && code === shortcuts.UPVOTE.key) {
      await this.voteManager.upvote();
    } else if (shiftKey && code === shortcuts.DOWNVOTE.key) {
      await this.voteManager.downvote();
    } else if (code === shortcuts.NEXT_POST.key) {
      this.navigationManager.goToNext();
    } else if (code === shortcuts.PREV_POST.key) {
      this.navigationManager.goToPrev();
    } else if (code === shortcuts.TOGGLE_BLACKLIST.key) {
      await this.blacklistManager.toggleBlacklist();
    } else if (code === shortcuts.TOGGLE_FAVORITES.key) {
      this.userActions.ignoreFavoritePosts(shiftKey, ctrlKey);
    } else if (!shiftKey && code === shortcuts.LIKE_AND_FAVORITE.key) {
      await this.voteManager.favorite();
      await this.voteManager.upvote();
    } else if (shiftKey && code === shortcuts.FAVORITE_AND_CONTINUE.key) {
      await this.voteManager.favorite();
      await this.voteManager.upvote();

      this.navigationManager.goToNext();
    }
  }
}

// Site function modifier
class SiteModifier {
  constructor(domManager) {
    this.dom = domManager;
  }

  poolLinkOpenInNewTab() {
    const navBar = this.dom.getElement("pool.nav");
    let poolLink = navBar?.querySelector(CONFIG.selectors.pool.link);

    if (!poolLink) return;

    poolLink.target = "_blank";
  }
  
  openWikiLinksInNewTab() {
    const wikiElements = document.querySelectorAll(CONFIG.selectors.wikiButtons);
    wikiElements.forEach(wikiLink => {
      wikiLink.target = "_blank";
    });
  }
}

// Main App
class App {
  constructor() {
    this.domManager = new DOMManager();
    this.voteManager = new VoteManager(this.domManager);
    this.navigationManager = new NavigationManager(this.domManager);
    this.blacklistManager = new BlacklistManager(this.domManager);
    this.poolManager = new PoolManager(this.domManager);
    this.userActions = new UserActions(this.domManager);
    this.autoSkipManager = new AutoSkipManager(
      this.domManager,
      this.navigationManager,
      this.blacklistManager,
    );
    this.shortcutManager = new ShortcutManager(
      this.voteManager,
      this.navigationManager,
      this.blacklistManager,
      this.userActions,
      this.autoSkipManager,
    );
    this.siteModifier = new SiteModifier(this.domManager);

    // Set up mutation observer to detect page content changes
    this.setupMutationObserver();
  }

  setupMutationObserver() {
    // Only observe the specific container that would indicate a blacklisted image
    const imageContainer = document.querySelector("#image-container");
    if (!imageContainer) return;

    // Create a focused mutation observer that only watches for blacklist class changes
    const observer = new MutationObserver((mutations) => {
      // Only check for actual class changes
      const hasClassChange = mutations.some(
        (mutation) =>
          mutation.type === "attributes" && mutation.attributeName === "class",
      );

      if (hasClassChange) {
        // Check if we're on a blacklisted image and should start the auto-skip
        this.autoSkipManager.checkAndStartSkip();
      }
    });

    // Only observe the specific element and only for class changes
    observer.observe(imageContainer, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Also observe for URL changes, which indicate navigation between posts
    let lastUrl = location.href;
    const urlObserver = setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        // Small delay to ensure the page has updated
        setTimeout(() => {
          this.autoSkipManager.checkAndStartSkip();
        }, 100);
      }
    }, 500);
  }

  async initialize() {
    await this.blacklistManager.openBlacklist();
    this.poolManager.addCopyPoolID();
    this.siteModifier.poolLinkOpenInNewTab();
    this.siteModifier.openWikiLinksInNewTab();

    // Create the progress bar if not already created
    this.autoSkipManager.createProgressBar();

    // Check for blacklisted image on initial load
    this.autoSkipManager.checkAndStartSkip();
  }
}

// Initialize the application when the window loads
window.addEventListener("load", () => {
  const app = new App();
  app.initialize().catch(console.error);
  console.log("Extended Shortcuts with Auto-Skip loaded :)");
});

// ==UserScript==
// @name         Twitter Follower Count
// @namespace    amm1rr.com.twitter.follower.count
// @version      0.3.4
// @homepage     https://github.com/Amm1rr/Twitter-Follower-Count/
// @description  Display the number of followers for Twitter accounts
// @author       Mohammad Khani (@m_khani65)
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527217/Twitter%20Follower%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/527217/Twitter%20Follower%20Count.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * Cache to store user data to prevent redundant processing.
   * Key: screen_name, Value: user details object.
   * @type {Map<string, Object>}
   */
  const userCache = new Map();
  /**
   * Store reference to the original XMLHttpRequest.send method.
   */

  const originalSend = XMLHttpRequest.prototype.send;
  /**
   * Override XMLHttpRequest.send to intercept API responses.
   * Filters for responses from Twitter API endpoints and extracts user data,
   * caching the data if it's not already present.
   *
   * @param {...any} args - Arguments passed to the original send method.
   */

  XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener("load", () => {
      // Process only API responses relevant to Twitter data.
      if (!this.responseURL || !this.responseURL.includes("/i/api/")) return;

      let responseData;
      try {
        responseData = decodeResponse(this);
        if (!responseData) return;
      } catch (e) {
        console.error("[Twitter Follower Count] Failed to decode response:", e);
        return;
      }

      try {
        const responseJSON = JSON.parse(responseData);
        // Try to extract users using the new API structure first, then fallback to legacy
        const users = extractUsersFromNewAPI(responseJSON, "screen_name");

        users.forEach((user) => {
          if (!user.screen_name || !user.followers_count) return;
          // Cache the user data if not already present
          if (!userCache.has(user.screen_name)) {
            cacheUserData(user);
          }
        });
      } catch (e) {
        // Fail silently if JSON parsing fails
      }
    });
    originalSend.apply(this, args);
  };
  /**
   * Decodes the XMLHttpRequest response based on its type.
   *
   * @param {XMLHttpRequest} xhr - The XMLHttpRequest object.
   * @returns {string|null} The decoded response data or null if decoding fails.
   */

  const decodeResponse = (xhr) => {
    if (xhr.responseType === "" || xhr.responseType === "text") {
      return xhr.responseText;
    } else if (xhr.responseType === "arraybuffer") {
      return new TextDecoder("utf-8").decode(xhr.response);
    }
    return null;
  };
  /**
   * Caches user data.
   *
   * @param {Object} user - The user data object from the API.
   */

  const cacheUserData = (user) => {
    const userData = {
      name: user.name,
      screen_name: user.screen_name,
      followers_count: user.followers_count,
      formatted_followers_count: formatFollowers(user.followers_count),
      friends_count: user.friends_count,
    };
    userCache.set(user.screen_name, userData);
  };
  /**
   * Recursively traverse an object to extract all sub-objects containing a specific key.
   *
   * @param {Object} obj - The object to traverse.
   * @param {string} key - The key to search for (e.g., "screen_name").
   * @param {Array<Object>} [result=[]] - Array to accumulate found objects.
   * @returns {Array<Object>} Array of objects that contain the specified key.
   */

  const extractUsers = (obj, key, result = []) => {
    for (const value of Object.values(obj)) {
      if (value && typeof value === "object") {
        if (value.hasOwnProperty(key)) {
          result.push(value);
        }
        extractUsers(value, key, result);
      }
    }
    return result;
  };

  /**
   * Extract user data from the new Twitter API structure.
   * @param {Object} obj - The response object to traverse.
   * @param {string} key - The key to search for in legacy structures (e.g., "screen_name").
   * @param {Array<Object>} result - Array to accumulate found objects.
   * @returns {Array<Object>} Array of user objects containing follower data.
   */
  const extractUsersFromNewAPI = (obj, key = "screen_name", result = []) => {
    if (!obj || typeof obj !== "object") return result;

    // Check if this object has user data in the new structure
    if (obj.core && obj.core.user_results && obj.core.user_results.result) {
      const userResult = obj.core.user_results.result;
      if (userResult.legacy && userResult.core) {
        // Combine core info with legacy data for follower count
        result.push({
          name: userResult.core.name,
          screen_name: userResult.core.screen_name,
          followers_count: userResult.legacy.followers_count,
          friends_count: userResult.legacy.friends_count,
          // Keep reference to legacy object for potential future use
          _legacy: userResult.legacy,
        });
      }
    }

    // Check if this object has the legacy structure (for backward compatibility)
    if (
      obj.hasOwnProperty(key) &&
      obj.screen_name &&
      obj.followers_count !== undefined
    ) {
      result.push(obj);
    }

    // Recursively search the entire object
    for (const value of Object.values(obj)) {
      if (value && typeof value === "object") {
        extractUsersFromNewAPI(value, key, result);
      }
    }

    return result;
  };
  /**
   * Format a number into a human-readable string with K/M suffix or comma separation.
   *
   * @param {number} number - The number of followers.
   * @returns {string} Formatted number string.
   */

  const formatFollowers = (number) => {
    if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
    if (number >= 10000) return `${(number / 1000).toFixed(1)}K`;
    if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
    return number.toLocaleString("en-US");
  };
  /**
   * Create a DOM element (span) to display the formatted follower count.
   *
   * @param {string} formattedCount - The formatted follower count string.
   * @returns {HTMLElement} The created span element.
   */

  const createFollowerCountElement = (formattedCount) => {
    const span = document.createElement("span");
    span.className = "count-follower";
    span.innerText = formattedCount;
    Object.assign(span.style, {
      position: "absolute",
      top: "-9px",
      left: "50%",
      transform: "translate(-50%)",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontSize: "9px",
      fontWeight: "400",
      color: "white",
      backgroundColor: "#1d9bf0",
      border: "1px solid white",
      borderRadius: "9999px",
      padding: "0px 4px 1px",
      whiteSpace: "nowrap",
    });
    return span;
  };
  /**
   * Update the DOM to display follower counts for all cached users.
   * It searches for profile links in the document and appends the follower count
   * element next to the profile image.
   */

  const updateFollowerCounts = () => {
    userCache.forEach((user, screen_name) => {
      const profileLinks = document.querySelectorAll(
        `a[href="/${screen_name}"], a[href*="/${screen_name}"]` // Both exact match and contains for robustness
      );

      profileLinks.forEach((link) => {
        // Skip if follower count is already appended.
        if (link.querySelector(".count-follower")) return;

        // Check if this link contains a profile avatar (not tweet image)
        const isProfileAvatar =
          link.closest('[data-testid="Tweet-User-Avatar"]') ||
          (link.querySelector('img[draggable="true"]') &&
            !link.closest('[data-testid="tweetPhoto"]') &&
            !link.href.includes("/status/") &&
            !link.href.includes("/photo/"));

        if (!isProfileAvatar) return;

        const parent = link.parentNode;
        if (!parent) return;

        const img = parent.querySelector('img[draggable="true"]');
        if (!img) return;

        // Adjust styles for proper display.
        parent.style.overflow = "inherit";
        parent.style.clipPath = "none";
        const closestUl = parent.closest("ul");
        if (closestUl) {
          closestUl.style.overflow = "inherit";
        }

        const span = createFollowerCountElement(user.formatted_followers_count);
        link.appendChild(span);
      });
    });
  };
  /**
   * Debounce function to limit the rate at which a function is executed.
   *
   * @param {Function} func - The function to debounce.
   * @param {number} delay - The delay in milliseconds.
   * @returns {Function} A debounced version of the given function.
   */

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }; // Debounced version of updateFollowerCounts to reduce excessive calls.

  const debouncedUpdateFollowerCounts = debounce(updateFollowerCounts, 100); // Update follower counts on initial page load and during scroll events.

  window.addEventListener("load", debouncedUpdateFollowerCounts);
  document.addEventListener("scroll", debouncedUpdateFollowerCounts);
  /**
   * Use MutationObserver to monitor changes in the DOM.
   * This helps in detecting dynamically added elements (e.g., new user profiles)
   * and triggers an update to append follower counts accordingly.
   */

  const observer = new MutationObserver(debouncedUpdateFollowerCounts);
  observer.observe(document.body, { childList: true, subtree: true });
})();

// ==UserScript==
// @name         Fix PageUp and PageDown scrolling for ChatGPT
// @description  Redirects PageUp and PageDown keys to scroll the conversation window while typing in the input field.
// @author       NWP/DEVULSKY
// @namespace    https://greasyfork.org/en/scripts/519486/
// @version      0.3
// @license      MIT
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        none
//
// @downloadURL https://update.greasyfork.org/scripts/519486/Fix%20PageUp%20and%20PageDown%20scrolling%20for%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/519486/Fix%20PageUp%20and%20PageDown%20scrolling%20for%20ChatGPT.meta.js
// ==/UserScript==

(function () {
  'use strict';

    /**
   * Finds the scrollable container of the conversation window.
   * Falls back to a dynamic class-based selector if a specific container ID is not found.
   * @returns {HTMLElement|null} The scrollable container element, or null if not found.
   */
  const getScrollableContainer = () =>
    document.querySelector('#conversation-inner-div') ||
    Array.from(document.querySelectorAll('div')).find(div => /^react-scroll-to-bottom--css-\S+$/.test(div.className));

    /**
   * Checks if an element has `overflow: hidden`.
   * @param {HTMLElement} element - The element to check.
   * @returns {boolean} True if `overflow` is `hidden`, false otherwise.
   */
    const hasOverflowHidden = (element) => {
        if(!element) return false;
        const style = getComputedStyle(element);
        return style && style.overflow === 'hidden';
    };

  /**
   * Smoothly scrolls the container over a period of time.
   * @param {HTMLElement} container - The scrollable container.
   * @param {number} targetPosition - The target scroll position.
   * @param {number} duration - The duration of the scroll animation.
   */
  const smoothScroll = (container, targetPosition, duration) => {
    const startPosition = container.scrollTop;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Animation function that runs on each frame
    const animateScroll = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1); // Ensure progress is capped at 1

      // Apply the easing function
      container.scrollTop = startPosition + distance * progress;

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll); // Continue the animation until duration is reached
      }
    };

    // Start the smooth scrolling animation
    requestAnimationFrame(animateScroll);
  };

  /**
   * Handles the PageUp and PageDown key events.
   * Prevents the default browser behavior and scrolls the conversation window instead.
   * @param {KeyboardEvent} event - The keydown event triggered by the user.
   */
    const handlePageKeys = (event) => {
      if (!['PageUp', 'PageDown'].includes(event.key)) return;

      const scrollableContainer = getScrollableContainer();
      if (!scrollableContainer) return;

      // Add this part
        if (hasOverflowHidden(scrollableContainer)) {
            scrollableContainer.style.overflow = 'visible';
        }

      event.preventDefault();

      const scrollFactor = event.key === 'PageUp' ? -0.75 : 0.75;
      const targetScrollPosition = scrollableContainer.scrollTop + (scrollableContainer.clientHeight * scrollFactor);

      smoothScroll(scrollableContainer, targetScrollPosition, 400);
    };


  document.addEventListener('keydown', handlePageKeys);
})();
// ==UserScript==
// @name         Hacker News - Match Comment Link Style to Story Link
// @author       MedX
// @namespace    MedX-AA
// @license      MIT
// @icon         https://news.ycombinator.com/favicon.ico
// @version      1.6
// @description  Make the comment link on Hacker News front page match the story link formatting (external stories only). So that you can use Snap Links to easily Right Click and drag to mass open links if you like to read Comments page for stories.
// @match        https://news.ycombinator.com/front*
// @match        https://news.ycombinator.com/newest*
// @match        https://news.ycombinator.com/news*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538356/Hacker%20News%20-%20Match%20Comment%20Link%20Style%20to%20Story%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/538356/Hacker%20News%20-%20Match%20Comment%20Link%20Style%20to%20Story%20Link.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // Prevent script from running multiple times
  if (window.hnStyleObserverActive) return;
  window.hnStyleObserverActive = true;

  const DEBOUNCE_MS = 300; // Wait time after Pagetual finishes inserting

  let cachedStyle = null; // Stores the style from the post title link
  let debounceTimer = null; // Timer for debouncing updates

  // Read and cache the style from the first post title link
  function cacheTitleStyle() {
    if (cachedStyle) return;
    const firstTitleLink = document.querySelector('.titleline > a');
    if (!firstTitleLink) return;
    const s = getComputedStyle(firstTitleLink);
    cachedStyle = {
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      color: s.color,
      fontFamily: s.fontFamily,
      textDecoration: s.textDecoration
    };
  }

  // Apply the cached style to the comment links
  function applyCommentStyle() {
    if (!cachedStyle) cacheTitleStyle();
    if (!cachedStyle) return;
    const commentLinks = document.querySelectorAll('.subtext a[href^="item?id="]');
    commentLinks.forEach(link => {
      // Check if the link's text content is "comment" or "discuss"
      if (link.textContent.includes('comment') || link.textContent.includes('discuss')) {
        link.style.cssText = `
          font-size: ${cachedStyle.fontSize};
          font-weight: ${cachedStyle.fontWeight};
          color: ${cachedStyle.color};
          font-family: ${cachedStyle.fontFamily};
          text-decoration: ${cachedStyle.textDecoration};
        `;
      } else {
        link.style.cssText = ''; // Clear styles from other links with the same href
      }
    });
  }

  // Debounce the styling function to run after new content is loaded
  function scheduleStyling() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyCommentStyle, DEBOUNCE_MS);
  }

// Replace <a> with a styled <span> so appearance is identical
function unlinkHNUserAndAge() {

  function replaceLink(a) {
    const span = document.createElement('span');
    span.textContent = a.textContent;

    // Copy computed visual style so it looks identical
    const cs = window.getComputedStyle(a);
    span.style.color = cs.color;
    span.style.fontSize = cs.fontSize;
    span.style.fontWeight = cs.fontWeight;
    span.style.fontFamily = cs.fontFamily;
    span.style.textDecoration = cs.textDecoration;
    span.style.margin = cs.margin;
    span.style.padding = cs.padding;

    // Preserve classes for consistent styling
    span.className = a.className;

    a.replaceWith(span);
  }

  // Unlink usernames
  document.querySelectorAll('a.hnuser').forEach(replaceLink);

  // Unlink age links (<span class="age"><a>…</a></span>)
  document.querySelectorAll('span.age a[href^="item?id="]').forEach(replaceLink);

  // Unlink "hide" links
  document.querySelectorAll('a.hider, a.clicky.hider').forEach(replaceLink);
}


  applyCommentStyle(); // Initial run on page load
  unlinkHNUserAndAge(); // Initial unlinking

  // Watch for new content additions (e.g., from Pagetual)
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        scheduleStyling();
        unlinkHNUserAndAge(); // Also unlink newly loaded content
        break;
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
// ==UserScript==
// @name         Reddit Direct Link
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  On New Reddit, makes post titles and post boxes link directly to the external website instead of the Reddit comments page.
// @author       narrowstacks
// @match        *://www.reddit.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530145/Reddit%20Direct%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/530145/Reddit%20Direct%20Link.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // List of Reddit media domains to preserve
  const REDDIT_MEDIA_DOMAINS = [
    "i.redd.it",
    "v.redd.it",
    "preview.redd.it",
    "i.reddit.com",
    "reddit.com/gallery",
  ];

  function isRedditMediaLink(url) {
    return REDDIT_MEDIA_DOMAINS.some((domain) => url.includes(domain));
  }

  function findExternalLink(post) {
    // First try to find the link in the thumbnail slot as it's most reliable
    const thumbnailSlot = post.shadowRoot.querySelector(
      'slot[name="thumbnail"]'
    );
    if (thumbnailSlot) {
      const elements = thumbnailSlot.assignedElements();
      for (const element of elements) {
        // Look for the direct link in the thumbnail area
        const links = element.querySelectorAll(
          'a[rel="noopener nofollow ugc"]'
        );
        for (const link of links) {
          // Skip if it's a Reddit media link
          if (isRedditMediaLink(link.href)) {
            return null;
          }
          if (
            !link.href.includes("/comments/") &&
            !link.href.includes("reddit.com")
          ) {
            return link;
          }
        }
      }
    }

    // Check content-href attribute first as it's more reliable than other slots
    const contentHref = post.getAttribute("content-href");
    if (contentHref) {
      if (isRedditMediaLink(contentHref)) {
        return null;
      }
      if (
        !contentHref.includes("/comments/") &&
        !contentHref.includes("reddit.com")
      ) {
        return { href: contentHref };
      }
    }

    // Fallback to other slots if needed
    const slotNames = ["title", "full-post-link", "content-href"];
    for (const slotName of slotNames) {
      const slot = post.shadowRoot.querySelector(`slot[name="${slotName}"]`);
      if (!slot) continue;

      const elements = slot.assignedElements();
      for (const element of elements) {
        // Check for links within the element
        const links = element.querySelectorAll("a");
        for (const link of links) {
          if (isRedditMediaLink(link.href)) {
            continue;
          }
          if (
            !link.href.includes("/comments/") &&
            !link.href.includes("reddit.com")
          ) {
            return link;
          }
        }

        // Check for href attribute on the element itself
        if (element.href) {
          if (isRedditMediaLink(element.href)) {
            continue;
          }
          if (
            !element.href.includes("/comments/") &&
            !element.href.includes("reddit.com")
          ) {
            return element;
          }
        }
      }
    }

    return null;
  }

  function modifyLinks() {
    const posts = document.querySelectorAll(
      "shreddit-post:not([direct-link-processed])"
    );

    posts.forEach((post) => {
      // Skip if we've already processed this post
      if (post.hasAttribute("direct-link-processed")) {
        return;
      }

      // Mark as processed immediately to prevent any race conditions
      post.setAttribute("direct-link-processed", "true");

      // Check if post has shadowRoot
      if (!post.shadowRoot) {
        return;
      }

      // Find external link first
      const externalLink = findExternalLink(post);
      if (!externalLink) {
        return;
      }

      // Find and modify the full-post link
      const fullPostLinkSlot = post.shadowRoot.querySelector(
        'slot[name="full-post-link"]'
      );
      if (fullPostLinkSlot) {
        const fullPostElements = fullPostLinkSlot.assignedElements();
        for (const element of fullPostElements) {
          if (
            element.tagName === "A" &&
            !element.hasAttribute("direct-link-processed")
          ) {
            element.setAttribute("direct-link-processed", "true");
            element.href = externalLink.href;
          }
        }
      }

      // Find and modify the title link
      const titleSlot = post.shadowRoot.querySelector('slot[name="title"]');
      if (titleSlot) {
        const titleElements = titleSlot.assignedElements();
        for (const element of titleElements) {
          const titleLink = element.querySelector(
            "a:not([direct-link-processed])"
          );
          if (titleLink) {
            titleLink.setAttribute("direct-link-processed", "true");
            titleLink.href = externalLink.href;
          }
        }
      }
    });
  }

  // Debounce function to limit how often we run modifications
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Wait for the page to be ready
  function init() {
    // Initial check
    modifyLinks();

    // Debounce the modification function
    const debouncedModifyLinks = debounce(modifyLinks, 250);

    // Observe for dynamically loaded posts
    const observer = new MutationObserver((mutations) => {
      let shouldModify = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          shouldModify = true;
          break;
        }
      }
      if (shouldModify) {
        debouncedModifyLinks();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Ensure the script runs after the page is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

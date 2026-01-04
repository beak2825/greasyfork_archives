// ==UserScript==
// @name         X to Twitter Text Replacer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Replace "Post/Posts" with "Tweet/Tweets" and "X/X Corp" with "Twitter/Twitter Inc." on all X.com and Twitter.com sites
// @author       You
// @match        https://*.x.com/*
// @match        https://x.com/*
// @match        https://*.twitter.com/*
// @match        https://twitter.com/*
// @match        http://*.x.com/*
// @match        http://x.com/*
// @match        http://*.twitter.com/*
// @match        http://twitter.com/*
// @match        https://developer.x.com/*
// @match        https://developer.twitter.com/*
// @match        https://help.x.com/*
// @match        https://help.twitter.com/*
// @match        https://ads.x.com/*
// @match        https://ads.twitter.com/*
// @match        https://api.x.com/*
// @match        https://api.twitter.com/*
// @match        https://business.x.com/*
// @match        https://business.twitter.com/*
// @match        https://analytics.x.com/*
// @match        https://analytics.twitter.com/*
// @match        https://tweetdeck.x.com/*
// @match        https://tweetdeck.twitter.com/*
// @match        https://studio.x.com/*
// @match        https://studio.twitter.com/*
// @match        https://publish.x.com/*
// @match        https://publish.twitter.com/*
// @match        https://blog.x.com/*
// @match        https://blog.twitter.com/*
// @match        https://privacy.x.com/*
// @match        https://privacy.twitter.com/*
// @match        https://transparency.x.com/*
// @match        https://transparency.twitter.com/*
// @match        https://about.x.com/*
// @match        https://about.twitter.com/*
// @match        https://careers.x.com/*
// @match        https://careers.twitter.com/*
// @match        https://investor.x.com/*
// @match        https://investor.twitter.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/537481/X%20to%20Twitter%20Text%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/537481/X%20to%20Twitter%20Text%20Replacer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Text replacement mappings
  const replacements = {
    Post: "Tweet",
    Posts: "Tweets",
    post: "Tweet",
    posts: "Tweets",
    "X Corp": "Twitter Inc.",
    "X Corp.": "Twitter Inc.",
  };

  // Special handling for standalone "X" -> "Twitter"
  const replaceStandaloneX = (text) => {
    // Replace "X" only when it's standalone (not part of another word)
    // This regex looks for X that's either at word boundaries or surrounded by spaces/punctuation
    return text.replace(/\b(X)\b(?!\s*Corp)/g, "Twitter");
  };

  // Function to check if an element contains user-generated content
  const isUserContent = (element) => {
    // More focused list of selectors for actual user-generated content
    const userContentSelectors = [
      // Tweet content - the actual tweet text
      '[data-testid="tweetText"]',
      '[data-testid="tweetTextarea"]',

      // User input areas
      '[data-testid="dmComposerTextInput"]',
      '[data-testid="messageEntry"]',
      '[data-testid="messageText"]',
      '[role="textbox"]',
      '[contenteditable="true"]',
      'textarea',
      'input[type="text"]',
      'input[type="search"]',

      // User profiles and bios
      '[data-testid="UserDescription"]',
      '[data-testid="UserBio"]',

      // Links that are actually in tweets/content
      'a[href*="://"][data-testid*="tweet"]',
      'a[href*="://"][class*="tweet"]',

      // Code blocks and documentation (for developer sites)
      'code',
      'pre',
      '.highlight',
      '.language-*',
      '.hljs',

      // API documentation examples
      '.api-example',
      '.curl',
      '.json',
      '.xml',
    ];

    // Check if element or any parent matches user content selectors
    let current = element;
    while (current && current !== document.body) {
      for (const selector of userContentSelectors) {
        try {
          if (current.matches && current.matches(selector)) {
            return true;
          }
        } catch (e) {
          // Skip invalid selectors
          continue;
        }
      }

      // More specific class name checking - only for very specific patterns
      if (current.className && typeof current.className === 'string') {
        const className = current.className.toLowerCase();
        // Only check for very specific user content patterns
        if (className.includes('tweettext') ||
            className.includes('tweet-text') ||
            className.includes('user-bio') ||
            className.includes('dm-text') ||
            className.includes('message-text')) {
          return true;
        }
      }

      current = current.parentElement;
    }

    return false;
  };

  // More targeted check for URLs and suspicious patterns
  const containsURL = (text) => {
    // Only check for actual URLs and very specific patterns that indicate user content
    const patterns = [
      /https?:\/\/[^\s]+/i,     // Full URLs with protocol
      /www\.[a-zA-Z0-9.-]+/i,   // URLs with www
      /@[a-zA-Z0-9_]+/,         // Mentions
      /#[a-zA-Z0-9_]+/,         // Hashtags
      /[a-zA-Z0-9.-]+\.[a-z]{2,}\/[^\s]*/i, // Domain with path
      /curl\s/i,                // curl commands
      /\{[^}]*"[^"]*"[^}]*\}/,  // JSON objects
    ];

    return patterns.some(pattern => pattern.test(text));
  };

  // Function to replace text in a text node
  const replaceTextInNode = (textNode) => {
    if (isUserContent(textNode.parentElement)) {
      return;
    }

    // Additional safety check for URLs and user patterns
    if (containsURL(textNode.textContent)) {
      return;
    }

    let text = textNode.textContent;
    let modified = false;

    // Apply regular replacements
    for (const [original, replacement] of Object.entries(replacements)) {
      if (text.includes(original)) {
        text = text.replace(new RegExp(original, "g"), replacement);
        modified = true;
      }
    }

    // Apply standalone X replacement (only if no URLs detected)
    if (!containsURL(text)) {
      const newText = replaceStandaloneX(text);
      if (newText !== text) {
        text = newText;
        modified = true;
      }
    }

    if (modified) {
      textNode.textContent = text;
    }
  };

  // Function to process all text nodes in an element
  const processTextNodes = (element) => {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip empty text nodes and whitespace-only nodes
          if (!node.textContent.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      },
      false
    );

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    textNodes.forEach(replaceTextInNode);
  };

  // Initial processing when DOM is ready
  const processInitialContent = () => {
    processTextNodes(document.body || document.documentElement);
  };

  // Observer to handle dynamically loaded content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          processTextNodes(node);
        } else if (node.nodeType === Node.TEXT_NODE) {
          replaceTextInNode(node);
        }
      });
    });
  });

  // Start observing when DOM is ready
  const startObserving = () => {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    } else {
      // If body isn't ready yet, try again in a bit
      setTimeout(startObserving, 100);
    }
  };

  // Initialize the script with multiple attempts for different site types
  const initialize = () => {
    // Try processing immediately
    processInitialContent();
    startObserving();

    // Also try after a delay for slower-loading sites
    setTimeout(() => {
      processInitialContent();
    }, 1000);

    // And another attempt for very slow sites
    setTimeout(() => {
      processInitialContent();
    }, 3000);
  };

  // Initialize the script
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

  // Also process content when the page becomes visible (for SPA navigation)
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      setTimeout(processInitialContent, 500);
    }
  });

  // Handle hash changes for single-page apps
  window.addEventListener("hashchange", () => {
    setTimeout(processInitialContent, 500);
  });

  // Handle popstate for browser navigation
  window.addEventListener("popstate", () => {
    setTimeout(processInitialContent, 500);
  });
})();

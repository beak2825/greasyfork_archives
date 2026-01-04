// ==UserScript==
// @name        DailyCrosswordLinks Filtering
// @namespace   https://github.com/Inevitabby/DailyCrosswordLinks-Filtering/raw/refs/heads/main/script.user.js
// @match       https://dailycrosswordlinks.com/*
// @grant       none
// @version     1.4
// @author      Inevitabby
// @description Filters links from Daily Crossword Links (e.g., subscription-only, appstore only, etc.)
// @license     Unlicense; https://unlicense.org/
// @downloadURL https://update.greasyfork.org/scripts/533079/DailyCrosswordLinks%20Filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/533079/DailyCrosswordLinks%20Filtering.meta.js
// ==/UserScript==
(function () {
  "use strict";

  const CONFIG = {
    hidePaid: {
      action: "remove", // valid actions: "remove", "mark", "none"
    },
    hideApp: {
      action: "remove",
    },
    hideCryptic: {
      action: "remove",
    },
    hideFiletype: {
      action: "mark",
      guessFiletype: true,
      whitelist: [ ".puz" ]
    },
  };

  // ===============================
  // === Entry Testing Functions ===
  // ===============================

  // Returns if entry requires subscription or purchase
  function hidePaid(elem) {
    const strong = elem.querySelector("strong");
    return strong?.textContent?.includes(": ($)");
  }

  // Returns if entry requires appstore (exclusively)
  function hideApp(elem) {
    const links = elem.querySelectorAll("a");
    const em = elem.querySelector("em");
    if (em !== null && em.textContent.includes("Online, phone app only")) return true;
    return links.length > 0 && Array.from(links).every(link =>
      link.href.startsWith("https://play.google.com") ||
      link.href.startsWith("https://apps.apple.com")
    );
  }

  // Returns if entry is a cryptic
  function hideCryptic(elem) {
    const strong = elem.querySelector("strong");
    return strong?.textContent?.includes("Cryptic");
  }

  // Returns if entry lacks wanted filetypes
  function hideFiletype(elem) {
    function check(str) {
      return !CONFIG.hideFiletype.whitelist.some((ft) => str.includes(ft));
    }
    const em = elem.querySelector("em");
    // 1. Handle entries with filetype listed
    if (elem._postDate < new Date("April 21, 2025")) {
      if (em === null) return true;
      return check(em.textContent);
    }
    // 2. Guess filetype for new entries that lack it
    if (em?.textContent) return check(em.textContent);
    if (!CONFIG.hideFiletype.guessFiletype) return false;
    const publisher = elem.querySelector("a")?.textContent;
    const entries = Array.from(document.querySelectorAll(SELECTORS.entry))
      .filter(e => e.querySelector("a")?.textContent?.includes(publisher));
    for (const entry of entries.reverse()) {
      const guess = entry.querySelector("em")?.textContent;
      if (guess?.length > 0) return check(guess);
    }
  }

  // Local function map
  const MAP = {
    hidePaid,
    hideApp,
    hideCryptic,
    hideFiletype,
  };

  // ============================
  // === Iterate over Entries ===
  // ============================

  // Selectors
  const SELECTORS = {
    post: "li.wp-block-post",
    entry: "span.fetched, span.unfetched",
    title: "h2.wp-block-post-title a",
  };

  // Scan through all entries
  const posts = document.querySelectorAll(SELECTORS.post);
  for (const post of posts) {
    const date = getDate(post);
    const entries = post.querySelectorAll(SELECTORS.entry);
    for (const entry of entries) {
      entry._postDate = date;
      const matchKey = Object.keys(CONFIG).find((key) => {
        return MAP[key](entry);
      });
      if (!matchKey) continue;
      const { action } = CONFIG[matchKey];
      modify(entry, action);
    };
  };

  // Delete or mark an entry
  function modify(elem, action) {
    while (elem) {
      const next = elem.nextSibling;
      if (action === "remove") elem.remove();
      if (action === "mark") if (elem.style) elem.style.opacity = "0.5";
      if (elem.nodeName === "BR") break;
      elem = next;
    }
  }

  // Returns a post's date
  function getDate(elem) {
    return new Date(
      elem.querySelector(SELECTORS.title)?.textContent
    );
  }

})();

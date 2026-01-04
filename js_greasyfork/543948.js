// ==UserScript==
// @name         AO3 Res
// @namespace    https://archiveofourown.org/
// @version      1.5
// @description  Tweaks to the Archive!
// @author       dxudz
// @match        https://archiveofourown.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543948/AO3%20Res.user.js
// @updateURL https://update.greasyfork.org/scripts/543948/AO3%20Res.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Add "Marked for Later" and "Skins" on the user actions dropdown

  const LINK_CLASS = 'custom-added-link';
  let debounceTimer = null;

  // Robustly find the user dropdown menu element (AO3 variations)
  function getDropdownMenu() {
    return document.querySelector(
      'ul.user.navigation.actions li.dropdown ul.menu.dropdown-menu'
    ) || document.querySelector(
      'ul.user.navigation.actions li.dropdown .dropdown-menu'
    ) || document.querySelector(
      'li.dropdown ul.menu.dropdown-menu'
    );
  }

  // Find an anchor that points to a user profile anywhere in the header
  function findProfileAnchor() {
    // prefer anchors inside the user navigation but fall back to any profile link
    return document.querySelector('ul.user.navigation.actions a[href^="/users/"]') ||
           document.querySelector('a[href^="/users/"]');
  }

  function extractUsernameFromHref(href) {
    if (!href) return null;
    const m = href.match(/\/users\/([^\/?#]+)/);
    if (m && m[1]) {
      try {
        return decodeURIComponent(m[1]);
      } catch (e) {
        return m[1];
      }
    }
    return null;
  }

  // Try several places to obtain the username
  function findUsername() {
    const profileAnchor = findProfileAnchor();
    if (profileAnchor) {
      const fromHref = extractUsernameFromHref(profileAnchor.getAttribute('href'));
      if (fromHref) return fromHref;
      const text = profileAnchor.textContent.trim();
      if (text) return text;
    }

    // fallback: greeting like "Hi, username!"
    const greeting = document.querySelector('ul.user.navigation.actions li.dropdown > a.dropdown-toggle') ||
                     document.querySelector('a.dropdown-toggle');
    if (greeting) {
      const txt = greeting.textContent.replace(/\s+/g, ' ').trim();
      const m = txt.match(/^Hi,\s*(.+?)!$/i);
      if (m && m[1]) return m[1].trim();
    }

    return null;
  }

  function createLi(href, text, username) {
    const li = document.createElement('li');
    li.className = LINK_CLASS;
    li.setAttribute('role', 'menuitem');
    li.setAttribute('data-for-user', username);
    const a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    li.appendChild(a);
    return li;
  }

  // Add the two links once (idempotent)
  function addLinksOnce() {
    const menu = getDropdownMenu();
    if (!menu) return false;

    const username = findUsername();
    if (!username) return false;

    // If we already have links for this username, nothing to do
    const existing = Array.from(menu.querySelectorAll(`li.${LINK_CLASS}`));
    if (existing.some(li => li.getAttribute('data-for-user') === username)) {
      return true;
    }

    // Remove any leftover custom links for other users (avoid duplicates/stale items)
    existing.forEach(li => li.remove());

    // Create list items
    const markedLi = createLi(
      `https://archiveofourown.org/users/${encodeURIComponent(username)}/readings?show=to-read`,
      'Marked for Later',
      username
    );
    const skinsLi = createLi(
      `https://archiveofourown.org/users/${encodeURIComponent(username)}/skins`,
      'My Skins',
      username
    );

    // Insert at top and preserve original order: Marked for Later, then My Skins
    menu.insertBefore(skinsLi, menu.firstElementChild || null);
    menu.insertBefore(markedLi, menu.firstElementChild || null);

    return true;
  }

  // Debounced scheduler for MutationObserver callbacks
  function scheduleAdd() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      try { addLinksOnce(); } catch (e) { /* swallow */ }
    }, 120);
  }

  function startWatching() {
    // try immediately
    addLinksOnce();

    if (window.MutationObserver) {
      const observer = new MutationObserver(scheduleAdd);
      observer.observe(document.documentElement, { childList: true, subtree: true });
    } else {
      // fallback polling
      setInterval(addLinksOnce, 1500);
    }
  }

  // Run right away if ready, otherwise on load
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    startWatching();
  } else {
    window.addEventListener('load', startWatching, { once: true });
  }

// Change AO3's tab icon

const newFaviconURL = "https://i.ibb.co/vxQsC1XT/archive-of-our-own-svgrepo-com.png";

function replaceFavicon() {
  const head = document.querySelector("head");
  if (!head) return;

  // Remove existing favicons
  head.querySelectorAll("link[rel*='icon']").forEach(icon => icon.remove());

  // Add the new one
  const newIcon = document.createElement("link");
  newIcon.rel = "icon";
  newIcon.type = "image/png";
  newIcon.href = newFaviconURL;
  newIcon.className = "custom-favicon"; // mark it
  head.appendChild(newIcon);
}

// Run immediately if head is ready
if (document.head) replaceFavicon();

// Also run on load
window.addEventListener("load", replaceFavicon);

// Keep watching in case AO3 replaces the favicon later
if (window.MutationObserver) {
  const observer = new MutationObserver(() => {
    const current = document.querySelector("link.custom-favicon");
    if (!current) {
      replaceFavicon();
    }
  });
  observer.observe(document.head || document.documentElement, {
    childList: true,
    subtree: true
  });
}


// Censor your username

    let username = "";
let isCensored = true;
const spans = [];

function toggle() {
  isCensored = !isCensored;
  spans.forEach(span => {
    span.textContent = isCensored ? "▇▇" : span.dataset.username;
  });
}

function makeCensoredSpan(name) {
  const span = document.createElement("span");
  span.textContent = "▇▇";
  span.style.cursor = "pointer";
  span.title = "Click to toggle username";
  span.dataset.username = name;
  span.dataset.censored = "1";
  span.addEventListener("click", toggle);
  spans.push(span);
  return span;
}

/** Try several places to get the logged-in username, once */
function detectUsername() {
  if (username) return username;

  // A) Greeting "Hi, <name>!"
  const topUser = document.querySelector("ul.user.navigation.actions li.dropdown > a.dropdown-toggle");
  if (topUser) {
    const txt = topUser.textContent.replace(/\s+/g, " ").trim();
    const m = txt.match(/^Hi,\s*(.+?)!$/i);
    if (m && m[1]) {
      username = m[1].trim();
      return username;
    }
  }

  // B) Any user link in the user menu
  const userLink = document.querySelector('ul.user.navigation.actions a[href^="/users/"]');
  if (userLink) {
    // Prefer link text if it looks like a username
    const t = userLink.textContent.replace(/\s+/g, " ").trim();
    if (t && !/[^\w\-_.]/.test(t)) {
      username = t;
      return username;
    }
    // Fallback: extract from href
    const href = userLink.getAttribute("href");
    const m2 = href && href.match(/\/users\/([^\/?#]+)/);
    if (m2 && m2[1]) {
      username = decodeURIComponent(m2[1]);
      return username;
    }
  }

  // C) Comment header: "Comment as <name>"
  const commentHead = document.querySelector("#add_comment_placeholder #add_comment fieldset > h4.heading");
  if (commentHead) {
    const txt = commentHead.textContent.replace(/\s+/g, " ").trim();
    const m3 = txt.match(/Comment as\s+(.+)/i);
    if (m3 && m3[1]) {
      username = m3[1].trim();
      return username;
    }
  }

  return "";
}

function applyCensorship() {
  detectUsername();
  if (!username) return; // Wait until we know it

  // 1) Top right "Hi, username!"
  const topUser = document.querySelector("ul.user.navigation.actions li.dropdown > a.dropdown-toggle");
  if (topUser && !topUser.querySelector('span[data-censored="1"]')) {
    const span = makeCensoredSpan(username);
    // Normalize greeting safely
    const before = document.createTextNode("Hi, ");
    const after = document.createTextNode("!");
    // Clear and rebuild
    while (topUser.firstChild) topUser.removeChild(topUser.firstChild);
    topUser.append(before, span, after);
  }

  // 2) Comment as username?
  const commentHead = document.querySelector("#add_comment_placeholder #add_comment fieldset > h4.heading");
  if (commentHead && !commentHead.querySelector('span[data-censored="1"]')) {
    const txt = commentHead.textContent.replace(/\s+/g, " ").trim();
    if (/^Comment as\b/i.test(txt)) {
      const span = makeCensoredSpan(username);
      commentHead.textContent = "Comment as ";
      commentHead.appendChild(span);
    }
  }

  // 3) Profile page username
  const profileHead = document.querySelector("div.primary.header.module > h2.heading");
  if (profileHead && !profileHead.querySelector('span[data-censored="1"]')) {
    const txt = profileHead.textContent.replace(/\s+/g, " ").trim();
    if (txt === username || txt.includes(username)) {
      profileHead.textContent = "";
      profileHead.appendChild(makeCensoredSpan(username));
    }
  }

  // 4) Bookmarks page header "Bookmarks by <name>"
  const bookmarksHeading = document.querySelector("div#main.bookmarks-index h2.heading");
  if (bookmarksHeading && !bookmarksHeading.querySelector('span[data-censored="1"]')) {
    const txt = bookmarksHeading.textContent.replace(/\s+/g, " ").trim();
    const m = txt.match(/^(.*Bookmarks by )(.+)$/i);
    if (m) {
      const [, prefix, name] = m;
      if (!username) username = name.trim();
      bookmarksHeading.textContent = prefix;
      bookmarksHeading.appendChild(makeCensoredSpan(username));
    }
  }

  // 5) In bookmark lists → "Bookmarked by [username]" → "Bookmarked by you"
  document.querySelectorAll("h5.byline.heading").forEach(h5 => {
    if (h5.dataset.censored === "1") return;
    const link = h5.querySelector("a[href*='/bookmarks']");
    if (!link) return;

    const linkName = link.textContent.replace(/\s+/g, " ").trim();
    const href = link.getAttribute("href") || "";
    const matchesName = username && linkName === username;
    const matchesHref = username && href.includes(`/users/${encodeURIComponent(username)}/bookmarks`);

    if (matchesName || matchesHref) {
      link.textContent = "you";
      h5.dataset.censored = "1";
    }
  });
}

function start() {
  // First pass
  applyCensorship();

  // Observe DOM changes (AO3 uses partial reloads)
  const observer = new MutationObserver(() => {
    applyCensorship();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Also run when the page reports it's fully complete
  if (document.readyState !== "complete") {
    window.addEventListener("load", applyCensorship, { once: true });
  }
}

start();


// Add wordcount into chapters


    const WPM = 250; // words per minute for estimation (< you can change this!)

  function countTime(numWords) {
    if (!numWords) return '?';
    numWords = Math.round(Number(numWords) / WPM);
    const h = Math.floor(numWords / 60);
    const m = numWords % 60;
    return `${h > 0 ? `${h}hr ` : ''}${m > 0 ? `${m}min` : ''}` || '<1min';
  }

  // Check if we're on a valid work page (with or without chapter)
  if (/\/works\/\d+(\/chapters\/\d+)?(?!.*navigate)/.test(window.location.pathname)) {
    const wordCountElem = document.querySelector('dl.stats dd.words');
    const wordCountText = wordCountElem?.textContent?.replace(/,/g, '');
    const numWords = parseInt(wordCountText) || 0;

    if (wordCountElem && numWords) {
      const timeEstimate = countTime(numWords);
      wordCountElem.insertAdjacentHTML('afterend', `<dt>Time:</dt><dd>${timeEstimate}</dd>`);
    }

    // Add per-chapter word count and reading time
    const chapterBlocks = document.querySelectorAll('#chapters > .chapter > div.userstuff.module');
    chapterBlocks.forEach(chapter => {
      const rawText = chapter.textContent.replace(/['’‘-]/g, '');
      const wordCount = (rawText.match(/\w+/g) || []).length - 2;
      const time = countTime(wordCount);

      // Get work and chapter info
      const workIdMatch = location.pathname.match(/\/works\/(\d+)/);
      const chapterSelect = document.querySelector('#selected_id');
      const currentChapterNumber = chapterSelect
        ? parseInt(chapterSelect.selectedIndex + 1)
        : 1;

      const STORAGE_KEY = 'ao3_chapter_wordcounts';
      const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const workId = workIdMatch?.[1];
      if (!workId) return;

      if (!storedData[workId]) storedData[workId] = {};
      storedData[workId][currentChapterNumber] = wordCount;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));

      // Sum all previously read chapters with index < current
      let totalRead = 0;
      const chapterNumbers = Object.keys(storedData[workId])
        .map(Number)
        .filter(n => n < currentChapterNumber);

      for (let num of chapterNumbers) {
        totalRead += storedData[workId][num];
      }

      let finalLine = '';
      if (chapterNumbers.length > 0) {
        finalLine = `${totalRead.toLocaleString()} words read in total. This chapter has ${wordCount.toLocaleString()} words (Estimated reading time: ${time}).`;
      } else {
        finalLine = `This chapter has ${wordCount.toLocaleString()} words (Estimated reading time: ${time}).`;
      }

      chapter.parentElement.insertAdjacentHTML('afterbegin',
        `<div style="font-size: 0.7em; text-transform: uppercase; text-align: center; color: #fff; margin: 3em 0 1em;">
          ${finalLine}
        </div>`);
    });
  }

  // For listings: add "Time: X" next to the word count
  function addTimeToListings() {
    document.querySelectorAll('li.work').forEach(work => {
      const stats = work.querySelector('dl.stats');
      const wordDD = stats?.querySelector('dd.words');

      if (!wordDD || wordDD.dataset.timeAdded) return; // already processed

      const wordText = wordDD.textContent.replace(/,/g, '');
      const wordNum = parseInt(wordText);
      if (!wordNum) return;

      const timeEstimate = countTime(wordNum);
      wordDD.insertAdjacentHTML('afterend', `<dt>Time: </dt><dd>${timeEstimate}</dd>`);
      wordDD.dataset.timeAdded = 'true';
    });
  }

  // Run once on load
  addTimeToListings();

  // Also rerun on mutations (e.g., infinite scroll)
  const observer = new MutationObserver(addTimeToListings);
  observer.observe(document.body, { childList: true, subtree: true });

})();
// ==UserScript==
// @name        BookmarksExplorer
// @description Enables search-as-you-type for all bookmarks
// @namespace   Empornium Scripts
// @match       https://www.empornium.is/*
// @grant       none
// @version     1.2.0
// @author      vandenium
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/543745/BookmarksExplorer.user.js
// @updateURL https://update.greasyfork.org/scripts/543745/BookmarksExplorer.meta.js
// ==/UserScript==
// Changelog:
// Version 1.2.0 - 29/07/2025
// - UI Improvements
//   - Update to only scroll results, searchbox is now fixed.
//   - Update overall size of dialog, prevent jarring resizes
//   - Clicking outside of dialog box closes (as well as ESC key)
//   - Add animation to open/closing search dialog
//   - Add highlight color to title
//   - Add script name/version to the top
// Version 1.1.1 - 27/07/2025
// - Fix issue of not grabbing tags on detail page.
// - Fix FF issue requiring fully qualified URLs.
// Version 1.1.0 - 27/07/2025
// - Include tags in search
// - Highlight found substrings
// Version 1.0.3 - 27/07/2025
// - Style updates
// Version 1.0.2 - 27/07/2025
// - Add functionality to the [Bookmark] text link on torrent details page
// - Update match to work from any page on site
// Version 1.0.1 - 26/07/2025
// - Update name
// Version 1.0.0 - 26/07/2025
// - Initial Release
//   - Indexes all bookmarks on first load - dialog with progress indicator. Subsequent updates (add/remove bookmark) happen in real-time.
//   - Search-as-you-type! Currently searches the torrent title only.
//   - CNTL-SHIFT-F hotkey opens search dialog, Search Bookmarks button on Bookmarks page
//   - Arrow up/down to navigate results, click/Enter navigates to torrent

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(url) {
  const response = await fetch(url, {
    credentials: 'include', // keep cookies/session
  });
  if (!response.ok)
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  return response.text();
}

// --- Inject HTML ---
const scriptName = GM_info.script.name;
const scriptVersion = GM_info.script.version;
const panel = document.createElement('div');
panel.id = 'bookmarkSearchPanel';
panel.innerHTML = `
  <div id="bookmarkSearchHeader">
    <div id="bookmarkScriptInfo">🔖 ${scriptName} v${scriptVersion}</div>
    <input type="text" id="bookmarkSearchInput" placeholder="Search bookmarks..." />
  </div>
  <ul id="bookmarkSearchResults"></ul>
`;
document.body.appendChild(panel);

// --- Inject CSS ---
const style = document.createElement('style');
style.textContent = `
  #bookmarkSearchPanel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60vw;
  height: 70vh; 
  background: #1e1e1e;
  color: white;
  border: 1px solid #444;
  border-radius: 8px;
  z-index: 9999;
  font-family: sans-serif;
  display: none;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  transform: scale(0.95) translate(-50%, -50%);
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;
}

#bookmarkSearchPanel.visible {
  opacity: 1;
  transform: scale(1) translate(-50%, -50%);
  pointer-events: auto;
}

#bookmarkSearchHeader {
  padding: 12px;
  position: relative;
  background: #2a2a2a;
  border-bottom: 1px solid #444;
  flex-shrink: 0;
}

#bookmarkScriptInfo {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 12px;
  color: #aaa;
  font-style: italic;
  user-select: none;
}

#bookmarkSearchInput {
  width: 100%;
  padding: 8px;
  margin-top: 24px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
  background: #333;
  color: white;
}

#bookmarkSearchResults {
  list-style: none;
  padding: 8px 12px;
  margin: 0;
  overflow-y: auto;
  flex: 1;               /* Fills remaining space in fixed-height panel */
}

#bookmarkSearchPanel *,
#bookmarkSearchInput {
  box-sizing: border-box;
}

  #bookmarkSearchInput::placeholder {
    color: #888;
  }

  #bookmarkSearchResults {
  list-style: none;
  padding: 8px 12px;
  margin: 0;
  overflow-y: auto;
  flex: 1;
  height: 200px;
  overflow-y: auto;
  transition: none; 
}

  #bookmarkSearchResults li {
    padding: 10px;
    margin-bottom: 6px;
    border-radius: 6px;
    background: #2a2a2a;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  #bookmarkSearchResults li div {
    max-width: 100%;
    overflow-wrap: break-word;
  }

  #bookmarkSearchResults .bookmark-title {
    font-weight: bold;
    color: #4ea8ff;
    font-size: 14px;
  }

  #bookmarkSearchResults li:hover {
    background: #3a3a3a;
  }

  #bookmarkSearchResults mark {
    background-color: #a3f7b5; /* soft green */
    color: black; 
    padding: 0 2px;
    border-radius: 2px;
  }

  #searchToggleBtn {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 9999;
    font-size: 20px;
    background: rgba(60, 60, 60, 0.8);
    color: #eee;
    border: 1px solid #555;
    border-radius: 6px;
    padding: 5px 10px;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  #searchToggleBtn:hover {
    background: rgba(80, 80, 80, 0.9);
  }
`;
document.head.appendChild(style);

// --- Search logic ---
let bookmarks = getStoredBookmarks();

document
  .getElementById('bookmarkSearchInput')
  .addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const results = bookmarks.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.tags.find((tag) => tag.includes(query))
    );

    const list = document.getElementById('bookmarkSearchResults');
    list.innerHTML = '';

    activeIndex = -1;

    results.forEach((bookmark) => {
      const li = document.createElement('li');

      // Title
      const titleEl = document.createElement('div');
      titleEl.className = 'bookmark-title';
      const highlight = (text, query) => {
        if (!query.trim()) return text;
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return text.replace(
          new RegExp(escaped, 'gi'),
          (match) => `<mark>${match}</mark>`
        );
      };
      titleEl.innerHTML = highlight(bookmark.title, query);

      titleEl.innerHTML = highlight(bookmark.title, query);
      titleEl.style.fontWeight = 'bold';
      titleEl.style.marginBottom = '6px';

      // Tags
      const tagsEl = document.createElement('div');
      tagsEl.className = 'bookmark-tags';
      tagsEl.style.display = 'flex';
      tagsEl.style.flexWrap = 'wrap';
      tagsEl.style.gap = '4px';

      (bookmark.tags || []).forEach((tag) => {
        const tagSpan = document.createElement('span');
        tagSpan.innerHTML = highlight(tag, query);
        tagSpan.style.background = '#444';
        tagSpan.style.color = '#ddd';
        tagSpan.style.padding = '2px 6px';
        tagSpan.style.borderRadius = '4px';
        tagSpan.style.fontSize = '0.8em';
        tagSpan.style.whiteSpace = 'nowrap';
        tagsEl.appendChild(tagSpan);
      });

      li.appendChild(titleEl);
      li.appendChild(tagsEl);
      li.onclick = () => window.open(bookmark.url, '_blank');
      list.appendChild(li);
    });
  });

let activeIndex = -1;

document
  .getElementById('bookmarkSearchInput')
  .addEventListener('keydown', (e) => {
    const listItems = document.querySelectorAll('#bookmarkSearchResults li');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % listItems.length;
      highlightItem(listItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + listItems.length) % listItems.length;
      highlightItem(listItems);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      listItems[activeIndex].click();
    }
  });

function highlightItem(items) {
  items.forEach((item, i) => {
    item.style.background = i === activeIndex ? '#555' : '#2a2a2a';
    if (i === activeIndex) {
      item.scrollIntoView({ block: 'nearest' });
    }
  });
}

function openBookmarkSearchDialog() {
  const panel = document.getElementById('bookmarkSearchPanel');

  // Only open if not already visible
  if (!panel.classList.contains('visible')) {
    panel.style.display = 'flex';

    // Let the browser render the display change before adding animation class
    requestAnimationFrame(() => {
      panel.classList.add('visible');
    });

    document.getElementById('bookmarkSearchInput').focus();
  }
}

function hideBookmarkDialog() {
  const panel = document.getElementById('bookmarkSearchPanel');

  panel.classList.remove('visible');

  // After transition ends, fully hide
  panel.addEventListener(
    'transitionend',
    function handler() {
      panel.style.display = 'none';
      panel.removeEventListener('transitionend', handler);
    },
    { once: true }
  );
}

// --- Keyboard toggle: Ctrl+Shift+F ---
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f') {
    openBookmarkSearchDialog();
  }

  // Esc to close
  if (e.key === 'Escape') {
    hideBookmarkDialog();
  }
});

// --- Expose function to inject bookmarks from other code ---
window.setBookmarkSearchData = function (data) {
  bookmarks = data;
};

function observeAllBookmarkIcons() {
  const icons = document.querySelectorAll('i.bookmark.icon_nav_bookmarks');

  icons.forEach((icon) => {
    if (icon.dataset.observed) return; // prevent duplicate observers
    icon.dataset.observed = 'true';

    const observer = new MutationObserver(async (mutations) => {
      for (const mutation of mutations) {
        if (!['class', 'data-action'].includes(mutation.attributeName))
          continue;

        const isBookmarked =
          icon.classList.contains('bookmarked') &&
          icon.getAttribute('data-action') === 'unbookmark';

        let title = '';
        let url = '';
        let tags = [];

        const isTorrentDetailPage = /^\/torrents\.php\?id=\d+/.test(
          location.pathname + location.search
        );

        if (isTorrentDetailPage) {
          // Individual torrent detail page
          const h2 = document.querySelector('h2');
          title = h2?.textContent.trim() || '';
          url = location.origin + location.pathname + location.search;
          tags = Array.from(
            document.querySelectorAll(
              '#torrent_tags a[href*="torrents.php?taglist="]'
            )
          ).map((a) => a.textContent.trim());
        } else {
          // List/search view
          const iconContainer = icon.closest(
            '.rowa, .rowb, .torrent_grid, .torrent_table, .torrent_icon_container'
          );
          if (!iconContainer) return;
          const torrentContainer = window.location.href.includes('bookmarks')
            ? iconContainer.parentElement.parentElement.parentElement
            : iconContainer.parentElement.parentElement;

          const link = torrentContainer.querySelector(
            'a[href*="/torrent/"], a[href*="torrents.php?id="]'
          );
          title = link?.textContent.trim() || '';
          url = link?.href || '';
          tags = Array.from(torrentContainer.querySelectorAll('.tags a')).map(
            (a) => a.textContent.trim()
          );
        }

        if (!url) return;
        const normalizedUrl = new URL(url, window.location.origin).href;

        let bookmarks = JSON.parse(localStorage.getItem('myBookmarks') || '[]');
        const existingIndex = bookmarks.findIndex(
          (b) => b.url === normalizedUrl
        );

        if (isBookmarked && existingIndex === -1) {
          bookmarks.push({ title, url: normalizedUrl, tags });
          console.log(`🔖 Added: ${title}`);
        } else if (!isBookmarked && existingIndex !== -1) {
          bookmarks.splice(existingIndex, 1);
          console.log(`❌ Removed: ${title}`);
        }

        localStorage.setItem('myBookmarks', JSON.stringify(bookmarks));
        window.setBookmarkSearchData?.(bookmarks); // update UI if available
      }
    });

    observer.observe(icon, {
      attributes: true,
      attributeFilter: ['class', 'data-action'],
    });
  });
}

function getStoredBookmarks() {
  return JSON.parse(localStorage.getItem('myBookmarks') || '[]');
}

function setStoredBookmarks(bookmarks) {
  localStorage.setItem('myBookmarks', JSON.stringify(bookmarks));
  window.setBookmarkSearchData(bookmarks);
}

function createBookmarkProgressDialog() {
  let container = document.createElement('div');
  container.id = 'bookmark-progress-dialog';
  container.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      width: 300px;
      background: #222;
      color: #fff;
      border: 1px solid #888;
      border-radius: 8px;
      padding: 16px;
      z-index: 10000;
      font-family: sans-serif;
    ">
      <strong>Indexing Bookmarked Torrents…</strong>
      <div style="margin-top: 10px; height: 20px; background: #444; border-radius: 4px; overflow: hidden;">
        <div id="bookmark-progress-bar" style="height: 100%; width: 0%; background: #3af;"></div>
      </div>
      <div id="bookmark-progress-status" style="margin-top: 8px; font-size: 14px;">Starting…</div>
      <button id="bookmark-progress-close" style="
        margin-top: 10px;
        padding: 4px 8px;
        font-size: 12px;
        background: #666;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        float: right;
      ">Close</button>
    </div>
  `;
  document.body.appendChild(container);

  document
    .getElementById('bookmark-progress-close')
    .addEventListener('click', () => {
      container.remove();
    });
}

async function getTotalBookmarkPages() {
  const url = `${location.origin}/bookmarks.php?page=1&type=torrents`;
  const html = await fetchPage(url);
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const lastPageLink = doc.querySelector('a.pager_last');
  if (!lastPageLink) return 1;
  const match = lastPageLink.href.match(/page=(\d+)/);
  return match ? parseInt(match[1], 10) : 1;
}

async function getAllBookmarksWithProgress({ delayMs = 3000 } = {}) {
  createBookmarkProgressDialog();
  const progressBar = document.getElementById('bookmark-progress-bar');
  const progressStatus = document.getElementById('bookmark-progress-status');

  const totalPages = await getTotalBookmarkPages();
  const results = [];

  for (let page = 1; page <= totalPages; page++) {
    const url = `${location.origin}/bookmarks.php?page=${page}&type=torrents#torrent_table`;
    progressStatus.textContent = `Fetching page ${page} of ${totalPages}`;

    const html = await fetchPage(url);
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const rows = Array.from(doc.querySelectorAll('.rowa, .rowb'));

    if (rows.length === 0) {
      break;
    }

    for (const row of rows) {
      const link = row.querySelector('a');
      if (!link) continue;
      let title = link?.textContent.trim();
      const href = link.href;
      const tags = Array.from(row.querySelectorAll('.tags a')).map((tag) =>
        tag.textContent.trim()
      );
      results.push({ title, url: href, tags });
    }

    const percent = Math.round((page / totalPages) * 100);
    progressBar.style.width = `${percent}%`;

    await delay(delayMs);
  }

  progressStatus.textContent = `Indexing complete. Found ${results.length} bookmarks.`;
  progressBar.style.background = 'limegreen';
  return results;
}

function observeTorrentDetailBookmark() {
  const bookmarkLink = document.querySelector('a[id^="bookmarklink_torrent_"]');
  if (!bookmarkLink) return;

  bookmarkLink.addEventListener('click', () => {
    const wasBookmarked = bookmarkLink.textContent.includes('Remove bookmark');

    const title = document.querySelector('h2')?.textContent.trim();
    const url = window.location.href;
    const tags = Array.from(
      document.querySelectorAll('#torrent_tags_list a[href*="taglist="]')
    ).map((el) => el.textContent.trim());

    let bookmarks = getStoredBookmarks();
    const index = bookmarks.findIndex((b) => b.url === url);

    if (!wasBookmarked && index === -1) {
      bookmarks.push({ title, url, tags });
      console.log('🔖 Added from torrent page:', title);
    } else if (wasBookmarked && index !== -1) {
      bookmarks.splice(index, 1);
      console.log('❌ Removed from torrent page:', title);
    }

    setStoredBookmarks(bookmarks);
  });
}

function addSearchBookmarksButton() {
  const h2 = document.querySelector('h2');
  if (!h2) return;

  // Create wrapper for centering
  const wrapper = document.createElement('div');
  wrapper.style.textAlign = 'center';

  // Create the button
  const button = document.createElement('button');
  button.textContent = 'Search Bookmarks';
  button.style.padding = '6px 12px';
  button.style.cursor = 'pointer';
  button.style.color = 'white';
  button.style.border = 'solid white 1px';

  button.addEventListener('click', openBookmarkSearchDialog);

  wrapper.appendChild(button);
  h2.insertAdjacentElement('afterend', wrapper);
}

document.addEventListener('click', function (e) {
  const panel = document.getElementById('bookmarkSearchPanel');

  if (!panel.classList.contains('visible')) return;

  if (!panel.contains(e.target)) {
    hideBookmarkDialog();
  }
});

async function go() {
  const bookmarksInStorage = localStorage.getItem('myBookmarks');
  if (!bookmarksInStorage) {
    const bookmarks = await getAllBookmarksWithProgress();
    setStoredBookmarks(bookmarks);
  }

  // Observe bookmark icon changes across the page
  const pageObserver = new MutationObserver(() => {
    observeAllBookmarkIcons();
  });

  pageObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  observeAllBookmarkIcons(); // Initial scan

  if (location.pathname === '/bookmarks.php') {
    addSearchBookmarksButton();
  }

  observeTorrentDetailBookmark();
}

go();

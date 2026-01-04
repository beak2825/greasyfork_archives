// ==UserScript==
// @name        Bangumi shared book collections
// @namespace   http://tampermonkey.net/
// @version     1.0.16
// @author      txfs19260817
// @source      https://github.com/txfs19260817/bangumi-shared-book-collections
// @license     WTFPL
// @icon        https://bangumi.tv/img/favicon.ico
// @match       http*://*.bangumi.tv/
// @match       http*://*.bgm.tv/
// @match       http*://*.chii.in/
// @description 共读 @ Bangumi。Ref: https://github.com/bangumi/scripts/tree/b0113743743dba35accb28e9b7b9da8cbbea6952/yonjar#%E7%94%A8%E6%88%B7%E8%AF%A6%E6%83%85%E7%88%AC%E5%8F%96
// @downloadURL https://update.greasyfork.org/scripts/449152/Bangumi%20shared%20book%20collections.user.js
// @updateURL https://update.greasyfork.org/scripts/449152/Bangumi%20shared%20book%20collections.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/utils.ts
/**
 * Storage utility module that replaces GM_getValue and GM_setValue with localStorage
 * All data is stored under a single namespace to avoid conflicts
 */

const STORAGE_PREFIX = 'bangumi_shared_book_';

/**
 * Gets a value from localStorage
 * @param key - The key to retrieve
 * @param defaultValue - The default value to return if key doesn't exist
 * @returns The stored value or defaultValue
 */
function getValue(key, defaultValue) {
  try {
    const fullKey = STORAGE_PREFIX + key;
    const stored = localStorage.getItem(fullKey);
    if (stored === null) {
      return defaultValue;
    }

    // Try to parse as JSON, fallback to raw string if parsing fails
    try {
      return JSON.parse(stored);
    } catch {
      return stored;
    }
  } catch (error) {
    console.error(`Error reading from localStorage for key ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Sets a value in localStorage
 * @param key - The key to store under
 * @param value - The value to store
 */
function setValue(key, value) {
  try {
    const fullKey = STORAGE_PREFIX + key;

    // Convert value to JSON string for consistent storage
    const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(fullKey, valueToStore);
  } catch (error) {
    console.error(`Error writing to localStorage for key ${key}:`, error);
  }
}

/**
 * Removes a value from localStorage
 * @param key - The key to remove
 */
function removeValue(key) {
  try {
    const fullKey = STORAGE_PREFIX + key;
    localStorage.removeItem(fullKey);
  } catch (error) {
    console.error(`Error removing from localStorage for key ${key}:`, error);
  }
}

/**
 * Clears all values with our storage prefix
 */
function clearAllValues() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}
const parseTimestamp = s => {
  if (!s.includes("ago")) {
    let d = new Date(s);
    if (isNaN(d.getTime())) {
      // try parsing "2023-3-31 15:19"
      const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
      if (m) {
        const [, y, mo, da, h, mi, se] = m.map(Number);
        d = new Date(y, mo - 1, da, h, mi, se || 0);
      }
    }
    return d;
  }

  // handle "ago" format
  const now = new Date();
  const get = r => +(s.match(r)?.[1] ?? 0);
  now.setDate(now.getDate() - get(/(\d+)d/i));
  now.setHours(now.getHours() - get(/(\d+)h/i));
  now.setMinutes(now.getMinutes() - get(/(\d+)m/i));
  return now;
};
const fetchHTMLDocument = (url, fetchMethod = "GET") => {
  return fetch(url, {
    method: fetchMethod,
    credentials: "include"
  }).then(r => r.text(), err => Promise.reject(err)).then(t => {
    const parser = new DOMParser();
    return parser.parseFromString(t, "text/html");
  });
};
function htmlToElement(html) {
  const template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

// Internationalization support

const translations = {
  // Dialog strings
  'settings_title': {
    zh: '共读设置',
    en: 'Shared Book Collection Settings',
    ja: '共有読書リスト設定'
  },
  'settings_subtitle': {
    zh: '提交后请刷新以应用更改',
    en: 'Please refresh to apply changes',
    ja: '変更を適用するには、ページを更新してください'
  },
  'max_pages_label': {
    zh: '扫描最近读过条目的页数：',
    en: 'Number of pages to scan for recently read items:',
    ja: '最近読んだアイテムをスキャンするページ数：'
  },
  'max_results_label': {
    zh: '最多显示评论数：',
    en: 'Maximum number of comments to display:',
    ja: '表示するコメントの最大数：'
  },
  'show_stars_label': {
    zh: '显示评分：',
    en: 'Show ratings:',
    ja: '評価を表示：'
  },
  'disable_settings_label': {
    zh: '在首页隐藏设置按钮：',
    en: 'Hide settings button on the homepage:',
    ja: 'ホームページで設定ボタンを非表示にする：'
  },
  'disable_settings_help': {
    zh: '（隐藏首页的设置按钮。之后你仍可以在油猴扩展菜单中进行设置。）',
    en: '(Hides the settings button on the homepage. You can still access settings from the Tampermonkey extension menu.)',
    ja: '（ホームページの設定ボタンを非表示にします。設定はTampermonkey拡張機能メニューから引き続きアクセスできます。）'
  },
  'watchlist_label': {
    zh: '关注列表（每行一个条目ID，列表内条目的最新评论总会被获取）：',
    en: 'Watchlist (one item ID per line; the latest comments for items in this list will always be fetched):',
    ja: 'ウォッチリスト（1行に1アイテムID。このリスト内のアイテムの最新コメントは常に取得されます）：'
  },
  'watchlist_placeholder': {
    zh: '例如:\n326125\n329803',
    en: 'Example:\n326125\n329803',
    ja: '例：\n326125\n329803'
  },
  'submit_button': {
    zh: '提交',
    en: 'Submit',
    ja: '送信'
  },
  'reset_button': {
    zh: '重置',
    en: 'Reset',
    ja: 'リセット'
  },
  'close_button': {
    zh: '关闭',
    en: 'Close',
    ja: '閉じる'
  },
  'settings_menu': {
    zh: '设置',
    en: 'Settings',
    ja: '設定'
  },
  // TabItem strings
  'shared_reading': {
    zh: '共读',
    en: 'Shared Reading',
    ja: '共読'
  },
  'settings_gear': {
    zh: '⚙️设置',
    en: '⚙️Settings',
    ja: '⚙️設定'
  },
  // CommentParser strings
  'read_past_tense': {
    zh: ' 读过 ',
    en: ' read ',
    ja: ' が読みました '
  },
  // Language selection
  'language_label': {
    zh: '语言：',
    en: 'Language:',
    ja: '言語：'
  },
  'language_auto': {
    zh: '自动检测',
    en: 'Auto-detect',
    ja: '自動検出'
  },
  'language_zh': {
    zh: '中文',
    en: 'Chinese',
    ja: '中国語'
  },
  'language_en': {
    zh: '英文',
    en: 'English',
    ja: '英語'
  },
  'language_ja': {
    zh: '日文',
    en: 'Japanese',
    ja: '日本語'
  }
};

// Language detection and getter
function getLanguage() {
  const stored = getValue('language');
  if (stored && ['zh', 'en', 'ja'].includes(stored)) {
    return stored;
  }

  // Auto-detect from browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('ja')) return 'ja';
  return 'en'; // Default to English
}
function t(key) {
  const lang = getLanguage();
  return translations[key]?.[lang] || translations[key]?.['en'] || key;
}

;// ./src/CommentParser.ts


/**
 * Parses comments from Bangumi user's book collection pages.
 */
class CommentParser {
  /** The user ID of the current user. */
  uid = CommentParser.getUID();
  /** Maximum number of pages to fetch from the user's collection. */

  /** Maximum number of comments to display. */

  /** Whether to show star ratings in the comments. */

  /** A list of subject IDs to always fetch comments for. */

  /**
   * Initializes a new instance of the CommentParser class.
   * @param max_pages - The maximum number of pages to fetch.
   * @param max_results - The maximum number of results to display.
   * @param show_stars - Whether to show star ratings.
   * @param watchlist - A list of subject IDs to watch.
   */
  constructor(max_pages = 5, max_results = 100, show_stars = true, watchlist = []) {
    this.MAX_PAGES = max_pages;
    this.MAX_RESULTS = max_results;
    this.SHOW_STARS = show_stars;
    this.WATCHLIST = watchlist;
  }

  /**
   * Fetches, parses, and returns comments from the user's collection.
   * @returns A promise that resolves to a sorted and filtered array of comments.
   */
  async fetchComments() {
    const readCollectionURL = `${location.origin}/book/list/${this.uid}/collect`;
    const firstPage = await fetchHTMLDocument(readCollectionURL);
    const maxPageNum = this.getMaxPageNumber(firstPage);
    const pageUrls = Array.from({
      length: Math.max(0, maxPageNum - 1)
    }, (_, i) => `${readCollectionURL}?page=${i + 2}`);
    const otherPages = await Promise.all(pageUrls.map(url => fetchHTMLDocument(url)));
    const allPages = [firstPage, ...otherPages];
    const subjects = this.extractSubjects(allPages);
    const watchlistSubjects = await this.fetchWatchlistSubjects(subjects);
    const allSubjects = [...watchlistSubjects, ...subjects];
    const comments = await this.fetchCommentDetails(allSubjects);
    return this.sortAndFilterComments(comments);
  }

  /**
   * Extracts subject details from the provided collection pages.
   * @param pages - An array of HTML documents representing collection pages.
   * @returns An array of subject objects.
   */
  extractSubjects(pages) {
    return pages.flatMap(page => Array.from(page.getElementById("browserItemList")?.children ?? []).map(child => {
      const link = child.querySelector('a');
      const titleElement = child.querySelector('h3 a');
      const coverElement = child.querySelector('img');
      if (!link || !titleElement || !coverElement) return null;
      return {
        url: `${link.href}/comments`,
        title: titleElement.textContent?.trim() ?? '',
        cover: coverElement.src
      };
    }).filter(subject => subject !== null));
  }

  /**
   * Fetches subjects from the watchlist that are not already in the provided list.
   * @param subjects - An array of already fetched subjects.
   * @returns A promise that resolves to an array of watchlist subjects.
   */
  async fetchWatchlistSubjects(subjects) {
    if (!this.WATCHLIST || this.WATCHLIST.length === 0) {
      return [];
    }
    const existingSubjectIds = new Set(subjects.map(s => s.url.split("/").at(-2)));
    const watchlistIdsToFetch = this.WATCHLIST.filter(id => !existingSubjectIds.has(id));
    return this.sidsToSubjects(watchlistIdsToFetch);
  }

  /**
   * Converts a list of subject IDs to subject objects.
   * @param sids - An array of subject IDs.
   * @returns A promise that resolves to an array of subject objects.
   */
  async sidsToSubjects(sids) {
    const subjectDocs = await Promise.all(sids.map(sid => fetchHTMLDocument(`${location.origin}/subject/${sid}/comments`)));
    return subjectDocs.map((doc, index) => {
      const sid = sids[index];
      return {
        url: `${location.origin}/subject/${sid}/comments`,
        title: doc.querySelector("#headerSubject > h1 > a")?.textContent ?? '',
        cover: doc.querySelector("#subject_inner_info > a > img")?.src ?? ''
      };
    });
  }

  /**
   * Fetches comment details for a list of subjects.
   * @param subjects - An array of subjects to fetch comments for.
   * @returns A promise that resolves to an array of all comments.
   */
  async fetchCommentDetails(subjects) {
    const commentPages = await Promise.all(subjects.map(subject => fetchHTMLDocument(subject.url)));
    return commentPages.flatMap((page, i) => this.extractCommentsFromPage(page, subjects[i]));
  }

  /**
   * Extracts all comments from a single subject's comment page.
   * @param page - The HTML document of the comment page.
   * @param subject - The subject the comments belong to.
   * @returns An array of comments from the page.
   */
  extractCommentsFromPage(page, subject) {
    const commentDivs = Array.from(page.getElementsByClassName("item clearit"));
    return commentDivs.map(div => this.parseCommentDivToBgmComment(div, subject)).filter(Boolean);
  }

  /**
   * Parses a single comment div into a BgmComment object.
   * @param commentDiv - The HTMLDivElement for the comment.
   * @param subject - The subject the comment belongs to.
   * @returns A BgmComment object or null if parsing fails.
   */
  parseCommentDivToBgmComment(commentDiv, subject) {
    try {
      const avatarElement = commentDiv.querySelector('.avatar > span');
      const userUrl = `${location.origin}${commentDiv.querySelector('a.avatar')?.getAttribute('href')}`;
      const username = commentDiv.querySelector('.text_container .l')?.textContent ?? '';
      const dateText = commentDiv.querySelector('.text_container small:last-of-type')?.textContent?.split('@')[1]?.trim() ?? '';
      const commentText = commentDiv.querySelector('.text_container p')?.textContent ?? '';
      const starElement = commentDiv.querySelector('.starlight');
      const stars = starElement ? parseInt(starElement.className.match(/stars(\d+)/)?.[1] ?? '0', 10) : 0;
      return {
        subjectCover: subject.cover,
        subjectTitle: subject.title,
        subjectUrl: subject.url.replace(/\/[^\/]*$/, ''),
        userAvatarElement: this.createAvatarElement(avatarElement.style.backgroundImage, userUrl),
        userUrl,
        username,
        date: parseTimestamp(dateText),
        comment: commentText,
        stars
      };
    } catch (error) {
      console.error("Failed to parse comment div:", error, commentDiv);
      return null;
    }
  }

  /**
   * Creates an HTML element for a user's avatar.
   * @param imageUrl - The URL of the avatar image.
   * @param userUrl - The URL to the user's profile.
   * @returns An HTMLSpanElement representing the avatar.
   */
  createAvatarElement(imageUrl, userUrl) {
    const outerSpan = document.createElement('span');
    outerSpan.classList.add('avatar');
    const anchor = document.createElement('a');
    anchor.href = userUrl;
    anchor.classList.add('avatar');
    const imgSpan = document.createElement('span');
    imgSpan.classList.add('avatarNeue', 'avatarReSize40', 'll');
    imgSpan.style.backgroundImage = imageUrl;
    anchor.appendChild(imgSpan);
    outerSpan.appendChild(anchor);
    return outerSpan;
  }

  /**
   * Converts a list of comments into an HTML list element.
   * @param comments - An array of comments.
   * @returns An HTMLUListElement containing the rendered comments.
   */
  commentDataToTLList(comments) {
    const ul = document.createElement("ul");
    comments.forEach(comment => {
      const li = this.createDetailedLI(comment);
      ul.appendChild(li);
    });
    return ul;
  }

  /**
   * Creates a detailed list item element for a single comment.
   * @param comment - The comment object.
   * @returns An HTMLLIElement representing the comment.
   */
  createDetailedLI(comment) {
    const li = document.createElement('li');
    li.className = 'clearit tml_item';

    // User Avatar
    li.appendChild(comment.userAvatarElement);

    // Subject Cover
    const coverAnchor = document.createElement('a');
    coverAnchor.href = comment.subjectUrl;
    coverAnchor.className = 'l rr';
    const coverSpan = document.createElement('span');
    coverSpan.className = 'cover';
    const img = document.createElement('img');
    img.src = comment.subjectCover;
    img.alt = comment.subjectTitle;
    img.width = 60;
    coverSpan.appendChild(img);
    coverAnchor.appendChild(coverSpan);
    li.appendChild(coverAnchor);

    // Main Info Container
    const infoSpan = document.createElement('span');
    infoSpan.className = 'info clearit';
    infoSpan.style.display = 'flex';
    infoSpan.style.alignItems = 'center';
    infoSpan.style.flexWrap = 'wrap';
    infoSpan.style.columnGap = '4px';

    // Username and Action Text
    const userAnchor = document.createElement('a');
    userAnchor.href = comment.userUrl;
    userAnchor.className = 'l';
    userAnchor.textContent = comment.username;
    infoSpan.appendChild(userAnchor);
    infoSpan.appendChild(document.createTextNode(t('read_past_tense')));

    // Subject Title
    const subjectAnchor = document.createElement('a');
    subjectAnchor.href = comment.subjectUrl;
    subjectAnchor.className = 'l';
    subjectAnchor.textContent = comment.subjectTitle;
    infoSpan.appendChild(subjectAnchor);

    // Comment and Stars
    const collectInfoDiv = document.createElement('div');
    collectInfoDiv.className = 'collectInfo';
    collectInfoDiv.style.flexBasis = '100%';
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.textContent = comment.comment;
    commentDiv.style.flexBasis = '100%';
    if (this.SHOW_STARS && comment.stars > 0) {
      const starsSpan = document.createElement('span');
      starsSpan.className = 'starstop-s';
      starsSpan.style.margin = '0 4px';
      const starlightSpan = document.createElement('span');
      starlightSpan.className = `starlight stars${comment.stars}`;
      starsSpan.appendChild(starlightSpan);
      infoSpan.appendChild(starsSpan);
    }
    collectInfoDiv.appendChild(commentDiv);
    infoSpan.appendChild(collectInfoDiv);

    // Post Date
    const dateDiv = document.createElement('div');
    dateDiv.className = 'post_actions date';
    dateDiv.textContent = comment.date.toLocaleString();
    dateDiv.style.flexBasis = '100%';
    infoSpan.appendChild(dateDiv);
    li.appendChild(infoSpan);
    return li;
  }

  /**
   * Gets the maximum page number from the pagination control.
   * @param firstPage - The HTML document of the first collection page.
   * @returns The maximum page number to fetch.
   */
  getMaxPageNumber(firstPage) {
    const paginator = firstPage.querySelector('.page_inner');
    if (!paginator) return 1;
    const pageLinks = Array.from(paginator.querySelectorAll('a.p')).map(node => parseInt(node.href.match(/page=(\d+)$/)?.[1] ?? '0', 10));
    const maxPage = Math.max(1, ...pageLinks);
    return Math.min(this.MAX_PAGES, maxPage);
  }

  /**
   * Sorts and filters the comments.
   * @param comments - The array of comments to process.
   * @returns A sorted and filtered array of comments.
   */
  sortAndFilterComments(comments) {
    return comments.filter(comment => comment && !comment.userUrl.includes(this.uid)) // Filter out own comments
    .sort((a, b) => b.date.getTime() - a.date.getTime()) // Sort by date descending
    .slice(0, this.MAX_RESULTS); // Limit results
  }

  /**
   * Gets the current user's ID from the page header.
   * @returns The user ID.
   */
  static getUID() {
    const link = document.querySelector("#headerNeue2 .idBadgerNeue a");
    return link?.href.split("user/")?.[1] ?? '';
  }
}
;// ./src/Dialog.ts

const createSettingsDialog = cp => {
  const dialog = htmlToElement(`
  <dialog id="dialog">
    <form id="dialog-form" method="dialog">
      <h2>${t('settings_title')}</h2>
      <h3>${t('settings_subtitle')}</h3>
      <div>
        <label for="maxpages">${t('max_pages_label')}</label>
        <input id="maxpages" name="maxpages" type="number" value="${getValue("maxpages") || cp.MAX_PAGES}" min="1" />
      </div>
      <div>
        <label for="maxresults">${t('max_results_label')}</label>
        <input id="maxresults" name="maxresults" type="number" value="${getValue("maxresults") || cp.MAX_RESULTS}" min="1" />
      </div>
      <div>
        <label for="showstars">${t('show_stars_label')}</label>
        <input type="hidden" name="showstars" value="false" />
        <input id="showstars" name="showstars" type="checkbox" value="true" ${getValue("showstars") ? "checked" : ""} />
      </div>
      <div>
        <label for="language">${t('language_label')}</label>
        <select id="language" name="language">
          <option value="" ${!getValue("language") ? "selected" : ""}>${t('language_auto')}</option>
          <option value="zh" ${getValue("language") === "zh" ? "selected" : ""}>${t('language_zh')}</option>
          <option value="en" ${getValue("language") === "en" ? "selected" : ""}>${t('language_en')}</option>
          <option value="ja" ${getValue("language") === "ja" ? "selected" : ""}>${t('language_ja')}</option>
        </select>
      </div>
      <div>
        <label for="watchlist">${t('watchlist_label')}</label>
        <br />
        <textarea id="watchlist" name="watchlist" class="quick" rows="6" cols="10" placeholder="${t('watchlist_placeholder')}">${(getValue("watchlist") || []).map(s => s.trim()).join("\n")}</textarea>
      </div>
      <div>
        <button type="submit">${t('submit_button')}</button>
        <button type="reset">${t('reset_button')}</button>
        <button type="button" onclick="document.getElementById('dialog').close()">${t('close_button')}</button>
      </div>
    </form>
  </dialog>`);
  dialog.firstElementChild.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = new FormData(e.target);
    [...data.entries()].forEach(kv => {
      const k = kv[0];
      let v = kv[1];
      if (k === "watchlist") {
        v = kv[1].split("\n").filter(n => Number.isInteger(Number(n)) && Number(n) > 0);
      } else if (k === "showstars") {
        v = v === "true";
      } else if (k === "language") {
        v = v === "" ? null : v; // Store null for auto-detect
      }
      setValue(k, v);
    });
    dialog.close();
  });

  // dialog style
  dialog.style.borderRadius = "12px";
  dialog.style.borderColor = "#F09199";
  dialog.style.boxShadow = "0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25)";

  // inject dialog element
  document.body.appendChild(dialog);

  // Return the dialog so it can be opened from elsewhere
  return dialog;
};
;// ./src/TabItem.ts


/**
 * Represents the state of the tab, including its display text and cursor style.
 */

/**
 * Manages the "Shared Reading" tab in the timeline interface.
 * This class handles the creation, state management (loading, done),
 * and interactions of the tab.
 */
class TabItem {
  /** Defines the possible states of the tab. */
  states = {
    loading: {
      text: "⏳",
      cursor: "wait"
    },
    done: {
      text: t('shared_reading'),
      cursor: "pointer"
    }
  };
  /** The list item element for the tab. */
  li = document.createElement("li");
  /** The anchor element within the tab. */
  a = document.createElement("a");

  /**
   * Initializes a new instance of the TabItem class.
   */
  constructor() {
    // Initialize tab elements
    this.a.id = "tab_bsbc";
    this.applyState(this.states.loading);
    this.li.appendChild(this.a);

    // Add the tab to the timeline tabs list
    document.getElementById('timelineTabs')?.appendChild(this.li);
  }

  /**
   * Creates the settings gear anchor element and its parent list item.
   * @returns The list item element containing the settings anchor.
   */
  createSettingsLink() {
    const a = document.createElement("a");
    a.textContent = t('settings_gear');
    a.style.cursor = "pointer";
    a.onclick = () => {
      const dialog = document.getElementById("dialog");
      dialog?.showModal();
    };
    const li = document.createElement("li");
    li.appendChild(a);
    return li;
  }

  /**
   * Applies a given state to the tab's anchor element.
   * @param state - The state to apply.
   */
  applyState(state) {
    this.a.textContent = state.text;
    this.a.style.cursor = state.cursor;
  }

  /**
   * Finalizes the tab's setup once content has loaded.
   * It sets the tab to the "done" state and attaches click handlers.
   * @param nodes - The DOM nodes to display when the tab is clicked.
   */
  onLoaded(...nodes) {
    this.applyState(this.states.done);

    // Add onclick handler to switch tabs and display content
    this.a.onclick = () => {
      if (this.a.classList.contains("focus")) return;

      // De-select other tabs
      ["tab_all", "tab_say", "tab_subject", "tab_progress", "tab_blog"].forEach(id => {
        document.getElementById(id)?.classList.remove("focus");
      });

      // Select this tab
      this.a.classList.add("focus");

      // Display the new content
      document.getElementById("timeline")?.replaceChildren(...nodes);
    };

    // Add settings button to the tab list
    document.getElementById('timelineTabs')?.appendChild(this.createSettingsLink());
  }
}
;// ./src/index.ts





/**
 * The main execution flow of the script.
 */
async function run() {
  // Initialize the tab item
  const tabItem = new TabItem();

  // Create a CommentParser instance with user-defined settings.
  const cp = new CommentParser(getValue("maxpages"), getValue("maxresults"), !!getValue("showstars"), getValue("watchlist"));

  // Fetch comments and then update the UI.
  const comments = await cp.fetchComments();
  createSettingsDialog(cp);
  tabItem.onLoaded(cp.commentDataToTLList(comments));
}

/**
 * Script entry point.
 * Wraps the main execution in a try-catch block to handle any unexpected errors.
 */
function main() {
  try {
    run();
  } catch (e) {
    console.error("An error occurred during script execution:", e);
  }
}
main();
/******/ })()
;
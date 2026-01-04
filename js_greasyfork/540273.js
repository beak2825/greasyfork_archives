// ==UserScript==
// @name       素问通读助手
// @name:zh-CN       素问通读助手
// @name:en       sooon-read-through-assistance
// @description  阅读记录、键盘操作、筛选已读
// @description:zh-CN       阅读记录、键盘操作、筛选已读
// @description:en       Reading history, keyboard operations, filtering read
// @namespace  https://greasyfork.org/zh-CN/scripts/540273
// @version    1.1.1
// @author     monkey
// @icon       https://sooon.ai/assets/favicon-BRntVMog.ico
// @match      https://sooon.ai/**
// @grant      GM_registerMenuCommand
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/540273/%E7%B4%A0%E9%97%AE%E9%80%9A%E8%AF%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/540273/%E7%B4%A0%E9%97%AE%E9%80%9A%E8%AF%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
// ==/UserScript==

(function () {
  'use strict';

  const APP_NAME = "素问通读助手";
  function getTimeStr() {
    const d = /* @__PURE__ */ new Date();
    return d.toTimeString().slice(0, 8);
  }
  function formatLog(args) {
    let prefix = `[${APP_NAME}]`;
    prefix += ` [${getTimeStr()}]`;
    return [prefix, ...args];
  }
  const log = (...a) => {
    a.map(String).join(" ");
    console.log(...formatLog(a));
  };
  const warn = (...a) => {
    a.map(String).join(" ");
    console.warn(...formatLog(a));
  };
  async function waitForElement(selector, options = {}) {
    const {
      timeout = 5e3,
      interval = 100,
      maxRetries = 50,
      noError = false
    } = options;
    return new Promise((resolve, reject) => {
      let retries = 0;
      const startTime = Date.now();
      const find = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= timeout) {
          if (noError) {
            resolve(null);
          } else {
            reject(new Error(`Element ${selector} not found after ${timeout}ms timeout`));
          }
          return;
        }
        if (retries >= maxRetries) {
          if (noError) {
            resolve(null);
          } else {
            reject(new Error(`Element ${selector} not found after ${maxRetries} retries`));
          }
          return;
        }
        retries++;
        setTimeout(find, interval);
      };
      find();
    });
  }
  const ls = {
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
      const value = localStorage.getItem(key);
      try {
        return value === null ? null : JSON.parse(value);
      } catch (e) {
        return value;
      }
    },
    remove(key) {
      localStorage.removeItem(key);
    },
    clear() {
      localStorage.clear();
    },
    keys() {
      return Object.keys(localStorage);
    },
    has(key) {
      return localStorage.getItem(key) !== null;
    }
  };
  const MODAL_SELECTORS = {
    DIALOG: 'body > div:has(> div.fixed.inset-0.isolate.z-\\$mantine-z-index-modal) div[role="dialog"][aria-modal="true"]:not([class*="Drawer"])',
    CLOSE_BUTTON: 'body > div:has(> div.fixed.inset-0.isolate.z-\\$mantine-z-index-modal) div[role="dialog"][aria-modal="true"]:not([class*="Drawer"]) header button:has(svg.tabler-icon-chevron-left)',
    CONTENT_SCROLL: "body > div:nth-child(7) > div.fixed.inset-0.isolate.z-\\$mantine-z-index-modal.overflow-hidden > div > div > section > div > div.flex-1.flex.flex-col.overflow-hidden._mask_a535l_1 > div > div.outline-none"
  };
  const LIST_SELECTORS = {
    VIEWPORT: "div[data-overlayscrollbars-viewport]",
    CONTENT: 'div[style*="overflow-anchor: none"]',
    ITEM_WRAPPER: 'div[style*="position: absolute"]',
    ITEM_CONTENT: "div.flex.flex-col.gap-2.p-4",
    ITEM_CLICKABLE: 'button.mantine-UnstyledButton-root[type="button"].flex.flex-col'
  };
  const PAGINATION_SELECTORS = {
    CONTAINER: "#root > div > div > div > main > div.flex-1.flex.flex-col.overflow-hidden > div > div.flex-1.flex.flex-col.overflow-hidden > div > div.flex.items-center.justify-center.px-2.pt-1.pb-1 > div",
    PREV_PAGE: "div.flex.items-center.justify-center.px-2.pt-1.pb-1 > div > div > button:nth-child(1)",
    NEXT_PAGE: "div.flex.items-center.justify-center.px-2.pt-1.pb-1 > div > div > button:nth-child(3)",
    PAGE_INPUT: 'input[name="page"]'
  };
  const EDIT_DRAWER_SELECTORS = {
    DRAWER: "div.m_5df29311.mantine-Drawer-body",
    COLLECTION_CHECKBOX: 'button[role="checkbox"].mantine-CheckboxCard-card',
    EDIT_BUTTON: "button svg.tabler-icon-bookmarks",
    SAVE_BUTTON: 'button[type="submit"]'
  };
  const HIGHLIGHT_CLASS = "userscript-keyboard-focused-item";
  const SCROLL_CONFIG = {
    ARTICLE_SCROLL_AMOUNT: 300
  };
  let currentFocusedItem = null;
  function isArticleModalOpen() {
    const modals = document.querySelectorAll(MODAL_SELECTORS.DIALOG);
    for (const modal of modals) {
      const titleElement = modal.querySelector("header h4.select-none.text-lg");
      const hasLexicalEditor = modal.querySelector('div[data-lexical-editor="true"]');
      if (titleElement && titleElement.textContent.trim() === "参考源" && hasLexicalEditor) {
        const computedStyle = window.getComputedStyle(modal);
        return computedStyle.opacity === "1" && computedStyle.display !== "none";
      }
    }
    return false;
  }
  function closeArticleModal() {
    const closeButton = document.querySelector(MODAL_SELECTORS.CLOSE_BUTTON);
    if (closeButton) {
      closeButton.click();
      return true;
    }
    return false;
  }
  function getVisibleArticleItems() {
    const container = document.querySelector(`${LIST_SELECTORS.VIEWPORT} > ${LIST_SELECTORS.CONTENT}`);
    if (!container) return [];
    return Array.from(container.querySelectorAll(`${LIST_SELECTORS.ITEM_WRAPPER} > ${LIST_SELECTORS.ITEM_CONTENT}`)).filter((el) => el.offsetParent !== null);
  }
  function highlightItem(itemElement) {
    if (!itemElement) return;
    if (currentFocusedItem) {
      currentFocusedItem.classList.remove(HIGHLIGHT_CLASS);
    }
    itemElement.classList.add(HIGHLIGHT_CLASS);
    itemElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    currentFocusedItem = itemElement;
  }
  async function clickPageButton$1(direction) {
    try {
      let buttonSelector;
      if (direction === "prev") {
        buttonSelector = PAGINATION_SELECTORS.PREV_PAGE;
      } else if (direction === "next") {
        buttonSelector = PAGINATION_SELECTORS.NEXT_PAGE;
      } else {
        console.warn(`[Navigation] Invalid direction: ${direction}`);
        return false;
      }
      const button = document.querySelector(buttonSelector);
      if (!button) {
        console.warn(`[Navigation] Button not found for direction: ${direction}`);
        return false;
      }
      if (button.disabled || button.classList.contains("disabled")) {
        console.log(`[Navigation] Button is disabled for direction: ${direction}`);
        return false;
      }
      console.log(`[Navigation] Clicking ${direction} page button`);
      button.click();
      return true;
    } catch (error) {
      console.warn(`[Navigation] Error clicking ${direction} page button:`, error);
      return false;
    }
  }
  function scrollArticleContent(direction) {
    const scrollContainer = document.querySelector(MODAL_SELECTORS.CONTENT_SCROLL);
    if (!scrollContainer) return;
    const scrollAmount = direction * SCROLL_CONFIG.ARTICLE_SCROLL_AMOUNT;
    scrollContainer.scrollBy({
      top: scrollAmount,
      behavior: "smooth"
    });
  }
  async function switchArticle(direction) {
    const items = getVisibleArticleItems();
    if (items.length === 0) return;
    let currentIndex = currentFocusedItem ? items.indexOf(currentFocusedItem) : -1;
    let nextIndex = currentIndex + direction;
    const wasArticleOpen = isArticleModalOpen();
    if (wasArticleOpen) {
      closeArticleModal();
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    if (nextIndex < 0 || nextIndex >= items.length) {
      const pageDirection = direction < 0 ? "prev" : "next";
      const success = await clickPageButton$1(pageDirection);
      if (success) {
        setTimeout(() => {
          const newItems = getVisibleArticleItems();
          if (newItems.length > 0) {
            const targetItem = direction < 0 ? newItems[newItems.length - 1] : newItems[0];
            highlightItem(targetItem);
            if (wasArticleOpen) {
              setTimeout(() => {
                openFocusedArticle();
              }, 100);
            }
          }
        }, 500);
      }
      return;
    }
    highlightItem(items[nextIndex]);
    if (wasArticleOpen) {
      setTimeout(() => {
        openFocusedArticle();
      }, 100);
    }
  }
  function openFocusedArticle() {
    if (!currentFocusedItem) return;
    const clickable = currentFocusedItem.querySelector(LIST_SELECTORS.ITEM_CLICKABLE);
    if (clickable) {
      clickable.click();
    }
  }
  function isEditDrawerOpen() {
    const drawerBody = document.querySelector(EDIT_DRAWER_SELECTORS.DRAWER);
    if (!drawerBody) return false;
    const drawerDialog = drawerBody.closest('div[role="dialog"]');
    if (!drawerDialog) return true;
    const computedStyle = window.getComputedStyle(drawerDialog);
    return computedStyle.opacity === "1" && computedStyle.display !== "none";
  }
  function openEditDrawer() {
    if (isEditDrawerOpen()) return false;
    if (!isArticleModalOpen()) return false;
    const itemDetailModal = document.querySelector(
      'div[role="dialog"][aria-modal="true"]:not([class*="Drawer"]) header ~ section'
    );
    if (!itemDetailModal) return false;
    const tagPlusButtonIcon = itemDetailModal.querySelector(EDIT_DRAWER_SELECTORS.EDIT_BUTTON);
    if (tagPlusButtonIcon) {
      const tagPlusButton = tagPlusButtonIcon.closest("button");
      if (tagPlusButton) {
        tagPlusButton.click();
        return true;
      }
    }
    return false;
  }
  function getCollectionCheckboxes() {
    if (!isEditDrawerOpen()) return [];
    const drawerBody = document.querySelector(EDIT_DRAWER_SELECTORS.DRAWER);
    if (!drawerBody) return [];
    const checkboxes = drawerBody.querySelectorAll(EDIT_DRAWER_SELECTORS.COLLECTION_CHECKBOX);
    return Array.from(checkboxes).map((checkbox, index) => {
      const titleElement = checkbox.querySelector("h5.mantine-Title-root");
      const title = titleElement ? titleElement.textContent.trim() : `未知标题 ${index + 1}`;
      const isChecked = checkbox.getAttribute("aria-checked") === "true";
      return { element: checkbox, title, isChecked, index };
    });
  }
  function toggleCollectionItem(index) {
    const collections = getCollectionCheckboxes();
    if (index >= 0 && index < collections.length) {
      collections[index].element.click();
      return true;
    }
    return false;
  }
  function saveEditDrawer() {
    if (!isEditDrawerOpen()) return false;
    const drawerBody = document.querySelector(EDIT_DRAWER_SELECTORS.DRAWER);
    if (!drawerBody) return false;
    const saveButton = drawerBody.querySelector(EDIT_DRAWER_SELECTORS.SAVE_BUTTON);
    if (saveButton) {
      saveButton.click();
      return true;
    }
    return false;
  }
  function initKeyboardNavigation() {
    const style = document.createElement("style");
    style.textContent = `
        .${HIGHLIGHT_CLASS} {
            outline: 3px solid #FF8C00 !important;
            box-shadow: 0 0 8px #FF8C00 !important;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);
    document.addEventListener("keydown", async (event) => {
      if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA" || event.target.isContentEditable) {
        return;
      }
      const key = event.key.toLowerCase();
      if (isEditDrawerOpen() && /^[1-9]$/.test(key)) {
        event.preventDefault();
        const index = parseInt(key) - 1;
        toggleCollectionItem(index);
        return;
      }
      switch (key) {
        case "w":
          if (isArticleModalOpen()) {
            event.preventDefault();
            scrollArticleContent(-1);
          }
          break;
        case "s":
          if (isArticleModalOpen()) {
            event.preventDefault();
            scrollArticleContent(1);
          }
          break;
        case "a":
          event.preventDefault();
          await switchArticle(-1);
          break;
        case "d":
          event.preventDefault();
          await switchArticle(1);
          break;
        case "f":
          event.preventDefault();
          openFocusedArticle();
          break;
        case "q":
          event.preventDefault();
          if (isArticleModalOpen()) {
            closeArticleModal();
          } else {
            await clickPageButton$1("prev");
          }
          break;
        case "e":
          event.preventDefault();
          await clickPageButton$1("next");
          break;
        case "r":
          event.preventDefault();
          if (isArticleModalOpen()) {
            if (isEditDrawerOpen()) {
              saveEditDrawer();
            } else {
              openEditDrawer();
            }
          }
          break;
      }
    });
    setTimeout(() => {
      const items = getVisibleArticleItems();
      if (items.length > 0) {
        highlightItem(items[0]);
      }
    }, 500);
  }
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  const FILTER_COUNT_KEY = "sooon_filter_count";
  const STORAGE_KEY = "sooon_page_state";
  const IGNORE_SET_KEY = "sooon_ignore_set";
  const AUTO_PAGE_DIRECTION_KEY = "sooon_auto_page_direction";
  const AUTO_PAGE_INTERVAL_KEY = "sooon_auto_page_interval";
  let hasRestoredPage = false;
  let isProcessing = false;
  let lastProcessedPath = null;
  let saveStateTimeout = null;
  let autoPageTimer = null;
  let lastListCheckTime = 0;
  const SELECTORS = {
    PAGINATION: {
      CONTAINER: "#root > div > div > div > main > div.flex-1.flex.flex-col.overflow-hidden > div > div.flex-1.flex.flex-col.overflow-hidden > div > div.flex.items-center.justify-center.px-2.pt-1.pb-1 > div",
      NEXT_PAGE: "div.flex.items-center.justify-center.px-2.pt-1.pb-1 > div > div > button:nth-child(3)",
      PREV_PAGE: "div.flex.items-center.justify-center.px-2.pt-1.pb-1 > div > div > button:nth-child(1)",
      PAGE_INPUT: 'input[name="page"]',
      SORT_BUTTON: "#root > div > main > div.flex-1.flex.flex-col.overflow-hidden > div > div.flex-1.flex.flex-col.overflow-hidden > div > div.flex.items-center.justify-center.px-2.pt-1.pb-1 > div > button:nth-child(1)"
    },
    ARTICLE: {
      CONTAINER: "#root > div > div > div > main > div.flex-1.flex.flex-col.overflow-hidden > div > div.flex-1.flex.flex-col.overflow-hidden > div > div.flex-1.flex.flex-col.overflow-hidden > div > div > div > div._children_whrto_2.flex-1 > div",
      LIST: "div[data-autofocus]",
      ITEM: "div.w-full",
      READ_COUNT_ICON: "svg.tabler-icon-eye",
      STATS_CONTAINER: "#root > div > main > div.flex.flex-col.w-full.px-2.pt-2.pb-2.min-h-13 > div"
    }
  };
  const getIgnoreSet = () => {
    const stored = ls.get(IGNORE_SET_KEY);
    return stored ? new Set(stored) : /* @__PURE__ */ new Set();
  };
  const saveIgnoreSet = (set) => {
    ls.set(IGNORE_SET_KEY, Array.from(set));
  };
  const addToIgnoreSet = (articleId) => {
    const ignoreSet = getIgnoreSet();
    ignoreSet.add(articleId);
    saveIgnoreSet(ignoreSet);
  };
  const getFilterCount = () => {
    const stored = ls.get(FILTER_COUNT_KEY);
    return stored !== null ? parseInt(stored, 10) : 1;
  };
  const setFilterCount = (count) => {
    if (count >= 0) {
      ls.set(FILTER_COUNT_KEY, count);
      return true;
    }
    return false;
  };
  const getAutoPageDirection = () => {
    const stored = ls.get(AUTO_PAGE_DIRECTION_KEY);
    return stored || "next";
  };
  const setAutoPageDirection = (direction) => {
    if (direction === "next" || direction === "prev") {
      ls.set(AUTO_PAGE_DIRECTION_KEY, direction);
      return true;
    }
    return false;
  };
  const getAutoPageInterval = () => {
    const stored = ls.get(AUTO_PAGE_INTERVAL_KEY);
    return stored !== null ? parseInt(stored, 10) : 5e3;
  };
  const setAutoPageInterval = (interval) => {
    const parsedInterval = parseInt(interval, 10);
    if (!isNaN(parsedInterval) && parsedInterval >= 1e3 && parsedInterval <= 6e4) {
      ls.set(AUTO_PAGE_INTERVAL_KEY, parsedInterval);
      return true;
    }
    return false;
  };
  const registerMenuCommands = () => {
    _GM_registerMenuCommand("🔍 设置过滤阈值 (FC)", () => {
      const currentCount = getFilterCount();
      const newCount = prompt("请输入新的筛选阈值（0或更大的数字）：\n设置为0表示暂停过滤", currentCount);
      if (newCount !== null) {
        const parsedCount = parseInt(newCount, 10);
        if (!isNaN(parsedCount) && parsedCount >= 0) {
          if (setFilterCount(parsedCount)) {
            filterArticlesByReadCount();
          }
        } else {
          alert("请输入有效的数字（0或更大）");
        }
      }
    });
    _GM_registerMenuCommand("🔄 设置自动翻页方向", () => {
      const currentDirection = getAutoPageDirection();
      const direction = prompt(
        '请选择自动翻页方向：\n输入 "next" 或 "n" 表示下一页\n输入 "prev" 或 "p" 表示上一页\n当前设置：' + (currentDirection === "next" ? "下一页" : "上一页"),
        currentDirection
      );
      if (direction !== null) {
        const normalizedDirection = direction.toLowerCase().startsWith("n") ? "next" : direction.toLowerCase().startsWith("p") ? "prev" : direction;
        if (setAutoPageDirection(normalizedDirection)) {
          log(`[AutoPage] 自动翻页方向已设置为: ${normalizedDirection === "next" ? "下一页" : "上一页"}`);
          alert(`自动翻页方向已设置为: ${normalizedDirection === "next" ? "下一页" : "上一页"}`);
        } else {
          alert("请输入有效的方向：next/n 或 prev/p");
        }
      }
    });
    _GM_registerMenuCommand("⏱️ 设置自动翻页检测间隔", () => {
      const currentInterval = getAutoPageInterval();
      const interval = prompt(
        "请设置自动翻页检测间隔（毫秒）：\n输入1000-60000之间的数字\n1000毫秒 = 1秒\n当前设置：" + currentInterval + "毫秒（" + currentInterval / 1e3 + "秒）",
        currentInterval
      );
      if (interval !== null) {
        const parsedInterval = parseInt(interval, 10);
        if (setAutoPageInterval(parsedInterval)) {
          log(`[AutoPage] 自动翻页检测间隔已设置为: ${parsedInterval}毫秒（${parsedInterval / 1e3}秒）`);
          alert(`自动翻页检测间隔已设置为: ${parsedInterval}毫秒（${parsedInterval / 1e3}秒）`);
        } else {
          alert("请输入有效的间隔时间：1000-60000之间的数字");
        }
      }
    });
  };
  const updateReadProgress = async (totalItems, ignoredCount) => {
    const container = await waitForElement(SELECTORS.ARTICLE.STATS_CONTAINER);
    if (!container) return;
    let progressButton = container.querySelector(".read-progress-button");
    if (!progressButton) {
      progressButton = document.createElement("button");
      progressButton.className = "mantine-focus-never mantine-active px-0 m_77c9d27d mantine-Button-root m_87cf2631 mantine-UnstyledButton-root read-progress-button";
      progressButton.setAttribute("data-variant", "transparent");
      progressButton.setAttribute("type", "button");
      progressButton.style.cssText = "--button-bg: transparent; --button-hover: transparent; --button-color: var(--mantine-color-primary-light-color); --button-bd: calc(0.0625rem * var(--mantine-scale)) solid transparent;";
      const percentage = (ignoredCount / totalItems * 100).toFixed(1);
      progressButton.innerHTML = `
            <span class="m_80f1301b mantine-Button-inner">
                <span class="m_811560b9 mantine-Button-label">
                    <div class="flex items-center gap-1 text-$mantine-primary-color-light-color">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-eye w-6 h-6">
                            <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                            <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path>
                        </svg>
                        <div class="font-semibold text-lg progress-text">
                            <span>${percentage}%</span>
                        </div>
                    </div>
                </span>
            </span>
        `;
      progressButton.addEventListener("mouseenter", () => {
        const textDiv = progressButton.querySelector(".progress-text");
        if (textDiv) {
          textDiv.innerHTML = `<span>${ignoredCount}/${totalItems}</span>`;
        }
      });
      progressButton.addEventListener("mouseleave", () => {
        const textDiv = progressButton.querySelector(".progress-text");
        if (textDiv) {
          textDiv.innerHTML = `<span>${percentage}%</span>`;
        }
      });
      const targetButton = container.querySelector("button:nth-child(5)");
      if (targetButton) {
        container.insertBefore(progressButton, targetButton);
      } else {
        container.appendChild(progressButton);
      }
    } else {
      const percentage = (ignoredCount / totalItems * 100).toFixed(1);
      const textDiv = progressButton.querySelector(".progress-text");
      if (textDiv) {
        textDiv.innerHTML = `<span>${percentage}%</span>`;
      }
      const existingEnter = progressButton._mouseenterHandler;
      const existingLeave = progressButton._mouseleaveHandler;
      if (existingEnter) {
        progressButton.removeEventListener("mouseenter", existingEnter);
      }
      if (existingLeave) {
        progressButton.removeEventListener("mouseleave", existingLeave);
      }
      const enterHandler = () => {
        if (textDiv) {
          textDiv.innerHTML = `<span>${ignoredCount}/${totalItems}</span>`;
        }
      };
      const leaveHandler = () => {
        if (textDiv) {
          textDiv.innerHTML = `<span>${percentage}%</span>`;
        }
      };
      progressButton.addEventListener("mouseenter", enterHandler);
      progressButton.addEventListener("mouseleave", leaveHandler);
      progressButton._mouseenterHandler = enterHandler;
      progressButton._mouseleaveHandler = leaveHandler;
    }
  };
  const getPage = () => {
    const page = Number(window.location.pathname.split("/").pop()) || 1;
    log(`[Page Detection] Current page number: ${page}`);
    return page;
  };
  const getPageParam = async () => {
    log("[Page Parameters] Starting to fetch page parameters...");
    const page = getPage();
    log("[Page Parameters] Waiting for page size element...");
    const pageSizeSelector = "div.flex.items-center.justify-center.px-2.pt-1.pb-1 > div > button:nth-child(3) > span";
    const pageSize = Number((await waitForElement(pageSizeSelector)).textContent);
    log(`[Page Parameters] Page size detected: ${pageSize}`);
    log("[Page Parameters] Checking sort order...");
    const newAtFirstSelector = "div.flex.items-center.justify-center.px-2.pt-1.pb-1 > div > button:nth-child(1) > span > svg";
    const newAtFirst = (await waitForElement(newAtFirstSelector)).classList.contains("tabler-icon-sort-descending");
    log(`[Page Parameters] Sort order - New items first: ${newAtFirst}`);
    log("[Page Parameters] Getting total page count...");
    const allPageSelector = "div.flex.items-center.justify-center.px-2.pt-1.pb-1 > div > div > div > button > div";
    const allPage = Number((await waitForElement(allPageSelector)).textContent);
    log(`[Page Parameters] Total pages: ${allPage}`);
    const params = { page, pageSize, newAtFirst, allPage };
    log("[Page Parameters] Complete parameters:", params);
    return params;
  };
  const loadStoredPage = () => {
    log("[Storage] Loading stored page state...");
    const defaultState = { page: 1, pageSize: 20, newAtFirst: true };
    const storedState = ls.get(STORAGE_KEY);
    if (storedState) {
      log("[Storage] Found stored state:", storedState);
    } else {
      log("[Storage] No stored state found, using defaults:", defaultState);
    }
    return storedState || defaultState;
  };
  const debouncedSavePageState = (state) => {
    if (saveStateTimeout) {
      clearTimeout(saveStateTimeout);
    }
    saveStateTimeout = setTimeout(() => {
      log("[Storage] Saving page state (debounced):", state);
      ls.set(STORAGE_KEY, state);
    }, 300);
  };
  const filterArticlesByReadCount = async () => {
    log(`[Filter] Starting to observe articles with read count >= ${getFilterCount()}`);
    const articleList = await waitForElement(SELECTORS.ARTICLE.LIST);
    if (!articleList) {
      warn("[Filter] Cannot find article list container");
      return false;
    }
    let visibleCount = 0;
    let hiddenCount = 0;
    let unreadCount = 0;
    const processEyeIcon = (icon) => {
      const item = icon.closest(SELECTORS.ARTICLE.ITEM);
      if (!item) return;
      const titleElement = item.querySelector(".font-semibold");
      const contentElement = item.querySelector("._text_1alq7_1");
      const articleContent = `${(titleElement == null ? void 0 : titleElement.textContent) || ""}
${(contentElement == null ? void 0 : contentElement.textContent) || ""}`;
      const iconParent = icon.closest(".flex.items-center.gap-1");
      if (!iconParent) return;
      const readCountText = iconParent.textContent.trim();
      const readCount = parseInt(readCountText, 10);
      if (isNaN(readCount)) {
        warn("[Filter] Could not find valid read count");
        visibleCount++;
        return;
      }
      const filterCount = getFilterCount();
      if (filterCount === 0) {
        item.style.display = "";
        visibleCount++;
        log(`[Filter] FC=0, showing all articles`);
      } else if (readCount >= filterCount) {
        item.style.display = "none";
        hiddenCount++;
        if (articleContent) {
          addToIgnoreSet(articleContent);
        }
        log(`[Filter] Removing article with read count ${readCount}`);
      } else {
        item.style.display = "";
        visibleCount++;
        log(`[Filter] Keeping article with read count ${readCount}`);
      }
      getPageParam().then((pageParams) => {
        const totalItems = pageParams.pageSize * pageParams.allPage;
        const ignoreSet = getIgnoreSet();
        updateReadProgress(totalItems, ignoreSet.size);
      });
    };
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.matches && node.matches("svg.tabler-icon-eye")) {
                processEyeIcon(node);
              }
              const icons = node.querySelectorAll("svg.tabler-icon-eye");
              icons.forEach(processEyeIcon);
            }
          });
        }
      }
      autoPageIfListEmpty();
    });
    const observerConfig = {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    };
    observer.observe(articleList, observerConfig);
    const existingIcons = articleList.querySelectorAll("svg.tabler-icon-eye");
    existingIcons.forEach(processEyeIcon);
    setTimeout(() => {
      autoPageIfListEmpty();
    }, 1e3);
    log(`[Filter] Observer setup complete. Initial results - Visible: ${visibleCount}, Hidden: ${hiddenCount}, Unread: ${unreadCount}`);
    return true;
  };
  const clickPageButton = async (direction) => {
    try {
      let buttonSelector;
      if (direction === "prev") {
        buttonSelector = SELECTORS.PAGINATION.PREV_PAGE;
      } else if (direction === "next") {
        buttonSelector = SELECTORS.PAGINATION.NEXT_PAGE;
      } else {
        warn(`[Navigation] Invalid direction: ${direction}`);
        return false;
      }
      const button = document.querySelector(buttonSelector);
      if (!button) {
        warn(`[Navigation] Button not found for direction: ${direction}`);
        return false;
      }
      if (button.disabled || button.classList.contains("disabled")) {
        log(`[Navigation] Button is disabled for direction: ${direction}`);
        return false;
      }
      log(`[Navigation] Clicking ${direction} page button`);
      button.click();
      return true;
    } catch (error) {
      warn(`[Navigation] Error clicking ${direction} page button:`, error);
      return false;
    }
  };
  const isArticleListEmpty = () => {
    const articleList = document.querySelector(SELECTORS.ARTICLE.LIST);
    if (!articleList) return true;
    const visibleItems = Array.from(articleList.querySelectorAll(SELECTORS.ARTICLE.ITEM)).filter((item) => item.style.display !== "none");
    return visibleItems.length === 0;
  };
  const autoPageIfListEmpty = async () => {
    const currentTime = Date.now();
    if (currentTime - lastListCheckTime < 1e3) {
      return;
    }
    lastListCheckTime = currentTime;
    if (autoPageTimer) {
      clearTimeout(autoPageTimer);
      autoPageTimer = null;
    }
    if (isArticleListEmpty()) {
      const interval = getAutoPageInterval();
      log(`[AutoPage] 检测到列表为空，开始${interval / 1e3}秒倒计时...`);
      autoPageTimer = setTimeout(async () => {
        if (isArticleListEmpty()) {
          log(`[AutoPage] ${interval / 1e3}秒后列表仍为空，执行自动翻页`);
          try {
            const direction = getAutoPageDirection();
            log(`[AutoPage] 尝试自动翻页，方向: ${direction === "next" ? "下一页" : "上一页"}`);
            const success = await clickPageButton(direction);
            if (success) {
              log(`[AutoPage] 自动翻页成功，方向: ${direction}`);
            } else {
              log(`[AutoPage] 自动翻页失败，可能是边界页面或按钮不可用`);
            }
          } catch (error) {
            warn("[AutoPage] 自动翻页失败:", error);
          }
        } else {
          log(`[AutoPage] ${interval / 1e3}秒后列表不再为空，取消自动翻页`);
        }
      }, interval);
    } else {
      log("[AutoPage] 列表不为空，取消自动翻页定时器");
    }
  };
  const processPage = async () => {
    const currentPath = window.location.pathname;
    if (isProcessing && currentPath !== lastProcessedPath) {
      log("[Process] Path changed during processing, resetting state...");
      isProcessing = false;
    }
    if (isProcessing) {
      log("[Process] Already processing, skipping...");
      return;
    }
    isProcessing = true;
    lastProcessedPath = currentPath;
    try {
      if (currentPath.match(/^\/home\/read\/published\/\d+$/)) {
        log("[Process] Processing numbered page...");
        const pageParam = await getPageParam();
        debouncedSavePageState(pageParam);
        await filterArticlesByReadCount();
      } else if (currentPath === "/home/read/published" || currentPath === "/home/read/published/") {
        log("[Process] Processing root path...");
        const storedState = loadStoredPage();
        if (!hasRestoredPage && storedState.page > 1) {
          log(`[Process] Restoring to stored page ${storedState.page}`);
          hasRestoredPage = true;
          window.location.href = `/home/read/published/${storedState.page}`;
          return;
        }
      }
    } catch (error) {
      warn("[Process] Error during processing:", error);
    } finally {
      isProcessing = false;
    }
  };
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      log("[Visibility] Page becoming visible, checking state...");
      const currentPath = window.location.pathname;
      const match = currentPath.match(/^\/home\/read\/published\/(\d+)$/);
      const currentPage = match ? parseInt(match[1], 10) : 1;
      const storedState = loadStoredPage();
      if (currentPage !== storedState.page) {
        hasRestoredPage = false;
        processPage();
      }
    }
  });
  let lastPath = window.location.pathname;
  const routeObserver = new MutationObserver(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      log(`[Route] Path changed from ${lastPath} to ${currentPath}`);
      lastPath = currentPath;
      isProcessing = false;
      processPage();
    }
  });
  routeObserver.observe(document.body, { childList: true, subtree: true });
  const setupSortButtonListener = async () => {
    const sortButton = await waitForElement(SELECTORS.PAGINATION.SORT_BUTTON);
    if (!sortButton) {
      warn("[Sort] Sort button not found");
      return;
    }
    log("[Sort] Setting up sort button click listener");
    sortButton.addEventListener("click", () => {
      log("[Sort] Sort button clicked, triggering filter");
      setTimeout(() => {
        filterArticlesByReadCount();
      }, 500);
    });
  };
  const initialize = async () => {
    await setupSortButtonListener();
    registerMenuCommands();
    processPage();
    initKeyboardNavigation();
  };
  getFilterCount();
  initialize();

})();
// ==UserScript==
// @name         素问搜索助手
// @namespace    https://greasyfork.org/zh-CN/scripts/532096
// @version      1.1.2
// @description  在知乎 / 爱发电 / sooon.ai 之间一键跳转并自动搜索
// @author       You
// @match        https://www.zhihu.com/question/*/answer/*
// @match        https://afdian.com/p/*
// @match        https://sooon.ai/home/read/**
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @icon       https://sooon.ai/assets/favicon-BRntVMog.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532096/%E7%B4%A0%E9%97%AE%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/532096/%E7%B4%A0%E9%97%AE%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const DEBUG = true;
  const SCRIPT_NAME = '素问搜索助手';
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const logPrefix = 'injected:';
  let searching = false;
  let finished = false;
  let searchStartTime = 0;

  function dbg(...msg) {
    if (!DEBUG) return;
    const t = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    // Sanitize DOM elements for logging to prevent circular JSON errors
    const sanitizedMsg = msg.map(item => {
        if (item instanceof Element) {
            return `[DOM Element: ${item.tagName}${item.id ? '#' + item.id : ''}${item.className ? '.' + item.className.trim().replace(/\s+/g, '.') : ''}]`;
        }
        return item;
    });
    (GM_log || console.log)(logPrefix, `[SuWen ${t}]`, ...sanitizedMsg);
  }

  dbg(`${SCRIPT_NAME} loading. Version 1.3.5`);

  async function queryEle(selector, { all = false, maxWait = 10_000, context = document } = {}) {
    dbg(`queryEle: Searching for "${selector}". All: ${all}, MaxWait: ${maxWait}ms`);
    const base = 100, maxA = 10;
    let waited = 0;
    for (let i = 1; i <= maxA; i++) {
      const ele = all ? context.querySelectorAll(selector) : context.querySelector(selector);
      if (ele && (!all || ele.length)) {
        dbg(`queryEle: Found "${selector}".`);
        return ele;
      }
      const d = Math.min(base * 2 ** (i - 1) + Math.random() * 100, 2_000);
      waited += d;
      if (i > 1 && i % 3 === 0) dbg(`queryEle: Still waiting for "${selector}", attempt ${i}, waited ${waited.toFixed(0)}ms...`);
      await sleep(d);
      if (waited >= maxWait) break;
    }
    dbg(`queryEle: Timeout for selector "${selector}" after ${waited.toFixed(0)}ms.`);
    return null;
  }

  async function getCurrentTag() {
    // ... (getCurrentTag implementation - no changes from 1.3.4) ...
    dbg('getCurrentTag: Attempting extraction.');
    if (location.hostname.includes('zhihu.com')) {
      dbg('getCurrentTag: On Zhihu.');
      const root = await queryEle('.RichContent--unescapable');
      if (!root) { dbg('getCurrentTag: Zhihu root not found.'); return null; }
      const first = root.querySelector('p[data-first-child], p:first-child');
      const txt = (first ? first.textContent : root?.textContent || '').trim();
      const m = txt.match(/#([^#]+)#/);
      const tag = m ? m[1].trim() : null;
      dbg('getCurrentTag: Zhihu tag:', tag);
      return tag;
    }

    if (location.hostname.includes('afdian.com')) {
      dbg('getCurrentTag: On Afdian.');
      let txt = (await queryEle('div.feed-content.mt16.post-page.unlock > pre', {maxWait: 500}))?.textContent;
      if (!txt) {
        dbg('getCurrentTag: Afdian <pre> not found, trying <article> <p>.');
        txt = (await queryEle('article.afd-post__article > p, article > p', {maxWait: 1000}))?.textContent;
      }
      const m = txt?.trim().match(/#([^#]+)#/);
      const tag = m ? m[1].trim() : null;
      dbg('getCurrentTag: Afdian tag:', tag);
      return tag;
    }
    dbg('getCurrentTag: No matching site for tag extraction.');
    return null;
  }

  async function jumpToSuwen() {
    // ... (jumpToSuwen implementation - no changes from 1.3.4) ...
    dbg('jumpToSuwen: Menu command triggered.');
    const tag = await getCurrentTag();
    if (!tag) {
      GM_notification({ text: '未检测到 #标签#，请确认首段包含标签', timeout: 3000 });
      dbg('jumpToSuwen: No tag found, notification sent.');
      return;
    }
    const url = `https://sooon.ai/home/read/feed?search=${encodeURIComponent(tag)}`;
    dbg('jumpToSuwen: Opening URL for tag:', tag, url);
    window.open(url, '_blank');
  }

  const needMenu =
    /zhihu\.com\/question\/\d+\/answer\/\d+/.test(location.href) ||
    /afdian\.com\/p\//.test(location.href);

  if (needMenu) {
    dbg('Registering menu command "🔗 跳转素问".');
    GM_registerMenuCommand('🔗 跳转素问', jumpToSuwen);
  }

  function handleZhihu() {
    // ... (handleZhihu implementation - no changes from 1.3.4) ...
    dbg('handleZhihu: Initializing.');
    const rootSel = '#root main .AnswerCard .RichContent--unescapable';

    const addBtn = async () => {
      // dbg('handleZhihu - addBtn: Attempting to add button.');
      const answerCards = document.querySelectorAll(rootSel);
      if (!answerCards.length) {
          return;
      }

      for (const root of answerCards) {
          if (root.querySelector('.go-sooon-link')) {
            continue;
          }
          // dbg('handleZhihu - addBtn: Processing card without button:', root);
          const tag = await getCurrentTag();
          if (!tag) {
            // dbg('handleZhihu - addBtn: No tag found for this card/page.');
            continue;
          }

          const first = root.querySelector('p[data-first-child], p:first-child');
          if (!first) {
            // dbg('handleZhihu - addBtn: First paragraph not found in this card.');
            continue;
          }

          const btn = document.createElement('button');
          btn.className = 'go-sooon-link';
          btn.textContent = '跳转素问';
          btn.onclick = e => {
            const url = `https://sooon.ai/home/read/feed?search=${encodeURIComponent(tag)}`;
            dbg('handleZhihu - addBtn: Button clicked. Ctrl:', e.ctrlKey, 'URL:', url);
            e.ctrlKey ? window.open(url, '_blank') : (location.href = url);
          };
          first.after(btn);
          dbg('handleZhihu - addBtn: Button added to card.');
      }
    };

    // dbg('handleZhihu: Setting up MutationObserver.');
    new MutationObserver((mutations, observer) => {
        addBtn();
    }).observe(document.body, { childList: true, subtree: true });
    addBtn();
  }

function handleAfdian() {
  dbg('handleAfdian: Initializing.');

  const addBtn = async () => {
    const tag = await getCurrentTag();
    if (!tag) {
      dbg('handleAfdian - addBtn: No tag found.');
      return;
    }

    const titleBox = await queryEle('.title-box h1, .main-post-title, h1.common-title.no-divider.mt0', { maxWait: 1500 });
    if (titleBox && !titleBox.parentElement.querySelector('.go-sooon-link')) {
      const btn = document.createElement('button');
      btn.className = 'go-sooon-link';
      btn.textContent = '跳转素问';
      btn.style.cssText = 'font-size:.75em;color:#946CE6;border:1px solid #946CE6;padding:2px 6px;margin-left:8px;border-radius:3px;vertical-align:middle;';
      btn.onclick = e => {
        const url = `https://sooon.ai/home/read/feed?search=${encodeURIComponent(tag)}`;
        dbg('handleAfdian - addBtn: Button clicked. Ctrl:', e.ctrlKey, 'URL:', url);
        e.ctrlKey ? window.open(url, '_blank') : (location.href = url);
      };
      titleBox.style.display = 'inline-block';
      titleBox.after(btn);
      dbg('handleAfdian - addBtn: Button added after title.');
      return;
    }

    const contentArea = await queryEle('div.feed-content.mt16.post-page.unlock, article.afd-post__article');
    if (contentArea && !contentArea.querySelector('.go-sooon-link')) {
      const btn = document.createElement('button');
      btn.className = 'go-sooon-link';
      btn.textContent = '跳转素问';
      btn.style.cssText = 'font-size:.75em;color:#946CE6;border:1px solid #946CE6;padding:2px 6px;margin-left:8px;border-radius:3px;vertical-align:middle;';
      btn.onclick = e => {
        const url = `https://sooon.ai/home/read/feed?search=${encodeURIComponent(tag)}`;
        dbg('handleAfdian - addBtn: Button clicked. Ctrl:', e.ctrlKey, 'URL:', url);
        e.ctrlKey ? window.open(url, '_blank') : (location.href = url);
      };
      contentArea.prepend(btn);
      dbg('handleAfdian - addBtn: Button prepended to content area.');
    } else {
      dbg('handleAfdian - addBtn: No suitable location found or button already exists.');
    }
  };

  const observer = new MutationObserver(() => {
    addBtn();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  addBtn();
}

 function handleSooon() {
  const searchQuery = new URLSearchParams(location.search).get('search');
  if (!searchQuery) {
    dbg('[Sooon] No "search" query parameter. Exiting Sooon handler.');
    return;
  }

  dbg(`[Sooon] Initializing. Search Query: "${searchQuery}"`);
  let searching = false;
  let finished = false;

  const events = ['focus', 'visibilitychange', 'mousemove', 'keydown', 'scroll', 'touchstart'];

  async function doSearch(isInitialAttempt = false) {
    dbg(`[Sooon] doSearch: Entering. Query: "${searchQuery}", Initial: ${isInitialAttempt}, Searching: ${searching}, Finished: ${finished}`);
    if (searching || finished) {
      dbg('[Sooon] doSearch: Already searching or finished. Aborting.');
      return;
    }
    searching = true;
    dbg('[Sooon] doSearch: Set searching = true.');

    try { // Wrap core logic in try...finally to ensure `searching` is reset
        if (isInitialAttempt) {
            const initialDelay = 1500;
            dbg(`[Sooon] doSearch: Initial attempt, sleeping ${initialDelay}ms for page stabilization.`);
            await sleep(initialDelay);
        }

        const fastBtn = await queryEle('button[aria-label="快速搜索"]');
        if (!fastBtn) {
            dbg('[Sooon] doSearch: "快速搜索" button not found.');
            return; // searching will be set to false in finally
        }
        dbg('[Sooon] doSearch: "快速搜索" button found:', fastBtn);

        let searchModalInput = document.querySelector('form input[name="input"]');
        let isModalAlreadyOpen = searchModalInput && searchModalInput.closest('form') && window.getComputedStyle(searchModalInput.closest('form')).display !== 'none';

        if (!isModalAlreadyOpen) {
            dbg('[Sooon] doSearch: Search modal not open. Clicking "快速搜索".');
            fastBtn.focus(); await sleep(50);
            fastBtn.click(); // Click to open modal
            await sleep(300); // Wait for modal animation / appearance
            if (!await queryEle('form input[name="input"]', {maxWait: 3000})) {
                dbg('[Sooon] doSearch: Search modal input did not appear after clicking "快速搜索".');
                return; // searching will be set to false in finally
            }
            dbg('[Sooon] doSearch: Search modal input appeared.');
        } else {
            dbg('[Sooon] doSearch: Search modal seems already open.');
        }

        const formCtx = await queryEle('form:has(input[name="input"])');
        if (!formCtx) {
            dbg('[Sooon] doSearch: Search form (form:has(input[name="input"])) not found.');
            return;
        }
        dbg('[Sooon] doSearch: Search form context found:', formCtx);

        const input = await queryEle('input[name="input"]', {context: formCtx});
        const submit = await queryEle('button[type="submit"]', {context: formCtx});

        if (!input || !submit) {
            dbg('[Sooon] doSearch: Missing input or submit button in form.');
            return;
        }
        dbg('[Sooon] doSearch: Input and submit button found:', input, submit);

        // --- Enhanced Input Simulation ---
        dbg('[Sooon] doSearch: Simulating input interaction.');
        input.click(); // Click the input field
        await sleep(100);
        input.focus();
        await sleep(100);

        dbg('[Sooon] doSearch: Clearing input field.');
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true })); // composed: true for shadow DOM if any
        input.dispatchEvent(new Event('change', { bubbles: true })); // also dispatch change
        await sleep(150); // Longer pause after clearing

        dbg(`[Sooon] doSearch: Setting input value to "${searchQuery}".`);
        input.value = searchQuery;
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        await sleep(500); // Longer pause after setting value

        dbg('[Sooon] doSearch: Input value set. Input field:', input);
        // Optional: blur input before clicking submit, or directly focus submit
        // input.blur();
        // await sleep(50);

        dbg('[Sooon] doSearch: Focusing and clicking submit button.');
        submit.focus();
        await sleep(100); // Ensure focus is registered
        submit.click();
        dbg('[Sooon] doSearch: Submit button clicked.', submit);

        await sleep(800); // Increased wait for results after submit, give server/UI time

        const resultSelector = 'div.mantine-focus-never button span.inline-block';
        const resultSpans = await queryEle(resultSelector, { all: true, context: formCtx, maxWait: 8000 });
        let firstClickableResult = null;

        if (resultSpans && resultSpans.length > 0) {
            dbg(`[Sooon] doSearch: Found ${resultSpans.length} potential result spans.`);
            for (const span of resultSpans) {
                if (span.textContent.trim() === '') continue;
                const parentButton = span.closest('button');
                if (parentButton && parentButton.offsetParent !== null) {
                    firstClickableResult = parentButton;
                    dbg('[Sooon] doSearch: Found clickable result:', parentButton.textContent.trim(), parentButton);
                    break;
                }
            }
        } else {
            dbg(`[Sooon] doSearch: No result spans found with selector: "${resultSelector}".`);
        }

        if (firstClickableResult) {
          firstClickableResult.focus(); await sleep(50);
          firstClickableResult.click();
          dbg('[Sooon] doSearch: Clicked first result. Text:', `"${firstClickableResult.textContent.trim()}"`);
          finished = true;
          dbg('[Sooon] doSearch: Set finished = true. Removing event listeners.');
          events.forEach(ev => window.removeEventListener(ev, namedMaybeSearchWrapper));
        } else {
          const allBtnsInForm = formCtx.querySelectorAll('div.mantine-focus-never button, div[role="listbox"] button');
          dbg(`[Sooon] doSearch: No clickable result found. Query: "${searchQuery}". Candidate buttons in form: ${allBtnsInForm.length}`);
        }
    } catch (error) {
        dbg('[Sooon] doSearch: Error during execution:', error);
        // Potentially GM_notification or more robust error handling here
    } finally {
        searching = false;
        dbg('[Sooon] doSearch: Exiting. Searching set to false.');
    }
  }

  const namedMaybeSearchWrapper = async (eventOrTrigger) => {
    const trigger = typeof eventOrTrigger === 'string' ? eventOrTrigger : (eventOrTrigger.type || 'unknown_event_type');
    // Reduce log spam for frequent events like mousemove unless debugging them specifically
    if (trigger !== 'mousemove' || DEBUG) {
        dbg(`[Sooon] namedMaybeSearchWrapper: Triggered by "${trigger}". Query: "${searchQuery}", Searching: ${searching}, Finished: ${finished}, Visible: ${document.visibilityState}, HasFocus: ${document.hasFocus()}`);
    }


    if (trigger === 'init') {
        await sleep(1000);
        if (DEBUG) dbg(`[Sooon] namedMaybeSearchWrapper: Post 'init' delay. Visible: ${document.visibilityState}, HasFocus: ${document.hasFocus()}`);
    }
// 强制检测是否卡住（搜索框已打开但没有点击结果）
const stuckInModal = document.querySelector('form input[name="input"]') &&
                     !finished &&
                     document.visibilityState === 'visible' &&
                     document.hasFocus();

if ((!searching && !finished && document.visibilityState === 'visible' && document.hasFocus()) || stuckInModal) {
  dbg(`[Sooon] namedMaybeSearchWrapper: Trigger "${trigger}" - attempting doSearch. Stuck: ${stuckInModal}`);
  await doSearch(trigger === 'init' || stuckInModal);
} else {
      // if (DEBUG || trigger !== 'mousemove') dbg('[Sooon] namedMaybeSearchWrapper: Conditions not met for doSearch. Skipping.');
    }
  };

  namedMaybeSearchWrapper('init');
  events.forEach(ev => window.addEventListener(ev, namedMaybeSearchWrapper));
}

  (function addGlobalStyle() {
    // ... (addGlobalStyle implementation - no changes from 1.3.4) ...
    dbg('addGlobalStyle: Adding CSS.');
    const css = `
      .go-sooon-link{
        background:none;font-size:1em;font-weight:500;color:#0066FF;
        border:1px solid #228BE6;padding:2px 8px;margin-left:10px;border-radius:3px;
        cursor:pointer;display:inline-block;vertical-align:middle
      }
      .go-sooon-link:hover{opacity:.8;color:gray;border-color:gray}
    `;
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  })();

  function init() {
    // ... (init implementation - no changes from 1.3.4) ...
    dbg(`init: Script initializing. Host: ${location.hostname}, Path: ${location.pathname}, ReadyState: ${document.readyState}`);
    if (location.hostname.includes('zhihu.com')) handleZhihu();
    else if (location.hostname.includes('afdian.com')) handleAfdian();
    else if (location.hostname.includes('sooon.ai') && location.pathname.startsWith('/home/read/')) handleSooon();
    else dbg('init: No matching site/path for handlers.');
  }

  if (document.readyState === 'loading') {
    dbg('Document loading. Adding DOMContentLoaded listener.');
    window.addEventListener('DOMContentLoaded', init);
  } else {
    dbg('Document already loaded. Calling init.');
    init();
  }
  dbg(`${SCRIPT_NAME} execution finished (initial setup phase).`);
})();
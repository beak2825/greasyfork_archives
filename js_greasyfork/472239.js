// ==UserScript==
// @name         Jira Helper
// @version      0.1.2
// @description  Enhance the functionality of the Jira issue tracking system.
// @author       Moeyua (https://github.com/moeyua)
// @license      MIT
// @run-at       document-start
// @homepageURL  https://github.com/Moeyua/jira-helper
// @supportURL   https://github.com/Moeyua/jira-helper
// @match        https://jira-yzwl.wisedu.com/**
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1141927
// @downloadURL https://update.greasyfork.org/scripts/472239/Jira%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/472239/Jira%20Helper.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', () => {
  ('use strict');

  const CSS_RULES = `.marked { background-color: rgb(173, 217, 188)}`;
  GM_addStyle(CSS_RULES);

  const TOOLBAR =
    '#stalker > div > div.command-bar > div > div > div > div > div.aui-toolbar2-primary';
  const ISSUE_LINK = '#key-val';
  const ISSUE_LIST =
    '#main > div > div.navigator-group > div > div > div > div > div > div.aui-item.list-results-panel > div:nth-child(1) > div > div.list-panel > div.search-results > div > ol';
  const FOCUSED_ISSUE = `${ISSUE_LIST} > li.focused`;
  const storage = new Storage('jira-helper');

  // 观察 issue 变动，并执行 initChangers
  const observeIssueChange = createObserver(() =>
    document.querySelector(ISSUE_LINK)
  );
  observeIssueChange(() => initChangers());

  /**
   * Initializes the toolbar with custom buttons for copying, sharing, and marking an issue.
   * Waits for the toolbar and issue link elements to be available before proceeding.
   *
   * @function
   */
  function initChangers() {
    Promise.all([
      waitForElement(ISSUE_LINK),
      waitForElement(ISSUE_LIST),
      waitForElement(TOOLBAR),
    ]).then(([issueLink, issueList, toolbar]) => {
      debug(toolbar, issueLink, issueList);

      const number = issueLink.getAttribute('data-issue-key');
      const href = issueLink.getAttribute('href');

      issueList.childNodes.forEach((issue) => {
        const issueNumber = issue.getAttribute('data-key');
        if (storage.has(issueNumber)) {
          issue.classList.add('marked');
        }
      });

      const button_wapper = document.createElement('div');
      button_wapper.className = 'aui-buttons pluggable-ops';
      const button_copy = createToolButton('复制', onCopy, number);
      const button_share = createToolButton('分享', onShare, href);
      const markText = storage.has(number) ? '取消标记' : '标记';
      const button_mark = createToolButton(markText);
      button_mark.addEventListener('click', () => {
        onMark(number, button_mark);
      });
      button_wapper.appendChild(button_copy);
      button_wapper.appendChild(button_share);
      button_wapper.appendChild(button_mark);
      toolbar.appendChild(button_wapper);
    });
  }

  async function onCopy(number) {
    await navigator.clipboard.writeText(number);
    debug('onCopy', number);
  }
  async function onShare(href) {
    const issueLink = window.location.origin + href;
    await navigator.clipboard.writeText(issueLink);
    debug('onShare', issueLink);
  }
  function onMark(number, button) {
    const issue_focused = document.querySelector(FOCUSED_ISSUE);
    if (storage.has(number)) {
      storage.remove(number);
      issue_focused.classList.remove('marked');
      button.innerText = '标记';
      return;
    }
    storage.add(number);
    issue_focused.classList.add('marked');
    button.innerText = '取消标记';
  }
  function createToolButton(text, event, ...params) {
    const button = document.createElement('a');
    button.className = 'aui-button toolbar-trigger';
    const span = document.createElement('span');
    span.innerText = text;
    span.className = 'trigger-label';
    button.appendChild(span);
    if (!event) return button;
    button.addEventListener('click', () => {
      event(...params);
    });
    return button;
  }
});

/**
 * @param {string} selector
 * @returns {Promise<HTMLElement>}
 */
function waitForElement(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

/**
 * Creates a MutationObserver that watches for changes in a specific value.
 *
 * @param {Function} valueToWatch - A function that returns the value to be observed.
 * @returns {Function} - Returns a function that takes a callback to be executed when the observed value changes.
 */
function createObserver(valueToWatch) {
  return (callback) => {
    let oldValue = valueToWatch();
    const observer = new MutationObserver(() => {
      if (oldValue !== valueToWatch()) {
        oldValue = valueToWatch();
        callback();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };
}

function debug(...messages) {
  console.debug('jira-helper', ...messages);
}

class Storage {
  value = [];
  key = '';
  constructor(key) {
    this.key = key;
    this.value = JSON.parse(localStorage.getItem(key)) || [];
  }
  has(val) {
    return this.value.includes(val);
  }
  add(val) {
    this.value.push(val);
    this.save();
  }
  remove(val) {
    this.value = this.value.filter((item) => item !== val);
    this.save();
  }
  save() {
    localStorage.setItem(this.key, JSON.stringify(this.value));
  }
}

// ==UserScript==
// @name        CF Linemaster
// @namespace   https://github.com/meooow25
// @match       *://*.codeforces.com/*
// @grant       GM.setClipboard
// @version     0.9
// @author      meooow
// @description Adds supports for line highlighting and copying on Codeforces
// @downloadURL https://update.greasyfork.org/scripts/403747/CF%20Linemaster.user.js
// @updateURL https://update.greasyfork.org/scripts/403747/CF%20Linemaster.meta.js
// ==/UserScript==

/**
 * This script enables line highlighting for Codeforces submissions.
 *
 * On a submission page or on a submission popup:
 * Click on a line number to highlight the line, Shift+click on another line
 * number to select all lines in between.
 * Press Ctrl+Shift+C to copy all highlighted lines.
 *
 * On a submission page:
 * You can set #L<start> or #L<start>-L<end> as the URL fragment to specify
 * the lines to highlight.
 */

/**
 * Changelog:
 * v0.9  Added support for EDU submission, status and standings pages.
 *       Disabled inspect element opening on copy.
 * v0.8  Updated highlight color to work with dark themes.
 * v0.7  Added support for standings pages.
 * v0.6  Added support for submission popups.
 *       Added support for problemset and acmsguru URLs.
 *       Added an option to remove extra indent from copied code.
 *       Removed unnecessary GM_setClipboard permission.
 */

(async function() {
  'use strict';

  // Set to false to leave extra indent in code when copying with Ctrl+Shift+C.
  const REMOVE_EXTRA_INDENT_ON_COPY = true;

  const SUBMISSION_PAGE_REGEXES = [
    String.raw`^https?://codeforces.com/(?:contest|gym)/\d+/submission/\d+`,
    String.raw`^https?://codeforces.com/(?:problemset|problemsets/acmsguru)/submission/\d+/\d+`,
    String.raw`^https?://codeforces.com/edu/course/\d+/lesson/\d+/\d+/practice/contest/\d+/submission/\d+`,
  ].map(s => new RegExp(s));

  const STATUS_AND_STANDINGS_PAGE_REGEXES = [
    String.raw`^https?://codeforces.com/(?:contest|gym)/\d+/(?:status|my|standings)`,
    String.raw`^https?://codeforces.com/(?:problemset|problemsets/acmsguru)/status`,
    String.raw`^https?://codeforces.com/submissions/.+`, // User status pages
    String.raw`^https?://codeforces.com/edu/course/\d+/lesson/\d+/(?:standings|\d+/practice/(?:status|standings))`,
  ].map(s => new RegExp(s));

  const ON_SUBMISSION_PAGE = SUBMISSION_PAGE_REGEXES.some(re => re.test(location.href));
  const ON_STATUS_OR_STANDINGS_PAGE = STATUS_AND_STANDINGS_PAGE_REGEXES.some(re => re.test(location.href));
  if (!ON_SUBMISSION_PAGE && !ON_STATUS_OR_STANDINGS_PAGE) {
    return;
  }

  const HIGHLIGHTED_LI_CLS     = 'cf-linemaster-highlighted-li';
  const LINE_NUMS_CONTAINER_ID = 'cf-linemaster-line-nums';
  const LINE_NUM_LI_CLS        = 'cf-linemaster-line-num';
  const CONTAINER_DIV_ID       = 'cf-linemaster-line-nums-and-source-container';

  // On submission page
  const SOURCE_PRE_ID = 'program-source-text';
  const SCROLL_TO_HIGHLIGHTED_TOP_OFFSET = 40;

  // On status or standings page
  const FACEBOX_DIV_ID = 'facebox';
  const SOURCE_CODE_CLS = 'source-popup-source';
  const SOURCE_PRE_ADDED_ID = 'cf-linemaster-source-pre';

  const CSS = `
    #${CONTAINER_DIV_ID} {
      display: flex;
      line-height: 1.25;
      ${ON_SUBMISSION_PAGE ? 'margin-top: -0.3em;' : ''}
    }

    #${SOURCE_PRE_ADDED_ID} {
      border: 1px solid rgb(185, 185, 185);
      border-radius: 3px;
    }

    #${LINE_NUMS_CONTAINER_ID} {
      text-align: right;
      padding: 0.5em;
      user-select: none;
      opacity: 0.5;
    }

    .${LINE_NUM_LI_CLS} {
      cursor: pointer;
    }

    #${SOURCE_PRE_ID},
    .${SOURCE_CODE_CLS} {
      padding: 0.5em 0;
      border: none;
      border-left: 1px solid rgb(185, 185, 185);
      flex-grow: 1;
    }

    #${SOURCE_PRE_ID} li,
    .${SOURCE_CODE_CLS} li {
      padding-left: 0.5em;
    }

    .${HIGHLIGHTED_LI_CLS} {
      background-color: rgba(215, 180, 35, 0.25);
    }
  `;

  function createLineNumsContainer() {
    let elem;
    if (ON_SUBMISSION_PAGE) {
      elem = document.createElement('pre');
    } else { // ON_STATUS_OR_STANDINGS_PAGE
      elem = document.createElement('code');
    }
    elem.id = LINE_NUMS_CONTAINER_ID;
    return elem;
  }

  function getSourceCodeContainer() {
    if (ON_SUBMISSION_PAGE) {
      return document.getElementById(SOURCE_PRE_ID);
    } else { // ON_STATUS_OR_STANDINGS_PAGE
      const facebox = document.getElementById(FACEBOX_DIV_ID);
      return facebox && facebox.querySelector(`.${SOURCE_CODE_CLS}`);
    }
  }

  function tweakSourceContainer() {
    if (ON_SUBMISSION_PAGE) {
      getSourceCodeContainer().style.padding = null;
    } else { // ON_STATUS_OR_STANDINGS_PAGE
      getSourceCodeContainer().closest('pre').id = SOURCE_PRE_ADDED_ID;
    }
  }

  let currentRange = { start: null, end: null };
  let disableScrollOnce = false;

  function setCurrentRange(start, end) {
    if (start > end) {
      [start, end] = [end, start];
    }
    if (start === currentRange.start && end === currentRange.end) {
      return false;
    }
    currentRange = { start: start, end: end };
    return true;
  }

  function highlightCurrentRange() {
    Array.from(document.getElementsByClassName(HIGHLIGHTED_LI_CLS))
        .forEach(li => li.classList.remove(HIGHLIGHTED_LI_CLS));
    Array.from(getSourceCodeContainer().querySelectorAll('li'))
        .slice(currentRange.start - 1, currentRange.end)
        .forEach(li => li.classList.add(HIGHLIGHTED_LI_CLS));
  }

  function updateCurrentRange(start, end) {
    const changed = setCurrentRange(start, end);
    if (!changed) {
      return;
    }
    if (ON_SUBMISSION_PAGE) {
      // The hash change listener calls highlightCurrentRange.
      disableScrollOnce = true;
      if (currentRange.start === currentRange.end) {
        location.hash = `L${currentRange.start}`;
      } else {
        location.hash = `L${currentRange.start}-L${currentRange.end}`;
      }
    } else { // ON_STATUS_OR_STANDINGS_PAGE
      highlightCurrentRange();
    }
  }

  function hashUpdated() {
    const matches = /L(\d+)(?:-L(\d+))?/.exec(location.hash);
    if (!matches) {
      return;
    }
    const start = parseInt(matches[1]);
    const end = matches[2] ? parseInt(matches[2]) : start;
    setCurrentRange(start, end);
    highlightCurrentRange();
    if (disableScrollOnce) {
      disableScrollOnce = false;
      return;
    }
    const first = document.querySelector(`.${HIGHLIGHTED_LI_CLS}`);
    if (first) {
      window.scrollTo(
          0,
          first.getBoundingClientRect().top
              + window.scrollY - SCROLL_TO_HIGHLIGHTED_TOP_OFFSET);
    }
  }

  function updatePage() {
    tweakSourceContainer();

    const sourceCodeContainer = getSourceCodeContainer();
    const numLines = sourceCodeContainer.querySelectorAll('li').length;
    const lineNumsContainer = createLineNumsContainer();

    for (let i = 1; i <= numLines; i++) {
      const div = document.createElement('div');
      div.classList.add(LINE_NUM_LI_CLS);
      div.textContent = i;
      lineNumsContainer.appendChild(div);
    }
    const containerDiv = document.createElement('div');
    containerDiv.id = CONTAINER_DIV_ID;
    sourceCodeContainer.replaceWith(containerDiv);
    containerDiv.appendChild(lineNumsContainer);
    containerDiv.appendChild(sourceCodeContainer);

    lineNumsContainer.addEventListener('click', e => {
      if (!e.target.classList.contains(LINE_NUM_LI_CLS)) {
        return;
      }
      const lineNum = parseInt(e.target.textContent);
      if (e.shiftKey && currentRange.start) {
        updateCurrentRange(currentRange.start, lineNum);
      } else {
        updateCurrentRange(lineNum, lineNum);
      }
    });
  }

  function getHighlightedLines() {
    const lines =
        Array.from(document.getElementsByClassName(HIGHLIGHTED_LI_CLS))
        .map(li => li.textContent);
    if (!REMOVE_EXTRA_INDENT_ON_COPY) {
      return lines.join('\n');
    }
    // This logic assumes indent consists of only tabs or only spaces, if that
    // is not the case the text is already ugly and the copy will also be ugly.
    let minSpaceCount = Infinity;
    for (const line of lines) {
      const result = /\S+/.exec(line);
      if (result) {
        minSpaceCount = Math.min(minSpaceCount, result.index);
      }
    }
    return lines.map(line => line.slice(minSpaceCount)).join('\n').trim();
  }

  function showMessage(text) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.text = `Codeforces.showMessage('${text}');`;
    document.head.appendChild(script);
    script.remove();
  }

  function setupCopyShortcut() {
    document.addEventListener('keydown', e => {
      if (e.key.toLowerCase() === 'c' && e.shiftKey && e.ctrlKey) {
        e.preventDefault(); // Disable inspect element opening
      }
    });
    document.addEventListener('keyup', async e => {
      if (e.key.toLowerCase() === 'c' && e.shiftKey && e.ctrlKey) {
        const highlighted = getHighlightedLines();
        if (highlighted) {
          await GM.setClipboard(highlighted);
          showMessage('The highlighted text has been copied into the clipboard');
        }
      }
    });
  }

  function addStyle() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function isPrettyPrintDone() {
    const sourceCodeContainer = getSourceCodeContainer();
    return sourceCodeContainer && sourceCodeContainer.querySelector('ol');
  }

  function prettyPrintDone() {
    updatePage();
    if (ON_SUBMISSION_PAGE) {
      hashUpdated();
      window.addEventListener('hashchange', hashUpdated);
    }
  }

  if (ON_SUBMISSION_PAGE && isPrettyPrintDone()) {
    prettyPrintDone();
  } else {
    const observer = new MutationObserver(mutationsList => {
      for (const mutation of mutationsList) {
        for (const node of mutation.addedNodes) {
          let sourceCodeContainer;
          const isPrettyPrintContainer =
              node.nodeName === 'OL' &&
              node.classList.contains('linenums') &&
              (sourceCodeContainer = getSourceCodeContainer()) &&
              sourceCodeContainer.contains(node);
          if (isPrettyPrintContainer) {
            prettyPrintDone();
            if (ON_SUBMISSION_PAGE) {
              observer.disconnect();
            }
            return;
          }
        }
      }
    });
    // For status or standings page, the facebox gets added later so can't just
    // put the observer on it on load.
    observer.observe(document.body, { childList: true, subtree: true });
  }

  addStyle();
  setupCopyShortcut();

})();

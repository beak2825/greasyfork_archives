// ==UserScript==
// @name         Overleaf - Compile time
// @namespace    https://github.com/BLumbye/overleaf-userscripts
// @version      0.1
// @description  View the compile time of your project
// @author       Benjamin Lumbye
// @license      GPL-3
// @match        https://www.overleaf.com/project/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464430/Overleaf%20-%20Compile%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/464430/Overleaf%20-%20Compile%20time.meta.js
// ==/UserScript==

'use strict';

function addStyle(css) {
  const style =
    document.getElementById('compile-time-style') ||
    (function () {
      const style = document.createElement('style');
      style.id = 'compile-time-style';
      document.head.appendChild(style);
      return style;
    })();
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

function waitForElement(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
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

let timerElement;
let compiling = false;
let compileStart = 0;
let endTimeout;

function formatTime() {
  return `${((Date.now() - compileStart) / 1000).toFixed(3)}s`;
}

function addTimerElement() {
  timerElement = document.createElement('div');
  timerElement.id = 'compile-time';
  document.querySelector('.pdfjs-viewer.pdfjs-viewer-outer').appendChild(timerElement);
}

function updateTimerElement() {
  if (!compiling) return;

  timerElement.textContent = formatTime();
  requestAnimationFrame(updateTimerElement);
}

(function () {
  addStyle(`
    #compile-time {
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: #fff;
      padding: .5em 1em;
      border-radius: 9999px;
      margin: 20px 12.5px;
      background-color: #3e70bb;
      color: #fff;
      opacity: 0;
    }
  `);

  addStyle(`
    #compile-time.compiling, #compile-time:hover {
      opacity: 1;
    }
  `);

  window.addEventListener('UNSTABLE_editor:extensions', async (event) => {
    // Wait for the PDF viewer to load, then add the timer element
    const mutationTarget = await waitForElement('.pdf-viewer');
    const observer = new MutationObserver((mutations) => {
      if (
        mutationTarget.querySelector('.pdfjs-viewer') !== null &&
        mutationTarget.querySelector('#compile-time') === null
      ) {
        addTimerElement();
        timerElement.textContent = 'No compilation yet';
      }
    });
    observer.observe(mutationTarget, { childList: true, subtree: true });

    // Observe the recompile button to detect when compilation starts and ends
    const recompileButton = await waitForElement('.toolbar-pdf-left > .split-menu > button > span');
    const recompileObserver = new MutationObserver((mutations) => {
      if (!timerElement) return;
      if (recompileButton.textContent.startsWith('Compiling')) {
        clearTimeout(endTimeout);
        compiling = true;
        compileStart = Date.now();
        timerElement.classList.add('compiling');
        timerElement.textContent = '0.000s';
        updateTimerElement();
      } else {
        compiling = false;
        timerElement.textContent = formatTime();
        endTimeout = setTimeout(() => timerElement.classList.remove('compiling'), 1000);
      }
    });
    recompileObserver.observe(recompileButton, { characterData: true, childList: true, subtree: true });
  });
})();

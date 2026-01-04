// ==UserScript==
// @name         Netflix Interactive Selection Tracker
// @namespace    https://github.com/lmelvin
// @version      1.1
// @license      MIT
// @description  Logs every option selected during interactive content
// @author       lmelvin
// @match        https://www.netflix.com/watch/*
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.0/dist/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/376231/Netflix%20Interactive%20Selection%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/376231/Netflix%20Interactive%20Selection%20Tracker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let DOWNLOAD_MENU = `<li class='dm list-header'>Interactive Selection Tracker</li>
                       <li class='dm download track'>Download</li>`;
  let DM_HEADER_SELECTOR = '.dm.header';
  let DM_DOWNLOAD_SELECTOR = '.dm.download';

  let observerConfig = { attributes: true, childList: true, subtree: true };
  let currentLog;

  GM_addStyle(`.dm { white-space: nowrap; padding-right: 5px; }
               ${DM_HEADER_SELECTOR} { font-weight: bold; }
               ${DM_DOWNLOAD_SELECTOR} { cursor: pointer }`);

  var observerCallback = function (mutations, observer) {
    for (var mutation of mutations) {
      buildDownloadMenu(mutation);
      if (mutation.isSelectionMutation()) {
        appendToCurrentLog(mutation.getSelectedValue());
        break;
      }
    }
  };

  let observer = new MutationObserver(observerCallback);
  observer.observe(document.body, observerConfig);

  function buildDownloadMenu(mutation) {
    for (var node of mutation.addedNodes) {
      let trackMenu = (node.parentNode || node).querySelector('.audio-subtitle-controller');
      if (trackMenu !== null && trackMenu.querySelector('.subtitle-downloader-menu') === null) {
        let ul = document.createElement('ul');
        ul.setAttribute('class', 'track-list');
        ul.innerHTML = DOWNLOAD_MENU;
        trackMenu.appendChild(ul);
        ul.querySelector(DM_DOWNLOAD_SELECTOR).addEventListener('click', download);
      }
    }
  }

  function appendToCurrentLog(value) {
    currentLog = (currentLog ? currentLog + `\n` : '') + value;
    console.log(currentLog);
  }

  function download() {
    var blob = new Blob([currentLog], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${getTitle()}_selections.txt`);
  }

  function getTitle() {
    let titleElement = document.querySelector('h4.ellipsize-text');
    let title = titleElement.textContent;
    title = title ? title.replace(/[:*?"<>|\\\/]+/g, '_').replace(/ /g, '.') : 'selection_tracker';
    return title;
  }

  MutationRecord.prototype.isSelectionMutation = function () {
    return this.type == 'attributes'
      && this.target.classList.contains('BranchingInteractiveScene--choice-selection')
      && this.target.classList.contains('selected');
  }

  MutationRecord.prototype.getSelectedValue = function () {
    return this.target.getAttribute("aria-label");
  }
})();
// Q：Why I want to write this script？
// A: I often read articles on dev.to site, dev.to provides three buttons, namely like, unicorn and readinglist. But I want a button to indicate whether the current article has been read, similar to the read function of mailing lists and RSS.

// ==UserScript==
// @name         Mark post read on dev.to
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mark post read on dev.to.
// @author       Du Lin
// @match        https://dev.to/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/localforage/1.9.0/localforage.min.js
// @downloadURL https://update.greasyfork.org/scripts/425384/Mark%20post%20read%20on%20devto.user.js
// @updateURL https://update.greasyfork.org/scripts/425384/Mark%20post%20read%20on%20devto.meta.js
// ==/UserScript==

(function () {
  const buttonTexts = {
    unread: 'Mark As Read',
    read: 'Read',
  };

  function bindEvent() {
    const widget = document.querySelector('#marked-as-read-menu');
    const readButton = document.querySelector('#marked-as-read-button');
    const exportButton = document.querySelector('#marked-as-read-export-button');
    const closeMenuButton = document.querySelector('#marked-as-read-close-button');
    const exportReadListCloseButton = document.querySelector('#marked-as-read-export-read-list-close-button');
    readButton.addEventListener('click', onReadButtonClick, false);
    widget.addEventListener('click', onWidgetClick, false);
    exportButton.addEventListener('click', onExportButtonClick, false);
    closeMenuButton.addEventListener('click', onCloseMenuButtonClick, false);
    exportReadListCloseButton.addEventListener('click', onExportReadListCloseButtonClick, false);
  }

  async function initStorage() {
    localforage.config({
      driver: [localforage.INDEXEDDB, localforage.WEBSQL],
      name: 'mark-post-read-on-devto',
    });
    try {
      const list = await getReadListFromStorage();
      if (!list) {
        await localforage.setItem('list', []);
      }
    } catch (error) {
      console.error('intialize error, ', error);
    }
  }

  function createReadButton() {
    const button = document.createElement('button');
    button.id = 'marked-as-read-button';
    button.classList.add('crayons-reaction');
    button.textContent = buttonTexts.unread;
    button.style.cssText = 'border: 1px solid rgb(53, 53, 53);';
    return button;
  }

  function createExportButton() {
    const button = document.createElement('button');
    button.id = 'marked-as-read-export-button';
    button.textContent = 'export';
    button.style.marginRight = '10px';
    return button;
  }

  function createImportButton() {
    const button = document.createElement('button');
    button.id = 'marked-as-read-import-button';
    button.textContent = 'import';
    button.style.marginRight = '10px';
    return button;
  }

  function createCloseMenuButton() {
    const button = document.createElement('button');
    button.id = 'marked-as-read-close-button';
    button.textContent = 'close';
    return button;
  }

  function createExportReadList() {
    const div = document.createElement('div');
    const title = document.createElement('p');
    const closeButton = document.createElement('button');
    title.textContent = 'Export Read list';
    title.style.marginBottom = '10px';

    div.id = 'marked-as-read-export-list-container';
    div.style.cssText =
      'display: none; z-index: 1000; position: fixed; width: 800px; height: 600px; padding: 20px; background-color: #ddd; top: 0; left: 0;right: 0;bottom: 0;margin: auto';

    const textarea = document.createElement('textarea');
    textarea.id = 'marked-as-read-export-list';
    textarea.style.cssText = 'font-size: 14px; resize: none; width: 100%; height: 500px;';

    closeButton.id = 'marked-as-read-export-read-list-close-button';
    closeButton.textContent = 'close';

    div.appendChild(title);
    div.appendChild(textarea);
    div.appendChild(closeButton);
    return div;
  }

  function createWidget() {
    const buttonContainer = document.querySelector('.crayons-article-actions__inner');
    const pageContent = document.querySelector('#page-content-inner');
    const readButton = createReadButton();

    const widget = document.createElement('div');
    const panel = document.createElement('div');
    const widgetHeader = document.createElement('p');
    const exportButton = createExportButton();
    const importButton = createImportButton();
    const closeMenuButton = createCloseMenuButton();
    const exportReadList = createExportReadList();

    widget.id = 'marked-as-read-menu';
    widget.style.cssText = [
      'z-index: 100;',
      'position: fixed;',
      'top: 300px;',
      'transform-origin: 25px;',
      'transform: rotate(270deg);',
      'background-color: #ddd;',
      'border: 1px solid #aaa;',
      'padding: 10px;',
      'text-align: center;',
    ].join('');

    widgetHeader.textContent = 'Marked As Read Menu';

    panel.id = 'marked-as-read-menu-panel';
    panel.style.cssText = 'display: none;';

    panel.appendChild(exportButton);
    panel.appendChild(importButton);
    panel.appendChild(closeMenuButton);
    widget.appendChild(panel);
    widget.prepend(widgetHeader);
    pageContent.appendChild(widget);
    pageContent.appendChild(exportReadList);
    buttonContainer.prepend(readButton);

    return widget;
  }

  function onWidgetClick() {
    const panel = document.querySelector('#marked-as-read-menu-panel');
    const widget = document.querySelector('#marked-as-read-menu');
    panel.style.display = 'block';
    widget.style.transform = 'none';
  }

  function onExportReadListCloseButtonClick(e) {
    e.stopPropagation();
    const readlistWidget = document.querySelector('#marked-as-read-export-list-container');
    readlistWidget.style.display = 'none';
  }

  async function onExportButtonClick(e) {
    e.stopPropagation();
    const readlistWidget = document.querySelector('#marked-as-read-export-list-container');
    const readList = document.querySelector('#marked-as-read-export-list');
    readlistWidget.style.display = 'block';
    const list = await getReadListFromStorage();
    readList.value = list.join('\n');
  }

  function onCloseMenuButtonClick(e) {
    e.stopPropagation();
    const panel = document.querySelector('#marked-as-read-menu-panel');
    const widget = document.querySelector('#marked-as-read-menu');
    const readlistWidget = document.querySelector('#marked-as-read-export-list-container');
    panel.style.display = 'none';
    widget.style.transform = 'rotate(270deg)';
    readlistWidget.style.display = 'none';
  }

  async function onReadButtonClick(e) {
    e.stopPropagation();
    const isRead = await checkReadStatus();
    if (!isRead) {
      const r = AddItemToReadListStorage(window.location.href);
      if (r) {
        setReadButtonState();
      }
    } else {
      const r = removeItemFromReadListStorage();
      if (r) {
        resetReadButtonState();
      }
    }
  }

  async function init() {
    createWidget();
    bindEvent();
    await initStorage();
    const isRead = await checkReadStatus();
    if (isRead) {
      setReadButtonState();
    }
  }

  function setReadButtonState() {
    const readButton = document.querySelector('#marked-as-read-button');
    readButton.textContent = buttonTexts.read;
    readButton.classList.add('read');
  }

  function resetReadButtonState() {
    const readButton = document.querySelector('#marked-as-read-button');
    readButton.textContent = buttonTexts.unread;
    readButton.classList.remove('read');
  }

  async function checkReadStatus() {
    const list = await getReadListFromStorage();
    const idx = list.findIndex((url) => url === window.location.href);
    return idx > -1;
  }

  async function AddItemToReadListStorage(item) {
    const list = await getReadListFromStorage();
    const exists = list.findIndex((url) => url === item) > -1;
    if (exists) return false;
    list.push(item);
    localforage.setItem('list', list);
    return true;
  }

  async function removeItemFromReadListStorage(item) {
    const list = await getReadListFromStorage();
    const idx = list.findIndex((url) => url === item);
    list.splice(idx, 1);
    localforage.setItem('list', list);
    return true;
  }

  function getReadListFromStorage() {
    return localforage.getItem('list').catch(console.log);
  }

  init();
})();

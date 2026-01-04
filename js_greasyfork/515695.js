// ==UserScript==
// @name          TorrentBD: TorrentExport - Export Links or Metadata Instantly
// @namespace     eLibrarian-userscripts
// @description   Easily save visible torrent links (to clipboard or .txt) or metadata (as .zip) for seamless management and sharing!
// @version       0.1
// @author        eLib
// @license       GPL-3.0-or-later
// @match         https://*.torrentbd.net/*
// @match         https://*.torrentbd.com/*
// @match         https://*.torrentbd.org/*
// @match         https://*.torrentbd.me/*
// @grant         none
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/515695/TorrentBD%3A%20TorrentExport%20-%20Export%20Links%20or%20Metadata%20Instantly.user.js
// @updateURL https://update.greasyfork.org/scripts/515695/TorrentBD%3A%20TorrentExport%20-%20Export%20Links%20or%20Metadata%20Instantly.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const config = {
    allowedPaths: [
      '/',
      'index.php',
      '/account-details.php',
      '/activities.php',
      '/activity.php',
      '/seedbonus-breakdown.php',
      '/download-history.php'
    ],
    tableSelectors: {
      main: ['table.torrents-table', 'table.simple-data-table', 'table.striped.boxed.notif-table'],
      kuddus: ['.kuddus-torrents-table']
    },
    toast: {
      className: 'custom-toast-notification',
      visibleClass: 'visible',
      cancelButtonClass: 'toast-cancel-button',
      messageClass: 'toast-message',
      progressBarClass: 'toast-progress-bar',
      progressInnerClass: 'toast-progress-inner'
    },
    button: {
      className: 'enhanced-button',
      iconClass: 'material-icons',
      spanClass: 'button-text'
    },
    ui: {
      mainClass: 'torrent-links-ui',
      kuddusClass: 'kuddus-torrent-links-ui',
      countCheckboxId: 'countCB',
      countCheckboxClass: 'filled-in',
      kuddusCountCheckboxId: 'kuddus-countCB',
      kuddusCountCheckboxClass: 'filled-in'
    }
  };

  const state = {
    isMainPathAllowed: false,
    abortControllers: [],
    cancelDownload: false,
    downloadedFiles: [],
    errors: [],
    isProcessing: false
  };

  function initialize() {
    state.isMainPathAllowed = config.allowedPaths.some(path => window.location.pathname.includes(path));
    injectStyles();
    ensureMaterialIcons();
    if (state.isMainPathAllowed) {
      createAndInsertUI(false);
    }
    handleKuddusSection();
    observeDOMChanges();
  }

  function injectStyles() {
    const styles = `
      body {
        font-family: 'IBM Plex Sans', Verdana, sans-serif;
        font-size: 14px;
        color: rgba(184, 198, 204, 1);
      }

      .${config.toast.className} {
        font-family: 'IBM Plex Sans', Verdana, sans-serif;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(50, 50, 50, 0.95);
        color: #fff;
        padding: 10px 15px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        font-size: 14px;
        max-width: 400px;
        width: 80%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .${config.toast.className}.${config.toast.visibleClass} {
        opacity: 1;
        transform: translate(-50%, -50%);
      }
      .${config.toast.className} .${config.toast.messageClass} {
        margin-bottom: 5px;
        text-align: center;
        flex: 1;
        word-wrap: break-word;
      }
      .${config.toast.className} .${config.toast.progressBarClass} {
        width: 100%;
        height: 6px;
        background-color: #555;
        border-radius: 4px;
        overflow: hidden;
        margin-top: 5px;
      }
      .${config.toast.className} .${config.toast.progressInnerClass} {
        height: 100%;
        background-color: #4b8b61;
        width: 0%;
        transition: width 0.3s ease;
      }

      .${config.toast.cancelButtonClass} {
        position: absolute;
        top: 5px;
        right: 10px;
        background: transparent;
        border: none;
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        transition: color 0.3s ease;
      }
      .${config.toast.cancelButtonClass}:hover {
        color: #ff5252;
      }

      .${config.button.className} {
        display: inline-flex;
        align-items: center;
        color: #B0BEC5;
        text-decoration: none;
        gap: 4px;
        cursor: pointer;
        transition: color 0.3s ease;
      }
      .${config.button.className} .${config.button.iconClass} {
        font-size: 20px;
        color: #B0BEC5;
        transition: color 0.3s ease;
      }
      .${config.button.className} span.${config.button.spanClass} {
        font-size: 14px;
        transition: color 0.3s ease;
      }
      .${config.button.className}:hover .${config.button.iconClass},
      .${config.button.className}:hover span.${config.button.spanClass} {
        color: #4b8b61 !important;
      }

      .${config.button.className}.disabled {
        pointer-events: none;
        opacity: 0.5;
      }

      .${config.ui.mainClass}, .${config.ui.kuddusClass} {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px 0;
        gap: 10px;
        flex-wrap: wrap;
      }
      .${config.ui.mainClass} input[type="checkbox"],
      .${config.ui.kuddusClass} input[type="checkbox"] {
        transform: scale(1.2);
        margin-right: 5px;
      }
    `;
    const style = document.createElement('style');
    style.textContent = styles;
    document.head.appendChild(style);
  }

  function ensureMaterialIcons() {
    if (!document.querySelector('link[href*="fonts.googleapis.com/icon"]')) {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }

  function toggleButtonsState(disabled) {
    const buttons = document.querySelectorAll(`.${config.button.className}`);
    const checkboxes = document.querySelectorAll(`.${config.ui.mainClass} input[type="checkbox"], .${config.ui.kuddusClass} input[type="checkbox"]`);
    buttons.forEach(button => {
      if (disabled) {
        button.classList.add('disabled');
      } else {
        button.classList.remove('disabled');
      }
    });
    checkboxes.forEach(checkbox => {
      checkbox.disabled = disabled;
    });
  }

  function showToast({ message, showProgress = false, cancelable = false, onCancel = null, autoClose = 3000 }) {
    const existingToast = document.querySelector(`.${config.toast.className}`);
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.classList.add(config.toast.className);

    const messageDiv = document.createElement('div');
    messageDiv.classList.add(config.toast.messageClass);
    messageDiv.textContent = message;
    toast.appendChild(messageDiv);

    if (cancelable) {
      const cancelButton = document.createElement('button');
      cancelButton.classList.add(config.toast.cancelButtonClass);
      cancelButton.innerHTML = '&times;';
      cancelButton.title = 'Cancel';
      toast.appendChild(cancelButton);

      cancelButton.addEventListener('click', () => {
        if (onCancel && typeof onCancel === 'function') {
          onCancel();
        }
        closeToast(toast);
      });
    }

    if (showProgress) {
      const progressBar = document.createElement('div');
      progressBar.classList.add(config.toast.progressBarClass);
      const progressInner = document.createElement('div');
      progressInner.classList.add(config.toast.progressInnerClass);
      progressBar.appendChild(progressInner);
      toast.appendChild(progressBar);
    }

    document.body.appendChild(toast);
    void toast.offsetWidth;

    const highestZIndex = Array.from(document.querySelectorAll('*')).reduce((maxZ, element) => {
      const zIndex = parseInt(window.getComputedStyle(element).zIndex, 10);
      return isNaN(zIndex) ? maxZ : Math.max(maxZ, zIndex);
    }, 0);

    toast.style.zIndex = highestZIndex + 10;

    toast.classList.add(config.toast.visibleClass);

    if (!cancelable && autoClose > 0) {
      setTimeout(() => closeToast(toast), autoClose);
    }

    return {
      updateMessage: (newMessage) => {
        messageDiv.textContent = newMessage;
      },
      updateProgress: (percent) => {
        if (showProgress) {
          toast.querySelector(`.${config.toast.progressInnerClass}`).style.width = `${percent}%`;
        }
      },
      close: () => closeToast(toast),
    };
  }

  function closeToast(toast) {
    toast.classList.remove(config.toast.visibleClass);
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  function createStyledButton(iconName, tooltipTitle, onClickHandler) {
    const button = document.createElement('a');
    button.href = '#';
    button.title = tooltipTitle;
    button.classList.add(config.button.className);

    const icon = document.createElement('i');
    icon.classList.add(config.button.iconClass);
    icon.textContent = iconName;
    button.appendChild(icon);

    const span = document.createElement('span');
    span.classList.add(config.button.spanClass);
    span.textContent = tooltipTitle.split(' ')[0];
    button.appendChild(span);

    button.addEventListener('click', (event) => {
      event.preventDefault();
      if (!button.classList.contains('disabled')) {
        onClickHandler();
      }
    });

    return button;
  }

  function createAndInsertUI(isKuddus = false) {
    const uiClass = isKuddus ? config.ui.kuddusClass : config.ui.mainClass;

    if (document.querySelector(`.${uiClass}`)) {
      return;
    }

    const controlDiv = document.createElement('div');
    controlDiv.classList.add(uiClass);

    const countCheckbox = document.createElement('input');
    countCheckbox.type = 'checkbox';
    countCheckbox.id = isKuddus ? config.ui.kuddusCountCheckboxId : config.ui.countCheckboxId;
    countCheckbox.classList = isKuddus ? config.ui.kuddusCountCheckboxClass : config.ui.countCheckboxClass;
    controlDiv.appendChild(countCheckbox);

    const countLabel = document.createElement('label');
    countLabel.htmlFor = isKuddus ? config.ui.kuddusCountCheckboxId : config.ui.countCheckboxId;
    countLabel.textContent = 'Count';
    controlDiv.appendChild(countLabel);

    const copyButton = createStyledButton('content_copy', 'Copy Links', () => handleClipboard('copy', isKuddus));
    const saveButton = createStyledButton('save', 'Save Links', () => handleClipboard('save', isKuddus));
    const downloadButton = createStyledButton('download', 'Download Torrents', () => downloadTorrentsAsZip(isKuddus));

    controlDiv.append(copyButton, saveButton, downloadButton);

    if (isKuddus) {
      const kuddusContainer = document.querySelector('.kuddus-torrents-table');
      if (kuddusContainer) {
        kuddusContainer.parentNode.insertBefore(controlDiv, kuddusContainer);
      }
    } else {
      let container;
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath.includes('account-details.php') || currentPath.includes('index.php')) {
        container = document.querySelector('#torrents-main .torrents-container');
      } else if (currentPath.includes('activities.php') || currentPath.includes('activity.php') || currentPath.includes('seedbonus-breakdown.php')) {
        container = document.querySelector('table.simple-data-table');
      } else if (currentPath.includes('download-history.php')) {
        container = document.querySelector('.pagination');
      }
      if (container) {
        container.parentNode.insertBefore(controlDiv, container);
      }
    }
  }

  function handleKuddusSection() {
    const kuddusContainer = document.querySelector('.kuddus-torrents-table');
    if (kuddusContainer) {
      createAndInsertUI(true);
    }
  }

  function observeDOMChanges() {
    let timeout;
    const observer = new MutationObserver(mutationsList => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        mutationsList.forEach(mutation => {
          if (mutation.type === 'childList') {
            if (state.isMainPathAllowed) {
              createAndInsertUI(false);
            }
            handleKuddusSection();
          }
        });
      }, 300);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function handleClipboard(action, isKuddus = false) {
    const output = isKuddus ? getKuddusTorrentLinks() : getMainTorrentLinks();
    if (!output) {
      showToast({ message: 'No links found!', cancelable: false });
      return;
    }

    toggleButtonsState(true);
    state.isProcessing = true;

    if (action === 'copy') {
      navigator.clipboard.writeText(output).then(() => {
        showToast({ message: 'Copied to Clipboard', cancelable: false });
        toggleButtonsState(false);
        state.isProcessing = false;
      }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = output;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          showToast({ message: 'Copied to Clipboard', cancelable: false });
        } catch {
          showToast({ message: 'Failed to Copy!', cancelable: false });
        }
        document.body.removeChild(textarea);
        toggleButtonsState(false);
        state.isProcessing = false;
      });
    } else if (action === 'save') {
      const filename = 'TorrentLinks.txt';
      downloadFile(output, filename);
      showToast({ message: `Saved as ${filename}`, cancelable: false });
      toggleButtonsState(false);
      state.isProcessing = false;
    }
  }

  function downloadFile(data, fileName, mimeType = 'text/plain') {
    const blob = typeof data === 'string' ? new Blob([data], { type: mimeType }) : data;
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadLink.href);
  }

  async function downloadTorrentsAsZip(isKuddus = false) {
    const output = isKuddus ? getKuddusTorrentLinks() : getMainTorrentLinks();
    if (!output) {
      showToast({ message: 'No links found!', cancelable: false });
      return;
    }
    const links = output.split('\n').filter(link => link.trim() !== '');
    state.downloadedFiles = [];
    state.errors = [];
    state.abortControllers = [];
    state.cancelDownload = false;

    toggleButtonsState(true);

    const toast = showToast({
      message: `Starting download of ${links.length} torrent(s)...`,
      showProgress: true,
      cancelable: true,
      onCancel: () => {
        state.cancelDownload = true;
        state.abortControllers.forEach(controller => controller.abort());
        toast.updateMessage('Download Cancelled');
        setTimeout(() => toast.close(), 3000);
        toggleButtonsState(false);
        state.isProcessing = false;
      }
    });

    for (let i = 0; i < links.length; i++) {
      if (state.cancelDownload) break;
      const link = links[i];
      const torrentID = extractTorrentID(link);
      if (torrentID) {
        const downloadURL = `${window.location.origin}/download.php?id=${torrentID}`;
        await downloadTorrent(downloadURL, state.downloadedFiles, document.getElementById(isKuddus ? config.ui.kuddusCountCheckboxId : config.ui.countCheckboxId)?.checked ? i + 1 : null, state.abortControllers, state.errors);
        if (state.cancelDownload) break;
        const progressPercent = Math.round(((i + 1) / links.length) * 100);
        toast.updateProgress(progressPercent);
        toast.updateMessage(`Downloading... (${progressPercent}%)`);
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        state.errors.push(`Invalid torrent link: ${link}`);
      }
    }

    if (state.downloadedFiles.length > 0 && !state.cancelDownload) {
      createZip(state.downloadedFiles);
      showToast({ message: `Downloaded ${state.downloadedFiles.length} torrent(s)`, cancelable: false });
    } else if (!state.cancelDownload) {
      toast.updateMessage('No torrents Downloaded!');
    }

    if (state.errors.length > 0) {
      const errorMessage = state.errors.length === 1
        ? state.errors[0]
        : `${state.errors.length} errors occurred:\n` + state.errors.join('\n');
      showToast({ message: errorMessage, cancelable: false });
    }

    toggleButtonsState(false);
    state.isProcessing = false;
  }

  async function downloadTorrent(downloadURL, downloadedFiles, count = null, abortControllers, errors) {
    const controller = new AbortController();
    abortControllers.push(controller);

    try {
      const response = await fetch(downloadURL, { credentials: 'include', signal: controller.signal });
      if (!response.ok) throw new Error(`Failed to Download: ${response.statusText}`);

      const blob = await response.blob();
      const torrentID = extractTorrentID(downloadURL);
      let filename = `[TorrentBD]${torrentID}.torrent`;
      const disposition = response.headers.get('Content-Disposition');
      const matches = disposition?.match(/filename[^;=\n]*=([^;\n]*)/);
      if (matches?.[1]) filename = matches[1].trim().replace(/['"]/g, '');

      if (count !== null) {
        filename = `${count}. ${filename}`;
      }

      downloadedFiles.push({ blob, filename });
    } catch (error) {
      if (error.name === 'AbortError') {
        const message = state.cancelDownload ? 'Download Canceled' : 'Download Aborted';
        showToast({ message, cancelable: false });
      } else {
        errors.push(`Error downloading ${downloadURL}: ${error.message}`);
      }
    }
  }

  function createZip(files) {
    if (typeof JSZip === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.0/jszip.min.js';
      script.onload = proceedWithZip;
      document.head.appendChild(script);
    } else {
      proceedWithZip();
    }

    function proceedWithZip() {
      const zip = new JSZip();
      files.forEach(file => zip.file(file.filename, file.blob));

      zip.generateAsync({ type: 'blob' }).then(content => {
        const anchor = document.createElement('a');
        anchor.href = window.URL.createObjectURL(content);
        anchor.download = 'TorrentMetaFiles.zip';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(anchor.href);
        showToast({ message: `Downloaded ${files.length} torrent(s)`, cancelable: false });
      }).catch(() => {
        showToast({ message: `Error Creating Zip!`, cancelable: false });
      });
    }
  }

  function getMainTorrentLinks() {
    const isCountEnabled = document.getElementById(config.ui.countCheckboxId)?.checked || false;
    return extractTorrentLinks(config.tableSelectors.main, isCountEnabled);
  }

  function getKuddusTorrentLinks() {
    const isCountEnabled = document.querySelector(`.${config.ui.kuddusClass} #${config.ui.kuddusCountCheckboxId}`)?.checked || false;
    return extractTorrentLinks(config.tableSelectors.kuddus, isCountEnabled);
  }

  function extractTorrentLinks(selectors, isCountEnabled) {
    const links = [];
    const baseUrl = window.location.origin;
    let count = isCountEnabled ? 1 : 0;

    selectors.forEach(selector => {
      const tables = document.querySelectorAll(selector);
      tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
          const linkElement = row.querySelector('a[href*="torrents-details.php?id="]');
          if (linkElement) {
            const href = linkElement.getAttribute('href');
            const torrentID = extractTorrentID(href);
            if (torrentID) {
              const fullLink = `${baseUrl}/torrents-details.php?id=${torrentID}`;
              const linkWithCount = isCountEnabled ? `${count}. ${fullLink}` : fullLink;
              if (isCountEnabled) count += 1;
              links.push(linkWithCount);
            }
          }
        });
      });
    });

    return links.join('\n');
  }

  function extractTorrentID(link) {
    try {
      const url = new URL(link, window.location.origin);
      return parseInt(url.searchParams.get('id'), 10) || null;
    } catch (e) {
      return null;
    }
  }

  initialize();
})();
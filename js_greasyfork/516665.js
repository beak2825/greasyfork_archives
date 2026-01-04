// ==UserScript==
// @name          TorrentBD: MetaCollector - Multi Torrent Downloader
// @namespace     eLibrarian-userscripts
// @description   Download torrent files from a list of links in a .txt file and bundle them into a zip!
// @version       0.1
// @author        eLib
// @license       GPL-3.0-or-later
// @match         https://*.torrentbd.net/*
// @match         https://*.torrentbd.com/*
// @match         https://*.torrentbd.org/*
// @match         https://*.torrentbd.me/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/516665/TorrentBD%3A%20MetaCollector%20-%20Multi%20Torrent%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/516665/TorrentBD%3A%20MetaCollector%20-%20Multi%20Torrent%20Downloader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const config = {
    selectors: {
      targetContainer: '#left-block-container',
      collapsibleList: 'ul.collapsible',
      scriptsSection: 'li[data-section="scripts"]',
      metaCollectorSection: '#meta-collector-section',
      attachmentButton: '.attachment-button',
      numberingCheckbox: '#numberingCheckbox',
      numberedListIcon: 'label[for="numberingCheckbox"] .material-icons',
    },
    toast: {
      className: 'custom-toast-notification',
      visibleClass: 'visible',
      cancelButtonClass: 'toast-cancel-button',
      messageClass: 'toast-message',
      progressBarClass: 'toast-progress-bar',
      progressInnerClass: 'toast-progress-inner',
    },
    button: {
      className: 'download-button',
      iconClass: 'material-icons',
      spanClass: 'button-text',
    },
  };

  const state = {
    cancelDownload: false,
    downloadedFiles: [],
    linksFromFile: [],
  };

  const utils = {
    applyStyles: (element, styles) => Object.assign(element.style, styles),

    createElement: (tag, options = {}) => {
      const el = document.createElement(tag);
      if (options.classNames) el.className = options.classNames;
      if (options.id) el.id = options.id;
      if (options.text) el.textContent = options.text;
      if (options.html) el.innerHTML = options.html;
      if (options.attributes) {
        Object.keys(options.attributes).forEach((attr) => {
          el.setAttribute(attr, options.attributes[attr]);
        });
      }
      return el;
    },

    truncateString: (str, num) => (str.length <= num ? str : `${str.slice(0, num)}...`),

    extractTorrentID: (link) => {
      try {
        const url = new URL(link, window.location.origin);
        return parseInt(url.searchParams.get('id'), 10) || null;
      } catch (e) {
        return null;
      }
    },
  };

  const loadExternalScripts = (src, callback) => {
    const script = utils.createElement('script', { attributes: { src } });
    script.onload = callback;
    document.head.appendChild(script);
  };

  const initialize = () => {
    injectStyles();
    window.addEventListener('load', setupMetaCollector);
  };

  const injectStyles = () => {
    const styles = `
      body {
        font-family: 'IBM Plex Sans', Verdana, sans-serif;
        font-size: 14px;
        color: rgba(184, 198, 204, 1);
      }

      .highlight-text {
        animation: highlight-animation 1s infinite;
      }
      @keyframes highlight-animation {
        0% { color: #fff; }
        50% { color: red; }
        100% { color: #fff; }
      }

      .highlight-icon {
        animation: shake 0.5s infinite, highlight-animation-icon 1s infinite;
      }
      @keyframes shake {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(5deg); }
        50% { transform: rotate(0deg); }
        75% { transform: rotate(-5deg); }
        100% { transform: rotate(0deg); }
      }
      @keyframes highlight-animation-icon {
        0% { color: #fff; }
        50% { color: red; }
        100% { color: #fff; }
      }

      .attachment-button {
        display: flex;
        align-items: center;
        padding: 5px;
        border-radius: 5px;
        cursor: pointer;
        justify-content: flex-start;
        color: #fff;
        position: relative;
        background-color: transparent !important;
        border: 1px solid #fff !important;
        outline: none !important;
        box-shadow: none !important;
        transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 40px;
      }
      .attachment-button:not(.disabled):hover {
        background-color: rgba(75, 139, 97, 0.1) !important;
        border-color: #4b8b61 !important;
        color: #4b8b61 !important;
      }
      .attachment-button:not(.disabled):hover .material-icons,
      .attachment-button:not(.disabled):hover .file-text {
        color: #4b8b61 !important;
      }
      .attachment-button .file-text {
        font-weight: bold;
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex-grow: 1;
        max-width: 100%;
      }
      .attachment-button .material-icons {
        margin-right: 5px;
        flex-shrink: 0;
        color: #fff;
      }

      .attachment-button.active-attachment {
        color: #4b8b61;
        border: 1px solid #4b8b61;
      }
      .attachment-button.active-attachment .material-icons {
        color: #4b8b61;
      }

      .download-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: transparent !important;
        color: #fff !important;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.85em;
        flex-shrink: 0;
        outline: none !important;
        box-shadow: none !important;
        border: 1px solid #fff !important;
        transition: background-color 0.3s ease, opacity 0.3s ease, cursor 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        height: 40px;
      }
      .download-button:not(.disabled):hover {
        background-color: rgba(75, 139, 97, 0.1) !important;
        border-color: #4b8b61 !important;
        color: #4b8b61 !important;
      }
      .download-button.disabled {
        color: grey !important;
        border-color: grey !important;
        opacity: 0.6 !important;
        cursor: not-allowed !important;
      }
      .download-button.active {
        color: #4b8b61 !important;
        border-color: #4b8b61 !important;
      }

      .attachment-button,
      .attachment-button *,
      .attachment-button:focus,
      .attachment-button:active,
      .attachment-button:hover,
      .attachment-button:focus-visible,
      .download-button,
      .download-button *,
      .download-button:focus,
      .download-button:active,
      .download-button:hover,
      .download-button:focus-visible {
        outline: none !important;
        border: none !important;
        box-shadow: none !important;
      }

      .${config.toast.className} {
        font-family: 'IBM Plex Sans', Verdana, sans-serif;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.95);
        background-color: rgba(50, 50, 50, 0.95);
        color: #fff;
        padding: 10px 15px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 10000;
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

      .shake {
        animation: shake 0.5s infinite;
      }

      .button-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 5px;
        position: relative;
        padding: 2px;
        margin-left: 20px;
        margin-right: 5px;
        background-color: transparent;
        border-radius: 5px;
        z-index: 10000;
        width: 100%;
        height: auto;
        flex-wrap: nowrap;
      }

      .metacollector-buttons {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 5px;
        width: 100%;
        overflow: hidden;
      }

      .attachment-button.animate .material-icons {
        animation: shake 0.5s infinite;
        color: red !important;
      }
      .attachment-button.animate .file-text {
        animation: shake 0.5s infinite;
        color: red !important;
      }

      .attachment-button .file-text {
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      #numberingCheckbox:disabled + label .material-icons {
        color: grey !important;
      }
    `;
    const style = document.createElement('style');
    style.textContent = styles;
    document.head.appendChild(style);
  };

  const setupMetaCollector = () => {
    const targetContainer = document.querySelector(config.selectors.targetContainer);

    if (!targetContainer) {
      showToast({ message: 'Target element not found. Please ensure the selector is correct.', type: 'error' });
      return;
    }

    const collapsibleList = targetContainer.querySelector(config.selectors.collapsibleList);
    if (!collapsibleList) return;

    let scriptsSection = collapsibleList.querySelector(config.selectors.scriptsSection);
    if (!scriptsSection) {
      scriptsSection = createCollapsibleSection('Scripts', 'code', collapsibleList);
      const dropdownIcon = utils.createElement('i', { classNames: 'material-icons right', text: 'arrow_drop_down' });
      scriptsSection.querySelector('.collapsible-header').appendChild(dropdownIcon);
    }

    let metaCollectorSection = scriptsSection.querySelector(config.selectors.metaCollectorSection);
    if (!metaCollectorSection) {
      metaCollectorSection = createMetaCollectorSection(scriptsSection);
    }
  };

  const createCollapsibleSection = (title, iconName, container) => {
    const section = utils.createElement('li', { attributes: { 'data-section': 'scripts' } });
    const header = createCollapsibleHeader(title, iconName);
    const body = utils.createElement('div', { classNames: 'collapsible-body' });
    body.style.display = 'none';
    section.append(header, body);
    container.appendChild(section);
    return section;
  };

  const createCollapsibleHeader = (title, iconName) => {
    const header = utils.createElement('div', { classNames: 'collapsible-header' });
    const icon = utils.createElement('i', { classNames: `material-icons orange600`, text: iconName });
    const text = document.createTextNode(` ${title}`);
    header.append(icon, text);
    return header;
  };

  const createMetaCollectorSection = (parentSection) => {
    const metaCollectorHeader = createCollapsibleHeader('MetaCollector', 'cloud_download');
    metaCollectorHeader.id = 'meta-collector-section';
    utils.applyStyles(metaCollectorHeader, {
      padding: '2px 20px',
      cursor: 'pointer',
      marginLeft: '25px',
      position: 'relative',
    });

    const metaCollectorBody = utils.createElement('div', { classNames: 'collapsible-body' });
    metaCollectorBody.style.display = 'none';

    const inputContainer = createInputContainer(metaCollectorBody);
    metaCollectorBody.appendChild(inputContainer);
    parentSection.querySelector('.collapsible-body').append(metaCollectorHeader, metaCollectorBody);

    metaCollectorHeader.addEventListener('click', () => {
      metaCollectorBody.style.display = metaCollectorBody.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', (event) => {
      const attachmentButton = document.querySelector(config.selectors.attachmentButton);
      if (attachmentButton && !attachmentButton.contains(event.target)) {
        removeHighlightFromInputBar(attachmentButton);
      }
    });

    return metaCollectorBody;
  };

  const createInputContainer = (parent) => {
    const container = utils.createElement('div');
    utils.applyStyles(container, {
      position: 'relative',
      padding: '2px',
      marginLeft: '35px',
      marginRight: '5px',
      backgroundColor: 'transparent',
      borderRadius: '5px',
      zIndex: '10000',
      width: 'calc(100% - 50px)',
      display: 'flex',
      alignItems: 'center',
      height: '40px',
    });

    const buttonContainer = utils.createElement('div', { classNames: 'button-container' });
    utils.applyStyles(buttonContainer, {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'nowrap',
      width: '100%',
      height: '100%',
      gap: '5px',
    });

    const attachmentButton = createAttachmentButton();
    utils.applyStyles(attachmentButton, {
      flex: '0 0 40%',
      maxWidth: '40%',
      overflow: 'hidden',
    });

    const checkboxElement = createNumberingCheckbox();
    const checkboxLabel = utils.createElement('label', { attributes: { for: 'numberingCheckbox' } });
    const numberedListIcon = utils.createElement('i', { classNames: 'material-icons', text: 'format_list_numbered' });
    checkboxLabel.appendChild(numberedListIcon);
    utils.applyStyles(checkboxLabel, {
      marginLeft: '5px',
      color: '#4b8b61',
    });
    utils.applyStyles(checkboxElement, {
      flex: '0 0 20%',
      marginLeft: '10px',
      display: 'block',
      visibility: 'visible',
    });

    const buttonsDiv = utils.createElement('div', { classNames: 'metacollector-buttons' });
    utils.applyStyles(buttonsDiv, {
      flex: '0 0 40%',
      maxWidth: '40%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      overflow: 'hidden',
    });

    appendDownloadButton(buttonsDiv, { disableButton: true }, attachmentButton);

    buttonContainer.append(attachmentButton, checkboxElement, checkboxLabel, buttonsDiv);
    container.appendChild(buttonContainer);
    parent.appendChild(container);

    return container;
  };

  const createAttachmentButton = () => {
    const attachmentButton = utils.createElement('div', { classNames: 'attachment-button default-attachment' });
    utils.applyStyles(attachmentButton, {
      display: 'flex',
      alignItems: 'center',
      padding: '5px',
      borderRadius: '5px',
      cursor: 'pointer',
      justifyContent: 'flex-start',
      color: '#fff',
      position: 'relative',
      backgroundColor: 'transparent',
      border: '1px solid #fff',
      outline: 'none',
      boxShadow: 'none',
      transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease',
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      height: '40px',
    });

    const iconElement = utils.createElement('i', { classNames: 'material-icons', text: 'attachment' });
    utils.applyStyles(iconElement, {
      marginRight: '5px',
      flexShrink: '0',
    });

    const fileTextSpan = utils.createElement('span', { classNames: 'file-text', text: 'Links' });
    utils.applyStyles(fileTextSpan, {
      flexGrow: '1',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    });

    attachmentButton.append(iconElement, fileTextSpan);

    const fileInput = utils.createElement('input', { attributes: { type: 'file', accept: '.txt', id: 'fileInput' } });
    utils.applyStyles(fileInput, { display: 'none' });

    attachmentButton.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (event) => handleFileInput(event, attachmentButton));

    attachmentButton.appendChild(fileInput);

    return attachmentButton;
  };

  const createNumberingCheckbox = () => {
    const checkbox = utils.createElement('input', { attributes: { type: 'checkbox', id: 'numberingCheckbox' } });
    checkbox.className = 'filled-in';
    checkbox.disabled = true;
    utils.applyStyles(checkbox, {
      width: '20px',
      height: '20px',
      visibility: 'visible',
      display: 'block',
    });
    return checkbox;
  };

  const handleFileInput = (event, attachmentButton) => {
    const file = event.target.files[0];
    if (file) {
      attachmentButton.classList.remove('animate');
      removeHighlightFromInputBar(attachmentButton);

      attachmentButton.classList.remove('default-attachment');
      attachmentButton.classList.add('active-attachment');

      const fileTextSpan = attachmentButton.querySelector('.file-text');
      const iconElement = attachmentButton.querySelector('.material-icons');
      if (fileTextSpan) {
        fileTextSpan.textContent = utils.truncateString(file.name, 7);
        fileTextSpan.style.color = '#4b8b61';
      }
      if (iconElement) {
        iconElement.style.color = '#4b8b61';
      }

      attachmentButton.classList.add('file-added');

      const buttonsDiv = attachmentButton.parentElement.querySelector('.metacollector-buttons');
      if (buttonsDiv) enableDownloadButton(buttonsDiv);

      const checkbox = document.querySelector(config.selectors.numberingCheckbox);
      if (checkbox) {
        checkbox.disabled = false;
        const numberedListIcon = document.querySelector(config.selectors.numberedListIcon);
        if (numberedListIcon) {
          numberedListIcon.style.color = '#4b8b61';
        }
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const links = content.split('\n').map(link => link.trim()).filter(link => link !== '');
        if (links.length > 0) {
          state.linksFromFile = links;
        } else {
          showToast({ message: 'File: No torrent(s) Found!', type: 'error' });
        }
      };
      reader.readAsText(file);

      setTimeout(() => {
        event.target.value = '';
      }, 0);
    } else {
      attachmentButton.classList.add('animate');
      const iconElement = attachmentButton.querySelector('.material-icons');
      const fileTextSpan = attachmentButton.querySelector('.file-text');
      if (iconElement) iconElement.style.color = 'red';
      if (fileTextSpan) fileTextSpan.style.color = 'red';
    }
  };

  const appendDownloadButton = (parentElement, options = {}, attachmentButton = null) => {
    const downloadButton = createButton('download', 'Download', 'a', options.disableButton);

    if (options.disableButton) {
      downloadButton.classList.add('disabled');
      downloadButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        highlightInputBar(attachmentButton);
      });
    } else {
      downloadButton.addEventListener('click', handleDownloadClick);
    }

    parentElement.appendChild(downloadButton);
  };

  const createButton = (iconName, text, tag = 'button', disabled = false) => {
    const button = utils.createElement(tag, { classNames: config.button.className, text: ` ${text}` });
    const icon = utils.createElement('i', { classNames: config.button.iconClass, text: iconName });
    button.prepend(icon);
    if (disabled) button.classList.add('disabled');
    return button;
  };

  const enableDownloadButton = (buttonsDiv) => {
    buttonsDiv.querySelectorAll(`.${config.button.className}`).forEach((button) => {
      button.classList.remove('disabled');
      button.classList.add('active');

      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      newButton.addEventListener('click', handleDownloadClick);
    });
  };

  const handleDownloadClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!state.linksFromFile.length) {
      const attachmentButton = document.querySelector(config.selectors.attachmentButton);
      highlightInputBar(attachmentButton);
      return;
    }

    disableUI();

    const links = state.linksFromFile;
    const toast = showToast({
      message: `Starting download of ${links.length} torrent(s)...`,
      showProgress: true,
      cancelable: true,
      onCancel: () => {
        state.cancelDownload = true;
        toast.updateMessage('Download Cancelled');
        toast.updateProgress(0);
        toast.close();
        enableUI();
      },
    });

    state.downloadedFiles = [];
    state.cancelDownload = false;

    const addNumbering = document.querySelector(config.selectors.numberingCheckbox)?.checked || false;

    links.forEach((link, index) => {
      setTimeout(() => {
        if (state.cancelDownload) return;
        const torrentID = utils.extractTorrentID(link);
        if (torrentID) {
          const currentDomain = window.location.hostname;
          const downloadURL = `https://${currentDomain}/download.php?id=${torrentID}`;
          downloadTorrent(downloadURL, index === links.length - 1, toast, links.length, index, addNumbering);
        }
      }, index * 200);
    });
  };

  const highlightInputBar = (attachmentButton) => {
    const fileText = attachmentButton.querySelector('.file-text');
    const icon = attachmentButton.querySelector('.material-icons');

    if (fileText) fileText.classList.add('highlight-text');
    if (icon) icon.classList.add('highlight-icon');

    const clickHandler = (event) => {
      if (!attachmentButton.contains(event.target)) {
        removeHighlightFromInputBar(attachmentButton);
        document.removeEventListener('click', clickHandler);
      }
    };
    document.addEventListener('click', clickHandler);
  };

  const removeHighlightFromInputBar = (attachmentButton) => {
    const fileText = attachmentButton.querySelector('.file-text');
    const icon = attachmentButton.querySelector('.material-icons');

    if (attachmentButton.classList.contains('file-added')) return;

    if (fileText) {
      fileText.classList.remove('highlight-text');
      fileText.style.color = '#fff';
    }
    if (icon) {
      icon.classList.remove('highlight-icon');
      icon.style.color = '#fff';
    }
  };

  const disableUI = () => {
    const attachmentButton = document.querySelector(config.selectors.attachmentButton);
    const numberingCheckbox = document.querySelector(config.selectors.numberingCheckbox);
    const downloadButtons = document.querySelectorAll(`.${config.button.className}`);

    if (attachmentButton) {
      attachmentButton.classList.add('disabled');
      attachmentButton.style.pointerEvents = 'none';
      attachmentButton.style.opacity = '0.6';
    }
    if (numberingCheckbox) {
      numberingCheckbox.disabled = true;
    }
    downloadButtons.forEach(btn => {
      btn.classList.add('disabled');
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.6';
    });
  };

  const enableUI = () => {
    const attachmentButton = document.querySelector(config.selectors.attachmentButton);
    const numberingCheckbox = document.querySelector(config.selectors.numberingCheckbox);
    const downloadButtons = document.querySelectorAll(`.${config.button.className}`);

    if (attachmentButton) {
      attachmentButton.classList.remove('disabled');
      attachmentButton.style.pointerEvents = '';
      attachmentButton.style.opacity = '';
    }
    if (numberingCheckbox) {
      numberingCheckbox.disabled = false;
    }
    downloadButtons.forEach(btn => {
      btn.classList.remove('disabled');
      btn.style.pointerEvents = '';
      btn.style.opacity = '';
    });
  };

  const downloadTorrent = async (downloadURL, isLast, toast, totalLinks, currentIndex, addNumbering) => {
    try {
      const response = await fetch(downloadURL, { credentials: 'include' });
      if (!response.ok) throw new Error(`Failed to Download: ${response.statusText}`);

      const blob = await response.blob();
      const torrentID = extractTorrentID(downloadURL);
      let filename = `[TorrentBD]${torrentID}.torrent`;

      const disposition = response.headers.get('Content-Disposition');
      if (disposition && disposition.includes('filename=')) {
        const matches = /filename[^;=\n]*=([^;\n]*)/.exec(disposition);
        if (matches && matches[1]) filename = matches[1].trim().replace(/['"]/g, '');
      }

      if (addNumbering) {
        const count = currentIndex + 1;
        filename = `${count}. ${filename}`;
      }

      state.downloadedFiles.push({ blob, filename });

      const progress = Math.round(((currentIndex + 1) / totalLinks) * 100);
      toast.updateProgress(progress);
      toast.updateMessage(`Downloading... (${progress}%)`);

      if (isLast) {
        await createZip(state.downloadedFiles, toast);
        enableUI();
      }
    } catch (error) {
      showToast({ message: `Error Downloading: ${error.message}`, type: 'error' });
      enableUI();
    }
  };

  const createZip = (files, toast) => {
    const zip = new JSZip();
    files.forEach((file) => zip.file(file.filename, file.blob));

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const url = window.URL.createObjectURL(content);
      const anchor = utils.createElement('a', { attributes: { href: url, download: 'TorrentMetaFiles.zip' }, html: '' });
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      window.URL.revokeObjectURL(url);
      toast.updateMessage('Download Completed');
      setTimeout(() => toast.close(), 3000);
    });
  };

  const showToast = ({ message, showProgress = false, cancelable = false, onCancel = null, type = 'info' }) => {
    const existingToast = document.querySelector(`.${config.toast.className}`);
    if (existingToast) existingToast.remove();

    const toast = utils.createElement('div', { classNames: config.toast.className });

    if (cancelable) {
      const cancelButton = utils.createElement('button', { classNames: config.toast.cancelButtonClass, html: '&times;' });
      cancelButton.title = 'Cancel Processing';
      toast.appendChild(cancelButton);
      cancelButton.addEventListener('click', () => {
        if (onCancel && typeof onCancel === 'function') onCancel();
      });
    }

    const messageDiv = utils.createElement('div', { classNames: config.toast.messageClass, text: message });
    toast.appendChild(messageDiv);

    let progressBar = null;
    if (showProgress) {
      progressBar = utils.createElement('div', { classNames: config.toast.progressBarClass });
      const progressInner = utils.createElement('div', { classNames: config.toast.progressInnerClass });
      progressBar.appendChild(progressInner);
      toast.appendChild(progressBar);
    }

    if (type === 'error') {
      toast.style.backgroundColor = 'rgba(255, 0, 0, 0.95)';
      if (progressBar) {
        progressBar.querySelector(`.${config.toast.progressInnerClass}`).style.backgroundColor = '#ff5252';
      }
    }

    document.body.appendChild(toast);
    void toast.offsetWidth;
    toast.classList.add(config.toast.visibleClass);

    return {
      updateMessage: (newMessage) => {
        messageDiv.textContent = newMessage;
      },
      updateProgress: (percent) => {
        if (progressBar) {
          progressBar.querySelector(`.${config.toast.progressInnerClass}`).style.width = `${percent}%`;
        }
      },
      close: () => {
        toast.classList.remove(config.toast.visibleClass);
        setTimeout(() => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
      },
    };
  };

  const extractTorrentID = (link) => {
    try {
      const url = new URL(link, window.location.origin);
      return parseInt(url.searchParams.get('id'), 10) || null;
    } catch (e) {
      return null;
    }
  };

  loadExternalScripts('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js', initialize);

})();
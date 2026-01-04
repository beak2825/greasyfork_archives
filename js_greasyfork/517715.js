// ==UserScript==
// @name          TorrentBD: JoySender - Spread Happiness on Torrents
// @namespace     eLibrarian-userscripts
// @description   Spread joy on TorrentBD by effortlessly sending thanks, reputation, and gifting seedbonuses within few clicks!
// @version       0.1
// @author        eLib
// @license       GPL-3.0-or-later
// @match         https://*.torrentbd.net/*
// @match         https://*.torrentbd.com/*
// @match         https://*.torrentbd.org/*
// @match         https://*.torrentbd.me/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/517715/TorrentBD%3A%20JoySender%20-%20Spread%20Happiness%20on%20Torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/517715/TorrentBD%3A%20JoySender%20-%20Spread%20Happiness%20on%20Torrents.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const allowedPaths = ['/', '/index.php', '/account-details.php'];
  const currentPath = window.location.pathname;

  if (!allowedPaths.includes(currentPath)) {
    return;
  }

  let isFileAttached = false;
  let cancelProcessing = false;

  function showToast(options) {
    const { message, showProgress = false, totalSteps = 0, cancelable = false, onCancel = null } = options;
    const existingToast = document.querySelector('.custom-toast-notification');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.classList.add('custom-toast-notification');

    if (cancelable) {
      const cancelButton = document.createElement('button');
      cancelButton.classList.add('toast-cancel-button');
      cancelButton.innerHTML = '&times;';
      cancelButton.title = 'Cancel Processing';
      toast.appendChild(cancelButton);

      cancelButton.addEventListener('click', () => {
        if (onCancel && typeof onCancel === 'function') {
          onCancel();
        }
      });
    }

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('toast-message');
    messageDiv.textContent = message;

    toast.appendChild(messageDiv);

    let progressBar = null;
    if (showProgress) {
      progressBar = document.createElement('div');
      progressBar.classList.add('toast-progress-bar');
      const progressInner = document.createElement('div');
      progressInner.classList.add('toast-progress-inner');
      progressBar.appendChild(progressInner);
      toast.appendChild(progressBar);
    }

    document.body.appendChild(toast);
    void toast.offsetWidth;
    toast.classList.add('visible');

    return {
      updateMessage: (newMessage) => {
        messageDiv.textContent = newMessage;
      },
      updateProgress: (percent) => {
        if (progressBar) {
          progressBar.querySelector('.toast-progress-inner').style.width = `${percent}%`;
        }
      },
      close: () => {
        toast.classList.remove('visible');
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      },
    };
  }

  async function executeAction(actionType, torrentID, giftAmount) {
    const siteUrl = `${window.location.origin}/`;
    const ajaxSuffix = '?ajax=1';
    const actionConfigurations = {
      thank: { url: `${siteUrl}ajthank.php${ajaxSuffix}`, data: { i: torrentID } },
      rep: { url: `${siteUrl}ajaddrep.php${ajaxSuffix}`, data: { i: torrentID } },
      seed: { url: `${siteUrl}ajgiftsb.php`, data: { t: torrentID, a: giftAmount } },
    };

    const selectedAction = actionConfigurations[actionType];
    if (!selectedAction) return false;

    try {
      const response = await fetch(selectedAction.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(selectedAction.data),
      });

      if (response.ok) {
        return true;
      } else {
        console.error(`Failed to perform ${actionType} on torrent ID ${torrentID}`);
        return false;
      }
    } catch (error) {
      console.error(`Error performing ${actionType} on torrent ID ${torrentID}:`, error);
      return false;
    }
  }

  const extractTorrentID = (link) => {
    try {
      const url = new URL(link, window.location.origin);
      return parseInt(url.searchParams.get('id'), 10) || null;
    } catch (e) {
      return null;
    }
  };

  const retrieveVisibleTorrentIDs = () =>
    Array.from(document.querySelectorAll('#torrents-main a[href*="torrents-details.php"]'))
      .map((link) => extractTorrentID(link.href))
      .filter((ID) => ID);

  async function performActionOnVisibleTorrents(actionType, giftAmount = null) {
    const torrentIDs = retrieveVisibleTorrentIDs();
    if (torrentIDs.length === 0) {
      showToast({ message: 'Page: No torrent(s) Found!' });
      return;
    }
    await performActionsOnTorrentIDs(torrentIDs, [actionType], giftAmount);
  }

  const createStyledButton = (iconName, tooltipTitle) => {
    const buttonElement = document.createElement('a');
    buttonElement.className = 'joysender-button';
    buttonElement.title = tooltipTitle;

    const iconElement = document.createElement('i');
    iconElement.className = 'material-icons small';
    iconElement.textContent = iconName;

    buttonElement.appendChild(iconElement);
    return buttonElement;
  };

  function appendActionButtons(parentElement, options = {}, fileInputBar = null) {
    const actionItems = [
      { icon: 'thumb_up', title: 'Say Thanks', type: 'thank' },
      { icon: 'favorite', title: 'Add Reputation', type: 'rep' },
      { icon: 'monetization_on', title: 'Gift Seedbonus', type: 'seed' },
    ];

    actionItems.forEach((actionItem) => {
      const actionButton = createStyledButton(actionItem.icon, actionItem.title);

      if (options.disableButtons) {
        actionButton.classList.add('disabled');
        actionButton.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          highlightInputBar(fileInputBar);
        });
      } else {
        const performAction = () => {
          if (actionItem.type === 'seed') {
            showGiftModal(async (selectedAmount) => {
              if (options.torrentIDs) {
                await performActionsOnTorrentIDs(options.torrentIDs, [actionItem.type], selectedAmount);
              } else {
                await performActionOnVisibleTorrents(actionItem.type, selectedAmount);
              }
            });
          } else {
            if (options.torrentIDs) {
              performActionsOnTorrentIDs(options.torrentIDs, [actionItem.type]);
            } else {
              performActionOnVisibleTorrents(actionItem.type);
            }
          }
        };
        actionButton.addEventListener('click', performAction);
      }

      parentElement.appendChild(actionButton);
    });
  }

  const highlightInputBar = (inputBar) => {
    const fileText = inputBar?.querySelector('.file-text');
    fileText?.classList.add('highlight-text');
    const icon = inputBar?.querySelector('.material-icons');
    icon?.classList.add('highlight-icon');
  };

  const removeHighlightFromInputBar = (inputBar) => {
    const fileText = inputBar?.querySelector('.file-text');
    fileText?.classList.remove('highlight-text');
    const icon = inputBar?.querySelector('.material-icons');
    icon?.classList.remove('highlight-icon');
  };

  const addStyles = () => {
    const css = `
      .highlight-text {
        animation: highlight-animation 1s infinite;
      }
      @keyframes highlight-animation {
        0% { color: #4b8b61; }
        50% { color: red; }
        100% { color: #4b8b61; }
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
        0% { color: #4b8b61; }
        50% { color: red; }
        100% { color: #4b8b61; }
      }

      #sbgift-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 1002;
        display: none;
      }
      #sbgift-overlay.open { display: block; }

      #sbgift-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--main-bg, #fafafa);
        padding: 20px;
        border-radius: 8px;
        z-index: 1003;
        display: none;
        box-shadow: 0 16px 28px rgba(0,0,0,0.22), 0 25px 55px rgba(0,0,0,0.21);
        color: var(--body-color, #000);
      }
      #sbgift-modal.open { display: block; }

      #sbgift-modal .sbgift-button {
        margin: 5px;
        min-width: 60px;
        background-color: #4b8b61;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      #sbgift-modal .sbgift-button:hover {
        background-color: #3a6b4f;
      }

      #sbgift-modal h5 {
        margin-bottom: 15px;
        color: var(--link-color, #00695c);
        text-align: center;
      }

      body {
        font-family: 'IBM Plex Sans', Verdana, sans-serif;
        font-size: 14px;
        color: var(--body-color, rgba(184, 198, 204, 1));
        word-wrap: break-word;
      }
      body.dark-scheme {
        --body-bg: #212328;
        --body-color: rgba(184, 198, 204, 1);
        --main-bg: #2b2d33;
        --link-color: #4db6ac;
      }

      .custom-toast-notification {
        font-family: 'IBM Plex Sans', Verdana, sans-serif;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.95);
        background-color: rgba(50, 50, 50, 0.95);
        color: #fff;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 10000;
        font-size: 16px;
        max-width: 400px;
        width: 80%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .custom-toast-notification.visible {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      .custom-toast-notification .toast-message {
        margin-bottom: 10px;
        text-align: center;
      }
      .custom-toast-notification .toast-progress-bar {
        width: 100%;
        height: 8px;
        background-color: #555;
        border-radius: 4px;
        overflow: hidden;
      }
      .custom-toast-notification .toast-progress-inner {
        height: 100%;
        background-color: #4b8b61;
        width: 0%;
        transition: width 0.3s ease;
      }

      .toast-cancel-button {
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
      .toast-cancel-button:hover {
        color: #ff5252;
      }

      .joysender-button {
        margin: 4px 3px;
        vertical-align: middle;
        background-color: #4b8b61;
        box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12);
        border-radius: 50%;
        width: 37px;
        height: 37px;
        line-height: 37px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        flex-shrink: 0;
        transition: background-color 0.3s ease, opacity 0.3s ease, cursor 0.3s ease;
      }
      .joysender-button:hover {
        background-color: #367049;
      }
      .joysender-button .material-icons {
        color: white;
        transition: color 0.3s ease;
      }
      .joysender-button.disabled {
        background-color: grey;
        opacity: 0.6;
        cursor: not-allowed;
      }

      .file-input-bar {
        display: flex;
        align-items: center;
        padding: 5px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;
        justify-content: center;
        color: white;
        position: relative;
      }
      .file-input-bar:hover {
        background-color: #3a6b4f;
      }
      .file-input-bar .file-text {
        font-weight: bold;
        color: white;
        transition: color 0.3s ease;
      }

      .file-input-bar .material-icons {
        margin-right: 5px;
        transition: transform 0.3s ease, color 0.3s ease;
      }

      .shake {
        animation: shake 0.5s infinite;
      }
      @keyframes shake {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(5deg); }
        50% { transform: rotate(0deg); }
        75% { transform: rotate(-5deg); }
        100% { transform: rotate(0deg); }
      }

      @keyframes highlight-animation-icon {
        0% { color: #4b8b61; }
        50% { color: red; }
        100% { color: #4b8b61; }
      }

      .highlight-icon {
        animation: shake 0.5s infinite, highlight-animation-icon 1s infinite;
      }

      .joysender-button-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .joysender-buttons {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
      }

      .collapsible-header#joy-sender-section {
        padding: 2px 20px;
        cursor: pointer;
        margin-left: 25px;
        position: relative;
      }

      .file-input-bar .file-text,
      .file-input-bar .material-icons {
        transition: color 0.3s ease, transform 0.3s ease;
      }

      .file-input-bar.file-added {
        color: #4b8b61;
      }
      .file-input-bar.file-added .material-icons {
        color: #4b8b61;
      }

      .file-input-bar.animate .file-text,
      .file-input-bar.animate .material-icons {
      }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  };

  function showGiftModal(callback) {
    const rankSpan = document.querySelector('span[class^="tbdrank"]');
    const rankClass = rankSpan?.getAttribute('class') || '';
    const show5000Option = rankClass.includes('tbdrank wizard') || rankClass.includes('tbdrank star-uploader');

    let overlay = document.getElementById('sbgift-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'sbgift-overlay';
      document.body.appendChild(overlay);
    }

    let modal = document.getElementById('sbgift-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'sbgift-modal';
      document.body.appendChild(modal);
    }

    modal.innerHTML = '';

    const heading = document.createElement('h5');
    heading.textContent = 'Select Seedbonus Amount';
    modal.appendChild(heading);

    const container = document.createElement('div');
    container.className = 'sbgift-container';
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.justifyContent = 'center';

    const amounts = [50, 100, 200, 500, 1000];
    if (show5000Option) amounts.push(5000);

    amounts.forEach((amount) => {
      const button = document.createElement('button');
      button.className = 'sbgift-button';
      button.textContent = amount;
      button.setAttribute('data-amount', amount);
      container.appendChild(button);

      button.addEventListener('click', () => {
        const selectedAmount = button.getAttribute('data-amount');
        closeModal(modal, overlay);
        callback(selectedAmount);
      });
    });

    modal.appendChild(container);
    modal.classList.add('open');
    overlay.classList.add('open');

    const overlayClickHandler = () => {
      closeModal(modal, overlay);
      overlay.removeEventListener('click', overlayClickHandler);
    };
    overlay.addEventListener('click', overlayClickHandler);
  }

  const closeModal = (modal, overlay) => {
    modal.classList.remove('open');
    overlay.classList.remove('open');
  };

  const updateActionButtonsForFile = (buttonsDiv, torrentIDs) => {
    buttonsDiv.innerHTML = '';
    appendActionButtons(buttonsDiv, { torrentIDs });
  };

  async function performActionsOnTorrentIDs(torrentIDs, actions, giftAmount = null) {
    const actionSuccessCounts = {
      thank: 0,
      rep: 0,
      seed: 0,
    };

    const totalActions = torrentIDs.length * actions.length;
    let completedActions = 0;
    cancelProcessing = false;
    toggleButtonsState(true);

    const toast = showToast({
      message: 'Processing...',
      showProgress: true,
      totalSteps: totalActions,
      cancelable: true,
      onCancel: () => {
        cancelProcessing = true;
        toast.updateMessage('Cancelling...');
      },
    });

    for (let index = 0; index < torrentIDs.length; index++) {
      const torrentID = torrentIDs[index];
      for (let actionType of actions) {
        if (cancelProcessing) {
          toast.updateMessage('Processing Cancelled.');
          toast.close();
          toggleButtonsState(false);
          return;
        }

        const success = await executeAction(actionType, torrentID, giftAmount);
        if (success) {
          actionSuccessCounts[actionType]++;
        }
        completedActions++;
        const progressPercent = Math.round((completedActions / totalActions) * 100);
        toast.updateProgress(progressPercent);
        toast.updateMessage(`Processing... (${progressPercent}%)`);
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const toastMessages = [];

    if (actionSuccessCounts.thank > 0) {
      toastMessages.push(`Thanked ${actionSuccessCounts.thank} torrent(s)!`);
    }

    if (actionSuccessCounts.rep > 0) {
      toastMessages.push(`Reputated ${actionSuccessCounts.rep} torrent(s)!`);
    }

    if (actionSuccessCounts.seed > 0) {
      const totalSeed = actionSuccessCounts.seed * giftAmount;
      toastMessages.push(`Gifted ${totalSeed} SeedBonus over ${actionSuccessCounts.seed} torrent(s)!`);
    }

    if (toastMessages.length > 0) {
      toast.updateMessage(toastMessages.join(' '));
    } else {
      toast.updateMessage('No Actions Performed!');
    }

    setTimeout(() => {
      toast.close();
      toggleButtonsState(false);
    }, 3000);
  }

  const toggleButtonsState = (isProcessing) => {
    const buttons = document.querySelectorAll('.joysender-button');
    buttons.forEach((button) => {
      if (isProcessing) {
        button.classList.add('disabled');
        button.style.pointerEvents = 'none';
      } else {
        button.classList.remove('disabled');
        button.style.pointerEvents = 'auto';
      }
    });

    const fileInputBars = document.querySelectorAll('.file-input-bar');
    fileInputBars.forEach((bar) => {
      if (isProcessing) {
        bar.style.pointerEvents = 'none';
      } else {
        bar.style.pointerEvents = 'auto';
      }
    });
  };

  const enableActionButtons = (buttonsDiv) => {
    buttonsDiv.querySelectorAll('a.joysender-button').forEach((button) => {
      button.classList.remove('disabled');
    });
    isFileAttached = true;
  };

  function handleFileInput(event, buttonsDiv, fileInputBar) {
    const file = event.target.files[0];
    if (file) {
      const fileTextSpan = fileInputBar.querySelector('.file-text');
      const iconElement = fileInputBar.querySelector('.material-icons');
      if (fileTextSpan) {
        fileTextSpan.textContent = file.name;
        fileTextSpan.style.color = '#4b8b61';
      }
      if (iconElement) {
        iconElement.style.color = '#4b8b61';
      }

      fileInputBar.classList.add('file-added');
      enableActionButtons(buttonsDiv);
      removeHighlightFromInputBar(fileInputBar);

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const torrentIDs = content
          .split('\n')
          .map((link) => extractTorrentID(link.trim()))
          .filter((id) => id);

        if (torrentIDs.length > 0) {
          updateActionButtonsForFile(buttonsDiv, torrentIDs);
        } else {
          showToast({ message: 'File: No torrent(s) Found!' });
        }
      };
      reader.readAsText(file);

      setTimeout(() => {
        event.target.remove();
      }, 0);
    } else {
      fileInputBar.classList.add('animate');
      const iconElement = fileInputBar.querySelector('.material-icons');
      const fileTextSpan = fileInputBar.querySelector('.file-text');
      if (iconElement) iconElement.style.color = 'red';
      if (fileTextSpan) fileTextSpan.style.color = 'red';
    }
  }

  function initializeJoySender() {
    addStyles();

    let targetContainer;
    let useFileInput = false;

    if (window.location.pathname.includes('account-details.php')) {
      targetContainer = document.querySelector('.pr-action-container');
      if (!targetContainer) {
        targetContainer = document.querySelector('#left-block-container');
        useFileInput = true;
      } else {
        appendActionButtons(targetContainer);
      }
    } else {
      targetContainer = document.querySelector('#left-block-container');
    }

    if (targetContainer) {
      const collapsibleList = targetContainer.querySelector('ul.collapsible');
      if (collapsibleList) {
        let scriptsSection = collapsibleList.querySelector('li[data-section="scripts"]');
        if (!scriptsSection) {
          scriptsSection = createCollapsibleSection('Scripts', 'code', collapsibleList);
          const dropdownIcon = document.createElement('i');
          dropdownIcon.className = 'material-icons right';
          dropdownIcon.textContent = 'arrow_drop_down';
          scriptsSection.querySelector('.collapsible-header').appendChild(dropdownIcon);
        }

        const joySenderSection = scriptsSection.querySelector('#joy-sender-section');
        if (!joySenderSection) {
          createJoySenderSection(scriptsSection, useFileInput);
        }
      }
    }
  }

  const createCollapsibleSection = (title, iconName, container) => {
    const section = document.createElement('li');
    section.dataset.section = 'scripts';

    const header = createCollapsibleHeader(title, iconName);
    const body = document.createElement('div');
    body.className = 'collapsible-body';
    body.style.display = 'none';

    section.append(header, body);
    container.appendChild(section);

    return section;
  };

  const createCollapsibleHeader = (title, iconName) => {
    const header = document.createElement('div');
    header.className = 'collapsible-header';

    const iconElement = document.createElement('i');
    iconElement.className = `material-icons orange600`;
    iconElement.textContent = iconName;

    const titleText = document.createTextNode(` ${title}`);

    header.appendChild(iconElement);
    header.appendChild(titleText);
    return header;
  };

  function createJoySenderSection(parentSection, useFileInput) {
    const joySenderHeader = createCollapsibleHeader('JoySender', 'thumbs_up_down');
    joySenderHeader.id = 'joy-sender-section';

    const joySenderBody = document.createElement('div');
    joySenderBody.className = 'collapsible-body';

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'joysender-button-container';

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'joysender-buttons';

    let fileInputBar = null;

    if (useFileInput) {
      fileInputBar = createFileInputBar(buttonsDiv);
      buttonContainer.appendChild(fileInputBar);
      buttonContainer.appendChild(buttonsDiv);
      appendActionButtons(buttonsDiv, { disableButtons: true }, fileInputBar);
    } else {
      appendActionButtons(buttonsDiv);
      buttonContainer.appendChild(buttonsDiv);
    }

    joySenderBody.appendChild(buttonContainer);
    parentSection.querySelector('.collapsible-body').appendChild(joySenderHeader);
    parentSection.querySelector('.collapsible-body').appendChild(joySenderBody);

    joySenderHeader.addEventListener('click', (event) => {
      event.stopPropagation();
      if (joySenderBody.style.display === 'none' || joySenderBody.style.display === '') {
        joySenderBody.style.display = 'block';
      } else {
        joySenderBody.style.display = 'none';
      }
    });

    document.addEventListener('click', (event) => {
      if (fileInputBar && !fileInputBar.contains(event.target)) {
        removeHighlightFromInputBar(fileInputBar);
      }
    });
  }

  function createFileInputBar(buttonsDiv) {
    const fileInputBar = document.createElement('div');
    fileInputBar.className = 'file-input-bar';

    const iconElement = document.createElement('i');
    iconElement.className = 'material-icons';
    iconElement.textContent = 'attachment';

    const fileTextSpan = document.createElement('span');
    fileTextSpan.className = 'file-text';
    fileTextSpan.textContent = 'Links';

    fileInputBar.appendChild(iconElement);
    fileInputBar.appendChild(fileTextSpan);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt';
    fileInput.style.display = 'none';

    fileInputBar.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (event) => handleFileInput(event, buttonsDiv, fileInputBar));

    fileInputBar.appendChild(fileInput);

    return fileInputBar;
  }

  window.addEventListener('load', initializeJoySender);

  function createElement(tag, classNames = [], attributes = {}, innerText = '') {
    const element = document.createElement(tag);
    classNames.forEach((cls) => element.classList.add(cls));
    Object.entries(attributes).forEach(([attr, value]) => element.setAttribute(attr, value));
    element.textContent = innerText;
    return element;
  }
  
  
  
})();
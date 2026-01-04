// ==UserScript==
// @name          ThePosterDB - Easy Links
// @version       2.2.0
// @description   Makes it easier to copy data from ThePosterDB
// @author        Journey Over
// @license       MIT
// @match         *://theposterdb.com/*
// @require       https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @grant         GM_setClipboard
// @grant         GM_addStyle
// @icon          https://www.google.com/s2/favicons?sz=64&domain=theposterdb.com
// @homepageURL   https://github.com/StylusThemes/Userscripts
// @namespace https://greasyfork.org/users/32214
// @downloadURL https://update.greasyfork.org/scripts/547228/ThePosterDB%20-%20Easy%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/547228/ThePosterDB%20-%20Easy%20Links.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const CONFIG = {
    prefix: 'tpdb',
    selectors: {
      gridPosters: '.col-6 .hovereffect',
      copyLinkBtn: '.copy_poster_link',
      titleText: 'p.p-0.mb-1.text-break',
      overlay: 'div.overlay'
    },
    attributes: {
      posterId: 'data-poster-id',
      clipboardText: 'data-clipboard-text'
    },
    urls: {
      apiBase: 'https://theposterdb.com/api/assets'
    },
    notifications: {
      duration: 3000,
      messages: {
        link: 'Link copied to clipboard',
        id: 'ID copied to clipboard',
        metadata: 'Metadata copied to clipboard'
      }
    }
  };

  const STYLES = `.${CONFIG.prefix}-notification{position:fixed;top:10px;right:10px;padding:10px;background-color:#4caf50;color:white;z-index:10000;border-radius:5px;box-shadow:0 0 10px rgba(0,0,0,0.5);transition:opacity 0.3s ease-in-out;}.${CONFIG.prefix}-button-container{display:flex;justify-content:space-between;gap:5px;margin-top:5px;}.${CONFIG.prefix}-button{flex:1;text-align:center;cursor:pointer;padding:5px 10px;border-radius:5px;font-size:1rem;color:white;border:1px solid;transition:all 0.3s ease;}.${CONFIG.prefix}-button:hover{transform:scale(1.05);}.${CONFIG.prefix}-button-link{background-color:#28965a;border-color:#219150;}.${CONFIG.prefix}-button-link:hover{background-color:#1e7948;}.${CONFIG.prefix}-button-id{background-color:#007bff;border-color:#0056b3;}.${CONFIG.prefix}-button-id:hover{background-color:#0056b3;}.${CONFIG.prefix}-metadata-button{cursor:pointer !important;color:white;background:transparent;padding:3px 8px;border-radius:4px;font-size:0.9rem;text-decoration:none;display:inline-block;border:1px solid #5a6268;transition:all 0.3s ease;}.${CONFIG.prefix}-metadata-button:hover{background-color:#5a6268;transform:scale(1.05);}`;

  const Utilities = {
    async fadeOut(elementToFade, duration) {
      elementToFade.style.opacity = '0';
      await new Promise(resolve => setTimeout(resolve, duration));
      elementToFade.remove();
    },

    createUrl(posterId) {
      return `${CONFIG.urls.apiBase}/${posterId}`;
    },

    isValidPosterId(posterId) {
      return posterId && /^\d+$/.test(posterId);
    },
  };

  const NotificationManager = {
    show(message, duration = CONFIG.notifications.duration) {
      const notificationElement = document.createElement('div');
      notificationElement.className = 'tpdb-notification';
      notificationElement.textContent = message;
      document.body.appendChild(notificationElement);

      setTimeout(() => {
        Utilities.fadeOut(notificationElement, 300);
      }, duration);
    },
  };

  class PosterData {
    constructor(posterElement) {
      this.element = posterElement;
      this.posterId = this.extractPosterId();
      this.title = this.extractTitle();
      this.year = this.extractYear();
    }

    extractPosterId() {
      const overlayElement = this.element.querySelector(CONFIG.selectors.overlay);
      return overlayElement?.getAttribute(CONFIG.attributes.posterId);
    }

    // Extract title and remove year from parentheses for cleaner metadata
    extractTitle() {
      const titleElement = this.element.querySelector(CONFIG.selectors.titleText);
      return titleElement?.textContent.trim().replace(/\(\d{4}\)/, '').trim() || '';
    }

    extractYear() {
      const titleElement = this.element.querySelector(CONFIG.selectors.titleText);
      const yearMatch = titleElement?.textContent.match(/\((\d{4})\)/);
      return yearMatch ? parseInt(yearMatch[1], 10) : null;
    }

    get apiUrl() {
      return Utilities.createUrl(this.posterId);
    }

    // Format for YAML-style metadata compatible with media servers
    toMetadata() {
      return `  "${this.title}":\n    match:\n      year: ${this.year || 'Unknown'}\n    url_poster: "${this.apiUrl}"`;
    }
  }

  class UIManager {
    constructor() {
      this.setupStyles();
      this.initializeUI();
    }

    setupStyles() {
      GM_addStyle(STYLES);
    }

    createButton(text, className, clickHandler) {
      const buttonElement = document.createElement('button');
      buttonElement.className = `tpdb-button ${className}`;
      buttonElement.textContent = text;
      buttonElement.addEventListener('click', clickHandler);
      return buttonElement;
    }

    createButtonContainer(posterId) {
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'tpdb-button-container';

      const copyLinkButton = this.createButton('Copy Link', 'tpdb-button-link', () => {
        GM_setClipboard(Utilities.createUrl(posterId));
        NotificationManager.show(CONFIG.notifications.messages.link);
      });

      const copyIdButton = this.createButton('Copy ID', 'tpdb-button-id', () => {
        GM_setClipboard(posterId);
        NotificationManager.show(CONFIG.notifications.messages.id);
      });

      buttonContainer.append(copyLinkButton, copyIdButton);
      return buttonContainer;
    }

    // Enhance main poster page with additional copy buttons alongside existing ones
    setupMainPosterButtons() {
      const existingCopyLinkButton = document.querySelector(CONFIG.selectors.copyLinkBtn);
      if (!existingCopyLinkButton) return;

      const posterId = existingCopyLinkButton.getAttribute(CONFIG.attributes.posterId);
      if (!Utilities.isValidPosterId(posterId)) return;

      existingCopyLinkButton.setAttribute(CONFIG.attributes.clipboardText, Utilities.createUrl(posterId));
      existingCopyLinkButton.addEventListener('click', () => {
        NotificationManager.show(CONFIG.notifications.messages.link);
      });

      const copyIdButton = document.createElement('button');
      copyIdButton.className = 'btn btn-outline-warning clipboard';
      copyIdButton.setAttribute(CONFIG.attributes.clipboardText, posterId);
      copyIdButton.setAttribute('data-toggle', 'tooltip');
      copyIdButton.setAttribute('data-placement', 'top');
      copyIdButton.setAttribute('title', 'Copy Poster ID');
      copyIdButton.innerHTML = '<span class="d-none">Copy ID</span> <i class="fas fa-hashtag"></i>';

      copyIdButton.addEventListener('click', () => {
        NotificationManager.show(CONFIG.notifications.messages.id);
      });

      existingCopyLinkButton.parentNode.insertBefore(copyIdButton, existingCopyLinkButton.nextSibling);

      if (window.ClipboardJS) {
        new ClipboardJS(copyIdButton);
      }
    }

    setupGridPosters() {
      for (const posterElement of document.querySelectorAll(CONFIG.selectors.gridPosters)) {
        const posterData = new PosterData(posterElement);
        if (!Utilities.isValidPosterId(posterData.posterId)) continue;

        const buttonContainer = this.createButtonContainer(posterData.posterId);
        posterElement.parentElement.appendChild(buttonContainer);
      }
    }

    setupMetadataButton() {
      const posterDataList = [...document.querySelectorAll(CONFIG.selectors.gridPosters)]
        .map(posterElement => new PosterData(posterElement))
        .filter(poster => Utilities.isValidPosterId(poster.posterId));

      if (posterDataList.length === 0) return;

      const metadataButton = document.createElement('button');
      metadataButton.className = 'tpdb-metadata-button';
      metadataButton.textContent = 'Copy Metadata';
      metadataButton.addEventListener('click', () => {
        const metadataString = `metadata:\n\n${posterDataList.map(poster => poster.toMetadata()).join('\n\n')}`;
        GM_setClipboard(metadataString);
        NotificationManager.show(CONFIG.notifications.messages.metadata);
      });

      document.querySelector('div')?.appendChild(metadataButton);
    }

    initializeUI() {
      this.setupMainPosterButtons();
      this.setupGridPosters();
      this.setupMetadataButton();
    }
  }

  $(document).ready(() => {
    new UIManager();
  });
})();

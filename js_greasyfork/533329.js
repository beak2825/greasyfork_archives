// ==UserScript==
// @name         Enhanced 8chan UI
// @version      2.1.2
// @description  Creates a media gallery with blur toggle and live thread info (Posts, Users, Files) plus additional enhancements
// @match        https://8chan.moe/*
// @match        https://8chan.se/*
// @grant        GM_addStyle
// @grant        GM.addStyle
// @license MIT
// @namespace https://greasyfork.org/users/1459581
// @downloadURL https://update.greasyfork.org/scripts/533329/Enhanced%208chan%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/533329/Enhanced%208chan%20UI.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // CONFIG
  // ==============================
  const CONFIG = {
    customBoards: ['pol', 'a', 'v', 'co'], // You can set them from dashboard
    keybinds: {
      toggleReply: "Alt+Z",          // Open reply window
      closeModals: "Escape",         // Close all modals/panels
      galleryPrev: "ArrowLeft",      // Previous media in lightbox
      galleryNext: "ArrowRight",     // Next media in lightbox
      quickReplyFocus: "Tab",        // Focus quick-reply fields cycle
      // Text formatting keybinds
      formatSpoiler: "Ctrl+S",       // Format text as spoiler
      formatBold: "Ctrl+B",          // Format text as bold
      formatItalic: "Ctrl+I",        // Format text as italic
      formatUnderline: "Ctrl+U",     // Format text as underlined
      formatDoom: "Ctrl+D",          // Format text as doom
      formatMoe: "Ctrl+M",           // Format text as moe
      formatDice: "Ctrl+G",          // Dice
      formatCode: "Ctrl+Q",          // Code
      formatLatex: "Ctrl+L",         // Format inLine Latex
      formatSrzBizniz: "Shift+Z",    // == ==
      formatEchoes: "Ctrl+(",        // ((( )))
      formatStrikethrough: "Ctrl+~", // ~~ ~~
      formatSlanted: "Ctrl+/"        // /// \\\
    },
    scrollMemory: {
      maxPages: 50
    },
    dashboard: {
      saveHotkey: "Ctrl+Shift+C", // Hotkey to open dashboard
      theme: "Tomorrow"           // Only Visual still not working
    }
  };

  // STYLES
  // ==============================
  const STYLES = `
    /* Dashboard Styles */
.dashboard-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: oklch(21% 0.006 285.885);
    padding: 20px;
    border-radius: 10px;
    z-index: 10001;
    width: 80%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
    display: none;
}

.dashboard-section {
    scroll-margin-top: 20px;
}

.dashboard-modal::-webkit-scrollbar {
    width: 8px;
}

.dashboard-modal::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.1);
}

.dashboard-modal::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 4px;
}

.dashboard-modal::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.3);
}

  .dashboard-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    z-index: 10000;
    display: none;
  }

  .dashboard-section {
    margin-bottom: 20px;
    padding: 15px;
    background: rgba(255,255,255,0.05);
    border-radius: 8px;
  }

  .config-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
  }

  .config-label {
    flex: 1;
    margin-right: 15px;
    font-weight: bold;
  }

  .config-input {
    flex: 2;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    padding: 8px;
    border-radius: 4px;
  }

  .config-separator {
    margin: 20px 0;
    border: 0;
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  .formatting-heading {
    margin: 15px 0 10px;
    color: #fff;
    font-size: 1.1em;
    padding-bottom: 5px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .dashboard-buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }

  .dashboard-btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background: #444;
    color: white;
    transition: background 0.3s ease;
  }

  .dashboard-btn:hover {
    background: #555;
  }

  .keybind-input {
    width: 200px;
    text-align: center;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .keybind-input:focus {
    background: rgba(255,255,255,0.2);
    outline: none;
  }
    /* Post styling */
    .postCell {
      margin: 0 !important;
    }

    /* Navigation and Header */
    #navBoardsSpan {
      font-size: large;
    }
    #dynamicHeaderThread,
    .navHeader {
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    }

    /* Gallery and control buttons */
    .gallery-button {
      position: fixed;
      right: 20px;
      z-index: 9999;
      background: #333;
      color: white;
      padding: 15px;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      text-align: center;
      line-height: 1;
      font-size: 20px;
    }
    .gallery-button.blur-toggle {
      bottom: 80px;
    }
    .gallery-button.gallery-open {
      bottom: 140px;
    }
    #media-count-display {
      position: fixed;
      bottom: 260px;
      right: 20px;
      background: #444;
      color: white;
      padding: 8px 12px;
      border-radius: 10px;
      font-size: 14px;
      z-index: 9999;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      white-space: nowrap;
    }

    /* Gallery modal */
    .gallery-modal {
      display: none;
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 80%;
      max-width: 600px;
      max-height: 80vh;
      background: oklch(21% 0.006 285.885);
      border-radius: 10px;
      padding: 20px;
      overflow-y: auto;
      z-index: 9998;
    }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;
    }
    .media-item {
      position: relative;
      cursor: pointer;
      aspect-ratio: 1;
      overflow: hidden;
      border-radius: 5px;
    }
    .media-thumbnail {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .media-type-icon {
      position: absolute;
      bottom: 5px;
      right: 5px;
      color: white;
      background: rgba(0,0,0,0.5);
      padding: 2px 5px;
      border-radius: 3px;
      font-size: 0.8em;
    }

    /* Lightbox */
    .lightbox {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.9);
      z-index: 10000;
    }
    .lightbox-content {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 90%;
      max-height: 90%;
    }
    .lightbox-video {
      max-width: 90vw;
      max-height: 90vh;
    }
    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      cursor: pointer;
      font-size: 24px;
      line-height: 50px;
      text-align: center;
      color: white;
    }
    .lightbox-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255,255,255,0.2);
      color: white;
      border: none;
      padding: 15px;
      cursor: pointer;
      font-size: 24px;
      border-radius: 50%;
    }
    .lightbox-prev {
      left: 20px;
    }
    .lightbox-next {
      right: 20px;
    }
    .go-to-post-btn {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255,255,255,0.1);
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
    }

    /* Blur effect */
    .blurred-media img,
    .blurred-media video,
    .blurred-media audio {
      filter: blur(10px) brightness(0.8);
      transition: filter 0.3s ease;
    }

    /* Quick reply styling */
    #quick-reply.centered {
      position: fixed;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%);
      width: 80%;
      max-width: 800px;
      min-height: 550px;
      background: oklch(21% 0.006 285.885);
      padding: 10px !important;
      border-radius: 10px;
      z-index: 9999;
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
    }
    #quick-reply.centered table,
    #quick-reply.centered #qrname,
    #quick-reply.centered #qrsubject,
    #quick-reply.centered #qrbody {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box;
    }
    #quick-reply.centered #qrbody {
      min-height: 200px;
    }
    #quick-reply-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      z-index: 99;
      display: none;
    }

    /* Thread watcher */
    #watchedMenu .floatingContainer {
      min-width: 330px;
    }
    #watchedMenu .watchedCellLabel > a:after {
      content: " - "attr(href);
      filter: saturate(50%);
      font-style: italic;
      font-weight: bold;
    }
    #watchedMenu {
      box-shadow: -3px 3px 2px 0px rgba(0,0,0,0.19);
    }

    /* Quote tooltips */
    .quoteTooltip .innerPost {
      overflow: hidden;
      box-shadow: -3px 3px 2px 0px rgba(0,0,0,0.19);
    }

    /* Hidden elements */
    #footer,
    #actionsForm,
    #navTopBoardsSpan,
    .coloredIcon.linkOverboard,
    .coloredIcon.linkSfwOver,
    .coloredIcon.multiboardButton,
    #navLinkSpan>span:nth-child(9),
    #navLinkSpan>span:nth-child(11),
    #navLinkSpan>span:nth-child(13),
    #dynamicAnnouncement {
      display: none;
    }
  `;

  // UTILITY FUNCTIONS
  // ==============================
  const util = {
    getBaseURL() {
      const hostname = location.hostname;
      if (hostname.includes('8chan.moe')) return 'https://8chan.moe';
      if (hostname.includes('8chan.se')) return 'https://8chan.se';
      return location.origin;
    },

    boardLink(board, baseUrl) {
      return `<a href="${baseUrl}/${board}/catalog.html">${board}</a>`;
    },

    isThreadPage() {
      return window.location.href.match(/https:\/\/8chan\.(moe|se)\/.*\/res\/.*/);
    },

    createElement(tag, options = {}) {
      const element = document.createElement(tag);

      if (options.id) element.id = options.id;
      if (options.className) element.className = options.className;
      if (options.text) element.textContent = options.text;
      if (options.html) element.innerHTML = options.html;
      if (options.attributes) {
        Object.entries(options.attributes).forEach(([attr, value]) => {
          element.setAttribute(attr, value);
        });
      }
      if (options.styles) {
        Object.entries(options.styles).forEach(([prop, value]) => {
          element.style[prop] = value;
        });
      }
      if (options.events) {
        Object.entries(options.events).forEach(([event, handler]) => {
          element.addEventListener(event, handler);
        });
      }
      if (options.parent) options.parent.appendChild(element);

      return element;
    },

    saveConfigToStorage(config) {
      localStorage.setItem('enhanced8chan-config', JSON.stringify(config));
    },

    loadConfigFromStorage() {
      const saved = localStorage.getItem('enhanced8chan-config');
      return saved ? JSON.parse(saved) : null;
    }
  };

  // CUSTOM BOARD NAVIGATION MODULE
  const customBoardLinks = {
    initialize() {
      this.updateNavBoardsSpan();
      window.addEventListener('DOMContentLoaded', () => this.updateNavBoardsSpan());
      setTimeout(() => this.updateNavBoardsSpan(), 1000);
    },

    updateNavBoardsSpan() {
      const span = document.querySelector('#navBoardsSpan');
      if (!span) return;

      const baseUrl = util.getBaseURL();
      const links = CONFIG.customBoards.map(board =>
        util.boardLink(board, baseUrl)
      ).join(' <span>/</span> ');

      span.innerHTML = `<span>[</span> ${links} <span>]</span>`;
    }
  };

// Add new DASHBOARD SYSTEM section
const dashboard = {

      createBoardSettingsSection() {
      const section = util.createElement('div', { className: 'dashboard-section' });
      util.createElement('h3', { text: 'Board Settings', parent: section });

      const row = util.createElement('div', { className: 'config-row', parent: section });
      util.createElement('span', {
        className: 'config-label',
        text: 'Custom Boards (comma separated)',
        parent: row
      });

      const input = util.createElement('input', {
        className: 'config-input',
        attributes: {
          type: 'text',
          value: CONFIG.customBoards.join(', '),
          'data-setting': 'customBoards'
        },
        parent: row,
        events: {
          input: (e) => this.handleBoardInput(e.target)
        }
      });

      return section;
    },

    handleBoardInput(input) {
      const boards = input.value.split(',')
        .map(b => b.trim().replace(/\/.*$/g, '')) // Remove paths
        .filter(b => b.length > 0);

      CONFIG.customBoards = boards;
      customBoardLinks.updateNavBoardsSpan();
    },


  isOpen: false,
  currentEditInput: null,

  initialize() {
    this.createUI();
    this.setupEventListeners();
    this.addDashboardButton();
  },

    createUI() {
      this.overlay = util.createElement('div', { className: 'dashboard-overlay', parent: document.body });
      this.modal = util.createElement('div', { className: 'dashboard-modal', parent: document.body });

      const sections = [
        this.createBoardSettingsSection(), // Added board settings
        this.createKeybindsSection(),
        this.createScrollMemorySection(),
        this.createAppearanceSection(),
        this.createButtonsSection()
      ];

      sections.forEach(section => this.modal.appendChild(section));
    },

createKeybindsSection() {
  const section = util.createElement('div', { className: 'dashboard-section' });
  util.createElement('h3', { text: 'Keyboard Shortcuts', parent: section });

  // Separate formatting and other keybinds
  const formattingKeys = [];
  const otherKeys = [];

  Object.entries(CONFIG.keybinds).forEach(([action, combo]) => {
    if (action.startsWith('format')) {
      formattingKeys.push({ action, combo });
    } else {
      otherKeys.push({ action, combo });
    }
  });

  // Add non-formatting keybinds first
  otherKeys.forEach(({ action, combo }) => {
    const row = util.createElement('div', { className: 'config-row', parent: section });
    util.createElement('span', {
      className: 'config-label',
      text: action.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
      parent: row
    });

    const input = util.createElement('input', {
      className: 'config-input keybind-input',
      attributes: {
        type: 'text',
        value: combo,
        'data-action': action
      },
      parent: row
    });
  });

  // Add separator and formatting header
  util.createElement('hr', {
    className: 'config-separator',
    parent: section
  });
  util.createElement('h4', {
    className: 'formatting-heading',
    text: 'Text Formatting Shortcuts',
    parent: section
  });

  // Add formatting keybinds
  formattingKeys.forEach(({ action, combo }) => {
    const row = util.createElement('div', { className: 'config-row', parent: section });
    util.createElement('span', {
      className: 'config-label',
      text: action.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
      parent: row
    });

    const input = util.createElement('input', {
      className: 'config-input keybind-input',
      attributes: {
        type: 'text',
        value: combo,
        'data-action': action
      },
      parent: row
    });
  });

  return section;
},

  createScrollMemorySection() {
    const section = util.createElement('div', { className: 'dashboard-section' });
    util.createElement('h3', { text: 'Scroll Memory Settings', parent: section });

    // Max Pages
    const maxPagesRow = util.createElement('div', { className: 'config-row', parent: section });
    util.createElement('span', {
      className: 'config-label',
      text: 'Max Remembered Pages',
      parent: maxPagesRow
    });
    util.createElement('input', {
      className: 'config-input',
      attributes: {
        type: 'number',
        value: CONFIG.scrollMemory.maxPages,
        min: 1,
        max: 100,
        'data-setting': 'maxPages'
      },
      parent: maxPagesRow
    });

    return section;
  },

  // Modified createAppearanceSection function
  createAppearanceSection() {
    const section = util.createElement('div', { className: 'dashboard-section' });
    util.createElement('h3', { text: 'Appearance', parent: section });

    // Theme Selector
    const themeRow = util.createElement('div', { className: 'config-row', parent: section });
    util.createElement('span', { className: 'config-label', text: 'Theme', parent: themeRow });
    const themeSelect = util.createElement('select', {
      id: 'themeSelector',
      className: 'config-input',
      parent: themeRow
    });

    const themes = [
      'Default CSS', 'Board CSS', 'Yotsuba B', 'Yotsuba P', 'Yotsuba', 'Miku',
      'Yukkuri', 'Hispita', 'Warosu', 'Vivian', 'Tomorrow', 'Lain', 'Royal',
      'Hispaperro', 'HispaSexy', 'Avellana', 'Evita', 'Redchanit', 'MoeOS8',
      'Windows 95', 'Penumbra', 'Penumbra (Clear)'
    ];

    themes.forEach(theme => {
      util.createElement('option', {
        text: theme,
        value: theme.toLowerCase().replace(/\s+/g, '-'),
        parent: themeSelect
      });
    });

    return section;

  },

  createButtonsSection() {
    const section = util.createElement('div', { className: 'dashboard-buttons' });
    util.createElement('button', {
      className: 'dashboard-btn',
      text: 'Save',
      events: { click: () => this.saveConfig() },
      parent: section
    });
    util.createElement('button', {
      className: 'dashboard-btn',
      text: 'Reset Defaults',
      events: { click: () => this.resetDefaults() },
      parent: section
    });
    util.createElement('button', {
      className: 'dashboard-btn',
      text: 'Close',
      events: { click: () => this.close() },
      parent: section
    });
    return section;
  },

  addDashboardButton() {
    this.btn = util.createElement('div', {
      className: 'gallery-button',
      text: '⚙️',
      styles: { bottom: '200px' },
      attributes: { title: 'Settings Dashboard' },
      events: { click: () => this.open() },
      parent: document.body
    });
  },

  setupEventListeners() {
    document.addEventListener('keydown', e => {
      const combo = `${e.ctrlKey ? 'Ctrl+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key}`;
      if (combo.replace(/\+$/, '') === CONFIG.dashboard.saveHotkey) {
        this.open();
      }
    });

    this.modal.querySelectorAll('.keybind-input').forEach(input => {
      input.addEventListener('click', () => this.startRecordingKeybind(input));
      input.addEventListener('keydown', e => this.recordKeybind(e));
    });
  },

  startRecordingKeybind(input) {
    this.currentEditInput = input;
    input.value = 'Press key combination...';
    input.classList.add('recording');
  },

  recordKeybind(e) {
    if (!this.currentEditInput) return;
    e.preventDefault();

    const keys = [];
    if (e.ctrlKey) keys.push('Ctrl');
    if (e.altKey) keys.push('Alt');
    if (e.shiftKey) keys.push('Shift');
    if (!['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) keys.push(e.key);

    const combo = keys.join('+');
    this.currentEditInput.value = combo;
    this.currentEditInput.classList.remove('recording');
    this.currentEditInput = null;
  },

  open() {
    this.overlay.style.display = 'block';
    this.modal.style.display = 'block';
    this.isOpen = true;
  },

  close() {
    this.overlay.style.display = 'none';
    this.modal.style.display = 'none';
    this.isOpen = false;
  },

    saveConfig() {
      const newConfig = {
        customBoards: CONFIG.customBoards,
        keybinds: {},
        scrollMemory: {
          maxPages: parseInt(document.querySelector('[data-setting="maxPages"]').value)
        },
        dashboard: {
          theme: document.querySelector('#themeSelector').value
        }
      };

      document.querySelectorAll('.keybind-input').forEach(input => {
        newConfig.keybinds[input.dataset.action] = input.value;
      });

      util.saveConfigToStorage(newConfig);
      this.applyConfig(newConfig);
      this.close();
    },

    applyConfig(newConfig) {
      CONFIG.customBoards = newConfig.customBoards || [];
      Object.assign(CONFIG.keybinds, newConfig.keybinds);
      Object.assign(CONFIG.scrollMemory, newConfig.scrollMemory);
      Object.assign(CONFIG.dashboard, newConfig.dashboard);

      customBoardLinks.updateNavBoardsSpan();
      document.documentElement.setAttribute('data-theme', newConfig.dashboard.theme);
  },

  resetDefaults() {
    localStorage.removeItem('enhanced8chan-config');
    window.location.reload();
  }
};

  // GALLERY SYSTEM
  // ==============================
  const gallery = {
    mediaElements: [],
    currentIndex: 0,
    isBlurred: false,

    initialize() {
      this.createUIElements();
      this.setupEventListeners();
      this.collectMedia();
      this.createGalleryItems();
      this.updateThreadInfoDisplay();

      setInterval(() => this.updateThreadInfoDisplay(), 5000);
    },

    createUIElements() {
      // Gallery button
      this.galleryButton = util.createElement('div', {
        className: 'gallery-button gallery-open',
        text: '🎴',
        attributes: { title: 'Gallery' },
        parent: document.body
      });

      // Blur toggle
      this.blurToggle = util.createElement('div', {
        className: 'gallery-button blur-toggle',
        text: '💼',
        attributes: { title: 'Goon Mode' },
        parent: document.body
      });

      // Reply button
      this.replyButton = util.createElement('div', {
        id: 'replyButton',
        className: 'gallery-button',
        text: '✏️',
        attributes: { title: 'Reply' },
        styles: { bottom: '20px' },
        parent: document.body
      });

      // Media info display
      this.mediaInfoDisplay = util.createElement('div', {
        id: 'media-count-display',
        parent: document.body
      });

      // Quick reply overlay
      this.overlay = util.createElement('div', {
        id: 'quick-reply-overlay',
        parent: document.body
      });

      // Gallery modal
      this.galleryModal = util.createElement('div', {
        className: 'gallery-modal',
        parent: document.body
      });

      this.galleryGrid = util.createElement('div', {
        className: 'gallery-grid',
        parent: this.galleryModal
      });

      // Lightbox
      this.lightbox = util.createElement('div', {
        className: 'lightbox',
        html: `
          <div class="close-btn">×</div>
          <button class="lightbox-nav lightbox-prev">←</button>
          <button class="lightbox-nav lightbox-next">→</button>
        `,
        parent: document.body
      });
    },

    setupEventListeners() {
      // Blur toggle
      this.blurToggle.addEventListener('click', () => {
        this.isBlurred = !this.isBlurred;
        this.blurToggle.textContent = this.isBlurred ? '🍆' : '💼';
        this.blurToggle.title = this.isBlurred ? 'Safe Mode' : 'Goon Mode';
        document.querySelectorAll('div.innerPost').forEach(post => {
          post.classList.toggle('blurred-media', this.isBlurred);
        });
      });

      // Reply button
      this.replyButton.addEventListener('click', () => {
        const nativeReplyBtn = document.querySelector('a#replyButton[href="#postingForm"]');
        if (nativeReplyBtn) {
          nativeReplyBtn.click();
        } else {
          location.hash = '#postingForm';
        }

        // Clear form fields and setup centered quick-reply
        setTimeout(() => {
          document.querySelectorAll('#qrname, #qrsubject, #qrbody').forEach(field => {
            field.value = '';
          });
          this.setupQuickReply();
        }, 100);
      });

      // Gallery button
      this.galleryButton.addEventListener('click', () => {
        this.collectMedia();
        this.createGalleryItems();
        this.galleryModal.style.display = this.galleryModal.style.display === 'block' ? 'none' : 'block';
      });

      // Lightbox navigation
      this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.navigate(-1));
      this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.navigate(1));
      this.lightbox.querySelector('.close-btn').addEventListener('click', () => {
        this.lightbox.style.display = 'none';
      });

      // Close modals when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.galleryModal.contains(e.target) && !this.galleryButton.contains(e.target)) {
          this.galleryModal.style.display = 'none';
        }
      });

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    },

    handleKeyboardShortcuts(e) {
      const { keybinds } = CONFIG;

      // Close modals/panels
      if (e.key === keybinds.closeModals) {
        if (this.lightbox.style.display === 'block') {
          this.lightbox.style.display = 'none';
        }
        this.galleryModal.style.display = 'none';

        const qrCloseBtn = document.querySelector('.quick-reply .close-btn, th .close-btn');
        if (qrCloseBtn && typeof qrCloseBtn.click === 'function') {
          qrCloseBtn.click();
        }

        document.getElementById('quick-reply-overlay').style.display = 'none';
        document.getElementById('quick-reply')?.classList.remove('centered');
      }

      // Navigation in lightbox
      if (this.lightbox.style.display === 'block') {
        if (e.key === keybinds.galleryPrev) this.navigate(-1);
        if (e.key === keybinds.galleryNext) this.navigate(1);
      }

      // Toggle reply window
      const [mod, key] = keybinds.toggleReply.split('+');
      if (e[`${mod.toLowerCase()}Key`] && e.key.toLowerCase() === key.toLowerCase()) {
        this.replyButton.click();
      }

      // Quick-reply field cycling
      if (e.key === keybinds.quickReplyFocus) {
        const fields = ['#qrname', '#qrsubject', '#qrbody'];
        const active = document.activeElement;
        const currentIndex = fields.findIndex(sel => active.matches(sel));

        if (currentIndex > -1) {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % fields.length;
          document.querySelector(fields[nextIndex])?.focus();
        }
      }

      // Text formatting shortcuts
      if (e.target.matches('#qrbody')) {
        const formattingMap = {
          [keybinds.formatSpoiler]: ['[spoiler]', '[/spoiler]'],
          [keybinds.formatBold]: ["'''", "'''"],
          [keybinds.formatItalic]: ["''", "''"],
          [keybinds.formatUnderline]: ['__', '__'],
          [keybinds.formatDoom]: ['[doom]', '[/doom]'],
          [keybinds.formatMoe]: ['[moe]', '[/moe]'],
          [keybinds.formatCode]: ['[code]', '[/code]'],
          [keybinds.formatLatex]: ['$$\\', '$$'],
          [keybinds.formatDice]: ['/roll{', '}'],
          [keybinds.formatSrzBizniz]: ['==', '=='],
          [keybinds.formatEchoes]: ['(((', ')))'],
          [keybinds.formatStrikethrough]: ['~~', '~~'],
          [keybinds.formatSlanted]: ['///', '\\\\\\']
        };

        for (const [combo, [openTag, closeTag]] of Object.entries(formattingMap)) {
          const [modifier, keyChar] = combo.split('+');
          if (e[`${modifier.toLowerCase()}Key`] && e.key.toLowerCase() === keyChar.toLowerCase()) {
            e.preventDefault();
            this.wrapText(e.target, openTag, closeTag);
            break;
          }
        }
      }
    },

    // Text wrapping function for formatting
    wrapText(textarea, openTag, closeTag) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selected = text.substring(start, end);

      let newText, newPos;
      if (start === end) {
        newText = text.slice(0, start) + openTag + closeTag + text.slice(end);
        newPos = start + openTag.length;
      } else {
        newText = text.slice(0, start) + openTag + selected + closeTag + text.slice(end);
        newPos = end + openTag.length + closeTag.length;
      }

      textarea.value = newText;
      textarea.selectionStart = textarea.selectionEnd = newPos;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    },

    setupQuickReply() {
      const quickReply = document.getElementById('quick-reply');
      if (!quickReply) return;

      // Create close button if it doesn't exist
      if (!quickReply.querySelector('.qr-close-btn')) {
        util.createElement('div', {
          className: 'close-btn qr-close-btn',
          text: '×',
          styles: {
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer'
          },
          events: {
            click: () => {
              quickReply.classList.remove('centered');
              this.overlay.style.display = 'none';
            }
          },
          parent: quickReply
        });
      }

      quickReply.classList.add('centered');
      this.overlay.style.display = 'block';

      // Focus on reply body
      setTimeout(() => {
        document.querySelector('#qrbody')?.focus();
      }, 100);
    },

    collectMedia() {
      this.mediaElements = [];
      const seenUrls = new Set();

      document.querySelectorAll('div.innerPost').forEach(post => {
        // Get images
        post.querySelectorAll('img[loading="lazy"]').forEach(img => {
          const src = img.src;
          if (!src || seenUrls.has(src)) return;

          const parentLink = img.closest('a');
          const href = parentLink?.href;

          if (href && !seenUrls.has(href)) {
            seenUrls.add(href);
            this.mediaElements.push({
              element: parentLink,
              thumbnail: img,
              url: href,
              type: this.getMediaType(href),
              postElement: post
            });
          } else {
            seenUrls.add(src);
            this.mediaElements.push({
              element: img,
              thumbnail: img,
              url: src,
              type: 'IMAGE',
              postElement: post
            });
          }
        });

        // Get media links without images
        post.querySelectorAll('a[href*=".media"]:not(:has(img)), a.imgLink:not(:has(img))').forEach(link => {
          const href = link.href;
          if (!href || seenUrls.has(href)) return;

          if (this.isMediaFile(href)) {
            seenUrls.add(href);
            this.mediaElements.push({
              element: link,
              thumbnail: null,
              url: href,
              type: this.getMediaType(href),
              postElement: post
            });
          }
        });
      });
    },

    getMediaType(url) {
      if (/\.(mp4|webm|mov)$/i.test(url)) return 'VIDEO';
      if (/\.(mp3|wav|ogg)$/i.test(url)) return 'AUDIO';
      return 'IMAGE';
    },

    isMediaFile(url) {
      return /\.(jpg|jpeg|png|gif|webp|mp4|webm|mov|mp3|wav|ogg)$/i.test(url);
    },

    createGalleryItems() {
      this.galleryGrid.innerHTML = '';
      this.mediaElements.forEach((media, index) => {
        const item = util.createElement('div', {
          className: 'media-item',
          parent: this.galleryGrid
        });

        const thumbnailSrc = media.thumbnail?.src ||
          (media.type === 'VIDEO' ? 'https://via.placeholder.com/100/333/fff?text=VID' :
          media.type === 'AUDIO' ? 'https://via.placeholder.com/100/333/fff?text=AUD' :
          media.url);

        const thumbnail = util.createElement('img', {
          className: 'media-thumbnail',
          attributes: {
            loading: 'lazy',
            src: thumbnailSrc
          },
          parent: item
        });

        const typeIcon = util.createElement('div', {
          className: 'media-type-icon',
          text: media.type === 'VIDEO' ? 'VID' : media.type === 'AUDIO' ? 'AUD' : 'IMG',
          parent: item
        });

        item.addEventListener('click', () => this.showLightbox(media, index));
      });
    },

    showLightbox(media, index) {
      this.currentIndex = typeof index === 'number' ? index : this.mediaElements.indexOf(media);
      this.updateLightboxContent();
      this.lightbox.style.display = 'block';
    },

    updateLightboxContent() {
      const media = this.mediaElements[this.currentIndex];
      let content;

      // Create appropriate element based on media type
      if (media.type === 'AUDIO') {
        content = util.createElement('audio', {
          className: 'lightbox-content',
          attributes: {
            controls: true,
            src: media.url
          }
        });
      } else if (media.type === 'VIDEO') {
        content = util.createElement('video', {
          className: 'lightbox-content lightbox-video',
          attributes: {
            controls: true,
            src: media.url,
            autoplay: true,
            loop: true
          }
        });
      } else {
        content = util.createElement('img', {
          className: 'lightbox-content',
          attributes: {
            src: media.url,
            loading: 'eager'
          }
        });
      }

      // Remove existing content
      this.lightbox.querySelector('.lightbox-content')?.remove();
      this.lightbox.querySelector('.go-to-post-btn')?.remove();

      // Add "Go to post" button
      const goToPostBtn = util.createElement('button', {
        className: 'go-to-post-btn',
        text: 'Go to post',
        events: {
          click: () => {
            this.lightbox.style.display = 'none';
            media.postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            media.postElement.style.transition = 'box-shadow 0.5s ease';
            media.postElement.style.boxShadow = '0 0 0 3px rgba(255, 255, 0, 0.5)';
            setTimeout(() => {
              media.postElement.style.boxShadow = 'none';
            }, 2000);
          }
        }
      });

      this.lightbox.appendChild(content);
      this.lightbox.appendChild(goToPostBtn);
    },

    navigate(direction) {
      this.currentIndex = (this.currentIndex + direction + this.mediaElements.length) % this.mediaElements.length;
      this.updateLightboxContent();
    },

    updateThreadInfoDisplay() {
      const postCount = document.getElementById('postCount')?.textContent || '0';
      const userCount = document.getElementById('userCountLabel')?.textContent || '0';
      const fileCount = document.getElementById('fileCount')?.textContent || '0';
      this.mediaInfoDisplay.textContent = `Posts: ${postCount} | Users: ${userCount} | Files: ${fileCount}`;
    }
  };

  // SCROLL POSITION MEMORY
  // ==============================
  const scrollMemory = {
    currentPage: window.location.href,

    initialize() {
      window.addEventListener('beforeunload', () => this.saveScrollPosition());
      window.addEventListener('load', () => this.restoreScrollPosition());
    },

    isExcludedPage(url) {
      return false; // Removed exclusion pattern check
    },

    saveScrollPosition() {
      if (this.isExcludedPage(this.currentPage)) return;

      const scrollPosition = window.scrollY;
      localStorage.setItem(`scrollPosition_${this.currentPage}`, scrollPosition);
      this.manageScrollStorage();
    },

    restoreScrollPosition() {
      const savedPosition = localStorage.getItem(`scrollPosition_${this.currentPage}`);
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }
    },

    manageScrollStorage() {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('scrollPosition_'));

      if (keys.length > CONFIG.scrollMemory.maxPages) {
        keys.sort((a, b) => localStorage.getItem(a) - localStorage.getItem(b));

        while (keys.length > CONFIG.scrollMemory.maxPages) {
          localStorage.removeItem(keys.shift());
        }
      }
    }
  };

  // BOARD NAVIGATION ENHANCER (FIXED)
  // ==============================
  const boardNavigation = {
    initialize() {
      this.appendCatalogToLinks();
      this.setupMutationObserver();
    },

    setupMutationObserver() {
      const observer = new MutationObserver(() => this.appendCatalogToLinks());
      const config = { childList: true, subtree: true };

      const navboardsSpan = document.getElementById('navBoardsSpan');
      if (navboardsSpan) {
        observer.observe(navboardsSpan, config);
      }
    },

    appendCatalogToLinks() {
      document.querySelectorAll('#navBoardsSpan a').forEach(link => {
        try {
          const url = new URL(link.href);
          // Only modify board links, not thread links
          if (url.pathname.split('/').filter(Boolean).length === 1) {
            if (!url.pathname.endsWith('/catalog.html')) {
              url.pathname = url.pathname.replace(/\/?$/, '/catalog.html');
              link.href = url.href;
            }
          }
        } catch (e) {
          console.error('Error processing URL:', e);
        }
      });
    }
  };

  // IMAGE HOVER FIX
  // ==============================
  const imageHoverFix = {
    initialize() {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.matches('img[style*="position: fixed"]')) {
              document.addEventListener('mousemove', this.handleMouseMove);
            }
          });

          mutation.removedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.matches('img[style*="position: fixed"]')) {
              document.removeEventListener('mousemove', this.handleMouseMove);
            }
          });
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    },

    handleMouseMove(event) {
      const img = document.querySelector('img[style*="position: fixed"]');
      if (!img) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newX = event.clientX + 10;
      let newY = event.clientY + 10;

      if (newX + img.width > viewportWidth) {
        newX = viewportWidth - img.width - 10;
      }

      if (newY + img.height > viewportHeight) {
        newY = viewportHeight - img.height - 10;
      }

      img.style.left = `${newX}px`;
      img.style.top = `${newY}px`;
    }
  };

  // INITIALIZATION
  function init() {
    // Apply styles
    if (typeof GM_addStyle === 'function') GM_addStyle(STYLES);
    else if (typeof GM?.addStyle === 'function') GM.addStyle(STYLES);
    else document.head.appendChild(Object.assign(
      document.createElement('style'), { textContent: STYLES }
    ));

    // Initialize all modules
    customBoardLinks.initialize(); // Added custom boards
    boardNavigation.initialize();
    scrollMemory.initialize();
    imageHoverFix.initialize();
    dashboard.initialize();

    if (util.isThreadPage()) {
      gallery.initialize();
    }
  }

  // Load saved config and initialize
  const savedConfig = util.loadConfigFromStorage();
  if (savedConfig) dashboard.applyConfig(savedConfig);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
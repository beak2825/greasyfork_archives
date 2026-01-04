// ==UserScript==
// @name          Magnet Link to Real-Debrid
// @version       2.8.0
// @description   Automatically send magnet links to Real-Debrid
// @author        Journey Over
// @license       MIT
// @match         *://*/*
// @require       https://cdn.jsdelivr.net/gh/StylusThemes/Userscripts@0171b6b6f24caea737beafbc2a8dacd220b729d8/libs/utils/utils.min.js
// @grant         GM_xmlhttpRequest
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @connect       api.real-debrid.com
// @icon          https://www.google.com/s2/favicons?sz=64&domain=real-debrid.com
// @homepageURL   https://github.com/StylusThemes/Userscripts
// @namespace https://greasyfork.org/users/32214
// @downloadURL https://update.greasyfork.org/scripts/546789/Magnet%20Link%20to%20Real-Debrid.user.js
// @updateURL https://update.greasyfork.org/scripts/546789/Magnet%20Link%20to%20Real-Debrid.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let logger;

  const STORAGE_KEY = 'realDebridConfig';
  const API_BASE = 'https://api.real-debrid.com/rest/1.0';
  const INSERTED_ICON_ATTR = 'data-rd-inserted';

  // Rate limiting to respect Real-Debrid's 250 requests/minute limit with headroom
  const RATE_LIMIT_MAX = 250;
  const RATE_LIMIT_HEADROOM = 5;
  const RATE_LIMIT_WINDOW_MS = 60 * 1000;
  const RATE_LIMIT_MAX_RETRIES = 8;
  const RATE_LIMIT_RETRY_BASE_DELAY = 40;

  const API_MAX_RETRY_ATTEMPTS = 5;
  const API_BASE_BACKOFF_DELAY = 500;
  const API_JITTER_MAX = 200;

  const MUTATION_DEBOUNCE_MS = 150;
  const TOAST_DURATION_MS = 5000;
  const TORRENTS_PAGE_LIMIT = 2500;

  const DEFAULTS = {
    apiKey: '',
    allowedExtensions: ['mp3', 'm4b', 'mp4', 'mkv', 'cbz', 'cbr'],
    filterKeywords: ['sample', 'bloopers', 'trailer'],
    manualFileSelection: false,
    debugEnabled: false
  };

  class ConfigurationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ConfigurationError';
    }
  }

  class RealDebridError extends Error {
    constructor(message, statusCode = null, errorCode = null) {
      super(message);
      this.name = 'RealDebridError';
      this.statusCode = statusCode;
      this.errorCode = errorCode;
    }
  }

  const ConfigManager = {
    _safeParse(value) {
      if (!value) return null;
      try {
        return typeof value === 'string' ? JSON.parse(value) : value;
      } catch (error) {
        logger.error('[Config] Failed to parse stored configuration, resetting to defaults.', error);
        return null;
      }
    },

    async getConfig() {
      const stored = GM_getValue(STORAGE_KEY);
      const parsed = this._safeParse(stored) || {};
      return {
        ...DEFAULTS,
        ...parsed
      };
    },

    async saveConfig(config) {
      if (!config || !config.apiKey) throw new ConfigurationError('API Key is required');
      GM_setValue(STORAGE_KEY, JSON.stringify(config));
    },

    validateConfig(config) {
      const errors = [];
      if (!config || !config.apiKey) errors.push('API Key is missing');
      if (!Array.isArray(config.allowedExtensions)) errors.push('allowedExtensions must be an array');
      if (!Array.isArray(config.filterKeywords)) errors.push('filterKeywords must be an array');
      if (typeof config.manualFileSelection !== 'boolean') errors.push('manualFileSelection must be a boolean');
      if (typeof config.debugEnabled !== 'boolean') errors.push('debugEnabled must be a boolean');
      return errors;
    },
  };

  class RealDebridService {
    #apiKey;

    static RATE_STORE_KEY = 'realDebrid_rate_counter';

    static _sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    // Cross-tab rate limiting using GM storage to coordinate between multiple script instances
    static async _reserveRequestSlot() {
      const key = RealDebridService.RATE_STORE_KEY;
      const limit = RATE_LIMIT_MAX - RATE_LIMIT_HEADROOM;
      const windowMs = RATE_LIMIT_WINDOW_MS;
      const maxRetries = RATE_LIMIT_MAX_RETRIES;
      let attempt = 0;
      while (attempt < maxRetries) {
        const now = Date.now();
        let rateLimitData = null;
        try {
          const raw = GM_getValue(key);
          rateLimitData = raw ? JSON.parse(raw) : null;
        } catch {
          rateLimitData = null;
        }

        // Reset window if expired or invalid
        if (!rateLimitData || typeof rateLimitData !== 'object' || !rateLimitData.windowStart || (now - rateLimitData.windowStart) >= windowMs) {
          const fresh = { windowStart: now, count: 1 };
          try {
            GM_setValue(key, JSON.stringify(fresh));
            return;
          } catch {
            attempt += 1;
            await RealDebridService._sleep(RATE_LIMIT_RETRY_BASE_DELAY * attempt);
            continue;
          }
        }

        if ((rateLimitData.count || 0) < limit) {
          rateLimitData.count = (rateLimitData.count || 0) + 1;
          try {
            GM_setValue(key, JSON.stringify(rateLimitData));
            return;
          } catch {
            attempt += 1;
            await RealDebridService._sleep(RATE_LIMIT_RETRY_BASE_DELAY * attempt);
            continue;
          }
        }

        // Wait for current window to expire before retrying
        const earliest = rateLimitData.windowStart;
        const waitFor = Math.max(50, windowMs - (now - earliest) + 50);
        logger.warn(`[Real-Debrid API] Rate limit window full (${rateLimitData.count}/${RATE_LIMIT_MAX}), waiting ${Math.round(waitFor)}ms`);
        await RealDebridService._sleep(waitFor);
        attempt += 1;
      }
      throw new Error('Failed to reserve request slot');
    }

    constructor(apiKey) {
      if (!apiKey) throw new ConfigurationError('API Key required');
      this.#apiKey = apiKey;
    }

    #request(method, endpoint, data = null) {
      const attemptRequest = async (attempt) => {
        try {
          await RealDebridService._reserveRequestSlot();
        } catch (error) {
          logger.error('Request slot reservation failed, proceeding (will rely on backoff)', error);
        }

        return new Promise((resolve, reject) => {
          const url = `${API_BASE}${endpoint}`;
          const payload = data ? new URLSearchParams(data).toString() : null;
          logger.debug(`[Real-Debrid API] ${method} ${endpoint} (attempt ${attempt + 1})`);

          GM_xmlhttpRequest({
            method,
            url,
            headers: {
              Authorization: `Bearer ${this.#apiKey}`,
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: payload,
            onload: (response) => {
              logger.debug(`[Real-Debrid API] Response: ${response.status}`);

              if (!response || typeof response.status === 'undefined') {
                return reject(new RealDebridError('Invalid API response'));
              }
              if (response.status < 200 || response.status >= 300) {
                if (response.status === 429 && attempt < API_MAX_RETRY_ATTEMPTS) {
                  const retryAfter = (() => {
                    try {
                      const parsed = JSON.parse(response.responseText || '{}');
                      return parsed.retry_after || null;
                    } catch {
                      return null;
                    }
                  })();
                  const jitter = Math.random() * API_JITTER_MAX;
                  const backoff = retryAfter ? (retryAfter * 1000) : (API_BASE_BACKOFF_DELAY * Math.pow(2, attempt) + jitter);
                  logger.warn(`[Real-Debrid API] Rate limited (429). Retrying in ${Math.round(backoff)}ms (attempt ${attempt + 1}/${API_MAX_RETRY_ATTEMPTS})`);
                  return setTimeout(() => {
                    attemptRequest(attempt + 1).then(resolve).catch(reject);
                  }, backoff);
                }
                let errorMessage = `HTTP ${response.status}`;
                let errorCode = null;
                try {
                  const parsed = JSON.parse(response.responseText?.trim() || '{}');
                  errorMessage = parsed.error || response.responseText || errorMessage;
                  errorCode = parsed.error_code || null;
                } catch {
                  errorMessage = response.responseText || errorMessage;
                }
                return reject(new RealDebridError(`API Error: ${errorMessage}`, response.status, errorCode));
              }
              if (response.status === 204 || !response.responseText) return resolve({});
              try {
                const parsed = JSON.parse(response.responseText.trim());
                return resolve(parsed);
              } catch (error) {
                logger.error('[Real-Debrid API] Failed to parse JSON response', error);
                return reject(new RealDebridError(`Failed to parse API response: ${error.message}`, response.status));
              }
            },
            onerror: (error) => {
              logger.error('[Real-Debrid API] Network request failed', error);
              return reject(new RealDebridError('Network request failed'));
            },
            ontimeout: () => {
              logger.warn('[Real-Debrid API] Request timed out');
              return reject(new RealDebridError('Request timed out'));
            }
          });
        });
      };

      return attemptRequest(0);
    }

    async addMagnet(magnet) {
      logger.debug('[Real-Debrid API] Adding magnet link');
      return this.#request('POST', '/torrents/addMagnet', {
        magnet
      });
    }

    async getTorrentInfo(torrentId) {
      logger.debug(`[Real-Debrid API] Fetching info for torrent ${torrentId}`);
      return this.#request('GET', `/torrents/info/${torrentId}`);
    }

    async selectFiles(torrentId, filesCsv) {
      const fileCount = filesCsv.split(',').length;
      logger.debug(`[Real-Debrid API] Selecting ${fileCount} files for torrent ${torrentId}`);
      return this.#request('POST', `/torrents/selectFiles/${torrentId}`, {
        files: filesCsv
      });
    }

    async deleteTorrent(torrentId) {
      logger.debug(`[Real-Debrid API] Deleting torrent ${torrentId}`);
      return this.#request('DELETE', `/torrents/delete/${torrentId}`);
    }

    // Paginate through all torrents to check for existing duplicates
    async getExistingTorrents() {
      const torrents = [];
      const limit = TORRENTS_PAGE_LIMIT;
      let pageNumber = 1;
      while (true) {
        try {
          logger.debug(`[Real-Debrid API] Fetching torrents page ${pageNumber} (limit=${limit})`);
          const page = await this.#request('GET', `/torrents?page=${pageNumber}&limit=${limit}`);
          if (!Array.isArray(page) || page.length === 0) {
            logger.warn(`[Real-Debrid API] No torrents returned for page ${pageNumber}`);
            break;
          }
          torrents.push(...page);
          if (page.length < limit) {
            logger.debug(`[Real-Debrid API] Last page reached (${pageNumber}) with ${page.length} items`);
            break;
          }
          pageNumber += 1;
        } catch (error) {
          if (error instanceof RealDebridError && error.statusCode === 429) throw error;
          logger.error('[Real-Debrid API] Failed to fetch existing torrents page', error);
          break;
        }
      }
      logger.debug(`[Real-Debrid API] Fetched total ${torrents.length} existing torrents`);
      return torrents;
    }
  }

  class FileTree {
    constructor(files) {
      this.root = { name: 'Torrent Contents', children: [], type: 'folder', path: '', expanded: false };
      this.buildTree(files);
    }

    // Convert flat file list with paths into hierarchical tree structure
    buildTree(files) {
      for (const file of files) {
        const pathParts = file.path.split('/').filter(part => part.trim() !== '');
        let current = this.root;

        for (let index = 0; index < pathParts.length; index++) {
          const part = pathParts[index];
          const isFile = index === pathParts.length - 1;

          if (isFile) {
            current.children.push({
              ...file,
              name: part,
              type: 'file',
              checked: false
            });
          } else {
            let folder = current.children.find(child => child.name === part && child.type === 'folder');
            if (!folder) {
              folder = {
                name: part,
                type: 'folder',
                children: [],
                checked: false,
                expanded: false,
                path: pathParts.slice(0, index + 1).join('/')
              };
              current.children.push(folder);
            }
            current = folder;
          }
        }
      }
    }

    countFiles(node = this.root) {
      if (node.type === 'file') return 1;
      let count = 0;
      if (node.children) {
        for (const child of node.children) {
          count += this.countFiles(child);
        }
      }
      return count;
    }

    getAllFiles() {
      const files = [];
      const traverse = (node) => {
        if (node.type === 'file') {
          files.push(node);
        }
        if (node.children) {
          for (const child of node.children) {
            traverse(child);
          }
        }
      };
      traverse(this.root);
      return files;
    }

    getSelectedFiles() {
      return this.getAllFiles().filter(file => file.checked).map(file => file.id);
    }
  }

  class MagnetLinkProcessor {
    #config;
    #realDebridApi;
    #existingTorrents = [];

    constructor(config, realDebridApi) {
      this.#config = config;
      this.#realDebridApi = realDebridApi;
    }

    async initialize() {
      try {
        this.#existingTorrents = await this.#realDebridApi.getExistingTorrents();
        logger.debug(`[Magnet Processor] Loaded ${this.#existingTorrents.length} existing torrents`);
      } catch (error) {
        logger.error('[Magnet Processor] Failed to load existing torrents', error);
        this.#existingTorrents = [];
      }
    }

    // Extract torrent hash from magnet link's xt parameter (btih = BitTorrent Info Hash)
    static parseMagnetHash(magnetLink) {
      if (!magnetLink || typeof magnetLink !== 'string') return null;
      try {
        const queryIndex = magnetLink.indexOf('?');
        if (queryIndex === -1) return null;
        const urlParameters = new URLSearchParams(magnetLink.substring(queryIndex));
        const xt = urlParameters.get('xt');
        if (xt && xt.startsWith('urn:btih:')) {
          return xt.substring(9).toUpperCase();
        }
      } catch (error) {
        logger.debug('[Magnet Processor] Failed to parse magnet hash', error);
      }
      return null;
    }

    isTorrentExists(hash) {
      if (!hash) return false;
      return Array.isArray(this.#existingTorrents) && this.#existingTorrents.some(torrent => (torrent.hash || '').toUpperCase() === hash);
    }

    // Filter files by extension and exclude those matching keywords or regex patterns
    filterFiles(files = []) {
      const allowed = new Set(this.#config.allowedExtensions.map(extension => extension.trim().toLowerCase()).filter(Boolean));
      const keywords = (this.#config.filterKeywords || []).map(keyword => keyword.trim()).filter(Boolean);

      return (files || []).filter(file => {
        const path = (file.path || '').toLowerCase();
        const name = path.split('/').pop() || '';
        const extension = name.includes('.') ? name.split('.').pop() : '';

        if (!allowed.has(extension)) return false;

        for (const keyword of keywords) {
          if (!keyword) continue;
          // Handle regex patterns (format: /pattern/)
          if (keyword.startsWith('/') && keyword.endsWith('/')) {
            try {
              const regex = new RegExp(keyword.slice(1, -1), 'i');
              if (regex.test(path) || regex.test(name)) return false;
            } catch {
              // invalid regex: ignore it
            }
          }
          if (path.includes(keyword.toLowerCase()) || name.includes(keyword.toLowerCase())) return false;
        }
        return true;
      });
    }

    async processMagnetLink(magnetLink) {
      const hash = MagnetLinkProcessor.parseMagnetHash(magnetLink);
      if (!hash) throw new RealDebridError('Invalid magnet link');

      if (this.isTorrentExists(hash)) throw new RealDebridError('Torrent already exists on Real-Debrid');

      const addResult = await this.#realDebridApi.addMagnet(magnetLink);
      if (!addResult || typeof addResult.id === 'undefined') {
        throw new RealDebridError('Failed to add magnet');
      }
      const torrentId = addResult.id;

      const info = await this.#realDebridApi.getTorrentInfo(torrentId);
      const files = Array.isArray(info.files) ? info.files : [];

      let selectedFileIds;
      if (this.#config.manualFileSelection) {
        if (files.length === 1) {
          selectedFileIds = [files[0].id];
        } else {
          selectedFileIds = await UIManager.createFileSelectionDialog(files);
          if (selectedFileIds === null) {
            await this.#realDebridApi.deleteTorrent(torrentId);
            throw new RealDebridError('File selection cancelled');
          }
          if (!selectedFileIds.length) {
            await this.#realDebridApi.deleteTorrent(torrentId);
            throw new RealDebridError('No files selected');
          }
        }
      } else {
        selectedFileIds = this.filterFiles(files).map(f => f.id);
        if (!selectedFileIds.length) {
          await this.#realDebridApi.deleteTorrent(torrentId);
          throw new RealDebridError('No matching files found after filtering');
        }
      }

      logger.debug(`[Magnet Processor] Selected files: ${selectedFileIds.map(id => files.find(f => f.id === id)?.path || `ID:${id}`).join(', ')}`);
      await this.#realDebridApi.selectFiles(torrentId, selectedFileIds.join(','));
      return selectedFileIds.length;
    }
  }

  const UIManager = {
    setIconState(icon, state) {
      switch (state) {
        case 'default': {
          icon.textContent = 'RD';
          icon.style.background = '#3b82f6';
          icon.style.filter = '';
          icon.style.opacity = '';
          icon.style.cursor = 'pointer';
          icon.title = '';
          const checkbox = icon.parentNode?.querySelector('input[type="checkbox"]');
          if (checkbox) checkbox.style.cursor = 'pointer';
          break;
        }
        case 'processing': {
          icon.style.opacity = '0.5';
          icon.style.cursor = 'pointer';
          const checkbox = icon.parentNode?.querySelector('input[type="checkbox"]');
          if (checkbox) checkbox.style.cursor = 'pointer';
          break;
        }
        case 'added':
        case 'existing': {
          icon.textContent = '✓';
          icon.style.background = '#10b981';
          icon.style.filter = '';
          icon.style.opacity = '0.65';
          icon.style.cursor = 'not-allowed';
          icon.title = state === 'existing' ? 'Already on Real-Debrid' : 'Added to Real-Debrid';
          const checkbox = icon.parentNode?.querySelector('input[type="checkbox"]');
          if (checkbox) checkbox.style.cursor = 'not-allowed';
          break;
        }
      }
    },

    createConfigDialog(currentConfig) {
      const dialog = document.createElement('div');
      dialog.innerHTML = `
        <div class="rd-overlay">
          <div class="rd-dialog">
            <div class="rd-header">
              <h2 class="rd-title">Real-Debrid Settings</h2>
              <button class="rd-close" id="cancelButtonTop">×</button>
            </div>
            <div class="rd-content">
              <div class="rd-form-group">
                <label class="rd-label">API Key</label>
                <input type="text" id="apiKeyInput" class="rd-input" placeholder="Enter your Real-Debrid API Key" value="${currentConfig.apiKey}">
              </div>
              <div class="rd-form-group">
                <label class="rd-label">Allowed Extensions</label>
                <textarea id="allowedExtensionsTextarea" class="rd-textarea" placeholder="mp4,mkv,avi">${currentConfig.allowedExtensions.join(',')}</textarea>
                <div class="rd-help">Comma-separated file extensions</div>
              </div>
              <div class="rd-form-group">
                <label class="rd-label">Filter Keywords</label>
                <textarea id="filterKeywordsTextarea" class="rd-textarea" placeholder="sample,/trailer/">${currentConfig.filterKeywords.join(',')}</textarea>
                <div class="rd-help">Keywords or regex patterns to exclude</div>
              </div>
              <div class="rd-form-group">
                <label class="rd-checkbox-label">
                  <input type="checkbox" id="manualFileSelectionCheckbox" ${currentConfig.manualFileSelection ? 'checked' : ''}>
                  Manual File Selection
                </label>
                <div class="rd-help">Show file selection dialog for manual selection</div>
              </div>
              <div class="rd-form-group">
                <label class="rd-checkbox-label">
                  <input type="checkbox" id="debugEnabledCheckbox" ${currentConfig.debugEnabled ? 'checked' : ''}>
                  Enable Debug Logging
                </label>
                <div class="rd-help">Log debug messages to console</div>
              </div>
            </div>
            <div class="rd-footer">
              <button class="rd-button rd-primary" id="saveButton">Save Settings</button>
              <button class="rd-button rd-secondary" id="cancelButton">Cancel</button>
            </div>
          </div>
        </div>
      `;

      this.injectStyles();
      document.body.appendChild(dialog);

      const saveButton = dialog.querySelector('#saveButton');
      const cancelButton = dialog.querySelector('#cancelButton');
      const cancelButtonTop = dialog.querySelector('#cancelButtonTop');
      const manualCheckbox = dialog.querySelector('#manualFileSelectionCheckbox');
      const allowedExtensionsTextarea = dialog.querySelector('#allowedExtensionsTextarea');
      const filterKeywordsTextarea = dialog.querySelector('#filterKeywordsTextarea');

      const toggleFiltering = () => {
        const disabled = manualCheckbox.checked;
        allowedExtensionsTextarea.disabled = disabled;
        filterKeywordsTextarea.disabled = disabled;
        allowedExtensionsTextarea.style.opacity = disabled ? '0.5' : '1';
        filterKeywordsTextarea.style.opacity = disabled ? '0.5' : '1';
      };

      manualCheckbox.addEventListener('change', toggleFiltering);
      toggleFiltering();

      const close = () => {
        if (dialog.parentNode) dialog.parentNode.removeChild(dialog);
        document.removeEventListener('keydown', escHandler);
      };

      const escHandler = (event_) => {
        if (event_.key === 'Escape') close();
      };
      document.addEventListener('keydown', escHandler);

      saveButton.addEventListener('click', async () => {
        const newConfig = {
          apiKey: dialog.querySelector('#apiKeyInput').value.trim(),
          allowedExtensions: dialog.querySelector('#allowedExtensionsTextarea').value.split(',').map(extension => extension.trim()).filter(Boolean),
          filterKeywords: dialog.querySelector('#filterKeywordsTextarea').value.split(',').map(k => k.trim()).filter(Boolean),
          manualFileSelection: dialog.querySelector('#manualFileSelectionCheckbox').checked,
          debugEnabled: dialog.querySelector('#debugEnabledCheckbox').checked
        };
        try {
          await ConfigManager.saveConfig(newConfig);
          close();
          this.showToast('Configuration saved successfully!', 'success');
          location.reload();
        } catch (error) {
          this.showToast(error.message, 'error');
        }
      });

      cancelButton.addEventListener('click', close);
      cancelButtonTop.addEventListener('click', close);

      const apiInput = dialog.querySelector('#apiKeyInput');
      if (apiInput) apiInput.focus();

      return dialog;
    },

    createFileSelectionDialog(files) {
      return new Promise((resolve) => {
        const fileTree = new FileTree(files);
        const totalSizeOfAllFiles = fileTree.getAllFiles().reduce((sum, file) => sum + (file.bytes || 0), 0);
        const dialog = document.createElement('div');

        dialog.innerHTML = `
          <div class="rd-overlay">
            <div class="rd-dialog rd-file-dialog">
              <div class="rd-header">
                <h2 class="rd-title">Select Files</h2>
                <button class="rd-close" id="cancelButtonTop">×</button>
              </div>
              <div class="rd-content">
                <div class="rd-file-help">
                  <strong>How to use:</strong> Click folder names to expand/collapse. Click checkboxes to select files or entire folders.
                  Clicking file names will also select/deselect files.
                </div>
                <div class="rd-file-toolbar">
                  <button class="rd-button rd-small" id="toggleAllButton">Select All</button>
                  <span class="rd-file-stats" id="fileStatsLabel">0 files selected</span>
                </div>
                <div class="rd-file-tree" id="fileTreeContainer"></div>
              </div>
              <div class="rd-footer">
                <button class="rd-button rd-primary" id="okButton">Add Selected Files</button>
                <button class="rd-button rd-secondary" id="cancelButton">Cancel</button>
              </div>
            </div>
          </div>
        `;

        this.injectStyles();
        document.body.appendChild(dialog);

        const treeContainer = dialog.querySelector('#fileTreeContainer');
        const toggleAllButton = dialog.querySelector('#toggleAllButton');
        const fileStatsLabel = dialog.querySelector('#fileStatsLabel');
        const okButton = dialog.querySelector('#okButton');
        const cancelButton = dialog.querySelector('#cancelButton');
        const cancelButtonTop = dialog.querySelector('#cancelButtonTop');

        const setFolderChecked = (folder, checked) => {
          folder.checked = checked;
          if (folder.children) {
            for (const child of folder.children) {
              child.checked = checked;
              if (child.type === 'folder') {
                setFolderChecked(child, checked);
              }
            }
          }
        };

        const updateParentStates = (node = fileTree.root) => {
          if (node.type === 'file') return node.checked;

          if (node.children) {
            const childrenStates = node.children.map(updateParentStates);
            const allChecked = childrenStates.every(state => state === true);
            const someChecked = childrenStates.some(state => state === true);

            node.checked = allChecked;
            node.indeterminate = !allChecked && someChecked;

            return someChecked;
          }
          return false;
        };

        const countSelectedFiles = () => {
          return fileTree.getAllFiles().filter(file => file.checked).length;
        };

        const updateUI = () => {
          updateParentStates();
          const selectedCount = countSelectedFiles();
          const totalCount = fileTree.getAllFiles().length;
          const selectedFiles = fileTree.getAllFiles().filter(file => file.checked);
          const totalSize = selectedFiles.reduce((sum, file) => sum + (file.bytes || 0), 0);
          fileStatsLabel.textContent = `${selectedCount} of ${totalCount} files selected (${UIManager.formatBytes(totalSize)} / ${UIManager.formatBytes(totalSizeOfAllFiles)})`;

          const allSelected = totalCount > 0 && selectedCount === totalCount;
          toggleAllButton.textContent = allSelected ? 'Select None' : 'Select All';
        };

        const renderTree = (node, level = 0) => {
          const element = document.createElement('div');
          element.className = `rd-tree-item rd-tree-level-${level}`;

          if (node.type === 'folder') {
            const fileCount = fileTree.countFiles(node);
            element.innerHTML = `
              <div class="rd-folder">
                <div class="rd-folder-header">
                  <span class="rd-expander">${node.expanded ? '▼' : '▶'}</span>
                  <input type="checkbox" class="rd-checkbox" ${node.checked ? 'checked' : ''} ${node.indeterminate ? 'data-indeterminate="true"' : ''}>
                  <span class="rd-folder-name">${node.name}</span>
                  <span class="rd-folder-badge">${fileCount} file${fileCount !== 1 ? 's' : ''}</span>
                </div>
                ${node.expanded ? `<div class="rd-folder-children"></div>` : ''}
              </div>
            `;

            const expander = element.querySelector('.rd-expander');
            const checkbox = element.querySelector('.rd-checkbox');
            const folderName = element.querySelector('.rd-folder-name');
            const childrenContainer = element.querySelector('.rd-folder-children');

            expander.addEventListener('click', (event_) => {
              event_.stopPropagation();
              node.expanded = !node.expanded;
              renderFullTree();
            });

            folderName.addEventListener('click', (event_) => {
              event_.stopPropagation();
              node.expanded = !node.expanded;
              renderFullTree();
            });

            checkbox.addEventListener('change', (event_) => {
              event_.stopPropagation();
              setFolderChecked(node, checkbox.checked);
              updateUI();
              renderFullTree();
            });

            if (node.expanded && childrenContainer && node.children) {
              for (const child of node.children) {
                childrenContainer.appendChild(renderTree(child, level + 1));
              }
            }

          } else {
            element.innerHTML = `
              <div class="rd-file">
                <input type="checkbox" class="rd-checkbox" ${node.checked ? 'checked' : ''}>
                <span class="rd-file-name">${node.name}</span>
                <span class="rd-file-size">${this.formatBytes(node.bytes)}</span>
              </div>
            `;

            const checkbox = element.querySelector('.rd-checkbox');
            const fileName = element.querySelector('.rd-file-name');

            const toggleFile = () => {
              node.checked = !node.checked;
              checkbox.checked = node.checked;
              updateUI();
              renderFullTree();
            };

            checkbox.addEventListener('change', (event_) => {
              event_.stopPropagation();
              toggleFile();
            });

            fileName.addEventListener('click', (event_) => {
              event_.stopPropagation();
              toggleFile();
            });

            checkbox.addEventListener('click', (event_) => {
              event_.stopPropagation();
              toggleFile();
            });
          }

          return element;
        };

        const renderFullTree = () => {
          treeContainer.innerHTML = '';
          treeContainer.appendChild(renderTree(fileTree.root));
        };

        toggleAllButton.addEventListener('click', () => {
          const allFiles = fileTree.getAllFiles();
          const allSelected = allFiles.length > 0 && allFiles.every(file => file.checked);

          for (const file of allFiles) {
            file.checked = !allSelected;
          }

          updateParentStates();
          updateUI();
          renderFullTree();
        });

        const close = () => {
          if (dialog.parentNode) dialog.parentNode.removeChild(dialog);
          document.removeEventListener('keydown', escHandler);
        };

        const escHandler = (event_) => {
          if (event_.key === 'Escape') {
            close();
            resolve(null);
          }
        };
        document.addEventListener('keydown', escHandler);

        okButton.addEventListener('click', () => {
          const selectedFileIds = fileTree.getSelectedFiles();
          close();
          resolve(selectedFileIds);
        });

        cancelButton.addEventListener('click', () => {
          close();
          resolve(null);
        });

        cancelButtonTop.addEventListener('click', () => {
          close();
          resolve(null);
        });

        updateUI();
        renderFullTree();
      });
    },

    injectStyles() {
      if (document.getElementById('rd-styles')) return;

      const styles = `
        .rd-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:10000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;backdrop-filter:blur(4px)}.rd-dialog{background:#1a1d23;border-radius:12px;padding:0;max-width:600px;width:95vw;max-height:90vh;display:flex;flex-direction:column;border:1px solid #2a2f3a;box-shadow:0 20px 60px rgba(0,0,0,0.5);animation:rdSlideIn .2s ease-out}.rd-file-dialog{max-width:800px}.rd-header{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #2a2f3a}.rd-title{margin:0;font-size:18px;font-weight:600;color:#e2e8f0;flex:1}.rd-close{background:none;border:none;color:#94a3b8;font-size:24px;cursor:pointer;padding:4px;border-radius:4px;transition:all .2s}.rd-close:hover{background:#2a2f3a;color:#e2e8f0}.rd-content{padding:24px;flex:1;overflow-y:auto}.rd-form-group{margin-bottom:20px}.rd-label{display:block;margin-bottom:6px;font-weight:500;color:#e2e8f0;font-size:14px}.rd-input,.rd-textarea{width:100%;padding:10px 12px;border:1px solid #374151;border-radius:8px;background:#0f1117;color:#e2e8f0;font-size:14px;transition:all .2s}.rd-input:focus,.rd-textarea:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 2px rgba(59,130,246,0.2)}.rd-textarea{min-height:80px;resize:vertical}.rd-help{margin-top:4px;font-size:12px;color:#94a3b8}.rd-checkbox-label{display:flex;align-items:center;gap:8px;cursor:pointer;color:#e2e8f0;font-size:14px}.rd-footer{padding:20px 24px;border-top:1px solid #2a2f3a;display:flex;gap:12px;justify-content:flex-end}.rd-button{padding:10px 20px;border:none;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s}.rd-primary{background:#3b82f6;color:#fff}.rd-primary:hover{background:#2563eb}.rd-secondary{background:#374151;color:#e2e8f0}.rd-secondary:hover{background:#4b5563}.rd-small{padding:6px 12px;font-size:12px}.rd-file-help{background:#0f1117;border:1px solid #2a2f3a;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#94a3b8;line-height:1.4}.rd-file-toolbar{display:flex;align-items:center;gap:16px;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #2a2f3a}.rd-file-stats{font-size:13px;color:#94a3b8;font-weight:500}.rd-file-tree{max-height:400px;overflow-y:auto}.rd-tree-item{margin:2px 0}.rd-folder-header{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;transition:background .2s}.rd-folder-header:hover{background:#2a2f3a}.rd-expander{width:16px;height:16px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#94a3b8;cursor:pointer;user-select:none}.rd-checkbox{margin:0}.rd-checkbox[data-indeterminate=true]{opacity:.7}.rd-folder-name{color:#e2e8f0;font-weight:500;font-size:14px;cursor:pointer}.rd-folder-badge{background:#374151;color:#94a3b8;padding:2px 6px;border-radius:4px;font-size:11px;font-weight:500}.rd-folder-children{margin-left:20px;border-left:1px solid #2a2f3a;padding-left:12px}.rd-file{display:flex;align-items:center;gap:8px;padding:4px 8px;border-radius:6px;transition:background .2s}.rd-file:hover{background:#2a2f3a}.rd-file-name{color:#cbd5e1;font-size:13px;flex:1;cursor:pointer}.rd-file-size{color:#94a3b8;font-size:12px;font-family:monospace}@keyframes rdSlideIn{from{opacity:0;transform:scale(0.95) translateY(-10px)}to{opacity:1;transform:scale(1) translateY(0)}}.rd-file-tree::-webkit-scrollbar{width:6px}.rd-file-tree::-webkit-scrollbar-track{background:#1a1d23}.rd-file-tree::-webkit-scrollbar-thumb{background:#374151;border-radius:3px}.rd-file-tree::-webkit-scrollbar-thumb:hover{background:#4b5563}
      `;

      const styleSheet = document.createElement('style');
      styleSheet.id = 'rd-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    },

    showToast(message, type = 'info') {
      const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
      };

      const messageDiv = document.createElement('div');
      Object.assign(messageDiv.style, {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        backgroundColor: colors[type] || colors.info,
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        zIndex: 10001,
        fontWeight: '500',
        fontSize: '14px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        animation: 'rdSlideIn 0.2s ease-out'
      });
      messageDiv.textContent = message;
      document.body.appendChild(messageDiv);
      setTimeout(() => {
        if (messageDiv.parentNode) messageDiv.parentNode.removeChild(messageDiv);
      }, TOAST_DURATION_MS);
    },

    createMagnetIcon() {
      const icon = document.createElement('span');
      icon.className = 'rd-icon';
      icon.textContent = 'RD';
      icon.style.cssText = `cursor:pointer;display:inline-block;width:18px;height:18px;margin-left:6px;vertical-align:middle;border-radius:3px;background:#3b82f6;color:white;text-align:center;line-height:18px;font-size:11px;font-weight:bold;`;
      icon.setAttribute(INSERTED_ICON_ATTR, '1');
      return icon;
    },

    createMagnetIconWithCheckbox() {
      const container = document.createElement('span');
      container.style.cssText = `display:inline-flex;align-items:center;gap:4px;vertical-align:middle;`;
      container.setAttribute(INSERTED_ICON_ATTR, '1');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.style.cssText = `cursor:pointer;width:16px;height:16px;margin:0;`;

      const icon = document.createElement('span');
      icon.className = 'rd-icon';
      icon.textContent = 'RD';
      icon.style.cssText = `cursor:pointer;display:inline-block;width:18px;height:18px;border-radius:3px;background:#3b82f6;color:white;text-align:center;line-height:18px;font-size:11px;font-weight:bold;`;

      container.appendChild(checkbox);
      container.appendChild(icon);

      return container;
    },

    formatBytes(bytes) {
      if (bytes === 0) return '0 B';
      const kilobyte = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const index = Math.floor(Math.log(bytes) / Math.log(kilobyte));
      return parseFloat((bytes / Math.pow(kilobyte, index)).toFixed(2)) + ' ' + sizes[index];
    },
  };

  class PageIntegrator {
    constructor(processor = null) {
      this.processor = processor;
      this.observer = null;
      this.keyToIcon = new Map();
      this.selectedLinks = new Set();
      this.totalMagnetLinks = 0;
      this.initialMagnetLinkCount = 0; // Store the initial count separately
      this.batchButton = null;
    }

    setProcessor(processor) {
      this.processor = processor;
    }

    _shouldShowBatchUI() {
      return this.initialMagnetLinkCount > 1;
    }

    _updateBatchButton() {
      if (!this._shouldShowBatchUI()) {
        this._removeBatchButton();
        return;
      }

      const selectedCount = this.selectedLinks.size;
      if (selectedCount === 0) {
        this._removeBatchButton();
        return;
      }

      if (!this.batchButton) {
        this._createBatchButton();
      }

      this.batchButton.textContent = `Process ${selectedCount} Selected Link${selectedCount !== 1 ? 's' : ''}`;
    }

    _createBatchButton() {
      if (this.batchButton) return;

      this.batchButton = document.createElement('button');
      Object.assign(this.batchButton.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        zIndex: '10000',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.2s'
      });

      this.batchButton.addEventListener('mouseenter', () => {
        this.batchButton.style.backgroundColor = '#2563eb';
      });

      this.batchButton.addEventListener('mouseleave', () => {
        this.batchButton.style.backgroundColor = '#3b82f6';
      });

      this.batchButton.addEventListener('click', () => this._processBatch());

      document.body.appendChild(this.batchButton);
    }

    _removeBatchButton() {
      if (this.batchButton && this.batchButton.parentNode) {
        this.batchButton.parentNode.removeChild(this.batchButton);
        this.batchButton = null;
      }
    }

    async _processBatch() {
      const selectedUrls = [...this.selectedLinks];
      if (selectedUrls.length === 0) return;

      const isInitialized = await ensureApiInitialized();
      if (!isInitialized) {
        UIManager.showToast('Real-Debrid API key not configured. Use the menu to set it.', 'info');
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (let index = 0; index < selectedUrls.length; index++) {
        const url = selectedUrls[index];
        const key = this._magnetKeyFor(url);
        const icon = this.keyToIcon.get(key);

        UIManager.showToast(`Processing ${index + 1}/${selectedUrls.length} links...`, 'info');

        if (icon) {
          UIManager.setIconState(icon, 'processing');
        }

        try {
          await this.processor.processMagnetLink(url);
          successCount++;
          if (icon) {
            UIManager.setIconState(icon, 'added');
          }
        } catch (error) {
          errorCount++;
          if (icon) {
            UIManager.setIconState(icon, 'default');
          }
          logger.error(`[Batch Processing] Failed to process ${url}`, error);
        }
      }

      // Clear selections after processing
      this.selectedLinks.clear();
      this._updateBatchButton();

      // Show final summary
      if (errorCount === 0) {
        UIManager.showToast(`Successfully processed ${successCount} link${successCount !== 1 ? 's' : ''}!`, 'success');
      } else if (successCount === 0) {
        UIManager.showToast(`Failed to process all ${errorCount} link${errorCount !== 1 ? 's' : ''}`, 'error');
      } else {
        UIManager.showToast(`Processed ${successCount} successfully, ${errorCount} failed`, 'info');
      }
    }

    _magnetKeyFor(href) {
      const hash = MagnetLinkProcessor.parseMagnetHash(href);
      if (hash) return `hash:${hash}`;
      try {
        return `href:${href.trim().toLowerCase()}`;
      } catch {
        return `href:${String(href).trim().toLowerCase()}`;
      }
    }

    _attach(iconContainer, link) {
      const icon = iconContainer.querySelector('.rd-icon') || iconContainer;
      const checkbox = iconContainer.querySelector('input[type="checkbox"]');

      const processMagnet = async () => {
        if (icon.textContent === '✓') return; // Already processed
        const key = this._magnetKeyFor(link.href);
        const isInitialized = await ensureApiInitialized();

        if (!isInitialized) {
          UIManager.showToast('Real-Debrid API key not configured. Use the menu to set it.', 'info');
          return;
        }

        if (key?.startsWith('hash:') && this.processor?.isTorrentExists(key.split(':')[1])) {
          UIManager.showToast('Torrent already exists on Real-Debrid', 'info');
          UIManager.setIconState(icon, 'existing');
          return;
        }

        UIManager.setIconState(icon, 'processing');

        try {
          const fileCount = await this.processor.processMagnetLink(link.href);
          UIManager.showToast(`Added to Real-Debrid — ${fileCount} file(s) selected`, 'success');
          UIManager.setIconState(icon, 'added');
        } catch (error) {
          UIManager.setIconState(icon, 'default');
          UIManager.showToast(error?.message || 'Failed to process magnet', 'error');
          logger.error('[Magnet Processor] Failed to process magnet link', error);
        }
      };

      icon.addEventListener('click', (event_) => {
        event_.preventDefault();
        processMagnet();
      });

      // Handle checkbox selection for batch processing
      if (checkbox) {
        checkbox.addEventListener('change', (event_) => {
          event_.stopPropagation();
          if (icon.textContent === '✓') return; // Already processed
          if (checkbox.checked) {
            this.selectedLinks.add(link.href);
          } else {
            this.selectedLinks.delete(link.href);
          }
          this._updateBatchButton();
        });

        checkbox.addEventListener('click', (event_) => {
          event_.stopPropagation();
        });
      }
    }

    addIconsTo(documentRoot = document) {
      const links = [...documentRoot.querySelectorAll('a[href^="magnet:"]')];
      this.totalMagnetLinks = links.length;

      // Set initial count only once when we first find magnet links
      if (this.initialMagnetLinkCount === 0 && links.length > 0) {
        // Count unique magnet hashes
        const uniqueHashes = new Set();
        for (const link of links) {
          const hash = MagnetLinkProcessor.parseMagnetHash(link.href);
          if (hash) {
            uniqueHashes.add(hash);
          }
        }
        this.initialMagnetLinkCount = uniqueHashes.size;
      }

      const newlyAddedKeys = [];

      for (const link of links) {
        if (!link.parentNode) continue;

        // Check if this link has already been processed
        if (link.hasAttribute('data-rd-processed')) {
          const key = this._magnetKeyFor(link.href);
          if (key && !this.keyToIcon.has(key)) {
            // Find the icon - it might not be the immediate next sibling anymore
            const icon = link.parentNode.querySelector(`[${INSERTED_ICON_ATTR}]`);
            if (icon) {
              this.keyToIcon.set(key, icon);
            }
          }
          continue;
        }

        const key = this._magnetKeyFor(link.href);
        if (key && this.keyToIcon.has(key)) continue;

        const iconContainer = this._shouldShowBatchUI() ?
          UIManager.createMagnetIconWithCheckbox() :
          UIManager.createMagnetIcon();

        this._attach(iconContainer, link);
        link.parentNode.insertBefore(iconContainer, link.nextSibling);
        link.setAttribute('data-rd-processed', '1');
        const storeKey = key || `href:${link.href.trim().toLowerCase()}`;
        this.keyToIcon.set(storeKey, iconContainer);
        newlyAddedKeys.push(storeKey);
      }

      if (newlyAddedKeys.length) {
        ensureApiInitialized().then(isInitialized => {
          if (isInitialized) this.markExistingTorrents();
        });
      }

      this._updateBatchButton();
    }

    markExistingTorrents() {
      if (!this.processor) return;

      for (const [key, iconContainer] of this.keyToIcon.entries()) {
        if (!key.startsWith('hash:')) continue;
        const hash = key.split(':')[1];
        if (this.processor.isTorrentExists(hash)) {
          const icon = iconContainer.querySelector('.rd-icon') || iconContainer;
          UIManager.setIconState(icon, 'existing');
        }
      }
    }

    // Watch for new magnet links added to the page dynamically
    startObserving() {
      if (this.observer) return;

      const debouncedHandler = debounce((mutations) => {
        let hasNewMagnetLinks = false;
        for (const mutation of mutations) {
          if (mutation.addedNodes && mutation.addedNodes.length) {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.matches && node.matches('a[href^="magnet:"]')) {
                  hasNewMagnetLinks = true;
                  break;
                }
                // Check descendants too
                if (node.querySelector && node.querySelector('a[href^="magnet:"]')) {
                  hasNewMagnetLinks = true;
                  break;
                }
              }
            }
            if (hasNewMagnetLinks) break;
          }
        }
        if (hasNewMagnetLinks) {
          this.addIconsTo(document);
        }
      }, MUTATION_DEBOUNCE_MS);

      this.observer = new MutationObserver(debouncedHandler);
      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    stopObserving() {
      if (!this.observer) return;
      this.observer.disconnect();
      this.observer = null;
      this._removeBatchButton();
    }
  }

  // Lazy initialization to avoid API calls until first magnet link is clicked
  let _apiInitPromise = null;
  let _realDebridService = null;
  let _magnetProcessor = null;
  let _integratorInstance = null;

  async function ensureApiInitialized() {
    if (_apiInitPromise) return _apiInitPromise;

    try {
      if (!document.querySelector || !document.querySelector('a[href^="magnet:"]')) {
        return false;
      }
    } catch {
      // Continue with init if DOM access fails
    }

    const config = await ConfigManager.getConfig();
    if (!config.apiKey) {
      return false;
    }

    try {
      _realDebridService = new RealDebridService(config.apiKey);
    } catch (error) {
      logger.warn('[Initialization] Failed to create Real-Debrid service', error);
      return false;
    }

    _magnetProcessor = new MagnetLinkProcessor(config, _realDebridService);
    _apiInitPromise = _magnetProcessor.initialize()
      .then(() => {
        if (_integratorInstance) {
          _integratorInstance.setProcessor(_magnetProcessor);
          _integratorInstance.markExistingTorrents();
        }
        return true;
      })
      .catch(error => {
        logger.warn('[Initialization] Failed to initialize Real-Debrid integration', error);
        return false;
      });

    return _apiInitPromise;
  }

  async function init() {
    try {
      const config = await ConfigManager.getConfig();
      logger = Logger('Magnet Link to Real-Debrid', { debug: config.debugEnabled });

      _integratorInstance = new PageIntegrator(null);
      _integratorInstance.addIconsTo();
      _integratorInstance.startObserving();

      GM_registerMenuCommand('Configure Real-Debrid Settings', async () => {
        const currentConfig = await ConfigManager.getConfig();
        UIManager.createConfigDialog(currentConfig);
      });
    } catch (error) {
      logger.error('[Initialization] Script initialization failed', error);
    }
  }

  init();

})();

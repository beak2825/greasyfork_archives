// ==UserScript==
// @name        Nexus No Wait
// @description Download from Nexusmods.com without wait and redirect (supports Manual/Vortex/MO2/NMM)
// @namespace   NexusNoWait
// @include     https://www.nexusmods.com/*/mods/*
// @run-at      document-idle
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       unsafeWindow
// @version     2.10
// @downloadURL https://update.greasyfork.org/scripts/394039/Nexus%20No%20Wait.user.js
// @updateURL https://update.greasyfork.org/scripts/394039/Nexus%20No%20Wait.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const win = unsafeWindow || window;
  const doc = win.document;

  const DEFAULT_CONFIG = {
    ProcessArchivedFiles: true,
    AddButtonArchivedFiles: true,
    AutoStartDownload: true,
    LogAdditionalInfo: false,
    BlockNotifications: true,
  };

  function createConfigManager() {
    let config = { ...DEFAULT_CONFIG };

    try {
      GM_listValues().forEach((name) => {
        if (name in DEFAULT_CONFIG) {
          config[name] = GM_getValue(name, DEFAULT_CONFIG[name]);
        }
      });
    } catch (error) {
      console.warn('Nexus No Wait: Failed to load saved settings:', error);
    }

    return {
      get(name) {
        return config[name];
      },
      set(name, value) {
        if (!(name in config)) return false;
        config[name] = value;
        GM_setValue(name, value);
        return true;
      },
      getAll() {
        return { ...config };
      },
    };
  }

  const config = createConfigManager();

  function injectStyles(css) {
    const style = doc.createElement('style');
    style.textContent = css;
    doc.head.appendChild(style);
    return style;
  }

  injectStyles(`
    .jsf-settings-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #1e1e1e;;
      border: 2px solid #ff790a;
      border-radius: 8px;
      padding: 20px;
      z-index: 10000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      min-width: 400px;
      max-width: 90vw;
      max-height: 80vh;
      overflow-y: auto;
      font-family: Arial, sans-serif;
    }

    .jsf-settings-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 9999;
    }

    .jsf-settings-header {
      border-bottom: 1px solid #6441cf;
      padding-bottom: 10px;
      margin-bottom: 15px;
      font-size: 18px;
      font-weight: bold;
      color: #fff;
    }

    .jsf-settings-group {
      margin-bottom: 15px;
    }

    .jsf-settings-label {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      cursor: pointer;
      color: #c3c2c2;
    }

    .jsf-settings-checkbox {
      margin-right: 8px;
      accent-color: #005a87;
    }

    .jsf-settings-buttons {
      margin-top: 20px;
      text-align: right;
      border-top: 1px solid #6441cf;
      padding-top: 15px;
    }

    .jsf-settings-button {
      margin-left: 10px;
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #ccc;
      cursor: pointer;
    }

    .jsf-settings-button:hover {
      background: #e5e5e5;
    }

    .jsf-settings-button.primary {
      background: #007cba;
      color: white;
      border-color: #007cba;
    }

    .jsf-settings-button.primary:hover {
      background: #005a87;
    }

    .jsf-settings-section {
      margin-bottom: 20px;
      padding-bottom: 15px;
    }

    .jsf-settings-section-title {
      font-weight: bold;
      margin-bottom: 10px;
      color: #ebdfdf;
    }
  `);

  const notificationSuccesCss = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      z-index: 10001;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;

    const notificationErrorCss = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #c73015ff;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      z-index: 10001;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;

  function showSettingsModal() {
    const overlay = doc.createElement('div');
    overlay.className = 'jsf-settings-overlay';

    const modal = doc.createElement('div');
    modal.className = 'jsf-settings-modal';

    const currentConfig = config.getAll();

    const header = doc.createElement('div');
    header.className = 'jsf-settings-header';
    header.textContent = 'Nexus No Wait Settings';
    modal.appendChild(header);

    const mainSection = doc.createElement('div');
    mainSection.className = 'jsf-settings-section';

    const mainTitle = doc.createElement('div');
    mainTitle.className = 'jsf-settings-section-title';
    mainTitle.textContent = 'Main Settings';
    mainSection.appendChild(mainTitle);

    Object.entries(currentConfig).forEach(([key, value]) => {
      if (typeof value !== 'boolean') return;

      const group = doc.createElement('div');
      group.className = 'jsf-settings-group';

      const label = doc.createElement('label');
      label.className = 'jsf-settings-label';

      const checkbox = doc.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'jsf-settings-checkbox';
      checkbox.checked = value;
      checkbox.dataset.key = key;

      const text = doc.createElement('span');
      text.textContent = getSettingDescription(key);

      label.appendChild(checkbox);
      label.appendChild(text);
      group.appendChild(label);
      mainSection.appendChild(group);
    });

    modal.appendChild(mainSection);

    const buttons = doc.createElement('div');
    buttons.className = 'jsf-settings-buttons';

    const cancelBtn = doc.createElement('button');
    cancelBtn.className = 'jsf-settings-button';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = () => overlay.remove();

    const saveBtn = doc.createElement('button');
    saveBtn.className = 'jsf-settings-button primary';
    saveBtn.textContent = 'Save';
    saveBtn.onclick = () => {
      modal.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        const key = checkbox.dataset.key;
        config.set(key, checkbox.checked);
      });
      overlay.remove();
      showNotification('Settings saved!', notificationSuccesCss);
    };

    buttons.appendChild(cancelBtn);
    buttons.appendChild(saveBtn);
    modal.appendChild(buttons);

    overlay.onclick = (e) => {
      if (e.target === overlay) overlay.remove();
    };

    overlay.appendChild(modal);
    doc.body.appendChild(overlay);

    const firstCheckbox = modal.querySelector('input[type="checkbox"]');
    firstCheckbox?.focus();
  }

  function getSettingDescription(key) {
    const descriptions = {
      ProcessArchivedFiles: 'Process archived files section',
      AddButtonArchivedFiles: 'Add button for archived files section, if author hide it',
      AutoStartDownload: 'Auto-start download from URL parameters',
      LogAdditionalInfo: 'Log additional information to console',
      BlockNotifications: 'Skip pop-up notifications',
    };
    return descriptions[key] || key;
  }

  function showNotification(text, style) {
    const notification = doc.createElement('div');
    notification.textContent = text;
    notification.style.cssText = style;

    doc.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  }

  GM_registerMenuCommand('⚙️ Settings', showSettingsModal);

  const ajaxRequest = GM_xmlhttpRequest || (GM?.xmlHttpRequest) || null;
  if (!ajaxRequest) {
    console.error('Nexus No Wait: No GM_xmlhttpRequest implementation found');
  }

  function makeRequest(options) {
    if (!ajaxRequest) {
      options.error?.({ error: 'AJAX not available' });
      return;
    }

    ajaxRequest({
      url: options.url,
      method: options.method || 'GET',
      data: options.data,
      headers: options.headers,
      onload: (response) => {
        if (response.status === 200) {
          options.success?.(response.responseText);
        } else {
          options.error?.(response);
        }
      },
      onerror: options.error,
    });
  }

  const ButtonState = {
    error(button) {
      this._change(button, 'red', 'ERROR');
    },
    success(button) {
      this._change(button, 'green', 'LOADING');
    },
    waiting(button) {
      this._change(button, 'yellow', 'WAIT');
    },
    _change(button, color, text) {
      button.style.setProperty('color', color, 'important');
      const span = button.querySelector('span.flex-label');
      if (span) span.innerText = text;
    },
  };

  function fieldValidation(obj) {
    if (!obj || typeof obj !== 'object') return false;

    return Object.values(obj).every(value => {
        if (value == null) return false; 
        if (typeof value === 'string' && value.trim().length === 0) return false;
        return true;
    });
}

  function logError(data) {
    console.error("Nexus No Wait Error:", data);
    showNotification('Error! Something went wrong', notificationErrorCss);
  }

  function getGameId(element) {
    const section = doc.getElementById('section');
    return section?.dataset.gameId || element.current_game_id || null;
  }

  function extractParams(htmlContent, params) {
    var url = typeof htmlContent === 'string' ? htmlContent : htmlContent?.url;
    if (Object.keys(url).length === 0) {
      logError(htmlContent);
    }
    const keyMatch = url.match(/md5=([^&"]+)/);
    const expMatch = url.match(/expires=([^&"]+)/);
    const userMatch = url.match(/user_id=([^&"]+)/);
    params.key = keyMatch?.[1] || null;
    params.expires = expMatch?.[1] || null;
    params.user_id = userMatch?.[1] || null;
    if (!fieldValidation(params)) {
      logError(params);
    }

    return params;
  }

  function makeURL(params) {
    const required = ['game', 'modId', 'fileId', 'key', 'expires', 'user_id'];
    if (required.some((key) => !params[key])) return null;
    return `nxm://${params.game}/mods/${params.modId}/files/${params.fileId}?key=${params.key}&expires=${params.expires}&user_id=${params.user_id}`;
  }

  function getRequestHeaders() {
    return {
      Origin: 'https://www.nexusmods.com',
      Referer: window.location.href,
      'Sec-Fetch-Site': 'same-origin',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    };
  }

  function handleDownloadClick(event) {
    const target = event.target.closest('a.btn');
    if (!target) return;

    if (!target.querySelector('.icon-manual, .icon-nmm')) return;

    const href = target.href || window.location.href;
    const urlParams = new URL(href).searchParams;
    let prm = false;

    if (config.get('BlockNotifications')) {
      if (/ModRequirementsPopUp/.test(target.href)) {
        handleModRequirementsPopup(target, urlParams);
        event.stopPropagation();
        event.stopImmediatePropagation();
      } else if (/DownloadPopUp/.test(target.href)) {
        prm = true;
        handleModRequirementsPopup(target, urlParams);
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
    }

    event.preventDefault();
    processDownload(target, urlParams, href, prm);
  }

  function handleModRequirementsPopup(element, urlParams) {
    if (/ModRequirementsPopUp/.test(element.href) && urlParams.has('id')) {
      element.id = `popup${urlParams.get('id')}`;
    }
  }

  function getCurrentPathSegment(index) {
    return window.location.pathname.split('/')[index] || null;
  }

  function processDownload(button, urlParams, href, prm) {
    ButtonState.waiting(button);

    const params = {
      fileId: urlParams.get('file_id') || urlParams.get('id'),
      gameId: getGameId(button),
      isNMM: urlParams.has('nmm'),
      href,
      game: getCurrentPathSegment(1),
      modId: getCurrentPathSegment(3),
      prm,
      button,
    };

    if (params.isNMM) {
      processNMMDownload(params);
    } else {
      processManualDownload(params);
    }

    handlePopupClose(button, params.fileId);
  }

  function parsePrm(data) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    const url = doc.getElementById('dl_link')?.value;
    if (Object.keys(url).length === 0) {
      logError(htmlContent);
    } else {
      return url;
    }
  }

  function makeDownloadRequest(params, successCallback) {
    var endpoint = params.prm ? 'Widgets/DownloadPopUp?' : 'Managers/Downloads?GenerateDownloadUrl';
    const data = (params.prm ? 'id=' : 'fid=') + params.fileId + '&game_id=' + params.gameId;
    if (params.prm) {
      endpoint += data;
    }

    makeRequest({
      method: params.prm ? 'GET' : 'POST',
      url: `/Core/Libs/Common/${endpoint}`,
      data,
      headers: getRequestHeaders(),
      success: (response) => {
        try {
          if (params.prm) {
            successCallback(response, params);
          } else {
            const data = JSON.parse(response);
            successCallback(data, params);
          }
        } catch (error) {
          console.error('Nexus No Wait: JSON parse error', error);
          ButtonState.error(params.button);
        }
      },
      error: (error) => {
        console.error('Nexus No Wait: Download request failed', error);
        ButtonState.error(params.button);
      },
    });
  }

  function processManualDownload(params) {
    makeDownloadRequest(params, (data, params) => {
      const url = params.prm ? parsePrm(data) : data?.url;
      if (url) {
        ButtonState.success(params.button);
        window.location.href = url;
      } else {
        ButtonState.error(params.button);
      }
    });
  }

  function processNMMDownload(params) {
    makeDownloadRequest(params, (data, params) => {
      params = extractParams(data, params);
      const downloadUrl = makeURL(params);
      if (downloadUrl) {
        ButtonState.success(params.button);
        window.location.href = downloadUrl;
      } else {
        ButtonState.error(params.button);
        logError(params);
      }
    });
  }

  function handlePopupClose(button, fileId) {
    const popup = button.parentNode;
    if (popup?.classList.contains('popup')) {
      const closeButton = popup.getElementsByTagName('button')[0];
      closeButton?.click();

      const popupButton = doc.getElementById(`popup${fileId}`);
      if (popupButton) ButtonState.success(popupButton);
    }
  }

  function findDownloadButton() {
    let button = doc.getElementById('slowDownloadButton') || doc.getElementById('startDownloadButton');
    if (button) return button;

    const webComponent = doc.querySelector('mod-file-download');
    if (webComponent?.shadowRoot) {
      button = webComponent.shadowRoot.getElementById('slowDownloadButton') ||
               webComponent.shadowRoot.getElementById('startDownloadButton');
      if (button) return button;
    }

    const upsellCards = doc.getElementById('upsell-cards');
    if (upsellCards?.lastElementChild) {
      const buttons = upsellCards.lastElementChild.getElementsByTagName('button');
      return buttons[0] || upsellCards.lastElementChild;
    }

    return null;
  }

  function autoStartDownload() {
    if (!config.get('AutoStartDownload') || !/\bfile_id=/.test(window.location.href)) return;

    setTimeout(() => {
      let button = findDownloadButton();
      if (!button) {
        const webComponent = doc.querySelector('mod-file-download');
        if (webComponent?.shadowRoot) {
          button = webComponent.shadowRoot.getElementById('slowDownloadButton') ||
                   webComponent.shadowRoot.getElementById('startDownloadButton') ||
                   webComponent.shadowRoot.querySelector('#upsell-cards button');
        }
      }

      if (button) {
        const fakeEvent = {
          target: button,
          preventDefault: () => {},
        };
        handleDownloadClick(fakeEvent);
      }
    }, 1000);
  }

  function processArchivedFiles() {
    if (!config.get('ProcessArchivedFiles') || !/[?&]category=archived/.test(window.location.href)) return;

    const fileHeaders = doc.getElementsByClassName('file-expander-header');
    const downloadContainers = doc.getElementsByClassName('accordion-downloads');
    const basePath = `${location.protocol}//${location.host}${location.pathname}`;

    for (let i = 0; i < downloadContainers.length; i++) {
      const fileId = fileHeaders[i]?.getAttribute('data-id');
      if (!fileId) continue;

      downloadContainers[i].innerHTML = `
        <li>
          <a class="btn inline-flex" href="${basePath}?tab=files&file_id=${fileId}&nmm=1" tabindex="0">
            <svg title="" class="icon icon-nmm"><use xlink:href="https://www.nexusmods.com/assets/images/icons/icons.svg#icon-nmm"></use></svg>
            <span class="flex-label">Mod manager download</span>
          </a>
        </li>
        <li></li>
        <li>
          <a class="btn inline-flex" href="${basePath}?tab=files&file_id=${fileId}" tabindex="0">
            <svg title="" class="icon icon-manual"><use xlink:href="https://www.nexusmods.com/assets/images/icons/icons.svg#icon-manual"></use></svg>
            <span class="flex-label">Manual download</span>
          </a>
        </li>
      `;
    }
  }

  function addButtonArchivedFiles() {
    if (!config.get('AddButtonArchivedFiles') || !/[?&]tab=files/.test(window.location.href)) return;

    const filesTabFooter = doc.getElementById('files-tab-footer');
    if (!filesTabFooter) return;

    const link = filesTabFooter.querySelector('a.btn.inline-flex');
    if (link) return;

    filesTabFooter.innerHTML = `
      <a class="btn inline-flex" href="${window.location.href}&category=archived">
        <svg class="icon icon-archive">
          <use xlink:href="/assets/images/icons/icons.svg#icon-archive"></use>
        </svg>
        <span class="flex-label">File archive</span>
      </a>
    `;
  }

  function init() {
    if (config.get('LogAdditionalInfo')) {
      console.log('Nexus No Wait: Script loaded with config:', config.getAll());
    }
    addButtonArchivedFiles();
    processArchivedFiles();
    autoStartDownload();
    doc.body.addEventListener('click', handleDownloadClick, true);
  }

  init();
})();
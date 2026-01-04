// ==UserScript==
// @name         Easy Storage Manager
// @namespace    https://greasyfork.org/en/scripts/466806-easy-storage-manager
// @author       DevlinDelFuego, Gentleman_Hiwi
// @version      2025.12.26
// @description  Easy Storage Manager is a handy script that allows you to easily export and import local storage data for WME.
// @match        *://*.waze.com/*editor*
// @exclude      *://*.waze.com/user/editor*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      api.dropboxapi.com
// @connect      content.dropboxapi.com
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GPLv3
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/466806/Easy%20Storage%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/466806/Easy%20Storage%20Manager.meta.js
// ==/UserScript==

(function () {
    'use strict';

  const ESM_DIAG = {
    log: (...args) => console.log('[ESM]', ...args),
    warn: (...args) => console.warn('[ESM]', ...args),
    error: (...args) => console.error('[ESM]', ...args)
  };

  const currentWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

  currentWindow.addEventListener('error', (e) => {
    try { sessionStorage.setItem('ESM_DIAG_LAST_ERROR', `${e.message} at ${e.filename}:${e.lineno}`); } catch (err) {}
    ESM_DIAG.error('Unhandled error:', e.message);
  });
  currentWindow.addEventListener('unhandledrejection', (e) => {
    try { sessionStorage.setItem('ESM_DIAG_LAST_REJECTION', String(e.reason)); } catch (err) {}
    ESM_DIAG.error('Unhandled rejection:', e.reason);
  });

  // Compact UI styles
  (function injectCompactStyles(){
    const css = `
      #esm-import, #esm-export,
      #esm-cloud-backup, #esm-cloud-restore,
      #esm-import-btn, #esm-export-btn,
      #esm-drive-backup-btn, #esm-drive-restore-btn {
        padding: 6px 10px !important;
        font-size: 12px !important;
        width: 100% !important;
        flex: 1 1 0 !important;
        min-width: 0 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        box-sizing: border-box !important;
        margin: 0 !important;
      }
      #esm-tab > div, #easy-storage-manager-tab > div {
        display: grid !important;
        width: 100% !important;
        grid-template-columns: 1fr 1fr 1fr 1fr !important;
        gap: 8px !important;
        align-items: stretch !important;
        box-sizing: border-box !important;
      }
      #esm-fallback-panel .btnRow,
      #esm-fallback-panel > div[style*="display: flex"] {
        display: grid !important;
        width: 100% !important;
        grid-template-columns: 1fr 1fr 1fr 1fr !important;
        gap: 8px !important;
        align-items: stretch !important;
        box-sizing: border-box !important;
        margin: 0 !important;
      }
      @media (max-width: 768px) {
        #esm-tab > div, #easy-storage-manager-tab > div,
        #esm-fallback-panel .btnRow,
        #esm-fallback-panel > div[style*="display: flex"] {
          grid-template-columns: 1fr 1fr !important;
        }
      }
      @media (max-width: 480px) {
        #esm-tab > div, #easy-storage-manager-tab > div,
        #esm-fallback-panel .btnRow,
        #esm-fallback-panel > div[style*="display: flex"] {
          grid-template-columns: 1fr !important;
        }
      }
    `;
    try {
      const style = document.createElement('style');
      style.id = 'esm-compact-styles';
      style.textContent = css;
      if (document.head) {
        document.head.appendChild(style);
      } else {
        document.addEventListener('DOMContentLoaded', function(){
          try { document.head.appendChild(style); } catch (_) {}
        });
      }
    } catch (_) {}
  })();

    let importedData;
    let applyButton;
    let scriptVersion = (typeof GM_info !== 'undefined' && GM_info && GM_info.script && GM_info.script.version) ? GM_info.script.version : '2025.12.26';
    const updateMessage = "<b>Changelog</b><br><br> - Full backup export/import now includes localStorage, sessionStorage, cookies, and IndexedDB. <br> - You can select which items to restore across all storage types and DB records. <br> - The page will refresh after importing to apply changes. <br> - Added Dropbox cloud backup and restore functionality. <br> - Integrated with WME SDK for sidebar tab registration. <br><br>";
    const REAPPLY_STASH_KEY = 'ESM_POST_RELOAD';

    const ESM_LANG = ((navigator.language || 'en').toLowerCase().startsWith('de')) ? 'de' : 'en';
    const ESM_I18N = {
      de: {
        panelTitle: 'Cloud-Backup (Dropbox) – Anleitung',
        show: 'Anzeigen',
        hide: 'Ausblenden',
        howTo: 'So aktivierst du die Online-Cloud:',
        step1: 'Bei Dropbox anmelden.',
        step2: 'App erstellen (kostenlos):',
        step3: 'Stel de volgende machtigingen in: bestanden.metadata.lezen, bestanden.inhoud.schrijven, bestanden.inhoud.lezen',
        step4: 'In deiner App einen Generated access token erzeugen.',
        step5: 'Token unten eingeben und speichern.',
        genTokenLabel: 'Generated access token:',
        saveTokenBtn: 'Token speichern',
        clearTokenBtn: 'Abmelden',
        statusEnterToken: 'Bitte Token eingeben.',
        statusSavedValidated: 'Token gespeichert und validiert. Dropbox ist bereit.',
        statusSignedOut: 'Abgemeldet. Bitte neuen Token eingeben.',
        cloudBackup: '☁️ Cloud Sichern',
        cloudRestore: '☁️ Wiederherstellen',
        cloudBackupTitle: '☁️ Backup in Dropbox sichern',
        cloudRestoreTitle: '☁️ Aus Dropbox wiederherstellen',
        importExportDesc: 'Importiere eine Backup-JSON-Datei oder exportiere ein vollständiges Backup (localStorage, sessionStorage, Cookies, IndexedDB).',
        importBackup: '♻️ Wiederherstellen',
        exportBackup: '💾 Lokal Speichern',
        importBackupTitle: '♻️ Backup importieren',
        exportBackupTitle: '💾 Backup exportieren',
        driveBackupTitle: '☁️ Backup in Dropbox sichern',
        driveRestoreTitle: '☁️ Aus Dropbox wiederherstellen',
        importFunctionUnavailable: 'Import-Funktion nicht verfügbar',
        exportFunctionUnavailable: 'Export-Funktion nicht verfügbar',
        dropboxExportUnavailable: 'Dropbox Backup-Funktion nicht verfügbar',
        dropboxImportUnavailable: 'Dropbox Wiederherstellungs-Funktion nicht verfügbar',
        driveExportUnavailable: 'Dropbox Backup-Funktion nicht verfügbar',
        driveImportUnavailable: 'Dropbox Wiederherstellungs-Funktion nicht verfügbar',
        selectAll: 'Alle auswählen',
        deselectAll: 'Auswahl aufheben',
        apply: 'Anwenden',
        scriptTitle: 'Easy Storage Manager',
        fallbackDesc: 'Fallback-Panel aktiv. Importiere/Exportiere Backups und wähle Schlüssel zur Wiederherstellung.',
        dropboxSaveSuccessPrefix: '✅ Backup erfolgreich in Dropbox gespeichert!',
        dropboxSaveFailedPrefix: '❌ Dropbox Backup fehlgeschlagen:',
        dropboxNoBackups: '❌ Keine Backup-Dateien in Dropbox gefunden.',
        invalidSelection: '❌ Ungültige Auswahl.',
        foreignBackupHint: 'Hinweis: Das Backup stammt von einer anderen Quelle. Aus Sicherheitsgründen werden Cookies und Session Storage standardmäßig nicht importiert.',
        dropboxLoadSuccessPrefix: '✅ Dropbox Backup erfolgreich geladen!',
        foundEntriesLabel: 'Gefundene Einträge:',
        invalidJson: '❌ Backup-Datei konnte nicht gelesen werden: Ungültiges JSON-Format.',
        dropboxRestoreFailedPrefix: '❌ Dropbox Wiederherstellung fehlgeschlagen:',
        fileReadSuccess: 'Datei erfolgreich gelesen',
        fileReadError: 'Fehler beim Lesen der Datei. Bitte erneut versuchen.',
        noKeysSelected: 'Keine Schlüssel ausgewählt. Nichts zu importieren.',
        fileLabel: 'Datei:',
        pathLabel: 'Pfad:',
        sizeLabel: 'Größe:',
        kb: 'KB',
        restorePrompt: 'Welche Datei möchten Sie wiederherstellen?'
      },
      en: {
        panelTitle: 'Cloud Backup (Dropbox) – Guide',
        show: 'Show',
        hide: 'Hide',
        howTo: 'How to enable cloud backup:',
        step1: 'Sign in to Dropbox.',
        step2: 'Create an app (free):',
        step3: 'set permissions: files.metadata.read, files.content.write, files.content.read',
        step4: 'Generate a personal access token in your app.',
        step5: 'Enter the token below and save it.',
        genTokenLabel: 'Generated access token:',
        saveTokenBtn: 'Save Token',
        clearTokenBtn: 'Sign out',
        statusEnterToken: 'Please enter a token.',
        statusSavedValidated: 'Token saved and validated. Dropbox is ready.',
        statusSignedOut: 'Signed out. Please enter a new token.',
        cloudBackup: '☁️ Cloud Backup',
        cloudRestore: '☁️ Restore',
        cloudBackupTitle: '☁️ Save backup to Dropbox',
        cloudRestoreTitle: '☁️ Restore from Dropbox',
        importExportDesc: 'Import a backup JSON file or export a full backup (localStorage, sessionStorage, cookies, IndexedDB).',
        importBackup: '♻️ Restore',
        exportBackup: '💾 Save Local',
        importBackupTitle: '♻️ Import Backup',
        exportBackupTitle: '💾 Export Backup',
        driveBackupTitle: '☁️ Save backup to Dropbox',
        driveRestoreTitle: '☁️ Restore from Dropbox',
        importFunctionUnavailable: 'Import function not available',
        exportFunctionUnavailable: 'Export function not available',
        dropboxExportUnavailable: 'Dropbox export function not available',
        dropboxImportUnavailable: 'Dropbox restore function not available',
        driveExportUnavailable: 'Dropbox export function not available',
        driveImportUnavailable: 'Dropbox import function not available',
        selectAll: 'Select All',
        deselectAll: 'Deselect All',
        apply: 'Apply',
        scriptTitle: 'Easy Storage Manager',
        fallbackDesc: 'Fallback panel active. Import/export backups and choose keys to restore.',
        dropboxSaveSuccessPrefix: '✅ Backup saved to Dropbox successfully!',
        dropboxSaveFailedPrefix: '❌ Dropbox backup failed:',
        dropboxNoBackups: '❌ No backup files found in Dropbox.',
        invalidSelection: '❌ Invalid selection.',
        foreignBackupHint: 'Note: The backup originates from a different source. For security reasons, cookies and session storage are not imported by default.',
        dropboxLoadSuccessPrefix: '✅ Dropbox backup loaded successfully!',
        foundEntriesLabel: 'Found entries:',
        invalidJson: '❌ Could not read backup file: Invalid JSON format.',
        dropboxRestoreFailedPrefix: '❌ Dropbox restore failed:',
        fileReadSuccess: 'File read successfully',
        fileReadError: 'Error occurred while reading the file. Please try again.',
        noKeysSelected: 'No keys selected. Nothing to import.',
        fileLabel: 'File:',
        pathLabel: 'Path:',
        sizeLabel: 'Size:',
        kb: 'KB',
        restorePrompt: 'Which file would you like to restore?'
      }
    };

    function t(key) {
      const langVal = (ESM_I18N[ESM_LANG] && ESM_I18N[ESM_LANG][key]) || null;
      const enVal = (ESM_I18N.en && ESM_I18N.en[key]) || null;
      return langVal || enVal || key;
    }

    const DROPBOX_CONFIG = {
      APP_KEY: 'vrc8owxjcgnbczs',
      APP_SECRET: 'ywpvq6qu1ngxp81',
      ACCESS_TOKEN: null,
      API_BASE_URL: 'https://api.dropboxapi.com/2',
      CONTENT_API_URL: 'https://content.dropboxapi.com/2'
    };

    let dropboxAuth = null;
    const DROPBOX_TOKEN_KEY = 'ESM_DROPBOX_TOKEN';
    const DROPBOX_ACCOUNT_CACHE_KEY = 'ESM_DROPBOX_ACCOUNT';

    (function(){
      const origAlert = currentWindow.alert;
      const map = {
        'Import function not available': t('importFunctionUnavailable'),
        'Export function not available': t('exportFunctionUnavailable'),
        'Dropbox Backup-Funktion nicht verfügbar': t('dropboxExportUnavailable'),
        'Dropbox Wiederherstellungs-Funktion nicht verfügbar': t('dropboxImportUnavailable'),
      };
      currentWindow.alert = function(msg){
        const key = String(msg);
        const repl = map[key] || key;
        return origAlert(repl);
      };
    })();

    function setDropboxToken(token) {
      try {
        localStorage.setItem(DROPBOX_TOKEN_KEY, token);
        dropboxAuth = token;
        ESM_DIAG.log('Dropbox token gespeichert.');
      } catch (e) {
        ESM_DIAG.warn('Konnte Dropbox-Token nicht speichern:', e);
      }
    }

    function clearDropboxToken() {
      try {
        localStorage.removeItem(DROPBOX_TOKEN_KEY);
        dropboxAuth = null;
        sessionStorage.removeItem(DROPBOX_ACCOUNT_CACHE_KEY);
        ESM_DIAG.log('Dropbox-Token gelöscht.');
      } catch (e) {
        ESM_DIAG.warn('Konnte Dropbox-Token nicht löschen:', e);
      }
    }

    async function promptForDropboxToken() {
      const hint = 'Bitte persönliches Dropbox Access Token eingeben (Bearer Token).\n' +
        'Anleitung: Öffne https://www.dropbox.com/developers/apps, wähle deine App,\n' +
        'erzeuge ein Access Token und füge es hier ein.';
      const token = currentWindow.prompt(hint);
      if (!token) throw new Error('Kein Dropbox-Token eingegeben');
      setDropboxToken(token.trim());
      await getDropboxAccount(token.trim());
      return token.trim();
    }

    async function getDropboxAccount(accessToken) {
      try {
        const cached = sessionStorage.getItem(DROPBOX_ACCOUNT_CACHE_KEY);
        if (cached) return JSON.parse(cached);
      } catch (_) {}
      if (typeof GM_xmlhttpRequest !== 'function') {
        return { account_id: 'unknown', email: 'unknown' };
      }
      const res = await gmFetch(`${DROPBOX_CONFIG.API_BASE_URL}/users/get_current_account`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (res.status < 200 || res.status >= 300) {
        throw new Error(`Dropbox-Token ungültig (${res.status})`);
      }
      let info;
      try { info = JSON.parse(res.responseText); } catch (_) { info = { account_id: 'unknown', email: 'unknown' }; }
      try { sessionStorage.setItem(DROPBOX_ACCOUNT_CACHE_KEY, JSON.stringify(info)); } catch (_) {}
      return info;
    }

    function gmFetch(url, opts = {}) {
      const method = opts.method || 'GET';
      const headers = opts.headers || {};
      const hasBody = Object.prototype.hasOwnProperty.call(opts, 'body');
      let body = null;
      if (hasBody) {
        if (typeof opts.body === 'string') body = opts.body;
        else if (opts.body != null) body = JSON.stringify(opts.body);
      }
      const responseType = opts.responseType || 'text';
      return new Promise((resolve, reject) => {
        if (typeof GM_xmlhttpRequest !== 'function') {
          reject(new Error('GM_xmlhttpRequest not available'));
          return;
        }
        try {
          const req = {
            url,
            method,
            headers,
            responseType,
            onload: (res) => resolve(res),
            onerror: (err) => reject(new Error(err && err.error ? err.error : 'GM request failed')),
            ontimeout: () => reject(new Error('GM request timeout'))
          };
          if (body != null) req.data = body;
          GM_xmlhttpRequest(req);
        } catch (e) {
          reject(e);
        }
      });
    }

    function captureNativeStorage() {
      try {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'about:blank';
        document.documentElement.appendChild(iframe);
        const win = iframe.contentWindow;
        const methods = {
          getItem: win.Storage.prototype.getItem,
          setItem: win.Storage.prototype.setItem,
          removeItem: win.Storage.prototype.removeItem,
          key: win.Storage.prototype.key
        };
        iframe.parentNode.removeChild(iframe);
        return methods;
      } catch (e) {
        return {
          getItem: Storage.prototype.getItem,
          setItem: Storage.prototype.setItem,
          removeItem: Storage.prototype.removeItem,
          key: Storage.prototype.key
        };
      }
    }
    const NativeStorage = captureNativeStorage();

    try { reapplyAfterReload(); } catch (_) { }

    function injectDropboxHelpPanel(parent) {
      try {
        if (document.getElementById('esm-dropbox-help-panel')) return;
        const inline = !!parent;
        const hiddenKey = inline ? 'ESM_DROPBOX_HELP_TAB_HIDDEN' : 'ESM_DROPBOX_HELP_HIDDEN';
        const hidden = localStorage.getItem(hiddenKey) === '1';
        const wrapper = document.createElement('div');
        wrapper.id = 'esm-dropbox-help-panel';
        wrapper.style.fontFamily = "system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";
        wrapper.style.color = '#111827';
        if (!inline) {
          wrapper.style.position = 'fixed';
          wrapper.style.bottom = '16px';
          wrapper.style.right = '16px';
          wrapper.style.zIndex = '2147483646';
        } else {
          wrapper.style.marginTop = '10px';
          wrapper.style.width = '100%';
        }

        const card = document.createElement('div');
        card.style.background = '#ffffff';
        card.style.border = '1px solid #e5e7eb';
        card.style.borderRadius = '12px';
        card.style.overflow = 'hidden';
        if (!inline) {
          card.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
          card.style.width = '340px';
          card.style.maxWidth = '90vw';
        } else {
          card.style.boxShadow = 'none';
          card.style.width = '100%';
        }

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';
        header.style.padding = '10px 12px';
        header.style.background = '#f9fafb';
        header.style.borderBottom = '1px solid #e5e7eb';
        const title = document.createElement('div');
        title.textContent = t('panelTitle');
        title.style.fontSize = '13px';
        title.style.fontWeight = '600';
        const controls = document.createElement('div');
        const btnHide = document.createElement('button');
        btnHide.textContent = hidden ? t('show') : t('hide');
        btnHide.style.fontSize = '12px';
        btnHide.style.border = '1px solid #d1d5db';
        btnHide.style.background = '#ffffff';
        btnHide.style.borderRadius = '8px';
        btnHide.style.padding = '4px 8px';
        btnHide.style.cursor = 'pointer';
        btnHide.addEventListener('click', () => {
          const contentVisible = content.style.display !== 'none';
          content.style.display = contentVisible ? 'none' : 'block';
          btnHide.textContent = contentVisible ? t('show') : t('hide');
          try { localStorage.setItem(hiddenKey, contentVisible ? '1' : '0'); } catch (_) {}
        });
        controls.appendChild(btnHide);
        header.appendChild(title);
        header.appendChild(controls);

        const content = document.createElement('div');
        content.style.padding = '12px';
        content.style.display = hidden ? 'none' : 'block';
        content.innerHTML = `
          <div style="font-size:12px; line-height:1.5;">
            <p style="margin:0 0 8px"><b>${t('howTo')}</b></p>
            <ol style="margin:0 0 10px 18px; padding:0;">
              <li>${t('step1')}</li>
              <li>${t('step2')} <a href="https://www.dropbox.com/developers/apps" target="_blank" rel="noopener">https://www.dropbox.com/developers/apps</a></li>
              <li>${t('step3')}</li>
              <li>${t('step4')}</li>
            </ol>
            <div style="margin:8px 0 4px">${t('genTokenLabel')}</div>
            <input id="esm-dropbox-token-input" type="text" placeholder="Dropbox Access Token" style="width:100%; box-sizing:border-box; font-size:12px; padding:6px 8px; border:1px solid #d1d5db; border-radius:8px;" />
            <div style="display:flex; gap:8px; margin-top:8px;">
              <button id="esm-dropbox-token-save" style="flex:1; font-size:12px; border:1px solid #10b981; background:#10b981; color:#fff; border-radius:8px; padding:6px 8px; cursor:pointer;">${t('saveTokenBtn')}</button>
              <button id="esm-dropbox-token-clear" style="flex:1; font-size:12px; border:1px solid #ef4444; background:#ef4444; color:#fff; border-radius:8px; padding:6px 8px; cursor:pointer;">${t('clearTokenBtn')}</button>
            </div>
            <div id="esm-dropbox-token-status" style="margin-top:8px; font-size:12px; color:#374151;"></div>
          </div>
        `;

        card.appendChild(header);
        card.appendChild(content);
        wrapper.appendChild(card);
        if (inline && parent) {
          parent.appendChild(wrapper);
        } else {
          document.documentElement.appendChild(wrapper);
        }

        const input = content.querySelector('#esm-dropbox-token-input');
        const saveBtn = content.querySelector('#esm-dropbox-token-save');
        const clearBtn = content.querySelector('#esm-dropbox-token-clear');
        const statusEl = content.querySelector('#esm-dropbox-token-status');
        try {
          const stored = localStorage.getItem(DROPBOX_TOKEN_KEY);
          if (stored) input.value = stored;
        } catch (_) {}

        async function setStatus(msg, type) {
          statusEl.textContent = msg || '';
          statusEl.style.color = type === 'error' ? '#b91c1c' : (type === 'success' ? '#065f46' : '#374151');
        }

        saveBtn.addEventListener('click', async () => {
          const token = String(input.value || '').trim();
          if (!token) { setStatus(t('statusEnterToken'), 'error'); return; }
          try {
            setDropboxToken(token);
            await getDropboxAccount(token);
            setStatus(t('statusSavedValidated'), 'success');
          } catch (e) {
            setStatus(`Fehler: ${e && e.message ? e.message : e}`, 'error');
          }
        });

        clearBtn.addEventListener('click', async () => {
          try {
            clearDropboxToken();
            input.value = '';
            setStatus(t('statusSignedOut'), '');
          } catch (e) {
            setStatus(`Fehler: ${e && e.message ? e.message : e}`, 'error');
          }
        });
      } catch (e) {
        ESM_DIAG.warn('Konnte Dropbox-Hilfspanel nicht einfügen:', e);
      }
    }

    async function authenticateDropbox() {
      try {
        const token = (dropboxAuth && String(dropboxAuth).trim()) || localStorage.getItem(DROPBOX_TOKEN_KEY);
        if (token && String(token).trim()) {
          try { await getDropboxAccount(token); } catch (_) {}
          dropboxAuth = String(token).trim();
          return dropboxAuth;
        }
        const manual = await promptForDropboxToken();
        dropboxAuth = manual;
        return manual;
      } catch (error) {
        throw error;
      }
    }

    async function exportToDropbox() {
      try {
        const accessToken = await authenticateDropbox();
        const backup = await generateFullBackup();
        backup.meta.backupType = 'dropbox';
        const backupData = JSON.stringify(backup, null, 2);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `wme_settings_backup_${timestamp}.json`;
        const account = await getDropboxAccount(accessToken);
        const userFolder = `/WME_Backups/${account && account.account_id ? account.account_id : 'unknown'}`;

        const gmRes = await gmFetch(`${DROPBOX_CONFIG.CONTENT_API_URL}/files/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Authorization': `Bearer ${accessToken}`,
            'Dropbox-API-Arg': JSON.stringify({
              path: `${userFolder}/${fileName}`,
              mode: 'add',
              autorename: true
            })
          },
          body: backupData
        });
        if (gmRes.status < 200 || gmRes.status >= 300) throw new Error(gmRes.responseText);

        currentWindow.alert(`${t('dropboxSaveSuccessPrefix')}\n\n${t('fileLabel')} ${fileName}\n${t('sizeLabel')} ${Math.round(backupData.length / 1024)} ${t('kb')}`);
      } catch (error) {
        currentWindow.alert(`${t('dropboxSaveFailedPrefix')}\n\n${error.message}`);
      }
    }

    async function importFromDropbox() {
      try {
        const accessToken = await authenticateDropbox();
        const account = await getDropboxAccount(accessToken);
        const userFolder = `/WME_Backups/${account && account.account_id ? account.account_id : 'unknown'}`;
        
        const listRes = await gmFetch(`${DROPBOX_CONFIG.API_BASE_URL}/files/list_folder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: { path: userFolder, recursive: false }
        });
        if (listRes.status < 200 || listRes.status >= 300) throw new Error(listRes.responseText);
        const listJson = JSON.parse(listRes.responseText);

        const files = listJson.entries ? listJson.entries.filter(entry =>
          entry['.tag'] === 'file' && entry.name.includes('wme_settings_backup')
        ) : [];

        if (files.length === 0) {
          currentWindow.alert(t('dropboxNoBackups'));
          return;
        }

        let fileList = 'Dropbox Backups:\n\n';
        files.forEach((file, index) => {
          const date = new Date(file.client_modified).toLocaleString();
          fileList += `${index + 1}. ${file.name} (${date})\n`;
        });

        const selection = currentWindow.prompt(`${fileList}\n${t('restorePrompt')} (1-${files.length})`);
        if (!selection) return;

        const fileIndex = parseInt(selection) - 1;
        if (fileIndex < 0 || fileIndex >= files.length) {
          currentWindow.alert(t('invalidSelection'));
          return;
        }

        const selectedFile = files[fileIndex];
        const dlRes = await gmFetch(`${DROPBOX_CONFIG.CONTENT_API_URL}/files/download`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Dropbox-API-Arg': JSON.stringify({ path: selectedFile.path_lower })
          }
        });
        if (dlRes.status < 200 || dlRes.status >= 300) throw new Error(dlRes.responseText);

        const parsed = JSON.parse(dlRes.responseText);
        importedData = parsed;
        const pairs = processParsedBackup(parsed);
        displayKeyList(pairs);
        if (applyButton) applyButton.style.display = 'block';
        currentWindow.alert(`${t('dropboxLoadSuccessPrefix')}\n\n${t('fileLabel')} ${selectedFile.name}`);
      } catch (error) {
        currentWindow.alert(`${t('dropboxRestoreFailedPrefix')}\n\n${error.message}`);
      }
    }

    async function backupIndexedDB() {
      const result = [];
      let dbs = [];
      try {
        if (indexedDB.databases) dbs = await indexedDB.databases();
      } catch (e) {}
      for (const info of dbs) {
        if (!info || !info.name) continue;
        const backupForDb = await new Promise((resolve) => {
          const req = indexedDB.open(info.name);
          req.onerror = () => resolve(null);
          req.onsuccess = () => {
            const db = req.result;
            const stores = Array.from(db.objectStoreNames);
            const storePromises = stores.map(storeName => new Promise(res => {
              try {
                const tx = db.transaction([storeName], 'readonly');
                const store = tx.objectStore(storeName);
                const out = { 
                  name: storeName, 
                  keyPath: store.keyPath || null, 
                  autoIncrement: store.autoIncrement || false, 
                  indexes: Array.from(store.indexNames).map(ixN => {
                    const idx = store.index(ixN);
                    return { name: ixN, keyPath: idx.keyPath, unique: !!idx.unique, multiEntry: !!idx.multiEntry };
                  }),
                  entries: [] 
                };
                const cursorReq = store.openCursor();
                cursorReq.onsuccess = (e) => {
                  const cursor = e.target.result;
                  if (cursor) {
                    out.entries.push({ key: cursor.key, value: cursor.value });
                    cursor.continue();
                  } else res(out);
                };
                cursorReq.onerror = () => res(out);
              } catch (err) { res(null); }
            }));
            Promise.all(storePromises).then(storeData => {
              const obj = { name: info.name, version: db.version, stores: storeData.filter(x => x) };
              db.close();
              resolve(obj);
            });
          };
        });
        if (backupForDb) result.push(backupForDb);
      }
      return result;
    }

    async function generateFullBackup() {
      return {
        meta: { exportedAt: new Date().toISOString(), origin: location.origin, scriptVersion },
        localStorage: (() => {
          const out = {};
          try {
            for (let i = 0; i < window.localStorage.length; i++) {
              const k = NativeStorage.key.call(window.localStorage, i);
              if (k != null) out[k] = NativeStorage.getItem.call(window.localStorage, k);
            }
          } catch (e) {
            Object.keys(window.localStorage).forEach(k => { try { out[k] = window.localStorage.getItem(k); } catch (_) {} });
          }
          return out;
        })(),
        sessionStorage: (() => {
          const out = {};
          try {
            for (let i = 0; i < window.sessionStorage.length; i++) {
              const k = NativeStorage.key.call(window.sessionStorage, i);
              if (k != null) out[k] = NativeStorage.getItem.call(window.sessionStorage, k);
            }
          } catch (e) {
            Object.keys(window.sessionStorage).forEach(k => { try { out[k] = window.sessionStorage.getItem(k); } catch (_) {} });
          }
          return out;
        })(),
        cookies: document.cookie.split(';').map(c => {
          const [name, ...rest] = c.trim().split('=');
          return { name, value: rest.join('=') };
        }).filter(c => c.name),
        indexedDB: await backupIndexedDB()
      };
    }

    async function exportLocalStorage() {
      const backup = await generateFullBackup();
      const data = JSON.stringify(backup, null, 2);
      const file = new Blob([data], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      a.download = `wme_settings_backup_${ts}.json`;
      a.click();
    }

    function processParsedBackup(parsed) {
      let keyValuePairs = [];
      const originOk = !(parsed && parsed.meta && parsed.meta.origin) || parsed.meta.origin === location.origin;
      if (parsed && typeof parsed === 'object' && (parsed.localStorage || parsed.sessionStorage || parsed.cookies || parsed.indexedDB)) {
        if (parsed.localStorage) Object.entries(parsed.localStorage).forEach(([k, v]) => keyValuePairs.push([`localStorage:${k}`, v]));
        if (parsed.sessionStorage && originOk) Object.entries(parsed.sessionStorage).forEach(([k, v]) => keyValuePairs.push([`sessionStorage:${k}`, v]));
        if (Array.isArray(parsed.cookies) && originOk) parsed.cookies.forEach(c => { if(c && c.name != null) keyValuePairs.push([`cookie:${c.name}`, c.value || '']); });
        if (Array.isArray(parsed.indexedDB)) {
          parsed.indexedDB.forEach(db => {
            if (!db.name || !Array.isArray(db.stores)) return;
            db.stores.forEach(st => {
              if (!st.name || !Array.isArray(st.entries)) return;
              st.entries.forEach(e => {
                const keyLabel = `indexedDB:${db.name}/${st.name}:${JSON.stringify(e.key)}`;
                keyValuePairs.push([keyLabel, { db: db.name, store: st.name, key: e.key, value: e.value, keyPath: st.keyPath, autoIncrement: !!st.autoIncrement, indexes: st.indexes || [] }]);
              });
            });
          });
        }
      } else {
        keyValuePairs = Object.entries(parsed);
      }
      return keyValuePairs;
    }

    function importLocalStorage() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.onchange = function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const parsed = JSON.parse(reader.result);
            importedData = parsed;
            const pairs = processParsedBackup(parsed);
            displayKeyList(pairs);
            if (applyButton) applyButton.style.display = 'block';
            currentWindow.alert(t('fileReadSuccess'));
          } catch (error) { currentWindow.alert(t('invalidJson')); }
        };
        reader.readAsText(file);
      };
      input.click();
    }

    function displayKeyList(keyValuePairs) {
      const container = document.getElementById('key-list-container');
      container.innerHTML = '';
      const sAll = document.createElement('button'); sAll.textContent = t('selectAll');
      sAll.addEventListener('click', () => container.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = true));
      container.appendChild(sAll);
      const dAll = document.createElement('button'); dAll.textContent = t('deselectAll');
      dAll.addEventListener('click', () => container.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false));
      container.appendChild(dAll);
      container.appendChild(document.createElement('br'));

      keyValuePairs.forEach(([key, value]) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = key; checkbox.value = key; checkbox.checked = true;
        container.appendChild(checkbox);
        const label = document.createElement('label');
        label.htmlFor = key; label.textContent = key;
        container.appendChild(label);
        const hv = document.createElement('input');
        hv.type = 'hidden'; hv.value = typeof value === 'string' ? value : JSON.stringify(value);
        container.appendChild(hv);
        container.appendChild(document.createElement('br'));
      });

      applyButton = document.createElement('button');
      applyButton.textContent = t('apply');
      applyButton.addEventListener('click', applyImport);
      container.appendChild(applyButton);
    }

    async function applyImport() {
      const selectedPairs = [];
      document.querySelectorAll('#key-list-container input[type="checkbox"]').forEach(c => {
        if (c.checked) {
          const vStr = c.nextElementSibling.nextElementSibling.value;
          selectedPairs.push([c.value, c.value.startsWith('indexedDB:') ? JSON.parse(vStr) : vStr]);
        }
      });
      if (selectedPairs.length === 0) { currentWindow.alert(t('noKeysSelected')); return; }
      const { counts, failures } = await applyPairs(selectedPairs);
      const summary = `Import Completed\n- local: ${counts.local}\n- session: ${counts.session}\n- cookie: ${counts.cookie}\n- idb: ${counts.idb}`;
      currentWindow.alert(summary);
      if (currentWindow.confirm('Success. Refresh page?')) {
        try { sessionStorage.setItem(REAPPLY_STASH_KEY, JSON.stringify({ origin: location.origin, items: selectedPairs })); } catch (e) {}
        location.reload();
      }
    }

    async function applyPairs(selectedPairs) {
      const counts = { local: 0, session: 0, cookie: 0, idb: 0 };
      const failures = [];
      const sameOrigin = !importedData || !importedData.meta || !importedData.meta.origin || importedData.meta.origin === location.origin;

      for (const [fullKey, value] of selectedPairs) {
        try {
          const colonIdx = fullKey.indexOf(':');
          const type = colonIdx < 0 ? 'localStorage' : fullKey.slice(0, colonIdx);
          const rest = colonIdx < 0 ? fullKey : fullKey.slice(colonIdx + 1);

          if (type === 'localStorage') {
            try { NativeStorage.setItem.call(window.localStorage, rest, value); } catch (_) { window.localStorage.setItem(rest, value); }
            counts.local++;
          } else if (type === 'sessionStorage') {
            if (sameOrigin) {
              try { NativeStorage.setItem.call(window.sessionStorage, rest, value); } catch (_) { window.sessionStorage.setItem(rest, value); }
              counts.session++;
            }
          } else if (type === 'cookie') {
            if (sameOrigin) {
              document.cookie = `${rest}=${value}; path=/`;
              counts.cookie++;
            }
          } else if (type === 'indexedDB') {
            await writeIndexedDBRecord(value);
            counts.idb++;
          }
        } catch (err) { failures.push(`${fullKey} -> ${err.message}`); }
      }
      return { counts, failures };
    }

    function setupUIElements(container, isWUserscripts = false) {
      const title = document.createElement('p');
      title.style.fontWeight = 'bold';
      title.textContent = t('scriptTitle');
      container.appendChild(title);

      const desc = document.createElement('p');
      desc.textContent = t('importExportDesc');
      container.appendChild(desc);

      const btnRow1 = document.createElement('div');
      btnRow1.style.display = 'flex';
      btnRow1.style.gap = '8px';
      btnRow1.style.marginTop = '8px';

      const expBtn = document.createElement('button');
      expBtn.id = 'esm-export';
      expBtn.textContent = t('exportBackup');
      expBtn.title = t('exportBackupTitle');
      expBtn.style.backgroundImage = 'linear-gradient(180deg, #43a047, #2e7d32)';
      expBtn.style.color = '#fff';
      expBtn.style.border = 'none';
      expBtn.style.borderRadius = '10px';
      expBtn.style.padding = '8px 12px';
      expBtn.style.cursor = 'pointer';
      // ... more styles from update script ...
      expBtn.addEventListener('click', () => exportLocalStorage());

      const impBtn = document.createElement('button');
      impBtn.id = 'esm-import';
      impBtn.textContent = t('importBackup');
      impBtn.title = t('importBackupTitle');
      impBtn.style.backgroundImage = 'linear-gradient(180deg, #2196f3, #1976d2)';
      impBtn.style.color = '#fff';
      impBtn.style.border = 'none';
      impBtn.style.borderRadius = '10px';
      impBtn.style.padding = '8px 12px';
      impBtn.style.cursor = 'pointer';
      impBtn.addEventListener('click', () => importLocalStorage());

      btnRow1.appendChild(expBtn);
      btnRow1.appendChild(impBtn);
      container.appendChild(btnRow1);

      const btnRow2 = document.createElement('div');
      btnRow2.style.display = 'flex';
      btnRow2.style.gap = '8px';
      btnRow2.style.marginTop = '8px';

      const cExpBtn = document.createElement('button');
      cExpBtn.id = 'esm-cloud-backup';
      cExpBtn.textContent = t('cloudBackup');
      cExpBtn.title = t('cloudBackupTitle');
      cExpBtn.style.backgroundImage = 'linear-gradient(180deg, #ff9800, #f57c00)';
      cExpBtn.style.color = '#fff';
      cExpBtn.style.border = 'none';
      cExpBtn.style.borderRadius = '10px';
      cExpBtn.style.padding = '8px 12px';
      cExpBtn.style.cursor = 'pointer';
      cExpBtn.addEventListener('click', () => exportToDropbox());

      const cImpBtn = document.createElement('button');
      cImpBtn.id = 'esm-cloud-restore';
      cImpBtn.textContent = t('cloudRestore');
      cImpBtn.title = t('cloudRestoreTitle');
      cImpBtn.style.backgroundImage = 'linear-gradient(180deg, #9c27b0, #7b1fa2)';
      cImpBtn.style.color = '#fff';
      cImpBtn.style.border = 'none';
      cImpBtn.style.borderRadius = '10px';
      cImpBtn.style.padding = '8px 12px';
      cImpBtn.style.cursor = 'pointer';
      cImpBtn.addEventListener('click', () => importFromDropbox());

      btnRow2.appendChild(cExpBtn);
      btnRow2.appendChild(cImpBtn);
      container.appendChild(btnRow2);

      injectDropboxHelpPanel(container);

      const klc = document.createElement('div');
      klc.id = 'key-list-container';
      klc.style.marginTop = '10px';
      klc.style.border = '1px solid rgba(0,0,0,0.1)';
      klc.style.borderRadius = '8px';
      klc.style.padding = '8px';
      klc.style.maxHeight = '320px';
      klc.style.overflow = 'auto';
      container.appendChild(klc);
    }

    async function addScriptTab() {
      if (currentWindow.uiMounted) return;

      if (typeof currentWindow.getWmeSdk === 'function') {
        try {
          const sdk = currentWindow.getWmeSdk({ scriptId: "easy-storage-manager", scriptName: "Easy Storage Manager" });
          const { tabLabel, tabPane } = await sdk.Sidebar.registerScriptTab();
          tabLabel.innerText = '💾';
          tabLabel.title = t('scriptTitle');
          setupUIElements(tabPane, true);
          currentWindow.uiMounted = true;
          return;
        } catch (e) { ESM_DIAG.error('SDK Tab failed', e); }
      }

      if (typeof W !== 'undefined' && W && W.userscripts && typeof W.userscripts.registerSidebarTab === 'function') {
        try {
          const { tabLabel, tabPane } = W.userscripts.registerSidebarTab('easy-storage-manager-tab');
          tabLabel.innerText = '💾';
          tabLabel.title = t('scriptTitle');
          setupUIElements(tabPane, true);
          currentWindow.uiMounted = true;
          return;
        } catch (e) { ESM_DIAG.error('W.userscripts fallback failed', e); }
      }

      if (typeof WazeWrap !== 'undefined' && WazeWrap.Interface && typeof WazeWrap.Interface.Tab === 'function') {
        const div = document.createElement('div');
        div.id = 'esm-tab';
        setupUIElements(div);
        new WazeWrap.Interface.Tab(t('scriptTitle'), div.outerHTML, () => {
          // Re-bind listeners because outerHTML loses them
          const container = document.getElementById('esm-tab');
          container.querySelector('#esm-export').addEventListener('click', () => exportLocalStorage());
          container.querySelector('#esm-import').addEventListener('click', () => importLocalStorage());
          container.querySelector('#esm-cloud-backup').addEventListener('click', () => exportToDropbox());
          container.querySelector('#esm-cloud-restore').addEventListener('click', () => importFromDropbox());
          injectDropboxHelpPanel(container);
        });
        currentWindow.uiMounted = true;
        return;
      }

      createFallbackPanel();
    }

    function initialize() {
      const isWaze = location.hostname.includes('waze.com');
      if (isWaze) {
        if (typeof currentWindow.SDK_INITIALIZED !== 'undefined') {
          currentWindow.SDK_INITIALIZED.then(addScriptTab);
        } else {
          document.addEventListener('wme-ready', addScriptTab, { once: true });
        }
        document.addEventListener('wme-ready', () => {
          if (typeof WazeWrap !== 'undefined' && WazeWrap.Interface && WazeWrap.Interface.ShowScriptUpdate) {
            WazeWrap.Interface.ShowScriptUpdate('Easy Storage Manager', scriptVersion, updateMessage, 'https://greasyfork.org/en/scripts/466806-easy-storage-manager', 'https://www.waze.com/forum/viewtopic.php?t=382966');
          }
        }, { once: true });
      } else {
        createFallbackPanel();
      }
    }

    initialize();

    function reapplyAfterReload() {
      const stashStr = sessionStorage.getItem(REAPPLY_STASH_KEY);
      if (!stashStr) return;
      sessionStorage.removeItem(REAPPLY_STASH_KEY);
      try {
        const stash = JSON.parse(stashStr);
        if (stash && stash.origin === location.origin && Array.isArray(stash.items)) {
          applyPairs(stash.items).then(() => {
            currentWindow.alert('Restored after reload.');
          });
          // Protection logic same as updated script...
          const desiredLocal = new Map();
          stash.items.forEach(([k, v]) => { if(!k.includes(':')) desiredLocal.set(k, v); else if(k.startsWith('localStorage:')) desiredLocal.set(k.split(':')[1], v); });
          if(desiredLocal.size > 0) {
            const protectUntil = Date.now() + 120000;
            const originalSet = localStorage.setItem.bind(localStorage);
            localStorage.setItem = function(k, v) {
              if (Date.now() < protectUntil && desiredLocal.has(k)) {
                return NativeStorage.setItem.call(window.localStorage, k, desiredLocal.get(k));
              }
              return originalSet(k, v);
            };
          }
        }
      } catch (e) {}
    }

    async function writeIndexedDBRecord(record) {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(record.db);
        req.onsuccess = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(record.store)) {
            db.close();
            const bump = indexedDB.open(record.db, db.version + 1);
            bump.onupgradeneeded = (e) => {
              const db2 = e.target.result;
              const s = db2.createObjectStore(record.store, { keyPath: record.keyPath, autoIncrement: record.autoIncrement });
              if (record.indexes) record.indexes.forEach(ix => s.createIndex(ix.name, ix.keyPath, { unique: ix.unique, multiEntry: ix.multiEntry }));
            };
            bump.onsuccess = () => {
              const db3 = bump.result;
              const tx = db3.transaction([record.store], 'readwrite');
              if (record.keyPath) tx.objectStore(record.store).put(record.value);
              else tx.objectStore(record.store).put(record.value, record.key);
              tx.oncomplete = () => { db3.close(); resolve(); };
            };
          } else {
            const tx = db.transaction([record.store], 'readwrite');
            if (record.keyPath) tx.objectStore(record.store).put(record.value);
            else tx.objectStore(record.store).put(record.value, record.key);
            tx.oncomplete = () => { db.close(); resolve(); };
          }
        };
      });
    }

    function createFallbackPanel() {
      if (document.readyState !== 'complete') {
        window.addEventListener('load', createFallbackPanel, { once: true });
        return;
      }
      if (currentWindow.uiMounted) return;
      const panel = document.createElement('div');
      panel.id = 'esm-fallback-panel';
      panel.style.position = 'fixed'; panel.style.top = '72px'; panel.style.right = '12px';
      panel.style.zIndex = '999999'; panel.style.background = '#1e293b'; panel.style.padding = '12px';
      panel.style.borderRadius = '12px'; panel.style.color = '#fff'; panel.style.maxWidth = '400px';
      setupUIElements(panel);
      document.body.appendChild(panel);
      currentWindow.uiMounted = true;
    }

})();

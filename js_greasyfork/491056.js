// ==UserScript==
// @name         Website Changes Monitor
// @namespace    https://greasyfork.org/en/users/670188-hacker09
// @version      4
// @description  A powerful and flexible monitor that automatically detects changes on any website. Including support for POST requests and even complex pages that require dynamic security tokens (nonces/CSRF) to view content.
// @author       hacker09
// @match        *://*/*
// @icon         https://i.imgur.com/0kx5i9q.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/491056/Website%20Changes%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/491056/Website%20Changes%20Monitor.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const now = Date.now();
  GM_registerMenuCommand('Add/Remove Website', () => { GM_openInTab('https://cyber-sec0.github.io/monitor/', { active: true }); });
  unsafeWindow.gm_storage = { setValue: GM_setValue, getValue: GM_getValue, deleteValue: GM_deleteValue, listValues: GM_listValues };

  const performCheck = (key, dataForRequest, originalData) => {
    GM.xmlHttpRequest({
      method: dataForRequest.body ? 'POST' : 'GET',
      url: key.replace(/Counter\d+/, ''),
      headers: dataForRequest.header || {},
      data: dataForRequest.body || null,
      onload: (response) => {
        if (response.status < 200 || response.status > 299) { return; }

        const { responseText } = response;
        const oldContent = originalData.content || originalData.HTML || '';
        const urlToOpen = originalData.website || key.replace(/Counter\d+/, '');
        let contentForStorage = responseText, triggerAlert = false, diffMsg = 'Content changed';
        const parser = new DOMParser(), doc = parser.parseFromString(responseText, 'text/html');

        // Helper to handle legacy data stored with commas
        const getOldList = (str) => {
          if (!str) return [];
          return str.includes('|||') ? str.split('|||') : str.split(',');
        };

        if (originalData.comparisonMethod === 'new_items' && originalData.selector && originalData.idAttribute) {
          // Method 1: New List Items
          const oldIdSet = new Set(getOldList(oldContent));
          // Get new IDs and Trim whitespace
          const newIds = Array.from(doc.querySelectorAll(originalData.selector))
          .map(el => (originalData.idAttribute.toLowerCase() === 'innertext' ? el.innerText : el.getAttribute(originalData.idAttribute))?.trim())
          .filter(Boolean);

          const newItems = newIds.filter(id => !oldIdSet.has(id));

          if (oldContent && newItems.length > 0) {
            triggerAlert = true;
            diffMsg = newItems.join(', ');
          }
          // Save with new safe delimiter
          contentForStorage = newIds.join('|||');

        } else if (originalData.comparisonMethod === 'order' && originalData.selector && originalData.idAttribute) {
          // Method 2: List Order
          const newIdString = Array.from(doc.querySelectorAll(originalData.selector))
          .map(el => (originalData.idAttribute.toLowerCase() === 'innertext' ? el.innerText : el.getAttribute(originalData.idAttribute))?.trim())
          .filter(Boolean)
          .join('|||'); // Use safe delimiter

          // Compare against old content (normalizing old content to new delimiter format if needed)
          const normalizedOld = getOldList(oldContent).join('|||');

          if (oldContent && normalizedOld !== newIdString) {
            triggerAlert = true;
            diffMsg = 'Order changed';
          }
          contentForStorage = newIdString;

        } else {
          // Method 3: Text Content
          if (originalData.selector) {
            if (doc.querySelector(originalData.selector)) { contentForStorage = doc.querySelector(originalData.selector).innerHTML; }
          }
          const sanitize = (html) => { if (!html) return ''; const t = document.createElement('div'); t.innerHTML = html; return (t.textContent || t.innerText || "").replace(/\s+/g, ' ').trim();};
          const cleanOld = sanitize(oldContent);
          const cleanNew = sanitize(contentForStorage);

          if (oldContent && cleanOld !== cleanNew) {
            triggerAlert = true;
            // Try to isolate the new part by removing the old part from the string
            if (cleanNew.includes(cleanOld)) {
              diffMsg = cleanNew.replace(cleanOld, '').trim();
            } else if (cleanOld.includes(cleanNew)) {
              diffMsg = "Content removed/truncated";
            } else {
              diffMsg = "Content changed completely";
            }
          }
        }

        if (triggerAlert) {
          if (originalData.notification) {
            const isCopyMode = originalData.notificationType === 'copy';
            const displayText = isCopyMode ? "Click to copy changes to clipboard" : diffMsg;

            GM_notification({
              text: displayText,
              title: `${originalData.name} Updated`,
              onclick: () => {
                if (isCopyMode) {
                  GM_setClipboard(diffMsg);
                }
              }
            });
          }
          if (Date.now() - GM_getValue(`lock_open_${urlToOpen}`, 0) > 15000) {
            GM_setValue(`lock_open_${urlToOpen}`, Date.now());
            GM_openInTab(urlToOpen, { active: false, insert: false });
          }
        }
        GM_setValue(key, { ...originalData, content: contentForStorage, lastChecked: now });
      },
    });
  };

  GM_listValues().forEach(key => {
    if (/^check_interval_ms$|^lock_/.test(key)) { return; }
    const storedData = GM_getValue(key, {});
    if (!storedData || storedData.isPaused) { return; }
    if (now - (storedData.lastChecked || 0) < GM_getValue('check_interval_ms', 60000)) { return; }
    GM_setValue(key, { ...storedData, lastChecked: now });

    if (storedData.tokenEnabled && storedData.tokenUrl && storedData.tokenSelector && storedData.tokenPlaceholder) {
      GM.xmlHttpRequest({
        method: 'GET', url: storedData.tokenUrl,
        onload: (response) => {
          if (response.status < 200 || response.status > 299) { return; }
          const { responseText } = response, parser = new DOMParser(), doc = parser.parseFromString(responseText, 'text/html'), elements = doc.querySelectorAll(storedData.tokenSelector);
          let nonce = null;
          for (const element of elements) {
            if (storedData.tokenRegEx) { const match = element.textContent.match(new RegExp(storedData.tokenRegEx)); if (match && match[1]) { nonce = match[1]; break; } }
            else { nonce = storedData.tokenAttribute ? element.getAttribute(storedData.tokenAttribute) : element.textContent.trim(); if(nonce) break; }
          }
          if (nonce) {
            const dataWithToken = JSON.parse(JSON.stringify(storedData));
            const placeholder = new RegExp(storedData.tokenPlaceholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
            if (dataWithToken.body) { dataWithToken.body = dataWithToken.body.replace(placeholder, nonce); }
            if (dataWithToken.header) { for (const hKey in dataWithToken.header) { if (typeof dataWithToken.header[hKey] === 'string') { dataWithToken.header[hKey] = dataWithToken.header[hKey].replace(placeholder, nonce); } } }
            performCheck(key, dataWithToken, storedData);
          }
        },
      });
    } else {
      performCheck(key, storedData, storedData);
    }
  });
})();
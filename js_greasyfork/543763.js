// ==UserScript==
// @name         M365 Copilot Exporter
// @namespace    ganyuke
// @version      1.1.0
// @author       ganyuke
// @description  An exporter for the Copilot Chat integrated into the M365 dashboard.
// @license      MIT
// @icon         https://upload.wikimedia.org/wikipedia/commons/0/0e/Microsoft_365_%282022%29.svg
// @source       https://github.com/ganyuke/copilot-exporter.git
// @match        https://m365.cloud.microsoft/
// @match        https://m365.cloud.microsoft/chat/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543763/M365%20Copilot%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/543763/M365%20Copilot%20Exporter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  async function hookIntoSidebar(callback) {
    const sidebarRoot = await waitForElement('[data-testid="appbar-v2"]');
    if (!sidebarRoot) {
      const log = `${APP_TAG} Could not hook into sidebar root!`;
      console.error(log);
      throw new Error(log);
    }
    const observer = new MutationObserver(() => {
      const allConversationsBtn = document.getElementById("all-history");
      if (allConversationsBtn && allConversationsBtn.dataset.hooked !== "1") {
        allConversationsBtn.dataset.hooked = "1";
        createExportButton(allConversationsBtn, callback);
      }
    });
    observer.observe(sidebarRoot, {
      childList: true,
      subtree: true
    });
  }
  function waitForElement(selector, timeout = 1e4) {
    return new Promise((resolve, reject) => {
      const found = document.querySelector(selector);
      if (found) return resolve(found);
      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element not found for selector ${selector}`));
      }, timeout);
    });
  }
  function createExportButton(baseBtn, callback) {
    const exportBtn = baseBtn.cloneNode(true);
    exportBtn.id = "export-conversations";
    exportBtn.setAttribute("aria-label", "Export conversations");
    exportBtn.value = "export-conversations";
    const span = exportBtn.querySelector("span");
    if (span) {
      span.textContent = "Export conversations";
      span.setAttribute("aria-label", "Export conversations");
    }
    exportBtn.addEventListener("click", () => {
      callback();
    });
    baseBtn.parentElement?.append(exportBtn);
  }
  function injectExportButton(callback) {
    hookIntoSidebar(callback);
  }
  async function fetchCopilotChats(token, userOid, tenantId, maxChats, variants = "feature.EnableLastMessageForGetChats,feature.EnableMRUAgents,feature.EnableHasLoopPages") {
    const requestObj = {
      source: "officeweb",
      traceId: crypto.randomUUID(),
      // uuid with spaces
      threadType: "webchat",
      MaxReturnedChatsCount: maxChats
    };
    const encodedRequest = encodeURIComponent(JSON.stringify(requestObj));
    const encodedVariants = encodeURIComponent(variants);
    const url = `https://substrate.office.com/m365Copilot/GetChats?request=${encodedRequest}&variants=${encodedVariants}`;
    const headers = {
      "authorization": `Bearer ${token}`,
      "content-type": "application/json",
      "x-anchormailbox": `Oid:${userOid}@${tenantId}`,
      "x-clientrequestid": crypto.randomUUID().replace(/-/g, ""),
      // uuid *without* spaces
      "x-routingparameter-sessionkey": userOid,
      "x-scenario": "OfficeWebIncludedCopilot",
      "x-variants": variants
    };
    const res = await fetch(url, {
      method: "GET",
      headers
    });
    if (!res.ok) {
      console.debug(res);
      console.debug(res.body);
      throw new Error(`Fetch failed with status ${res.status}`);
    }
    const data = await res.json();
    return data;
  }
  async function fetchCopilotConversation(token, userOid, tenantId, conversationId) {
    const requestObj = {
      conversationId,
      source: "officeweb",
      traceId: crypto.randomUUID().replace(/-/g, "")
      // uuid *without* spaces (for some reason??)
    };
    const encodedRequest = encodeURIComponent(JSON.stringify(requestObj));
    const url = `https://substrate.office.com/m365Copilot/GetConversation?request=${encodedRequest}`;
    const headers = {
      "authorization": `Bearer ${token}`,
      "content-type": "application/json",
      "x-anchormailbox": `Oid:${userOid}@${tenantId}`,
      "x-clientrequestid": crypto.randomUUID().replace(/-/g, ""),
      // also UUID w/o spaces
      "x-routingparameter-sessionkey": userOid,
      "x-scenario": "OfficeWebIncludedCopilot"
    };
    const response = await fetch(url, {
      method: "GET",
      headers
    });
    if (!response.ok) {
      console.debug(response);
      console.debug(response.body);
      throw new Error(`Fetch failed with status ${response.status}`);
    }
    return await response.blob();
  }
  async function deleteCopilotConversation(token, userOid, tenantId, conversationIds) {
    const requestObj = {
      conversationIdsToDelete: conversationIds,
      source: "officeweb",
      traceId: crypto.randomUUID()
      // honestly don't really know the pattern whith these uuids...
    };
    const encodedRequest = JSON.stringify(requestObj);
    const url = `https://substrate.office.com/m365Copilot/DeleteConversation`;
    const headers = {
      "authorization": `Bearer ${token}`,
      "content-type": "application/json",
      "x-anchormailbox": `Oid:${userOid}@${tenantId}`,
      "x-clientrequestid": crypto.randomUUID(),
      "x-routingparameter-sessionkey": userOid,
      "x-scenario": "OfficeWebIncludedCopilot"
    };
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: encodedRequest
    });
    if (!response.ok) {
      console.debug(response);
      console.debug(response.body);
      throw new Error(`Fetch failed with status ${response.status}`);
    }
    return;
  }
  function downloadBlobAsFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  const getCookie = (key) => document.cookie.match(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`)?.pop() || "";
  const ENCRYPTION_KEY = "msal.cache.encryption";
  const AES_GCM = "AES-GCM";
  const HKDF = "HKDF";
  const S256_HASH_ALG = "SHA-256";
  const RAW = "raw";
  const ENCRYPT = "encrypt";
  const DECRYPT = "decrypt";
  const DERIVE_KEY = "deriveKey";
  function base64DecToArr(base64String) {
    let encodedString = base64String.replace(/-/g, "+").replace(/_/g, "/");
    switch (encodedString.length % 4) {
      case 0:
        break;
      case 2:
        encodedString += "==";
        break;
      case 3:
        encodedString += "=";
        break;
      default:
        throw Error("error extracting base64");
    }
    const binString = atob(encodedString);
    return Uint8Array.from(binString, (m) => m.codePointAt(0) || 0);
  }
  async function deriveKey(baseKey, nonce, context) {
    return window.crypto.subtle.deriveKey(
      {
        name: HKDF,
        salt: nonce,
        hash: S256_HASH_ALG,
        info: new TextEncoder().encode(context)
      },
      baseKey,
      { name: AES_GCM, length: 256 },
      false,
      [ENCRYPT, DECRYPT]
    );
  }
  async function decrypt(baseKey, nonce, context, encryptedData) {
    const encodedData = base64DecToArr(encryptedData);
    const derivedKey = await deriveKey(baseKey, base64DecToArr(nonce), context);
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: AES_GCM,
        iv: new Uint8Array(12)
        // New key is derived for every encrypt so we don't need a new nonce
      },
      derivedKey,
      encodedData
    );
    return new TextDecoder().decode(decryptedData);
  }
  function generateHKDF(baseKey) {
    return window.crypto.subtle.importKey(RAW, baseKey, HKDF, false, [
      DERIVE_KEY
    ]);
  }
  async function getEncryptionCookie() {
    const cookieString = decodeURIComponent(getCookie(ENCRYPTION_KEY));
    let parsedCookie = { key: "", id: "" };
    if (cookieString) {
      try {
        parsedCookie = JSON.parse(cookieString);
      } catch (e) {
        throw Error("failed to parse encryption cookie");
      }
    }
    if (parsedCookie.key && parsedCookie.id) {
      const baseKey = base64DecToArr(parsedCookie.key);
      return {
        id: parsedCookie.id,
        key: await generateHKDF(baseKey)
      };
    } else {
      throw Error("no encryption cookie found");
    }
  }
  const getMsalIds = () => {
    const clientId = "c0ab8ce9-e9a0-42e7-b064-33d422df41f1";
    const identityBlock = document.getElementById("identity");
    if (!identityBlock || !identityBlock.textContent) {
      throw new Error("missing user identity block");
    }
    const {
      objectId: localAccountId,
      tenantId
    } = JSON.parse(identityBlock.textContent);
    return {
      localAccountId,
      tenantId,
      homeAccountId: `${localAccountId}.${tenantId}`,
      clientId
    };
  };
  const getAccessToken = async (msalIds) => {
    const encryptionCookie = await getEncryptionCookie();
    const { homeAccountId, tenantId, clientId } = msalIds;
    const SCOPES = [
      "https://substrate.office.com/sydney/.default"
    ];
    const ACCESS_TOKEN_LS = `${homeAccountId}-login.windows.net-accesstoken-${clientId}-${tenantId}-${SCOPES.join(" ")}--`;
    const lskv = localStorage.getItem(ACCESS_TOKEN_LS);
    if (!lskv) {
      throw Error("missing access token localstorage");
    }
    const payload = JSON.parse(lskv);
    const decryptedData = await decrypt(
      encryptionCookie.key,
      payload.nonce,
      clientId,
      // context is usually client ID according to MSAL v4 source code: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/afeaeddc777577b1b16f0084f5e5f9e4c15ee5e9/lib/msal-browser/src/cache/LocalStorage.ts#L302
      payload.data
    );
    const parsedDecryptedData = JSON.parse(decryptedData);
    return parsedDecryptedData.secret;
  };
  const FETCH_DELAY = 1500;
  async function getTokenAndIds() {
    console.log(`${APP_TAG} Getting MSAL ids...`);
    const msalIds = getMsalIds();
    console.log(`${APP_TAG} Getting access token...`);
    const accessToken = await getAccessToken(msalIds);
    return {
      token: accessToken,
      ...msalIds
    };
  }
  async function exportBulkDirect(conversationIds, callback) {
    const { token, localAccountId, tenantId } = await getTokenAndIds();
    for (let i = 0; i < conversationIds.length; i++) {
      const conversationId = conversationIds[i];
      const blob = await fetchCopilotConversation(token, localAccountId, tenantId, conversationId);
      console.log(`${APP_TAG} Completed download for conversation ${conversationId}`);
      callback(i);
      downloadBlobAsFile(blob, `m365-copilot-${conversationId}.json`);
      await new Promise((resolve) => setTimeout(resolve, FETCH_DELAY));
    }
  }
  async function deleteBulk(conversationIds, callback) {
    const { token, localAccountId, tenantId } = await getTokenAndIds();
    await deleteCopilotConversation(token, localAccountId, tenantId, conversationIds);
    callback(conversationIds.length - 1);
    console.log(`${APP_TAG} Completed deletion for conversations ${conversationIds.join()}`);
  }
  function showExportModal() {
    if (document.getElementById("copilotExportOverlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "copilotExportOverlay";
    overlay.style.cssText = `
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
  `;
    overlay.addEventListener("click", () => {
      overlay.remove();
    });
    const modal = document.createElement("div");
    modal.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    modal.style.cssText = `
    background: white; padding: 20px; border-radius: 8px;
    min-width: 400px; max-width: 90%;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    font-family: sans-serif;
  `;
    modal.innerHTML = `
    <h2 style="margin-top:0;">Export conversations</h2>
    <p style="margin-bottom: 1em;">Export from API</p>

    <div style="display:flex;column-gap:0.5em;">
      <label style="flex-grow:1;" for="conversation-fetch-list-max">Max conversations to fetch</label>
      <input type="number" id="conversation-fetch-list-max" name="quantity" min="0">
      <button id="conversation-refetch">Refetch</button>
    </div>

    <div style="margin: 1em 0; border: 1px solid #ccc; padding: 0.5em; max-height: 200px; overflow-y: auto;">
      <label><input type="checkbox" id="selectAllCheckbox"> Select All</label>
      <div id="chatList" style="margin-top: 0.5em; color: #666">Loading…</div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center;">
      <select>
        <option>JSON</option>
      </select>
      <div>
        <button id="delete-conversations-button">Delete</button>
        <button id="export-conversations-button">Export</button>
      </div>
    </div>
  `;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    function createProgressBar(idsToExport, initalString) {
      if (idsToExport.length < 1) {
        return;
      }
      const existingProgressBarContainer = document.querySelector("#chat-export-progress-bar-container");
      if (existingProgressBarContainer) {
        return;
      }
      const progressBarContainer = document.createElement("div");
      progressBarContainer.id = "chat-export-progress-bar-container";
      progressBarContainer.style = "display: flex;flex-direction: column;margin-top: 0.5em;";
      const progressBar = document.createElement("progress");
      const label = document.createElement("label");
      label.style = "display:flex;";
      const titleSpan = document.createElement("span");
      const progressTextSpan = document.createElement("span");
      titleSpan.style = "flex-grow:1;";
      progressBar.id = "chat-export-progress-bar";
      progressBar.max = idsToExport.length;
      progressBar.value = 0;
      label.htmlFor = "chat-export-progress-bar";
      titleSpan.textContent = initalString;
      progressTextSpan.textContent = `0/${idsToExport.length}`;
      label.append(titleSpan, progressTextSpan);
      progressBarContainer.append(label, progressBar);
      modal.append(progressBarContainer);
      const progressUpdater = (progress) => {
        titleSpan.textContent = idsToExport[progress].title;
        progressTextSpan.textContent = `${progress + 1}/${idsToExport.length}`;
        progressBar.value = progress + 1;
        if (progressBar.value === progressBar.max) {
          setTimeout(() => {
            progressBarContainer.remove();
          }, 3e3);
        }
      };
      return progressUpdater;
    }
    async function fetchChats() {
      const inputNumber = document.getElementById("conversation-fetch-list-max");
      const n = inputNumber.valueAsNumber;
      const maxChats = isNaN(n) ? 15 : n;
      console.log(`${APP_TAG} Getting MSAL ids...`);
      const msalIds = getMsalIds();
      console.log(`${APP_TAG} Getting access token...`);
      const accessToken = await getAccessToken(msalIds);
      const copilotChatList = await fetchCopilotChats(accessToken, msalIds.localAccountId, msalIds.tenantId, maxChats);
      const chatList = document.getElementById("chatList");
      chatList.innerText = "";
      copilotChatList.chats.forEach((data) => {
        const label = document.createElement("label");
        label.style = "column-gap:0.5em;display:flex;";
        const checkbox = document.createElement("input");
        const span = document.createElement("span");
        checkbox.type = "checkbox";
        checkbox.dataset["id"] = data.conversationId;
        checkbox.dataset["title"] = data.chatName;
        span.innerText = data.chatName;
        label.append(checkbox);
        label.append(span);
        chatList.appendChild(label);
      });
      const selectAll = document.getElementById("selectAllCheckbox");
      selectAll.addEventListener("change", () => {
        const checkboxes = document.querySelectorAll('#chatList input[type="checkbox"]');
        checkboxes.forEach((cb) => {
          cb.checked = selectAll.checked;
        });
      });
    }
    function getSelectedChats() {
      const checkboxes = document.querySelectorAll('#chatList input[type="checkbox"]:checked');
      const listToExport = [];
      checkboxes.forEach((c) => {
        const uuid = c.dataset["id"];
        const title = c.dataset["title"];
        listToExport.push({
          id: uuid,
          title
        });
      });
      return listToExport;
    }
    function exportChats() {
      const idsToExport = getSelectedChats();
      const progressUpdater = createProgressBar(idsToExport, "Exporting...");
      if (!progressUpdater) {
        return;
      }
      exportBulkDirect(idsToExport.map((obj) => obj.id), progressUpdater);
    }
    function deleteChats() {
      const idsToDelete = getSelectedChats();
      const progressUpdater = createProgressBar(idsToDelete, "Deleting...");
      if (!progressUpdater) {
        return;
      }
      deleteBulk(idsToDelete.map((obj) => obj.id), progressUpdater);
    }
    const exportBtn = document.getElementById("export-conversations-button");
    exportBtn.addEventListener("click", exportChats);
    const deleteBtn = document.getElementById("delete-conversations-button");
    deleteBtn.addEventListener("click", deleteChats);
    const refetchButton = document.getElementById("conversation-refetch");
    refetchButton.addEventListener("click", fetchChats);
    fetchChats();
  }
  const APP_TAG = "[Copilot Exporter]";
  console.log(`${APP_TAG} Userscript initalized.`);
  const inject = () => injectExportButton(
    () => {
      console.log(`${APP_TAG} Export button clicked.`);
      showExportModal();
    }
  );
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }

})();
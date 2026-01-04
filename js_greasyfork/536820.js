// ==UserScript==
// @name                Gist Shared Clipboard
// @name:ja             Gist 共有クリップボード
// @name:zh-CN          Gist 共享剪贴板
// @name:zh-TW          Gist 共享剪貼簿
// @license             MIT
// @namespace           http://tampermonkey.net/
// @version             2025.08.13
// @description         Share selected text to Gist and paste it to clipboard
// @description:ja      Gistに選択したテキストを共有し、クリップボードに貼り付ける
// @description:zh-CN   共享选定文本到Gist并粘贴到剪贴板
// @description:zh-TW   共享選定文本到Gist並粘貼到剪貼簿
// @author              Julia Lee
// @match               *://*/*
// @noframes
// @icon                https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant               GM_registerMenuCommand
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_deleteValue
// @grant               GM_setClipboard
// @grant               GM_notification
// @grant               GM_xmlhttpRequest
// @grant               GM.xmlHttpRequest
// @connect             github.com
// @connect             api.github.com
// @downloadURL https://update.greasyfork.org/scripts/536820/Gist%20Shared%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/536820/Gist%20Shared%20Clipboard.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const GITHUB_TOKEN = await GM.getValue('GITHUB_TOKEN', ''); // GitHubのPersonal Access Tokenを指定
  const GIST_ID = await GM.getValue('GIST_ID', ''); // GistのIDを指定
  const GIST_ENCRYPT_KEY = await GM.getValue('GIST_ENCRYPT_KEY', ''); // Gistの暗号化キーを指定
  const FILENAME = 'GM-Shared-Clipboard.txt'; // Gist内のファイル名
  const RIGHT_CLICK_MAX_AGE = 20 * 1000; // 右クリックしてからTargetの保持時間（ミリ秒）

  await GM.deleteValue('GIST_DOWNLOADING');
  await GM.deleteValue('GIST_UPLOADING');

  let crtRightTgtContent = null;
  let crtRightTgtUpdated = 0;

  if (GITHUB_TOKEN && GIST_ID && GIST_ENCRYPT_KEY) {
    const menu1 = GM_registerMenuCommand("Gist Share Clipboard", gistUploadClipboard, {
      accessKey: 'b',
      autoClose: true,
      title: 'Share Clipboard text to Gist',
    });

    const menu2 = GM_registerMenuCommand("Gist Share Selected", gistUploadSelected, {
      accessKey: 'c',
      autoClose: true,
      title: 'Share selected text to Gist',
    });

    const menu3 = GM_registerMenuCommand("Gist Paste", gistDowload, {
      accessKey: 'v',
      autoClose: true,
      title: 'Paste Gist content to clipboard',
    });

    if (location.href.includes(GIST_ID)) {
      const menu4 = GM_registerMenuCommand("Decrypt Selected Text", decryptSelectedText, {
        accessKey: 'd',
        autoClose: true,
        title: 'Decrypt selected text and update clipboard',
      });
    }
  }

  const menu0 = GM_registerMenuCommand("Gist Setup", setup, {
    accessKey: 'x',
    autoClose: true,
    title: 'Setup Gist ID and Token',
  });

  document.body.addEventListener("mousedown", event => {
    if (event.button == 0) { // left click for mouse
      // crtRightTgtContent = null;
    } else if (event.button == 1) { // wheel click for mouse
      // crtRightTgtContent = null;
    } else if (event.button == 2) { // right click for mouse
      const elm = event.target;
      const nodName = elm.nodeName.toLowerCase();

      switch (nodName) {
        case 'img':
          crtRightTgtContent = elm.src;
          break;
        case 'a':
          crtRightTgtContent = elm.href;
          break;
        default:
          crtRightTgtContent = null;
          break;
      }

      if (crtRightTgtContent) {
        crtRightTgtUpdated = new Date();
      }
    }
  });

  const gistUrl = `https://api.github.com/gists/${GIST_ID}`;
  const headers = {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
  };

  async function gistUploadClipboard(_event) {
    let clipboardText;
    try {
      clipboardText = await navigator.clipboard.readText();
      console.log("Clipboard Text: ", clipboardText);
    } catch (e) {
      const errorMsg = 'Please execute "Share Clipboard" by right-clicking.';
      await showMessage(`❌ ${errorMsg}`, 'NG', 3500);
    }

    if (!clipboardText) { return }
    await gistUploadContents(clipboardText || crtRightTgtContent);
  }

  async function gistUploadSelected(_event) {
    // If the target is too old, reset it
    if (crtRightTgtContent && (new Date()) - crtRightTgtUpdated > RIGHT_CLICK_MAX_AGE) {
      crtRightTgtContent = null;
      // crtRightTgtUpdated = 0;
    }

    const selectedText = document.getSelection().toString();
    if (!crtRightTgtContent && !selectedText) { return }

    await gistUploadContents(selectedText || crtRightTgtContent);
  }

  const ENCRYPT_KEY = await GM.getValue('GIST_ENCRYPT_KEY', '');

  async function gistUploadContents(contents) {
    if (!contents || contents.length === 0) {
      await showMessage('❌ No content to upload!', 'NG', 2500);
      return;
    }

    if (!ENCRYPT_KEY) {
      await showMessage('❌ No encryption key set!', 'NG', 2500);
      return;
    }

    const locked = await GM.getValue('GIST_UPLOADING');
    if (locked) {
      console.log("Gist is already uploading.");
      return;
    }

    // --- ここで暗号化 ---
    const encrypted = await encryptContentAES(contents, ENCRYPT_KEY);
    const data = {
      files: {
        [FILENAME]: { content: JSON.stringify(encrypted) }
      }
    };

    try {
      await GM.setValue('GIST_UPLOADING', true);
      const res = await GM.xmlHttpRequest({
        method: 'POST',
        url: gistUrl,
        headers,
        data: JSON.stringify(data),
        responseType: 'json'
      }).catch(e => { throw e; });

      if (!res || res.status < 200 || res.status >= 300) {
        const errStr = res?.response || res?.statusText || 'Unknown error';
        console.error("Failed to update Gist: ", res);
        throw new Error(`Failed to update Gist: ${errStr}`);
      }

      const result = res.response;
      console.log("Gist URL: ", result.html_url);
      await showMessage('✅ Target Shared!', 'OK', 2500);
    } catch (error) {
      console.error("Error: ", error);
      await showMessage(`❌ ${error.message}`, 'NG', 2500);
    } finally {
      await GM.deleteValue('GIST_UPLOADING');
    }

  }

  async function gistDowload(_event) {
    if (inIframe()) {
      console.log("Gist Paste is not available in iframe.");
      return;
    }

    const locked = await GM.getValue('GIST_DOWNLOADING');
    if (locked) {
      console.log("Gist is already Downloading.");
      return;
    }

    try {
      await GM.setValue('GIST_DOWNLOADING', true);
      const res = await GM.xmlHttpRequest({
        method: 'GET',
        url: gistUrl,
        headers,
        responseType: 'json'
      }).catch(e => { throw e; });

      if (!res || res.status < 200 || res.status >= 300) {
        const errStr = res?.response || res?.statusText || 'Unknown error';
        console.error("Failed to fetch Gist: ", res);
        throw new Error(`Failed to fetch Gist: ${errStr}`);
      }

      const result = res.response;
      const encryptedContent = result.files[FILENAME].content;

      if (!encryptedContent) {
        throw new Error('No content found in the Gist.');
      }

      if (!ENCRYPT_KEY) {
        throw new Error('No encryption key set!');
      }

      // --- 復号 ---
      let decrypted;
      try {
        decrypted = await decryptContentAES(JSON.parse(encryptedContent), ENCRYPT_KEY);
      } catch (e) {
        throw new Error('Failed to decrypt content!');
      }

      await GM.setClipboard(decrypted, "text");
      console.log("Gist Content: ", decrypted);
      await showMessage('✅ Clipboard Updated!', 'OK', 2500);

    } catch (error) {
      console.error("Error: ", error);
      await showMessage(`❌ ${error.message}`, 'NG', 2500);
    } finally {
      await GM.deleteValue('GIST_DOWNLOADING');
    }
  }

  async function setup() {
    if (inIframe()) {
      console.log("Gist Setup is not available in iframe.");
      return;
    }

    const registerDialog = await createRegisterDialog();
    const gistIdInput = document.getElementById('gist-id-input');
    const gistTokenInput = document.getElementById('gist-token-input');
    const gistEncryptKeyInput = document.getElementById('gist-encrypt-key-input');
    const gistIdHelpLabel = document.querySelector('#gist-id-help span');
    const gistIdHelpLink = document.querySelector('#gist-id-help a');
    if (GIST_ID) {
      const gistUrl = `https://gist.github.com/${GIST_ID}/revisions`;
      gistIdHelpLabel.textContent = 'Gist Revisions URL: ';
      gistIdHelpLink.textContent = gistUrl.substring(0, 32) + '...';
      gistIdHelpLink.href = gistUrl;
    }

    const saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', async () => {
      const gistId = gistIdInput.value;
      const token = gistTokenInput.value;
      const encryptKey = gistEncryptKeyInput.value;

      if (!gistId || !token || !encryptKey) {
        await showMessage('❌ Gist ID, Token, and Encryption Key are required!', 'NG', 2500);
        return;
      }

      await GM.setValue('GIST_ID', gistId);
      await GM.setValue('GITHUB_TOKEN', token);
      await GM.setValue('GIST_ENCRYPT_KEY', encryptKey);
      registerDialog.close();
      registerDialog.remove();

      setTimeout(() => { location.reload() }, 2500); // Restart Script

      await showMessage('✅ Gist ID, Token, and Encryption Key saved!', 'OK', 2500);

    });

    const clearInfoButton = document.getElementById('clear-button');
    clearInfoButton.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to clear Gist ID, Token, and Encryption Key?')) {
        return;
      }
      await GM.deleteValue('GITHUB_TOKEN');
      await GM.deleteValue('GIST_ID');
      await GM.deleteValue('GIST_ENCRYPT_KEY');
      registerDialog.close();
      registerDialog.remove();

      setTimeout(() => { location.reload() }, 2500); // Restart Script

      await showMessage('✅ Gist ID, Token, and Encryption Key cleared!', 'OK', 2500);
    });

    const generateKeyButton = document.getElementById('generate-key-button');
    generateKeyButton.addEventListener('click', () => {
      if (gistEncryptKeyInput.value) {
        let confirmMessage = 'Are you sure you want to generate a new encryption key?\n'
        confirmMessage += 'This will overwrite the existing key.';
        if (!confirm(confirmMessage)) { return }
      }
      const keyBytes = crypto.getRandomValues(new Uint8Array(16)); // 128bit = 16byte
      const keyBase64 = btoa(String.fromCharCode(...keyBytes));
      gistEncryptKeyInput.value = keyBase64;
    });

    registerDialog.showModal();
  }

  async function decryptSelectedText() {
    const selectedText = document.getSelection().toString();
    if (!selectedText) {
      await showMessage('❌ No selected text to decrypt!', 'NG', 2500);
      return;
    }

    if (!ENCRYPT_KEY) {
      await showMessage('❌ No encryption key set!', 'NG', 2500);
      return;
    }

    try {
      const decrypted = await decryptContentAES(JSON.parse(selectedText), ENCRYPT_KEY);
      await GM.setClipboard(decrypted, "text");
      console.log("Decrypted Content: ", decrypted);
      await showMessage('✅ Clipboard Updated with Decrypted Text!', 'OK', 2500);
    } catch (error) {
      console.error("Error: ", error);
      await showMessage(`❌ ${error.message}`, 'NG', 2500);
    }
  }

})();

async function showMessage(text, type = 'OK', duration = 4000) {
  const htmlId = `GistShare_Message-${type}`;
  const existingMessage = document.getElementById(htmlId);
  if (existingMessage) { return; } // 既に表示されている場合は何もしない

  if (duration < 1000) { duration = 1000; } // 最低1秒は表示する

  return new Promise((resolve) => {
    const message = document.createElement('div');
    message.id = `GistShare_Message-${type}`;
    message.textContent = text;

    // 共通スタイル
    Object.assign(message.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: 'auto',
      padding: '12px 18px',
      borderRadius: '10px',
      color: '#fff',
      fontSize: '14px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      zIndex: 9999,
      transform: 'translateY(20px)',
      opacity: '0',
      transition: 'opacity 0.4s ease, transform 0.4s ease'
    });

    // タイプ別デザイン
    if (type === 'OK') {
      message.style.backgroundColor = '#4caf50'; // 緑
      message.style.borderLeft = '6px solid #2e7d32';
    } else if (type === 'NG') {
      message.style.backgroundColor = '#f44336'; // 赤
      message.style.borderLeft = '6px solid #b71c1c';
    }

    document.body.appendChild(message);

    // フェードイン（下から）
    setTimeout(() => {
      message.style.opacity = '.95';
      message.style.transform = 'translateY(0)';
    }, 10);
    // requestAnimationFrame(() => {
    //   message.style.opacity = '1';
    //   message.style.transform = 'translateY(0)';
    // });

    // 指定時間後にフェードアウト
    setTimeout(() => {
      message.style.opacity = '0';
      message.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        message.remove();
        resolve(); // メッセージが削除された後にresolveを呼び出す
      }, 400); // transition と一致
    }, duration - 400);
  });
}

async function createRegisterDialog() {
  const existDialog = document.getElementById('tm-gist-dialog');
  if (existDialog) existDialog.remove();

  const registerDialog = document.createElement('dialog');
  registerDialog.id = 'tm-gist-dialog';
  registerDialog.style.padding = '1em';
  registerDialog.style.zIndex = 9999;
  registerDialog.style.maxWidth = '400px';
  registerDialog.style.margin = 'auto';
  registerDialog.style.border = '2px solid #ccc';
  registerDialog.style.borderRadius = '8px';
  registerDialog.style.backgroundColor = '#fff';
  registerDialog.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  registerDialog.style.position = 'fixed';
  registerDialog.style.padding = '1.5em';
  registerDialog.style.boxSizing = 'border-box';

  // --- Gist ID ラベルと入力欄 ---
  const gistIdLabel = document.createElement('label');
  gistIdLabel.textContent = 'Gist ID:';
  gistIdLabel.style.display = 'block';
  gistIdLabel.style.marginBottom = '0.5em';
  gistIdLabel.for = 'gist-id-input';
  registerDialog.appendChild(gistIdLabel);

  const gistIdInput = document.createElement('input');
  gistIdInput.id = 'gist-id-input';
  gistIdInput.type = 'text';
  gistIdInput.style.width = '100%';
  gistIdInput.style.boxSizing = 'border-box';
  gistIdInput.style.padding = '0.5em';
  gistIdInput.style.border = '1px solid #ccc';
  gistIdInput.style.borderRadius = '4px';
  gistIdInput.style.marginBottom = '1em';
  gistIdInput.value = await GM.getValue('GIST_ID', '');
  gistIdInput.placeholder = 'Your Gist ID';
  registerDialog.appendChild(gistIdInput);

  const gistIdHelpText = document.createElement('small');
  gistIdHelpText.id = 'gist-id-help';
  gistIdHelpText.style.display = 'block';
  gistIdHelpText.style.marginBottom = '1.1em';
  gistIdHelpText.style.color = '#666';
  const gistIdHelpLabel = document.createElement('span');
  gistIdHelpLabel.textContent = 'Create or Select a Gist: ';
  const gistIdHelpLink = document.createElement('a');
  gistIdHelpLink.href = 'https://gist.github.com/mine';
  gistIdHelpLink.target = '_blank';
  gistIdHelpLink.textContent = 'https://gist.github.com/';
  gistIdHelpText.appendChild(gistIdHelpLabel);
  gistIdHelpText.appendChild(gistIdHelpLink);
  registerDialog.appendChild(gistIdHelpText);

  // --- Gist Token ラベルと入力欄 ---
  const gistTokenLabel = document.createElement('label');
  gistTokenLabel.textContent = 'Gist Token:';
  gistTokenLabel.style.display = 'block';
  gistTokenLabel.style.marginBottom = '0.5em';
  gistTokenLabel.for = 'gist-token-input';
  registerDialog.appendChild(gistTokenLabel);

  const gistTokenInput = document.createElement('input');
  gistTokenInput.id = 'gist-token-input';
  // gistTokenInput.type = 'password';
  gistTokenInput.style.width = '100%';
  gistTokenInput.style.boxSizing = 'border-box';
  gistTokenInput.style.padding = '0.5em';
  gistTokenInput.style.border = '1px solid #ccc';
  gistTokenInput.style.borderRadius = '4px';
  gistTokenInput.style.marginBottom = '1em';
  gistTokenInput.value = await GM.getValue('GITHUB_TOKEN', '');
  gistTokenInput.placeholder = 'ghp_XXXXXXXXXXXXXXXX';
  registerDialog.appendChild(gistTokenInput);

  const gistTokenHelpText = document.createElement('small');
  gistTokenHelpText.style.display = 'block';
  gistTokenHelpText.style.marginBottom = '1em';
  gistTokenHelpText.style.color = '#666';
  const gistTokenHelpLabel = document.createElement('span');
  gistTokenHelpLabel.textContent = 'Create a Token: ';
  gistTokenHelpText.appendChild(gistTokenHelpLabel);
  const gistTokenHelpLink = document.createElement('a');
  gistTokenHelpLink.href = 'https://github.com/settings/tokens';
  gistTokenHelpLink.target = '_blank';
  gistTokenHelpLink.textContent = 'https://github.com/settings/tokens';
  gistTokenHelpText.appendChild(gistTokenHelpLink);
  registerDialog.appendChild(gistTokenHelpText);

  // --- Encryption Key ラベルと入力欄 ---
  const gistEncryptKeyLabel = document.createElement('label');
  gistEncryptKeyLabel.textContent = 'Encryption Key:';
  gistEncryptKeyLabel.style.display = 'block';
  gistEncryptKeyLabel.style.marginBottom = '0.5em';
  gistEncryptKeyLabel.for = 'gist-encrypt-key-input';
  registerDialog.appendChild(gistEncryptKeyLabel);

  const gistEncryptKeyInput = document.createElement('input');
  gistEncryptKeyInput.id = 'gist-encrypt-key-input';
  // gistEncryptKeyInput.type = 'password';
  gistEncryptKeyInput.style.width = 'calc(100% - 100px)';
  gistEncryptKeyInput.style.boxSizing = 'border-box';
  gistEncryptKeyInput.style.padding = '0.5em';
  gistEncryptKeyInput.style.border = '1px solid #ccc';
  gistEncryptKeyInput.style.borderRadius = '4px';
  gistEncryptKeyInput.style.marginBottom = '1em';
  gistEncryptKeyInput.style.display = 'inline-block';
  gistEncryptKeyInput.value = await GM.getValue('GIST_ENCRYPT_KEY', '');
  gistEncryptKeyInput.placeholder = 'Base64 128bit key';
  registerDialog.appendChild(gistEncryptKeyInput);

  // 生成ボタン
  const generateKeyButton = document.createElement('button');
  generateKeyButton.id = 'generate-key-button';
  generateKeyButton.textContent = 'KeyGen';
  generateKeyButton.type = 'button';
  generateKeyButton.style.width = '90px';
  generateKeyButton.style.marginLeft = '10px';
  generateKeyButton.style.marginBottom = '1em';
  generateKeyButton.style.padding = '0.5em 1em';
  generateKeyButton.style.borderRadius = '4px';
  generateKeyButton.style.border = '1px solid #888';
  generateKeyButton.style.backgroundColor = '#eee';
  generateKeyButton.style.cursor = 'pointer';
  registerDialog.appendChild(generateKeyButton);

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save Info';
  saveButton.style.backgroundColor = '#4caf50';
  saveButton.style.color = '#fff';
  saveButton.style.border = 'none';
  saveButton.style.padding = '0.5em 1em';
  saveButton.style.borderRadius = '4px';
  saveButton.style.cursor = 'pointer';
  saveButton.style.marginTop = '1em';
  saveButton.style.float = 'right';
  saveButton.id = 'save-button';
  registerDialog.appendChild(saveButton);

  const clearInfoButton = document.createElement('button');
  clearInfoButton.textContent = 'Clear Info';
  clearInfoButton.style.backgroundColor = '#f44336';
  clearInfoButton.style.color = '#fff';
  clearInfoButton.style.border = 'none';
  clearInfoButton.style.padding = '0.5em 1em';
  clearInfoButton.style.borderRadius = '4px';
  clearInfoButton.style.cursor = 'pointer';
  clearInfoButton.style.marginTop = '1em';
  clearInfoButton.style.marginRight = '0.5em';
  clearInfoButton.style.float = 'right';
  clearInfoButton.id = 'clear-button';
  registerDialog.appendChild(clearInfoButton);

  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '7px';
  closeButton.style.right = '7px';
  closeButton.style.backgroundColor = '#ccc';
  closeButton.style.border = 'none';
  closeButton.style.borderRadius = '15%';
  closeButton.style.color = '#fff';
  closeButton.style.cursor = 'pointer';
  closeButton.style.padding = '0.2em 0.5em';
  closeButton.style.fontSize = '14px';
  closeButton.addEventListener('click', () => {
    registerDialog.close();
    registerDialog.remove();
  });
  registerDialog.appendChild(closeButton);

  const css = document.createElement('style');
  css.id = 'tm-gist-css';
  css.textContent = `
    #tm-gist-dialog button:hover {
      opacity: 0.8;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }`;
  registerDialog.appendChild(css);

  document.body.appendChild(registerDialog);

  return registerDialog;
}

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

// --- 追加: 暗号化/復号関数 ---
async function encryptContentAES(plainText, keyBase64) {
  // keyBase64: base64エンコードされた16byte(128bit)キー
  const enc = new TextEncoder();
  const keyBytes = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));
  if (keyBytes.length !== 16) throw new Error('Encryption key must be 128bit (16 bytes, base64)');
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    'raw', keyBytes, { name: 'AES-CBC' }, false, ['encrypt']
  );
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv }, key, enc.encode(plainText)
  );
  return {
    iv: btoa(String.fromCharCode(...iv)),
    data: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
  };
}

async function decryptContentAES(encryptedObj, keyBase64) {
  const dec = new TextDecoder();
  const keyBytes = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));
  if (keyBytes.length !== 16) throw new Error('Encryption key must be 128bit (16 bytes, base64)');
  const iv = Uint8Array.from(atob(encryptedObj.iv), c => c.charCodeAt(0));
  const data = Uint8Array.from(atob(encryptedObj.data), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'raw', keyBytes, { name: 'AES-CBC' }, false, ['decrypt']
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv }, key, data
  );
  return dec.decode(decrypted);
}

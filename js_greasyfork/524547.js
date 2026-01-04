// ==UserScript==
// @name         Brew.link to Aiden
// @namespace    NewsGuyTor
// @version      1.2
// @description  Send Brew.link profiles directly to your Fellow Aiden
// @match        https://brew.link/p/*
// @license MIT
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlHttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/524547/Brewlink%20to%20Aiden.user.js
// @updateURL https://update.greasyfork.org/scripts/524547/Brewlink%20to%20Aiden.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /****************************************************
     * 1) Detect Which “GM” HTTP Function is Available
     ****************************************************/

    let gmRequest = null;
    if (typeof GM_xmlHttpRequest !== 'undefined') {
      // Tampermonkey-style
      gmRequest = GM_xmlHttpRequest;
    } else if (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function') {
      // Violentmonkey-style
      gmRequest = GM.xmlHttpRequest;
    }

    // Fallback: if no GM_ method is found, we’ll use fetch() (may fail with CORS).
    function doHttpRequest({method, url, headers, data, onload, onerror}) {
      if (gmRequest) {
        gmRequest({
          method,
          url,
          headers,
          data,
          onload,
          onerror
        });
      } else {
        fetch(url, {
          method,
          headers,
          body: data
        })
        .then(async (resp) => {
          const text = await resp.text();
          onload({ status: resp.status, responseText: text });
        })
        .catch((err) => {
          onerror(err);
        });
      }
    }

    /****************************************************
     * 2) Config / Constants
     ****************************************************/

    const BASE_URL = 'https://l8qtmnc692.execute-api.us-west-2.amazonaws.com/v1';
    const LOGIN_ENDPOINT = '/auth/login';
    const DEVICES_ENDPOINT = '/devices';
    const PROFILES_ENDPOINT = (id) => `/devices/${id}/profiles`;
    const SHARED_PROFILE_ENDPOINT = (brewId) => `/shared/${brewId}`;

    // Fields we strip out before creating a new profile
    const SERVER_SIDE_PROFILE_FIELDS = [
      'id', 'createdAt', 'deletedAt', 'lastUsedTime',
      'sharedFrom', 'isDefaultProfile', 'instantBrew',
      'folder', 'duration', 'lastGBQuantity'
    ];

    // Token validity duration in milliseconds (30 minutes)
    const TOKEN_VALIDITY_DURATION = 30 * 60 * 1000;

    /****************************************************
     * 3) CSS (gradient button, bigger, animations, etc.)
     ****************************************************/
    const STYLE = `
      /* Big gradient "Send to Aiden" button, pinned top-right */
      #sendToAidenBtn {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 30px;
        font-size: 18px;
        font-family: sans-serif;
        font-weight: bold;
        color: #fff;
        background: linear-gradient(135deg, #111, #444);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        z-index: 100000;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        box-shadow: 0 4px 10px rgba(0,0,0,0.4);
      }
      #sendToAidenBtn:hover {
        transform: scale(1.06);
        box-shadow: 0 6px 14px rgba(0,0,0,0.6);
      }
      /* Subtle 'pop in' animation on page load */
      #sendToAidenBtn {
        animation: aidenBtnPop 0.7s ease 0s 1 normal forwards;
      }
      @keyframes aidenBtnPop {
        0% {
          transform: scale(0.7);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      /* Backdrop for modals */
      #aidenBackdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 99998;
        display: none;
      }

      /********************************************
       * "Billion-dollar startup" style login form
       ********************************************/
      #aidenLoginForm {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 340px;
        background: linear-gradient(135deg, #fff, #f4f4f4);
        border-radius: 10px;
        box-shadow: 0 6px 14px rgba(0,0,0,0.25);
        z-index: 99999;
        display: none;
        padding: 24px;
        font-family: "Helvetica Neue", Arial, sans-serif;
        animation: loginFormPop 0.3s ease forwards;
      }
      @keyframes loginFormPop {
        0% {
          transform: translate(-50%, -50%) scale(0.7);
          opacity: 0;
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
      }
      #aidenLoginHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      #aidenLoginHeader h3 {
        margin: 0;
        font-size: 20px;
      }
      #aidenLoginClose {
        cursor: pointer;
        color: #a33;
        font-weight: bold;
        font-size: 20px;
      }
      #aidenLoginForm input {
        display: block;
        width: 100%;
        margin: 10px 0;
        padding: 10px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      #aidenLoginButton {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 4px;
        background: linear-gradient(135deg, #111, #444);
        color: #fff;
        font-size: 15px;
        font-weight: bold;
        cursor: pointer;
        margin-top: 10px;
        transition: transform 0.2s ease;
      }
      #aidenLoginButton:hover {
        transform: scale(1.03);
      }
      #aidenMessage {
        color: #b00;
        margin-top: 6px;
        min-height: 1.2em;
      }

      /********************************************
       * Success modal
       ********************************************/
      #aidenSuccessModal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 380px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 6px 14px rgba(0,0,0,0.25);
        z-index: 99999;
        display: none;
        padding: 20px;
        font-family: "Helvetica Neue", Arial, sans-serif;
      }
      #aidenSuccessModal h2 {
        margin-top: 0;
        font-size: 20px;
      }
      #successDetailsToggle {
        color: #1d72b8;
        text-decoration: underline;
        cursor: pointer;
        margin-top: 10px;
        display: inline-block;
      }
      #successDetails {
        margin-top: 10px;
        padding: 10px;
        background: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 4px;
        display: none; /* hidden by default */
        max-height: 300px;
        overflow-y: auto;
        white-space: pre-wrap;
      }
      #successCloseBtn {
        margin-top: 12px;
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        background: #888;
        color: #fff;
        cursor: pointer;
      }
      #successCloseBtn:hover {
        background: #666;
      }
    `;

    // Insert <style> into <head>
    const styleEl = document.createElement('style');
    styleEl.textContent = STYLE;
    document.head.appendChild(styleEl);

    /****************************************************
     * 4) DOM Setup
     ****************************************************/

    // Big “Send to Aiden” button
    const button = document.createElement('button');
    button.id = 'sendToAidenBtn';
    button.textContent = 'Send to Aiden';
    document.body.appendChild(button);

    // Backdrop (shared by login + success modal)
    const backdrop = document.createElement('div');
    backdrop.id = 'aidenBackdrop';
    document.body.appendChild(backdrop);

    // Login form
    const loginForm = document.createElement('div');
    loginForm.id = 'aidenLoginForm';
    loginForm.innerHTML = `
      <div id="aidenLoginHeader">
        <h3>Fellow Aiden Login</h3>
        <div id="aidenLoginClose">&#x2716;</div>
      </div>
      <input type="text" id="aidenEmail" placeholder="Email" />
      <input type="password" id="aidenPassword" placeholder="Password" />
      <button id="aidenLoginButton">Login</button>
      <div id="aidenMessage"></div>
    `;
    document.body.appendChild(loginForm);

    // Success modal
    const successModal = document.createElement('div');
    successModal.id = 'aidenSuccessModal';
    successModal.innerHTML = `
      <h2>Profile Created!</h2>
      <p>Your brew profile has been sent to Aiden.</p>
      <span id="successDetailsToggle">Show details</span>
      <div id="successDetails"></div>
      <button id="successCloseBtn">Close</button>
    `;
    document.body.appendChild(successModal);

    // Refs
    const loginClose       = document.getElementById('aidenLoginClose');
    const loginButton      = document.getElementById('aidenLoginButton');
    const emailField       = document.getElementById('aidenEmail');
    const passwordField    = document.getElementById('aidenPassword');
    const messageField     = document.getElementById('aidenMessage');
    const successDetails   = document.getElementById('successDetails');
    const successModalEl   = document.getElementById('aidenSuccessModal');
    const successToggle    = document.getElementById('successDetailsToggle');
    const successCloseBtn  = document.getElementById('successCloseBtn');

    /****************************************************
     * 5) Utilities
     ****************************************************/

    // Show/hide the backdrop + login form
    function showLoginForm() {
      backdrop.style.display = 'block';
      loginForm.style.display = 'block';
      messageField.textContent = '';
    }
    function hideLoginForm() {
      backdrop.style.display = 'none';
      loginForm.style.display = 'none';
      messageField.textContent = '';
    }
    // Show/hide success modal
    function showSuccessModal() {
      backdrop.style.display = 'block';
      successModalEl.style.display = 'block';
    }
    function hideSuccessModal() {
      backdrop.style.display = 'none';
      successModalEl.style.display = 'none';
      successDetails.style.display = 'none'; // ensure collapsed
    }

    function getToken() {
      const token = localStorage.getItem('aiden_access_token');
      const timestamp = localStorage.getItem('aiden_token_timestamp');
      if (!token || !timestamp) return null;
      const now = Date.now();
      if (now - parseInt(timestamp, 10) > TOKEN_VALIDITY_DURATION) {
        // Token has expired
        clearTokens();
        return null;
      }
      return token;
    }

    function storeTokens(access, refresh) {
      localStorage.setItem('aiden_access_token', access);
      if (refresh) {
        localStorage.setItem('aiden_refresh_token', refresh);
      }
      localStorage.setItem('aiden_token_timestamp', Date.now().toString());
    }

    function clearTokens() {
      localStorage.removeItem('aiden_access_token');
      localStorage.removeItem('aiden_refresh_token');
      localStorage.removeItem('aiden_token_timestamp');
      localStorage.removeItem('aiden_brewer_id');
    }

    // Core fetch using doHttpRequest with enhanced error handling
    function gmFetch(endpoint, { method='GET', body=null, requireAuth=true } = {}) {
      return new Promise((resolve, reject) => {
        const url = `${BASE_URL}${endpoint}`;
        const headers = {
          'User-Agent': 'Fellow/5 CFNetwork/1568.300.101 Darwin/24.2.0',
          'Content-Type': 'application/json'
        };
        // Only add Authorization if needed
        if (requireAuth && getToken()) {
          headers['Authorization'] = `Bearer ${getToken()}`;
        }

        doHttpRequest({
          method,
          url,
          headers,
          data: body,
          onload: (resp) => {
            if (resp.status >= 200 && resp.status < 300) {
              try {
                resolve(JSON.parse(resp.responseText));
              } catch {
                resolve(resp.responseText);
              }
            } else if (resp.status === 401) {
              // Unauthorized - Token might be invalid or expired
              clearTokens();
              promptReLogin(`Unauthorized access. Please log in again.`);
              reject(new Error(`HTTP ${resp.status}: ${resp.responseText}`));
            } else {
              reject(new Error(`HTTP ${resp.status}: ${resp.responseText}`));
            }
          },
          onerror: (err) => {
            reject(new Error(`NetworkError: ${JSON.stringify(err)}`));
          }
        });
      });
    }

    // Parse the brew link ID from the current URL
    function parseBrewLinkID(url) {
      // pattern: (?:.*?/p/)?([a-zA-Z0-9]+)/?$
      const pattern = /(?:.*\/p\/)?([a-zA-Z0-9]+)\/?$/;
      const match = url.match(pattern);
      if (!match) {
        return null;
      }
      return match[1];
    }

    // Remove server-only fields
    function stripServerFields(profile) {
      SERVER_SIDE_PROFILE_FIELDS.forEach(f => delete profile[f]);
      return profile;
    }

    // Prompt user to re-login with an optional message
    function promptReLogin(message) {
      if (message) {
        alert(message);
      }
      showLoginForm();
    }

    /****************************************************
     * 6) Core Logic
     ****************************************************/

    // Get (or fetch) the device ID
    async function getDeviceId() {
      const existingID = localStorage.getItem('aiden_brewer_id');
      if (existingID) return existingID;

      const devices = await gmFetch(DEVICES_ENDPOINT, { method: 'GET' });
      if (!Array.isArray(devices) || devices.length === 0) {
        throw new Error('No devices found for this account.');
      }
      const device = devices[0]; // assume single brewer
      localStorage.setItem('aiden_brewer_id', device.id);
      return device.id;
    }

    // Login to Aiden
    async function loginToAiden(email, password) {
      const payload = JSON.stringify({ email, password });
      const data = await gmFetch(LOGIN_ENDPOINT, { method: 'POST', body: payload, requireAuth: false });
      if (!data.accessToken) {
        throw new Error('No accessToken returned from server.');
      }
      storeTokens(data.accessToken, data.refreshToken || '');
      localStorage.removeItem('aiden_brewer_id'); // re-fetch in case changed
      return true;
    }

    // Send the brew profile to Aiden
    async function sendProfileToAiden() {
      // 1) Parse brew link from URL
      const brewId = parseBrewLinkID(window.location.href);
      if (!brewId) {
        throw new Error('Invalid brew.link URL or ID format');
      }
      // 2) Fetch shared profile (assume public; set requireAuth: false)
      const sharedProfile = await gmFetch(SHARED_PROFILE_ENDPOINT(brewId), {
        method: 'GET',
        requireAuth: false
      });
      // 3) Strip server-only fields
      stripServerFields(sharedProfile);
      // 4) Create profile on user’s device
      const brewerId = await getDeviceId();
      const createdProfile = await gmFetch(PROFILES_ENDPOINT(brewerId), {
        method: 'POST',
        body: JSON.stringify(sharedProfile)
      });
      // 5) Show success modal with details
      showProfileSuccess(createdProfile);
    }

    // Show success modal with hidden JSON details
    function showProfileSuccess(profileData) {
      successDetails.textContent = JSON.stringify(profileData, null, 2);
      showSuccessModal();
    }

    /****************************************************
     * 7) Automatic Title Replacement
     ****************************************************/
    (async function setDocumentTitle() {
      try {
        const brewId = parseBrewLinkID(window.location.href);
        if (!brewId) return; // Not a valid brew link => do nothing
        // Fetch shared profile without requiring auth
        const sharedProfile = await gmFetch(SHARED_PROFILE_ENDPOINT(brewId), {
          method: 'GET',
          requireAuth: false
        });
        if (sharedProfile && typeof sharedProfile.title === 'string') {
          document.title = `${sharedProfile.title} - brew.link`;
        }
      } catch (e) {
        // If any error occurs, silently ignore and keep default title
      }
    })();

    /****************************************************
     * 8) Event Handlers
     ****************************************************/

    // “Send to Aiden” button
    button.addEventListener('click', async () => {
      if (!getToken()) {
        // No valid token => show login
        showLoginForm();
        return;
      }
      // If we do have a valid token, attempt the send
      try {
        await sendProfileToAiden();
      } catch (err) {
        // Handle specific cases
        if (err.message.includes('HTTP 401')) {
          // Already handled in gmFetch, but you can add additional actions here if needed
          console.error('Unauthorized. Prompting re-login.');
        } else {
          alert(`Failed sending profile: ${err.message}`);
        }
      }
    });

    // Close login form
    loginClose.addEventListener('click', () => {
      hideLoginForm();
    });

    // Login button
    loginButton.addEventListener('click', async () => {
      const email = emailField.value.trim();
      const password = passwordField.value.trim();
      if (!email || !password) {
        messageField.textContent = 'Email and password cannot be empty!';
        return;
      }
      messageField.textContent = 'Logging in...';
      try {
        await loginToAiden(email, password);
        messageField.textContent = 'Login successful!';
        hideLoginForm();
        // Immediately send after successful login
        await sendProfileToAiden();
      } catch (err) {
        messageField.textContent = `Login failed: ${err.message}`;
      }
    });

    // Success modal: show/hide details
    successToggle.addEventListener('click', () => {
      if (successDetails.style.display === 'none') {
        successDetails.style.display = 'block';
        successToggle.textContent = 'Hide details';
      } else {
        successDetails.style.display = 'none';
        successToggle.textContent = 'Show details';
      }
    });

    // Success modal: close button
    successCloseBtn.addEventListener('click', () => {
      hideSuccessModal();
    });

})();
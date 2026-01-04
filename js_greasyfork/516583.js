// ==UserScript==
// @name                  Caixin Auto Login
// @name:zh-CN            财新网自动登录
// @license               MIT
// @namespace             https://www.caixin.com/
// @version               1.4
// @description           Automatic login script for Caixin.com with credential management
// @description:zh-CN     自动登录财新网账号
// @author                https://github.com/hxueh
// @match                 *://*.caixin.com/*
// @grant                 GM_setValue
// @grant                 GM_getValue
// @grant                 GM_xmlhttpRequest
// @grant                 GM_registerMenuCommand
// @grant                 GM_addStyle
// @require               https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @connect               gateway.caixin.com
// @icon                  https://www.caixin.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/516583/Caixin%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/516583/Caixin%20Auto%20Login.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Configuration constants
  const CONFIG = {
    API: {
      LOGIN: "https://gateway.caixin.com/api/ucenter/user/v1/loginJsonp",
      USER_INFO: "https://gateway.caixin.com/api/ucenter/userinfo/get",
    },
    ENCRYPTION: {
      KEY: "G3JH98Y8MY9GWKWG",
      MODE: CryptoJS.mode.ECB,
      PADDING: CryptoJS.pad.Pkcs7,
    },
    COOKIE: {
      DOMAIN: ".caixin.com",
      MAX_AGE: 604800, // 7 days in seconds
    },
    LOGIN_PARAMS: {
      DEVICE_TYPE: getDeviceType(),
      UNIT: "1",
      AREA_CODE: "+86",
    },
  };

  /**
   * Determines the device type based on user agent
   * @returns {string} - "3" for mobile devices, "5" for desktop
   */
  function getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|webos|windows phone/i.test(
      userAgent
    );
    return isMobile ? "3" : "5";
  }

  /**
   * Encrypts the password using AES encryption
   * @param {string} password - The password to encrypt
   * @returns {string} - URL encoded encrypted password
   */
  function encrypt(password) {
    const keyWordArray = CryptoJS.enc.Utf8.parse(CONFIG.ENCRYPTION.KEY);
    const encrypted = CryptoJS.AES.encrypt(password, keyWordArray, {
      mode: CONFIG.ENCRYPTION.MODE,
      padding: CONFIG.ENCRYPTION.PADDING,
    });
    return encodeURIComponent(encrypted.toString());
  }

  /**
   * Sets a cookie with standard Caixin parameters
   * @param {string} name - Cookie name
   * @param {string} value - Cookie value
   */
  function setCaixinCookie(name, value) {
    const cookieOptions = [
      `${name}=${value}`,
      `Path=/`,
      `Domain=${CONFIG.COOKIE.DOMAIN}`,
      "Secure=true",
      `max-age=${CONFIG.COOKIE.MAX_AGE}`,
    ].join("; ");

    document.cookie = cookieOptions;
  }

  /**
   * Checks if the user is currently logged in
   * @returns {Promise<boolean>} - True if logged in, false otherwise
   */
  async function isLogin() {
    try {
      const response = await makeRequest({
        method: "GET",
        url: CONFIG.API.USER_INFO,
      });
      return response.code === 0;
    } catch (error) {
      console.error("Login check failed:", error);
      return false;
    }
  }

  /**
   * Makes an XMLHttpRequest using GM_xmlhttpRequest
   * @param {Object} options - Request options
   * @returns {Promise} - Resolves with parsed JSON response
   */
  function makeRequest(options) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        ...options,
        onload: (response) => resolve(JSON.parse(response.responseText)),
        onerror: reject,
      });
    });
  }

  /**
   * Performs the login process using stored credentials
   * @returns {Promise<void>}
   */
  async function performLogin() {
    const credentials = {
      phoneNumber: GM_getValue("phoneNumber"),
      password: GM_getValue("password"),
    };

    if (!credentials.phoneNumber || !credentials.password) {
      console.log(
        "Credentials not found. Please set phone number and password."
      );
      return;
    }

    const loginUrl = new URL(CONFIG.API.LOGIN);
    const params = {
      account: credentials.phoneNumber,
      password: encrypt(credentials.password),
      deviceType: CONFIG.LOGIN_PARAMS.DEVICE_TYPE,
      unit: CONFIG.LOGIN_PARAMS.UNIT,
      areaCode: CONFIG.LOGIN_PARAMS.AREA_CODE,
    };

    Object.entries(params).forEach(([key, value]) => {
      loginUrl.searchParams.append(key, value);
    });

    try {
      const response = await makeRequest({
        method: "GET",
        url: loginUrl.toString(),
      });

      if (response.code !== 0) {
        throw new Error(`Login failed with code: ${response.code}`);
      }

      // Set authentication cookies
      const { uid, code, deviceType, unit, userAuth } = response.data;
      const cookies = {
        SA_USER_auth: userAuth,
        SA_USER_DEVICE_TYPE: deviceType,
        SA_USER_UID: uid,
        SA_USER_UNIT: unit,
        USER_LOGIN_CODE: code,
      };

      Object.entries(cookies).forEach(([name, value]) => {
        setCaixinCookie(name, value);
      });

      location.reload();
    } catch (error) {
      console.error("Login process failed:", error);
    }
  }

  /**
   * Creates and displays the settings window UI
   */
  function showSettingsWindow() {
    const styles = `
        .caixin-settings-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999999;
          display: flex;
          justify-content: center;
          align-items: center;
        }
  
        .caixin-settings-window {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 300px;
        }
  
        .caixin-settings-window h2 {
          margin: 0 0 20px 0;
          font-size: 18px;
          color: #333;
        }
  
        .caixin-settings-window .form-group {
          margin-bottom: 15px;
        }
  
        .caixin-settings-window label {
          display: block;
          margin-bottom: 5px;
          color: #666;
        }
  
        .caixin-settings-window input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
        }
  
        .caixin-settings-window .buttons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
  
        .caixin-settings-window button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
  
        .caixin-settings-window .save-btn {
          background: #4CAF50;
          color: white;
        }
  
        .caixin-settings-window .cancel-btn {
          background: #f5f5f5;
          color: #333;
        }
  
        .caixin-settings-window button:hover {
          opacity: 0.9;
        }
      `;

    GM_addStyle(styles);

    const overlay = document.createElement("div");
    overlay.className = "caixin-settings-overlay";

    const currentSettings = {
      phone: GM_getValue("phoneNumber", ""),
      password: GM_getValue("password", ""),
    };

    const window = document.createElement("div");
    window.className = "caixin-settings-window";
    window.innerHTML = `
        <h2>Caixin Login Settings</h2>
        <div class="form-group">
          <label for="caixin-phone">Phone Number:</label>
          <input type="text" id="caixin-phone" value="${currentSettings.phone}" placeholder="+86 Phone Number">
        </div>
        <div class="form-group">
          <label for="caixin-password">Password:</label>
          <input type="password" id="caixin-password" value="${currentSettings.password}" placeholder="Password">
        </div>
        <div class="buttons">
          <button class="cancel-btn">Cancel</button>
          <button class="save-btn">Save</button>
        </div>
      `;

    function closeSettings() {
      document.body.removeChild(overlay);
    }

    // Event Handlers
    window.querySelector(".save-btn").addEventListener("click", () => {
      const phone = window.querySelector("#caixin-phone").value;
      const password = window.querySelector("#caixin-password").value;

      if (phone && password) {
        GM_setValue("phoneNumber", phone);
        GM_setValue("password", password);
        closeSettings();
        performLogin();
      } else {
        console.log("Please fill in both fields.");
      }
    });

    window
      .querySelector(".cancel-btn")
      .addEventListener("click", closeSettings);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeSettings();
    });

    overlay.appendChild(window);
    document.body.appendChild(overlay);
  }

  // Initialize the script
  async function init() {
    const loggedIn = await isLogin();
    if (!loggedIn) {
      console.log("Not logged in. Attempting login...");
      performLogin();
    }
  }

  // Register settings menu command
  GM_registerMenuCommand("⚙️ Caixin Login Settings", showSettingsWindow);

  // Start the script
  init();
})();
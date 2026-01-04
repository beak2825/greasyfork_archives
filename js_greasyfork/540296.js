// ==UserScript==
// @name         Grizzway Tools Development
// @namespace    http://tampermonkey.net/
// @version      5.0595
// @description  Epic fixes and visual mods for fishtank.live
// @author       Grizzway
// @match        *://*.fishtank.live/*
// @exclude-match *://api.fishtank.live/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540296/Grizzway%20Tools%20Development.user.js
// @updateURL https://update.greasyfork.org/scripts/540296/Grizzway%20Tools%20Development.meta.js
// ==/UserScript==

(() => {
  // src/storage.js
  function getCurrentTheme() {
    return localStorage.getItem("grizzway_theme") || "default";
  }
  var STORAGE_KEY = "grizzway-tools-settings";
  function saveSettings(newSettings = {}) {
    const existing = loadSettings();
    const merged = { ...existing, ...newSettings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  }
  function loadSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  // src/styles/themes/default/default.js
  var default_default = {
    name: "Default",
    author: "Wes",
    customPingSound: "https://cdn.fishtank.live/sounds/mention.mp3",
    style: ``
  };

  // src/styles/themes/chao/chao.js
  var chao_default = {
    name: "Chao Garden",
    author: "Grizzway",
    customPingSound: "https://files.catbox.moe/1qbutz.mp3",
    style: `
        /* This is for the site background */
        body, .layout_layout__5rz87, .select_options__t1ibN {
            background-image: url('https://images.gamebanana.com/img/ss/mods/5f681fd055666.jpg') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }

        /* This is for the chat background */
        .chat_chat__2rdNg {
            background-image: url('https://i.imgur.com/UVjYx1I.gif') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }
      
        /* This is a lot of stuff that you can split up or remove. */
        .maejok-input-invalid, .maejok-context-message, .maejok-tts-warning-text,
        .chat_header__8kNPS, .top-bar_top-bar__X4p2n, .panel_body__O5yBA, .inventory_slots__D4IrC {
            background-color: limegreen !important;
            border-color: limegreen !important;
        }

        /* Header Colors */
        .panel_header__T2yFW {
            background-color: darkgreen !important;
        }
        
        /* Top Bar stuff again feel free to remove or change */
        .top-bar_top-bar__X4p2n {
            box-shadow: none !important;
        }

        /* Do not remember */
        .maejok-context-message svg path {
            fill: black !important;
        }

        /* Live stream preloaded with opacity for fun */
        .hls-stream-player_hls-stream-player__BJiGl,
        .live-stream-player_container__A4sNR,
        .layout_center__Vsd3b {
            opacity: 1;
        }
        
        /* Poll Footer */
        .poll_footer__rALdX {
            background-color: limegreen;
        }

        /* Poll Vote Button Stuff */
        .poll_vote__b_NE0 button:disabled:hover {
            background-color: red !important;
            color: white !important;
            border-color: black !important;
        }
        .poll_vote__b_NE0 button:hover {
            background-color: red !important;
            color: white !important;
            border-color: black !important;
        }

        /* TTS and SFX Messages */
        .chat-message-tts_chat-message-tts__2Jlxi,
        .chat-message-sfx_chat-message-sfx__OGv6q {
            border-color: #00ff00 !important;
            background-color: darkgreen !important;
            filter: drop-shadow(0 0 2px #00ff00) drop-shadow(0 0 2px #00ff00);
        }
        .chat-message-tts_message__sWVCc,
        .chat-message-sfx_message__d2Rei {
            -webkit-text-stroke: 2px rgba(0, 255, 0, 0.6);
            filter: drop-shadow(0 0 2px #00ff00) drop-shadow(0 0 2px #00ff00);
        }
        .chat-message-tts_timestamp__pIVv0,
        .chat-message-sfx_timestamp__ilYfg {
            color: black !important;
            font-weight: bold !important;
            text-shadow: none !important;
        }

        /* Chat input area */
        .chat_input__bsNw2 {
            background-color: #000000 !important;
        }

        /* Chat Input area text color */
        .chat-input_chat-input__GAgOF, .chat-input_input-wrapper__rjiu1, .chat-input_input__jljCU {
            color: #00FF00 !important;
        }

        /* Stock ticker */
        .stocks-bar_stocks-bar__7kNv8 {
            background-color: rgba(0, 0, 0, 1) !important;
        }

        /* Bottom announcement banner */
        .announcement-bar_announcement-bar__gcGuh {
            background-color: rgba(0, 0, 0, 0) !important;
            color: red !important;
            text-shadow: 1px 1px 0 #000 !important;
            border: none !important;
        }

        /* Live stream header */
        .live-stream-player_header__58imR, .live-stream-player_live-stream-player__4CHjG {
            background-color: #191d2100 !important;
            border: none !important;
        }

        /* Bottom status bar */
        .status-bar_status-bar__vR_Tm {
            background-color: #000000 !important;
        }

        /* Big screen text opacity */
        .chat_cinema__iXQz9 {
            opacity: 0.4 !important;
        }
    `
  };

  // src/config.js
  var themeMap = {
    default: default_default,
    chao: chao_default
  };
  function getThemeConfig() {
    const selected = getCurrentTheme();
    return themeMap[selected] || default_default;
  }
  function setThemeName(themeName) {
    localStorage.setItem("grizzway_theme", themeName);
  }

  // src/features/blockSounds.js
  function blockSoundsFeature() {
    const themeConfig = getThemeConfig();
    const customPingSound = themeConfig?.customPingSound || "https://cdn.fishtank.live/sounds/mention.mp3";
    console.log("[Grizzway Tools] Using custom ping sound:", customPingSound);
    const blockedSounds = [
      "https://cdn.fishtank.live/sounds/suicidebomb.mp3",
      "https://cdn.fishtank.live/sounds/suicidebomb-1.mp3",
      "https://cdn.fishtank.live/sounds/suicidebomb-2.mp3",
      "https://cdn.fishtank.live/sounds/suicidebomb-3.mp3",
      "https://cdn.fishtank.live/sounds/suicidebomb-4.mp3",
      "https://cdn.fishtank.live/sounds/nuke-1.mp3",
      "https://cdn.fishtank.live/sounds/nuke-2.mp3",
      "https://cdn.fishtank.live/sounds/nuke-3.mp3",
      "https://cdn.fishtank.live/sounds/nuke-4.mp3",
      "https://cdn.fishtank.live/sounds/nuke-5.mp3",
      "https://cdn.fishtank.live/sounds/horn.mp3"
    ];
    const OriginalAudio = window.Audio;
    window.Audio = function(src) {
      console.log("[Grizzway Tools] Audio requested:", src);
      if (src && src.includes("mention")) {
        console.log("[Grizzway Tools] Replacing mention sound with:", customPingSound);
        return new OriginalAudio(customPingSound);
      }
      if (blockedSounds.some((sound) => src?.includes(sound))) {
        console.log("[Grizzway Tools] Blocking sound:", src);
        return new OriginalAudio();
      }
      return new OriginalAudio(src);
    };
    window.Audio.prototype = OriginalAudio.prototype;
    const originalPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function() {
      if (this.src && this.src.includes("mention.mp3")) {
        console.log("[Grizzway Tools] Changing audio src to:", customPingSound);
        this.src = customPingSound;
      }
      if (blockedSounds.some((sound) => this.src && this.src.includes(sound))) {
        console.log("[Grizzway Tools] Blocking audio play:", this.src);
        return Promise.reject("Blocked sound");
      }
      return originalPlay.apply(this, arguments);
    };
    const originalFetch = window.fetch;
    window.fetch = async function(resource, init2) {
      if (typeof resource === "string") {
        if (resource.includes("mention.mp3")) {
          console.log("[Grizzway Tools] Fetching custom ping sound instead");
          return fetch(customPingSound);
        }
        if (blockedSounds.some((sound) => resource.includes(sound)))
          return new Response(null, { status: 403 });
      }
      return originalFetch(resource, init2);
    };
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      if (url && url.includes("mention.mp3")) {
        console.log("[Grizzway Tools] XHR redirect to custom ping sound");
        this.abort();
        const req = new XMLHttpRequest();
        req.open(method, customPingSound, true);
        req.send();
        return;
      }
      if (blockedSounds.some((sound) => url && url.includes(sound))) {
        this.abort();
      } else {
        originalOpen.apply(this, arguments);
      }
    };
  }

  // src/features/chatLinkButtons.js
  function chatLinkButtonsFeature() {
    function addLinkButton(messageElement, url) {
      const existingButton = messageElement.querySelector(`.custom-link-button[href="${url}"]`);
      if (existingButton) return;
      const button = document.createElement("a");
      button.href = url.startsWith("http") ? url : "https://" + url;
      button.target = "_blank";
      button.rel = "noopener noreferrer";
      button.className = "custom-link-button";
      button.style.marginLeft = "8px";
      button.style.width = "20px";
      button.style.height = "20px";
      button.style.display = "inline-flex";
      button.style.alignItems = "center";
      button.style.justifyContent = "center";
      button.style.backgroundColor = "#4EA1FF";
      button.style.color = "white";
      button.style.borderRadius = "4px";
      button.style.fontSize = "14px";
      button.style.textDecoration = "none";
      button.style.verticalAlign = "middle";
      button.textContent = "\u{1F517}";
      const messageContent = messageElement.querySelector(".chat-message-default_message__milmT");
      if (messageContent) {
        messageContent.appendChild(button);
      }
    }
    function detectLinksAndButton(messageElement) {
      const contentElement = messageElement.querySelector(".chat-message-default_message__milmT");
      if (!contentElement) return;
      const textContent = contentElement.innerText || contentElement.textContent || "";
      const urlRegex = /(\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?\b)/g;
      const matches = textContent.match(urlRegex);
      if (matches) {
        matches.forEach((url) => addLinkButton(messageElement, url));
      }
    }
    function observeMessages(chatContainer) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.classList.contains("chat-message-default_chat-message-default__JtJQL")) {
              detectLinksAndButton(node);
            }
          });
        });
      });
      observer.observe(chatContainer, {
        childList: true,
        subtree: true
      });
    }
    function waitForChatContainer() {
      const chatContainer = document.querySelector(".chat-messages_chat-messages__UeL0a");
      if (chatContainer) {
        observeMessages(chatContainer);
      } else {
        setTimeout(waitForChatContainer, 1e3);
      }
    }
    waitForChatContainer();
  }

  // src/features/loggedInUserStyling.js
  function loggedInUserStylingFeature() {
    console.log("[Grizzway Tools] Configurable logged in user styling initialized");
    let currentUserName = null;
    function getLoggedInUsername() {
      const userElement = document.querySelector(".top-bar-user_display-name__bzlpw") || document.querySelector(".top-bar_username__nJaN2") || document.querySelector('[class*="display-name"]');
      return userElement ? userElement.textContent.trim() : null;
    }
    function getUserStylingSettings() {
      const settings = loadSettings();
      return {
        enabled: settings.loggedInUserStyling !== false,
        highlightEnabled: settings.userHighlightEnabled !== false,
        glowEnabled: settings.userGlowEnabled !== false,
        highlightColor: settings.userHighlightColor || "#7d0505",
        glowColor: settings.userGlowColor || "#00ff00"
      };
    }
    function hexToRgba(hex, opacity = 0.4) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    function styleLoggedInUserMessages() {
      const settings = getUserStylingSettings();
      if (!settings.enabled) return;
      const username = getLoggedInUsername();
      if (!username) return;
      const messages = document.querySelectorAll(".chat-message-default_user__uVNvH");
      messages.forEach((message) => {
        if (message.textContent.includes(username)) {
          const userElement = message;
          if (userElement) {
            userElement.style.textShadow = "none";
            userElement.style.fontWeight = "1000";
          }
          const messageTextElement = message.closest(".chat-message-default_chat-message-default__JtJQL").querySelector(".chat-message-default_body__iFlH4");
          if (messageTextElement) {
            messageTextElement.style.textShadow = "none";
            messageTextElement.style.fontWeight = "1000";
          }
        }
      });
    }
    function highlightUserMessages() {
      const settings = getUserStylingSettings();
      if (!settings.enabled) return;
      const username = getLoggedInUsername();
      if (!username) return;
      const messages = document.querySelectorAll(".chat-message-default_user__uVNvH");
      messages.forEach((message) => {
        if (message.textContent.includes(username)) {
          const chatMessage = message.closest(".chat-message-default_chat-message-default__JtJQL");
          if (settings.highlightEnabled && chatMessage && !chatMessage.classList.contains("highlighted-message")) {
            chatMessage.classList.add("highlighted-message");
            chatMessage.style.backgroundColor = hexToRgba(settings.highlightColor, 0.4);
          }
          if (settings.glowEnabled && !message.classList.contains("glowing-username")) {
            message.classList.add("glowing-username");
            const glowRgba = hexToRgba(settings.glowColor, 0.6);
            message.style.webkitTextStroke = `1px ${glowRgba}`;
            message.style.filter = `drop-shadow(0 0 2px ${settings.glowColor}) drop-shadow(0 0 4px ${settings.glowColor})`;
          }
        }
      });
    }
    function removeUserStyling() {
      const settings = getUserStylingSettings();
      const username = getLoggedInUsername();
      if (!username) return;
      const messages = document.querySelectorAll(".chat-message-default_user__uVNvH");
      messages.forEach((message) => {
        if (message.textContent.includes(username)) {
          const chatMessage = message.closest(".chat-message-default_chat-message-default__JtJQL");
          if (!settings.highlightEnabled && chatMessage && chatMessage.classList.contains("highlighted-message")) {
            chatMessage.classList.remove("highlighted-message");
            chatMessage.style.backgroundColor = "";
          }
          if (!settings.glowEnabled && message.classList.contains("glowing-username")) {
            message.classList.remove("glowing-username");
            message.style.webkitTextStroke = "";
            message.style.filter = "";
          }
        }
      });
    }
    function updateUserStyling() {
      const settings = getUserStylingSettings();
      if (settings.enabled) {
        highlightUserMessages();
        styleLoggedInUserMessages();
        removeUserStyling();
      } else {
        removeUserStyling();
      }
    }
    setInterval(() => {
      updateUserStyling();
    }, 1e3);
    console.log("[Grizzway Tools] Configurable user styling functions started");
  }
  function updateLoggedInUserCSS() {
    const settings = loadSettings();
    const highlightColor = settings.userHighlightColor || "#7d0505";
    const glowColor = settings.userGlowColor || "#00ff00";
    const userCSS = `
        /* Configurable logged-in user styling */
        .highlighted-message {
            background-color: ${settings.userHighlightColor ? `rgba(${parseInt(highlightColor.slice(1, 3), 16)}, ${parseInt(highlightColor.slice(3, 5), 16)}, ${parseInt(highlightColor.slice(5, 7), 16)}, 0.4)` : "rgba(125, 5, 5, 0.4)"} !important;
        }
        
        .glowing-username {
            -webkit-text-stroke: 1px ${settings.userGlowColor ? `rgba(${parseInt(glowColor.slice(1, 3), 16)}, ${parseInt(glowColor.slice(3, 5), 16)}, ${parseInt(glowColor.slice(5, 7), 16)}, 0.6)` : "rgba(0, 255, 0, 0.2)"} !important;
            filter: drop-shadow(0 0 1px ${glowColor}) drop-shadow(0 0 2px ${glowColor}) !important;
        }
    `;
    const styleElement = document.createElement("style");
    styleElement.id = "grizzway-logged-in-user-styling";
    styleElement.textContent = userCSS;
    const existing = document.getElementById("grizzway-logged-in-user-styling");
    if (existing) existing.remove();
    document.head.appendChild(styleElement);
  }

  // src/features/grizzwayChatStyle.js
  function grizzwaySpecialStylingFeature() {
    console.log("[Grizzway Tools] Grizzway special styling initialized");
    function styleGrizzwayMessages() {
      const messages = document.querySelectorAll(".chat-message-default_user__uVNvH");
      messages.forEach((message) => {
        let username = message.textContent.trim();
        const clanTag = message.querySelector(".chat-message-default_clan__t_Ggo");
        if (clanTag) {
          username = username.replace(clanTag.textContent.trim(), "").trim();
        }
        if (username.toLowerCase() === "grizzway") {
          const chatMessage = message.closest(".chat-message-default_chat-message-default__JtJQL");
          if (chatMessage && !chatMessage.querySelector(".grizzway-animated-border")) {
            chatMessage.classList.add("grizzway-highlighted-message");
            message.classList.add("grizzway-username-bold");
            const messageTextElement = chatMessage.querySelector(".chat-message-default_body__iFlH4");
            if (messageTextElement) {
              messageTextElement.classList.add("grizzway-message-text");
            }
            const messageContentElement = chatMessage.querySelector(".chat-message-default_message__milmT");
            if (messageContentElement) {
              messageContentElement.classList.add("grizzway-message-content-green");
            }
            const borderContainer = document.createElement("div");
            borderContainer.className = "grizzway-animated-border";
            chatMessage.style.position = "relative";
            chatMessage.appendChild(borderContainer);
          }
        }
      });
    }
    function forceHighZIndex() {
      const dropdowns = document.querySelectorAll(".select_options__t1ibN");
      const hasVisibleDropdown = Array.from(dropdowns).some(
        (dropdown) => dropdown.offsetParent !== null
      );
      const grizzwayMessages = document.querySelectorAll(".grizzway-highlighted-message");
      const grizzwayBorders = document.querySelectorAll(".grizzway-animated-border");
      if (hasVisibleDropdown) {
        grizzwayMessages.forEach((msg) => {
          msg.style.zIndex = "1";
        });
        grizzwayBorders.forEach((border) => {
          border.style.zIndex = "1";
        });
      } else {
        grizzwayMessages.forEach((msg) => {
          msg.style.zIndex = "3";
        });
        grizzwayBorders.forEach((border) => {
          border.style.zIndex = "10";
        });
      }
      const selectors = [
        ".select_options__t1ibN",
        ".chat-emoji-picker_emojis__p1qan",
        "[data-popper-placement]"
      ];
      selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          element.style.zIndex = "999999";
          element.style.setProperty("z-index", "999999", "important");
        });
      });
    }
    function runAllStyling() {
      styleGrizzwayMessages();
      forceHighZIndex();
    }
    setInterval(runAllStyling, 50);
    requestAnimationFrame(function loop() {
      runAllStyling();
      requestAnimationFrame(loop);
    });
    const observer = new MutationObserver(() => {
      runAllStyling();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    window.addEventListener("scroll", runAllStyling);
    document.addEventListener("visibilitychange", runAllStyling);
    document.addEventListener("click", () => {
      setTimeout(forceHighZIndex, 10);
    });
    document.addEventListener("mousedown", () => {
      setTimeout(forceHighZIndex, 10);
    });
    runAllStyling();
    console.log("[Grizzway Tools] Grizzway special styling active");
  }
  function addGrizzwaySpecialCSS() {
    const grizzwayCSS = `
        /* Use more specific selectors and higher specificity for dropdown elements */
        div.select_options__t1ibN,
        div[data-popper-placement].select_options__t1ibN,
        .select_options__t1ibN[tabindex],
        body .select_options__t1ibN,
        html .select_options__t1ibN {
            z-index: 999999 !important;
        }

        .select_options__t1ibN *,
        .select_options__t1ibN button,
        .select_options__t1ibN .select_option__lVOGV {
            z-index: 999999 !important;
        }

        div.chat-emoji-picker_emojis__p1qan,
        .chat-emoji-picker_emojis__p1qan,
        body .chat-emoji-picker_emojis__p1qan {
            z-index: 999999 !important;
        }

        .chat-emoji-picker_emojis__p1qan * {
            z-index: 999999 !important;
        }

        /* Ensure any popper/dropdown elements are above */
        [data-popper-placement],
        [data-popper-placement] *,
        .select_option__lVOGV,
        .select_separator__YHaKJ {
            z-index: 999999 !important;
        }

        .grizzway-highlighted-message {
            background-color: rgba(140, 0, 255, 0.35) !important;
            position: relative !important;
            border-radius: 0 !important;
            padding: 8px !important;
            margin: 4px 0 !important;
            z-index: 3 !important;
            animation: grizzway-rainbow-highlight 2s linear infinite;
        }

        @keyframes grizzway-rainbow-highlight {
            0% { background-color: rgba(255, 0, 0, 0.1) !important; }     /* Red */
            16.67% { background-color: rgba(255, 165, 0, 0.1) !important; } /* Orange */
            33.33% { background-color: rgba(255, 255, 0, 0.1) !important; } /* Yellow */
            50% { background-color: rgba(0, 255, 0, 0.1) !important; }     /* Green */
            66.67% { background-color: rgba(0, 0, 255, 0.1) !important; }  /* Blue */
            83.33% { background-color: rgba(75, 0, 130, 0.1) !important; } /* Indigo */
            100% { background-color: rgba(238, 130, 238, 0.1) !important; } /* Violet */
        }

        .grizzway-animated-border {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 10;
        }

        .grizzway-animated-border::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                linear-gradient(90deg, #00ff00 0%, #00ff00 50%, #000000 50%, #000000 100%),
                linear-gradient(90deg, #00ff00 0%, #00ff00 50%, #000000 50%, #000000 100%),
                linear-gradient(0deg, #00ff00 0%, #00ff00 50%, #000000 50%, #000000 100%),
                linear-gradient(0deg, #00ff00 0%, #00ff00 50%, #000000 50%, #000000 100%);
            background-size: 12px 2px, 12px 2px, 2px 12px, 2px 12px;
            background-position: 0 0, 0 100%, 0 0, 100% 0;
            background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
            animation: grizzway-marching-ants 0.6s linear infinite;
        }

        @keyframes grizzway-marching-ants {
            0% {
                background-position: 0 0, 0 100%, 0 0, 100% 0;
            }
            100% {
                background-position: 12px 0, -12px 100%, 0 12px, 100% -12px;
            }
        }

        .grizzway-username-bold {
            font-weight: 900 !important;
            font-size: 1.1em !important;
            text-shadow: 1px 1px 0px rgba(0,0,0,0.5) !important;
            letter-spacing: 0.5px !important;
        }

        .grizzway-message-text {
            font-weight: 700 !important;
        }

        .grizzway-message-content-green {
            color: #00ff00 !important;
            text-shadow: 0 0 3px #00ff00 !important;
            font-weight: bold !important;
        }
    `;
    const styleElement = document.createElement("style");
    styleElement.id = "grizzway-special-styling";
    styleElement.textContent = grizzwayCSS;
    const existing = document.getElementById("grizzway-special-styling");
    if (existing) existing.remove();
    document.head.appendChild(styleElement);
    console.log("[Grizzway Tools] Grizzway special styling CSS applied");
  }

  // src/features/modalFixes.js
  function modalFixesFeature() {
    console.log("[Grizzway Tools] Modal fixes initialized");
    const modalCSS = `
        /* IMPORTANT: THIS IS EVERY MODAL. DONT TOUCH THE SIZE OR ALIGNMENT */
        .modal_modal__MS70U {
             height: 900px !important;
             width: 1500px !important;
             align-self: anchor-center !important;
             justify-self: anchor-center !important;
             overflow: scroll !important;
             background-color: #191d21bb !important;
        }
        
        /* Modal Dim Background, 0% Opacity means no dimming */
        .modal_backdrop__94Bu6 {
             opacity: 0;
        }
        
        /* FULL SCREEN SETTINGS MENU & ITEM DEX DO NOT TOUCH */
        .settings-modal_body__qdvDm, .profile-modal_profile-modal__4mjE7 {
             display: flex;
             flex-direction: column;
             gap: 8px;
             align-items: center;
             margin: auto;
             width: 100%;
             padding: 16px;
             background-color: rgba(0, 0, 0, .25);
             border: 1px solid #505050;
             border-radius: 4px;
        }
        
        /* FULL SCREEN SETTINGS MENU & ITEM DEX DO NOT TOUCH */
        .user-profile-tabs_tab__2bsiR {
             display: flex;
             flex-wrap: wrap;
             background-color: rgba(0, 0, 0, .5);
             padding: 8px;
             border: 1px solid #505050;
             border-bottom-left-radius: 4px;
             border-bottom-right-radius: 4px;
             border-top: 0;
             gap: 4px;
             width: 1400px;
             height: 900px;
             justify-self: center;
        }
        
        /* FULL SCREEN SETTINGS MENU & ITEM DEX DO NOT TOUCH */
        .user-profile-items_user-profile-items__rl_CV {
             display: flex;
             width: 1400px;
             height: 900px;
        }
        
        /* FULL SCREEN SETTINGS MENU & ITEM DEX DO NOT TOUCH */
        .user-profile-items_items__zuulV {
             display: flex;
             flex-wrap: wrap;
             gap: 4px;
             padding: 8px;
             width: 100%;
             height: 100%;
             justify-content: space-evenly;
             max-height: 900px !important;
        }
        
        .user-profile-tts-sfx_messages__w4_Ew {
             max-height: 93vh !important;
        }
        
        .user-profile_profile__g_tBc {
             width: 1400px !important;
             max-width: 1400px !important;
        }
        
         .user-profile_body__hk8ZS {
             width: 1400px;
             align-content: center;
        }
        
        .profile-modal_profile-modal__4mjE7 {
             align-items: unset;
        }
        
        .user-profile_bio__nzdwR {
             padding-left: 80px;
             width: 1000px;
        }
        
        .input_input__Zwrui textarea {
             height: 100px;
        }
        
        .user-profile_header__zP1kv {
             width: 1400px;
        }
        
        .medal_medal__Hqowf.medal_md__RvQMV button {
             --medal-size: 64px;
        }
        
        .user-update-profile_actions__vbfIX button {
            width: 800px;
        }
        
        .user-update-profile_user-update-profile__sa20I {
            width: 1400px;
        }
        
        .user-update-profile_details__7bBRy {
            width: 350px;
        }
        
        .user-update-profile_bio__DaV4N {
            width: 800px;
            justify-self: flex-end;
            height: 200px;
        }
        
        .modal_body__j3Bav {
            align-self: anchor-center;
            height: 100%;
            overflow: visible !important;
        }
        
        .modal_header__O0ebJ {
            padding-top: 50px;
            font-size: xxx-large;
        }
        
        .item-generator-modal_items__Xs78_, .item-generator-modal_generator__vmam0 {
            background-color: rgba(14, 16, 18, 1) !important;
        }
        
        .logs_logs__YL0uF {
            width: 1400px;
            align-self: center;
        }
        
        .logs_body__lqe_U {
            height: 700px !important;
        }
        
        .logs_message__p9V2r {
            font-size: medium;
        }
        
         .sfx-modal_sfx-modal__i_ppy, .tts-modal_tts-modal__rxY0z {
             width: 1200px;
             padding-top: 150px;
         }
         
         .select_value__yPLpn {
             background-color: rgba(43, 45, 46, 1) !important;
         }
         
         .input_input-wrapper__xvMLO input{
             background-color: rgba(43, 45, 46, 1) !important;
         }
         
         .user-update-profile_user-update-profile__sa20I .user-update-profile_bio__DaV4N {
             grid-column: 1 / 3;
             grid-row: 1 / 4;
         }
         
         .input_input-wrapper__xvMLO textarea {
             height: 165px;
         }
         
         .user-update-profile_footer__kONMY {
             grid-row: 2 / 6 !important;
             height: 60px;
         }
         
         .user-profile-tabs_user-profile-tabs__7SFh7 {
             padding-top: 75px;
         }
         
         .stocks-modal_stocks-modal__xgXY0, .stock-details_stock-details__AZOBD {
             width: 1200px !important;
             max-width: 1200px !important;
         }
    `;
    const styleElement = document.createElement("style");
    styleElement.id = "grizzway-modal-fixes";
    styleElement.textContent = modalCSS;
    const existing = document.getElementById("grizzway-modal-fixes");
    if (existing) existing.remove();
    document.head.appendChild(styleElement);
    console.log("[Grizzway Tools] Modal CSS applied");
  }

  // src/features/profileFix.js
  function profileFixFeature() {
    console.log("[Grizzway Tools] Profile fix feature initialized");
    function profileFix() {
      const profileModal = document.querySelector(".profile-modal_profile-modal__4mjE7");
      if (!profileModal || profileModal.offsetParent === null) return;
      setTimeout(() => {
        const editForm = profileModal.querySelector(".user-update-profile_user-update-profile__sa20I");
        const viewBio = profileModal.querySelector(".user-profile_bio__nzdwR");
        const clanActions = profileModal.querySelector(".user-profile_clan-actions__aS32x");
        const header = profileModal.querySelector(".user-profile_header__zP1kv");
        if (editForm) {
          console.log("[Grizzway Tools] Profile EDIT mode detected");
          fixEditModeOriginal(editForm);
        } else if (viewBio && clanActions && header) {
          console.log("[Grizzway Tools] Profile VIEW mode detected");
          fixViewMode(viewBio, clanActions, header);
        }
      }, 100);
    }
    function fixViewMode(bio, clanActions, header) {
      if (header.contains(bio) && header.nextElementSibling === clanActions) {
        console.log("[Grizzway Tools] Profile VIEW already fixed");
        return;
      }
      const userInfo = header.querySelector(".user-profile_info__eFefT");
      if (userInfo && !header.contains(bio)) {
        bio.remove();
        userInfo.insertAdjacentElement("afterend", bio);
        console.log("[Grizzway Tools] Bio repositioned in header");
      }
      if (header.nextElementSibling !== clanActions) {
        clanActions.remove();
        header.insertAdjacentElement("afterend", clanActions);
        console.log("[Grizzway Tools] Clan actions repositioned");
      }
    }
    profileFix();
  }
  function observeProfileFix() {
    console.log("[Grizzway Tools] Profile fix observer initialized");
    const profileObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const modal2 = node.querySelector && node.querySelector(".profile-modal_profile-modal__4mjE7");
            if (modal2 || node.classList && node.classList.contains("profile-modal_profile-modal__4mjE7")) {
              console.log("[Grizzway Tools] Profile modal detected");
              setTimeout(() => {
                profileFixFeature();
              }, 200);
            }
          }
        });
      });
      const modal = document.querySelector(".profile-modal_profile-modal__4mjE7");
      if (modal && modal.offsetParent !== null) {
        profileFixFeature();
      }
    });
    profileObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  function addProfileEditingCSS() {
    const profileEditCSS = `
        /* EXACT CSS from original userscript - DO NOT MODIFY */
        .user-update-profile_user-update-profile__sa20I {
            width: 1400px !important;
        }
        
        .user-update-profile_details__7bBRy {
            width: 350px !important;
        }
        
        .user-update-profile_bio__DaV4N {
            width: 800px !important;
            justify-self: flex-end !important;
            height: 200px !important;
        }
        
        .user-update-profile_user-update-profile__sa20I .user-update-profile_bio__DaV4N {
            grid-column: 1 / 3 !important;
            grid-row: 1 / 4 !important;
        }
        
        .input_input-wrapper__xvMLO textarea {
            height: 165px !important;
        }
        
        .user-update-profile_footer__kONMY {
            grid-row: 2 / 6 !important;
            height: 60px !important;
        }
        
        .user-update-profile_actions__vbfIX button {
            width: 800px !important;
        }
    `;
    const styleElement = document.createElement("style");
    styleElement.id = "grizzway-profile-edit-fixes";
    styleElement.textContent = profileEditCSS;
    const existing = document.getElementById("grizzway-profile-edit-fixes");
    if (existing) existing.remove();
    document.head.appendChild(styleElement);
    console.log("[Grizzway Tools] Original profile editing CSS applied");
  }

  // src/features/streamTitleStyle.js
  var streamTitleInterval = null;
  var currentColor = "#00ff00";
  var currentGlowIntensity = 2;
  var isEnabled = false;
  function streamTitleStyleFeature(color = null, glowIntensity = null) {
    console.log("[Grizzway Tools] Stream title style initialized");
    const settings = loadSettings();
    isEnabled = settings.streamTitleEnabled === true;
    currentColor = color || settings.streamTitleColor || "#00ff00";
    currentGlowIntensity = glowIntensity || settings.streamTitleGlowIntensity || 2;
    if (streamTitleInterval) {
      clearInterval(streamTitleInterval);
      streamTitleInterval = null;
    }
    if (isEnabled) {
      applyStreamTitleStyle();
      streamTitleInterval = setInterval(() => {
        applyStreamTitleStyle();
      }, 1e3);
    } else {
      removeStreamTitleStyle();
    }
  }
  function updateStreamTitleStyle(color, glowIntensity = null) {
    if (color === null) {
      isEnabled = false;
      currentColor = "#00ff00";
      currentGlowIntensity = 2;
      removeStreamTitleStyle();
      if (streamTitleInterval) {
        clearInterval(streamTitleInterval);
        streamTitleInterval = null;
      }
    } else {
      isEnabled = true;
      currentColor = color;
      if (glowIntensity !== null) {
        currentGlowIntensity = glowIntensity;
      }
      if (!streamTitleInterval) {
        applyStreamTitleStyle();
        streamTitleInterval = setInterval(() => {
          applyStreamTitleStyle();
        }, 1e3);
      } else {
        applyStreamTitleStyle();
      }
    }
  }
  function applyStreamTitleStyle() {
    if (!isEnabled) return;
    const baseBlur = currentGlowIntensity * 0.5;
    const strongBlur = currentGlowIntensity * 1;
    let streamTitleFilter = "";
    if (currentGlowIntensity > 0) {
      if (currentGlowIntensity <= 3) {
        streamTitleFilter = `drop-shadow(0 0 ${baseBlur}px ${currentColor})`;
      } else if (currentGlowIntensity <= 6) {
        streamTitleFilter = `drop-shadow(0 0 ${baseBlur}px ${currentColor}) drop-shadow(0 0 ${strongBlur}px ${currentColor})`;
      } else {
        streamTitleFilter = `drop-shadow(0 0 ${baseBlur}px ${currentColor}) drop-shadow(0 0 ${strongBlur}px ${currentColor}) drop-shadow(0 0 ${strongBlur * 1.5}px ${currentColor})`;
      }
    }
    const streamTitles = document.querySelectorAll(".live-stream_name__ngU04");
    streamTitles.forEach((title) => {
      title.style.color = currentColor;
      title.style.filter = streamTitleFilter;
    });
    if (streamTitles.length > 0) {
      console.log("[Grizzway Tools] Applied styling to", streamTitles.length, "stream titles with color", currentColor, "and glow intensity", currentGlowIntensity);
    }
  }
  function removeStreamTitleStyle() {
    const streamTitles = document.querySelectorAll(".live-stream_name__ngU04");
    streamTitles.forEach((title) => {
      title.style.color = "";
      title.style.filter = "";
    });
    if (streamTitles.length > 0) {
      console.log("[Grizzway Tools] Removed styling from", streamTitles.length, "stream titles");
    }
  }

  // src/styles/baseCss.js
  function injectBaseCSS() {
    const baseStyleId = "baseCssGrizzway";
    if (document.getElementById(baseStyleId)) return;
    const baseCSS = `
      /* BASE CSS \u2013 ALWAYS ON (No modal styles here) */
      
      /* Only non-modal essential styles */
      .user-profile-tts-sfx_messages__w4_Ew {
        max-height: 93vh !important;
      }

      .sfx-modal_sfx-modal__i_ppy,
      .tts-modal_tts-modal__rxY0z,
      .stocks-modal_stocks-modal__xgXY0,
      .stock-details_stock-details__AZOBD {
        max-width: 95vw !important;
      }
    `;
    if (typeof GM_addStyle !== "undefined") {
      GM_addStyle(baseCSS);
    } else {
      const style = document.createElement("style");
      style.id = baseStyleId;
      style.textContent = baseCSS;
      document.head.appendChild(style);
    }
  }

  // src/styles/themes/chao/scripts.js
  var scripts_default = [
    () => {
      let imgs = [];
      let styleEl = null;
      let observer = null;
      const selectors = [
        ".top-bar_logo__XL0_C img.maejok-logo_hover",
        ".top-bar_logo__XL0_C img.maejok-logo_hide",
        ".top-bar_logo__XL0_C img.top-bar_desktop__pjX2g"
      ];
      const applyGlow = () => {
        imgs = selectors.map((sel) => Array.from(document.querySelectorAll(sel))).flat().filter(Boolean);
        if (!imgs.length) return false;
        imgs.forEach((img) => img.classList.add("grizz-glow-img"));
        styleEl = document.createElement("style");
        styleEl.id = "grizz-glow-style";
        styleEl.textContent = `
          @keyframes grizzGlow {
            0%   { filter: drop-shadow(0 0 0px red); }
            30%  { filter: drop-shadow(0 0 14px red); }
            60%  { filter: drop-shadow(0 0 14px red); }
            100% { filter: drop-shadow(0 0 0px red); }
          }
  
          .grizz-glow-img {
            animation: grizzGlow 1.2s infinite ease-in-out !important;
            will-change: filter;
          }
        `;
        document.head.appendChild(styleEl);
        return true;
      };
      if (!applyGlow()) {
        observer = new MutationObserver(() => {
          if (applyGlow()) observer.disconnect();
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
      return () => {
        imgs.forEach((img) => img.classList.remove("grizz-glow-img"));
        if (styleEl && styleEl.parentNode) styleEl.remove();
        if (observer) observer.disconnect();
      };
    }
  ];

  // src/styles/themes/egirl/egirl.js
  var egirl_default = {
    name: "E-Girl",
    author: "Grizzway",
    customPingSound: "https://files.catbox.moe/alh72d.mp3",
    style: `
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap');
        
        /* Site background with kawaii Hello Kitty scene */
        body, .layout_layout__5rz87, .select_options__t1ibN {
            background-image: url('https://i.imgur.com/ZuBHfWp.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-attachment: fixed !important;
            color: #ff69b4 !important;
        }

        /* Chat background - soft pink overlay for readability */
        .chat_chat__2rdNg {
            background-color: rgba(255, 182, 193, 0.92) !important;
            border: 3px solid #ff69b4 !important;
            box-shadow: 0 0 30px rgba(255, 105, 180, 0.5), inset 0 0 25px rgba(255, 192, 203, 0.3) !important;
            border-radius: 20px !important;
            backdrop-filter: blur(5px) !important;
        }
      
        /* Main UI elements with kawaii theme */
        .maejok-input-invalid, .maejok-context-message, .maejok-tts-warning-text,
        .chat_header__8kNPS, .top-bar_top-bar__X4p2n, .panel_body__O5yBA, .inventory_slots__D4IrC {
            background-color: rgba(255, 182, 193, 0.95) !important;
            border: 2px solid #ff69b4 !important;
            color: #ff1493 !important;
            box-shadow: 0 0 20px rgba(255, 105, 180, 0.4) !important;
            text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
            border-radius: 15px !important;
        }

        /* Header with cute aesthetic */
        .panel_header__T2yFW {
            background: linear-gradient(135deg, rgba(255, 182, 193, 0.95), rgba(255, 105, 180, 0.9)) !important;
            border-bottom: 3px solid #ff1493 !important;
            color: #fff !important;
            text-shadow: 0 0 10px #ff69b4, 2px 2px 4px rgba(0, 0, 0, 0.3) !important;
            box-shadow: 0 4px 20px rgba(255, 105, 180, 0.6) !important;
            border-radius: 15px 15px 0 0 !important;
        }
        
        /* Top bar with kawaii styling */
        .top-bar_top-bar__X4p2n {
            background: linear-gradient(180deg, rgba(255, 182, 193, 0.95), rgba(255, 182, 193, 0.9)) !important;
            box-shadow: 0 3px 20px rgba(255, 105, 180, 0.5) !important;
            border-bottom: 3px solid #ff69b4 !important;
            border-radius: 15px !important;
        }

        /* Context message icons */
        .maejok-context-message svg path {
            fill: #ff69b4 !important;
            filter: drop-shadow(0 0 8px #ff69b4) !important;
        }

        /* Stream containers with cute borders */
        .hls-stream-player_hls-stream-player__BJiGl,
        .live-stream-player_container__A4sNR,
        .layout_center__Vsd3b {
            border: 3px solid rgba(255, 105, 180, 0.7) !important;
            box-shadow: 0 0 25px rgba(255, 182, 193, 0.5) !important;
            border-radius: 20px !important;
        }
        
        /* Poll elements with kawaii styling */
        .poll_footer__rALdX {
            background: linear-gradient(135deg, rgba(255, 182, 193, 0.9), rgba(255, 105, 180, 0.9)) !important;
            border-top: 3px solid #ff1493 !important;
            box-shadow: 0 -3px 15px rgba(255, 105, 180, 0.4) !important;
            border-radius: 0 0 15px 15px !important;
        }

        /* Poll buttons with cute hover effects */
        .poll_vote__b_NE0 button:disabled:hover,
        .poll_vote__b_NE0 button:hover {
            background: linear-gradient(135deg, rgba(255, 20, 147, 0.9), rgba(255, 105, 180, 0.8)) !important;
            color: #ffffff !important;
            border: 3px solid #ff1493 !important;
            box-shadow: 0 0 20px rgba(255, 20, 147, 0.7) !important;
            text-shadow: 0 0 10px #ff1493, 1px 1px 2px rgba(0, 0, 0, 0.3) !important;
            transform: translateY(-3px) scale(1.05) !important;
            border-radius: 15px !important;
        }

        /* TTS and SFX with kawaii styling */
        .chat-message-tts_chat-message-tts__2Jlxi,
        .chat-message-sfx_chat-message-sfx__OGv6q {
            border: 3px solid #ff69b4 !important;
            background: linear-gradient(135deg, rgba(255, 182, 193, 0.95), rgba(255, 182, 193, 0.9)) !important;
            filter: drop-shadow(0 0 10px #ff69b4) drop-shadow(0 0 20px #ffb6c1);
            box-shadow: inset 0 0 20px rgba(255, 105, 180, 0.3) !important;
            border-radius: 15px !important;
        }
        
        .chat-message-tts_message__sWVCc,
        .chat-message-sfx_message__d2Rei {
            color: #ff1493 !important;
            text-shadow: 0 0 8px #ff69b4, 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
            font-family: 'Nunito', sans-serif !important;
            font-weight: 600 !important;
        }
        
        .chat-message-tts_timestamp__pIVv0,
        .chat-message-sfx_timestamp__ilYfg {
            color: #ff69b4 !important;
            font-weight: bold !important;
            text-shadow: 0 0 6px #ff69b4, 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
            font-family: 'Nunito', sans-serif !important;
        }

        /* Chat input with kawaii styling */
        .chat_input__bsNw2 {
            background: linear-gradient(135deg, rgba(255, 182, 193, 0.95), rgba(255, 182, 193, 0.8)) !important;
            border: 3px solid #ff69b4 !important;
            box-shadow: 0 0 25px rgba(255, 105, 180, 0.5), inset 0 0 15px rgba(255, 192, 203, 0.3) !important;
            border-radius: 20px !important;
        }

        /* Chat input text with cute font */
        .chat-input_chat-input__GAgOF, .chat-input_input-wrapper__rjiu1, .chat-input_input__jljCU {
            color: #ff1493 !important;
            font-family: 'Nunito', sans-serif !important;
            font-weight: 600 !important;
            text-shadow: 0 0 5px #ff69b4, 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
        }

        /* Stock ticker with kawaii styling */
        .stocks-bar_stocks-bar__7kNv8 {
            background: linear-gradient(90deg, rgba(255, 182, 193, 0.95), rgba(255, 182, 193, 0.95)) !important;
            border-top: 3px solid #ff69b4 !important;
            color: #ff1493 !important;
            font-family: 'Nunito', sans-serif !important;
            font-weight: 600 !important;
            text-shadow: 0 0 5px #ff69b4, 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
        }

        /* Announcement banner with cute warning styling */
        .announcement-bar_announcement-bar__gcGuh {
            background: linear-gradient(135deg, rgba(255, 20, 147, 0.9), rgba(255, 69, 181, 0.9)) !important;
            color: #fff !important;
            text-shadow: 0 0 10px #ff1493, 2px 2px 4px rgba(0, 0, 0, 0.3) !important;
            border: 3px solid #ff1493 !important;
            font-family: 'Nunito', sans-serif !important;
            font-weight: 700 !important;
            box-shadow: 0 0 20px rgba(255, 20, 147, 0.6) !important;
            border-radius: 15px !important;
        }

        /* Live stream header */
        .live-stream-player_header__58imR, .live-stream-player_live-stream-player__4CHjG {
            background: linear-gradient(135deg, rgba(255, 182, 193, 0.9), rgba(255, 182, 193, 0.8)) !important;
            border: 3px solid rgba(255, 105, 180, 0.7) !important;
            box-shadow: 0 0 20px rgba(255, 182, 193, 0.5) !important;
            border-radius: 20px !important;
        }

        /* Status bar at bottom */
        .status-bar_status-bar__vR_Tm {
            background: linear-gradient(90deg, rgba(255, 182, 193, 0.95), rgba(255, 182, 193, 0.8)) !important;
            border-top: 3px solid #ff69b4 !important;
            color: #ff1493 !important;
            font-family: 'Nunito', sans-serif !important;
            font-weight: 600 !important;
            text-shadow: 0 0 5px #ff69b4, 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
        }

        /* Cinema mode with cute glow */
        .chat_cinema__iXQz9 {
            border: 2px solid rgba(255, 105, 180, 0.4) !important;
            box-shadow: 0 0 25px rgba(255, 182, 193, 0.3) !important;
        }

        /* Apply kawaii fonts to all elements - Nunito with cute fallbacks */
        html, body, div, span, p, a, button, input, textarea, select, option, 
        h1, h2, h3, h4, h5, h6, label, li, ul, ol, dl, dt, dd,
        .chat-input_input__jljCU, .top-bar-user_display-name__bzlpw,
        * {
            font-family: 'Nunito', 'Comic Sans MS', cursive, sans-serif !important;
        }

        /* Scrollbar styling with kawaii theme */
        ::-webkit-scrollbar {
            width: 12px;
        }
        
        ::-webkit-scrollbar-track {
            background: linear-gradient(180deg, rgba(255, 182, 193, 0.8), rgba(255, 182, 193, 0.8));
            border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #ff69b4, #ff1493);
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(255, 105, 180, 0.7);
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #ff1493, #ff69b4);
            box-shadow: 0 0 15px rgba(255, 105, 180, 0.9);
        }

        /* Button hover effects with kawaii bounce */
        button:hover {
            background: linear-gradient(135deg, rgba(255, 105, 180, 0.3), rgba(255, 182, 193, 0.3)) !important;
            color: #ff1493 !important;
            text-shadow: 0 0 10px #ff69b4, 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
            box-shadow: 0 0 20px rgba(255, 105, 180, 0.5) !important;
            transform: translateY(-2px) scale(1.02) !important;
            border-radius: 12px !important;
        }

        /* Links with kawaii styling */
        a {
            color: #ff1493 !important;
            text-decoration: underline !important;
            text-shadow: 0 0 6px #ff69b4, 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
        }
        
        a:hover {
            color: #ff69b4 !important;
            text-shadow: 0 0 10px #ff69b4, 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
            transform: scale(1.05) !important;
        }

        /* Top bar buttons with kawaii backgrounds */
        .top-bar_red__1Up8r {
            background: linear-gradient(135deg, rgba(255, 20, 147, 0.8), rgba(220, 20, 60, 0.8)) !important;
            border: 2px solid #ff1493 !important;
            color: #fff !important;
            text-shadow: 0 0 8px #ff1493, 1px 1px 2px rgba(0, 0, 0, 0.3) !important;
            border-radius: 12px !important;
        }

        .top-bar_green__S_hiA {
            background: linear-gradient(135deg, rgba(255, 105, 180, 0.8), rgba(255, 182, 193, 0.8)) !important;
            border: 2px solid #ff69b4 !important;
            color: #fff !important;
            text-shadow: 0 0 8px #ff69b4, 1px 1px 2px rgba(0, 0, 0, 0.3) !important;
            border-radius: 12px !important;
        }

        .dropdown-button_dropdown-button__X_K4O {
            background: linear-gradient(135deg, rgba(255, 192, 203, 0.8), rgba(255, 182, 193, 0.8)) !important;
            border: 2px solid #ffb6c1 !important;
            color: #ff1493 !important;
            text-shadow: 0 0 6px #ff69b4, 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
            border-radius: 12px !important;
        }

        .item-nav-buttons_prize-machine__jnHNS {
            background: linear-gradient(135deg, rgba(255, 20, 147, 0.8), rgba(255, 105, 180, 0.8)) !important;
            border: 2px solid #ff1493 !important;
            color: #fff !important;
            text-shadow: 0 0 8px #ff1493, 1px 1px 2px rgba(0, 0, 0, 0.3) !important;
            border-radius: 12px !important;
        }

        .item-nav-buttons_market__28l6K {
            background: linear-gradient(135deg, rgba(255, 69, 181, 0.8), rgba(255, 20, 147, 0.8)) !important;
            border: 2px solid #ff45b5 !important;
            color: #fff !important;
            text-shadow: 0 0 8px #ff45b5, 1px 1px 2px rgba(0, 0, 0, 0.3) !important;
            border-radius: 12px !important;
        }

        .top-bar_link__0xN4F {
            background: linear-gradient(135deg, rgba(255, 182, 193, 0.8), rgba(255, 182, 193, 0.8)) !important;
            border: 2px solid #ff69b4 !important;
            color: #ff1493 !important;
            text-shadow: 0 0 6px #ff69b4, 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
            border-radius: 12px !important;
        }

        /* Kawaii animated border for chat */
        .chat_chat__2rdNg::before {
            content: '';
            position: absolute;
            top: -3px;
            left: -3px;
            right: -3px;
            bottom: -3px;
            background: linear-gradient(45deg, #ff69b4, #ff1493, #ffb6c1, #ff69b4);
            background-size: 400% 400%;
            animation: kawaii-border 3s ease-in-out infinite;
            border-radius: 23px;
            z-index: -1;
        }

        @keyframes kawaii-border {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        /* User display styling */
        .top-bar-user_top-bar-user__VUdJm {
            background: linear-gradient(135deg, rgba(255, 182, 193, 0.9), rgba(255, 105, 180, 0.7)) !important;
            border: 3px solid #ff69b4 !important;
            border-radius: 15px !important;
            padding: 8px 12px !important;
            box-shadow: 
                0 0 20px rgba(255, 105, 180, 0.5),
                inset 0 0 15px rgba(255, 192, 203, 0.3) !important;
            position: relative !important;
            overflow: visible !important;
        }

        .top-bar-user_display-name__bzlpw {
            text-shadow: 0 0 8px #ff69b4, 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
            font-weight: 700 !important;
            font-family: 'Nunito', sans-serif !important;
            position: relative !important;
            z-index: 2 !important;
            letter-spacing: 0.5px !important;
        }

        /* Cute sparkle effects */
        .chat_chat__2rdNg::after {
            content: '\u2728\u{1F496}\u2728';
            position: absolute;
            top: -15px;
            right: 10px;
            font-size: 16px;
            animation: sparkle 2s ease-in-out infinite alternate;
            z-index: 10;
        }

        @keyframes sparkle {
            0% { transform: translateY(0px) scale(1); opacity: 0.7; }
            100% { transform: translateY(-5px) scale(1.1); opacity: 1; }
        }
    `
  };

  // src/styles/themes/egirl/scripts.js
  var scripts_default2 = [
    () => {
      console.log("[E-Girl Theme] Loading Nunito font...");
      const linkElement = document.createElement("link");
      linkElement.rel = "stylesheet";
      linkElement.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap";
      document.head.appendChild(linkElement);
      setTimeout(() => {
        console.log("[E-Girl Theme] Nunito font loaded! \u2728");
      }, 1e3);
      return () => {
        console.log("[E-Girl Theme] Font loading cleaned up");
      };
    },
    () => {
      let observer = null;
      let styleEl = null;
      const getKawaiiColor = (color) => {
        const colorPallet = [
          "rgba(255, 105, 180, 0.9)",
          "rgba(255, 182, 193, 0.9)",
          "rgba(255, 192, 203, 0.9)",
          "rgba(255, 20, 147, 0.9)",
          "rgba(255, 240, 245, 0.9)",
          "rgba(255, 228, 225, 0.9)",
          "rgba(255, 218, 185, 0.9)",
          "rgba(221, 160, 221, 0.9)"
        ];
        const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!rgbMatch) return colorPallet[0];
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        const brightness = (r * 299 + g * 587 + b * 114) / 1e3;
        if (brightness > 200) {
          if (r > g && r > b) return colorPallet[4];
          if (g > r && g > b) return colorPallet[5];
          if (b > r && b > g) return colorPallet[6];
          return colorPallet[1];
        } else if (brightness > 120) {
          if (r > g && r > b) return colorPallet[0];
          if (g > r && g > b) return colorPallet[2];
          if (b > r && b > g) return colorPallet[7];
          return colorPallet[1];
        } else {
          if (r > g && r > b) return colorPallet[3];
          if (g > r && g > b) return colorPallet[0];
          if (b > r && b > g) return colorPallet[7];
          return colorPallet[0];
        }
      };
      const applyKawaiiStyling = () => {
        const userContainer = document.querySelector(".top-bar-user_top-bar-user__VUdJm");
        const displayName = document.querySelector(".top-bar-user_display-name__bzlpw");
        if (!userContainer || !displayName) return false;
        const computedStyle = window.getComputedStyle(displayName);
        const textColor = computedStyle.color;
        const bgColor = getKawaiiColor(textColor);
        const lighterBgColor = bgColor.replace("0.9", "0.7");
        if (!styleEl) {
          styleEl = document.createElement("style");
          styleEl.id = "egirl-dynamic-user-style";
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = `
                .top-bar-user_top-bar-user__VUdJm {
                    background: linear-gradient(135deg, ${bgColor}, ${lighterBgColor}) !important;
                    border: 3px solid #ff69b4 !important;
                    border-radius: 15px !important;
                    padding: 8px 12px !important;
                    box-shadow: 
                        0 0 20px rgba(255, 105, 180, 0.5),
                        inset 0 0 15px rgba(255, 192, 203, 0.3) !important;
                    position: relative !important;
                    overflow: visible !important;
                }

                .top-bar-user_display-name__bzlpw {
                    text-shadow: 0 0 8px #ff69b4, 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
                    font-weight: 700 !important;
                    font-family: 'Nunito', sans-serif !important;
                    position: relative !important;
                    z-index: 2 !important;
                    letter-spacing: 0.5px !important;
                }

                .top-bar-user_top-bar-user__VUdJm::before {
                    content: '\u{1F495}';
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    font-size: 14px;
                    animation: kawaii-pulse 2s ease-in-out infinite;
                    z-index: 3;
                }

                @keyframes kawaii-pulse {
                    0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
                    50% { transform: scale(1.2) rotate(10deg); opacity: 1; }
                }
            `;
        console.log("[E-Girl Theme] Applied kawaii styling \u2728\u{1F496}");
        return true;
      };
      if (!applyKawaiiStyling()) {
        observer = new MutationObserver(() => {
          if (applyKawaiiStyling()) {
            console.log("[E-Girl Theme] Dynamic kawaii styling applied! \u{1F338}");
          }
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["style", "class"]
        });
      }
      return () => {
        if (styleEl && styleEl.parentNode) {
          styleEl.remove();
        }
        if (observer) {
          observer.disconnect();
        }
        console.log("[E-Girl Theme] Kawaii styling cleaned up \u{1F44B}\u{1F495}");
      };
    },
    () => {
      let messageObserver = null;
      const kawaiiEmojis = ["\u{1F496}", "\u2728", "\u{1F338}", "\u{1F495}", "\u{1F984}", "\u{1F308}", "\u{1F4AB}", "\u{1F380}"];
      const addKawaiiEffects = () => {
        const messages = document.querySelectorAll(".chat-message_message__iZ2CT:not(.kawaii-enhanced)");
        messages.forEach((message) => {
          if (Math.random() < 0.15) {
            const sparkle = document.createElement("span");
            sparkle.textContent = kawaiiEmojis[Math.floor(Math.random() * kawaiiEmojis.length)];
            sparkle.style.cssText = `
                        position: absolute;
                        top: -5px;
                        right: -5px;
                        font-size: 12px;
                        animation: kawaii-float 3s ease-in-out infinite;
                        pointer-events: none;
                        z-index: 10;
                    `;
            message.style.position = "relative";
            message.appendChild(sparkle);
          }
          message.classList.add("kawaii-enhanced");
        });
      };
      const addFloatAnimation = () => {
        if (!document.getElementById("kawaii-float-animation")) {
          const style = document.createElement("style");
          style.id = "kawaii-float-animation";
          style.textContent = `
                    @keyframes kawaii-float {
                        0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
                        33% { transform: translateY(-8px) scale(1.1); opacity: 1; }
                        66% { transform: translateY(-3px) scale(0.95); opacity: 0.9; }
                    }
                `;
          document.head.appendChild(style);
        }
      };
      addFloatAnimation();
      addKawaiiEffects();
      messageObserver = new MutationObserver(() => {
        addKawaiiEffects();
      });
      messageObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
      console.log("[E-Girl Theme] Kawaii message effects loaded! \u{1F338}\u2728");
      return () => {
        if (messageObserver) {
          messageObserver.disconnect();
        }
        const style = document.getElementById("kawaii-float-animation");
        if (style) style.remove();
        console.log("[E-Girl Theme] Kawaii message effects cleaned up! \u{1F495}");
      };
    }
  ];

  // src/styles/themes/glowfish/glowfish.js
  var glowfish_default = {
    name: "Glow Fish",
    author: "Grizzway",
    customPingSound: "https://files.catbox.moe/alh72d.mp3",
    style: `
        /* Site background with cosmic underwater effect */
        body, .layout_layout__5rz87, .select_options__t1ibN {
            background-image: url('https://i.imgur.com/v3aS7nX.gif') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-attachment: fixed !important;
            color: #00ffaa !important;
        }

        /* Chat background - deep ocean overlay for readability */
        .chat_chat__2rdNg {
            background-color: rgba(20, 5, 40, 0.9) !important;
            border: 2px solid #00ffaa !important;
            box-shadow: 0 0 25px rgba(0, 255, 170, 0.4), inset 0 0 20px rgba(138, 43, 226, 0.2) !important;
            border-radius: 8px !important;
        }
      
        /* Main UI elements with cosmic theme */
        .maejok-input-invalid, .maejok-context-message, .maejok-tts-warning-text,
        .chat_header__8kNPS, .top-bar_top-bar__X4p2n, .panel_body__O5yBA, .inventory_slots__D4IrC {
            background-color: rgba(25, 10, 50, 0.95) !important;
            border: 1px solid #00ffaa !important;
            color: #00ffaa !important;
            box-shadow: 0 0 15px rgba(0, 255, 170, 0.3) !important;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
        }

        /* Header with mystical aesthetic */
        .panel_header__T2yFW {
            background: linear-gradient(135deg, rgba(138, 43, 226, 0.9), rgba(75, 0, 130, 0.9)) !important;
            border-bottom: 2px solid #00ffaa !important;
            color: #00ffaa !important;
            text-shadow: 0 0 8px #00ffaa, 2px 2px 4px rgba(0, 0, 0, 0.9) !important;
            box-shadow: 0 2px 15px rgba(138, 43, 226, 0.5) !important;
        }
        
        /* Top bar with cosmic styling */
        .top-bar_top-bar__X4p2n {
            background: linear-gradient(180deg, rgba(25, 10, 50, 0.95), rgba(138, 43, 226, 0.8)) !important;
            box-shadow: 0 2px 15px rgba(0, 255, 170, 0.4) !important;
            border-bottom: 2px solid #00ffaa !important;
        }

        /* Context message icons */
        .maejok-context-message svg path {
            fill: #00ffaa !important;
            filter: drop-shadow(0 0 5px #00ffaa) !important;
        }

        /* Stream containers with cosmic glow */
        .hls-stream-player_hls-stream-player__BJiGl,
        .live-stream-player_container__A4sNR,
        .layout_center__Vsd3b {
            border: 2px solid rgba(0, 255, 170, 0.6) !important;
            box-shadow: 0 0 20px rgba(138, 43, 226, 0.4) !important;
            border-radius: 8px !important;
        }
        
        /* Poll elements with mystical styling */
        .poll_footer__rALdX {
            background: linear-gradient(135deg, rgba(75, 0, 130, 0.9), rgba(138, 43, 226, 0.9)) !important;
            border-top: 2px solid #00ffaa !important;
            box-shadow: 0 -2px 10px rgba(0, 255, 170, 0.3) !important;
        }

        /* Poll buttons with cosmic hover effects */
        .poll_vote__b_NE0 button:disabled:hover,
        .poll_vote__b_NE0 button:hover {
            background: linear-gradient(135deg, rgba(255, 20, 147, 0.8), rgba(138, 43, 226, 0.8)) !important;
            color: #ffffff !important;
            border: 2px solid #ff1493 !important;
            box-shadow: 0 0 15px rgba(255, 20, 147, 0.6) !important;
            text-shadow: 0 0 8px #ff1493, 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
            transform: translateY(-2px) !important;
        }

        /* TTS and SFX with glowing cosmic effect */
        .chat-message-tts_chat-message-tts__2Jlxi,
        .chat-message-sfx_chat-message-sfx__OGv6q {
            border: 2px solid #00ffaa !important;
            background: linear-gradient(135deg, rgba(25, 10, 50, 0.9), rgba(75, 0, 130, 0.9)) !important;
            filter: drop-shadow(0 0 8px #00ffaa) drop-shadow(0 0 15px #8a2be2);
            box-shadow: inset 0 0 15px rgba(0, 255, 170, 0.3) !important;
            border-radius: 6px !important;
        }
        
        .chat-message-tts_message__sWVCc,
        .chat-message-sfx_message__d2Rei {
            color: #00ffaa !important;
            text-shadow: 0 0 8px #00ffaa, 1px 1px 2px rgba(0, 0, 0, 0.9) !important;
            font-family: 'Anta', sans-serif !important;
        }
        
        .chat-message-tts_timestamp__pIVv0,
        .chat-message-sfx_timestamp__ilYfg {
            color: #8a2be2 !important;
            font-weight: bold !important;
            text-shadow: 0 0 5px #8a2be2, 1px 1px 2px rgba(0, 0, 0, 0.9) !important;
            font-family: 'Anta', sans-serif !important;
        }

        /* Chat input with mystical styling */
        .chat_input__bsNw2 {
            background: linear-gradient(135deg, rgba(25, 10, 50, 0.95), rgba(75, 0, 130, 0.8)) !important;
            border: 2px solid #00ffaa !important;
            box-shadow: 0 0 20px rgba(0, 255, 170, 0.4), inset 0 0 10px rgba(138, 43, 226, 0.3) !important;
            border-radius: 6px !important;
        }

        /* Chat input text with cosmic font */
        .chat-input_chat-input__GAgOF, .chat-input_input-wrapper__rjiu1, .chat-input_input__jljCU {
            color: #00ffaa !important;
            font-family: 'Anta', sans-serif !important;
            text-shadow: 0 0 5px #00ffaa, 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
        }

        /* Stock ticker with cosmic styling */
        .stocks-bar_stocks-bar__7kNv8 {
            background: linear-gradient(90deg, rgba(25, 10, 50, 0.95), rgba(75, 0, 130, 0.95)) !important;
            border-top: 2px solid #00ffaa !important;
            color: #00ffaa !important;
            font-family: 'Anta', sans-serif !important;
            text-shadow: 0 0 5px #00ffaa, 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
        }

        /* Announcement banner with warning styling */
        .announcement-bar_announcement-bar__gcGuh {
            background: linear-gradient(135deg, rgba(220, 20, 60, 0.9), rgba(139, 0, 0, 0.9)) !important;
            color: #fff !important;
            text-shadow: 0 0 8px #dc143c, 2px 2px 4px rgba(0, 0, 0, 0.9) !important;
            border: 2px solid #dc143c !important;
            font-family: 'Anta', sans-serif !important;
            font-weight: bold !important;
            box-shadow: 0 0 15px rgba(220, 20, 60, 0.5) !important;
        }

        /* Live stream header */
        .live-stream-player_header__58imR, .live-stream-player_live-stream-player__4CHjG {
            background: linear-gradient(135deg, rgba(25, 10, 50, 0.9), rgba(75, 0, 130, 0.8)) !important;
            border: 2px solid rgba(0, 255, 170, 0.6) !important;
            box-shadow: 0 0 15px rgba(138, 43, 226, 0.4) !important;
        }

        /* Status bar at bottom */
        .status-bar_status-bar__vR_Tm {
            background: linear-gradient(90deg, rgba(25, 10, 50, 0.95), rgba(138, 43, 226, 0.8)) !important;
            border-top: 2px solid #00ffaa !important;
            color: #00ffaa !important;
            font-family: 'Anta', sans-serif !important;
            text-shadow: 0 0 5px #00ffaa, 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
        }

        /* Cinema mode with cosmic glow */
        .chat_cinema__iXQz9 {
            border: 1px solid rgba(0, 255, 170, 0.3) !important;
            box-shadow: 0 0 20px rgba(138, 43, 226, 0.2) !important;
        }

        /* Apply fonts to all elements - Anta with standard fallbacks */
        html, body, div, span, p, a, button, input, textarea, select, option, 
        h1, h2, h3, h4, h5, h6, label, li, ul, ol, dl, dt, dd,
        .chat-input_input__jljCU, .top-bar-user_display-name__bzlpw,
        * {
            font-family: 'Anta', sans-serif !important;
        }

        /* Specific adjustments for key UI elements - REMOVED */

        /* Scrollbar styling with cosmic theme */
        ::-webkit-scrollbar {
            width: 10px;
        }
        
        ::-webkit-scrollbar-track {
            background: linear-gradient(180deg, rgba(25, 10, 50, 0.8), rgba(75, 0, 130, 0.8));
            border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #00ffaa, #8a2be2);
            border-radius: 5px;
            box-shadow: 0 0 8px rgba(0, 255, 170, 0.6);
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #00cc88, #9932cc);
            box-shadow: 0 0 12px rgba(0, 255, 170, 0.8);
        }

        /* Button hover effects with cosmic glow */
        button:hover {
            background: linear-gradient(135deg, rgba(0, 255, 170, 0.2), rgba(138, 43, 226, 0.2)) !important;
            color: #00ffaa !important;
            text-shadow: 0 0 8px #00ffaa, 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
            box-shadow: 0 0 15px rgba(0, 255, 170, 0.4) !important;
            transform: translateY(-1px) !important;
        }

        /* Links with cosmic styling */
        a {
            color: #00ffaa !important;
            text-decoration: underline !important;
            text-shadow: 0 0 5px #00ffaa, 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
        }
        
        a:hover {
            color: #8a2be2 !important;
            text-shadow: 0 0 8px #8a2be2, 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
        }

        /* Top bar buttons with cosmic backgrounds */
        .top-bar_red__1Up8r {
            background: linear-gradient(135deg, rgba(220, 20, 60, 0.8), rgba(139, 0, 0, 0.8)) !important;
            border: 1px solid #dc143c !important;
            color: #fff !important;
            text-shadow: 0 0 5px #dc143c, 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
        }

        .top-bar_green__S_hiA {
            background: linear-gradient(135deg, rgba(0, 255, 170, 0.8), rgba(0, 128, 128, 0.8)) !important;
            border: 1px solid #00ffaa !important;
            color: #000 !important;
            text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
        }

        .dropdown-button_dropdown-button__X_K4O {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.8), rgba(255, 140, 0, 0.8)) !important;
            border: 1px solid #ffd700 !important;
            color: #000 !important;
            text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
        }

        .item-nav-buttons_prize-machine__jnHNS {
            background: linear-gradient(135deg, rgba(255, 20, 147, 0.8), rgba(199, 21, 133, 0.8)) !important;
            border: 1px solid #ff1493 !important;
            color: #fff !important;
            text-shadow: 0 0 5px #ff1493, 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
        }

        .item-nav-buttons_market__28l6K {
            background: linear-gradient(135deg, rgba(255, 69, 0, 0.8), rgba(220, 20, 60, 0.8)) !important;
            border: 1px solid #ff4500 !important;
            color: #fff !important;
            text-shadow: 0 0 5px #ff4500, 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
        }

        .top-bar_link__0xN4F {
            background: linear-gradient(135deg, rgba(25, 10, 50, 0.8), rgba(75, 0, 130, 0.8)) !important;
            border: 1px solid #00ffaa !important;
            color: #00ffaa !important;
            text-shadow: 0 0 5px #00ffaa, 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
        }

        .chat_chat__2rdNg::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #00ffaa, #8a2be2, #ff1493, #00ffaa);
            background-size: 400% 400%;
            animation: cosmic-border 4s ease-in-out infinite;
            border-radius: 10px;
            z-index: -1;
        }

        @keyframes cosmic-border {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        .top-bar-user_top-bar-user__VUdJm {
            background: linear-gradient(135deg, rgba(138, 43, 226, 0.8), rgba(75, 0, 130, 0.6)) !important;
            border: 2px solid #00ffaa !important;
            border-radius: 6px !important;
            padding: 6px 8px !important;
            box-shadow: 
                0 0 15px rgba(0, 255, 170, 0.4),
                inset 0 0 10px rgba(138, 43, 226, 0.2) !important;
            position: relative !important;
            overflow: visible !important;
        }

        .top-bar-user_display-name__bzlpw {
            text-shadow: none !important;
            font-weight: unset !important;
            font-family: 'Anta', sans-serif !important;
            position: relative !important;
            z-index: 2 !important;
            letter-spacing: 0.5px !important;
        }
    `
  };

  // src/styles/themes/glowfish/scripts.js
  var scripts_default3 = [
    () => {
      console.log("[Cosmic Theme] Loading Anta font...");
      const linkElement = document.createElement("link");
      linkElement.rel = "stylesheet";
      linkElement.href = "https://fonts.googleapis.com/css2?family=Anta&display=swap";
      document.head.appendChild(linkElement);
      setTimeout(() => {
        console.log("[Cosmic Theme] Anta font loaded!");
      }, 1e3);
      return () => {
        console.log("[Cosmic Theme] Font loading cleaned up");
      };
    },
    () => {
      let observer = null;
      let styleEl = null;
      const getCosmicColor = (color) => {
        const cosmicColors = [
          "rgba(0, 255, 170, 0.8)",
          "rgba(138, 43, 226, 0.8)",
          "rgba(75, 0, 130, 0.8)",
          "rgba(255, 20, 147, 0.8)",
          "rgba(25, 10, 50, 0.8)",
          "rgba(0, 128, 128, 0.8)",
          "rgba(199, 21, 133, 0.8)",
          "rgba(72, 61, 139, 0.8)"
        ];
        const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!rgbMatch) return cosmicColors[0];
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        const brightness = (r * 299 + g * 587 + b * 114) / 1e3;
        if (brightness > 180) {
          if (g > r && g > b) return cosmicColors[5];
          if (r > g && r > b) return cosmicColors[3];
          if (b > r && b > g) return cosmicColors[2];
          return cosmicColors[4];
        } else if (brightness > 100) {
          if (g > r && g > b) return cosmicColors[0];
          if (r > g && r > b) return cosmicColors[6];
          if (b > r && b > g) return cosmicColors[1];
          return cosmicColors[7];
        } else {
          if (g > r && g > b) return cosmicColors[0];
          if (r > g && r > b) return cosmicColors[3];
          if (b > r && b > g) return cosmicColors[1];
          return cosmicColors[0];
        }
      };
      const applyDynamicStyling = () => {
        const userContainer = document.querySelector(".top-bar-user_top-bar-user__VUdJm");
        const displayName = document.querySelector(".top-bar-user_display-name__bzlpw");
        if (!userContainer || !displayName) return false;
        const computedStyle = window.getComputedStyle(displayName);
        const textColor = computedStyle.color;
        const bgColor = getCosmicColor(textColor);
        if (!styleEl) {
          styleEl = document.createElement("style");
          styleEl.id = "glowfish-dynamic-user-style";
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = `
                .top-bar-user_top-bar-user__VUdJm {
                    background: linear-gradient(135deg, ${bgColor}, ${bgColor.replace("0.8", "0.6")}) !important;
                    border: 2px solid #00ffaa !important;
                    border-radius: 6px !important;
                    padding: 6px 8px !important;
                    box-shadow: 
                        0 0 15px rgba(0, 255, 170, 0.4),
                        inset 0 0 10px rgba(138, 43, 226, 0.2) !important;
                    position: relative !important;
                    overflow: visible !important;
                }

                .top-bar-user_display-name__bzlpw {
                    text-shadow: none !important;
                    font-weight: unset !important;
                    font-family: 'Anta', sans-serif !important;
                    position: relative !important;
                    z-index: 2 !important;
                }
            `;
        console.log("[Glow Fish Theme] Applied cosmic styling");
        return true;
      };
      if (!applyDynamicStyling()) {
        observer = new MutationObserver(() => {
          if (applyDynamicStyling()) {
            console.log("[Glow Fish Theme] Dynamic user styling applied");
          }
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["style", "class"]
        });
      }
      return () => {
        if (styleEl && styleEl.parentNode) {
          styleEl.remove();
        }
        if (observer) {
          observer.disconnect();
        }
        console.log("[Glow Fish Theme] Dynamic styling cleaned up");
      };
    }
  ];

  // src/styles/themes/hacker/hacker.js
  var hacker_default = {
    name: "Hacker",
    author: "Grizzway",
    customPingSound: "https://files.catbox.moe/qeq32a.mp3",
    style: `
        /* Site background with hacker matrix effect */
        body, .layout_layout__5rz87, .select_options__t1ibN {
            background-image: url('https://i.imgur.com/atvhW9r.gif') !important;
            background-size: unset !important;
            background-position: center !important;
            background-repeat: repeat !important;
            color: #00ff00 !important;
            /* Removed text-shadow from body as requested */
        }

        /* Chat background - darker overlay for readability */
        .chat_chat__2rdNg {
            background-color: rgba(0, 0, 0, 0.85) !important;
            border: 1px solid #00ff00 !important;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3) !important;
        }
      
        /* Main UI elements with terminal green theme */
        .maejok-input-invalid, .maejok-context-message, .maejok-tts-warning-text,
        .chat_header__8kNPS, .top-bar_top-bar__X4p2n, .panel_body__O5yBA, .inventory_slots__D4IrC {
            background-color: rgba(0, 0, 0, 0.9) !important;
            border-color: #00ff00 !important;
            color: #00ff00 !important;
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.2) !important;
        }

        /* Header with hacker aesthetic */
        .panel_header__T2yFW {
            background-color: rgba(0, 20, 0, 0.95) !important;
            border-bottom: 2px solid #00ff00 !important;
            color: #00ff00 !important;
            text-shadow: 0 0 5px #00ff00 !important;
        }
        
        /* Top bar with terminal styling */
        .top-bar_top-bar__X4p2n {
            box-shadow: 0 2px 10px rgba(0, 255, 0, 0.3) !important;
            border-bottom: 1px solid #00ff00 !important;
        }

        /* Context message icons */
        .maejok-context-message svg path {
            fill: #00ff00 !important;
        }

        /* Stream containers with transparency */
        .hls-stream-player_hls-stream-player__BJiGl,
        .live-stream-player_container__A4sNR,
        .layout_center__Vsd3b {
            opacity: 1;
            border: 1px solid rgba(0, 255, 0, 0.3) !important;
        }
        
        /* Poll elements with hacker styling */
        .poll_footer__rALdX {
            background-color: rgba(0, 40, 0, 0.9) !important;
            border-top: 1px solid #00ff00 !important;
        }

        /* Poll buttons with hover effects */
        .poll_vote__b_NE0 button:disabled:hover,
        .poll_vote__b_NE0 button:hover {
            background-color: rgba(255, 0, 0, 0.8) !important;
            color: #ffffff !important;
            border-color: #ff0000 !important;
            box-shadow: 0 0 10px rgba(255, 0, 0, 0.5) !important;
            text-shadow: 0 0 5px #ff0000 !important;
        }

        /* TTS and SFX with glowing green effect */
        .chat-message-tts_chat-message-tts__2Jlxi,
        .chat-message-sfx_chat-message-sfx__OGv6q {
            border-color: #00ff00 !important;
            background-color: rgba(0, 40, 0, 0.9) !important;
            filter: drop-shadow(0 0 5px #00ff00) drop-shadow(0 0 10px #00ff00);
            box-shadow: inset 0 0 10px rgba(0, 255, 0, 0.2) !important;
        }
        
        .chat-message-tts_message__sWVCc,
        .chat-message-sfx_message__d2Rei {
            color: #00ff00 !important;
            text-shadow: 0 0 5px #00ff00 !important;
            font-family: 'Courier New', monospace !important;
        }
        
        .chat-message-tts_timestamp__pIVv0,
        .chat-message-sfx_timestamp__ilYfg {
            color: #00ff00 !important;
            font-weight: bold !important;
            text-shadow: 0 0 3px #00ff00 !important;
            font-family: 'Courier New', monospace !important;
        }

        /* Chat input with terminal styling */
        .chat_input__bsNw2 {
            background-color: rgba(0, 0, 0, 0.95) !important;
            border: 1px solid #00ff00 !important;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.3) !important;
        }

        /* Chat input text with hacker font */
        .chat-input_chat-input__GAgOF, .chat-input_input-wrapper__rjiu1, .chat-input_input__jljCU {
            color: #00ff00 !important;
            font-family: 'Courier New', monospace !important;
            text-shadow: 0 0 3px #00ff00 !important;
        }

        /* Stock ticker with terminal styling */
        .stocks-bar_stocks-bar__7kNv8 {
            background-color: rgba(0, 0, 0, 0.9) !important;
            border-top: 1px solid #00ff00 !important;
            color: #00ff00 !important;
            font-family: 'Courier New', monospace !important;
        }

        /* Announcement banner with warning styling */
        .announcement-bar_announcement-bar__gcGuh {
            background-color: rgba(20, 0, 0, 0.9) !important;
            color: #ff0000 !important;
            text-shadow: 0 0 5px #ff0000 !important;
            border: 1px solid #ff0000 !important;
            font-family: 'Courier New', monospace !important;
            font-weight: bold !important;
        }

        /* Live stream header */
        .live-stream-player_header__58imR, .live-stream-player_live-stream-player__4CHjG {
            background-color: rgba(0, 0, 0, 0.8) !important;
            border: 1px solid rgba(0, 255, 0, 0.5) !important;
        }

        /* Status bar at bottom */
        .status-bar_status-bar__vR_Tm {
            background-color: rgba(0, 0, 0, 0.95) !important;
            border-top: 1px solid #00ff00 !important;
            color: #00ff00 !important;
            font-family: 'Courier New', monospace !important;
        }

        /* Cinema mode with reduced opacity */
        .chat_cinema__iXQz9 {
            opacity: 1 !important;
        }

        /* Additional hacker styling for better immersion */
        * {
            font-family: 'Courier New', monospace !important;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.8);
        }
        
        ::-webkit-scrollbar-thumb {
            background: #00ff00;
            border-radius: 4px;
            box-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: #00cc00;
        }

        /* Button hover effects */
        button:hover {
            background-color: rgba(0, 255, 0, 0.1) !important;
            border-color: #00ff00 !important;
            color: #00ff00 !important;
            text-shadow: 0 0 5px #00ff00 !important;
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.3) !important;
        }

        /* Links with hacker styling */
        a {
            color: #00ff00 !important;
            text-decoration: underline !important;
            text-shadow: 0 0 3px #00ff00 !important;
        }
        
        a:hover {
            color: #00cc00 !important;
            text-shadow: 0 0 5px #00cc00 !important;
        }

        /* Top bar buttons with full opacity backgrounds */
        .top-bar_link__0xN4F,
        .top-bar_red__1Up8r,
        .top-bar_green__S_hiA,
        .dropdown-button_dropdown-button__X_K4O,
        .item-nav-buttons_prize-machine__jnHNS,
        .item-nav-buttons_market__28l6K {
            background-color: rgba(0, 0, 0, 1) !important;
        }

        /* Specific styling for red and green buttons to maintain their color identity */
        .top-bar_red__1Up8r {
            background-color: rgba(139, 0, 0, 1) !important;
        }

        .top-bar_green__S_hiA {
            background-color: rgba(0, 100, 0, 1) !important;
        }
    `
  };

  // src/styles/themes/hacker/scripts.js
  var scripts_default4 = [
    () => {
      let observer = null;
      let styleEl = null;
      const getPolarizingColor = (color) => {
        const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!rgbMatch) {
          const hexMatch = color.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
          if (hexMatch) {
            const r2 = parseInt(hexMatch[1], 16);
            const g2 = parseInt(hexMatch[2], 16);
            const b2 = parseInt(hexMatch[3], 16);
            return `rgb(${255 - r2}, ${255 - g2}, ${255 - b2})`;
          }
          return "rgba(0, 0, 0, 0.8)";
        }
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        const polarR = 255 - r;
        const polarG = 255 - g;
        const polarB = 255 - b;
        return `rgba(${polarR}, ${polarG}, ${polarB}, 0.8)`;
      };
      const applyDynamicStyling = () => {
        const userContainer = document.querySelector(".top-bar-user_top-bar-user__VUdJm");
        const displayName = document.querySelector(".top-bar-user_display-name__bzlpw");
        if (!userContainer || !displayName) return false;
        const computedStyle = window.getComputedStyle(displayName);
        const textColor = computedStyle.color;
        const bgColor = getPolarizingColor(textColor);
        if (!styleEl) {
          styleEl = document.createElement("style");
          styleEl.id = "hacker-dynamic-user-style";
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = `
                .top-bar-user_top-bar-user__VUdJm {
                    background-color: ${bgColor} !important;
                    border: 1px solid #00ff00 !important;
                    border-radius: 4px !important;
                    padding: 4px 8px !important;
                    box-shadow: 0 0 10px rgba(0, 255, 0, 0.3) !important;
                }

                .top-bar-user_display-name__bzlpw {
                    text-shadow: 
                        -1px -1px 0 #000,
                        1px -1px 0 #000,
                        -1px 1px 0 #000,
                        1px 1px 0 #000,
                        0 0 5px #00ff00 !important;
                    font-weight: bold !important;
                    font-family: 'Courier New', monospace !important;
                }
            `;
        console.log("[Hacker Theme] Applied dynamic styling - Text:", textColor, "Background:", bgColor);
        return true;
      };
      if (!applyDynamicStyling()) {
        observer = new MutationObserver(() => {
          if (applyDynamicStyling()) {
            console.log("[Hacker Theme] Dynamic user styling applied");
          }
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["style", "class"]
        });
      }
      return () => {
        if (styleEl && styleEl.parentNode) {
          styleEl.remove();
        }
        if (observer) {
          observer.disconnect();
        }
        console.log("[Hacker Theme] Dynamic styling cleaned up");
      };
    }
  ];

  // src/styles/themes/season2/season2.js
  var season2_default = {
    name: "Season 2",
    author: "Custom",
    customPingSound: "https://files.catbox.moe/alh72d.mp3",
    style: `
        @import url('https://fonts.googleapis.com/css2?family=Highway+Gothic:wght@400;700&display=swap');

        /* Site background with desert landscape */
        body, .layout_layout__5rz87, .select_options__t1ibN {
            background-image: url('https://i.imgur.com/fIiYl9I.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-attachment: fixed !important;
            color: #cbc6cb !important;
            font-family: 'Highway Gothic', Arial, sans-serif !important;
        }

        /* Base module styling with metallic gradient and texture overlay */
        .chat_header__8kNPS,
        .top-bar_top-bar__X4p2n,
        .inventory_slots__D4IrC,
        .maejok-input-invalid,
        .maejok-context-message,
        .maejok-tts-warning-text {
            background: 
                url('https://i.imgur.com/kogxhFB.png'),
                url('https://i.imgur.com/5WkCJKE.png'),
                linear-gradient(90deg, #88868b, #a7a2a6 10%, #a09b9f 50%, #8f8d93 75%, #625f60 90%, #4a4645) !important;
            background-size: 64px 64px, 32px 32px, cover !important;
            background-repeat: repeat, repeat, no-repeat !important;
            background-blend-mode: overlay, soft-light, normal !important;
            border-radius: 4px !important;
            border: 3px outset hsla(300, 5%, 79%, .75) !important;
            outline: 2px solid rgba(0, 0, 0, .5) !important;
            box-shadow: -2px 2px 1px rgba(0, 0, 0, .75), inset 0 0 4px #cbc6cb, 4px 4px 0 rgba(0, 0, 0, .75) !important;
            filter: drop-shadow(-2px 4px 0 rgba(0, 0, 0, .5)) !important;
            color: #cbc6cb !important;
            position: relative !important;
            z-index: 1 !important;
        }

        /* Panel header - clean styling without extra background, positioned better with screws */
        .panel_header__T2yFW {
            background: transparent !important;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            filter: none !important;
            color: #cbc6cb !important;
            position: relative !important;
            z-index: 1 !important;
            padding: 4px 24px 4px 24px !important; /* Reduced padding to align with screws */
            margin: 0 !important; /* Remove negative margin */
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
        }

        /* Panel body with sunken appearance and texture overlay - full width */
        .panel_body__O5yBA {
            background: 
                url('https://i.imgur.com/kogxhFB.png'),
                url('https://i.imgur.com/5WkCJKE.png'),
                linear-gradient(90deg, #88868b, #a7a2a6 10%, #a09b9f 50%, #8f8d93 75%, #625f60 90%, #4a4645) !important;
            background-size: 64px 64px, 32px 32px, cover !important;
            background-repeat: repeat, repeat, no-repeat !important;
            background-blend-mode: overlay, soft-light, normal !important;
            border-radius: 4px !important;
            contain: content !important;
            border: 3px inset hsla(300, 5%, 79%, .75) !important;
            outline: 2px solid rgba(0, 0, 0, .5) !important;
            box-shadow: inset -2px 2px 1px rgba(0, 0, 0, .75), inset 0 0 4px rgba(0, 0, 0, .5), inset 4px 4px 0 rgba(0, 0, 0, .75) !important;
            filter: drop-shadow(2px -2px 0 rgba(0, 0, 0, .3)) !important;
            color: #cbc6cb !important;
            position: relative !important;
            z-index: 1 !important;
            width: calc(100% - 16px) !important; /* Full width minus panel padding */
            margin: 0 8px !important; /* Center with panel padding */
            padding: 8px !important; /* Consistent padding */
            flex: 1 !important; /* Take remaining space */
        }

        /* Chat background - dark grey */
        .chat_chat__2rdNg {
            background: #2a2a2a !important;
            border-radius: 4px !important;
            border: 3px outset hsla(300, 5%, 79%, .75) !important;
            outline: 2px solid rgba(0, 0, 0, .5) !important;
            box-shadow: -2px 2px 1px rgba(0, 0, 0, .75), inset 0 0 4px #cbc6cb, 4px 4px 0 rgba(0, 0, 0, .75) !important;
            filter: drop-shadow(-2px 4px 0 rgba(0, 0, 0, .5)) !important;
            color: #cbc6cb !important;
            position: relative !important;
            z-index: 1 !important;
        }

        /* Add all 4 screws to video player, TTS/SFX messages, status bar, and panels */
        /* Top left screws */
        .layout_center__Vsd3b::before,
        .chat-message-tts_chat-message-tts__2Jlxi::before,
        .chat-message-sfx_chat-message-sfx__OGv6q::before,
        .status-bar_status-bar__vR_Tm::before {
            content: '';
            position: absolute;
            top: 8px;
            left: 8px;
            width: 16px;
            height: 16px;
            background-image: url('https://i.imgur.com/SisRwLf.png');
            background-size: contain;
            background-repeat: no-repeat;
            z-index: 10;
            pointer-events: none;
        }

        /* Top right screws */
        .layout_center__Vsd3b::after,
        .chat-message-tts_chat-message-tts__2Jlxi::after,
        .chat-message-sfx_chat-message-sfx__OGv6q::after,
        .status-bar_status-bar__vR_Tm::after {
            content: '';
            position: absolute;
            top: 8px;
            right: 8px;
            width: 16px;
            height: 16px;
            background-image: url('https://i.imgur.com/R89LMx7.png');
            background-size: contain;
            background-repeat: no-repeat;
            z-index: 10;
            pointer-events: none;
        }

        /* Smaller screws for panels - all 4 corners */
        /* Top left */
        .panel_panel__Tdjid::before {
            content: '';
            position: absolute;
            top: 8px;
            left: 8px;
            width: 12px;
            height: 12px;
            background-image: url('https://i.imgur.com/SisRwLf.png');
            background-size: contain;
            background-repeat: no-repeat;
            z-index: 10;
            pointer-events: none;
        }

        /* Top right */
        .panel_panel__Tdjid::after {
            content: '';
            position: absolute;
            top: 8px;
            right: 8px;
            width: 12px;
            height: 12px;
            background-image: url('https://i.imgur.com/R89LMx7.png');
            background-size: contain;
            background-repeat: no-repeat;
            z-index: 10;
            pointer-events: none;
        }

        /* Bottom screws styling - will be added via JavaScript to all screwed elements */
        .screw-bottom-left {
            position: absolute !important;
            bottom: 8px !important;
            left: 8px !important;
            width: 16px !important;
            height: 16px !important;
            background-image: url('https://i.imgur.com/5vm1q5n.png') !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            z-index: 10 !important;
            pointer-events: none !important;
        }

        .screw-bottom-right {
            position: absolute !important;
            bottom: 8px !important;
            right: 8px !important;
            width: 16px !important;
            height: 16px !important;
            background-image: url('https://i.imgur.com/UJD6Rbb.png') !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            z-index: 10 !important;
            pointer-events: none !important;
        }

        /* Smaller bottom screws for panels */
        .panel_panel__Tdjid .screw-bottom-left {
            width: 12px !important;
            height: 12px !important;
        }

        .panel_panel__Tdjid .screw-bottom-right {
            width: 12px !important;
            height: 12px !important;
        }

        /* Chat input styling */
        .chat_input__bsNw2 {
            border-radius: 4px !important;
            border: 3px outset hsla(300, 5%, 79%, .75) !important;
            outline: 2px solid rgba(0, 0, 0, .5) !important;
            box-shadow: -2px 2px 1px rgba(0, 0, 0, .75), inset 0 0 4px #cbc6cb, 4px 4px 0 rgba(0, 0, 0, .75) !important;
            filter: drop-shadow(-2px 4px 0 rgba(0, 0, 0, .5)) !important;
        }

        .chat-input_chat-input__GAgOF {
            background: 
                url('https://i.imgur.com/kogxhFB.png'),
                url('https://i.imgur.com/5WkCJKE.png'),
                linear-gradient(90deg, #88868b, #a7a2a6 10%, #a09b9f 50%, #8f8d93 75%, #625f60 90%, #4a4645) !important;
            background-size: 64px 64px, 32px 32px, cover !important;
            background-repeat: repeat, repeat, no-repeat !important;
            background-blend-mode: overlay, soft-light, normal !important;
            color: #cbc6cb !important;
            font-family: 'Highway Gothic', Arial, sans-serif !important;
        }

        /* Chat input text */
        .chat-input_input__jljCU {
            color: #cbc6cb !important;
            font-family: 'Highway Gothic', Arial, sans-serif !important;
        }

        /* Inner stream containers - remove metallic styling to avoid conflicts */
        .hls-stream-player_hls-stream-player__BJiGl,
        .live-stream-player_container__A4sNR,
        .live-stream-player_header__58imR,
        .live-stream-player_live-stream-player__4CHjG,
        [class*="live-stream-player-camera-"] {
            background: transparent !important;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            filter: none !important;
            position: relative !important;
            border-radius: 0 !important;
        }

        .stocks-panel_trade__n4bjt {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 4px !important;
            align-items: center !important;
            justify-content: flex-end !important;
        }

        /* Poll elements with texture overlay */
        .poll_footer__rALdX {
            background: 
                url('https://i.imgur.com/kogxhFB.png'),
                url('https://i.imgur.com/5WkCJKE.png'),
                linear-gradient(90deg, #88868b, #a7a2a6 10%, #a09b9f 50%, #8f8d93 75%, #625f60 90%, #4a4645) !important;
            background-size: 64px 64px, 32px 32px, cover !important;
            background-repeat: repeat, repeat, no-repeat !important;
            background-blend-mode: overlay, soft-light, normal !important;
            border-radius: 4px !important;
            border: 3px outset hsla(300, 5%, 79%, .75) !important;
            outline: 2px solid rgba(0, 0, 0, .5) !important;
            box-shadow: -2px 2px 1px rgba(0, 0, 0, .75), inset 0 0 4px #cbc6cb, 4px 4px 0 rgba(0, 0, 0, .75) !important;
            filter: drop-shadow(-2px 4px 0 rgba(0, 0, 0, .5)) !important;
        }

        /* Poll buttons - revert to original industrial styling */
        .poll_vote__b_NE0 button:disabled:hover,
        .poll_vote__b_NE0 button:hover {
            background: linear-gradient(90deg, #a7a2a6, #cbc6cb 20%, #b8b3b7 50%, #9c9a9f 75%, #7a777c 90%, #5d5a5b) !important;
            color: #2c2a2b !important;
            border: 3px inset hsla(300, 5%, 79%, .75) !important;
            outline: 2px solid rgba(0, 0, 0, .5) !important;
            box-shadow: inset -2px 2px 1px rgba(0, 0, 0, .75), inset 0 0 4px #e6e1e5, inset 4px 4px 0 rgba(0, 0, 0, .75) !important;
        }

        /* Links styling */
        a {
            color: #e6e1e5 !important;
            text-decoration: underline !important;
        }

        a:hover {
            color: #cbc6cb !important;
        }

        /* TTS and SFX styling with texture overlay */
        .chat-message-tts_chat-message-tts__2Jlxi,
        .chat-message-sfx_chat-message-sfx__OGv6q {
            background: 
                url('https://i.imgur.com/kogxhFB.png'),
                url('https://i.imgur.com/5WkCJKE.png'),
                linear-gradient(90deg, #88868b, #a7a2a6 10%, #a09b9f 50%, #8f8d93 75%, #625f60 90%, #4a4645) !important;
            background-size: 64px 64px, 32px 32px, cover !important;
            background-repeat: repeat, repeat, no-repeat !important;
            background-blend-mode: overlay, soft-light, normal !important;
            border-radius: 4px !important;
            border: 3px outset hsla(300, 5%, 79%, .75) !important;
            outline: 2px solid rgba(0, 0, 0, .5) !important;
            box-shadow: -2px 2px 1px rgba(0, 0, 0, .75), inset 0 0 4px #cbc6cb, 4px 4px 0 rgba(0, 0, 0, .75) !important;
            filter: drop-shadow(-2px 4px 0 rgba(0, 0, 0, .5)) !important;
            position: relative !important;
            padding: 8px 28px 8px 28px !important;
        }

        /* TTS/SFX icon positioning to avoid screw overlap */
        .chat-message-tts_icon__DWVlb,
        .chat-message-sfx_icon__DWVlb {
            margin-left: 30px !important;
        }

        /* TTS/SFX message area styling */
        .chat-message-tts_message__sWVCc,
        .chat-message-sfx_message__d2Rei {
            margin-left: 10px !important;
            margin-right: 10px !important;
        }

        .chat-message-tts_message__sWVCc,
        .chat-message-sfx_message__d2Rei,
        .chat-message-tts_timestamp__pIVv0,
        .chat-message-sfx_timestamp__ilYfg {
            color: #cbc6cb !important;
            font-family: 'Highway Gothic', Arial, sans-serif !important;
        }

        /* Chat timestamp styling - lime green */
        .chat-message-default_timestamp__sGwZy {
            color: #32ff32 !important;
            font-family: 'Highway Gothic', Arial, sans-serif !important;
        }

        .stocks-bar_stocks-bar__7kNv8 {
            background: black !important; 
        }

        /* Stock ticker with texture overlay */
        .layout_bottom__qRsMw {
            background: 
                url('https://i.imgur.com/kogxhFB.png'),
                url('https://i.imgur.com/5WkCJKE.png'),
                linear-gradient(90deg, #88868b, #a7a2a6 10%, #a09b9f 50%, #8f8d93 75%, #625f60 90%, #4a4645) !important;
            background-size: 64px 64px, 32px 32px, cover !important;
            background-repeat: repeat, repeat, no-repeat !important;
            background-blend-mode: overlay, soft-light, normal !important;
            border-radius: 4px !important;
            border: 3px outset hsla(300, 5%, 79%, .75) !important;
            outline: 2px solid rgba(0, 0, 0, .5) !important;
            box-shadow: -2px 2px 1px rgba(0, 0, 0, .75), inset 0 0 4px #cbc6cb, 4px 4px 0 rgba(0, 0, 0, .75) !important;
            filter: drop-shadow(-2px 4px 0 rgba(0, 0, 0, .5)) !important;
            color: #cbc6cb !important;
            font-family: 'Highway Gothic', Arial, sans-serif !important;
        }

        /* Announcement banner */
        .announcement-bar_announcement-bar__gcGuh {
            background: linear-gradient(90deg, #d4622a, #e67335 10%, #df6b30 50%, #cc5f2b 75%, #a04d21 90%, #7d3a19) !important;
            border-radius: 4px !important;
            border: 3px outset hsla(25, 70%, 60%, .75) !important;
            outline: 2px solid rgba(0, 0, 0, .5) !important;
            box-shadow: -2px 2px 1px rgba(0, 0, 0, .75), inset 0 0 4px #f2a373, 4px 4px 0 rgba(0, 0, 0, .75) !important;
            filter: drop-shadow(-2px 4px 0 rgba(0, 0, 0, .5)) !important;
            color: #fff !important;
            font-family: 'Highway Gothic', Arial, sans-serif !important;
            font-weight: bold !important;
        }

        /* Status bar with texture overlay and proper spacing for screws */
        .status-bar_status-bar__vR_Tm {
            background: 
                url('https://i.imgur.com/kogxhFB.png'),
                url('https://i.imgur.com/5WkCJKE.png'),
                linear-gradient(90deg, #88868b, #a7a2a6 10%, #a09b9f 50%, #8f8d93 75%, #625f60 90%, #4a4645) !important;
            background-size: 64px 64px, 32px 32px, cover !important;
            background-repeat: repeat, repeat, no-repeat !important;
            background-blend-mode: overlay, soft-light, normal !important;
            border-radius: 4px !important;
            border: 3px outset hsla(300, 5%, 79%, .75) !important;
            outline: 2px solid rgba(0, 0, 0, .5) !important;
            box-shadow: -2px 2px 1px rgba(0, 0, 0, .75), inset 0 0 4px #cbc6cb, 4px 4px 0 rgba(0, 0, 0, .75) !important;
            filter: drop-shadow(-2px 4px 0 rgba(0, 0, 0, .5)) !important;
            color: #cbc6cb !important;
            font-family: 'Highway Gothic', Arial, sans-serif !important;
            position: relative !important;
            padding: 10px 28px 10px 28px !important;
        }

        /* Panel styling with metallic area, screws, and texture overlay - better structure */
        .panel_panel__Tdjid {
            background: 
                url('https://i.imgur.com/kogxhFB.png'),
                url('https://i.imgur.com/5WkCJKE.png'),
                linear-gradient(90deg, #88868b, #a7a2a6 10%, #a09b9f 50%, #8f8d93 75%, #625f60 90%, #4a4645) !important;
            background-size: 64px 64px, 32px 32px, cover !important;
            background-repeat: repeat, repeat, no-repeat !important;
            background-blend-mode: overlay, soft-light, normal !important;
            border-radius: 4px !important;
            border: 3px outset hsla(300, 5%, 79%, .75) !important;
            outline: 2px solid rgba(0, 0, 0, .5) !important;
            box-shadow: -2px 2px 1px rgba(0, 0, 0, .75), inset 0 0 4px #cbc6cb, 4px 4px 0 rgba(0, 0, 0, .75) !important;
            filter: drop-shadow(-2px 4px 0 rgba(0, 0, 0, .5)) !important;
            position: relative !important;
            padding: 8px !important; /* Reduced padding */
            display: flex !important;
            flex-direction: column !important;
        }

        /* Ensure panel content containers use full width */
        .panel_no-padding__woODX .panel_body__O5yBA {
            padding: 0 !important;
            margin: 0 8px !important; /* Keep margin for visual spacing */
            width: calc(100% - 16px) !important; /* Account for margin */
        }

        /* Specific styling for stocks panel content */
        .stocks-panel_stocks__nVwY_ {
            width: 100% !important;
            max-width: none !important;
        }

        .stocks-panel_stocks-panel-item__eXyaT {
            width: 100% !important;
            gap: 2px !important;
            align-items: center !important;
            padding: 4px 0px !important;
            margin-bottom: 2px !important;
        }

        /* Stock panel buttons styling */
        .stocks-panel_button__T6lWW {
            background-image: url('https://i.imgur.com/rMQHz9Z.png') !important;
            background-size: 100% 100% !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            color: #000000 !important;
            border: 2px outset hsla(300, 5%, 79%, .75) !important;
            border-radius: 2px !important;
            padding: 2px 6px !important;
            font-family: 'Highway Gothic', Arial, sans-serif !important;
            font-size: 11px !important;
            margin: 0 1px !important;
            text-shadow: none !important;
        }

        .layout_layout__5rz87 {
            margin-right: 4px !important;
            overflow: unset !important;
        }   

        .layout_layout__5rz87 {
            padding: 8px !important;
        }

        .layout_bottom__qRsMw,
        .layout_center-bottom__yhDOH,
        .layout_center__Vsd3b {
            max-width: 1200px !important;
            width: 1200px !important;
            justify-self: right !important;
        }

        .layout_left__O2uku {
            width: 290px !important;
            overflow-x: clip !important;
            overflow-y: scroll !important;
        }
        
        .dropdown-button_dropdown-button-options__ZdUjh {
            background: 
                url('https://i.imgur.com/kogxhFB.png'),
                url('https://i.imgur.com/5WkCJKE.png'),
                linear-gradient(90deg, #88868b, #a7a2a6 10%, #a09b9f 50%, #8f8d93 75%, #625f60 90%, #4a4645) !important;
            border: 2px inset hsla(300, 5%, 79%, .75) !important;
        }

        .missions_mission__xabfm, .missions_complete__LiCcu, .missions_selected__35qyi {
            background-image: url('https://i.imgur.com/vOs9u2v.png') !important;
            background-repeat: no-repeat !important;
            background-size: cover !important;
            background-position-x: center !important;
            background-position-y: bottom !important;
            background-size: initial !important;
            background-repeat: initial !important;
            background-attachment: initial !important;
            background-origin: initial !important;
            background-clip: initial !important;
        }

        .stocks-panel_button__T6lWW:hover {
            border: 2px inset hsla(300, 5%, 79%, .75) !important;
            box-shadow: none !important;
            filter: none !important;
            background: 
                url('https://i.imgur.com/kogxhFB.png'),
                url('https://i.imgur.com/5WkCJKE.png'),
                linear-gradient(90deg, #88868b, #a7a2a6 10%, #a09b9f 50%, #8f8d93 75%, #625f60 90%, #4a4645) !important;
        }

        /* Inventory styling */
        .inventory_inventory__Qj_q0,
        .inventory_slots__D4IrC {
            width: 100% !important;
            max-width: none !important;
            background-color: black !important;
        }

        /* Inventory item styling */
        .inventory-item_inventory-item__B8vMd {
            background: linear-gradient(180deg, rgb(25, 25, 25), rgb(20, 20, 20) 20%, rgb(15, 15, 15) 50%, rgb(10, 10, 10) 75%,rgb(5, 5, 5) 90%,rgb(0, 0, 0)) !important;
            border: 2px inset hsl(0, 0.00%, 34.10%) !important;
            border-radius: 2px !important;
        }

        .inventory-item_inventory-item__B8vMd:not(.inventory-item_empty__HwVuD) {
            background: linear-gradient(180deg, rgb(25, 25, 25), rgb(20, 20, 20) 20%, rgb(15, 15, 15) 50%, rgb(10, 10, 10) 75%,rgb(5, 5, 5) 90%,rgb(0, 0, 0)) !important;
            border: 2px inset hsl(0, 0.00%, 34.10%) !important;
        }

        /* Cinema mode with texture overlay */
        .chat_cinema__iXQz9 {
            background: 
                url('https://i.imgur.com/kogxhFB.png'),
                url('https://i.imgur.com/5WkCJKE.png'),
                linear-gradient(90deg, #88868b, #a7a2a6 10%, #a09b9f 50%, #8f8d93 75%, #625f60 90%, #4a4645) !important;
            background-size: 64px 64px, 32px 32px, cover !important;
            background-repeat: repeat, repeat, no-repeat !important;
            background-blend-mode: overlay, soft-light, normal !important;
            border-radius: 4px !important;
            border: 3px outset hsla(300, 5%, 79%, .75) !important;
            outline: 2px solid rgba(0, 0, 0, .5) !important;
            box-shadow: -2px 2px 1px rgba(0, 0, 0, .75), inset 0 0 4px #cbc6cb, 4px 4px 0 rgba(0, 0, 0, .75) !important;
            filter: drop-shadow(-2px 4px 0 rgba(0, 0, 0, .5)) !important;
        }

        /* Apply Highway Gothic font to all elements */
        html, body, div, span, p, a, button, input, textarea, select, option,
        h1, h2, h3, h4, h5, h6, label, li, ul, ol, dl, dt, dd,
        .chat-input_input__jljCU, .top-bar-user_display-name__bzlpw,
        * {
            font-family: 'Highway Gothic', Arial, sans-serif !important;
        }

        .chat-input_input-wrapper__rjiu1 {
            background: #000000 !important;
            background-color: #000000 !important;
            font-family: 'Highway Gothic', Arial, sans-serif !important;
            color: #cbc6cb !important;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
            width: 12px;
        }

        ::-webkit-scrollbar-track {
            background: linear-gradient(180deg, #625f60, #4a4645);
            border-radius: 4px;
            border: 1px solid rgba(0, 0, 0, 0.5);
        }

        ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #a7a2a6, #88868b);
            border-radius: 4px;
            border: 2px outset hsla(300, 5%, 79%, .75);
            box-shadow: inset 0 0 2px #cbc6cb;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #cbc6cb, #a7a2a6);
        }

        /* Specific button classes with custom image background */
        #grizz-config-button,
        .dropdown-button_dropdown-button__X_K4O,
        .top-bar_link__0xN4F.top-bar_green__S_hiA,
        .top-bar_link__0xN4F.top-bar_red__1Up8r,
        .item-nav-buttons_prize-machine__jnHNS,
        .item-nav-buttons_market__28l6K {
            background-image: url('https://i.imgur.com/rMQHz9Z.png') !important;
            background-size: 100% 100% !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            border: 2px solid rgba(0, 0, 0, 0.3) !important;
            border-radius: 4px !important;
            color: #333 !important;
            font-family: 'Highway Gothic', Arial, sans-serif !important;
            padding: 8px 12px !important;
            text-shadow: none !important;
        }

        #grizz-config-button:hover,
        .dropdown-button_dropdown-button__X_K4O:hover,
        .top-bar_link__0xN4F.top-bar_green__S_hiA:hover,
        .top-bar_link__0xN4F.top-bar_red__1Up8r:hover,
        .item-nav-buttons_prize-machine__jnHNS:hover,
        .item-nav-buttons_market__28l6K:hover {
            background-image: url('https://i.imgur.com/rMQHz9Z.png') !important;
            background-size: 100% 100% !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            color: #000 !important;
            filter: brightness(1.5) saturate(1) !important;
            box-shadow: 0 0 8px hsla(0, 0%, 100%, 0.8) !important;
            text-shadow: none !important;
        }

        /* User display - remove background styling */
        .top-bar-user_top-bar-user__VUdJm {
            background: none !important;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            filter: none !important;
            padding: 6px 8px !important;
            position: relative !important;
        }

        .top-bar-user_display-name__bzlpw {
            font-family: 'Highway Gothic', Arial, sans-serif !important;
            font-weight: normal !important;
        }

        .chat_presence__90XuO {
            color: lime !important;
            background: black !important;
            padding-left: 5px !important;
        }

        /* Logo replacement with video - container styling */
        .top-bar_logo__XL0_C {
            width: 400px !important;
            height: 60px !important;
            padding-top: 4px !important;
            padding-bottom: 4px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            position: relative !important;
        }

        /* Hide all original logo images */
        .top-bar_logo__XL0_C img {
            display: none !important;
        }

        /* Video element styling - doubled size with overflow cropping */
        .top-bar_logo__XL0_C video {
            width: 484px !important;
            height: 120px !important;
            object-fit: contain !important;
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 1 !important;
        }

        /* Cinema mode overrides - ONLY for true cinema mode */
        .live-stream-player_cinema__yPkWC .layout_center__Vsd3b {
            background: transparent !important;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            filter: none !important;
            padding: 0 !important;
            border-radius: 0 !important;
        }

        .experience-daily-login_experience-daily-login__S_LRK {
            background-image: url('https://i.imgur.com/GDKPrL7.png') !important;
            background-size: 100% 100% !important;
        }

        .experience-daily-login_experience-daily-login__S_LRK:hover {    
            background-image: url('https://i.imgur.com/GDKPrL7.png') !important;
            background-size: 100% 100% !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            color: #000 !important;
            filter: brightness(1.5) saturate(1) !important;
            box-shadow: 0 0 8px hsla(0, 0%, 100%, 0.8) !important;
            text-shadow: none !important;
        }

        .live-stream-player_cinema__yPkWC .layout_center__Vsd3b::before,
        .live-stream-player_cinema__yPkWC .layout_center__Vsd3b::after,
        .live-stream-player_cinema__yPkWC .screw-bottom-left,
        .live-stream-player_cinema__yPkWC .screw-bottom-right {
            display: none !important;
        }

        .live-stream-player_cinema__yPkWC .layout_bottom__qRsMw,
        .live-stream-player_cinema__yPkWC .layout_center-bottom__yhDOH,
        .live-stream-player_cinema__yPkWC .layout_center__Vsd3b {
            max-width: none !important;
            width: 100% !important;
            justify-self: stretch !important;
        }
    `
  };

  // src/styles/themes/season2/scripts.js
  var scripts_default5 = [
    () => {
      console.log("[Season 2 Theme] Theme warning initialized...");
      const showThemeWarning = () => {
        alert("This theme is a bit broken. If any issues are visible, just refresh. Clickable zones are broken in theater mode and in normal mode in some rooms");
        console.log("[Season 2 Theme] Warning alert displayed");
      };
      setTimeout(showThemeWarning, 500);
      return () => {
        console.log("[Season 2 Theme] Theme warning cleaned up");
      };
    },
    () => {
      console.log("[Season 2 Theme] Cinema mode layout manager initialized...");
      let cinemaObserver = null;
      let lastCinemaState2 = false;
      let cinemaOverrideStyleElement = null;
      const cinemaLayoutOverrides = `
            /* Only apply cinema overrides to ACTUAL cinema mode with the proper class */
            .live-stream-player_cinema__yPkWC .layout_center__Vsd3b {
                background: transparent !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
                filter: none !important;
                padding: 0 !important;
                border-radius: 0 !important;
            }

            .live-stream-player_cinema__yPkWC .layout_center__Vsd3b::before,
            .live-stream-player_cinema__yPkWC .layout_center__Vsd3b::after {
                display: none !important;
            }

            .live-stream-player_cinema__yPkWC .layout_bottom__qRsMw,
            .live-stream-player_cinema__yPkWC .layout_center-bottom__yhDOH,
            .live-stream-player_cinema__yPkWC .layout_center__Vsd3b {
                max-width: none !important;
                width: 100% !important;
                justify-self: stretch !important;
            }

            .live-stream-player_cinema__yPkWC .layout_left__O2uku {
                width: auto !important;
            }

            .live-stream-player_cinema__yPkWC .hls-stream-player_hls-stream-player__BJiGl,
            .live-stream-player_cinema__yPkWC .live-stream-player_container__A4sNR,
            .live-stream-player_cinema__yPkWC .live-stream-player_header__58imR,
            .live-stream-player_cinema__yPkWC .live-stream-player_live-stream-player__4CHjG,
            .live-stream-player_cinema__yPkWC [class*="live-stream-player-camera-"] {
                background: transparent !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
                filter: none !important;
                border-radius: 0 !important;
                padding: 0 !important;
            }

            .live-stream-player_cinema__yPkWC .screw-bottom-left,
            .live-stream-player_cinema__yPkWC .screw-bottom-right {
                display: none !important;
            }

            .live-stream-player_cinema__yPkWC .season2-side-image-left,
            .live-stream-player_cinema__yPkWC .season2-side-image-right {
                display: none !important;
            }

            /* Force remove metallic class in cinema mode */
            .live-stream-player_cinema__yPkWC .season2-metallic-background {
                background: transparent !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
                filter: none !important;
                padding: 0 !important;
                border-radius: 0 !important;
            }

            .live-stream-player_cinema__yPkWC {
                position: fixed !important;
            }
        `;
      const createCinemaOverrides = () => {
        if (!cinemaOverrideStyleElement) {
          cinemaOverrideStyleElement = document.createElement("style");
          cinemaOverrideStyleElement.id = "season2-cinema-overrides";
          cinemaOverrideStyleElement.textContent = cinemaLayoutOverrides;
          document.head.appendChild(cinemaOverrideStyleElement);
          console.log("[Season 2 Theme] Cinema layout overrides applied");
        }
      };
      const removeCinemaOverrides = () => {
        if (cinemaOverrideStyleElement) {
          cinemaOverrideStyleElement.remove();
          cinemaOverrideStyleElement = null;
          console.log("[Season 2 Theme] Cinema layout overrides removed");
        }
      };
      const checkCinemaMode = () => {
        const isInCinemaMode = document.querySelector(".live-stream-player_cinema__yPkWC") !== null;
        if (isInCinemaMode !== lastCinemaState2) {
          console.log("[Season 2 Theme] Cinema mode state changed:", isInCinemaMode);
          lastCinemaState2 = isInCinemaMode;
          if (isInCinemaMode) {
            createCinemaOverrides();
            document.dispatchEvent(new CustomEvent("season2-cinema-mode-changed", { detail: { cinemaMode: true } }));
          } else {
            removeCinemaOverrides();
            document.dispatchEvent(new CustomEvent("season2-cinema-mode-changed", { detail: { cinemaMode: false } }));
          }
        }
      };
      setTimeout(checkCinemaMode, 100);
      cinemaObserver = new MutationObserver((mutations) => {
        let shouldCheck = false;
        mutations.forEach((mutation) => {
          if (mutation.type === "attributes" && mutation.attributeName === "class") {
            if (mutation.target.classList.contains("live-stream-player_cinema__yPkWC") || mutation.oldValue?.includes("live-stream-player_cinema__yPkWC")) {
              shouldCheck = true;
            }
          } else if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1 && (node.classList?.contains("live-stream-player_cinema__yPkWC") || node.querySelector?.(".live-stream-player_cinema__yPkWC"))) {
                shouldCheck = true;
              }
            });
          }
        });
        if (shouldCheck) {
          setTimeout(checkCinemaMode, 50);
        }
      });
      cinemaObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"],
        attributeOldValue: true
      });
      const intervalCheck = setInterval(checkCinemaMode, 2e3);
      document.addEventListener("fullscreenchange", () => {
        setTimeout(checkCinemaMode, 100);
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "f" || e.key === "F" || e.key === "Escape") {
          setTimeout(checkCinemaMode, 200);
        }
      });
      return () => {
        if (cinemaObserver) {
          cinemaObserver.disconnect();
        }
        if (intervalCheck) {
          clearInterval(intervalCheck);
        }
        removeCinemaOverrides();
        console.log("[Season 2 Theme] Cinema mode layout manager cleaned up");
      };
    },
    () => {
      console.log("[Season 2 Theme] Bottom screws manager initialized...");
      const addBottomScrews = () => {
        const screwedSelectors = [
          ".layout_center__Vsd3b",
          ".chat-message-tts_chat-message-tts__2Jlxi",
          ".chat-message-sfx_chat-message-sfx__OGv6q",
          ".status-bar_status-bar__vR_Tm",
          ".panel_panel__Tdjid"
        ];
        screwedSelectors.forEach((selector) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            if (element.querySelector(".screw-bottom-left") || element.querySelector(".screw-bottom-right") || element.closest(".live-stream-player_cinema__yPkWC")) {
              return;
            }
            const bottomLeftScrew = document.createElement("div");
            bottomLeftScrew.className = "screw-bottom-left";
            element.appendChild(bottomLeftScrew);
            const bottomRightScrew = document.createElement("div");
            bottomRightScrew.className = "screw-bottom-right";
            element.appendChild(bottomRightScrew);
          });
        });
      };
      addBottomScrews();
      const screwObserver = new MutationObserver((mutations) => {
        let shouldAddScrews = false;
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                if (node.matches && (node.matches(".layout_center__Vsd3b") || node.matches(".chat-message-tts_chat-message-tts__2Jlxi") || node.matches(".chat-message-sfx_chat-message-sfx__OGv6q") || node.matches(".status-bar_status-bar__vR_Tm") || node.matches(".panel_panel__Tdjid"))) {
                  shouldAddScrews = true;
                } else if (node.querySelector && (node.querySelector(".layout_center__Vsd3b") || node.querySelector(".chat-message-tts_chat-message-tts__2Jlxi") || node.querySelector(".chat-message-sfx_chat-message-sfx__OGv6q") || node.querySelector(".status-bar_status-bar__vR_Tm") || node.querySelector(".panel_panel__Tdjid"))) {
                  shouldAddScrews = true;
                }
              }
            });
          }
        });
        if (shouldAddScrews) {
          setTimeout(addBottomScrews, 50);
        }
      });
      screwObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
      const screwIntervalCheck = setInterval(addBottomScrews, 2e3);
      return () => {
        screwObserver.disconnect();
        clearInterval(screwIntervalCheck);
        const screws = document.querySelectorAll(".screw-bottom-left, .screw-bottom-right");
        screws.forEach((screw) => screw.remove());
        console.log("[Season 2 Theme] Bottom screws manager cleaned up");
      };
    },
    () => {
      console.log("[Season 2 Theme] Metallic background manager initialized...");
      let metallicStyleElement = null;
      let processedElements = /* @__PURE__ */ new Set();
      let sideImagesApplied = /* @__PURE__ */ new Set();
      let isInCinemaMode = false;
      const metallicStyles = `
            .season2-metallic-background:not(.live-stream-player_cinema__yPkWC):not(.live-stream-player_cinema__yPkWC *) {
                background: url('https://i.imgur.com/kogxhFB.png'), url('https://i.imgur.com/5WkCJKE.png'), linear-gradient(90deg, #88868b, #a7a2a6 10%, #a09b9f 50%, #8f8d93 75%, #625f60 90%, #4a4645) !important;
                background-size: 64px 64px, 32px 32px, cover !important;
                background-repeat: repeat, repeat, no-repeat !important;
                background-blend-mode: overlay, soft-light, normal !important;
                padding: 28px 28px 28px 28px !important;
                border-radius: 4px !important;
                border: 3px outset hsla(300, 5%, 79%, .75) !important;
                outline: 2px solid rgba(0, 0, 0, .5) !important;
                box-shadow: -2px 2px 1px rgba(0, 0, 0, .75), inset 0 0 4px #cbc6cb, 4px 4px 0 rgba(0, 0, 0, .75) !important;
                filter: drop-shadow(-2px 4px 0 rgba(0, 0, 0, .5)) !important;
                position: relative !important;
                overflow-y: scroll !important;
            }

            /* Force remove metallic styling in cinema mode */
            .live-stream-player_cinema__yPkWC .season2-metallic-background,
            .live-stream-player_cinema__yPkWC .layout_center__Vsd3b {
                background: transparent !important;
                padding: 0 !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
                filter: none !important;
                border-radius: 0 !important;
            }

            /* Adjust video player when side images are present - make it much wider */
            .has-side-images .live-stream-player_container__A4sNR {
                margin: 0 20px !important;
                max-width: calc(100% - 40px) !important;
            }

            .has-side-images .hls-stream-player_hls-stream-player__BJiGl {
                margin: 0 auto !important;
                max-width: calc(100% - 40px) !important;
            }

            /* Side images - positioned between the screws, much taller */
            .season2-side-image-left,
            .season2-side-image-right {
                position: absolute;
                top: 100px;
                bottom: 10px;
                width: 65px;
                height: 500px !important;
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
                pointer-events: none;
                z-index: 10;
                opacity: 0.8;
            }

            .season2-side-image-left {
                left: 5px;
                background-image: url('https://i.imgur.com/Zv6Uh7Y.png');
            }

            .season2-side-image-right {
                right: 0px;
                background-image: url('https://i.imgur.com/VANubO2.png');
            }

            /* Hide side images in cinema mode */
            .live-stream-player_cinema__yPkWC .season2-side-image-left,
            .live-stream-player_cinema__yPkWC .season2-side-image-right {
                display: none !important;
            }
        `;
      const createMetallicStyles = () => {
        if (!metallicStyleElement) {
          metallicStyleElement = document.createElement("style");
          metallicStyleElement.id = "season2-metallic-styles";
          metallicStyleElement.textContent = metallicStyles;
          document.head.appendChild(metallicStyleElement);
          console.log("[Season 2 Theme] Metallic styles applied");
        }
      };
      const removeMetallicStyles = () => {
        if (metallicStyleElement) {
          metallicStyleElement.remove();
          metallicStyleElement = null;
        }
        processedElements.forEach((element) => {
          if (element && element.parentNode) {
            element.classList.remove("season2-metallic-background");
            element.classList.remove("has-side-images");
            element.style.removeProperty("background");
            element.style.removeProperty("background-size");
            element.style.removeProperty("background-repeat");
            element.style.removeProperty("background-blend-mode");
            element.style.removeProperty("padding");
            element.style.removeProperty("border-radius");
            element.style.removeProperty("border");
            element.style.removeProperty("outline");
            element.style.removeProperty("box-shadow");
            element.style.removeProperty("filter");
            const leftImage = element.querySelector(".season2-side-image-left");
            const rightImage = element.querySelector(".season2-side-image-right");
            if (leftImage) leftImage.remove();
            if (rightImage) rightImage.remove();
          }
        });
        processedElements.clear();
        sideImagesApplied.clear();
        console.log("[Season 2 Theme] Metallic styles cleaned up");
      };
      const addSideImages = (element) => {
        if (sideImagesApplied.has(element)) return;
        const selectedStream = document.querySelector(".live-streams_selected-live-stream__bFOAj");
        if (!selectedStream || isInCinemaMode) return;
        element.classList.add("has-side-images");
        const leftImage = document.createElement("div");
        leftImage.className = "season2-side-image-left";
        element.appendChild(leftImage);
        const rightImage = document.createElement("div");
        rightImage.className = "season2-side-image-right";
        element.appendChild(rightImage);
        sideImagesApplied.add(element);
        console.log("[Season 2 Theme] Added side images to metallic background");
      };
      const removeSideImages = (element) => {
        element.classList.remove("has-side-images");
        const leftImage = element.querySelector(".season2-side-image-left");
        const rightImage = element.querySelector(".season2-side-image-right");
        if (leftImage) leftImage.remove();
        if (rightImage) rightImage.remove();
        sideImagesApplied.delete(element);
      };
      const applyMetallicBackground = () => {
        isInCinemaMode = document.querySelector(".live-stream-player_cinema__yPkWC") !== null;
        const hasSelectedStream = document.querySelector(".live-streams_selected-live-stream__bFOAj") !== null;
        const centerElements = document.querySelectorAll(".layout_center__Vsd3b");
        centerElements.forEach((element) => {
          if (isInCinemaMode) {
            element.classList.remove("season2-metallic-background");
            removeSideImages(element);
            element.style.removeProperty("background");
            element.style.removeProperty("background-size");
            element.style.removeProperty("background-repeat");
            element.style.removeProperty("background-blend-mode");
            element.style.removeProperty("padding");
            element.style.removeProperty("border-radius");
            element.style.removeProperty("border");
            element.style.removeProperty("outline");
            element.style.removeProperty("box-shadow");
            element.style.removeProperty("filter");
            if (processedElements.has(element)) {
              processedElements.delete(element);
            }
            console.log("[Season 2 Theme] Removed metallic background for cinema mode");
            return;
          }
          if (!processedElements.has(element)) {
            element.classList.add("season2-metallic-background");
            processedElements.add(element);
            console.log("[Season 2 Theme] Added metallic background");
          }
          if (hasSelectedStream && !isInCinemaMode) {
            addSideImages(element);
          } else {
            removeSideImages(element);
          }
        });
      };
      const handleCinemaModeChange = (event) => {
        isInCinemaMode = event.detail.cinemaMode;
        console.log("[Season 2 Theme] Received cinema mode change event:", isInCinemaMode);
        setTimeout(applyMetallicBackground, 10);
      };
      document.addEventListener("season2-cinema-mode-changed", handleCinemaModeChange);
      createMetallicStyles();
      setTimeout(applyMetallicBackground, 100);
      const metallicObserver = new MutationObserver((mutations) => {
        let shouldReapply = false;
        mutations.forEach((mutation) => {
          if (mutation.type === "attributes" && mutation.attributeName === "class") {
            const target = mutation.target;
            if (target.classList.contains("live-stream-player_cinema__yPkWC") || mutation.oldValue?.includes("live-stream-player_cinema__yPkWC") || target.classList.contains("live-streams_selected-live-stream__bFOAj") || mutation.oldValue?.includes("live-streams_selected-live-stream__bFOAj")) {
              shouldReapply = true;
            }
          } else if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                if (node.matches && (node.matches(".layout_center__Vsd3b") || node.matches(".live-streams_selected-live-stream__bFOAj"))) {
                  shouldReapply = true;
                } else if (node.querySelector && (node.querySelector(".layout_center__Vsd3b") || node.querySelector(".live-streams_selected-live-stream__bFOAj"))) {
                  shouldReapply = true;
                }
              }
            });
            mutation.removedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                if (node.matches && node.matches(".live-streams_selected-live-stream__bFOAj")) {
                  shouldReapply = true;
                } else if (node.querySelector && node.querySelector(".live-streams_selected-live-stream__bFOAj")) {
                  shouldReapply = true;
                }
              }
            });
          }
        });
        if (shouldReapply) {
          setTimeout(applyMetallicBackground, 50);
        }
      });
      metallicObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"],
        attributeOldValue: true
      });
      const metallicCheck = setInterval(applyMetallicBackground, 1e3);
      return () => {
        document.removeEventListener("season2-cinema-mode-changed", handleCinemaModeChange);
        metallicObserver.disconnect();
        clearInterval(metallicCheck);
        removeMetallicStyles();
        console.log("[Season 2 Theme] Metallic background manager cleaned up");
      };
    },
    () => {
      console.log("[Season 2 Theme] Live stream frames manager initialized...");
      let frameStyleElement = null;
      let processedStreams = /* @__PURE__ */ new Set();
      const frameImages = [
        "https://i.imgur.com/lxbb3GJ.png",
        "https://i.imgur.com/8ws8gZA.png",
        "https://i.imgur.com/yPhLQ71.png",
        "https://i.imgur.com/CTby1Bz.png",
        "https://i.imgur.com/RcdZMVG.png",
        "https://i.imgur.com/YHN1Krs.png",
        "https://i.imgur.com/VuQs5Rx.png",
        "https://i.imgur.com/okBDXAU.png"
      ];
      const frameStyles = `
            .live-streams_live-streams-grid__Tp4ah {
                padding: 20px !important;
                gap: 24px !important;
                overflow: visible !important;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) !important;
                justify-items: center !important;
                align-items: center !important;
                min-height: 100% !important;
                display: grid !important;
            }
    
            .season2-stream-frame {
                position: absolute !important;
                top: -18px !important;
                left: -18px !important;
                right: -18px !important;
                bottom: -18px !important;
                background-size: 100% 100% !important;
                background-repeat: no-repeat !important;
                pointer-events: none !important;
                z-index: 0 !important;
            }
    
            .live-streams_live-stream__4Q7MX {
                position: relative !important;
                z-index: 1 !important;
                overflow: visible !important;
                margin: 0 !important;
                width: 220px !important;
                height: 165px !important;
            }
    
            .live-streams_live-stream__4Q7MX .live-stream_live-stream__uVezO {
                position: relative !important;
                z-index: 2 !important;
                width: 97% !important;
                height: 96% !important;
                border: none !important;
                background: none !important;
                padding: 0 !important;
                margin: 0 !important;
                left: 2px !important;
                box-shadow: unset !important;
            }
    
            .live-streams_live-stream__4Q7MX .live-stream_inner__n9syF {
                position: absolute !important;
                top: 0px !important;
                left: 0px !important;
                right: 18px !important;
                bottom: 20px !important;
                z-index: 1 !important;
                overflow: hidden !important;
            }
    
            .live-streams_live-stream__4Q7MX .live-stream_thumbnail__RN6pc {
                width: 100% !important;
                height: 100% !important;
                position: relative !important;
            }
    
            .live-streams_live-stream__4Q7MX .live-stream_thumbnail__RN6pc img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
            }
    
            .live-streams_live-stream__4Q7MX .live-stream_info__23np4 {
                position: absolute !important;
                top: 0px !important;
                left: 0px !important;
                right: 20px !important;
                z-index: 3 !important;
                padding: 2px 4px !important;
                font-size: 14px !important;
                text-align: left !important;
                color: #00ff00 !important;
                text-shadow: 0 0 2px rgba(0, 255, 0, 0.8) !important;
                background: none !important;
                height: auto !important;
                max-height: 40px !important;
            }
    
            /* Special handling for split screens (like the hallway cameras) */
            .live-streams_live-stream__4Q7MX.live-streams_split__Bnydk .live-stream_inner__n9syF {
                position: relative !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                height: 100% !important;
                gap: 0px !important;
            }
    
            .live-streams_live-stream__4Q7MX.live-streams_split__Bnydk .live-stream_info__23np4 {
                position: relative !important;
                top: 0px !important;
                left: 0px !important;
                right: 0px !important;
                gap: 0px !important;
            }
    
            .live-streams_live-stream__4Q7MX .live-stream_name__ngU04 {
                font-size: 14px !important;
                font-weight: bold !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                white-space: nowrap !important;
                margin-bottom: -2px !important;
            }
    
            .live-streams_live-stream__4Q7MX .live-stream_viewers__UeUvp {
                font-size: 14px !important;
                opacity: 0.9 !important;
            }
    
            /* Ensure the grid container doesn't clip overflow */
            .live-streams_live-streams__BYV96 {
                overflow: visible !important;
                height: 100% !important;
            }
    
            .main-panel_main-panel__4RhyF {
                overflow: visible !important;
                height: 100% !important;
            }
        `;
      const createFrameStyles = () => {
        if (!frameStyleElement) {
          frameStyleElement = document.createElement("style");
          frameStyleElement.id = "season2-frame-styles";
          frameStyleElement.textContent = frameStyles;
          document.head.appendChild(frameStyleElement);
          console.log("[Season 2 Theme] Frame styles applied");
        }
      };
      const removeFrameStyles = () => {
        if (frameStyleElement) {
          frameStyleElement.remove();
          frameStyleElement = null;
        }
        const frameElements = document.querySelectorAll(".season2-stream-frame");
        frameElements.forEach((frame) => frame.remove());
        processedStreams.forEach((stream) => {
          if (stream && stream.parentNode) {
            stream.style.transform = "";
            stream.style.maxWidth = "";
            stream.style.width = "";
            stream.style.margin = "";
          }
        });
        processedStreams.clear();
        console.log("[Season 2 Theme] Frame styles and elements cleaned up");
      };
      const addStreamFrames = () => {
        const streamElements = document.querySelectorAll(".live-streams_live-stream__4Q7MX");
        streamElements.forEach((stream, index) => {
          if (processedStreams.has(stream)) {
            return;
          }
          const frame = document.createElement("div");
          frame.className = "season2-stream-frame";
          const frameImage = frameImages[index % frameImages.length];
          frame.style.backgroundImage = `url('${frameImage}')`;
          stream.insertBefore(frame, stream.firstChild);
          processedStreams.add(stream);
          console.log(`[Season 2 Theme] Added frame to stream ${index + 1} with image ${frameImage}`);
        });
      };
      createFrameStyles();
      setTimeout(addStreamFrames, 100);
      const frameObserver = new MutationObserver((mutations) => {
        let shouldAddFrames = false;
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                if (node.matches && node.matches(".live-streams_live-stream__4Q7MX")) {
                  shouldAddFrames = true;
                } else if (node.querySelector && node.querySelector(".live-streams_live-stream__4Q7MX")) {
                  shouldAddFrames = true;
                }
              }
            });
          }
        });
        if (shouldAddFrames) {
          setTimeout(addStreamFrames, 50);
        }
      });
      frameObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
      const frameCheck = setInterval(addStreamFrames, 2e3);
      return () => {
        frameObserver.disconnect();
        clearInterval(frameCheck);
        removeFrameStyles();
        console.log("[Season 2 Theme] Live stream frames manager cleaned up");
      };
    },
    () => {
      console.log("[Season 2 Theme] Logo video replacement initialized...");
      let processedButtons = /* @__PURE__ */ new Set();
      const replaceLogoWithVideo = () => {
        const logoButton = document.querySelector(".top-bar_logo__XL0_C");
        if (logoButton && !logoButton.querySelector("video")) {
          const images = logoButton.querySelectorAll("img");
          images.forEach((img) => {
            img.style.display = "none";
          });
          const video = document.createElement("video");
          video.src = "https://files.catbox.moe/jaqcvs.webm";
          video.autoplay = true;
          video.loop = true;
          video.muted = true;
          video.style.width = "484px";
          video.style.height = "120px";
          video.style.objectFit = "contain";
          video.style.position = "absolute";
          video.style.top = "50%";
          video.style.left = "50%";
          video.style.transform = "translate(-50%, -50%)";
          video.style.zIndex = "1";
          video.setAttribute("playsinline", "");
          video.classList.add("season2-logo-video");
          if (!logoButton.dataset.originalStyles) {
            logoButton.dataset.originalStyles = JSON.stringify({
              position: logoButton.style.position,
              width: logoButton.style.width,
              height: logoButton.style.height,
              overflow: logoButton.style.overflow,
              display: logoButton.style.display,
              alignItems: logoButton.style.alignItems,
              justifyContent: logoButton.style.justifyContent
            });
          }
          logoButton.style.position = "relative";
          logoButton.style.width = "242px";
          logoButton.style.height = "60px";
          logoButton.style.overflow = "hidden";
          logoButton.style.display = "flex";
          logoButton.style.alignItems = "center";
          logoButton.style.justifyContent = "center";
          logoButton.appendChild(video);
          processedButtons.add(logoButton);
          video.play().catch((e) => {
            console.log("[Season 2 Theme] Video autoplay failed, will try on user interaction");
          });
          console.log("[Season 2 Theme] Logo replaced with video");
        }
      };
      const cleanupLogoVideo = () => {
        const videos = document.querySelectorAll(".season2-logo-video");
        videos.forEach((video) => {
          video.remove();
        });
        processedButtons.forEach((button) => {
          if (button.dataset.originalStyles) {
            const originalStyles = JSON.parse(button.dataset.originalStyles);
            Object.keys(originalStyles).forEach((prop) => {
              if (originalStyles[prop]) {
                button.style[prop] = originalStyles[prop];
              } else {
                button.style.removeProperty(prop);
              }
            });
            delete button.dataset.originalStyles;
          }
          const images = button.querySelectorAll("img");
          images.forEach((img) => {
            img.style.display = "";
          });
        });
        processedButtons.clear();
        console.log("[Season 2 Theme] Logo video elements cleaned up");
      };
      setTimeout(replaceLogoWithVideo, 100);
      const logoObserver = new MutationObserver(() => {
        setTimeout(replaceLogoWithVideo, 50);
      });
      logoObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
      const logoCheck = setInterval(replaceLogoWithVideo, 2e3);
      return () => {
        logoObserver.disconnect();
        clearInterval(logoCheck);
        cleanupLogoVideo();
        console.log("[Season 2 Theme] Logo video replacement cleaned up");
      };
    }
  ];

  // src/styles/themes/season4/season4.js
  var season4_default = {
    name: "Season 4",
    author: "Deputy Ripper",
    style: `
        /* Day Theme (Default) */
        body.day-theme, .layout_layout__5rz87.day-theme, .select_options__t1ibN.day-theme {
            background-image: url('https://i.imgur.com/IsCSDH7.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }
        /* Night Theme (Default) */
        body.night-theme, .layout_layout__5rz87.night-theme, .select_options__t1ibN.night-theme {
            background-image: url('https://i.imgur.com/IsCSDH7.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }
        /* Day Theme Chat Background */
        .chat_chat__2rdNg.day-theme {
            background-image: url('https://files.catbox.moe/aqi0wq.gif') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }
        /* Night Theme Chat Background */
        .chat_chat__2rdNg.night-theme {
            background-image: url('https://files.catbox.moe/aqi0wq.gif') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }
		
		/* This is a lot of stuff that you can split up or remove. */
        /* Day Theme UI Elements */
        .maejok-input-invalid.day-theme, .maejok-context-message.day-theme, .maejok-tts-warning-text.day-theme,
        .panel_body__O5yBA.day-theme, .inventory_slots__D4IrC.day-theme {
            background-color: rgb(175, 89, 68) !important;
            border-color: rgb(175, 89, 68) !important;
        }
		
		/* Chat Header - Day Theme */
        .chat_header__8kNPS.day-theme {
            background-color: rgb(175, 89, 68) !important;
            background-image: url('https://i.imgur.com/IsCSDH7.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-blend-mode: multiply !important;
            border-color: rgb(175, 89, 68) !important;
        }
		
		/* Top Bar - Day Theme */
        .top-bar_top-bar__X4p2n.day-theme {
            background-color: rgb(175, 89, 68) !important;
            background-image: url('https://i.imgur.com/IsCSDH7.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-blend-mode: multiply !important;
            border-color: rgb(175, 89, 68) !important;
        }
		
		/* This is a lot of stuff that you can split up or remove. */
        /* Night Theme UI Elements */
        .maejok-input-invalid.night-theme, .maejok-context-message.night-theme, .maejok-tts-warning-text.night-theme,
        .panel_body__O5yBA.night-theme, .inventory_slots__D4IrC.night-theme {
            background-color: #1d1640 !important;
            border-color: #6d16e1 !important;
        }
		
		/* Chat Header - Night Theme */
        .chat_header__8kNPS.night-theme {
            background-color: #1d1640 !important;
            background-image: url('https://i.imgur.com/IsCSDH7.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-blend-mode: multiply !important;
            border-color: #6d16e1 !important;
        }
		
		/* Top Bar - Night Theme */
        .top-bar_top-bar__X4p2n.night-theme {
            background-color: #1d1640 !important;
            background-image: url('https://i.imgur.com/IsCSDH7.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-blend-mode: multiply !important;
            border-color: #6d16e1 !important;
        }
        .maejok-context-message svg path {
            fill: black !important;
        }

        /* Live stream preloaded with opacity for fun */
        .hls-stream-player_hls-stream-player__BJiGl,
        .live-stream-player_container__A4sNR,
        .layout_center__Vsd3b {
            opacity: 1;
        }

        /* Ad space - currently set to be invisible */
        .ads_ads__Z1cPk {
            opacity: 0;
        }
        
        /* Day Theme Poll Footer */
        .poll_footer__rALdX.day-theme {
            background-color: rgb(175, 89, 68);
        }

        /* Night Theme Poll Footer */
        .poll_footer__rALdX.night-theme {
            background-color: #1d1640;
        }

        /* Poll Vote Button Stuff */
        .poll_vote__b_NE0 button:disabled:hover {
            background-color: red !important;
            color: white !important;
            border-color: black !important;
        }
        .poll_vote__b_NE0 button:hover {
            background-color: red !important;
            color: white !important;
            border-color: black !important;
        }

        /* Day Theme TTS and SFX Messages */
        .chat-message-tts_chat-message-tts__2Jlxi.day-theme,
        .chat-message-sfx_chat-message-sfx__OGv6q.day-theme {
            border-color: rgb(175, 89, 68) !important;
            background-color: darkgreen !important;
            filter: drop-shadow(0 0 2px #00ff00) drop-shadow(0 0 2px #00ff00);
        }

        /* Night Theme TTS and SFX Messages */
        .chat-message-tts_chat-message-tts__2Jlxi.night-theme,
        .chat-message-sfx_chat-message-sfx__OGv6q.night-theme {
            border-color: #6d16e1 !important;
            background-color: #1d1640 !important;
            filter: drop-shadow(0 0 2px #a289c8) drop-shadow(0 0 2px #a289c8);
        }
        
        /* TTS Messages - Day Theme */
        body.day-theme #chat-messages > div[class*="chat-message-tts"] {
            background-color: rgb(175, 89, 68) !important;
            background-image: url('https://i.imgur.com/IsCSDH7.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-blend-mode: multiply !important;
            border: 2px solid rgb(175, 89, 68) !important;
            border-radius: 6px !important;
            box-shadow: 0 2px 8px rgba(175, 89, 68, 0.4) !important;
        }
        
        /* TTS Messages - Night Theme */
        body.night-theme #chat-messages > div[class*="chat-message-tts"] {
            background-color: #1d1640 !important;
            background-image: url('https://i.imgur.com/IsCSDH7.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-blend-mode: multiply !important;
            border: 2px solid #6d16e1 !important;
            border-radius: 6px !important;
            box-shadow: 0 2px 8px rgba(109, 22, 225, 0.5) !important;
        }
        
        /* TTS Message Text - Day Theme */
        body.day-theme #chat-messages > div[class*="chat-message-tts"] .chat-message-tts_message__sWVCc {
            color: #ffffff !important;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
            font-weight: bold !important;
        }
        
        /* TTS Message Text - Night Theme */
        body.night-theme #chat-messages > div[class*="chat-message-tts"] .chat-message-tts_message__sWVCc {
            color: #ffffff !important;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
            font-weight: bold !important;
        }
        
        /* TTS Timestamp - Day Theme */
        body.day-theme #chat-messages > div[class*="chat-message-tts"] .chat-message-tts_timestamp__pIVv0 {
            color: #ffffff !important;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
            font-weight: bold !important;
        }
        
        /* TTS Timestamp - Night Theme */
        body.night-theme #chat-messages > div[class*="chat-message-tts"] .chat-message-tts_timestamp__pIVv0 {
            color: #ffffff !important;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
            font-weight: bold !important;
        }

        /* Chat input area */
        .chat_input__bsNw2 {
            background-color: #000000 !important;
        }

        /* Day Theme - Chat input area */
        body.day-theme #__next > main > div.layout_right__x_sAY > div > div.chat_input__bsNw2 {
            background-color: rgb(175, 89, 68) !important;
            border-color: rgb(175, 89, 68) !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 8px rgba(175, 89, 68, 0.3) !important;
        }

        /* Night Theme - Chat input area */
        body.night-theme #__next > main > div.layout_right__x_sAY > div > div.chat_input__bsNw2 {
            background-color: #1d1640 !important;
            border-color: #6d16e1 !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 8px rgba(109, 22, 225, 0.4) !important;
        }

        /* Chat Input area text color */
        .chat-input_chat-input__GAgOF, .chat-input_input-wrapper__rjiu1, .chat-input_input__jljCU {
            color: #00FF00 !important;
        }

        /* Stock ticker */
        .stocks-bar_stocks-bar__7kNv8 {
            background-color: rgba(0, 0, 0, 1) !important;
        }
        
        /* Day Theme Stock Ticker */
        .stocks-bar_stocks-bar__7kNv8.day-theme {
            background-color: rgb(175, 89, 68) !important;
            background-image: url('https://i.imgur.com/IsCSDH7.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-blend-mode: multiply !important;
            border-color: rgb(175, 89, 68) !important;
            border-width: 2px !important;
            border-style: solid !important;
        }
        
        /* Night Theme Stock Ticker */
        .stocks-bar_stocks-bar__7kNv8.night-theme {
            background-color: #1d1640 !important;
            background-image: url('https://i.imgur.com/IsCSDH7.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-blend-mode: multiply !important;
            border-color: #6d16e1 !important;
            border-width: 2px !important;
            border-style: solid !important;
        }
        
        /* Entire Stocks Bar Container - Day Theme */
        body.day-theme #__next > main > div.layout_bottom__qRsMw {
            background-color: rgb(195, 109, 88) !important;
            background-image: url('https://i.imgur.com/IsCSDH7.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-blend-mode: multiply !important;
            border-color: rgb(175, 89, 68) !important;
            border-width: 3px !important;
            border-style: solid !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(175, 89, 68, 0.4) !important;
        }
        
        /* Entire Stocks Bar Container - Night Theme */
        body.night-theme #__next > main > div.layout_bottom__qRsMw {
            background-color: #2d1a50 !important;
            background-image: url('https://i.imgur.com/IsCSDH7.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-blend-mode: multiply !important;
            border-color: #6d16e1 !important;
            border-width: 3px !important;
            border-style: solid !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 15px rgba(109, 22, 225, 0.6) !important;
        }

        /* Bottom announcement banner */
        .announcement-bar_announcement-bar__gcGuh {
            background-color: rgba(0, 0, 0, 0) !important;
            color: red !important;
            text-shadow: 1px 1px 0 #000 !important;
            border: none !important;
        }
        
        /* Day Theme Announcement Bar */
        body.day-theme #__next > main > div.layout_center-bottom__yhDOH > div.announcement-bar_announcement-bar__gcGuh {
            background-color: rgb(215, 129, 108) !important;
            background-image: url('https://i.imgur.com/IsCSDH7.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-blend-mode: multiply !important;
            color: #ffffff !important;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
            border: 2px solid rgb(175, 89, 68) !important;
            border-radius: 6px !important;
            box-shadow: 0 2px 8px rgba(175, 89, 68, 0.4) !important;
        }
        
        /* Night Theme Announcement Bar */
        body.night-theme #__next > main > div.layout_center-bottom__yhDOH > div.announcement-bar_announcement-bar__gcGuh {
            background-color: #3d2a60 !important;
            background-image: url('https://i.imgur.com/IsCSDH7.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-blend-mode: multiply !important;
            color: #ffffff !important;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
            border: 2px solid #6d16e1 !important;
            border-radius: 6px !important;
            box-shadow: 0 2px 8px rgba(109, 22, 225, 0.5) !important;
        }

        /* Live stream header */
        .live-stream-player_header__58imR, .live-stream-player_live-stream-player__4CHjG {
            background-color: #191d2100 !important;
            border: none !important;
        }

        /* Bottom status bar */
        .status-bar_status-bar__vR_Tm {
            background-color: #000000 !important;
        }
        /* Custom image replacement classes for day theme */
        .season4-custom-image.day-theme {
            padding-right: 40px !important;
        }
		/* Custom image replacement classes for night theme */
        .season4-custom-image.night-theme {
            padding-right: 40px !important;
        }

        /* Night Theme - Specific element styling */
        body.night-theme #__next > main > div:nth-child(6) {
            background-color: #1d1640 !important;
            border-color: #6d16e1 !important;
        }
        body.night-theme #__next > main > div:nth-child(5) > div > div:nth-child(3) {
            background-color: #1d1640 !important;
            border-color: #6d16e1 !important;
        }
		 /* Day Theme - Top bar buttons */
        body.day-theme .top-bar_link__0xN4F,
        body.day-theme .top-bar_red__1Up8r,
        body.day-theme .top-bar_green__S_hiA {
            background-color: rgb(175, 89, 68) !important;
            border-color: rgb(175, 89, 68) !important;
            opacity: 0.9 !important;
        }
        
		/* Night Theme - Top bar buttons */		
        body.night-theme .top-bar_link__0xN4F,
        body.night-theme .top-bar_red__1Up8r,
        body.night-theme .top-bar_green__S_hiA {
            background-color: #1d1640 !important;
            border-color: #6d16e1 !important;
            opacity: 0.85 !important;
        }

        /* Watch and Info buttons match Play button */
        body.day-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > div.top-bar_links__4FJwt > button:nth-child(2),
        body.day-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > div.top-bar_links__4FJwt > button:nth-child(4) {
            background: linear-gradient(135deg, rgb(175, 89, 68) 0%, rgb(195, 109, 88) 100%) !important;
            border-color: rgb(175, 89, 68) !important;
            opacity: 0.9 !important;
            border-radius: 8px !important;
            transition: all 0.3s ease !important;
            position: relative !important;
            overflow: hidden !important;
            box-shadow: 0 2px 8px rgba(175, 89, 68, 0.3) !important;
        }
        body.night-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > div.top-bar_links__4FJwt > button:nth-child(2),
        body.night-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > div.top-bar_links__4FJwt > button:nth-child(4) {
            background: linear-gradient(135deg, #1d1640 0%, #2d1a50 100%) !important;
            border-color: #6d16e1 !important;
            opacity: 0.85 !important;
            border-radius: 8px !important;
            transition: all 0.3s ease !important;
            position: relative !important;
            overflow: hidden !important;
            box-shadow: 0 2px 8px rgba(109, 22, 225, 0.4) !important;
        }
        body.day-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > div.top-bar_links__4FJwt > button:nth-child(2):hover,
        body.day-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > div.top-bar_links__4FJwt > button:nth-child(4):hover {
            transform: scale(1.05) translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(175, 89, 68, 0.5) !important;
            background: linear-gradient(135deg, rgb(195, 109, 88) 0%, rgb(215, 129, 108) 100%) !important;
        }
        body.night-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > div.top-bar_links__4FJwt > button:nth-child(2):hover,
        body.night-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > div.top-bar_links__4FJwt > button:nth-child(4):hover {
            transform: scale(1.05) translateY(-2px) !important;
            box-shadow: 0 6px 25px rgba(109, 22, 225, 0.7) !important;
            background: linear-gradient(135deg, #2d1a50 0%, #3d2a60 100%) !important;
        }
        .live-stream-player_cinema__yPkWC .chat_chat__2rdNg {
            background-image: none !important;
            background-color: transparent !important;
        }
        .live-stream-player_cinema__yPkWC body,
        .live-stream-player_cinema__yPkWC .layout_layout__5rz87,
        .live-stream-player_cinema__yPkWC .select_options__t1ibN {
            background-image: none !important;
            background-color: transparent !important;
        }
        .chat_chat__2rdNg:not(.live-stream-player_cinema__yPkWC .chat_chat__2rdNg) {
            background-image: url('https://files.catbox.moe/aqi0wq.gif') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }
        body.season4 .chat_chat__2rdNg.season4-restored-chat,
        body.season4 .chat_chat__2rdNg.day-theme.season4-restored-chat,
        body.season4 .chat_chat__2rdNg.night-theme.season4-restored-chat {
            background-image: url('https://files.catbox.moe/aqi0wq.gif') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }
        *:not([id*="live-stream-player-camera"]):not(.clickable-zones_clickable-zones__OgYjT):not(.clickable-zones_live-stream__i75zd):not([class*="loading"]):not([class*="stream"]):not([class*="player"]):not([class*="live-stream"]):not([class*="hls"]):not([class*="video"]) {
            transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease !important;
        }
        button[id*="live-stream-player-camera"],
        div[id*="live-stream-player-camera"]:not([class*="loading"]):not([class*="stream"]):not([class*="player"]),
        .clickable-zones_clickable-zones__OgYjT > *,
        .clickable-zones_live-stream__i75zd > * {
            transition: none !important;
            animation: none !important;
            transform: none !important;
            filter: none !important;
            box-shadow: none !important;
            background-color: transparent !important;
            border-color: transparent !important;
        }
        button[id*="live-stream-player-camera"]:hover,
        div[id*="live-stream-player-camera"]:not([class*="loading"]):not([class*="stream"]):not([class*="player"]):hover,
        .clickable-zones_clickable-zones__OgYjT > *:hover,
        .clickable-zones_live-stream__i75zd > *:hover {
            transition: none !important;
            animation: none !important;
            transform: none !important;
            filter: none !important;
            box-shadow: none !important;
            background-color: transparent !important;
            border-color: transparent !important;
        }
        body.day-theme button:hover:not(.clickable-zones_clickable-zones__OgYjT):not(.clickable-zones_live-stream__i75zd):not([id*="live-stream-player-camera"]):not([id*="live-stream-player-camera"] *),
        body.day-theme .top-bar_link__0xN4F:hover,
        body.day-theme .top-bar_red__1Up8r:hover,
        body.day-theme .top-bar_green__S_hiA:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(175, 89, 68, 0.4) !important;
            background-color: rgb(195, 109, 88) !important;
            border-color: rgb(195, 109, 88) !important;
        }

        /* Button hover effects - Night Theme */
        body.night-theme button:hover:not(.clickable-zones_clickable-zones__OgYjT):not(.clickable-zones_live-stream__i75zd):not([id*="live-stream-player-camera"]):not([id*="live-stream-player-camera"] *),
        body.night-theme .top-bar_link__0xN4F:hover,
        body.night-theme .top-bar_red__1Up8r:hover,
        body.night-theme .top-bar_green__S_hiA:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 15px rgba(109, 22, 225, 0.6) !important;
            background-color: #2d1a50 !important;
            border-color: #8d26f1 !important;
        }

        /* Specific button hover effects */
        body.day-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > div.top-bar_links__4FJwt > button:nth-child(2):hover,
        body.day-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > div.top-bar_links__4FJwt > button:nth-child(4):hover {
            transform: scale(1.05) translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(175, 89, 68, 0.5) !important;
        }

        body.night-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > div.top-bar_links__4FJwt > button:nth-child(2):hover,
        body.night-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > div.top-bar_links__4FJwt > button:nth-child(4):hover {
            transform: scale(1.05) translateY(-2px) !important;
            box-shadow: 0 6px 25px rgba(109, 22, 225, 0.7) !important;
        }

        /* Chat message hover effects */
        body.day-theme .chat-message-default_chat-message-default__JtJQL:hover {
            background-color: rgba(175, 89, 68, 0.1) !important;
            transform: translateX(4px) !important;
            box-shadow: 2px 2px 8px rgba(175, 89, 68, 0.2) !important;
        }

        body.night-theme .chat-message-default_chat-message-default__JtJQL:hover {
            background-color: rgba(29, 22, 64, 0.2) !important;
            transform: translateX(4px) !important;
            box-shadow: 2px 2px 12px rgba(109, 22, 225, 0.3) !important;
        }

        /* Poll button hover effects */
        body.day-theme .poll_vote__b_NE0 button:hover {
            background-color: rgb(195, 109, 88) !important;
            transform: scale(1.02) !important;
            box-shadow: 0 4px 12px rgba(175, 89, 68, 0.4) !important;
        }

        body.night-theme .poll_vote__b_NE0 button:hover {
            background-color: #2d1a50 !important;
            transform: scale(1.02) !important;
            box-shadow: 0 4px 15px rgba(109, 22, 225, 0.6) !important;
        }

        /* Input field focus effects */
        body.day-theme input:focus:not([id*="live-stream-player-camera"]):not([id*="live-stream-player-camera"] *),
        body.day-theme textarea:focus:not([id*="live-stream-player-camera"]):not([id*="live-stream-player-camera"] *) {
            outline: none !important;
            border-color: rgb(175, 89, 68) !important;
            box-shadow: 0 0 8px rgba(175, 89, 68, 0.3) !important;
            transform: scale(1.01) !important;
        }

        body.night-theme input:focus:not([id*="live-stream-player-camera"]):not([id*="live-stream-player-camera"] *),
        body.night-theme textarea:focus:not([id*="live-stream-player-camera"]):not([id*="live-stream-player-camera"] *) {
            outline: none !important;
            border-color: #6d16e1 !important;
            box-shadow: 0 0 12px rgba(109, 22, 225, 0.4) !important;
            transform: scale(1.01) !important;
        }

        /* Link hover effects */
        body.day-theme a:hover {
            text-shadow: 0 0 5px rgba(175, 89, 68, 0.3) !important;
        }

        body.night-theme a:hover {
            text-shadow: 0 0 8px rgba(109, 22, 225, 0.5) !important;
        }

        /* Smooth theme transition animation */
        @keyframes themeTransition {
            0% { opacity: 0.8; }
            50% { opacity: 0.9; }
            100% { opacity: 1; }
        }

        body.day-theme,
        body.night-theme {
            animation: themeTransition 0.5s ease-in-out !important;
        }

        /* Pulse animation for important elements */
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }

        body.day-theme .top-bar_red__1Up8r {
            animation: pulse 2s infinite ease-in-out !important;
        }

        body.night-theme .top-bar_green__S_hiA {
            animation: pulse 2s infinite ease-in-out !important;
        }

        /* Glow effect for active elements */
        body.day-theme .chat-message-tts_chat-message-tts__2Jlxi,
        body.day-theme .chat-message-sfx_chat-message-sfx__OGv6q {
            animation: glow 2s ease-in-out infinite alternate !important;
        }

        body.night-theme .chat-message-tts_chat-message-tts__2Jlxi,
        body.night-theme .chat-message-sfx_chat-message-sfx__OGv6q {
            animation: glow 2s ease-in-out infinite alternate !important;
        }

        @keyframes glow {
            from { box-shadow: 0 0 5px currentColor; }
            to { box-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
        }

        body.night-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > button:nth-child(4):hover {
            transform: scale(1.05) translateY(-2px) !important;
            box-shadow: 0 6px 25px rgba(109, 22, 225, 0.7) !important;
        }

        /* Button 6 styling */
        body.day-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > div.top-bar_links__4FJwt > button:nth-child(6) {
            background: linear-gradient(135deg, rgb(175, 89, 68) 0%, rgb(195, 109, 88) 100%) !important;
            border-color: rgb(175, 89, 68) !important;
            opacity: 0.9 !important;
            border-radius: 8px !important;
            transition: all 0.3s ease !important;
            position: relative !important;
            overflow: hidden !important;
        }

        body.night-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > div.top-bar_links__4FJwt > button:nth-child(6) {
            background: linear-gradient(135deg, #1d1640 0%, #2d1a50 100%) !important;
            border-color: #6d16e1 !important;
            opacity: 0.85 !important;
            border-radius: 8px !important;
            transition: all 0.3s ease !important;
            position: relative !important;
            overflow: hidden !important;
            box-shadow: 0 0 8px rgba(109, 22, 225, 0.4) !important;
        }

        body.day-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > div.top-bar_links__4FJwt > button:nth-child(6):hover {
            transform: scale(1.05) translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(175, 89, 68, 0.5) !important;
            background: linear-gradient(135deg, rgb(195, 109, 88) 0%, rgb(215, 129, 108) 100%) !important;
        }

        body.night-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > div.top-bar_links__4FJwt > button:nth-child(6):hover {
            transform: scale(1.05) translateY(-2px) !important;
            box-shadow: 0 6px 25px rgba(109, 22, 225, 0.7) !important;
            background: linear-gradient(135deg, #2d1a50 0%, #3d2a60 100%) !important;
        }

        /* Advanced Button Styling - Enhanced gradients and effects */
        body.day-theme .top-bar_link__0xN4F,
        body.day-theme .top-bar_red__1Up8r,
        body.day-theme .top-bar_green__S_hiA {
            background: linear-gradient(135deg, rgb(175, 89, 68) 0%, rgb(195, 109, 88) 100%) !important;
            border-color: rgb(175, 89, 68) !important;
            opacity: 0.9 !important;
            border-radius: 8px !important;
            position: relative !important;
            overflow: hidden !important;
            box-shadow: 0 2px 8px rgba(175, 89, 68, 0.3) !important;
        }

        body.night-theme .top-bar_link__0xN4F,
        body.night-theme .top-bar_red__1Up8r,
        body.night-theme .top-bar_green__S_hiA {
            background: linear-gradient(135deg, #1d1640 0%, #2d1a50 100%) !important;
            border-color: #6d16e1 !important;
            opacity: 0.85 !important;
            border-radius: 8px !important;
            position: relative !important;
            overflow: hidden !important;
            box-shadow: 0 2px 8px rgba(109, 22, 225, 0.4) !important;
        }
        body.day-theme .top-bar_link__0xN4F span,
        body.day-theme .top-bar_red__1Up8r span,
        body.day-theme .top-bar_green__S_hiA span {
            font-weight: 600 !important;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
            letter-spacing: 0.5px !important;
        }
        body.night-theme .top-bar_link__0xN4F span,
        body.night-theme .top-bar_red__1Up8r span,
        body.night-theme .top-bar_green__S_hiA span {
            font-weight: 600 !important;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
            letter-spacing: 0.5px !important;
        }

        /* Ignore hover effects for logo element */
        body.day-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > button.top-bar_logo__XL0_C,
        body.night-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > button.top-bar_logo__XL0_C {
            box-shadow: none !important;
            background-color: transparent !important;
            border-color: transparent !important;
            opacity: 1 !important;
        }

        body.day-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > button.top-bar_logo__XL0_C:hover,
        body.night-theme #__next > main > div.layout_top__MHaU_ > div.top-bar_top-bar___Z0QX > button.top-bar_logo__XL0_C:hover {
            box-shadow: none !important;
            background-color: transparent !important;
            border-color: transparent !important;
            opacity: 1 !important;
        }

        /* Unique Elements Styling */

        /* Custom Scrollbars with Theme Colors */
        body.day-theme ::-webkit-scrollbar {
            width: 12px !important;
            height: 12px !important;
        }

        body.day-theme ::-webkit-scrollbar-track {
            background: rgba(175, 89, 68, 0.1) !important;
            border-radius: 6px !important;
        }

        body.day-theme ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, rgb(175, 89, 68) 0%, rgb(195, 109, 88) 100%) !important;
            border-radius: 6px !important;
            border: 2px solid rgba(175, 89, 68, 0.2) !important;
        }

        body.day-theme ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, rgb(195, 109, 88) 0%, rgb(215, 129, 108) 100%) !important;
            box-shadow: 0 0 8px rgba(175, 89, 68, 0.5) !important;
        }

        body.night-theme ::-webkit-scrollbar {
            width: 12px !important;
            height: 12px !important;
        }

        body.night-theme ::-webkit-scrollbar-track {
            background: rgba(109, 22, 225, 0.1) !important;
            border-radius: 6px !important;
        }

        body.night-theme ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #1d1640 0%, #6d16e1 100%) !important;
            border-radius: 6px !important;
            border: 2px solid rgba(109, 22, 225, 0.3) !important;
        }

        body.night-theme ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #2d1a50 0%, #8d26f1 100%) !important;
            box-shadow: 0 0 12px rgba(109, 22, 225, 0.7) !important;
        }

        /* Animated Background Patterns */
        body.day-theme::before {
            content: '' !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-image: 
                radial-gradient(circle at 20% 80%, rgba(175, 89, 68, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(195, 109, 88, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(175, 89, 68, 0.02) 0%, transparent 50%) !important;
            pointer-events: none !important;
            z-index: -1 !important;
            animation: dayPatternFloat 20s ease-in-out infinite !important;
        }

        body.night-theme::before {
            content: '' !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-image: 
                radial-gradient(circle at 25% 75%, rgba(109, 22, 225, 0.04) 0%, transparent 50%),
                radial-gradient(circle at 75% 25%, rgba(29, 22, 64, 0.04) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(109, 22, 225, 0.03) 0%, transparent 50%) !important;
            pointer-events: none !important;
            z-index: -1 !important;
            animation: nightPatternFloat 25s ease-in-out infinite !important;
        }

        @keyframes dayPatternFloat {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(-10px, -10px) rotate(1deg); }
            50% { transform: translate(10px, -5px) rotate(-1deg); }
            75% { transform: translate(-5px, 10px) rotate(0.5deg); }
        }

        @keyframes nightPatternFloat {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(15px, -15px) rotate(-1deg); }
            66% { transform: translate(-15px, 10px) rotate(1deg); }
        }

        /* Icon Animations */
        body.day-theme .icon_icon__bDzMA:not([id*="live-stream-player-camera"]):not([id*="live-stream-player-camera"] *),
        body.day-theme svg:not([id*="live-stream-player-camera"]):not([id*="live-stream-player-camera"] *) {
            transition: all 0.3s ease !important;
        }

        body.day-theme .icon_icon__bDzMA:not([id*="live-stream-player-camera"]):not([id*="live-stream-player-camera"] *):hover,
        body.day-theme svg:not([id*="live-stream-player-camera"]):not([id*="live-stream-player-camera"] *):hover {
            transform: scale(1.1) rotate(5deg) !important;
            filter: drop-shadow(0 0 8px rgba(175, 89, 68, 0.6)) !important;
        }

        body.night-theme .icon_icon__bDzMA:not([id*="live-stream-player-camera"]):not([id*="live-stream-player-camera"] *),
        body.night-theme svg:not([id*="live-stream-player-camera"]):not([id*="live-stream-player-camera"] *) {
            transition: all 0.3s ease !important;
        }

        body.night-theme .icon_icon__bDzMA:not([id*="live-stream-player-camera"]):not([id*="live-stream-player-camera"] *):hover,
        body.night-theme svg:not([id*="live-stream-player-camera"]):not([id*="live-stream-player-camera"] *):hover {
            transform: scale(1.1) rotate(-5deg) !important;
            filter: drop-shadow(0 0 12px rgba(109, 22, 225, 0.8)) !important;
        }

        /* Progress Bars with Gradient Fills */
        body.day-theme progress,
        body.day-theme .progress-bar,
        body.day-theme [class*="progress"] {
            background: rgba(175, 89, 68, 0.2) !important;
            border-radius: 8px !important;
            border: 1px solid rgba(175, 89, 68, 0.3) !important;
            overflow: hidden !important;
        }

        body.day-theme progress::-webkit-progress-bar {
            background: rgba(175, 89, 68, 0.2) !important;
            border-radius: 8px !important;
        }

        body.day-theme progress::-webkit-progress-value {
            background: linear-gradient(90deg, rgb(175, 89, 68) 0%, rgb(195, 109, 88) 50%, rgb(215, 129, 108) 100%) !important;
            border-radius: 8px !important;
            animation: dayProgressPulse 2s ease-in-out infinite !important;
        }

        body.night-theme progress,
        body.night-theme .progress-bar,
        body.night-theme [class*="progress"] {
            background: rgba(29, 22, 64, 0.3) !important;
            border-radius: 8px !important;
            border: 1px solid rgba(109, 22, 225, 0.4) !important;
            overflow: hidden !important;
        }

        body.night-theme progress::-webkit-progress-bar {
            background: rgba(29, 22, 64, 0.3) !important;
            border-radius: 8px !important;
        }

        body.night-theme progress::-webkit-progress-value {
            background: linear-gradient(90deg, #1d1640 0%, #6d16e1 50%, #8d26f1 100%) !important;
            border-radius: 8px !important;
            animation: nightProgressPulse 2s ease-in-out infinite !important;
        }

        @keyframes dayProgressPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }

        @keyframes nightProgressPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.9; }
        }

        /* Enhanced Loading States */
        body.day-theme .loading,
        body.day-theme [class*="loading"] {
            background: linear-gradient(90deg, transparent, rgba(175, 89, 68, 0.3), transparent) !important;
            background-size: 200% 100% !important;
            animation: dayLoadingShimmer 1.5s infinite !important;
        }

        body.night-theme .loading,
        body.night-theme [class*="loading"] {
            background: linear-gradient(90deg, transparent, rgba(109, 22, 225, 0.4), transparent) !important;
            background-size: 200% 100% !important;
            animation: nightLoadingShimmer 1.5s infinite !important;
        }

        @keyframes dayLoadingShimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        @keyframes nightLoadingShimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        /* Typography Enhancements */

        /* Import Custom Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&display=swap');

        /* Day Theme Typography */
        body.day-theme {
            font-family: 'Quicksand', sans-serif !important;
            font-weight: 400 !important;
            letter-spacing: 0.2px !important;
        }

        body.day-theme h1, body.day-theme h2, body.day-theme h3, 
        body.day-theme h4, body.day-theme h5, body.day-theme h6 {
            font-family: 'Quicksand', sans-serif !important;
            font-weight: 600 !important;
            letter-spacing: 0.5px !important;
            background: linear-gradient(135deg, rgb(175, 89, 68) 0%, rgb(195, 109, 88) 100%) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
            text-shadow: 0 2px 4px rgba(175, 89, 68, 0.3) !important;
        }

        /* Night Theme Typography */
        body.night-theme {
            font-family: 'Orbitron', monospace !important;
            font-weight: 400 !important;
            letter-spacing: 0.3px !important;
        }

        body.night-theme h1, body.night-theme h2, body.night-theme h3, 
        body.night-theme h4, body.night-theme h5, body.night-theme h6 {
            font-family: 'Orbitron', monospace !important;
            font-weight: 600 !important;
            letter-spacing: 0.8px !important;
            background: linear-gradient(135deg, #6d16e1 0%, #8d26f1 100%) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
            text-shadow: 0 2px 8px rgba(109, 22, 225, 0.5) !important;
        }

        /* Chat Header - Font Only Modifications */
        body.day-theme .chat_header__8kNPS {
            font-family: 'Quicksand', sans-serif !important;
            font-weight: 600 !important;
            letter-spacing: 0.5px !important;
        }

        body.night-theme .chat_header__8kNPS {
            font-family: 'Orbitron', monospace !important;
            font-weight: 600 !important;
            letter-spacing: 0.8px !important;
        }

        /* Button Text Enhancements */
        body.day-theme button {
            font-family: 'Quicksand', sans-serif !important;
            font-weight: 500 !important;
            letter-spacing: 0.3px !important;
        }

        body.night-theme button {
            font-family: 'Orbitron', monospace !important;
            font-weight: 500 !important;
            letter-spacing: 0.4px !important;
        }

        /* Input Field Typography */
        body.day-theme input, body.day-theme textarea {
            font-family: 'Quicksand', sans-serif !important;
            font-weight: 400 !important;
            letter-spacing: 0.2px !important;
        }

        body.night-theme input, body.night-theme textarea {
            font-family: 'Orbitron', monospace !important;
            font-weight: 400 !important;
            letter-spacing: 0.3px !important;
        }

        /* Link Typography */
        body.day-theme a {
            font-family: 'Quicksand', sans-serif !important;
            font-weight: 500 !important;
            letter-spacing: 0.2px !important;
        }

        body.night-theme a {
            font-family: 'Orbitron', monospace !important;
            font-weight: 500 !important;
            letter-spacing: 0.3px !important;
        }

        /* Custom Bullet Points for Lists */
        body.day-theme ul li::before {
            content: '\u2726' !important;
            color: rgb(175, 89, 68) !important;
            font-weight: bold !important;
            display: inline-block !important;
            width: 1em !important;
            margin-left: -1em !important;
            animation: dayBulletPulse 2s ease-in-out infinite !important;
        }

        body.night-theme ul li::before {
            content: '\u25C6' !important;
            color: #6d16e1 !important;
            font-weight: bold !important;
            display: inline-block !important;
            width: 1em !important;
            margin-left: -1em !important;
            animation: nightBulletPulse 2s ease-in-out infinite !important;
        }

        @keyframes dayBulletPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
        }

        @keyframes nightBulletPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
        }

        /* Enhanced Text Hierarchy */
        body.day-theme .panel_header__T2yFW {
            font-family: 'Quicksand', sans-serif !important;
            font-weight: 700 !important;
            letter-spacing: 0.6px !important;
            background: linear-gradient(135deg, rgb(175, 89, 68) 0%, rgb(195, 109, 88) 100%) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
        }

        body.night-theme .panel_header__T2yFW {
            font-family: 'Orbitron', monospace !important;
            font-weight: 700 !important;
            letter-spacing: 1px !important;
            background: linear-gradient(135deg, #6d16e1 0%, #8d26f1 100%) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
        }

        /* Status and Notification Text */
        body.day-theme .status-bar_status-bar__vR_Tm {
            font-family: 'Quicksand', sans-serif !important;
            font-weight: 500 !important;
            letter-spacing: 0.3px !important;
        }

        body.night-theme .status-bar_status-bar__vR_Tm {
            font-family: 'Orbitron', monospace !important;
            font-weight: 500 !important;
            letter-spacing: 0.4px !important;
        }

        /* Modal and Dialog Typography */
        body.day-theme .modal_modal__MS70U h1,
        body.day-theme .modal_modal__MS70U h2,
        body.day-theme .modal_modal__MS70U h3 {
            font-family: 'Quicksand', sans-serif !important;
            font-weight: 600 !important;
            letter-spacing: 0.5px !important;
        }

        body.night-theme .modal_modal__MS70U h1,
        body.night-theme .modal_modal__MS70U h2,
        body.night-theme .modal_modal__MS70U h3 {
            font-family: 'Orbitron', monospace !important;
            font-weight: 600 !important;
            letter-spacing: 0.8px !important;
        }

        /* Header Colors */
        /* Day Theme Header Colors */
        .panel_header__T2yFW.day-theme {
            background-color: rgb(175, 89, 68) !important;
            background-image: url('https://i.imgur.com/IsCSDH7.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-blend-mode: multiply !important;
        }
        
        /* Header Colors */
        /* Night Theme Header Colors */
        .panel_header__T2yFW.night-theme {
            background-color: #5704c1 !important;
            background-image: url('https://i.imgur.com/IsCSDH7.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-blend-mode: multiply !important;
        }
        .top-bar_top-bar__X4p2n {
            box-shadow: none !important;
        }
    `,
    configPanel: function(settings) {
      return `
            <div id="season4-settings">
                <h2 style="font-size: 20px; margin-bottom: 15px; color: #fff;">Season 4 Theme Settings</h2>
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; border: 1px solid rgba(68,68,68,0.5);">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 10px; font-weight: bold;">Day/Night Theme Mode:</label>
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <label style="display: flex; align-items: center; cursor: pointer; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 4px;">
                                <input type="radio" name="season4-mode" value="auto" style="margin-right: 10px;" ${settings.season4ForceMode === void 0 || settings.season4ForceMode === "auto" ? "checked" : ""}>
                                <span style="font-weight: bold;">Auto Switch (10 PM - 8 AM)</span>
                            </label>
                            <label style="display: flex; align-items: center; cursor: pointer; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 4px;">
                                <input type="radio" name="season4-mode" value="day" style="margin-right: 10px;" ${settings.season4ForceMode === "day" ? "checked" : ""}>
                                <span style="font-weight: bold;">Force Day Theme</span>
                            </label>
                            <label style="display: flex; align-items: center; cursor: pointer; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 4px;">
                                <input type="radio" name="season4-mode" value="night" style="margin-right: 10px;" ${settings.season4ForceMode === "night" ? "checked" : ""}>
                                <span style="font-weight: bold;">Force Night Theme</span>
                            </label>
                        </div>
                    </div>
                    <div style="color: #ccc; font-size: 12px; font-style: italic;">
                        Auto mode switches between day and night themes based on time. Force modes override the automatic switching.
                    </div>
                </div>
            </div>
        `;
    }
  };

  // src/styles/themes/season4/scripts.js
  var scripts_default6 = [
    // Custom Ping Sound Switcher
    () => {
      let pingInterval = null;
      let currentPingTheme = null;
      let mentionSoundObserver = null;
      let currentPingSound = null;
      let originalPlay = null;
      let isIntercepting = false;
      const dayPingSound = "https://files.catbox.moe/bi12nh.mp3";
      const nightPingSound = "https://files.catbox.moe/ojs7i7.mp3";
      const getCurrentTime = () => {
        const now = /* @__PURE__ */ new Date();
        return now.getHours() + now.getMinutes() / 60;
      };
      const shouldUseNightTheme = () => {
        const settings = JSON.parse(localStorage.getItem("grizzway-tools-settings") || "{}");
        const forceMode = settings.season4ForceMode || window.grizzwaySeason4ForceMode;
        if (forceMode === "day") return false;
        if (forceMode === "night") return true;
        const currentTime = getCurrentTime();
        return currentTime >= 22 || currentTime < 8;
      };
      const getCurrentPingSound = () => {
        const useNightTheme = shouldUseNightTheme();
        return useNightTheme ? nightPingSound : dayPingSound;
      };
      const replaceMentionSound = (audioElement) => {
        if (audioElement && audioElement.src && (audioElement.src.includes("mention") || audioElement.src.includes("notification"))) {
          console.log("[Season 4] Replacing mention sound with:", currentPingSound);
          audioElement.src = currentPingSound;
          return true;
        }
        return false;
      };
      const setupMentionSoundInterceptor = (pingSound) => {
        if (!originalPlay) {
          originalPlay = HTMLAudioElement.prototype.play;
        }
        if (mentionSoundObserver) {
          mentionSoundObserver.disconnect();
        }
        mentionSoundObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                if (node.tagName === "AUDIO") {
                  replaceMentionSound(node);
                }
                const audioElements = node.querySelectorAll ? node.querySelectorAll("audio") : [];
                audioElements.forEach((audio) => {
                  replaceMentionSound(audio);
                });
              }
            });
          });
        });
        mentionSoundObserver.observe(document.body, {
          childList: true,
          subtree: true
        });
        const existingAudioElements = document.querySelectorAll("audio");
        existingAudioElements.forEach((audio) => {
          replaceMentionSound(audio);
        });
        if (!isIntercepting) {
          isIntercepting = true;
          HTMLAudioElement.prototype.play = function() {
            if (this.src && (this.src.includes("mention") || this.src.includes("notification"))) {
              console.log("[Season 4] Intercepting mention sound play, replacing with:", pingSound);
              this.src = pingSound;
            }
            return originalPlay.apply(this, arguments);
          };
        }
      };
      const checkAndSwitchPingSound = () => {
        const newTheme = shouldUseNightTheme() ? "night-theme" : "day-theme";
        if (newTheme !== currentPingTheme) {
          currentPingTheme = newTheme;
          currentPingSound = getCurrentPingSound();
          setupMentionSoundInterceptor(currentPingSound);
          console.log(`[Season 4] Ping sound switched to ${newTheme}: ${currentPingSound}`);
        }
      };
      currentPingTheme = shouldUseNightTheme() ? "night-theme" : "day-theme";
      currentPingSound = getCurrentPingSound();
      setupMentionSoundInterceptor(currentPingSound);
      console.log(`[Season 4] Initial ping sound setup: ${currentPingTheme} - ${currentPingSound}`);
      pingInterval = setInterval(checkAndSwitchPingSound, 6e4);
      return () => {
        if (pingInterval) {
          clearInterval(pingInterval);
        }
        if (mentionSoundObserver) {
          mentionSoundObserver.disconnect();
        }
        if (originalPlay && isIntercepting) {
          HTMLAudioElement.prototype.play = originalPlay;
          isIntercepting = false;
        }
        console.log("[Season 4] Mention sound interceptor cleaned up");
      };
    },
    // Logo Glow
    () => {
      let imgs = [];
      let styleEl = null;
      let observer = null;
      const selectors = [
        ".top-bar_logo__XL0_C img.maejok-logo_hover",
        ".top-bar_logo__XL0_C img.maejok-logo_hide",
        ".top-bar_logo__XL0_C img.top-bar_desktop__pjX2g"
      ];
      const applyGlow = () => {
        imgs = selectors.map((sel) => Array.from(document.querySelectorAll(sel))).flat().filter(Boolean);
        if (!imgs.length) return false;
        imgs.forEach((img) => img.classList.add("grizz-glow-img"));
        styleEl = document.createElement("style");
        styleEl.id = "grizz-glow-style";
        styleEl.textContent = `
            @keyframes grizzGlow {
              from { filter: drop-shadow(0 0 0px red); }
              to   { filter: drop-shadow(0 0 10px red); }
            }
      
            .grizz-glow-img {
              animation: grizzGlow 1.6s infinite alternate !important;
              will-change: filter;
            }
          `;
        document.head.appendChild(styleEl);
        return true;
      };
      if (!applyGlow()) {
        observer = new MutationObserver(() => {
          if (applyGlow()) observer.disconnect();
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
      return () => {
        imgs.forEach((img) => img.classList.remove("grizz-glow-img"));
        if (styleEl && styleEl.parentNode) styleEl.remove();
        if (observer) observer.disconnect();
      };
    },
    // Day/Night Theme Switcher
    () => {
      let themeInterval = null;
      let currentTheme = "day-theme";
      let themeObserver = null;
      const targetElementXPath = '//*[@id="__next"]/main/div[4]/div[2]/div[2]/div[2]';
      const getElementByXPath = (xpath) => {
        try {
          const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          return result.singleNodeValue;
        } catch (error) {
          console.warn("[Season 4] XPath evaluation failed:", error);
          return null;
        }
      };
      const getCurrentTime = () => {
        const now = /* @__PURE__ */ new Date();
        return now.getHours() + now.getMinutes() / 60;
      };
      const shouldUseNightTheme = () => {
        const settings = JSON.parse(localStorage.getItem("grizzway-tools-settings") || "{}");
        const forceMode = settings.season4ForceMode || window.grizzwaySeason4ForceMode;
        if (forceMode === "day") {
          return false;
        } else if (forceMode === "night") {
          return true;
        }
        const currentTime = getCurrentTime();
        return currentTime >= 22 || currentTime < 8;
      };
      const applyTheme2 = (theme) => {
        const elements = [
          document.body,
          ...document.querySelectorAll(".layout_layout__5rz87"),
          ...document.querySelectorAll(".select_options__t1ibN"),
          ...document.querySelectorAll(".chat_chat__2rdNg"),
          ...document.querySelectorAll(".maejok-input-invalid"),
          ...document.querySelectorAll(".maejok-context-message"),
          ...document.querySelectorAll(".maejok-tts-warning-text"),
          ...document.querySelectorAll(".chat_header__8kNPS"),
          ...document.querySelectorAll(".top-bar_top-bar__X4p2n"),
          ...document.querySelectorAll(".panel_body__O5yBA"),
          ...document.querySelectorAll(".inventory_slots__D4IrC"),
          ...document.querySelectorAll(".panel_header__T2yFW"),
          ...document.querySelectorAll(".poll_footer__rALdX"),
          ...document.querySelectorAll(".chat-message-tts_chat-message-tts__2Jlxi"),
          ...document.querySelectorAll(".chat-message-sfx_chat-message-sfx__OGv6q"),
          ...document.querySelectorAll(".stocks-bar_stocks-bar__7kNv8")
        ];
        elements.forEach((el) => {
          if (el) {
            el.classList.remove("day-theme", "night-theme");
            el.classList.add(theme);
          }
        });
        const chatElements = document.querySelectorAll(".chat_chat__2rdNg");
        chatElements.forEach((el) => {
          el.style.removeProperty("background-image");
          el.style.removeProperty("background-size");
          el.style.removeProperty("background-position");
          el.style.removeProperty("background-repeat");
          el.style.removeProperty("background-color");
          if (el.style.opacity === "0") {
            el.style.setProperty("opacity", "1", "important");
          }
        });
        currentTheme = theme;
      };
      const checkAndSwitchTheme = () => {
        const targetElement = getElementByXPath(targetElementXPath);
        if (targetElement) {
          const useNightTheme = shouldUseNightTheme();
          const newTheme = useNightTheme ? "night-theme" : "day-theme";
          if (newTheme !== currentTheme) {
            applyTheme2(newTheme);
            console.log(`[Season 4] Switched to ${newTheme} at ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`);
          }
        }
      };
      applyTheme2("day-theme");
      themeInterval = setInterval(checkAndSwitchTheme, 6e4);
      checkAndSwitchTheme();
      themeObserver = new MutationObserver(() => {
        checkAndSwitchTheme();
      });
      themeObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
      return () => {
        if (themeInterval) {
          clearInterval(themeInterval);
        }
        if (themeObserver) {
          themeObserver.disconnect();
        }
        applyTheme2("day-theme");
      };
    },
    // Custom Image Replacement
    () => {
      let imageInterval = null;
      let currentImageTheme = null;
      let imageObserver = null;
      let originalSources = /* @__PURE__ */ new Map();
      const targetImageXPaths = [
        '//*[@id="__next"]/main/div[1]/div[1]/button[2]/img[1]',
        '//*[@id="__next"]/main/div[1]/div[1]/button[2]/img[2]'
      ];
      const getElementByXPath = (xpath) => {
        try {
          return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        } catch (error) {
          console.warn("[Season 4] Image XPath evaluation failed:", error);
          return null;
        }
      };
      const getCurrentTime = () => (/* @__PURE__ */ new Date()).getHours() + (/* @__PURE__ */ new Date()).getMinutes() / 60;
      const shouldUseNightTheme = () => {
        const settings = JSON.parse(localStorage.getItem("grizzway-tools-settings") || "{}");
        const forceMode = settings.season4ForceMode || window.grizzwaySeason4ForceMode;
        if (forceMode === "day") {
          return false;
        } else if (forceMode === "night") {
          return true;
        }
        const currentTime = getCurrentTime();
        return currentTime >= 22 || currentTime < 8;
      };
      const applyImageTheme = (theme) => {
        const daySrc = "https://i.imgur.com/5yhYE3u.png";
        const nightSrc = "https://i.imgur.com/W8t0QR1.png";
        const targetSrc = theme === "day-theme" ? daySrc : nightSrc;
        targetImageXPaths.forEach((xpath) => {
          const imgElement = getElementByXPath(xpath);
          if (imgElement) {
            if (!originalSources.has(imgElement)) {
              originalSources.set(imgElement, imgElement.src);
            }
            if (imgElement.src !== targetSrc) {
              imgElement.src = targetSrc;
              console.log(`[Season 4] Image source set to ${theme}: ${targetSrc}`);
            }
            imgElement.classList.remove("day-theme", "night-theme", "season4-custom-image");
            imgElement.classList.add("season4-custom-image", theme);
          }
        });
        currentImageTheme = theme;
      };
      const checkAndSwitchImages = () => {
        const newTheme = shouldUseNightTheme() ? "night-theme" : "day-theme";
        if (newTheme !== currentImageTheme) {
          applyImageTheme(newTheme);
        }
      };
      checkAndSwitchImages();
      imageInterval = setInterval(checkAndSwitchImages, 6e4);
      imageObserver = new MutationObserver(checkAndSwitchImages);
      imageObserver.observe(document.body, { childList: true, subtree: true });
      return () => {
        clearInterval(imageInterval);
        imageObserver.disconnect();
        originalSources.forEach((src, img) => {
          if (img) img.src = src;
        });
        originalSources.clear();
      };
    },
    // Theater Mode Detection and Restoration
    () => {
      let theaterInterval = null;
      let lastTheaterState = false;
      let originalChatBackgrounds = /* @__PURE__ */ new Map();
      const isInTheaterMode = () => {
        return !!document.querySelector(".live-stream-player_cinema__yPkWC");
      };
      const disableChatBackground = () => {
        console.log("[Season 4] Theater mode entered, hiding chat background...");
        const chatElements = document.querySelectorAll(".chat_chat__2rdNg");
        chatElements.forEach((el) => {
          if (!originalChatBackgrounds.has(el)) {
            originalChatBackgrounds.set(el, {
              backgroundImage: el.style.backgroundImage || getComputedStyle(el).backgroundImage,
              backgroundSize: el.style.backgroundSize || getComputedStyle(el).backgroundSize,
              backgroundPosition: el.style.backgroundPosition || getComputedStyle(el).backgroundPosition,
              backgroundRepeat: el.style.backgroundRepeat || getComputedStyle(el).backgroundRepeat,
              opacity: el.style.opacity || getComputedStyle(el).opacity
            });
          }
          el.style.setProperty("background-image", "none", "important");
          el.style.setProperty("background-color", "transparent", "important");
        });
        console.log("[Season 4] Chat background hidden for theater mode");
        const targetImageXPaths = [
          '//*[@id="__next"]/main/div[1]/div[1]/button[2]/img[1]',
          '//*[@id="__next"]/main/div[1]/div[1]/button[2]/img[2]'
        ];
        const getElementByXPath = (xpath) => {
          try {
            return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          } catch (error) {
            console.warn("[Season 4] Image XPath evaluation failed:", error);
            return null;
          }
        };
        targetImageXPaths.forEach((xpath) => {
          const imgElement = getElementByXPath(xpath);
          if (imgElement) {
            imgElement.style.setProperty("opacity", "0", "important");
          }
        });
      };
      const restoreThemeElements = () => {
        console.log("[Season 4] Theater mode exited, restoring theme elements...");
        const shouldUseNightTheme = () => {
          const settings = JSON.parse(localStorage.getItem("grizzway-tools-settings") || "{}");
          const forceMode = settings.season4ForceMode || window.grizzwaySeason4ForceMode;
          if (forceMode === "day") return false;
          if (forceMode === "night") return true;
          const currentTime = (/* @__PURE__ */ new Date()).getHours() + (/* @__PURE__ */ new Date()).getMinutes() / 60;
          return currentTime >= 22 || currentTime < 8;
        };
        const currentTheme = shouldUseNightTheme() ? "night-theme" : "day-theme";
        const chatElements = document.querySelectorAll(".chat_chat__2rdNg");
        const chatBgUrl = "https://files.catbox.moe/aqi0wq.gif";
        chatElements.forEach((el) => {
          el.style.setProperty("background-image", `url('${chatBgUrl}')`, "important");
          el.style.setProperty("background-size", "cover", "important");
          el.style.setProperty("background-position", "center", "important");
          el.style.setProperty("background-repeat", "no-repeat", "important");
          el.style.setProperty("background-color", "transparent", "important");
          console.log("[Season 4] Restored chat background image");
        });
        const targetImageXPaths = [
          '//*[@id="__next"]/main/div[1]/div[1]/button[2]/img[1]',
          '//*[@id="__next"]/main/div[1]/div[1]/button[2]/img[2]'
        ];
        const getElementByXPath = (xpath) => {
          try {
            return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          } catch (error) {
            console.warn("[Season 4] Image XPath evaluation failed:", error);
            return null;
          }
        };
        const daySrc = "https://i.imgur.com/5yhYE3u.png";
        const nightSrc = "https://i.imgur.com/W8t0QR1.png";
        const targetSrc = currentTheme === "day-theme" ? daySrc : nightSrc;
        targetImageXPaths.forEach((xpath) => {
          const imgElement = getElementByXPath(xpath);
          if (imgElement) {
            imgElement.src = targetSrc;
            console.log(`[Season 4] Restored custom image: ${targetSrc}`);
            imgElement.classList.remove("day-theme", "night-theme", "season4-custom-image");
            imgElement.classList.add("season4-custom-image", currentTheme);
          }
        });
        targetImageXPaths.forEach((xpath) => {
          const imgElement = getElementByXPath(xpath);
          if (imgElement) {
            imgElement.style.setProperty("opacity", "1", "important");
          }
        });
      };
      const checkTheaterMode = () => {
        const currentTheaterState = isInTheaterMode();
        if (currentTheaterState !== lastTheaterState) {
          console.log(`[Season 4] Theater mode changed: ${lastTheaterState} -> ${currentTheaterState}`);
          if (currentTheaterState && !lastTheaterState) {
            console.log("[Season 4] Theater mode ENTERED - hiding background");
            disableChatBackground();
          } else if (!currentTheaterState && lastTheaterState) {
            console.log("[Season 4] Theater mode EXITED - restoring background");
            restoreThemeElements();
          }
          lastTheaterState = currentTheaterState;
        }
      };
      checkTheaterMode();
      theaterInterval = setInterval(checkTheaterMode, 100);
      console.log("[Season 4] Theater mode monitoring started (100ms polling)");
      return () => {
        if (theaterInterval) {
          clearInterval(theaterInterval);
          console.log("[Season 4] Theater mode monitoring stopped");
        }
        originalChatBackgrounds.clear();
        document.body.classList.remove("season4");
        const chatElements = document.querySelectorAll(".chat_chat__2rdNg");
        chatElements.forEach((el) => {
          el.style.removeProperty("background-image");
          el.style.removeProperty("background-size");
          el.style.removeProperty("background-position");
          el.style.removeProperty("background-repeat");
          el.style.removeProperty("background-color");
          el.style.removeProperty("opacity");
          el.classList.remove("season4-restored-chat");
        });
      };
    },
    // Season 4 Configuration Handler
    () => {
      window.applySeason4ForceMode = function(mode) {
        const settings = JSON.parse(localStorage.getItem("grizzway-tools-settings") || "{}");
        settings.season4ForceMode = mode;
        localStorage.setItem("grizzway-tools-settings", JSON.stringify(settings));
        window.grizzwaySeason4ForceMode = mode;
        console.log(`[Season 4] Force mode set to: ${mode}`);
        const currentTheme = localStorage.getItem("grizzway_theme");
        if (currentTheme === "season4") {
          window.dispatchEvent(new CustomEvent("season4-force-mode-changed", { detail: { mode } }));
        }
      };
      console.log("[Season 4] Configuration handler initialized");
    }
  ];

  // src/styles/themes/index.js
  chao_default.scripts = scripts_default;
  egirl_default.scripts = scripts_default2;
  glowfish_default.scripts = scripts_default3;
  hacker_default.scripts = scripts_default4;
  season2_default.scripts = scripts_default5;
  season4_default.scripts = scripts_default6;
  var themes = {
    "chao": chao_default,
    "default": default_default,
    "egirl": egirl_default,
    "glowfish": glowfish_default,
    "hacker": hacker_default,
    "season2": season2_default,
    "season4": season4_default
  };
  var themes_default = themes;

  // src/utils/themeLoader.js
  var cleanupFunctions = [];
  function applyTheme(themeName) {
    console.log("[Grizzway Tools] Applying theme:", themeName);
    cleanupFunctions.forEach((fn) => {
      try {
        fn?.();
      } catch (e) {
        console.warn("[Grizzway Tools] Error during theme cleanup:", e);
      }
    });
    cleanupFunctions = [];
    const existingThemeStyle = document.getElementById("grizzway-theme-styles");
    if (existingThemeStyle) existingThemeStyle.remove();
    const theme = themes_default[themeName] || themes_default.default;
    injectBaseCSS();
    if (theme.style) {
      const styleElement = document.createElement("style");
      styleElement.id = "grizzway-theme-styles";
      styleElement.textContent = theme.style;
      document.head.appendChild(styleElement);
      console.log("[Grizzway Tools] Theme styles applied for:", themeName);
    }
    if (Array.isArray(theme.scripts)) {
      theme.scripts.forEach((fn, i) => {
        try {
          if (typeof fn === "function") {
            const cleanup = fn();
            if (typeof cleanup === "function") {
              cleanupFunctions.push(cleanup);
            }
            console.log(`[Grizzway Tools] Script ${i + 1} executed for:`, themeName);
          }
        } catch (e) {
          console.error(`[Grizzway Tools] Script ${i + 1} failed:`, e);
        }
      });
    } else {
      console.log(`[Grizzway Tools] No scripts to run for:`, themeName);
    }
  }

  // src/features/adHiding.js
  var adHidingInterval = null;
  function applyAdHiding(hideAds) {
    const adElements = document.querySelectorAll(".ads_ads__Z1cPk");
    if (hideAds) {
      adElements.forEach((ad) => {
        ad.style.opacity = "0";
        ad.style.pointerEvents = "none";
      });
      if (adElements.length > 0) {
        console.log("[Grizzway Tools] Hidden", adElements.length, "ad elements");
      }
    } else {
      adElements.forEach((ad) => {
        ad.style.opacity = "";
        ad.style.pointerEvents = "";
      });
      if (adElements.length > 0) {
        console.log("[Grizzway Tools] Restored", adElements.length, "ad elements");
      }
    }
  }
  function manageAdHidingInterval(hideAds) {
    if (adHidingInterval) {
      clearInterval(adHidingInterval);
      adHidingInterval = null;
    }
    if (hideAds) {
      adHidingInterval = setInterval(() => {
        applyAdHiding(true);
      }, 1e3);
      console.log("[Grizzway Tools] Ad hiding monitoring started");
    } else {
      console.log("[Grizzway Tools] Ad hiding monitoring stopped");
    }
  }
  function adHidingFeature() {
    console.log("[Grizzway Tools] Ad hiding feature initialized");
    const settings = loadSettings();
    const hideAds = settings.hideAds === true;
    console.log("[Grizzway Tools] Ad hiding setting from storage:", hideAds);
    console.log("[Grizzway Tools] Full settings object:", settings);
    applyAdHiding(hideAds);
    manageAdHidingInterval(hideAds);
    setTimeout(() => {
      applyAdHiding(hideAds);
    }, 500);
  }
  function updateAdHiding(hideAds) {
    console.log("[Grizzway Tools] Updating ad hiding to:", hideAds ? "enabled" : "disabled");
    applyAdHiding(hideAds);
    manageAdHidingInterval(hideAds);
  }

  // src/features/hideTheaterChat.js
  var theaterChatInterval = null;
  var lastCinemaState = false;
  var lastHideState = false;
  var hiddenElements = /* @__PURE__ */ new Set();
  function applyTheaterChatHiding(hideChat) {
    const cinemaElement = document.querySelector(".live-stream-player_cinema__yPkWC");
    const theaterChatElements = document.querySelectorAll(".chat_cinema__iXQz9");
    const isInCinemaMode = !!cinemaElement;
    if (isInCinemaMode !== lastCinemaState || hideChat !== lastHideState) {
      console.log("[Grizzway Tools] Cinema mode:", isInCinemaMode, "| Hide chat setting:", hideChat);
      console.log("[Grizzway Tools] Found", theaterChatElements.length, "theater chat elements");
      lastCinemaState = isInCinemaMode;
      lastHideState = hideChat;
    }
    if (hideChat && isInCinemaMode) {
      theaterChatElements.forEach((chat) => {
        chat.style.setProperty("opacity", "0", "important");
        chat.style.setProperty("z-index", "-999", "important");
        chat.style.setProperty("pointer-events", "none", "important");
        chat.setAttribute("data-grizzway-hidden", "true");
        hiddenElements.add(chat);
      });
      if (theaterChatElements.length > 0) {
        console.log("[Grizzway Tools] Hidden", theaterChatElements.length, "theater chat elements (cinema mode active)");
      }
    } else {
      hiddenElements.forEach((chat) => {
        if (chat.parentNode) {
          chat.style.removeProperty("opacity");
          chat.style.removeProperty("z-index");
          chat.style.removeProperty("pointer-events");
          chat.removeAttribute("data-grizzway-hidden");
        }
      });
      hiddenElements.clear();
      theaterChatElements.forEach((chat) => {
        chat.style.removeProperty("opacity");
        chat.style.removeProperty("z-index");
        chat.style.removeProperty("pointer-events");
        chat.removeAttribute("data-grizzway-hidden");
      });
      const hiddenChats = document.querySelectorAll('[data-grizzway-hidden="true"]');
      hiddenChats.forEach((chat) => {
        chat.style.removeProperty("opacity");
        chat.style.removeProperty("z-index");
        chat.style.removeProperty("pointer-events");
        chat.removeAttribute("data-grizzway-hidden");
      });
      if (theaterChatElements.length > 0) {
        if (!isInCinemaMode && hideChat) {
          console.log("[Grizzway Tools] Restored", theaterChatElements.length, "theater chat elements (exited cinema mode)");
        } else if (!hideChat) {
          console.log("[Grizzway Tools] Restored", theaterChatElements.length, "theater chat elements (hiding disabled)");
        }
      }
    }
  }
  function manageTheaterChatInterval(hideChat) {
    if (theaterChatInterval) {
      clearInterval(theaterChatInterval);
      theaterChatInterval = null;
    }
    theaterChatInterval = setInterval(() => {
      applyTheaterChatHiding(hideChat);
    }, 100);
    console.log("[Grizzway Tools] Theater chat monitoring started (cinema mode aware)");
  }
  function hideTheaterChatFeature() {
    console.log("[Grizzway Tools] Hide theater chat feature initialized");
    const settings = loadSettings();
    const hideChat = settings.hideTheaterChat === true;
    console.log("[Grizzway Tools] Hide theater chat setting from storage:", hideChat);
    applyTheaterChatHiding(hideChat);
    manageTheaterChatInterval(hideChat);
  }
  function updateTheaterChatHiding(hideChat) {
    console.log("[Grizzway Tools] Updating theater chat hiding to:", hideChat ? "enabled" : "disabled");
    if (!hideChat) {
      hiddenElements.clear();
    }
    applyTheaterChatHiding(hideChat);
    manageTheaterChatInterval(hideChat);
  }

  // src/features/configModal.js
  console.log("[Debug] Themes imported in configModal:", themes_default);
  console.log("[Debug] Available themes:", Object.keys(themes_default));
  console.log("[Debug] AVAILABLE_THEMES array:", AVAILABLE_THEMES);
  var AVAILABLE_THEMES = [
    { label: "Default", value: "default" },
    { label: "Chao Garden", value: "chao" },
    { label: "Hacker", value: "hacker" },
    { label: "Glow Fish", value: "glowfish" },
    { label: "Season 2", value: "season2" },
    { label: "Season 4", value: "season4" },
    { label: "E-Girl", value: "egirl" }
  ];
  async function fetchLiveStreams() {
    try {
      const response = await fetch("https://api.fishtank.live/v1/live-streams/");
      const data = await response.json();
      return data.liveStreams || [];
    } catch (error) {
      console.error("[Grizzway Tools] Failed to fetch live streams:", error);
      return [];
    }
  }
  function applyChatFiltering(settings) {
    if (!settings.streamChatFilterEnabled || !settings.selectedChatToShow) {
      removeChatFiltering();
      return;
    }
    removeChatFiltering();
    function filterMessages() {
      const messages = document.querySelectorAll(".chat-message-default_chat-message-default__JtJQL");
      messages.forEach((message) => {
        const watchingSpan = message.querySelector(".chat-message-default_watching__TBGGz");
        const isGlobalMessage = !watchingSpan;
        const streamName = watchingSpan ? watchingSpan.textContent.replace(" @", "").trim() : null;
        let shouldShow = false;
        if (settings.selectedChatToShow === "Global") {
          shouldShow = isGlobalMessage;
        } else {
          shouldShow = streamName === settings.selectedChatToShow;
        }
        message.style.display = shouldShow ? "" : "none";
      });
    }
    filterMessages();
    const chatContainer = document.querySelector("#chat-messages");
    if (chatContainer) {
      const observer = new MutationObserver(() => {
        filterMessages();
      });
      observer.observe(chatContainer, {
        childList: true,
        subtree: true
      });
      window.grizzwayChatFilterObserver = observer;
    }
    console.log("[Grizzway Tools] Applied chat filtering to show only:", settings.selectedChatToShow);
  }
  function removeChatFiltering() {
    const styleEl = document.querySelector("#grizzway-chat-filter-style");
    if (styleEl) {
      styleEl.remove();
    }
    if (window.grizzwayChatFilterObserver) {
      window.grizzwayChatFilterObserver.disconnect();
      window.grizzwayChatFilterObserver = null;
    }
    const messages = document.querySelectorAll(".chat-message-default_chat-message-default__JtJQL");
    messages.forEach((message) => {
      message.style.display = "";
    });
    console.log("[Grizzway Tools] Removed chat filtering");
  }
  function showConfigModal() {
    const existing = document.querySelector("#grizzway-config-modal");
    if (existing) existing.remove();
    const settings = loadSettings();
    const currentTheme = settings.theme || getCurrentTheme();
    const originalSettings = { ...settings };
    const overlay = document.createElement("div");
    overlay.id = "grizzway-config-modal-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 9998
    });
    const modal = document.createElement("div");
    modal.id = "grizzway-config-modal";
    Object.assign(modal.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 9999,
      backgroundColor: "rgba(34, 34, 34, 0.85)",
      color: "#fff",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 0 30px rgba(0,0,0,0.8)",
      border: "1px solid rgba(68, 68, 68, 0.8)",
      width: "78.125vw",
      maxWidth: "1500px",
      height: "auto",
      maxHeight: "85vh",
      fontFamily: "sans-serif",
      overflowY: "auto"
    });
    console.log("[Debug] Current theme from settings:", currentTheme);
    console.log("[Debug] Theme options will be generated from:", AVAILABLE_THEMES);
    const themeOptions = AVAILABLE_THEMES.map(
      ({ label, value }) => `<option value="${value}" ${value === currentTheme ? "selected" : ""}>${label}</option>`
    ).join("");
    modal.innerHTML = `
    <button id="close-config-modal" style="
      position: absolute;
      top: 15px;
      right: 15px;
      background: transparent;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: background-color 0.2s;
    " onmouseover="this.style.backgroundColor='rgba(255,255,255,0.1)'" onmouseout="this.style.backgroundColor='transparent'">
      <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path d="M5 3H3v18h18V3H5zm14 2v14H5V5h14zm-8 4H9V7H7v2h2v2h2v2H9v2H7v2h2v-2h2v-2h2v2h2v2h2v-2h-2v-2h-2v-2h2V9h2V7h-2v2h-2v2h-2V9z" fill="currentColor"></path>
      </svg>
    </button>

    <h1 style="
      text-align: center;
      font-size: 28px;
      margin-bottom: 30px;
      margin-top: 10px;
    ">Grizzway Tools Config</h1>

    <!-- Main Content Grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
      
      <!-- Left Column -->
      <div>
        <!-- Theme Selection -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 20px; margin-bottom: 15px; color: #fff;">Theme Settings</h2>
          <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; border: 1px solid rgba(68,68,68,0.5);">
            <label for="theme-select" style="display: block; margin-bottom: 10px; font-weight: bold;">Select Theme:</label>
            <select id="theme-select" style="
              width: 100%;
              padding: 10px;
              border-radius: 6px;
              border: 1px solid #666;
              background-color: #333;
              color: white;
              font-size: 14px;
            ">
              ${themeOptions}
            </select>
            <div id="theme-meta-display" style="color: #ccc; font-size: 14px; margin-top: 10px; text-align: center;"></div>
          </div>
        </div>

        <!-- Quick Toggles -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 20px; margin-bottom: 15px; color: #fff;">Quick Toggles</h2>
          <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; border: 1px solid rgba(68,68,68,0.5);">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <label style="display: flex; align-items: center; cursor: pointer; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 4px;">
                <input type="checkbox" id="hide-ads-toggle" style="margin-right: 10px;" ${settings.hideAds === true ? "checked" : ""}>
                <span style="font-weight: bold;">Hide Ads</span>
              </label>
              <label style="display: flex; align-items: center; cursor: pointer; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 4px;">
                <input type="checkbox" id="hide-theater-chat-toggle" style="margin-right: 10px;" ${settings.hideTheaterChat === true ? "checked" : ""}>
                <span style="font-weight: bold;">Hide Theater Chat</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Stream Chat Filtering -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 20px; margin-bottom: 15px; color: #fff;">Stream Chat Filtering</h2>
          <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; border: 1px solid rgba(68,68,68,0.5);">
            <div style="margin-bottom: 15px;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" id="stream-chat-filter-toggle" style="margin-right: 10px;" ${settings.streamChatFilterEnabled === true ? "checked" : ""}>
                <span style="font-weight: bold;">Enable stream chat filtering</span>
              </label>
              <div style="color: #ccc; font-size: 12px; margin-top: 5px; margin-left: 30px;">
                Show messages only from selected chat room
              </div>
            </div>

            <div id="stream-chat-filter-options" style="${settings.streamChatFilterEnabled !== true ? "opacity: 0.5; pointer-events: none;" : ""}">
              <label style="display: block; margin-bottom: 8px; font-weight: bold;">Chat to Show:</label>
              <select id="stream-chat-select" style="
                width: 100%;
                padding: 10px;
                border-radius: 6px;
                border: 1px solid #666;
                background-color: #333;
                color: white;
                font-size: 14px;
              ">
                <option value="">Loading chats...</option>
              </select>
              <div style="color: #ccc; font-size: 12px; margin-top: 8px;">
                Only messages from the selected chat will be visible
              </div>
            </div>
          </div>
        </div>

        <!-- Stream Title Styling -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 20px; margin-bottom: 15px; color: #fff;">Stream Title Styling</h2>
          <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; border: 1px solid rgba(68,68,68,0.5);">
            <div style="margin-bottom: 15px;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" id="stream-title-toggle" style="margin-right: 10px;" ${settings.streamTitleEnabled === true ? "checked" : ""}>
                <span style="font-weight: bold;">Enable stream title styling</span>
              </label>
            </div>

            <div id="stream-title-options" style="${settings.streamTitleEnabled !== true ? "opacity: 0.5; pointer-events: none;" : ""}">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <label style="display: block; margin-bottom: 8px; font-weight: bold;">Color:</label>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="color" id="stream-title-color" value="${settings.streamTitleColor || "#00ff00"}" style="width: 40px; height: 30px; border: 1px solid #666; border-radius: 4px; background: transparent; cursor: pointer;">
                    <span id="stream-title-color-value" style="font-family: monospace; font-size: 12px;">${settings.streamTitleColor || "#00ff00"}</span>
                  </div>
                </div>
                <div>
                  <label style="display: block; margin-bottom: 8px; font-weight: bold;">Glow Intensity:</label>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="range" id="stream-title-glow-intensity" min="0" max="10" step="0.5" value="${settings.streamTitleGlowIntensity || "2"}" style="flex: 1;">
                    <span id="glow-intensity-value" style="font-family: monospace; min-width: 25px; text-align: center; font-size: 12px;">${settings.streamTitleGlowIntensity || "2"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div>
        <!-- Logged-In User Styling -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 20px; margin-bottom: 15px; color: #fff;">Logged-In User Styling</h2>
          <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; border: 1px solid rgba(68,68,68,0.5);">
            <div style="margin-bottom: 15px;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" id="logged-in-styling-toggle" style="margin-right: 10px;" ${settings.loggedInUserStyling !== false ? "checked" : ""}>
                <span style="font-weight: bold;">Enable logged-in user styling</span>
              </label>
            </div>

            <div id="user-styling-options" style="${settings.loggedInUserStyling === false ? "opacity: 0.5; pointer-events: none;" : ""}">
              <!-- Message Highlight -->
              <div style="margin-bottom: 20px;">
                <div style="margin-bottom: 10px;">
                  <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="user-highlight-toggle" style="margin-right: 10px;" ${settings.userHighlightEnabled !== false ? "checked" : ""}>
                    <span style="font-weight: bold;">Message Highlight</span>
                  </label>
                </div>

                <div id="highlight-color-section" style="${settings.userHighlightEnabled === false ? "opacity: 0.5; pointer-events: none;" : ""}">
                  <label style="display: block; margin-bottom: 8px;">Highlight Color:</label>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="color" id="user-highlight-color" value="${settings.userHighlightColor || "#7d0505"}" style="width: 40px; height: 30px; border: 1px solid #666; border-radius: 4px; background: transparent; cursor: pointer;">
                    <span id="highlight-color-value" style="font-family: monospace; font-size: 12px;">${settings.userHighlightColor || "#7d0505"}</span>
                  </div>
                </div>
              </div>

              <!-- Username Glow -->
              <div>
                <div style="margin-bottom: 10px;">
                  <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="user-glow-toggle" style="margin-right: 10px;" ${settings.userGlowEnabled !== false ? "checked" : ""}>
                    <span style="font-weight: bold;">Username Glow</span>
                  </label>
                </div>

                <div id="glow-color-section" style="${settings.userGlowEnabled === false ? "opacity: 0.5; pointer-events: none;" : ""}">
                  <label style="display: block; margin-bottom: 8px;">Glow Color:</label>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="color" id="user-glow-color" value="${settings.userGlowColor || "#00ff00"}" style="width: 40px; height: 30px; border: 1px solid #666; border-radius: 4px; background: transparent; cursor: pointer;">
                    <span id="glow-color-value" style="font-family: monospace; font-size: 12px;">${settings.userGlowColor || "#00ff00"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div style="text-align: center;">
        <button id="save-config" style="
            background-color: #2B2D2E;
            color: #f8ec94;
            border: 2px solid transparent;
            padding: 12px;
            width: 80px;
            height: 48px;
            border-color: #666666;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: border-color 0.2s;" 
            onmouseover="this.style.borderColor='#00ff00'" onmouseout="this.style.borderColor='#666666'">Save</button>
    </div>
  `;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    const selectEl = document.querySelector("#theme-select");
    const themeMetaDisplay = document.querySelector("#theme-meta-display");
    function updateThemeMetaDisplay(themeKey) {
      const theme = themes_default[themeKey];
      if (theme) {
        themeMetaDisplay.textContent = `Selected theme: ${theme.name} by ${theme.author}`;
      } else {
        themeMetaDisplay.textContent = "";
      }
    }
    updateThemeMetaDisplay(selectEl.value);
    selectEl.addEventListener("change", () => {
      updateThemeMetaDisplay(selectEl.value);
      applyTheme(selectEl.value);
    });
    const streamChatSelect = document.querySelector("#stream-chat-select");
    fetchLiveStreams().then((streams) => {
      streamChatSelect.innerHTML = '<option value="">Select a chat...</option>';
      const globalOption = document.createElement("option");
      globalOption.value = "Global";
      globalOption.textContent = "Global Chat";
      if (settings.selectedChatToShow === "Global") {
        globalOption.selected = true;
      }
      streamChatSelect.appendChild(globalOption);
      streams.forEach((stream) => {
        const option = document.createElement("option");
        option.value = stream.name;
        option.textContent = stream.name;
        if (settings.selectedChatToShow === stream.name) {
          option.selected = true;
        }
        streamChatSelect.appendChild(option);
      });
      console.log("[Grizzway Tools] Loaded available chats:", ["Global", ...streams.map((s) => s.name)]);
    });
    function revertToOriginalSettings() {
      console.log("[Grizzway Tools] Reverting to original settings");
      if (selectEl.value !== originalSettings.theme) {
        applyTheme(originalSettings.theme || "default");
      }
      updateAdHiding(originalSettings.hideAds === true);
      updateTheaterChatHiding(originalSettings.hideTheaterChat === true);
      applyChatFiltering(originalSettings);
      if (originalSettings.streamTitleEnabled === true) {
        updateStreamTitleStyle(
          originalSettings.streamTitleColor || "#00ff00",
          originalSettings.streamTitleGlowIntensity || 2
        );
      } else {
        updateStreamTitleStyle(null);
      }
      updateLoggedInUserCSS();
    }
    const hideAdsToggle = document.querySelector("#hide-ads-toggle");
    hideAdsToggle.addEventListener("change", () => {
      updateAdHiding(hideAdsToggle.checked);
    });
    const hideTheaterChatToggle = document.querySelector("#hide-theater-chat-toggle");
    hideTheaterChatToggle.addEventListener("change", () => {
      updateTheaterChatHiding(hideTheaterChatToggle.checked);
    });
    const streamChatFilterToggle = document.querySelector("#stream-chat-filter-toggle");
    const streamChatFilterOptions = document.querySelector("#stream-chat-filter-options");
    streamChatFilterToggle.addEventListener("change", () => {
      streamChatFilterOptions.style.opacity = streamChatFilterToggle.checked ? "1" : "0.5";
      streamChatFilterOptions.style.pointerEvents = streamChatFilterToggle.checked ? "auto" : "none";
      if (streamChatFilterToggle.checked && streamChatSelect.value) {
        applyChatFiltering({
          streamChatFilterEnabled: true,
          selectedChatToShow: streamChatSelect.value
        });
      } else {
        removeChatFiltering();
      }
    });
    streamChatSelect.addEventListener("change", () => {
      if (streamChatFilterToggle.checked && streamChatSelect.value) {
        applyChatFiltering({
          streamChatFilterEnabled: true,
          selectedChatToShow: streamChatSelect.value
        });
      }
    });
    const streamTitleToggle = document.querySelector("#stream-title-toggle");
    const streamTitleOptions = document.querySelector("#stream-title-options");
    const streamTitleColorInput = document.querySelector("#stream-title-color");
    const streamTitleColorValue = document.querySelector("#stream-title-color-value");
    const streamTitleGlowIntensity = document.querySelector("#stream-title-glow-intensity");
    const glowIntensityValue = document.querySelector("#glow-intensity-value");
    streamTitleToggle.addEventListener("change", () => {
      streamTitleOptions.style.opacity = streamTitleToggle.checked ? "1" : "0.5";
      streamTitleOptions.style.pointerEvents = streamTitleToggle.checked ? "auto" : "none";
      if (streamTitleToggle.checked) {
        updateStreamTitleStyle(streamTitleColorInput.value, parseFloat(streamTitleGlowIntensity.value));
      } else {
        updateStreamTitleStyle(null);
      }
    });
    streamTitleColorInput.addEventListener("input", () => {
      streamTitleColorValue.textContent = streamTitleColorInput.value;
      if (streamTitleToggle.checked) {
        updateStreamTitleStyle(streamTitleColorInput.value, parseFloat(streamTitleGlowIntensity.value));
      }
    });
    streamTitleGlowIntensity.addEventListener("input", () => {
      glowIntensityValue.textContent = streamTitleGlowIntensity.value;
      if (streamTitleToggle.checked) {
        updateStreamTitleStyle(streamTitleColorInput.value, parseFloat(streamTitleGlowIntensity.value));
      }
    });
    const loggedInToggle = document.querySelector("#logged-in-styling-toggle");
    const userStylingOptions = document.querySelector("#user-styling-options");
    const highlightToggle = document.querySelector("#user-highlight-toggle");
    const glowToggle = document.querySelector("#user-glow-toggle");
    const highlightColorSection = document.querySelector("#highlight-color-section");
    const glowColorSection = document.querySelector("#glow-color-section");
    const highlightColorInput = document.querySelector("#user-highlight-color");
    const glowColorInput = document.querySelector("#user-glow-color");
    const highlightColorValue = document.querySelector("#highlight-color-value");
    const glowColorValue = document.querySelector("#glow-color-value");
    loggedInToggle.addEventListener("change", () => {
      userStylingOptions.style.opacity = loggedInToggle.checked ? "1" : "0.5";
      userStylingOptions.style.pointerEvents = loggedInToggle.checked ? "auto" : "none";
    });
    highlightToggle.addEventListener("change", () => {
      highlightColorSection.style.opacity = highlightToggle.checked ? "1" : "0.5";
      highlightColorSection.style.pointerEvents = highlightToggle.checked ? "auto" : "none";
    });
    glowToggle.addEventListener("change", () => {
      glowColorSection.style.opacity = glowToggle.checked ? "1" : "0.5";
      glowColorSection.style.pointerEvents = glowToggle.checked ? "auto" : "none";
    });
    highlightColorInput.addEventListener("input", () => {
      highlightColorValue.textContent = highlightColorInput.value;
    });
    glowColorInput.addEventListener("input", () => {
      glowColorValue.textContent = glowColorInput.value;
    });
    document.querySelector("#save-config").addEventListener("click", () => {
      const newSettings = {
        theme: selectEl.value,
        hideAds: hideAdsToggle.checked,
        hideTheaterChat: hideTheaterChatToggle.checked,
        streamChatFilterEnabled: streamChatFilterToggle.checked,
        selectedChatToShow: streamChatSelect.value,
        streamTitleEnabled: streamTitleToggle.checked,
        streamTitleColor: streamTitleColorInput.value,
        streamTitleGlowIntensity: parseFloat(streamTitleGlowIntensity.value),
        loggedInUserStyling: loggedInToggle.checked,
        userHighlightEnabled: highlightToggle.checked,
        userGlowEnabled: glowToggle.checked,
        userHighlightColor: highlightColorInput.value,
        userGlowColor: glowColorInput.value
      };
      localStorage.setItem("grizzway_theme", newSettings.theme);
      saveSettings(newSettings);
      applyTheme(newSettings.theme);
      updateLoggedInUserCSS();
      blockSoundsFeature();
      updateAdHiding(newSettings.hideAds);
      updateTheaterChatHiding(newSettings.hideTheaterChat);
      applyChatFiltering(newSettings);
      if (newSettings.streamTitleEnabled) {
        streamTitleStyleFeature(newSettings.streamTitleColor, newSettings.streamTitleGlowIntensity);
      } else {
        updateStreamTitleStyle(null);
      }
      overlay.remove();
      console.log("[Grizzway Tools] Settings saved:", newSettings);
    });
    document.querySelector("#close-config-modal").addEventListener("click", () => {
      revertToOriginalSettings();
      overlay.remove();
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        revertToOriginalSettings();
        overlay.remove();
      }
    });
  }

  // src/features/configButton.js
  function configButtonFeature() {
    const BUTTON_ID = "grizz-config-button";
    const ICON_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 16 16">
      <path d="M.102 2.223A3.004 3.004 0 0 0 3.78 5.897l6.341 6.252A3.003 3.003 0 0 0 13 16a3 3 0 1 0-.851-5.878L5.897 3.781A3.004 3.004 0 0 0 2.223.1l2.141 2.142L4 4l-1.757.364L.102 2.223zm13.37 9.019.528.026.287.445.445.287.026.529L15 13l-.242.471-.026.529-.445.287-.287.445-.529.026L13 15l-.471-.242-.529-.026-.287-.445-.445-.287-.026-.529L11 13l.242-.471.026-.529.445-.287.287-.445.529-.026L13 11l.471.242z"/>
    </svg>
  `;
    function createButton() {
      const btn = document.createElement("button");
      btn.id = BUTTON_ID;
      btn.className = "top-bar_link__0xN4F top-bar_red__1Up8r";
      btn.innerHTML = `<span><div class="icon_icon__bDzMA" style="color:black !important; ">${ICON_SVG}</div></span>Config`;
      Object.assign(btn.style, {
        backgroundColor: "rgb(0 255 0 / 35%)",
        borderColor: "rgb(0 0 0 / 93%)",
        boxShadow: "0 0 8px 2px #00FF00",
        animation: "pulseGlow 2s infinite"
      });
      btn.addEventListener("click", () => {
        console.log("[Grizzway Tools] Config button clicked");
        showConfigModal();
      });
      return btn;
    }
    function insertButton() {
      const container = document.querySelector(".top-bar_links__4FJwt");
      if (!container || document.getElementById(BUTTON_ID)) return;
      console.log("[Grizzway Tools] Inserting config button");
      const btn = createButton();
      container.insertBefore(btn, container.firstChild);
    }
    if (!document.getElementById("glow-keyframes")) {
      const style = document.createElement("style");
      style.id = "glow-keyframes";
      style.textContent = `
      @keyframes pulseGlow {
        0% { box-shadow: 0 0 5px 1px #00FF00; }
        50% { box-shadow: 0 0 10px 3px #00FF00; }
        100% { box-shadow: 0 0 5px 1px #00FF00; }
      }
    `;
      document.head.appendChild(style);
    }
    function waitForTopBar() {
      const existing = document.querySelector(".top-bar_links__4FJwt");
      if (existing) {
        insertButton();
      } else {
        const observer = new MutationObserver(() => {
          const container = document.querySelector(".top-bar_links__4FJwt");
          if (container) {
            insertButton();
            observer.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }
    waitForTopBar();
    setInterval(insertButton, 3e3);
  }

  // src/features/unwantedClasses.js
  var unwantedClasses = [
    "mirror",
    "live-stream-player_blur__7BhBE",
    "live-stream-player_upside-down__YvkE4",
    "chat-message-default_shrink-ray__nGvpr",
    "blind"
  ];
  function unwantedClassesFeature() {
    function removeUnwantedClasses() {
      const body = document.querySelector("body");
      if (body) {
        unwantedClasses.forEach((className) => {
          if (body.classList.contains(className)) {
            body.classList.remove(className);
          }
        });
      }
      const videoPlayer = document.querySelector(".live-stream-player_live-stream-player__4CHjG");
      if (videoPlayer) {
        unwantedClasses.forEach((className) => {
          const elementsWithClass = videoPlayer.querySelectorAll(`.${className}`);
          elementsWithClass.forEach((el) => el.classList.remove(className));
          if (videoPlayer.classList.contains(className)) {
            videoPlayer.classList.remove(className);
          }
        });
      }
      const chatContainer = document.querySelector("#chat-messages.chat-messages_chat-messages__UeL0a");
      if (chatContainer) {
        unwantedClasses.forEach((className) => {
          const chatElements = chatContainer.querySelectorAll(`.${className}`);
          chatElements.forEach((el) => el.classList.remove(className));
        });
      }
    }
    setInterval(removeUnwantedClasses, 1e3);
    console.log("[Grizzway Tools] Unwanted classes removal feature initialized");
  }

  // src/index.js
  function initMedalFunctionality() {
    let isElementVisible = false;
    function changeMedalSize(isVisible) {
      const buttons = document.querySelectorAll(".medal_medal__Hqowf.medal_md__RvQMV button");
      buttons.forEach((button) => {
        if (isVisible) {
          button.style.setProperty("--medal-size", "32px");
        } else {
          button.style.setProperty("--medal-size", "64px");
        }
      });
    }
    function checkElement() {
      const medalSelector = document.querySelector(".medal-selector_medals__sk3PN");
      if (medalSelector) {
        const rect = medalSelector.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        if (isVisible !== isElementVisible) {
          isElementVisible = isVisible;
          changeMedalSize(isElementVisible);
        }
      } else {
        if (isElementVisible) {
          isElementVisible = false;
          changeMedalSize(false);
        }
      }
    }
    setInterval(checkElement, 100);
  }
  function applyOptionalStyles() {
    const theme = getThemeConfig();
    const styleId = "optionalStyles";
    if (!theme || !theme.customStyles) {
      console.warn("[Grizzway Tools] No customStyles found in selected theme.");
      return;
    }
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = theme.customStyles;
    document.head.appendChild(style);
  }
  function init() {
    if (location.hostname === "api.fishtank.live") return;
    console.log("[Grizzway Tools] Script initialized on:", location.hostname);
    injectBaseCSS();
    let currentTheme = getCurrentTheme();
    if (!currentTheme) {
      currentTheme = "default";
      setThemeName("default");
    }
    applyTheme(currentTheme);
    applyOptionalStyles();
    console.log("[Grizzway Tools] Initializing features...");
    try {
      blockSoundsFeature();
      console.log("[Grizzway Tools] \u2713 blockSoundsFeature initialized");
    } catch (e) {
      console.error("[Grizzway Tools] \u2717 blockSoundsFeature failed:", e);
    }
    try {
      chatLinkButtonsFeature();
      console.log("[Grizzway Tools] \u2713 chatLinkButtonsFeature initialized");
    } catch (e) {
      console.error("[Grizzway Tools] \u2717 chatLinkButtonsFeature failed:", e);
    }
    try {
      loggedInUserStylingFeature();
      console.log("[Grizzway Tools] \u2713 loggedInUserStylingFeature initialized");
    } catch (e) {
      console.error("[Grizzway Tools] \u2717 loggedInUserStylingFeature failed:", e);
    }
    try {
      addGrizzwaySpecialCSS();
      grizzwaySpecialStylingFeature();
      console.log("[Grizzway Tools] \u2713 grizzwaySpecialStylingFeature initialized");
    } catch (e) {
      console.error("[Grizzway Tools] \u2717 grizzwaySpecialStylingFeature failed:", e);
    }
    try {
      modalFixesFeature();
      console.log("[Grizzway Tools] \u2713 modalFixesFeature initialized");
    } catch (e) {
      console.error("[Grizzway Tools] \u2717 modalFixesFeature failed:", e);
    }
    try {
      addProfileEditingCSS();
      console.log("[Grizzway Tools] \u2713 Profile editing CSS initialized");
    } catch (e) {
      console.error("[Grizzway Tools] \u2717 Profile editing CSS failed:", e);
    }
    try {
      profileFixFeature();
      console.log("[Grizzway Tools] \u2713 profileFixFeature initialized");
    } catch (e) {
      console.error("[Grizzway Tools] \u2717 profileFixFeature failed:", e);
    }
    try {
      observeProfileFix();
      console.log("[Grizzway Tools] \u2713 observeProfileFix initialized");
    } catch (e) {
      console.error("[Grizzway Tools] \u2717 observeProfileFix failed:", e);
    }
    try {
      streamTitleStyleFeature();
      console.log("[Grizzway Tools] \u2713 streamTitleStyleFeature initialized");
    } catch (e) {
      console.error("[Grizzway Tools] \u2717 streamTitleStyleFeature failed:", e);
    }
    try {
      configButtonFeature();
      console.log("[Grizzway Tools] \u2713 configButtonFeature initialized");
    } catch (e) {
      console.error("[Grizzway Tools] \u2717 configButtonFeature failed:", e);
    }
    try {
      adHidingFeature();
      console.log("[Grizzway Tools] \u2713 adHidingFeature initialized");
    } catch (e) {
      console.error("[Grizzway Tools] \u2717 adHidingFeature failed:", e);
    }
    try {
      hideTheaterChatFeature();
      console.log("[Grizzway Tools] \u2713 hideTheaterChatFeature initialized");
    } catch (e) {
      console.error("[Grizzway Tools] \u2717 hideTheaterChatFeature failed:", e);
    }
    try {
      unwantedClassesFeature();
      console.log("[Grizzway Tools] \u2713 unwantedClassesFeature initialized");
    } catch (e) {
      console.error("[Grizzway Tools] \u2717 unwantedClassesFeature failed:", e);
    }
    try {
      initMedalFunctionality();
      console.log("[Grizzway Tools] \u2713 Medal functionality initialized");
    } catch (e) {
      console.error("[Grizzway Tools] \u2717 Medal functionality failed:", e);
    }
    console.log("[Grizzway Tools] All features initialization completed");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

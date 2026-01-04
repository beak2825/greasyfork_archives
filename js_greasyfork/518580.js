// ==UserScript==
// @name         Sore Foot Club - RR Mugger Detection
// @namespace    dekleinekobini.rr-mugger-detect
// @version      1.1.6
// @author       DeKleineKobini [2114440]
// @description  Sore Foot Club Scripts - RR Mugger Detection & Watcher Requests
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @connect      api.no1irishstig.co.uk
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/518580/Sore%20Foot%20Club%20-%20RR%20Mugger%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/518580/Sore%20Foot%20Club%20-%20RR%20Mugger%20Detection.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" .mugger-detect-message {color:var(--detect-color);background-color:var(--detect-background-color);text-align:center;padding:2px;font-size:16px;line-height:20px}@media only screen and (min-width: 768px) {.mugger-detect-message {color:var(--detect-color);background-color:var(--detect-background-color);text-align:center;padding:5px;font-size:18px;line-height:24px}.mugger-detect-message .title{line-height:30px}}.mugger-detect-message .title{line-height:25px}.mugger-detect-message .message{line-height:20px}.mugger-detect-message a{color:var(--detect-link-color, #fff);text-decoration:none}[class*=headerWrap___]{height:unset!important}.mugger-detect-watcher{display:flex;align-items:center;justify-content:space-between;color:var(--appheader-links-color, #777);cursor:pointer;text-shadow:var(--appheader-links-text-shadow-color, 0 1px 0 hsla(0, 0%, 100%, .651));height:100%;font:inherit}.mugger-detect-watcher svg{display:flex;align-items:center;justify-content:center;box-sizing:border-box;pointer-events:none;margin-right:7px;fill:var(--icon-color, var(--appheader-links-fill, url(#app-header-gradient)));margin-bottom:3px}@media screen and (max-width: 784px){.mugger-detect-watcher svg{margin-right:0;margin-bottom:0}}.mugger-detect-watcher span{font-weight:700}@media screen and (max-width: 784px){.mugger-detect-watcher span{display:none}}.mugger-detect-watcher--success{--icon-color:#54b358;color:#54b358}.mugger-detect-watcher--failure{--icon-color:#f77a71;color:#f77a71} ");

(function () {
  'use strict';

  const SCRIPT_VERSION = "1.1.6";
  const CHAT_SELECTORS = Object.freeze({
    /*
     * Global
     */
    CHAT_ROOT_ID: "chatRoot",
    AVATAR_WRAPPER_CLASS: "avatar__avatar-status-wrapper___",
    /*
     * Chat Boxes
     */
    GROUP_MENU_DESKTOP_CLASS: "minimized-menus__desktop___",
    GROUP_MENU_MOBILE_CLASS: "minimized-menus__mobile___",
    GROUP_MENU_MOBILE_BUTTON_CLASS: "minimized-menus__mobile-button___",
    CHAT_LIST_CLASS: "chat-app__chat-list-chat-box-wrapper___",
    CHAT_LIST_GROUP_CHAT_CLASS: "minimized-menu-item___",
    CHAT_LIST_NOTEPAD_CLASS: "chat-note-button___",
    CHAT_LIST_SETTINGS_CLASS: "chat-setting-button___",
    CHAT_LIST_PEOPLE_CLASS: "chat-list-button___",
    CHAT_MESSAGE_COUNT_CLASS: "message-count___",
    CHAT_WRAPPER_WRAPPER_CLASS: "group-chat-box___",
    CHAT_WRAPPER_CLASS: "group-chat-box__chat-box-wrapper___",
    CHAT_HEADER_CLASS: "chat-box-header___",
    CHAT_HEADER_INFO_BUTTON_CLASS: "chat-box-header__info-btn___",
    CHAT_HEADER_INFO_CLASS: "chat-box-header__info___",
    CHAT_HEADER_AVATAR_CLASS: "chat-box-header__avatar___",
    CHAT_HEADER_MINIMIZE_ICON_CLASS: "minimize-icon",
    CHAT_HEADER_CLOSE_ICON_CLASS: "close-icon",
    CHAT_BODY_CLASS: "chat-box-body___",
    /*
     * Messages
     */
    COLOR_ERROR_CLASS: "color-chatError",
    MESSAGE_BODY_WRAPPER_CLASS: "chat-box-message___",
    MESSAGE_BODY_WRAPPER_SELF_CLASS: "chat-box-message--self___",
    MESSAGE_BODY_CLASS: "chat-box-message__box___",
    MESSAGE_BODY_SELF_CLASS: "chat-box-message__box--self___",
    MESSAGE_SENDER_CLASS: "chat-box-message__sender___",
    MESSAGE_MINIMIZED_BOX_AVATAR_CLASS: "minimized-chat-box__avatar___",
    MESSAGE_AVATAR_CLASS: "chat-box-message__avatar___",
    MESSAGE_CONTENT_WRAPPER_CLASS: "chat-box-message__message___",
    MESSAGE_SEND_BUTTON_CLASS: "chat-box-footer__send-icon-wrapper___",
    LAST_MESSAGE_TIMESTAMP_CLASS: "chat-box-body__lastmessage-timestamp___",
    /*
     * People Panel
     */
    PANEL_WRAPPER_CLASS: "chat-app__panel___",
    /*
     * People Panel
     */
    PEOPLE_PANEL_LOADING: "chat-tab__loader___",
    PEOPLE_PANEL_CLASS: "chat-tab___",
    PEOPLE_PANEL_CLOSE_BUTTON_ID: "_close_default_dark",
    PEOPLE_PANEL_SETTINGS_BUTTON_ID: "setting_default",
    PEOPLE_PANEL_HEADER_BUTTON: "chat-list-header__button___",
    PEOPLE_PANEL_TABS_WRAPPER_CLASS: "chat-list-header__tabs___",
    PEOPLE_PANEL_TAB_ACTIVE_CLASS: "chat-list-header__tab--active___",
    PEOPLE_PANEL_TAB_CONTENT_CLASS: "chat-tab-content___",
    PEOPLE_PANEL_MEMBER_CARD_CLASS: "member-card___",
    PEOPLE_PANEL_STATUS_ONLINE_CLASS: "online-status--online___",
    PEOPLE_PANEL_STATUS_IDLE_CLASS: "online-status--idle___",
    PEOPLE_PANEL_STATUS_OFFLINE_CLASS: "online-status--offline___",
    /*
     * Settings Panel
     */
    SETTINGS_PANEL_CLASS: "settings-panel___",
    SETTINGS_PANEL_HEADER_CLASS: "settings-header___",
    SETTINGS_PANEL_HEADER_TITLE_CLASS: "settings-header__text-container___",
    SETTINGS_PANEL_CLOSE_BUTTON_CLASS: "settings-header__close-button___"
  });
  function findByPartialClass(node, className, subSelector = "") {
    return node.querySelector(`[class*='${className}'] ${subSelector}`.trim());
  }
  async function findDelayed(node, findElement, timeout) {
    return new Promise((resolve, reject) => {
      const initialElement = findElement();
      if (initialElement) {
        resolve(initialElement);
        return;
      }
      const observer = new MutationObserver(() => {
        const element = findElement();
        element && (clearTimeout(timeoutId), observer.disconnect(), resolve(element));
      }), timeoutId = setTimeout(() => {
        observer.disconnect(), reject("Failed to find the element within the acceptable timeout.");
      }, timeout);
      observer.observe(node, { childList: true, subtree: true });
    });
  }
  async function findBySelectorDelayed(node, selector, timeout = 5e3) {
    return findDelayed(node, () => node.querySelector(selector), timeout);
  }
  let currentPlayerName, currentPlayerId;
  function getCurrentPlayerName() {
    if (currentPlayerName)
      return currentPlayerName;
    const websocketElement = document.getElementById("websocketConnectionData");
    if (websocketElement) {
      const data = JSON.parse(websocketElement.textContent);
      return currentPlayerName = data.playername, data.playername;
    }
    const sidebarElement = findByPartialClass(document, "menu-value___");
    if (sidebarElement)
      return currentPlayerName = sidebarElement.textContent, sidebarElement.textContent;
    const attackerElement = document.querySelector(".user-name.left");
    if (attackerElement)
      return currentPlayerName = attackerElement.textContent, attackerElement.textContent;
    const chatSenderElement = document.querySelector(
      `[class*='${CHAT_SELECTORS.MESSAGE_BODY_WRAPPER_SELF_CLASS}'] [class*='${CHAT_SELECTORS.MESSAGE_SENDER_CLASS}']`
    );
    if (chatSenderElement) {
      let name = chatSenderElement.textContent;
      return name = name.substring(0, name.length - 1), currentPlayerName = name, name;
    }
    return console.warn("[Playground] Failed to get the current player's name."), "unknown current player";
  }
  function getCurrentPlayerId() {
    if (currentPlayerId)
      return currentPlayerId;
    const websocketElement = document.getElementById("websocketConnectionData");
    if (websocketElement) {
      const data = JSON.parse(websocketElement.textContent);
      return currentPlayerId = parseInt(data.userID, 10), parseInt(data.userID, 10);
    }
    const userInputElement = document.getElementById("torn-user");
    if (userInputElement) {
      const data = JSON.parse(userInputElement.getAttribute("value"));
      return currentPlayerId = data.id, data.id;
    }
    return console.warn("[Playground] Failed to get the current player's id."), null;
  }
  var MessageType = /* @__PURE__ */ ((MessageType2) => {
    MessageType2["WARNING"] = "WARNING";
    MessageType2["SAFE"] = "SAFE";
    MessageType2["DISABLED"] = "DISABLED";
    MessageType2["ERROR"] = "ERROR";
    return MessageType2;
  })(MessageType || {});
  const SETTINGS = {
      [
        "WARNING"
        /* WARNING */
      ]: {
        title: "- WARNING -",
        message: (_, opponent) => `<a href="https://tcy.sh/p/${opponent.id}" target="_blank">${opponent.name}</a> is a known mugger.`,
        color: "#520a04",
        backgroundColor: "#f77a71",
        linkColor: "#fff"
      },
      [
        "SAFE"
        /* SAFE */
      ]: {
        title: "- Probably Safe -",
        message: (_, opponent) => `<a href="https://tcy.sh/p/${opponent.id}" target="_blank">${opponent.name}</a> is not a known mugger.`,
        color: "#132c15",
        backgroundColor: "#54b358",
        linkColor: "#fff"
      },
      [
        "DISABLED"
        /* DISABLED */
      ]: {
        title: "- Script Disabled -",
        message: `You are not a <a href="https://discord.gg/58HgDHbxhd" target="_blank">Sore Foot Club</a> member.`,
        color: "#3a006d",
        backgroundColor: "#c582ff",
        linkColor: "#fff"
      },
      [
        "ERROR"
        /* ERROR */
      ]: {
        title: "- Error -",
        message: "Something went wrong. Unable to fetch the mugger status.",
        color: "#322500",
        backgroundColor: "#cb9800"
      }
    };
  var RussianRouletteSubpage = /* @__PURE__ */ ((RussianRouletteSubpage2) => {
    RussianRouletteSubpage2["GAME"] = "GAME";
    RussianRouletteSubpage2["OVERVIEW"] = "OVERVIEW";
    RussianRouletteSubpage2["UNKNOWN"] = "UNKNOWN";
    return RussianRouletteSubpage2;
  })(RussianRouletteSubpage || {});
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  let currentPage = RussianRouletteSubpage.UNKNOWN;
  const SELECTOR_APP_CONTAINER = "[class*='appContainer___']";
  const SELECTOR_PLAYER_NAME = "[class*='titleWrap___'] [class*='title___']";
  const SELECTOR_LINKS_CONTAINER = "[class*='linksContainer___']";
  void onPageLoad();
  function getSubpage() {
    const { hash } = window.location;
    switch (hash) {
      case "#/game":
        return RussianRouletteSubpage.GAME;
      case "#/":
        return RussianRouletteSubpage.OVERVIEW;
      default:
        return RussianRouletteSubpage.UNKNOWN;
    }
  }
  async function onPageLoad() {
    const rootElement = await findBySelectorDelayed(document, SELECTOR_APP_CONTAINER);
    if (!rootElement) {
      console.error("[RR Mugger Detect] Couldn't load due to the game container not being found.");
      return;
    }
    new MutationObserver(() => {
      const subpage = getSubpage();
      onSubpage(subpage);
    }).observe(rootElement, { childList: true });
    onSubpage(currentPage);
    addRequestIcon();
  }
  function onSubpage(subpage) {
    if (currentPage === subpage) return;
    currentPage = subpage;
    onSubpageChange(subpage);
  }
  function onSubpageChange(subpage) {
    if (subpage === RussianRouletteSubpage.GAME) {
      findBySelectorDelayed(document, SELECTOR_PLAYER_NAME).then(handleGameLoading).catch((reason) => {
        console.error("[RR Mugger Detect] Couldn't properly load the script.", reason);
      });
    }
  }
  function handleGameLoading() {
    const waitingTitleElement = document.querySelector(`${SELECTOR_PLAYER_NAME}[href='/#']`);
    if (!waitingTitleElement) {
      handleGameLoaded();
      return;
    }
    new MutationObserver((_, observer) => {
      observer.disconnect();
      handleGameLoaded();
    }).observe(waitingTitleElement, { attributes: true, attributeFilter: ["href"] });
  }
  function handleGameLoaded() {
    if (document.querySelector(".mugger-detect-message")) {
      return;
    }
    const playerElements = Array.from(document.querySelectorAll(SELECTOR_PLAYER_NAME));
    const playerIds = playerElements.map((element) => {
      const idMatch = element.href.match(/XID=(\d+)/);
      if (!idMatch) return null;
      return {
        id: parseInt(idMatch[1], 10),
        name: element.textContent.trim()
      };
    }).filter((result) => !!result);
    if (playerIds.length !== 2) return;
    const userId = getCurrentPlayerId();
    const user = playerIds.find(({ id }) => id === userId);
    const opponent = playerIds.find(({ id }) => id !== userId);
    if (!user || !opponent) return;
    fetchMuggerDetection(user.id, opponent.id).then((detection) => showDetection(user, opponent, detection)).catch((reason) => {
      showDetection(user, opponent, null);
      console.error("[RR Mugger Detect] Failed to fetch the mugger status.", reason);
    });
  }
  function removeDetectionMessages() {
    Array.from(document.querySelectorAll(".mugger-detect-message")).forEach((message) => message.remove());
  }
  function showDetection(user, opponent, detection) {
    removeDetectionMessages();
    const wrapperElement = document.createElement("div");
    wrapperElement.classList.add("mugger-detect-message");
    let type;
    if (!detection) type = MessageType.ERROR;
    else if (!detection.is_member) type = MessageType.DISABLED;
    else if (!detection.is_mugger) type = MessageType.SAFE;
    else type = MessageType.WARNING;
    const settings = SETTINGS[type];
    wrapperElement.style.setProperty("--detect-color", settings.color);
    wrapperElement.style.setProperty("--detect-background-color", settings.backgroundColor);
    if (settings.linkColor) {
      wrapperElement.style.setProperty("--detect-link-color", settings.linkColor);
    }
    const titleElement = document.createElement("span");
    titleElement.classList.add("title");
    titleElement.textContent = settings.title;
    wrapperElement.appendChild(titleElement);
    wrapperElement.appendChild(document.createElement("br"));
    let message;
    if (typeof settings.message === "function") {
      message = settings.message(user, opponent);
    } else {
      message = settings.message;
    }
    const messageElement = document.createElement("span");
    messageElement.classList.add("message");
    messageElement.innerHTML = message;
    wrapperElement.appendChild(messageElement);
    const bodyElement = document.querySelector("[class*='headerWrap___'] [class*='bottomSection___']");
    bodyElement.insertAdjacentElement("beforebegin", wrapperElement);
  }
  async function fetchMuggerDetection(userId, opponentId) {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        url: `https://api.no1irishstig.co.uk/sfc?player_id=${userId}&opponent_id=${opponentId}`,
        onload: (response) => {
          if (response.status === 200) {
            resolve(JSON.parse(response.responseText));
          } else {
            reject(new Error(`Request failed with status: ${response.status} - ${response.statusText}`));
          }
        },
        onerror: (response) => reject(new Error(`Request failed with status: ${response.status} - ${response.statusText} or error: ${response.error}`)),
        ontimeout: () => reject(new Error("Request timed out")),
        onabort: () => reject(new Error("Request aborted"))
      });
    });
  }
  function addRequestIcon() {
    const linksContainer = document.querySelector(SELECTOR_LINKS_CONTAINER);
    if (!linksContainer) return;
    if (linksContainer.getElementsByClassName("mugger-detect-watcher").length > 0) return;
    const button = document.createElement("button");
    button.classList.add("mugger-detect-watcher");
    button.addEventListener("click", () => {
      requestWatcher().then(() => {
        button.classList.add("mugger-detect-watcher--success");
        alert(`Your watch request has been sent to the Sore Foot Club, it will expire in 30 minutes!`);
      }).catch((reason) => {
        button.classList.add("mugger-detect-watcher--failure");
        if ("rr" in reason) {
          alert(`Error Code: ${reason.rr.code}
Message: ${reason.rr.message}`);
        } else {
          console.error("[RR Mugger Detect] Failed to request watcher.", reason);
          alert(`An unknown error has occurred - Please report this to SFC Staff`);
        }
      }).finally(() => {
        setTimeout(() => {
          button.classList.remove("mugger-detect-watcher--success", "mugger-detect-watcher--failure");
        }, 1e4);
      });
    });
    const iconElement = document.createElement("svg");
    button.appendChild(iconElement);
    iconElement.outerHTML = `
        <!-- Source: https://www.svgrepo.com/svg/115756/siren -->
        <svg height="16px" width="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 255.5 255.5">
          <g>
            <path d="m200.583,222.5h-6.333v-99.66c0-36.362-29.145-65.34-65.507-65.34h-0.32c-36.362,0-66.173,28.978-66.173,65.34v99.66h-6.667c-5.522,0-10.333,3.977-10.333,9.5v13c0,5.523 4.811,10.5 10.333,10.5h145c5.523,0 9.667-4.977 9.667-10.5v-13c0-5.523-4.145-9.5-9.667-9.5zm-72.16-141h-0.173v16h0.173c-14.248,0-25.84,12-25.84,26h-16c0-23 18.769-42 41.84-42z"/>
            <path d="m128.25,33c4.418,0 8-3.582 8-8v-17c0-4.418-3.582-8-8-8s-8,3.582-8,8v17c0,4.418 3.582,8 8,8z"/>
            <path d="m93.935,42.519c1.563,1.562 3.609,2.343 5.657,2.343 2.048,0 4.095-0.781 5.657-2.343 3.124-3.125 3.124-8.189 0-11.315l-12.02-12.021c-3.125-3.123-8.189-3.123-11.314,0-3.124,3.125-3.124,8.19 0,11.315l12.02,12.021z"/>
            <path d="m157.575,44.861c2.048,0 4.096-0.781 5.657-2.344l12.02-12.022c3.124-3.124 3.124-8.189-0.001-11.313-3.125-3.125-8.191-3.124-11.314,0.001l-12.02,12.021c-3.124,3.124-3.124,8.189 0.001,11.314 1.563,1.563 3.609,2.343 5.657,2.343z"/>
          </g>
        </svg>
    `;
    const titleElement = document.createElement("span");
    titleElement.textContent = "Request Watcher";
    button.appendChild(titleElement);
    linksContainer.insertAdjacentElement("afterbegin", button);
  }
  async function requestWatcher() {
    return new Promise((resolve, reject) => {
      const userId = getCurrentPlayerId();
      const userName = getCurrentPlayerName();
      _GM_xmlhttpRequest({
        method: "POST",
        url: "https://api.no1irishstig.co.uk/request",
        data: JSON.stringify({
          tornid: userId,
          username: userName,
          vendor: "Sore Foot Club",
          source: `SFC Script ${SCRIPT_VERSION}`,
          type: "watch"
        }),
        onload: (response) => {
          if (response.status === 200) {
            resolve(JSON.parse(response.responseText));
          } else {
            const responseText = response.responseText.replace(/^"|"$/g, "");
            reject({ rr: { code: response.status, message: responseText } });
          }
        },
        onerror: (response) => reject(new Error(`Request failed with status: ${response.status} - ${response.statusText} or error: ${response.error}`)),
        ontimeout: () => reject(new Error("Request timed out")),
        onabort: () => reject(new Error("Request aborted"))
      });
    });
  }

})();
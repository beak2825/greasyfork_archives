// ==UserScript==
// @name            KickAssist (Forked)
// @namespace       Violentmonkey Scripts
// @match           *://kick.com/*
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM.addValueChangeListener
// @version         20240613_19-05
// @author          MiahFuta (Forked)
// @run-at          context-menu
// @license         MIT
// @description     Enhance Kick.com with Message History, Replay Buffer, VOD Controls, Spell Check and More!
// @description:tr  Kick.com'a Mesaj Geçmişi, Yeniden Oynatma Arabelleği, VOD Kontrolleri, Yazım Denetimi ve Daha Fazlasını Ekle!
// @icon            https://dbxmjjzl5pc1g.cloudfront.net/7d5fec88-7f93-48df-a535-344bdd6e87fe/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/489642/KickAssist%20%28Forked%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489642/KickAssist%20%28Forked%29.meta.js
// ==/UserScript==

settings = {
  chatroomOnlyHighlight: false,
};

// Lists of words to highlight or blacklist
function checkList(list) {
  const brokenText =
    '<span style="border: 1px solid #7f7f7f; padding-inline: 1px;"></span>';

  for (let i = 0; i < list.length; i++) {
    if (brokenText.includes(list[i])) {
      list.splice(i, 1);
    }
  }

  return [...new Set(list)];
}

function isChatRoom() {
  // Define the target URL pattern
  let targetPattern = /kick\.com\/([^\/]+)\/chatroom/;
  // Get the current URL, Check if the URL matches the target pattern
  let match = window.location.href.match(RegExp(targetPattern));
  return match;
}

GM.getValue("highlightWordList", ["sj", "oç"]).then((value) => {
  highlightWordList = checkList(value, "highlightWordList");
  GM.setValue("highlightWordList", highlightWordList);
});

GM.getValue("blacklistWordList", ["abi"]).then((value) => {
  blacklistWordList = checkList(value, "blacklistWordList");
  GM.setValue("blacklistWordList", blacklistWordList);
});

// GM.getValue("settings", {
//   chatroomOnlyHighlight: false,
// }).then((value) => {
//   settings = value;
//   GM.setValue("settings", settings);
// });

GM.addValueChangeListener(
  "highlightWordList",
  (key, oldValue, newValue, remote) => {
    if (blacklistWordList != oldValue) {
      highlightWordList = checkList(newValue);
      GM.setValue(key, highlightWordList);
    }
  }
);

GM.addValueChangeListener(
  "blacklistWordList",
  (key, oldValue, newValue, remote) => {
    if (blacklistWordList != oldValue) {
      blacklistWordList = checkList(newValue);
      GM.setValue(key, blacklistWordList);
    }
  }
);

// GM.addValueChangeListener("settings", (key, oldValue, newValue, remote) => {
//   settings = newValue;
// });

// function processSettings(key, value) {
//   settings[key] = value;
//   // GM.setValue("settings", settings);
// }

class Badges {
  main;

  channelSupporters;

  oldTextContent;
  showingToolTip;
  showingForWho;

  constructor(main) {
    this.main = main;
    this.channelSupporters = [];
    this.showingToolTip = false;
    this.oldTextContent = "";
    this.showingForWho = 0;
  }

  getMiFu() {
    return this.main.mifu;
  }

  debug(message) {
    this.main.debug(message);
  }

  getChannelData() {
    return this.main.channelData;
  }

  getDeveloperBadgeId() {
    return "mifu-dev-badge";
  }

  getSupporterBadgeId() {
    return "mifu-supporter-badge";
  }

  //NOTE - Developer

  getDeveloperBadgeForChat() {
    const id = this.getDeveloperBadgeId();
    const badge = this.getDeveloperPath();
    return this.getHtmlForChat(id, badge);
  }

  getDeveloperBadgeForPopout() {
    const id = this.getDeveloperBadgeId();
    const badge = this.getDeveloperPath();
    return this.getHtmlForPopout(id, badge);
  }

  //NOTE - Supporter

  getSupporterBadgeForChat() {
    const id = this.getSupporterBadgeId();
    const badge = this.getSupporterPath();
    return this.getHtmlForChat(id, badge);
  }

  getSupporterBadgeForPopout() {
    const id = this.getSupporterBadgeId();
    const badge = this.getSupporterPath();
    return this.getHtmlForPopout(id, badge);
  }

  //NOTE - Global HTML

  getHtmlForChat(id, badge) {
    return /*HTML*/ `<div data-v-e4d376bf="" id="${id}" class="relative badge-tooltip h-4 ml-1 first:ml-0"><button data-v-fa8cab30="" data-v-e4d376bf="" type="button" class="base-custom-badge ml-1 first:ml-0"><img data-v-f3fdeebc="" ${badge} class="icon size-sm"></button></div>`;
  }

  getHtmlForPopout(id, badge) {
    return /*HTML*/ `<div data-v-e4d376bf="" data-v-1411a749="" id="${id}" class="relative badge-tooltip h-5" active="true"><button data-v-f3fdeebc="" data-v-e4d376bf="" type="button" class="base-custom-badge" active="true"><img data-v-f3fdeebc="" ${badge} class="icon size-md"></button></div>`;
  }

  makePopoutBadgeContainer(badge) {
    return /*HTML*/ `<div data-v-1411a749="" class="badges"><span data-v-1411a749="" class="label">Badges</span><div data-v-1411a749="" class="badges-container">${badge}</div></div>`;
  }

  getModBadgeData() {
    return `d="M11.7,1.3v1.5h-1.5v1.5
            H8.7v1.5H7.3v1.5H5.8V5.8h-3v3h1.5v1.5H2.8v1.5H1.3v3h3v-1.5h1.5v-1.5h1.5v1.5h3v-3H8.7V8.7h1.5V7.3h1.5V5.8h1.5V4.3h1.5v-3
            C14.7,1.3,11.7,1.3,11.7,1.3z"`.replace(/\s/g, "");
  }

  getStreamerBadgeData() {
    return `id="Badge_Chat_host"`.replace(/\s/g, "");
  }

  //NOTE - Process User Chat Entry

  processChatterUsername(chatterNameElm) {
    function addBadge(badge) {
      const badgesElm = chatterNameElm.previousElementSibling;
      if (!badgesElm.classList.contains("mr-1"))
        badgesElm.classList.add("mr-1");

      const firstBadgeElm = badgesElm.firstElementChild;
      if (firstBadgeElm) {
        const strippedHtml = firstBadgeElm.innerHTML.replace(/\s/g, "");
        if (
          strippedHtml.indexOf(this.getModBadgeData()) !== -1 ||
          strippedHtml.indexOf(this.getStreamerBadgeData()) !== -1
        ) {
          firstBadgeElm.insertAdjacentHTML("afterend", badge);
        } else {
          firstBadgeElm.insertAdjacentHTML("beforebegin", badge);
        }
      } else {
        badgesElm.insertAdjacentHTML("beforeend", badge);
      }
    }

    const usernameToLower = chatterNameElm.textContent.toLowerCase();
    if (usernameToLower.indexOf("miahfuta") !== -1) {
      addBadge.bind(this, this.getDeveloperBadgeForChat())();
    } else if (this.channelSupporters.includes(usernameToLower)) {
      addBadge.bind(this, this.getSupporterBadgeForChat())();
    }
  }

  //NOTE - Process User Info Popup

  processPopoutUsername(node, usernameToLower) {
    function insertBadgeToPopout(node, isDev) {
      const label = isDev ? "Developer" : "Supporter";
      const labelFormatted = `<small>KickAssist Extension ${label}</small>`;
      const badge = isDev
        ? this.getDeveloperBadgeForPopout()
        : this.getSupporterBadgeForPopout();

      const informationElement = node.querySelector(".information");
      if (informationElement) {
        informationElement.insertAdjacentHTML("beforeend", labelFormatted);

        const nextElement = informationElement.nextElementSibling;
        if (nextElement && nextElement.classList.contains("badges")) {
          const badgesContainer =
            nextElement.querySelector(".badges-container");
          if (badgesContainer)
            badgesContainer.insertAdjacentHTML("beforeend", badge);
        } else {
          const badgeFormatted = this.makePopoutBadgeContainer(badge);
          informationElement.insertAdjacentHTML("afterend", badgeFormatted);
        }
      }

      if (isDev) {
        const moderationElement = node.querySelector(".moderation");
        if (moderationElement) moderationElement.remove();

        const negativeElement = node.querySelector(".negative-actions");
        if (negativeElement) negativeElement.remove();
      }
    }

    if (usernameToLower.indexOf("miahfuta") !== -1) {
      insertBadgeToPopout.bind(this, node, true)();
    } else if (this.channelSupporters.includes(usernameToLower)) {
      insertBadgeToPopout.bind(this, node, false)();
    }
  }

  //NOTE - Mouse Move Listener

  handleMouseMove(event) {
    if (event && event.target && event.target.closest) {
      const developerId = this.getDeveloperBadgeId();
      const supporterId = this.getSupporterBadgeId();

      const isDeveloper = event.target.closest
        ? event.target.closest(`#${developerId}`)
        : false;
      const isSupporter = event.target.closest
        ? event.target.closest(`#${supporterId}`)
        : false;

      const isKickAssistEmote = event.target.closest
        ? event.target.closest(`#kickassist-emote`)
        : false;

      switch (this.showingForWho) {
        case 0: {
          if (isDeveloper && !this.showingToolTip) {
            this.showingForWho = 1;
            this.showToolTip(event, true);
          } else if (isSupporter && !this.showingToolTip) {
            this.showingForWho = 2;
            this.showToolTip(event, false);
          } else if (isKickAssistEmote && !this.showingToolTip) {
            this.showingForWho = 3;
            this.showToolTip(event, null);
          }
          break;
        }
        case 1: {
          if (!isDeveloper && this.showingToolTip) {
            this.hideToolTip();
          }
          break;
        }
        case 2: {
          if (!isSupporter && this.showingToolTip) {
            this.hideToolTip();
          }
          break;
        }
        case 3: {
          if (!isKickAssistEmote && this.showingToolTip) {
            this.hideToolTip();
          }
          break;
        }
        default: {
          if (this.showingToolTip) this.hideToolTip();
          break;
        }
      }
    } else {
      if (this.showingToolTip) this.hideToolTip();
    }
  }

  showToolTip(event, isDev) {
    const app = document.getElementById("app");
    if (app) {
      const fixedDivs = app.querySelectorAll(".fixed");

      if (fixedDivs.length < 2) return;

      var rect;

      if (isDev === null) {
        rect = event.target
          .closest("#kickassist-emote")
          .getBoundingClientRect();
      } else {
        rect = event.target.closest(".badge-tooltip").getBoundingClientRect();
      }

      fixedDivs[0].style.left = `${rect.left}px`;
      fixedDivs[0].style.top = `${rect.top - 26}px`;

      fixedDivs[1].style.left = `${rect.left + 9}px`;
      fixedDivs[1].style.top = `${rect.top - 26 + 19}px`;

      this.oldTextContent = fixedDivs[0].textContent;

      const toolTipDeveloper = "KickAssist Extension Developer";
      const toolTipSupporter = "KickAssist Extension Supporter";

      if (isDev === null) {
        fixedDivs[0].textContent = "KA";
      } else {
        fixedDivs[0].textContent = isDev ? toolTipDeveloper : toolTipSupporter;
      }

      fixedDivs[0].style.visibility = "visible";
      fixedDivs[1].style.visibility = "visible";

      if (isDev !== null) {
        const isProfile = event.target.closest(".profile");
        fixedDivs[0].style.transform = isProfile ? "translate(-50%)" : "none";
      }

      this.showingToolTip = true;
    }
  }

  hideToolTip() {
    const app = document.getElementById("app");
    if (app) {
      const fixedDivs = app.querySelectorAll(".fixed");

      if (fixedDivs.length < 2) return;

      fixedDivs[0].textContent = this.oldTextContent;

      fixedDivs[0].style.visibility = "hidden";
      fixedDivs[1].style.visibility = "hidden";

      fixedDivs[0].style.transform = "none";

      fixedDivs[0].style.left = "-100px";
      fixedDivs[0].style.top = "-100px";

      fixedDivs[1].style.left = "-100px";
      fixedDivs[1].style.top = "-100px";

      this.showingToolTip = false;
      this.showingForWho = 0;
    }
  }

  //NOTE - SVG Paths

  getDeveloperPath() {
    return `src="https://files.kick.com/emotes/2171595/fullsize" alt="KickAssist Developer"`;
  }

  getSupporterPath() {
    return `src="https://files.kick.com/emotes/2171437/fullsize" alt="KickAssist Supporter"`;
  }

  //NOTE - Other Badge Functions

  getSupporterBadgePreview() {
    return /*HTML*/ `<strong>Supporter Badge Preview:</strong> <img data-v-f3fdeebc="" ${this.getSupporterPath()} style="margin-left: 15px; display: inline-block; max-height: 18px" class="icon size-sm">`;
  }

  async loadExtensionSupporters() {
    this.channelSupporters = [];
    const panels = await this.getChannelData().getDonatedUsers();
    if (panels !== null) {
      for (const panelId in panels) {
        const panel = panels[panelId];
        const supporters = JSON.parse(panel.description);
        supporters.forEach((supporter) => {
          const supporterToLower = supporter.toLowerCase();
          if (!this.channelSupporters.includes(supporterToLower)) {
            this.channelSupporters.push(supporterToLower);
          }
        });
      }
      this.debug("Supporters Loaded!");
    } else {
      this.debug("Failed to Load Supporters!");
    }
  }
}

class Channel {
  main;

  constructor(main) {
    this.main = main;
  }

  getMiFu() {
    return this.main.mifu;
  }

  openChatWindow() {
    const chatContainer = document.querySelector(".chat-container");

    if (chatContainer && !chatContainer.classList.contains("open")) {
      chatContainer.classList.add("open");
    }
  }

  name() {
    return this.getMiFu().channelName;
  }

  setName() {
    this.getMiFu().channelName = this.getName();
  }

  getName() {
    const curURL = window.location.href;

    if (curURL.endsWith("dashboard/stream")) {
      return "Dashboard";
    } else if (curURL.endsWith("/moderator")) {
      const trimmedURL = curURL.slice(0, -10);
      return trimmedURL.substring(trimmedURL.lastIndexOf("/") + 1);
    } else if (curURL.endsWith("/chatroom")) {
      const trimmedURL = curURL.slice(0, -9);
      return trimmedURL.substring(trimmedURL.lastIndexOf("/") + 1);
    } else if (curURL.includes("?clip=")) {
      const trimmedURL = curURL.split("?clip=")[0];
      return trimmedURL.substring(trimmedURL.lastIndexOf("/") + 1);
    } else {
      return curURL.substring(curURL.lastIndexOf("/") + 1);
    }
  }

  getDisplayName() {
    const channelName = this.getMiFu().channelName;
    const nameElement = document.querySelector(".stream-username");
    return nameElement
      ? nameElement.querySelector("span").innerHTML
      : channelName;
  }
}

class ChannelData {
  main;

  constructor(main) {
    this.main = main;
  }

  debug(message) {
    this.main.debug(message);
  }

  async fetchDataV1(channel) {
    try {
      const kickApi = "https://kick.com/api/v1/channels/";
      const response = await fetch(`${kickApi}${channel}`);

      if (response.ok) {
        const data = await response.text();
        return JSON.parse(data);
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      throw error;
    }
  }

  async fetchDataV2(channel) {
    try {
      const kickApi = "https://kick.com/api/v2/channels/";
      const response = await fetch(`${kickApi}${channel}`);

      if (response.ok) {
        const data = await response.text();
        return JSON.parse(data);
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      throw error;
    }
  }

  async getDonatedUsers() {
    return this.fetchDataV1("mifubot")
      .then((response) => {
        if (response !== null) {
          return response.ascending_links;
        } else {
          return null;
        }
      })
      .catch((error) => {
        this.debug(error);
        return null;
      });
  }

  async getChatroomId(channel) {
    return this.fetchDataV2(channel)
      .then((response) => {
        if (response !== null) {
          return response.chatroom.id;
        } else {
          return null;
        }
      })
      .catch((error) => {
        this.debug(error);
        return null;
      });
  }

  async getIsLive(channel) {
    return this.fetchDataV2(channel)
      .then((response) => {
        if (response.livestream !== null) {
          return response.livestream.is_live || false;
        } else {
          return false;
        }
      })
      .catch((error) => {
        this.debug(error);
        return false;
      });
  }

  async getViewerCount(channel) {
    return this.fetchDataV2(channel)
      .then((response) => {
        if (response.livestream !== null) {
          return response.livestream.viewer_count || 0;
        } else {
          return 0;
        }
      })
      .catch((error) => {
        this.debug(error);
        return 0;
      });
  }

  async getSubBadges(channel) {
    return this.fetchDataV2(channel)
      .then((response) => {
        if (response.subscriber_badges !== null) {
          return response.subscriber_badges;
        }
      })
      .catch((error) => {
        this.debug(error);
        return null;
      });
  }
}

class CssEdits {
  init() {
    if (!this.hasStyleElm()) this.inject();
  }

  getStyleId() {
    return "mifu-css-edits";
  }

  getStyleElm() {
    return document.getElementById(this.getStyleId());
  }

  removeStyleElm() {
    if (this.hasStyleElm()) this.getStyleElm().remove();
  }

  hasStyleElm() {
    return this.getStyleElm();
  }

  inject() {
    const style = document.createElement("style");

    style.id = this.getStyleId();
    style.textContent = this.getCss();

    document.head.appendChild(style);
  }

  getCss() {
    return `
                ${this.customMenus()}
                ${this.historyInfoMessage()}
                ${this.splitChatLines()}
                ${this.replyBuffer()}
                ${this.chatOutlines()}
                ${this.deletedMessages()}
            `
      .replace(/\s+/g, " ")
      .trim();
  }

  customMenus() {
    return /*CSS*/ `
                .mifu-menu-container {
                    max-height: 588px !important;
                    overflow-y: auto !important;
                }
            `;
  }

  deletedMessages() {
    return /*CSS*/ `
                .mifu-banned-message .chat-message-identity:hover,
                .mifu-banned-message .bg-secondary-lighter:hover,
                .mifu-deleted-message .chat-message-identity:hover,
                .mifu-deleted-message .bg-secondary-lighter:hover,
                .mifu-timedout-message .chat-message-identity:hover,
                .mifu-timedout-message .bg-secondary-lighter:hover  {
                    background-color: transparent !important;
                }
                #mifu-event-from {
                    padding-left: 0.5rem;
                    padding-bottom: 0.5rem;
                    font-style: italic;
                    font-size: small;
                    opacity: 0.5;
                    word-wrap: break-word;
                    margin-top: 0.25rem;
                    padding-top: 0.5rem;
                    border-top: 1px solid rgba(255,255,255,0.25);
                }
                .mifu-unbanned-message {
                    background-color: #80808033;
                }
            `;
  }

  historyInfoMessage() {
    return /*CSS*/ `
                #mifu-info-message {
                    position: absolute;
                    padding-top: 2px;
                    left: 0;
                    background-color: transparent;
                    border: none;
                    color: rgb(170, 170, 170);
                    font-size: smaller;
                    margin-top: 1px;
                    padding: 0px;
                    width: 100%;
                }
            `;
  }

  splitChatLines() {
    if (true) return "";

    return /*CSS*/ `
                div[data-chat-entry] {
                    margin-top: 0px !important;
                    padding-top: .125rem !important;
                    padding-bottom: .125rem !important;
                }
                div[data-chat-entry]:nth-child(even) {
                    border-top: 0.5px outset rgb(50, 50, 50) !important;
                    border-bottom: 0.5px inset rgb(50, 50, 50) !important;
                    background-color: rgb(25, 27, 31) !important;
                }
                .chat-entry {
                    line-height: 1.45rem !important;
                }
            `;
  }

  chatOutlines() {
    return /*CSS*/ `
                #mifu-chat-moderator-entry[data-mifu-chat-outline="true"] {
                    // border: 1px dashed #00c7ff;
                    background-color: #008bb3;
                }
                #mifu-chat-staff-entry[data-mifu-chat-outline="true"] {
                    // border: 1px dashed #ff0000;
                    background-color: #00a619;
                }
                #mifu-chat-streamer-entry[data-mifu-chat-outline="true"] {
                    // border: 1px dashed #b20dff;
                    background-color: #b20dff;
                }
                #mifu-chat-verified-entry[data-mifu-chat-outline="true"] {
                    // border: 1px dashed #d1ea00;
                    background-color: #9bad00;
                }
                /*//? Add mifu-chat-highlighted-entry for highlight messages */
                #mifu-chat-highlighted-entry[data-mifu-chat-outline="true"] {
                    // border: 1px dashed #d1ea00;
                    background-color: #500000;
                }
                [id^="mifu-chat-"][id*="-entry"][data-mifu-chat-outline="false"] {
                    border: none;
                }
                [id^="mifu-chat-"][id$="-entry"][data-mifu-chat-outline="true"]:not(:has(.chat-emote-container)) {
                    padding-top: 3px;
                }
            `;
  }

  replyBuffer() {
    return /*CSS*/ `
                .mifu-speed-menu {
                    background-color: transparent;
                    padding: 10px;
                    border: none;
                    border-radius: 5px;
                    margin-bottom: -0.15rem;
                    margin-left: 0.5rem;
                }
                #mifu-speedSelect {
                    background-color: rgb(25, 27, 31);
                    border: 1px solid rgb(36, 39, 44);
                    color: #53fc18;
                }
                #mifu-speedSelect option {
                    text-align: center;
                    color: #53fc18;
                }
                #mifu-buffer-info {
                    margin-left: 0rem !important;
                    -webkit-user-select: none !important;
                    -moz-user-select: none !important;
                    user-select: none !important;
                    height: .75rem !important;
                    line-height: 1 !important;
                    color: #fff !important;
                    margin-bottom: 0.2rem;
                }
    
                #vid-control-rewind::before {
                    background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23FFFFFF" d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z"></path></svg>');
                }
                #vid-control-rewind:hover::before {
                    background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%2353FC18" d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z"></path></svg>');
                }
    
    
                #vid-control-fastforward::before {
                    background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23FFFFFF" d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z"></path></svg>');
                }
                #vid-control-fastforward:hover::before {
                    background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%2353FC18" d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z"></path></svg>');
                }
    
                span[id*='vid-control-']::before {
                    position: absolute !important;
                    content: '' !important;
                    width: 1em !important;
                    height: 1em !important;
                    top: 50% !important;
                    left: 50% !important;
                    font-size: 1.25rem !important;
                    line-height: 2.5rem !important;
                    background-repeat: no-repeat !important;
                    transform: translate(-50%, -50%) !important;
                }
            `;
  }
}

class Database {
  mifu;

  constructor(mifu) {
    this.mifu = mifu;
  }

  getDatebaseName() {
    return "KickAssistDatabase";
  }

  isIndexedDBSupported() {
    return "indexedDB" in window;
  }

  debug(message) {
    this.mifu.debug(message);
  }

  //NOTE - core

  async createDatabase() {
    if (this.isIndexedDBSupported()) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.getDatebaseName(), 2);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains("channels")) {
            db.createObjectStore("channels", { keyPath: "name" });
          }
          if (!db.objectStoreNames.contains("vods")) {
            db.createObjectStore("vods", { keyPath: "id" });
          }
        };
        request.onsuccess = () => {
          this.debug("Database Initialized!");
          resolve(true);
        };
        request.onerror = () => {
          this.debug("Database Initialization Error!");
          resolve(false);
        };
      });
    } else {
      this.debug("Database Not Supported!");
      return false;
    }
  }

  async addChannel(channelName, messages, settings, colors) {
    if (this.isIndexedDBSupported()) {
      return await this.addToIndexedDB(channelName, messages, settings, colors);
    } else {
      return await this.addToLocalStorage(
        channelName,
        messages,
        settings,
        colors
      );
    }
  }

  //NOTE - save data

  async addToIndexedDB(channelName, messages, settings, colors) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.getDatebaseName());

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("channels", "readwrite");
        const store = transaction.objectStore("channels");
        const getRequest = store.get(channelName);

        getRequest.onsuccess = async (event) => {
          const curData = event.target.result;
          if (!curData) {
            const addRequest = store.add({
              name: channelName,
              messages: messages,
              settings: JSON.stringify(settings),
              colors: JSON.stringify(colors),
            });
            addRequest.onsuccess = () => {
              this.debug("Database Channel Added!");
              resolve(true);
            };
          } else {
            if (!curData.settings) {
              curData.settings = JSON.stringify(settings);
              const updateRequest = await store.put(curData);
              updateRequest.onsuccess = () => {};
            }
            if (!curData.colors) {
              curData.colors = JSON.stringify(colors);
              const updateRequest = await store.put(curData);
              updateRequest.onsuccess = () => {};
            }
            this.debug("Database Channel Found!");
            resolve(true);
          }
        };
        getRequest.onerror = () => {
          this.debug("Database Creation Error!");
          resolve(false);
        };
      };
    });
  }

  async addToLocalStorage(channelName, messages, settings, colors) {
    const curData = JSON.parse(localStorage.getItem(channelName + "_toggle"));
    if (!curData) {
      localStorage.setItem(channelName + "_messages", JSON.stringify(messages));
      localStorage.setItem(channelName + "_settings", JSON.stringify(settings));
      localStorage.setItem(channelName + "_colors", JSON.stringify(colors));
      this.debug("Local Storage Channel Added!");
    } else {
      const hasSettings = JSON.parse(
        localStorage.getItem(channelName + "_settings")
      );
      if (!hasSettings)
        localStorage.setItem(
          channelName + "_settings",
          JSON.stringify(settings)
        );

      const hasColors = JSON.parse(
        localStorage.getItem(channelName + "_colors")
      );
      if (!hasColors)
        localStorage.setItem(channelName + "_colors", JSON.stringify(colors));

      this.debug("Local Storage Channel Found!");
    }
    return true;
  }

  //NOTE - channel messages

  async getMessages(channelName) {
    if (this.isIndexedDBSupported()) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.getDatebaseName());

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction("channels", "readonly");
          const store = transaction.objectStore("channels");
          const getRequest = store.get(channelName);

          getRequest.onsuccess = (event) => {
            const channelData = event.target.result;
            resolve(channelData ? channelData.messages : null);
          };
        };
      });
    } else {
      return JSON.parse(localStorage.getItem(channelName + "_messages"));
    }
  }

  async saveMessages(channelName, messages) {
    if (this.isIndexedDBSupported()) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.getDatebaseName());

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction("channels", "readwrite");
          const store = transaction.objectStore("channels");
          const getRequest = store.get(channelName);

          getRequest.onsuccess = (event) => {
            const channelData = event.target.result;
            if (channelData) {
              channelData.messages = messages;
              const updateRequest = store.put(channelData);

              updateRequest.onsuccess = () => {
                this.debug("Database Message History Saved!");
                resolve(true);
              };
            } else {
              this.debug("Database Message History Update Error!");
              resolve(false);
            }
          };
        };
      });
    } else {
      localStorage.setItem(channelName + "_messages", JSON.stringify(messages));
      this.debug("Local Storage Message History Saved!");
      return true;
    }
  }

  //NOTE - channel settings

  async getSettings(channelName) {
    if (this.isIndexedDBSupported()) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.getDatebaseName());

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction("channels", "readonly");
          const store = transaction.objectStore("channels");
          const getRequest = store.get(channelName);

          getRequest.onsuccess = (event) => {
            const channelData = event.target.result;
            resolve(channelData ? JSON.parse(channelData.settings) : null);
          };
        };
      });
    } else {
      return JSON.parse(localStorage.getItem(channelName + "_settings"));
    }
  }

  async saveSettings(channelName, settings) {
    if (this.isIndexedDBSupported()) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.getDatebaseName());

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction("channels", "readwrite");
          const store = transaction.objectStore("channels");
          const getRequest = store.get(channelName);

          getRequest.onsuccess = (event) => {
            const channelData = event.target.result;
            if (channelData) {
              channelData.settings = JSON.stringify(settings);
              const updateRequest = store.put(channelData);
              updateRequest.onsuccess = () => {
                this.debug("Database Settings Updated!");
                resolve(true);
              };
            } else {
              this.debug("Database Settings Update Error!");
              resolve(false);
            }
          };
        };
      });
    } else {
      localStorage.setItem(channelName + "_settings", JSON.stringify(settings));
      this.debug("Local Storage Settings Saved!");
      return true;
    }
  }

  //NOTE - channel colors

  async getColors(channelName) {
    if (this.isIndexedDBSupported()) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.getDatebaseName());

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction("channels", "readonly");
          const store = transaction.objectStore("channels");
          const getRequest = store.get(channelName);

          getRequest.onsuccess = (event) => {
            const channelData = event.target.result;
            resolve(channelData ? JSON.parse(channelData.colors) : null);
          };
        };
      });
    } else {
      return JSON.parse(localStorage.getItem(channelName + "_colors"));
    }
  }

  async saveColors(channelName, colors) {
    if (this.isIndexedDBSupported()) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.getDatebaseName());

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction("channels", "readwrite");
          const store = transaction.objectStore("channels");
          const getRequest = store.get(channelName);

          getRequest.onsuccess = (event) => {
            const channelData = event.target.result;
            if (channelData) {
              channelData.colors = JSON.stringify(colors);
              const updateRequest = store.put(channelData);

              updateRequest.onsuccess = () => {
                this.debug("Database Colors Updated!");
                resolve(true);
              };
            } else {
              this.debug("Database Colors Update Error!");
              resolve(false);
            }
          };
        };
      });
    } else {
      localStorage.setItem(channelName + "_colors", JSON.stringify(colors));
      this.debug("Local Storage Colors Saved!");
      return true;
    }
  }
}

class MessageInput {
  main;

  intervals = [];

  clickHandler;
  pauseHandler;

  canPause = true;
  willPause = false;

  constructor(main) {
    this.main = main;
  }

  getMiFu() {
    return this.main.mifu;
  }

  getSettings() {
    return this.main.settings;
  }

  debug(message) {
    this.main.debug(message);
  }

  getField() {
    return document.getElementById("message-input");
  }

  getWrapper() {
    return this.getField().parentElement;
  }

  getWrapperAttributes() {
    return this.getWrapper().attributes;
  }

  getFieldSibling() {
    return this.getField().nextElementSibling;
  }

  getText() {
    return this.getField().innerHTML;
  }

  init() {
    this.addIntervals();
    this.findSendButton();
    // this.enableSpellcheck();
    this.addClickListener();
    this.addPauseListener();
    this.injectCss();
  }

  //NOTE - intervals

  addIntervals() {
    if (this.intervals.length !== 0) {
      this.intervals.forEach((interval) => {
        clearInterval(interval);
      });
      this.intervals = [];
    }

    this.fastClock = setInterval(() => {
      const messageInput = this.getField();
      if (messageInput) this.updatePlaceholder(messageInput);
    }, 500);
    this.intervals.push(this.fastClock);
  }

  //NOTE - input field

  updatePlaceholder(messageInput) {
    const placeholder = messageInput.getAttribute("data-placeholder").trim();
    const contentEditable = messageInput.getAttribute("contenteditable").trim();
    const isEditable = contentEditable === "true";
    const hasUpdate = placeholder.includes("ㅤ");

    if (isEditable && !hasUpdate) {
      messageInput.spellcheck = this.getSettings().getState("SpellCheck");

      const customHolder = "ㅤ";
      messageInput.setAttribute("data-placeholder", placeholder + customHolder);

      const chatOpen = document.querySelector(".chat-container.open");
      if (chatOpen) messageInput.focus();
    }
  }

  setText(text) {
    this.getField().innerHTML = text;
    if (text !== "") {
      this.cursorToEnd();
      this.enableSendButton();
    } else {
      this.disableSendButton();
    }
  }

  focus() {
    const messageInput = this.getField();

    messageInput.focus();
    messageInput.click();
  }

  cursorToEnd() {
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(this.getField());
    range.collapse(false);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  //NOTE - refocus after emote click

  addClickListener() {
    if (this.clickHandler === undefined || this.clickHandler === null) {
      this.clickHandler = this.handleMouseClick.bind(this);
      window.addEventListener("click", this.clickHandler, true);
    }
  }

  handleMouseClick(event) {
    if (event && event.target && event.target.closest) {
      if (event.target.closest(".quick-emotes-holder")) {
        setTimeout(() => this.focus(), 250);
      }
    }
  }

  //NOTE - alt key pause scroll

  addPauseListener() {
    if (this.pauseHandler === undefined || this.pauseHandler === null) {
      this.pauseHandler = this.pauseScroll.bind(this);
      window.addEventListener("keydown", (event) => {
        if (event.key === "Alt") this.altIsDown = true;

        if (this.altIsDown && this.canPause) {
          this.willPause = true;
        }

        if ((event.key !== "Alt") & this.altIsDown) {
          this.canPause = false;
          this.willPause = false;
        }
      });
      window.addEventListener("keyup", this.pauseHandler);
    }
  }

  pauseScroll(event) {
    if (this.canPause && this.willPause && event.key === "Alt") {
      event.preventDefault();

      const chatroom = document.getElementById("chatroom");

      if (chatroom) {
        const chatPausedElements = chatroom.querySelectorAll("div");

        let shouldScroll = true;

        for (const element of chatPausedElements) {
          if (element.innerHTML.includes("chat paused for scrolling")) {
            shouldScroll = false;
            break;
          }
        }

        const section = chatroom.querySelector(".overflow-y-scroll");

        if (shouldScroll) {
          section.scroll(0, section.scrollTop - 50);
        } else {
          section.scroll(0, section.scrollHeight);
        }
      }
    }

    this.willPause = false;
    this.canPause = true;
  }

  //NOTE - send button

  findSendButton() {
    const chatFooter = document.getElementById("chatroom-footer");

    if (chatFooter) {
      const sendChatButton = document.getElementById("mifu-send-chat");

      if (!sendChatButton) {
        const buttons = chatFooter.getElementsByTagName("button");

        for (const button of buttons) {
          const innerLabel = button.querySelector(".inner-label");

          if (innerLabel && innerLabel.innerHTML === "Chat") {
            button.id = "mifu-send-chat";
            break;
          }
        }
      }
    }
  }

  getSendButton() {
    return document.getElementById("mifu-send-chat");
  }

  enableSendButton() {
    this.getSendButton().removeAttribute("disabled");
  }

  disableSendButton() {
    this.getSendButton().setAttribute("disabled", "");
  }

  //NOTE - css

  injectCss() {
    if (!document.getElementById("mifu-css-chatroom")) {
      const style = document.createElement("style");

      style.id = "mifu-css-chatroom";
      style.textContent = this.getCss();

      document.head.appendChild(style);
    }
  }

  getCss() {
    const attributes = this.getWrapperAttributes();

    let hashedDataV = false;
    for (let i = 0; i < attributes.length; i++) {
      const attribute = attributes[i];
      if (attribute.name.startsWith("data-v")) {
        hashedDataV = attribute.name;
        break;
      }
    }

    if (hashedDataV === false) return;

    return /*CSS*/ `
                .chat-input-wrapper[${hashedDataV}] .chat-input {
                    --padding-y: 8px;
                    --line-height: 26px;
                    --min-height: calc((var(--padding-y) * 2) - var(--line-height));
                    box-sizing: content-box;
                    padding-left: 0;
                    padding-right: 0.75rem;
                    font-size: .875rem;
                    line-height: var(--line-height);
                    min-height: max(var(--min-height), 26px);
                    display: inline-block;
                    border: none;
                }
                .chat-input-wrapper[${hashedDataV}] {
                    box-shadow: none;
                    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
                    transition-timing-function: cubic-bezier(.4,0,.2,1);
                    transition-duration: .15s;
                    font-size: .875rem;
                    line-height: 1.25rem;
                    padding-top: 0;
                    padding-bottom: 0;
                    padding-left: 0.75rem;
                    padding-right: 0.35rem;
                    background-color: transparent;
                    border-color: #48484b;
                }
                .chat-input-wrapper[${hashedDataV}]:hover {
                    border-color: #9ca3af;
                }
                .chat-input-wrapper[${hashedDataV}]:focus-within {
                    box-shadow: none;
                    border-color: #9ca3af;
                    background-color: transparent;
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                }
            `
      .replace(/\s+/g, " ")
      .trim();
  }
}

class MouseMove {
  main;

  handler;

  badges;

  constructor(main) {
    this.main = main;
    this.handler = this.event.bind(this);
    this.badges = this.main.badges;
  }

  getMain() {
    return this.main;
  }

  getMiFu() {
    return this.getMain().mifu;
  }

  debug(message) {
    this.getMain().debug(message);
  }

  addListener() {
    document.addEventListener("mousemove", this.handler);
    this.debug(`Mouse Move Handler Ready!`);
  }

  event(event) {
    if (!this.getMiFu().executed) return;

    this.global(event);

    this.badges.handleMouseMove(event);
  }

  global(event) {
    if (event && event.target && event.target.closest) {
      if (event.target.closest("#chatroom")) {
        const hideReply = event.target.closest
          ? event.target.closest('[class*="mifu-"][class*="-message"]')
          : false;

        if (hideReply) {
          const chatroom = document.getElementById("chatroom");

          if (chatroom) {
            const z10 = chatroom.querySelector(".z-10");
            if (z10) z10.style.display = "none";
          }
        }
      }
    }
  }
}

class MutationProcessor {
  constructor(main) {
    this.main = main;
    this.vars = {};
  }

  getMain() {
    return this.main;
  }
  getMiFu() {
    return this.getMain().mifu;
  }
  getSettings() {
    return this.getMain().settings;
  }
  getOutlines() {
    return this.getMain().outlines;
  }
  getBadges() {
    return this.getMain().badges;
  }

  /**
   * 1 = Staff | 2 = Streamer | 3 = Mod | 4 = Verified | | 5 = Highlighted | 6 = Other | 0 = None
   */
  getSenderType() {
    return this.vars.senderType ? this.vars.senderType : 0;
  }
  setSenderType(int) {
    this.vars.senderType = int;
  }

  getHasMention() {
    return this.vars.hasOutline ? true : false;
  }
  setHasMention(flag) {
    this.vars.hasOutline = flag;
  }

  getIsMessage() {
    return this.vars.isMessage ? true : false;
  }
  setIsMessage(flag) {
    this.vars.isMessage = flag;
  }

  processMutations(mutations) {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            this.processNode(node);
          }
        }
      }
    }
  }

  getIsBot(chatterUsername) {
    const botNames = ["botrix", "kickbot", "kicklet"];
    const usernameToLower = chatterUsername.textContent.toLowerCase();
    return botNames.some((bot) => usernameToLower.includes(bot));
  }

  getKaImgElm() {
    return /*HTML*/ `</span></span><span data-v-79ea56d9="" class=""><div data-v-31c262c8="" data-v-79ea56d9="" class="chat-emote-container"><div data-v-31c262c8="" class="relative"><img data-v-31c262c8="" data-emote-name="KA" id="kickassist-emote" src="https://files.kick.com/emotes/2171437/fullsize" alt="KA" class="chat-emote"></div></div></span><span data-v-79ea56d9="" class=""><span data-v-79ea56d9="" class="chat-entry-content">`;
  }

  getKaAdHTML() {
    return `If you can see this message, then you are using my extension. If you would like to have a KA badge in chat for every stream you go in that other KickAssist users will see, simply gift me a sub. Thank you!`;
  }

  replaceTextWithImage(element, searchText) {
    if (!element || !element.childNodes) return;
    if (!/\bKA\b/.test(element.innerHTML)) return;

    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const regex = new RegExp("\\b" + searchText + "\\b", "g");
        if (regex.test(node.nodeValue)) {
          const newNode = document.createElement("span");
          newNode.innerHTML = node.nodeValue.replace(regex, this.getKaImgElm());
          node.replaceWith(newNode);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        this.replaceTextWithImage(node, searchText);
      }
    });
  }

  replaceTextWithKAAD(element, searchText) {
    if (!element || !element.childNodes) return;

    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const regex = new RegExp("\\b" + searchText + "\\b", "g");
        if (regex.test(node.nodeValue)) {
          const newNode = document.createElement("span");
          newNode.innerHTML = node.nodeValue.replace(regex, this.getKaAdHTML());
          node.replaceWith(newNode);
          this.replaceTextWithImage(element, "KA");
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        this.replaceTextWithKAAD(node, searchText);
      }
    });
  }

  doDeveloperReplacements(userName, messageElm) {
    if (userName.textContent !== "MiahFuta") return;

    if (messageElm.innerHTML.includes("KAAD")) {
      this.replaceTextWithKAAD(messageElm, "KAAD");
    } else if (messageElm.innerHTML.includes("KARB")) {
      this.getMain().badges.loadExtensionSupporters();
    }
  }

  processNode(node) {
    this.setVars(node);
    if (this.getIsMessage()) {
      if (this.getSenderType() !== 0) {
        const messageElm = node.querySelector(".chat-entry");
        const userName = messageElm.querySelector(".chat-entry-username");

        if (userName && !this.getIsBot(userName)) {
          this.getOutlines().processNode(node, this);
          this.replaceTextWithImage(messageElm, "KA");
          this.getBadges().processChatterUsername(userName);
          this.doDeveloperReplacements(userName, messageElm);
        }
      }
    } else {
      if (node.classList.contains("user-profile")) {
        const usernameLink = node.querySelector("a.username");
        if (usernameLink) {
          const usernameToLower = usernameLink.textContent.toLowerCase();
          this.getBadges().processPopoutUsername(node, usernameToLower);
        }
      }
    }
  }

  setVars(node) {
    const chatEntryDiv = node.querySelector(".chat-entry");

    this.setIsMessage(chatEntryDiv ? true : false);
    this.setHasMention(
      chatEntryDiv ? chatEntryDiv.classList.contains("border") : false
    );

    if (!this.getIsMessage()) {
      this.setSenderType(0);
    } else {
      const strippedHtml = chatEntryDiv.innerHTML.replace(/\s/g, "");

      if (this.htmlToBadge(strippedHtml, this.getBadgeTypes().staff)) {
        this.setSenderType(1);
      } else if (
        this.htmlToBadge(strippedHtml, this.getBadgeTypes().streamer)
      ) {
        this.setSenderType(2);
      } else if (
        this.htmlToBadge(strippedHtml, this.getBadgeTypes().moderator)
      ) {
        this.setSenderType(3);
      } else if (
        this.htmlToBadge(strippedHtml, this.getBadgeTypes().verified)
      ) {
        this.setSenderType(4);
      } else {
        this.processMessages(node);
      }
    }
  }

  //? Added for Processing Messages
  processMessages(node) {
    let messageElement = node.querySelector(".chat-entry-content");
    let isFound = false;

    highlightLoop: for (let i = 0; i < highlightWordList.length; i++) {
      if (messageElement == null) {
        this.setSenderType(6);
        continue;
      } else if (messageElement.innerHTML.includes(highlightWordList[i])) {
        if (isFound === false) {
          isFound = true;
        }

        for (let j = 0; j < blacklistWordList.length; j++) {
          if (
            messageElement.innerHTML.includes(blacklistWordList[j]) &&
            blacklistWordList[j].includes(highlightWordList[i])
          ) {
            // if (blacklistWordList[j].includes(highlightWordList[i])) {
            continue highlightLoop;
            // }
          }
        }

        messageElement.innerHTML = messageElement.innerHTML.replace(
          RegExp(
            highlightWordList[i].replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            "g"
          ),
          `<span style="border: 1px solid #7f7f7f; padding-inline: 1px;">${highlightWordList[i]}</span>`
        );

        this.setSenderType(5);
      } else {
        if (isFound === false) {
          this.setSenderType(6);
        }
      }
    }

    if (
      settings.chatroomOnlyHighlight &&
      isFound === false &&
      this.getSenderType() == 6
    ) {
      if (settings.chatroomOnlyHighlight) {
        node.remove();
      }
    }
  }

  htmlToBadge(strippedHtml, badgeHtml) {
    return strippedHtml.indexOf(badgeHtml) !== -1;
  }

  getBadgeTypes() {
    return {
      staff:
        `d="M2.07324 1.33331H6.51991V4.29331H7.99991V2.81331H9.47991V1.33331H13.9266V5.77998H12.4466V7.25998H10.9599V8.73998H12.4466V10.22H13.9266V14.6666H9.47991V13.1866H7.99991V11.7066H6.51991V14.6666H2.07324V1.33331Z"`.replace(
          /\s/g,
          ""
        ),
      streamer: `id="Badge_Chat_host"`.replace(/\s/g, ""),
      moderator: `d="M11.7,1.3v1.5h-1.5v1.5
                H8.7v1.5H7.3v1.5H5.8V5.8h-3v3h1.5v1.5H2.8v1.5H1.3v3h3v-1.5h1.5v-1.5h1.5v1.5h3v-3H8.7V8.7h1.5V7.3h1.5V5.8h1.5V4.3h1.5v-3
                C14.7,1.3,11.7,1.3,11.7,1.3z"`.replace(/\s/g, ""),
      verified:
        `d="M16 6.83512L13.735 4.93512L13.22 2.02512H10.265L8 0.120117L5.735 2.02012H2.78L2.265 4.93012L0 6.83512L1.48 9.39512L0.965 12.3051L3.745 13.3151L5.225 15.8751L8.005 14.8651L10.785 15.8751L12.265 13.3151L15.045 12.3051L14.53 9.39512L16.01 6.83512H16ZM6.495 12.4051L2.79 8.69512L4.205 7.28012L6.495 9.57512L11.29 4.78012L12.705 6.19512L6.5 12.4001L6.495 12.4051Z"`.replace(
          /\s/g,
          ""
        ),
    };
  }
}

class Outlines {
  main;

  constructor(main) {
    this.main = main;
  }

  getMiFu() {
    return this.main.mifu;
  }

  getSettings() {
    return this.main.settings;
  }

  processNode(node, mutationProcessor) {
    const hasOutline = mutationProcessor.getHasMention();
    if (hasOutline) return;

    const chatEntryDiv = node.querySelector(".chat-entry");
    if (chatEntryDiv) {
      const isPinned = chatEntryDiv.closest(".pinned-message__content");
      if (isPinned) return;

      switch (mutationProcessor.getSenderType()) {
        case 1:
          chatEntryDiv.id = "mifu-chat-staff-entry";
          this.setOutline(chatEntryDiv, "Kick Staff");
          break;
        case 2:
          chatEntryDiv.id = "mifu-chat-streamer-entry";
          this.setOutline(chatEntryDiv, "Streamer");
          break;
        case 3:
          chatEntryDiv.id = "mifu-chat-moderator-entry";
          this.setOutline(chatEntryDiv, "Moderators");
          break;
        case 4:
          chatEntryDiv.id = "mifu-chat-verified-entry";
          this.setOutline(chatEntryDiv, "Verified");
          break;
        //? Add case 5 for highlighted messages
        case 5:
          chatEntryDiv.id = "mifu-chat-highlighted-entry";
          this.setOutline(chatEntryDiv, "Highlighted");
          break;
        default:
          break;
      }
    }
  }

  setOutline(chatEntryElm, forWho) {
    if (!this.getMiFu().dbLoaded) return;
    const state = this.getSettings().getState(`Message Outlines for ${forWho}`);
    chatEntryElm.setAttribute("data-mifu-chat-outline", state);
  }
}

class ReplayBuffer_video {
  main;

  vars;

  constructor(main) {
    this.main = main;
    this.vars = {};
  }

  getMiFu() {
    return this.main.mifu;
  }

  getSettings() {
    return this.main.settings;
  }

  debug(message) {
    this.main.debug(message);
  }

  insert() {
    setInterval(() => {
      this.checkToRun();
    }, 1000);
    this.debug("Replay Buffer Ready!");
  }

  checkToRun() {
    const isVODPage = window.location.href.includes("/video/");
    if (!isVODPage) this.start();
  }

  async start() {
    const myID = "mifu-player-check";

    if (document.getElementById(myID)) {
      this.toggleStates();
      return;
    }

    const video = document.querySelector(
      'video[src^="blob:"]:not([id]):not([id*="clip"])'
    );

    if (!video) return;

    video.id = myID;

    const buttonsAdded = await this.addButtons(video);
    if (buttonsAdded) {
      this.addBufferInfo();
      this.addLiveJump(video);
      this.addWatcher(video);
      this.vars.controlsEnabled = true;
      this.vars.bufferInfoEnabled = true;
    }
  }

  async toggleStates() {
    const bufferEnabled = this.getSettings().getState("Replay Buffer");
    const bufferInfoEnabled = this.getSettings().getState("Replay Buffer Info");

    this.hideControls(bufferEnabled, this.vars.controlsEnabled);
    this.hideInfo(
      bufferEnabled,
      bufferInfoEnabled,
      this.vars.bufferInfoEnabled
    );
  }

  async hideControls(enabled, showing) {
    if ((enabled && showing) || (!enabled && !showing)) return;

    let flag = null;

    if (enabled && !showing) {
      flag = true;
    } else if (!enabled && showing) {
      flag = false;
    }

    if (flag !== null) {
      const speedSelect = document.querySelector(".mifu-speed-menu");
      const fastForward = document.getElementById("mifu-fastforward");
      const rewind = document.getElementById("mifu-rewind");

      speedSelect.style.display = flag ? "block" : "none";
      fastForward.style.display = flag ? "block" : "none";
      rewind.style.display = flag ? "block" : "none";

      this.vars.controlsEnabled = flag;
    }
  }

  async hideInfo(fullyEnabled, enabled, showing) {
    if (
      (fullyEnabled & enabled && showing) ||
      (!enabled && !showing) ||
      (!fullyEnabled && !showing)
    )
      return;

    let flag = null;

    if (fullyEnabled && enabled && !showing) {
      flag = true;
    } else if (!fullyEnabled && showing) {
      flag = false;
    } else if (!enabled && showing) {
      flag = false;
    }

    if (flag !== null) {
      const bufferInfo = document.getElementById("mifu-buffer-info");

      bufferInfo.style.display = flag ? "block" : "none";

      this.vars.bufferInfoEnabled = flag;
    }
  }

  addLiveJump(video) {
    const liveButton = document.querySelector(
      ".vjs-live-control .vjs-live-display"
    );
    if (liveButton) {
      liveButton.addEventListener("click", () => {
        const buffered = video.buffered;
        if (buffered.length > 0) {
          const endTime = Math.floor(buffered.end(0));
          if (video.currentTime !== endTime - 1.25) {
            video.currentTime = endTime - 1.25;
          }
        }
      });
      liveButton.style.cursor = "pointer";
    } else {
      setTimeout(() => this.addLiveJump(video), 2000);
    }
  }

  addWatcher(video) {
    const speedSelect = document.getElementById("mifu-speedSelect");
    speedSelect.addEventListener("change", () => {
      const selectedSpeed = parseFloat(speedSelect.value);
      if (isFinite(selectedSpeed)) {
        video.playbackRate = selectedSpeed;
      }
    });

    video.addEventListener("timeupdate", () => {
      try {
        const bufferInfo = this.vars.bufferInfo;
        const buffered = video.buffered;

        if (buffered.length > 0) {
          const curTime = Math.floor(video.currentTime);
          const startTime = Math.floor(buffered.start(0));
          const endTime = Math.floor(buffered.end(0));
          const bufferTime = endTime - startTime;

          const offSet = endTime - curTime;
          const curOffset = offSet < 0 ? 0 : offSet;

          const atEnd = curOffset <= 4;

          const addSplit = `&nbsp;|&nbsp;`;
          const infoSize = `Size: ${bufferTime}`;
          const infoPos = `Position: ${curOffset}`;
          const infoState = atEnd ? "" : ` ${addSplit} Playing from Buffer`;

          const curTimeExact = video.currentTime;
          const endTimeExact = buffered.end(0);
          const offsetExact = endTimeExact - curTimeExact;
          const curOffsetExact = offsetExact < 0 ? 0 : offsetExact;

          this.resetSpeedSelect(video, curOffsetExact);

          bufferInfo.innerHTML = /*HTML*/ `
                        【 Replay Buffer 】 ${infoSize} ${addSplit} ${infoPos} ${infoState}
                    `;
        }
      } catch (error) {}
    });
  }

  resetSpeedSelect(video, curOffset) {
    const speedSelect = document.getElementById("mifu-speedSelect");
    const selectedSpeed = parseFloat(speedSelect.value);
    if (selectedSpeed > 1.0 && curOffset < 2) {
      speedSelect.value = "1.0";
      video.playbackRate = 1.0;
    }
  }

  addBufferInfo() {
    this.vars.bufferInfo = document.createElement("div");
    this.vars.bufferInfo.id = "mifu-buffer-info";
    this.vars.bufferInfo.style.display = "block";

    const liveDisplay = document.querySelector(".vjs-live-display");

    if (liveDisplay) {
      liveDisplay.parentNode.insertBefore(
        this.vars.bufferInfo,
        liveDisplay.nextSibling
      );

      this.addSpeedSelectMenu(liveDisplay);
    }
  }

  addSpeedSelectMenu(liveDisplay) {
    const speedMenu = document.createElement("div");
    speedMenu.classList.add("mifu-speed-menu");
    speedMenu.innerHTML = `
                    <label for="mifu-speedSelect" style="color: white;">Playback Speed:</label>
                    <select id="mifu-speedSelect" style="cursor: pointer;">
                        <option value="0.1">0.10x</option>
                        <option value="0.25">0.25x</option>
                        <option value="0.5">0.50x</option>
                        <option value="0.75">0.75x</option>
                        <option value="1.0" selected>1.00x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.50x</option>
                        <option value="2.0">2.00x</option>
                        <option value="2.5">2.50x</option>
                        <option value="3.0">3.00x</option>
                    </select>
                `;
    liveDisplay.parentNode.insertBefore(speedMenu, liveDisplay.nextSibling);
  }

  async addButtons(video, buttons = []) {
    buttons.push(this.createButton("FastForward", true, video));
    buttons.push(this.createButton("Rewind", false, video));

    const playButton = document.querySelector(".vjs-play-control");

    if (playButton) {
      buttons.forEach((buttonElement) => {
        playButton.parentNode.insertBefore(
          buttonElement,
          playButton.nextSibling
        );
      });
      return true;
    } else {
      return false;
    }
  }

  createButton(label, skip, video) {
    const button = document.createElement("button");

    button.className = "vjs-button vjs-control vjs-button";
    button.id = `${skip ? "mifu-fastforward" : "mifu-rewind"}`;
    button.type = "button";
    button.ariaDisabled = "false";
    button.innerHTML = /*HTML*/ `
                <span class="vjs-icon-placeholder" id="vid-control-${label
                  .replace(/\s/g, "")
                  .toLowerCase()}" aria-hidden="true"></span>
                <span class="vjs-control-text" aria-live="polite">${label}</span>
            `;

    button.addEventListener("click", () => {
      function rewind() {
        const buffered = video.buffered;

        if (buffered.length > 0) {
          const curTime = Math.floor(video.currentTime);
          const startTime = Math.floor(buffered.start(0));

          if (curTime - startTime >= 10) {
            video.currentTime -= 10;
          } else {
            video.currentTime = startTime;
          }
        }
      }

      function forward() {
        const buffered = video.buffered;

        if (buffered.length > 0) {
          const curTime = Math.floor(video.currentTime);
          const endTime = Math.floor(buffered.end(0));
          const offset = endTime - curTime;
          const curOffset = offset < 0 ? 0 : offset;

          if (curOffset >= 12) {
            video.currentTime += 10;
          } else {
            video.currentTime = endTime - 1.25;
          }
        }
      }

      if (skip) {
        forward();
      } else {
        rewind();
      }
    });

    return button;
  }
}

class Setting {
  settings;

  name;
  type;
  state;

  color;
  colorLabel;

  pusherData;

  constructor(settings, name, type, state) {
    this.settings = settings;
    this.name = name;
    this.type = type;
    this.state = state;

    this.pusherData = {};
    this.pusherData.socket = null;
  }

  //NOTE - core get

  getSettings() {
    return this.settings;
  }

  getMain() {
    return this.getSettings().getMain();
  }
  getMiFu() {
    return this.getMain().mifu;
  }

  getChannelData() {
    return this.getMain().channelData;
  }

  //NOTE - base get

  getName() {
    return this.name;
  }
  getType() {
    return this.type;
  }
  getState() {
    return this.state;
  }

  //NOTE - base set

  setState(toggleState) {
    this.state = toggleState;
    this.getSettings().save();
    this.onSave();
  }

  //NOTE - on core events

  async onLoad(toggleState) {
    this.state = toggleState;
  }

  //NOTE - on set events

  async onSave() {}
  async onStart() {}
  async onStop() {}

  //NOTE - colors

  getColor() {
    return this.color;
  }
  getColorLabel() {
    return this.colorLabel;
  }

  setColorLabel(label) {
    this.colorLabel = label;
  }
  setColor(hexColor, fromLoad = false) {
    this.color = hexColor;
    if (fromLoad) return;
    this.getSettings().saveColors();
    this.onStart();
  }

  hasColor() {
    return this.color ? true : false;
  }
  hasColorLabel() {
    return this.colorLabel ? true : false;
  }

  doOutlineColorUpdate(newColor, cssIdentifier) {
    const styleElement = document.querySelector("#mifu-css-edits");

    if (styleElement) {
      const pattern = new RegExp(
        `#mifu-chat-${cssIdentifier}-entry\\[data-mifu-chat-outline="true"\\] \\{[\\s\\S]*?border: 1px dashed #([0-9a-fA-F]+);[\\s\\S]*?\\}`,
        "g"
      );

      styleElement.textContent = styleElement.textContent.replace(
        pattern,
        `#mifu-chat-${cssIdentifier}-entry[data-mifu-chat-outline="true"] { border: 1px dashed ${newColor}; }`
      );
    }
  }

  //NOTE - observer

  createObserver(targetElement) {
    const observer = new MutationObserver((mutations) => {
      this.onMutation(mutations);
    });
    observer.observe(targetElement, { subtree: true, childList: true });
    return observer;
  }

  destroyObserver(observer) {
    observer.disconnect();
  }

  onMutation(mutations) {}

  //NOTE - pusher

  async togglePusher(flag) {
    if (flag) {
      await this.startPusher();
    } else {
      await this.stopPusher();
    }
  }

  async startPusher() {
    const prefix = "wss://ws-us2.pusher.com/app/eb1d5f283081a78b932c";
    const suffix = "?protocol=7&client=js&version=7.6.0&flash=false";

    this.pusherData.socketUrl = `${prefix}${suffix}`;
    this.pusherData.socketIsClosing = false;
    this.pusherData.socket = null;

    this.pusherData.chatroomId = await this.getChannelData().getChatroomId(
      this.getMiFu().channelName
    );

    if (this.pusherData.chatroomId) {
      this.pusherData.messageHandler = this.handlePusherMessage.bind(this);
      this.pusherData.socket = new WebSocket(this.pusherData.socketUrl);
      this.pusherData.socket.addEventListener("open", async () => {
        const readyState = this.pusherData.socket.readyState;
        if (readyState === WebSocket.OPEN) {
          this.pusherData.socket.send(
            JSON.stringify({
              event: "pusher:subscribe",
              data: {
                auth: "",
                channel: `chatrooms.${this.pusherData.chatroomId}.v2`,
              },
            })
          );
        }
      });
      this.pusherData.socket.addEventListener(
        "message",
        this.pusherData.messageHandler
      );
      this.pusherData.socket.addEventListener("error", async (event) => {});
      this.pusherData.socket.addEventListener("close", async (event) => {
        this.onPusherDisconnected(event);
        if (!this.pusherData.socketIsClosing) this.reconnectPusher(2);
        this.pusherData.socketIsClosing = false;
      });
    } else {
      this.reconnectPusher(2);
    }
  }

  reconnectPusher(seconds) {
    setTimeout(() => {
      this.startPusher();
    }, seconds * 1000);
  }

  async stopPusher() {
    if (this.pusherData.socket === null) return;

    const readyState = this.pusherData.socket.readyState;
    const isOpen = readyState === WebSocket.OPEN;
    const isConnecting = readyState === WebSocket.CONNECTING;

    if (isOpen || isConnecting) {
      this.pusherData.socketIsClosing = true;
      this.pusherData.chatroomId = null;
      this.pusherData.socket.close();
    }
  }

  handlePusherMessage(event) {
    const data = JSON.parse(event.data);
    switch (data.event) {
      case "pusher:connection_established":
        this.onPusherConnected(data);
        break;
      case "App\\Events\\ChatMessageEvent":
        this.onPusherChatMessage(data);
        break;
      case "App\\Events\\GiftedSubscriptionsEvent":
        this.onPusherGiftedSubscriptions(data);
        break;
      case "App\\Events\\MessageDeletedEvent":
        this.onPusherMessageDeleted(data);
        break;
      case "App\\Events\\StreamHostEvent":
        this.onPusherStreamHost(data);
        break;
      case "App\\Events\\SubscriptionEvent":
        this.onPusherSubscription(data);
        break;
      case "App\\Events\\UserBannedEvent":
        this.onPusherUserBanned(data);
        break;
    }
  }

  onPusherConnected(event) {}
  onPusherDisconnected(event) {}
  onPusherChatMessage(event) {}
  onPusherGiftedSubscriptions(event) {}
  onPusherMessageDeleted(event) {}
  onPusherStreamHost(event) {}
  onPusherSubscription(event) {}
  onPusherUserBanned(event) {}
}

class AutoHDStream extends Setting {
  constructor(settings) {
    const name = "Auto HD Stream";
    const type = 1; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = false; // Enabled State

    super(settings, name, type, state);

    this.retry = null;
    this.initStart = null;
  }

  async onSave() {}

  async onStart() {
    if (this.getState())
      this.initStart = setTimeout(() => this.changeQuality(), 1000);
  }

  async onStop() {
    clearTimeout(this.retry);
    clearTimeout(this.initStart);
  }

  //NOTE - custom

  changeQuality(flag = true) {
    if (document.getElementById("mifu-player-check")) {
      const buttons = document.querySelectorAll(".vjs-menu-item-text");
      for (const button of buttons) {
        const buttonText = button.textContent.trim();
        if (buttonText === "Auto") {
          const buttonElm = button.parentElement;
          if (buttonElm.getAttribute("aria-checked") === "true") {
            const nextButton = buttonElm.nextElementSibling;
            const currentlyFocusedElement = document.activeElement;
            nextButton.dispatchEvent(
              new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window,
              })
            );
            currentlyFocusedElement.focus();
          } else {
            flag = false;
          }
          return;
        }
      }
    }
    if (flag) this.retry = setTimeout(() => this.changeQuality(), 1000);
  }
}

class AutoMuteStream extends Setting {
  constructor(settings) {
    const name = "Auto Mute Stream";
    const type = 1; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = false; // Enabled State

    super(settings, name, type, state);

    this.retry = null;
    this.initStart = null;
  }

  async onSave() {}

  async onStart() {
    this.initStart = setTimeout(() => this.toggleMute(), 1000);
  }

  async onStop() {
    clearTimeout(this.retry);
    clearTimeout(this.initStart);
  }

  //NOTE - custom

  toggleMute(flag = true) {
    const video = document.getElementById("mifu-player-check");
    if (video) {
      if (this.getState() !== video.muted) {
        video.muted = this.getState();
      } else {
        flag = false;
      }
    }
    if (flag) this.retry = setTimeout(() => this.toggleMute(), 500);
  }
}

class AutoRejectHosts extends Setting {
  constructor(settings) {
    const name = "Auto Reject Hosts";
    const type = 1; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = false; // Enabled State

    super(settings, name, type, state);

    this.setDefaults();
  }

  //NOTE - init variables

  setDefaults() {
    this.observer = null;
  }

  //NOTE - core start/stop functions

  async onSave() {
    if (this.getState()) {
      this.doStart();
    } else {
      this.doStop();
    }
  }

  async onStart() {
    if (this.getState()) this.doStart();
  }

  async onStop() {
    this.doStop();
  }

  //NOTE - easy start/stop functions

  doStart() {
    this.startMutations();
  }

  doStop() {
    this.stopMutations();
  }

  //NOTE - mutation observer

  startMutations() {
    this.stopMutations();
    const mainView = document.getElementById("main-view");
    if (mainView) this.observer = this.createObserver(mainView);
  }

  stopMutations() {
    if (this.observer !== null) {
      this.destroyObserver(this.observer);
      this.observer = null;
    }
  }

  onMutation(mutations) {
    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            this.processNode(node);
          }
        }
      }
    }
  }

  processNode(node) {
    const picture = node.querySelector("picture");
    if (picture !== null && picture.classList.contains("stream-preview")) {
      const pictureParent = picture.parentElement;
      const rejectButton = pictureParent.querySelector("button");
      if (rejectButton) {
        setTimeout(() => {
          this.insertChatAlert(picture);
          rejectButton.dispatchEvent(
            new MouseEvent("click", {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );
        }, 1000);
      }
    }
  }

  insertChatAlert(picture, rejectMessage = "Host was Rejected by KickAssist!") {
    const chatroomElement = document.getElementById("chatroom");
    if (chatroomElement) {
      const overflowYScrollElement =
        chatroomElement.querySelector(".overflow-y-scroll");
      if (overflowYScrollElement) {
        const image = picture.querySelector("img");
        if (image) {
          const hostedName = image.getAttribute("alt");
          if (hostedName) rejectMessage = `${hostedName} ${rejectMessage}`;
        }

        const newElement = document.createElement("div");
        newElement.innerHTML = /*HTML*/ `<div data-v-1872a84b="" data-chat-entry="" class="break-words mt-0.5"><div data-v-09664cd9="" class="chatroom-event-host__container !break-normal"><div data-v-09664cd9="" class="base-icon chatroom-event-host__icon" style="width:16px;height:16px"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.555 2.39C12.965 1.805 12.15 1.44 11.255 1.44C9.45499 1.44 7.99999 2.895 7.99999 4.695C7.99999 2.895 6.54499 1.44 4.74499 1.44C2.94499 1.44 1.48999 2.895 1.48999 4.695V11.305C1.48999 13.1 2.94999 14.56 4.74499 14.56C5.64499 14.56 6.45999 14.195 7.04999 13.605C7.63499 13.015 7.99999 12.2 7.99999 11.305C7.99999 13.1 9.45499 14.56 11.255 14.56C13.055 14.56 14.51 13.1 14.51 11.305V4.695C14.51 3.795 14.145 2.98 13.555 2.39ZM9.45499 10.505V9.34H6.49999V11.305C6.49999 12.27 5.71499 13.06 4.74499 13.06C3.77499 13.06 2.98999 12.27 2.98999 11.305V4.695C2.98999 3.725 3.77999 2.94 4.74499 2.94C5.70999 2.94 6.49999 3.725 6.49999 4.695V6.66H9.45499V5.495L13.015 8L9.45499 10.505Z" fill="currentColor"></path></svg></div><span data-v-09664cd9="" class="chatroom-event-host__label"><span data-v-09664cd9="" class="text-white">${rejectMessage}</span></span></div></div>`;

        const shouldTriggerScroll = this.shouldScroll();

        const lastChild = overflowYScrollElement.lastChild;
        if (lastChild) {
          overflowYScrollElement.insertBefore(newElement, lastChild);
        } else {
          overflowYScrollElement.appendChild(newElement);
        }

        if (shouldTriggerScroll) this.triggerScroll();
      }
    }
  }

  shouldScroll() {
    const chatroom = document.getElementById("chatroom");
    if (!chatroom) return true;

    for (let div of chatroom.querySelectorAll("div")) {
      for (let svg of div.querySelectorAll("svg")) {
        const paths = svg.querySelectorAll("path");
        if (paths.length === 2) {
          const [path1, path2] = paths;
          if (
            path1.getAttribute("d") === "M7 3H3V13H7V3Z" &&
            path2.getAttribute("d") === "M13 3H9V13H13V3Z"
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  triggerScroll() {
    const chatroom = document.getElementById("chatroom");
    if (chatroom) {
      const section = chatroom.querySelector(".overflow-y-scroll");
      if (section) section.scroll(0, section.scrollHeight);
    }
  }
}

class AutoTheaterMode extends Setting {
  constructor(settings) {
    const name = "Auto Theater Mode";
    const type = 1; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = false; // Enabled State

    super(settings, name, type, state);

    this.retry = null;
  }

  async onSave() {}

  async onStart() {
    const isClipPage = window.location.href.includes("?clip=");
    if (this.getState() && !isClipPage) this.enableTheaterMode();
  }

  async onStop() {
    clearTimeout(this.retry);
  }

  //NOTE - custom

  enableTheaterMode(flag = true) {
    if (document.getElementById("mifu-player-check")) {
      const button = document.querySelector(
        ".vjs-control-bar .vjs-control .kick-icon-theater"
      );
      if (button) {
        if (!button.classList.contains("vjs-icon-theater-active")) {
          const currentlyFocusedElement = document.activeElement;
          button.dispatchEvent(
            new MouseEvent("click", {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );
          currentlyFocusedElement.focus();
        } else {
          flag = false;
        }
      }
    }
    if (flag) this.retry = setTimeout(() => this.enableTheaterMode(), 500);
  }
}

class ChannelStats extends Setting {
  constructor(settings) {
    const name = "Channel Stats";
    const type = 2; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = false; // Enabled State

    super(settings, name, type, state);

    //NOTE - custom

    this.onSliderInput = this.onSliderInput.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.vars = {};
    this.intervals = [];
    this.vars.chatters = [];

    this.seconds = 0;

    this.retry = null;
    this.initStart = null;

    this.isDragging = false;
    this.isAutoScaling = false;
  }

  async onSave() {
    if (this.getState()) {
      this.startOverlay();
    } else {
      this.stopOverlay();
    }
  }

  async onStart() {
    // if (this.getState()) { this.startOverlay(); }
    if (this.getState()) {
      this.initStart = setTimeout(() => this.startOverlay(), 1000);
    } else {
      this.stopOverlay();
    }
    // if (this.getState()) setTimeout(() => this.startOverlay(), 1000);
  }

  async onStop() {
    this.stopOverlay();
  }

  //NOTE - custom

  // callbackFunction (fromLoad) {
  //     if (fromLoad) return;
  //     if (this.getState()) { this.startOverlay(); }
  //     else { this.stopOverlay(); }
  // }

  async startOverlay() {
    if (this.getState()) {
      this.resetWsData();
      this.addDraggableElement();
      this.addIntervals();
      this.togglePusher(true);
    }
  }

  stopOverlay() {
    clearTimeout(this.retry);
    clearTimeout(this.initStart);
    this.togglePusher(false);
    this.resetWsData();
    this.removeIntervals();
    this.removeDraggableElement();
  }

  //NOTE - getters

  getChannelName() {
    return this.getMiFu().channelName;
  }

  getVideo() {
    const video = document.getElementById("mifu-player-check");
    return video ? video : null;
  }

  getVideoRect() {
    const video = this.getVideo();
    return video ? video.getBoundingClientRect() : null;
  }

  //NOTE - draggable

  addDraggableElement() {
    this.removeDraggableElement();
    if (this.getVideo()) {
      const style = document.createElement("style");
      style.id = "mifu-draggable-style";
      style.innerHTML = this.getCss();
      document.head.appendChild(style);

      this.draggableElm = document.createElement("div");
      this.draggableElm.id = "mifu-draggable-element";
      this.draggableElm.className = "mifu-draggable";
      this.draggableElm.draggable = true;

      const video = this.getVideo();
      video.parentElement.appendChild(this.draggableElm);

      const stats = document.createElement("div");
      stats.id = "mifu-draggable-stats";
      stats.className = "stats";
      stats.innerHTML = this.getHtml();
      this.draggableElm.appendChild(stats);

      const dragLoc =
        this.getVideoRect().width - this.draggableElm.offsetWidth / 2;
      this.draggableElm.style.left = `calc(${dragLoc}px)`;

      this.draggableElm.addEventListener("mousedown", this.onMouseDown);

      const slider = document.getElementById("mifu-draggable-slider");
      slider.addEventListener("change", this.onSliderInput);

      const channel = document.getElementById("mifu-draggable-channel-name");
      if (channel) channel.textContent = this.getChannelName();
      this.getViewerCounts();
      this.triggerDisconnectedMessage();
    } else {
      this.retry = setTimeout(() => {
        this.addDraggableElement();
      }, 1000);
    }
  }

  removeDraggableElement() {
    const style = document.getElementById("mifu-draggable-style");
    if (style) style.parentNode.removeChild(style);

    const div = document.getElementById("mifu-draggable-element");
    if (div) div.parentNode.removeChild(div);
  }

  //NOTE - intervals

  addIntervals() {
    this.removeIntervals();

    this.slowClock = setInterval(() => {
      this.getViewerCounts();
    }, 60 * 1000);
    this.intervals.push(this.slowClock);

    this.fastClock = setInterval(() => {
      this.updateTime();
    }, 1000);
    this.intervals.push(this.fastClock);

    this.fasterClock = setInterval(() => {
      this.recoverLostPosition();
    }, 250);
    this.intervals.push(this.fasterClock);

    this.fastestClock = setInterval(() => {
      this.fixScaling();
    }, 50);
    this.intervals.push(this.fastestClock);
  }

  removeIntervals() {
    if (this.intervals.length !== 0) {
      this.intervals.forEach((interval) => {
        clearInterval(interval);
      });
      this.intervals = [];
    }
  }

  //NOTE - reset vars

  resetWsData() {
    this.seconds = 0;
    this.vars = {};

    this.vars.chatters = [];
    this.vars.messages = 0;
    this.vars.patricks = 0;

    this.vars.peakViewers = 0;
    this.vars.currentViewers = 0;

    this.vars.totalSubCount = 0;
    this.vars.totalSubRevenue = "$0.00";

    this.vars.updateCount = 0;
    this.vars.totalViewers = 0;
    this.vars.averageViewers = 0;

    this.vars.bannedUserCount = 0;
    this.vars.timedoutUserCount = 0;
    this.vars.deletedMessageCount = 0;
  }

  setElement(element, textContent) {
    element.textContent = textContent;
    // element.parentElement.style.display = 'flex';
  }

  //NOTE - kick data

  async getViewerCounts() {
    try {
      const isLive = await this.getChannelData().getIsLive(
        this.getChannelName()
      );

      if (!isLive) return;

      const newLiveCount = await this.getChannelData().getViewerCount(
        this.getChannelName()
      );

      this.vars.currentViewers = newLiveCount;
      this.vars.totalViewers += newLiveCount;
      this.vars.updateCount++;

      if (newLiveCount > this.vars.peakViewers) {
        this.vars.peakViewers = newLiveCount;
      }

      const average = this.vars.totalViewers / this.vars.updateCount;
      this.vars.averageViewers = Math.round(average);

      const peakCount = document.getElementById("mifu-draggable-viewer-peak");
      if (peakCount)
        this.setElement(peakCount, this.vars.peakViewers.toLocaleString());

      const viewerCount = document.getElementById(
        "mifu-draggable-viewer-count"
      );
      if (viewerCount)
        this.setElement(viewerCount, this.vars.currentViewers.toLocaleString());

      const averageCount = document.getElementById(
        "mifu-draggable-viewer-average"
      );
      if (averageCount)
        this.setElement(
          averageCount,
          this.vars.averageViewers.toLocaleString()
        );
    } catch (error) {}
  }

  //NOTE - pusher handlers

  onPusherConnected(event) {
    this.isPusherConnected = true;
    this.triggerDisconnectedMessage();
  }

  onPusherDisconnected(event) {
    this.isPusherConnected = false;
    this.triggerDisconnectedMessage();
  }

  onPusherChatMessage(event) {
    const eventData = JSON.parse(event.data);

    this.calculatePatricks(eventData);

    const messageSender = eventData.sender.username.toLowerCase();

    const kickBots = ["botrix", "kickbot", "kicklet"];
    if (kickBots.includes(messageSender)) return;

    if (!this.vars.chatters.includes(messageSender)) {
      this.vars.chatters.push(messageSender);
      const uniqueUsernames = document.getElementById(
        "mifu-draggable-unique-usernames"
      );
      if (uniqueUsernames)
        this.setElement(
          uniqueUsernames,
          this.vars.chatters.length.toLocaleString()
        );
    }
    this.vars.messages++;
    const messageCount = document.getElementById(
      "mifu-draggable-message-count"
    );
    if (messageCount)
      this.setElement(messageCount, this.vars.messages.toLocaleString());
  }

  onPusherMessageDeleted(event) {
    this.vars.deletedMessageCount++;
    const deletedMessages = document.getElementById(
      "mifu-draggable-deleted-messages"
    );
    if (deletedMessages)
      this.setElement(
        deletedMessages,
        this.vars.deletedMessageCount.toLocaleString()
      );
  }

  onPusherUserBanned(event) {
    const eventData = JSON.parse(event.data);
    const expiresAt = eventData.expires_at;
    if (expiresAt === undefined) {
      this.vars.bannedUserCount++;
      const bannedUsers = document.getElementById(
        "mifu-draggable-banned-users"
      );
      if (bannedUsers)
        this.setElement(
          bannedUsers,
          this.vars.bannedUserCount.toLocaleString()
        );
    } else {
      this.vars.timedoutUserCount++;
      const timedoutUsers = document.getElementById(
        "mifu-draggable-timedout-users"
      );
      if (timedoutUsers)
        this.setElement(
          timedoutUsers,
          this.vars.timedoutUserCount.toLocaleString()
        );
    }
  }

  onPusherSubscription(event) {
    this.calculateSubRevenue(1);
  }

  onPusherGiftedSubscriptions(event) {
    const eventData = JSON.parse(event.data);
    this.calculateSubRevenue(eventData.gifted_usernames.length);
  }

  onPusherStreamHost(event) {}

  //TODO - calculations

  calculatePatricks(eventData) {
    if (eventData.content) {
      const messageContent = eventData.content;
      const patrickEmote = "[emote:37231:PatrickBoo]";
      this.vars.patricks += messageContent.includes(patrickEmote)
        ? messageContent.split(patrickEmote).length - 1
        : 0;
      const patricks = document.getElementById("mifu-draggable-patrick-count");
      if (patricks && this.vars.patricks > 0)
        this.setElement(patricks, this.vars.patricks.toLocaleString());
    }
  }

  calculateSubRevenue(subs) {
    const subValue = 4.74;
    this.vars.totalSubCount += subs;
    const totalAmount = this.vars.totalSubCount * subValue;
    this.vars.totalSubRevenue = totalAmount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
    const subEvent = document.getElementById("mifu-draggable-sub-revenue");
    if (subEvent && this.vars.totalSubCount > 0)
      this.setElement(subEvent, this.vars.totalSubRevenue);
  }

  //NOTE - time

  updateTime() {
    this.seconds++;
    const trackingTime = document.getElementById(
      "mifu-draggable-tracking-time"
    );
    if (trackingTime)
      trackingTime.textContent = this.convertSeconds(this.seconds);
  }

  convertSeconds(seconds, result = "") {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    if (days > 0) result += `${days}d `;
    if (hours > 0 || days > 0) result += `${hours}h `;
    if (minutes > 0 || hours > 0 || days > 0) result += `${minutes}m `;
    result += `${remainingSeconds}s`;
    return result.trim();
  }

  //NOTE - mouse events

  onMouseDown(event) {
    if (event.target.id === "mifu-draggable-slider") {
      this.draggableElm.setAttribute("draggable", "false");
      window.addEventListener("mouseup", this.onMouseUp);
      return;
    } else if (event.target.id === "mifu-draggable-close-button") {
      this.setState(false);
      return;
    } else if (event.target.id === "mifu-draggable-toggle-slider-button") {
      const slider = document.getElementById("mifu-draggable-slider");
      slider.classList.toggle("mifu-draggable-show-slider");
      return;
    }
    this.isDragging = true;
    event.preventDefault();
    event.stopPropagation();
    this.updateOffsets(event);
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
  }

  onMouseUp() {
    this.isDragging = false;
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
    this.draggableElm.setAttribute("draggable", "true");
  }

  onMouseMove(event) {
    if (!this.isDragging) return;
    event.preventDefault();
    event.stopPropagation();
    const x = event.clientX - this.offsetX;
    const y = event.clientY - this.offsetY;
    this.draggableElm.style.left = `${x}px`;
    this.draggableElm.style.top = `${y}px`;
  }

  //NOTE - other events

  onSliderInput(event) {
    const scale = event.target.value;
    const stats = document.getElementById("mifu-draggable-stats");
    stats.style.transform = `scale(${scale})`;
  }

  //NOTE - updates

  triggerDisconnectedMessage() {
    const flag = this.isPusherConnected;
    const stats = document.getElementById("mifu-draggable-stats");
    if (stats) {
      const notConnectedElm = stats.querySelector("[data-pusher-notconnected]");
      if (notConnectedElm)
        notConnectedElm.setAttribute("data-pusher-notconnected", flag);

      const pusherDataElms = stats.querySelectorAll("[data-pusher-connected]");
      pusherDataElms.forEach((elm) => {
        elm.setAttribute("data-pusher-connected", flag);
      });
    }
  }

  updateOffsets(event) {
    const rect = this.draggableElm.getBoundingClientRect();
    if (rect) {
      this.offsetX =
        event.clientX -
        (rect.left +
          this.draggableElm.offsetWidth / 2 -
          this.getVideoRect().left);
      this.offsetY =
        event.clientY -
        (rect.top +
          this.draggableElm.offsetHeight / 2 -
          this.getVideoRect().top);
    }
  }

  recoverLostPosition() {
    if (
      this.isAutoScaling ||
      this.isDragging ||
      this.draggableElm === undefined
    )
      return;

    const draggableRect = this.draggableElm.getBoundingClientRect();

    if (this.draggableElm && draggableRect) {
      const divWidth = this.draggableElm.offsetWidth / 2;
      const divHeight = this.draggableElm.offsetHeight / 2;

      const outTop = draggableRect.top < this.getVideoRect().top;
      const outLeft = draggableRect.left < this.getVideoRect().left;
      const outRight = draggableRect.right > this.getVideoRect().right;
      const outBottom = draggableRect.bottom > this.getVideoRect().bottom;

      if (outLeft && !this.isDragging) {
        const newLeft = `${divWidth}px`;
        this.draggableElm.style.left = newLeft;
      }

      if (outTop && !this.isDragging) {
        const newTop = `${divHeight}px`;
        this.draggableElm.style.top = newTop;
      }

      if (this.draggableElm.offsetWidth > this.getVideo().offsetWidth) {
        this.draggableElm.style.left = `${0 + divWidth}px`;
      } else {
        if (outRight && !this.isDragging) {
          const newRight = `${this.getVideoRect().width - divWidth}px`;
          this.draggableElm.style.left = newRight;
        }
      }

      if (outBottom && !this.isDragging) {
        const newBottom = `${this.getVideoRect().height - divHeight}px`;
        this.draggableElm.style.top = newBottom;
      }
    }
  }

  fixScaling() {
    const stats = document.getElementById("mifu-draggable-stats");
    if (stats && this.getVideo() && this.draggableElm) {
      const statsWidth =
        (stats.offsetWidth * stats.getBoundingClientRect().width) /
        stats.clientWidth;
      const statsHeight =
        (stats.offsetHeight * stats.getBoundingClientRect().height) /
        stats.clientHeight;
      if (
        statsWidth !== this.draggableElm.style.width ||
        statsHeight !== this.draggableElm.style.height
      ) {
        this.draggableElm.style.width = statsWidth + "px";
        this.draggableElm.style.height = statsHeight + "px";
      }
      this.downScaleIfNeeded();
    }
  }

  downScaleIfNeeded() {
    if (this.draggableElm && this.getVideo()) {
      if (this.needsScaling(this.draggableElm, this.getVideo())) {
        const slider = document.getElementById("mifu-draggable-slider");
        const stats = document.getElementById("mifu-draggable-stats");

        const oldSliderValue = slider.value;
        const newSliderValue = oldSliderValue - 0.1;

        if (oldSliderValue === 0.1 || newSliderValue === 0.0) {
          this.isAutoScaling = false;
          return;
        }

        this.isAutoScaling = true;
        stats.style.transform = `scale(${newSliderValue})`;
        slider.classList.add("mifu-draggable-show-slider");
        slider.value = newSliderValue;
      } else {
        this.isAutoScaling = false;
      }
    }
  }

  needsScaling(element, container) {
    var elementHeight = element.offsetHeight;
    var containerHeight = container.offsetHeight;
    return elementHeight > containerHeight ? true : false;
  }

  //NOTE - html/css

  getHtml() {
    return /*HTML*/ `
              <button id="mifu-draggable-toggle-slider-button">&#8693;</button>
              <button id="mifu-draggable-close-button">&#10006;</button>
              <h1>Channel Stats</h1>
              <h2><span id="mifu-draggable-channel-name"></span></h2>
              <p>Peak Viewers <span id="mifu-draggable-viewer-peak">0</span></p>
              <p>Live Viewers <span id="mifu-draggable-viewer-count">0</span></p>
              <p>Average Viewers <span id="mifu-draggable-viewer-average">0</span></p>
              <p data-pusher-connected="false">Sub Revenue <span id="mifu-draggable-sub-revenue">$0.00</span></p>
              <p data-pusher-connected="false">Total Patricks <span id="mifu-draggable-patrick-count">0</span></p>
              <p data-pusher-connected="false">Total Messages <span id="mifu-draggable-message-count">0</span></p>
              <p data-pusher-connected="false">Deleted Messages <span id="mifu-draggable-deleted-messages">0</span></p>
              <p data-pusher-connected="false">Unique Chatters <span id="mifu-draggable-unique-usernames">0</span></p>
              <p data-pusher-connected="false">Banned Chatters <span id="mifu-draggable-banned-users">0</span></p>
              <p data-pusher-connected="false">Timed Out Chatters <span id="mifu-draggable-timedout-users">0</span></p>
              <p data-pusher-notconnected="false">Connecting to Chat <span>Please Wait</span></p>
              <div class="trackingTime">KickAssist Channel Stats Tracking<br>Session Started: <span id="mifu-draggable-tracking-time">0s</span> ago</div>
              <input type="range" min="0.1" max="1.9" step="0.1" value="1" id="mifu-draggable-slider">
          `;
    // <p>Odds of Botting <span id="fake-viewers">Unsure</span></p>
    // <p>Possible Bots <span id="possible-bots">0</span></p>
  }

  getCss() {
    return /*CSS*/ `
              .mifu-draggable {
                  position: absolute;
                  cursor: grab;
                  border: none;
                  background-color: transparent;
                  margin: 0;
                  padding: 0;
                  z-index: 9999;
                  left: 0;
                  top: 50%;
                  transform: translate(-50%, -50%);
                  display: flex;
                  justify-content: center;
                  align-items: center;
              }
              .mifu-draggable #mifu-draggable-toggle-slider-button,
              .mifu-draggable #mifu-draggable-close-button {
                  position: absolute;
                  top: 5px;
                  width: 15px;
                  height: 15px;
                  border: none;
                  background-color: transparent;
                  color: white;
                  font-size: 20px;
                  cursor: pointer;
                  display: none;
                  justify-content: center;
                  align-items: center;
              }
              .mifu-draggable #mifu-draggable-toggle-slider-button {
                  left: 5px;
              }
              .mifu-draggable #mifu-draggable-close-button {
                  right: 5px;
              }
              .mifu-draggable:hover #mifu-draggable-toggle-slider-button,
              .mifu-draggable:hover #mifu-draggable-close-button {
                  display: flex;
              }
              .mifu-draggable .stats {
                  min-width: 275px;
                  max-width: fit-content;
                  margin: 0rem;
                  padding: .75rem;
                  padding-bottom: .25rem;
                  border-radius: .5rem;
                  background-color: rgba(0, 0, 0, 0.4);
                  overflow: hidden;
                  transform: scale(1);
              }
              .mifu-draggable h1 {
                  text-align: center;
                  padding-bottom: 0.5rem;
                  margin: 0 0 .5rem 0;
                  font-size: 1.5rem;
                  font-weight: 800;
                  line-height: 1.5rem;
                  text-transform: uppercase;
                  text-shadow: -1px 1px #000, -1px 1px 3px #000;
                  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
              }
              .mifu-draggable h2 {
                  text-align: center;
                  margin: .25rem 0 .5rem 0;
                  padding: 0;
                  font-size: 1.125rem;
                  font-weight: 700;
                  line-height: 1.25rem;
                  text-transform: uppercase;
                  text-shadow: -1px 1px 3px #000;
              }
              .mifu-draggable h3 {
                  text-align: center;
                  display: none;
                  margin: .25rem 0 .5rem 0;
                  padding: 0;
                  margin-top: 0.75rem;
                  font-size: 1.00125rem;
                  font-weight: 700;
                  line-height: 1.25rem;
                  text-transform: uppercase;
                  text-shadow: -1px 1px 3px #000;
              }
              .mifu-draggable p {
                  display: flex; /* flex */
                  margin: 0;
                  padding: 0;
                  padding-top: 0.35rem;
                  padding-bottom: 0.25rem;
                  border-top: 1px solid rgba(255, 255, 255, 0.15);
                  line-height: 1.5rem;
                  font-size: 1rem;
                  font-weight: 600;
                  text-shadow: -1px 1px 3px #000;
              }
              .mifu-draggable p[data-pusher-notconnected="true"],
              .mifu-draggable p[data-pusher-connected="false"] {
                  display: none;
              }
              .mifu-draggable p[data-pusher-notconnected="false"],
              .mifu-draggable p[data-pusher-connected="true"] {
                  display: flex;
              }
              .mifu-draggable p[data-pusher-notconnected="false"] {
                  font-size: 14px;
              }
              .mifu-draggable p span {
                  margin-left: auto;
                  font-weight: 600;
              }
              .mifu-draggable div .trackingTime {
                  text-align: center;
                  margin: 0 0 .25rem 0;
                  padding-top: .5rem;
                  font-size: 0.75rem;
                  line-height: 1rem;
                  font-weight: 100;
                  text-shadow: -1px 1px 2px #000;
                  border-top: 1px solid rgba(255, 255, 255, 0.15);
              }
              .mifu-draggable input {
                  display: none;
                  width: 100%;
              }
              .mifu-draggable .mifu-draggable-show-slider {
                  display: flex !important;
              }
          `
      .replace(/\s+/g, " ")
      .trim();
  }
}

class DefaultBadges {
  constructor() {
    this.badges = {};
    this.setBadges();
  }

  getBadge(type) {
    switch (type) {
      case "broadcaster":
        return this.svgToElm(this.badges.broadcasterSVG);
      case "founder":
        return this.svgToElm(this.badges.founderSVG);
      case "moderator":
        return this.svgToElm(this.badges.moderatorSVG);
      case "og":
        return this.svgToElm(this.badges.ogSVG);
      case "staff":
        return this.svgToElm(this.badges.staffSVG);
      case "sub_gifter_1":
        return this.svgToElm(this.badges.subGifter1SVG);
      case "sub_gifter_2":
        return this.svgToElm(this.badges.subGifter2SVG);
      case "sub_gifter_3":
        return this.svgToElm(this.badges.subGifter3SVG);
      case "sub_gifter_4":
        return this.svgToElm(this.badges.subGifter4SVG);
      case "sub_gifter_5":
        return this.svgToElm(this.badges.subGifter5SVG);
      case "subscriber":
        return this.svgToElm(this.badges.subscriberSVG);
      case "verified":
        return this.svgToElm(this.badges.verifiedSVG);
      case "vip":
        return this.svgToElm(this.badges.vipSVG);
      default:
        return null;
    }
  }

  svgToElm(svg) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(svg, "image/svg+xml");
    if (xmlDoc) {
      const element = xmlDoc.documentElement;
      if (element) {
        element.style.display = "inline";
        element.style.marginTop = "-4px";
        return element;
      }
    }
    return null;
  }

  setBadges() {
    this.badges.broadcasterSVG = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <g id="Badge_Chat_host">
                    <linearGradient id="badge-host-gradient-1" gradientUnits="userSpaceOnUse" x1="4" y1="180.5864" x2="4" y2="200.6666" gradientTransform="matrix(1 0 0 1 0 -182)">
                        <stop offset="0" style="stop-color:#FF1CD2;"></stop>
                        <stop offset="0.99" style="stop-color:#B20DFF;"></stop>
                    </linearGradient>
                    <rect x="3.2" y="9.6" style="fill:url(#badge-host-gradient-1);" width="1.6" height="1.6"></rect>
                    <linearGradient id="badge-host-gradient-2" gradientUnits="userSpaceOnUse" x1="8" y1="180.5864" x2="8" y2="200.6666" gradientTransform="matrix(1 0 0 1 0 -182)">
                        <stop offset="0" style="stop-color:#FF1CD2;"></stop>
                        <stop offset="0.99" style="stop-color:#B20DFF;"></stop>
                    </linearGradient>
                    <polygon style="fill:url(#badge-host-gradient-2);" points="6.4,9.6 9.6,9.6 9.6,8 11.2,8 
                    11.2,1.6 9.6,1.6 9.6,0 6.4,0 6.4,1.6 4.8,1.6 4.8,8 6.4,8 	"></polygon>
                    <linearGradient id="badge-host-gradient-3" gradientUnits="userSpaceOnUse" x1="2.4" y1="180.5864" x2="2.4" y2="200.6666" gradientTransform="matrix(1 0 0 1 0 -182)">
                        <stop offset="0" style="stop-color:#FF1CD2;"></stop>
                        <stop offset="0.99" style="stop-color:#B20DFF;"></stop>
                    </linearGradient>
                    <rect x="1.6" y="6.4" style="fill:url(#badge-host-gradient-3);" width="1.6" height="3.2"></rect>
                    <linearGradient id="badge-host-gradient-4" gradientUnits="userSpaceOnUse" x1="12" y1="180.5864" x2="12" y2="200.6666" gradientTransform="matrix(1 0 0 1 0 -182)">
                        <stop offset="0" style="stop-color:#FF1CD2;"></stop>
                        <stop offset="0.99" style="stop-color:#B20DFF;"></stop>
                    </linearGradient>
                    <rect x="11.2" y="9.6" style="fill:url(#badge-host-gradient-4);" width="1.6" height="1.6"></rect>
                    <linearGradient id="badge-host-gradient-5" gradientUnits="userSpaceOnUse" x1="8" y1="180.5864" x2="8" y2="200.6666" gradientTransform="matrix(1 0 0 1 0 -182)">
                        <stop offset="0" style="stop-color:#FF1CD2;"></stop>
                        <stop offset="0.99" style="stop-color:#B20DFF;"></stop>
                    </linearGradient>
                    <polygon style="fill:url(#badge-host-gradient-5);" points="4.8,12.8 6.4,12.8 6.4,14.4 
                    4.8,14.4 4.8,16 11.2,16 11.2,14.4 9.6,14.4 9.6,12.8 11.2,12.8 11.2,11.2 4.8,11.2 	"></polygon>
                    <linearGradient id="badge-host-gradient-6" gradientUnits="userSpaceOnUse" x1="13.6" y1="180.5864" x2="13.6" y2="200.6666" gradientTransform="matrix(1 0 0 1 0 -182)">
                        <stop offset="0" style="stop-color:#FF1CD2;"></stop>
                        <stop offset="0.99" style="stop-color:#B20DFF;"></stop>
                    </linearGradient>
                    <rect x="12.8" y="6.4" style="fill:url(#badge-host-gradient-6);" width="1.6" height="3.2"></rect>
                </g>
            </svg>`;

    this.badges.founderSVG = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <linearGradient id="badge-founder-gradient" gradientUnits="userSpaceOnUse" x1="7.874" y1="20.2333" x2="8.1274" y2="-0.3467" gradientTransform="matrix(1 0 0 -1 0 18)">
                    <stop offset="0" style="stop-color: rgb(255, 201, 0);"></stop>
                    <stop offset="0.99" style="stop-color: rgb(255, 149, 0);"></stop>
                </linearGradient>
                <path d="
                M14.6,4V2.7h-1.3V1.4H12V0H4v1.4H2.7v1.3H1.3V4H0v8h1.3v1.3h1.4v1.3H4V16h8v-1.4h1.3v-1.3h1.3V12H16V4H14.6z M9.9,12.9H6.7V6.4H4.5
                V5.2h1V4.1h1v-1h3.4V12.9z" style="fill-rule: evenodd; clip-rule: evenodd; fill: url(&quot;#badge-founder-gradient&quot;);"></path>
            </svg>`;

    this.badges.moderatorSVG = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11.7,1.3v1.5h-1.5v1.5
                H8.7v1.5H7.3v1.5H5.8V5.8h-3v3h1.5v1.5H2.8v1.5H1.3v3h3v-1.5h1.5v-1.5h1.5v1.5h3v-3H8.7V8.7h1.5V7.3h1.5V5.8h1.5V4.3h1.5v-3
                C14.7,1.3,11.7,1.3,11.7,1.3z" style="fill: rgb(0, 199, 255);"></path>
            </svg>`;

    this.badges.ogSVG = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <g>
                    <linearGradient id="badge-og-gradient-1" gradientUnits="userSpaceOnUse" x1="12.2" y1="-180" x2="12.2" y2="-165.2556" gradientTransform="matrix(1 0 0 -1 0 -164)">
                        <stop offset="0" style="stop-color:#00FFF2;"></stop>
                        <stop offset="0.99" style="stop-color:#006399;"></stop>
                    </linearGradient>
                    <path style="fill:url(#badge-og-gradient-1);" d="M16,16H9.2v-0.8H8.4v-8h0.8V6.4H16v3.2h-4.5v4.8H13v-1.6h-0.8v-1.6H16V16z"></path>
                    <linearGradient id="badge-og-gradient-2" gradientUnits="userSpaceOnUse" x1="3.7636" y1="-164.265" x2="4.0623" y2="-179.9352" gradientTransform="matrix(1 0 0 -1 0 -164)">
                        <stop offset="0" style="stop-color:#00FFF2;"></stop>
                        <stop offset="0.99" style="stop-color:#006399;"></stop>
                    </linearGradient>
                    <path style="fill:url(#badge-og-gradient-2);" d="M6.8,8.8v0.8h-6V8.8H0v-8h0.8V0h6.1v0.8
                    h0.8v8H6.8z M4.5,6.4V1.6H3v4.8H4.5z"></path>
                    <path style="fill:#00FFF2;" d="M6.8,15.2V16h-6v-0.8H0V8.8h0.8V8h6.1v0.8h0.8v6.4C7.7,15.2,6.8,15.2,6.8,15.2z M4.5,14.4V9.6H3v4.8
                    C3,14.4,4.5,14.4,4.5,14.4z"></path>
                    <path style="fill:#00FFF2;" d="M16,8H9.2V7.2H8.4V0.8h0.8V0H16v1.6h-4.5v4.8H13V4.8h-0.8V3.2H16V8z"></path>
                </g>
            </svg>`;

    this.badges.staffSVG = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M2.07324 1.33331H6.51991V4.29331H7.99991V2.81331H9.47991V1.33331H13.9266V5.77998H12.4466V7.25998H10.9599V8.73998H12.4466V10.22H13.9266V14.6666H9.47991V13.1866H7.99991V11.7066H6.51991V14.6666H2.07324V1.33331Z" fill="url(#badge-verified-gradient)"></path>
                <defs>
                    <linearGradient id="badge-verified-gradient" x1="33.791%" y1="97.416%" x2="65.541%" y2="4.5%" gradientUnits="objectBoundingBox">
                        <stop stop-color="#1EFF00"></stop>
                        <stop offset="0.99" stop-color="#00FF8C"></stop>
                    </linearGradient>
                </defs>
            </svg>`;

    // 1+ blue
    this.badges.subGifter1SVG = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <g clip-path="url(#clip0_301_17810)">
                    <path d="M7.99999 9.14999V6.62499L0.484985 3.35999V6.34499L1.15499 6.63499V12.73L7.99999 15.995V9.14999Z" fill="#0269D4"></path>
                    <path d="M8.00003 10.735V9.61501L1.15503 6.63501V7.70501L8.00003 10.735Z" fill="#0269D4"></path>
                    <path d="M15.515 3.355V6.345L14.85 6.64V12.73L12.705 13.755L11.185 14.48L8.00499 15.995V6.715L4.81999 5.295H4.81499L3.29499 4.61L0.484985 3.355L3.66999 1.935L3.67999 1.93L5.09499 1.3L8.00499 0L10.905 1.3L12.32 1.925L12.33 1.935L15.515 3.355Z" fill="#04D0FF"></path>
                    <path d="M14.845 6.63501V7.70501L8 10.735V9.61501L14.845 6.63501Z" fill="#0269D4"></path>
                </g>
                <defs>
                    <clipPath id="clip0_301_17810">
                        <rect width="16" height="16" fill="white"></rect>
                    </clipPath>
                </defs>
            </svg>`;

    // 20+ purple
    this.badges.subGifter2SVG = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <g clip-path="url(#clip0_301_17815)">
                    <path d="M8.02501 9.14999V6.62499L0.51001 3.35999V6.34499L1.17501 6.63499V12.73L8.02501 15.995V9.14999Z" fill="#7B1BAB"></path>
                    <path d="M8.02505 10.735V9.61501L1.17505 6.63501V7.70501L8.02505 10.735Z" fill="#7B1BAB"></path>
                    <path d="M15.535 3.355V6.345L14.87 6.64V12.73L12.725 13.755L11.21 14.48L8.02501 15.995V6.715L4.84001 5.295H4.83501L3.32001 4.61L0.51001 3.355L3.69001 1.935L3.70501 1.93L5.11501 1.3L8.02501 0L10.93 1.3L12.34 1.925L12.355 1.935L15.535 3.355Z" fill="#A947D3"></path>
                    <path d="M14.87 6.63501V7.70501L8.02502 10.735V9.61501L14.87 6.63501Z" fill="#7B1BAB"></path>
                </g>
                <defs>
                    <clipPath id="clip0_301_17815">
                        <rect width="16" height="16" fill="white"></rect>
                    </clipPath>
                </defs>
            </svg>`;

    // 50+ red
    this.badges.subGifter3SVG = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <g clip-path="url(#clip0_301_17820)">
                    <path d="M7.99999 9.14999V6.62499L0.484985 3.35999V6.34499L1.14999 6.63999V12.73L7.99999 16V9.14999Z" fill="#CF0038"></path>
                    <path d="M8.00002 10.74V9.61501L1.15002 6.64001V7.71001L8.00002 10.74Z" fill="#CF0038"></path>
                    <path d="M15.515 3.355V6.345L14.85 6.64V12.73L12.705 13.755L11.185 14.48L8.00499 15.995V6.715L4.81999 5.295H4.81499L3.29499 4.61L0.484985 3.355L3.66999 1.935L3.67999 1.93L5.09499 1.3L8.00499 0L10.905 1.3L12.32 1.925L12.33 1.935L15.515 3.355Z" fill="#FA4E78"></path>
                    <path d="M14.85 6.64001V7.71001L8 10.74V9.61501L14.85 6.64001Z" fill="#CF0038"></path>
                </g>
                <defs>
                    <clipPath id="clip0_301_17820">
                        <rect width="16" height="16" fill="white"></rect>
                    </clipPath>
                </defs>
            </svg>`;

    // 100+ yellow
    this.badges.subGifter4SVG = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <g clip-path="url(#clip0_301_17825)">
                    <path d="M7.99999 9.14999V6.62499L0.484985 3.35999V6.34499L1.14999 6.63999V12.73L7.99999 16V9.14999Z" fill="#FF5008"></path>
                    <path d="M8.00002 10.74V9.61501L1.15002 6.64001V7.71001L8.00002 10.74Z" fill="#FF5008"></path>
                    <path d="M15.515 3.355V6.345L14.85 6.64V12.73L12.705 13.755L11.185 14.48L8.00499 15.995V6.715L4.81999 5.295H4.81499L3.29499 4.61L0.484985 3.355L3.66999 1.935L3.67999 1.93L5.09499 1.3L8.00499 0L10.905 1.3L12.32 1.925L12.33 1.935L15.515 3.355Z" fill="#FFC800"></path>
                    <path d="M14.85 6.64001V7.71001L8 10.74V9.61501L14.85 6.64001Z" fill="#FF5008"></path>
                </g>
                <defs>
                    <clipPath id="clip0_301_17825">
                        <rect width="16" height="16" fill="white"></rect>
                    </clipPath>
                </defs>
            </svg>`;

    // 200+ green
    this.badges.subGifter5SVG = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <g clip-path="url(#clip0_301_17830)">
                    <path d="M7.99999 9.14999V6.62499L0.484985 3.35999V6.34499L1.14999 6.63999V12.73L7.99999 16V9.14999Z" fill="#2FA604"></path>
                    <path d="M8.00002 10.74V9.61501L1.15002 6.64001V7.71001L8.00002 10.74Z" fill="#2FA604"></path>
                    <path d="M15.515 3.355V6.345L14.85 6.64V12.73L12.705 13.755L11.185 14.48L8.00499 15.995V6.715L4.81999 5.295H4.81499L3.29499 4.61L0.484985 3.355L3.66999 1.935L3.67999 1.93L5.09499 1.3L8.00499 0L10.905 1.3L12.32 1.925L12.33 1.935L15.515 3.355Z" fill="#53F918"></path>
                    <path d="M14.85 6.64001V7.71001L8 10.74V9.61501L14.85 6.64001Z" fill="#2FA604"></path>
                </g>
                <defs>
                    <clipPath id="clip0_301_17830">
                        <rect width="16" height="16" fill="white"></rect>
                    </clipPath>
                </defs>
            </svg>`;

    this.badges.subscriberSVG = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <g>
                    <linearGradient id="badge-subscriber-gradient-1" gradientUnits="userSpaceOnUse" x1="-2.386" y1="-151.2764" x2="42.2073" y2="-240.4697" gradientTransform="matrix(1 0 0 -1 0 -164)">
                        <stop offset="0" style="stop-color:#E1FF00;"></stop>
                        <stop offset="0.99" style="stop-color:#2AA300;"></stop>
                    </linearGradient>
                    <path style="fill:url(#badge-subscriber-gradient-1);" d="M14.8,7.3V6.1h-2.4V4.9H11V3.7H9.9V1.2H8.7V0H7.3v1.2H6.1v2.5H5v1.2H3.7v1.3H1.2v1.2H0v1.4 h1.2V10h2.4v1.3H5v1.2h1.2V15h1.2v1h1.3v-1.2h1.2v-2.5H11v-1.2h1.3V9.9h2.4V8.7H16V7.3H14.8z"></path>
                    <linearGradient id="badge-subscriber-gradient-2" gradientUnits="userSpaceOnUse" x1="-5.3836" y1="-158.3055" x2="14.9276" y2="-189.0962" gradientTransform="matrix(1 0 0 -1 0 -164)">
                        <stop offset="0" style="stop-color:#E1FF00;"></stop>
                        <stop offset="0.99" style="stop-color:#2AA300;"></stop>
                    </linearGradient>
                    <path style="fill:url(#badge-subscriber-gradient-2);" d="M7.3,7.3v7.5H6.1v-2.5H5v-1.2H3.7V9.9H1.2 V8.7H0V7.3H7.3z"></path>
                    <linearGradient id="badge-subscriber-gradient-3" gradientUnits="userSpaceOnUse" x1="3.65" y1="-160.7004" x2="3.65" y2="-184.1244" gradientTransform="matrix(1 0 0 -1 0 -164)">
                        <stop offset="0" style="stop-color:#E1FF00;"></stop>
                        <stop offset="0.99" style="stop-color:#2AA300;"></stop>
                    </linearGradient>
                    <path style="fill:url(#badge-subscriber-gradient-3);" d="M7.3,7.3v7.5H6.1v-2.5H5v-1.2H3.7V9.9H1.2 V8.7H0V7.3H7.3z"></path>
                    <linearGradient id="badge-subscriber-gradient-4" gradientUnits="userSpaceOnUse" x1="22.9659" y1="-167.65" x2="-5.3142" y2="-167.65" gradientTransform="matrix(1 0 0 -1 0 -164)">
                        <stop offset="0" style="stop-color:#E1FF00;"></stop>
                        <stop offset="0.99" style="stop-color:#2AA300;"></stop>
                    </linearGradient>
                    <path style="fill:url(#badge-subscriber-gradient-4);" d="M8.7,0v7.3H1.2V6.1h2.4V4.9H5V3.7h1.2V1.2 h1.2V0H8.7z"></path>
                    <linearGradient id="badge-subscriber-gradient-5" gradientUnits="userSpaceOnUse" x1="12.35" y1="-187.6089" x2="12.35" y2="-161.5965" gradientTransform="matrix(1 0 0 -1 0 -164)">
                        <stop offset="0" style="stop-color:#E1FF00;"></stop>
                        <stop offset="0.99" style="stop-color:#2AA300;"></stop>
                    </linearGradient>
                    <path style="fill:url(#badge-subscriber-gradient-5);" d="M8.7,8.7V1.2h1.2v2.5H11v1.2h1.3v1.3h2.4 v1.2H16v1.4L8.7,8.7L8.7,8.7z"></path>
                    <linearGradient id="badge-subscriber-gradient-6" gradientUnits="userSpaceOnUse" x1="-6.5494" y1="-176.35" x2="21.3285" y2="-176.35" gradientTransform="matrix(1 0 0 -1 0 -164)">
                        <stop offset="0" style="stop-color:#E1FF00;"></stop>
                        <stop offset="0.99" style="stop-color:#2AA300;"></stop>
                    </linearGradient>
                    <path style="fill:url(#badge-subscriber-gradient-6);" d="M7.3,16V8.7h7.4v1.2h-2.4v1.3H11v1.2H9.9 v2.5H8.7V16H7.3z"></path>
                    <linearGradient id="badge-subscriber-gradient-7" gradientUnits="userSpaceOnUse" x1="6.72" y1="-169.44" x2="12.2267" y2="-180.4533" gradientTransform="matrix(1 0 0 -1 0 -164)">
                        <stop offset="0" style="stop-color:#E1FF00;"></stop>
                        <stop offset="0.99" style="stop-color:#2AA300;"></stop>
                    </linearGradient>
                    <path style="fill:url(#badge-subscriber-gradient-7);" d="M8.7,7.3H7.3v1.4h1.3L8.7,7.3L8.7,7.3z"></path>
                </g>
            </svg>`;

    this.badges.verifiedSVG = `<svg data-v-e4d376bf="" width="16" height="16" viewBox="0 0 16 16" class="fill-current text-primary" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 6.83512L13.735 4.93512L13.22 2.02512H10.265L8 0.120117L5.735 2.02012H2.78L2.265 4.93012L0 6.83512L1.48 9.39512L0.965 12.3051L3.745 13.3151L5.225 15.8751L8.005 14.8651L10.785 15.8751L12.265 13.3151L15.045 12.3051L14.53 9.39512L16.01 6.83512H16ZM6.495 12.4051L2.79 8.69512L4.205 7.28012L6.495 9.57512L11.29 4.78012L12.705 6.19512L6.5 12.4001L6.495 12.4051Z"></path>
        </svg>`;

    this.badges.vipSVG = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <linearGradient id="badge-vip-gradient" gradientUnits="userSpaceOnUse" x1="8" y1="-163.4867" x2="8" y2="-181.56" gradientTransform="matrix(1 0 0 -1 0 -164)">
                    <stop offset="0" style="stop-color: rgb(255, 201, 0);"></stop>
                    <stop offset="0.99" style="stop-color: rgb(255, 149, 0);"></stop>
                </linearGradient>
                <path d="M13.9,2.4v1.1h-1.2v2.3 h-1.1v1.1h-1.1V4.6H9.3V1.3H6.7v3.3H5.6v2.3H4.4V5.8H3.3V3.5H2.1V2.4H0v12.3h16V2.4H13.9z" style="fill: url(&quot;#badge-vip-gradient&quot;);"></path>
            </svg>`;
  }
}

class CustomContainer {
  constructor(containerID) {
    const idPrefix = "mifu-custom-container-";
    this.containerID = idPrefix + containerID;
    this.setDefault();
    this.doBinding();
    this.makeElms();
  }

  debug(message, obj = null) {
    if (!this.debugMode) return;
    const prefix = "KickAssist -> Custom Container";
    if (obj) {
      console.log(`${prefix} | ${message}`, obj);
    } else {
      console.log(`${prefix} | ${message}`);
    }
  }

  doBinding() {
    this.mouseDown = this.onMouseDown.bind(this);
    this.mouseMove = this.onMouseMove.bind(this);
    this.mouseUp = this.onMouseUp.bind(this);
    this.debug("Function Binding Done!");
  }

  setDefault() {
    this.intervals = [];
    this.debugMode = false;
    this.isResizing = false;
    this.isDragging = false;
    this.offsets = { x: 0, y: 0 };
    this.lastPos = { x: 0, y: 0 };
    this.lastSize = { width: 0, height: 0 };
    this.debug("Deafult Variables Set!");
  }

  makeElms() {
    this.makeStyle();
    this.makeElement();
    this.makeResizeButton();
    this.debug("Elements Created!");
  }

  //NOTE - external setters

  setContainer(container, useParent) {
    this.container = container;
    this.useParent = useParent;
    this.debug("Container Set:", this.container);
    this.debug("Use Parent:", this.useParent);
  }

  setInitialSize(width, height) {
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
    this.debug("Element Size Set: ", { width, height });
  }

  setInitialPosition(left, top) {
    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
    this.debug("Element Position Set: ", { left, top });
  }

  setInternalContent(internalElement) {
    this.internalElement = internalElement;
    this.element.innerHTML = "";
    this.element.appendChild(internalElement);
    this.element.appendChild(this.resizeButton);
    this.debug("Internal Content Set:", this.internalElement);
  }

  //NOTE - external calls

  insert() {
    if (!this.container) return;
    this.remove();

    const containerParent = this.container.parentElement;
    const loc = this.useParent ? containerParent : this.container;

    if (loc) {
      document.head.appendChild(this.style);
      loc.appendChild(this.element);
      this.addListeners();
      this.addIntervals();
      this.debug("Elements Inserted!");
    } else {
      this.debug("Element Insert Location Not Found!");
    }
  }

  remove() {
    this.removeIntervals();

    const style = document.getElementById(this.getStyleId());
    const elm = document.getElementById(this.getElementId());

    if (style) style.parentNode.removeChild(style);
    if (elm) elm.parentNode.removeChild(elm);
    this.debug("Elements Removed!");
  }

  //NOTE - timed events

  addIntervals() {
    this.removeIntervals();

    this.fasterClock = setInterval(() => {
      this.preventLostLocation();
    }, 250);
    this.intervals.push(this.fasterClock);
  }

  removeIntervals() {
    if (this.intervals.length !== 0) {
      this.intervals.forEach((interval) => {
        clearInterval(interval);
      });
      this.intervals = [];
    }
  }

  //NOTE - element ids

  getElementId() {
    return `${this.containerID}-elm`;
  }
  getStyleId() {
    return `${this.containerID}-style`;
  }

  //NOTE - internal construction

  makeElement() {
    this.element = document.createElement("div");
    this.element.draggable = true;
    this.element.id = this.getElementId();
    this.debug("Element Created:", this.element);
  }

  makeStyle() {
    this.style = document.createElement("style");
    this.style.id = this.getStyleId();
    this.style.innerHTML = this.getCss();
    this.debug("Style Created:", this.style);
  }

  makeResizeButton() {
    this.resizeButton = document.createElement("div");
    this.resizeButton.className = "resize-handle";
    this.element.appendChild(this.resizeButton);
    this.debug("Resize Button Created:", this.resizeButton);
  }

  //NOTE - internal listeners

  addListeners() {
    if (!this.element) return;
    this.element.removeEventListener("mousedown", this.mouseDown);
    this.element.addEventListener("mousedown", this.mouseDown);
    this.debug("Event Listeners Added!");
  }

  //NOTE - mouse events

  onMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();

    const targetClass = event.target.className;
    const resizeClass = this.resizeButton.className;

    this.updateLastPos(event);
    this.updateOffsets(event);

    this.lastSize.width = this.element.offsetWidth;
    this.lastSize.height = this.element.offsetHeight;

    if (targetClass === resizeClass) {
      this.isResizing = true;
    } else {
      this.isDragging = true;
    }

    window.addEventListener("mousemove", this.mouseMove);
    window.addEventListener("mouseup", this.mouseUp);
  }

  onMouseMove(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.isDragging) this.doDragging(event);
    if (this.isResizing) this.doResizing(event);
  }

  onMouseUp(event) {
    this.isDragging = false;
    this.isResizing = false;

    window.removeEventListener("mousemove", this.mouseMove);
    window.removeEventListener("mouseup", this.mouseUp);
  }

  //NOTE - dragging & resizing

  doDragging(event) {
    const newPosX = event.clientX - this.offsets.x;
    const newPosY = event.clientY - this.offsets.y;

    this.element.style.left = `${newPosX}px`;
    this.element.style.top = `${newPosY}px`;

    window.getSelection().removeAllRanges();

    this.updateLastPos(event);
    this.updateOffsets(event);
  }

  doResizing(event) {
    const offsetX = event.clientX - this.lastPos.x;
    const offsetY = event.clientY - this.lastPos.y;

    const newWidth = this.lastSize.width + offsetX;
    const newHeight = this.lastSize.height + offsetY;

    this.element.style.width = `${newWidth}px`;
    this.element.style.height = `${newHeight}px`;
  }

  //NOTE - update pos & offsets

  updateLastPos(event) {
    this.lastPos.x = event.clientX;
    this.lastPos.y = event.clientY;
  }

  updateOffsets(event) {
    const elmRect = this.element.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();

    this.offsets.x = event.clientX - (elmRect.left - containerRect.left);
    this.offsets.y = event.clientY - (elmRect.top - containerRect.top);
  }

  //NOTE - helpers

  preventLostLocation() {
    if (this.isResizing || this.isDragging) return;

    const tooTall = this.element.offsetHeight > this.container.offsetHeight;
    const tooWide = this.element.offsetWidth > this.container.offsetWidth;

    if (tooTall || tooWide) {
      this.preventTooLarge(tooTall, tooWide);
      return;
    }

    const elmRect = this.element.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();

    const elmWidth = this.element.offsetWidth;
    const elmHeight = this.element.offsetHeight;

    const outTop = elmRect.top < containerRect.top;
    const outLeft = elmRect.left < containerRect.left;
    const outRight = elmRect.right > containerRect.right;
    const outBottom = elmRect.bottom > containerRect.bottom;

    if (outLeft) this.element.style.left = `0px`;
    if (outTop) this.element.style.top = `0px`;

    if (outRight)
      this.element.style.left = `${containerRect.width - elmWidth}px`;
    if (outBottom)
      this.element.style.top = `${containerRect.height - elmHeight}px`;
  }

  preventTooLarge(tooTall, tooWide) {
    const newHeight = this.container.offsetHeight;
    const newWidth = this.container.offsetWidth;

    if (tooTall) this.element.style.height = `${newHeight}px`;
    if (tooWide) this.element.style.width = `${newWidth}px`;
  }

  //NOTE - css

  getCss() {
    return /*CSS*/ `
    
                #${this.getElementId()} {
                    display: flex;
                    position: absolute;
                    z-index: 99999;
                    margin: 0;
                    font-size: 1rem;
                    left: 0;
                    top: 0;
                    cursor: grab;
                    overflow: hidden;
                    background-color: transparent;
                    outline: 0px solid transparent;
                    border-radius: .5rem;
                    min-width: 200px;
                    min-height: 100px;
                }
    
                #${this.getElementId()}:hover {
                    outline: 2px solid #00E70088;
                    border-radius: .5rem;
                    border-bottom-right-radius: 0px;
                }
    
                #${this.getElementId()} .resize-handle {
                    position: absolute;
                    cursor: nwse-resize;
                    display: none;
                    right: 0;
                    bottom: 0;
                    width: 1rem;
                    height: 1rem;
                    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100"><polygon points="0,100 100,100 100,0" fill="white" /></svg>');
                }
    
                #${this.getElementId()}:hover .resize-handle {
                    display: block;
                }
            
            `
      .replace(/\s+/g, " ")
      .trim();
  }
}

class ChatOverlay extends Setting {
  constructor(settings) {
    const name = "Chat Overlay";
    const type = 1; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = false; // Enabled State

    super(settings, name, type, state);

    //NOTE - custom

    this.setDefaults();
    this.bindFunctions();
  }

  async onSave() {
    if (this.getState()) {
      this.startOverlay();
    } else {
      this.stopOverlay();
    }
  }

  async onStart() {
    if (this.getState()) {
      this.initStart = setTimeout(() => this.startOverlay(), 1000);
    } else {
      this.stopOverlay();
    }
  }

  async onStop() {
    this.stopOverlay();
  }

  //NOTE - defaults

  setDefaults() {
    this.containerID = "mifu-chat-overlay";

    this.retry = null;
    this.initStart = null;

    this.isScrolling = false;

    this.defaultBadges = new DefaultBadges();
    this.customContainer = new CustomContainer("chat-overlay");
  }

  bindFunctions() {
    this.mouseLeave = this.onMouseLeave.bind(this);
    this.mouseScroll = this.onMouseScroll.bind(this);
    this.handleGearClick = this.onGearClick.bind(this);
  }

  //NOTE - custom

  async startOverlay() {
    if (this.getState()) {
      await this.loadSubBadges();

      this.makeElements();
      this.addListeners();

      this.addOverlay();

      this.togglePusher(true);
    }
  }

  stopOverlay() {
    clearTimeout(this.retry);
    clearTimeout(this.initStart);
    clearTimeout(this.scrollTimer);
    this.togglePusher(false);
    this.isScrolling = false;
    this.removeElements();
  }

  //NOTE - badges

  async loadSubBadges() {
    this.subBadges = await this.getChannelData().getSubBadges(
      this.getChannelName()
    );
  }

  getClosestSubBadge(totalMonths, closestBadge = null) {
    this.subBadges.forEach((badgeData) => {
      if (
        badgeData.months <= totalMonths &&
        (!closestBadge || badgeData.months > closestBadge.months)
      ) {
        closestBadge = badgeData;
      }
    });
    return closestBadge ? closestBadge.badge_image.src : null;
  }

  //NOTE - getters

  getElementId() {
    return `${this.containerID}-elm`;
  }
  getStyleId() {
    return `${this.containerID}-style`;
  }

  getChannelName() {
    return this.getMiFu().channelName;
  }
  getChannelData() {
    return this.getMain().channelData;
  }

  getVideo() {
    const video = document.getElementById("mifu-player-check");
    return video ? video : null;
  }

  getVideoRect() {
    const video = this.getVideo();
    return video ? video.getBoundingClientRect() : null;
  }

  //NOTE - construction

  makeElements() {
    this.removeElements();

    this.style = document.createElement("style");
    this.style.id = this.getStyleId();
    this.style.innerHTML = this.getCss();

    this.element = document.createElement("div");
    this.element.id = this.getElementId();

    this.messageList = document.createElement("div");
    this.messageList.id = "chat-message-list";

    this.overlaySettings = document.createElement("div");
    this.overlaySettings.id = "overlay-settings-container";

    this.element.appendChild(this.overlaySettings);
    this.element.appendChild(this.messageList);
  }

  removeElements() {
    const style = document.getElementById(this.getStyleId());
    if (style) style.parentNode.removeChild(style);

    const list = document.getElementById("chat-message-list");
    if (list) list.parentNode.removeChild(list);

    const elm = document.getElementById(this.getElementId());
    if (elm) elm.parentNode.removeChild(elm);

    this.customContainer.remove();
  }

  //NOTE - listeners

  addListeners() {
    const gearIcon = document.getElementById("overlay-gear-icon");
    if (gearIcon) gearIcon.removeEventListener("click", this.handleGearClick);

    this.messageList.removeEventListener("scroll", this.mouseScroll);
    this.messageList.addEventListener("scroll", this.mouseScroll);

    this.element.removeEventListener("mouseleave", this.mouseLeave);
    this.element.addEventListener("mouseleave", this.mouseLeave);
  }

  onMouseScroll(event) {
    const scrollTop = this.messageList.scrollTop;
    const elmHeight = this.messageList.clientHeight;
    const scrollHeight = this.messageList.scrollHeight;
    this.isScrolling = !(Math.abs(scrollHeight - scrollTop - elmHeight) <= 1);
  }

  onMouseLeave(event) {
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      this.isScrolling = false;
    }, 1000);
  }

  onGearClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.overlaySettings) return;

    // const isShowing = this.overlaySettings.style.display === 'block';
    // this.overlaySettings.style.display = isShowing ? 'none' : 'block';
    // this.messageList.style.display = isShowing ? 'block' : 'none';
    this.onToggleSettings();
  }

  onToggleSettings() {
    const isShowing = this.overlaySettings.style.display === "block";
    this.overlaySettings.style.display = isShowing ? "none" : "block";
    this.messageList.style.display = isShowing ? "block" : "none";
  }

  //NOTE - overlay

  addOverlay() {
    const streamVideoPlayer = this.getVideo();

    if (streamVideoPlayer) {
      document.head.appendChild(this.style);
      this.configureContainer(streamVideoPlayer);
      this.addContainerElements();
      this.insertContainer();
    } else {
      this.retry = setTimeout(() => {
        this.addOverlay();
      }, 1000);
    }
  }

  configureContainer(containerElement) {
    const initSize = { width: 330, height: 488 };
    const tempY = containerElement.offsetHeight / 2 - initSize.height / 2;
    const initPos = { left: 0, top: tempY };
    this.customContainer.setContainer(containerElement, true);
    this.customContainer.setInitialSize(initSize.width, initSize.height);
    this.customContainer.setInitialPosition(initPos.left, initPos.top);
  }

  addContainerElements() {
    this.element.appendChild(this.getGearIcon());
    this.addSettingsElement();
  }

  addSettingsElement() {
    const buttons = [
      { label: "Toggle Background", action: "toggleBackground" },
      { label: "Close Settings", action: "closeSettings" },
      { label: "Close Chat", action: "closeChat" },
    ];

    buttons.forEach((button, index) => {
      const buttonEl = document.createElement("button");
      buttonEl.textContent = button.label;
      buttonEl.id = "overlay-settings-button";

      buttonEl.addEventListener("click", () => {
        switch (button.action) {
          case "toggleBackground":
            this.element.classList.toggle("background");
            break;
          case "closeChat":
            this.setState(false);
            break;
          case "closeSettings":
            this.onToggleSettings();
            break;
          default:
            break;
        }
      });

      this.overlaySettings.appendChild(buttonEl);
    });
  }

  insertContainer() {
    this.customContainer.setInternalContent(this.element);
    this.customContainer.insert();
  }

  //NOTE - pusher handler

  onPusherChatMessage(event) {
    const eventData = JSON.parse(event.data);
    const messageSender = eventData.sender.username.toLowerCase();

    const kickBots = ["botrix", "kickbot", "kicklet"];
    if (kickBots.includes(messageSender)) return;

    this.addMessageToOverlay(eventData);
  }

  addMessageToOverlay(eventData) {
    if (!this.messageList) return;

    const chatMessageElement = this.buildChatMessageElement();

    const badgesElement = this.buildBadgesElement(eventData);
    const usernameElement = this.buildUsernameElement(eventData);
    const messageElement = this.buildMessageElement(eventData);
    const replyElement = this.buildMessageReplyElement(eventData);

    if (replyElement) chatMessageElement.appendChild(replyElement);

    chatMessageElement.appendChild(badgesElement);
    chatMessageElement.appendChild(usernameElement);
    chatMessageElement.appendChild(this.buildSplitterElement());
    chatMessageElement.appendChild(messageElement);

    // const antiSpam = usernameElement.innerHTML + messageElement.innerHTML;
    // if (this.lastElement && this.lastElement === antiSpam) { return; }
    // else { this.lastElement = antiSpam; }

    this.messageList.appendChild(chatMessageElement);

    if (this.isScrolling) return;

    while (this.messageList.children.length > 250) {
      this.messageList.removeChild(this.messageList.firstElementChild);
    }
    this.messageList.scrollTop = this.messageList.scrollHeight;
  }

  //NOTE - build chat elements

  buildChatMessageElement() {
    const div = document.createElement("div");
    div.id = "overlay-chat-message";
    div.style.textShadow = this.getTextShadow();

    return div;
  }

  buildBadgesElement(eventData) {
    const div = document.createElement("div");
    div.id = "overlay-badge-container";

    eventData.sender.identity.badges.forEach((badge) => {
      const span = document.createElement("span");
      span.id = "overlay-badge";
      span.style.filter = this.getDropShadow();

      if (badge.type === "subscriber" && badge.count) {
        const imgSrc = this.getClosestSubBadge(badge.count);
        if (imgSrc) {
          const img = document.createElement("img");
          img.id = "overlay-badge-img";
          img.src = imgSrc;
          span.appendChild(img);
        } else {
          span.appendChild(this.defaultBadges.getBadge(badge.type));
        }
      } else if (badge.type === "sub_gifter" && badge.count) {
        const badgeType = this.formatGiftedString(badge.count);
        span.appendChild(this.defaultBadges.getBadge(badgeType));
      } else {
        const otherBadges = this.defaultBadges.getBadge(badge.type);
        if (otherBadges) {
          span.appendChild(otherBadges);
        } else {
          span.textContent = badge.type;
        }
      }

      div.appendChild(span);
    });

    return div;
  }

  buildUsernameElement(eventData) {
    const div = document.createElement("div");
    div.id = "overlay-username";
    div.textContent = eventData.sender.username;
    div.style.color = eventData.sender.identity.color;

    return div;
  }

  buildSplitterElement() {
    const div = document.createElement("div");
    div.id = "overlay-splitter";
    div.textContent = ":";

    return div;
  }

  buildMessageElement(eventData) {
    const messageContent = eventData.content;
    const linksInMessage = this.formateMessageLinks(messageContent);
    const formattedMessage = this.formatMessageEmotes(linksInMessage);

    const div = document.createElement("div");
    div.id = "overlay-message-content";
    div.innerHTML = formattedMessage;

    return div;
  }

  buildMessageReplyElement(eventData) {
    if (eventData.type === "reply") {
      const sender = eventData.metadata.original_sender.username;
      const messageContent = eventData.metadata.original_message.content;
      const linksInMessage = this.formateMessageLinks(messageContent);
      const formattedMessage = this.formatMessageEmotes(linksInMessage, true);
      const prefix = `Replying to @${sender}`;

      const div = document.createElement("div");
      div.id = "overlay-reply-content";
      div.style.textShadow = this.getTextShadow(true);
      div.innerHTML = `${this.getReplyIcon() + prefix}: ${formattedMessage}`;

      return div;
    } else {
      return null;
    }
  }

  //NOTE - format message elements

  formateMessageLinks(message) {
    return message.replace(
      /(\b(?:https?):\/\/[^\s/$.?#].[^\s]*)/gi,
      '<a href="$1" id="overlay-link" target="_blank">$1</a>'
    );
  }

  formatMessageEmotes(message, isReply = false) {
    const emoteRegex = /\[emote:(\d+)(?::(\w+(?:-\w+)?))?(?::(.*?))?\]/g;
    if (!emoteRegex.test(message)) return message;

    return message.replace(emoteRegex, (match, num) => {
      const imgSrc = `https://files.kick.com/emotes/${num}/fullsize`;

      const imgElm = document.createElement("img");
      imgElm.id = isReply ? "overlay-reply-emote" : "overlay-emote";
      imgElm.src = imgSrc;
      imgElm.style.filter = this.getDropShadow(isReply);

      return imgElm.outerHTML;
    });
  }

  formatGiftedString(count) {
    const conditions = [
      { min: 1, max: 20, result: "sub_gifter_1" },
      { min: 21, max: 50, result: "sub_gifter_2" },
      { min: 51, max: 100, result: "sub_gifter_3" },
      { min: 101, max: 200, result: "sub_gifter_4" },
      { min: 201, max: Number.MAX_SAFE_INTEGER, result: "sub_gifter_5" },
    ];

    return conditions.find(({ min, max }) => count >= min && count <= max)
      .result;
  }

  //NOTE - shadows

  getDropShadow(isReply = false) {
    const strength = isReply ? "0.0125px" : "0.025px";
    return `drop-shadow(-1px -1px ${strength} rgba(0, 0, 0, 0.5)) drop-shadow(1px -1px ${strength} rgba(0, 0, 0, 0.5)) drop-shadow(-1px 1px ${strength} rgba(0, 0, 0, 0.5)) drop-shadow(1px 1px ${strength} rgba(0, 0, 0, 0.5))`;
  }

  getTextShadow(isReply = false) {
    const strength = isReply ? "0.5px" : "1px";
    return `-1px -1px ${strength} rgba(0, 0, 0, 1), 1px -1px ${strength} rgba(0, 0, 0, 1), -1px 1px ${strength} rgba(0, 0, 0, 1), 1px 1px ${strength} rgba(0, 0, 0, 1)`;
  }

  //NOTE - svg icons

  getReplyIcon() {
    const svgElm = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElm.setAttribute("width", "12");
    svgElm.setAttribute("height", "12");
    svgElm.setAttribute("viewBox", "0 0 16 16");
    svgElm.setAttribute("fill", "none");
    svgElm.id = "overlay-reply-icon";
    svgElm.style.filter = this.getDropShadow();

    const pathElm = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    pathElm.setAttribute(
      "d",
      "M9.32004 4.41501H7.51004V1.29001L1.41504 5.66501L7.51004 10.04V6.91501H9.32004C10.805 6.91501 12.01 8.12501 12.01 9.60501C12.01 11.085 10.8 12.295 9.32004 12.295H4.46004V14.795H9.32004C12.185 14.795 14.51 12.465 14.51 9.60501C14.51 6.74501 12.18 4.41501 9.32004 4.41501Z"
    );
    pathElm.setAttribute("fill", "currentColor");

    svgElm.appendChild(pathElm);

    return svgElm.outerHTML;
  }

  getGearIcon() {
    const svgElm = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElm.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElm.setAttribute("width", "16");
    svgElm.setAttribute("height", "16");
    svgElm.setAttribute("fill", "currentColor");
    svgElm.setAttribute("class", "bi bi-gear-fill");
    svgElm.setAttribute("viewBox", "0 0 16 16");
    svgElm.id = "overlay-gear-icon";
    svgElm.style.filter = this.getDropShadow();

    const pathElm = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    pathElm.setAttribute(
      "d",
      "M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"
    );
    pathElm.setAttribute("fill", "currentColor");

    svgElm.appendChild(pathElm);

    svgElm.addEventListener("click", this.handleGearClick);

    return svgElm;
  }

  //NOTE - css

  getCss() {
    return /*CSS*/ `
          #${this.getElementId()} {
              box-sizing: content-box;
              width: 100%;
              height: 100%;
          }
          
          #${this.getElementId()} #chat-message-list {
              box-sizing: border-box;
              scrollbar-width: none;
              overflow: hidden;
              overflow-y: scroll;
              padding-left: 0.3rem;
              padding-right: 0.3rem;
              width: 100%;
              height: 100%;
          }
  
          #${this.getElementId()}.background {
              background-color: rgba(0, 0, 0, 0.3);
              border-radius: .5rem;
              padding: 0.4rem;
              width: calc(100% - 0.8rem);
              height: calc(100% - 0.8rem);
          }
  
          #${this.getElementId()} #overlay-chat-message {
              font-size: 1rem;
              font-weight: 700;
              line-height: 1.5rem;
              width: 100%;
              margin-top: .3rem;
              margin-bottom: .25rem;
          }
  
          #${this.getElementId()} #overlay-badge-container {
              display: inline;
              box-sizing: content-box;
          }
          #${this.getElementId()} #overlay-badge {
              display: inline;
              margin-right: 5px;
          }
          #${this.getElementId()} #overlay-badge-img {
              display: inline;
              width: 1rem;
              height: 1rem;
              margin-top: -3px;
          }
  
          #${this.getElementId()} #overlay-username {
              display: inline;
              overflow-wrap: break-word;
              margin-right: 3px;
              font-weight: 800;
          }
  
          #${this.getElementId()} #overlay-splitter {
              display: inline;
              margin-right: 5px;
              font-weight: 800;
          }
  
          #${this.getElementId()} #overlay-message-content {
              display: inline;
              overflow-wrap: break-word;
          }
  
          #${this.getElementId()} #overlay-reply-content {
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 0.85rem;
              margin-bottom: -0.1rem;
          }
  
          #${this.getElementId()} #overlay-link {
              color:#00E700;
          }
  
          #${this.getElementId()} #overlay-emote,
          #${this.getElementId()} #overlay-reply-emote {
              display: inline;
              margin-left: .125rem;
              margin-right: .125rem;
              margin-top: -4px;
          }
          #${this.getElementId()} #overlay-emote {
              width: 1.65rem;
              height: 1.65rem;
          }
          #${this.getElementId()} #overlay-reply-emote {
              width: 1rem;
              height: 1rem;
          }
  
          #${this.getElementId()} #overlay-reply-icon {
              display: inline;
              margin-top: -4px;
              margin-right: 5px;
          }
  
          #${this.getElementId()} #overlay-gear-icon {
              display: none;
              position: absolute;
              top: 0;
              right: 0;
              padding: 0.5rem;
              cursor: pointer;
          }
          #${this.getElementId()}:hover #overlay-gear-icon {
              display: block;
          }
  
          #${this.getElementId()} #overlay-settings-container {
              display: none;
              box-sizing: border-box;
              padding-left: 0.3rem;
              padding-right: 0.3rem;
              width: 100%;
          }
  
          #${this.getElementId()} #overlay-settings-button {
              width: calc(100% - 40px);
              color: white;
              border: 2px solid green;
              background-color: rgba(0, 0, 0, 0.5);
              margin: 20px;
              margin-bottom: 0px;
              padding: 10px;
              cursor: pointer;
          }
  
          `
      .replace(/\s+/g, " ")
      .trim();
  }
}

//? Disabled
// class FlyingPatricks extends Setting {
//   emojiArray;
//   emojiConf;

//   constructor(settings) {
//     const name = "Let the Patricks Fly";
//     const type = 2; // 0 = Global | 1 = Channel | 2 = Added Line Before
//     const state = false; // Enabled State

//     super(settings, name, type, state);

//     this.setDefaults();
//   }

//   //NOTE - init variables

//   setDefaults() {
//     this.observer = null;

//     this.emojiArray = [];
//     this.emojiConf = {};

//     this.emojiConf.minTime = 5;
//     this.emojiConf.maxTime = 10;
//     this.emojiConf.maxEmojis = 25;
//     this.emojiConf.emojiSize = "45px";
//     this.emojiConf.gravity = 0.0125;
//     this.emojiConf.antiGravity = 1;
//   }

//   //NOTE - core start/stop functions

//   async onSave() {
//     if (this.getState()) {
//       this.startMutations();
//     } else {
//       this.stopMutations();
//     }
//   }

//   async onStart() {
//     if (this.getState()) this.startMutations();
//   }

//   async onStop() {
//     this.stopMutations();
//   }

//   //NOTE - easy start/stop functions

//   startMutations() {
//     this.stopMutations();
//     const chatroom = document.getElementById("chatroom");
//     if (chatroom) this.observer = this.createObserver(chatroom);
//   }

//   stopMutations() {
//     if (this.observer !== null) {
//       this.destroyObserver(this.observer);
//       this.observer = null;
//     }
//   }

//   //NOTE - mutation observer

//   onMutation(mutations) {
//     for (const mutation of mutations) {
//       if (mutation.type === "childList") {
//         for (const node of mutation.addedNodes) {
//           if (node instanceof HTMLElement) {
//             const messageElement = node.querySelector(".chat-entry");
//             if (messageElement) this.scanAndCreateEmojis(messageElement);
//           }
//         }
//       }
//     }
//   }

//   //NOTE - custom

//   scanAndCreateEmojis(node) {
//     //NOTE - patrick = https://files.kick.com/emotes/37231/fullsize
//     const imgs = node.querySelectorAll(
//       'img[src^="https://files.kick.com/emotes/37231/fullsize"]'
//     );
//     imgs.forEach((img) => {
//       this.createFallingEmoji(img.src);
//     });
//   }

//   createFallingEmoji(imageLink) {
//     const video = document.getElementById("mifu-player-check");
//     if (!video) return;

//     if (this.emojiArray.length >= this.emojiConf.maxEmojis) {
//       const oldestEmoji = this.emojiArray.shift();
//       oldestEmoji.parentNode.removeChild(oldestEmoji);
//     }

//     const emoji = document.createElement("img");
//     emoji.src = imageLink;
//     emoji.classList.add("falling-emoji");
//     emoji.style.zIndex = "9999";
//     emoji.style.position = "absolute";
//     emoji.style.height = this.emojiConf.emojiSize;
//     emoji.style.width = this.emojiConf.emojiSize;
//     video.parentNode.appendChild(emoji);

//     this.emojiArray.push(emoji);

//     const angle = Math.random() * Math.PI * 2;
//     const velocity = Math.random() * 5 + 2;

//     const width = emoji.clientWidth;
//     const height = emoji.clientHeight;
//     const videoRect = video.getBoundingClientRect();

//     let x = videoRect.left + Math.random() * (videoRect.width - width);
//     let y = videoRect.top + Math.random() * (videoRect.height - height);

//     let vx = velocity * Math.cos(angle);
//     let vy = velocity * Math.sin(angle);

//     const update = () => {
//       vy += this.emojiConf.gravity;
//       x += vx;
//       y += vy;

//       // Bounce off the bottom
//       if (y + emoji.clientHeight >= videoRect.height) {
//         y = videoRect.height - emoji.clientHeight;
//         vy *= -this.emojiConf.antiGravity;
//       }

//       // Bounce off the right edge
//       if (x + emoji.clientWidth >= videoRect.width) {
//         x = videoRect.width - emoji.clientWidth;
//         vx = -Math.abs(vx);
//       }

//       // Bounce off the left edge
//       if (x <= 0) {
//         x = 0;
//         vx = Math.abs(vx);
//       }

//       // Bounce off the top
//       if (y <= 0) {
//         y = 0;
//         vy = Math.abs(vy);
//       }

//       // Update position
//       emoji.style.left = x + "px";
//       emoji.style.top = y + "px";

//       requestAnimationFrame(update);
//     };

//     update();

//     setTimeout(() => {
//       try {
//         const index = this.emojiArray.indexOf(emoji);
//         if (index !== -1) this.emojiArray.splice(index, 1);
//         emoji.parentNode.removeChild(emoji);
//       } catch (error) {
//         /* Ignore, it was already removed by the emoji limit */
//       }
//     }, Math.random() * (this.emojiConf.minTime * 1000) + this.emojiConf.maxTime * 1000);
//   }
// }

class LeftSideTheaterChat extends Setting {
  constructor(settings) {
    const name = "Theater Mode Left Side Chat";
    const type = 1; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = false; // Enabled State

    super(settings, name, type, state);

    this.setDefaults();
  }

  setDefaults() {
    this.intervals = [];
  }

  async onSave() {
    if (this.getState()) {
      this.startIntervals();
    }
  }

  async onStart() {
    if (this.getState()) {
      this.startIntervals();
    }
  }

  async onStop() {
    this.stopIntervals();
  }

  //NOTE - custom

  startIntervals() {
    this.stopIntervals();
    const tick = setInterval(() => {
      if (this.isTheaterMode()) {
        this.getState() ? this.moveChatLeft() : this.moveChatRight();
      } else {
        if (this.isChatLeft()) this.setChatLeft(false);
        if (this.isHolderLeft()) this.setHolderLeft(false);
      }
    }, 250);
    this.intervals.push(tick);
  }

  stopIntervals() {
    if (this.intervals.length !== 0) {
      this.intervals.forEach((interval) => {
        clearInterval(interval);
      });
      this.intervals = [];
    }
  }

  getChatContainer() {
    const elm = document.querySelector(".chat-container");
    return elm ? elm.parentElement : null;
  }

  getTheaterModeHolder() {
    return document.getElementById("theaterModeVideoHolder");
  }

  isTheaterMode() {
    const elm = document.querySelector(
      ".vjs-control-bar .vjs-control .kick-icon-theater"
    );
    return elm ? elm.classList.contains("vjs-icon-theater-active") : false;
  }

  isHolderLeft() {
    const elm = this.getTheaterModeHolder();
    return elm ? (elm.nextElementSibling ? false : true) : false;
  }

  isChatLeft() {
    const elm = this.getChatContainer();
    return elm ? elm.classList.contains("left-0") : false;
  }

  moveChatRight() {
    this.setChatLeft(false);
    this.setHolderLeft(false);
  }

  moveChatLeft() {
    this.setChatLeft(true);
    this.setHolderLeft(true);
  }

  setChatLeft(flag) {
    const elm = this.getChatContainer();
    if (elm && flag && !this.isChatLeft()) {
      elm.classList.remove("right-0");
      elm.classList.add("left-0");
    } else if (elm && !flag && this.isChatLeft()) {
      elm.classList.remove("left-0");
      elm.classList.add("right-0");
    }
  }

  setHolderLeft(flag) {
    const elm = this.getTheaterModeHolder();
    if (elm && flag && !this.isHolderLeft()) {
      const div = elm.nextElementSibling;
      if (div) elm.parentNode.insertBefore(div, elm);
    } else if (elm && !flag && this.isHolderLeft()) {
      const div = elm.previousElementSibling;
      if (div) elm.parentNode.insertBefore(elm, div);
    }
  }
}

class MessageHistory extends Setting {
  constructor(settings) {
    const name = "Message History";
    const type = 2; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = true; // Enabled State

    super(settings, name, type, state);

    //NOTE - custom

    this.setDefaultVars();
    this.doBinding();
  }

  async onSave() {
    if (this.getState()) {
      this.startMessageHistory();
    } else {
      this.stopMessageHistory();
    }
  }

  async onStart() {
    if (this.getState()) {
      this.startMessageHistory();
    }
  }

  async onStop() {
    this.stopMessageHistory();
  }

  //NOTE - custom

  setDefaultVars() {
    this.infoMessageId = "mifu-info-message";
    this.shiftKeyPressed = false;
    this.messageBuffer = "";
    this.currentIndex = -1;
    this.sentMessages = [];
    this.intervals = [];
  }

  doBinding() {
    this.handleMouseClick = this.onMouseClick.bind(this);
    this.handleKeyDown = this.onKeyDown.bind(this);
    this.handleKeyUp = this.onKeyUp.bind(this);
  }

  //NOTE - core triggers

  async startMessageHistory() {
    await this.loadMessageHistory();
    this.createInfoMessage();
    this.insertInfoMessage();
    this.addListeners();
    this.startIntervals();
  }

  stopMessageHistory() {
    this.stopIntervals();
    this.removeListeners();
    this.removeInfoMessage();
  }

  //NOTE - intervals

  startIntervals() {
    this.stopIntervals();
    const tick = setInterval(() => {
      this.updateMessageBuffer();
    }, 100);
    this.intervals.push(tick);
    const failsafe = setInterval(() => {
      if (this.getInfoMessageElm() === null) {
        this.insertInfoMessage();
        this.addListeners();
      }
    }, 2500);
    this.intervals.push(failsafe);
  }

  stopIntervals() {
    if (this.intervals.length !== 0) {
      this.intervals.forEach((interval) => {
        clearInterval(interval);
      });
      this.intervals = [];
    }
  }

  //NOTE - listeners

  addListeners() {
    this.removeListeners();
    const messageInput = this.getInputField();
    if (messageInput) {
      messageInput.addEventListener("keydown", this.handleKeyDown);
      messageInput.addEventListener("keyup", this.handleKeyUp);
    }

    const sendButton = this.getSendButton();
    if (sendButton) {
      sendButton.addEventListener("click", this.handleMouseClick);
    }
  }

  removeListeners() {
    const messageInput = this.getInputField();
    if (messageInput) {
      messageInput.removeEventListener("keydown", this.handleKeyDown);
      messageInput.removeEventListener("keyup", this.handleKeyUp);
    }

    const sendButton = this.getSendButton();
    if (sendButton) {
      sendButton.removeEventListener("click", this.handleMouseClick);
    }
  }

  //NOTE - getters / setters

  getMessageInput() {
    return this.getMain().messageInput;
  }

  getInputField() {
    return this.getMessageInput().getField();
  }

  getSendButton() {
    return this.getMessageInput().getSendButton();
  }

  setInputFieldText(message) {
    this.getMessageInput().setText(message);
  }

  //NOTE - elements

  createInfoMessage() {
    this.infoMessageElm = document.createElement("div");
    this.infoMessageElm.id = this.infoMessageId;
  }

  insertInfoMessage() {
    this.removeInfoMessage();
    const chatMessageRow = document.querySelector(".chat-input-wrapper");
    if (chatMessageRow) {
      chatMessageRow.parentElement.appendChild(this.infoMessageElm);
      this.updateInfoMessage();
    }
  }

  getInfoMessageElm() {
    const infoMessage = document.getElementById(this.infoMessageId);
    return infoMessage ? infoMessage : null;
  }

  removeInfoMessage() {
    const infoMessage = this.getInfoMessageElm();
    if (infoMessage) infoMessage.remove();
  }

  //NOTE - events

  onKeyUp(event) {
    if (event.key === "Shift") this.shiftKeyPressed = false;

    if (event.key === "Enter") {
      this.doMessageSubmit();
    } else {
      if (
        event.key !== "Shift" &&
        event.key !== "Delete" &&
        event.key !== "ArrowUp" &&
        event.key !== "ArrowDown" &&
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowRight"
      ) {
        this.currentIndex = -1;
        this.updateInfoMessage();
      }
    }
  }

  onKeyDown(event) {
    if (event.key === "Shift") this.shiftKeyPressed = true;

    if (this.shiftKeyPressed) {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        this.doInputArrowUp();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        this.doInputArrowDown();
      } else if (event.key === "Delete") {
        event.preventDefault();
        this.doInputDelete();
      }
    }
  }

  onMouseClick(event) {
    this.doMessageSubmit();
  }

  //NOTE - event actions

  doInputArrowUp() {
    const indexSize = this.sentMessages.length;

    if (this.currentIndex === -1) this.currentIndex = indexSize;

    if (this.currentIndex >= 1) {
      this.currentIndex--;
      this.setInputToCurrentIndexMessage();
    }
    this.updateInfoMessage();
  }

  doInputArrowDown() {
    const indexSize = this.sentMessages.length;

    if (this.currentIndex < indexSize - 1 && this.currentIndex !== -1) {
      this.currentIndex++;
      this.setInputToCurrentIndexMessage();
    } else {
      this.currentIndex = -1;
      this.setInputFieldText("");
    }

    this.updateInfoMessage();
  }

  doInputDelete() {
    const indexSize = this.sentMessages.length;

    if (this.currentIndex >= 0 && this.currentIndex < indexSize) {
      this.sentMessages.splice(this.currentIndex, 1);

      if (indexSize - 1 >= 1) {
        if (this.currentIndex >= 1) this.currentIndex--;
        this.setInputToCurrentIndexMessage();
      } else {
        this.currentIndex = -1;
        this.messageBuffer = "";
        this.setInputFieldText("");
      }

      this.updateInfoMessage();
      this.saveMessageHistory();
    }
  }

  doMessageSubmit() {
    if (this.messageBuffer !== "" && this.messageBuffer !== " ") {
      const existingIndex = this.sentMessages.indexOf(this.messageBuffer);
      if (existingIndex !== -1) this.sentMessages.splice(existingIndex, 1);

      this.sentMessages.push(this.messageBuffer);
      this.currentIndex = -1;

      if (this.sentMessages.length > 100) this.sentMessages.shift();

      this.messageBuffer = "";

      this.updateInfoMessage();
      this.saveMessageHistory();
    }
  }

  //NOTE - core actions

  async loadMessageHistory() {
    this.sentMessages = await this.getMain().database.getMessages(
      this.getMiFu().channelName
    );
  }

  saveMessageHistory() {
    this.getMain().database.saveMessages(
      this.getMiFu().channelName,
      this.sentMessages
    );
  }

  setInputToCurrentIndexMessage() {
    const currentIndexMessage = this.sentMessages[this.currentIndex];
    this.setInputFieldText(currentIndexMessage);
  }

  updateInfoMessage(currentMessage = "") {
    const infoMessageElm = this.getInfoMessageElm();
    if (infoMessageElm === null) return;

    const indexSize = this.sentMessages.length;
    const indexNotEmpty = indexSize > 0;

    if (this.currentIndex !== -1 && indexNotEmpty) {
      const currentIndexId = indexSize - this.currentIndex;
      currentMessage = `Message: ${currentIndexId} of ${indexSize}`;
    } else {
      const hasZeroHistory = `Message History Ready!`;
      const hasSomeHistory = `Messages in History = ${indexSize}`;
      currentMessage = indexNotEmpty ? hasSomeHistory : hasZeroHistory;
    }

    infoMessageElm.innerHTML = currentMessage;
  }

  updateMessageBuffer() {
    const messageInput = this.getInputField();
    if (messageInput) {
      let curMsg = messageInput.innerHTML;
      if (this.messageBuffer !== curMsg && curMsg !== "") {
        if (curMsg.includes("<br>")) {
          curMsg = curMsg.replaceAll("<br>", "");
          messageInput.innerHTML = curMsg;
        }
        this.messageBuffer = curMsg;
      }
    }
  }
}

class MessageOutlinesForKickStaff extends Setting {
  constructor(settings) {
    const name = "Message Outlines for Kick Staff";
    const type = 2; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = true; // Enabled State

    super(settings, name, type, state);

    this.setColor("#ff0000", true);
    this.setColorLabel("Outlines for Kick Staff Messages");
  }

  async onSave() {}

  async onStart() {
    this.updateColor(this.getColor());

    const messages = document.querySelectorAll("#mifu-chat-staff-entry");
    if (messages) {
      messages.forEach((messageElm) => {
        const isPinned = messageElm.closest(".pinned-message__content");
        if (!isPinned)
          messageElm.setAttribute("data-mifu-chat-outline", this.getState());
      });
    }
  }

  async onStop() {}

  updateColor(hexColorCode) {
    this.doOutlineColorUpdate(hexColorCode, "staff");
  }
}

class MessageOutlinesForModerators extends Setting {
  constructor(settings) {
    const name = "Message Outlines for Moderators";
    const type = 1; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = true; // Enabled State

    super(settings, name, type, state);

    this.setColor("#00c7ff", true);
    this.setColorLabel("Outlines for Moderator Messages");
  }

  async onSave() {}

  async onStart() {
    this.updateColor(this.getColor());

    const messages = document.querySelectorAll("#mifu-chat-moderator-entry");
    if (messages) {
      messages.forEach((messageElm) => {
        const isPinned = messageElm.closest(".pinned-message__content");
        if (!isPinned)
          messageElm.setAttribute("data-mifu-chat-outline", this.getState());
      });
    }
  }

  async onStop() {}

  updateColor(hexColorCode) {
    this.doOutlineColorUpdate(hexColorCode, "moderator");
  }
}

class MessageOutlinesForStreamer extends Setting {
  constructor(settings) {
    const name = "Message Outlines for Streamer";
    const type = 1; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = true; // Enabled State

    super(settings, name, type, state);

    this.setColor("#b20dff", true);
    this.setColorLabel("Outlines for Streamer Messages");
  }

  async onSave() {}

  async onStart() {
    this.updateColor(this.getColor());

    const messages = document.querySelectorAll("#mifu-chat-streamer-entry");
    if (messages) {
      messages.forEach((messageElm) => {
        const isPinned = messageElm.closest(".pinned-message__content");
        if (!isPinned)
          messageElm.setAttribute("data-mifu-chat-outline", this.getState());
      });
    }
  }

  async onStop() {}

  updateColor(hexColorCode) {
    this.doOutlineColorUpdate(hexColorCode, "streamer");
  }
}

class MessageOutlinesForVerified extends Setting {
  constructor(settings) {
    const name = "Message Outlines for Verified";
    const type = 1; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = true; // Enabled State

    super(settings, name, type, state);

    this.setColor("#d1ea00", true);
    this.setColorLabel("Outlines for Verified Messages");
  }

  async onSave() {}

  async onStart() {
    this.updateColor(this.getColor());

    const messages = document.querySelectorAll("#mifu-chat-verified-entry");
    if (messages) {
      messages.forEach((messageElm) => {
        const isPinned = messageElm.closest(".pinned-message__content");
        if (!isPinned)
          messageElm.setAttribute("data-mifu-chat-outline", this.getState());
      });
    }
  }

  async onStop() {}

  updateColor(hexColorCode) {
    this.doOutlineColorUpdate(hexColorCode, "verified");
  }
}

class MessageOutlinesForHighlighted extends Setting {
  constructor(settings) {
    const name = "Message Outlines for Highlighted";
    const type = 2; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = true; // Enabled State

    super(settings, name, type, state);

    this.setColor("#ffff00", true);
    this.setColorLabel("Outlines for Highlighted Messages");
  }

  async onSave() {}

  async onStart() {
    this.updateColor(this.getColor());

    const messages = document.querySelectorAll("#mifu-chat-highlighted-entry");
    if (messages) {
      messages.forEach((messageElm) => {
        const isPinned = messageElm.closest(".pinned-message__content");
        if (!isPinned)
          messageElm.setAttribute("data-mifu-chat-outline", this.getState());
      });
    }
  }

  async onStop() {}

  updateColor(hexColorCode) {
    this.doOutlineColorUpdate(hexColorCode, "verified");
  }
}

class ReplayBuffer_options extends Setting {
  constructor(settings) {
    const name = "Replay Buffer";
    const type = 2; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = true; // Enabled State

    super(settings, name, type, state);
  }

  async onSave() {}

  async onStart() {}

  async onStop() {}
}

class ReplayBufferInfo extends Setting {
  constructor(settings) {
    const name = "Replay Buffer Info";
    const type = 1; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = true; // Enabled State

    super(settings, name, type, state);
  }

  async onSave() {}

  async onStart() {}

  async onStop() {}
}

class ShowBannedMessages extends Setting {
  constructor(settings) {
    const name = "Show Banned Messages";
    const type = 2; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = true; // Enabled State

    super(settings, name, type, state);

    this.setColor("#FF0000", true);
    this.setColorLabel("Background for Banned Messages");
  }

  async onSave() {}

  async onStart() {
    this.injectCss();
    this.updateColor(this.getColor());
    this.updateDisplayProperty(this.getState());
  }

  async onStop() {}

  updateColor(hexColorCode) {
    this.updateBackgroundColors(`${hexColorCode}22`);
  }

  injectCss() {
    if (!document.getElementById("mifu-css-banned-messages")) {
      const style = document.createElement("style");

      style.id = "mifu-css-banned-messages";
      style.textContent = this.getCss();

      document.head.appendChild(style);
    }
  }

  getCss() {
    return /*CSS*/ `
                .mifu-banned-message {
                    display: block !important;
                    font-style: italic !important;
                    background-color: ${this.getColor()}33;
                }
    
                .mifu-banned-message .chat-entry {
                    opacity: 0.5;
                }
            `
      .replace(/\s+/g, " ")
      .trim();
  }

  updateBackgroundColors(newColor) {
    var styleElement = document.getElementById("mifu-css-banned-messages");
    if (styleElement) {
      styleElement.textContent = styleElement.textContent.replace(
        /background-color: #([0-9a-fA-F]+);/,
        `background-color: ${newColor};`
      );
    }
  }

  updateDisplayProperty(flag) {
    var styleElement = document.getElementById("mifu-css-banned-messages");
    if (styleElement) {
      const newDisplay = flag ? "block" : "none";

      styleElement.textContent = styleElement.textContent.replace(
        /display: (block|none) !important;/g,
        `display: ${newDisplay} !important;`
      );
    }
  }
}

class ShowDeletedMessages extends Setting {
  constructor(settings) {
    const name = "Show Deleted Messages";
    const type = 1; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = true; // Enabled State

    super(settings, name, type, state);

    this.setColor("#808080", true);
    this.setColorLabel("Background for Deleted Messages");
  }

  async onSave() {}

  async onStart() {
    this.injectCss();
    this.updateColor(this.getColor());
    this.updateDisplayProperty(this.getState());
  }

  async onStop() {}

  updateColor(hexColorCode) {
    this.updateBackgroundColors(`${hexColorCode}22`);
  }

  injectCss() {
    if (!document.getElementById("mifu-css-deleted-messages")) {
      const style = document.createElement("style");

      style.id = "mifu-css-deleted-messages";
      style.textContent = this.getCss();

      document.head.appendChild(style);
    }
  }

  getCss() {
    return /*CSS*/ `
                .mifu-deleted-message {
                    display: block !important;
                    font-style: italic !important;
                    background-color: ${this.getColor()}33;
                }
    
                .mifu-deleted-message .chat-entry {
                    opacity: 0.5;
                }
            `
      .replace(/\s+/g, " ")
      .trim();
  }

  updateBackgroundColors(newColor) {
    var styleElement = document.getElementById("mifu-css-deleted-messages");
    if (styleElement) {
      styleElement.textContent = styleElement.textContent.replace(
        /background-color: #([0-9a-fA-F]+);/,
        `background-color: ${newColor};`
      );
    }
  }

  updateDisplayProperty(flag) {
    var styleElement = document.getElementById("mifu-css-deleted-messages");
    if (styleElement) {
      const newDisplay = flag ? "block" : "none";

      styleElement.textContent = styleElement.textContent.replace(
        /display: (block|none) !important;/g,
        `display: ${newDisplay} !important;`
      );
    }
  }
}

class ShowTimedoutMessages extends Setting {
  constructor(settings) {
    const name = "Show Timed Out Messages";
    const type = 1; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = true; // Enabled State

    super(settings, name, type, state);

    this.setColor("#FFA500", true);
    this.setColorLabel("Background for Timed Out Messages");
  }

  async onSave() {}

  async onStart() {
    this.injectCss();
    this.updateColor(this.getColor());
    this.updateDisplayProperty(this.getState());
  }

  async onStop() {}

  updateColor(hexColorCode) {
    this.updateBackgroundColors(`${hexColorCode}22`);
  }

  injectCss() {
    if (!document.getElementById("mifu-css-timedout-messages")) {
      const style = document.createElement("style");

      style.id = "mifu-css-timedout-messages";
      style.textContent = this.getCss();

      document.head.appendChild(style);
    }
  }

  getCss() {
    return /*CSS*/ `
                .mifu-timedout-message {
                    display: block !important;
                    font-style: italic !important;
                    background-color: ${this.getColor()}33;
                }
    
                .mifu-timedout-message .chat-entry {
                    opacity: 0.5;
                }
            `
      .replace(/\s+/g, " ")
      .trim();
  }

  updateBackgroundColors(newColor) {
    var styleElement = document.getElementById("mifu-css-timedout-messages");
    if (styleElement) {
      styleElement.textContent = styleElement.textContent.replace(
        /background-color: #([0-9a-fA-F]+);/,
        `background-color: ${newColor};`
      );
    }
  }

  updateDisplayProperty(flag) {
    var styleElement = document.getElementById("mifu-css-timedout-messages");
    if (styleElement) {
      const newDisplay = flag ? "block" : "none";

      styleElement.textContent = styleElement.textContent.replace(
        /display: (block|none) !important;/g,
        `display: ${newDisplay} !important;`
      );
    }
  }
}

class SoundOnMention extends Setting {
  mutationProcessor = new MutationProcessor(this);

  constructor(settings) {
    const name = "Sound on Mention";
    const type = 1; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = true; // Enabled State

    super(settings, name, type, state);

    this.setDefaults();
  }

  //NOTE - init variables

  setDefaults() {
    this.observer = null;
  }

  //NOTE - core start/stop functions

  async onSave() {
    if (this.getState()) {
      this.doStart();
    } else {
      this.doStop();
    }
  }

  async onStart() {
    if (this.getState()) this.doStart();
  }

  async onStop() {
    this.doStop();
  }

  //NOTE - easy start/stop functions

  doStart() {
    this.startMutations();
  }

  doStop() {
    this.stopMutations();
  }

  //NOTE - mutation observer

  startMutations() {
    this.stopMutations();
    const chatroom = document.getElementById("chatroom");
    if (chatroom) this.observer = this.createObserver(chatroom);
  }

  stopMutations() {
    if (this.observer !== null) {
      this.destroyObserver(this.observer);
      this.observer = null;
    }
  }

  onMutation(mutations) {
    outerLoop: for (const mutation of mutations) {
      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            const chatEntryDiv = node.querySelector(".chat-entry");

            if (!chatEntryDiv) break;

            const chatterUsername = chatEntryDiv.querySelector(
              ".chat-entry-username"
            );

            if (!chatterUsername) break;

            const botNames = ["botrix", "kickbot", "kicklet"];
            const usernameToLower = chatterUsername.textContent.toLowerCase();
            const isBot = botNames.some((bot) => usernameToLower.includes(bot));

            if (isBot) break outerLoop;

            //? Added
            const strippedHtml = chatEntryDiv.innerHTML.replace(/\s/g, "");

            if (chatEntryDiv.classList.contains("border")) {
              this.playSound();
              break outerLoop;
            }
            //? Added also for Streamer
            else if (
              this.mutationProcessor.htmlToBadge(
                strippedHtml,
                this.mutationProcessor.getBadgeTypes().streamer
              )
            ) {
              this.playSound();
              break outerLoop;
            }
          }
        }
      }
    }
  }

  playSound() {
    let audioAlert = document.getElementById("mifu-message-ping");
    if (!audioAlert) {
      audioAlert = new Audio(
        "data:audio/mpeg;base64,SUQzAwAAAAAHdlRDT04AAAAPAAAB//5PAHQAaABlAHIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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6gwswtNbaMCCqiFGIEEnoZx/cm50GoHCJBq65q5ubrTl98rpdSfKvSTTUmSNNsSistDP1+m3mzya30eOIw3OidbSmaTaV3chA6MF4+FQiEw1XNGZ4hkkKiGTDYSiOZsv3OobLI0N3T+jCVYjMEJ9VW7f4Y5dnSWS6qKUpjiFFi6uMX8S8KlLbxpW6gxNtB0osR28agKLAys0Wh431bBJuv4S60kkqqlCCIYPj4XCIYGq5MTzwpkkPi+TFQlG69lXc6Q1yyNK7p/RIXTgdRoc013D+MULR0Jo8tKqsMRJYebiD+Sug1HbeJFvGRaccqUJSogFXEJb6xLzeLWSnu+kVtVbTX/8h5CLQpFiCkHxQiRxBRwN3B9MYZaUHryU9jv1//uSANQAAyc6yeEvStJkZyk8JelaS/zLJ4YxK0l2mCSwxhlpKorrCksRJomCMUNUIEl2zzOtYx5NQxhNdZiUtVRTViXZYUi90MySzcdU2qrG1dUiYnhlxW2Mqlavty/n7MkMSKNVSBJCJwcixBOB8UIkcQGMAGwDIpT6xglaKkr55CJ6aAPIDyaJgjDDVCBJds8z2sY8mlIsJzWYlLUKKasS7LCkddWZJZtXUtqqxtXVATYYXiuCLFZPtz7fn7QdkbaSv+QI1GyQGwZIUAhMhoqIA2GBMtUSrC5nWUUNaq6jCUakie4VAkAYyhQlmlhlBLIpCqQWbQqCmsWREKGruWPQBpFuq1631PKnHrbaGAKptz4qJ/8/3xsYQdkbaSv+QI1GyQGwZELAhMhoqIA2GBMtUSrCZnWUUNlVwuEo1JFrhUCQBiVVCRNLDKBrIpE0hU2rAlqMkRChr3JzaANIt1WtrfU8qedbbQwJoVWH9YffL/fGxhfsAAAIAH/////////////////////////////////////////////////////7kgDPgALuMUphjErSXiYZLDEpWktwxyGEpStJcZjkMJSlaf//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+AAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+5IA1IAJHQBGoAAACAQgCMQAAAEAAAEuAAAAIAAAJcAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAw="
      );
      audioAlert.id = "mifu-message-ping";
      audioAlert.volume = 0.9;
      audioAlert.preload = "auto";
      audioAlert.style.display = "none";
      document.body.appendChild(audioAlert);
    }

    audioAlert.play();
  }
}

class SpellCheck extends Setting {
  constructor(settings) {
    const name = "SpellCheck";
    const type = 1; // 0 = Global | 1 = Channel | 2 = Added Line Before
    const state = true; // Enabled State

    super(settings, name, type, state);
  }

  async onSave() {
    this.setSpellCheck();
  }

  async onStart() {
    this.setSpellCheck();
  }

  async onStop() {}

  //NOTE - custom

  setSpellCheck() {
    const messageInput = this.getMain().messageInput.getField();
    if (messageInput) messageInput.spellcheck = this.getState();
  }
}

class Settings {
  constructor(main) {
    this.main = main;
    this.settings = [];
    // this.init();
  }

  debug(message) {
    this.getMain().debug(message);
  }

  //NOTE - core gets

  getMain() {
    return this.main;
  }

  getMiFu() {
    return this.getMain().mifu;
  }

  getDatabase() {
    return this.getMain().database;
  }

  //NOTE - get settings

  get(settingName) {
    return this.settings[settingName];
  }

  getState(settingName) {
    return this.get(settingName).getState();
  }

  getAll() {
    return this.settings;
  }

  //NOTE - initializations

  reset() {
    this.settings = [];
  }

  async init() {
    this.reset();

    //NOTE - Channel Settings

    this.addSetting(new AutoHDStream(this));
    this.addSetting(new AutoMuteStream(this));
    this.addSetting(new AutoRejectHosts(this));
    this.addSetting(new AutoTheaterMode(this));

    //NOTE - line before

    this.addSetting(new ChannelStats(this));
    this.addSetting(new ChatOverlay(this));

    //NOTE - line before

    this.addSetting(new MessageHistory(this));
    this.addSetting(new SoundOnMention(this));
    this.addSetting(new SpellCheck(this));

    //NOTE - line before

    //? Disabled
    // this.addSetting(new FlyingPatricks(this));
    this.addSetting(new LeftSideTheaterChat(this));

    //NOTE - line before

    this.addSetting(new ReplayBuffer_options(this));
    this.addSetting(new ReplayBufferInfo(this));

    //NOTE - line before

    this.addSetting(new ShowBannedMessages(this));
    this.addSetting(new ShowDeletedMessages(this));
    this.addSetting(new ShowTimedoutMessages(this));

    //NOTE - line before

    this.addSetting(new MessageOutlinesForKickStaff(this));
    this.addSetting(new MessageOutlinesForModerators(this));
    this.addSetting(new MessageOutlinesForStreamer(this));
    this.addSetting(new MessageOutlinesForVerified(this));
    //? Add highlightedOutlines for highlighted messages
    this.addSetting(new MessageOutlinesForHighlighted(this));
  }

  addSetting(setting) {
    this.settings[setting.getName()] = setting;
  }

  //NOTE - core settings

  async startSettings() {
    const sets = Object.entries(this.settings);
    for (const [set, setting] of sets) {
      if (!this.getMiFu().dbLoaded) return;
      setting.onStart();
    }
    this.debug("Channel Settings Started!");
  }

  async stopSettings() {
    const sets = Object.entries(this.settings);
    for (const [set, setting] of sets) {
      await setting.onStop();
    }
    this.getMain().debugLine();
    this.debug("Channel Settings Stopped!");
  }

  //NOTE - settings

  async initSaveLoadSettings(dbSettingsData) {
    const dbSettingsSize = Object.keys(dbSettingsData).length;
    if (dbSettingsSize === 0) {
      await this.save();
    } else {
      await this.load(dbSettingsData);
    }
    this.debug("Database Settings Loaded!");
  }

  async load(dbSettingsData) {
    for (const key in dbSettingsData) {
      const settingName = key.replace(/_/g, " ");
      const settingState = dbSettingsData[key];
      const setting = this.get(settingName);
      if (setting) await setting.onLoad(settingState);
    }
  }

  async save() {
    const settingsObj = {};
    Object.entries(this.settings).forEach(([set, setting]) => {
      const settingName = set.replace(/ /g, "_");
      const settingState = setting.getState();
      settingsObj[settingName] = settingState;
    });
    await this.getDatabase().saveSettings(
      this.getMiFu().channelName,
      settingsObj
    );
  }

  //NOTE - colors

  async initSaveLoadColors(dbSettingsData) {
    const dbSettingsSize = Object.keys(dbSettingsData).length;
    if (dbSettingsSize === 0) {
      await this.saveColors();
    } else {
      await this.loadColors(dbSettingsData);
    }
    this.debug("Database Colors Loaded!");
  }

  async loadColors(dbSettingsData) {
    for (const key in dbSettingsData) {
      const settingName = key.replace(/_/g, " ");
      const settingColor = dbSettingsData[key];
      const setting = this.get(settingName);
      if (setting) setting.setColor(settingColor, true);
    }
  }

  async saveColors() {
    const settingsObj = {};
    Object.entries(this.settings).forEach(([set, setting]) => {
      const settingName = set.replace(/ /g, "_");
      const settingsHasColor = setting.hasColor();
      if (settingsHasColor) {
        const settingColor = setting.getColor();
        settingsObj[settingName] = settingColor;
      }
    });
    await this.getDatabase().saveColors(
      this.getMiFu().channelName,
      settingsObj
    );
  }
}

class HistoryLogs {
  settingsMenu;

  constructor(settingsMenu) {
    this.settingsMenu = settingsMenu;
  }

  getMain() {
    return this.settingsMenu.getMain();
  }

  getMiFu() {
    return this.getMain().mifu;
  }

  getInput() {
    return this.getMain().messageInput;
  }

  getMessageHistory() {
    const settings = this.getMain().settings;
    return settings.get("Message History");
  }

  getInfoMessage() {
    return this.getMessageHistory().getInfoMessageElm();
    // return this.getMain().infoMessage;
  }

  getSentMessages() {
    return this.getMessageHistory().sentMessages;
    // return this.getMiFu().sentMessages;
  }

  //NOTE - Main Calls

  getLogsMenu() {
    return this.buildMessageLogsMenu();
  }

  doAddListeners() {
    this.addMessageLogsEventListeners();
  }

  //NOTE - Core Functions

  getMessageLogEntries(logEntries = "") {
    [...this.getSentMessages()].reverse().forEach((message) => {
      logEntries += this.buildMessageLogEntry(message);
    });
    return logEntries;
  }

  buildMessageLogsMenu() {
    const logEntriesTotal = this.getSentMessages().length;
    const logEntries = this.getMessageLogEntries();

    return /*HTML*/ `
                  <div data-v-c5b639f8="" class="chat-actions-content">
                      <div data-v-b999fa93="" class="chat-actions-muted-list" id="mifu-logs">
                          ${logEntries}
                          <div data-v-b999fa93="" class="actions-muted-count">
                              <span data-v-b999fa93="" class="mr-1 font-medium text-white" id="mifu-logs-size">${logEntriesTotal}</span> messages in total
                          </div>
                      </div>
                  </div>
              `;
  }

  buildMessageLogEntry(message) {
    return /*HTML*/ `
                  <div data-v-f3b68af0="" data-v-b999fa93="" class="chat-actions-item" id="mifu-log-entry">
                      <div data-v-f3b68af0="" class="w-full select-none overflow-hidden truncate text-left text-sm font-semibold" id="mifu-log-message">${message}</div>
                      <div data-v-f3b68af0="" class="flex h-10 w-fit items-center justify-end" id="mifu-logs-delete">
                          <div data-v-f3b68af0="" style="width: 16px; height: 16px;">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M11.3393 3.10714V1.5H4.91071V3.10714H2.5V4.71429H13.75V3.10714H11.3393Z" fill="currentColor"></path>
                                  <path d="M4.10714 6.32143V14.3571H12.1429V6.32143H4.10714ZM5.71429 12.75V7.92857H7.32143V12.75H5.71429ZM8.92857 12.75V7.92857H10.5357V12.75H8.92857Z" fill="currentColor"></path>
                              </svg>
                          </div>
                      </div>
                  </div>
              `;
  }

  addMessageLogsEventListeners() {
    const container = document.getElementById("mifu-logs");
    const deleteButtons = container.querySelectorAll("#mifu-logs-delete");
    const historyMessages = container.querySelectorAll("#mifu-log-message");

    historyMessages.forEach((element) => {
      element.addEventListener("click", (event) => {
        const message = event.currentTarget.innerHTML;

        // this.getMiFu().curIndex = this.getSentMessages().indexOf(message);
        this.getMessageHistory().currentIndex =
          this.getSentMessages().indexOf(message);

        this.getInput().setText(message);
        this.getInput().focus();

        // this.getInfoMessage().update();
        this.getMessageHistory().updateInfoMessage();
      });
    });

    deleteButtons.forEach(async (button) => {
      button.addEventListener("click", async (event) => {
        const parentElement = event.target.closest("#mifu-log-entry");
        const childElement = parentElement.querySelector("#mifu-log-message");
        const messageValue = childElement.innerHTML;
        const indexToDelete = this.getSentMessages().indexOf(messageValue);

        if (indexToDelete !== -1) {
          this.getSentMessages().splice(indexToDelete, 1);
          parentElement.remove();

          // this.getInfoMessage().update();
          this.getMessageHistory().updateInfoMessage();

          // await this.getMain().saveDatabase();
          this.getMessageHistory().saveMessageHistory();

          const counter = document.getElementById("mifu-logs-size");

          counter.innerHTML = this.getSentMessages().length;
        }
      });
    });
  }
}

class SettingsMenu {
  main;

  historyLogs;

  clonedSubMenu = null;
  clonedToggle = null;
  clonedLink = null;
  previousList = [];
  settingsList = [];
  wasInserted = false;

  isMyMenu = false;

  constructor(main) {
    this.main = main;
    this.historyLogs = new HistoryLogs(this);
  }

  getMain() {
    return this.main;
  }

  getMiFu() {
    return this.getMain().mifu;
  }

  debug(message) {
    this.getMain().debug(message);
  }

  getSettings() {
    return this.getMain().settings;
  }

  insert() {
    setInterval(() => {
      this.processSettingsMenu();
    }, 250);
    this.debug("Settings Menu Ready!");
  }

  getChatSettings() {
    return document.querySelector(".chat-actions-popup");
  }
  getChatSettingsList() {
    return document.querySelector(".chat-actions-menu-list");
  }

  processSettingsMenu() {
    const isReady = this.cloneSettingsItems();

    if (!isReady && this.wasInserted) {
      this.previousList = [];
      this.settingsList = [];
      this.wasInserted = false;
      this.isMyMenu = false;
    } else if (isReady && !this.wasInserted) {
      this.wasInserted = true;
      this.setMenuHeaderId();
      this.addSettingsEntries();
    } else if (isReady && this.wasInserted && this.isMyMenu) {
      const has7tv = this.getChatSettings().querySelector(
        `.seventv-chat-settings-button`
      );
      if (has7tv) has7tv.remove();
    }
  }

  //NOTE - Add Entires

  addSettingsEntries() {
    const addClearChat = () => {
      const localChatClearLabel = "Clear Chat (Client Side Only)";
      const localChatClear = this.clonedSubMenu.cloneNode(true);
      const localChatClearDiv = localChatClear.querySelector("div");

      const svgAsset = localChatClear.querySelector("svg");
      if (svgAsset) svgAsset.style.opacity = "0";

      if (localChatClearDiv) {
        localChatClearDiv.innerHTML = localChatClearLabel;

        localChatClear.addEventListener("click", () => {
          const chatroomElement = document.getElementById("chatroom");
          if (chatroomElement) {
            const overflowYScrollElement =
              chatroomElement.querySelector(".overflow-y-scroll");
            if (overflowYScrollElement) {
              const divsWithClass =
                overflowYScrollElement.querySelectorAll("div[class]");
              divsWithClass.forEach((div) => div.remove());

              const chatroomElement = document.getElementById("chatroom");
              if (chatroomElement) {
                const overflowYScrollElement =
                  chatroomElement.querySelector(".overflow-y-scroll");
                if (overflowYScrollElement) {
                  const newElement = document.createElement("div");
                  newElement.innerHTML = /*HTML*/ `
                                            <div data-v-8960167e="" data-chat-entry="" class="mt-0.5">
                                                <div data-v-2edcbc1a="" class="chatroom-event-ban__container !break-normal">
                                                <div data-v-2edcbc1a="" class="base-icon chatroom-event-ban__icon" style="width: 16px; height: 16px;">
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8 1C4.135 1 1 4.135 1 8C1 11.865 4.135 15 8 15C11.865 15 15 11.865 15 8C15 4.135 11.865 1 8 1ZM4.99 12.425L3.575 11.01L11.01 3.575L12.425 4.99L4.99 12.425Z" fill="currentColor"></path>
                                                    </svg>
                                                </div>
                                                <span data-v-2edcbc1a="" class="chatroom-event-ban__label">
                                                    <span data-v-2edcbc1a="" class="text-white">Chat Cleared Locally by KickAssist!</span>
                                                </span>
                                                </div>
                                            </div>
                                        `;
                  const lastChild = overflowYScrollElement.lastChild;
                  if (lastChild) {
                    overflowYScrollElement.insertBefore(newElement, lastChild);
                  } else {
                    overflowYScrollElement.appendChild(newElement);
                  }
                  setTimeout(() => {
                    overflowYScrollElement.removeChild(newElement);
                  }, 30000);
                }
              }

              this.main.messageInput.focus();
            }
          }
        });
      }

      this.addEntry(localChatClear);
    };

    addClearChat();

    const kickAssistMenuLabel = "KickAssist Extension Menu";
    this.addEntry(
      this.makeSubMenuEntry(kickAssistMenuLabel, () => {
        this.updateMenuHeader(kickAssistMenuLabel, false);

        //? Disabled
        // this.buildDeveloperLinksEntry();

        // this.buildDiscordSupportEntry();

        // this.addEntry(this.makeDividerEntry());

        // this.buildSupporterBadgeEntry();

        // this.buildChangeLogEntry();

        //?* Disabled

        this.addEntry(this.makeDividerEntry());

        this.buildChannelColorsEntry();
        this.buildChannelSettingsEntry();

        this.addEntry(this.makeDividerEntry());

        this.buildChatHotkeysEntry();
        this.buildChatMessageHistoryEntry();
        //? Added to build Additional Settings
        this.buildAdditionalSettings();

        this.updateMenuEntries();
      })
    );

    this.updateMenuEntries(false);
  }

  //NOTE - build menu entries
  //? Disabled
  //   buildDeveloperLinksEntry() {
  //     const devLinks = "Extension Developer Links";
  //     this.addEntry(
  //       this.makeSubMenuEntry(devLinks, () => {
  //         this.updateMenuHeader(devLinks, true);

  //         const json = {
  //           "Become a Patron": "https://www.patreon.com/miahfuta",
  //           "Donate via PayPal": "https://www.paypal.com/paypalme/miahfuta",
  //           "Follow MiahFuta on Kick": "https://kick.com/miahfuta",
  //         };
  //         for (const label in json) {
  //           this.addEntry(this.makeLinkEntry(label, json[label]));
  //         }

  //         this.updateMenuEntries();
  //       })
  //     );
  //   }

  //? Disabled
  //   buildDiscordSupportEntry() {
  //     const entryTitle = "Feedback or Suggestions";
  //     this.addEntry(
  //       this.makeLinkMenu(entryTitle, () => {
  //         window.open("https://discord.com/invite/snvWEvg2C4", "_blank");
  //       })
  //     );
  //   }

  //? Disabled
  //   buildSupporterBadgeEntry() {
  //     const entryTitle = "Get a KickAssist Badge";
  //     this.addEntry(
  //       this.makeLinkMenu(entryTitle, () => {
  //         window.open(
  //           "https://github.com/KickAssist/.github/blob/main/profile/CHANGELOG.md#support-this-project",
  //           "_blank"
  //         );
  //       })
  //     );
  //   }

  //? Disabled
  //   buildChangeLogEntry() {
  //     const entryTitle = "View the Change Log";
  //     this.addEntry(
  //       this.makeLinkMenu(entryTitle, () => {
  //         window.open(
  //           "https://github.com/KickAssist/.github/blob/main/profile/CHANGELOG.md#kickassist-recent-changes",
  //           "_blank"
  //         );
  //       })
  //     );
  //   }

  buildChannelColorsEntry() {
    const channelColorSettings = "Channel Colors";
    this.addEntry(
      this.makeSubMenuEntry(channelColorSettings, () => {
        this.updateMenuHeader(channelColorSettings, true);

        const userSettings = this.getSettings().getAll();

        Object.entries(userSettings).forEach(([set, setting]) => {
          if (setting.hasColor()) {
            if (setting.getType() === 2) this.addEntry(this.makeDividerEntry());

            const settingName = setting.getColorLabel()
              ? setting.getColorLabel()
              : set;

            this.addEntry(
              this.makeColorPickerEntry(
                settingName,
                setting.getColor(),
                (data) => {
                  setting.setColor(data);
                }
              )
            );
          }
        });

        this.updateMenuEntries();
      })
    );
  }

  buildChannelSettingsEntry() {
    const channelSettings = "Channel Settings";
    this.addEntry(
      this.makeSubMenuEntry(channelSettings, () => {
        this.updateMenuHeader(channelSettings, true);

        const userSettings = this.getSettings().getAll();

        Object.entries(userSettings).forEach(([set, setting]) => {
          const settingName = set;
          const settingType = setting.getType();
          const settingState = setting.getState();

          if (settingType === 1 || settingType === 2) {
            if (settingType === 2) this.addEntry(this.makeDividerEntry());
            this.addEntry(
              this.makeToggleEntry(settingName, settingState, async () => {
                setting.setState(!setting.getState());
              })
            );
          }
        });

        this.updateMenuEntries();
      })
    );
  }

  buildChatHotkeysEntry() {
    const chatHotkeys = "Chat Hotkeys";
    this.addEntry(
      this.makeSubMenuEntry(chatHotkeys, () => {
        this.updateMenuHeader(chatHotkeys, true);

        this.addEntry(
          this.makeCenteredTextEntry("Shift + Up Arrow = Go Back in History")
        );
        this.addEntry(
          this.makeCenteredTextEntry(
            "Shift + Down Arrow = Go Forward in History"
          )
        );
        this.addEntry(this.makeDividerEntry());
        this.addEntry(
          this.makeCenteredTextEntry("Shift + Delete = Remove From History")
        );
        this.addEntry(this.makeDividerEntry());
        this.addEntry(
          this.makeCenteredTextEntry("Alt Key = Toggle Chat Scrolling")
        );

        this.updateMenuEntries();
      })
    );
  }

  buildChatMessageHistoryEntry() {
    const messageHistory = "Chat Message History";
    this.addEntry(
      this.makeSubMenuEntry(messageHistory, () => {
        this.updateMenuHeader(messageHistory, true);

        const menuList = this.getChatSettingsList();

        menuList.innerHTML = this.historyLogs.getLogsMenu();
        this.historyLogs.doAddListeners();
      })
    );
  }

  //? Added to build Additional Settings
  buildAdditionalSettings() {
    if (isChatRoom()) {
      //NOTE - Divider

      this.addEntry(this.makeDividerEntry());

      //NOTE - Additional Settings

      const additionalSettings = "Additional Settings";
      this.addEntry(
        this.makeSubMenuEntry(additionalSettings, () => {
          this.updateMenuHeader(additionalSettings, true);

          const chatroomOnlyHighlight = "[Chatroom] Only Highlighed Messages";
          this.addEntry(
            this.makeToggleEntry(
              chatroomOnlyHighlight,
              settings.chatroomOnlyHighlight,
              () => {
                settings.chatroomOnlyHighlight =
                  !settings.chatroomOnlyHighlight;
                // processSettings(
                //   "chatroomOnlyHighlight",
                //   !settings.chatroomOnlyHighlight
                // );
              }
            )
          );

          this.updateMenuEntries();
        })
      );
    }
  }

  // NOTE - Build Other Elements

  createColorPicker(defaultColor, callback) {
    const div = document.createElement("div");
    div.style.position = "relative";
    div.style.border = "1px solid #ffffff";
    div.style.borderRadius = "50%";
    div.style.height = "22px";
    div.style.padding = "0";
    div.style.width = "22px";
    div.style.overflow = "hidden";
    div.style.backgroundColor = defaultColor;

    const input = document.createElement("input");
    input.classList.add("color-picker-input");
    input.setAttribute("type", "color");
    input.setAttribute("id", "colorpicker");
    input.setAttribute("value", defaultColor);
    input.style.position = "absolute";
    input.style.top = "0";
    input.style.left = "0";
    input.style.height = "100%";
    input.style.width = "100%";
    input.style.margin = "0";
    input.style.padding = "0";
    input.style.border = "0";
    input.style.opacity = "0";
    input.addEventListener("input", () => {
      div.style.backgroundColor = input.value;
    });
    input.addEventListener("change", () => {
      const chosenColor = input.value;
      callback(chosenColor);
    });

    div.appendChild(input);
    return div;
  }

  makeColorPickerEntry(labelText, color, callback) {
    const label = document.createElement("label");
    const div = document.createElement("div");

    div.classList.add("select-none", "text-sm", "font-medium");
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.width = "100%";
    div.style.marginTop = "0.3rem";
    div.style.padding = "0.5rem";
    div.style.borderRadius = "4px";

    label.textContent = `${labelText}`;
    label.setAttribute("for", "colorpicker");
    label.addEventListener("click", (event) => {
      event.preventDefault();
    });

    const colorPickerInput = this.createColorPicker(color, callback);
    div.appendChild(label);
    div.appendChild(colorPickerInput);

    return div;
  }

  makeDividerEntry() {
    const hr = document.createElement("hr");

    hr.style.backgroundColor = "rgb(49, 53, 56)";
    hr.style.marginTop = "0.5rem";
    hr.style.marginBottom = "0.5rem";
    hr.style.opacity = "0.25";

    return hr;
  }

  makeTextEntry(message) {
    const div = document.createElement("div");

    div.classList.add("select-none", "text-sm", "font-medium");
    div.style.display = "block";
    div.style.width = "100%";
    div.style.marginTop = "0.3rem";
    div.style.padding = "0.5rem";
    div.style.borderRadius = "4px";
    div.innerHTML = message;

    return div;
  }

  makeCenteredTextEntry(message) {
    const div = document.createElement("div");

    div.classList.add("select-none", "text-sm", "font-medium");
    div.style.display = "block";
    div.style.width = "100%";
    div.style.marginTop = "0.3rem";
    div.style.padding = "0.5rem";
    div.style.borderRadius = "4px";
    div.style.textAlign = "center";
    div.innerHTML = message;

    return div;
  }

  makeLinkEntry(title, url) {
    const div = document.createElement("div");
    const link = document.createElement("a");

    div.classList.add(
      "chat-actions-item",
      "cursor-pointer",
      "hover:bg-secondary-lightest",
      "active:bg-secondary-lightest/60"
    );
    div.style.display = "block";
    div.style.width = "100%";
    div.style.marginTop = "0.3rem";
    div.style.padding = "0.5rem";
    div.style.borderRadius = "4px";
    div.style.textAlign = "center";
    div.innerHTML = title;

    link.classList.add(
      "select-none",
      "overflow-hidden",
      "truncate",
      "pr-2",
      "text-sm",
      "font-medium"
    );
    link.style.display = "block";
    link.style.width = "100%";
    link.target = "_blank";
    link.href = url;

    link.appendChild(div);

    return link;
  }

  //NOTE - Create Link Menu

  makeLinkMenu(label, callback) {
    const linkMenu = this.clonedLink.cloneNode(true);
    const linkLabel = linkMenu.querySelector("div");
    if (linkLabel) {
      linkLabel.innerHTML = label;
      linkMenu.addEventListener("click", () => {
        if (typeof callback === "function") callback();
      });
      return linkMenu;
    } else {
      return null;
    }
  }

  //NOTE - Build Toggles

  makeToggleEntry(label, setting, callback) {
    const toggle = this.createToggle(label, setting, callback);
    return toggle === null ? null : toggle;
  }

  createToggle(label, toggleSetting, callback) {
    const toggle = this.clonedToggle.cloneNode(true);
    const toggleDiv = toggle.querySelector("div");

    if (toggleDiv) {
      toggleDiv.innerHTML = label;

      const toggleSwitch = toggle.querySelector(`.base-toggle`);

      if (toggleSwitch) {
        const isEnabled = toggleSwitch.classList.contains("toggled-on");
        if (isEnabled !== toggleSetting)
          toggleSwitch.classList.toggle("toggled-on", toggleSetting);

        toggleSwitch.addEventListener("click", () => {
          toggleSwitch.classList.toggle("toggled-on");
          if (typeof callback === "function") callback();
        });

        return toggle;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  //NOTE - Build Sub Menus

  makeSubMenuEntry(label, callback) {
    const subMenu = this.createSubMenu(label, callback);
    return subMenu === null ? null : subMenu;
  }

  createSubMenu(label, callback) {
    const subMenu = this.clonedSubMenu.cloneNode(true);
    const subMenuDiv = subMenu.querySelector("div");

    if (subMenuDiv) {
      subMenuDiv.innerHTML = label;

      subMenu.addEventListener("click", () => {
        if (typeof callback === "function") callback();
      });

      return subMenu;
    } else {
      return null;
    }
  }

  //NOTE - Handle Entires

  addEntry(entry) {
    if (entry !== null) this.settingsList.push(entry);
  }

  clearMenuEntries() {
    const chatSettingsList = this.getChatSettingsList();
    chatSettingsList.innerHTML = "";
  }

  updateMenuEntries(flag = true) {
    const chatSettingsList = this.getChatSettingsList();
    this.settingsList.forEach((entry) => {
      chatSettingsList.appendChild(entry);
    });
    this.isMyMenu = flag;

    let parent = document.querySelector(".chat-actions-popup");
    if (parent) {
      if (this.isMyMenu) {
        parent.classList.add("mifu-menu-container");
      } else {
        parent.classList.remove("mifu-menu-container");
      }
    }
  }

  //NOTE - Core Functions

  setMenuHeaderId() {
    const chatSettings = this.getChatSettings();
    const myHeaderId = "mifu-chat-settings-header";
    const myHeaderElm = document.getElementById(myHeaderId);
    if (!myHeaderElm) {
      // const divs = Array.from(chatSettings.getElementsByTagName('div'));
      // const header = divs.find(div => div.innerHTML === 'Chat Settings');
      const header = chatSettings.querySelector(
        "div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)"
      );
      if (header) header.id = myHeaderId;
    }
  }

  updateMenuHeader(label, flag) {
    const myHeaderId = "mifu-chat-settings-header";
    const myHeader = document.getElementById(myHeaderId);
    const chatSettingsList = this.getChatSettingsList();

    if (myHeader) {
      if (!document.getElementById("mifu-submenu-back") && flag) {
        myHeader.parentNode.insertBefore(
          this.getSubMenuBackButton(() => {
            myHeader.innerHTML = "KickAssist Extension Menu";
            this.clearMenuEntries();

            this.settingsList = this.previousList;

            this.settingsList.forEach((entry) => {
              chatSettingsList.appendChild(entry);
            });
            document.getElementById("mifu-submenu-back").remove();
          }),
          myHeader
        );
      }

      this.previousList = this.settingsList;
      this.settingsList = [];

      myHeader.innerHTML = label;
      this.clearMenuEntries();
    }
  }

  cloneSettingsItems() {
    const chatSettings = this.getChatSettings();
    if (chatSettings) {
      const chatSettingsList = this.getChatSettingsList();
      if (chatSettingsList) {
        if (
          this.clonedToggle === null ||
          this.clonedSubMenu === null ||
          this.clonedLink == null
        ) {
          const allSettings = document.querySelectorAll(".chat-actions-item");
          for (const setting of allSettings) {
            // const innerDiv = setting.querySelector('div');
            // if (innerDiv && innerDiv.innerText == 'Show Gift Subs Leaderboard') {
            //     if (this.clonedToggle === null) this.clonedToggle = setting;
            // } else if (innerDiv && innerDiv.innerText == 'Muted Users') {
            //     if (this.clonedSubMenu === null) this.clonedSubMenu = setting;
            // }
            if (setting.querySelector(`.base-toggle`)) {
              if (this.clonedToggle === null) this.clonedToggle = setting;
            } else if (
              setting.querySelector(
                'path[d="m4.5 12.9l4.9-4.9-4.9-4.9 1.1-1.1 6 6-6 6z"]'
              )
            ) {
              if (this.clonedSubMenu === null) this.clonedSubMenu = setting;
            } else if (
              setting.querySelector('path[d="M3.5 12.5V2H2V14H14V12.5H3.5Z"]')
            ) {
              if (this.clonedLink === null) this.clonedLink = setting;
            }
          }
          if (this.clonedLink === null && this.clonedSubMenu !== null)
            this.clonedLink = this.clonedSubMenu;
          return (
            this.clonedToggle !== null &&
            this.clonedSubMenu !== null &&
            this.clonedLink !== null
          );
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  getSubMenuBackButton(callback) {
    const button = document.createElement("button");

    button.innerHTML = /*HTML*/ `
                <div data-v-f8fbb063="" class="base-icon icon" style="width: 16px; height: 16px;">
                    <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                        <path id="Layer" class="s0" d="m11.1 3.1l-4.9 4.9 4.9 4.9-1.1 1.1-6-6 6-6z">
                        </path>
                    </svg>
                </div>
            `;

    button.id = "mifu-submenu-back";
    button.setAttribute("data-v-f8fbb063", "");
    button.setAttribute("data-v-c5b639f8", "");
    button.classList.add(
      "-ml-2",
      "variant-text",
      "size-sm",
      "base-icon-button",
      "-ml-2"
    );

    button.addEventListener("click", () => {
      if (typeof callback === "function") callback();
    });

    return button;
  }
}

class VODControls {
  main;

  vars;

  constructor(main) {
    this.main = main;
    this.vars = {};
  }

  getMiFu() {
    return this.main.mifu;
  }

  getVodDatabase() {
    return this.main.vodDatabase;
  }

  debug(message) {
    this.main.debug(message);
  }

  insert() {
    setInterval(() => {
      this.checkToRun();
    }, 1000);
    this.debug("VOD Controls Ready!");
  }

  checkToRun() {
    const isVODPage = window.location.href.includes("/video/");
    if (isVODPage) this.start();
  }

  async start() {
    const myID = "mifu-vod-check";

    if (document.getElementById(myID)) return;

    const video = document.querySelector('video[src^="blob:"]');

    if (!video) return;

    video.id = myID;

    this.setVars();
    this.appendCSS();
    this.addElements(video);
    this.addTimeListener(video);

    const url = window.location.href;
    const urlObject = new URL(url);
    const path = urlObject.pathname;

    this.vars.vodID = path.split("/video/")[1];

    if (this.vars.vodID !== null) {
      const vodTime = video.currentTime;
      await this.getVodDatabase().createDatabase();
      const vodDBisValid = await this.getVodDatabase().addVod(
        this.vars.vodID,
        vodTime
      );

      if (vodDBisValid) {
        const vodSavedTime = await this.getVodDatabase().getTime(
          this.vars.vodID
        );
        if (vodSavedTime !== null) video.currentTime = vodSavedTime;
      }
    }
  }

  setVars() {
    this.vars.lastSign = 0;
    this.vars.totalSeconds = 0;
  }

  addElements(video) {
    this.addKeybinds(video);
    this.addButtons(video);
    this.addPopup(video);
  }

  addPopup(video) {
    this.vars.popup = document.createElement("div");
    this.vars.popup.className = "mifu-vod-popup";
    this.vars.popup.style.display = "none";

    const parent = video.parentElement;
    parent.appendChild(this.vars.popup);
  }

  showPopup(seconds) {
    const secondsSign = Math.sign(seconds);

    if (this.vars.lastSign !== 0 && this.vars.lastSign !== secondsSign) {
      this.vars.totalSeconds = 0;
    }

    this.vars.totalSeconds += Math.abs(seconds);
    this.vars.lastSign = secondsSign;

    if (seconds < 0) {
      const rePhrase = `Second${this.vars.totalSeconds !== -1 ? "s" : ""}`;
      this.vars.popup.textContent = `Jumped Back ${Math.abs(
        this.vars.totalSeconds
      )} ${rePhrase}`;
    } else {
      const rePhrase = `Second${this.vars.totalSeconds !== 1 ? "s" : ""}`;
      this.vars.popup.textContent = `Jumped Ahead ${this.vars.totalSeconds} ${rePhrase}`;
    }

    this.vars.popup.style.display = "block";
    clearTimeout(this.vars.popup.hideTimer);

    this.vars.popup.hideTimer = setTimeout(() => {
      this.vars.popup.style.display = "none";
      this.vars.totalSeconds = 0;
      this.vars.lastSign = 0;
    }, 1000);
  }

  addKeybinds(video) {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "Space":
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
          break;
        default:
          break;
      }
    });
  }

  addButtons(video, buttons = []) {
    buttons.push(this.createButton("Skip 10s", "10", video));
    buttons.push(this.createButton("Skip 5s", "5", video));
    buttons.push(this.createButton("Skip 1s", "1", video));
    buttons.push(this.createButton("Back 1s", "-1", video));
    buttons.push(this.createButton("Back 5s", "-5", video));
    buttons.push(this.createButton("Back 10s", "-10", video));

    const playButton = document.querySelector(".vjs-play-control");

    if (playButton) {
      buttons.forEach((buttonElement) => {
        playButton.parentNode.insertBefore(
          buttonElement,
          playButton.nextSibling
        );
      });
    }

    const volume = document.querySelector(".vjs-volume-panel");
    if (volume) this.addSpeedSelectMenu(volume);
  }

  addSpeedSelectMenu(liveDisplay) {
    const speedMenu = document.createElement("div");
    speedMenu.classList.add("mifu-vod-speed-menu");
    speedMenu.innerHTML = `
                    <label for="mifu-vod-speedSelect">Playback Speed:</label>
                    <select id="mifu-vod-speedSelect">
                        <option value="0.1">0.10x</option>
                        <option value="0.25">0.25x</option>
                        <option value="0.5">0.50x</option>
                        <option value="0.75">0.75x</option>
                        <option value="1.0" selected>1.00x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.50x</option>
                        <option value="2.0">2.00x</option>
                        <option value="2.5">2.50x</option>
                        <option value="3.0">3.00x</option>
                    </select>
                `;
    liveDisplay.parentNode.insertBefore(speedMenu, liveDisplay.nextSibling);
  }

  addTimeListener(video) {
    const speedSelect = document.getElementById("mifu-vod-speedSelect");
    speedSelect.addEventListener("change", () => {
      const selectedSpeed = parseFloat(speedSelect.value);
      if (isFinite(selectedSpeed)) {
        video.playbackRate = selectedSpeed;
      }
    });

    video.addEventListener("timeupdate", () => {
      try {
        const currentTime = video.currentTime;
        const totalDuration = video.duration;

        this.getVodDatabase().saveTime(this.vars.vodID, currentTime);

        const currentHours = Math.floor(currentTime / 3600);
        const currentMinutes = Math.floor((currentTime % 3600) / 60);
        const currentSeconds = Math.floor(currentTime % 60);

        const totalHours = Math.floor(totalDuration / 3600);
        const totalMinutes = Math.floor((totalDuration % 3600) / 60);
        const totalSeconds = Math.floor(totalDuration % 60);

        const currentTimeStr =
          (currentHours > 0 ? currentHours + ":" : "00:") +
          (currentMinutes > 0 || currentHours > 0
            ? (currentMinutes < 10 ? "0" : "") + currentMinutes + ":"
            : "00:") +
          (currentSeconds < 10 ? "0" : "") +
          currentSeconds;

        const totalDurationStr =
          (totalHours > 0 ? totalHours + ":" : "0:") +
          (totalMinutes > 0 || totalHours > 0
            ? (totalMinutes < 10 ? "0" : "") + totalMinutes + ":"
            : "") +
          (totalSeconds < 10 ? "0" : "") +
          totalSeconds;

        const fraction = (currentTime / totalDuration) * 100;

        const formattedTime = `${currentTimeStr} / ${totalDurationStr} (${fraction.toFixed(
          2
        )}%)`;

        const remainingTimeElement = document.querySelector(
          ".vjs-remaining-time"
        );
        if (remainingTimeElement)
          remainingTimeElement.innerHTML = formattedTime;
      } catch (error) {}
    });
  }

  createButton(label, seconds, video) {
    const button = document.createElement("button");

    button.className = "vjs-button vjs-control vjs-button";
    button.type = "button";
    button.ariaDisabled = "false";
    button.innerHTML = /*HTML*/ `
                <span class="vjs-icon-placeholder" id="vod-control-${label
                  .replace(/\s/g, "")
                  .toLowerCase()
                  .slice(0, -1)}" aria-hidden="true"></span>
                <span class="vjs-control-text" aria-live="polite">${label}</span>
            `;

    button.addEventListener("click", () => {
      video.currentTime += parseInt(seconds);
      this.showPopup(seconds);
    });

    return button;
  }

  appendCSS() {
    const styleID = "mifu-vod-controls-style";

    if (!document.getElementById(styleID)) {
      const style = document.createElement("style");

      style.id = styleID;

      style.textContent = /*CSS*/ `
                    .mifu-vod-popup {
                        position: absolute;
                        bottom: 50px;
                        left: 50%;
                        transform: translateX(-50%);
                        background-color: rgba(0, 0, 0, 0.8);
                        color: #53fc18;
                        padding: 5px;
                        font-size: 1rem;
                        border-radius: 4px;
                        transition: opacity 0.5s;
                        z-index: 9999;
                        display: none;
                    }
    
                    .mifu-vod-speed-menu {
                        background-color: transparent;
                        padding: 10px;
                        border: none;
                        border-radius: 5px;
                        margin-left: 0.5rem;
                        margin-right: 0.5rem;
                        font-size: 1rem;
                    }
                    #mifu-vod-speedSelect {
                        background-color: rgb(25, 27, 31);
                        border: 1px solid rgb(36, 39, 44);
                        color: #53fc18;
                    }
                    #mifu-vod-speedSelect option {
                        text-align: center;
                        color: #53fc18;
                    }
    
                    #vod-control-back10::before {
                        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23FFFFFF" d="M493.6 445c-11.2 5.3-24.5 3.6-34.1-4.4L288 297.7V416c0 12.4-7.2 23.7-18.4 29s-24.5 3.6-34.1-4.4L64 297.7V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V96C0 78.3 14.3 64 32 64s32 14.3 32 32V214.3L235.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S288 83.6 288 96V214.3L459.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S512 83.6 512 96V416c0 12.4-7.2 23.7-18.4 29z"></path></svg>');
                    }
                    #vod-control-back10:hover::before {
                        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%2353FC18" d="M493.6 445c-11.2 5.3-24.5 3.6-34.1-4.4L288 297.7V416c0 12.4-7.2 23.7-18.4 29s-24.5 3.6-34.1-4.4L64 297.7V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V96C0 78.3 14.3 64 32 64s32 14.3 32 32V214.3L235.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S288 83.6 288 96V214.3L459.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S512 83.6 512 96V416c0 12.4-7.2 23.7-18.4 29z"></path></svg>');
                    }
    
                    #vod-control-back5::before {
                        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23FFFFFF" d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z"></path></svg>');
                    }
                    #vod-control-back5:hover::before {
                        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%2353FC18" d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z"></path></svg>');
                    }
    
                    #vod-control-back1::before {
                        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23FFFFFF" d="M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241V96c0-17.7-14.3-32-32-32S0 78.3 0 96V416c0 17.7 14.3 32 32 32s32-14.3 32-32V271l11.5 9.6 192 160z"></path></svg>');
                    }
                    #vod-control-back1:hover::before {
                        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%2353FC18" d="M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241V96c0-17.7-14.3-32-32-32S0 78.3 0 96V416c0 17.7 14.3 32 32 32s32-14.3 32-32V271l11.5 9.6 192 160z"></path></svg>');
                    }
    
                    #vod-control-skip1::before {
                        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23FFFFFF" d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z"></path></svg>');
                    }
                    #vod-control-skip1:hover::before {
                        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%2353FC18" d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z"></path></svg>');
                    }
    
                    #vod-control-skip5::before {
                        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23FFFFFF" d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z"></path></svg>');
                    }
                    #vod-control-skip5:hover::before {
                        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%2353FC18" d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z"></path></svg>');
                    }
    
                    #vod-control-skip10::before {
                        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23FFFFFF" d="M18.4 445c11.2 5.3 24.5 3.6 34.1-4.4L224 297.7V416c0 12.4 7.2 23.7 18.4 29s24.5 3.6 34.1-4.4L448 297.7V416c0 17.7 14.3 32 32 32s32-14.3 32-32V96c0-17.7-14.3-32-32-32s-32 14.3-32 32V214.3L276.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S224 83.6 224 96V214.3L52.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S0 83.6 0 96V416c0 12.4 7.2 23.7 18.4 29z"></path></svg>');
                    }
                    #vod-control-skip10:hover::before {
                        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%2353FC18" d="M18.4 445c11.2 5.3 24.5 3.6 34.1-4.4L224 297.7V416c0 12.4 7.2 23.7 18.4 29s24.5 3.6 34.1-4.4L448 297.7V416c0 17.7 14.3 32 32 32s32-14.3 32-32V96c0-17.7-14.3-32-32-32s-32 14.3-32 32V214.3L276.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S224 83.6 224 96V214.3L52.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S0 83.6 0 96V416c0 12.4 7.2 23.7 18.4 29z"></path></svg>');
                    }
    
                    span[id*='vod-control-']::before {
                        position: absolute !important;
                        content: '' !important;
                        width: 1em !important;
                        height: 1em !important;
                        top: 50% !important;
                        left: 50% !important;
                        font-size: 1.25rem !important;
                        line-height: 2.5rem !important;
                        background-repeat: no-repeat !important;
                        transform: translate(-50%, -50%) !important;
                    }
    
                    .video-js .vjs-time-tooltip,
                    .video-js .vjs-load-progress {
                        display: none !important;
                    }
                    
                    .vjs-mouse-display .vjs-time-tooltip {
                        display: block !important;
                        color: #000 !important;
                        background-color: #fffc !important;
                    }
                `
        .replace(/\s+/g, " ")
        .trim();
      document.head.appendChild(style);
    }
  }
}

class VODDatabase {
  mifu;

  constructor(mifu) {
    this.mifu = mifu;
  }

  getMiFu() {
    return this.mifu;
  }

  getMainDatabase() {
    return this.getMiFu().database;
  }

  getDatebaseName() {
    return "KickAssistDatabase";
  }

  isIndexedDBSupported() {
    return "indexedDB" in window;
  }

  debug(message) {
    this.mifu.debug(message);
  }

  async createDatabase() {
    await this.getMainDatabase().createDatabase();
  }

  async addVod(vodID, timeStamp) {
    if (this.isIndexedDBSupported()) {
      return await this.addToIndexedDB(vodID, timeStamp);
    }
  }

  async addToIndexedDB(vodID, timeStamp) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.getDatebaseName());

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("vods", "readwrite");
        const store = transaction.objectStore("vods");
        const getRequest = store.get(vodID);

        getRequest.onsuccess = async (event) => {
          const curData = event.target.result;
          if (!curData) {
            const addRequest = store.add({
              id: vodID,
              time: timeStamp,
            });
            addRequest.onsuccess = () => {
              this.debug("Database VOD Added!");
              resolve(true);
            };
          } else {
            this.debug("Database VOD Found!");
            resolve(true);
          }
        };
        getRequest.onerror = () => {
          this.debug("Database Creation Error!");
          resolve(false);
        };
      };
    });
  }

  async saveTime(vodID, timeStamp) {
    if (this.isIndexedDBSupported()) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.getDatebaseName());

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction("vods", "readwrite");
          const store = transaction.objectStore("vods");
          const getRequest = store.get(vodID);

          getRequest.onsuccess = (event) => {
            const vodData = event.target.result;
            if (vodData) {
              vodData.time = timeStamp;
              const updateRequest = store.put(vodData);

              updateRequest.onsuccess = () => {
                // this.debug('Database VOD Saved!');
                resolve(true);
              };
            } else {
              this.debug("Database VOD Update Error!");
              resolve(false);
            }
          };

          getRequest.onerror = () => {
            resolve(false);
          };
        };

        request.onerror = () => {
          resolve(false);
        };
      });
    }
  }

  async getTime(vodID) {
    if (this.isIndexedDBSupported()) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.getDatebaseName());

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction("vods", "readonly");
          const store = transaction.objectStore("vods");
          const getRequest = store.get(vodID);

          getRequest.onsuccess = (event) => {
            const vodData = event.target.result;
            resolve(vodData ? vodData.time : null);
          };

          getRequest.onerror = () => {
            resolve(null);
          };
        };

        request.onerror = () => {
          resolve(null);
        };
      });
    }
  }
}

class Main {
  mifu;

  badges;
  channel;
  channelData;
  cssEdits;
  database;
  messageInput;
  mouseMove;
  mutationProcessor;
  outlines;
  replayBuffer;
  settings;
  settingsMenu;
  vodControls;
  vodDatabase;

  // mifuEventHandler;
  // newMenu;

  constructor(mifu) {
    this.mifu = mifu;
    // this.mifuEventHandler = this.mifuEventProcessor.bind(this);
  }

  // mifuEventProcessor (event) {
  //     console.log(`>> ${ event }`);
  //     console.log(event.detail);
  // }

  // addMifuEventListener () {
  //     document.addEventListener('myCustomEvent', this.mifuEventHandler);
  // }

  // removeMifuEventListener () {
  //     document.removeEventListener('myCustomEvent', this.mifuEventHandler);
  // }

  async init() {
    await this.preStart();
    await this.loadModules();
    await this.start();
  }

  async preStart() {
    this.mifu.lastUrl = window.location.href;
    this.mifu.debugMode = true;
    this.mifu.executed = false;
    this.mifu.dbLoaded = false;
    this.mifu.intervals = [];
    this.debug(`Core Loaded!`);
  }

  async loadModules() {
    // this.newMenu = new NewMenu(this);
    this.badges = new Badges(this);
    this.channel = new Channel(this);
    this.channelData = new ChannelData(this);
    this.cssEdits = new CssEdits();
    this.database = new Database(this);
    this.messageInput = new MessageInput(this);
    this.mouseMove = new MouseMove(this);
    this.mutationProcessor = new MutationProcessor(this);
    this.outlines = new Outlines(this);
    this.replayBuffer = new ReplayBuffer_video(this);
    this.settings = new Settings(this);
    this.settingsMenu = new SettingsMenu(this);
    this.vodControls = new VODControls(this);
    this.vodDatabase = new VODDatabase(this);
    this.debug(`Modules Loaded!`);
  }

  async start() {
    // this.addMifuEventListener();
    await this.badges.loadExtensionSupporters();
    this.debug(`Starting Intervals!`, true);
    this.replayBuffer.insert();
    this.settingsMenu.insert();
    this.vodControls.insert();
    this.debug(`Starting Listeners!`, true);
    this.mouseMove.addListener();
    this.startObserver();
    this.mainStart();
  }

  async run() {
    this.mifu.executed = true;
    clearInterval(this.mifu.master);
    this.debug("Checks Done! Running...", true);

    await this.varSet();

    this.channel.openChatWindow();

    this.mifu.dbLoaded = await this.loadDatabase();

    if (this.mifu.dbLoaded) {
      await this.settings.startSettings();
      this.debugLine();
    }
    this.debug(this.mifu.stopTimeTrack());
  }

  async varSet() {
    this.settings = new Settings(this);
    await this.settings.init();
    this.channel.setName();
    this.cssEdits.init();
    this.messageInput.init();
  }

  async reset() {
    if (this.mifu.dbLoaded) {
      this.mifu.dbLoaded = false;
      await this.settings.stopSettings();
      this.debug("Extension Reset!");
    }

    this.mifu.executed = false;
    clearInterval(this.mifu.master);
  }

  async loadDatabase() {
    await this.database.createDatabase();

    const isValid = await this.database.addChannel(
      this.mifu.channelName,
      [],
      {},
      {}
    );
    if (isValid) {
      const settings = await this.database.getSettings(this.mifu.channelName);
      await this.settings.initSaveLoadSettings(settings);

      const colors = await this.database.getColors(this.mifu.channelName);
      await this.settings.initSaveLoadColors(colors);

      this.debugLine();
      this.debug("Database Ready!");
      return true;
    } else {
      return false;
    }
  }

  //NOTE - core observer

  startObserver() {
    this.mifu.observer = new MutationObserver((mutations) => {
      this.onObserve(mutations);
    });
    this.mifu.observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
    });
    this.debug("Page Observer Ready!");
    // this.newMenu.inject();
  }

  onObserve(mutations) {
    // this.newMenu.inject();
    this.mutationProcessor.processMutations(mutations);
    if (window.location.href === this.mifu.lastUrl) return;
    this.onUrlChange(window.location.href, this.mifu.lastUrl);
  }

  async onUrlChange(newUrl, oldUrl) {
    this.debugLine();
    this.debug(`URL Change Detected!`);
    this.debug(`Old URL: ${oldUrl}`);
    this.debug(`New URL: ${newUrl}`);
    this.mifu.lastUrl = newUrl;
    await this.reset();
    this.restart();
  }

  //NOTE - core start

  restart() {
    this.mifu.startTimeTrack();
    this.mainStart();
  }

  mainStart() {
    this.mifu.master = setInterval(() => {
      this.checkAndRun();
    }, 1000);
  }
  checkAndRun() {
    if (!this.mifu.executed && this.messageInput.getField()) this.run();
  }

  //NOTE - debugging

  debug(message, withLines = false) {
    if (!this.mifu.debugMode) return;

    const formatted = `%cKickAssist ->%c ${message}`;
    const args = [formatted, "color: #3cf051;", ""];

    if (withLines) {
      this.doubleLineLog(args);
    } else {
      console.log(...args);
    }
  }

  debugLine() {
    console.log("-".repeat(40));
  }

  doubleLineLog(args) {
    this.debugLine();
    console.log(...args);
    this.debugLine();
  }
}

function echo() {
  let mifuEchoInterval = null;

  const mifuEchoEdit = () => {
    clearInterval(mifuEchoInterval);

    function calculateTime(expiryTimestamp) {
      const expiryDate = new Date(expiryTimestamp);
      const currentDate = new Date();

      const timeDifferenceMilliseconds = expiryDate - currentDate;
      const minutesDifference = Math.ceil(
        timeDifferenceMilliseconds / (1000 * 60)
      );

      if (minutesDifference >= 10080) {
        const weeksDifference = Math.floor(minutesDifference / 10080);
        return ` for ${weeksDifference} ${
          weeksDifference === 1 ? "week" : "weeks"
        }`;
      } else if (minutesDifference >= 1440) {
        const daysDifference = Math.floor(minutesDifference / 1440);
        return ` for ${daysDifference} ${
          daysDifference === 1 ? "day" : "days"
        }`;
      } else if (minutesDifference >= 60) {
        const hoursDifference = Math.floor(minutesDifference / 60);
        return ` for ${hoursDifference} ${
          hoursDifference === 1 ? "hour" : "hours"
        }`;
      } else {
        return ` for ${minutesDifference} ${
          minutesDifference === 1 ? "minute" : "minutes"
        }`;
      }
    }

    function shouldScroll() {
      const chatroom = document.getElementById("chatroom");
      if (!chatroom) return true;

      for (let div of chatroom.querySelectorAll("div")) {
        for (let svg of div.querySelectorAll("svg")) {
          const paths = svg.querySelectorAll("path");
          if (paths.length === 2) {
            const [path1, path2] = paths;
            if (
              path1.getAttribute("d") === "M7 3H3V13H7V3Z" &&
              path2.getAttribute("d") === "M13 3H9V13H13V3Z"
            ) {
              return false;
            }
          }
        }
      }
      return true;
    }

    function triggerScroll() {
      const chatroom = document.getElementById("chatroom");
      if (chatroom) {
        const section = chatroom.querySelector(".overflow-y-scroll");
        if (section) section.scroll(0, section.scrollHeight);
      }
    }

    function insertEvent(type, user, mod, time) {
      let eventNoticeHtml = "";
      switch (type) {
        case "banned":
          eventNoticeHtml = /*HTML*/ `
                        <div data-v-8960167e="" data-chat-entry="" class="mt-0.5"><div data-v-2edcbc1a="" class="chatroom-event-ban__container !break-normal"><div data-v-2edcbc1a="" class="base-icon chatroom-event-ban__icon" style="width: 16px; height: 16px;"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 1C4.135 1 1 4.135 1 8C1 11.865 4.135 15 8 15C11.865 15 15 11.865 15 8C15 4.135 11.865 1 8 1ZM4.99 12.425L3.575 11.01L11.01 3.575L12.425 4.99L4.99 12.425Z" fill="currentColor"></path></svg></div><span data-v-2edcbc1a="" class="chatroom-event-ban__label"><span data-v-2edcbc1a="" class="text-white">${mod}</span> banned <span data-v-2edcbc1a="" class="text-white">${user}</span></span></div></div>
                        `;
          break;
        case "timedout":
          eventNoticeHtml = /*HTML*/ `
                        <div data-v-8960167e="" data-chat-entry="" class="mt-0.5"><div data-v-2edcbc1a="" class="chatroom-event-ban__container !break-normal"><div data-v-2edcbc1a="" class="base-icon chatroom-event-ban__icon" style="width: 16px; height: 16px;"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 1C4.135 1 1 4.135 1 8C1 8.185 1.015 8.37 1.03 8.55L1.065 8.515L2.86 10.31L4.655 8.515L7.485 11.345L5.69 13.14L7.485 14.935L7.45 14.97C7.63 14.985 7.815 15 8 15C11.865 15 15 11.865 15 8C15 4.135 11.865 1 8 1ZM10.165 11.315L7.25 8.305V4.65H8.75V7.695L11.24 10.27L10.165 11.315Z" fill="currentColor"></path><path d="M5.715 11.345L4.655 10.285L2.855 12.08L1.06 10.285L0 11.345L1.795 13.145L0 14.94L1.06 16L2.855 14.205L4.655 16L5.715 14.94L3.92 13.145L5.715 11.345Z" fill="currentColor"></path></svg></div><span data-v-2edcbc1a="" class="chatroom-event-ban__label"><span data-v-2edcbc1a=""><span data-v-2edcbc1a="" class="text-white">${mod}</span> timed out <span data-v-2edcbc1a="" class="text-white">${user}</span> for <span data-v-2edcbc1a="" class="chatroom-event-ban__label__highlight">${time}</span></span></span></div></div>
                        `;
          break;
        case "unbanned":
          eventNoticeHtml = /*HTML*/ `
                        <div data-v-8960167e="" data-chat-entry="" class="mt-0.5"><div data-v-3b70c002="" class="chatroom-event-unban__container !break-normal"><div data-v-3b70c002="" class="base-icon chatroom-event-unban__icon" style="width: 16px; height: 16px;"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 1.71997C6.225 1.71997 4.625 2.45497 3.48 3.63997L1.72 1.87997V6.74997H6.59L6.145 6.30497L4.9 5.05997C5.675 4.23497 6.78 3.71997 8 3.71997C10.355 3.71997 12.275 5.63997 12.275 7.99997C12.275 8.91497 11.985 9.76997 11.485 10.465L8.475 7.45497L7.97 7.96497L7.065 8.86997L7.095 8.90497L9.98 11.785C9.385 12.1 8.715 12.275 8 12.275C6.82 12.275 5.755 11.795 4.98 11.02L3.565 12.435C4.7 13.575 6.265 14.275 8 14.275C11.465 14.275 14.275 11.465 14.275 7.99997C14.275 4.53497 11.465 1.71997 8 1.71997Z" fill="currentColor"></path></svg></div><span data-v-3b70c002="" class="chatroom-event-unban__label"><span data-v-3b70c002="" class="text-white">${mod}</span> unbanned <span data-v-3b70c002="" class="text-white">${user}</span></span></div></div>
                        `;
          break;
        case "cleared":
          eventNoticeHtml = /*HTML*/ `
                        <div data-v-8960167e="" data-chat-entry="" class="mt-0.5"><div data-v-2edcbc1a="" class="chatroom-event-ban__container !break-normal"><div data-v-2edcbc1a="" class="base-icon chatroom-event-ban__icon" style="width: 16px; height: 16px;"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 1C4.135 1 1 4.135 1 8C1 11.865 4.135 15 8 15C11.865 15 15 11.865 15 8C15 4.135 11.865 1 8 1ZM4.99 12.425L3.575 11.01L11.01 3.575L12.425 4.99L4.99 12.425Z" fill="currentColor"></path></svg></div><span data-v-2edcbc1a="" class="chatroom-event-ban__label"><span data-v-2edcbc1a="" class="text-white">Chat Clear Event Prevented by KickAssist!</span></span></div></div>
                        `;
        default:
          break;
      }

      const chatroomElement = document.getElementById("chatroom");
      if (chatroomElement) {
        const overflowYScrollElement =
          chatroomElement.querySelector(".overflow-y-scroll");
        if (overflowYScrollElement) {
          const newElement = document.createElement("div");
          newElement.innerHTML = eventNoticeHtml;
          const lastChild = overflowYScrollElement.lastChild;
          if (lastChild) {
            overflowYScrollElement.insertBefore(newElement, lastChild);
          } else {
            overflowYScrollElement.appendChild(newElement);
          }
          setTimeout(() => {
            try {
              overflowYScrollElement.removeChild(newElement);
            } catch (error) {
              /* ignore */
            }
          }, 60000);
        }
      }
    }

    let addedEvents = 0;

    function addAndRemove(callbackArray) {
      if (callbackArray.length > 1) callbackArray.splice(1);
      addedEvents++;
    }

    if (typeof window.Echo !== "undefined") {
      const connector = window.Echo.connector;

      if (connector && connector.channels) {
        const connectors = connector.channels;
        const channels = Object.keys(connectors);

        for (const channel of channels) {
          if (channel.endsWith(".v2")) {
            try {
              const subscriptions = connectors[channel].subscription;
              const callbacks = subscriptions.callbacks._callbacks;

              Object.keys(callbacks).forEach((callbackName) => {
                if (callbackName === "_App\\Events\\ChatroomClearEvent") {
                  if (
                    callbacks[callbackName][0].id !== "mifu-cleared-chat-event"
                  ) {
                    callbacks[callbackName][0].id = "mifu-cleared-chat-event";
                    callbacks[callbackName][0].fn = async (event) => {
                      const shouldTriggerScroll = shouldScroll();
                      insertEvent("cleared", null, null, null);
                      if (shouldTriggerScroll) triggerScroll();
                    };
                  }
                  addAndRemove(callbacks[callbackName]);
                } else if (
                  callbackName === "_App\\Events\\MessageDeletedEvent"
                ) {
                  if (
                    callbacks[callbackName][0].id !==
                    "mifu-deleted-message-event"
                  ) {
                    callbacks[callbackName][0].id =
                      "mifu-deleted-message-event";
                    callbacks[callbackName][0].fn = async (event) => {
                      const shouldTriggerScroll = shouldScroll();
                      const element = document.querySelector(
                        `[data-chat-entry="${event.message.id}"]`
                      );
                      if (element) {
                        element.classList.add("mifu-deleted-message");
                        element.insertAdjacentHTML(
                          "beforeend",
                          /*HTML*/ `
                                                        <div id="mifu-event-from">Message Deleted</div>
                                                    `
                        );
                      }
                      if (shouldTriggerScroll) triggerScroll();
                    };
                  }
                  addAndRemove(callbacks[callbackName]);
                } else if (callbackName === "_App\\Events\\UserBannedEvent") {
                  if (
                    callbacks[callbackName][0].id !== "mifu-banned-user-event"
                  ) {
                    callbacks[callbackName][0].id = "mifu-banned-user-event";
                    callbacks[callbackName][0].fn = async (event) => {
                      const shouldTriggerScroll = shouldScroll();
                      const names = document.querySelectorAll(
                        ".chat-entry-username"
                      );
                      const entryType =
                        event.expires_at === undefined ? "banned" : "timedout";
                      const expiresTime =
                        event.expires_at !== undefined
                          ? calculateTime(event.expires_at)
                          : "";

                      for (let username of names) {
                        if (username.textContent === event.user.username) {
                          const chatEntry =
                            username.closest("[data-chat-entry]");

                          if (chatEntry) {
                            chatEntry.classList.remove("mifu-deleted-message");
                            chatEntry.classList.remove("mifu-unbanned-message");
                            chatEntry.classList.add(
                              `mifu-${entryType}-message`
                            );

                            if (event.banned_by.username) {
                              const eventLabelPrefix =
                                entryType === "banned"
                                  ? "Permanently Banned"
                                  : "Timed Out";
                              const eventLabelDetails = `By: ${event.banned_by.username}${expiresTime}`;

                              const hasEventFrom =
                                chatEntry.querySelector("#mifu-event-from");
                              if (!hasEventFrom) {
                                chatEntry.insertAdjacentHTML(
                                  "beforeend",
                                  /*HTML*/ `
                                                                        <div id="mifu-event-from">${eventLabelPrefix} ${eventLabelDetails}</div>
                                                                    `
                                );
                              } else {
                                hasEventFrom.innerHTML = `${eventLabelPrefix} ${eventLabelDetails}`;
                              }
                            }
                          }
                        }
                      }

                      insertEvent(
                        entryType,
                        event.user.username,
                        event.banned_by.username,
                        expiresTime
                      );
                      if (shouldTriggerScroll) triggerScroll();
                    };
                  }
                  addAndRemove(callbacks[callbackName]);
                } else if (callbackName === "_App\\Events\\UserUnbannedEvent") {
                  if (
                    callbacks[callbackName][0].id !== "mifu-unbanned-user-event"
                  ) {
                    callbacks[callbackName][0].id = "mifu-unbanned-user-event";
                    callbacks[callbackName][0].fn = async (event) => {
                      const shouldTriggerScroll = shouldScroll();
                      const names = document.querySelectorAll(
                        ".chat-entry-username"
                      );

                      for (let username of names) {
                        if (username.textContent === event.user.username) {
                          const chatEntry =
                            username.closest("[data-chat-entry]");
                          if (chatEntry) {
                            chatEntry.classList.remove("mifu-deleted-message");
                            chatEntry.classList.remove("mifu-banned-message");
                            chatEntry.classList.remove("mifu-timedout-message");
                            const eventFrom =
                              chatEntry.querySelector("#mifu-event-from");
                            if (eventFrom) {
                              const unbannedBy = event.unbanned_by.username;
                              if (unbannedBy !== undefined) {
                                chatEntry.classList.add(
                                  "mifu-unbanned-message"
                                );
                                eventFrom.innerHTML = `Unbanned By: ${unbannedBy}`;
                              } else {
                                eventFrom.remove();
                              }
                            }
                          }
                        }
                      }

                      insertEvent(
                        "unbanned",
                        event.user.username,
                        event.unbanned_by.username,
                        null
                      );
                      if (shouldTriggerScroll) triggerScroll();
                    };
                  }
                  addAndRemove(callbacks[callbackName]);
                }
              });
            } catch (error) {
              setTimeout(mifuEchoEdit, 1000);
            }
          }
        }
        if (addedEvents !== 4) {
          setTimeout(mifuEchoEdit, 1000);
        } else {
          clearInterval(mifuEchoInterval);
          mifuEchoInterval = setInterval(() => {
            mifuEchoEdit();
          }, 3000);
        }
      } else {
        setTimeout(mifuEchoEdit, 1000);
      }
    } else {
      setTimeout(mifuEchoEdit, 1000);
    }
  };

  const formatted = `%cKickAssist ->%c Echo Loaded!`;
  console.log(...[formatted, "color: #3cf051;", ""]);

  mifuEchoEdit();
}

var mifuMain = mifuMain || {};

(function (mifu) {
  mifu.startTimeTrack = function () {
    mifu.trackTime = performance.now();
  };

  mifu.stopTimeTrack = function () {
    if (mifu.trackTime !== undefined) {
      const endTime = performance.now();
      const durationMs = endTime - mifu.trackTime;

      let durationFormatted;

      if (durationMs >= 1000) {
        const durationSeconds = durationMs / 1000;
        durationFormatted = `${durationSeconds.toFixed(3)} seconds`;
      } else {
        durationFormatted = `${durationMs.toFixed(2)} ms`;
      }

      mifu.trackTime = undefined;

      return `Load Time: ${durationFormatted}`;
    }
  };

  mifu.getFilePath = function (file) {
    switch (mifu.browserType()) {
      case "Firefox":
        return browser.runtime.getURL(file);
      case "Chrome":
        return chrome.runtime.getURL(file);
      default:
        return file;
    }
  };

  mifu.loadModule = async function () {
    try {
      const script = document.createElement("script");
      script.src = echo;
      script.type = "application/javascript";
      document.head.prepend(script);

      new Main(mifu).init();
    } catch (error) {
      console.error("Error Loading MiFu Module:", error);
    }
  };

  mifu.startTimeTrack();
  mifu.loadModule();
})(mifuMain);

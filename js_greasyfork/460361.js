// ==UserScript==
// @match https://www.youtube.com/*
// @match https://www.youtube.com/live_chat*
// @version 0.7.2
// @run-at document-start
// @name Return YouTube Comment Username
// @name:ja YouTubeコメント欄の名前を元に戻す
// @description This script replaces the "handle" in the YouTube comments section to user name
// @description:ja YouTubeのコメント欄の名前をハンドル(@...)からユーザー名に書き換えます。
// @name:zh-CN 恢復 YouTube 评论用户名
// @name:zh-TW 恢復 YouTube 評論名稱
// @description:zh-TW 此腳本將 YouTube 評論部分中的“handle”替換為用戶名
// @description:zh-CN 此脚本将 YouTube 评论部分中的“handle”替换为用户名
// @author yakisova41
// @namespace https://yt-returnname-api.pages.dev/extension/
// @grant unsafeWindow
// @license MIT
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAWJAAAFiQFtaJ36AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABI5JREFUaIHVml1ok1cYx39v4pT6Ebdo0baoWCd+VsEPNqfthigOi0IZnRc1XgxFELwQBGE474eIV1UoOqsw9MILSzsv1G4wRQe1zG9RWdGWVBgSMGldrab/XTy2Sc2bj2aZSf5wyMk5zzn5P5/nzUkcSYzAcT4GAsDXwGpgHIWBIaAT+AU4idQ/MiPJGnwpeC5Qgbeg4LNh3vHkXxUAuUzbP4L1knAEfuARMD0/0ZE1eoElHmA3xUceoBz4zgN8k28m/wGbHUEfMCnfTLLE344gCnjyzSRLyEOhkV+2DM6dg5s34exZqKpKLV8AJTHWNm2SBgY0CgMD0saNydYMOQIl1a6iAmpqYOZMCIehsxNu3cqxyd9h3Djo6oJZsxLnnj2DefMgGn1/Ru4eqKyULlyQhoaUgBs3pMWLc2/95csTPyseVVWuHkhUYMUK6cULW9TWJgUCUk2NtGWLdOqUFI1KoZC0cGFuFVi6NLUC7kZ7TwGfT+ruNpINDZLjSAsWSFOmxGR27LANr13LjNj69bZPOjmPR3ryxJ38o0c2n1aBgwdtwZEj0rRpRlIyj1y/bv1AQLp6NZVbR7eWFqm11YyTTnbdOikSGU0+HJbWrk2axKMVuH/f4r6iQjp50jZ48EA6fTq2YXW1dPiw9XftSk+qtdVk79yR5s5NL19ZKR07Jl2+LDU2plszFHveHz8eFi2C7m4IBqG+3sa3b4fbt6GhAbxeePoUXr60uUnvDvCSEvD73atLSYm9VlVBRwds2wbt7cmrUTgM589DeTn09kIkkrp6jWjj95ul7t6VJk6MWdznk5Yssf7goOT1Ss3N9r6uztYGAqkTMB5v3kgHDiRas7zc9nU7B5qbpbIyVw/EzgHHgYEB6OuD0lLTfsYMOHMGVq0y70SjsHcvHD1qsnPmmMWmTnWv3wCzZ8PkySYfDMbG792D16+tv3o1tLRAWVlyS/f2wtatdhbF23+URu3tpvWGDVZtBgft/aVL0r59MauEQlJtbW7KZ2mpFAxm5r2eHmn69BRJXFdngl1dVj79fmn+/Nj8ypVSfb1VqFyQB6mpKfPwk6Tjx5OE0DAaG2HPHnN5W5u5GixcNm+GpiY4dCh1YmUKn89CY9IYnuYjEUvwvj6XEBpuO3dKDx8mav/4sbR7d+6sX109NusPY80alzIajxMnrFVUWHL291sChkI5MfwIvF64cmXs6yZMGO6leRotfLwqrC8zY0ePB7v1KlbcdQRvAW++mWSJWkcwCHyUbyZZ4A/gCw/FmcR/Ad8iqRgVuAh8jtQDdn2eiQIXgf60UrnHZOziLQTcA35Duh8vkMn9/+9Itf8DuZwgXRkVsP8DcckK6XLgZ6SOD0UmGziCCBZr8RBWXhcgPfvwtDJHMg84wJFCJw/mgZeAL25MwAvgU6RwfmhlDrckdoAfioE8mAdCwCdxYw+BZUhv88RpTHDzwP5iIQ+JP278inQxL0yyRHwVGqLADy03xIfQT0h/5pNMNnAEz4EpwHyk5/kmNFYM58CPxUgezAMdwFfE/wOkiOABvi9W8gD/AtVVmDkJXLSNAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/460361/Return%20YouTube%20Comment%20Username.user.js
// @updateURL https://update.greasyfork.org/scripts/460361/Return%20YouTube%20Comment%20Username.meta.js
// ==/UserScript==

// src/liveChat.ts
function c3JjL2xpdmVDaGF0LnRz() {
  "use strict";
  (() => {
    // node_modules/crx-monkey/dist/client/main.js
    function getRunningRuntime() {
      if (typeof window.__CRX_CONTENT_BUILD_ID === "undefined") {
        return "Userscript";
      } else {
        return "Extension";
      }
    }
    async function bypassSendMessage(message, options, callback) {
      const actionId = crypto.randomUUID();
      window.postMessage(
        {
          type: "send-message",
          crxContentBuildId: window.__CRX_CONTENT_BUILD_ID,
          detail: { message, options },
          actionId,
        },
        "*",
      );
      const data = await waitResultOnce("send-message", actionId);
      if (callback !== void 0) {
        callback(data.response);
      }
    }
    async function waitResultOnce(type, actionId) {
      return new Promise((resolve) => {
        const onResult = (e) => {
          if (e.detail.type === type && e.detail.actionId === actionId) {
            window.removeEventListener(
              "crx-isolate-connector-result",
              onResult,
            );
            resolve(e.detail.data);
          }
        };
        window.addEventListener("crx-isolate-connector-result", onResult);
      });
    }

    // src/utils/debugLog.ts
    function debugErr(message) {
      console.error(`[rycu] ${message}`);
      if (getRunningRuntime() === "Extension") {
        bypassSendMessage({
          type: "err",
          value: [`[rycu] ${message}`],
        });
      }
    }

    // src/utils/escapeString.ts
    function decodeString(text) {
      return text
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, `"`)
        .replace(/&#39;/g, `'`)
        .replace(/&amp;/g, `&`);
    }

    // src/utils/getUserName.ts
    var isUseFeed = true;
    async function getUserName(id) {
      return new Promise((resolve) => {
        if (isUseFeed) {
          fetchFeed(id)
            .then((name) => {
              resolve(name);
            })
            .catch(() => {
              isUseFeed = false;
              debugErr(
                new Error("Catch Feed API Error, so change to Browse mode."),
              );
              fetchBrowse(id).then((name) => {
                resolve(name);
              });
            });
        } else {
          fetchBrowse(id).then((name) => {
            resolve(name);
          });
        }
      });
    }
    async function fetchFeed(id) {
      return await fetch(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`,
        {
          method: "GET",
          cache: "default",
          keepalive: true,
        },
      )
        .then(async (res) => {
          if (res.status !== 200)
            throw debugErr(
              new Error(`Feed API Error
status: ${res.status}`),
            );
          return await res.text();
        })
        .then((text) => {
          const match = text.match("<title>([^<].*)</title>");
          if (match !== null) {
            return decodeString(match[1]);
          } else {
            debugErr("XML title not found");
            return "";
          }
        });
    }
    async function fetchBrowse(id) {
      return await fetch(
        `https://www.youtube.com/youtubei/v1/browse?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8&prettyPrint=false`,
        {
          method: "POST",
          headers: {
            cache: "default",
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en",
            "content-type": "application/json",
            dnt: "1",
            referer: `https://www.youtube.com/channel/${id}`,
          },
          body: JSON.stringify({
            context: {
              client: {
                hl: window.yt.config_.HL,
                gl: window.yt.config_.GL,
                clientName: "WEB",
                clientVersion: "2.20230628.01.00",
                platform: "DESKTOP",
                acceptHeader:
                  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
              },
              user: { lockedSafetyMode: false },
              request: {
                useSsl: true,
              },
            },
            browseId: id,
            params: "EgVhYm91dPIGBAoCEgA%3D",
          }),
        },
      )
        .then(async (res) => {
          if (res.status !== 200)
            throw debugErr(
              new Error(`Browse API Error
status: ${res.status}`),
            );
          return await res.json();
        })
        .then((text) => {
          const name = text.header.c4TabbedHeaderRenderer.title;
          return decodeString(name);
        });
    }

    // src/utils/formatUserName.ts
    function formatUserName(userName, userHandle, settings) {
      if (settings.isShowNameToHandle) {
        return decodeURI(userHandle) + `  ( ${userName} )`;
      }
      if (settings.isShowHandleToName) {
        return userName + `  ( ${decodeURI(userHandle)} )`;
      }
      return userName;
    }

    // src/types/SyncSettings.ts
    var syncSettings = (settings) => {
      bypassSendMessage(
        {
          type: "getShowHandleToName",
          value: null,
        },
        {},
        (isShowHandleToName) => {
          settings.isShowHandleToName = isShowHandleToName;
        },
      );
      bypassSendMessage(
        {
          type: "getShowNameToHandle",
          value: null,
        },
        {},
        (isShowNameToHandle) => {
          settings.isShowNameToHandle = isShowNameToHandle;
        },
      );
      bypassSendMessage(
        {
          type: "getReplaceComments",
          value: null,
        },
        {},
        (isReplaceComments) => {
          settings.isReplaceComments = isReplaceComments;
        },
      );
      bypassSendMessage(
        {
          type: "getReplaceLiveChats",
          value: null,
        },
        {},
        (isReplaceLiveChats) => {
          settings.isReplaceLiveChats = isReplaceLiveChats;
        },
      );
    };

    // src/liveChat.ts
    if (getRunningRuntime() === "Extension") {
      syncSettings(parent.window.__rycu.settings);
    }
    var asyncSyncSettings =
      getRunningRuntime() === "Extension"
        ? async (settings) => {
            Promise.resolve().then(() => syncSettings(settings));
          }
        : async () => {};
    var cache = {};
    var app = document.querySelector("yt-live-chat-app");
    if (app !== null) {
      const showMoreObserver = new MutationObserver((e) => {
        if (e[0].attributeName === "style") {
          rewriteAll();
        }
      });
      const showMore = document.querySelector("#show-more");
      if (showMore !== null) {
        showMoreObserver.observe(showMore, { attributes: true });
      }
      rewriteAll();
      app.addEventListener("yt-action", (e) => {
        switch (e.detail.actionName) {
          case "yt-live-chat-reload-success":
          case "yt-live-chat-resume-replay":
            setTimeout(() => {
              showMoreObserver.disconnect();
              const showMore2 = document.querySelector("#show-more");
              if (showMore2 !== null) {
                showMoreObserver.observe(showMore2, { attributes: true });
              }
            }, 100);
            break;
          case "yt-live-chat-actions":
            if (isAddChatItemAction(e.detail)) {
              chatActions(e.detail);
            }
            break;
          default:
            break;
        }
      });
    }
    function chatActions(action) {
      const rewiteAllArgs = (addActions) => {
        let id = "";
        let messageElement = null;
        addActions.forEach((addAction) => {
          const renderer = addAction.addChatItemAction.item;
          if (isTextMessage(renderer)) {
            id = renderer.liveChatTextMessageRenderer.id;
            messageElement = document.querySelector(
              `yt-live-chat-text-message-renderer[id="${id}"]`,
            );
          } else if (isPaidMessage(renderer)) {
            id = renderer.liveChatPaidMessageRenderer.id;
            messageElement = document.querySelector(
              `yt-live-chat-paid-message-renderer[id="${id}"]`,
            );
          } else if (isMembershipMessage(renderer)) {
            id = renderer.liveChatMembershipItemRenderer.id;
            messageElement = document.querySelector(
              `yt-live-chat-membership-item-renderer[id="${id}"]`,
            );
          } else if (isGiftRedemptionAnnouncement(renderer)) {
            id =
              renderer
                .liveChatSponsorshipsLiveChatGiftRedemptionAnnouncementRenderer
                .id;
            messageElement = document.querySelector(
              `ytd-sponsorships-live-chat-gift-redemption-announcement-renderer[id="${id}"]`,
            );
          } else if (isGiftPurchaseAnnouncement(renderer)) {
            id =
              renderer
                .liveChatSponsorshipsLiveChatGiftPurchaseAnnouncementRenderer
                .id;
            messageElement = document.querySelector(
              `ytd-sponsorships-live-chat-gift-purchase-announcement-renderer",[id="${id}"]`,
            );
          }
          if (messageElement !== null) {
            rewrite(messageElement);
          }
        });
      };
      rewiteAllArgs(action.args[0]);
    }
    function rewriteAll() {
      const renderers = document.querySelectorAll(
        "#items > yt-live-chat-text-message-renderer",
      );
      const paidRenderers = document.querySelectorAll(
        "#items > yt-live-chat-paid-message-renderer",
      );
      const memberRenderers = document.querySelectorAll(
        "#items > yt-live-chat-membership-item-renderer",
      );
      const sponserPurchases = document.querySelectorAll(
        "#items > ytd-sponsorships-live-chat-gift-purchase-announcement-renderer",
      );
      const sponserRedemptions = document.querySelectorAll(
        "#items > ytd-sponsorships-live-chat-gift-redemption-announcement-renderer",
      );
      [
        ...paidRenderers,
        ...memberRenderers,
        ...renderers,
        ...sponserPurchases,
        ...sponserRedemptions,
      ].forEach((renderer) => {
        rewrite(renderer);
      });
    }
    function isAddChatItemAction(obj) {
      if (
        typeof obj?.args[0] === "object" &&
        typeof obj?.args[0][0]?.addChatItemAction !== "undefined"
      ) {
        return true;
      }
      return false;
    }
    function isTextMessage(item) {
      return "liveChatTextMessageRenderer" in item;
    }
    function isMembershipMessage(item) {
      return "liveChatMembershipItemRenderer" in item;
    }
    function isPaidMessage(item) {
      return "liveChatPaidMessageRenderer" in item;
    }
    function isGiftRedemptionAnnouncement(item) {
      return (
        "liveChatSponsorshipsLiveChatGiftRedemptionAnnouncementRenderer" in item
      );
    }
    function isGiftPurchaseAnnouncement(item) {
      return (
        "liveChatSponsorshipsLiveChatGiftPurchaseAnnouncementRenderer" in item
      );
    }
    function rewrite(node, async = true) {
      if (async) {
        asyncSyncSettings(parent.window.__rycu.settings).then(() => {
          handleRewrite(node);
        });
      } else {
        if (getRunningRuntime() === "Extension") {
          syncSettings(parent.window.__rycu.settings);
        }
        handleRewrite(node);
      }
    }
    function handleRewrite(node) {
      const settings = parent.window.__rycu.settings;
      if (!settings.isReplaceLiveChats) {
        return;
      }
      const nameElem = node.querySelector("#author-name");
      if (nameElem !== null) {
        const msgData = node.polymerController.data;
        const { authorExternalChannelId, authorName } = msgData;
        const userHandle = authorName.simpleText;
        const cachedUserName = cache[authorExternalChannelId];
        const pullUserName =
          cachedUserName !== void 0
            ? Promise.resolve(cachedUserName)
            : getUserName(authorExternalChannelId);
        pullUserName.then((name) => {
          cache[authorExternalChannelId] = name;
          nameElem.textContent = formatUserName(name, userHandle, settings);
        });
      }
    }
  })();
}

// src/index.ts
function c3JjL2luZGV4LnRz() {
  "use strict";
  (() => {
    // node_modules/crx-monkey/dist/client/main.js
    function getRunningRuntime() {
      if (typeof window.__CRX_CONTENT_BUILD_ID === "undefined") {
        return "Userscript";
      } else {
        return "Extension";
      }
    }
    async function bypassSendMessage(message, options, callback) {
      const actionId = crypto.randomUUID();
      window.postMessage(
        {
          type: "send-message",
          crxContentBuildId: window.__CRX_CONTENT_BUILD_ID,
          detail: { message, options },
          actionId,
        },
        "*",
      );
      const data = await waitResultOnce("send-message", actionId);
      if (callback !== void 0) {
        callback(data.response);
      }
    }
    async function waitResultOnce(type, actionId) {
      return new Promise((resolve) => {
        const onResult = (e) => {
          if (e.detail.type === type && e.detail.actionId === actionId) {
            window.removeEventListener(
              "crx-isolate-connector-result",
              onResult,
            );
            resolve(e.detail.data);
          }
        };
        window.addEventListener("crx-isolate-connector-result", onResult);
      });
    }

    // src/utils/isCommentRenderer.ts
    function isCommentRenderer(continuationItems) {
      if (continuationItems.length > 0) {
        if ("commentThreadRenderer" in continuationItems[0]) {
          return false;
        }
        if ("commentRenderer" in continuationItems[0]) {
          return true;
        }
      }
      return false;
    }
    function isCommentRendererV2(continuationItems) {
      if (continuationItems.length > 0) {
        if ("commentThreadRenderer" in continuationItems[0]) {
          return false;
        }
        if ("commentViewModel" in continuationItems[0]) {
          return true;
        }
      }
      return false;
    }

    // package.json
    var package_default = {
      name: "return-youtube-comment-username",
      version: "0.7.2",
      devDependencies: {
        "@types/chrome": "^0.0.263",
        "@types/encoding-japanese": "^2.0.5",
        "@types/markdown-it": "^13.0.8",
        eslint: "^8.57.0",
        prettier: "^3.3.1",
        "ts-extension-builder": "^0.2.8",
      },
      license: "MIT",
      scripts: {
        "esbuild-register": "node --require esbuild-register",
        build: "npx crx-monkey build",
        dev: "npx crx-monkey dev",
        lint: "npx eslint --fix src/**/*.ts",
      },
      type: "module",
      dependencies: {
        "@mdit-vue/plugin-title": "^2.1.3",
        "@typescript-eslint/eslint-plugin": "^6.21.0",
        "@typescript-eslint/parser": "^6.21.0",
        "crx-monkey": "0.11.2",
        "encoding-japanese": "^2.2.0",
        "eslint-config-prettier": "^9.1.0",
        "markdown-it": "^14.1.0",
        typescript: "^5.4.5",
      },
    };

    // src/utils/debugLog.ts
    function debugLog(message, value = "") {
      if (getRunningRuntime() === "Extension") {
        bypassSendMessage({
          type: "log",
          value: [`[rycu] ${message} %c${value}`, "color:cyan;"],
        });
      } else {
        console.log(`[rycu] ${message} %c${value}`, "color:cyan;");
      }
    }
    function debugErr(message) {
      console.error(`[rycu] ${message}`);
      if (getRunningRuntime() === "Extension") {
        bypassSendMessage({
          type: "err",
          value: [`[rycu] ${message}`],
        });
      }
    }
    function outputDebugInfo() {
      const logs = [""];
      const ytConf = window.yt.config_;
      if (ytConf !== void 0) {
        logs.push(
          "PAGE_BUILD_LABEL: " +
            (ytConf.PAGE_BUILD_LABEL !== void 0
              ? ytConf.PAGE_BUILD_LABEL
              : " undefined"),
        );
        logs.push(
          "INNERTUBE_CLIENT_VERSION: " +
            (ytConf.INNERTUBE_CLIENT_VERSION !== void 0
              ? ytConf.INNERTUBE_CLIENT_VERSION
              : " undefined"),
        );
        logs.push(
          "INNERTUBE_CONTEXT_CLIENT_VERSION: " +
            (ytConf.INNERTUBE_CONTEXT_CLIENT_VERSION !== void 0
              ? ytConf.INNERTUBE_CONTEXT_CLIENT_VERSION
              : " undefined"),
        );
        logs.push(
          "INNERTUBE_CONTEXT_GL: " +
            (ytConf.INNERTUBE_CONTEXT_GL !== void 0
              ? ytConf.INNERTUBE_CONTEXT_GL
              : " undefined"),
        );
        logs.push(
          "Browser: " +
            (ytConf.INNERTUBE_CONTEXT.client.browserName !== void 0
              ? ytConf.INNERTUBE_CONTEXT.client.browserName
              : " undefined"),
        );
        logs.push(
          "Is login: " +
            (ytConf.LOGGED_IN !== void 0
              ? `${ytConf.LOGGED_IN}`
              : " undefined"),
        );
      }
      logs.push(`Href: ${location.href}`);
      debugLog(
        `Return Youtube comment Username v${package_default.version}`,
        logs.join("\n"),
      );
    }

    // src/utils/findElementByTrackingParams.ts
    function findElementByTrackingParams(trackingParams, elementSelector) {
      let returnElement = null;
      let errorAlerted = false;
      const elems = document.querySelectorAll(elementSelector);
      for (let i = 0; i < elems.length; i++) {
        if (
          elems[i]?.trackedParams === void 0 &&
          elems[i]?.polymerController?.trackedParams === void 0
        ) {
          debugErr(new Error("TrackedParams not found in element property."));
        }
        if (elems[i].trackedParams === trackingParams) {
          returnElement = elems[i];
          break;
        } else if (
          elems[i]?.polymerController?.trackedParams === trackingParams
        ) {
          returnElement = elems[i];
          break;
        } else {
          if (!errorAlerted) {
            void searchTrackedParamsByObject(trackingParams, elems[i]);
            errorAlerted = true;
          }
        }
      }
      return returnElement;
    }
    async function reSearchElement(trackingParams, selector) {
      return await new Promise((resolve) => {
        let isFinding = true;
        const search = () => {
          const el = findElementByTrackingParams(trackingParams, selector);
          if (el !== null) {
            resolve(el);
            isFinding = false;
          }
          if (isFinding) {
            setTimeout(() => {
              search();
            }, 100);
          }
        };
        search();
      });
    }
    function findElementAllByCommentId(commnetId, elementSelector) {
      const returnElements = [];
      const elems = document.querySelectorAll(elementSelector);
      for (let i = 0; i < elems.length; i++) {
        if (elems[i] !== void 0) {
          if (
            elems[i]?.__data?.data?.commentId === void 0 &&
            elems[i]?.polymerController?.__data?.data?.commentId === void 0
          ) {
            debugErr(new Error("Reply CommentId not found."));
          } else if (
            elems[i]?.__data?.data?.commentId !== void 0 &&
            elems[i].__data.data.commentId === commnetId
          ) {
            returnElements.push(elems[i]);
          } else if (
            elems[i]?.polymerController?.__data?.data?.commentId !== void 0 &&
            elems[i].polymerController.__data.data.commentId === commnetId
          ) {
            returnElements.push(elems[i]);
          }
        }
      }
      return returnElements;
    }
    async function reSearchElementAllByCommentId(commnetId, selector) {
      return await new Promise((resolve) => {
        let isFinding = true;
        const search = () => {
          const el = findElementAllByCommentId(commnetId, selector);
          if (el !== null) {
            resolve(el);
            isFinding = false;
          }
          if (isFinding) {
            setTimeout(() => {
              search();
            }, 100);
          }
        };
        search();
      });
    }
    async function searchTrackedParamsByObject(param, elem) {
      const elemObj = Object(elem);
      const search = (obj, history) => {
        Object.keys(obj).forEach((k) => {
          if (typeof obj[k] === "object") {
            search(obj[k], [...history, k]);
          } else if (obj[k] === param) {
            history.push(k);
            throw debugErr(
              new Error(`Unknown Object format!
"${history.join(" > ")}"`),
            );
          }
        });
      };
      search(elemObj, []);
    }

    // src/types/AppendContinuationItemsAction.ts
    function isReplyContinuationItemsV1(obj) {
      return Object.hasOwn(obj[0], "commentRenderer");
    }
    function isReplyContinuationItemsV2(obj) {
      return Object.hasOwn(obj[0], "commentViewModel");
    }
    function isConfinuationItemV2(obj) {
      return Object.hasOwn(obj, "commentViewModel");
    }

    // src/utils/escapeString.ts
    function escapeString(text) {
      return text
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, `&quot;`)
        .replace(/'/g, `&#39;`)
        .replace(/&/g, `&amp;`);
    }
    function decodeString(text) {
      return text
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, `"`)
        .replace(/&#39;/g, `'`)
        .replace(/&amp;/g, `&`);
    }

    // src/utils/getUserName.ts
    var isUseFeed = true;
    async function getUserName(id) {
      return new Promise((resolve) => {
        if (isUseFeed) {
          fetchFeed(id)
            .then((name) => {
              resolve(name);
            })
            .catch(() => {
              isUseFeed = false;
              debugErr(
                new Error("Catch Feed API Error, so change to Browse mode."),
              );
              fetchBrowse(id).then((name) => {
                resolve(name);
              });
            });
        } else {
          fetchBrowse(id).then((name) => {
            resolve(name);
          });
        }
      });
    }
    async function fetchFeed(id) {
      return await fetch(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`,
        {
          method: "GET",
          cache: "default",
          keepalive: true,
        },
      )
        .then(async (res) => {
          if (res.status !== 200)
            throw debugErr(
              new Error(`Feed API Error
status: ${res.status}`),
            );
          return await res.text();
        })
        .then((text) => {
          const match = text.match("<title>([^<].*)</title>");
          if (match !== null) {
            return decodeString(match[1]);
          } else {
            debugErr("XML title not found");
            return "";
          }
        });
    }
    async function fetchBrowse(id) {
      return await fetch(
        `https://www.youtube.com/youtubei/v1/browse?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8&prettyPrint=false`,
        {
          method: "POST",
          headers: {
            cache: "default",
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en",
            "content-type": "application/json",
            dnt: "1",
            referer: `https://www.youtube.com/channel/${id}`,
          },
          body: JSON.stringify({
            context: {
              client: {
                hl: window.yt.config_.HL,
                gl: window.yt.config_.GL,
                clientName: "WEB",
                clientVersion: "2.20230628.01.00",
                platform: "DESKTOP",
                acceptHeader:
                  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
              },
              user: { lockedSafetyMode: false },
              request: {
                useSsl: true,
              },
            },
            browseId: id,
            params: "EgVhYm91dPIGBAoCEgA%3D",
          }),
        },
      )
        .then(async (res) => {
          if (res.status !== 200)
            throw debugErr(
              new Error(`Browse API Error
status: ${res.status}`),
            );
          return await res.json();
        })
        .then((text) => {
          const name = text.header.c4TabbedHeaderRenderer.title;
          return decodeString(name);
        });
    }

    // src/rewrites/rewriteOfCommentRenderer/mentionRewriteOfCommentRenderer.ts
    function mentionRewriteOfCommentRenderer(commentRenderer) {
      const commentRendererBody =
        commentRenderer.__shady_native_children.namedItem("body");
      const main2 = commentRendererBody?.querySelector("#main");
      if (main2 !== void 0 && main2 !== null) {
        const aTags = main2.querySelectorAll(
          "#comment-content > ytd-expander > #content > #content-text > a",
        );
        for (let i = 0; i < aTags.length; i++) {
          if (aTags[i].getAttribute("href")?.match("/channel/.*") !== null) {
            const href = aTags[i].getAttribute("href");
            if (href !== null) {
              void getUserName(href.split("/")[2])
                .then((name) => {
                  aTags[i].textContent = `@${name} `;
                })
                .catch((e) => {
                  debugErr(e);
                });
            } else {
              debugErr(new Error("Mention Atag has not Href attr."));
            }
          }
        }
      }
    }

    // src/rewrites/rewriteOfCommentRenderer/nameRewriteOfCommentRenderer.ts
    function nameRewriteOfCommentRenderer(
      commentRenderer,
      isNameContainerRender,
      userId,
    ) {
      const commentRendererBody =
        commentRenderer.__shady_native_children.namedItem("body");
      if (commentRendererBody === null) {
        throw debugErr(new Error("Comment renderer body is null."));
      }
      let nameElem = commentRendererBody.querySelector(
        "#main > #header > #header-author > h3 > a > yt-formatted-string",
      );
      if (isNameContainerRender) {
        const containerMain =
          commentRendererBody.__shady_native_children.namedItem("main");
        if (containerMain !== null) {
          nameElem = containerMain.querySelector(
            "#header > #header-author > #author-comment-badge > ytd-author-comment-badge-renderer > a > #channel-name > #container > #text-container > yt-formatted-string",
          );
        }
      }
      void getUserName(userId)
        .then((name) => {
          if (nameElem !== null) {
            if (nameElem.getAttribute("is-empty") !== null) {
              nameElem.removeAttribute("is-empty");
            }
            if (isNameContainerRender) {
              nameElem.textContent = escapeString(name);
            } else {
              nameElem.textContent = name;
            }
          } else {
            debugErr(new Error("Name element is null"));
          }
        })
        .catch((e) => {
          debugErr(e);
        });
    }

    // src/utils/formatUserName.ts
    function formatUserName(userName, userHandle, settings) {
      if (settings.isShowNameToHandle) {
        return decodeURI(userHandle) + `  ( ${userName} )`;
      }
      if (settings.isShowHandleToName) {
        return userName + `  ( ${decodeURI(userHandle)} )`;
      }
      return userName;
    }

    // src/rewrites/rewriteOfCommentRenderer/nameRewriteOfCommentViewModel.ts
    function isCommentViewModelElement(obj) {
      if (obj === null || typeof obj !== "object") {
        return false;
      }
      return (
        typeof obj.authorChannelName === "string" &&
        (obj.authorCommentBadge === null ||
          typeof obj.authorCommentBadge === "object") &&
        typeof obj.authorNameEndpoint === "object" &&
        obj.authorNameEndpoint !== null &&
        typeof obj.authorNameEndpoint.browseEndpoint === "object" &&
        obj.authorNameEndpoint.browseEndpoint !== null &&
        typeof obj.authorNameEndpoint.browseEndpoint.browseId === "string" &&
        typeof obj.authorNameEndpoint.browseEndpoint.canonicalBaseUrl ===
          "string"
      );
    }
    function nameRewriteOfCommentViewModel(
      commentViewModel,
      settings = window.__rycu.settings,
    ) {
      const commentViewModelBody =
        commentViewModel.__shady_native_children.namedItem("body");
      if (commentViewModelBody === null) {
        throw debugErr(new Error("Comment view model body is null."));
      }
      const isNameContainerRender =
        commentViewModel.authorCommentBadge !== null;
      let nameElem = commentViewModel.querySelector(
        "#body > #main > #header > #header-author > h3 > a > span",
      );
      const userId =
        commentViewModel.authorNameEndpoint.browseEndpoint.browseId;
      const userHandle =
        commentViewModel.authorNameEndpoint.browseEndpoint.canonicalBaseUrl.substring(
          1,
        );
      if (isNameContainerRender) {
        const containerMain =
          commentViewModelBody.__shady_native_children.namedItem("main");
        if (containerMain !== null) {
          nameElem = containerMain.querySelector(
            "#header > #header-author > #author-comment-badge > ytd-author-comment-badge-renderer > a > #channel-name > #container > #text-container > yt-formatted-string",
          );
        }
      }
      void getUserName(userId)
        .then((name) => {
          if (nameElem !== null) {
            if (nameElem.getAttribute("is-empty") !== null) {
              nameElem.removeAttribute("is-empty");
            }
            const innerText = formatUserName(name, userHandle, settings);
            if (isNameContainerRender) {
              nameElem.textContent = escapeString(innerText);
            } else {
              nameElem.textContent = innerText;
            }
          } else {
            debugErr(new Error("Name element is null"));
          }
        })
        .catch((e) => {
          debugErr(e);
        });
    }

    // src/rewrites/rewriteOfCommentRenderer/mentionRewriteOfCommentRendererV2.ts
    function mentionRewriteOfCommentRendererV2(commentRenderer) {
      const commentRendererBody =
        commentRenderer.__shady_native_children.namedItem("body");
      const main2 = commentRendererBody?.querySelector("#main");
      if (main2 !== void 0 && main2 !== null) {
        const aTags = main2.querySelectorAll(
          "#expander > #content > #content-text > span > span > a",
        );
        for (let i = 0; i < aTags.length; i++) {
          if (aTags[i].getAttribute("href")?.match("/channel/.*") !== null) {
            const href = aTags[i].getAttribute("href");
            if (href !== null) {
              void getUserName(href.split("/")[2])
                .then((name) => {
                  aTags[i].textContent = `@${name} `;
                })
                .catch((e) => {
                  debugErr(e);
                });
            } else {
              debugErr(new Error("Mention Atag has not Href attr."));
            }
          }
        }
      }
    }

    // src/rewrites/reply.ts
    function rewriteReplytNameFromContinuationItems(continuationItems) {
      debugLog("Rewrite Reply.");
      if (isReplyContinuationItemsV1(continuationItems)) {
        debugLog("Rewrite reply of continuationItems.");
        for (let i = 0; i < continuationItems.length; i++) {
          const { commentRenderer } = continuationItems[i];
          if (commentRenderer !== void 0) {
            void getReplyElem(commentRenderer.trackingParams, "V1").then(
              (replyElem) => {
                reWriteReplyElem(replyElem, commentRenderer);
              },
            );
          }
        }
      }
      if (isReplyContinuationItemsV2(continuationItems)) {
        debugLog("Rewrite reply of comment view model.");
        for (let i = 0; i < continuationItems.length; i++) {
          const { commentViewModel } = continuationItems[i];
          if (commentViewModel !== void 0) {
            void getReplyElem(
              commentViewModel.rendererContext.loggingContext.loggingDirectives
                .trackingParams,
              "V2",
            ).then((replyElem) => {
              reWriteReplyElemV2(replyElem);
            });
          }
        }
      }
    }
    function reWriteReplyElem(replyElem, rendererData) {
      let isContainer = rendererData.authorIsChannelOwner;
      if (rendererData.authorCommentBadge !== void 0) {
        isContainer = true;
      }
      nameRewriteOfCommentRenderer(
        replyElem,
        isContainer,
        rendererData.authorEndpoint.browseEndpoint.browseId,
      );
      mentionRewriteOfCommentRenderer(replyElem);
      replyInputRewrite(replyElem);
    }
    function reWriteReplyElemV2(replyElem) {
      nameRewriteOfCommentViewModel(replyElem);
      mentionRewriteOfCommentRendererV2(replyElem);
      replyInputRewrite(replyElem);
    }
    async function getReplyElem(trackedParams, version) {
      return await new Promise((resolve) => {
        const selector =
          "#replies > ytd-comment-replies-renderer > #expander > #expander-contents > #contents > " +
          (version === "V1"
            ? "ytd-comment-renderer"
            : "ytd-comment-view-model");
        const commentRenderer = findElementByTrackingParams(
          trackedParams,
          selector,
        );
        if (commentRenderer !== null) {
          resolve(commentRenderer);
        } else {
          void reSearchElement(trackedParams, selector).then(
            (commentRenderer2) => {
              resolve(commentRenderer2);
            },
          );
        }
      });
    }
    function rewriteTeaserReplytNameFromContinuationItems(continuationItems) {
      debugLog("Rewrite teaser Reply.");
      for (let i = 0; i < continuationItems.length; i++) {
        if (isReplyContinuationItemsV1(continuationItems)) {
          debugLog("Teaser reply of continuationItems.");
          const { commentRenderer } = continuationItems[i];
          if (commentRenderer !== void 0) {
            void reSearchElementAllByCommentId(
              commentRenderer.commentId,
              "ytd-comment-replies-renderer > #teaser-replies > ytd-comment-renderer",
            ).then((replyElems) => {
              replyElems.forEach((replyElem) => {
                reWriteReplyElem(replyElem, commentRenderer);
              });
            });
            void reSearchElementAllByCommentId(
              commentRenderer.commentId,
              "ytd-comment-replies-renderer > #expander > #expander-contents > #contents > ytd-comment-renderer",
            ).then((replyElems) => {
              replyElems.forEach((replyElem) => {
                reWriteReplyElem(replyElem, commentRenderer);
              });
            });
          }
        }
        if (isReplyContinuationItemsV2(continuationItems)) {
          debugLog("Teaser reply of comment view model.");
          const { commentViewModel } = continuationItems[i];
          if (commentViewModel !== void 0) {
            const elem = findElementByTrackingParams(
              commentViewModel.rendererContext.loggingContext.loggingDirectives
                .trackingParams,
              "#teaser-replies > ytd-comment-view-model",
            );
            if (elem === null) {
              throw debugErr(
                new Error("Can not found Teaser Reply in V2 Elem."),
              );
            }
            reWriteReplyElemV2(elem);
          }
        }
      }
    }
    function replyInputRewrite(replyElem) {
      const replyToReplyBtn = replyElem.querySelector(
        "#reply-button-end > ytd-button-renderer",
      );
      const replyToReplyHander = () => {
        const replyLink = replyElem.querySelector("#contenteditable-root > a");
        const href = replyLink?.getAttribute("href");
        const channelId = href?.split("/")[2];
        if (channelId !== void 0 && replyLink !== null) {
          void getUserName(channelId).then((name) => {
            replyLink.textContent = ` @${name}`;
          });
        }
        replyToReplyBtn?.removeEventListener("click", replyToReplyHander);
      };
      replyToReplyBtn?.addEventListener("click", replyToReplyHander);
      document.addEventListener("rycu-pagechange", () => {
        replyToReplyBtn?.removeEventListener("click", replyToReplyHander);
      });
    }

    // src/rewrites/comment.ts
    function rewriteCommentNameFromContinuationItems(
      continuationItems,
      settings = window.__rycu.settings,
    ) {
      if (!settings.isReplaceComments) {
        return;
      }
      debugLog("Rewrite Comment.");
      for (let i = 0; i < continuationItems.length; i++) {
        if (continuationItems[i].commentThreadRenderer !== void 0) {
          void getCommentElem(
            continuationItems[i].commentThreadRenderer.trackingParams,
          ).then((commentElem) => {
            reWriteCommentElem(
              commentElem,
              continuationItems[i].commentThreadRenderer,
            );
          });
          const teaserContents =
            continuationItems[i].commentThreadRenderer.replies
              ?.commentRepliesRenderer.teaserContents;
          if (teaserContents !== void 0) {
            rewriteTeaserReplytNameFromContinuationItems(teaserContents);
          }
        }
      }
    }
    function reWriteCommentElem(commentElem, commentThreadRenderer) {
      const commentContainer =
        commentElem.__shady_native_children.namedItem("comment-container");
      if (commentContainer === null) {
        throw debugErr(
          new Error("Failed to found a named item 'comment-container'"),
        );
      }
      const commentRenderer =
        commentContainer.__shady_native_children.namedItem("comment");
      if (commentRenderer === null || commentRenderer === void 0) {
        throw debugErr("Failed to found a named item 'comment'.");
      }
      if (isConfinuationItemV2(commentThreadRenderer)) {
        debugLog("Rewriteing a comment by using comment view model.");
        const commentViewModel = commentRenderer;
        if (isCommentViewModelElement(commentViewModel)) {
          nameRewriteOfCommentViewModel(commentViewModel);
        } else {
          debugErr("It type is not comment view model.");
        }
      } else {
        debugErr("Unknown comment model type.");
      }
    }
    async function getCommentElem(trackingParams) {
      return await new Promise((resolve) => {
        const commentElem = findElementByTrackingParams(
          trackingParams,
          "#comments > #sections > #contents > ytd-comment-thread-renderer",
        );
        if (commentElem !== null) {
          resolve(commentElem);
        } else {
          void reSearchElement(trackingParams, "ytd-comment-thread-renderer")
            .then((commentElem2) => {
              resolve(commentElem2);
            })
            .catch((e) => {
              debugErr(e);
            });
        }
      });
    }

    // src/handlers/handleYtAppendContinuationItemsAction.ts
    function handleYtAppendContinuationItemsAction(detail) {
      const continuationItems =
        detail.args[0].appendContinuationItemsAction.continuationItems;
      if (
        isCommentRenderer(continuationItems) ||
        isCommentRendererV2(continuationItems)
      ) {
        const replyDetail = detail;
        setTimeout(() => {
          rewriteReplytNameFromContinuationItems(
            replyDetail.args[0].appendContinuationItemsAction.continuationItems,
          );
        }, 100);
      } else {
        const commentDetail = detail;
        setTimeout(() => {
          rewriteCommentNameFromContinuationItems(
            commentDetail.args[0].appendContinuationItemsAction
              .continuationItems,
          );
        }, 400);
      }
    }

    // src/handlers/handleYtCreateCommentAction.ts
    function handleYtCreateCommentAction(detail) {
      const createCommentDetail = detail;
      const continuationItems = [
        {
          commentThreadRenderer:
            createCommentDetail.args[0].createCommentAction.contents
              .commentThreadRenderer,
        },
      ];
      setTimeout(() => {
        rewriteCommentNameFromContinuationItems(continuationItems);
      }, 100);
    }

    // src/handlers/handleYtCreateCommentReplyAction.ts
    function handleYtCreateCommentReplyAction(detail) {
      const createReplyDetail = detail;
      const continuationItems = [
        {
          commentRenderer:
            createReplyDetail.args[0].createCommentReplyAction.contents
              .commentRenderer,
        },
      ];
      setTimeout(() => {
        rewriteTeaserReplytNameFromContinuationItems(continuationItems);
      }, 100);
    }

    // src/rewrites/highlightedReply.ts
    function rewriteHighlightedReply(trackedParams) {
      getReplyElem2(trackedParams, "V1").then((replyElem) => {
        reWriteReplyElemV2(replyElem);
      });
    }
    function rewriteHighlightedReplyV2(trackedParams) {
      getReplyElem2(trackedParams, "V2").then((replyElem) => {
        reWriteReplyElemV2(replyElem);
      });
    }
    async function getReplyElem2(trackedParams, version) {
      return await new Promise((resolve) => {
        const selector =
          "ytd-comment-replies-renderer > #teaser-replies > " +
          (version === "V1"
            ? "ytd-comment-renderer"
            : "ytd-comment-view-model");
        const commentRenderer = findElementByTrackingParams(
          trackedParams,
          selector,
        );
        if (commentRenderer !== null) {
          resolve(commentRenderer);
        } else {
          void reSearchElement(trackedParams, selector).then(
            (commentRenderer2) => {
              resolve(commentRenderer2);
            },
          );
        }
      });
    }

    // src/handlers/handleYtGetMultiPageMenuAction.ts
    function handleYtGetMultiPageMenuAction(detail) {
      debugLog("handleYtGetMultiPageMenuAction");
      const getMultiPageMenuDetail = detail;
      const continuationItems =
        getMultiPageMenuDetail.args[0].getMultiPageMenuAction.menu
          .multiPageMenuRenderer.sections[1].itemSectionRenderer?.contents;
      const highLightedTeaserContents =
        getMultiPageMenuDetail.args[0]?.getMultiPageMenuAction?.menu
          ?.multiPageMenuRenderer.sections[1].itemSectionRenderer?.contents[0]
          ?.commentThreadRenderer.replies?.commentRepliesRenderer
          ?.teaserContents;
      if (continuationItems !== void 0) {
        setTimeout(() => {
          rewriteCommentNameFromContinuationItems(continuationItems);
          if (highLightedTeaserContents !== void 0) {
            debugLog("HighLighted Teaser Reply found.");
            if (isReplyContinuationItemsV1(highLightedTeaserContents)) {
              debugLog("highLighted Teaser Reply V1");
              const highLightedReplyRenderer =
                highLightedTeaserContents[0]?.commentRenderer;
              rewriteHighlightedReply(highLightedReplyRenderer.trackingParams);
            } else {
              debugLog("highLighted Teaser Reply V2");
              const commentViewModel =
                highLightedTeaserContents[0]?.commentViewModel;
              const trackingParams =
                commentViewModel.rendererContext.loggingContext
                  .loggingDirectives.trackingParams;
              rewriteHighlightedReplyV2(trackingParams);
            }
          }
        }, 100);
      }
    }

    // src/handlers/handleYtHistory.ts
    function handleYtHistory(detail) {
      const historyDetail = detail;
      const continuationItems =
        historyDetail.args[1].historyEntry?.rootData.response.contents
          .twoColumnWatchNextResults?.results?.results?.contents[3]
          ?.itemSectionRenderer?.contents;
      if (continuationItems !== void 0) {
        setTimeout(() => {
          rewriteCommentNameFromContinuationItems(continuationItems);
        }, 100);
      }
    }

    // src/handlers/handleYtReloadContinuationItemsCommand.ts
    function handleYtReloadContinuationItemsCommand(detail) {
      const reloadDetail = detail;
      const { slot } = reloadDetail.args[0].reloadContinuationItemsCommand;
      if (slot === "RELOAD_CONTINUATION_SLOT_BODY") {
        const continuationItems =
          reloadDetail.args[0].reloadContinuationItemsCommand.continuationItems;
        if (continuationItems !== void 0) {
          setTimeout(() => {
            rewriteCommentNameFromContinuationItems(continuationItems);
          }, 100);
        }
      }
    }

    // src/types/RycuSettings.ts
    var getDefaultSettings = () => ({
      isShowHandleToName: false,
      isShowNameToHandle: false,
      isReplaceComments: true,
      isReplaceLiveChats: true,
    });

    // src/types/SyncSettings.ts
    var syncSettings = (settings) => {
      bypassSendMessage(
        {
          type: "getShowHandleToName",
          value: null,
        },
        {},
        (isShowHandleToName) => {
          settings.isShowHandleToName = isShowHandleToName;
        },
      );
      bypassSendMessage(
        {
          type: "getShowNameToHandle",
          value: null,
        },
        {},
        (isShowNameToHandle) => {
          settings.isShowNameToHandle = isShowNameToHandle;
        },
      );
      bypassSendMessage(
        {
          type: "getReplaceComments",
          value: null,
        },
        {},
        (isReplaceComments) => {
          settings.isReplaceComments = isReplaceComments;
        },
      );
      bypassSendMessage(
        {
          type: "getReplaceLiveChats",
          value: null,
        },
        {},
        (isReplaceLiveChats) => {
          settings.isReplaceLiveChats = isReplaceLiveChats;
        },
      );
    };

    // src/index.ts
    function main() {
      window.__rycu = {
        settings: getDefaultSettings(),
      };
      if (getRunningRuntime() === "Extension") {
        ((settings) => {
          syncSettings(settings);
          document.addEventListener("yt-action", () => {
            syncSettings(settings);
          });
          document.addEventListener("yt-navigate-finish", () => {
            syncSettings(settings);
          });
        })(window.__rycu.settings);
      }
      const handleYtAction = (e) => {
        switch (e.detail.actionName) {
          case "yt-append-continuation-items-action":
            handleYtAppendContinuationItemsAction(e.detail);
            break;
          case "yt-reload-continuation-items-command":
            handleYtReloadContinuationItemsCommand(e.detail);
            break;
          case "yt-history-load":
            handleYtHistory(e.detail);
            break;
          case "yt-get-multi-page-menu-action":
            handleYtGetMultiPageMenuAction(e.detail);
            break;
          case "yt-create-comment-action":
            handleYtCreateCommentAction(e.detail);
            break;
          case "yt-create-comment-reply-action":
            handleYtCreateCommentReplyAction(e.detail);
            break;
        }
      };
      document.addEventListener("yt-action", handleYtAction);
      document.addEventListener("yt-navigate-finish", () => {
        document.dispatchEvent(new Event("rycu-pagechange"));
        outputDebugInfo();
      });
    }
    main();
  })();
}

if (location.href.match("https://www.youtube.com/*") !== null) {
  document.addEventListener("DOMContentLoaded", () => {
    const script = document.createElement("script");
    if (unsafeWindow.trustedTypes !== undefined) {
      const policy = unsafeWindow.trustedTypes.createPolicy(
        "crx-monkey-trusted-inject-policy",
        { createScript: (input) => input },
      );
      script.text = policy.createScript(
        script.text + `(${c3JjL2luZGV4LnRz.toString()})();`,
      );
    } else {
      script.innerHTML =
        script.innerHTML + `(${c3JjL2luZGV4LnRz.toString()})();`;
    }
    unsafeWindow.document.body.appendChild(script);
  });
}

if (location.href.match("https://www.youtube.com/live_chat*") !== null) {
  document.addEventListener("DOMContentLoaded", () => {
    const script = document.createElement("script");
    if (unsafeWindow.trustedTypes !== undefined) {
      const policy = unsafeWindow.trustedTypes.createPolicy(
        "crx-monkey-trusted-inject-policy",
        { createScript: (input) => input },
      );
      script.text = policy.createScript(
        script.text + `(${c3JjL2xpdmVDaGF0LnRz.toString()})();`,
      );
    } else {
      script.innerHTML =
        script.innerHTML + `(${c3JjL2xpdmVDaGF0LnRz.toString()})();`;
    }
    unsafeWindow.document.body.appendChild(script);
  });
}

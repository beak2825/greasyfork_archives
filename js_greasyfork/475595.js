// ==UserScript==
// @name         LZT Stats
// @namespace    lzt-stats
// @version      1.4.1
// @description  Detailed statistics of your activity
// @author       Toil
// @license      MIT
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.market/*
// @match        https://zelenka.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js
// @supportURL   https://zelenka.guru/toil/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/475595/LZT%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/475595/LZT%20Stats.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // * STYLES
  GM_addStyle(`
    .LZTStatsTabs {
      width: 100%;
      box-sizing: border-box;
      padding: 0 10px;
      border: none !important;
      margin: 15px auto !important;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media screen and (max-width: 699px) {
      .LZTStatsTabs {
        flex-direction: column;
      }
    }

    .LZTStatsTab {
      position: relative;
      padding: 10px;
      margin: 0 4px;
      float: left;
      font-weight: 600;
      list-style: none !important;
      font-size: 14px;
    }

    .LZTStatsTab:hover {
      cursor: pointer;
    }

    .LZTStatsTab.active {
      box-shadow: inset 0px -2px 0px 0px #0daf77;
      transform: translateY(-1px);
      transition: .2s;
    }

    .LZTStatsTab:not(.active):hover {
      box-shadow: inset 0px -2px 0px 0px rgb(54, 54, 54);
    }

    .LZTStatsInfo {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    @media screen and (max-width: 699px) {
      .LZTStatsInfo {
        flex-direction: column;
        align-content: center;
      }
    }

    .LZTStatsInfo .LZTStatsItem {
      height: 63px;
      background: #2D2D2D;
      border-radius: 8px;
      padding: 12px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      white-space: normal;
    }

    .LZTStatsIcon {
      margin-right: 6px;
    }

    @media screen and (min-width: 700px) {
      .LZTStatsInfo .LZTStatsItem {
        flex: 1 1 calc((100% / 3) - 24px);
        max-width: 195px;
      }
    }

    @media screen and (max-width: 699px) {
      .LZTStatsInfo .LZTStatsItem {
        width: 90%;
      }
    }

    .LZTStatsInfo .LZTStatsItem i {
      width: 24px;
      height: 24px;
      font-size: 24px;
    }

    .LZTStatsInfo .LZTStatsItem p {
      font-weight: 400;
      font-size: 13px;
      line-height: 16px;
      color: rgba(214, 214, 214, 0.80);
      margin-bottom: 6px;
      max-width: 95px;
    }

    .LZTStatsInfo .LZTStatsItem .LZTStatsChangeInfo {
      height: 16px;
      margin-left: auto;
      display: flex;
    }

    .LZTStatsInfo .LZTStatsItem .LZTStatsChangeInfo i {
      width: 16px;
      height: 16px;
      font-size: 16px;
      margin-left: 2px;
    }

    #LZTStatsModalTitle {
      text-align: center;
      padding: 16px;
      font-size: 20px;
      font-weight: bold;
    }

    .LZTStatsChatComment {
      background: rgb(54, 54, 54);
      margin: 5px 15px;
      padding: 10px 15px;
      border-radius: 10px;
    }

    .LZTStatsSectionItem {
      max-width: 580px;
      flex-basis: 50%;
      flex-grow: 1;
      height: 64px;
      display: flex;
      align-items: center;

      transition: all 0.5s ease;
    }

    .LZTStatsSectionItem:hover {
      background: rgba(54, 54, 54, 0.75);
      border-radius: 8px;
      cursor: pointer;
    }

    .LZTUpSectionTextContainer {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1 1 auto;
      max-width: 100%;
    }

    .LZTStatsSectionItem i {
      width: 28px;
      height: 28px;
      margin: 20px;
      font-size: 28px;
      color: #0daf77;
    }

    .LZTStatsSectionTitle {
      display: block;
      margin-right: 20px;
      font-size: 15px;
      font-weight: bold;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    #LZTStatsLoadChatHistory, .LZTStatsTotalMessages {
      margin: 15px;
    }

    .LZTStatsCheckContainer {
      margin: 15px 20px;
      max-width: 95%;
      display: flex;
      align-items: center;
    }

    .LZTStatsCheckContainer label {
      white-space: nowrap;
    }

    #LZTStatsPreloader {
      width: 100%;
      height: 42px;
      font-size: 36px;
      text-align: center;
      animation: rotate 3s linear infinite;
    }

    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `);

  // * CONSTANTS
  const HOUR_IN_SECS = 3600;
  const DAY_IN_SECS = HOUR_IN_SECS * 24;
  const MONTH_IN_SECS = DAY_IN_SECS * 30;
  const XF_LANG = XenForo?.visitor?.language_id === 1 ? "en" : "ru";
  const AVAILABLED_DATA_KEYS = [
    "stats-messages",
    "stats-messages-edited",
    "stats-messages-deleted",
    "stats-comments",
    "stats-comments-edited",
    "stats-comments-deleted",
    "stats-chat",
    "stats-chat-edited",
    "stats-chat-deleted",
    "stats-threads-created",
    "stats-threads-edited",
    "stats-threads-deleted",
    "stats-sympathies-gotten",
    "stats-sympathies-new",
    "stats-likes-gotten",
    "stats-likes",
    "stats-participates",
    "stats-reports",
    "stats-polls",
    "stats-conversation",
    "stats-conversation-edited",
  ];

  // * I18N
  const i18n = {
    ru: {
      messages: "Сообщений",
      "messages-edited": "Изменено сообщений",
      "messages-deleted": "Удалено сообщений",
      comments: "Комментариев",
      "comments-edited": "Изменено комментариев",
      "comments-deleted": "Удалено комментариев",
      chat: "Сообщений в чате",
      "chat-edited": "Изменено в чате",
      "chat-deleted": "Удалено из чата",
      "threads-created": "Создано тем",
      "threads-edited": "Изменено тем",
      "threads-deleted": "Удалено тем",
      "sympathies-gotten": "Получено симпатий",
      "sympathies-new": "Поставлено симпатий",
      "likes-gotten": "Лайки за сообщения",
      likes: "Поставлено лайков",
      participates: "Участий в розыгрышах",
      reports: "Репортов",
      polls: "Пройдено опросов",
      conversation: "Сообщений в ЛС",
      "conversation-edited": "Изменено в ЛС",
      warnings: "Получено баллов",
      "load-chat-history": "Загрузить историю чата",
      loaded: "Загружено",
      "total-chat-messages": "Всего сообщений",
      "text-not-found": "текст не найден",
      "download-collected-data": "Скачать собранные данные",
      "upload-data-from-file": "Загрузить данные из файла",
      "upload-data-warning":
        "Вы уверены, что хотите загрузить данные из файла?\n\nПосле загрузки текущие данные будут перезаписаны!",
      "upload-data-cancelled":
        "Отмена. Вы отказались от загрузки данных из файла.",
      "tab-period-year": "За год",
      "tab-period-month": "За месяц",
      "tab-period-week": "За неделю",
      "tab-period-day": "За день",
      "tab-chat": "Чат",
      "tab-settings": "Настройки",
      "upload-file-error": "Произошла ошибка при загрузке данных из файла",
      "upload-data-convert-error": "Произошла ошибка при преобразование данных",
      "upload-data-success":
        "Данные успешно загружены. Перезагружаем меню для обновления...",
      "time-format": "Альтернативный формат подсчета времени",
      "time-format-desc":
        "Если включено, то подсчет времени в статистике идет с 00:00, а не за последние 24 часа",
      "time-format-alert":
        "Формат отображения статистики был изменен. Перезагружаем меню для обновления...",
    },
    en: {
      messages: "Messages",
      "messages-edited": "Changed messages",
      "messages-deleted": "Deleted messages",
      comments: "Comments",
      "comments-edited": "Changed comments",
      "comments-deleted": "Deleted comments",
      chat: "Chat messages",
      "chat-edited": "Changed in chat",
      "chat-deleted": "Deleted from chat",
      "threads-created": "Created threads",
      "threads-edited": "Changed threads",
      "threads-deleted": "Deleted threads",
      "sympathies-gotten": "Received sympathies",
      "sympathies-new": "Put sympathies",
      "likes-gotten": "Received likes for messages",
      likes: "Put likes",
      participates: "Participations in contests",
      reports: "Reports",
      polls: "Completed surveys",
      conversation: "Messages in PM",
      "conversation-edited": "Changed in PM",
      warnings: "Points received",
      "load-chat-history": "Load Chat History",
      loaded: "Loaded",
      "total-chat-messages": "Total messages",
      "text-not-found": "text not found",
      "download-collected-data": "Download the collected data",
      "upload-data-from-file": "Upload data from a file",
      "upload-data-warning":
        "Are you sure you want to upload data from a file?\n\n After loading, the current data will be overwritten!",
      "upload-data-cancelled":
        "Cancel. You refused to upload data from the file.",
      "tab-period-year": "Per year",
      "tab-period-month": "Per month",
      "tab-period-week": "Per week",
      "tab-period-day": "Per day",
      "tab-chat": "Chat",
      "tab-settings": "Settings",
      "upload-file-error": "An error occurred while loading data from a file",
      "upload-data-convert-error": "An error occurred while converting data",
      "upload-data-success":
        "The data has been uploaded successfully. Reloading the menu to update...",
      "time-format": "Alternative time counting format",
      "time-format-desc":
        "If enabled, the time is counted in the statistics from 00:00, and not for the last 24 hours",
      "time-format-alert":
        "The format for displaying statistics has been changed. Reloading the menu to update...",
    },
    get(phrase) {
      return this[XF_LANG]?.[phrase] ?? phrase;
    },
  };

  // * REGEXES
  const SEND_IN_THREAD = /^threads\/([^d]+)\/add-reply$/;
  const COMMENT_IN_THREAD = /^posts\/([^d]+)\/comment$/;

  const DELETE_MESSAGE_IN_THREAD = /^posts\/([^d]+)\/delete$/;
  const DELETE_COMMENT_IN_THREAD = /^posts\/comments\/([^d]+)\/delete$/;

  const EDITED_MESSAGE_IN_THREAD = /^posts\/([^d]+)\/save-inline$/;
  const EDITED_COMMENT_IN_THREAD = /^posts\/comments\/([^d]+)\/save-inline$/;

  const PARTICIPATE_IN_CONTEST = /^threads\/([^d]+)\/participate/; // ! DON'T ADD ANYTHING TO THE END!! THERE'S A CAPTCHA GOING ON
  const SYMPATHY_OR_LIKE_IN_THREAD = /\/posts\/([^d]+)\/like$/;
  const REPORT_IN_THREAD = /^posts\/([^d]+)\/report$/;

  const LIKE_IN_PROFILE = /\/profile-posts\/([^d]+)\/like$/;

  const SEND_IN_PROFILE_USERID = /^members\/([^d]+)\/post$/;
  const SEND_IN_PROFILE_TAG = /^([-\w]+)\/post$/;
  const COMMENT_IN_PROFILE = /^profile-posts\/([^d]+)\/comment$/;

  const POLL_IN_THREAD = /^threads\/([^d]+)\/poll\/vote/;
  const POLL_IN_PROFILE = /^profile-posts\/([^d]+)\/poll\/vote/;

  const SEND_IN_CHAT = /^\/chatbox\/post-message$/;
  const EDIT_IN_CHAT = /^\/chatbox\/([^d]+)\/edit$/;
  const DELETE_IN_CHAT = /^\/chatbox\/([^d]+)\/delete$/;

  const CREATE_NEW_THREAD = /^forums\/([-\w]+)\/add-thread$/;
  const EDIT_THREAD = /^threads\/([^d]+)\/save$/;
  const DELETE_THREAD = /^threads\/([^d]+)\/delete$/;

  const SEND_IN_CONVERSATION = /^conversations\/([^d]+)\/insert-reply$/;
  const EDIT_IN_CONVERSATION = /^conversations\/([^d]+)\/save-message/; // ! DON'T ADD ANYTHING TO THE END!! THERE GOES THE MESSAGE NUMBER

  const FIND_THREAD_ID = /^threads\/([^d]+)\//;
  const FIND_POST_ID = /^posts\/([^d]+)\//;
  const FIND_PROFILE_POST_ID = /^profile-posts\/([^d]+)\//;
  const FIND_USER_POST = /^([-\w]+)\/post$/;
  const FIND_USER_ID = /^members\/([^d]+)\//;
  const FIND_COMMENT_POST_ID = /^posts\/comments\/([^d]+)\//;
  const FIND_FORUM_ID = /^forums\/([-\w]+)\//;
  const FIND_POST_ID_IN_FULL_URL = /\/posts\/([^d]+)\//;
  const FIND_CHAT_ID = /^\/chatbox\/([^d]+)\//;
  const FIND_CONVERSATION_ID = /^conversations\/([^d]+)\//;

  // * HOOKS
  function initHooks() {
    // reference: https://github.com/LOLZHelper/LOLZHelperReborn/blob/main/src/common/hooks.js
    const XF_AJAX = XenForo.ajax;

    XenForo.ajax = function () {
      console.debug("[LZTStats.initHooks] [XenForo.ajax]", arguments);
      const url = arguments[0];
      const data = arguments[1];
      const success = arguments[2];
      const options = arguments[3];

      const timestamp = getTimestamp();
      switch (true) {
        case SEND_IN_THREAD.test(url): {
          const threadId = getThreadIdByURL(url);
          saveStats(
            {
              id: threadId,
              timestamp,
            },
            "stats-messages"
          );
          break;
        }
        case COMMENT_IN_THREAD.test(url): {
          const postId = getPostIdByURL(url);
          saveStats(
            {
              id: postId,
              timestamp,
            },
            "stats-comments"
          );
          break;
        }
        case PARTICIPATE_IN_CONTEST.test(url): {
          const threadId = getThreadIdByURL(url);
          saveStats(
            {
              id: threadId,
              timestamp,
            },
            "stats-participates"
          );
          break;
        }
        case REPORT_IN_THREAD.test(url): {
          const postId = getPostIdByURL(url);
          saveStats(
            {
              id: postId,
              // message: data?.[1] || '', // weighs a lot
              timestamp,
            },
            "stats-reports"
          );
          break;
        }
        case CREATE_NEW_THREAD.test(url): {
          const forumId = getForumIdByURL(url);
          saveStats(
            {
              id: forumId,
              timestamp,
            },
            "stats-threads-created"
          );
          break;
        }
        case EDIT_THREAD.test(url): {
          const threadId = getThreadIdByURL(url);
          saveStats(
            {
              id: threadId,
              timestamp,
            },
            "stats-threads-edited"
          );
          break;
        }
        case DELETE_THREAD.test(url): {
          const threadId = getThreadIdByURL(url);
          saveStats(
            {
              id: threadId,
              timestamp,
            },
            "stats-threads-deleted"
          );
          break;
        }
        case DELETE_COMMENT_IN_THREAD.test(url) && data?.length > 0: {
          const postId = getCommentPostIdByURL(url);
          saveStats(
            {
              id: postId,
              timestamp,
            },
            "stats-comments-deleted"
          );
          break;
        }
        case DELETE_MESSAGE_IN_THREAD.test(url) && data?.length > 0: {
          // ! Do not switch places with comments or you will have to fix the regex
          const postId = getPostIdByURL(url);
          saveStats(
            {
              id: postId,
              timestamp,
            },
            "stats-messages-deleted"
          );
          break;
        }
        case EDITED_COMMENT_IN_THREAD.test(url): {
          const postId = getCommentPostIdByURL(url);
          saveStats(
            {
              id: postId,
              timestamp,
            },
            "stats-comments-edited"
          );
          break;
        }
        case EDITED_MESSAGE_IN_THREAD.test(url): {
          // ! Do not switch places with comments or you will have to fix the regex
          const postId = getPostIdByURL(url);
          saveStats(
            {
              id: postId,
              timestamp,
            },
            "stats-messages-edited"
          );
          break;
        }
        case (POLL_IN_THREAD.test(url) || POLL_IN_PROFILE.test(url)) &&
          data?.length > 0: {
          const id = POLL_IN_THREAD.test(url)
            ? getThreadIdByURL(url)
            : getProfilePostIdByURL(url);
          saveStats(
            {
              id: id,
              timestamp,
            },
            "stats-polls"
          );
          break;
        }
        case SEND_IN_PROFILE_USERID.test(url) ||
          (SEND_IN_PROFILE_TAG.test(url) &&
            window.location.pathname.replace("/", "") + "/post" === url): {
          // Check by ID, if the user has a tag, then check so that the path matches the name in the link
          const userId = getUserIdByURL(url); // it can also return the tag
          saveStats(
            {
              id: userId,
              timestamp,
            },
            "stats-messages"
          );
          break;
        }
        case COMMENT_IN_PROFILE.test(url): {
          const postId = getCommentPostIdByURL(url);
          saveStats(
            {
              id: postId,
              timestamp,
            },
            "stats-comments"
          );
          break;
        }
        case SEND_IN_CHAT.test(url): {
          saveStats(
            {
              id: 0,
              message: data?.message,
              timestamp,
            },
            "stats-chat"
          );
          break;
        }
        case EDIT_IN_CHAT.test(url): {
          const chatId = getChatIdByURL(url);
          saveStats(
            {
              id: chatId,
              timestamp,
            },
            "stats-chat-edited"
          );
          break;
        }
        case DELETE_IN_CHAT.test(url): {
          const chatId = getChatIdByURL(url);
          saveStats(
            {
              id: chatId,
              timestamp,
            },
            "stats-chat-deleted"
          );
          break;
        }
        case SEND_IN_CONVERSATION.test(url): {
          const conversationId = getConversationIdByURL(url);
          saveStats(
            {
              id: conversationId,
              timestamp,
            },
            "stats-conversation"
          );
          break;
        }
        case EDIT_IN_CONVERSATION.test(url): {
          const conversationId = getConversationIdByURL(url);
          saveStats(
            {
              id: conversationId,
              timestamp,
            },
            "stats-conversation-edited"
          );
          break;
        }
        default:
          break;
      }

      const ajaxRes = XF_AJAX.apply(this, arguments);
      ajaxRes.then((res) => {
        // it seems to work
        switch (true) {
          case SYMPATHY_OR_LIKE_IN_THREAD.test(url): {
            const postId = getPostIdByFullURL(url);
            const parsedHTML = getHTMLFromString(res.templateHtml);
            const likeCountLeftEl = parsedHTML.querySelector(".likeCountLeft"); // if not null is sympathies else likes
            const likeTextEl = parsedHTML.querySelector(".likeText");
            if (likeTextEl && findYouInEl(likeTextEl)) {
              saveStats(
                {
                  id: postId,
                  timestamp,
                },
                likeCountLeftEl ? "stats-sympathies-new" : "stats-likes"
              );
            }

            break;
          }
          case LIKE_IN_PROFILE.test(url): {
            const postId = getPostIdByFullURL(url);
            const parsedHTML = getHTMLFromString(res.templateHtml);
            const likeTextEl = parsedHTML.querySelector(".likeText");
            if (likeTextEl && findYouInEl(likeTextEl)) {
              saveStats(
                {
                  id: postId,
                  timestamp,
                },
                "stats-likes"
              );
            }

            break;
          }
          default:
            break;
        }
      });

      return ajaxRes;
    };
  }

  // * REGISTERS
  function regMenuBtn(name) {
    const menuBtn = document.createElement("li");

    const link = document.createElement("a");
    link.classList.add("bold");
    link.style.color = "#0daf77";
    link.innerText = name;

    const separator = document.createElement("div");
    separator.classList.add("account-menu-sep");

    menuBtn.appendChild(link);

    const latestMenuItem = document.querySelector(
      "#AccountMenu > .blockLinksList > li:last-child"
    );
    latestMenuItem.insertAdjacentElement("beforebegin", menuBtn);
    latestMenuItem.insertAdjacentElement("beforebegin", separator);

    return menuBtn;
  }

  function regModal(name, mainEl = "") {
    return XenForo.alert(mainEl, name, null, () => {
      document.querySelector("div.modal.fade")?.remove();
    });
  }

  function regAlert(text, time) {
    // text can be html
    return XenForo.alert(text, false, time);
  }

  function setMenuTitle(modal, title) {
    const modalOverlay = modal?.[0];
    const modalTitle = modalOverlay?.querySelector("h2.heading");
    modalTitle.id = "LZTStatsModalTitle";
    modalTitle.innerText = title;
  }

  // * CLASSES
  class Tab {
    /**
     *
     *  @constructor
     *  @param {string} name - name of the tab
     *  @param {string} tabId - id of the tab
     *  @param {string} sectionId - id of the section
     *  @param {boolean} active - status of tab
     */

    constructor(name, tabId, sectionId, active) {
      this.name = name;
      this.tabId = tabId;
      this.sectionId = sectionId;
      this.active = active;
    }

    createElement() {
      const tab = document.createElement("li");
      tab.classList.add("LZTStatsTab");
      tab.id = this.tabId;

      const span = document.createElement("span");
      span.innerText = this.name;

      tab.appendChild(span);
      tab.addEventListener("click", () => this.setActive());
      return tab;
    }

    setActive() {
      if (!document.getElementById(this.tabId)) {
        // ignore errors if rerendering menu
        return;
      }

      document
        .querySelectorAll(".LZTStatsTab")
        .forEach((tab) => tab.classList.remove("active"));

      document.getElementById(this.tabId).classList.add("active");

      document
        .querySelectorAll(".LZTStatsModalContent > .LZTStatsSection")
        .forEach((section) => (section.style.display = "none"));

      document.getElementById(this.sectionId).style.display = "";
    }
  }

  // * HELPERS
  function initMenuBtn() {
    const menuBtn = regMenuBtn("LZT Stats");
    menuBtn.addEventListener("click", renderMenu);
  }

  async function renderMenu() {
    const modal = regModal(
      "LZT Stats",
      '<div class="LZTStatsModalContent"><i id="LZTStatsPreloader" class="fas fa-spinner-third"></i></div>'
    );
    setMenuTitle(modal, "LZT Stats");

    const modalContent = document.querySelector(".LZTStatsModalContent");
    console.debug("[LZTStats.renderMenu.menuBtn.onclick]", modalContent, modal);
    if (modal?.[0]?.parentElement) {
      // add id for customize modal
      modal[0].parentElement.id = "LZTStatsOverlay";
    }

    const tabsContainer = document.createElement("ul");
    tabsContainer.classList.add("LZTStatsTabs");

    /**
     * items - list of objects (usually: id, timestamp)
     * label - title of the item
     * data - converted items to work with graph
     * icon - icon of the item
     * changeValue - Value compared to last time
     * hidden - default visibility in graph
     */
    const statsData = [
      {
        items: await GM_getValue("stats-messages", []),
        label: "messages",
        icon: "far fa-comment-alt",
        data: [],
        changeValue: null,
        hidden: false,
      },
      {
        items: await GM_getValue("stats-messages-edited", []),
        label: "messages-edited",
        icon: "far fa-comment-alt-edit",
        data: [],
        changeValue: null,
        hidden: true,
      },
      {
        items: await GM_getValue("stats-messages-deleted", []),
        label: "messages-deleted",
        icon: "far fa-comment-alt-times",
        data: [],
        changeValue: null,
        hidden: true,
      },
      {
        items: await GM_getValue("stats-comments", []),
        label: "comments",
        icon: "far fa-comment-alt-dots",
        data: [],
        changeValue: null,
        hidden: false,
      },
      {
        items: await GM_getValue("stats-comments-edited", []),
        label: "comments-edited",
        icon: "far fa-comment-alt-edit",
        data: [],
        changeValue: null,
        hidden: true,
      },
      {
        items: await GM_getValue("stats-comments-deleted", []),
        label: "comments-deleted",
        icon: "far fa-comment-alt-times",
        data: [],
        changeValue: null,
        hidden: true,
      },
      {
        items: await GM_getValue("stats-chat", []),
        label: "chat",
        icon: "far fa-comments",
        data: [],
        changeValue: null,
        hidden: false,
      },
      {
        items: await GM_getValue("stats-chat-edited", []),
        label: "chat-edited",
        icon: "far fa-comment-edit",
        data: [],
        changeValue: null,
        hidden: true,
      },
      {
        items: await GM_getValue("stats-chat-deleted", []),
        label: "chat-deleted",
        icon: "far fa-comment-times",
        data: [],
        changeValue: null,
        hidden: true,
      },
      {
        items: await GM_getValue("stats-threads-created", []),
        label: "threads-created",
        icon: "far fa-file-alt",
        data: [],
        changeValue: null,
        hidden: false,
      },
      {
        items: await GM_getValue("stats-threads-edited", []),
        label: "threads-edited",
        icon: "far fa-file-edit",
        data: [],
        changeValue: null,
        hidden: true,
      },
      {
        items: await GM_getValue("stats-threads-deleted", []),
        label: "threads-deleted",
        icon: "far fa-file-times",
        data: [],
        changeValue: null,
        hidden: true,
      },
      {
        items: await getSympathiesStats(),
        label: "sympathies-gotten",
        icon: "far fa-heart",
        data: [],
        changeValue: null,
        hidden: true, // the graph does not correspond to reality
      },
      {
        items: await GM_getValue("stats-sympathies-new", []),
        label: "sympathies-new",
        icon: "far fa-heart",
        data: [],
        changeValue: null,
        hidden: true,
      },
      {
        items: await getLikesStats(),
        label: "likes-gotten",
        icon: "far fa-thumbs-up",
        data: [],
        changeValue: null,
        hidden: true,
      },
      {
        items: await GM_getValue("stats-likes", []),
        label: "likes",
        icon: "far fa-thumbs-up",
        data: [],
        changeValue: null,
        hidden: true,
      },
      {
        items: await GM_getValue("stats-participates", []),
        label: "participates",
        icon: "far fa-gift",
        data: [],
        changeValue: null,
        hidden: false,
      },
      {
        items: await GM_getValue("stats-reports", []),
        label: "reports",
        icon: "far fa-bullhorn",
        data: [],
        changeValue: null,
        hidden: false,
      },
      {
        items: await GM_getValue("stats-polls", []),
        label: "polls",
        icon: "far fa-poll",
        data: [],
        changeValue: null,
        hidden: true,
      },
      {
        items: await GM_getValue("stats-conversation", []),
        label: "conversation",
        icon: "far fa-comments-alt",
        data: [],
        changeValue: null,
        hidden: false,
      },
      {
        items: await GM_getValue("stats-conversation-edited", []),
        label: "conversation-edited",
        icon: "far fa-comment-alt-edit",
        data: [],
        changeValue: null,
        hidden: true,
      },
      {
        items: await getWarningsStats(),
        label: "warnings",
        icon: "far fa-exclamation-triangle",
        data: [],
        changeValue: null,
        hidden: true,
      },
    ];

    // ** STATS BY ALL TIME SECTION
    const allTimeSection = document.createElement("div");
    allTimeSection.classList.add("LZTStatsSection");
    allTimeSection.id = "LZTStatsAllSection";
    await createTimeSection(allTimeSection, statsData, 12, MONTH_IN_SECS);

    // ** STATS BY ALL MONTH SECTION
    const monthTimeSection = document.createElement("div");
    monthTimeSection.classList.add("LZTStatsSection");
    monthTimeSection.id = "LZTStatsMonthSection";
    await createTimeSection(monthTimeSection, statsData, 30, DAY_IN_SECS);

    // ** STATS BY ALL WEEK SECTION
    const weekTimeSection = document.createElement("div");
    weekTimeSection.classList.add("LZTStatsSection");
    weekTimeSection.id = "LZTStatsWeekSection";
    await createTimeSection(weekTimeSection, statsData, 7, DAY_IN_SECS);

    // ** STATS BY ALL DAY SECTION
    const dayTimeSection = document.createElement("div");
    dayTimeSection.classList.add("LZTStatsSection");
    dayTimeSection.id = "LZTStatsDaySection";
    await createTimeSection(dayTimeSection, statsData, 24, HOUR_IN_SECS);

    // ** CHAT SECTION
    const chatSection = document.createElement("div");
    chatSection.classList.add("LZTStatsSection");
    chatSection.id = "LZTStatsChatSection";

    const loadChatHistory = document.createElement("button");
    loadChatHistory.classList.add("button", "primary", "fit");
    loadChatHistory.id = "LZTStatsLoadChatHistory";
    loadChatHistory.innerText = i18n.get("load-chat-history");
    loadChatHistory.onclick = async () => {
      loadChatHistory.disabled = true;
      loadChatHistory.classList.add("disabled");
      loadChatHistory.innerText = i18n.get("loaded");

      const chatMessages = (await GM_getValue("stats-chat")) || [];
      const messagesEl = [];
      const messagesTotalEl = document.createElement("div");
      messagesTotalEl.classList.add("LZTStatsTotalMessages");
      messagesTotalEl.innerText = `${i18n.get("total-chat-messages")}: ${
        chatMessages.length
      }`;

      for (const msg of chatMessages.reverse()) {
        const chatEl = document.createElement("p");
        const chatTimeEl = document.createElement("p");
        chatEl.classList.add("LZTStatsChatComment");
        chatEl.innerText = msg?.message || i18n.get("text-not-found");
        const chatDate = new Date(msg.timestamp * 1000);
        chatTimeEl.innerText = `\n${formatDate(
          chatDate.getHours()
        )}:${formatDate(chatDate.getMinutes())} ${formatDate(
          chatDate.getDate()
        )}.${formatDate(chatDate.getMonth() + 1)}.${formatDate(
          chatDate.getFullYear()
        )}`;
        chatEl.append(chatTimeEl);
        messagesEl.push(chatEl);
      }

      chatSection.append(messagesTotalEl, ...messagesEl);
    };
    chatSection.append(loadChatHistory);

    // ** SETTINGS SECTION
    const settingsSection = document.createElement("div");
    settingsSection.classList.add("LZTStatsSection");
    settingsSection.id = "LZTStatsSettingsSection";

    // *** DOWNLOAD DATA
    const settingsDownloadEl = createSectionItem(
      i18n.get("download-collected-data"),
      "fa-file-download"
    );
    settingsSection.append(settingsDownloadEl);

    settingsDownloadEl.onclick = () => {
      const data = statsData.map((s) => {
        const temp = {};
        const key = "stats-" + s.label; // label is raw i18n phrase. Adding "stats-" so that the output array names matches the data names in GM Storage
        const val = s.items;
        temp[key] = val;
        return temp;
      });

      // we combine all the data into a single object, so that there is a normal structure of the json file
      downloadJSONFile(JSON.stringify(Object.assign(...data)), "LZTStats");
    };

    // *** UPLOAD DATA
    // !!! OVERWRITES DATA IN GM STORAGE
    const settingsUploadEl = createSectionItem(
      i18n.get("upload-data-from-file"),
      "fa-file-upload"
    );
    settingsSection.append(settingsUploadEl);

    settingsUploadEl.onclick = async () => {
      const approve = confirm(i18n.get("upload-data-warning"));
      if (!approve) {
        return regAlert(
          `<span style="color: #f13838">${i18n.get(
            "upload-data-cancelled"
          )}</span>`,
          5000
        );
      }

      const data = await uploadJSONFile();
      try {
        const parsedData = JSON.parse(data);

        for (const key in parsedData) {
          if (AVAILABLED_DATA_KEYS.includes(key)) {
            GM_setValue(key, parsedData[key]);
          }
        }

        regAlert(i18n.get("upload-data-success"), 5000);
        await reRenderModal(modal);
      } catch (e) {
        console.error(i18n.get("upload-data-convert-error"), e);
        regAlert(
          `<span style="color: #f13838">${i18n.get(
            "upload-data-convert-error"
          )}</span>`,
          5000
        );
      }
    };

    // *** STATS TIME FORMAT
    const checkboxContainer = document.createElement("div");
    const checkbox = document.createElement("input");
    const checkboxLabel = document.createElement("label");
    const checkboxLabelSpan = document.createElement("span");
    settingsSection.append(checkboxContainer);

    checkbox.type = "checkbox";
    checkbox.id = "LZTStatsTimeFormat";
    checkbox.checked = await GM_getValue("stats-time-format", false);

    checkboxLabelSpan.classList.add("fa", "fa-question", "Tooltip");
    checkboxLabelSpan.setAttribute("title", i18n.get("time-format-desc"));
    checkboxLabel.htmlFor = "LZTStatsTimeFormat";
    checkboxLabel.append(i18n.get("time-format"), checkboxLabelSpan);

    checkboxContainer.classList.add("LZTStatsCheckContainer");
    checkboxContainer.append(checkbox, checkboxLabel);

    checkboxContainer.onclick = async (event) => {
      await GM_setValue("stats-time-format", event.target.checked);
      regAlert(i18n.get("time-format-alert"), 5000);
      await reRenderModal(modal);
    };

    async function reRenderModal(modal) {
      $(modal?.[0]?.parentElement?.parentElement).trigger("hidden"); // soft modal remove
      document.querySelector(".modal-backdrop")?.remove();
      await renderMenu();
    }

    // ** MODAL EXECUTORS
    modalContent.querySelector("#LZTStatsPreloader")?.remove();
    modalContent.append(
      tabsContainer,
      allTimeSection,
      monthTimeSection,
      weekTimeSection,
      dayTimeSection,
      chatSection,
      settingsSection
    );

    const tabs = [
      new Tab(
        i18n.get("tab-period-year"),
        "LZTStatsAllTab",
        "LZTStatsAllSection",
        true
      ),
      new Tab(
        i18n.get("tab-period-month"),
        "LZTStatsMonthTab",
        "LZTStatsMonthSection",
        false
      ),
      new Tab(
        i18n.get("tab-period-week"),
        "LZTStatsWeekTab",
        "LZTStatsWeekSection",
        false
      ),
      new Tab(
        i18n.get("tab-period-day"),
        "LZTStatsDayTab",
        "LZTStatsDaySection",
        false
      ),
      new Tab(
        i18n.get("tab-chat"),
        "LZTStatsChatTab",
        "LZTStatsChatSection",
        false
      ),
      new Tab(
        i18n.get("tab-settings"),
        "LZTStatsSettingsTab",
        "LZTStatsSettingsSection",
        false
      ),
    ];

    for (const tab of tabs) {
      tabsContainer.appendChild(tab.createElement());
      tab.active ? tab.setActive() : null;
    }

    modalContent
      .querySelectorAll(".Tooltip")
      ?.forEach((el) => XenForo.Tooltip($(el))); // Registering tooltips
  }

  async function createTimeSection(
    containerEl,
    statsData,
    GRAPH_LENGTH,
    GRAPH_TIME_FORMAT
  ) {
    statsData.forEach(
      (s) =>
        (s.data = getSumValuesByTime(
          calcSumByTime(s.items, GRAPH_TIME_FORMAT, GRAPH_LENGTH)
        ))
    );
    const currentTimestamp = getFormattedTimestamp();

    const calculatedGraphTime = GRAPH_TIME_FORMAT * GRAPH_LENGTH;
    const lastPageDate = currentTimestamp - calculatedGraphTime * 2;
    const thisPageDate = currentTimestamp - calculatedGraphTime;

    if (GRAPH_TIME_FORMAT !== MONTH_IN_SECS) {
      // skip year format info
      statsData.forEach(
        (s) =>
          (s.changeValue =
            s.items.filter((i) => i.timestamp > thisPageDate).length -
            s.items.filter(
              (i) => i.timestamp > lastPageDate && i.timestamp < thisPageDate
            ).length)
      );
    }

    const timeArray = getTimeArray(GRAPH_TIME_FORMAT, GRAPH_LENGTH);

    const statsContainer = document.createElement("div");
    statsContainer.classList.add("LZTStatsInfo");

    const statsItems = statsData.map((s) =>
      createStatsItem(
        i18n.get(s.label),
        s.items.filter((i) => i.timestamp > thisPageDate).length,
        s.icon,
        s.changeValue
      )
    );
    statsContainer.append(...statsItems);

    const graph = document.createElement("canvas");
    if (document.querySelector(".xenOverlay.slim")) {
      graph.width = 300;
      graph.height = 600;
    } else {
      graph.width = 600;
      graph.height = 450;
    }
    graph.id = `LZTStatsGraph-${GRAPH_LENGTH}-${GRAPH_TIME_FORMAT}`;

    containerEl.append(statsContainer, graph);

    new Chart(graph, {
      type: "line",
      data: {
        labels: timeArray.reverse(),
        datasets: statsData.map((s) => ({
          label: i18n.get(s.label),
          data: s.data,
          borderWidth: 1,
          hidden: s.hidden,
          tension: 0.2,
        })),
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  function createStatsItem(title, value, iconClasses = "", changeValue = null) {
    const item = document.createElement("div");
    item.classList.add("LZTStatsItem");

    const iconContainer = document.createElement("div");
    iconContainer.classList.add("LZTStatsIcon");
    const icon = document.createElement("i");
    icon.classList.add(...iconClasses.split(" ")); // convert to the view that FontAwesome works with
    iconContainer.appendChild(icon);

    const textContainer = document.createElement("div");
    textContainer.innerText = value;
    const textTitle = document.createElement("p");
    textTitle.innerText = title;
    textContainer.insertAdjacentElement("afterbegin", textTitle);

    item.append(iconContainer, textContainer);

    if (typeof changeValue === "number") {
      const changeContainer = document.createElement("div");
      changeContainer.classList.add("LZTStatsChangeInfo");
      changeContainer.innerText = changeValue;
      const changeIcon = document.createElement("i");

      // Set icon and style by number that has changed
      // default: Just like last time
      let changeIconClasses = "far fa-arrows-alt-v";
      let changeIconStyle = "#D6D6D6";
      if (changeValue < 0) {
        // Less than last time
        changeIconClasses = "fas fa-caret-down";
        changeIconStyle = "#ea4c4c";
      } else if (changeValue > 0) {
        // More than last time
        changeIconClasses = "fas fa-caret-up";
        changeIconStyle = "#0daf77";
      }

      changeIcon.classList.add(...changeIconClasses.split(" ")); // convert to the view that FontAwesome works with
      changeIcon.style = `color: ${changeIconStyle}`;
      changeContainer.appendChild(changeIcon);
      item.append(changeContainer);
    }

    return item;
  }

  function createSectionItem(text, icon = "fa-vial") {
    const settingsEl = document.createElement("div");
    settingsEl.classList.add("LZTStatsSectionItem");

    const itemIcon = document.createElement("i");
    itemIcon.classList.add("far", icon);

    const textContainer = document.createElement("div");
    textContainer.classList.add("LZTStatsSectionTextContainer");

    const textEl = document.createElement("span");
    textEl.classList.add("LZTStatsSectionTitle");
    textEl.innerText = text;

    textContainer.append(textEl);
    settingsEl.append(itemIcon, textContainer);
    return settingsEl;
  }

  // * REQUESTS

  async function getSympathiesStats() {
    const savedSympathies =
      (await GM_getValue("stats-sympathies-gotten")) || [];
    let currentTimestamp = getTimestamp();
    const lastSave = currentTimestamp - DAY_IN_SECS * 30;

    // sympathies, except sympathies for the last 30 days
    let sympathies = savedSympathies.filter((s) => s.timestamp < lastSave);

    const userId = getUserId();

    try {
      // post_comment for reducing the weight of the answer
      // the value of sympathies for 7 days and for 30 days in "post" and "post_comment" doesn't change

      // we use fetch instead of ajax because ajax doesn't return the necessary data
      const res = await fetch(
        `/members/${userId}/likes?type=gotten&content_type=post_comment`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const resHTML = await res.text();

      const parsedHTML = getHTMLFromString(resHTML);
      const pageDescription = parsedHTML.querySelector("#pageDescription");

      if (pageDescription) {
        const likesText = pageDescription.innerText.split(" - ");
        const likesWeek = likesText[1]?.match(/(\d+)/)?.[0];
        const likesMonth = likesText[2]?.match(/(\d+)/)?.[0];
        let stepWeek =
          likesWeek > 0
            ? Math.floor((DAY_IN_SECS * 7) / likesWeek)
            : DAY_IN_SECS * 7; // for predict division to zero
        let stepMonth =
          likesMonth > 0
            ? Math.floor((DAY_IN_SECS * 30) / likesMonth)
            : DAY_IN_SECS * 30; // +for predict division to zero
        let timestamp = getTimestamp();

        for (let i = 0; i < likesMonth; i++) {
          const step = i > likesWeek ? stepMonth : stepWeek;
          timestamp = timestamp - step;

          sympathies.push({
            id: 0,
            timestamp,
          });
        }

        if (
          !savedSympathies.length ||
          !savedSympathies?.filter((s) => s.timestamp > lastSave)?.length
        ) {
          // update saved value if there are no recently saved values
          await GM_setValue("stats-sympathies-gotten", sympathies);
        }
      }
    } catch (err) {
      console.error("[LZTStats.getSympathiesStats]", err);
    }

    return sympathies;
  }

  async function getLikesStats() {
    // c+p getSympathiesStats (wait 2.0)
    const savedLikes = (await GM_getValue("stats-likes-gotten")) || [];
    let currentTimestamp = getTimestamp();
    const lastSave = currentTimestamp - DAY_IN_SECS * 30;

    // likes, except likes for the last 30 days
    let likes = savedLikes.filter((s) => s.timestamp < lastSave);

    const userId = getUserId();

    try {
      // post_comment for reducing the weight of the answer
      // the value of sympathies for 7 days and for 30 days in "post" and "post_comment" doesn't change

      // we use fetch instead of ajax because ajax doesn't return the necessary data
      const res = await fetch(
        `/members/${userId}/likes2?type=gotten&content_type=post_comment`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const resHTML = await res.text();

      const parsedHTML = getHTMLFromString(resHTML);
      const pageDescription = parsedHTML.querySelector("#pageDescription");

      if (pageDescription) {
        const likesText = pageDescription.innerText.split(" - ");
        const likesWeek = likesText[1]?.match(/(\d+)/)?.[0];
        const likesMonth = likesText[2]?.match(/(\d+)/)?.[0];
        console.log(likesWeek, likesMonth, likesWeek > 0, likesMonth > 0);
        let stepWeek =
          likesWeek > 0
            ? Math.floor((DAY_IN_SECS * 6.99) / likesWeek)
            : DAY_IN_SECS * 7; // for predict division to zero
        let stepMonth =
          likesMonth > 0
            ? Math.floor((DAY_IN_SECS * 29.99) / likesMonth)
            : DAY_IN_SECS * 30; // +for predict division to zero
        let timestamp = getTimestamp();

        for (let i = 0; i < likesMonth; i++) {
          const step = i >= likesWeek ? stepMonth : stepWeek;
          timestamp =
            timestamp - step >
            currentTimestamp - DAY_IN_SECS * (i >= likesWeek ? 30 : 7)
              ? timestamp - step
              : timestamp;

          likes.push({
            id: 0,
            timestamp,
          });
        }

        if (
          !savedLikes.length ||
          !savedLikes?.filter((s) => s.timestamp > lastSave)?.length
        ) {
          // update saved value if there are no recently saved values
          await GM_setValue("stats-likes-gotten", likes);
        }
      }
    } catch (err) {
      console.error("[LZTStats.getLikesStats]", err);
    }

    return likes;
  }

  async function getWarningsStats() {
    // user warning score
    const warnings = [];
    const userId = getUserId();
    try {
      const res = await XenForo.ajax(`/members/${userId}/warnings`);
      const resHTML = res.templateHtml;

      const parsedHTML = getHTMLFromString(resHTML);
      const dataRows = parsedHTML.querySelectorAll(".dataRow");
      // .dataRow.muted is old warnings + has another structure

      for (const dataRow of dataRows) {
        let gottenDate;
        const warningDate = dataRow.querySelector("td.warningDate");
        const warningDateChild = warningDate?.firstChild;
        if (!warningDateChild) {
          continue;
        }

        if (warningDateChild.dataset.time) {
          gottenDate = warningDateChild.dataset.time;
        } else if (
          (warningDateChild.dataset.datestring &&
            warningDateChild.dataset.timestring) ||
          warningDateChild.title
        ) {
          let tempDate =
            warningDateChild.dataset.datestring &&
            warningDateChild.dataset.timestring
              ? `${warningDateChild.dataset.datestring} ${warningDateChild.dataset.timestring}`
              : warningDateChild.title;
          tempDate = fixDateStringChars(tempDate);

          gottenDate = Math.floor(Date.parse(tempDate) / 1000);
        }

        if (!gottenDate) {
          continue;
        }

        let gottenPoints =
          Number(dataRow.querySelector("td.warningPoints")?.innerText) || 0;

        for (let i = 0; i < gottenPoints; i++) {
          // if have points add to warnings (0 - skip)
          warnings.push({
            id: 0,
            timestamp: gottenDate,
          });
        }
      }
    } catch (err) {
      console.error("[LZTStats.getWarningsStats]", err);
    }

    return warnings;
  }

  // * UTILS
  function findYouInEl(likeTextEl) {
    // find "You" in el for sympathies and likes
    return (
      likeTextEl.innerText.includes("Это нравится Вам") ||
      likeTextEl.innerText.includes("Вам нравится это") ||
      likeTextEl.innerText.includes("You like this") ||
      likeTextEl.innerText.includes("You and") ||
      likeTextEl.innerText.includes("You,")
    );
  }

  function fixDateStringChars(datestring) {
    // replace russian shortcut to eng shortcut
    // and replace preposition in text to void
    return datestring
      .toLowerCase()
      .replace("янв", "jan")
      .replace("фев", "feb")
      .replace("мар", "mar")
      .replace("апр", "apr")
      .replace("май", "may")
      .replace("июн", "jun")
      .replace("июл", "jul")
      .replace("авг", "aug")
      .replace("сен", "sep")
      .replace("окт", "oct")
      .replace("ноя", "nov")
      .replace("дек", "dec")
      .replace("в ", "")
      .replace("at ", "");
  }

  function getUserId() {
    return XenForo.visitor?.user_id;
  }

  function getTimestamp() {
    return Math.floor(Date.now() / 1000);
  }

  function getFormattedTimestamp() {
    // It's used so that the chart starts from the beginning of the current day, and does not go for the past 24 hours
    const useFormatted = GM_getValue("stats-time-format", false); // false - for the last 24 hours, true - since the beginning of the day (from 00:00 to 23:59)
    let timestamp = getTimestamp();
    if (!useFormatted) {
      return timestamp;
    }

    const currentDate = new Date(timestamp * 1000); // multiply 1000 to bring it back in MS
    const timeFromZero = currentDate.setHours(23, 59, 59, 59);
    timestamp = timeFromZero / 1000;

    return timestamp;
  }

  function getHTMLFromString(HTMLString) {
    const parser = new DOMParser();
    return parser.parseFromString(HTMLString, "text/html");
  }

  function roundMinutes(date) {
    // https://stackoverflow.com/questions/7293306/how-to-round-to-nearest-hour-using-javascript-date-object
    date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
    date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds

    return date;
  }

  function formatDate(dateString) {
    // format X hours, minutes and etc to 0X. Ex. 1 -> 01, 12 -> 12
    return ("0" + dateString).slice(-2);
  }

  function getThreadIdByURL(threadURL) {
    const threadId = threadURL.match(FIND_THREAD_ID)?.[1]?.split("/")?.[0];
    return Number(threadId) || 0;
  }

  function getPostIdByURL(postURL) {
    const postId = postURL.match(FIND_POST_ID)?.[1]?.split("/")?.[0];
    return Number(postId) || 0;
  }

  function getProfilePostIdByURL(postURL) {
    const postId = postURL.match(FIND_PROFILE_POST_ID)?.[1]?.split("/")?.[0];
    return Number(postId) || 0;
  }

  function getUserIdByURL(userURL) {
    const matched =
      userURL.match(FIND_USER_POST) || userURL.match(FIND_USER_ID);
    const userId = matched?.[1]?.split("/")?.[0];
    return String(userId) || 0;
  }

  function getCommentPostIdByURL(postURL) {
    const postId = postURL.match(FIND_COMMENT_POST_ID)?.[1]?.split("/")?.[0];
    return Number(postId) || 0;
  }

  function getForumIdByURL(forumURL) {
    const forumId = forumURL.match(FIND_FORUM_ID)?.[1]?.split("/")?.[0];
    return String(forumId) || 0;
  }

  function getPostIdByFullURL(postURL) {
    const postId = postURL
      .match(FIND_POST_ID_IN_FULL_URL)?.[1]
      ?.split("/")?.[0];
    return Number(postId) || 0;
  }

  function getChatIdByURL(chatURL) {
    const chatId = chatURL.match(FIND_CHAT_ID)?.[1]?.split("/")?.[0];
    return Number(chatId) || 0;
  }

  function getConversationIdByURL(conversationURL) {
    const conversationId = conversationURL
      .match(FIND_CONVERSATION_ID)?.[1]
      ?.split("/")?.[0];
    return Number(conversationId) || 0;
  }

  function calcSumByTime(data, timeFormat = DAY_IN_SECS, maxLength = 7) {
    let sepatedData = {};
    let timestamp = getFormattedTimestamp();

    while (Object.keys(sepatedData).length < maxLength) {
      const temp = data.filter(
        (m) => m.timestamp > timestamp - timeFormat && m.timestamp < timestamp
      );
      const date = roundMinutes(new Date((timestamp - timeFormat) * 1000));
      let dateString = `${formatDate(date.getDate())}.${formatDate(
        date.getMonth() + 1
      )}`;
      if (timeFormat === HOUR_IN_SECS) {
        dateString = `${formatDate(date.getHours())}:${formatDate(
          date.getMinutes()
        )}`;
      }

      sepatedData[dateString] = temp;
      timestamp -= timeFormat;
    }

    return sepatedData;
  }

  function getSumValuesByTime(sumData) {
    return Object.values(sumData)
      .map((m) => m.length)
      .reverse();
  }

  function getTimeArray(timeFormat = DAY_IN_SECS, maxLength = 7) {
    let timeArray = [];
    let timestamp = getFormattedTimestamp();
    const firstDateFormat = timeFormat === MONTH_IN_SECS ? 0 : timeFormat;

    for (let i = 0; i < maxLength; i++) {
      const date = roundMinutes(new Date((timestamp - firstDateFormat) * 1000));
      if (timeFormat === HOUR_IN_SECS) {
        timeArray.push(
          `${formatDate(date.getHours())}:${formatDate(date.getMinutes())}`
        );
      } else {
        timeArray.push(
          `${formatDate(date.getDate())}.${formatDate(date.getMonth() + 1)}`
        ); // month start with 0
      }

      timestamp -= timeFormat;
    }

    return timeArray;
  }

  /**
   * Save stats in GM Storage
   *
   * @param {object} stats - object of stats (ex.: id, message, timestamp)
   * @param {string} valueName - name of storage
   */
  function saveStats(stats, valueName) {
    console.debug("[LZTStats.saveStats]", stats);
    let oldData = GM_getValue(valueName);
    if (oldData === undefined) {
      oldData = [];
    }

    oldData.push(stats);

    GM_setValue(valueName, oldData);
  }

  const sleep = (m) => new Promise((r) => setTimeout(r, m));

  // * FILES
  function downloadJSONFile(data, name) {
    const blob = new Blob([data], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${name}.json`;
    link.click();
    return link;
  }

  async function uploadJSONFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.click();

    const file = await new Promise((resolve) => {
      input.onchange = () => {
        resolve(input.files[0]);
      };
    });

    const reader = new FileReader();
    reader.readAsText(file);

    return await new Promise((resolve) => {
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (e) => {
        console.error(i18n.get("upload-file-error"), e);
        resolve(false);
      };
    });
  }

  // * MAIN
  function init() {
    initHooks();
    initMenuBtn();
  }

  init();
})();

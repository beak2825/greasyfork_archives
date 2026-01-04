// ==UserScript==
// @name         Bangumi Shortcuts
// @namespace    https://greasyfork.org/users/945689
// @version      0.1
// @description  为一系列常用操作添加快捷键
// @author       momo@545377
// @license      MIT
// @match        *://bgm.tv/*
// @match        *://bangumi.tv/*
// @match        *://chii.in/*
// @grant        none
// @charset      UTF-8
// @downloadURL https://update.greasyfork.org/scripts/524821/Bangumi%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/524821/Bangumi%20Shortcuts.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const $ = window.jQuery;
  const domain = window.location.hostname;
  let user_id = null;
  console.log("userId:", user_id);

  // 常用选择器
  const selectors = {
    searchInput: "#search_text",
    favBtn: 'a[title="加入收藏"], a[title="修改收藏"]',
    hitoFavBtn: "#headerSubject span.collect a",
    epSubjectLink: "#subject_inner_info a.avatar",
    commentInput: "textarea#content",
    prevEpBtn: "ul.photoPage a.prev",
    prevEpBtn: "ul.photoPage a.next",
    indexFavBtn: ".grp_box a.chiiBtn",
    cvStarInTab: "ul.navTabs li:nth-child(2) a",
  };

  const navTo = (url) => {
    if (url) window.location.href = url;
  };

  const getUserId = () => {
    try {
      const userLink = $("#dock li.first a").attr("href");
      if (userLink && userLink.startsWith(`https://${domain}/user/`)) {
        return userLink.split("/user/")[1];
      }
    } catch (error) {
      console.error("Failed to get user ID:", error);
    }
    return null;
  };

  const getBasePath = () => {
    const path = window.location.pathname;
    const basePathPattern =
      /^(\/(subject|ep|character|person|index|blog|group\/topic|subject\/topic)\/(\d+))(\/(\w+))*?$/;
    const match = path.match(basePathPattern);
    return match ? [match[1], match[2]] : [null, "unknown"];
  };

  const getSubjectUrl = () => {
    return $(selectors.epSubjectLink).attr("href") || null;
  };

  const leftClick = (selector, condition) => {
    const element = $(selector)
      .filter(function () {
        return condition ? condition($(this)) : true;
      })
      .first();
    if (element.length > 0) element[0].click();
  };

  // 快捷键配置
  const shortcuts = {
    general: {
      F: () => $(selectors.searchInput).focus(),
      N: () => navTo(`https://${domain}/new_subject/1`),
      ".": () => {
        if (user_id) {
          navTo(`/user/${user_id}`);
        } else {
          console.log("用户未登录");
        }
      },
      "`": () => navTo(`https://${domain}`),
    },
    subject: {
      O: (basePath) => navTo(basePath),
      W: () => leftClick(selectors.favBtn),
      E: (basePath) => navTo(`${basePath}/edit_detail`),
      R: (basePath) => navTo(`${basePath}/reviews`),
      T: (basePath) => navTo(`${basePath}/board`),
      Y: (basePath) => navTo(`${basePath}/comments`),
      U: (basePath) => navTo(`${basePath}/upload_img`),
      A: (basePath) => navTo(`${basePath}/add_related/subject/anime`),
      Z: (basePath) => navTo(`${basePath}/ep`),
      C: (basePath) => navTo(`${basePath}/characters`),
      S: (basePath) => navTo(`${basePath}/persons`),
      H: (basePath) => navTo(`${basePath}/edit`),
    },
    person: {
      W: () => leftClick(hitoFavBtn),
      D: () => leftClick(hitoFavBtn),
      C: (basePath) =>
        leftClick(selectors.cvStarInTab, (el) => {
          if (el.text() === "角色") {
            navTo(`${basePath}/works/voice`);
            return true;
          }
          return false;
        }),
      Z: (basePath) => navTo(`${basePath}/works`),
      E: (basePath) => navTo(`${basePath}/edit`),
    },
    character: {
      W: () => leftClick(hitoFavBtn),
      D: () => leftClick(hitoFavBtn),
      E: (basePath) => navTo(`${basePath}/edit`),
    },
    ep: {
      O: (subjectUrl) => navTo(subjectUrl),
      Z: (subjectUrl) => subjectUrl && navTo(`${subjectUrl}/ep`),
      ARROWLEFT: () => leftClick(selectors.prevEpBtn),
      ARROWRIGHT: () => leftClick(selectors.prevEpBtn),
      R: () => $(selectors.commentInput).focus(),
      E: (basePath) => navTo(`${basePath}/edit`),
    },
    index: {
      W: () =>
        leftClick(
          selectors.indexFavBtn,
          (el) =>
            el.text().includes("收藏这个目录") || el.text().includes("取消收藏")
        ),
      D: () =>
        leftClick(
          selectors.indexFavBtn,
          (el) =>
            el.text().includes("收藏这个目录") || el.text().includes("取消收藏")
        ),
      R: (basePath) => navTo(`${basePath}/comments`),
    },
    blog: {
      R: () => $(selectors.commentInput).focus(),
    },
    "group/topic": {
      R: () => $(selectors.commentInput).focus(),
    },
    "subject/topic": {
      R: () => $(selectors.commentInput).focus(),
    },
  };

  // 通用快捷键处理
  const handleShortcuts = (e, contentType, basePath, subjectUrl) => {
    const actions = shortcuts[contentType];
    if (actions && actions[e.key.toUpperCase()]) {
      e.preventDefault();
      actions[e.key.toUpperCase()](basePath, subjectUrl);
    }
  };

  // 快捷键绑定
  const bindShortcuts = () => {
    $(document).on("keydown", function (e) {
      // Sitewide (Alt[+Shift]+)
      if (e.altKey && !e.ctrlKey) {
        e.preventDefault();
        if (shortcuts.general[e.key.toUpperCase()]) {
          shortcuts.general[e.key.toUpperCase()]();
        }
      }
      // Pages (Alt+Shift+)
      if (e.altKey && e.shiftKey) {
        const [basePath, contentType] = getBasePath();
        const subjectUrl = getSubjectUrl();
        handleShortcuts(e, contentType, basePath, subjectUrl);
      }
    });
  };

  // Init
  $(document).ready(function () {
    user_id = getUserId();
    bindShortcuts();
  });
})();

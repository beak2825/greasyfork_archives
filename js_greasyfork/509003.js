// ==UserScript==
// @name         给hio页面添加正确的标题
// @namespace    https://github.com/dadaewqq/fun
// @version      2.6
// @description  替换万年不变的"hio"标题
// @author       dadaewqq
// @match        https://hio.oppo.com/*
// @grant        none
// @run-at       document-body
// @require      http://code.jquery.com/jquery-latest.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509003/%E7%BB%99hio%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%E6%AD%A3%E7%A1%AE%E7%9A%84%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/509003/%E7%BB%99hio%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%E6%AD%A3%E7%A1%AE%E7%9A%84%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const $ = window.jQuery.noConflict(true);
  const currentUrl = window.location.href;

  const decodeHTMLEntities = (str) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = str;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const fetchAndSetTitle = (apiUrl, titleKey, suffix = "") => {
    fetch(apiUrl, { headers: { Accept: "application/json" } })
      .then((response) => response.json())
      .then((data) => {
        const title = titleKey.split(".").reduce((obj, key) => obj[key], data);
        if (title) document.title = decodeHTMLEntities(title) + suffix;
      })
      .catch((error) => console.error("Fetch 请求失败：", error));
  };

  const setTitleFromElement = (
    selector,
    attribute = "textContent",
    suffix = ""
  ) => {
    const element = $(selector);
    if (element.length > 0) {
      const title = element[0][attribute].trim();
      document.title = title + suffix;
    }
  };

  const urlActions = [
    {
      match: (url) =>
        url === "https://hio.oppo.com/app/home" ||
        url === "https://hio.oppo.com/app/home/",
      action: () => (document.title = "HIO主页"),
    },

    {
      match: (url) =>
        url === "https://hio.oppo.com/app/im/integralMall" ||
        url === "https://hio.oppo.com/app/im/integralMall/",
      action: () => (document.title = "HIO积分商城"),
    },

    {
      match: (url) =>
        url === "https://hio.oppo.com/app/course/centre/index" ||
        url === "https://hio.oppo.com/app/course/centre/index/",
      action: () => (document.title = "HIO课程中心"),
    },

    {
      match: (url) =>
        url === "https://hio.oppo.com/app/training" ||
        url === "https://hio.oppo.com/app/training/",
      action: () => (document.title = "HIO项目培训"),
    },

    {
      match: (url) =>
        url === "https://hio.oppo.com/app/kb/center/knowledge-main" ||
        url === "https://hio.oppo.com/app/kb/center/knowledge-main/",
      action: () => (document.title = "HIO知识库"),
    },
    {
      match: (url) =>
        url === "https://hio.oppo.com/app/certifications" ||
        url === "https://hio.oppo.com/app/certifications/",
      action: () => (document.title = "HIO认证中心"),
    },
    {
      match: (url) =>
        url === "https://hio.oppo.com/app/channel/list" ||
        url === "https://hio.oppo.com/app/channel/list/",
      action: () => (document.title = "HIO直播"),
    },
    {
      match: (url) =>
        url === "https://hio.oppo.com/app/ozone/ozoneSquare" ||
        url === "https://hio.oppo.com/app/ozone/ozoneSquare/",
      action: () => (document.title = "HIO Ozone"),
    },
    {
      match: (url) =>
        url ===
          "https://hio.oppo.com/app/learningmap/specialDetail/157862392_157829887" ||
        url ===
          "https://hio.oppo.com/app/learningmap/specialDetail/157862392_157829887/",
      action: () => (document.title = "HIO专题资源 每日好课（合集）"),
    },
    {
      match: (url) =>
        url ===
          "https://hio.oppo.com/app/learningmap/specialDetail/157862693_157829586" ||
        url ===
          "https://hio.oppo.com/app/learningmap/specialDetail/157862693_157829586/",
      action: () => (document.title = "HIO专题资源 嗨训营课程（合集）"),
    },
    {
      match: (url) =>
        url === "https://hio.oppo.com/app/theme" ||
        url === "https://hio.oppo.com/app/theme/",
      action: () => (document.title = "HIO精品专题"),
    },
    {
      match: (url) =>
        url === "https://hio.oppo.com/app/activity/index" ||
        url === "https://hio.oppo.com/app/activity/index/",
      action: () => (document.title = "HIO活动"),
    },
    {
      match: (url) =>
        url.startsWith("https://hio.oppo.com/app/videoCenter/index"),
      action: () => (document.title = "HIO短视频"),
    },
    {
      match: (url) => url.startsWith("https://hio.oppo.com/app/StudyRank"),
      action: () => (document.title = "HIO学习排行榜"),
    },
    {
      match: (url) => url.startsWith("https://hio.oppo.com/app/question/index"),
      action: () => (document.title = "HIO论坛"),
    },
    {
      match: (url) => url.startsWith("https://hio.oppo.com/app/kb/center/view"),
      action: () =>
        setTitleFromElement("#downloadTTQrcodeTitle", "value", " 知识库 "),
    },
    {
      match: (url) => url.startsWith("https://hio.oppo.com/app/im/productDetail/"),
      action: () =>
        setTitleFromElement(".over1", "textContent", " 积分商城物品 "),
    },
    {
      match: (url) =>
        url.startsWith("https://hio.oppo.com/app/ozone/activity") ||
        url.startsWith("https://hio.oppo.com/app/activity"),
      action: () =>
        setTitleFromElement("#downloadTTQrcodeTitle", "value", " OJT/活动 "),
    },
    {
      match: (url) =>
        url.startsWith("https://hio.oppo.com/app/question/detail/"),
      action: () =>
        setTitleFromElement("#downloadTTQrcodeTitle", "value", " 论坛帖子 "),
    },
    {
      match: (url) =>
        url.startsWith("https://hio.oppo.com/app/certification/course-details"),
      action: () =>
        setTitleFromElement("#downloadTTQrcodeTitle", "value", " 嗨训营/口袋课堂 "),
    },
    {
      match: (url) => url.startsWith("https://hio.oppo.com/app/personal"),
      action: () =>
        setTitleFromElement(
          ".title.one-line.setHeight",
          "textContent",
          " HIO个人主页 "
        ),
    },

    {
      match: (url) =>
        url.startsWith("https://hio.oppo.com/app/course/detail") ||
        url.startsWith("https://hio.oppo.com/app/ozone/reprintCourseVideo"),
      action: () =>
        fetchAndSetTitle(
          `https://hio.oppo.com/app/course/detailJson/${location.pathname
            .split("/")
            .pop()}`,
          "item.itm_title",
          " 课程详情 "
        ),
    },
    {
      match: (url) =>
        url.startsWith("https://hio.oppo.com/app/module/detail") ||
        url.startsWith("https://hio.oppo.com/app/ozone/reprintModule"),
      action: () =>
        fetchAndSetTitle(
          `https://hio.oppo.com/app/module/detail-info${location.search}`,
          "item.itm_title",
          " 视频点播 "
        ),
    },
    {
      match: (url) =>
        url.startsWith("https://hio.oppo.com/app/videoCourse/detail"),
      action: () =>
        fetchAndSetTitle(
          `https://hio.oppo.com/app/videoCourse/getDetail?id=${location.pathname
            .split("/")
            .pop()}`,
          "data.title",
          " 课程 "
        ),
    },

    {
      match: (url) => url.startsWith("https://hio.oppo.com/app/theme/detail"),
      action: () =>
        fetchAndSetTitle(
          `https://hio.oppo.com/app/theme/basicInfo?ustId=${location.pathname
            .split("/")
            .pop()}`,
          "title",
          " 专题 "
        ),
    },

    {
      match: (url) => url.startsWith("https://hio.oppo.com/app/channel/detail"),
      action: () => {
        const cid = new URLSearchParams(new URL(currentUrl).search).get("cid");
        fetchAndSetTitle(
          `https://hio.oppo.com/app/netease/channel/detail?id=${cid}`,
          "data.name",
          " 直播 "
        );
      },
    },

    {
      match: (url) => url.startsWith("https://hio.oppo.com/app/certifications"),
      action: () => {
        const weCourseId = location.pathname.split("/").pop();
        fetchAndSetTitle(
          `https://hio.oppo.com/app/weCourse/getDetail?weCourseId=${weCourseId}`,
          "data.weCourseTitle",
          " 认证课 "
        );
      },
    },
  ];

  const executeAction = (url) => {
    for (const { match, action } of urlActions) {
      if (match(url)) {
        action();
        break;
      }
    }
  };

  executeAction(currentUrl);
})();

// ==UserScript==
// @name         信息抓取
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  文章、笔记信息抓取
// @author       dabennn
// @match        https://*.xiaohongshu.com/explore/*
// @match        https://*.douyin.com/video/*
// @match        https://baijiahao.baidu.com/*
// @match        https://mp.weixin.qq.com/*
// @match        https://*.sohu.com/a/*
// @match        https://*.toutiao.com/article/*
// @match        https://*.toutiao.com/w/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @license      MIT
// @grant        GM_notification
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522324/%E4%BF%A1%E6%81%AF%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/522324/%E4%BF%A1%E6%81%AF%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  function getElementText(domSelector) {
    const el = document.querySelector(domSelector);
    return el ? el.textContent.trim() : "";
  }
  function getElementTextByXPath(xpath) {
    const el = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    return el ? el.textContent.trim() : "";
  }
  function createInfoModal(infoText, copyText) {
    // 创建一个用于显示信息的div元素作为浮窗
    const infoDiv = document.createElement("div");
    infoDiv.style.position = "fixed";
    infoDiv.style.top = "0";
    infoDiv.style.right = "0";
    infoDiv.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    infoDiv.style.padding = "10px";
    infoDiv.style.border = "1px solid gray";
    infoDiv.style.zIndex = "9999";

    // 创建关闭按钮元素
    const closeButton = document.createElement("span");
    closeButton.id = "__close_btn__";
    closeButton.textContent = "×";
    closeButton.style.cursor = "pointer";
    closeButton.style.float = "right";
    closeButton.style.fontSize = "18px";
    closeButton.style.color = "red";

    // 创建复制按钮元素
    const copyButton = document.createElement("span");
    copyButton.id = "__copy__";
    copyButton.textContent = "复制";
    copyButton.style.cursor = "pointer";
    copyButton.style.float = "right";
    copyButton.style.marginRight = "5px";
    copyButton.style.fontSize = "18px";
    copyButton.style.color = "blue";

    // 先将关闭按钮添加到浮窗中
    infoDiv.appendChild(closeButton);
    // 再将复制按钮添加到浮窗中
    infoDiv.appendChild(copyButton);

    // 将信息拼接成字符串并设置到浮窗的innerHTML中
    infoDiv.innerHTML += infoText;

    // 将浮窗添加到页面的body元素中
    document.body.appendChild(infoDiv);

    document
      .querySelector("#__close_btn__")
      .addEventListener("click", function () {
        infoDiv.parentNode.removeChild(infoDiv);
      });

    document.querySelector("#__copy__").onclick = function () {
      navigator.clipboard
        .writeText(copyText)
        .then(function () {
          GM_notification("已复制到剪贴板");
        })
        .catch(function (err) {
          GM_notification("复制失败");
          console.error("复制失败：", err);
        });
    };
  }
  function createFloatButton() {
    const button = document.createElement("div");
    button.textContent = "信息抓取";
    button.id = "__float_btn__";
    button.style.position = "fixed";
    button.style.top = "150px";
    button.style.right = "0";
    button.style.zIndex = "9999";
    button.style.backgroundColor = "rgba(255, 100, 100, 0.9)";
    button.style.color = "#fff";
    button.style.borderRadius = "4px";
    button.style.padding = "10px";
    button.style.cursor = "pointer";

    // 关闭按钮
    const closeButton = document.createElement("span");
    closeButton.textContent = "×";
    closeButton.style.position = "absolute";
    closeButton.style.top = "-3px";
    closeButton.style.right = "2px";
    closeButton.style.fontSize = "16px";
    closeButton.style.lineHeight = "1";

    button.appendChild(closeButton);
    closeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      button.parentNode.removeChild(button);
    });
    document.body.appendChild(button);
  }
  const formatTextInfo = (texts) =>
    texts.join("<br>").replace(/undefined/g, "未获取到");
  const formatNumInfo = (texts) => texts.join(" ").replace(/undefined/g, "0");
  const formatCopyNum = (num) => (/\d/.test(num) ? num : 0);
  const getCopyTime = (time) => time.replace(/[年月]/g, "/").replace(/日/, "");
  const getInfoTexts = () => {
    let textInfo = "";
    let copyInfo = "";
    if (window.location.href.includes("xiaohongshu.com/explore")) {
      const state = unsafeWindow.__INITIAL_STATE__;
      const title = getElementText(".note-content .title");
      const author = getElementText(".username");
      let time = "";
      try {
        time = formatTimestamp(
          state.note.noteDetailMap[state.note.firstNoteId.value].note
            .lastUpdateTime
        );
      } catch (e) {
        console.error(e);
      }
      const wordCount = getElementText(".note-content").length;
      const likeNum = getElementText(
        ".interact-container .like-wrapper .count"
      );
      const commentNum = getElementText(
        ".interact-container .chat-wrapper .count"
      );
      const collectNum = getElementText(
        ".interact-container .collect-wrapper .count"
      );
      textInfo = formatTextInfo([
        `标题：${title}`,
        `作者：${author}`,
        `发布时间：${time}`,
        `字数：${wordCount}`,
        `点赞数：${likeNum}`,
        `评论数：${commentNum}`,
        `收藏数：${collectNum}`,
      ]);
      copyInfo = [
        getCopyTime(time),
        "小红书",
        author,
        title,
        window.location.href,
        formatNumInfo([
          `点赞${formatCopyNum(likeNum)}`,
          `评论${formatCopyNum(commentNum)}`,
          `收藏${formatCopyNum(collectNum)}`,
        ]),
        wordCount,
      ].join("\t");
    } else if (window.location.href.includes("douyin.com/video")) {
      const title = getElementText(
        "h1 span span + span span span span span span"
      );
      const author = getElementTextByXPath(
        '//*[@id="douyin-right-container"]/div[2]/div/div/div[1]/div[4]/div/div[1]/div[2]/a/div/span/span/span/span/span/span'
      );
      const time = getElementTextByXPath(
        '//*[@id="douyin-right-container"]/div[2]/div/div/div[1]/div[3]/div/div[2]/div[2]/span/text()[2]'
      );
      const duration = getElementText(".time-duration");
      const likeNum = getElementTextByXPath(
        '//*[@id="douyin-right-container"]/div[2]/div/div/div[1]/div[3]/div/div[2]/div[1]/div[1]/span'
      );
      const commentNum = getElementTextByXPath(
        '//*[@id="douyin-right-container"]/div[2]/div/div/div[1]/div[3]/div/div[2]/div[1]/div[2]/span'
      );
      const collectNum = getElementTextByXPath(
        '//*[@id="douyin-right-container"]/div[2]/div/div/div[1]/div[3]/div/div[2]/div[1]/div[3]/span'
      );
      const shareNum = getElementTextByXPath(
        '//*[@id="douyin-right-container"]/div[2]/div/div/div[1]/div[3]/div/div[2]/div[1]/div[4]/span'
      );
      textInfo = formatTextInfo([
        `标题：${title}`,
        `作者：${author}`,
        `发布时间：${time}`,
        `时长：${duration}`,
        `点赞数：${likeNum}`,
        `评论数：${commentNum}`,
        `收藏数：${collectNum}`,
        `分享数：${shareNum}`,
      ]);
      copyInfo = [
        getCopyTime(time),
        "抖音视频",
        author,
        title,
        window.location.href,
        formatNumInfo([
          `点赞${formatCopyNum(likeNum)}`,
          `评论${formatCopyNum(commentNum)}`,
          `收藏${formatCopyNum(collectNum)}`,
          `分享${formatCopyNum(shareNum)}`,
        ]),
        duration,
      ].join("\t");
    } else if (window.location.href.includes("sohu.com/a")) {
      const title = getElementText("h1");
      const author = getElementText("#user-info h4 a");
      const time = getElementText("#news-time");
      const wordCount = getElementText("mp-editor").length;
      const readNum = getElementText(".read-num em");
      const likeNum = getElementText(".like-c .count");
      const commentNum = getElementText(".comment-count");
      const collectNum = getElementText(".collection-c .count");
      const shareNum = getElementText(".share-c .count");
      textInfo = formatTextInfo([
        `标题：${title}`,
        `作者：${author}`,
        `发布时间：${time}`,
        `字数：${wordCount}`,
        `阅读数：${readNum}`,
        `点赞数：${likeNum}`,
        `评论数：${commentNum}`,
        `收藏数：${collectNum}`,
        `分享数：${shareNum}`,
      ]);
      copyInfo = [
        getCopyTime(time),
        "搜狐",
        author,
        title,
        window.location.href,
        formatNumInfo([
          `阅读${formatCopyNum(readNum)}`,
          `点赞${formatCopyNum(likeNum)}`,
          `评论${formatCopyNum(commentNum)}`,
          `收藏${formatCopyNum(collectNum)}`,
          `分享${formatCopyNum(shareNum)}`,
        ]),
        wordCount,
      ].join("\t");
    } else if (window.location.href.includes("toutiao.com/article")) {
      const title = getElementText("h1");
      const author = getElementText(".article-meta .name");
      const time = getElementText(".article-meta span");
      const wordCount = getElementText(".tt-article-content").length;
      const likeNum = getElementText(".detail-like span");
      const commentNum = getElementText(".detail-interaction-comment span");
      const collectNum = getElementText(".detail-interaction-collect span");
      textInfo = formatTextInfo([
        `标题：${title}`,
        `作者：${author}`,
        `发布时间：${time}`,
        `字数：${wordCount}`,
        `点赞数：${likeNum}`,
        `评论数：${commentNum}`,
        `收藏数：${collectNum}`,
      ]);
      copyInfo = [
        getCopyTime(time),
        "今日头条",
        author,
        title,
        window.location.href,
        formatNumInfo([
          `点赞${formatCopyNum(likeNum)}`,
          `评论${formatCopyNum(commentNum)}`,
          `收藏${formatCopyNum(collectNum)}`,
        ]),
        wordCount,
      ].join("\t");
    } else if (window.location.href.includes("toutiao.com/w")) {
      const title = getElementText("h1");
      const author = getElementText(".desc .name");
      const time = getElementText(".abstract .time");
      const wordCount = getElementText("article").length;
      const likeNum = getElementText(".detail-like span");
      const commentNum = getElementText(".detail-interaction-comment span");
      const collectNum = getElementText(".detail-interaction-collect span");
      textInfo = formatTextInfo([
        `标题：${title}`,
        `作者：${author}`,
        `发布时间：${time}`,
        `字数：${wordCount}`,
        `点赞数：${likeNum}`,
        `评论数：${commentNum}`,
        `收藏数：${collectNum}`,
      ]);
      copyInfo = [
        getCopyTime(time),
        "今日头条",
        author,
        title,
        window.location.href,
        formatNumInfo([
          `点赞${formatCopyNum(likeNum)}`,
          `评论${formatCopyNum(commentNum)}`,
          `收藏${formatCopyNum(collectNum)}`,
        ]),
        wordCount,
      ].join("\t");
    } else if (window.location.href.includes("baijiahao.baidu.com")) {
      const title = getElementText("#header div");
      const author = getElementText("#header [data-testid=author-name]");
      const time = getElementText("#header [data-testid=updatetime]");
      const wordCount = getElementText("[data-testid=article]").length;
      const likeNum = getElementText("[data-testid=like-btn] .interact-desc");
      const commentNum = getElementText(
        "[data-testid=comment-btn] .interact-desc"
      );
      const collectNum = getElementText(
        "[data-testid=favor-btn] .interact-desc"
      );
      const shareNum = getElementText("[data-testid=share-btn] .interact-desc");
      textInfo = formatTextInfo([
        `标题：${title}`,
        `作者：${author}`,
        `发布时间：${time}`,
        `字数：${wordCount}`,
        `点赞数：${likeNum}`,
        `评论数：${commentNum}`,
        `收藏数：${collectNum}`,
        `分享数：${shareNum}`,
      ]);
      copyInfo = [
        getCopyTime(time),
        "百度",
        author,
        title,
        window.location.href,
        formatNumInfo([
          `点赞${formatCopyNum(likeNum)}`,
          `评论${formatCopyNum(commentNum)}`,
          `收藏${formatCopyNum(collectNum)}`,
          `分享${formatCopyNum(shareNum)}`,
        ]),
        wordCount,
      ].join("\t");
    } else if (window.location.href.includes("mp.weixin.qq.com")) {
      const title = getElementText("h1");
      const author = getElementText("#js_name");
      const time = getElementText("#publish_time");
      const wordCount = getElementText("#js_content").length;
      textInfo = formatTextInfo([
        `标题：${title}`,
        `作者：${author}`,
        `发布时间：${time}`,
        `字数：${wordCount}`,
      ]);
      copyInfo = [
        getCopyTime(time),
        "公众号",
        author,
        title,
        window.location.href,
        formatNumInfo([`点赞`, `转发`, `喜欢`, `评论`]),
        wordCount,
      ].join("\t");
    }
    return {
      textInfo,
      copyInfo,
    };
  };

  window.addEventListener("load", function () {
    createFloatButton();
    document.querySelector("#__float_btn__").addEventListener("click", () => {
      const { textInfo, copyInfo } = getInfoTexts();
      createInfoModal(textInfo, copyInfo);
    });
  });
})();

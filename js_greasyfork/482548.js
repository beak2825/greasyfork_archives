// ==UserScript==
// @name         技术文章发布日期检测
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Check if a  article is expired and show a alert notification.发布太久的技术文章copy的时候得注意点
// @author       You
// @match        https://*.csdn.net/*
// @match        https://blog.51cto.com/*
// @match         https://*.cnblogs.com/*
// @match https://juejin.cn/*
// @match https://www.jianshu.com/*
// @match https://developer.aliyun.com/article/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482548/%E6%8A%80%E6%9C%AF%E6%96%87%E7%AB%A0%E5%8F%91%E5%B8%83%E6%97%A5%E6%9C%9F%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/482548/%E6%8A%80%E6%9C%AF%E6%96%87%E7%AB%A0%E5%8F%91%E5%B8%83%E6%97%A5%E6%9C%9F%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var currentDomain = window.location.hostname;
  console.log(currentDomain);
  debugger;
  if (currentDomain.endsWith("51cto.com")) {
    var pubdateElement = document.querySelector(".fl[pubdate]");
    if (pubdateElement) {
      var pubdateValue = pubdateElement.getAttribute("pubdate");
      formatTimeAndSendNotification(pubdateValue, 1, pubdateElement);
    }
  } else if (currentDomain.endsWith("csdn.net")) {
    var timeElement = document.querySelector(".time.blog-postTime");

    if (timeElement) {
      var timeString = timeElement.getAttribute("data-time");
      formatTimeAndSendNotification(timeString, 1, timeElement);
    }
  } else if (currentDomain.endsWith("juejin.cn")) {
    var timeElement = document.querySelector("time.time");

    if (timeElement) {
      var dateTimeString = timeElement.getAttribute("datetime");
      formatTimeAndSendNotification(dateTimeString, 1, timeElement);
    }
  } else if (currentDomain.endsWith("aliyun.com")) {
    var timeElement = document.querySelector("span.article-info-time");

    if (timeElement) {
      var dateString = timeElement.textContent.trim();
      formatTimeAndSendNotification(dateString, 1, timeElement);
    }
  } else if (currentDomain.endsWith("jianshu.com")) {
    var divElement = document.querySelector(".s-dsoj");

    if (divElement) {
      var timeElement = divElement.querySelector("time");

      if (timeElement) {
        var dateTimeString = timeElement.getAttribute("datetime");

        if (timeElement) {
          var dateTimeString = timeElement.getAttribute("datetime");
          formatTimeAndSendNotification(dateTimeString, 1, timeElement);
        }
      }
    }
  } else if (currentDomain.endsWith("cnblogs.com")) {
    var timeElement2 = document.querySelector("#post-date");
    var linkElement = document.getElementById("cb_post_title_url");
    if (timeElement2) {
      var timeString2 = timeElement2.textContent.trim();
      if (linkElement) {
        var spanElement = linkElement.querySelector('span[role="heading"]');
        if (spanElement) {
          var linkText = spanElement.textContent.trim();
          spanElement.textContent = linkText + "发表于：" + timeString2;
          linkElement = spanElement;
        }
      }

      formatTimeAndSendNotification(
        timeString2,
        1,
        linkElement ? linkElement : timeElement2
      );
    }
  }
  function formatTimeAndSendNotification(timeString, type, timeElement) {
    var daysExpired = 0;
    switch (type) {
      case 1:
        var articleTimestamp = new Date(timeString).getTime();
        var todayTimestamp = new Date().setHours(0, 0, 0, 0);
        daysExpired = Math.floor(
          (todayTimestamp - articleTimestamp) / (1000 * 60 * 60 * 24)
        );
        break;
      default:
        break;
    }
    // 如果文章已经过期，修改标签的背景颜色为红色
    if (daysExpired > 0) {
      timeElement.style.backgroundColor = "red";
      timeElement.style.borderRadius = "15px";
      timeElement.style.color = "#fff";
      timeElement.style.paddingLeft = "20px";
      timeElement.style.paddingRight = "20px";
    }

    // 弹出toast提示
    showToast("This article has expired for " + daysExpired + " days.");
  }

  // 弹出toast提示函数
  function showToast(message) {
    var toastContainer = document.createElement("div");
    toastContainer.style.position = "fixed";
    toastContainer.style.top = "20px";
    toastContainer.style.left = "50%";
    toastContainer.style.transform = "translateX(-50%)";
    toastContainer.style.backgroundColor = "red";
    toastContainer.style.color = "#fff";
    toastContainer.style.padding = "10px";
    toastContainer.style.borderRadius = "5px";
    toastContainer.style.zIndex = "9999";
    toastContainer.textContent = message;

    document.body.appendChild(toastContainer);

    // 3秒后自动关闭toast
    setTimeout(function () {
      document.body.removeChild(toastContainer);
    }, 3000);
  }
})();

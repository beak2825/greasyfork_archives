// ==UserScript==
// @name 平台辅助优化脚本
// @namespace http://tampermonkey.net/
// @version 1.3
// @description 1.双击数据解析信号在左上角并复制 2.优化平台title名称，方便多平台操作
// @author ryoth13
// @match        http://www.mydma.cn/*
// @match        http://www.mydma.cn/*
// @match        http://58.240.47.50/*
// @match        http://mydma.cn/*/*
// @match        http://mydma.cn/*/*/*
// @license MIT
// @grant             unsafeWindow
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_openInTab
// @grant             GM_info
// @grant             GM_registerMenuCommand
// @grant             GM_cookie
// @grant             GM_getResourceText
// @icon              data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBkPSJNMTAzLjYgMTA3LjRjMy41LTIuMiA4LjktNi4xIDEzLjgtMTIuNXM3LjMtMTIuNSA4LjUtMTYuNWMuNS0xLjcgMi4yLTcuNSAyLjItMTQuNyAwLTEwLjEtMy4zLTI1LjEtMTUuNC0zNi44LTE0LjUtMTQtMzIuMS0xNC4zLTM1LjctMTQuMy04IDAtMTUuNyAxLjktMjIuNiA1LjJDNDQgMjMgMzUuNyAzMS40IDMwLjggNDEuN2MtMS4zIDIuOC00IDQuNy03LjEgNS00IC4zLTcuNSA0LjQtOC45IDkuNi0uNSAxLjktMS42IDMuNS0zLjEgNC43QzQuNCA2Ni44IDAgNzUuNyAwIDg1YzAgNi44IDIuMyAxMy4xIDYuMSAxOC4yIDUuNSA3LjQgMTQuMiAxMi4yIDI0IDEyLjJoNDcuMWM0LjQgMCAxMS0uNSAxOC4zLTMuNSAzLjItMS40IDUuOS0zIDguMS00LjV6IiBmaWxsPSIjNDQ0Ii8+PHBhdGggZD0iTTExOS44IDY0LjNjLjEtMTcuMS0xMC40LTI4LTEyLjUtMzAuMUM5NSAyMi4xIDc5LjkgMjEuOCA3Ni45IDIxLjhjLTE3LjYgMC0zMy4zIDEwLjUtMzkuOSAyNi43LS42IDEuMy0xLjggMi4zLTMuNCAyLjNoLS40Yy01LjggMC0xMC42IDQuOC0xMC42IDEwLjd2LjVjMCAxLjQtLjggMi42LTEuOSAzLjNDMTMuNCA2OSA4LjggNzYuOCA4LjggODVjMCAxMi4yIDkuOSAyMi4zIDIyLjIgMjIuM2g0NS4yYzMuNi0uMSAxNy42LS45IDI5LjYtMTIgMi45LTIuOCAxMy45LTEzLjcgMTQtMzF6IiBmaWxsPSIjMTM5N2Q4Ii8+PHBhdGggZD0iTTExMC44IDU3LjRsLjIgMy4zYzAgMS4zLTEuMSAyLjQtMi4zIDIuNC0xLjMgMC0yLjMtMS4xLTIuMy0yLjRsLS4xLTIuOHYtLjNjMC0xLjIuOS0yLjIgMi4xLTIuM2guM2MuNyAwIDEuMy4zIDEuNy43LS4yLjEuMy41LjQgMS40em0tMy4zLTEwLjNjMCAxLjItMSAyLjMtMi4yIDIuM2gtLjFjLS44IDAtMS42LS41LTItMS4yLTQuNi04LjMtMTMuMy0xMy41LTIyLjgtMTMuNS0xLjIgMC0yLjMtMS0yLjMtMi4ydi0uMWMwLTEuMiAxLTIuMyAyLjItMi4zaC4xYTMwLjM3IDMwLjM3IDAgMCAxIDE1LjggNC40YzQuNiAyLjggOC40IDYuOCAxMS4xIDExLjUuMS4zLjIuNy4yIDEuMXpNODguMyA3My44TDczLjUgOTMuMmMtMS41IDEuOS0zLjUgMy4xLTUuNyAzLjVoLS4yYy0uNC4xLS44LjEtMS4yLjEtLjYgMC0xLjEtLjEtMS42LS4yLTIuMi0uNC00LjItMS43LTUuNi0zLjVMNDQuMyA3My45Yy0yLTIuNi0yLjUtNS40LTEuNC03LjcuMS0uMS4xLS4yLjItLjIgMS4yLTIgMy41LTMuMiA2LjQtMy4yaDYuNnYtNS43YzAtNi44IDQuNy0xMiAxMC45LTEyIDQuOCAwIDguNSAyLjYgMTAuMyA3LjIuNSAxLjMtLjIgMi43LTEuNSAzLjJzLTIuOC0uMS0zLjMtMS40Yy0xLjEtMi43LTIuOS00LTUuNS00LTMuNSAwLTYgMy02IDd2OC4xYzAgLjUtLjIgMS0uNiAxLjQtLjYuNy0xLjcgMS4xLTIuNiAxLjFoLTguNGMtMS4zIDAtMiAuNC0yLjEuNy0uMi40IDAgMS4zLjkgMi40TDYzLjEgOTBjLjkgMS4yIDIuMSAxLjggMy4zIDEuOHMyLjMtLjYgMy4xLTEuN2wxNC44LTE5LjNjLjktMS4xIDEuMS0yIC45LTIuNC0uMi0uMy0uOS0uNy0yLjEtLjdoLTcuNmMtLjkgMC0xLjctLjUtMi4xLTEuMi0uMy0uNC0uNC0uOC0uNC0xLjMgMC0xLjQgMS4xLTIuNSAyLjUtMi41aDcuNmMzLjEgMCA1LjUgMS4zIDYuNiAzLjVsLjMuN2MuNyAyLjEuMSA0LjYtMS43IDYuOXoiIGZpbGw9IiM0NDQiLz48L3N2Zz4=
// @downloadURL https://update.greasyfork.org/scripts/495650/%E5%B9%B3%E5%8F%B0%E8%BE%85%E5%8A%A9%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/495650/%E5%B9%B3%E5%8F%B0%E8%BE%85%E5%8A%A9%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var tooltipTimer;
  var tooltip;
  var notification;
        // 获取当前页面的 URL
    var currentUrl = window.location.href;

    // 正则表达式匹配端口号
    var portRegex = /:(\d+)\//;
    var portMatch = currentUrl.match(portRegex);

    if (portMatch) {
        // 获取端口号
        var port = portMatch[1];

        // 构建平台标题
        var platformTitle = port + "平台";

        // 替换标题
        document.title = platformTitle;
    }

  function createNotification(message) {
    var existingNotification = document.getElementById("gm_notification");
    if (existingNotification) {
      existingNotification.parentNode.removeChild(existingNotification);
    }

    notification = document.createElement("div");
    notification.id = "gm_notification";
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 9999;
      transition: opacity 0.5s ease-in-out;
    `;

    document.body.appendChild(notification);

    setTimeout(function () {
      notification.style.opacity = "0";
      setTimeout(function () {
        notification.parentNode.removeChild(notification);
      }, 500);
    }, 1000);
  }

  document.addEventListener("selectionchange", function () {
    var selectedText = window.getSelection().toString().trim();
    var textlen = parseInt(selectedText.substring(2, 6), 16) * 2;

    if (
      (selectedText.length === textlen &&
        selectedText.startsWith("68") &&
        selectedText.endsWith("16")) ||
      (selectedText.length === 446 &&
        selectedText.startsWith("51") &&
        selectedText.endsWith("16"))
    ) {
      var csqvalue = parseInt(selectedText.substring(66, 68), 16);
      var dataToConvert = selectedText.substring(70, 74);

      var csqLG = parseInt(selectedText.substring(68, 70), 16);
      var dataToConvertLG =
        selectedText.substring(72, 74) + selectedText.substring(70, 72);
      var rsrpValue = parseInt(dataToConvert, 16);
      if (rsrpValue > 32767) {
        rsrpValue = rsrpValue - 65536;
      }
      var rsrpValueLG = parseInt(dataToConvertLG, 16);
      if (rsrpValueLG > 32767) {
        rsrpValueLG = rsrpValueLG - 65536;
      }

      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.style.cssText = `
                    position: fixed;
                    top: 10px;
                    left: 10px;
                    background-color: #333;
                    color: #fff;
                    padding: 5px;
                    border-radius: 5px;
                    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
                    z-index: 9999;
                `;
        document.body.appendChild(tooltip);
      }

      if (selectedText.startsWith("68") && selectedText.endsWith("16")) {
        if (selectedText.substring(58, 60) === "01") {
          tooltip.textContent = "CSQ:" + csqvalue + "____RSRP:" + rsrpValue;
          GM_setClipboard(tooltip.textContent);
          createNotification("已复制");
        } else {
          tooltip.textContent = "不包含基本信息";
        }
      }
      if (selectedText.startsWith("51") && selectedText.endsWith("16")) {
        tooltip.textContent = "CSQ:" + csqLG + "____RSRP:" + rsrpValueLG;
        GM_setClipboard(tooltip.textContent);
        createNotification("已复制");
      }

      clearTimeout(tooltipTimer);
      tooltipTimer = setTimeout(function () {
        tooltip.style.display = "block";
      }, 200);

      document.addEventListener("selectionchange", function () {
        if (
          !window.getSelection().toString().trim().startsWith("68") &&
          !window.getSelection().toString().trim().startsWith("51")
        ) {
          clearTimeout(tooltipTimer);
          tooltip.style.display = "none";
        }
      });
    }
  });
})();

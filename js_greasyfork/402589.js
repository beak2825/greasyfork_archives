// ==UserScript==
// @name         Notion to Netlify
// @version      0.2
// @description  在 Notion 中一键触发 Netlify 构建
// @namespace    notion_blog
// @author       superman66
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @match        https://www.notion.so/CUSTOM_KEY/*
// @downloadURL https://update.greasyfork.org/scripts/402589/Notion%20to%20Netlify.user.js
// @updateURL https://update.greasyfork.org/scripts/402589/Notion%20to%20Netlify.meta.js
// ==/UserScript==

/****************** 使用前请按照下面的要求配置 ******************/
/**
 * 1. @match 字段。CUSTOM_KEY 更换为你的。
 * 2. BUILD_HOOK_URL。将HOOK_KEY 更改为实际的KEY。具体配置见 https://docs.netlify.com/configure-builds/build-hooks/
 */
/****************** 配置结束 ******************/

(function () {
  "use strict";
  const BUILD_HOOK_URL = "https://api.netlify.com/build_hooks/HOOK_KEY";

  // Your code here...
  function triggerDeploy() {
    GM_xmlhttpRequest({
      method: "POST",
      url: BUILD_HOOK_URL,
      onload: function (responseDetail) {
        if (responseDetail.status === 200) {
          notifyMe();
        }
      },
    });
  }

  function notifyMe() {
    // 先检查浏览器是否支持
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    // 检查用户是否同意接受通知
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification("Netlify Trigger Deploy Successful.");
    }

    // 否则我们需要向用户获取权限
    else if (Notification.permission !== "denied") {
      Notification.requestPermission(function (permission) {
        // 如果用户同意，就可以向他们发送通知
        if (permission === "granted") {
          var notification = new Notification(
            "Netlify Trigger Deploy Successful."
          );
        }
      });
    }
  }

  function createNetlifyButton() {
    var button = document.createElement("div");
    button.setAttribute("role", "button");
    button.setAttribute("id", "deploy");
    button.setAttribute(
      "style",
      "position: fixed;top: 9px;right: 260px;z-index: 888;user-select: none;transition: background 120ms ease-in 0s;cursor: pointer;display: inline-flex;align-items: center;flex-shrink: 0;white-space: nowrap;height: 28px;border-radius: 3px;font-size: 14px;line-height: 1.2;min-width: 0px;padding-left: 8px;padding-right: 8px;color: rgb(55, 53, 47);"
    );
    button.innerHTML = "Deploy to Netlify";
    document.body.append(button);
  }

  $(document).ready(function () {
    createNetlifyButton();

    $("#deploy").on("click", function () {
      triggerDeploy();
    });
  });
})();

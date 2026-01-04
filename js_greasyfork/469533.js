// ==UserScript==
// @name         自用集合-Weidows
// @description  1.度盘链接添加前缀(常见于B站 s/xxxx?pwd=xxxx 这样的) | 2.将steam偏好隐藏选项显示出来 | 3.Add a button to convert GitHub file links to JsDelivr links
// @namespace    https://github.com/Weidows/Web/raw/master/JavaScript/userscript/custom-scripts.user.js
// @homepage     https://greasyfork.org/zh-CN/scripts/469533
// @supportURL   https://github.com/Weidows/Web
// @version      0.3.0
// @author       Weidows
// @match        *://*.bilibili.com/*
// @match        *://store.steampowered.com/account/preferences*
// @match        *://github.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469533/%E8%87%AA%E7%94%A8%E9%9B%86%E5%90%88-Weidows.user.js
// @updateURL https://update.greasyfork.org/scripts/469533/%E8%87%AA%E7%94%A8%E9%9B%86%E5%90%88-Weidows.meta.js
// ==/UserScript==

/*
 * @!: *********************************************************************
 * @Author: Weidows
 * @LastEditors: Weidows
 * @Date: 2023-06-26 23:49:06
 * @LastEditTime: 2024-04-21 06:05:16
 * @FilePath: \Web\JavaScript\userscript\custom-scripts.user.js
 * @Description:

3.Add a button to convert GitHub file links to JsDelivr links

![5dfSz8PDEhjwWuG.png](https://s2.loli.net/2024/04/21/5dfSz8PDEhjwWuG.png)

 * @?: *********************************************************************
 */

https: (function () {
  "use strict";
  if (window.location.host.includes("bilibili.com")) {
    handleBilibili();
  } else if (window.location.host.includes("steampowered.com")) {
    handleSteam();
  } else if (window.location.host.includes("github.com")) {
    handleGithub();
  }
})();

function handleBilibili() {
  // Define a function to get the selected text
  function getSelectedText() {
    var text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    return text;
  }

  // Define a function to handle the selection change event
  function handleSelectionChange() {
    // Get the selected text
    var text = getSelectedText();
    if (text) {
      // console.log(text);
      let urls = text.match(/s\/.*?(\?pwd=\w+)/g);
      urls.forEach(function (url) {
        window.open("https://pan.baidu.com/" + url);
      });
    }
  }

  // Add an event listener to the document for the selection change event
  document.addEventListener("selectionchange", handleSelectionChange);
}

function handleSteam() {
  document
    .querySelectorAll(".preference_row.account_setting_not_customer_facing ")
    .forEach((i) => i.classList.remove("account_setting_not_customer_facing"));
}

function handleGithub() {
  // Function to convert GitHub URL to JsDelivr URL
  function convertToJsDelivr(url) {
    return url
      .replace("https://github.com", "https://cdn.jsdelivr.net/gh")
      .replace(/blob\/[^\/]+\//, "");
  }

  // Function to create and add the new button
  var targetButton = document.getElementsByClassName("fnqUrX")[0];
  if (targetButton) {
    var newButton = targetButton.cloneNode(true);
    newButton.title = "Copy JsDelivr link";
    newButton.onclick = function () {
      var currentUrl = window.location.href;
      var jsDelivrUrl = convertToJsDelivr(currentUrl);
      navigator.clipboard.writeText(jsDelivrUrl);
    };
    targetButton.parentNode.insertBefore(newButton, targetButton.nextSibling);
  }
}

// ==UserScript==
// @name         Clear Storage
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  清除网页存储的会话信息，以便刷新获取新的数据
// @author       MoFan
// @match        https://temp-mail.org/*
// @icon         https://s2.loli.net/2024/04/10/z5ANFbKmnq79tuR.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492171/Clear%20Storage.user.js
// @updateURL https://update.greasyfork.org/scripts/492171/Clear%20Storage.meta.js
// ==/UserScript==

(function() {
    'use strict';
// 创建消息容器
    var messageContainer = document.createElement("div");
    messageContainer.className = "message-container";
    messageContainer.style.borderRadius = "5px";
    messageContainer.style.position = "fixed";
    messageContainer.style.top = "20px";
    messageContainer.style.left = "50%";
    messageContainer.style.transform = "translateX(-50%)";
    messageContainer.style.backgroundColor = "#1890ff";
    messageContainer.style.color = "white";
    messageContainer.style.padding = "10px 20px";
    messageContainer.style.display = "none";
    messageContainer.style.zIndex = "999999";
    messageContainer.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    messageContainer.style.fontFamily = "Arial, sans-serif";
    messageContainer.style.fontSize = "14px";

    // 创建清除按钮
    var clearButton = document.createElement("button");
    clearButton.textContent = "Clear";
    clearButton.className = "mofan-clear-btn";
    clearButton.style.position = "fixed";
    clearButton.style.right = "10px";
    clearButton.style.top = "10px";
    clearButton.style.zIndex = "99999";
    clearButton.style.fontSize = "1.2rem";
    clearButton.style.padding = "1rem 2.5rem";
    clearButton.style.border = "none";
    clearButton.style.outline = "none";
    clearButton.style.borderRadius = "0.4rem";
    clearButton.style.cursor = "pointer";
    clearButton.style.textTransform = "uppercase";
    clearButton.style.backgroundColor = "rgb(14, 14, 26)";
    clearButton.style.color = "rgb(234, 234, 234)";
    clearButton.style.fontWeight = "700";
    clearButton.style.transition = "0.6s";
    clearButton.style.boxShadow = "0px 0px 60px #1f4c65";
    clearButton.style.webkitBoxReflect = "below 10px linear-gradient(to bottom, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.4))";

    // 添加按钮点击事件
    clearButton.addEventListener("click", function () {
      try {
        localStorage.clear();
        sessionStorage.clear();
        clearAllCookies();
        showMessage("清除完毕");
        location.reload();
      } catch (error) {
        showMessage("清除发生错误，建议手动清除", "danger");
      }
    });

    // 添加样式
    clearButton.addEventListener("mouseover", function () {
      clearButton.style.background = "rgb(2, 29, 78)";
      clearButton.style.background = "linear-gradient(270deg, rgba(2, 29, 78, 0.681) 0%, rgba(31, 215, 232, 0.873) 60%)";
      clearButton.style.color = "rgb(4, 4, 38)";
    });

    clearButton.addEventListener("mouseout", function () {
      clearButton.style.background = "rgb(14, 14, 26)";
      clearButton.style.color = "rgb(234, 234, 234)";
    });

    // 将消息容器和清除按钮添加到body中
    document.body.appendChild(messageContainer);
    document.body.appendChild(clearButton);

    // 消息显示函数
    function showMessage(message, type, duration = 1500) {
      var bgColor = "#1890ff";
      if (type === 'danger') {
        bgColor = "red";
      }
      messageContainer.textContent = message;
      messageContainer.style.display = "block";
      messageContainer.style.backgroundColor = bgColor;
      setTimeout(function () {
        messageContainer.style.display = "none";
      }, duration);
    }

    // 清除所有Cookie函数
    function clearAllCookies() {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
    }
})();
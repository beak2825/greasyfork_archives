// ==UserScript==
// @name         深圳图书馆北馆wifi 自动登录
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在深图北，隔没多久不用电脑，就要重新认证上网了...这实在让人有点苦恼，于是有了这个脚本
// @author       Joshlee
// @match        http://10.5.12.50:8445/portalpage/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=12.50
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502662/%E6%B7%B1%E5%9C%B3%E5%9B%BE%E4%B9%A6%E9%A6%86%E5%8C%97%E9%A6%86wifi%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/502662/%E6%B7%B1%E5%9C%B3%E5%9B%BE%E4%B9%A6%E9%A6%86%E5%8C%97%E9%A6%86wifi%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function main() {
  let saveTimeout;

  // 创建配置界面的容器
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "10px";
  container.style.left = "10px";
  container.style.padding = "15px";
  container.style.backgroundColor = "#f8f9fa";
  container.style.border = "1px solid #dee2e6";
  container.style.borderRadius = "8px";
  container.style.zIndex = "9999";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.width = "220px";
  container.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.1)";

  // 添加表单元素
  container.innerHTML = `
      <h3 style="margin-bottom: 10px; font-size: 16px; color: #343a40;">深圳图书馆WiFi登录</h3>
      <label for="shenzhenLibraryID" style="font-size: 14px; color: #495057;">读者证号:</label><br>
      <input type="text" id="shenzhenLibraryID" style="width: 100%; padding: 5px; margin-bottom: 10px; border: 1px solid #ced4da; border-radius: 4px;"><br>
      <label for="shenzhenLibraryPWD" style="font-size: 14px; color: #495057;">密码:</label><br>
      <input type="password" id="shenzhenLibraryPWD" style="width: 100%; padding: 5px; margin-bottom: 10px; border: 1px solid #ced4da; border-radius: 4px;"><br>
      <label for="loginSpeed" style="font-size: 14px; color: #495057;">速度(ms):</label><br>
      <input type="number" id="loginSpeed" value="1000" style="width: 100%; padding: 5px; margin-bottom: 10px; border: 1px solid #ced4da; border-radius: 4px;"><br>
      <label style="font-size: 14px; color: #495057;">自动登录:</label>
      <label class="switch">
        <input type="checkbox" id="autoLogin" checked>
        <span class="slider round"></span>
      </label><br><br>
      <button id="saveSettings" style="display: none; width: 100%; padding: 8px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">保存配置</button>
      <div id="saveFeedback" style="display: none; margin-top: 10px; color: #28a745; font-size: 14px;">设置已保存!</div>
    `;

  // 添加开关样式
  const style = document.createElement("style");
  style.innerHTML = `
      .switch {
        position: relative;
        display: inline-block;
        width: 34px;
        height: 20px;
        margin-left: 10px;
        vertical-align: middle;
      }
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.4s;
        border-radius: 34px;
      }
      .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
      }
      input:checked + .slider {
        background-color: #007bff;
      }
      input:checked + .slider:before {
        transform: translateX(14px);
      }
    `;
  document.head.appendChild(style);

  // 将容器添加到文档中
  document.body.appendChild(container);

  // 从localStorage加载设置
  document.getElementById("shenzhenLibraryID").value =
    localStorage.getItem("shenzhenLibraryID") || "";
  document.getElementById("shenzhenLibraryPWD").value =
    localStorage.getItem("shenzhenLibraryPWD") || "";
  document.getElementById("autoLogin").checked =
    localStorage.getItem("autoLogin") !== "false";
  document.getElementById("loginSpeed").value =
    localStorage.getItem("loginSpeed") || "1000";

  // 保存设置到localStorage
  function saveSettings() {
    localStorage.setItem(
      "shenzhenLibraryID",
      document.getElementById("shenzhenLibraryID").value
    );
    localStorage.setItem(
      "shenzhenLibraryPWD",
      document.getElementById("shenzhenLibraryPWD").value
    );
    localStorage.setItem(
      "autoLogin",
      document.getElementById("autoLogin").checked
    );
    localStorage.setItem(
      "loginSpeed",
      document.getElementById("loginSpeed").value
    );

    // 显示保存反馈信息
    const feedback = document.getElementById("saveFeedback");
    feedback.style.display = "block";
    feedback.style.opacity = "1";

    // 2秒后淡出提示信息
    setTimeout(() => {
      feedback.style.transition = "opacity 0.5s ease-out";
      feedback.style.opacity = "0";
      setTimeout(() => (feedback.style.display = "none"), 500);
    }, 2000);
  }

  // 监听表单变化
  function handleInputChange() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveSettings, 1000);
  }

  document
    .getElementById("shenzhenLibraryID")
    .addEventListener("input", handleInputChange);
  document
    .getElementById("shenzhenLibraryPWD")
    .addEventListener("input", handleInputChange);
  document
    .getElementById("loginSpeed")
    .addEventListener("input", handleInputChange);
  document
    .getElementById("autoLogin")
    .addEventListener("change", handleInputChange);

  // 自动登录功能
  if (
    document.getElementById("autoLogin").checked
  ) {
    setTimeout(() => {
      document.querySelector("#username").value =
        localStorage.getItem("shenzhenLibraryID");
      document.querySelector("#password").value =
        localStorage.getItem("shenzhenLibraryPWD");
      document.querySelector(".userNoticeContainer").click();
      document.querySelector("#agreeCheck").click();
      document.querySelector("#loginBtn").click();
    }, parseInt(localStorage.getItem("loginSpeed"), 10));
  }
})();

// ==UserScript==
// @name         郑州轻工业大学教务系统自动登录
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动登录ZZULI教务系统
// @license MIT
// @author       Dogxi
// @match        https://jiaowu.zzuli.edu.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542105/%E9%83%91%E5%B7%9E%E8%BD%BB%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/542105/%E9%83%91%E5%B7%9E%E8%BD%BB%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 获取存储的凭据
  const getCredentials = () => ({
    username: GM_getValue("zzuli_username", ""),
    password: GM_getValue("zzuli_password", ""),
    autoSubmit: GM_getValue("zzuli_autoSubmit", true),
  });

  // 设置凭据
  const setupCredentials = () => {
    const username = prompt("请输入学号（本地存储）:");
    const password = prompt("请输入密码（本地存储）:");

    if (username && password) {
      GM_setValue("zzuli_username", username);
      GM_setValue("zzuli_password", password);
      alert("凭据已保存！刷新页面开始自动登录。");
      location.reload();
    }
  };

  const CONFIG = getCredentials();

  // 首次使用设置
  if (!CONFIG.username || !CONFIG.password) {
    if (confirm("检测到首次使用，是否现在配置登录凭据？")) {
      setupCredentials();
    }
    return;
  }

  // 自动跳转到登录页面
  if (location.pathname === "/") {
    location.href = "/jwweb";
    return;
  }

  // 等待页面加载完成后执行登录
  const currentPath = location.pathname;
  if (
    currentPath === "/jwweb" ||
    currentPath === "/jwweb/" ||
    currentPath === "/jwweb/home.aspx" ||
    currentPath === "/jwweb/index.aspx"
  ) {
    waitForLoginForm();
    addCredentialManager();
  }

  function waitForLoginForm() {
    let attempts = 0;
    const maxAttempts = 30;

    const checkForLogin = () => {
      attempts++;
      const loginFrame = document.getElementById("frm_login");

      if (loginFrame) {
        const waitForIframeLoad = () => {
          try {
            const doc =
              loginFrame.contentDocument || loginFrame.contentWindow?.document;

            if (doc && doc.readyState === "complete") {
              // 查找登录元素
              const usernameInput = doc.querySelector(
                'input[name="txt_asmcdefsddsd"]'
              );
              const passwordInput = doc.querySelector(
                'input[name="txt_pewerwedsdfsdff"]'
              );
              const submitBtn = doc.querySelector('input[name="btn_login"]');

              if (usernameInput && passwordInput) {
                autoLogin(usernameInput, passwordInput, submitBtn);
                return true;
              }
            }
          } catch (e) {
            // 忽略跨域访问错误
          }
          return false;
        };

        // 立即尝试
        if (waitForIframeLoad()) return;

        // iframe加载完成后再试
        loginFrame.onload = () => {
          setTimeout(waitForIframeLoad, 200);
        };

        // 定时重试
        const retryInterval = setInterval(() => {
          if (waitForIframeLoad()) {
            clearInterval(retryInterval);
          }
        }, 1000);

        setTimeout(() => clearInterval(retryInterval), 10000);
      } else if (attempts < maxAttempts) {
        setTimeout(checkForLogin, 500);
      }
    };

    // 开始检查
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", checkForLogin);
    } else {
      setTimeout(checkForLogin, 100);
    }
  }

  function autoLogin(usernameInput, passwordInput, submitBtn) {
    try {
      // 清空现有内容
      usernameInput.value = "";
      passwordInput.value = "";

      // 填充用户名
      setTimeout(() => {
        usernameInput.focus();
        usernameInput.value = CONFIG.username;
        // 触发多种事件确保兼容性
        ["input", "change", "keyup", "blur"].forEach((eventType) => {
          usernameInput.dispatchEvent(new Event(eventType, { bubbles: true }));
        });
      }, 100);

      // 填充密码
      setTimeout(() => {
        passwordInput.focus();
        passwordInput.value = CONFIG.password;
        // 触发多种事件确保兼容性
        ["input", "change", "keyup", "blur"].forEach((eventType) => {
          passwordInput.dispatchEvent(new Event(eventType, { bubbles: true }));
        });
      }, 300);

      // 自动提交
      if (CONFIG.autoSubmit && submitBtn) {
        setTimeout(() => {
          try {
            // 先尝试模拟点击事件
            submitBtn.focus();

            // 触发点击事件
            const clickEvent = new MouseEvent("click", {
              bubbles: true,
              cancelable: true,
              view: window,
            });
            submitBtn.dispatchEvent(clickEvent);

            // 备用方案：直接调用click
            submitBtn.click();
          } catch (e) {
            // 尝试表单提交
            const form = submitBtn.closest("form");
            if (form) {
              form.submit();
            }
          }
        }, 800);
      }
    } catch (error) {
      console.error("[zzuli教务系统] 自动登录失败:", error);
    }
  }

  function addCredentialManager() {
    const addButton = () => {
      if (!document.body) {
        setTimeout(addButton, 100);
        return;
      }

      const manageBtn = document.createElement("div");
      manageBtn.innerHTML = "⚙️";
      manageBtn.title = "管理登录凭据";
      manageBtn.style.cssText = `
        position: fixed; top: 10px; right: 10px; z-index: 9999;
        background: #f0f0f0; border: 1px solid #ccc; border-radius: 3px;
        padding: 5px; cursor: pointer; font-size: 16px;
      `;

      manageBtn.onclick = () => {
        const action = confirm(
          "选择操作：\n确定 = 重新设置凭据\n取消 = 清除所有凭据"
        );
        if (action) {
          setupCredentials();
        } else if (confirm("确定要清除所有保存的凭据吗？")) {
          GM_setValue("zzuli_username", "");
          GM_setValue("zzuli_password", "");
          alert("凭据已清除");
          location.reload();
        }
      };

      document.body.appendChild(manageBtn);
    };

    addButton();
  }
})();

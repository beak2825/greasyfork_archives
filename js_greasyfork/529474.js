// ==UserScript==
// @name         剪贴板图片上传lsky图床
// @namespace    http://tampermonkey.net/
// @version      1.7.8
// @description  自动处理 token 和剪贴板图片上传到 lsky 图床
// @author       You
// @match        *://*.nodeseek.com/*
// @match        *://linux.do/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529474/%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0lsky%E5%9B%BE%E5%BA%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/529474/%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0lsky%E5%9B%BE%E5%BA%8A.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const config = loadConfig();

  function loadConfig() {
    return {
      baseUrl: GM_getValue("baseUrl", "http://"),
      token: GM_getValue("token", ""),
      email: GM_getValue("email", ""),
      password: GM_getValue("password", ""),
      strategyId: GM_getValue("strategyId", 1),
    };
  }

  function saveConfig(newConfig) {
    for (const key in newConfig) {
      GM_setValue(key, newConfig[key]);
      config[key] = newConfig[key];
    }
  }

  function addGlobalStyle(css) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createSettingsPanel() {
    if (document.getElementById("gm-settings-panel")) return;

    let panel = document.createElement("div");
    panel.id = "gm-settings-panel";
    panel.innerHTML = `
          <div class="gm-panel">
              <h2>lsky 图床 配置</h2>
              <label>图床地址: <input id="gm-baseUrl" type="text" value="${config.baseUrl}"></label>
              <label>邮箱: <input id="gm-email" type="text" value="${config.email}"></label>
              <label>密码: <input id="gm-password" type="password" value="${config.password}"></label>
              <label>策略 ID: <input id="gm-strategyId" type="number" value="${config.strategyId}"></label>
              <button id="gm-save-settings">保存</button>
              <button id="gm-close-settings">关闭</button>
          </div>
      `;
    document.body.appendChild(panel);

    document
      .getElementById("gm-save-settings")
      .addEventListener("click", () => {
        let baseUrl = document.getElementById("gm-baseUrl").value;
        if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
          baseUrl = "http://" + baseUrl;
        }
        saveConfig({
          baseUrl,
          email: document.getElementById("gm-email").value,
          password: document.getElementById("gm-password").value,
          strategyId: Number(document.getElementById("gm-strategyId").value),
        });
        panel.remove();
        showSuccessMessage("配置已保存！");
      });

    document
      .getElementById("gm-close-settings")
      .addEventListener("click", () => panel.remove());

    addGlobalStyle(`
          #gm-settings-panel {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
              z-index: 10000;
              width: 300px;
          }
          .gm-panel h2 { margin-bottom: 10px; font-size: 18px; }
          .gm-panel label { display: block; margin-bottom: 10px; }
          .gm-panel input { width: 100%; padding: 5px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; }
          .gm-panel button { margin-right: 10px; padding: 6px 12px; cursor: pointer; }
      `);
  }

  function addFloatingButton() {
    const btn = document.createElement("div");
    btn.id = "gm-floating-button";
    btn.innerText = "⚙️ 设置";
    document.body.appendChild(btn);

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    btn.addEventListener("mousedown", function (e) {
      isDragging = false;
      offsetX = e.clientX - btn.getBoundingClientRect().left;
      offsetY = e.clientY - btn.getBoundingClientRect().top;

      function onMouseMove(e) {
        isDragging = true;
        btn.style.left = `${e.clientX - offsetX}px`;
        btn.style.top = `${e.clientY - offsetY}px`;
      }

      function onMouseUp(e) {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        if (!isDragging) {
          createSettingsPanel();
        }
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    addGlobalStyle(`
          #gm-floating-button {
              position: fixed;
              bottom: 20px;
              left: 20px;
              width: 60px;
              height: 20px;
              background: #3498db;
              color: white;
              padding: 10px;
              border-radius: 70px;
              cursor: move;
              font-size: 14px;
              z-index: 9999;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
              user-select: none;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              line-height: normal;
              transition: background 0.2s;
          }
          #gm-floating-button:hover {
              background: #2980b9;
          }
      `);
  }

  async function getToken() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: `${config.baseUrl}/api/v1/tokens`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          email: config.email,
          password: config.password,
        }),
        onload: function (response) {
          try {
            let res = JSON.parse(response.responseText);
            if (res.status && res.data?.token) {
              GM_setValue("token", res.data.token);
              config.token = res.data.token;
              resolve(res.data.token);
            } else {
              reject(res.message || "获取 Token 失败");
            }
          } catch (e) {
            reject("无效响应：" + response.responseText);
          }
        },
        onerror: () => reject("网络错误"),
      });
    });
  }

  function showUploadModal() {
    if (document.getElementById("upload-modal")) return;
    const modal = document.createElement("div");
    modal.id = "upload-modal";
    modal.innerHTML = `
          <div class="modal-content">
              <div class="loader"></div>
              <p>上传中，请稍等...</p>
          </div>`;
    document.body.appendChild(modal);
    addGlobalStyle(`
          #upload-modal {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background-color: rgba(0, 0, 0, 0.5);
              padding: 20px;
              border-radius: 8px;
              z-index: 9999;
              display: flex;
              justify-content: center;
              align-items: center;
          }
          .modal-content {
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
          }
          .loader {
              border: 4px solid #f3f3f3;
              border-top: 4px solid #3498db;
              border-radius: 50%;
              width: 50px;
              height: 50px;
              animation: spin 1s linear infinite;
              margin: auto;
          }
          @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
          }
      `);
  }

  function hideUploadModal() {
    let modal = document.getElementById("upload-modal");
    if (modal) modal.remove();
  }

  function showSuccessMessage(msg) {
    let div = document.createElement("div");
    div.innerHTML = `<div class="success-modal-content"><p>${msg}</p></div>`;
    div.id = "success-modal";
    document.body.appendChild(div);
    addGlobalStyle(`
          #success-modal {
              position: fixed;
              top: 20px;
              left: 50%;
              transform: translateX(-50%);
              background-color: rgba(0, 128, 0, 0.8);
              padding: 10px 20px;
              border-radius: 8px;
              color: white;
              z-index: 10000;
              font-size: 16px;
          }
      `);
    setTimeout(() => div.remove(), 3000);
  }

  function showFailureMessage(msg) {
    let div = document.createElement("div");
    div.innerHTML = `<div class="failure-modal-content"><p>${msg}</p></div>`;
    div.id = "failure-modal";
    document.body.appendChild(div);
    addGlobalStyle(`
          #failure-modal {
              position: fixed;
              top: 20px;
              left: 50%;
              transform: translateX(-50%);
              background-color: rgba(255, 0, 0, 0.8);
              padding: 10px 20px;
              border-radius: 8px;
              color: white;
              z-index: 10000;
              font-size: 16px;
          }
      `);
    setTimeout(() => div.remove(), 3000);
  }

  async function uploadImage(file) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);

      GM_xmlhttpRequest({
        method: "POST",
        url: `${config.baseUrl}/api/v1/upload`,
        headers: {
          Authorization: `Bearer ${config.token}`,
        },
        data: formData,
        onload: function (response) {
          try {
            if (response.status === 401 || response.status === 403) {
              reject("unauthorized");
              return;
            }
            const res = JSON.parse(response.responseText);
            if (res.status && res.data?.links?.markdown) {
              resolve(res.data.links.markdown);
            } else {
              reject(res.message || "上传失败");
            }
          } catch (e) {
            reject("无效响应：" + response.responseText);
          }
        },
        onerror: () => reject("网络错误"),
      });
    });
  }

  async function ensureTokenValid() {
    if (!config.token) {
      await getToken();
    }
  }

  function insertText(text) {
    const el = document.activeElement;
    if (el && (el.tagName === "TEXTAREA" || el.tagName === "INPUT")) {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      el.value = el.value.slice(0, start) + text + el.value.slice(end);
      el.selectionStart = el.selectionEnd = start + text.length;
    } else if (el?.isContentEditable) {
      document.execCommand("insertText", false, text);
    }
  }

  document.addEventListener("paste", async (event) => {
    try {
      const clipboard =
        event.clipboardData || event.originalEvent?.clipboardData;
      if (!clipboard) return;

      const items = clipboard.items;
      const images = [];
      for (let item of items) {
        if (item.type.indexOf("image") !== -1) {
          images.push(item.getAsFile());
        }
      }

      if (images.length === 0) return;
      showSuccessMessage("监听到图片粘贴！");

      showUploadModal();
      await ensureTokenValid();

      for (const file of images) {
        try {
          const url = await uploadImage(file).catch(async (err) => {
            if (err === "unauthorized") {
              await getToken();
              return await uploadImage(file);
            }
            throw err;
          });
          await navigator.clipboard.writeText(url);
          insertText(url); // 写入当前光标处
          showSuccessMessage("上传成功，链接已复制到剪贴板！");
        } catch (err) {
          console.error(err);
          showFailureMessage("上传失败");
        }
      }
    } catch (err) {
      console.error("粘贴处理异常：", err);
    } finally {
      hideUploadModal();
    }
  });

  // 初始化
  addFloatingButton();
})();
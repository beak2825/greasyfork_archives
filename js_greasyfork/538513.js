// ==UserScript==
// @name         V2EX Image Uploader
// @version      1.1.1
// @description  在 V2EX 评论区快速上传图片并插入链接
// @author       Dogxi
// @match        https://www.v2ex.com/t/*
// @match        https://v2ex.com/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.imgur.com
// @license      MIT
// @namespace http://tampermonkey.net/1436051
// @downloadURL https://update.greasyfork.org/scripts/538513/V2EX%20Image%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/538513/V2EX%20Image%20Uploader.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const IMGUR_CLIENT_ID_KEY = "imgurClientId";
  let CLIENT_ID = GM_getValue(IMGUR_CLIENT_ID_KEY, null);

  const STYLE = `
          .imgur-upload-btn {
              background: none;
              border: none;
              color: #778087;
              cursor: pointer;
              font-size: 13px;
              padding: 0;
              margin-left: 15px;
              text-decoration: none;
              transition: color 0.2s ease;
          }
          .imgur-upload-btn:hover {
              color: #4d5256;
              text-decoration: underline;
          }
          .hidden {
              display: none !important;
          }
          .imgur-upload-modal {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 9999;
              outline: none;
          }
          .imgur-upload-modal-content {
              background-color: #fff;
              padding: 20px;
              border-radius: 3px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
              max-width: 450px;
              width: 90%;
              position: relative;
              font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          }
          .imgur-upload-modal-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 1px solid #e2e2e2;
          }
          .imgur-upload-modal-title {
              font-size: 15px;
              font-weight: normal;
              color: #000;
          }
          .imgur-upload-modal-close {
              cursor: pointer;
              font-size: 18px;
              color: #ccc;
              width: 20px;
              height: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: color 0.2s ease;
          }
          .imgur-upload-modal-close:hover {
              color: #999;
          }
          .imgur-upload-dropzone {
              border: 1px dashed #ccc;
              padding: 25px;
              text-align: center;
              margin-bottom: 15px;
              cursor: pointer;
              border-radius: 3px;
              transition: border-color 0.2s ease;
              font-size: 13px;
              color: #666;
              outline: none;
          }
          .imgur-upload-dropzone:hover {
              border-color: #999;
          }
          .imgur-upload-dropzone:focus {
              border-color: #778087;
              background-color: #f9f9f9;
          }
          .imgur-upload-dropzone.dragover {
              border-color: #778087;
              background-color: #f9f9f9;
          }
          .imgur-upload-preview {
              margin-top: 10px;
              max-width: 100%;
              max-height: 150px;
              border-radius: 2px;
          }
          .imgur-upload-actions {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 15px;
              padding-top: 10px;
              border-top: 1px solid #e2e2e2;
          }
          .imgur-upload-config-btn {
              background: none;
              border: none;
              color: #778087;
              cursor: pointer;
              font-size: 12px;
              padding: 0;
          }
          .imgur-upload-config-btn:hover {
              color: #4d5256;
              text-decoration: underline;
          }
          .imgur-upload-submit-btn {
              background-color: #f5f5f5;
              border: 1px solid #ccc;
              border-radius: 3px;
              color: #333;
              cursor: pointer;
              font-size: 12px;
              padding: 6px 12px;
              transition: all 0.2s ease;
          }
          .imgur-upload-submit-btn:hover {
              background-color: #e8e8e8;
          }
          .imgur-upload-submit-btn:disabled {
              background-color: #f9f9f9;
              color: #ccc;
              cursor: not-allowed;
          }
          .imgur-upload-config-panel {
              margin-top: 10px;
              padding: 10px;
              background-color: #f9f9f9;
              border-radius: 3px;
              border: 1px solid #e2e2e2;
          }
          .imgur-upload-config-row {
              display: flex;
              align-items: center;
              margin-bottom: 8px;
          }
          .imgur-upload-config-row:last-child {
              margin-bottom: 0;
          }
          .imgur-upload-config-label {
              font-size: 12px;
              color: #666;
              width: 70px;
              flex-shrink: 0;
          }
          .imgur-upload-config-input {
              flex: 1;
              padding: 3px 6px;
              border: 1px solid #ccc;
              border-radius: 2px;
              font-size: 12px;
          }
          .imgur-upload-config-save {
              background-color: #f5f5f5;
              border: 1px solid #ccc;
              border-radius: 2px;
              color: #333;
              cursor: pointer;
              font-size: 11px;
              margin-left: 6px;
              padding: 3px 8px;
          }
          .imgur-upload-config-save:hover {
              background-color: #e8e8e8;
          }
          .imgur-upload-modal-status {
              color: #666;
              font-size: 12px;
              text-align: center;
          }
          .imgur-upload-modal-status.success {
              color: #5cb85c;
          }
          .imgur-upload-modal-status.error {
              color: #d9534f;
          }
      `;

  // 添加样式到页面
  function addStyle() {
    const styleElement = document.createElement("style");
    styleElement.textContent = STYLE;
    document.head.appendChild(styleElement);
  }

  // 创建上传弹窗
  function createUploadModal(textareaElement) {
    const modal = document.createElement("div");
    modal.className = "imgur-upload-modal";

    const content = document.createElement("div");
    content.className = "imgur-upload-modal-content";

    content.innerHTML = `
              <div class="imgur-upload-modal-header">
                  <div class="imgur-upload-modal-title">上传图片</div>
                  <div class="imgur-upload-modal-close">×</div>
              </div>
              <div class="imgur-upload-dropzone">
                  <div>点击选择图片、拖拽图片到此处，或直接粘贴图片</div>
                  <div style="font-size: 11px; color: #999; margin-top: 5px;">支持 JPG, PNG, GIF 格式</div>
              </div>
              <div class="imgur-upload-actions">
                  <button class="imgur-upload-config-btn">⚙️ 配置</button>
                  <button class="imgur-upload-submit-btn" disabled>确认上传</button>
              </div>
              <div class="imgur-upload-config-panel hidden">
                  <div class="imgur-upload-config-row">
                      <div class="imgur-upload-config-label">Imgur ID:</div>
                      <input type="text" class="imgur-upload-config-input" placeholder="请输入 Imgur Client ID" value="${
                        CLIENT_ID || ""
                      }">
                      <button class="imgur-upload-config-save">保存</button>
                  </div>
                  <div style="font-size: 11px; color: #666; margin-top: 8px;">
                      在 <a href="https://api.imgur.com/oauth2/addclient" target="_blank">https://api.imgur.com/oauth2/addclient</a> 注册获取(无回调)
                  </div>
              </div>
          `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    setupModalEvents(modal, textareaElement);

    return modal;
  }

  // 设置弹窗事件监听
  function setupModalEvents(modal, textareaElement) {
    const closeBtn = modal.querySelector(".imgur-upload-modal-close");
    const dropzone = modal.querySelector(".imgur-upload-dropzone");
    const configBtn = modal.querySelector(".imgur-upload-config-btn");
    const configPanel = modal.querySelector(".imgur-upload-config-panel");
    const configInput = modal.querySelector(".imgur-upload-config-input");
    const configSave = modal.querySelector(".imgur-upload-config-save");
    const submitBtn = modal.querySelector(".imgur-upload-submit-btn");

    let selectedFile = null;

    function closeModal() {
      document.body.removeChild(modal);
    }

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });

    modal.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      }
    });

    configBtn.addEventListener("click", function () {
      configPanel.classList.toggle("hidden");
    });

    configSave.addEventListener("click", function () {
      const newClientId = configInput.value.trim();
      if (newClientId) {
        GM_setValue(IMGUR_CLIENT_ID_KEY, newClientId);
        CLIENT_ID = newClientId;
        configPanel.classList.add("hidden");
        showStatusInModal(modal, "配置已保存", "success");
      }
    });

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";
    modal.appendChild(fileInput);

    dropzone.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", function (e) {
      handleFileSelect(e.target.files[0]);
    });

    dropzone.addEventListener("dragover", function (e) {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", function (e) {
      e.preventDefault();
      dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", function (e) {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    });

    // 在整个弹窗上监听粘贴事件
    modal.addEventListener("paste", function (e) {
      e.preventDefault();
      const items = e.clipboardData.items;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            handleFileSelect(file);
            break;
          }
        }
      }
    });

    // 让弹窗能够接收键盘事件
    modal.setAttribute("tabindex", "0");
    modal.focus();

    // 处理文件选择
    function handleFileSelect(file) {
      if (!file || !file.type.match(/image\/.*/)) {
        showStatusInModal(modal, "请选择图片文件", "error");
        return;
      }

      selectedFile = file;

      const reader = new FileReader();
      reader.onload = function (e) {
        const preview = modal.querySelector(".imgur-upload-preview");
        if (preview) preview.remove();

        const img = document.createElement("img");
        img.src = e.target.result;
        img.className = "imgur-upload-preview";
        dropzone.appendChild(img);

        submitBtn.disabled = false;
        dropzone.querySelector("div").textContent = "已选择: " + file.name;
      };
      reader.readAsDataURL(file);
    }

    submitBtn.addEventListener("click", function () {
      if (!selectedFile) return;

      if (!CLIENT_ID) {
        showStatusInModal(modal, "请先配置 Imgur Client ID", "error");
        configPanel.classList.remove("hidden");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "上传中...";

      uploadToImgur(selectedFile, textareaElement, modal);
    });
  }

  // 在弹窗中显示状态信息
  function showStatusInModal(modal, message, type) {
    let statusEl = modal.querySelector(".imgur-upload-modal-status");
    if (!statusEl) {
      statusEl = document.createElement("div");
      statusEl.className = "imgur-upload-modal-status";
      statusEl.style.cssText =
        "margin-top: 10px; font-size: 12px; text-align: center;";
      modal.querySelector(".imgur-upload-modal-content").appendChild(statusEl);
    }

    statusEl.textContent = message;
    statusEl.className = "imgur-upload-modal-status " + (type || "");

    if (type === "success") {
      setTimeout(() => (statusEl.textContent = ""), 3000);
    }
  }

  // 上传图片到 Imgur
  function uploadToImgur(file, textareaElement, modal) {
    if (!file.type.match(/image\/.*/)) {
      showStatusInModal(modal, "请选择图片文件", "error");
      const submitBtn = modal.querySelector(".imgur-upload-submit-btn");
      submitBtn.disabled = false;
      submitBtn.textContent = "确认上传";
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    GM_xmlhttpRequest({
      method: "POST",
      url: "https://api.imgur.com/3/image",
      headers: {
        Authorization: "Client-ID " + CLIENT_ID,
      },
      data: formData,
      responseType: "json",
      onload: function (response) {
        const submitBtn = modal.querySelector(".imgur-upload-submit-btn");

        try {
          let responseData;
          if (typeof response.response === "string") {
            responseData = JSON.parse(response.response);
          } else {
            responseData = response.response;
          }

          if (response.status === 200 && responseData && responseData.success) {
            const imageUrl = responseData.data.link;
            insertLinkIntoTextarea(textareaElement, imageUrl, file.name);
            showStatusInModal(modal, "上传成功！", "success");

            setTimeout(() => {
              document.body.removeChild(modal);
            }, 1500);
          } else {
            let errorMessage = "";

            if (response.status === 400) {
              if (
                responseData &&
                responseData.data &&
                responseData.data.error
              ) {
                if (
                  responseData.data.error === "These actions are forbidden."
                ) {
                  errorMessage = "Client ID 无效或已被禁用，请检查配置";
                } else {
                  errorMessage = responseData.data.error;
                }
              } else {
                errorMessage = "Client ID 配置错误";
              }
            } else if (response.status === 403) {
              errorMessage = "访问被拒绝，请检查 Client ID 权限";
            } else if (response.status === 429) {
              errorMessage = "请求过于频繁，请稍后再试";
            } else {
              errorMessage = `上传失败 (${response.status})`;
            }

            console.error("Imgur 上传错误:", response);
            showStatusInModal(modal, errorMessage, "error");

            if (response.status === 400 || response.status === 403) {
              const configPanel = modal.querySelector(
                ".imgur-upload-config-panel"
              );
              configPanel.classList.remove("hidden");
            }

            submitBtn.disabled = false;
            submitBtn.textContent = "确认上传";
          }
        } catch (e) {
          console.error("解析响应失败:", e, response);
          showStatusInModal(modal, "响应解析失败，请重试", "error");

          submitBtn.disabled = false;
          submitBtn.textContent = "确认上传";
        }
      },
      onerror: function (error) {
        console.error("GM_xmlhttpRequest 错误:", error);
        showStatusInModal(modal, "网络请求失败，请检查连接", "error");

        const submitBtn = modal.querySelector(".imgur-upload-submit-btn");
        submitBtn.disabled = false;
        submitBtn.textContent = "确认上传";
      },
      ontimeout: function () {
        console.error("Imgur 上传超时");
        showStatusInModal(modal, "上传超时，请重试", "error");

        const submitBtn = modal.querySelector(".imgur-upload-submit-btn");
        submitBtn.disabled = false;
        submitBtn.textContent = "确认上传";
      },
    });
  }

  // 将图片链接插入到文本框
  function insertLinkIntoTextarea(textareaElement, imageUrl, fileName) {
    const altText = fileName ? fileName.split(".")[0] : "image";
    const textToInsert = imageUrl;

    const currentValue = textareaElement.value;
    const selectionStart = textareaElement.selectionStart;
    const selectionEnd = textareaElement.selectionEnd;

    const newText =
      currentValue.substring(0, selectionStart) +
      textToInsert +
      currentValue.substring(selectionEnd);
    textareaElement.value = newText;

    const newCursorPosition = selectionStart + textToInsert.length;
    textareaElement.selectionStart = newCursorPosition;
    textareaElement.selectionEnd = newCursorPosition;

    textareaElement.focus();
    textareaElement.dispatchEvent(
      new Event("input", { bubbles: true, cancelable: true })
    );
  }

  // 在页面头部添加上传按钮
  function addUploadButtonToHeader() {
    const replyBox = document.getElementById("reply-box");
    if (!replyBox) return;

    const headerCell = replyBox.querySelector(".cell.flex-one-row");
    if (!headerCell) return;

    if (headerCell.querySelector(".imgur-upload-btn")) return;

    const leftDiv = headerCell.querySelector("div:first-child");
    if (leftDiv) {
      const uploadBtn = document.createElement("a");
      uploadBtn.className = "imgur-upload-btn";
      uploadBtn.textContent = "上传";
      uploadBtn.href = "javascript:void(0);";
      uploadBtn.title = "上传图片";
      uploadBtn.style.marginLeft = "10px";

      leftDiv.appendChild(uploadBtn);
    }
  }

  // 查找并添加上传按钮
  function findTextareasAndAddButtons() {
    addUploadButtonToHeader();
    setupMutationObserver();
  }

  // 监听DOM变化
  function setupMutationObserver() {
    const observer = new MutationObserver(function (mutations) {
      let shouldCheck = false;
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            (node.id === "reply-box" || node.querySelector("#reply-box"))
          ) {
            shouldCheck = true;
          }
        });
      });

      if (shouldCheck) {
        setTimeout(addUploadButtonToHeader, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // 初始化脚本
  function init() {
    addStyle();

    document.body.addEventListener("click", function (e) {
      const uploadBtn = e.target.closest(".imgur-upload-btn");
      if (uploadBtn) {
        e.preventDefault();
        const textarea = document.getElementById("reply_content");
        if (textarea) {
          createUploadModal(textarea);
        }
      }
    });

    setTimeout(findTextareasAndAddButtons, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

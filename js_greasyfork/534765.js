// ==UserScript==
// @name         NodeSeek 图片上传工具
// @namespace    https://www.nodeseek.com/
// @version      1.5.0
// @description  为 NodeSeek 论坛编辑器添加一键图片上传功能，支持多图片同时上传，自动压缩大图片，支持自定义 Token
// @author       Claude 3.7
// @match        https://www.nodeseek.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/534765/NodeSeek%20%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/534765/NodeSeek%20%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * 应用配置
   */
  const CONFIG = {
    // 图床API配置
    UPLOAD: {
      URL: "https://i.111666.best/image",
      BASE_URL: "https://i.111666.best",
      MAX_SIZE: 6.7, // MB
      TARGET_SIZE: 6.3, // 压缩目标大小 MB
    },
    // DOM选择器
    SELECTORS: {
      TOOLBAR: ".mde-toolbar",
      PIC_BUTTON: ".i-icon-pic",
      CODEMIRROR: "#code-mirror-editor .CodeMirror",
      TEXTAREA: ".CodeMirror textarea",
    },
    // UI配置
    UI: {
      BUTTON_CLASS: "ns-image-uploader",
      SETTINGS_BUTTON_CLASS: "ns-settings-button",
      NOTIFICATION_DURATION: 3000,
      MAX_CONCURRENT_UPLOADS: 3, // 最大并发上传数
    },
    // 存储键
    STORAGE_KEYS: {
      PRIMARY_TOKEN: "ns_uploader_primary_token",
      BACKUP_TOKEN: "ns_uploader_backup_token",
    },
  };

  /**
   * 图片上传助手
   */
  class ImageUploader {
    constructor() {
      this.loadSettings();
      this.setupUI();
      this.addEventListeners();
      this.observeDOM();
      this.uploadQueue = []; // 上传队列
      this.activeUploads = 0; // 当前活跃的上传任务数
      this.uploadResults = { success: 0, failed: 0, total: 0 }; // 上传结果统计
      this.lastUploadTask = null; // 存储最后一个上传任务的引用
    }

    /**
     * 从本地存储加载设置
     */
    loadSettings() {
      // 初始化 Token 设置
      this.settings = {
        primaryToken:
          localStorage.getItem(CONFIG.STORAGE_KEYS.PRIMARY_TOKEN) ||
          this.generateRandomToken(),
        backupToken:
          localStorage.getItem(CONFIG.STORAGE_KEYS.BACKUP_TOKEN) ||
          this.generateRandomToken(),
      };

      // 如果是首次使用，保存默认生成的随机 Token
      if (!localStorage.getItem(CONFIG.STORAGE_KEYS.PRIMARY_TOKEN)) {
        this.saveSettings();
      }
    }

    /**
     * 保存设置到本地存储
     */
    saveSettings() {
      localStorage.setItem(
        CONFIG.STORAGE_KEYS.PRIMARY_TOKEN,
        this.settings.primaryToken,
      );
      localStorage.setItem(
        CONFIG.STORAGE_KEYS.BACKUP_TOKEN,
        this.settings.backupToken,
      );
    }

    /**
     * 生成随机 Token
     * @returns {string} 随机生成的 Token
     */
    generateRandomToken() {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const length = 24;
      let result = "";
      const charactersLength = characters.length;

      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        );
      }

      return result;
    }

    /**
     * 设置用户界面
     */
    setupUI() {
      // 注入样式
      const style = document.createElement("style");
      style.textContent = `
                /* 上传按钮样式 */
                .${CONFIG.UI.BUTTON_CLASS}, .${CONFIG.UI.SETTINGS_BUTTON_CLASS} {
                    cursor: pointer;
                    transition: all 0.2s ease;
                    padding: 2px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }

                .${CONFIG.UI.BUTTON_CLASS}:hover, .${CONFIG.UI.SETTINGS_BUTTON_CLASS}:hover {
                    background-color: rgba(0, 0, 0, 0.1);
                    border-radius: 4px;
                }

                /* 加载动画 */
                .ns-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(0, 0, 0, 0.1);
                    border-top: 2px solid #3498db;
                    border-radius: 50%;
                    animation: ns-spin 1s linear infinite;
                }

                @keyframes ns-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* 通知样式 */
                .ns-notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    padding: 10px 16px;
                    border-radius: 4px;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
                    color: white;
                    font-size: 14px;
                    z-index: 10000;
                    transition: all 0.3s ease;
                    opacity: 0;
                    transform: translateY(20px);
                    max-width: 400px;
                }

                .ns-notification.success {
                    background-color: #4CAF50;
                }

                .ns-notification.error {
                    background-color: #f44336;
                }

                .ns-notification.info {
                    background-color: #2196F3;
                }

                .ns-notification.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* 多图上传进度显示 */
                .ns-upload-progress {
                    margin-top: 5px;
                    font-size: 12px;
                }

                /* 进度条容器 */
                .ns-progress-bar-container {
                    height: 6px;
                    background-color: rgba(0, 0, 0, 0.1);
                    border-radius: 3px;
                    margin-top: 4px;
                    overflow: hidden;
                }

                /* 进度条 */
                .ns-progress-bar {
                    height: 100%;
                    background-color: #4CAF50;
                    border-radius: 3px;
                    transition: width 0.3s ease;
                }

                /* 设置面板样式 */
                .ns-settings-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10001;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease, visibility 0.3s;
                }

                .ns-settings-modal.visible {
                    opacity: 1;
                    visibility: visible;
                }

                .ns-settings-container {
                    background-color: white;
                    border-radius: 8px;
                    padding: 20px;
                    width: 90%;
                    max-width: 500px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    transform: translateY(20px);
                    transition: transform 0.3s ease;
                }

                .ns-settings-modal.visible .ns-settings-container {
                    transform: translateY(0);
                }

                .ns-settings-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #eee;
                }

                .ns-settings-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin: 0;
                }

                .ns-settings-close {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #999;
                }

                .ns-settings-close:hover {
                    color: #333;
                }

                .ns-settings-form {
                    margin-bottom: 20px;
                }

                .ns-input-group {
                    margin-bottom: 16px;
                }

                .ns-input-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                }

                .ns-token-input-wrapper {
                    display: flex;
                    gap: 8px;
                }

                .ns-token-input {
                    flex: 1;
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                }

                .ns-token-input:focus {
                    border-color: #3498db;
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
                }

                .ns-random-btn {
                    padding: 8px 12px;
                    background-color: #f5f5f5;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .ns-random-btn:hover {
                    background-color: #e5e5e5;
                }

                .ns-settings-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }

                .ns-settings-btn {
                    padding: 8px 16px;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .ns-save-btn {
                    background-color: #3498db;
                    color: white;
                    border: none;
                }

                .ns-save-btn:hover {
                    background-color: #2980b9;
                }

                .ns-cancel-btn {
                    background-color: #f5f5f5;
                    border: 1px solid #ddd;
                    color: #333;
                }

                .ns-cancel-btn:hover {
                    background-color: #e5e5e5;
                }

                .ns-description {
                    color: #666;
                    font-size: 13px;
                    margin-top: 5px;
                    line-height: 1.4;
                }

                .ns-settings-container p {
                    margin-top: 0;
                    margin-bottom: 1em;
                    line-height: 1.5;
                }

                .ns-settings-version {
                    color: #999;
                    font-size: 12px;
                    text-align: right;
                    margin-top: 10px;
                }
            `;
      document.head.appendChild(style);

      // 添加上传按钮和设置按钮
      this.addButtons();

      // 创建设置面板（一开始是隐藏的）
      this.createSettingsModal();
    }

    /**
     * 创建设置对话框
     */
    createSettingsModal() {
      // 如果设置面板已存在，不重复创建
      if (document.querySelector(".ns-settings-modal")) {
        return;
      }

      // 创建设置面板
      const modal = document.createElement("div");
      modal.className = "ns-settings-modal";

      modal.innerHTML = `
        <div class="ns-settings-container">
          <div class="ns-settings-header">
            <h3 class="ns-settings-title">图片上传设置</h3>
            <button class="ns-settings-close">&times;</button>
          </div>

          <p>自定义上传 Token，保护您的上传权限不被他人使用。</p>

          <div class="ns-settings-form">
            <div class="ns-input-group">
              <label for="ns-primary-token">主要 Token</label>
              <div class="ns-token-input-wrapper">
                <input type="text" id="ns-primary-token" class="ns-token-input" value="${this.settings.primaryToken}" placeholder="输入主要 Token">
                <button class="ns-random-btn" data-target="primary">随机</button>
              </div>
              <div class="ns-description">主要上传请求会优先使用此 Token</div>
            </div>

            <div class="ns-input-group">
              <label for="ns-backup-token">备用 Token</label>
              <div class="ns-token-input-wrapper">
                <input type="text" id="ns-backup-token" class="ns-token-input" value="${this.settings.backupToken}" placeholder="输入备用 Token">
                <button class="ns-random-btn" data-target="backup">随机</button>
              </div>
              <div class="ns-description">当主要 Token 失效时，将使用此备用 Token</div>
            </div>
          </div>

          <div class="ns-settings-footer">
            <button class="ns-settings-btn ns-cancel-btn">取消</button>
            <button class="ns-settings-btn ns-save-btn">保存</button>
          </div>

          <div class="ns-settings-version">v1.5.0</div>
        </div>
      `;

      document.body.appendChild(modal);

      // 绑定事件
      // 关闭按钮
      modal
        .querySelector(".ns-settings-close")
        .addEventListener("click", () => {
          this.hideSettingsModal();
        });

      // 取消按钮
      modal.querySelector(".ns-cancel-btn").addEventListener("click", () => {
        this.hideSettingsModal();
      });

      // 保存按钮
      modal.querySelector(".ns-save-btn").addEventListener("click", () => {
        this.saveTokenSettings();
      });

      // 随机按钮事件
      modal.querySelectorAll(".ns-random-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
          const target = e.target.dataset.target;
          const randomToken = this.generateRandomToken();

          if (target === "primary") {
            modal.querySelector("#ns-primary-token").value = randomToken;
          } else if (target === "backup") {
            modal.querySelector("#ns-backup-token").value = randomToken;
          }
        });
      });

      // 点击模态框背景关闭
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.hideSettingsModal();
        }
      });
    }

    /**
     * 显示设置对话框
     */
    showSettingsModal() {
      const modal = document.querySelector(".ns-settings-modal");
      if (modal) {
        // 更新输入框值为当前设置
        modal.querySelector("#ns-primary-token").value =
          this.settings.primaryToken;
        modal.querySelector("#ns-backup-token").value =
          this.settings.backupToken;

        modal.classList.add("visible");
        // 防止背景滚动
        document.body.style.overflow = "hidden";
      }
    }

    /**
     * 隐藏设置对话框
     */
    hideSettingsModal() {
      const modal = document.querySelector(".ns-settings-modal");
      if (modal) {
        modal.classList.remove("visible");
        // 恢复背景滚动
        document.body.style.overflow = "";
      }
    }

    /**
     * 保存 Token 设置
     */
    saveTokenSettings() {
      const primaryTokenInput = document.querySelector("#ns-primary-token");
      const backupTokenInput = document.querySelector("#ns-backup-token");

      if (!primaryTokenInput.value.trim()) {
        this.showNotification("主要 Token 不能为空", "error");
        return;
      }

      if (!backupTokenInput.value.trim()) {
        this.showNotification("备用 Token 不能为空", "error");
        return;
      }

      // 更新设置
      this.settings.primaryToken = primaryTokenInput.value.trim();
      this.settings.backupToken = backupTokenInput.value.trim();

      // 保存到本地存储
      this.saveSettings();

      // 隐藏设置面板
      this.hideSettingsModal();

      // 显示成功通知
      this.showNotification("设置已保存", "success");
    }

    /**
     * 添加上传按钮和设置按钮到工具栏
     */
    addButtons() {
      // 如果按钮已存在，不重复添加
      if (document.querySelector(`.${CONFIG.UI.BUTTON_CLASS}`)) {
        return;
      }

      // 查找工具栏和图片按钮
      const toolbar = document.querySelector(CONFIG.SELECTORS.TOOLBAR);
      const picButton = toolbar?.querySelector(CONFIG.SELECTORS.PIC_BUTTON);

      if (!toolbar || !picButton) return;

      // 创建上传按钮
      const uploadButton = document.createElement("span");
      uploadButton.className = `toolbar-item i-icon ${CONFIG.UI.BUTTON_CLASS}`;
      uploadButton.title = `上传图片 (最大${CONFIG.UPLOAD.MAX_SIZE}MB，超限自动压缩，支持多图同时上传)`;
      uploadButton.innerHTML = this.getUploadButtonSVG();

      // 添加按钮点击事件
      uploadButton.addEventListener("click", () =>
        this.handleUploadClick(uploadButton),
      );

      // 创建设置按钮
      const settingsButton = document.createElement("span");
      settingsButton.className = `toolbar-item i-icon ${CONFIG.UI.SETTINGS_BUTTON_CLASS}`;
      settingsButton.title = `图片上传设置`;
      settingsButton.innerHTML = this.getSettingsButtonSVG();

      // 添加设置按钮点击事件
      settingsButton.addEventListener("click", () => this.showSettingsModal());

      // 将按钮添加到工具栏
      picButton.parentNode.insertBefore(uploadButton, picButton.nextSibling);
      picButton.parentNode.insertBefore(
        settingsButton,
        uploadButton.nextSibling,
      );
    }

    /**
     * 获取上传按钮的SVG内容
     */
    getUploadButtonSVG() {
      return `
        <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
            <path d="M6 24V42H42V24" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M33 23L24 14L15 23" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M24 14V34" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    }

    /**
     * 获取设置按钮的SVG内容
     */
    getSettingsButtonSVG() {
      return `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    }

    /**
     * 添加事件监听器
     */
    addEventListeners() {
      // DOM已加载完成
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.addButtons());
      } else {
        this.addButtons();
      }
    }
    /**
     * 观察DOM变化，处理动态加载的编辑器
     */
    observeDOM() {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.addedNodes && mutation.addedNodes.length) {
            const toolbar = document.querySelector(CONFIG.SELECTORS.TOOLBAR);
            if (
              toolbar &&
              !document.querySelector(`.${CONFIG.UI.BUTTON_CLASS}`)
            ) {
              this.addButtons();
            }
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    /**
     * 处理上传按钮点击
     * @param {HTMLElement} button - 上传按钮元素
     */
    handleUploadClick(button) {
      // 创建隐藏的文件输入框
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.multiple = true; // 支持多文件选择
      fileInput.style.display = "none";
      document.body.appendChild(fileInput);

      // 监听文件选择
      fileInput.addEventListener("change", async () => {
        try {
          if (fileInput.files && fileInput.files.length > 0) {
            const files = Array.from(fileInput.files);
            const originalButtonContent = button.innerHTML;
            const originalButtonTitle = button.title;

            // 设置按钮加载状态
            this.setButtonLoading(button, true, "准备上传...");

            // 初始化上传状态
            this.uploadResults = {
              success: 0,
              failed: 0,
              total: files.length,
            };

            // 创建进度通知
            this.showProgressNotification(
              `准备上传 ${files.length} 张图片...`,
              0,
            );

            // 一次性为所有文件创建占位符
            const placeholders = {};
            files.forEach((file) => {
              const placeholderId = `upload-${Date.now()}-${Math.floor(Math.random() * 1000)}-${file.name.replace(/[^a-z0-9]/gi, "")}`;
              const placeholderText = `![正在上传 ${file.name}...](uploading#${placeholderId})`;

              // 插入占位符到编辑器
              this.insertMarkdownImage(file.name, placeholderText);

              // 存储占位符ID与文件的关联
              placeholders[file.name] = placeholderId;
            });

            // 将所有文件添加到上传队列
            files.forEach((file) => {
              const task = {
                file,
                button,
                originalButtonContent,
                originalButtonTitle,
                placeholderId: placeholders[file.name], // 存储对应的占位符ID
              };
              this.uploadQueue.push(task);

              // 保存最后一个任务的引用，确保队列清空后仍能恢复按钮状态
              this.lastUploadTask = task;
            });

            // 开始处理上传队列
            this.processUploadQueue();
          }
        } catch (error) {
          console.error("处理错误:", error);
          this.showNotification(`错误: ${error.message}`, "error");
          // 出错时也要恢复按钮状态
          this.setButtonLoading(
            button,
            false,
            originalButtonTitle ||
              `上传图片 (最大${CONFIG.UPLOAD.MAX_SIZE}MB，超限自动压缩，支持多图同时上传)`,
            originalButtonContent,
          );
        } finally {
          // 清理文件输入框
          document.body.removeChild(fileInput);
        }
      });

      // 触发文件选择
      fileInput.click();
    }

    /**
     * 处理上传队列
     */
    processUploadQueue() {
      // 检查是否有正在等待的上传任务
      if (this.uploadQueue.length === 0 && this.activeUploads === 0) {
        // 所有上传已完成，首先移除进度通知
        const progressNotification = document.querySelector(
          ".ns-progress-notification",
        );
        if (progressNotification) {
          progressNotification.classList.remove("visible");

          // 等待进度通知消失后再显示最终结果
          progressNotification.addEventListener(
            "transitionend",
            () => {
              if (progressNotification.parentNode) {
                document.body.removeChild(progressNotification);

                // 显示最终结果通知
                const { success, failed, total } = this.uploadResults;
                if (failed === 0) {
                  this.showNotification(
                    `所有 ${total} 张图片上传成功！`,
                    "success",
                  );
                } else {
                  this.showNotification(
                    `上传完成: ${success} 成功, ${failed} 失败 (共 ${total} 张)`,
                    failed > 0 ? "error" : "success",
                  );
                }
              }
            },
            { once: true },
          );
        } else {
          // 如果没有进度通知，直接显示结果
          const { success, failed, total } = this.uploadResults;
          if (failed === 0) {
            this.showNotification(`所有 ${total} 张图片上传成功！`, "success");
          } else {
            this.showNotification(
              `上传完成: ${success} 成功, ${failed} 失败 (共 ${total} 张)`,
              failed > 0 ? "error" : "success",
            );
          }
        }

        // 恢复按钮状态
        const { button, originalButtonContent, originalButtonTitle } =
          this.uploadQueue.length > 0
            ? this.uploadQueue[0]
            : this.lastUploadTask;
        if (button) {
          this.setButtonLoading(
            button,
            false,
            originalButtonTitle ||
              `上传图片 (最大${CONFIG.UPLOAD.MAX_SIZE}MB，超限自动压缩，支持多图同时上传)`,
            originalButtonContent,
          );
        }

        return;
      }

      // 控制并发上传数量
      while (
        this.uploadQueue.length > 0 &&
        this.activeUploads < CONFIG.UI.MAX_CONCURRENT_UPLOADS
      ) {
        const uploadTask = this.uploadQueue.shift();
        this.activeUploads++;

        // 异步处理单个文件上传
        this.uploadSingleFile(uploadTask).finally(() => {
          this.activeUploads--;
          // 更新进度显示
          const { success, failed, total } = this.uploadResults;
          const completed = success + failed;
          const progress = (completed / total) * 100;

          this.showProgressNotification(
            `上传进度: ${completed}/${total} (${success} 成功, ${failed} 失败)`,
            progress,
          );

          // 继续处理队列中的下一个文件
          this.processUploadQueue();
        });
      }
    }

    /**
     * 上传单个文件
     * @param {Object} uploadTask - 上传任务对象
     * @returns {Promise<void>}
     */
    async uploadSingleFile(uploadTask) {
      const { file, button, placeholderId } = uploadTask;

      try {
        // 检查是否需要压缩
        let fileToUpload = file;
        const fileSizeInMB = file.size / (1024 * 1024);

        if (fileSizeInMB > CONFIG.UPLOAD.MAX_SIZE) {
          // 压缩图片
          try {
            fileToUpload = await this.compressImage(file);
            // 检查压缩后的大小
            const compressedSizeMB = fileToUpload.size / (1024 * 1024);
            console.log(
              `图片已压缩: ${fileSizeInMB.toFixed(2)}MB -> ${compressedSizeMB.toFixed(2)}MB`,
            );
          } catch (error) {
            console.error("压缩失败:", error);
            this.uploadResults.failed++;
            this.replaceMarkdownPlaceholder(
              placeholderId,
              file.name,
              "upload-failed",
              `![压缩失败: ${file.name}](upload-failed)`,
            );
            return;
          }
        }

        // 上传图片
        const imageUrl = await this.uploadImage(fileToUpload);

        // 替换占位的Markdown代码
        this.replaceMarkdownPlaceholder(placeholderId, file.name, imageUrl);

        // 更新成功计数
        this.uploadResults.success++;
      } catch (error) {
        console.error(`上传失败 (${file.name}):`, error);
        // 更新失败计数
        this.uploadResults.failed++;
        // 上传失败时更新占位符
        this.replaceMarkdownPlaceholder(
          placeholderId,
          file.name,
          "upload-failed",
          `![上传失败: ${file.name}](upload-failed)`,
        );
      }
    }

    /**
     * 显示进度通知
     * @param {string} message - 通知消息
     * @param {number} progress - 进度百分比 (0-100)
     */
    showProgressNotification(message, progress) {
      // 查找已有的进度通知或创建新的
      let notification = document.querySelector(".ns-progress-notification");

      if (!notification) {
        notification = document.createElement("div");
        notification.className =
          "ns-notification ns-progress-notification info";

        notification.innerHTML = `
            <div>${message}</div>
            <div class="ns-upload-progress">
              <div class="ns-progress-bar-container">
                <div class="ns-progress-bar" style="width: ${progress}%"></div>
              </div>
            </div>
          `;

        document.body.appendChild(notification);

        // 使通知可见
        setTimeout(() => {
          notification.classList.add("visible");
        }, 10);
      } else {
        // 更新现有通知
        notification.querySelector("div:first-child").textContent = message;
        notification.querySelector(".ns-progress-bar").style.width =
          `${progress}%`;
      }

      // 如果进度到100%，5秒后自动移除进度通知
      if (progress >= 100) {
        setTimeout(() => {
          if (notification && notification.parentNode) {
            notification.classList.remove("visible");

            notification.addEventListener(
              "transitionend",
              () => {
                if (notification.parentNode) {
                  document.body.removeChild(notification);
                }
              },
              { once: true },
            );
          }
        }, 5000);
      }
    }

    /**
     * 设置按钮加载状态
     * @param {HTMLElement} button - 按钮元素
     * @param {boolean} isLoading - 是否为加载状态
     * @param {string} title - 按钮标题
     * @param {string} [content] - 按钮内容 (仅在非加载状态有效)
     */
    setButtonLoading(button, isLoading, title, content = null) {
      if (isLoading) {
        button.innerHTML = '<span class="ns-spinner"></span>';
        button.title = title;
      } else {
        button.innerHTML = content || this.getUploadButtonSVG();
        button.title = title;
      }
    }

    /**
     * 压缩图片
     * @param {File} file - 要压缩的图片文件
     * @returns {Promise<File>} - 返回压缩后的图片文件
     */
    async compressImage(file) {
      return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
          // 创建canvas
          const canvas = document.createElement("canvas");
          let { width, height } = img;

          // 如果图片尺寸很大，适当缩小以提高压缩效率
          const MAX_DIMENSION = 4000; // 最大尺寸限制
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width > height) {
              height = Math.floor(height * (MAX_DIMENSION / width));
              width = MAX_DIMENSION;
            } else {
              width = Math.floor(width * (MAX_DIMENSION / height));
              height = MAX_DIMENSION;
            }
          }

          // 设置canvas尺寸
          canvas.width = width;
          canvas.height = height;

          // 绘制图片到canvas
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#FFFFFF"; // 设置白色背景
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // 目标大小范围
          const targetSize = CONFIG.UPLOAD.TARGET_SIZE; // 目标为6.3MB

          // 逐步尝试不同的压缩质量
          const compressWithQuality = (quality) => {
            try {
              canvas.toBlob(
                (blob) => {
                  if (!blob) {
                    reject(new Error("压缩过程中出错"));
                    return;
                  }

                  // 检查压缩后的大小
                  const sizeInMB = blob.size / (1024 * 1024);

                  // 如果大小已经在目标范围内，或已达到最低质量
                  if (
                    (sizeInMB <= CONFIG.UPLOAD.MAX_SIZE &&
                      sizeInMB >= targetSize * 0.9) ||
                    quality <= 0.5
                  ) {
                    // 创建新的文件对象
                    const compressedFile = new File([blob], file.name, {
                      type: "image/jpeg",
                      lastModified: Date.now(),
                    });
                    resolve(compressedFile);
                  }
                  // 如果大小过大，继续降低质量
                  else if (sizeInMB > CONFIG.UPLOAD.MAX_SIZE) {
                    // 降低质量，但避免质量过低
                    const newQuality = Math.max(0.5, quality - 0.05);
                    setTimeout(() => compressWithQuality(newQuality), 0);
                  }
                  // 如果大小太小，尝试提高质量
                  else if (sizeInMB < targetSize * 0.85 && quality < 0.95) {
                    // 提高质量，但不超过0.95
                    const newQuality = Math.min(0.95, quality + 0.05);
                    setTimeout(() => compressWithQuality(newQuality), 0);
                  }
                  // 如果大小在合理的范围内，接受当前结果
                  else {
                    const compressedFile = new File([blob], file.name, {
                      type: "image/jpeg",
                      lastModified: Date.now(),
                    });
                    resolve(compressedFile);
                  }
                },
                "image/jpeg",
                quality,
              );
            } catch (err) {
              reject(new Error(`压缩过程中出错: ${err.message}`));
            }
          };

          // 开始压缩，初始质量为0.9
          compressWithQuality(0.9);
        };

        img.onerror = () => {
          reject(new Error("图片加载失败"));
        };

        // 从文件创建URL加载图片
        img.src = URL.createObjectURL(file);
      });
    }

    /**
     * 上传图片到图床
     * @param {File} file - 要上传的图片文件
     * @returns {Promise<string>} - 返回上传后的图片URL
     */
    async uploadImage(file) {
      const formData = new FormData();
      formData.append("image", file);

      // 尝试使用主令牌
      try {
        return await this.tryUploadWithToken(
          formData,
          this.settings.primaryToken,
        );
      } catch (error) {
        console.warn("主令牌上传失败，尝试备用令牌", error);
        // 如果主令牌失败，尝试备用令牌
        return await this.tryUploadWithToken(
          formData,
          this.settings.backupToken,
        );
      }
    }

    /**
     * 使用特定令牌尝试上传
     * @param {FormData} formData - 表单数据
     * @param {string} token - 授权令牌
     * @returns {Promise<string>} - 返回上传后的图片URL
     */
    async tryUploadWithToken(formData, token) {
      const response = await fetch(CONFIG.UPLOAD.URL, {
        method: "POST",
        headers: {
          "Auth-Token": token,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `上传请求失败: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (!data.ok) {
        throw new Error(data.message || "服务器返回错误");
      }

      return `${CONFIG.UPLOAD.BASE_URL}${data.src}`;
    }

    /**
     * 在编辑器中插入Markdown格式的图片链接
     * @param {string} fileName - 文件名
     * @param {string} imageMarkdown - 图片Markdown代码
     * @returns {Object|null} - 返回插入位置信息
     */
    insertMarkdownImage(fileName, imageMarkdown) {
      // 尝试使用CodeMirror API插入内容
      const editorElement = document.querySelector(CONFIG.SELECTORS.CODEMIRROR);

      if (editorElement?.CodeMirror) {
        // 使用CodeMirror API
        const cm = editorElement.CodeMirror;
        const cursor = cm.getCursor();

        // 插入内容
        cm.replaceRange(imageMarkdown + "\n", cursor);

        // 将光标移动到插入内容之后
        cm.setCursor({
          line: cursor.line + 1,
          ch: 0,
        });

        // 聚焦编辑器
        cm.focus();

        // 返回插入位置
        return {
          type: "codemirror",
          instance: cm,
          from: {
            line: cursor.line,
            ch: cursor.ch,
          },
          to: {
            line: cursor.line,
            ch: cursor.ch + imageMarkdown.length,
          },
        };
      }

      // 如果无法获取CodeMirror实例，尝试使用textarea
      const textarea = document.querySelector(CONFIG.SELECTORS.TEXTAREA);
      if (textarea) {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;

        // 插入内容
        textarea.value =
          textarea.value.substring(0, startPos) +
          imageMarkdown +
          "\n" +
          textarea.value.substring(endPos);

        // 设置新的光标位置
        textarea.selectionStart = textarea.selectionEnd =
          startPos + imageMarkdown.length + 1;

        // 聚焦输入框
        textarea.focus();

        // 返回插入位置
        return {
          type: "textarea",
          element: textarea,
          start: startPos,
          end: startPos + imageMarkdown.length,
        };
      }

      // 如果是插入多张图片的最后一张，确保光标回到编辑区末尾
      const isLastImage = fileName.includes("__LAST__");
      if (isLastImage && editorElement?.CodeMirror) {
        const cm = editorElement.CodeMirror;
        cm.setCursor(cm.lineCount(), 0);
        cm.focus();
      }

      return null;
    }

    /**
     * 替换占位的Markdown代码
     * @param {string} placeholderId - 占位符ID
     * @param {string} fileName - 文件名
     * @param {string} imageUrl - 图片URL
     * @param {string} [customMarkdown] - 自定义Markdown代码
     */
    replaceMarkdownPlaceholder(
      placeholderId,
      fileName,
      imageUrl,
      customMarkdown = null,
    ) {
      // 获取文件名作为替代文本，去除扩展名
      const altText = fileName.replace(/\.[^/.]+$/, "");

      // 决定使用哪种Markdown代码
      const newMarkdown = customMarkdown || `![${altText}](${imageUrl})`;

      // 尝试使用CodeMirror API替换内容
      const editorElement = document.querySelector(CONFIG.SELECTORS.CODEMIRROR);

      if (editorElement?.CodeMirror) {
        const cm = editorElement.CodeMirror;
        const content = cm.getValue();

        // 查找占位符
        const placeholderRegex = new RegExp(
          `!\\[.*?\\]\\(uploading#${placeholderId}\\)`,
          "g",
        );
        const match = placeholderRegex.exec(content);

        if (match) {
          const from = cm.posFromIndex(match.index);
          const to = cm.posFromIndex(match.index + match[0].length);

          // 替换占位符
          cm.replaceRange(newMarkdown, from, to);
          return;
        }
      }

      // 如果无法使用CodeMirror或找不到占位符，尝试使用textarea
      const textarea = document.querySelector(CONFIG.SELECTORS.TEXTAREA);
      if (textarea) {
        const content = textarea.value;

        // 查找占位符
        const placeholderRegex = new RegExp(
          `!\\[.*?\\]\\(uploading#${placeholderId}\\)`,
          "g",
        );
        const match = placeholderRegex.exec(content);

        if (match) {
          // 替换占位符
          textarea.value =
            content.substring(0, match.index) +
            newMarkdown +
            content.substring(match.index + match[0].length);
        }
      }
    }

    /**
     * 显示通知消息
     * @param {string} message - 通知消息内容
     * @param {string} type - 通知类型 ('success', 'error', 或 'info')
     * @param {number} [duration] - 通知显示时间（毫秒）
     */
    showNotification(
      message,
      type,
      duration = CONFIG.UI.NOTIFICATION_DURATION,
    ) {
      // 删除同类型的现有通知（保留进度通知）
      const existingNotifications = document.querySelectorAll(
        `.ns-notification:not(.ns-progress-notification)`,
      );
      existingNotifications.forEach((notification) => {
        document.body.removeChild(notification);
      });

      // 创建新通知
      const notification = document.createElement("div");
      notification.className = `ns-notification ${type}`;
      notification.textContent = message;
      document.body.appendChild(notification);

      // 使通知可见
      setTimeout(() => {
        notification.classList.add("visible");
      }, 10);

      // 通知自动消失
      setTimeout(() => {
        notification.classList.remove("visible");

        // 等待过渡效果完成后删除元素
        notification.addEventListener(
          "transitionend",
          () => {
            if (notification.parentNode) {
              document.body.removeChild(notification);
            }
          },
          { once: true },
        );
      }, duration);
    }
  }

  // 初始化上传器
  new ImageUploader();

  // 在控制台显示版本信息
  console.log("NodeSeek 图片上传工具 v1.5.0 已加载");
})();

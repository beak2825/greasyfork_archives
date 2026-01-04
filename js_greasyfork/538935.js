// ==UserScript==
// @name         V2ex Better Comment
// @namespace    http://tampermonkey.net/1436051
// @version      1.0
// @description  在 V2ex 评论中支持--自定义表情/快速上传图片
// @author       Dogxi <dogxi.me>
// @match        https://www.v2ex.com/t/*
// @match        https://v2ex.com/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.imgur.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538935/V2ex%20Better%20Comment.user.js
// @updateURL https://update.greasyfork.org/scripts/538935/V2ex%20Better%20Comment.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const IMGUR_CLIENT_ID_KEY = "imgurClientId";
  const EMOJI_CONFIG_KEY = "emojiConfig";
  let CLIENT_ID = GM_getValue(IMGUR_CLIENT_ID_KEY, null);

  // 默认表情配置
  const DEFAULT_EMOJI_CONFIG = {
    颜文字: {
      type: "text",
      container: [
        { icon: "OωO", text: "呆" },
        { icon: "|´・ω・)ノ", text: "Hi" },
        { icon: "ヾ(≧∇≦*)ゝ", text: "开心" },
        { icon: "(☆ω☆)", text: "星星眼" },
        { icon: "（╯‵□′）╯︵┴─┴", text: "掀桌" },
        { icon: "￣﹃￣", text: "流口水" },
        { icon: "(/ω＼)", text: "捂脸" },
        { icon: "∠( ᐛ 」∠)＿", text: "给跪" },
        { icon: "(๑•̀ㅁ•́ฅ)", text: "Hi" },
        { icon: "→_→", text: "斜眼" },
        { icon: "୧(๑•̀⌄•́๑)૭", text: "加油" },
        { icon: "٩(ˊᗜˋ*)و", text: "有木有WiFi" },
        { icon: "(ノ°ο°)ノ", text: "前方高能预警" },
        { icon: "(´இ皿இ｀)", text: "我从未见过如此厚颜无耻之人" },
        { icon: "⌇●﹏●⌇", text: "吓死宝宝惹" },
        { icon: "(ฅ´ω`ฅ)", text: "已阅留爪" },
        { icon: "(╯°A°)╯︵○○○", text: "去吧大师球" },
        { icon: "φ(￣∇￣o)", text: "太萌惹" },
        { icon: 'ヾ(´･ ･｀｡)ノ"', text: "咦咦咦" },
        { icon: "( ง ᵒ̌皿ᵒ̌)ง⁼³₌₃", text: "气呼呼" },
        { icon: "(ó﹏ò｡)", text: "我受到了惊吓" },
        { icon: "Σ(っ °Д °;)っ", text: "什么鬼" },
        { icon: '( ,,´･ω･)ﾉ"(´っω･｀｡)', text: "摸摸头" },
        { icon: "╮(╯▽╰)╭ ", text: "无奈" },
        { icon: "o(*////▽////*)q ", text: "脸红" },
        { icon: "＞﹏＜", text: "" },
        { icon: '( ๑´•ω•) "(ㆆᴗㆆ)', text: "" },
      ],
    },
    Emoji: {
      type: "emoji",
      container: [
        { icon: "😂", text: "" },
        { icon: "😀", text: "" },
        { icon: "😅", text: "" },
        { icon: "😊", text: "" },
        { icon: "🙂", text: "" },
        { icon: "🙃", text: "" },
        { icon: "😌", text: "" },
        { icon: "😍", text: "" },
        { icon: "😘 ", text: "" },
        { icon: "😜", text: "" },
        { icon: "😝", text: "" },
        { icon: "😏", text: "" },
        { icon: "😒", text: "" },
        { icon: "🙄", text: "" },
        { icon: "😳", text: "" },
        { icon: "😡", text: "" },
        { icon: "😔", text: "" },
        { icon: "😫", text: "" },
        { icon: "😱", text: "" },
        { icon: "😭", text: "" },
        { icon: "💩", text: "" },
        { icon: "👻", text: "" },
        { icon: "🙌", text: "" },
        { icon: "🖕", text: "" },
        { icon: "👍", text: "" },
        { icon: "👫", text: "" },
        { icon: "👬", text: "" },
        { icon: "👭", text: "" },
        { icon: "🌚", text: "" },
        { icon: "🌝", text: "" },
        { icon: "🙈", text: "" },
        { icon: "💊", text: "" },
        { icon: "😶", text: "" },
        { icon: "🙏", text: "" },
        { icon: "🍦", text: "" },
        { icon: "🍉", text: "" },
        { icon: "😣", text: "" },
      ],
    },
    收藏表情: {
      type: "sticker",
      container: [
        { icon: "https://i.imgur.com/2by85Ui.jpeg", text: "小冒蜜" },
        { icon: "https://i.imgur.com/HCEidtT.jpeg", text: "老鼠玩手机" },
        { icon: "https://i.imgur.com/6W0VDcT.gif", text: "猫脸蹭墙" },
      ],
    },
  };

  const STYLE = `
        .imgur-upload-btn, .emoji-btn {
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
        .imgur-upload-btn:hover, .emoji-btn:hover {
            color: #4d5256;
            text-decoration: underline;
        }
        .hidden {
            display: none !important;
        }
        .imgur-upload-modal, .emoji-modal {
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
        .emoji-modal-content {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
            width: 90%;
            max-width: 500px;
            max-height: 70vh;
            position: relative;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            display: flex;
            flex-direction: column;
        }
        .imgur-upload-modal-header, .emoji-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e2e2e2;
        }
        .emoji-modal-header {
            padding: 15px 20px 10px;
            margin-bottom: 0;
        }
        .imgur-upload-modal-title, .emoji-modal-title {
            font-size: 15px;
            font-weight: normal;
            color: #000;
        }
        .imgur-upload-modal-close, .emoji-modal-close {
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
        .imgur-upload-modal-close:hover, .emoji-modal-close:hover {
            color: #999;
        }
        .emoji-content {
            padding: 15px 20px;
            flex: 1;
            overflow-y: auto;
            min-height: 200px;
        }
        .emoji-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 15px;
        }
        .emoji-item {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 35px;
            height: 35px;
            padding: 4px 6px;
            cursor: pointer;
            border-radius: 4px;
            transition: background-color 0.2s ease;
            font-size: 16px;
            text-align: center;
            border: 1px solid transparent;
            background: none;
            position: relative;
            word-break: keep-all;
            white-space: nowrap;
        }
        .emoji-item:hover {
            background-color: #f0f0f0;
            border-color: #ddd;
        }
        .emoji-item.text {
            border: 1px solid #d0d0d0;
            background-color: #f8f8f8;
            font-family: "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", "Helvetica Neue", Helvetica, Arial, sans-serif;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .emoji-item.text:hover {
            background-color: #eeeeee;
            border-color: #bbb;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .emoji-item.image {
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            width: 35px;
            min-width: 35px;
        }
        .emoji-item.image.large {
            width: 60px;
            min-width: 60px;
            height: 60px;
        }
        .emoji-item .delete-btn {
            position: absolute;
            top: -4px;
            right: -4px;
            width: 14px;
            height: 14px;
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 9px;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }
        .emoji-item:hover .delete-btn {
            display: flex;
        }
        .emoji-tabs {
            display: flex;
            border-top: 1px solid #e2e2e2;
            background-color: #f9f9f9;
            overflow-x: auto;
        }
        .emoji-tab {
            flex: 1;
            padding: 12px 16px;
            text-align: center;
            cursor: pointer;
            font-size: 12px;
            color: #666;
            border: none;
            background: none;
            transition: all 0.2s ease;
            border-right: 1px solid #e2e2e2;
            white-space: nowrap;
        }
        .emoji-tab:last-child {
            border-right: none;
        }
        .emoji-tab.active {
            background-color: #fff;
            color: #333;
            border-top: 2px solid #778087;
        }
        .emoji-tab:hover:not(.active) {
            background-color: #f0f0f0;
        }
        .emoji-config-panel {
            padding: 20px;
            height: calc(100% - 0px);
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            width: 100%;
        }
        .emoji-config-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }
        .emoji-config-textarea {
            width: 100%;
            flex: 1;
            min-height: 280px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-family: "Consolas", "Monaco", "Courier New", monospace;
            font-size: 12px;
            resize: vertical;
            margin-bottom: 15px;
            box-sizing: border-box;
            line-height: 1.4;
        }
        .emoji-config-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 15px;
            border-top: 1px solid #e2e2e2;
            margin-top: auto;
        }
        .emoji-config-btn {
            background: none;
            border: none;
            color: #778087;
            cursor: pointer;
            font-size: 12px;
            padding: 0;
            transition: color 0.2s ease;
            text-decoration: none;
        }
        .emoji-config-btn:hover {
            color: #4d5256;
            text-decoration: underline;
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
        }
        .imgur-upload-dropzone:hover {
            border-color: #999;
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
        .save-emoji-checkbox {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 12px;
            color: #666;
        }
        .save-emoji-checkbox input[type="checkbox"] {
            margin: 0;
        }
    `;

  // 获取表情配置
  function getEmojiConfig() {
    try {
      const savedConfig = GM_getValue(EMOJI_CONFIG_KEY, null);
      if (!savedConfig) {
        return DEFAULT_EMOJI_CONFIG;
      }

      // 如果savedConfig已经是对象，直接返回
      if (typeof savedConfig === "object") {
        return savedConfig;
      }

      // 如果是字符串，尝试解析
      if (typeof savedConfig === "string") {
        return JSON.parse(savedConfig);
      }

      // 其他情况返回默认配置
      return DEFAULT_EMOJI_CONFIG;
    } catch (error) {
      console.error("解析表情配置失败，使用默认配置:", error);
      // 清除错误的配置并使用默认配置
      GM_setValue(EMOJI_CONFIG_KEY, JSON.stringify(DEFAULT_EMOJI_CONFIG));
      return DEFAULT_EMOJI_CONFIG;
    }
  }

  // 保存表情配置
  function saveEmojiConfig(config) {
    try {
      // 确保保存的是JSON字符串
      const configString =
        typeof config === "string" ? config : JSON.stringify(config);
      GM_setValue(EMOJI_CONFIG_KEY, configString);
    } catch (error) {
      console.error("保存表情配置失败:", error);
      alert("保存配置失败，请检查配置格式");
    }
  }

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
                <div>点击选择图片或拖拽图片到此处</div>
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

  // 创建表情选择器弹窗
  function createEmojiModal(textareaElement) {
    const modal = document.createElement("div");
    modal.className = "emoji-modal";

    const content = document.createElement("div");
    content.className = "emoji-modal-content";

    const emojiConfig = getEmojiConfig();
    const categories = Object.keys(emojiConfig);

    content.innerHTML = `
              <div class="emoji-modal-header">
                  <div class="emoji-modal-title">选择表情</div>
                  <div style="display: flex; align-items: center; gap: 15px;">
                      <a class="emoji-config-btn" id="emoji-config-btn" href="javascript:void(0);">⚙️ 配置</a>
                      <div class="emoji-modal-close">×</div>
                  </div>
              </div>
              <div class="emoji-content">
                  <div class="emoji-grid" id="emoji-grid"></div>
              </div>
              <div class="emoji-tabs" id="emoji-tabs"></div>
          `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // 预渲染所有分类内容
    preRenderCategories(emojiConfig);

    // 创建分栏
    const tabsContainer = content.querySelector("#emoji-tabs");
    const fragment = document.createDocumentFragment();
    categories.forEach((category, index) => {
      const tab = document.createElement("button");
      tab.className = `emoji-tab ${index === 0 ? "active" : ""}`;
      tab.textContent = category;
      tab.dataset.category = category;
      fragment.appendChild(tab);
    });
    tabsContainer.appendChild(fragment);

    // 使用事件委托处理分栏点击
    tabsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("emoji-tab")) {
        const category = e.target.dataset.category;
        switchEmojiCategoryOptimized(category);
      }
    });

    // 显示第一个分类的表情
    if (categories.length > 0) {
      switchEmojiCategoryOptimized(categories[0]);
    }

    // 设置事件监听
    setupEmojiModalEvents(modal, textareaElement);

    return modal;
  }

  // 全局缓存已渲染的分类内容
  let renderedCategories = new Map();
  let currentActiveCategory = null;

  // 预渲染所有分类内容
  function preRenderCategories(emojiConfig) {
    renderedCategories.clear();

    Object.keys(emojiConfig).forEach((category) => {
      const categoryData = emojiConfig[category];
      if (categoryData && categoryData.container) {
        const container = document.createElement("div");

        categoryData.container.forEach((item, index) => {
          const emojiEl = document.createElement("button");
          emojiEl.className = "emoji-item";
          emojiEl.dataset.emoji = item.icon;
          emojiEl.dataset.category = category;
          emojiEl.dataset.index = index;

          if (
            categoryData.type === "image" ||
            categoryData.type === "sticker"
          ) {
            emojiEl.className += " image";

            // 检查是否是imgur链接，如果是则使用大图标
            if (
              item.icon.includes("imgur.com") ||
              item.icon.includes("i.imgur.com")
            ) {
              emojiEl.className += " large";
            }

            emojiEl.style.backgroundImage = `url(${item.icon})`;
            emojiEl.title = item.text || item.icon;

            // 为自定义分组添加删除按钮
            if (categoryData.editable !== false) {
              const deleteBtn = document.createElement("button");
              deleteBtn.className = "delete-btn";
              deleteBtn.innerHTML = "×";
              deleteBtn.dataset.action = "delete";
              emojiEl.appendChild(deleteBtn);
            }
          } else {
            emojiEl.textContent = item.icon;
            emojiEl.title = item.text || item.icon;

            // 为颜文字添加特殊样式
            if (
              categoryData.type === "text" ||
              categoryData.type === "emoticon"
            ) {
              emojiEl.className += " text";
            }
          }

          container.appendChild(emojiEl);
        });

        renderedCategories.set(category, container);
      }
    });
  }

  // 优化的切换表情分类函数
  function switchEmojiCategoryOptimized(category) {
    if (currentActiveCategory === category) return;

    const grid = document.getElementById("emoji-grid");
    const tabs = document.querySelectorAll(".emoji-tab");

    if (!grid) {
      console.error("找不到表情网格元素");
      return;
    }

    // 更新分栏状态
    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.category === category);
    });

    // 清空网格并插入预渲染的内容
    grid.innerHTML = "";
    const categoryContainer = renderedCategories.get(category);
    if (categoryContainer) {
      // 克隆容器内容
      const clonedContainer = categoryContainer.cloneNode(true);
      // 将克隆的子元素添加到网格中
      while (clonedContainer.firstChild) {
        grid.appendChild(clonedContainer.firstChild);
      }
    }

    currentActiveCategory = category;
  }

  // 使用事件委托处理表情点击和删除
  function setupEmojiGridEvents() {
    const grid = document.getElementById("emoji-grid");
    if (!grid) return;

    grid.addEventListener("click", (e) => {
      const target = e.target.closest(".emoji-item");
      if (!target) return;

      const deleteBtn = e.target.closest(".delete-btn");
      if (deleteBtn) {
        e.stopPropagation();
        const category = target.dataset.category;
        const index = parseInt(target.dataset.index);
        deleteEmojiOptimized(category, index);
      } else {
        const emoji = target.dataset.emoji;
        insertEmoji(emoji);
      }
    });
  }

  // 优化的删除表情函数
  function deleteEmojiOptimized(category, index) {
    if (confirm("确定要删除这个表情吗？")) {
      try {
        const config = getEmojiConfig();
        if (config[category] && config[category].container) {
          config[category].container.splice(index, 1);
          saveEmojiConfig(config);

          // 重新预渲染并刷新当前分类
          preRenderCategories(config);
          switchEmojiCategoryOptimized(category);
        }
      } catch (error) {
        console.error("删除表情失败:", error);
        alert("删除表情失败: " + error.message);
      }
    }
  }

  // 显示配置页面
  function showEmojiConfig() {
    const content = document.querySelector(".emoji-content");
    const tabs = document.querySelectorAll(".emoji-tab");
    const tabsContainer = document.querySelector("#emoji-tabs");

    // 清除所有分栏的激活状态并隐藏分栏容器
    tabs.forEach((tab) => tab.classList.remove("active"));
    if (tabsContainer) {
      tabsContainer.style.display = "none";
    }

    const currentConfig = getEmojiConfig();

    content.innerHTML = `
          <div class="emoji-config-panel">
              <div class="emoji-config-title">表情配置</div>
              <textarea class="emoji-config-textarea" id="emoji-config-textarea" 
                  placeholder="请输入 JSON 格式的表情配置...">${JSON.stringify(
                    currentConfig,
                    null,
                    2
                  )}</textarea>
              
              <div class="emoji-config-actions">
                  <a href="https://owo.dogxi.me/" target="_blank" style="background-color: #f5f5f5; border: 1px solid #ccc; border-radius: 3px; color: #333; cursor: pointer; font-size: 12px; padding: 6px 12px; transition: all 0.2s ease; white-space: nowrap; text-decoration: none;">更多配置</a>
                  <div>
                      <button style="background-color: #f5f5f5; border: 1px solid #ccc; border-radius: 3px; color: #333; cursor: pointer; font-size: 12px; padding: 6px 12px; transition: all 0.2s ease; white-space: nowrap;" id="cancel-config-btn">取消</button>
                      <button style="background-color: #778087; color: white; border: 1px solid #778087; border-radius: 3px; cursor: pointer; font-size: 12px; padding: 6px 12px; transition: all 0.2s ease; white-space: nowrap; margin-left: 10px;" id="save-config-btn">保存配置</button>
                  </div>
              </div>
          </div>
      `;

    // 添加事件监听
    setupEmojiConfigEvents();
  }

  // 设置表情配置页面事件
  function setupEmojiConfigEvents() {
    const cancelBtn = document.getElementById("cancel-config-btn");
    const saveBtn = document.getElementById("save-config-btn");

    if (cancelBtn) {
      cancelBtn.addEventListener("click", function () {
        const modal = document.querySelector(".emoji-modal");
        if (modal) {
          modal.remove();
        }
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener("click", function () {
        const textarea = document.getElementById("emoji-config-textarea");
        try {
          const config = JSON.parse(textarea.value);
          saveEmojiConfig(config);
          alert("配置保存成功！");

          // 重新创建表情弹窗以应用新配置
          const modal = document.querySelector(".emoji-modal");
          if (modal) {
            const textareaElement = document.getElementById("reply_content");
            modal.remove();
            if (textareaElement) {
              createEmojiModal(textareaElement);
            }
          }
        } catch (e) {
          console.error("配置保存失败:", e);
          alert("JSON 格式错误，请检查配置：\n" + e.message);
        }
      });
    }
  }

  // 设置表情弹窗事件监听
  function setupEmojiModalEvents(modal, textareaElement) {
    const closeBtn = modal.querySelector(".emoji-modal-close");
    const configBtn = modal.querySelector("#emoji-config-btn");

    function closeModal() {
      if (document.body.contains(modal)) {
        // 清理缓存
        renderedCategories.clear();
        currentActiveCategory = null;
        document.body.removeChild(modal);
      }
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    if (configBtn) {
      configBtn.addEventListener("click", showEmojiConfig);
    }

    // 设置表情网格事件委托
    setupEmojiGridEvents();

    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });

    // ESC键关闭
    const escHandler = function (e) {
      if (e.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);
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
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    }

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
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

  // 修改上传成功处理逻辑
  function handleUploadSuccess(imageUrl, fileName, modal) {
    const textarea = document.getElementById("reply_content");

    // 插入链接到文本框
    insertLinkIntoTextarea(textarea, imageUrl, fileName);
    showStatusInModal(modal, "上传成功！", "success");

    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    }, 1500);
  }

  // 修改uploadToImgur函数中的成功处理部分
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
            handleUploadSuccess(imageUrl, file.name, modal);
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

  // 在页面头部添加表情和上传按钮
  function addUploadButtonToHeader() {
    const replyBox = document.getElementById("reply-box");
    if (!replyBox) return;

    const headerCell = replyBox.querySelector(".cell.flex-one-row");
    if (!headerCell) return;

    if (headerCell.querySelector(".imgur-upload-btn")) return;

    const leftDiv = headerCell.querySelector("div:first-child");
    if (leftDiv) {
      // 添加表情按钮
      const emojiBtn = document.createElement("a");
      emojiBtn.className = "emoji-btn";
      emojiBtn.textContent = "表情";
      emojiBtn.href = "javascript:void(0);";
      emojiBtn.title = "选择表情";
      emojiBtn.style.marginLeft = "10px";

      leftDiv.appendChild(emojiBtn);

      emojiBtn.addEventListener("click", function (e) {
        e.preventDefault();
        // console.log("表情按钮被点击"); // 调试日志
        const textarea = document.getElementById("reply_content");
        if (textarea) {
          // console.log("创建表情弹窗"); // 调试日志
          createEmojiModal(textarea);
        } else {
          console.error("找不到回复文本框");
        }
      });

      // 添加上传按钮
      const uploadBtn = document.createElement("a");
      uploadBtn.className = "imgur-upload-btn";
      uploadBtn.textContent = "上传";
      uploadBtn.href = "javascript:void(0);";
      uploadBtn.title = "上传图片";
      uploadBtn.style.marginLeft = "10px";

      leftDiv.appendChild(uploadBtn);

      uploadBtn.addEventListener("click", function (e) {
        e.preventDefault();
        // console.log("上传按钮被点击"); // 调试日志
        const textarea = document.getElementById("reply_content");
        if (textarea) {
          // console.log("创建上传弹窗"); // 调试日志
          createUploadModal(textarea);
        }
      });
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
    setTimeout(findTextareasAndAddButtons, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // 插入表情到文本框
  function insertEmoji(emoji) {
    const textarea = document.getElementById("reply_content");
    if (!textarea) {
      console.error("找不到回复文本框");
      return;
    }

    const textToInsert = emoji;
    const currentValue = textarea.value;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    const newText =
      currentValue.substring(0, selectionStart) +
      textToInsert +
      currentValue.substring(selectionEnd);
    textarea.value = newText;

    const newCursorPosition = selectionStart + textToInsert.length;
    textarea.selectionStart = newCursorPosition;
    textarea.selectionEnd = newCursorPosition;

    textarea.focus();
    textarea.dispatchEvent(
      new Event("input", { bubbles: true, cancelable: true })
    );

    // 关闭弹窗
    const modal = document.querySelector(".emoji-modal");
    if (modal) {
      renderedCategories.clear();
      currentActiveCategory = null;
      modal.remove();
    }
  }
})();

// ==UserScript==
// @name         P站功能加强
// @namespace    https://greasyfork.org/zh-CN/users/1296281
// @version      1.4.1
// @license      GPL-3.0
// @description  功能：1、快速收藏按钮 2、添加收藏，自动填写标签 3、修改收藏，自动提醒标签
// @author       ShineByPupil
// @match        *://www.pixiv.net/*
// @icon         https://www.pixiv.net/favicon20250122.ico
// @grant        none
// @require      https://update.greasyfork.org/scripts/539247/1611171/%E9%80%9A%E7%94%A8%E7%BB%84%E4%BB%B6%E5%BA%93.js
// @downloadURL https://update.greasyfork.org/scripts/539635/P%E7%AB%99%E5%8A%9F%E8%83%BD%E5%8A%A0%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/539635/P%E7%AB%99%E5%8A%9F%E8%83%BD%E5%8A%A0%E5%BC%BA.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  // 页面类型
  const url = location.href;
  const pageType = url.includes("users")
    ? "users" // 作者
    : url.includes("artworks")
      ? "artworks" // 作品
      : url.includes("bookmark_add")
        ? "bookmark_add" // 收藏页
        : "";

  // 标签设置弹窗
  class TagsManager extends HTMLElement {
    static #instance = null;
    tagsArr = [];

    constructor() {
      super();

      this.tagsArr = JSON.parse(localStorage.getItem("tagsArr")) || [];

      this.template = document.createElement("template");
      this.template.innerHTML = `
        <span></span>
        <mx-input placeholder="标签"></mx-input>
        <mx-input placeholder="标签别名"></mx-input>
        <mx-button class="del" type="danger">删除</mx-button>
      `;

      const htmlTemplate = document.createElement("template");
      htmlTemplate.innerHTML = `
        <mx-dialog class="dialog" confirm-text="保存">
          <span slot="header">标签自动填写设置</span>
          
          <mx-button class="add" type="primary">新增</mx-button>
          <div class="container"></div>
          
          <mx-button class="export-btn" slot="button-center">导出</mx-button>
          <mx-button class="import-btn" slot="button-center">导入</mx-button>
        </mx-dialog>
        
      `;

      const cssTemplate = document.createElement("template");
      cssTemplate.innerHTML = `
        <style>
          :host {
            display: block;
          }
          .container {
            max-height: 40vh;
            overflow: auto;
            display: grid;
            grid-template-columns: auto 1fr 1fr auto;
            align-items: center;
            gap: 6px 10px;
            margin-top: 6px;
          }
          .add {
            grid-column: 1 / -1;
          }
          .input-row {
            display: flex;
            margin-bottom: 12px;
          }
          input[type="text"] {
            flex: 1;
            padding: 8px;
            font-size: 1rem;
          }
          button {
            margin-left: 8px;
            padding: 8px 12px;
            font-size: 1rem;
            cursor: pointer;
          }
          ul {
            list-style: none;
            padding: 0;
          }
          li {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
          }
          li span {
            flex: 1;
          }
          li button {
            margin-left: 4px;
            padding: 4px 8px;
            font-size: 0.9rem;
          }
        </style>
      `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.append(htmlTemplate.content, cssTemplate.content);

      // 弹窗内部
      this.dialog = this.shadowRoot.querySelector(".dialog");
      this.container = this.shadowRoot.querySelector(".container");
      this.addBtn = this.shadowRoot.querySelector(".add");
      this.exportBtn = this.shadowRoot.querySelector(".export-btn");
      this.importBtn = this.shadowRoot.querySelector(".import-btn");

      // 开启弹窗按钮
      this.autoTagConfigBtn = document.createElement("div");
      this.autoTagConfigBtn.attachShadow({ mode: "open" });
      this.autoTagConfigBtn.shadowRoot.innerHTML = `
        <mx-button circle>
          <mx-icon type="setting"></mx-icon>
        </mx-button>
      
        <style>
          mx-button {
            height: 48px;
            position: fixed;
            right: 28px;
            bottom: 100px;
            z-index: 2501;
            color: #fff;
            background-color: var(--charcoal-surface4);
          }
          mx-button:hover {
            color: #fff;
          }
          mx-button::part(button) {
            border: none;
          }
          mx-button:hover {
            background-color: var(--charcoal-surface4-hover);
          }
          mx-icon {
            width: 100%;
            height: 100%;
          }
        </style>
      `;
    }

    connectedCallback() {
      this.addBtn.addEventListener("click", () => {
        const item = this.template.content.cloneNode(true);
        this.container.prepend(item);
      });
      // 事件委托 - 删除按钮
      this.container.addEventListener("click", (e) => {
        if (
          e.target.tagName === "MX-BUTTON" &&
          e.target.classList.contains("del")
        ) {
          let el = e.target;
          for (let i = 0; i < 4 && el; i++) {
            const prev = el.previousElementSibling;
            el.remove();
            el = prev;
          }
        }
      });
      this.exportBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(JSON.stringify(this.tagsArr));
      });
      this.importBtn.addEventListener("click", () => {
        const userInput = prompt("请输入配置：");

        if (userInput !== null) {
          this.tagsArr = JSON.parse(userInput);
          this.load();
        }
      });
      this.dialog.addEventListener("confirm", () => this.save());
      this.dialog.addEventListener("cancel", () => this.load());

      this.autoTagConfigBtn.addEventListener("click", () => {
        this.dialog.open();
      });

      this.load();
    }

    static get instance() {
      if (!this.#instance) {
        // 初始化
        const el = document.createElement(this.tagName);
        this.#instance = el;

        document.body.appendChild(el);
        document.body.appendChild(el.autoTagConfigBtn);
      }

      return this.#instance;
    }
    // 避免和内置 name 命名冲突
    static get tagName() {
      return "pixiv-tools-tags-manager";
    }

    load() {
      this.container.innerHTML = "";

      this.tagsArr.forEach((tag, index) => {
        const item = this.template.content.cloneNode(true);
        const [no, input1, input2, delBtn] = item.children;

        this.container.prepend(item);

        [no.textContent, input1.value, input2.value] = [
          index + 1,
          tag[0],
          tag[1],
        ];
      });
    }
    save() {
      this.tagsArr = Array.from(this.container.querySelectorAll("mx-input"))
        .map((n) => n.value)
        .reduce((chunks, item, index) => {
          if (index % 2 === 0) chunks.push([]);
          // 把当前项放到最后一个子数组里
          chunks[chunks.length - 1].push(item);
          return chunks;
        }, [])
        .reverse();

      for (let i = this.tagsArr.length - 1; i >= 0; i--) {
        if (!this.tagsArr[i][0]) {
          this.tagsArr.splice(i, 1);

          continue;
        }

        if (this.tagsArr[i][0] === this.tagsArr[i][1]) {
          this.tagsArr[i][1] = "";
        }
      }

      localStorage.setItem("tagsArr", JSON.stringify(this.tagsArr));
      this.load();

      MxMessage.success("保存成功");
    }

    // 检查收藏标签是否有遗漏
    async checkAllFavorite() {
      if (!this.USER_ID) {
        throw new Error("[pixivTools] USER_ID 获取不到");
      }

      const tagsArr = JSON.parse(localStorage.getItem("tagsArr"));
      if (!tagsArr || !tagsArr.length) {
        throw new Error("[pixivTools] tagsArr为空，请先在收藏配置弹窗设置规则");
      }

      let total = null; // 收藏总数
      let limit = 100;

      await this.bookmarksAPI(0, 1).then((res) => {
        total = res.body.total;
      });

      // const pageCount = Math.ceil(total / limit);
      const pageCount = 3;
      const pages = Array.from({ length: pageCount }, (_, i) => i);
      const tasks = pages.map((page) =>
        MxMgr.enqueue(() => this.bookmarksAPI(page, 1)),
      );

      Promise.all(tasks).then((datas) => {
        const illust_id_list = []; // 标签不齐全的插画

        datas.forEach((item) => {
          const { works, bookmarkTags } = item.body;

          works.forEach((work) => {
            const bookmarkData = bookmarkTags[work.bookmarkData.id]; // 用户收藏标签
            const tags = work.tags; // 插画标签
            // 匹配插画标签
            const matchedTags = tagsArr.filter(([key]) => tags.includes(key));
            // 个人标签（匹配配置 + 匹配插画标签）
            const matchedPersonTagsSet = new Set(
              matchedTags.map((n) => n[1] || n[0]),
            );

            if (
              matchedPersonTagsSet.some((tag) => !bookmarkData.includes(tag))
            ) {
              illust_id_list.push(
                "https://www.pixiv.net/bookmark_add.php?type=illust&illust_id=" +
                  work.id,
              );
            }
          });
        });

        console.log("标签不齐全的插画:", illust_id_list);
      });
    }

    // API - 获取全部收藏
    async bookmarkAPI() {
      if (!this.USER_ID) {
        throw new Error("[pixivTools] USER_ID 获取不到");
      }

      const res = await fetch(
        `/ajax/user/${this.USER_ID}/illusts/bookmark/tags`,
      );
      if (!res.ok) {
        throw new Error(`[pixivTools] bookmark 请求失败：${res.status}`);
      }

      return res.json();
    }
    // API - 获取全部收藏
    async bookmarksAPI(page, pageSize = 100) {
      if (!this.USER_ID) {
        throw new Error("[pixivTools] USER_ID 获取不到");
      }

      const res = await fetch(
        `/ajax/user/${this.USER_ID}/illusts/bookmarks?tag=&offset=${page}&limit=${pageSize}&rest=show`,
      );
      if (!res.ok) {
        throw new Error(`[pixivTools] 第 ${page} 页请求失败：${res.status}`);
      }

      return res.json();
    }
  }

  if (!customElements.get(TagsManager.tagName)) {
    customElements.define(TagsManager.tagName, TagsManager);
  } else {
    console.error(`[pixivTools] 组件 ${TagsManager.tagName} 已注册`);
  }

  // 收藏管理
  class FavoritesManager {
    illust_id = null; // 作品id
    quick_favorite_btn = null; // 收藏按钮
    USER_ID = null;

    constructor() {
      this.USER_ID = Object.keys(localStorage)
        .find((n) => /_\d+/.test(n))
        ?.match(/(?<=_)\d+/)?.[0];

      this.init();
    }

    init() {
      this.initCss();

      // 快速收藏
      this.initQuickFavorite();

      // 自动收藏
      if (pageType === "bookmark_add") this.initAutoFavorite();
    }

    initCss() {
      const cssTemplate = document.createElement("template");
      cssTemplate.innerHTML = `
        <style>
          ._work:before,
          ._work:after,
          .sc-hnotl9-0.gDHFA-d,
          .sc-9e474da3-0:before {
            pointer-events: none;
          }
        </style>
      `;

      document.head.appendChild(cssTemplate.content);
    }

    // 快速收藏
    initQuickFavorite() {
      const quickFavoriteBtn = document.createElement("div");
      quickFavoriteBtn.attachShadow({ mode: "open" });
      quickFavoriteBtn.shadowRoot.innerHTML = `
        <button>快速收藏</button>
        
        <style>
          :host {
            position: absolute;
            display: none;
            z-index: 1;
          } 
        
          button {
            width: 70px;
            font-size: 12px;
            color: #fff;
            text-shadow: 1px 1px 3px #000;
            background: rgba(76, 110, 245, 0.5);
            border: 1px solid rgb(76, 110, 245);
            border-radius: 5px;
            padding: 1px 0;
            cursor: pointer;
            transition: background 0.2s;
          }
          button:hover {
            background: rgba(76, 110, 245, 0.8);
          }
        </style>
      `;

      const button = quickFavoriteBtn.shadowRoot.querySelector("button");
      document.body.appendChild(quickFavoriteBtn);
      this.quick_favorite_btn = quickFavoriteBtn;

      // 收藏按钮点击事件 - 打开收藏页
      button.addEventListener("click", () => {
        if (this.illust_id) {
          window.open(
            `https://www.pixiv.net/bookmark_add.php?type=illust&illust_id=${this.illust_id}`,
          );
        }
      });

      // 鼠标移入事件 - 在插画上显示收藏按钮
      document.addEventListener("mouseover", (e) => {
        if (e.target.tagName === "IMG") {
          const link = e.target.getAttribute("src") || "";

          if (link.startsWith("https://i.pximg.net/")) {
            const re = /\d+(?=_p0|_square|_master)/;
            this.illust_id = link.match(re)?.[0] || null;

            if (this.illust_id) {
              const rect = e.target.getBoundingClientRect();
              this.quick_favorite_btn.style.left = `${rect.left + 10 + window.scrollX}px`;
              this.quick_favorite_btn.style.top = `${rect.top + 10 + window.scrollY}px`;
              this.quick_favorite_btn.style.display = "block";
            }
          }
        }
      });

      // 鼠标移除事件 - 隐藏收藏按钮
      document.addEventListener("mouseout", (e) => {
        if (this.quick_favorite_btn.matches(":hover")) return;
        if (e.target.tagName !== "IMG") return;

        this.illust_id = null;
        this.quick_favorite_btn.style.display = "none";
      });

      // 页面失焦事件 - 隐藏收藏按钮
      window.addEventListener("blur", () => {
        this.illust_id = null;
        this.quick_favorite_btn.style.display = "none";
      });
    }

    // 自动收藏
    initAutoFavorite() {
      let addForm = null; // 添加收藏表单
      let removeForm = null; // 取消收藏表单 - 同时判断是否首次收藏
      let tagsManager = TagsManager.instance; //功能二： 标签设置弹窗

      // 功能一：提交表单后，页面自动关闭
      {
        let isSubmit = false; // 是否触发提交

        Array.from(document.forms).forEach((form) => {
          if (form.getAttribute("action")?.includes("bookmark_add")) {
            addForm = form;
          } else if (
            form.getAttribute("action")?.includes("bookmark_setting")
          ) {
            removeForm = form;
          }
        });

        addForm?.addEventListener("submit", () => (isSubmit = true));
        removeForm?.addEventListener("submit", () => (isSubmit = true));

        window.addEventListener("unload", () => {
          if (!window.closed && isSubmit) window.close();
        });
      }

      // 功能三：收藏：新增自动填充、修改高亮提示遗漏
      {
        // 插画标签
        const tags = Array.from(
          document.querySelectorAll(
            ".work-tags-container .list-items span.tag",
          ),
        ).map((n) => n.getAttribute("data-tag"));

        // 插画标签（匹配配置）
        const matchedTags = tagsManager.tagsArr.filter(([key]) =>
          tags.includes(key),
        );

        // 个人标签（匹配配置 + 匹配插画标签）
        let matchedPersonTagsSet = new Set(
          matchedTags.map((n) => n[1] || n[0]),
        );
        const tagsInput = document.querySelector(".input-box.tags input");

        if (!removeForm) {
          // 新增
          tagsInput.value = matchedPersonTagsSet.join(" ");
        } else {
          // 修改
          const cssTemplate = document.createElement("template");
          cssTemplate.innerHTML = `
            <style>
              :root {
                --pixivTools__matched-color: 255, 111, 97;
              }
              
              .pixivTools__matched:not(.selected):not(:hover) {
                color: rgb(var(--pixivTools__matched-color));
                font-weight: bold;
                animation: glow-breath 2.5s ease-in-out infinite;
              }
              
              @keyframes glow-breath {
                0%, 100% {
                  text-shadow: none;
                }
                50% {
                  text-shadow:
                    0 0 8px  rgba(var(--pixivTools__matched-color), 0.6),
                    0 0 16px rgba(var(--pixivTools__matched-color), 0.6),
                    0 0 32px rgba(var(--pixivTools__matched-color), 0.4),
                    0 0 48px rgba(var(--pixivTools__matched-color), 0.3);
                }
              }
            </style>
          `;

          document.head.appendChild(cssTemplate.content);

          requestIdleCallback(() => {
            const personTags = Array.from(
              document.querySelectorAll(
                ".tag-cloud-container .list-items span.tag",
              ),
            );

            personTags.forEach((tag) => {
              if (matchedPersonTagsSet.has(tag.textContent)) {
                tag.classList.add("pixivTools__matched");
              }
            });
          });
        }
      }
    }
  }

  new FavoritesManager();
})();

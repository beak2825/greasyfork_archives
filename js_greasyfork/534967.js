function createLangSwitcher(setValue, getValue) {
  // 创建宿主元素
  const container = document.createElement("div");
  container.id = "langSwitcher";
  // 创建 shadowRoot
  const shadowRoot = container.attachShadow({ mode: "open" });
  shadowRoot.innerHTML = ` <style>
      /* 容器定位 */
      .language-switcher {
        position: fixed;
        top: 80px;
        right: 1px;
        z-index: 1000;
      }

      /* 触发按钮样式 */
      .trigger-btn {
        display: flex;
        align-items: center;
        padding: 4px 6px;
        background: #fff;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
      }

      .trigger-btn:hover {
        border-color: #c0c4cc;
        background-color: #f5f7fa;
      }

      /* 语言图标设计 */
      .lang-icon {
        position: relative;
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }

      .lang-icon::before,
      .lang-icon::after {
        position: absolute;
        content: "文";
        font-size: 16px;
        color: #606266;
      }

      .lang-icon::after {
        content: "A";
        font-size: 12px;
        bottom: 2px;
        right: 2px;
      }

      /* 下拉菜单样式 */
      .dropdown-menu {
        position: absolute;
        top: 110%;
        right: 0;
        width: 100px;
        background: #fff;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        visibility: hidden;
      }

      /* 滚动容器 */
      .scroll-container {
        max-height: 240px;
        overflow-y: auto;
      }

      /* 菜单项样式 */
      .menu-item {
        display: flex;
        align-items: center;
        padding: 4px 6px;
        color: #606266;
        cursor: pointer;
        transition: all 0.2s;
      }

      .menu-item:hover {
        background-color: #f5f7fa;
      }

      /* 激活状态 */
      .active .dropdown-menu {
        opacity: 1;
        transform: translateY(0);
        visibility: visible;
      }
    </style>
  </head>
  <body>
    <div class="language-switcher">
      <div class="trigger-btn">
        <div class="lang-icon"></div>
        <span>中文</span>
      </div>
      <div class="dropdown-menu">
        <div class="scroll-container"></div>
      </div>
    </div>
  </body>
`;
  const languages = [
    { lang: "ar", text: "阿拉伯语", play: true, abbr: "阿" },
    { lang: "pl", text: "波兰语", play: true, abbr: "波兰" },
    { lang: "da", text: "丹麦语", play: true, abbr: "丹麦" },
    { lang: "de", text: "德语", play: true, abbr: "德" },
    { lang: "ru", text: "俄语", play: true, abbr: "俄" },
    { lang: "fr", text: "法语", play: true, abbr: "法" },
    { lang: "fi", text: "芬兰语", play: true, abbr: "芬" },
    { lang: "ko", text: "韩语", play: true, abbr: "韩" },
    { lang: "nl", text: "荷兰语", play: true, abbr: "荷" },
    { lang: "cs", text: "捷克语", play: true, abbr: "捷克" },
    { lang: "pt", text: "葡萄牙语", play: true, abbr: "葡" },
    { lang: "ja", text: "日语", play: true, abbr: "日" },
    { lang: "sv", text: "瑞典语", play: true, abbr: "瑞典" },
    { lang: "th", text: "泰语", play: true, abbr: "泰" },
    { lang: "tr", text: "土耳其语", play: false, abbr: "土" },
    { lang: "es", text: "西班牙语", play: true, abbr: "西" },
    { lang: "hu", text: "匈牙利语", play: true, abbr: "匈" },
    { lang: "en", text: "英语", play: true, abbr: "英" },
    { lang: "it", text: "意大利语", play: true, abbr: "意" },
    { lang: "vi", text: "越南语", play: true, abbr: "越" },
    { lang: "zh-CHS", text: "中文", play: true, abbr: "中" },
  ];

  class LanguageSwitcher {
    constructor(data, containerSelector) {
      this.data = data;
      this.container = shadowRoot.querySelector(containerSelector);
      this.triggerBtn = this.container.querySelector(".trigger-btn span");
      this.menuContainer = this.container.querySelector(".scroll-container");
      this.selectedLang = getValue("selectedLang", "zh-CHS");
      this.init();
    }

    init() {
      this.renderMenu();
      this.setTriggerText();
      this.bindEvents();
    }

    renderMenu() {
      this.menuContainer.innerHTML = ""; // 清空原有内容
      this.data.forEach((item) => {
        if (!item.play) return;
        const div = document.createElement("div");
        div.className = "menu-item";
        div.dataset.lang = item.lang;
        div.textContent = item.text;
        this.menuContainer.appendChild(div);
      });
    }

    setTriggerText() {
      const current = this.data.find((item) => item.lang === this.selectedLang);
      this.triggerBtn.textContent = current ? current.abbr : "lang";
    }

    bindEvents() {
      // 鼠标悬浮切换
      this.container.addEventListener("mouseenter", () => {
        this.container.classList.add("active");
      });
      this.container.addEventListener("mouseleave", () => {
        this.container.classList.remove("active");
      });

      // 点击菜单项
      this.menuContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("menu-item")) {
          const selectedLang = e.target.dataset.lang;
          this.selectedLang = selectedLang;
          setValue("selectedLang", selectedLang);
          this.setTriggerText();
          this.container.classList.remove("active");
        }
      });
    }
  }
  new LanguageSwitcher(languages, ".language-switcher");
  return container;
}

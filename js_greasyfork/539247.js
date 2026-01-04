// ==UserScript==
// @name         通用组件库
// @namespace    https://greasyfork.org/zh-CN/users/1296281
// @version      1.4.1
// @license      GPL-3.0
// @description  通用 UI 组件和工具函数库
// @author       ShineByPupil
// @match        *
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // 主题色 + 其他配色
  const colors = {
    primary: "#4C6EF5",
    success: "#67c23a",
    info: "#909399",
    warning: "#e6a23c",
    danger: "#f56c6c",
  };
  const defaultColors = [];
  const lightColors = [];
  const darkColors = [];

  const mixColor = (color1, color2, percent) => {
    // 去掉井号并转换为 0～255 的整数
    const c1 = color1.replace(/^#/, "");
    const c2 = color2.replace(/^#/, "");
    const r1 = parseInt(c1.substr(0, 2), 16);
    const g1 = parseInt(c1.substr(2, 2), 16);
    const b1 = parseInt(c1.substr(4, 2), 16);
    const r2 = parseInt(c2.substr(0, 2), 16);
    const g2 = parseInt(c2.substr(2, 2), 16);
    const b2 = parseInt(c2.substr(4, 2), 16);

    // 百分比转 0～1
    const t = Math.min(Math.max(percent, 0), 100) / 100;

    // 插值计算
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    // 转回两位十六进制，不足两位补零
    const toHex = (x) => x.toString(16).padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  for (let key in colors) {
    const color = colors[key];
    defaultColors.push(`--${key}-color: ${color};`);

    for (let i = 1; i <= 9; i++) {
      const p = i * 10;

      lightColors.push(
        `--${key}-color-light-${i}: ${mixColor(color, "#ffffff", p)};`,
      );
      darkColors.push(
        `--${key}-color-light-${i}: ${mixColor(color, "#141414", p)};`,
      );
    }
  }

  const commonCssTemplate = document.createElement("template");
  commonCssTemplate.innerHTML = `
    <style>
      /* 明亮模式 */
      :host {
        /* 主题色 */
        ${defaultColors.join("\n")}
        /* 明亮渐变色 */
        ${lightColors.join("\n")}
        --border-color: #dcdfe6;
        --border-color-hover: #C0C4CC;
        --bg-color: #FFFFFF;
        --text-color: #333333;
        --placeholder-color: #a8abb2;
      }
      :host {
        font-family: Inter, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", 微软雅黑, Arial, sans-serif;
      }
      :host([disabled]) * {
        cursor: not-allowed;
      }
      
      /* 夜间模式 */
      :host-context(:is(.ex, .dark, [data-theme="dark"])) {
        /* 夜间渐变色 */
        ${darkColors.join("\n")}
        --border-color: #4C4D4F;
        --border-color-hover: #6C6E72;
        --bg-color: #141414;
        --text-color: #CFD3DC;
        --placeholder-color: #8D9095;
      }
    </style>
  `;

  class Input extends HTMLElement {
    input = null;

    constructor() {
      super();

      const htmlTemplate = document.createElement("template");
      htmlTemplate.innerHTML = `<input type="text" part="input" />`;

      const cssTemplate = document.createElement("template");
      cssTemplate.innerHTML = `
        <style>
          :host {
            display: inline-flex;
            height: 32px;
            color: var(--text-color);
            border-color: var(--border-color);
            border-radius: 4px;
            background-color: var(--bg-color);
          }
          :host(:not([disabled]):hover) {
            border-color: var(--border-color-hover);
          }
          :host(:not([disabled]):focus) {
            border-color: var(--primary-color);
            border-inline-end-width: 1px;
          }
          input::placeholder {
            color: var(--placeholder-color);
          }
          
          /* 禁用 */
          :host([disabled]) {
            background-color: #f5f7fa;
          }
          :host([disabled]):host-context(:is(.ex, .dark, [data-theme="dark"])) {
            background-color: #262727;
          }
          
          input {
            width: -webkit-fill-available;
            height: inherit;
            color: currentColor;
            outline: none;
            box-sizing: border-box;
            padding: 4px 11px;
            border-width: 1px;
            border-style: solid;
            border-color: inherit;
            border-radius: inherit;
            background-color: inherit;
            vertical-align: top;
            transition: all 0.3s;
            text-align: inherit;
          }
        </style>
      `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.append(
        htmlTemplate.content,
        commonCssTemplate.content.cloneNode(true),
        cssTemplate.content,
      );
      this.input = this.shadowRoot.querySelector("input");
    }

    connectedCallback() {
      this.input.addEventListener("input", (e) => {
        e.stopPropagation();
        this.value = e.target.value;
        this.dispatchEvent(new CustomEvent("input", { detail: this.value }));
      });

      Object.values(this.attributes).forEach((attr) => {
        if (!/^on/.test(attr.name)) {
          this.input.setAttribute(attr.name, attr.value);
        }
      });

      const mo = new MutationObserver((mutationsList) => {
        for (const m of mutationsList) {
          if (m.type === "attributes") {
            const val = this.getAttribute(m.attributeName);
            if (val === null) {
              this.input.removeAttribute(m.attributeName);
            } else {
              this.input.setAttribute(m.attributeName, val);
            }
          }
        }
      });
      mo.observe(this, { attributes: true });
    }

    get value() {
      return this.input.value;
    }
    set value(val) {
      this.input.value = val;
    }
  }

  // todo
  class SelectOption extends HTMLElement {
    constructor() {
      super();
    }
  }

  // todo
  class Select extends HTMLElement {
    constructor() {
      super();

      const htmlTemplate = document.createElement("template");
      htmlTemplate.innerHTML = `
        <div class="">
          <input/>
        </div>
      `;
      const cssTemplate = document.createElement("template");
      cssTemplate.innerHTML = ``;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.append(htmlTemplate.content, cssTemplate.content);

      this.input = this.shadowRoot.querySelector("input");
    }
  }

  class Button extends HTMLElement {
    static observedAttributes = ["type", "circle", "disabled", "ripple"];
    button = null;

    constructor() {
      super();

      const htmlTemplate = document.createElement("template");
      htmlTemplate.innerHTML = `
        <button part="button">
          <slot></slot>
        </button>
      `;

      const cssTemplate = document.createElement("template");
      cssTemplate.innerHTML = `
        <style>
          :host {
            --text-color-hover: var(--primary-color);
            --bg-color: var(--bg-color);
            --bg-color-hover: var(--primary-color-light-9);
            --bg-color-disabled: #FFFFFF;
            --border-color-hover: var(--primary-color);
            --border-color-disabled: var(--border-color);
            --border-radius: 5px;
          }
          :host-context(:is(.ex, .dark, [data-theme="dark"])) {
            --bg-color-disabled: transparent;
            --border-color-hover: var(--primary-color);
          }
          
          /* 禁用 */
          :host([disabled]) {
            --text-color: #a8abb2;
            --border-color: #dcdfe6;
          }
          :host([disabled]):host-context(:is(.ex, .dark, [data-theme="dark"])) {
            --text-color: rgba(255, 255, 255, .5);
            --border-color: #414243;
          }
          :host([disabled]) button {
            background-color: var(--bg-color-disabled);
            border-color: var(--border-color-disabled);
          }
          /* 圆形 */
          :host([circle]) {
            border-radius: 50%;
            --border-radius: 50%;
            aspect-ratio: 1 / 1;
          }
          :host([circle]) button {
            padding: 8px;
          }
        
          ${Object.keys(colors)
            .map((type) => {
              return `
              :host([type='${type}']) {
                --text-color: #FFFFFF;
                --text-color-hover: #FFFFFF;
                --bg-color: var(--${type}-color);
                --bg-color-hover: var(--${type}-color-light-3);
                --bg-color-disabled: var(--${type}-color-light-5);
                --border-color: var(--${type}-color);
                --border-color-hover: var(--${type}-color-light-3);
                --border-color-disabled: var(--${type}-color-light-5);
              }
            `;
            })
            .join("\n")}
        
          :host {
            position: relative;
            display: inline-flex;
            box-sizing: border-box;
            height: 32px;
            overflow: hidden;
            color: var(--text-color);
            background-color: var(--bg-color);
            border-radius: var(--border-radius);
            border-color: var(--border-color);
          }
          :host([disabled]) {
            border-color: var(--border-color-disabled);
          }
          :host(:not([disabled]):hover) {
            color: var(--text-color-hover);
            background-color: var(--bg-color-hover);
            border-color: var(--border-color-hover);
            transition: all 0.3s;
          }
          
          button {
            width: inherit;
            height: inherit;
            padding: 8px 15px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            font-family: inherit;
            color: currentColor;
            background: inherit;
            border-width: 1px;
            border-style: solid;
            border-color: inherit;
            border-radius: inherit;
            outline: none;
            cursor: pointer;
          }
          
          /* 波纹元素 */
          .ripple {
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            background-color: rgba(255, 255, 255, 0.6);
            animation: ripple-animation 600ms linear;
            pointer-events: none;
          }
          /* 波纹动画关键帧 */
          @keyframes ripple-animation {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        </style>
      `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.append(
        htmlTemplate.content,
        commonCssTemplate.content.cloneNode(true),
        cssTemplate.content,
      );

      this.button = this.shadowRoot.querySelector("button");
    }

    connectedCallback() {
      if (this.hasAttribute("ripple")) {
        this.addEventListener("click", function (e) {
          // 计算点击位置相对于按钮的位置
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;

          // 创建波纹元素
          const ripple = document.createElement("span");
          ripple.classList.add("ripple");
          ripple.style.width = ripple.style.height = `${size}px`;
          ripple.style.left = `${x}px`;
          ripple.style.top = `${y}px`;

          // 将波纹添加到按钮，并在动画结束后移除
          this.shadowRoot.append(ripple);
          ripple.addEventListener("animationend", () => {
            ripple.remove();
          });
        });
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "disabled") {
        if (this.hasAttribute("disabled")) {
          this.button.setAttribute("disabled", "");
        } else {
          this.button.removeAttribute("disabled");
        }
      }
    }
  }

  class Switch extends HTMLElement {
    static observedAttributes = ["checked", "disabled", "@change"];
    static channel = null;
    #value = false;

    constructor() {
      super();

      const htmlTemplate = document.createElement("template");
      htmlTemplate.innerHTML = `
        <div class="track">
          <div class="thumb"></div>
        </div>`;

      const cssTemplate = document.createElement("template");
      cssTemplate.innerHTML = `
        <style>
          :host {
            --bg-color: #ccc;
            --cursor: pointer;
          }
          :host {
            display: inline-block;
            aspect-ratio: 2/1;
            height: 20px;
          }
          :host([checked]) {
            --bg-color: ${colors.primary};
          }
          :host([checked]) .thumb {
            transform: translateX(calc(100% + 4px));
          }
          :host([disabled]) {
            --cursor: not-allowed;
          }
          .track {
            width: 100%;
            height: 100%;
            background: var(--bg-color);
            border-radius: 14px;
            position: relative;
            transition: background .3s;
            cursor: var(--cursor);
            outline: none;
          }
          .thumb {
            aspect-ratio: 1/1;
            height: calc(100% - 4px);
            background: #fff;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: 2px;
            transition: transform .3s;
          }
        </style>
      `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.append(htmlTemplate.content, cssTemplate.content);

      // 初始化组件广播
      if (!Switch.channel) {
        Switch.channel = new BroadcastChannel("component:Switch");
      }
    }

    connectedCallback() {
      const track = this.shadowRoot.querySelector(".track");

      track.addEventListener("click", () => this.toggle());

      if (this.hasAttribute("state-sync")) {
        Switch.channel.addEventListener("message", (e) => {
          if (
            e.data.key === this.getAttribute("state-sync") &&
            this.#value !== e.data.value
          ) {
            this.#value = e.data.value;
            e.data.value
              ? this.setAttribute("checked", "")
              : this.removeAttribute("checked");

            this.dispatchEvent(
              new CustomEvent("change", { detail: { source: "state-sync" } }),
            );
          }
        });
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "checked" && oldValue !== newValue) {
        this.value = newValue !== null;
      }
    }

    get value() {
      return this.#value;
    }
    set value(value) {
      if (value === this.#value) return;

      this.#value = value;
      this.dispatchEvent(new Event("change"));
      value
        ? this.setAttribute("checked", "")
        : this.removeAttribute("checked");

      if (this.hasAttribute("state-sync")) {
        const key = this.getAttribute("state-sync");
        Switch.channel.postMessage({ key, value });
      }
    }

    get disabled() {
      return this.hasAttribute("disabled");
    }
    set disabled(val) {
      val
        ? this.setAttribute("disabled", "")
        : this.removeAttribute("disabled");
    }

    toggle() {
      if (!this.disabled) this.value = !this.value;
    }
  }

  class Message extends HTMLElement {
    static #instance = null;
    static observedAttributes = ["type"];

    constructor() {
      super();

      this.type = this.getAttribute("type");

      const htmlTemplate = document.createElement("template");
      htmlTemplate.innerHTML = `
        <div class="message-box">
          <mx-icon class="icon"></mx-icon>
          <span class="message"></span>
        </div>
      `;

      const cssTemplate = document.createElement("template");
      cssTemplate.innerHTML = `
        <style>
          ${Object.keys(colors)
            .map((type) => {
              return `
                :host([type='${type}']) {
                  --text-color: var(--${type}-color);
                  --bg-color: var(--${type}-color-light-7);
                  --border-color: var(--${type}-color-light-4);
                }
              `;
            })
            .join("\n")}
          
          .message-box {
            max-width: 300px;
            font-size: 14px;
            display: none;
            align-items: center;
            gap: 8px;
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translate(-50%, 20px);
            opacity: 0;
            background-color: var(--bg-color);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 100;
            
          }
          .message-box.show {
            transform: translate(-50%, 0);
            opacity: 1;
            transition: transform 0.3s ease, opacity 0.3s ease;
          }
          .message-box.hide {
            transform: translate(-50%, -20px);
            opacity: 0;
            transition: transform 0.6s ease, opacity 0.6s ease;
          }
        
        </style>
      `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.append(
        htmlTemplate.content,
        commonCssTemplate.content.cloneNode(true),
        cssTemplate.content,
      );

      this.box = this.shadowRoot.querySelector(".message-box");
      this.icon = this.shadowRoot.querySelector(".icon");
      this.message = this.shadowRoot.querySelector(".message");
    }

    connectedCallback() {
      this.box.addEventListener("transitionend", (e) => {
        if (this.box.classList.contains("hide")) {
          this.box.style.display = "none";
          this.box.classList.remove("hide");
        }
      });

      this.message.addEventListener("click", (e) => {
        navigator.clipboard.writeText(e.target.textContent);
      });
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      if (attrName === "type") {
        const map = {
          primary: "info",
          success: "success",
          info: "info",
          warning: "warning",
          danger: "close",
        };
        const iconType = map[newVal];
        this.icon.setAttribute("type", iconType);
      }
    }

    static get instance() {
      if (!this.#instance) {
        const el = document.createElement(getComponentName(this));
        document.documentElement.appendChild(el);
        this.#instance = el;
      }
      return this.#instance;
    }

    #show(message, type = "info", duration) {
      const calcDuration = (message) => {
        // 最小 2 秒, 最大 5 秒, 基础 0.5 秒, 每个字符 50 ms
        const [min, max, base, perChar] = [2000, 5000, 500, 50];
        const lengthTime = message.length * perChar;

        return Math.min(max, Math.max(min, base + lengthTime));
      };

      this.setAttribute("type", type);
      this.message.textContent = message; // 设置信息
      this.message.title = message;

      this.box.style.display = "flex";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.box.classList.add("show");
        });
      });

      clearTimeout(this._hideTimer);
      this._hideTimer = setTimeout(
        () => {
          this.box.classList.remove("show");
          this.box.classList.add("hide");
        },
        duration || calcDuration(message),
      );
    }

    primary(message, duration) {
      this.#show(message, "primary", duration);
    }
    info(message, duration) {
      this.#show(message, "info", duration);
    }
    success(message, duration) {
      this.#show(message, "success", duration);
    }
    error(message, duration) {
      this.#show(message, "danger", duration);
    }
    warning(message, duration) {
      this.#show(message, "warning", duration);
    }
  }

  class Dialog extends HTMLElement {
    visible = false;
    #confirmBtn = null;
    #cancelBtn = null;
    #closeBtn = null;

    static get observedAttributes() {
      return ["cancel-text", "confirm-text"];
    }

    constructor() {
      super();

      const htmlTemplate = document.createElement("template");
      htmlTemplate.innerHTML = `
        <main>
          <header>
            <slot name="header"></slot>
            
            <button class="close">✕</button>
          </header>
          
          <article>
            <slot></slot>
          </article>
          
          <footer>
            <slot name="footer">
              <slot name="button-before"></slot>
              <mx-button class="cancel">取消</mx-button>
              <slot name="button-center"></slot>
              <mx-button class="confirm" type="primary">确认</mx-button>
              <slot name="button-after"></slot>
            </slot>
          </footer>
        </main>
        
        <div class="mask"></div>
      `;

      const cssTemplate = document.createElement("template");
      cssTemplate.innerHTML = `
        <style>
          :host {
            display: none;
          }
          
          main {
            min-width: 500px;
            padding: 16px;
            position: fixed;
            left: 50%;
            top: calc(20vh);
            transform: translateX(-50%);
            z-index: 3001;
            border-radius: 4px;
            background-color: var(--bg-color);
            color: var(--text-color);
            box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, .04), 0px 8px 20px rgba(0, 0, 0, .08);
          }
          
          header {
            padding-bottom: 16px;
            font-size: 18px;
          }
          
          article {
            min-width: 500px;
          }
          
          footer {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            padding-top: 16px;
          }
        
          .close {
            font-size: 16px;
            aspect-ratio: 1/1;
            padding: 0;
            position: fixed;
            top: 16px;
            right: 16px;
            background-color: inherit;
            border: 0;
          }
          .close:hover {
            color: #F56C6C;
          }
          
          .mask {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 3000;
            background: rgba(0, 0, 0, 0.5);
          }
        </style>
      `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.append(
        htmlTemplate.content,
        commonCssTemplate.content.cloneNode(true),
        cssTemplate.content,
      );
      this.#confirmBtn = this.shadowRoot.querySelector(".confirm");
      this.#cancelBtn = this.shadowRoot.querySelector(".cancel");
      this.#closeBtn = this.shadowRoot.querySelector(".close");
    }

    connectedCallback() {
      // 按钮文字
      {
        const cancelText = this.getAttribute("cancel-text") || "取消";
        const confirmText = this.getAttribute("confirm-text") || "确认";
        this.#cancelBtn.textContent = cancelText;
        this.#confirmBtn.textContent = confirmText;
      }

      // 事件初始化
      {
        // 提交按钮
        this.#confirmBtn?.addEventListener("click", (e) => {
          this.visible = false;
          this.style.display = "none";
          this.dispatchEvent(new CustomEvent("confirm"));
        });

        const cancel = () => {
          this.visible = false;
          this.style.display = "none";
          this.dispatchEvent(new CustomEvent("cancel"));
        };

        // 关闭按钮
        this.#cancelBtn?.addEventListener("click", cancel);
        this.#closeBtn?.addEventListener("click", cancel);

        // ESC 键盘事件
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && this.visible) {
            cancel();
          }
        });
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "visible" && oldValue !== newValue) {
        this.style.display = newValue !== null ? "block" : "none";
      }
    }

    open() {
      this.visible = true;
      this.style.display = "block";
      this.dispatchEvent(new CustomEvent("open"));
    }
  }

  class Icon extends HTMLElement {
    #paths = {
      info: "M512 64a448 448 0 1 1 0 896.064A448 448 0 0 1 512 64m67.2 275.072c33.28 0 60.288-23.104 60.288-57.344s-27.072-57.344-60.288-57.344c-33.28 0-60.16 23.104-60.16 57.344s26.88 57.344 60.16 57.344M590.912 699.2c0-6.848 2.368-24.64 1.024-34.752l-52.608 60.544c-10.88 11.456-24.512 19.392-30.912 17.28a12.992 12.992 0 0 1-8.256-14.72l87.68-276.992c7.168-35.136-12.544-67.2-54.336-71.296-44.096 0-108.992 44.736-148.48 101.504 0 6.784-1.28 23.68.064 33.792l52.544-60.608c10.88-11.328 23.552-19.328 29.952-17.152a12.8 12.8 0 0 1 7.808 16.128L388.48 728.576c-10.048 32.256 8.96 63.872 55.04 71.04 67.84 0 107.904-43.648 147.456-100.416z",
      success:
        "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z",
      warning:
        "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 192a58.432 58.432 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.432 58.432 0 0 0 512 256m0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4",
      close:
        "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336z",
      closeBold:
        "M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z",
      setting:
        "M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384m0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256",
      search:
        "m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704",
      refresh:
        "M771.776 794.88A384 384 0 0 1 128 512h64a320 320 0 0 0 555.712 216.448H654.72a32 32 0 1 1 0-64h149.056a32 32 0 0 1 32 32v148.928a32 32 0 1 1-64 0v-50.56zM276.288 295.616h92.992a32 32 0 0 1 0 64H220.16a32 32 0 0 1-32-32V178.56a32 32 0 0 1 64 0v50.56A384 384 0 0 1 896.128 512h-64a320 320 0 0 0-555.776-216.384z",
    };

    static observedAttributes = ["type"];

    constructor() {
      super();

      const htmlTemplate = document.createElement("template");
      htmlTemplate.innerHTML = `<svg viewBox="0 0 1024 1024"><path d=""></path></svg>`;

      const cssTemplate = document.createElement("template");
      cssTemplate.innerHTML = `
        <style>
          :host {
            display: inline-block;
            width: 1em;
            height: 1em;
            color: currentColor;
          }
          svg {
            width: 100%;
            height: 100%;
            fill: currentColor;
          }
        </style>
      `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.append(
        htmlTemplate.content,
        commonCssTemplate.content.cloneNode(true),
        cssTemplate.content,
      );

      this.path = this.shadowRoot.querySelector("path");
    }

    connectedCallback() {}

    attributeChangedCallback(attributeName, oldValue, newValue) {
      if (attributeName === "type") {
        this.toggle();
      }
    }

    toggle() {
      if (this.hasAttribute("type")) {
        this.type = this.getAttribute("type");

        if (this.type in this.#paths) {
          this.path.setAttribute("d", this.#paths[this.type]);
        } else {
          console.warn("出现未知的 icon 类型", this);
        }
      }
    }
  }

  class Badge extends HTMLElement {
    constructor() {
      super();

      const htmlTemplate = document.createElement("template");
      htmlTemplate.innerHTML = `<slot></slot><sup></sup>`;

      const cssTemplate = document.createElement("template");
      cssTemplate.innerHTML = `
        <style>
          :host {
            position: relative;
          }
          sup {
            position: absolute;
            top: 0;
            right: 0;
            transform: translate(50%, -50%);
            background-color: #f56c6c;
            border-radius: 10px;
            padding: 0 4px;
            color: #FFFFFF;
          }
        </style>
      `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.append(htmlTemplate.content, cssTemplate.content);
      this.sup = this.shadowRoot.querySelector("sup");
    }

    set value(val) {
      this.sup.textContent = val;
    }
    get value() {
      return this.sup.textContent;
    }
  }

  // todo
  class MessageBox {}

  // 虚拟滚动
  class VirtualList extends HTMLElement {
    static get observedAttributes() {
      return ["columns", "gap"];
    }
    readyResolve = null;
    readyPromise = new Promise((resolve) => (this.readyResolve = resolve));
    itemElements = []; // 存放当前可见的 item 元素引用

    #items = [];
    #columns = 1; // 默认一列
    #gap = 0;
    #width = null;
    #height = null;
    #rowHeight = null;
    #rowWidth = null;

    constructor() {
      super();

      const htmlTemplate = document.createElement("template");
      htmlTemplate.innerHTML = `
        <div class="holder"></div>
        <div class="grid"></div>
      `;
      const cssTemplate = document.createElement("template");
      cssTemplate.innerHTML = `
        <style>
          :host {
            width: 100%;
            display: block;
            max-height: 500px;
            position: relative;
            overflow-y: scroll;
          }
          .grid {
            width: 100%;
            display: grid;
            position: absolute;
            top: 0;
            left: 0;
          }
          .grid-item {
            display: flex;
            align-items: center;
            box-sizing: border-box;
          }
          .grid-item * {
            white-space: nowrap;      /* 不换行 */
            overflow: hidden;         /* 隐藏溢出 */
            text-overflow: ellipsis;  /* 末尾加省略号 */
          }
        </style>
      `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.append(
        htmlTemplate.content,
        commonCssTemplate.content.cloneNode(true),
        cssTemplate.content,
      );

      this.itemTemplate = this.querySelector('template[slot="item"]');
      this.grid = this.shadowRoot.querySelector(".grid");
      this.holder = this.shadowRoot.querySelector(".holder");

      ["columns", "gap"].forEach((attr) => {
        if (!this.hasAttribute(attr)) {
          this.setAttribute(attr, String(this[attr]));
        }
      });

      const ro = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          console.log(entry);
          const { width, height } = entry.contentRect;
          [this.#width, this.#height] = [width, height];

          if (width && height && this.readyResolve) {
            this.readyResolve("初始化成功");
            this.readyResolve = null;
          }
        });
      });

      ro.observe(this);

      this.addEventListener("scroll", () => {
        this.updateVisibleItems();
      });
    }

    connectedCallback() {
      this.readyPromise.then(() => {
        this.dispatchEvent(new Event("ready"));
      });
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (
        ["columns", "gap"].includes(name) &&
        oldValue !== newValue &&
        this[name] !== newValue
      ) {
        this[name] = Number(newValue);
      }
    }

    get items() {
      return this.#items;
    }
    set items(val) {
      this.#items = val;

      const totalRows = Math.ceil(this.items.length / this.columns);
      const contentHeight =
        this.rowHeight * totalRows + this.gap * (totalRows - 1);
      this.holder.style.height = contentHeight + "px";
      this.readyPromise.then(() => this.render());
    }
    get columns() {
      return this.#columns;
    }
    set columns(newValue) {
      if (this.#columns !== Number(newValue)) {
        this.#columns = Number(newValue);
        this.readyPromise.then(() => this.render());
      }
    }
    get gap() {
      return this.#gap;
    }
    set gap(newValue) {
      if (this.#gap !== Number(newValue)) {
        this.#gap = Number(newValue);
        this.readyPromise.then(() => this.render());
      }
    }
    get rowHeight() {
      if (this.#rowHeight) {
        return this.#rowHeight;
      } else if (this.#items.length) {
        // 动态创建 -> 获得行高 -> 动态移除
        const li = this.createItem();
        li.setData(this.#items[0]);
        this.shadowRoot.appendChild(li);
        this.#rowHeight = li.getBoundingClientRect().height;

        li.remove();
        return this.#rowHeight;
      } else {
        return 0;
      }
    }

    render() {
      // 清空旧元素
      this.itemElements.forEach((element) => {
        element.remove();
      });
      this.itemElements = [];

      // 根据数据数量，设置最大滚动条高度
      const totalRows = Math.ceil(this.items.length / this.columns);
      const contentHeight =
        this.rowHeight * totalRows + this.gap * (totalRows - 1);
      this.holder.style.height = contentHeight + "px";
      // 计算项目宽度
      this.#rowWidth =
        this.columns === 1
          ? "100%"
          : (this.#width - (this.columns - 1) * this.gap) / this.columns + "px";

      // 项目数量
      const rows = Math.ceil(this.#height / (this.rowHeight + this.gap) + 1);
      const total = Math.min(this.columns * rows, this.items.length);
      this.grid.style.gridTemplateColumns = `repeat(${this.columns}, minmax(auto, 1fr))`;
      this.grid.style.gap = this.gap + "px";

      for (let i = 0; i < total; i++) {
        const li = this.createItem();
        this.grid.append(li);
        this.itemElements.push(li);
      }

      // 首次填充数据
      this.updateVisibleItems();
    }
    createItem() {
      const div = document.createElement("div");
      div.classList.add("grid-item");
      div.setAttribute("part", "item");
      div.appendChild(this.itemTemplate.content.cloneNode(true));
      div.setData = (data) => {
        for (let key in data) {
          const el = div.querySelector(`[data-field='${key}']`);
          if (el) el.textContent = data[key];
        }
      };

      return div;
    }
    updateVisibleItems() {
      const scrollTop = this.scrollTop;
      const itemTotalHeight = this.rowHeight + this.gap;
      const firstRow = Math.floor(scrollTop / itemTotalHeight);
      const startIndex = firstRow * this.columns;

      this.grid.style.transform = `translateY(${firstRow * itemTotalHeight}px)`;

      this.itemElements.forEach((element, idx) => {
        const dataIndex = startIndex + idx;
        element.setAttribute("data-item-index", dataIndex);

        if (dataIndex < this.items.length) {
          element.setData(this.items[dataIndex]);
        } else {
          element.style.setProperty("display", "none", "important"); // 超出数据范围的隐藏
        }
      });
    }
  }

  class ConcurrencyManager {
    #activeCount = 0;
    #queue = [];
    #max;

    constructor(max = 5) {
      this.#max = max;
    }

    enqueue(fn) {
      return new Promise((resolve, reject) => {
        this.#queue.push({ fn, resolve, reject });
        this.#next();
      });
    }

    setConcurrency(n) {
      this.#max = n;
      this.#next();
    }

    #next() {
      if (this.#activeCount >= this.#max) return;
      const job = this.#queue.shift();
      if (!job) return;

      this.#activeCount++;
      job
        .fn()
        .then(job.resolve, job.reject)
        .finally(() => {
          this.#activeCount--;
          this.#next();
        });
    }
  }

  // 单选框
  class Radio extends HTMLElement {
    static observedAttributes = ["value", "label", "disabled"];
    value = "";
    label = "";
    #disabled = false;
    input = null;
    span = null;

    constructor() {
      super();
      const htmlTemplate = document.createElement("template");
      htmlTemplate.innerHTML = `
      <label>
        <input type="radio"/>
        <span></span>
      </label>`;

      const cssTemplate = document.createElement("template");
      cssTemplate.innerHTML = `
        <style>
          :host(.disabled) label,
          :host([disabled]) label {
            cursor: not-allowed;
            color: #a8abb2;
          }
          label {
            cursor: pointer;
          }
          input {
            accent-color: var(--primary-color);
          }
        </style>
      `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.append(
        htmlTemplate.content,
        commonCssTemplate.content.cloneNode(true),
        cssTemplate.content,
      );
      this.input = this.shadowRoot.querySelector("input");
      this.span = this.shadowRoot.querySelector("span");
    }

    connectedCallback() {
      this.input.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("radio-select", {
            bubbles: true,
            composed: true,
          }),
        );
      });
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (name === "value") {
        this.value = this.input.value = newVal ?? "";
      } else if (name === "label") {
        this.label = this.span.textContent = newVal ?? "";
      } else if (name === "disabled") {
        this.input.disabled = newVal !== null;
      }
    }

    get checked() {
      return this.input.checked;
    }
    set checked(value) {
      this.input.checked = value;
    }

    get disabled() {
      return this.#disabled;
    }
    set disabled(value) {
      this.#disabled = value;
      this.input.disabled = value;
      value
        ? this.classList.add("disabled")
        : this.classList.remove("disabled");
    }
  }

  class RadioGroup extends HTMLElement {
    static observedAttributes = ["value", "disabled"];
    static channel = null;

    #rawValue = ""; // 原始值
    #value = ""; // 显示值
    #options = [];

    constructor() {
      super();

      const htmlTemplate = document.createElement("template");
      htmlTemplate.innerHTML = `<slot></slot>`;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.append(htmlTemplate.content);

      // 初始化组件广播
      if (!RadioGroup.channel) {
        RadioGroup.channel = new BroadcastChannel("component:RadioGroup");
      }
    }

    connectedCallback() {
      this.dispatchEvent(new Event("ready"));

      this.addEventListener("radio-select", (e) => {
        this.value = e.target.value;
      });

      if (this.hasAttribute("state-sync")) {
        RadioGroup.channel.addEventListener("message", (e) => {
          if (
            e.data.key === this.getAttribute("state-sync") &&
            this.#rawValue !== e.data.value
          ) {
            this.#rawValue = e.data.value;
            this.update();
            this.dispatchEvent(new Event("state-sync"));
          }
        });
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "value") {
        this.value = newValue;
      } else if (name === "disabled") {
        for (let node of this.children) {
          node.disabled = newValue !== null || node.hasAttribute("disabled");
        }
      }
    }

    get value() {
      return this.#value;
    }
    set value(value) {
      if (value === this.#rawValue) return;

      this.#rawValue = value;
      this.update();
      this.dispatchEvent(new Event("change"));

      if (this.hasAttribute("state-sync")) {
        const key = this.getAttribute("state-sync");
        RadioGroup.channel.postMessage({ key, value });
      }
    }
    get options() {
      return this.#options;
    }
    set options(value) {
      this.#options = value;

      this.render();
      this.update();
    }

    render() {
      this.innerHTML = "";

      for (let option of this.#options) {
        const { label, value } = option;
        const node = document.createElement("mx-radio");
        node.disabled =
          this.hasAttribute("disabled") || node.hasAttribute("disabled");

        node.setAttribute("label", label);
        node.setAttribute("value", value);

        this.append(node);
      }
    }
    update() {
      this.#value = "";

      for (let node of this.children) {
        if (node.value === String(this.#rawValue)) {
          node.checked = true;
          this.#value = node.value;
          this.setAttribute("value", node.value);
        } else {
          node.checked = false;
        }
      }
    }
  }

  // 单选框
  function rafThrottle(fn) {
    let ticking = false;

    return function (...args) {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          fn.apply(this, args);
          ticking = false;
        });
      }
    };
  }

  const getComponentName = (component) =>
    `mx-${component.name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}`;
  // 注册组件
  [
    Input,
    Select,
    Button,
    SelectOption,
    Switch,
    Message,
    Dialog,
    Icon,
    Badge,
    VirtualList,
    Radio,
    RadioGroup,
  ].forEach((n) => {
    const name = getComponentName(n);

    if (!customElements.get(name)) {
      customElements.define(name, n);
    } else {
      console.error(`${name} 组件已注册`);
    }
  });

  Object.assign(window, {
    MxMessage: Message.instance,
    MxMgr: new ConcurrencyManager(),
    MxRafThrottle: rafThrottle,
  });
})();

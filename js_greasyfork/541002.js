// ==UserScript==
// @name         Notion 风格的 ChatGPT、Gemini 导航目录
// @namespace    https://github.com/YuJian920
// @version      2.3.0
// @description  Adds a floating navigation menu to quickly jump between prompts on ChatGPT, Gemini, and other chat platforms.
// @author       YuJian
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @match        https://claude.ai/chat/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541002/Notion%20%E9%A3%8E%E6%A0%BC%E7%9A%84%20ChatGPT%E3%80%81Gemini%20%E5%AF%BC%E8%88%AA%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/541002/Notion%20%E9%A3%8E%E6%A0%BC%E7%9A%84%20ChatGPT%E3%80%81Gemini%20%E5%AF%BC%E8%88%AA%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const PLATFORMS = [
    {
      name: "ChatGPT",
      hosts: ["chat.openai.com", "chatgpt.com"],
      messageSelector: ".user-message-bubble-color",
    },
    {
      name: "Gemini",
      hosts: ["gemini.google.com"],
      messageSelector: ".user-query-bubble-with-background",
    },
    {
      name: "Claude",
      hosts: ["claude.ai"],
      messageSelector: ".bg-bg-300",
    }
  ];

  class PromptNavigator {
    CONSTANTS = {
      CONTAINER_ID: "prompt-nav-container",
      INDICATOR_ID: "prompt-nav-indicator",
      MENU_ID: "prompt-nav-menu",
      INDICATOR_LINE_CLASS: "nav-indicator-line",
      JIGGLE_EFFECT_CLASS: "prompt-nav-jiggle-effect",
      ACTIVE_CLASS: "active",
      MESSAGE_ID_PREFIX: "prompt-nav-item-",
      SCROLL_OFFSET: 30,
      JIGGLE_ANIMATION_DURATION: 400,
      SCROLL_END_TIMEOUT: 150,
      DEBOUNCE_BUILD_MS: 500,
      THROTTLE_UPDATE_MS: 100,
      INIT_DELAY_MS: 2000,
    };

    #platform = null;
    #scrollParent = null;
    #debouncedBuildNav = null;
    #throttledUpdateActiveLink = null;
    #idToElementMap = new Map();

    constructor() {
      this.#platform = this.#detectPlatform();
      if (!this.#platform) return;

      this.#debouncedBuildNav = this.#debounce(this.buildNav.bind(this), this.CONSTANTS.DEBOUNCE_BUILD_MS);
      this.#throttledUpdateActiveLink = this.#throttle(this.updateActiveLink.bind(this), this.CONSTANTS.THROTTLE_UPDATE_MS);
    }

    init() {
      if (!this.#platform) {
        console.log("Prompt Navigator: No supported platform detected.");
        return;
      }

      setTimeout(() => {
        this.#addStyles();
        this.#setupObservers();
        this.#setupEventListeners();
        this.buildNav();
      }, this.CONSTANTS.INIT_DELAY_MS);
    }

    buildNav() {
      const messages = document.querySelectorAll(this.#platform.messageSelector);

      if (messages.length === this.#idToElementMap.size && messages.length > 0) {
        let allMatch = true;
        let i = 0;
        for (const mappedElement of this.#idToElementMap.values()) {
          if (mappedElement !== messages[i]) {
            allMatch = false;
            break;
          }
          i++;
        }
        if (allMatch) {
          return;
        }
      }

      this.#scrollParent = null;
      this.#idToElementMap.clear();

      const navItems = [];
      messages.forEach((msg, index) => {
        const messageId = `${this.CONSTANTS.MESSAGE_ID_PREFIX}${index}`;
        this.#idToElementMap.set(messageId, msg);

        const trimmedText = msg.textContent.trim();
        const text = trimmedText ? `${trimmedText.substring(0, 50)}...` : `Item ${index + 1}`;
        navItems.push({ id: messageId, text: text });
      });

      const existingContainer = document.getElementById(this.CONSTANTS.CONTAINER_ID);
      if (existingContainer) {
        existingContainer.remove();
      }

      if (navItems.length === 0) return;

      const container = this.#createContainer();
      const indicator = this.#createIndicator(navItems);
      const menu = this.#createMenu(navItems);

      container.append(menu, indicator);
      document.body.appendChild(container);

      this.updateActiveLink();
    }

    updateActiveLink() {
      let lastVisibleMessageId = null;
      const highlightThreshold = window.innerHeight * 0.4;

      for (const [id, msg] of this.#idToElementMap.entries()) {
        if (!document.body.contains(msg)) {
          continue;
        }
        if (msg.getBoundingClientRect().top < highlightThreshold) {
          lastVisibleMessageId = id;
        } else {
          break;
        }
      }

      const links = document.querySelectorAll(`#${this.CONSTANTS.MENU_ID} li a`);
      const indicatorLines = document.querySelectorAll(`.${this.CONSTANTS.INDICATOR_LINE_CLASS}`);
      let hasActive = false;

      links.forEach((link, index) => {
        const isActive = link.dataset.targetId === lastVisibleMessageId;
        link.classList.toggle(this.CONSTANTS.ACTIVE_CLASS, isActive);
        indicatorLines[index]?.classList.toggle(this.CONSTANTS.ACTIVE_CLASS, isActive);
        if (isActive) hasActive = true;
      });

      if (!hasActive && links.length > 0) {
        links[0].classList.add(this.CONSTANTS.ACTIVE_CLASS);
        indicatorLines[0]?.classList.add(this.CONSTANTS.ACTIVE_CLASS);
      }
      this.#syncIndicatorScroll();
    }

    #createContainer() {
      const container = document.createElement("div");
      container.id = this.CONSTANTS.CONTAINER_ID;
      return container;
    }

    #createIndicator(navItems) {
      const indicator = document.createElement("div");
      indicator.id = this.CONSTANTS.INDICATOR_ID;
      const lineWrapper = document.createElement("div");
      lineWrapper.id = "prompt-nav-indicator-wrapper";

      navItems.forEach((item) => {
        const line = document.createElement("div");
        line.className = this.CONSTANTS.INDICATOR_LINE_CLASS;
        line.dataset.targetId = item.id;
        lineWrapper.appendChild(line);
      });
      indicator.appendChild(lineWrapper);
      return indicator;
    }

    #createMenu(navItems) {
      const menu = document.createElement("div");
      menu.id = this.CONSTANTS.MENU_ID;
      const list = document.createElement("ul");

      navItems.forEach((item) => {
        const link = document.createElement("a");
        link.href = `#${item.id}`;
        link.textContent = item.text;
        link.dataset.targetId = item.id;
        link.onclick = (e) => this.#handleLinkClick(e);

        const listItem = document.createElement("li");
        listItem.appendChild(link);
        list.appendChild(listItem);
      });

      menu.appendChild(list);
      return menu;
    }

    #handleLinkClick(event) {
      event.preventDefault();
      const link = event.currentTarget;
      const targetId = link.dataset.targetId;
      const messageElement = this.#idToElementMap.get(targetId);

      if (!messageElement || !document.body.contains(messageElement)) {
        console.error("Prompt Navigator: Target message element not found or detached:", targetId);
        return;
      }

      document
        .querySelectorAll(`#${this.CONSTANTS.MENU_ID} li a, .${this.CONSTANTS.INDICATOR_LINE_CLASS}`)
        .forEach((el) => el.classList.remove(this.CONSTANTS.ACTIVE_CLASS));

      link.classList.add(this.CONSTANTS.ACTIVE_CLASS);
      const indicatorLine = document.querySelector(`.${this.CONSTANTS.INDICATOR_LINE_CLASS}[data-target-id="${targetId}"]`);
      indicatorLine?.classList.add(this.CONSTANTS.ACTIVE_CLASS);

      this.#scrollToMessage(messageElement);
      this.#syncIndicatorScroll();
    }

    #scrollToMessage(messageElement) {
      const scrollParent = this.#scrollParent || this.#findScrollableParent(messageElement);
      if (!this.#scrollParent) this.#scrollParent = scrollParent;

      let scrollTimeout;
      const scrollEndListener = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          messageElement.classList.add(this.CONSTANTS.JIGGLE_EFFECT_CLASS);
          setTimeout(() => messageElement.classList.remove(this.CONSTANTS.JIGGLE_EFFECT_CLASS), this.CONSTANTS.JIGGLE_ANIMATION_DURATION);
          scrollParent.removeEventListener("scroll", scrollEndListener);
        }, this.CONSTANTS.SCROLL_END_TIMEOUT);
      };
      scrollParent.addEventListener("scroll", scrollEndListener);

      const parentTop = scrollParent === document.documentElement ? 0 : scrollParent.getBoundingClientRect().top;
      const msgTop = messageElement.getBoundingClientRect().top;
      const scrollTop = scrollParent.scrollTop + msgTop - parentTop - this.CONSTANTS.SCROLL_OFFSET;

      scrollParent.scrollTo({ top: scrollTop, behavior: "smooth" });
    }

    #updateTheme() {
      const isDarkMode = document.documentElement.classList.contains("dark");

      const container = document.getElementById(this.CONSTANTS.CONTAINER_ID);
      if (container) {
        container.dataset.theme = isDarkMode ? "dark" : "light";
      }
    }

    #syncIndicatorScroll() {
      const indicator = document.getElementById(this.CONSTANTS.INDICATOR_ID);
      const lineWrapper = document.getElementById("prompt-nav-indicator-wrapper");
      const activeLine = indicator?.querySelector(`.${this.CONSTANTS.INDICATOR_LINE_CLASS}.${this.CONSTANTS.ACTIVE_CLASS}`);

      if (!indicator || !lineWrapper || !activeLine) {
        return;
      }

      const indicatorHeight = indicator.clientHeight;
      const wrapperHeight = lineWrapper.scrollHeight;

      if (wrapperHeight <= indicatorHeight) {
        lineWrapper.style.transform = `translateY(0px)`;
        return;
      }

      const activeLineTop = activeLine.offsetTop;
      const activeLineHeight = activeLine.offsetHeight;

      let desiredTranslateY = -(activeLineTop - indicatorHeight / 2 + activeLineHeight / 2);

      desiredTranslateY = Math.min(0, desiredTranslateY);

      const maxScroll = wrapperHeight - indicatorHeight;
      desiredTranslateY = Math.max(-maxScroll, desiredTranslateY);

      lineWrapper.style.transform = `translateY(${desiredTranslateY}px)`;
    }

    #detectPlatform() {
      const currentHost = window.location.host;
      return PLATFORMS.find((p) => p.hosts.some((h) => currentHost.includes(h)));
    }

    #setupObservers() {
      const observer = new MutationObserver(() => {
        this.#debouncedBuildNav();
        this.#updateTheme();
      });
      observer.observe(document.body, { childList: true, subtree: true });

      const themeObserver = new MutationObserver(() => this.#updateTheme());
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    }

    #setupEventListeners() {
      window.addEventListener("scroll", this.#throttledUpdateActiveLink, {
        capture: true,
      });
    }

    #addStyles() {
      const style = document.createElement("style");
      style.textContent = `
        :root {
          --nav-bg-color-light: #F7F7F7;
          --nav-text-color-light: #333333;
          --nav-text-subtle-light: #555555;
          --nav-border-color-light: #E0E0E0;
          --nav-hover-bg-color-light: #E9E9E9;
          --nav-active-bg-color-light: #DCDCDC;
          --nav-scrollbar-thumb-light: #CCCCCC;
          --nav-scrollbar-thumb-hover-light: #BBBBBB;
          --nav-indicator-line-light: rgba(0, 0, 0, 0.3);
          --nav-indicator-active-color-light: #000000;

          --nav-bg-color-dark: #2A2A2A;
          --nav-text-color-dark: #EAEAEA;
          --nav-text-subtle-dark: #C0C0C0;
          --nav-border-color-dark: rgba(255, 255, 255, 0.1);
          --nav-hover-bg-color-dark: rgba(255, 255, 255, 0.1);
          --nav-active-bg-color-dark: rgba(255, 255, 255, 0.15);
          --nav-scrollbar-thumb-dark: rgba(255, 255, 255, 0.2);
          --nav-scrollbar-thumb-hover-dark: rgba(255, 255, 255, 0.3);
          --nav-indicator-line-dark: rgba(255, 255, 255, 0.4);
          --nav-indicator-active-color-dark: #D3D3D3;
        }

        #${this.CONSTANTS.CONTAINER_ID}[data-theme='light'] {
          --nav-bg-color: var(--nav-bg-color-light);
          --nav-text-color: var(--nav-text-color-light);
          --nav-text-subtle: var(--nav-text-subtle-light);
          --nav-border-color: var(--nav-border-color-light);
          --nav-hover-bg-color: var(--nav-hover-bg-color-light);
          --nav-active-bg-color: var(--nav-active-bg-color-light);
          --nav-scrollbar-thumb: var(--nav-scrollbar-thumb-light);
          --nav-scrollbar-thumb-hover: var(--nav-scrollbar-thumb-hover-light);
          --nav-indicator-line: var(--nav-indicator-line-light);
          --nav-indicator-active-color: var(--nav-indicator-active-color-light);
          --nav-indicator-active-shadow: var(--nav-indicator-active-color-light);
        }

        #${this.CONSTANTS.CONTAINER_ID}[data-theme='dark'] {
          --nav-bg-color: var(--nav-bg-color-dark);
          --nav-text-color: var(--nav-text-color-dark);
          --nav-text-subtle: var(--nav-text-subtle-dark);
          --nav-border-color: var(--nav-border-color-dark);
          --nav-hover-bg-color: var(--nav-hover-bg-color-dark);
          --nav-active-bg-color: var(--nav-active-bg-color-dark);
          --nav-scrollbar-thumb: var(--nav-scrollbar-thumb-dark);
          --nav-scrollbar-thumb-hover: var(--nav-scrollbar-thumb-hover-dark);
          --nav-indicator-line: var(--nav-indicator-line-dark);
          --nav-indicator-active-color: var(--nav-indicator-active-color-dark);
          --nav-indicator-active-shadow: var(--nav-indicator-active-color-dark);
        }

        @keyframes prompt-nav-jiggle {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        .${this.CONSTANTS.JIGGLE_EFFECT_CLASS} {
          animation: prompt-nav-jiggle ${this.CONSTANTS.JIGGLE_ANIMATION_DURATION / 1000}s ease-in-out;
        }
        #${this.CONSTANTS.CONTAINER_ID} {
          position: fixed;
          top: 12rem;
          right: 1.5rem;
          z-index: 9999;
        }
        #${this.CONSTANTS.INDICATOR_ID} {
          position: absolute;
          top: 0;
          right: 0;
          cursor: pointer;
          transition: opacity 0.25s ease-in-out;
          max-height: calc(100vh - 13.25rem);
          overflow: hidden;
        }
        #prompt-nav-indicator-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1rem;
          transition: transform 0.2s ease-in-out;
        }
        .${this.CONSTANTS.INDICATOR_LINE_CLASS} {
          width: 1.25rem;
          height: 2px;
          background-color: var(--nav-indicator-line);
          border-radius: 0.125rem;
          transition: all 0.25s ease-in-out;
        }
        .${this.CONSTANTS.INDICATOR_LINE_CLASS}.${this.CONSTANTS.ACTIVE_CLASS} {
          width: 1.75rem;
          background-color: var(--nav-indicator-active-color);
          height: 2px;
          transition: background 0.2s, box-shadow 0.2s, width 0.2s;
          box-shadow: var(--nav-indicator-active-shadow) 0px 0px 3px;
          border-radius: 0.125rem;
          margin-left: 0px;
        }
        #${this.CONSTANTS.MENU_ID} {
          position: absolute;
          top: 0;
          right: 0;
          transform: translateX(1rem);
          width: 17.5rem;
          max-height: calc(100vh - 13.25rem);
          overflow-y: auto;
          background-color: var(--nav-bg-color);
          border: 1px solid var(--nav-border-color);
          color: var(--nav-text-color);
          border-radius: 0.75rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          padding: 0.75rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.25s ease, visibility 0.25s ease, transform 0.25s ease;
        }
        #${this.CONSTANTS.CONTAINER_ID}:hover #${this.CONSTANTS.INDICATOR_ID} {
          opacity: 0;
        }
        #${this.CONSTANTS.CONTAINER_ID}:hover #${this.CONSTANTS.MENU_ID} {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }
        #${this.CONSTANTS.MENU_ID} ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        #${this.CONSTANTS.MENU_ID} li a {
          display: block;
          padding: 0.5rem;
          text-decoration: none;
          color: var(--nav-text-subtle);
          border-radius: 0.375rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.875rem;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        #${this.CONSTANTS.MENU_ID} li a:hover {
          background-color: var(--nav-hover-bg-color);
          color: var(--nav-text-color);
        }
        #${this.CONSTANTS.MENU_ID} li a.${this.CONSTANTS.ACTIVE_CLASS} {
          background-color: var(--nav-active-bg-color);
          color: var(--nav-text-color);
          font-weight: 500;
        }
        #${this.CONSTANTS.MENU_ID}::-webkit-scrollbar { width: 0.5rem; }
        #${this.CONSTANTS.MENU_ID}::-webkit-scrollbar-track { background: transparent; }
        #${this.CONSTANTS.MENU_ID}::-webkit-scrollbar-thumb { background-color: var(--nav-scrollbar-thumb); border-radius: 0.25rem; }
        #${this.CONSTANTS.MENU_ID}::-webkit-scrollbar-thumb:hover { background-color: var(--nav-scrollbar-thumb-hover); }
      `;
      document.head.appendChild(style);
    }

    #findScrollableParent(element) {
      let el = element.parentElement;
      while (el && el !== document.body) {
        const style = window.getComputedStyle(el);
        if (style.overflowY === "auto" || style.overflowY === "scroll") {
          return el;
        }
        el = el.parentElement;
      }
      return document.documentElement;
    }

    #debounce(func, wait) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    }

    #throttle(func, limit) {
      let inThrottle;
      return (...args) => {
        if (!inThrottle) {
          func(...args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    }
  }

  new PromptNavigator().init();
})();
// ==UserScript==
// @name         谷歌搜图助手
// @version      1.2.0
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  在谷歌图片搜索中添加悬浮工具栏，一键切换站内搜索(site语法)，支持自定义分组、拖拽排序与云同步。
// @match        https://www.google.com/search?*site%3A*
// @match        https://www.google.com/search?*site:*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      GPL-3.0
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.github.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539724/%E8%B0%B7%E6%AD%8C%E6%90%9C%E5%9B%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/539724/%E8%B0%B7%E6%AD%8C%E6%90%9C%E5%9B%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

!function() {
  "use strict";
  const CONFIG = {
    DEBUG_MODE: !0,
    STORAGE: {
      GM_GITHUB_TOKEN_KEY: "googleSearchMultiSite_github_token",
      GM_GIST_ID_KEY: "googleSearchMultiSite_gist_id",
      LOCALSTORAGE_SITES_KEY: "customSiteRowsText",
      LOCALSTORAGE_NAVBAR_POSITION_KEY: "navBarPosition",
      LOCALSTORAGE_TEXTAREA_WIDTH_KEY: "googleSearchMultiSite_siteConfigTextareaWidth",
      LOCALSTORAGE_TEXTAREA_HEIGHT_KEY: "googleSearchMultiSite_siteConfigTextareaHeight",
      LAST_BACKUP_DATE_KEY: "googleSearchMultiSite_lastBackupDate"
    },
    GIST: {
      FILENAME: "googleSearchMultiSite_sites-config.txt",
      DESCRIPTION: "谷歌多站点搜索配置"
    },
    DEFAULT_SITES: [ "暗香,anxiangge.cc 2nt,mm2211.blog.2nt.com 2048,hjd2048.com", "Intporn,forum.intporn.com EC,eroticity.net SPS,sexpicturespass.com planetsuzy,planetsuzy.org" ].join("\n"),
    SELECTORS: {
      searchBox: "textarea[name='q']",
      submitButton: "button[type='submit']"
    },
    UI: {
      NAVBAR: {
        DEFAULT_POSITION: {
          top: "100px",
          left: "10px"
        },
        Z_INDEX: "10000"
      },
      DIALOG: {
        Z_INDEX: "99999",
        SETTINGS_Z_INDEX: "10000"
      },
      NOTIFICATION: {
        Z_INDEX: "10001"
      }
    }
  };
  class ModuleManager {
    static getPageType() {
      const url = window.location.href, hasSiteParam = this.hasRealSiteParam(url);
      return hasSiteParam && (url.includes("udm=2") || url.includes("tbm=isch")) ? "site-image-search" : hasSiteParam ? "site-search" : url.includes("udm=48") ? "image-search" : "normal-search";
    }
    static hasRealSiteParam(url) {
      if (url.includes("site%3A")) return !0;
      const query = new URLSearchParams(new URL(url).search).get("q") || "";
      return /\bsite:[^\s]+\b/.test(query);
    }
    static shouldEnableMultiSiteFeatures() {
      const pageType = this.getPageType();
      return "site-search" === pageType || "site-image-search" === pageType;
    }
    static getPageTypeDescription() {
      switch (this.getPageType()) {
       case "site-image-search":
        return "站点图片搜索页面";

       case "site-search":
        return "多站点搜索页面";

       case "image-search":
        return "以图搜图页面";

       case "normal-search":
        return "普通搜索页面";

       default:
        return "未知页面类型";
      }
    }
    static logPageType() {}
  }
  function parseSiteRows(text) {
    return text.split("\n").map(line => line.trim().split(/\s+/).filter(Boolean).map(btn => {
      if (btn.includes(",")) {
        const [name, url] = btn.split(",");
        return {
          name: name || "",
          url: url || ""
        };
      }
      {
        let name = btn;
        try {
          let clean = btn.replace(/^(https?:\/\/)?(www\.)?/, "");
          const dotIndex = clean.indexOf(".");
          name = -1 !== dotIndex ? clean.substring(0, dotIndex) : clean;
        } catch (e) {}
        return {
          name: name,
          url: btn
        };
      }
    }).filter(btn => btn.name && btn.url)).filter(row => row.length > 0);
  }
  function getSearchBox() {
    return document.querySelector(CONFIG.SELECTORS.searchBox);
  }
  function getDomainFromUrl(url) {
    try {
      let domain = url;
      return domain.startsWith("http") || (domain = "http://" + domain), new URL(domain).hostname;
    } catch (e) {
      return url;
    }
  }
  class Storage {
    static get(key, defaultValue = null) {
      try {
        const value = GM_getValue(key);
        if (null == value) return defaultValue;
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      } catch (error) {
        return defaultValue;
      }
    }
    static set(key, value) {
      try {
        const jsonValue = JSON.stringify(value);
        return GM_setValue(key, jsonValue), !0;
      } catch (error) {
        return !1;
      }
    }
    static delete(key) {
      try {
        return GM_deleteValue(key), !0;
      } catch (error) {
        return !1;
      }
    }
    static listKeys() {
      try {
        return GM_listValues();
      } catch (error) {
        return [];
      }
    }
    static migrateFromLocalStorage(key, deleteAfterMigration = !0) {
      try {
        const localValue = localStorage.getItem(key);
        if (null !== localValue) {
          try {
            const parsed = JSON.parse(localValue);
            this.set(key, parsed);
          } catch {
            GM_setValue(key, localValue);
          }
          return deleteAfterMigration && localStorage.removeItem(key), !0;
        }
        return !1;
      } catch (error) {
        return !1;
      }
    }
  }
  const _FloatingNavBar = class {
    static init() {
      getSearchBox() && this.createNavBar();
    }
    static createNavBar() {
      if (this.navBar) return;
      this.navBar = document.createElement("div"), this.applyNavBarStyles(), this.toggleIcon = document.createElement("div"), 
      this.toggleIcon.innerHTML = '\n      <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>\n        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>\n        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>\n        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>\n      </svg>\n    ', 
      Object.assign(this.toggleIcon.style, {
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: "0",
        borderRadius: "50%",
        zIndex: "2"
      }), this.toggleIcon.addEventListener("mouseenter", () => this.toggleIcon.style.backgroundColor = "rgba(0,0,0,0.05)"), 
      this.toggleIcon.addEventListener("mouseleave", () => this.toggleIcon.style.backgroundColor = "transparent"), 
      this.navBar.appendChild(this.toggleIcon);
      const div1 = document.createElement("div");
      div1.className = "nav-divider", Object.assign(div1.style, {
        width: "1px",
        height: "20px",
        backgroundColor: "#e0e0e0",
        margin: "0 2px",
        display: "none"
      }), this.navBar.appendChild(div1), this.wrapper = document.createElement("div"), 
      Object.assign(this.wrapper.style, {
        display: "none",
        flexDirection: "column",
        gap: "8px",
        opacity: "0",
        transition: "opacity 0.2s ease",
        padding: "0 4px",
        justifyContent: "center"
      }), this.navBar.appendChild(this.wrapper);
      const div2 = document.createElement("div");
      div2.className = "nav-divider", Object.assign(div2.style, {
        width: "1px",
        height: "20px",
        backgroundColor: "#e0e0e0",
        margin: "0 2px",
        display: "none"
      }), this.navBar.appendChild(div2), this.navBar._dividers = [ div1, div2 ], this.loadPosition(), 
      this.createSiteButtons(), this.createSettingsButton(), this.setupEvents(), document.body.appendChild(this.navBar);
    }
    static applyNavBarStyles() {
      this.navBar && Object.assign(this.navBar.style, {
        position: "fixed",
        top: CONFIG.UI.NAVBAR.DEFAULT_POSITION.top,
        left: CONFIG.UI.NAVBAR.DEFAULT_POSITION.left,
        zIndex: CONFIG.UI.NAVBAR.Z_INDEX,
        padding: "0",
        width: "40px",
        height: "40px",
        borderRadius: "20px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "move",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        backdropFilter: "blur(10px)",
        webkitBackdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        overflow: "hidden"
      });
    }
    static setupEvents() {
      if (!this.navBar || !this.wrapper || !this.toggleIcon) return;
      const toggle = () => {
        this.isExpanded ? collapse() : expand();
      }, expand = () => {
        this.isExpanded = !0;
        const currentLeft = parseFloat(this.navBar.style.left || "0"), isRightSide = currentLeft > window.innerWidth / 2;
        Object.assign(this.navBar.style, {
          width: "auto",
          height: "40px",
          padding: "0 2px",
          borderRadius: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          flexDirection: isRightSide ? "row-reverse" : "row",
          gap: "0",
          alignItems: "center"
        }), this.toggleIcon.style.display = "flex", this.toggleIcon.style.marginBottom = "0", 
        (this.navBar._dividers || []).forEach(d => d.style.display = "block"), this.wrapper.style.display = "flex", 
        this.navBar.style.height = "auto", this.navBar.style.minHeight = "40px", Object.assign(this.wrapper.style, {
          flexDirection: "column",
          alignItems: isRightSide ? "flex-end" : "flex-start",
          justifyContent: "center",
          flexWrap: "nowrap"
        });
        const btn = this.navBar._settingsBtn;
        btn && (btn.style.display = "flex", btn.style.position = "static");
        const newWidth = this.navBar.offsetWidth;
        if (isRightSide) {
          const shift = newWidth - 40;
          this.navBar.style.left = currentLeft - shift + "px";
        }
        requestAnimationFrame(() => {
          this.wrapper && (this.wrapper.style.opacity = "1");
        });
      }, collapse = () => {
        this.isExpanded = !1;
        const isReverse = "row-reverse" === this.navBar.style.flexDirection;
        let shiftBack = 0;
        if (isReverse && (shiftBack = this.navBar.offsetWidth - 40), Object.assign(this.navBar.style, {
          padding: "0",
          width: "40px",
          height: "40px",
          borderRadius: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          flexDirection: "row",
          gap: "0"
        }), (this.navBar._dividers || []).forEach(d => d.style.display = "none"), isReverse && shiftBack > 0) {
          const currentLeft = parseFloat(this.navBar.style.left || "0");
          this.navBar.style.left = `${currentLeft + shiftBack}px`, this.savePosition();
        }
        this.toggleIcon.style.display = "flex", this.wrapper.style.opacity = "0", this.wrapper.style.display = "none";
        const btn = this.navBar._settingsBtn;
        btn && (btn.style.display = "none");
      };
      this.navBar.addEventListener("mousedown", e => {
        this.isDragging = !1, this.startX = e.clientX, this.startY = e.clientY, this.offsetX = e.clientX - this.navBar.offsetLeft, 
        this.offsetY = e.clientY - this.navBar.offsetTop, this.navBar.style.transition = "none", 
        window.addEventListener("mousemove", onMouseMove), window.addEventListener("mouseup", onMouseUp);
      });
      const onMouseMove = e => {
        const moveX = e.clientX - this.startX, moveY = e.clientY - this.startY;
        (Math.abs(moveX) > this.dragThreshold || Math.abs(moveY) > this.dragThreshold) && (this.isDragging = !0), 
        this.isDragging && this.navBar && (this.navBar.style.left = e.clientX - this.offsetX + "px", 
        this.navBar.style.top = e.clientY - this.offsetY + "px");
      }, onMouseUp = e => {
        window.removeEventListener("mousemove", onMouseMove), window.removeEventListener("mouseup", onMouseUp), 
        this.navBar && (this.navBar.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
        this.savePosition()), this.isDragging || (this.toggleIcon && (this.toggleIcon.contains(e.target) || this.toggleIcon === e.target) ? toggle() : this.isExpanded || expand()), 
        this.isDragging = !1;
      };
    }
    static loadPosition() {
      if (!this.navBar) return;
      const position = Storage.get(CONFIG.STORAGE.LOCALSTORAGE_NAVBAR_POSITION_KEY, null);
      position && (this.navBar.style.top = position.top, this.navBar.style.left = position.left);
    }
    static savePosition() {
      if (!this.navBar) return;
      const position = {
        top: this.navBar.style.top,
        left: this.navBar.style.left
      };
      Storage.set(CONFIG.STORAGE.LOCALSTORAGE_NAVBAR_POSITION_KEY, position);
    }
    static createSiteButtons() {
      this.navBar && parseSiteRows(Storage.get(CONFIG.STORAGE.LOCALSTORAGE_SITES_KEY, CONFIG.DEFAULT_SITES) ?? CONFIG.DEFAULT_SITES).forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.style.display = "flex", rowDiv.style.gap = "8px", rowDiv.style.alignItems = "center", 
        row.forEach(({name: name, url: url}) => {
          const btn = document.createElement("button"), icon = document.createElement("img"), domain = getDomainFromUrl(url);
          icon.src = `https://www.google.com/s2/favicons?sz=32&domain=${domain}`, Object.assign(icon.style, {
            width: "14px",
            height: "14px",
            borderRadius: "2px",
            pointerEvents: "none"
          });
          const text = document.createElement("span");
          text.textContent = name, btn.appendChild(icon), btn.appendChild(text), this.applyButtonStyles(btn), 
          btn.addEventListener("click", () => {
            this.performSearch(url);
          }), rowDiv.appendChild(btn);
        }), this.wrapper.appendChild(rowDiv);
      });
    }
    static createSettingsButton() {
      if (!this.navBar) return;
      const settingsBtn = document.createElement("div");
      settingsBtn.innerHTML = '\n      <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="#5f6368">\n        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.49l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>\n      </svg>\n    ', 
      settingsBtn.title = "设置", Object.assign(settingsBtn.style, {
        display: "none",
        width: "40px",
        height: "40px",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        opacity: "0.7",
        transition: "all 0.2s",
        borderRadius: "50%",
        flexShrink: "0"
      }), settingsBtn.addEventListener("mouseenter", () => {
        settingsBtn.style.opacity = "1", settingsBtn.style.backgroundColor = "rgba(0,0,0,0.05)";
      }), settingsBtn.addEventListener("mouseleave", () => {
        settingsBtn.style.opacity = "0.6", settingsBtn.style.backgroundColor = "transparent";
      }), settingsBtn.addEventListener("click", e => {
        e.stopPropagation(), Promise.resolve().then(() => SiteConfigEditor$1).then(m => m.SiteConfigEditor.show());
      }), this.navBar.appendChild(settingsBtn), settingsBtn.style.display = "none", this.navBar._settingsBtn = settingsBtn;
    }
    static applyButtonStyles(btn) {
      Object.assign(btn.style, {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "4px 10px",
        cursor: "pointer",
        border: "1px solid rgba(0,0,0,0.08)",
        background: "white",
        borderRadius: "20px",
        fontSize: "12px",
        color: "#3c4043",
        fontWeight: "500",
        transition: "all 0.2s ease",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
      }), btn.addEventListener("mouseenter", () => {
        btn.style.background = "#f1f3f4", btn.style.borderColor = "rgba(0,0,0,0.1)", btn.style.transform = "translateY(-1px)", 
        btn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
      }), btn.addEventListener("mouseleave", () => {
        btn.style.background = "white", btn.style.borderColor = "rgba(0,0,0,0.08)", btn.style.transform = "translateY(0)", 
        btn.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
      });
    }
    static performSearch(siteUrl) {
      const searchBox = getSearchBox();
      if (!searchBox) return;
      const query = (new URLSearchParams(window.location.search).get("q") || "").replace(/site:[^\s]+/g, "").trim();
      searchBox.value = `${query} site:${siteUrl}`;
      const submitButton = document.querySelector(CONFIG.SELECTORS.submitButton);
      submitButton && submitButton.click();
    }
    static hideNavBar() {
      this.navBar && (this.navBar.remove(), this.navBar = null);
    }
    static refreshButtons() {
      this.navBar && this.wrapper && (this.wrapper.innerHTML = "", this.createSiteButtons());
    }
    static cleanup() {
      this.hideNavBar();
    }
  };
  _FloatingNavBar.navBar = null, _FloatingNavBar.wrapper = null, _FloatingNavBar.toggleIcon = null, 
  _FloatingNavBar.isDragging = !1, _FloatingNavBar.offsetX = 0, _FloatingNavBar.offsetY = 0, 
  _FloatingNavBar.dragThreshold = 3, _FloatingNavBar.startX = 0, _FloatingNavBar.startY = 0, 
  _FloatingNavBar.isExpanded = !1;
  let FloatingNavBar = _FloatingNavBar;
  (class {
    static main() {
      "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", this.initialize.bind(this)) : this.initialize();
    }
    static initialize() {
      try {
        const pageType = ModuleManager.getPageType();
        if ("image-search" === pageType || "normal-search" === pageType) return;
        this.registerMenuCommands(), this.initializeModules(), setTimeout(() => {
          ModuleManager.shouldEnableMultiSiteFeatures() && FloatingNavBar.init();
        }, 1e3);
      } catch (error) {}
    }
    static registerMenuCommands() {}
    static initializeModules() {
      ModuleManager.logPageType(), ModuleManager.shouldEnableMultiSiteFeatures(), ModuleManager.getPageType();
    }
    static cleanup() {
      try {
        FloatingNavBar.cleanup();
      } catch (error) {}
    }
  }).main();
  const _Toast = class {
    static initContainer() {
      return this.container || (this.container = document.createElement("div"), this.container.id = "toast-container", 
      Object.assign(this.container.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: "99999",
        pointerEvents: "none"
      }), document.body.appendChild(this.container)), this.container;
    }
    static show(message, type = "info", duration = 4e3) {
      const container = this.initContainer(), toast = document.createElement("div");
      return toast.textContent = message, Object.assign(toast.style, {
        padding: "12px 20px",
        marginBottom: "10px",
        borderRadius: "6px",
        color: "white",
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        opacity: "0",
        transform: "translateX(100%)",
        transition: "all 0.3s ease-out",
        fontSize: "14px",
        fontWeight: "400",
        maxWidth: "300px",
        wordWrap: "break-word",
        pointerEvents: "auto",
        cursor: "pointer"
      }), toast.style.backgroundColor = {
        success: "#10B981",
        error: "#EF4444",
        warning: "#F59E0B",
        info: "#3B82F6"
      }[type], toast.addEventListener("click", () => {
        this.removeToast(toast);
      }), container.appendChild(toast), setTimeout(() => {
        toast.style.opacity = "1", toast.style.transform = "translateX(0)";
      }, 10), duration > 0 && setTimeout(() => {
        this.removeToast(toast);
      }, duration), toast;
    }
    static removeToast(toast) {
      toast.style.opacity = "0", toast.style.transform = "translateX(100%)", setTimeout(() => {
        toast.parentNode && toast.remove();
      }, 300);
    }
    static success(message, duration = 4e3) {
      return this.show(message, "success", duration);
    }
    static error(message, duration = 5e3) {
      return this.show(message, "error", duration);
    }
    static warning(message, duration = 4e3) {
      return this.show(message, "warning", duration);
    }
    static info(message, duration = 3e3) {
      return this.show(message, "info", duration);
    }
  };
  _Toast.container = null;
  let Toast = _Toast;
  const _SiteConfigEditor = class {
    static show() {
      if (this.dialog) return;
      const rows = parseSiteRows(Storage.get(CONFIG.STORAGE.LOCALSTORAGE_SITES_KEY, CONFIG.DEFAULT_SITES) ?? CONFIG.DEFAULT_SITES);
      this.groups = rows.map((sites, index) => ({
        id: `group-${Date.now()}-${index}`,
        sites: sites
      })), 0 === this.groups.length && this.groups.push({
        id: `group-${Date.now()}`,
        sites: []
      }), this.initUI();
    }
    static initUI() {
      this.mask && (document.body.removeChild(this.mask), this.mask = null, this.dialog = null, 
      this.groupsWrapper = null), this.mask = document.createElement("div"), Object.assign(this.mask.style, {
        position: "fixed",
        left: "0",
        top: "0",
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        zIndex: "10000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(2px)"
      }), this.dialog = document.createElement("div"), Object.assign(this.dialog.style, {
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        width: "600px",
        maxWidth: "90vw",
        maxHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        animation: "scaleIn 0.2s ease"
      });
      const styleSheet = document.createElement("style");
      styleSheet.textContent = "\n        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }\n        .config-scroll::-webkit-scrollbar { width: 6px; }\n        .config-scroll::-webkit-scrollbar-track { background: transparent; }\n        .config-scroll::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }\n        .config-group { transition: all 0.2s ease; border: 1px solid #eee; border-radius: 8px; margin-bottom: 12px; background: #fafafa; }\n        .config-group.drag-over { border-color: #4285f4; background: #e8f0fe; }\n        .site-chip { transition: all 0.2s; cursor: grab; user-select: none; }\n        .site-chip:hover { transform: translateY(-1px); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }\n        .site-chip.dragging { opacity: 0.5; }\n    ", 
      this.mask.appendChild(styleSheet);
      const header = this.createHeader();
      this.dialog.appendChild(header);
      const content = document.createElement("div");
      content.className = "config-scroll", Object.assign(content.style, {
        flex: "1",
        overflowY: "auto",
        padding: "20px"
      }), this.groupsWrapper = document.createElement("div"), content.appendChild(this.groupsWrapper), 
      this.refreshLayout();
      const addGroupBtn = document.createElement("div");
      Object.assign(addGroupBtn.style, {
        padding: "10px",
        border: "2px dashed #ddd",
        borderRadius: "8px",
        textAlign: "center",
        color: "#888",
        cursor: "pointer",
        marginTop: "10px",
        fontSize: "14px",
        background: "transparent"
      }), addGroupBtn.textContent = "+ 添加新分组 (新行)", addGroupBtn.addEventListener("mouseenter", () => {
        addGroupBtn.style.borderColor = "#4285f4", addGroupBtn.style.color = "#4285f4";
      }), addGroupBtn.addEventListener("mouseleave", () => {
        addGroupBtn.style.borderColor = "#ddd", addGroupBtn.style.color = "#888";
      }), addGroupBtn.onclick = () => {
        this.groups.push({
          id: `group-${Date.now()}`,
          sites: []
        }), this.refreshLayout();
      }, content.appendChild(addGroupBtn), this.renderSyncSection(content), this.dialog.appendChild(content);
      const footer = this.createFooter();
      this.dialog.appendChild(footer), this.mask.appendChild(this.dialog), document.body.appendChild(this.mask), 
      this.mask.addEventListener("mousedown", e => {
        e.target === this.mask && this.close();
      });
    }
    static createHeader() {
      const header = document.createElement("div");
      Object.assign(header.style, {
        padding: "16px 24px",
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff",
        zIndex: "1"
      });
      const title = document.createElement("div");
      title.innerHTML = '<span style="font-size:20px;vertical-align:middle">⚙️</span> <span style="font-weight:600;font-size:16px;margin-left:8px">面板配置</span>';
      const closeBtn = document.createElement("div");
      return closeBtn.innerHTML = "✕", Object.assign(closeBtn.style, {
        cursor: "pointer",
        color: "#999",
        fontSize: "18px",
        padding: "4px"
      }), closeBtn.onclick = () => this.close(), header.appendChild(title), header.appendChild(closeBtn), 
      header;
    }
    static refreshLayout() {
      this.groupsWrapper && (this.groupsWrapper.innerHTML = "", this.renderGroups());
    }
    static renderGroups() {
      this.groupsWrapper && (this.groupsWrapper.innerHTML = "", this.groups.forEach((group, gIndex) => {
        const groupEl = document.createElement("div");
        groupEl.className = "config-group", Object.assign(groupEl.style, {
          padding: "12px",
          position: "relative"
        });
        const gHeader = document.createElement("div");
        Object.assign(gHeader.style, {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px"
        });
        const gLabel = document.createElement("div");
        gLabel.textContent = `分组 ${gIndex + 1}`, gLabel.style.fontWeight = "bold", gLabel.style.color = "#555", 
        gLabel.style.fontSize = "13px";
        const gActions = document.createElement("div");
        gActions.style.gap = "8px", gActions.style.display = "flex";
        const delGroupBtn = document.createElement("span");
        delGroupBtn.innerHTML = "🗑️", delGroupBtn.title = "删除整组", delGroupBtn.style.cursor = "pointer", 
        delGroupBtn.style.fontSize = "14px", delGroupBtn.style.opacity = "0.5", delGroupBtn.onclick = () => {
          confirm("确定删除该分组及组内所有按钮吗？") && (this.groups.splice(gIndex, 1), this.refreshLayout());
        }, gActions.appendChild(delGroupBtn), gHeader.appendChild(gLabel), gHeader.appendChild(gActions), 
        groupEl.appendChild(gHeader);
        const sitesContainer = document.createElement("div");
        sitesContainer.className = "sites-container", Object.assign(sitesContainer.style, {
          display: "flex",
          flexWrap: "wrap",
          gap: "8px"
        }), group.sites.forEach((site, sIndex) => {
          const chip = this.createSiteChip(site, gIndex, sIndex);
          sitesContainer.appendChild(chip);
        });
        const addBtn = document.createElement("div");
        addBtn.className = "add-btn", Object.assign(addBtn.style, {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "1px dashed #bbb",
          cursor: "pointer",
          color: "#888",
          fontSize: "18px",
          background: "#fff"
        }), addBtn.innerHTML = "+", addBtn.title = "添加按钮", addBtn.addEventListener("mouseenter", () => {
          addBtn.style.borderColor = "#4285f4", addBtn.style.color = "#4285f4";
        }), addBtn.addEventListener("mouseleave", () => {
          addBtn.style.borderColor = "#bbb", addBtn.style.color = "#888";
        }), addBtn.onclick = () => this.openEditModal(gIndex), sitesContainer.appendChild(addBtn), 
        groupEl.appendChild(sitesContainer), groupEl.addEventListener("dragover", e => {
          if (e.preventDefault(), groupEl.classList.add("drag-over"), this.draggedItem && (e.target === groupEl || e.target === sitesContainer)) {
            const srcG = this.draggedItem.groupIndex, srcS = this.draggedItem.siteIndex, tgtG = gIndex, currentGroupLen = this.groups[tgtG].sites.length;
            if (srcG === tgtG && srcS === currentGroupLen - 1) return;
            this.moveItem(srcG, srcS, tgtG, currentGroupLen);
          }
        }), groupEl.addEventListener("dragleave", () => {
          groupEl.classList.remove("drag-over");
        }), groupEl.addEventListener("drop", e => {
          e.preventDefault(), e.stopPropagation(), groupEl.classList.remove("drag-over");
        }), this.groupsWrapper && this.groupsWrapper.appendChild(groupEl);
      }));
    }
    static moveItem(srcG, srcS, tgtG, tgtS) {
      if (srcG === tgtG && srcS === tgtS) return;
      const item = this.groups[srcG].sites.splice(srcS, 1)[0];
      let finalTgtS = tgtS;
      srcG === tgtG && srcS < tgtS && (finalTgtS -= 1), this.groups[tgtG].sites.splice(finalTgtS, 0, item);
      const srcGroupEl = this.groupsWrapper.children[srcG].querySelector(".sites-container"), tgtGroupEl = this.groupsWrapper.children[tgtG].querySelector(".sites-container"), chipEl = srcGroupEl.children[srcS], refNode = finalTgtS >= tgtGroupEl.children.length - 1 ? tgtGroupEl.querySelector(".add-btn") : tgtGroupEl.children[finalTgtS];
      tgtGroupEl.insertBefore(chipEl, refNode), this.updateIndices(srcGroupEl, srcG), 
      srcG !== tgtG && this.updateIndices(tgtGroupEl, tgtG), this.draggedItem = {
        groupIndex: tgtG,
        siteIndex: finalTgtS
      };
    }
    static updateIndices(container, gIndex) {
      Array.from(container.children).forEach((child, index) => {
        child.classList.contains("site-chip") && (child.dataset.gIndex = gIndex.toString(), 
        child.dataset.sIndex = index.toString());
      });
    }
    static createSiteChip(site, gIndex, sIndex) {
      const chip = document.createElement("div");
      chip.className = "site-chip", chip.draggable = !0, chip.dataset.gIndex = gIndex.toString(), 
      chip.dataset.sIndex = sIndex.toString(), Object.assign(chip.style, {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px 4px 6px",
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "20px",
        fontSize: "13px",
        color: "#333"
      });
      const icon = document.createElement("img"), domain = getDomainFromUrl(site.url);
      icon.src = `https://www.google.com/s2/favicons?sz=32&domain=${domain}`, Object.assign(icon.style, {
        width: "16px",
        height: "16px",
        borderRadius: "2px",
        pointerEvents: "none"
      }), chip.appendChild(icon);
      const nameSpan = document.createElement("span");
      nameSpan.textContent = site.name, chip.appendChild(nameSpan), chip.onclick = () => {
        const curG = parseInt(chip.dataset.gIndex || "0"), curS = parseInt(chip.dataset.sIndex || "0");
        this.openEditModal(curG, curS);
      };
      const delBtn = document.createElement("span");
      return delBtn.innerHTML = "×", Object.assign(delBtn.style, {
        fontSize: "14px",
        marginLeft: "4px",
        cursor: "pointer",
        color: "#999",
        fontWeight: "bold"
      }), delBtn.addEventListener("mouseenter", () => delBtn.style.color = "red"), delBtn.addEventListener("mouseleave", () => delBtn.style.color = "#999"), 
      delBtn.onclick = e => {
        if (e.stopPropagation(), confirm(`删除 "${site.name}" ?`)) {
          const curG = parseInt(chip.dataset.gIndex || "0"), curS = parseInt(chip.dataset.sIndex || "0");
          this.groups[curG].sites.splice(curS, 1), this.refreshLayout();
        }
      }, chip.appendChild(delBtn), chip.addEventListener("dragstart", e => {
        const curG = parseInt(chip.dataset.gIndex || "0"), curS = parseInt(chip.dataset.sIndex || "0");
        this.draggedItem = {
          groupIndex: curG,
          siteIndex: curS
        }, chip.style.opacity = "0.5", e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
      }), chip.addEventListener("dragend", () => {
        chip.style.opacity = "1", this.draggedItem = null;
      }), chip.addEventListener("dragover", e => {
        if (e.preventDefault(), e.stopPropagation(), !this.draggedItem) return;
        const baseTgtG = parseInt(chip.dataset.gIndex || "0"), baseTgtS = parseInt(chip.dataset.sIndex || "0");
        this.draggedItem.groupIndex === baseTgtG && this.draggedItem.siteIndex === baseTgtS || this.moveItem(this.draggedItem.groupIndex, this.draggedItem.siteIndex, baseTgtG, baseTgtS);
      }), chip.addEventListener("drop", e => {
        e.preventDefault(), e.stopPropagation();
      }), chip;
    }
    static renderSyncSection(container) {
      const wrapper = document.createElement("div");
      wrapper.style.marginTop = "20px", wrapper.style.borderTop = "1px solid #eee", wrapper.style.paddingTop = "15px";
      const summary = document.createElement("div");
      summary.style.display = "flex", summary.style.alignItems = "center", summary.style.cursor = "pointer";
      const arrow = document.createElement("span");
      arrow.textContent = "▶", arrow.style.fontSize = "10px", arrow.style.marginRight = "8px", 
      arrow.style.transition = "transform 0.2s";
      const label = document.createElement("span");
      label.textContent = "高级设置 & 云同步 (Gist)", label.style.fontWeight = "bold", label.style.fontSize = "14px", 
      label.style.color = "#666", summary.appendChild(arrow), summary.appendChild(label), 
      wrapper.appendChild(summary);
      const content = document.createElement("div");
      content.style.display = "none", content.style.marginTop = "15px", content.style.padding = "0 10px";
      const savedToken = Storage.get(CONFIG.STORAGE.GM_GITHUB_TOKEN_KEY, "") || "", savedGistId = Storage.get(CONFIG.STORAGE.GM_GIST_ID_KEY, "") || "";
      content.innerHTML = `\n        <div style="margin-bottom:10px;">\n            <label style="display:block;font-size:12px;color:#666;margin-bottom:4px">GitHub Token</label>\n            <input type="password" id="gist-token" value="${savedToken}" style="width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;">\n        </div>\n        <div style="margin-bottom:15px;">\n            <label style="display:block;font-size:12px;color:#666;margin-bottom:4px">Gist ID</label>\n            <input type="text" id="gist-id" value="${savedGistId}" style="width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;">\n        </div>\n        <div style="display:flex;gap:10px;">\n            <button id="btn-upload" style="flex:1;padding:6px;background:#f0f0f0;border:1px solid #ddd;border-radius:4px;cursor:pointer;">⬆️ 上传配置</button>\n            <button id="btn-download" style="flex:1;padding:6px;background:#f0f0f0;border:1px solid #ddd;border-radius:4px;cursor:pointer;">⬇️ 下载覆盖</button>\n        </div>\n      `, 
      wrapper.appendChild(content);
      let isOpen = !1;
      summary.onclick = () => {
        isOpen = !isOpen, content.style.display = isOpen ? "block" : "none", arrow.style.transform = isOpen ? "rotate(90deg)" : "rotate(0deg)";
      }, setTimeout(() => {
        const inputToken = content.querySelector("#gist-token"), inputId = content.querySelector("#gist-id"), btnUp = content.querySelector("#btn-upload"), btnDown = content.querySelector("#btn-download"), saveSyncInfo = () => {
          Storage.set(CONFIG.STORAGE.GM_GITHUB_TOKEN_KEY, inputToken.value.trim()), Storage.set(CONFIG.STORAGE.GM_GIST_ID_KEY, inputId.value.trim());
        };
        btnUp.onclick = async () => {
          saveSyncInfo(), this.saveToStorage();
          const m = await Promise.resolve().then(() => GistSync$1);
          await m.GistSync.uploadToGist(), inputId.value = Storage.get(CONFIG.STORAGE.GM_GIST_ID_KEY, "") || "";
        }, btnDown.onclick = async () => {
          saveSyncInfo();
          const m = await Promise.resolve().then(() => GistSync$1);
          await m.GistSync.downloadFromGist(), this.groups = [];
          const rows = parseSiteRows(Storage.get(CONFIG.STORAGE.LOCALSTORAGE_SITES_KEY, CONFIG.DEFAULT_SITES) ?? CONFIG.DEFAULT_SITES);
          this.groups = rows.map((sites, i) => ({
            id: `g-${i}`,
            sites: sites
          })), this.refreshLayout();
        };
      }, 0), container.appendChild(wrapper);
    }
    static createFooter() {
      const footer = document.createElement("div");
      Object.assign(footer.style, {
        padding: "16px 24px",
        borderTop: "1px solid #eee",
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        background: "#fafafa"
      });
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "取消", Object.assign(cancelBtn.style, {
        padding: "8px 20px",
        border: "1px solid #ddd",
        background: "#fff",
        borderRadius: "6px",
        cursor: "pointer"
      }), cancelBtn.onclick = () => this.close();
      const saveBtn = document.createElement("button");
      return saveBtn.textContent = "保存生效", Object.assign(saveBtn.style, {
        padding: "8px 24px",
        border: "none",
        background: "#4285f4",
        color: "#fff",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        boxShadow: "0 2px 5px rgba(66, 133, 244, 0.3)"
      }), saveBtn.onclick = async () => {
        this.saveToStorage(), FloatingNavBar.refreshButtons(), Toast.show("设置已保存", "success"), 
        this.close();
        const token = Storage.get(CONFIG.STORAGE.GM_GITHUB_TOKEN_KEY, ""), gistId = Storage.get(CONFIG.STORAGE.GM_GIST_ID_KEY, "");
        if (token && gistId) {
          const m = await Promise.resolve().then(() => GistSync$1);
          await m.GistSync.uploadToGist();
        }
      }, footer.appendChild(cancelBtn), footer.appendChild(saveBtn), footer;
    }
    static openEditModal(groupIndex, siteIndex = -1) {
      const site = siteIndex >= 0 ? this.groups[groupIndex].sites[siteIndex] : {
        name: "",
        url: ""
      }, isEdit = siteIndex >= 0, pname = prompt("请输入按钮名称", site.name);
      if (null === pname) return;
      const purl = prompt("请输入网址 (URL)", site.url);
      if (null === purl) return;
      if (!purl.trim()) return void alert("网址不能为空");
      const newItem = {
        name: pname.trim() || "未命名",
        url: purl.trim()
      };
      isEdit ? this.groups[groupIndex].sites[siteIndex] = newItem : this.groups[groupIndex].sites.push(newItem), 
      this.refreshLayout();
    }
    static saveToStorage() {
      const text = this.groups.map(g => g.sites.map(s => `${s.name},${s.url}`).join(" ")).filter(line => line.trim().length > 0).join("\n");
      Storage.set(CONFIG.STORAGE.LOCALSTORAGE_SITES_KEY, text);
    }
    static close() {
      this.mask && (document.body.removeChild(this.mask), this.mask = null, this.dialog = null);
    }
  };
  _SiteConfigEditor.dialog = null, _SiteConfigEditor.mask = null, _SiteConfigEditor.groupsWrapper = null, 
  _SiteConfigEditor.groups = [], _SiteConfigEditor.draggedItem = null;
  let SiteConfigEditor = _SiteConfigEditor;
  const SiteConfigEditor$1 = Object.freeze(Object.defineProperty({
    __proto__: null,
    SiteConfigEditor: SiteConfigEditor
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  class GistAPI {
    static async request(token, config) {
      if (!token) throw new Error("GitHub Token 未提供");
      const requestConfig = {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json"
        }
      };
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          ...requestConfig,
          onload: res => {
            res.status >= 200 && res.status < 300 ? resolve(res) : reject(res);
          },
          onerror: err => reject(err)
        });
      });
    }
    static async getFile(token, gistId, filename) {
      if (!gistId) throw new Error("Gist ID 未提供");
      try {
        const response = await this.request(token, {
          method: "GET",
          url: `https://api.github.com/gists/${gistId}`
        }), gistData = JSON.parse(response.responseText);
        return gistData.files && gistData.files[filename] ? gistData.files[filename] : null;
      } catch (error) {
        throw error;
      }
    }
    static async updateFile(token, gistId, filename, content) {
      if (!gistId) throw new Error("Gist ID 未提供");
      try {
        return await this.request(token, {
          method: "PATCH",
          url: `https://api.github.com/gists/${gistId}`,
          headers: {
            "Content-Type": "application/json"
          },
          data: JSON.stringify({
            files: {
              [filename]: {
                content: content
              }
            }
          })
        }), !0;
      } catch (error) {
        throw error;
      }
    }
    static async createGist(token, filename, content, description, isPublic = !1) {
      try {
        const response = await this.request(token, {
          method: "POST",
          url: "https://api.github.com/gists",
          headers: {
            "Content-Type": "application/json"
          },
          data: JSON.stringify({
            description: description,
            public: isPublic,
            files: {
              [filename]: {
                content: content
              }
            }
          })
        });
        return JSON.parse(response.responseText).id;
      } catch (error) {
        throw error;
      }
    }
    static async deleteGist(token, gistId) {
      if (!gistId) throw new Error("Gist ID 未提供");
      try {
        return await this.request(token, {
          method: "DELETE",
          url: `https://api.github.com/gists/${gistId}`
        }), !0;
      } catch (error) {
        throw error;
      }
    }
  }
  const GistSync$1 = Object.freeze(Object.defineProperty({
    __proto__: null,
    GistSync: class {
      static getGitHubToken() {
        return Storage.get(CONFIG.STORAGE.GM_GITHUB_TOKEN_KEY, "") || "";
      }
      static getGistId() {
        return Storage.get(CONFIG.STORAGE.GM_GIST_ID_KEY, "") || "";
      }
      static async getGistFile() {
        const token = this.getGitHubToken(), gistId = this.getGistId();
        if (!token) return null;
        if (!gistId) return null;
        try {
          return await GistAPI.getFile(token, gistId, CONFIG.GIST.FILENAME) || null;
        } catch (error) {
          return 404 === error.status ? Toast.show("Gist 未找到，请检查Gist ID配置", "warning", 5e3) : Toast.show(`获取Gist文件失败: ${error.statusText || "Unknown error"}`, "error"), 
          null;
        }
      }
      static async updateGistFile(content) {
        const token = this.getGitHubToken(), gistId = this.getGistId();
        if (!token || !gistId) return Toast.show("GitHub Token 或 Gist ID 未配置", "error"), 
        !1;
        try {
          return await GistAPI.updateFile(token, gistId, CONFIG.GIST.FILENAME, content), !0;
        } catch (error) {
          return Toast.show(`更新Gist文件失败: ${error.statusText || "Unknown error"}`, "error"), 
          !1;
        }
      }
      static async createGist(content) {
        const token = this.getGitHubToken();
        if (!token) return Toast.show("GitHub Token 未配置", "error"), null;
        try {
          return await GistAPI.createGist(token, CONFIG.GIST.FILENAME, content, CONFIG.GIST.DESCRIPTION, !1);
        } catch (error) {
          return Toast.show(`创建Gist失败: ${error.statusText || "Unknown error"}`, "error"), 
          null;
        }
      }
      static async uploadToGist() {
        if (!this.getGitHubToken()) return void Toast.show("GitHub Token 未配置。请在设置面板中进行设置。", "error");
        const localContent = Storage.get(CONFIG.STORAGE.LOCALSTORAGE_SITES_KEY, CONFIG.DEFAULT_SITES) || CONFIG.DEFAULT_SITES, currentGistId = this.getGistId(), notification = Toast.show("上传配置到Gist中...", "info", 0);
        try {
          let success = !1, newGistCreated = !1;
          if (currentGistId) success = await this.updateGistFile(localContent); else {
            const newGistId = await this.createGist(localContent);
            newGistId && (Storage.set(CONFIG.STORAGE.GM_GIST_ID_KEY, newGistId), success = !0, 
            newGistCreated = !0);
          }
          notification.remove(), success && (newGistCreated ? Toast.show("新Gist已创建并自动保存！", "success", 7e3) : Toast.show("配置已成功同步到Gist！", "success"));
        } catch (error) {
          notification.remove();
        }
      }
      static async downloadFromGist() {
        if (!this.getGitHubToken()) return void Toast.show("GitHub Token 未配置。请在设置面板中进行设置。", "error");
        if (!this.getGistId()) return void Toast.show("Gist ID 未配置。请在设置面板中进行设置，或先上传一次。", "warning", 5e3);
        const notification = Toast.show("从Gist下载配置中...", "info", 0);
        try {
          const gistFile = await this.getGistFile();
          notification.remove(), gistFile && gistFile.content ? (Storage.set(CONFIG.STORAGE.LOCALSTORAGE_SITES_KEY, gistFile.content), 
          FloatingNavBar.refreshButtons(), Toast.show("已从Gist下载并覆盖本地配置！", "success", 3e3)) : Toast.show("从Gist下载配置失败，未找到有效内容。", "error");
        } catch (error) {
          notification.remove(), Toast.show("从Gist下载时发生错误。", "error");
        }
      }
      static async autoBackup() {
        const token = this.getGitHubToken(), gistId = this.getGistId();
        if (!token || !gistId) return;
        const lastBackupDate = Storage.get(CONFIG.STORAGE.LAST_BACKUP_DATE_KEY, ""), today = (new Date).toDateString();
        if (lastBackupDate === today) return;
        const localContent = Storage.get(CONFIG.STORAGE.LOCALSTORAGE_SITES_KEY, CONFIG.DEFAULT_SITES) || CONFIG.DEFAULT_SITES;
        try {
          await this.updateGistFile(localContent) && Storage.set(CONFIG.STORAGE.LAST_BACKUP_DATE_KEY, today);
        } catch (e) {}
      }
    }
  }, Symbol.toStringTag, {
    value: "Module"
  }));
}();

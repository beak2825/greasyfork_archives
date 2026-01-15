// ==UserScript==
// @name         98堂-预览
// @version      1.11.3
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  98堂[原色花堂]增强：图片预览 · 无缝翻页
// @match        https://*.sehuatang.net/*
// @match        https://*.sehuatang.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sehuatang.org
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/539274/98%E5%A0%82-%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/539274/98%E5%A0%82-%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

!function() {
  "use strict";
  const CONFIG = {
    defaults: {
      maxPreviewImages: 4,
      concurrencyLimit: 6,
      cacheEnabled: !0,
      cacheSize: 500,
      cacheTTL: 36e5,
      networkTimeout: 5e3,
      maxRetries: 2,
      imageLoadTimeout: 200
    },
    get(key) {
      try {
        const stored = localStorage.getItem("SHT_PREVIEW_CONFIG");
        return (stored ? JSON.parse(stored) : {})[key] ?? this.defaults[key];
      } catch {
        return this.defaults[key];
      }
    },
    set(key, value) {
      try {
        const stored = localStorage.getItem("SHT_PREVIEW_CONFIG"), storedConfig = stored ? JSON.parse(stored) : {};
        storedConfig[key] = value, localStorage.setItem("SHT_PREVIEW_CONFIG", JSON.stringify(storedConfig));
      } catch (e) {}
    },
    getAll() {
      try {
        const stored = localStorage.getItem("SHT_PREVIEW_CONFIG"), storedConfig = stored ? JSON.parse(stored) : {};
        return {
          ...this.defaults,
          ...storedConfig
        };
      } catch {
        return this.defaults;
      }
    }
  }, _StyleManager = class {
    static inject() {
      if (this.injected) return;
      const style = document.createElement("style");
      style.textContent = '.sht-img-grid{display:flex;flex-wrap:nowrap;align-items:stretch;gap:8px;width:100%}.sht-img-item{aspect-ratio:4/3;overflow:hidden;border-radius:4px;position:relative;cursor:pointer;display:flex;align-items:center;justify-content:center;background:#f0f0f0}.sht-img-item-single{aspect-ratio:4/3;max-width:50%;overflow:hidden;border-radius:4px;position:relative;cursor:pointer;display:flex;align-items:center;justify-content:center;background:#f0f0f0}.sht-img-loading{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:sht-loading 1.5s ease-in-out infinite}.sht-img-loading::after{content:"⏳";position:absolute;font-size:24px;opacity:0.5}@keyframes sht-loading{0%{background-position:200% 0}100%{background-position:-200% 0}}.sht-img-loaded img{animation:sht-fade-in 0.3s ease-in}.sht-img-error{background:#ffebee}.sht-img-error::after{content:"❌ 加载失败";position:absolute;font-size:12px;color:#c62828}@keyframes sht-fade-in{from{opacity:0}to{opacity:1}}.sht-img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;opacity:0;transition:opacity 0.3s}.sht-img-loaded .sht-img{opacity:1}.sht-links{margin:10px 0 0 0;padding:8px;background:#fafafa;border:1px solid #eee;border-radius:4px;width:100%;box-sizing:border-box}.sht-link-item{background:#f5f5f5;border:1px solid #e0e0e0;padding:4px 6px;border-radius:3px;margin-bottom:4px;word-break:break-all;cursor:pointer;font-size:12px;color:#666;transition:background 0.2s}.sht-link-item:hover{background:#ebebeb}.sht-link-clickable{background:#f0f7ff;border:1px solid #d0e3f7;color:#4a6fa5;text-decoration:none;display:block}.sht-link-clickable:hover{background:#e3f0ff}.sht-link-icon{margin-right:4px;font-size:10px}.sht-attachments{margin:10px 0 0 0;padding:8px;background:#faf8f5;border:1px solid #ebe6df;border-radius:4px;width:100%;box-sizing:border-box}.sht-attachment-item{margin-bottom:4px}.sht-attachment-item:last-child{margin-bottom:0}.sht-attachment-link{display:flex;align-items:center;padding:6px 8px;background:#f7f5f2;border:1px solid #e5e0d8;border-radius:4px;text-decoration:none;color:#8b7355;font-size:12px;transition:background 0.2s}.sht-attachment-link:hover{background:#f0ede8}.sht-attachment-icon{margin-right:6px;font-size:14px}.sht-attachment-name{flex:1;word-break:break-all}.sht-attachment-size{margin-left:8px;color:#aaa;font-size:11px}.sht-nav-toggle{position:relative;display:inline-block;width:38px;height:20px}.sht-nav-toggle input{opacity:0;width:0;height:0}.sht-nav-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#ddd;border-radius:10px;transition:background 0.3s}.sht-nav-slider:before{position:absolute;content:"";height:16px;width:16px;left:2px;bottom:2px;background:white;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,0.2);transition:transform 0.3s}.sht-nav-toggle input:checked+.sht-nav-slider{background:#4d84c6}.sht-nav-toggle input:checked+.sht-nav-slider:before{transform:translateX(18px)}.sht-nav-active a{background-color:#840000!important;background-image:url(/static/image/common/nv_a.png)!important;background-repeat:no-repeat!important;background-position:50% -33px!important;color:#fff!important;font-weight:700!important;height:33px!important;line-height:33px!important;padding:0 8px!important;box-sizing:border-box!important;text-align:center!important;display:inline-block!important}', 
      document.head.appendChild(style), this.injected = !0;
    }
    static createElement(tag, className, text) {
      const el = document.createElement(tag);
      return className && (el.className = className), text && (el.textContent = text), 
      el;
    }
    static setImageGridWidth(container, count) {
      const imageWidth = `calc((100% - ${8 * (count - 1)}px) / ${count})`;
      Array.from(container.children).forEach(child => {
        child.style.width = imageWidth, child.style.flex = "0 0 auto";
      });
    }
  };
  _StyleManager.injected = !1;
  let StyleManager = _StyleManager;
  const _Lightbox = class {
    static init() {
      this.overlay || (this.overlay = document.createElement("div"), this.overlay.style.cssText = "\n      position: fixed;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      background: rgba(0, 0, 0, 0.95);\n      z-index: 999999;\n      display: none;\n      align-items: center;\n      justify-content: center;\n    ", 
      this.img = document.createElement("img"), this.img.style.cssText = "\n      width: 80vw;\n      height: 80vh;\n      max-width: 90%;\n      max-height: 90%;\n      object-fit: contain;\n      border-radius: 4px;\n    ", 
      this.counter = document.createElement("div"), this.counter.style.cssText = "\n      position: absolute;\n      top: 20px;\n      left: 50%;\n      transform: translateX(-50%);\n      color: white;\n      background: rgba(0, 0, 0, 0.6);\n      padding: 8px 16px;\n      border-radius: 20px;\n      font-size: 14px;\n    ", 
      this.prevBtn = this.createNavButton("‹", "left"), this.nextBtn = this.createNavButton("›", "right"), 
      this.closeBtn = this.createCloseButton(), this.overlay.appendChild(this.img), this.overlay.appendChild(this.counter), 
      this.overlay.appendChild(this.prevBtn), this.overlay.appendChild(this.nextBtn), 
      this.overlay.appendChild(this.closeBtn), document.body.appendChild(this.overlay), 
      this.setupEvents());
    }
    static createNavButton(content, position) {
      const btn = document.createElement("button");
      return btn.innerHTML = "‹" === content ? '<svg viewBox="0 0 24 24" fill="white" width="50" height="50"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>' : '<svg viewBox="0 0 24 24" fill="white" width="50" height="50"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>', 
      btn.style.cssText = `\n      position: fixed;\n      ${position}: 20px;\n      top: 50%;\n      transform: translateY(-50%);\n      width: 60px;\n      height: 240px;\n      background: rgba(255, 255, 255, 0.1);\n      border-radius: 30px;\n      border: none;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      color: white;\n      cursor: pointer;\n      user-select: none;\n      z-index: 10002;\n      transition: all 0.3s;\n      backdrop-filter: blur(4px);\n    `, 
      btn.onmouseover = () => {
        btn.style.background = "rgba(255, 255, 255, 0.2)", btn.style.width = "70px";
      }, btn.onmouseout = () => {
        btn.style.background = "rgba(255, 255, 255, 0.1)", btn.style.width = "60px";
      }, btn;
    }
    static createCloseButton() {
      const btn = document.createElement("button");
      return btn.innerHTML = '<svg viewBox="0 0 24 24" fill="white" width="30" height="30"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>', 
      btn.style.cssText = "\n      position: fixed;\n      right: 20px;\n      top: 20px;\n      width: 50px;\n      height: 50px;\n      background: rgba(255, 255, 255, 0.2);\n      border-radius: 50%;\n      border: none;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      cursor: pointer;\n      user-select: none;\n      z-index: 10002;\n      transition: background 0.2s;\n    ", 
      btn.onmouseover = () => {
        btn.style.background = "rgba(255, 255, 255, 0.3)";
      }, btn.onmouseout = () => {
        btn.style.background = "rgba(255, 255, 255, 0.2)";
      }, btn;
    }
    static setupEvents() {
      this.overlay.onclick = () => {
        this.close();
      }, this.prevBtn.onclick = e => {
        e.stopPropagation(), this.prev();
      }, this.nextBtn.onclick = e => {
        e.stopPropagation(), this.next();
      }, this.closeBtn.onclick = e => {
        e.stopPropagation(), this.close();
      }, document.addEventListener("keydown", e => {
        "flex" === this.overlay?.style.display && ("Escape" === e.key ? this.close() : "ArrowLeft" === e.key ? this.prev() : "ArrowRight" === e.key && this.next());
      });
    }
    static show(images, index = 0) {
      this.init(), this.images = images, this.currentIndex = index, this.updateImage(), 
      this.overlay.style.display = "flex";
    }
    static close() {
      this.overlay && (this.overlay.style.display = "none");
    }
    static prev() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length, 
      this.updateImage();
    }
    static next() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length, this.updateImage();
    }
    static updateImage() {
      const url = this.images[this.currentIndex];
      this.img.style.display = "none", this.img.src = "", this.counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`, 
      this.images.length <= 1 ? (this.prevBtn.style.display = "none", this.nextBtn.style.display = "none", 
      this.counter.style.display = "none") : (this.prevBtn.style.display = "flex", this.nextBtn.style.display = "flex", 
      this.counter.style.display = "block"), this.img.onload = () => {
        this.img.style.display = "block";
      }, this.img.onerror = () => {
        this.img.alt = "图片加载失败";
      }, this.img.src = url;
    }
  };
  _Lightbox.overlay = null, _Lightbox.img = null, _Lightbox.counter = null, _Lightbox.prevBtn = null, 
  _Lightbox.nextBtn = null, _Lightbox.closeBtn = null, _Lightbox.images = [], _Lightbox.currentIndex = 0;
  let Lightbox = _Lightbox;
  const _ImageProxy = class {
    static getStorageKeys() {
      return this.STORAGE_KEYS;
    }
    static getLevelConfigs() {
      return this.LEVEL_CONFIGS;
    }
    static isEnabled() {
      const stored = localStorage.getItem(this.STORAGE_KEYS.ENABLED), hasProxy = this.hasProxyUrl();
      return "true" === stored && hasProxy;
    }
    static setEnabled(enabled) {
      localStorage.setItem(this.STORAGE_KEYS.ENABLED, String(enabled));
    }
    static getRawEnabled() {
      return "true" === localStorage.getItem(this.STORAGE_KEYS.ENABLED);
    }
    static hasProxyUrl() {
      const url = localStorage.getItem(this.STORAGE_KEYS.PROXY_URL);
      return !(!url || !url.trim());
    }
    static getProxyUrl() {
      return localStorage.getItem(this.STORAGE_KEYS.PROXY_URL) || "";
    }
    static setProxyUrl(url) {
      if (url && url.trim()) {
        let normalizedUrl = url.trim();
        normalizedUrl.endsWith("/") || (normalizedUrl += "/"), localStorage.setItem(this.STORAGE_KEYS.PROXY_URL, normalizedUrl);
      } else localStorage.removeItem(this.STORAGE_KEYS.PROXY_URL), this.setEnabled(!1);
    }
    static getCompressionLevel() {
      const stored = localStorage.getItem(this.STORAGE_KEYS.COMPRESSION_LEVEL);
      return !stored || "low" !== stored && "medium" !== stored && "high" !== stored ? "medium" : stored;
    }
    static setCompressionLevel(level) {
      localStorage.setItem(this.STORAGE_KEYS.COMPRESSION_LEVEL, level);
    }
    static isTargetHost(url) {
      return !(url.includes("/static/") || url.includes("icon") || url.includes("avatar")) && ([ "ymawv.la", "wmaiv.la", "iili.io", "7pzzv.us" ].some(host => url.includes(host)) || url.toLowerCase().endsWith(".gif"));
    }
    static getCompressedUrl(originalUrl) {
      const proxyUrl = this.getProxyUrl();
      if (!proxyUrl) return null;
      try {
        const cleanUrl = originalUrl.replace(/^https?:\/\//, ""), isGif = originalUrl.toLowerCase().endsWith(".gif"), level = this.getCompressionLevel(), levelConfig = this.LEVEL_CONFIGS[level], conf = isGif ? levelConfig.animated : levelConfig.static;
        let params = `url=${encodeURIComponent(cleanUrl)}&w=${conf.w}&q=${conf.q}&output=${conf.fmt}`;
        return void 0 !== conf.n && (params += `&n=${conf.n}`), `${proxyUrl}?${params}`;
      } catch {
        return null;
      }
    }
    static async load(img, originalUrl, isHighPriority = !1) {
      if (isHighPriority && img.setAttribute("fetchpriority", "high"), !this.isEnabled()) return this.directLoad(img, originalUrl);
      if (!this.isTargetHost(originalUrl)) return this.directLoad(img, originalUrl);
      const compressedUrl = this.getCompressedUrl(originalUrl);
      return compressedUrl ? this.loadWithFallback(img, compressedUrl, originalUrl) : this.directLoad(img, originalUrl);
    }
    static loadWithFallback(img, proxyUrl, originalUrl) {
      return new Promise((resolve, reject) => {
        let timeoutId, resolved = !1;
        const cleanup = () => {
          resolved = !0, timeoutId && clearTimeout(timeoutId), img.onload = null, img.onerror = null;
        };
        timeoutId = window.setTimeout(() => {
          resolved || (cleanup(), this.directLoad(img, originalUrl).then(resolve).catch(reject));
        }, this.TIMEOUT_MS), img.decoding = "async", img.onload = () => {
          resolved || (cleanup(), resolve());
        }, img.onerror = () => {
          resolved || (cleanup(), this.directLoad(img, originalUrl).then(resolve).catch(reject));
        }, img.src = proxyUrl;
      });
    }
    static directLoad(img, url) {
      return new Promise((resolve, reject) => {
        img.decoding = "async", img.onload = () => {
          img.onload = null, img.onerror = null, resolve();
        }, img.onerror = () => {
          img.onload = null, img.onerror = null, reject(new Error("加载失败"));
        }, img.src = url;
      });
    }
    static async testProxy(proxyUrl) {
      if (!proxyUrl || !proxyUrl.trim()) return {
        success: !1,
        message: "请输入代理地址"
      };
      try {
        let normalizedUrl = proxyUrl.trim();
        normalizedUrl.endsWith("/") || (normalizedUrl += "/");
        const testUrl = `${normalizedUrl}?url=${encodeURIComponent("https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png".replace(/^https?:\/\//, ""))}&w=50&q=50&output=webp`, result = await Promise.race([ fetch(testUrl, {
          method: "HEAD"
        }), new Promise((_, reject) => setTimeout(() => reject(new Error("超时")), 5e3)) ]);
        return result.ok ? {
          success: !0,
          message: "代理可用 ✓"
        } : {
          success: !1,
          message: `代理返回错误: ${result.status}`
        };
      } catch (error) {
        return {
          success: !1,
          message: `测试失败: ${error.message}`
        };
      }
    }
  };
  _ImageProxy.STORAGE_KEYS = {
    ENABLED: "SHT_IMAGE_ACCELERATION_ENABLED",
    PROXY_URL: "SHT_IMAGE_PROXY_URL",
    COMPRESSION_LEVEL: "SHT_IMAGE_COMPRESSION_LEVEL"
  }, _ImageProxy.TIMEOUT_MS = 1e4, _ImageProxy.LEVEL_CONFIGS = {
    low: {
      label: "低",
      desc: "最快速度，图片可能稍微模糊",
      static: {
        w: 300,
        q: 60,
        fmt: "webp"
      },
      animated: {
        w: 300,
        q: 50,
        fmt: "webp",
        n: -1
      }
    },
    medium: {
      label: "中",
      desc: "平衡速度和质量",
      static: {
        w: 400,
        q: 75,
        fmt: "webp"
      },
      animated: {
        w: 400,
        q: 65,
        fmt: "webp",
        n: -1
      }
    },
    high: {
      label: "高",
      desc: "保持清晰，适度压缩",
      static: {
        w: 600,
        q: 85,
        fmt: "webp"
      },
      animated: {
        w: 500,
        q: 75,
        fmt: "webp",
        n: -1
      }
    }
  };
  let ImageProxy = _ImageProxy;
  const _ImageLoader = class {
    static preconnect(url) {
      try {
        const hostname = new URL(url).hostname;
        if (this.preconnectedHosts.has(hostname)) return;
        this.preconnectedHosts.add(hostname);
        const head = document.head, link1 = document.createElement("link");
        link1.rel = "dns-prefetch", link1.href = `//${hostname}`, head.appendChild(link1);
        const link2 = document.createElement("link");
        link2.rel = "preconnect", link2.href = `//${hostname}`, link2.crossOrigin = "anonymous", 
        head.appendChild(link2);
      } catch {}
    }
    static async loadImage(img, url, isHighPriority = !1) {
      return ImageProxy.load(img, url, isHighPriority);
    }
    static async queueLoad(img, url, priority = 0) {
      const loadTask = async () => {
        this.loadingCount++;
        try {
          await this.loadImage(img, url, priority > 50);
        } finally {
          this.loadingCount--, this.processQueue();
        }
      };
      return this.loadingCount < this.MAX_CONCURRENT ? loadTask() : new Promise((resolve, reject) => {
        const task = async () => {
          try {
            await loadTask(), resolve();
          } catch (error) {
            reject(error);
          }
        };
        task.priority = priority;
        const index = this.queue.findIndex(t => (t.priority || 0) < priority);
        -1 === index ? this.queue.push(task) : this.queue.splice(index, 0, task);
      });
    }
    static processQueue() {
      for (;this.loadingCount < this.MAX_CONCURRENT && this.queue.length > 0; ) {
        const task = this.queue.shift();
        task && task();
      }
    }
    static preconnectBatch(urls) {
      [ ...new Set(urls.map(url => {
        try {
          return new URL(url).hostname;
        } catch {
          return null;
        }
      }).filter(Boolean)) ].forEach(host => {
        host && this.preconnect(`https://${host}`);
      });
    }
  };
  _ImageLoader.MAX_CONCURRENT = 8, _ImageLoader.loadingCount = 0, _ImageLoader.queue = [], 
  _ImageLoader.preconnectedHosts = new Set;
  let ImageLoader = _ImageLoader;
  class UIComponents {
    static createToggleSwitch(label, options) {
      const container = document.createElement("div");
      container.style.display = "flex", container.style.alignItems = "center";
      const labelSpan = document.createElement("span");
      labelSpan.textContent = `${label}：`, labelSpan.style.cssText = "font-size: 13px; color: #666; margin-right: 6px; line-height: 20px;", 
      container.appendChild(labelSpan);
      const switchLabel = StyleManager.createElement("label", "sht-nav-toggle"), input = document.createElement("input");
      input.type = "checkbox";
      const slider = StyleManager.createElement("span", "sht-nav-slider");
      switchLabel.appendChild(input), switchLabel.appendChild(slider), container.appendChild(switchLabel);
      const storedValue = localStorage.getItem(options.storageKeyEnabled);
      let enabled = null === storedValue ? options.defaultEnabled ?? !1 : "true" === storedValue;
      return input.addEventListener("change", () => {
        enabled = input.checked, localStorage.setItem(options.storageKeyEnabled, String(enabled)), 
        enabled ? options.onEnable() : options.onDisable();
      }), input.checked = enabled, enabled && options.onEnable(), container;
    }
    static setupSearchTitleContainer() {
      const titleContainer = document.querySelector(".sttl.mbn");
      return titleContainer ? (titleContainer.style.display = "flex", titleContainer.style.justifyContent = "space-between", 
      titleContainer.style.alignItems = "center", titleContainer) : null;
    }
    static isClickableLink(link) {
      return link.startsWith("thunder://") || link.startsWith("https://") || link.startsWith("http://");
    }
    static createLinksElement(links) {
      const allLinks = [ ...links.ed2k, ...links.magnet, ...links.xunlei, ...links.baidu ];
      if (0 === allLinks.length) return null;
      const container = StyleManager.createElement("div", "sht-links");
      if (allLinks.forEach((link, index) => {
        const linkDiv = document.createElement("div");
        if (linkDiv.style.marginBottom = "4px", this.isClickableLink(link)) {
          const linkAnchor = document.createElement("a");
          linkAnchor.href = link, linkAnchor.target = "_blank", linkAnchor.rel = "noopener noreferrer", 
          linkAnchor.className = "sht-link-item sht-link-clickable", linkAnchor.innerHTML = `<span class="sht-link-icon">🔗</span>${link}`, 
          linkAnchor.title = "点击打开链接", linkAnchor.addEventListener("click", e => {
            e.stopPropagation();
          }), linkDiv.appendChild(linkAnchor);
        } else {
          const linkBox = StyleManager.createElement("div", "sht-link-item");
          linkBox.innerHTML = `<span class="sht-link-icon">📋</span>${link}`, linkBox.title = "点击复制链接", 
          linkBox.addEventListener("click", e => {
            e.preventDefault(), e.stopPropagation(), navigator.clipboard.writeText(link).then(() => {
              const originalText = linkBox.innerHTML;
              linkBox.innerHTML = '<span class="sht-link-icon">✅</span>已复制！', linkBox.style.background = "#c8e6c9", 
              setTimeout(() => {
                linkBox.innerHTML = originalText, linkBox.style.background = "";
              }, 1e3);
            }).catch(() => {});
          }), linkDiv.appendChild(linkBox);
        }
        index > 0 && (linkDiv.style.display = "none", linkDiv.classList.add("hidden-link")), 
        container.appendChild(linkDiv);
      }), allLinks.length > 1) {
        const toggleButton = document.createElement("button");
        toggleButton.textContent = `显示剩余 ${allLinks.length - 1} 个链接`, toggleButton.style.cssText = "margin-top: 5px; cursor: pointer; border: 1px solid #ccc; background-color: #f0f0f0; padding: 5px 10px; border-radius: 4px;";
        let expanded = !1;
        toggleButton.addEventListener("click", e => {
          e.preventDefault(), e.stopPropagation(), expanded = !expanded, container.querySelectorAll(".hidden-link").forEach(l => {
            l.style.display = expanded ? "block" : "none";
          }), toggleButton.textContent = expanded ? "收起链接" : `显示剩余 ${allLinks.length - 1} 个链接`;
        }), container.appendChild(toggleButton);
      }
      return container;
    }
    static createNormalPageToggle(options) {
      const navMenu = document.querySelector("#nv ul");
      if (!navMenu) return;
      const infiniteScrollLi = document.createElement("li"), toggleContainer = document.createElement("div");
      toggleContainer.id = "nav-toggle-infinite-scroll";
      const toggleLink = document.createElement("a");
      toggleLink.href = "javascript:;", toggleLink.textContent = "无缝翻页", toggleContainer.appendChild(toggleLink), 
      infiniteScrollLi.appendChild(toggleContainer), navMenu.appendChild(infiniteScrollLi);
      const storedValue = localStorage.getItem(options.storageKeyEnabled);
      let enabled = null === storedValue ? options.defaultEnabled ?? !1 : "true" === storedValue;
      const originalWidth = toggleLink.offsetWidth || 68, updateToggle = () => {
        enabled ? (toggleContainer.classList.add("a"), toggleContainer.classList.add("sht-nav-active"), 
        toggleLink.style.minWidth = `${originalWidth}px`, toggleLink.style.width = `${originalWidth}px`) : (toggleContainer.classList.remove("a"), 
        toggleContainer.classList.remove("sht-nav-active"), toggleContainer.classList.remove("hover"), 
        toggleLink.style.cssText = "");
      };
      toggleContainer.addEventListener("click", e => {
        e.preventDefault(), enabled = !enabled, localStorage.setItem(options.storageKeyEnabled, String(enabled)), 
        updateToggle(), enabled ? options.onEnable() : options.onDisable();
      }), updateToggle(), enabled && options.onEnable();
      const settingsLi = document.createElement("li"), settingsContainer = document.createElement("div");
      settingsContainer.id = "nav-toggle-settings";
      const settingsLink = document.createElement("a");
      settingsLink.href = "javascript:;", settingsLink.textContent = "脚本设置", settingsLink.title = "点击打开脚本设置面板", 
      settingsContainer.appendChild(settingsLink), settingsLi.appendChild(settingsContainer), 
      navMenu.appendChild(settingsLi), settingsContainer.addEventListener("click", e => {
        e.preventDefault(), this.showSettingsPanel();
      });
    }
    static showSettingsPanel() {
      const existingPanel = document.getElementById("sht-settings-panel"), existingOverlay = document.getElementById("sht-settings-overlay");
      if (existingPanel) return existingPanel.remove(), void existingOverlay?.remove();
      const overlay = document.createElement("div");
      overlay.id = "sht-settings-overlay", overlay.style.cssText = "\n      position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n      background: rgba(0,0,0,0.5); z-index: 99998;\n    ";
      const panel = document.createElement("div");
      panel.id = "sht-settings-panel", panel.style.cssText = "\n      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);\n      background: #fff; border-radius: 12px; padding: 24px; z-index: 99999;\n      box-shadow: 0 8px 32px rgba(0,0,0,0.3); min-width: 420px; max-width: 90vw;\n      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n      max-height: 90vh; overflow-y: auto;\n    ";
      const levelConfigs = ImageProxy.getLevelConfigs(), currentLevel = ImageProxy.getCompressionLevel(), currentProxyUrl = ImageProxy.getProxyUrl(), hasProxy = ImageProxy.hasProxyUrl(), accelEnabled = ImageProxy.getRawEnabled(), currentPreviewCount = CONFIG.get("maxPreviewImages");
      panel.innerHTML = `\n      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 16px;">\n        <h3 style="margin: 0; font-size: 18px; color: #333;">⚙️ 脚本设置</h3>\n        <button id="sht-settings-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999; line-height: 1;">&times;</button>\n      </div>\n      \n      \x3c!-- 预览图张数设置 --\x3e\n      <div style="margin-bottom: 24px; padding: 16px; background: #f8f9fa; border-radius: 10px;">\n        <label style="display: block; font-weight: 600; margin-bottom: 12px; color: #333;">🖼️ 预览图张数</label>\n        <div style="display: flex; gap: 10px;">\n          ${[ 3, 4, 5 ].map(num => `\n            <label style="flex: 1; padding: 10px; border: 2px solid ${num === currentPreviewCount ? "#2196F3" : "#ddd"}; \n              border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s;\n              background: ${num === currentPreviewCount ? "#e3f2fd" : "#fff"};">\n              <input type="radio" name="preview-count" value="${num}" \n                ${num === currentPreviewCount ? "checked" : ""} style="display: none;">\n              <div style="font-size: 18px; font-weight: 600;">${num}</div>\n              <div style="font-size: 11px; color: #666;">张</div>\n            </label>\n          `).join("")}\n        </div>\n        <div style="font-size: 12px; color: #999; margin-top: 8px;">每个帖子显示的预览图数量</div>\n      </div>\n\n      \x3c!-- 图片加速设置区域 --\x3e\n      <div style="margin-bottom: 24px; padding: 16px; background: #f8f9fa; border-radius: 10px;">\n        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">\n          <label style="font-weight: 600; color: #333;">🚀 图片加速</label>\n          <label style="position: relative; display: inline-block; width: 50px; height: 26px;">\n            <input type="checkbox" id="sht-accel-toggle" ${accelEnabled && hasProxy ? "checked" : ""} ${hasProxy ? "" : "disabled"}\n              style="opacity: 0; width: 0; height: 0;">\n            <span style="position: absolute; cursor: ${hasProxy ? "pointer" : "not-allowed"}; top: 0; left: 0; right: 0; bottom: 0; \n              background-color: ${accelEnabled && hasProxy ? "#4CAF50" : "#ccc"}; transition: .3s; border-radius: 26px;\n              opacity: ${hasProxy ? "1" : "0.6"};">\n              <span style="position: absolute; content: ''; height: 20px; width: 20px; left: ${accelEnabled && hasProxy ? "26px" : "3px"}; bottom: 3px; \n                background-color: white; transition: .3s; border-radius: 50%;"></span>\n            </span>\n          </label>\n        </div>\n        \n        <div style="font-size: 13px; color: #666; margin-bottom: 16px; padding: 10px; background: ${hasProxy ? "#e8f5e9" : "#fff3e0"}; border-radius: 6px;">\n          ${hasProxy ? "✅ 已设置代理，可使用图片加速功能" : "⚠️ 请先设置代理地址才能开启图片加速<br>💡 利用代理压缩图片加速加载，需要自行部署代理服务"}\n        </div>\n\n        <div style="margin-bottom: 16px;">\n          <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #555; font-size: 14px;">🔧 代理地址</label>\n          <input type="text" id="sht-proxy-url" placeholder="自行搭建或寻找公益图片代理服务" \n            value="${currentProxyUrl}"\n            style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; box-sizing: border-box;">\n          <div style="margin-top: 8px; display: flex; align-items: center; gap: 10px;">\n            <button id="sht-test-proxy" style="padding: 6px 12px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; font-size: 13px;">\n              🔍 测试代理\n            </button>\n            <span id="sht-proxy-test-result" style="font-size: 13px;"></span>\n          </div>\n        </div>\n\n        <div>\n          <label style="display: block; font-weight: 500; margin-bottom: 10px; color: #555; font-size: 14px;">⚡ 压缩等级</label>\n          <div style="display: flex; gap: 8px;">\n            ${[ "low", "medium", "high" ].map(level => `\n              <label class="sht-level-label" style="flex: 1; padding: 10px 8px; border: 2px solid ${level === currentLevel ? "#4CAF50" : "#ddd"}; \n                border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s;\n                background: ${level === currentLevel ? "#e8f5e9" : "#fff"};">\n                <input type="radio" name="compression-level" value="${level}" \n                  ${level === currentLevel ? "checked" : ""} style="display: none;">\n                <div style="font-size: 14px; font-weight: 600; margin-bottom: 2px;">${levelConfigs[level].label}</div>\n                <div style="font-size: 10px; color: #666; line-height: 1.3;">${levelConfigs[level].desc}</div>\n              </label>\n            `).join("")}\n          </div>\n        </div>\n      </div>\n\n      <div style="display: flex; gap: 12px;">\n        <button id="sht-settings-save" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #4CAF50, #45a049); \n          color: #fff; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer;">\n          ✓ 保存设置\n        </button>\n        <button id="sht-settings-cancel" style="padding: 12px 20px; background: #f5f5f5; color: #666; \n          border: 1px solid #ddd; border-radius: 8px; font-size: 15px; cursor: pointer;">\n          取消\n        </button>\n      </div>\n    `, 
      overlay.addEventListener("click", () => {
        overlay.remove(), panel.remove();
      }), document.body.appendChild(overlay), document.body.appendChild(panel);
      const closePanel = () => {
        overlay.remove(), panel.remove();
      };
      panel.querySelector("#sht-settings-close")?.addEventListener("click", closePanel), 
      panel.querySelector("#sht-settings-cancel")?.addEventListener("click", closePanel), 
      panel.querySelectorAll('input[name="preview-count"]').forEach(input => {
        input.addEventListener("change", () => {
          panel.querySelectorAll('input[name="preview-count"]').forEach(inp => {
            const label = inp.closest("label");
            if (label) {
              const isChecked = inp.checked;
              label.style.borderColor = isChecked ? "#2196F3" : "#ddd", label.style.background = isChecked ? "#e3f2fd" : "#fff";
            }
          });
        });
      });
      const levelLabels = panel.querySelectorAll(".sht-level-label");
      levelLabels.forEach(label => {
        label.addEventListener("click", () => {
          levelLabels.forEach(l => {
            l.style.borderColor = "#ddd", l.style.background = "#fff";
          }), label.style.borderColor = "#4CAF50", label.style.background = "#e8f5e9";
        });
      });
      const proxyInput = panel.querySelector("#sht-proxy-url"), accelToggle = panel.querySelector("#sht-accel-toggle"), toggleSlider = accelToggle.nextElementSibling, toggleDot = toggleSlider?.querySelector("span"), statusDiv = panel.querySelector('div[style*="background: #e8f5e9"], div[style*="background: #fff3e0"]'), updateToggleUI = (enabled, hasProxyNow) => {
        accelToggle.disabled = !hasProxyNow, toggleSlider.style.cursor = hasProxyNow ? "pointer" : "not-allowed", 
        toggleSlider.style.opacity = hasProxyNow ? "1" : "0.6", toggleSlider.style.backgroundColor = enabled && hasProxyNow ? "#4CAF50" : "#ccc", 
        toggleDot && (toggleDot.style.left = enabled && hasProxyNow ? "26px" : "3px"), statusDiv && (statusDiv.style.background = hasProxyNow ? "#e8f5e9" : "#fff3e0", 
        statusDiv.innerHTML = hasProxyNow ? "✅ 已设置代理，可使用图片加速功能" : "⚠️ 请先设置代理地址才能开启图片加速<br>💡 利用代理压缩图片加速加载，需要自行部署代理服务");
      };
      proxyInput.addEventListener("input", () => {
        const hasProxyNow = !!proxyInput.value.trim();
        hasProxyNow || (accelToggle.checked = !1), updateToggleUI(accelToggle.checked, hasProxyNow);
      }), accelToggle.addEventListener("change", () => {
        const hasProxyNow = !!proxyInput.value.trim();
        updateToggleUI(accelToggle.checked, hasProxyNow);
      }), panel.querySelector("#sht-test-proxy")?.addEventListener("click", async () => {
        const resultSpan = panel.querySelector("#sht-proxy-test-result"), testUrl = proxyInput.value.trim();
        if (!testUrl) return resultSpan.textContent = "请输入代理地址", void (resultSpan.style.color = "#f44336");
        resultSpan.textContent = "测试中...", resultSpan.style.color = "#666";
        const result = await ImageProxy.testProxy(testUrl);
        resultSpan.textContent = result.message, resultSpan.style.color = result.success ? "#4CAF50" : "#f44336";
      }), panel.querySelector("#sht-settings-save")?.addEventListener("click", () => {
        const selectedPreviewCount = panel.querySelector('input[name="preview-count"]:checked'), selectedLevel = panel.querySelector('input[name="compression-level"]:checked');
        let needsReload = !1;
        if (selectedPreviewCount) {
          const newCount = parseInt(selectedPreviewCount.value);
          newCount !== CONFIG.get("maxPreviewImages") && (CONFIG.set("maxPreviewImages", newCount), 
          needsReload = !0);
        }
        const newProxyUrl = proxyInput.value.trim();
        newProxyUrl !== ImageProxy.getProxyUrl() && ImageProxy.setProxyUrl(newProxyUrl);
        const wasEnabled = ImageProxy.isEnabled();
        ImageProxy.setEnabled(accelToggle.checked), wasEnabled !== ImageProxy.isEnabled() && (needsReload = !0), 
        selectedLevel && ImageProxy.setCompressionLevel(selectedLevel.value), closePanel(), 
        needsReload && location.reload();
      });
    }
    static createSearchPageSingleToggle(infiniteScrollOptions) {
      const titleContainer = this.setupSearchTitleContainer();
      if (!titleContainer) return;
      const controlsContainer = document.createElement("div");
      controlsContainer.style.display = "flex", controlsContainer.style.alignItems = "center";
      const toggleSwitch = this.createToggleSwitch("无缝翻页", infiniteScrollOptions);
      controlsContainer.appendChild(toggleSwitch), titleContainer.appendChild(controlsContainer);
    }
    static createSearchPageDualToggles(infiniteScrollOptions, removeHiddenOptions) {
      const titleContainer = this.setupSearchTitleContainer();
      if (!titleContainer) return;
      const controlsContainer = document.createElement("div");
      controlsContainer.style.display = "flex", controlsContainer.style.alignItems = "center", 
      controlsContainer.style.gap = "20px", controlsContainer.appendChild(this.createToggleSwitch("无缝翻页", infiniteScrollOptions)), 
      controlsContainer.appendChild(this.createToggleSwitch("移除隐藏贴", removeHiddenOptions)), 
      titleContainer.appendChild(controlsContainer);
    }
    static createAttachmentsElement(attachments) {
      if (0 === attachments.length) return null;
      const container = StyleManager.createElement("div", "sht-attachments");
      return attachments.forEach(attachment => {
        const attachDiv = document.createElement("div");
        attachDiv.className = "sht-attachment-item";
        const attachLink = document.createElement("a");
        attachLink.href = attachment.url, attachLink.target = "_blank", attachLink.rel = "noopener noreferrer", 
        attachLink.className = "sht-attachment-link", attachLink.title = "点击下载附件";
        const icon = document.createElement("span");
        icon.className = "sht-attachment-icon", icon.textContent = "📎";
        const name = document.createElement("span");
        if (name.className = "sht-attachment-name", name.textContent = attachment.name, 
        attachLink.appendChild(icon), attachLink.appendChild(name), attachment.size) {
          const size = document.createElement("span");
          size.className = "sht-attachment-size", size.textContent = `(${attachment.size})`, 
          attachLink.appendChild(size);
        }
        attachDiv.appendChild(attachLink), container.appendChild(attachDiv);
      }), container;
    }
    static createImageGridPreview(container, _titleLink, limitedImages, downloadLinks, attachments) {
      if (limitedImages.length > 0) {
        const imgContainer = StyleManager.createElement("div", "sht-img-grid");
        limitedImages.forEach(imgEl => {
          const imgSrc = imgEl.getAttribute("file"), imgWrapperClass = 1 === limitedImages.length ? "sht-img-item-single" : "sht-img-item", imgWrapper = StyleManager.createElement("div", imgWrapperClass);
          imgWrapper.classList.add("sht-img-loading");
          const img = StyleManager.createElement("img", "sht-img");
          img.dataset.src = imgSrc, img.alt = "预览图", img.addEventListener("load", () => {
            imgWrapper.classList.remove("sht-img-loading"), imgWrapper.classList.add("sht-img-loaded");
          }), img.addEventListener("error", () => {
            imgWrapper.classList.remove("sht-img-loading"), imgWrapper.classList.add("sht-img-error");
          }), imgWrapper.addEventListener("click", e => {
            e.preventDefault(), e.stopPropagation();
            const allLoadedSrcs = Array.from(imgContainer.querySelectorAll("img.sht-img")).map(el => el.src).filter(src => src && !src.startsWith("data:")), currentIdx = allLoadedSrcs.indexOf(img.src);
            Lightbox.show(allLoadedSrcs, currentIdx >= 0 ? currentIdx : 0);
          }), imgWrapper.appendChild(img), imgContainer.appendChild(imgWrapper);
        }), StyleManager.setImageGridWidth(imgContainer, limitedImages.length), container.appendChild(imgContainer), 
        this.observeImagesForLazyLoad(imgContainer);
      }
      if (!([ ...downloadLinks.ed2k, ...downloadLinks.magnet, ...downloadLinks.xunlei, ...downloadLinks.baidu ].length > 0) && attachments && attachments.length > 0) {
        const attachmentsElement = this.createAttachmentsElement(attachments);
        attachmentsElement && container.appendChild(attachmentsElement);
      }
      const linksElement = this.createLinksElement(downloadLinks);
      linksElement && (linksElement.className = "sht-links", container.appendChild(linksElement));
    }
    static observeImagesForLazyLoad(container) {
      const images = container.querySelectorAll("img[data-src]");
      if (0 === images.length) return;
      const allUrls = Array.from(images).map(img => img.dataset.src).filter(Boolean);
      ImageLoader.preconnectBatch(allUrls), ImageLoader.preconnect("https://images.weserv.nl"), 
      images.forEach(img => {
        const imgElement = img, src = imgElement.dataset.src;
        src && ImageLoader.queueLoad(imgElement, src, 50).catch(() => {
          imgElement.closest(".sht-img-item, .sht-img-item-single")?.classList.add("sht-img-error");
        });
      });
    }
  }
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const _Logger = class {
    static info(message) {}
    static error(message, error) {}
    static warn(message) {}
  };
  _Logger.PREFIX = "[98堂]";
  let Logger = _Logger;
  class PreviewCache {
    constructor() {
      this.cache = new Map, this.maxSize = 500, this.normalTtl = 36e5, this.highTtl = 72e5, 
      this.lastCleanup = Date.now(), this.cleanupInterval = 3e5;
    }
    set(key, data, priority = "normal") {
      if (this.scheduleCleanup(), this.cache.size >= this.maxSize) for (const [k, v] of this.cache.entries()) if ("normal" === v.priority) {
        this.cache.delete(k);
        break;
      }
      this.cache.set(key, {
        data: data,
        timestamp: Date.now(),
        priority: priority
      });
    }
    get(key) {
      const item = this.cache.get(key);
      if (!item) return null;
      const ttl = "high" === item.priority ? this.highTtl : this.normalTtl;
      return Date.now() - item.timestamp > ttl ? (this.cache.delete(key), null) : item.data;
    }
    has(key) {
      const item = this.cache.get(key);
      if (!item) return !1;
      const ttl = "high" === item.priority ? this.highTtl : this.normalTtl;
      return !(Date.now() - item.timestamp > ttl && (this.cache.delete(key), 1));
    }
    scheduleCleanup() {
      const now = Date.now();
      now - this.lastCleanup > this.cleanupInterval && (this.cleanup(), this.lastCleanup = now);
    }
    cleanup() {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        const ttl = "high" === item.priority ? this.highTtl : this.normalTtl;
        now - item.timestamp > ttl && this.cache.delete(key);
      }
    }
    clear() {
      this.cache.clear();
    }
    size() {
      return this.cache.size;
    }
    getStats() {
      let high = 0, normal = 0;
      for (const item of this.cache.values()) "high" === item.priority ? high++ : normal++;
      return {
        total: this.cache.size,
        high: high,
        normal: normal
      };
    }
  }
  class ConcurrencyManager {
    constructor(limit) {
      this.queue = [], this.activeCount = 0, this.limit = limit;
    }
    async addTask(task) {
      return new Promise((resolve, reject) => {
        this.queue.push({
          task: task,
          resolve: resolve,
          reject: reject
        }), this._next();
      });
    }
    _next() {
      if (this.activeCount >= this.limit || 0 === this.queue.length) return;
      this.activeCount++;
      const {task: task, resolve: resolve, reject: reject} = this.queue.shift(), delay2 = 50 + 100 * Math.random();
      setTimeout(() => {
        task().then(resolve, reject).finally(() => {
          this.activeCount--, this._next();
        });
      }, delay2);
    }
    getActiveCount() {
      return this.activeCount;
    }
    getQueueLength() {
      return this.queue.length;
    }
    clear() {
      this.queue.forEach(({reject: reject}) => reject(new Error("Task cancelled"))), this.queue = [];
    }
  }
  const previewCache = new PreviewCache, CacheManager = Object.freeze(Object.defineProperty({
    __proto__: null,
    ConcurrencyManager: ConcurrencyManager,
    PreviewCache: PreviewCache,
    previewCache: previewCache
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  async function fetchWithTimeout(url, options = {}) {
    const {timeout: timeout = 5e3, ...fetchOptions} = options, controller = new AbortController, timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });
      return clearTimeout(timeoutId), response;
    } catch (error) {
      throw clearTimeout(timeoutId), error;
    }
  }
  class ErrorHandler {
    static handleNetworkError(error, context) {
      "AbortError" === error.name ? Logger.warn(`${context}: 请求超时`) : "TypeError" === error.name && error.message.includes("fetch") ? Logger.error(`${context}: 网络连接失败`) : Logger.error(`${context}: ${error.message || error}`);
    }
    static handleDOMError(error, context) {
      Logger.error(`${context}: DOM操作失败 - ${error.message || error}`);
    }
    static handleParsingError(error, context) {
      Logger.error(`${context}: 数据解析失败 - ${error.message || error}`);
    }
    static async withRetry(operation, context, maxRetries = CONFIG.get("maxRetries")) {
      for (let i = 0; i <= maxRetries; i++) try {
        return await operation();
      } catch (error) {
        if (i < maxRetries) {
          const delay2 = 1e3 * Math.pow(2, i);
          Logger.warn(`${context}: 第${i + 1}次尝试失败，${delay2}ms后重试`), await new Promise(resolve => setTimeout(resolve, delay2));
        }
      }
      return Logger.error(`${context}: 重试${maxRetries}次后仍然失败`), null;
    }
    static safeExecute(operation, context, defaultValue) {
      try {
        return operation();
      } catch (error) {
        return Logger.error(`${context}: ${error}`), defaultValue;
      }
    }
  }
  class LinkExtractor {
    static extractAllLinks(doc) {
      const links = {
        ed2k: [],
        magnet: [],
        xunlei: [],
        baidu: []
      };
      try {
        this.extractResourceLinks(doc, links), this.extractHtmlNetworkDiskLinks(doc, links), 
        this.extractCodeBlockLinks(doc, links), 0 === links.magnet.length && this.extractMagnetFromFullPage(doc, links), 
        this.deduplicateLinks(links);
      } catch (error) {
        Logger.error("链接提取错误", error);
      }
      return links;
    }
    static extractResourceLinks(doc, links) {
      doc.querySelectorAll('a[href^="magnet:"], a[href^="ed2k:"]').forEach(element => {
        const href = element.href;
        href && this.categorizeLink(href, links);
      }), doc.querySelectorAll('a[href*="ed2k://"], a[href*="magnet:"]').forEach(element => {
        const href = element.href;
        href && this.categorizeLink(href, links);
      });
      const ed2kMatches = (doc.body.textContent || "").match(/ed2k:\/\/\|file\|[^|]+\|\d+\|[A-F0-9]+\|\//gi);
      ed2kMatches && ed2kMatches.forEach(match => links.ed2k.push(match.trim()));
    }
    static extractHtmlNetworkDiskLinks(doc, links) {
      doc.querySelectorAll('a[href*="pan.xunlei.com/s/"], a[href*="pan.baidu.com/s/"]').forEach(linkElement => {
        const href = linkElement.getAttribute("href");
        href && (href.includes("pan.xunlei.com/s/") ? links.xunlei.push(this.combineNetworkDiskLink(linkElement, href)) : href.includes("pan.baidu.com/s/") && links.baidu.push(this.combineNetworkDiskLink(linkElement, href)));
      });
    }
    static extractCodeBlockLinks(doc, links) {
      doc.querySelectorAll(".blockcode").forEach(block => {
        const text = block.textContent || "", magnetMatches = text.match(/magnet:\?xt=urn:btih:[a-fA-F0-9]{40}/g);
        if (magnetMatches) magnetMatches.forEach(match => links.magnet.push(match.trim())); else {
          const hashMatches = text.match(/\b([a-fA-F0-9]{40})\b/g);
          hashMatches && hashMatches.length <= 3 && hashMatches.forEach(hash => links.magnet.push(`magnet:?xt=urn:btih:${hash}`));
        }
        const xunleiMatches = text.match(/https:\/\/pan\.xunlei\.com\/s\/[a-zA-Z0-9_-]+/g);
        xunleiMatches && xunleiMatches.forEach(match => links.xunlei.push(match.trim()));
        const baiduMatches = text.match(/https:\/\/pan\.baidu\.com\/s\/[a-zA-Z0-9_-]+/g);
        baiduMatches && baiduMatches.forEach(match => links.baidu.push(match.trim()));
      });
    }
    static extractMagnetFromFullPage(doc, links) {
      const contentElement = doc.querySelector(".t_f, #postmessage, .pcb"), contentText = contentElement ? contentElement.textContent || "" : doc.body.textContent || "", magnetMatches = contentText.match(/magnet:\?xt=urn:btih:[a-fA-F0-9]{40}/g);
      if (magnetMatches) magnetMatches.forEach(match => links.magnet.push(match.trim())); else {
        const hashMatches = contentText.match(/\b([a-fA-F0-9]{40})\b/g);
        hashMatches && hashMatches.slice(0, 3).forEach(hash => links.magnet.push(`magnet:?xt=urn:btih:${hash}`));
      }
    }
    static categorizeLink(url, links) {
      url.startsWith("ed2k://") ? links.ed2k.push(url) : url.startsWith("magnet:") ? links.magnet.push(url) : url.includes("pan.xunlei.com") ? links.xunlei.push(url) : url.includes("pan.baidu.com") && links.baidu.push(url);
    }
    static deduplicateLinks(links) {
      links.ed2k = [ ...new Set(links.ed2k) ], links.magnet = [ ...new Set(links.magnet) ], 
      links.xunlei = [ ...new Set(links.xunlei) ], links.baidu = [ ...new Set(links.baidu) ];
    }
    static hasAnyContent(links) {
      return links.ed2k.length > 0 || links.magnet.length > 0 || links.xunlei.length > 0 || links.baidu.length > 0;
    }
    static combineNetworkDiskLink(element, url) {
      if (url.includes("?pwd=")) return url;
      const extractCodeMatch = (element.parentElement?.textContent || "").match(/提取码[：:]\s*([a-zA-Z0-9]+)/);
      return extractCodeMatch ? `${url}?pwd=${extractCodeMatch[1]}` : url;
    }
  }
  const _StateManager = class {
    static createPageNumElement() {
      document.getElementById("page-number-display") || (this.pageNumDisplay = document.createElement("div"), 
      this.pageNumDisplay.id = "page-number-display", this.pageNumDisplay.style.cssText = "position: fixed; z-index: 9998; user-select: none; display: none; background-color: rgba(50,50,50,0.5); color: white; padding: 5px; border-radius: 5px; font-size: 12px; text-align: center;", 
      document.body.appendChild(this.pageNumDisplay));
    }
    static updateAndSaveForumState() {
      this.updateFloatingPageNumber(), this.saveForumState();
    }
    static updateAndSaveSearchState() {
      const keyword = document.querySelector(".sttl .emfont")?.textContent;
      if (keyword) {
        const currentPage = this.getCurrentPageNumber(), urlParams = new URLSearchParams(window.location.search);
        urlParams.delete("page");
        const baseUrl = window.location.pathname + "?" + urlParams.toString();
        localStorage.setItem("lastSearchState", JSON.stringify({
          keyword: keyword,
          page: currentPage,
          baseUrl: baseUrl
        }));
      }
    }
    static getCurrentPageNumber() {
      const pageElement = document.querySelector(".pg strong");
      if (pageElement) return pageElement.textContent || "1";
      if (!document.querySelector(".pg a.nxt")) {
        const pageMatch = window.location.href.match(/[?&]page=(\d+)/);
        if (pageMatch) return pageMatch[1];
      }
      return "1";
    }
    static updateFloatingPageNumber() {
      if (!this.pageNumDisplay) return;
      const scrollTopBtn = document.getElementById("scrolltop");
      if (scrollTopBtn && scrollTopBtn.offsetHeight > 0 && "hidden" !== window.getComputedStyle(scrollTopBtn).visibility) {
        const rect = scrollTopBtn.getBoundingClientRect();
        this.pageNumDisplay.style.display = "block", this.pageNumDisplay.style.top = rect.top - this.pageNumDisplay.offsetHeight - 5 + "px", 
        this.pageNumDisplay.style.left = `${rect.left}px`, this.pageNumDisplay.style.width = `${rect.width}px`, 
        this.pageNumDisplay.style.boxSizing = "border-box";
        const currentPage = this.getCurrentPageNumber();
        this.pageNumDisplay.textContent = `第${currentPage}页`;
      } else this.pageNumDisplay.style.display = "none";
    }
    static saveForumState() {
      const sectionName = document.querySelector("#pt .z a:last-of-type")?.textContent, currentPage = this.getCurrentPageNumber();
      if (sectionName) {
        const pageLink = document.querySelector('.pg a[href*="page="]') || document.querySelector('.pg a[href*="-"]');
        let urlTemplate = null;
        pageLink && (urlTemplate = pageLink.href.replace(/([?&]page=)\d+/, "$1__PAGE__").replace(/-\d+\.html/, "-__PAGE__.html")), 
        localStorage.setItem("lastForumState", JSON.stringify({
          sectionName: sectionName,
          page: currentPage,
          urlTemplate: urlTemplate
        }));
      }
    }
    static setupStateTracking() {
      const throttledUpdate = function(func) {
        let lastCall = 0;
        return (...args) => {
          const now = Date.now();
          now - lastCall >= 100 && (func(...args), lastCall = now);
        };
      }(() => this.updateAndSaveForumState());
      window.addEventListener("scroll", throttledUpdate, {
        passive: !0
      }), window.addEventListener("resize", throttledUpdate, {
        passive: !0
      });
      const scrollTopBtn = document.getElementById("scrolltop");
      scrollTopBtn && new MutationObserver(throttledUpdate).observe(scrollTopBtn, {
        attributes: !0,
        attributeFilter: [ "style", "class" ]
      });
    }
  };
  _StateManager.pageNumDisplay = null;
  let StateManager = _StateManager;
  class ScrollManagerBase {
    constructor() {
      this.scrollHandler = null, this.isLoading = !1, this.nextUrl = "", this.currentPage = 1, 
      this.loadingIndicator = null, this.contentObserver = null, this.MIN_VISIBLE_POSTS = 8, 
      this.MIN_CONTENT_HEIGHT_RATIO = 1.8;
    }
    disable() {
      if (this.scrollHandler) {
        const scrollContainer = document.getElementById("sticky-scroll-container");
        scrollContainer ? scrollContainer.removeEventListener("scroll", this.scrollHandler) : window.removeEventListener("scroll", this.scrollHandler), 
        this.scrollHandler = null;
      }
      this.stopContentMonitoring(), this.loadingIndicator && (this.loadingIndicator.style.display = "none"), 
      this.currentPage > 1 && this.navigateToCurrentPage();
    }
    navigateToCurrentPage() {}
    createLoadingIndicator(id, text = "正在加载更多内容...") {
      if (this.loadingIndicator) return;
      this.loadingIndicator = document.createElement("div"), this.loadingIndicator.id = id, 
      this.loadingIndicator.textContent = text, this.loadingIndicator.style.cssText = "text-align: center; padding: 20px; display: none;";
      const container = document.getElementById("sticky-scroll-container") || document.querySelector("#threadlist");
      container?.insertAdjacentElement("afterend", this.loadingIndicator);
    }
    async fetchWithTimeout(url, options = {}) {
      return fetchWithTimeout(url, options);
    }
    getVisiblePostsCount() {
      const posts = document.querySelectorAll("#threadlist .pbw");
      let visibleCount = 0;
      return posts.forEach(post => {
        const styles = window.getComputedStyle(post);
        "none" !== styles.display && "hidden" !== styles.visibility && "0" !== styles.opacity && visibleCount++;
      }), visibleCount;
    }
    startContentMonitoring() {
      if (this.contentObserver) return;
      const scrollContainer = document.getElementById("sticky-scroll-container");
      scrollContainer && (this.contentObserver = new MutationObserver(() => {
        setTimeout(() => {
          this.checkAndEnsureContent();
        }, 100);
      }), this.contentObserver.observe(scrollContainer, {
        childList: !0,
        subtree: !0
      }));
    }
    stopContentMonitoring() {
      this.contentObserver && (this.contentObserver.disconnect(), this.contentObserver = null);
    }
    async waitForImages(container) {
      const images = Array.from(container.querySelectorAll("img"));
      if (0 === images.length) return Promise.resolve();
      const promises = images.map(img => new Promise(resolve => {
        img.complete ? resolve() : (img.addEventListener("load", () => resolve(), {
          once: !0
        }), img.addEventListener("error", () => resolve(), {
          once: !0
        }));
      }));
      return Promise.all(promises).then(() => {});
    }
  }
  class NormalScrollManager extends ScrollManagerBase {
    constructor(threadRenderer, settingsApplier) {
      super(), this.threadRenderer = threadRenderer, this.settingsApplier = settingsApplier;
    }
    enable() {
      if (this.scrollHandler) return;
      const nextPageLink = document.querySelector(".pg a.nxt");
      nextPageLink && (this.nextUrl = nextPageLink.href, this.createLoadingIndicator("normal-loading-indicator"), 
      this.setupScrollListener());
    }
    setupScrollListener() {
      this.scrollHandler = async () => {
        !this.isLoading && this.nextUrl && document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 500 && await this.loadNext();
      }, window.addEventListener("scroll", this.scrollHandler, {
        passive: !0
      });
    }
    async loadNext() {
      this.isLoading = !0, this.loadingIndicator && (this.loadingIndicator.style.display = "block");
      try {
        const response = await this.fetchWithTimeout(this.nextUrl), html = await response.text(), doc = (new DOMParser).parseFromString(html, "text/html"), mainTable = document.querySelector("table#threadlisttableid"), newThreads = doc.querySelectorAll("table#threadlisttableid > tbody[id^=normalthread_]");
        newThreads.length > 0 && mainTable && (await this.appendContent(mainTable, newThreads), 
        this.updatePagination(doc)), this.updateNextPageUrl();
      } catch (error) {
        Logger.error("翻页失败:", error), this.loadingIndicator && (this.loadingIndicator.textContent = "加载失败");
      } finally {
        this.isLoading = !1, this.updateLoadingIndicator();
      }
    }
    async appendContent(mainTable, newThreads) {
      const fragment = document.createDocumentFragment();
      newThreads.forEach(thread => fragment.appendChild(thread)), mainTable.appendChild(fragment), 
      this.threadRenderer && await this.threadRenderer.processNewThreads(mainTable), this.settingsApplier && this.settingsApplier.applyStickPostHidingToNewContent();
    }
    updatePagination(doc) {
      const newPagination = doc.querySelector(".pg"), currentPagination = document.querySelector(".pg");
      if (currentPagination && newPagination) {
        currentPagination.replaceWith(newPagination);
        const pageStrong = newPagination.querySelector("strong");
        pageStrong && (this.currentPage = parseInt(pageStrong.textContent || "1", 10));
      }
    }
    navigateToCurrentPage() {
      const url = new URL(window.location.href), baseUrl = url.origin + url.pathname, params = new URLSearchParams(url.search);
      params.set("page", this.currentPage.toString()), window.location.href = `${baseUrl}?${params.toString()}`;
    }
    updateNextPageUrl() {
      const nextPageLink = document.querySelector(".pg a.nxt");
      this.nextUrl = nextPageLink ? nextPageLink.href : "";
    }
    updateLoadingIndicator() {
      this.loadingIndicator && (this.nextUrl ? this.loadingIndicator.style.display = "none" : this.loadingIndicator.textContent = "已加载全部内容");
    }
    async checkAndEnsureContent() {}
  }
  class SearchScrollManager extends ScrollManagerBase {
    constructor() {
      super(), this.contentProcessor = null;
    }
    setContentProcessor(processor) {
      this.contentProcessor = processor;
    }
    enable() {
      if (this.scrollHandler) return;
      this.initializePagination();
      const scrollContainer = document.getElementById("sticky-scroll-container");
      scrollContainer && (this.scrollHandler = this.createScrollHandler(scrollContainer), 
      scrollContainer.addEventListener("scroll", this.scrollHandler, {
        passive: !0
      }), this.startContentMonitoring(), this.waitForImages(scrollContainer).then(() => {
        this.checkAndEnsureContent();
      }));
    }
    createScrollHandler(scrollContainer) {
      return function(func) {
        let timeoutId;
        return (...args) => {
          clearTimeout(timeoutId), timeoutId = setTimeout(() => func(...args), 150);
        };
      }(() => {
        if (this.isLoading || !this.nextUrl) return;
        const threshold = this.getVisiblePostsCount() < this.MIN_VISIBLE_POSTS ? 2 * scrollContainer.clientHeight : .8 * scrollContainer.clientHeight;
        scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - threshold && this.loadNext();
      });
    }
    initializePagination() {
      const pagination = document.querySelector(".pg");
      pagination?.querySelector("a.nxt") && (this.nextUrl = pagination.querySelector("a.nxt").href), 
      this.createLoadingIndicator("search-loading-indicator");
    }
    async loadNext() {
      if (this.isLoading || !this.nextUrl) return;
      this.isLoading = !0;
      const loadingIndicator = document.getElementById("search-loading-indicator");
      loadingIndicator && (loadingIndicator.style.display = "block", loadingIndicator.textContent = "正在加载...");
      try {
        const response = await this.fetchWithTimeout(this.nextUrl), html = await response.text(), doc = (new DOMParser).parseFromString(html, "text/html"), threadListContainer = document.querySelector("#threadlist > ul"), newThreadList = doc.querySelector("#threadlist > ul");
        newThreadList && newThreadList.children.length > 0 && threadListContainer && (this.contentProcessor && this.contentProcessor.processSearchContainer && await this.contentProcessor.processSearchContainer(newThreadList, !1), 
        Array.from(newThreadList.children).forEach(child => {
          threadListContainer.appendChild(child);
        }));
        const newPagination = doc.querySelector(".pg"), currentPagination = document.querySelector(".pg");
        if (currentPagination && newPagination) {
          currentPagination.replaceWith(newPagination);
          const pageStrong = newPagination.querySelector("strong");
          pageStrong && (this.currentPage = parseInt(pageStrong.textContent || "1", 10));
        } else !currentPagination && newPagination && document.querySelector(".tl")?.appendChild(newPagination);
        const nextPageLink = document.querySelector(".pg a.nxt");
        this.nextUrl = nextPageLink ? nextPageLink.href : "";
      } catch (error) {
        Logger.error("翻页失败:", error), loadingIndicator && (loadingIndicator.textContent = "加载失败"), 
        this.nextUrl = "";
      } finally {
        this.isLoading = !1, loadingIndicator && (this.nextUrl ? loadingIndicator.style.display = "none" : loadingIndicator.textContent = "已加载全部内容");
      }
    }
    async checkAndEnsureContent() {
      if (this.isLoading || !this.nextUrl) return;
      const scrollContainer = document.getElementById("sticky-scroll-container");
      if (!scrollContainer) return;
      const visiblePosts = this.getVisiblePostsCount(), heightRatio = scrollContainer.scrollHeight / scrollContainer.clientHeight;
      (visiblePosts < this.MIN_VISIBLE_POSTS || heightRatio < this.MIN_CONTENT_HEIGHT_RATIO) && (await this.loadNext(), 
      setTimeout(() => {
        this.checkAndEnsureContent();
      }, 500));
    }
    async ensureSufficientContent() {
      let attempts = 0;
      for (;this.nextUrl && attempts < 10; ) {
        const scrollContainer = document.getElementById("sticky-scroll-container");
        if (!scrollContainer) break;
        const scrollHeight = scrollContainer.scrollHeight, clientHeight = scrollContainer.clientHeight, postCount = document.querySelectorAll("#threadlist .pbw").length;
        if (scrollHeight > 1.5 * clientHeight || postCount >= 5) break;
        await this.loadNext(), attempts++, await delay(300);
      }
    }
  }
  const _ScrollManager = class {
    static setContentProcessor(processor) {
      this.searchScrollManager && this.searchScrollManager.setContentProcessor(processor);
    }
    static enableNormalScroll(threadRenderer, settingsApplier) {
      this.normalScrollManager || (this.normalScrollManager = new NormalScrollManager(threadRenderer, settingsApplier)), 
      this.normalScrollManager.enable();
    }
    static enableSearchScroll() {
      this.searchScrollManager || (this.searchScrollManager = new SearchScrollManager), 
      this.searchScrollManager.enable();
    }
    static disableScroll() {
      this.normalScrollManager && this.normalScrollManager.disable(), this.searchScrollManager && this.searchScrollManager.disable();
    }
    static async ensureSufficientContent() {
      this.searchScrollManager && await this.searchScrollManager.ensureSufficientContent();
    }
  };
  _ScrollManager.normalScrollManager = null, _ScrollManager.searchScrollManager = null;
  let ScrollManager = _ScrollManager;
  async function fetchWithCache(url, priority = "normal") {
    return previewCache.get(url) || await ErrorHandler.withRetry(async () => {
      const response = await fetchWithTimeout(url), html = await response.text(), result = function(doc) {
        const images = Array.from(doc.querySelectorAll("img.zoom")).filter(img => {
          const fileSrc = img.getAttribute("file");
          return !(!fileSrc || fileSrc.includes("static") || 430 === parseInt(img.getAttribute("width") || "0") || fileSrc.toLowerCase().endsWith(".png") && (fileSrc.includes("7pzzv.us") || fileSrc.includes("iili.io")));
        }), links = function(doc) {
          return LinkExtractor.extractAllLinks(doc);
        }(doc), attachments = function(doc) {
          const attachments = [], allowedExtensions = [ ".txt", ".zip", ".rar", ".7z", ".gz", ".tar" ];
          return doc.querySelectorAll('a[href*="mod=attachment"]').forEach(link => {
            const anchor = link, href = anchor.getAttribute("href"), name = anchor.textContent?.trim() || "";
            if (!href || !name || name.length < 3) return;
            const lowerName = name.toLowerCase();
            if (!allowedExtensions.some(ext => lowerName.endsWith(ext))) return;
            let size = "";
            const parentDD = anchor.closest("dd");
            if (parentDD) {
              const sizeMatch = parentDD.textContent?.match(/(\d+(?:\.\d+)?\s*(?:KB|MB|GB|Bytes|字节))/i);
              sizeMatch && (size = sizeMatch[1]);
            }
            if (attachments.some(a => a.name === name)) return;
            const fullUrl = href.startsWith("http") ? href : `https://sehuatang.net/${href}`;
            attachments.push({
              name: name,
              url: fullUrl,
              size: size
            });
          }), attachments;
        }(doc);
        return {
          images: images,
          links: links,
          attachments: attachments
        };
      }((new DOMParser).parseFromString(html, "text/html"));
      return previewCache.set(url, result, priority), result;
    }, `获取内容失败: ${url}`);
  }
  class SettingsApplier {
    static applyInitialStickPostHiding() {
      setTimeout(() => {
        this.applyStickPostHiding();
      }, 100);
    }
    static applyStickPostHidingToNewContent() {
      this.hideStickPostsAndAdminPosts(":not(.hide-processed)", !0);
    }
    static applyDefaultTimeSort() {
      const currentUrl = window.location.href, urlParams = new URLSearchParams(window.location.search), mod = urlParams.get("mod"), fid = urlParams.get("fid");
      ("forumdisplay" === mod && fid || /forum-\d+-\d+\.html/.test(currentUrl)) && "dateline" !== urlParams.get("orderby") && this.redirectToTimeSortedPage(currentUrl, mod, fid);
    }
    static applyStickPostHiding() {
      this.hideStickPostsAndAdminPosts("", !1);
    }
    static hideStickPostsAndAdminPosts(selector, addProcessedClass) {
      document.querySelectorAll(`#threadlisttableid tbody[id^="stickthread_"]${selector}`).forEach(thread => {
        thread.style.display = "none", addProcessedClass && thread.classList.add("hide-processed");
      }), document.querySelectorAll(`#threadlisttableid tbody[id^="normalthread_"]${selector}`).forEach(thread => {
        const forumLink = thread.querySelector("em a");
        forumLink && forumLink.textContent?.includes("版务管理") && (thread.style.display = "none"), 
        addProcessedClass && thread.classList.add("hide-processed");
      });
    }
    static redirectToTimeSortedPage(currentUrl, mod, fid) {
      let targetUrl;
      if ("forumdisplay" === mod && fid) {
        const newUrl = new URL(currentUrl);
        newUrl.searchParams.set("orderby", "dateline"), newUrl.searchParams.set("filter", "author"), 
        targetUrl = newUrl.href;
      } else {
        const forumMatch = currentUrl.match(/forum-(\d+)-(\d+)\.html/);
        if (!forumMatch) return;
        targetUrl = `forum.php?mod=forumdisplay&fid=${forumMatch[1]}&page=${forumMatch[2]}&orderby=dateline&filter=author`;
      }
      window.location.href = targetUrl;
    }
  }
  class ThreadRenderer {
    static async processSingleThread(link) {
      const threadURL = link.href, tbodyRef = link.closest("tbody");
      if (tbodyRef && !tbodyRef.querySelector(".imagePreviewRow") && !tbodyRef.querySelector(".searchImagePreview") && "true" !== tbodyRef.dataset.previewProcessed) {
        tbodyRef.dataset.previewProcessed = "true";
        try {
          const result = await fetchWithCache(threadURL);
          if (!result) return;
          const {images: imgElements, links: downloadLinks, attachments: attachments} = result, limitedImages = imgElements.slice(0, CONFIG.get("maxPreviewImages"));
          if (0 === limitedImages.length && !LinkExtractor.hasAnyContent(downloadLinks) && 0 === attachments.length) return;
          this.renderSimpleThreadContent(link, tbodyRef, limitedImages, downloadLinks, attachments);
        } catch (e) {
          Logger.error("处理失败:", e), tbodyRef && (tbodyRef.dataset.previewProcessed = "false");
        }
      }
    }
    static renderSimpleThreadContent(link, tbodyRef, limitedImages, downloadLinks, attachments) {
      StyleManager.inject();
      const previewRow = document.createElement("tr");
      previewRow.className = "imagePreviewRow";
      const previewCell = document.createElement("td");
      previewCell.colSpan = 5, previewCell.style.cssText = "padding: 15px 20px; background: #fafafa;", 
      UIComponents.createImageGridPreview(previewCell, link, limitedImages, downloadLinks, attachments), 
      previewRow.appendChild(previewCell), tbodyRef.appendChild(previewRow);
    }
    static async displayInitialThreads() {
      const postLinks = document.querySelectorAll("#threadlisttableid .s.xst"), concurrencyManager = new ConcurrencyManager(CONFIG.get("concurrencyLimit")), fetchPromises = Array.from(postLinks).map(link => concurrencyManager.addTask(async () => {
        const titleCell = link.closest("th, td");
        titleCell?.querySelector("em a")?.textContent?.includes("版务管理") || await this.processSingleThread(link);
      }));
      await Promise.all(fetchPromises);
    }
    static async processNewThreads(mainTable) {
      const newLinks = Array.from(mainTable.querySelectorAll("tbody[id^=normalthread_]:not(.processed) a.s.xst"));
      await Promise.all(newLinks.map(link => {
        const tbody = link.closest("tbody");
        return tbody?.classList.add("processed"), tbody?.querySelector("em a")?.textContent?.includes("版务管理") ? Promise.resolve() : this.processSingleThread(link);
      }));
    }
  }
  class SearchLayoutManager {
    static applyStickyLayout() {
      const ct = document.getElementById("ct");
      if (!ct) return;
      const topBar = document.getElementById("toptb"), searchForm = ct.querySelector("form.searchform"), tl = ct.querySelector(".tl");
      if (!tl) return;
      const resultTitle = tl.querySelector(".sttl"), threadList = tl.querySelector("#threadlist"), pagination = tl.querySelector(".pgs"), footer = document.getElementById("ft");
      if (!threadList) return;
      footer && footer.remove();
      const topGroup = document.createElement("div");
      topBar && topGroup.appendChild(topBar), searchForm && topGroup.appendChild(searchForm), 
      resultTitle && topGroup.appendChild(resultTitle);
      const middleGroup = document.createElement("div");
      middleGroup.id = "sticky-scroll-container", middleGroup.appendChild(threadList);
      const bottomGroup = document.createElement("div");
      pagination && bottomGroup.appendChild(pagination), ct.innerHTML = "", ct.appendChild(topGroup), 
      ct.appendChild(middleGroup), ct.appendChild(bottomGroup), this.injectLayoutStyles();
    }
    static injectLayoutStyles() {
      const style = document.createElement("style");
      style.textContent = "\n      html, body { height: 100%; overflow: hidden; margin: 0; }\n      #ct { height: 100% !important; display: flex; flex-direction: column; }\n      #ct > div:nth-child(1) { flex-shrink: 0; overflow: hidden; }\n      #sticky-scroll-container { flex-grow: 1; overflow-y: auto; border-top: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0; position: relative; }\n      #ct > div:nth-child(3) { flex-shrink: 0; padding: 10px 0; background-color: #fff; border-top: 1px solid #e0e0e0; }\n      .pgs.cl { margin-bottom: 0 !important; }\n      .tl { width: 100% !important; max-width: none !important; padding: 0 20px !important; box-sizing: border-box !important; }\n      #threadlist { width: 100% !important; max-width: none !important; }\n      #threadlist > ul { width: 100% !important; max-width: none !important; padding: 0 !important; margin: 0 !important; }\n      .pbw { width: 100% !important; max-width: none !important; box-sizing: border-box !important; margin: 25px 0 !important; }\n    ", 
      document.head.appendChild(style);
    }
    static createRichPostCard(pbwContainer, link, limitedImages, downloadLinks, attachments) {
      StyleManager.inject(), UIComponents.createImageGridPreview(pbwContainer, link, limitedImages, downloadLinks, attachments);
    }
  }
  class SearchContentProcessor {
    static async processSearchContainer(container, useHighPriorityCache = !1) {
      return await this.displaySearchPreviews(container, useHighPriorityCache), container.querySelectorAll(".pbw").length;
    }
    static async displaySearchPreviews(container, useHighPriorityCache = !1) {
      const postLinks = container.querySelectorAll(".xs3 a"), validLinks = Array.from(postLinks).filter(link => {
        const pbwContainer = link.closest(".pbw");
        return link.href && link.href.includes("thread") && pbwContainer && !pbwContainer.classList.contains("hidden-transparent");
      }), concurrencyManager = new ConcurrencyManager(CONFIG.get("concurrencyLimit")), processResults = [], fetchPromises = validLinks.map(link => concurrencyManager.addTask(async () => {
        try {
          const threadURL = link.href, pbwContainer = link.closest(".pbw");
          if (!pbwContainer || pbwContainer.querySelector(".searchImagePreview") || pbwContainer.querySelector('[id*="imagePreview"]') || "true" === pbwContainer.dataset.previewProcessed) return;
          pbwContainer.dataset.previewProcessed = "true";
          const isHighPriority = useHighPriorityCache && validLinks.indexOf(link) < 5, result = await fetchWithCache(threadURL, isHighPriority ? "high" : "normal");
          if (!result) return void processResults.push({
            pbwContainer: pbwContainer,
            link: link,
            hasContent: !1,
            processed: !1,
            isHidden: this.isHiddenPost(pbwContainer)
          });
          const {images: images, links: links, attachments: attachments} = result, limitedImages = images.slice(0, CONFIG.get("maxPreviewImages"));
          if (!(limitedImages.length > 0 || LinkExtractor.hasAnyContent(links) || attachments.length > 0)) return void processResults.push({
            pbwContainer: pbwContainer,
            link: link,
            hasContent: !1,
            processed: !1,
            isHidden: this.isHiddenPost(pbwContainer)
          });
          this.createRichPostCard(pbwContainer, link, limitedImages, links, attachments), 
          processResults.push({
            pbwContainer: pbwContainer,
            link: link,
            hasContent: !0,
            processed: !0,
            isHidden: !1
          });
        } catch (error) {
          Logger.error("处理失败:", error);
          const pbwContainer = link.closest(".pbw");
          pbwContainer && (pbwContainer.dataset.previewProcessed = "false", processResults.push({
            pbwContainer: pbwContainer,
            link: link,
            hasContent: !1,
            processed: !1,
            isHidden: this.isHiddenPost(pbwContainer)
          }));
        }
      }));
      await Promise.all(fetchPromises), this.handleInvalidAndHiddenPosts(processResults);
    }
    static createRichPostCard(pbwContainer, link, limitedImages, links, attachments) {
      SearchLayoutManager.createRichPostCard(pbwContainer, link, limitedImages, links, attachments);
    }
    static handleInvalidAndHiddenPosts(processResults) {
      processResults.filter(result => !result.hasContent && !result.processed).forEach(result => {
        result.isHidden && result.pbwContainer.remove();
      });
    }
    static isHiddenPost(pbwContainer) {
      const text = pbwContainer.textContent || "", hasHiddenKeywords = [ "该主题需要回复才能浏览", "内容隐藏需要，请点击进去查看", "隐藏内容", "此帖被隐藏", "权限不足", "积分不足", "回复可见", "购买主题", "付费内容", "需要权限", "您无权访问", "内容隐藏需要" ].some(keyword => text.includes(keyword)), hasHiddenElements = !!(pbwContainer.querySelector(".locked") || pbwContainer.querySelector(".permission-denied") || pbwContainer.querySelector(".reply-to-view")), titleText = pbwContainer.querySelector(".xs3 a")?.textContent || "", hasTitleHiddenKeywords = titleText.includes("隐藏") || titleText.includes("权限") || titleText.includes("回复可见") || titleText.includes("积分不足");
      return hasHiddenKeywords || hasHiddenElements || hasTitleHiddenKeywords;
    }
    static reprocessExistingPosts() {
      document.querySelectorAll("#threadlist .pbw").forEach(pbwContainer => {
        this.isHiddenPost(pbwContainer) && pbwContainer.remove();
      });
    }
    static async showCachedContent(validLinks) {
      for (const link of validLinks) {
        const threadURL = link.href, pbwContainer = link.closest(".pbw");
        if (!pbwContainer || "true" === pbwContainer.dataset.previewProcessed) continue;
        const {previewCache: previewCache2} = await Promise.resolve().then(() => CacheManager);
        if (previewCache2.has(threadURL)) {
          const cachedResult = previewCache2.get(threadURL);
          if (cachedResult) {
            pbwContainer.dataset.previewProcessed = "true";
            const {images: images, links: links, attachments: attachments} = cachedResult, limitedImages = images.slice(0, CONFIG.get("maxPreviewImages"));
            (limitedImages.length > 0 || LinkExtractor.hasAnyContent(links) || attachments && attachments.length > 0) && this.createRichPostCard(pbwContainer, link, limitedImages, links, attachments);
          }
        }
      }
    }
    static async loadRemainingContent(remainingLinks) {
      if (0 === remainingLinks.length) return;
      const concurrencyManager = new ConcurrencyManager(CONFIG.get("concurrencyLimit")), promises = remainingLinks.map(link => concurrencyManager.addTask(async () => {
        const threadURL = link.href, pbwContainer = link.closest(".pbw");
        if (!pbwContainer || "true" === pbwContainer.dataset.previewProcessed) return;
        pbwContainer.dataset.previewProcessed = "true";
        const result = await fetchWithCache(threadURL, "normal");
        if (result) {
          const {images: images, links: links, attachments: attachments} = result, limitedImages = images.slice(0, CONFIG.get("maxPreviewImages"));
          (limitedImages.length > 0 || LinkExtractor.hasAnyContent(links) || attachments && attachments.length > 0) && this.createRichPostCard(pbwContainer, link, limitedImages, links, attachments);
        }
      }));
      await Promise.allSettled(promises);
    }
  }
  class NormalPageManager {
    static init() {
      StateManager.createPageNumElement(), StateManager.setupStateTracking(), this.setupToggle(), 
      ThreadRenderer.displayInitialThreads(), SettingsApplier.applyInitialStickPostHiding(), 
      SettingsApplier.applyDefaultTimeSort();
    }
    static setupToggle() {
      UIComponents.createNormalPageToggle({
        storageKeyEnabled: "normalPageInfiniteScroll",
        onEnable: () => ScrollManager.enableNormalScroll(ThreadRenderer, SettingsApplier),
        onDisable: () => ScrollManager.disableScroll(),
        defaultEnabled: !1
      });
    }
  }
  class SearchPageManager {
    static init() {
      SearchLayoutManager.applyStickyLayout(), this.setupToggle(), setTimeout(() => {
        this.setupInitialContent();
      }, 0);
    }
    static async setupInitialContent() {
      const threadListContainer = document.querySelector("#threadlist > ul");
      threadListContainer && (ScrollManager.setContentProcessor(SearchContentProcessor), 
      SearchContentProcessor.reprocessExistingPosts(), await this.processContentInPhases(threadListContainer));
    }
    static async processContentInPhases(container) {
      const allLinks = Array.from(container.querySelectorAll(".xs3 a"));
      await SearchContentProcessor.showCachedContent(allLinks.slice(0, 8)), setTimeout(async () => {
        const remainingLinks = [ ...allLinks.slice(0, 8).filter(link => {
          const pbwContainer = link.closest(".pbw");
          return pbwContainer && "true" !== pbwContainer.dataset.previewProcessed;
        }), ...allLinks.slice(8) ];
        await SearchContentProcessor.loadRemainingContent(remainingLinks), await ScrollManager.ensureSufficientContent();
      }, 100);
    }
    static setupToggle() {
      UIComponents.createSearchPageSingleToggle({
        storageKeyEnabled: "searchPageInfiniteScroll",
        onEnable: () => ScrollManager.enableSearchScroll(),
        onDisable: () => ScrollManager.disableScroll(),
        defaultEnabled: !0
      });
    }
  }
  const _WidthModeManager = class {
    static init() {
      this.switchButton = document.getElementById("switchwidth"), this.switchButton && (this.switchButton.addEventListener("click", () => {
        setTimeout(() => {
          this.saveCurrentMode();
        }, 100);
      }), this.restoreWidthMode());
    }
    static saveCurrentMode() {
      try {
        const isWideMode = this.isCurrentlyWideMode();
        localStorage.setItem(this.STORAGE_KEY, isWideMode ? "wide" : "narrow");
      } catch (error) {}
    }
    static isCurrentlyWideMode() {
      return !!this.switchButton && (this.switchButton.textContent || "").includes("窄版");
    }
    static restoreWidthMode() {
      try {
        "wide" !== localStorage.getItem(this.STORAGE_KEY) || this.isCurrentlyWideMode() || this.switchButton?.click();
      } catch (error) {}
    }
  };
  _WidthModeManager.STORAGE_KEY = "SHT_WIDTH_MODE", _WidthModeManager.switchButton = null;
  let WidthModeManager = _WidthModeManager;
  function initScript() {
    try {
      WidthModeManager.init(), window.location.href.includes("search.php") ? SearchPageManager.init() : NormalPageManager.init();
    } catch (error) {}
  }
  "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", initScript) : initScript();
}();

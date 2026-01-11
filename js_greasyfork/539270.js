// ==UserScript==
// @name         磁力-预览
// @version      1.2.1
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  一键获取磁力并验车 - 支持磁力柠檬、磁力猫
// @match        https://*.lemoniv.top/search?keyword=*
// @match        *://*.clmapp1.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lemoniv.top
// @license      GPL-3.0
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539270/%E7%A3%81%E5%8A%9B-%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/539270/%E7%A3%81%E5%8A%9B-%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

!function() {
  "use strict";
  const SITE_CONFIGS = [ {
    name: "磁力柠檬",
    hostPatterns: [ "lemoniv.top", "lemonuo.top" ],
    panelSelector: ".panel.panel-default.border-radius",
    detailLinkSelector: '.panel-heading a[href^="/detail/"]',
    magnetBtnSelector: '.panel-footer a[href^="/detail/"]',
    containerSelector: ".panel-footer",
    magnetSelector: "#magnet",
    cachePrefix: "magnet_lemon_",
    hasFilter: !0,
    adjustLayout: !0
  }, {
    name: "磁力猫",
    hostPatterns: [ "cilimao", "cilimaovip", "clmapp" ],
    panelSelector: "li:has(.SearchListTitle_result_title)",
    detailLinkSelector: "a.SearchListTitle_result_title",
    containerSelector: ".Search_list_info",
    magnetSelector: "a.Information_magnet",
    cachePrefix: "magnet_cilimao_",
    hasFilter: !1,
    adjustLayout: !1
  } ], CONFIG = {
    site: SITE_CONFIGS[0],
    preview: {
      apiUrl: "https://whatslink.info/api/v1/link",
      referer: "https://tmp.nulla.top/",
      cachePrefix: "preview_"
    },
    filter: {
      dropdownSelector: ".dropdown-menu.search-option-dropdown-menu"
    },
    filterOptions: [ {
      text: "小于10GB",
      sizeGB: 10,
      type: "lt"
    }, {
      text: "100MB-100GB",
      minMB: 100,
      maxGB: 100,
      type: "range"
    }, {
      text: "大于100MB",
      sizeMB: 100,
      type: "gt"
    } ],
    cacheTTL: 6048e5
  };
  function copyToClipboard(text) {
    function fallbackCopy(text2) {
      const tempInput = document.createElement("input");
      tempInput.value = text2, document.body.appendChild(tempInput), tempInput.select(), 
      document.execCommand("copy"), document.body.removeChild(tempInput);
    }
    navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(text).catch(() => fallbackCopy(text)) : fallbackCopy(text);
  }
  function createButton(text, color = "007bff") {
    const button = document.createElement("button");
    return button.className = "magnet-button", button.textContent = text, button.style.cssText = `margin-top:5px; padding:2px 8px; background-color:#${color}; color:white; border:none; border-radius:3px; cursor:pointer; font-size:12px;`, 
    button;
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
  class CacheManager {
    constructor(prefix, ttl) {
      this.prefix = prefix, this.ttl = ttl;
    }
    get(key) {
      try {
        const cacheData = Storage.get(this.prefix + key, null);
        return cacheData ? cacheData.timestamp && Date.now() - cacheData.timestamp > this.ttl ? (Storage.delete(this.prefix + key), 
        null) : cacheData.data : null;
      } catch (e) {
        return null;
      }
    }
    set(key, data) {
      try {
        Storage.set(this.prefix + key, {
          data: data,
          timestamp: Date.now()
        });
      } catch (e) {}
    }
  }
  const magnetCache = new CacheManager(CONFIG.site.cachePrefix, CONFIG.cacheTTL), previewCache = new CacheManager(CONFIG.preview.cachePrefix, CONFIG.cacheTTL);
  class ApiClient {
    static async fetchMagnetLink(url, siteConfig) {
      return new Promise(resolve => {
        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          headers: {
            Referer: location.origin
          },
          timeout: 15e3,
          onload: response => {
            if (200 === response.status) {
              let html = this.decodeBase64Response(response.responseText);
              const magnetLink = this.extractMagnetLink(html, siteConfig);
              resolve(magnetLink || null);
            } else resolve(null);
          },
          onerror: error => {
            resolve(null);
          },
          ontimeout: () => {
            resolve(null);
          }
        });
      });
    }
    static decodeBase64Response(html) {
      const atobMatch = html.match(/window\.atob\(['"]([\s\S]+?)['"]\)/);
      if (atobMatch && atobMatch[1]) try {
        const base64Content = atobMatch[1];
        return decodeURIComponent(escape(atob(base64Content)));
      } catch (e) {}
      return html;
    }
    static extractMagnetLink(html, siteConfig) {
      const doc = (new DOMParser).parseFromString(html, "text/html"), config = siteConfig || this.detectSiteConfig(doc), magnetSelector = config?.magnetSelector || "#magnet", magnetElement = doc.querySelector(magnetSelector);
      if (magnetElement) {
        const hrefAttr = magnetElement.getAttribute("href");
        if (hrefAttr?.startsWith("magnet:?")) return hrefAttr;
        const textContent = magnetElement.textContent?.trim();
        if (textContent?.startsWith("magnet:?")) return textContent;
      }
      const match = html.match(/magnet:\?xt=urn:btih:[a-zA-Z0-9]{32,40}(?:(?:&amp;|&)[^'\"<>\s]*)?/gi);
      return match ? match[0].replace(/&amp;/g, "&") : null;
    }
    static detectSiteConfig(doc) {
      for (const config of SITE_CONFIGS) if (doc.querySelector(config.magnetSelector)) return config;
      return null;
    }
    static fetchPreviewInfo(magnetLink) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: `${CONFIG.preview.apiUrl}?url=${encodeURIComponent(magnetLink)}`,
          headers: {
            Referer: CONFIG.preview.referer,
            Origin: CONFIG.preview.referer
          },
          onload: response => {
            if (200 === response.status) try {
              const data = JSON.parse(response.responseText);
              resolve(data);
            } catch (e) {
              reject(new Error("解析API响应失败"));
            } else reject(new Error(`API请求错误 (状态: ${response.status})`));
          },
          onerror: () => reject(new Error("网络连接错误"))
        });
      });
    }
  }
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
  class VerifyManager {
    static isValidPreviewData(data) {
      return data && "object" == typeof data && "number" == typeof data.size;
    }
    static async verify(magnetLink, targetElement) {
      const cachedData = previewCache.get(magnetLink);
      if (cachedData && this.isValidPreviewData(cachedData)) DomManager.displayPreviewInfo(cachedData, targetElement); else {
        targetElement.textContent = "验车中...", targetElement.style.cssText = "color: #17a2b8; font-size: 12px; margin-top: 5px; text-align: center;";
        try {
          const data = await ApiClient.fetchPreviewInfo(magnetLink);
          if (data?.name && data.size > 0 && !data.error) previewCache.set(magnetLink, data), 
          DomManager.displayPreviewInfo(data, targetElement); else {
            const message = data?.name || "获取信息失败(内容不存在或被限制)";
            DomManager.showRetryUI(targetElement, magnetLink, message);
          }
        } catch (error) {
          DomManager.showRetryUI(targetElement, magnetLink, error.message || "未知错误");
        }
      }
    }
  }
  class DomManager {
    static adjustLayout() {
      const leftColumn = document.querySelector(".col-md-6.left"), rightPanel = document.querySelector("#right-panel");
      leftColumn && (leftColumn.classList.remove("col-md-6"), leftColumn.classList.add("col-md-10")), 
      rightPanel && (rightPanel.style.display = "none");
    }
    static displayMagnetAndVerify(magnetLink, button, siteConfig) {
      const containerSelector = siteConfig?.containerSelector || ".panel-footer", panel = button.closest(containerSelector) || button.parentElement;
      if (!panel) return;
      const magnetLinkElement = document.createElement("div");
      magnetLinkElement.className = "magnet-link", magnetLinkElement.style.cssText = "margin-top:5px; word-break:break-all; cursor:pointer; background:#f8f9fa; padding:4px 8px; border-radius:3px;";
      const linkText = document.createElement("code");
      linkText.style.cssText = "color:#28a745; font-family:monospace; font-size: 12px;", 
      linkText.textContent = magnetLink, magnetLinkElement.appendChild(linkText), magnetLinkElement.title = "点击复制磁力链接", 
      magnetLinkElement.addEventListener("click", () => {
        copyToClipboard(magnetLink);
        const originalText = linkText.textContent;
        linkText.textContent = "已复制!", setTimeout(() => {
          linkText.textContent = originalText;
        }, 2e3);
      });
      const previewPlaceholder = document.createElement("div");
      previewPlaceholder.className = "preview-placeholder", button.parentNode ? button.parentNode.replaceChild(magnetLinkElement, button) : panel.appendChild(magnetLinkElement), 
      panel.appendChild(previewPlaceholder), VerifyManager.verify(magnetLink, previewPlaceholder);
    }
    static displayPreviewInfo(previewData, targetElement) {
      const container = targetElement.parentNode;
      if (!container || container.querySelector(".preview-info-container")) return;
      const infoContainer = document.createElement("div");
      infoContainer.className = "preview-info-container", infoContainer.style.cssText = "margin-top: 5px; border-top: 1px solid #eee; padding-top: 10px;";
      const {name: name, size: size, count: count, file_type: file_type, screenshots: screenshots} = previewData, detailsContainer = document.createElement("div");
      if (detailsContainer.style.cssText = "font-size: 13px; background: #f8f9fa; padding: 8px; border-radius: 4px; margin-bottom: 10px; line-height: 1.6;", 
      detailsContainer.innerHTML = `\n      <div style="font-weight: bold; margin-bottom: 5px; word-break: break-all;" title="${name}">${name}</div>\n      <div><strong>文件大小:</strong> ${function(bytes, decimals = 2) {
        if (!+bytes) return "0 Bytes";
        const dm = decimals < 0 ? 0 : decimals, i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(dm))} ${[ "Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ][i]}`;
      }(size)}</div>\n      <div><strong>文件数量:</strong> ${count || "N/A"}</div>\n      <div><strong>文件类型:</strong> ${file_type || "N/A"}</div>`, 
      infoContainer.appendChild(detailsContainer), screenshots?.length) {
        const imageUrls = screenshots.map(ss => ss.screenshot).filter(Boolean);
        if (imageUrls.length > 0) {
          const previewContainer = document.createElement("div");
          previewContainer.style.cssText = "overflow-x: auto; white-space: nowrap; padding: 5px 0;", 
          imageUrls.forEach((url, index) => {
            const img = document.createElement("img");
            img.src = url, img.style.cssText = "height: 120px; border-radius: 3px; cursor: pointer; border: 1px solid #ddd; margin-right: 5px; vertical-align: top;", 
            img.title = "点击查看大图", img.onclick = () => Lightbox.show(imageUrls, index), previewContainer.appendChild(img);
          }), infoContainer.appendChild(previewContainer);
        }
      } else {
        const noPreviewMsg = document.createElement("div");
        noPreviewMsg.textContent = "没有可用的预览图。", noPreviewMsg.style.cssText = "font-style: italic; color: #6c757d; font-size: 12px; text-align: center; padding: 10px 0;", 
        infoContainer.appendChild(noPreviewMsg);
      }
      container.contains(targetElement) && container.replaceChild(infoContainer, targetElement);
    }
    static showRetryUI(placeholder, magnetLink, message) {
      const container = placeholder.parentNode;
      if (!container) return;
      const failureContainer = document.createElement("div");
      failureContainer.className = "preview-failure-container", failureContainer.style.cssText = "margin-top: 5px;";
      const errorMsg = document.createElement("p");
      errorMsg.style.cssText = "color: #dc3545; font-size: 12px; margin: 0 0 5px 0;", 
      errorMsg.textContent = message;
      const retryButton = createButton("重新验车", "17a2b8");
      retryButton.onclick = () => VerifyManager.verify(magnetLink, failureContainer), 
      failureContainer.append(errorMsg, retryButton), container.contains(placeholder) && container.replaceChild(failureContainer, placeholder);
    }
  }
  class FilterManager {
    static init() {
      this.modifyFilters(), setTimeout(() => {
        this.updateButtonTextFromURL();
      }, 100), new MutationObserver(mutations => {
        mutations.some(m => m.addedNodes.length > 0) && this.modifyFilters();
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      });
    }
    static updateButtonTextFromURL() {
      const sofsParam = new URLSearchParams(window.location.search).get("sofs");
      sofsParam ? this.updateButtonText(sofsParam) : this.updateButtonText("all");
    }
    static updateButtonText(param) {
      const button = document.querySelector("#so-filesize-btn");
      if (!button) return;
      let buttonText = "不限大小";
      if ("all" === param) buttonText = "不限大小"; else if (param.startsWith("lt")) {
        const match = param.match(/lt(\d+)mb/);
        if (match) {
          const mb = parseInt(match[1]);
          buttonText = mb >= 1024 ? `小于${Math.round(mb / 1024)}GB` : `小于${mb}MB`;
        }
      } else if (param.startsWith("gt") && !param.includes("-")) {
        const match = param.match(/gt(\d+)mb/);
        if (match) {
          const mb = parseInt(match[1]);
          buttonText = mb >= 1024 ? `大于${Math.round(mb / 1024)}GB` : `大于${mb}MB`;
        }
      } else if (param.includes("-")) {
        const parts = param.split("-");
        if (2 === parts.length) {
          const minMatch = parts[0].match(/gt(\d+)mb/), maxMatch = parts[1].match(/lt(\d+)mb/);
          if (minMatch && maxMatch) {
            const minMb = parseInt(minMatch[1]), maxMb = parseInt(maxMatch[1]);
            buttonText = `${minMb >= 1024 ? `${Math.round(minMb / 1024)}GB` : `${minMb}MB`}-${maxMb >= 1024 ? `${Math.round(maxMb / 1024)}GB` : `${maxMb}MB`}`;
          }
        }
      }
      button.textContent = buttonText;
    }
    static modifyFilters() {
      document.querySelectorAll(CONFIG.filter.dropdownSelector).forEach(dropdown => {
        "true" !== dropdown.getAttribute("data-filter-modified") && (this.modifySizeFilter(dropdown), 
        dropdown.setAttribute("data-filter-modified", "true"));
      });
    }
    static updateOptionsFromURL() {
      const sofsParam = new URLSearchParams(window.location.search).get("sofs");
      if (!sofsParam || "all" === sofsParam) return;
      let matchedOptionIndex = -1, newDisplayText = "";
      if (sofsParam.startsWith("lt") && !sofsParam.includes("-")) {
        matchedOptionIndex = 0;
        const match = sofsParam.match(/lt(\d+)mb/);
        if (match) {
          const mb = parseInt(match[1]);
          newDisplayText = mb >= 1024 ? `小于${Math.round(mb / 1024)}GB` : `小于${mb}MB`;
        }
      } else if (sofsParam.includes("-")) {
        matchedOptionIndex = 1;
        const parts = sofsParam.split("-");
        if (2 === parts.length) {
          const minMatch = parts[0].match(/gt(\d+)mb/), maxMatch = parts[1].match(/lt(\d+)mb/);
          if (minMatch && maxMatch) {
            const minMb = parseInt(minMatch[1]), maxMb = parseInt(maxMatch[1]), minText = minMb >= 1024 ? `${Math.round(minMb / 1024)}GB` : `${minMb}MB`, maxText = maxMb >= 1024 ? `${Math.round(maxMb / 1024)}GB` : `${maxMb}MB`;
            newDisplayText = `${minText}-${maxText}`;
          }
        }
      } else if (sofsParam.startsWith("gt") && !sofsParam.includes("-")) {
        matchedOptionIndex = 2;
        const match = sofsParam.match(/gt(\d+)mb/);
        if (match) {
          const mb = parseInt(match[1]);
          newDisplayText = mb >= 1024 ? `大于${Math.round(mb / 1024)}GB` : `大于${mb}MB`;
        }
      }
      if (matchedOptionIndex >= 0 && newDisplayText) {
        const optionLinks = document.querySelectorAll("a[onclick*=\"searchWithOption('filesize'\"]");
        let customOptionsFound = 0;
        optionLinks.forEach(link => {
          const onclick = link.getAttribute("onclick") || "";
          if (onclick.includes("searchWithOption('filesize',") && !onclick.includes("'all'")) {
            if (customOptionsFound === matchedOptionIndex) {
              const wrapper = link.querySelector('span[style*="display: flex"]');
              if (wrapper) {
                const textSpan = wrapper.querySelector("span:first-child");
                textSpan && (textSpan.textContent = newDisplayText);
              }
            }
            customOptionsFound++;
          }
        });
      }
    }
    static modifySizeFilter(dropdown) {
      const sizeFilterMenu = dropdown.querySelector('a[onclick*="filesize"]')?.closest("ul");
      sizeFilterMenu && (sizeFilterMenu.querySelectorAll('a[onclick*="filesize"]:not([onclick*="\'all\'"])').forEach(filter => filter.parentElement?.remove()), 
      CONFIG.filterOptions.forEach((option, index) => {
        const li = document.createElement("li"), a = document.createElement("a"), customConfig = GM_getValue(`custom_filter_${index}`, null);
        let displayText = option.text, param = function(option) {
          switch (option.type) {
           case "lt":
            return `lt${1024 * (option.sizeGB || 0)}mb`;

           case "gt":
            return option.sizeGB ? `gt${1024 * option.sizeGB}mb` : option.sizeMB ? `gt${option.sizeMB}mb` : "gt100mb";

           case "range":
            return `gt${option.minMB || 100}mb-lt${1024 * (option.maxGB || 100)}mb`;

           default:
            return "gt100mb";
          }
        }(option);
        customConfig && (displayText = customConfig.text, param = customConfig.param);
        const wrapper = document.createElement("span");
        wrapper.style.display = "flex", wrapper.style.justifyContent = "space-between", 
        wrapper.style.alignItems = "center", wrapper.style.width = "100%";
        const textSpan = document.createElement("span");
        textSpan.textContent = displayText;
        const plusBtn = document.createElement("span");
        plusBtn.textContent = " +", plusBtn.title = "点击自定义数值", plusBtn.style.color = "#007bff", 
        plusBtn.style.fontWeight = "bold", plusBtn.style.cursor = "pointer", plusBtn.style.marginLeft = "10px", 
        wrapper.appendChild(textSpan), wrapper.appendChild(plusBtn), a.style.cursor = "pointer", 
        a.appendChild(wrapper), a.setAttribute("onclick", `searchWithOption('filesize', '${param}')`), 
        plusBtn.addEventListener("click", e => {
          e.preventDefault(), e.stopPropagation(), this.handleCustomInput(option, index, textSpan, a);
        }), li.appendChild(a), sizeFilterMenu.appendChild(li);
      }), this.updateOptionsFromURL());
    }
    static handleCustomInput(baseOption, index, textSpan, linkElement) {
      let promptMessage = "", defaultValue = "";
      const currentText = textSpan.textContent || "";
      if ("gt" === baseOption.type) {
        const match = currentText.match(/大于(\d+(?:\.\d+)?)(MB|GB)/);
        defaultValue = match ? `${match[1]}${match[2]}` : `${baseOption.sizeGB || baseOption.sizeMB}${baseOption.sizeGB ? "GB" : "MB"}`, 
        promptMessage = "请输入最小大小 (如: 500MB 或 2GB):";
      } else if ("lt" === baseOption.type) {
        const match = currentText.match(/小于(\d+(?:\.\d+)?)(MB|GB)/);
        defaultValue = match ? `${match[1]}${match[2]}` : `${baseOption.sizeGB}GB`, promptMessage = "请输入最大大小 (如: 10GB 或 5120MB):";
      } else if ("range" === baseOption.type) {
        const match = currentText.match(/(\d+(?:\.\d+)?)(MB|GB)-(\d+(?:\.\d+)?)(MB|GB)/);
        defaultValue = match ? `${match[1]}${match[2]}-${match[3]}${match[4]}` : `${baseOption.minMB ? `${Math.round(baseOption.minMB / 1024)}GB` : "1GB"}-${baseOption.maxGB ? `${baseOption.maxGB}GB` : "30GB"}`, 
        promptMessage = "请输入大小范围 (如: 2GB-50GB):";
      }
      const userInput = prompt(promptMessage, defaultValue);
      if (userInput && "" !== userInput.trim()) try {
        let newParam = "", newDisplayText = "", customConfig = {};
        if ("range" === baseOption.type) {
          const parts = userInput.split("-");
          if (2 !== parts.length) throw new Error("范围格式错误，请使用如 2GB-50GB 的格式");
          const minValue = this.parseSize(parts[0].trim()), maxValue = this.parseSize(parts[1].trim());
          if (minValue >= maxValue) throw new Error("最小值应小于最大值");
          newParam = `gt${minValue}mb-lt${maxValue}mb`, newDisplayText = userInput.trim(), 
          customConfig = {
            text: newDisplayText,
            param: newParam,
            minValue: minValue,
            maxValue: maxValue
          };
        } else {
          const value = this.parseSize(userInput.trim());
          newParam = `${baseOption.type}${value}mb`, newDisplayText = "gt" === baseOption.type ? `大于${userInput.trim()}` : `小于${userInput.trim()}`, 
          customConfig = {
            text: newDisplayText,
            param: newParam,
            value: value
          };
        }
        GM_setValue(`custom_filter_${index}`, customConfig), textSpan.textContent = newDisplayText, 
        linkElement.setAttribute("onclick", `searchWithOption('filesize', '${newParam}')`);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("sofs", newParam), currentUrl.searchParams.set("p", "1"), 
        window.location.href = currentUrl.toString();
      } catch (error) {
        alert(`输入错误: ${error.message}`);
      }
    }
    static parseSize(sizeStr) {
      const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*(MB|GB)$/i);
      if (!match) throw new Error("格式错误，请使用如 500MB 或 2GB 的格式");
      const value = parseFloat(match[1]), unit = match[2].toUpperCase();
      if (value <= 0) throw new Error("大小必须大于0");
      return "GB" === unit ? Math.round(1024 * value) : Math.round(value);
    }
  }
  (class {
    static main() {
      const config = function() {
        const hostname = window.location.hostname;
        for (const config of SITE_CONFIGS) if (config.hostPatterns.some(pattern => hostname.includes(pattern))) return config;
        return null;
      }();
      config && (this.siteConfig = config, "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", this.initialize.bind(this)) : this.initialize());
    }
    static initialize() {
      this.siteConfig.hasFilter && FilterManager.init(), this.siteConfig.adjustLayout && DomManager.adjustLayout(), 
      this.processPanels(), new MutationObserver(mutations => {
        mutations.some(m => m.addedNodes.length > 0) && this.processPanels();
      }).observe(document.body, {
        childList: !0,
        subtree: !0
      });
    }
    static processPanels() {
      const panels = document.querySelectorAll(`${this.siteConfig.panelSelector}:not([data-processed])`);
      panels.length, panels.forEach(panel => {
        panel.setAttribute("data-processed", "true"), this.siteConfig.magnetBtnSelector && this.modifyMagnetLinkBehavior(panel), 
        this.addActionButtons(panel);
      });
    }
    static modifyMagnetLinkBehavior(panel) {
      if (!this.siteConfig.magnetBtnSelector) return;
      const titleLink = panel.querySelector(this.siteConfig.detailLinkSelector);
      if (!titleLink) return;
      const detailPageUrl = titleLink.href, magnetBtn = panel.querySelector(this.siteConfig.magnetBtnSelector);
      if (!magnetBtn) return;
      const copyLink = document.createElement("a");
      copyLink.title = "点击复制磁力链接", copyLink.target = "_blank", copyLink.href = "javascript:void(0);", 
      copyLink.innerHTML = '<i class="fa fa-magnet"></i> 复制磁力', copyLink.style.cssText = "cursor: pointer; color: blue; font-weight: bold;", 
      copyLink.addEventListener("click", async e => {
        e.preventDefault(), e.stopPropagation(), await this.handleCopyClick(detailPageUrl, copyLink);
      }), magnetBtn.replaceWith(copyLink);
    }
    static addActionButtons(panel) {
      const detailLink = panel.querySelector(this.siteConfig.detailLinkSelector), container = panel.querySelector(this.siteConfig.containerSelector);
      if (!detailLink || !container) return;
      const detailPageUrl = detailLink.href;
      if (container.querySelector(".magnet-button, .magnet-link, .magnet-action-container")) return;
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "magnet-action-container", buttonContainer.style.cssText = "margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;";
      const cachedMagnet = magnetCache.get(detailPageUrl);
      if (cachedMagnet) {
        const placeholder = document.createElement("span");
        buttonContainer.appendChild(placeholder), container.appendChild(buttonContainer), 
        DomManager.displayMagnetAndVerify(cachedMagnet, placeholder, this.siteConfig);
      } else {
        const copyBtn = createButton("复制磁力", "28a745");
        copyBtn.addEventListener("click", async () => {
          await this.handleCopyClick(detailPageUrl, copyBtn);
        });
        const verifyBtn = createButton("一键验车", "007bff");
        verifyBtn.addEventListener("click", () => this.handleVerifyClick(detailPageUrl, verifyBtn, buttonContainer)), 
        buttonContainer.appendChild(copyBtn), buttonContainer.appendChild(verifyBtn), container.appendChild(buttonContainer);
      }
    }
    static async handleCopyClick(url, element) {
      const originalHTML = element.innerHTML, originalText = element.textContent;
      let magnetLink = magnetCache.get(url);
      if (magnetLink) copyToClipboard(magnetLink), this.showFeedback(element, "已复制!", originalHTML, originalText); else {
        element.innerHTML = "BUTTON" === element.tagName ? "获取中..." : '<i class="fa fa-spinner fa-spin"></i> 获取中...';
        try {
          if (magnetLink = await ApiClient.fetchMagnetLink(url, this.siteConfig), !magnetLink) throw new Error("获取失败");
          magnetCache.set(url, magnetLink), copyToClipboard(magnetLink), this.showFeedback(element, "已复制!", originalHTML, originalText);
        } catch (error) {
          this.showFeedback(element, "获取失败", originalHTML, originalText);
        }
      }
    }
    static showFeedback(element, message, originalHTML, originalText) {
      if ("BUTTON" === element.tagName) element.textContent = message, setTimeout(() => {
        element.textContent = originalText;
      }, 2e3); else {
        const icon = "已复制!" === message ? "fa-check" : "fa-exclamation-circle";
        element.innerHTML = `<i class="fa ${icon}"></i> ${message}`, setTimeout(() => {
          element.innerHTML = originalHTML;
        }, 2e3);
      }
    }
    static async handleVerifyClick(url, button, container) {
      button.textContent = "获取中...", button.disabled = !0;
      try {
        const magnetLink = await ApiClient.fetchMagnetLink(url, this.siteConfig);
        if (!magnetLink) throw new Error("获取失败");
        {
          magnetCache.set(url, magnetLink), container.innerHTML = "";
          const placeholder = document.createElement("span");
          container.appendChild(placeholder), DomManager.displayMagnetAndVerify(magnetLink, placeholder, this.siteConfig);
        }
      } catch (error) {
        button.textContent = "重试获取", button.disabled = !1;
      }
    }
  }).main();
}();

// ==UserScript==
// @name         X站-优化
// @version      1.1.1
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  xvideos··xhamster··(自动->播放·宽屏·高画质)·隐藏已观看·等增强功能
// @match        *://*.xvideos.com/*
// @match        https://*.xhamster.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xvideos.com
// @license      GPL-3.0
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539811/X%E7%AB%99-%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/539811/X%E7%AB%99-%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

!function() {
  "use strict";
  const _SiteDetector = class {
    static getCurrentSite() {
      if (this.cachedSite) return this.cachedSite;
      const hostname = window.location.hostname;
      return hostname.includes("xvideos.com") ? this.cachedSite = "xvideos" : hostname.includes("xhamster.com") ? this.cachedSite = "xhamster" : this.cachedSite = "unknown", 
      this.cachedSite;
    }
    static isXvideos() {
      return "xvideos" === this.getCurrentSite();
    }
    static isXhamster() {
      return "xhamster" === this.getCurrentSite();
    }
    static isSupported() {
      return "unknown" !== this.getCurrentSite();
    }
  };
  _SiteDetector.cachedSite = null;
  let SiteDetector = _SiteDetector;
  class PageDetector {
    static getCurrentPageType() {
      const site = SiteDetector.getCurrentSite(), path = window.location.pathname, search = window.location.search;
      return "xvideos" === site ? this.getXvideosPageType(path, search) : "xhamster" === site ? this.getXhamsterPageType(path, search) : "other";
    }
    static getXvideosPageType(path, search) {
      const params = new URLSearchParams(search);
      return path.startsWith("/video") ? "video" : path.startsWith("/c/") ? "category" : path.startsWith("/tags") ? "tags" : path.startsWith("/best") || path.startsWith("/new") ? "category" : path.startsWith("/profiles/") || path.startsWith("/channels/") || path.startsWith("/amateurs/") || path.startsWith("/pornstars/") ? "profile" : path.startsWith("/favorite/") ? "favorites" : params.has("k") ? "search" : "/" === path || "" === path ? "home" : "other";
    }
    static getXhamsterPageType(path, _search) {
      const excludedPrefixes = [ "/photos/", "/users/", "/my/", "/messages", "/live", "/creators", "/p/", "/info" ];
      if (path.startsWith("/videos/")) return "video";
      if (path.startsWith("/search/")) return "search";
      if (path.startsWith("/categories/")) return "category";
      if (path.startsWith("/tags/")) return "tags";
      if (path.startsWith("/my/favorites")) return "favorites";
      for (const prefix of excludedPrefixes) if (path.startsWith(prefix)) return "other";
      return "home";
    }
    static isListingPage() {
      const pageType = this.getCurrentPageType();
      return [ "home", "search", "category", "tags", "profile", "favorites" ].includes(pageType);
    }
    static shouldApplyHideWatched() {
      const pageType = this.getCurrentPageType();
      return [ "home", "search", "category", "tags", "profile", "video" ].includes(pageType);
    }
    static isVideoPage() {
      return "video" === this.getCurrentPageType();
    }
    static isFavoritesPage() {
      return "favorites" === this.getCurrentPageType();
    }
  }
  const storage = {
    get(key, defaultValue) {
      try {
        if ("undefined" != typeof GM_getValue) return GM_getValue("x_opt_" + key, defaultValue);
        const stored = localStorage.getItem("x_opt_" + key);
        return stored ? JSON.parse(stored) : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    set(key, value) {
      try {
        "undefined" != typeof GM_setValue ? GM_setValue("x_opt_" + key, value) : localStorage.setItem("x_opt_" + key, JSON.stringify(value));
      } catch (e) {}
    },
    remove(key) {
      try {
        "undefined" != typeof GM_deleteValue ? GM_deleteValue("x_opt_" + key) : localStorage.removeItem("x_opt_" + key);
      } catch (e) {}
    }
  }, dom = {
    select(selector, context = document) {
      try {
        return context.querySelector(selector);
      } catch {
        return null;
      }
    },
    selectAll(selector, context = document) {
      try {
        return Array.from(context.querySelectorAll(selector));
      } catch {
        return [];
      }
    },
    create(tag, options, content) {
      const el = document.createElement(tag);
      return options && Object.entries(options).forEach(([key, value]) => {
        if ("className" === key && "string" == typeof value) el.className = value; else if ("id" === key && "string" == typeof value) el.id = value; else if ("text" === key && "string" == typeof value) el.textContent = value; else if ("html" === key && "string" == typeof value) el.innerHTML = value; else if ("attrs" === key && "object" == typeof value) for (const [attrKey, attrValue] of Object.entries(value)) el.setAttribute(attrKey, attrValue); else if ("styles" === key && "object" == typeof value) Object.assign(el.style, value); else if ("children" === key && Array.isArray(value)) for (const child of value) "string" == typeof child ? el.appendChild(document.createTextNode(child)) : el.appendChild(child); else if ("events" === key && "object" == typeof value) for (const [event, handler] of Object.entries(value)) el.addEventListener(event, handler); else if (key.startsWith("on") && "function" == typeof value) {
          const eventName = key.slice(2).toLowerCase();
          el.addEventListener(eventName, value);
        } else "title" === key && "string" == typeof value && (el.title = value);
      }), content && (el.innerHTML = content), el;
    },
    remove: element => !(!element || !element.parentNode || (element.remove(), 0)),
    addStyle(css) {
      if ("undefined" != typeof GM_addStyle) GM_addStyle(css); else {
        const style = document.createElement("style");
        style.textContent = css, (document.head || document.documentElement).appendChild(style);
      }
    }
  };
  function debounce(func, wait) {
    let timeoutId = null;
    return function(...args) {
      timeoutId && clearTimeout(timeoutId), timeoutId = setTimeout(() => {
        func.apply(this, args), timeoutId = null;
      }, wait);
    };
  }
  const xvideosConfig = {
    selectors: {
      adMenuItems: [ ".head__menu-line__main-menu__lvl1.red-ticket", ".head__menu-line__main-menu__lvl1.live-cams", ".head__menu-line__main-menu__lvl1.nutaku-games", ".head__menu-line__main-menu__lvl1.ignore-popunder", 'a[href*="xvideos.red/red/videos"]', 'a[href*="zlinkt.com"]', 'a[href*="nutaku.net"]' ]
    }
  }, xhamsterConfig = {
    name: "xhamster",
    domains: [ "xhamster.com", "zh.xhamster.com" ],
    selectors: {
      playButton: ".play-inner",
      settingsButton: ".settings",
      qualityOptions: ".xp-settings-inner-list span[data-value]",
      widescreenButton: ".large-mode",
      videoItems: ".thumb-list__item.video-thumb",
      watchedIndicator: ".thumb-image-container__watched",
      adContainers: [ ".thumbContainer-53a78", ".thumb-53a78" ],
      adMenuItems: [ '[data-nav-item-id="cams"]', '[data-nav-item-id="dating"]', '[data-nav-item-id="priority-vpn"]', '[data-nav-item-id="ai-friend"]', '[data-nav-item-id="flirtify"]', '[data-item="premium"]' ],
      favoriteVideos: ".video-thumb[data-video-id]",
      removeButton: ".remove-btn",
      imageContainer: ".thumb-image-container",
      menuContainer: ".items-3b1bc",
      menuItem: ".container-64b3c"
    },
    features: {
      adBlocker: !0,
      videoEnhancer: !0,
      hideWatched: !0,
      favoritesManager: !0,
      momentsCollapser: !0
    }
  }, xhamsterAdConfig_adKeywords = [ "已支付", "付费", "PAID", "Premium", "24/7不间断直播", "约会", "Free VPN", "AI Girlfriend", "性爱聊天", "独家视频" ];
  class XvideosAdBlocker {
    static init() {
      this.setupStaticAdRemoval(), this.setupDynamicAdRemoval(), this.removeChatAds();
    }
    static setupStaticAdRemoval() {
      dom.addStyle('\n      .premium-results-line,\n      .premium-search-on-free,\n      div[class*="premium-results"] { display: none !important; }\n    ');
    }
    static setupDynamicAdRemoval() {
      document.addEventListener("DOMContentLoaded", () => {
        this.removeRedBanner(), this.removeMenuAds(), this.removePremiumAds(), this.removeChatAds(), 
        this.observeAds();
      });
    }
    static removeChatAds() {
      dom.selectAll("div").forEach(div => {
        if (div.dataset.xvChatRemoved) return;
        const text = div.textContent || "";
        text.includes("在线") && text.includes("聊天") && text.length < 50 && div.querySelector("span") && (div.remove(), 
        div.dataset.xvChatRemoved = "true");
      }), dom.selectAll("div[class]").forEach(div => {
        if (div.dataset.xvChatRemoved) return;
        const className = div.className;
        if (/^[a-fA-F0-9]{32}$/.test(className.trim())) {
          const text = div.textContent || "";
          (text.includes("聊天") || text.includes("女")) && (div.remove(), div.dataset.xvChatRemoved = "true");
        }
      });
    }
    static removeRedBanner() {
      const redBannerLink = dom.select('a[href*="xvideos.red?pmsc=header_adblock"]');
      if (redBannerLink) {
        const banner = redBannerLink.closest('div[style*="background: rgb(222, 38, 0)"]');
        banner && !banner.dataset.xvRemoved && (banner.remove(), banner.dataset.xvRemoved = "true");
      }
    }
    static removeMenuAds() {
      (xvideosConfig.selectors.adMenuItems || []).forEach(selector => {
        dom.selectAll(selector).forEach(element => {
          if (element && !element.dataset.xvRemoved) {
            const targetElement = element.closest("li") || element;
            targetElement.dataset.xvRemoved || (targetElement.remove(), targetElement.dataset.xvRemoved = "true");
          }
        });
      });
      const redPromoParagraph = dom.select('p[id*="9o6lsm8aj09wav6bf9"]');
      if (redPromoParagraph && !redPromoParagraph.dataset.xvRemoved) {
        const parentDiv = redPromoParagraph.closest('div[style*="background: rgb(222, 38, 0)"]');
        parentDiv && (parentDiv.remove(), parentDiv.dataset.xvRemoved = "true");
      }
    }
    static removePremiumAds() {
      [ ".premium-results-line", ".premium-search-on-free", 'div[class*="premium-results"]', ".thumb-block.premium-search-on-free", 'a[href*="/c/p:1/"]' ].forEach(selector => {
        dom.selectAll(selector).forEach(element => {
          element && !element.dataset.xvPremiumRemoved && (element.classList.contains("premium-results-line") || element.classList.contains("premium-search-on-free") || element.querySelector(".premium-results-line-title") || element.querySelector(".is-purchased-mark")) && (element.remove(), 
          element.dataset.xvPremiumRemoved = "true");
        });
      }), dom.selectAll("a.see-more").forEach(element => {
        const text = element.textContent || "";
        if (text.includes("XVIDEOS") && (text.includes("高级") || text.includes("Premium") || element.querySelector(".icon-f.icf-ticket-red"))) {
          const parentContainer = element.closest(".premium-results-line") || element.closest('div[class*="premium"]');
          parentContainer && !parentContainer.dataset.xvPremiumRemoved && (parentContainer.remove(), 
          parentContainer.dataset.xvPremiumRemoved = "true");
        }
      }), dom.selectAll(".thumb-block").forEach(thumb => {
        (thumb.classList.contains("premium-search-on-free") || thumb.querySelector(".is-purchased-mark")) && (thumb.dataset.xvPremiumRemoved || (thumb.remove(), 
        thumb.dataset.xvPremiumRemoved = "true"));
      });
    }
    static observeAds() {
      new MutationObserver(debounce(() => {
        this.removeRedBanner(), this.removeMenuAds(), this.removePremiumAds(), this.removeChatAds();
      }, 300)).observe(document.body, {
        childList: !0,
        subtree: !0
      });
    }
  }
  class XhamsterAdBlocker {
    static init() {
      this.addAdBlockStyles(), this.removeTopMenuAds(), this.removeVideoAds();
    }
    static addAdBlockStyles() {
      dom.addStyle("\n      .menu-ad-hidden { display: none !important; }\n    ");
    }
    static removeTopMenuAds() {
      try {
        const adMenuSelectors = xhamsterConfig.selectors.adMenuItems || [];
        let removedCount = 0;
        adMenuSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(element => {
            element && element.parentNode && !element.classList.contains("menu-ad-hidden") && (element.classList.add("menu-ad-hidden"), 
            removedCount++);
          });
        });
        const adTexts = xhamsterAdConfig_adKeywords;
        return document.querySelectorAll(".container-64b3c").forEach(item => {
          const textContent = item.textContent?.trim();
          textContent && adTexts.some(adText => textContent.includes(adText)) && (item.classList.contains("menu-ad-hidden") || (item.classList.add("menu-ad-hidden"), 
          removedCount++));
        }), removedCount;
      } catch (error) {
        return 0;
      }
    }
    static removeVideoAds() {
      let removedCount = 0;
      try {
        return document.querySelectorAll(".thumbContainer-53a78, .thumb-53a78").forEach(container => {
          container && container.parentNode && (container.remove(), removedCount++);
        }), document.querySelectorAll('a[href*="/fh/out?url="]').forEach(link => {
          const container = link.closest(".thumb-list__item, .thumbContainer-53a78, .video-thumb");
          container && container.parentNode && (container.remove(), removedCount++);
        }), document.querySelectorAll(".thumb-list__item .title, .thumb-list__item .caption, .thumbContainer-53a78 .title, .video-thumb .title").forEach(element => {
          if (element.textContent && (element.textContent.includes("已支付") || element.textContent.includes("付费") || element.textContent.includes("PAID") || element.textContent.includes("Premium"))) {
            const container = element.closest(".thumb-list__item, .thumbContainer-53a78, .video-thumb");
            container && container.parentNode && (container.remove(), removedCount++);
          }
        }), removedCount;
      } catch (error) {
        return 0;
      }
    }
  }
  class AdBlocker {
    static init() {
      SiteDetector.isXvideos() ? XvideosAdBlocker.init() : SiteDetector.isXhamster() && XhamsterAdBlocker.init();
    }
    static cleanup() {
      SiteDetector.isXhamster() && (XhamsterAdBlocker.removeTopMenuAds(), XhamsterAdBlocker.removeVideoAds());
    }
  }
  let widescreenTriggered = !1;
  class XvideosVideoEnhancer {
    static init() {
      window.location.href.includes("/video") && this.enhance();
    }
    static enhance() {
      setTimeout(() => {
        try {
          if (this.enableWidescreen(), "undefined" != typeof html5player && html5player && html5player.hlsobj && html5player.hlsobj.levels && html5player.hlsobj.levels.length > 0) {
            const targetLevel = Math.min(4, html5player.hlsobj.levels.length - 1), hlsObj = html5player.hlsobj;
            void 0 !== hlsObj.loadLevel && (hlsObj.loadLevel = targetLevel);
          }
          "undefined" != typeof html5player && html5player && "function" == typeof html5player.play && !html5player.playClicked && setTimeout(() => {
            html5player && !html5player.playClicked && html5player.play && (html5player.playClicked = !0, 
            html5player.play());
          }, 200);
        } catch (error) {}
      }, 800);
    }
    static enableWidescreen() {
      if (widescreenTriggered) return;
      if ("undefined" != typeof html5player && html5player && "function" == typeof html5player.toggleExpand) return html5player.toggleExpand(), 
      void (widescreenTriggered = !0);
      const expandButton = document.querySelector(".player-icon-f.pif-full-width");
      return expandButton ? (expandButton.click(), void (widescreenTriggered = !0)) : void 0;
    }
    static recheck() {
      window.location.href.includes("/video") && setTimeout(() => {
        "undefined" != typeof html5player && html5player && this.enhance();
      }, 1e3);
    }
  }
  class XhamsterVideoEnhancer {
    static init() {
      let qualityDone = !1, wideScreenDone = !1;
      const tryPlay = () => {
        if (qualityDone && wideScreenDone) {
          const playBtn = document.querySelector(".play-inner");
          playBtn && playBtn.click();
        }
      }, check = () => {
        if (!qualityDone) {
          const settingsBtn = document.querySelector(".settings");
          settingsBtn?.offsetParent && (settingsBtn.click(), setTimeout(() => {
            const qualityContainer = document.querySelector(".quality.chooser-control.xp-settings-inner-list-inner");
            if (qualityContainer) for (let i = 0; i < qualityContainer.childNodes.length; i++) {
              const element = qualityContainer.childNodes[i], quality = element.getAttribute?.("data-value");
              if (quality && "auto" !== quality) {
                element.click(), qualityDone = !0, tryPlay();
                break;
              }
            }
          }, 100));
        }
        if (!wideScreenDone) {
          const largeModeBtn = document.querySelector(".large-mode");
          if (largeModeBtn?.offsetParent) {
            const tooltip = largeModeBtn.getAttribute("data-xp-tooltip");
            "Exit large mode" === tooltip ? (wideScreenDone = !0, tryPlay()) : "Large mode" === tooltip && (largeModeBtn.click(), 
            wideScreenDone = !0, tryPlay());
          }
        }
        qualityDone && wideScreenDone && clearInterval(timer);
      };
      check();
      let attempts = 0;
      const timer = setInterval(() => {
        if (++attempts > 50) {
          clearInterval(timer);
          const playBtn = document.querySelector(".play-inner");
          playBtn?.click();
        } else check();
      }, 100);
    }
  }
  class VideoEnhancer {
    static init() {
      SiteDetector.isXvideos() ? XvideosVideoEnhancer.init() : SiteDetector.isXhamster() && XhamsterVideoEnhancer.init();
    }
    static recheck() {
      SiteDetector.isXvideos() && XvideosVideoEnhancer.recheck();
    }
  }
  const _XvideosHideWatched = class {
    static init() {
      this.loadState(), PageDetector.isListingPage() && (this.setupObserver(), this.isEnabled && (this.applyHiding(), 
      setTimeout(() => this.applyHiding(), 2e3)));
    }
    static loadState() {
      this.isEnabled = storage.get("xv_hide_watched", !1) ?? !1;
    }
    static toggle(enabled) {
      this.isEnabled = enabled, storage.set("xv_hide_watched", enabled), enabled ? (this.applyHiding(), 
      setTimeout(() => this.applyHiding(), 500)) : this.showAllVideos();
    }
    static getEnabled() {
      return this.isEnabled;
    }
    static applyHiding() {
      this.isEnabled && dom.selectAll(".thumb-block:not([data-xv-hidden]), .video-container:not([data-xv-hidden])").forEach(card => {
        this.isWatchedCard(card) && (card.style.display = "none", card.dataset.xvHidden = "1");
      });
    }
    static isWatchedCard(cardElement) {
      return !(!cardElement || !cardElement.classList.contains("viewed") && !cardElement.querySelector(".video-viewed") && !cardElement.querySelector(".viewedIcon"));
    }
    static showAllVideos() {
      dom.selectAll('[data-xv-hidden="1"]').forEach(card => {
        card.style.display = "", delete card.dataset.xvHidden;
      });
    }
    static setupObserver() {
      new MutationObserver(debounce(() => {
        this.isEnabled && this.applyHiding();
      }, 300)).observe(document.body, {
        childList: !0,
        subtree: !0
      });
    }
  };
  _XvideosHideWatched.isEnabled = !1;
  let XvideosHideWatched = _XvideosHideWatched;
  const _XhamsterHideWatched = class {
    static init() {
      this.loadState(), this.addFilterStyles(), this.applyFilter();
    }
    static loadState() {
      this.isEnabled = storage.get("xh_hide_watched", !1) ?? !1;
    }
    static addFilterStyles() {
      dom.addStyle("\n      .hidden-by-script { display: none !important; }\n    ");
    }
    static applyFilter() {
      if (PageDetector.shouldApplyHideWatched() && this.isEnabled) try {
        const videos = document.querySelectorAll(xhamsterConfig.selectors.videoItems);
        let hiddenCount = 0;
        videos.forEach(video => {
          video && video.querySelector(xhamsterConfig.selectors.watchedIndicator) && (video.classList.contains("hidden-by-script") || (video.classList.add("hidden-by-script"), 
          hiddenCount++));
        });
      } catch (error) {}
    }
    static showWatchedVideos() {
      try {
        const hiddenVideos = document.querySelectorAll(".hidden-by-script");
        let shownCount = 0;
        hiddenVideos.forEach(video => {
          video && video.classList && (video.classList.remove("hidden-by-script"), shownCount++);
        });
      } catch (error) {}
    }
    static toggle(enabled) {
      this.isEnabled = enabled, storage.set("xh_hide_watched", enabled), enabled ? this.applyFilter() : this.showWatchedVideos();
    }
    static getEnabled() {
      return this.isEnabled;
    }
  };
  _XhamsterHideWatched.isEnabled = !1;
  let XhamsterHideWatched = _XhamsterHideWatched;
  class HideWatched {
    static init() {
      SiteDetector.isXvideos() ? XvideosHideWatched.init() : SiteDetector.isXhamster() && XhamsterHideWatched.init();
    }
    static toggle(enabled) {
      SiteDetector.isXvideos() ? XvideosHideWatched.toggle(enabled) : SiteDetector.isXhamster() && XhamsterHideWatched.toggle(enabled);
    }
    static getEnabled() {
      return SiteDetector.isXvideos() ? XvideosHideWatched.getEnabled() : !!SiteDetector.isXhamster() && XhamsterHideWatched.getEnabled();
    }
    static applyFilter() {
      SiteDetector.isXvideos() ? XvideosHideWatched.applyHiding() : SiteDetector.isXhamster() && XhamsterHideWatched.applyFilter();
    }
  }
  function getRecentTags() {
    return storage.get("xv_recent_tags", []) ?? [];
  }
  function renderRecentTags() {
    const container = document.getElementById("recent-tags-container");
    if (!container) return;
    container.innerHTML = "";
    const tags = getRecentTags();
    if (tags.length > 0) {
      const titleDiv = document.createElement("div");
      titleDiv.className = "xv-modern-title", titleDiv.innerHTML = '<span class="xv-icon">🕒</span><span class="xv-text">近期标签</span>', 
      container.appendChild(titleDiv);
      const tagsWrapper = document.createElement("div");
      tagsWrapper.className = "xv-modern-tags-wrapper", tags.forEach(tag => {
        const a = document.createElement("a");
        a.href = tag.href, a.textContent = tag.text, a.className = "xv-modern-tag", tagsWrapper.appendChild(a);
      }), container.appendChild(tagsWrapper);
    }
  }
  class RecentTags {
    static init() {
      this.createTagsContainer(), this.setupClickListener();
    }
    static createTagsContainer() {
      const anchor = function() {
        const bestFilters = document.querySelector(".listing_filters");
        if (bestFilters) return {
          node: bestFilters,
          position: "beforebegin"
        };
        const headMenu = document.querySelector(".head__menu-line");
        if (headMenu) return {
          node: headMenu,
          position: "afterend"
        };
        const headerBottom = document.querySelector("#header .header-bottom") || document.querySelector(".header-bottom");
        return headerBottom ? {
          node: headerBottom,
          position: "afterend"
        } : null;
      }();
      if (anchor && !document.getElementById("recent-tags-container")) {
        const recentTagsContainer = document.createElement("div");
        recentTagsContainer.id = "recent-tags-container", recentTagsContainer.className = "xv-recent-tags-container", 
        anchor.node.insertAdjacentElement(anchor.position, recentTagsContainer);
      }
      renderRecentTags();
    }
    static setupClickListener() {
      document.addEventListener("click", function(e) {
        const target = e.target?.closest("a");
        target && target.classList.contains("is-keyword") && target.getAttribute("href") && (function(tag) {
          let tags = getRecentTags();
          tags = tags.filter(t => t.href !== tag.href), tags.unshift(tag), tags.length > 30 && (tags = tags.slice(0, 30)), 
          function(tags) {
            storage.set("xv_recent_tags", tags);
          }(tags);
        }({
          text: target.textContent?.trim() || "",
          href: target.getAttribute("href") || ""
        }), renderRecentTags());
      });
    }
  }
  const _WatchLaterManager = class {
    static init() {
      this.isWatchLaterPage() && (this.hookNetworkForTokens(), this.probePlaylistTokens(), 
      this.setupObserver(), this.addRemoveButtons());
    }
    static isWatchLaterPage() {
      return location.pathname.startsWith("/watch-later");
    }
    static hookNetworkForTokens() {
      try {
        const origFetch = window.fetch, self = this;
        window.fetch = async function(input, init) {
          const res = await origFetch.call(this, input, init);
          return self.tryCaptureTokensFromResponse(input, res), res;
        };
      } catch {}
      try {
        let WrappedXHR = function() {
          const xhr = new OrigXHR, origOpen = xhr.open;
          return xhr.open = function(_method, url) {
            return this.__xv_url = url, origOpen.apply(this, arguments);
          }, xhr.addEventListener("load", function() {
            self.tryCaptureTokensFromXHR(this.__xv_url, this);
          }), xhr;
        };
        const OrigXHR = window.XMLHttpRequest, self = this;
        window.XMLHttpRequest = WrappedXHR;
      } catch {}
    }
    static setupObserver() {
      new MutationObserver(debounce(() => {
        this.addRemoveButtons();
      }, 300)).observe(document.body, {
        childList: !0,
        subtree: !0
      });
    }
    static addRemoveButtons() {
      dom.selectAll(".video-container, .thumb-block").forEach(card => {
        if ("1" === card.dataset.xvRemBtn) return;
        const thumb = card.querySelector(".video-thumb, .thumb, a:has(img), .thumb-inside"), img = card.querySelector('img[data-videoid], img[id^="pic_"]');
        if (!thumb || !img) return;
        const videoId = this.extractVideoId(card);
        videoId && this.addRemoveButton(card, videoId, thumb);
      });
    }
    static addRemoveButton(card, videoId, thumb) {
      const removeBtn = dom.create("div", {
        className: "xv-watchlater-remove",
        title: "从稍后观看移除",
        onclick: e => {
          e.preventDefault(), e.stopPropagation(), this.removeFromWatchLater(videoId, card);
        }
      }), icon = dom.create("span", {
        className: "xv-remove-icon"
      }, "×");
      removeBtn.appendChild(icon), "static" === getComputedStyle(thumb).position && (thumb.style.position = "relative"), 
      thumb.appendChild(removeBtn), card.dataset.xvRemBtn = "1";
    }
    static async removeFromWatchLater(videoId, card) {
      try {
        if (this.playlistId && this.csrfRemove || await this.probePlaylistTokens(), !this.playlistId || !this.csrfRemove) return;
        const url = `/api/playlists/list/${this.playlistId}/remove/${videoId}`, body = `csrf=${encodeURIComponent(this.csrfRemove)}`, resp = await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            accept: "application/json, text/javascript, */*; q=0.01",
            "x-requested-with": "XMLHttpRequest"
          },
          credentials: "same-origin",
          body: body
        }), result = await resp.json();
        result && !0 === result.result && (card && card.parentElement && card.remove(), 
        result.data?.list?.csrf?.remove && (this.csrfRemove = result.data.list.csrf.remove));
      } catch (err) {}
    }
    static extractVideoId(card) {
      const videoLink = card.querySelector('a[href*="/video"]');
      if (videoLink) {
        const href = videoLink.getAttribute("href") || "", newMatch = href.match(/\/video\.([a-zA-Z0-9]+)/);
        if (newMatch) return newMatch[1];
        const oldMatch = href.match(/\/video(\d+)/);
        if (oldMatch) return oldMatch[1];
      }
      if (card.dataset.id) return card.dataset.id;
      const img = card.querySelector('img[data-videoid], img[id^="pic_"]');
      if (img) {
        const videoId = img.getAttribute("data-videoid") || (img.id && img.id.startsWith("pic_") ? img.id.replace("pic_", "") : null);
        if (videoId) return videoId;
      }
      const allLinks = card.querySelectorAll("a[href]");
      for (const link of allLinks) {
        const href = link.getAttribute("href") || "", match = href.match(/\/video\.([a-zA-Z0-9]+)/) || href.match(/\/video(\d+)/);
        if (match) return match[1];
      }
      return null;
    }
    static tryCaptureTokensFromResponse(input, res) {
      try {
        const url = "string" == typeof input ? input : input && input.url ? input.url : "";
        if (!/\/api\/playlists\/list\/(\d+)/.test(url)) return;
        const id = RegExp.$1;
        res.clone().json().then(data => {
          data?.data?.list?.csrf?.remove && (this.playlistId = id, this.csrfRemove = data.data.list.csrf.remove);
        }).catch(() => {});
      } catch {}
    }
    static tryCaptureTokensFromXHR(url, xhr) {
      try {
        if (!/\/api\/playlists\/list\/(\d+)/.test(url)) return;
        const id = RegExp.$1, text = xhr.responseText;
        if (!text) return;
        const data = JSON.parse(text);
        data?.data?.list?.csrf?.remove && (this.playlistId = id, this.csrfRemove = data.data.list.csrf.remove);
      } catch {}
    }
    static async probePlaylistTokens() {
      if (!this.playlistId) {
        const withPl = document.querySelector('a[href*="?pl="]');
        if (withPl) {
          const pl = new URL(withPl.href, location.origin).searchParams.get("pl");
          pl && (this.playlistId = pl);
        }
      }
      if (!this.playlistId) {
        const urlMatch = location.pathname.match(/\/watch-later\/(\d+)/);
        urlMatch && (this.playlistId = urlMatch[1]);
      }
      if (!this.playlistId) {
        const scripts = document.querySelectorAll("script");
        for (const script of scripts) {
          const text = script.textContent || "", match = text.match(/playlist[_-]?id['":\s]+['"]?(\d+)/i) || text.match(/watch[_-]?later[_-]?id['":\s]+['"]?(\d+)/i) || text.match(/"id"\s*:\s*(\d+).*"watch-later"/);
          if (match) {
            this.playlistId = match[1];
            break;
          }
        }
      }
      if (!this.playlistId) {
        const dataEl = document.querySelector("[data-playlist-id], [data-list-id]");
        dataEl && (this.playlistId = dataEl.getAttribute("data-playlist-id") || dataEl.getAttribute("data-list-id") || null, 
        this.playlistId);
      }
      if (this.playlistId && !this.csrfRemove) try {
        const resp = await fetch(`/api/playlists/list/${this.playlistId}`, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "x-requested-with": "XMLHttpRequest"
          }
        }), data = await resp.json();
        data?.data?.list?.csrf?.remove && (this.csrfRemove = data.data.list.csrf.remove);
      } catch (err) {}
    }
  };
  _WatchLaterManager.playlistId = null, _WatchLaterManager.csrfRemove = null;
  let WatchLaterManager = _WatchLaterManager;
  class MenuIntegration {
    static init() {
      PageDetector.isListingPage() && (this.addHideWatchedMenuItem(), setTimeout(() => {
        const storedState = storage.get("xv_hide_watched", !1) ?? !1;
        this.updateMenuItemState(storedState);
      }, 100));
    }
    static addHideWatchedMenuItem() {
      if (dom.select("#xv-hide-watched-menu-item")) return;
      let mainMenu = dom.select(".head__menu-line__main-menu"), menuType = "main-menu";
      if (!(mainMenu || (mainMenu = dom.select(".header-bottom-inner"), menuType = "header-bottom-inner", 
      mainMenu || (mainMenu = dom.select(".head__menu-line"), menuType = "menu-line", 
      mainMenu || (mainMenu = dom.select("header .menu"), menuType = "header-menu", mainMenu || (mainMenu = dom.select("header"), 
      menuType = "header", mainMenu)))))) return;
      const menuItem = this.createHideWatchedMenuItem(menuType);
      mainMenu.appendChild(menuItem);
    }
    static createHideWatchedMenuItem(menuType) {
      const isEnabled = storage.get("xv_hide_watched", !1) ?? !1;
      if ("header-bottom-inner" === menuType) {
        const menuLink = dom.create("a", {
          id: "xv-hide-watched-menu-item",
          className: "header-link",
          attrs: {
            href: "#"
          },
          events: {
            click: e => {
              e.preventDefault(), this.toggleHideWatched();
            }
          }
        }), icon = dom.create("span", {
          className: "icon-f " + (isEnabled ? "icf-eye icf-red-crossed" : "icf-eye")
        }), title = dom.create("span", {
          className: "item-title",
          text: isEnabled ? "隐藏已观看" : "显示已观看"
        });
        return menuLink.appendChild(icon), menuLink.appendChild(title), menuLink;
      }
      {
        const menuItem = dom.create("li", {
          id: "xv-hide-watched-menu-item"
        }), menuLink = dom.create("a", {
          className: "head__menu-line__main-menu__lvl1",
          attrs: {
            href: "#"
          },
          events: {
            click: e => {
              e.preventDefault(), this.toggleHideWatched();
            }
          }
        }), icon = dom.create("span", {
          className: `icon-f ${isEnabled ? "icf-eye icf-red-crossed" : "icf-eye"} xv-eye-icon`
        }), title = dom.create("span", {
          className: "main-cats-title",
          text: isEnabled ? " 隐藏已观看 " : " 显示已观看 "
        });
        return menuLink.appendChild(icon), menuLink.appendChild(title), menuItem.appendChild(menuLink), 
        menuItem;
      }
    }
    static toggleHideWatched() {
      const newState = !storage.get("xv_hide_watched", !1);
      storage.set("xv_hide_watched", newState), this.updateMenuItemState(newState), XvideosHideWatched.toggle(newState);
    }
    static updateMenuItemState(enabled) {
      const menuItem = dom.select("#xv-hide-watched-menu-item");
      if (menuItem) {
        const icon = menuItem.querySelector(".icon-f"), title = menuItem.querySelector(".main-cats-title") || menuItem.querySelector(".item-title");
        icon && title && (enabled ? (icon.className = icon.className.includes("xv-eye-icon") ? "icon-f icf-eye icf-red-crossed xv-eye-icon" : "icon-f icf-eye icf-red-crossed", 
        icon.style.color = "", title.textContent = "main-cats-title" === title.className ? " 隐藏已观看 " : "隐藏已观看") : (icon.className = icon.className.includes("xv-eye-icon") ? "icon-f icf-eye xv-eye-icon" : "icon-f icf-eye", 
        icon.style.color = "", title.textContent = "main-cats-title" === title.className ? " 显示已观看 " : "显示已观看"));
      }
    }
  }
  class FavoritesManager {
    static init() {
      this.initRemoveFeature();
    }
    static addRemoveButtons() {
      (window.location.href.includes("watch-later") || window.location.href.includes("/my/favorites/videos")) && (document.querySelector(".xh-icon") ? document.querySelectorAll(".video-thumb[data-video-id]").forEach(item => {
        if (item.querySelector(".remove-btn")) return;
        const videoId = item.getAttribute("data-video-id");
        let collectionId = null;
        if (window.location.href.includes("watch-later")) collectionId = window.location.pathname.match(/\/videos\/([^-]+)-watch-later/)?.[1] || null; else if (window.location.href.includes("/my/favorites/videos")) {
          const urlMatch = window.location.pathname.match(/\/videos\/([^\/]+)/);
          if (urlMatch) collectionId = urlMatch[1]; else {
            const activeCollection = document.querySelector(".favorites-collection.active, .active[data-id]");
            if (activeCollection) collectionId = activeCollection.getAttribute("data-id"); else {
              const videoContainer = item.closest(".favorites-collection, [data-collection-id]");
              videoContainer && (collectionId = videoContainer.getAttribute("data-collection-id") || videoContainer.getAttribute("data-id"));
            }
          }
        }
        if (!videoId || !collectionId) return;
        const removeBtn = document.createElement("div");
        removeBtn.className = "remove-btn", removeBtn.style.cssText = "\n        position: absolute;\n        top: 5px;\n        right: 5px;\n        width: 24px;\n        height: 24px;\n        background: rgba(0, 0, 0, 0.7);\n        border-radius: 50%;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        cursor: pointer;\n        z-index: 10;\n        transition: background 0.2s;\n        opacity: 1;\n        visibility: visible;\n      ";
        const iconElement = document.createElement("i");
        iconElement.className = "xh-icon bucket cobalt", iconElement.style.cssText = "color: white; font-size: 12px; display: inline-block;", 
        removeBtn.appendChild(iconElement), removeBtn.addEventListener("mouseenter", () => {
          removeBtn.style.background = "rgba(255, 0, 0, 0.8)";
        }), removeBtn.addEventListener("mouseleave", () => {
          removeBtn.style.background = "rgba(0, 0, 0, 0.7)";
        }), removeBtn.addEventListener("click", e => {
          e.preventDefault(), e.stopPropagation(), this.removeFromFavorites(videoId, collectionId);
        });
        const imageContainer = item.querySelector(".thumb-image-container");
        imageContainer && (imageContainer.style.position = "relative", imageContainer.appendChild(removeBtn));
      }) : setTimeout(() => this.addRemoveButtons(), 100));
    }
    static async removeFromFavorites(videoId, _collectionId) {
      try {
        if ((await fetch("/x-api", {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
            "X-Requested-With": "XMLHttpRequest"
          },
          body: JSON.stringify([ {
            name: "favoriteVideosModelSync",
            requestData: {
              model: {
                id: null,
                $id: this.generateUUID(),
                modelName: "favoriteVideosModel",
                itemState: "changed",
                collections: [],
                contentType: "videos",
                contentEntity: {
                  id: videoId
                }
              }
            }
          } ])
        })).ok) {
          const videoElement = document.querySelector(`[data-video-id="${videoId}"]`);
          videoElement && videoElement.remove();
        }
      } catch (error) {}
    }
    static generateUUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        const r = 16 * Math.random() | 0;
        return ("x" == c ? r : 3 & r | 8).toString(16);
      });
    }
    static initRemoveFeature() {
      (window.location.href.includes("watch-later") || window.location.href.includes("/my/favorites/videos")) && ("complete" === document.readyState ? setTimeout(() => this.addRemoveButtons(), 500) : window.addEventListener("load", () => {
        setTimeout(() => this.addRemoveButtons(), 500);
      }));
    }
  }
  const _MomentsCollapser = class {
    static init() {
      this.initialized || (this.initialized = !0, this.injectStyles(), this.apply());
    }
    static apply() {
      const sections = document.querySelectorAll(this.SECTION_SELECTOR);
      sections.length && sections.forEach(section => this.enhanceSection(section));
    }
    static enhanceSection(section) {
      section.dataset.xhMomentsReady || (section.dataset.xhMomentsReady = "true", section.classList.add("xh-moments-section"));
      const heading = section.querySelector(".heading-b7566");
      if (!heading) return;
      heading.classList.add("xh-moments-heading");
      let toggleBtn = section.querySelector(".xh-moments-toggle");
      toggleBtn || (toggleBtn = document.createElement("button"), toggleBtn.type = "button", 
      toggleBtn.className = "xh-moments-toggle", toggleBtn.setAttribute("aria-label", "折叠瞬间模块"), 
      heading.appendChild(toggleBtn), toggleBtn.addEventListener("click", event => {
        event.preventDefault(), event.stopPropagation();
        const newState = !section.classList.contains("xh-moments-collapsed");
        this.setCollapsed(section, toggleBtn, newState);
      })), this.syncState(section, toggleBtn);
    }
    static syncState(section, toggleBtn) {
      const collapsed = storage.get("xh_moments_collapsed", !1);
      this.setCollapsed(section, toggleBtn, collapsed);
    }
    static setCollapsed(section, toggleBtn, collapsed) {
      section.classList.toggle("xh-moments-collapsed", collapsed), toggleBtn.textContent = collapsed ? "展开瞬间" : "折叠瞬间", 
      toggleBtn.setAttribute("aria-expanded", collapsed ? "false" : "true"), storage.set("xh_moments_collapsed", collapsed);
    }
    static injectStyles() {
      if (this.styleInjected) return;
      this.styleInjected = !0;
      const style = document.createElement("style");
      style.textContent = "\n      .xh-moments-section {\n        position: relative;\n      }\n\n      .xh-moments-heading {\n        display: flex;\n        align-items: center;\n        gap: 12px;\n      }\n\n      .xh-moments-heading > *:first-child {\n        flex: 1;\n      }\n\n      .xh-moments-toggle {\n        border: none;\n        background: rgba(255, 255, 255, 0.12);\n        color: inherit;\n        font-size: 12px;\n        padding: 4px 10px;\n        border-radius: 999px;\n        cursor: pointer;\n        transition: background 0.2s ease;\n        display: inline-flex;\n        align-items: center;\n        gap: 4px;\n      }\n\n      .xh-moments-toggle:hover {\n        background: rgba(255, 255, 255, 0.2);\n      }\n\n      .xh-moments-section.xh-moments-collapsed > :not(.heading-b7566) {\n        display: none !important;\n      }\n    ", 
      document.head.appendChild(style);
    }
  };
  _MomentsCollapser.initialized = !1, _MomentsCollapser.styleInjected = !1, _MomentsCollapser.SECTION_SELECTOR = '[data-block="moments"]';
  let MomentsCollapser = _MomentsCollapser;
  const _AppController = class {
    static init() {
      this.addPreloadStyles(), this.createToggleUI(), this.initUnifiedObserver();
    }
    static addPreloadStyles() {
      const preloadStyle = document.createElement("style");
      preloadStyle.id = "xh-preload-styles", preloadStyle.textContent = '\n      .menu-ad-hidden { display: none !important; }\n      .hidden-by-script { display: none !important; }\n      \n      [data-nav-item-id="cams"],\n      [data-nav-item-id="dating"],\n      [data-nav-item-id="priority-vpn"],\n      [data-nav-item-id="ai-friend"],\n      [data-nav-item-id="flirtify"],\n      [data-item="premium"] {\n        display: none !important;\n      }\n    ', 
      document.head.insertBefore(preloadStyle, document.head.firstChild);
    }
    static createToggleUI() {
      if (!PageDetector.shouldApplyHideWatched()) return;
      if (document.querySelector("#xh-toggle-compact-btn")) return;
      const insertionInfo = (() => {
        let menuContainer = document.querySelector(".items-3b1bc");
        if (menuContainer || (menuContainer = document.querySelector(".container-3b1bc")), 
        menuContainer || (menuContainer = document.querySelector("nav .container-3b1bc, header .container-3b1bc")), 
        menuContainer) {
          const moreButton = menuContainer.querySelector(".dropdown-3b1bc");
          if (moreButton) return {
            container: menuContainer,
            insertAfter: moreButton
          };
          const lastMenuItem = menuContainer.querySelector(".container-64b3c:last-child");
          return lastMenuItem ? {
            container: menuContainer,
            insertAfter: lastMenuItem
          } : {
            container: menuContainer,
            insertAfter: null
          };
        }
        return null;
      })();
      if (insertionInfo) {
        const toggleButton = document.createElement("div");
        toggleButton.id = "xh-toggle-compact-btn", toggleButton.className = "container-64b3c", 
        toggleButton.style.cssText = "\n        display: flex;\n        align-items: center;\n        cursor: pointer;\n        transition: all 0.3s ease;\n        margin: 0;\n        padding: 0;\n        position: relative;\n        z-index: 1000;\n      ";
        const innerLink = document.createElement("a");
        innerLink.className = "root-48288 invert-48288 link-64b3c", innerLink.href = "#", 
        innerLink.style.cssText = "\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        padding: 6px 12px;\n        height: 100%;\n        text-decoration: none;\n        color: inherit;\n        position: relative;\n        z-index: 1001;\n      ";
        const buttonText = document.createElement("div");
        buttonText.className = "h4-8643e invert-8643e linkText-64b3c", buttonText.textContent = "已观看", 
        buttonText.style.cssText = "\n        white-space: nowrap;\n        transition: all 0.3s ease;\n        position: relative;\n        z-index: 1002;\n      ", 
        innerLink.appendChild(buttonText), toggleButton.appendChild(innerLink);
        const updateView = () => {
          XhamsterHideWatched.getEnabled() ? (buttonText.textContent = "已观看", buttonText.style.textDecoration = "line-through", 
          buttonText.style.color = "#999") : (buttonText.textContent = "已观看", buttonText.style.textDecoration = "none", 
          buttonText.style.color = "");
        };
        toggleButton.addEventListener("click", e => {
          e.preventDefault(), e.stopPropagation();
          const currentSetting = XhamsterHideWatched.getEnabled();
          XhamsterHideWatched.toggle(!currentSetting), updateView();
        });
        try {
          if (insertionInfo.insertAfter) {
            const nextSibling = insertionInfo.insertAfter.nextSibling;
            nextSibling ? insertionInfo.container.insertBefore(toggleButton, nextSibling) : insertionInfo.container.appendChild(toggleButton);
          } else insertionInfo.container.appendChild(toggleButton);
        } catch (error) {
          try {
            document.body.appendChild(toggleButton);
          } catch (fallbackError) {}
        }
        updateView(), this.monitorButtonStability(toggleButton);
      } else setTimeout(() => this.createToggleUI(), 1e3);
    }
    static monitorButtonStability(button) {
      let checkCount = 0;
      const checkStability = () => {
        if (checkCount++, !document.contains(button)) return button.remove(), void setTimeout(() => this.createToggleUI(), 500);
        const rect = button.getBoundingClientRect();
        0 !== rect.width && 0 !== rect.height || (button.style.display = "flex", button.style.visibility = "visible", 
        button.style.opacity = "1"), checkCount < 10 && setTimeout(checkStability, 2e3);
      };
      setTimeout(checkStability, 1e3);
    }
    static initUnifiedObserver() {
      this.debouncedContentHandler = debounce(() => {
        XhamsterAdBlocker.removeVideoAds(), XhamsterHideWatched.applyFilter(), FavoritesManager.addRemoveButtons(), 
        XhamsterAdBlocker.removeTopMenuAds(), MomentsCollapser.apply();
      }, 150), setTimeout(() => {
        XhamsterAdBlocker.removeVideoAds(), XhamsterHideWatched.applyFilter(), XhamsterAdBlocker.removeTopMenuAds(), 
        MomentsCollapser.apply();
      }, 100), this.intervalId = window.setInterval(() => {
        XhamsterAdBlocker.removeVideoAds(), XhamsterHideWatched.applyFilter(), XhamsterAdBlocker.removeTopMenuAds(), 
        MomentsCollapser.apply();
      }, 3e3), this.mutationObserver = new MutationObserver(mutations => {
        let hasRelevantChanges = !1;
        mutations.forEach(mutation => {
          "childList" === mutation.type && mutation.addedNodes.length > 0 && mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node, isRelevant = element.classList && (element.classList.contains("thumb-list__item") || element.classList.contains("thumbContainer-53a78") || element.classList.contains("video-thumb") || element.classList.contains("thumb-53a78") || element.classList.contains("thumb-image-container__watched") || element.classList.contains("content") || element.classList.contains("main")), hasRelevantContent = element.querySelector && (element.querySelector(".thumb-list__item") || element.querySelector(".video-thumb") || element.querySelector(".thumb-image-container__watched") || element.querySelector('a[href*="/fh/out?url="]'));
              (isRelevant || hasRelevantContent) && (hasRelevantChanges = !0);
            }
          });
        }), hasRelevantChanges && this.debouncedContentHandler();
      });
      const containers = [ document.querySelector(".thumb-list"), document.querySelector(".videos-list"), document.querySelector(".content-container"), document.querySelector("main"), document.querySelector("#content") ].filter(Boolean), observerConfig = {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: [ "class" ]
      };
      containers.length > 0 ? containers.forEach(container => {
        container && container.nodeType === Node.ELEMENT_NODE && this.mutationObserver.observe(container, observerConfig);
      }) : document.body && document.body.nodeType === Node.ELEMENT_NODE && this.mutationObserver.observe(document.body, observerConfig);
    }
    static triggerUpdate() {
      this.debouncedContentHandler && this.debouncedContentHandler();
    }
    static cleanup() {
      this.intervalId && (clearInterval(this.intervalId), this.intervalId = null), this.mutationObserver && (this.mutationObserver.disconnect(), 
      this.mutationObserver = null);
    }
  };
  _AppController.mutationObserver = null, _AppController.intervalId = null, _AppController.debouncedContentHandler = null;
  let AppController = _AppController;
  SiteDetector.isSupported() && (SiteDetector.isXvideos() ? (class {
    static init() {
      this.addBaseStyles();
    }
    static addBaseStyles() {
      dom.addStyle('\n      /* 隐藏广告元素 */\n      #warning-survey,\n      #video-right,\n      #ad-footer { display: none !important; }\n      \n      /* 隐藏菜单栏广告链接 */\n      .head__menu-line__main-menu__lvl1.red-ticket,\n      .head__menu-line__main-menu__lvl1.live-cams,\n      .head__menu-line__main-menu__lvl1.nutaku-games,\n      .head__menu-line__main-menu__lvl1.ignore-popunder {\n          display: none !important;\n      }\n      \n      /* 隐藏包含特定链接的菜单项 */\n      a[href*="xvideos.red/red/videos"],\n      a[href*="zlinkt.com"],\n      a[href*="nutaku.net"] {\n          display: none !important;\n      }\n      \n      /* 隐藏父级菜单项 */\n      li:has(> a[href*="xvideos.red/red/videos"]),\n      li:has(> a[href*="zlinkt.com"]),\n      li:has(> a[href*="nutaku.net"]) {\n          display: none !important;\n      }\n      \n      /* 隐藏红色横幅广告 */\n      div[style*="background: rgb(222, 38, 0)"],\n      div[id*="9o6lsm8aj09wav6bf9"] {\n          display: none !important;\n      }\n      \n      /* 隐藏包含xvideos.red推广的元素 */\n      p:has(> a[href*="xvideos.red?pmsc=header_adblock"]) {\n          display: none !important;\n      }\n      \n      /* 隐藏高级内容推广广告 */\n      .premium-results-line,\n      .premium-search-on-free,\n      div[class*="premium-results"],\n      .thumb-block.premium-search-on-free {\n          display: none !important;\n      }\n      \n      /* 隐藏包含高级标记的缩略图 */\n      .thumb-block:has(.is-purchased-mark),\n      .thumb-under:has(.is-purchased-mark) {\n          display: none !important;\n      }\n      \n      /* 隐藏高级内容链接 */\n      a[href*="/c/p:1/"]:has(.icon-f.icf-ticket-red),\n      a.see-more:has(.icon-f.icf-ticket-red) {\n          display: none !important;\n      }\n      \n      /* 隐藏包含XVIDEOS高级推广的父容器 */\n      div:has(> .premium-results-line-title),\n      div:has(> .premium-results-line-see-more) {\n          display: none !important;\n      }\n      \n      /* 基础动画 */\n      .xv-fade-in {\n          animation: xvFadeIn 300ms ease-in-out;\n      }\n      \n      @keyframes xvFadeIn {\n          from { opacity: 0; transform: translateY(-5px); }\n          to { opacity: 1; transform: translateY(0); }\n      }\n      \n      /* 隐藏聊天广告元素 */\n      div.hdA51ca5F0AeAC4cd3F3ACC2400C47C67,\n      div[class*="hdA51ca5F0AeAC4cd3F3ACC2400C47C67"] {\n          display: none !important;\n      }\n      \n      /* 主容器 */\n      #recent-tags-container { \n          display: flex;\n          align-items: center;\n          padding: 5px 15px;\n          background: #fff; \n          border-bottom: 1px solid #eee;\n          gap: 12px;\n          overflow: hidden;\n          height: 40px;\n          box-sizing: border-box;\n          margin-top: -15px;\n          position: relative;\n          z-index: 10;\n      }\n\n      /* 标题区域 */\n      .xv-modern-title {\n          display: flex;\n          align-items: center;\n          gap: 6px;\n          font-size: 13px;\n          color: #64748b;\n          font-weight: 600;\n          flex-shrink: 0;\n          user-select: none;\n      }\n      \n      .xv-modern-title .xv-icon {\n          font-size: 14px;\n      }\n\n      /* 标签滚动区域 */\n      .xv-modern-tags-wrapper {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          flex: 1;\n          overflow: hidden;\n          mask-image: linear-gradient(to right, #000 95%, transparent 100%);\n          -webkit-mask-image: linear-gradient(to right, #000 95%, transparent 100%);\n      }\n\n      /* 现代化标签本体 */\n      .xv-modern-tag {\n          display: inline-flex;\n          align-items: center;\n          justify-content: center;\n          height: 28px;\n          padding: 0 12px;\n          font-size: 13px;\n          color: #334155;\n          background-color: #f1f5f9;\n          border-radius: 999px;\n          text-decoration: none !important;\n          white-space: nowrap;\n          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n          border: 1px solid transparent;\n          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;\n      }\n\n      /* 悬停效果 - 品牌色 */\n      .xv-modern-tag:hover {\n          background-color: #de2600;\n          color: #ffffff;\n          transform: translateY(-1px);\n          box-shadow: 0 4px 6px -1px rgba(222, 38, 0, 0.2), 0 2px 4px -1px rgba(222, 38, 0, 0.1);\n          border-color: #de2600;\n      }\n\n      /* 点击效果 */\n      .xv-modern-tag:active {\n          transform: translateY(0);\n          background-color: #b91f00;\n          box-shadow: none;\n      }\n\n      /* 稍后观看：缩略图右下角移除按钮 */\n      .xv-watchlater-remove { \n          position: absolute; \n          right: 6px; \n          bottom: 6px; \n          width: 26px; \n          height: 26px; \n          border-radius: 50%;\n          background: rgba(239,68,68,.92); \n          color: #fff; \n          display: flex; \n          align-items: center; \n          justify-content: center; \n          cursor: pointer;\n          font-weight: 700; \n          line-height: 1; \n          box-shadow: 0 2px 6px rgba(0,0,0,.25); \n          z-index: 5; \n      }\n      .xv-watchlater-remove:hover { \n          background: rgba(220,38,38,.98); \n      }\n      .xv-watchlater-remove .xv-remove-icon { \n          pointer-events: none; \n          font-size: 16px; \n      }\n      \n      /* 隐藏已观看眼睛图标样式 */\n      .xv-eye-icon {\n          transition: all 0.3s ease;\n      }\n      \n      /* 悬停效果 */\n      #xv-hide-watched-menu-item .head__menu-line__main-menu__lvl1:hover .xv-eye-icon {\n          color: #d32f2f !important;\n      }\n      \n      #xv-hide-watched-menu-item .head__menu-line__main-menu__lvl1:active .xv-eye-icon {\n          color: #b71c1c !important;\n      }\n    ');
    }
  }.init(), AdBlocker.init(), document.addEventListener("DOMContentLoaded", () => {
    PageDetector.isListingPage() && MenuIntegration.init(), RecentTags.init(), HideWatched.init(), 
    WatchLaterManager.init(), PageDetector.isVideoPage() && VideoEnhancer.init();
  }), window.addEventListener("load", () => {
    PageDetector.isVideoPage() && VideoEnhancer.recheck();
  })) : SiteDetector.isXhamster() && function() {
    try {
      VideoEnhancer.init(), AdBlocker.init(), HideWatched.init(), FavoritesManager.init(), 
      MomentsCollapser.init(), AppController.init();
    } catch (error) {}
    "complete" === document.readyState ? setTimeout(() => {
      AppController.triggerUpdate();
    }, 300) : window.addEventListener("load", () => {
      setTimeout(() => {
        AppController.triggerUpdate();
      }, 300);
    }), window.addEventListener("beforeunload", () => {
      AppController.cleanup();
    });
  }()), window.XOptimizer = {
    SiteDetector: SiteDetector,
    PageDetector: PageDetector,
    modules: {
      AdBlocker: AdBlocker,
      VideoEnhancer: VideoEnhancer,
      HideWatched: HideWatched
    }
  };
}();

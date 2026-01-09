// ==UserScript==
// @name         Bypass ArabSeed
// @name:ar      تخطي عرب سيد
// @namespace    Violentmonkey Scripts
// @version      2.4.8
// @description  Automatically bypass the countdown and show the download link
// @description:ar هذا السكربت مخصص لتحسين تجربتك على موقع عرب سيد من خلال تجاوز العراقيل المختلفة مثل مؤقت العد التنازلي، النوافذ المنبثقة، التحويلات المزيفة، وفتح صفحة التحميل مباشرةً. استمتع بتجربة مشاهدة سلسة دون انقطاع!
// @author       Ezio Auditore
// @license      MIT
// @icon         https://i.imgur.com/purcqbc.png
// @match        https://m.gameshop4u.com/*
// @match        https://m.gamehub.cam/*
// @match        https://adding.quest/*
// @match        https://zplay.gamezone.cam/*
// @match        https://gamestation.cam/*
// @match        https://gplay.gameplanet.cam/*
// @match        https://tplay.techplanet.cam/*
// @match        https://eplay2.gameplanet.cam/*
// @match        https://plg7.reviewpalace.net/*
// @match        https://tplay2.techplanet.cam/*
// @match        https://migration.cam/*
// @match        https://m.hegra.cam/*
// @match        https://m.regenzi.site/*
// @match        https://m.monafes.site/*
// @match        https://m.reviewpalace.net/*
// @match        https://m.techland.live/*
// @match        https://forgee.xyz/*
// @match        https://m.forgee.xyz/*
// @match        https://kalosha.site/*
// @match        https://reviewpalace.net/*
// @match        https://jurbana.site/*
// @match        https://hawsa.site/*
// @match        https://gamevault.cam/*
// @match        https://safary.site/*
// @match        https://logenzi.site/*
// @match        https://maftou7.site/*
// @match        https://mar3a.site/*
// @match        https://be7alat.site/*
// @match        https://mastaba.site/*
// @match        https://gamezone.cam/*
// @match        https://robou3.site/*
// @match        https://mar3a.site/*
// @match        https://dl4all.online/*
// @match        https://cheapou.site/*
// @match        https://hegry.site/*
// @match        https://playarena.cam/*
// @match        https://moshakes.site/*
// @match        https://joyarcade.cam/*
// @match        https://gameflare.cam/*
// @match        https://shallal.site/*
// @match        https://marcmello.site/*
// @match        https://mal3oub.site/*
// @match        https://shabory.site/*
// @match        https://marshoush.site/*
// @match        https://ka3boly.site/*
// @match        https://muhager.site/*
// @match        https://ofreok.online/*
// @match        https://ofre15.online/*
// @match        https://a.asd.homes/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/527229/Bypass%20ArabSeed.user.js
// @updateURL https://update.greasyfork.org/scripts/527229/Bypass%20ArabSeed.meta.js
// ==/UserScript==


(function () {
  "use strict";

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  const CONFIG = {
    constants: {
      OFREOK_POLL_INTERVAL: 2000,
      DEBOUNCE_DELAY: 500,
      MAX_URL_KEY_LENGTH: 200,
    },

    domains: {
      blocked: [
        "videovils.click",
        "href.li",
        "aabroishere.website",
        "fulvideozrt.click",
        "pub-9c4ec7f3f95c448b85e464d2b533aac1.r2.dev",
        "ntryiwl.click",
      ],

      external: [
        "turbobit.net",
        "up-4ever.net",
        "frdl.io",
        "filespayouts.com",
        "bigwarp.io",
        "nitroflare.com",
      ],

      ofreok: ["ofreok.online", "ofre15.online"],

      tfsRequired: [
        "hawsa.site",
        "gamevault.cam",
        "safary.site",
        "logenzi.site",
        "maftou7.site",
        "mar3a.site",
        "be7alat.site",
        "mastaba.site",
        "gamezone.cam",
        "robou3.site",
        "dl4all.online",
        "cheapou.site",
        "hegry.site",
        "playarena.cam",
        "moshakes.site",
        "joyarcade.cam",
        "gameflare.cam",
        "shallal.site",
        "marcmello.site",
        "mal3oub.site",
        "shabory.site",
        "marshoush.site",
        "ka3boly.site",
        "muhager.site",
      ],

      dynamicAds: ["asd.quest", "asd.rest", "asd.show"],
    },

    selectors: {
      countdown: "#countdown",
      downloadButton: "#btn",
      downloadForm: "form#btn",
      clickMeDiv: "div#clickme",
      modalDialog: ".modalDialog",
      modal: "#modal",
      mp4Link: 'a[href$=".mp4"]',
      mp4LinkAny: 'a[href*=".mp4"]',
      videoElement: "video",
      metaRefresh: 'meta[http-equiv="Refresh"]',
      allLinks: "a",
      hiddenElements: '[style*="display: none"]',
    },

    urlPatterns: {
      category: /\/category\/.+\?r=\d+$/,
      pstParam: /[?&]pst=\d+$/,
      gameParam: /[?&]game=\d+$/,
      rParam: /r=\d+/,
    },

    domainConfigs: {
      "m.monafes.site": {
        params: ["t=1", "mon=1"],
        test: (url) => !/&t=1&mon=1/.test(url),
      },
      "m.gamehub.cam": {
        params: ["mon=1"],
        test: (url) => /r=\d+/.test(url) && !/mon=1/.test(url),
        replace: (url) => url.replace(/(r=\d+)/, "$1&mon=1"),
      },
      "m.techland.live": {
        params: ["t=1", "etu=1"],
        test: (url) => !/&t=1&etu=1/.test(url),
      },
      "m.reviewpalace.net": {
        params: ["t=1", "tuh=1"],
        test: (url) => !/&t=1&tuh=1/.test(url),
      },
      "forgee.xyz": {
        params: ["mon=1"],
        test: (url) => !/&mon=1/.test(url),
      },
      "m.forgee.xyz": {
        params: ["mon=1", "monz=1"],
        test: (url) => !/&mon=1/.test(url) || !/&monz=1/.test(url),
      },
      "kalosha.site": {
        params: ["gmz=1"],
        test: (url) =>
          url.includes("game=") &&
          !url.includes("gmz=1") &&
          !url.includes("dgame="),
      },
      "reviewpalace.net": {
        params: ["gmz=1"],
        test: (url) =>
          CONFIG.urlPatterns.pstParam.test(url) && !/&gmz=1/.test(url),
      },
      "jurbana.site": {
        params: ["gmz=1"],
        test: (url) =>
          CONFIG.urlPatterns.gameParam.test(url) && !url.includes("gmz=1"),
      },
      "a.asd.homes": {
        params: [
          "asd4a=1",
          "asd7b=1",
          "asd7h=1",
          "asd7m=1",
          "asd7n=1",
          "asd7p=1",
        ],
        test: (url) =>
          url.includes("/category/downloadz/") &&
          url.includes("r=") &&
          !url.includes("asd4a=1"),
      },
    },
  };

  // ============================================================================
  // UTILITIES
  // ============================================================================

  const Utils = {
    log(message, ...args) {
      console.log(`[BypassScript] ${message}`, ...args);
    },

    error(message, error) {
      console.error(`[BypassScript] ${message}`, error);
    },

    debounce(func, delay) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    },

    safeQuerySelector(selector, parent = document) {
      try {
        return parent.querySelector(selector);
      } catch (e) {
        Utils.error(`Invalid selector: ${selector}`, e);
        return null;
      }
    },

    safeQuerySelectorAll(selector, parent = document) {
      try {
        return Array.from(parent.querySelectorAll(selector));
      } catch (e) {
        Utils.error(`Invalid selector: ${selector}`, e);
        return [];
      }
    },

    getCurrentHostname() {
      return window.location.hostname;
    },

    getCurrentUrl() {
      return window.location.href;
    },

    injectUrlParams(url, params) {
      const separator = url.includes("?") ? "&" : "?";
      const missingParams = params.filter((param) => !url.includes(param));
      return missingParams.length > 0
        ? url + separator + missingParams.join("&")
        : url;
    },

    isExternalFileHost(url) {
      return CONFIG.domains.external.some((host) => url.includes(host));
    },

    isBlockedDomain(url) {
      return CONFIG.domains.blocked.some((domain) => url.includes(domain));
    },

    redirectTo(url) {
      Utils.log("Redirecting to:", url);
      window.location.replace(url);
    },
  };

  // ============================================================================
  // ANTI-INSPECTION MODULE
  // ============================================================================

  const AntiInspection = {
    init() {
      this.blockUnGrabber();
      this.overrideWindowOpen();
    },

    blockUnGrabber() {
      Object.defineProperty(window, "mdpUnGrabber", {
        value: {},
        writable: false,
      });

      Object.defineProperty(window, "UnGrabber", {
        value: function () {
          return { init: function () {} };
        },
        writable: false,
      });
    },

    overrideWindowOpen() {
      const originalOpen = window.open;

      window.open = function (url, name, features) {
        try {
          const parsedUrl = new URL(url, window.location.href);

          if (Utils.isBlockedDomain(parsedUrl.hostname)) {
            Utils.log("Blocked window.open call to:", url);
            return null;
          }
        } catch (e) {
          Utils.error("Error parsing URL in window.open override:", e);
        }

        return originalOpen.call(window, url, name, features);
      };
    },
  };

  // ============================================================================
  // URL NORMALIZER MODULE
  // ============================================================================

  const URLNormalizer = {
    normalize() {
      const hostname = Utils.getCurrentHostname();
      const currentUrl = Utils.getCurrentUrl();

      if (this.shouldSkipNormalization()) {
        Utils.log("Skipping normalization - external file host detected");
        return false;
      }

      // Check domain-specific configurations
      const domainConfig = this.getDomainConfig(hostname);
      if (domainConfig && this.shouldApplyConfig(currentUrl, domainConfig)) {
        return this.applyDomainConfig(currentUrl, domainConfig);
      }

      // Check TFS parameter requirement
      if (this.requiresTfsParam(hostname, currentUrl)) {
        return this.applyTfsParam(currentUrl);
      }

      // Check generic category pattern
      if (this.matchesCategoryPattern(currentUrl)) {
        return this.applyCategoryBypass(hostname, currentUrl);
      }

      return false;
    },

    shouldSkipNormalization() {
      const downloadBtn = Utils.safeQuerySelector(
        CONFIG.selectors.downloadButton
      );
      return downloadBtn && Utils.isExternalFileHost(downloadBtn.href);
    },

    getDomainConfig(hostname) {
      return Object.entries(CONFIG.domainConfigs).find(([domain]) =>
        hostname.includes(domain)
      )?.[1];
    },

    shouldApplyConfig(url, config) {
      return config.test(url);
    },

    applyDomainConfig(url, config) {
      if (config.replace) {
        Utils.redirectTo(config.replace(url));
      } else {
        const newUrl = Utils.injectUrlParams(url, config.params);
        if (newUrl !== url) {
          Utils.redirectTo(newUrl);
        }
      }
      return true;
    },

    requiresTfsParam(hostname, url) {
      return (
        CONFIG.domains.tfsRequired.includes(hostname) &&
        url.includes("r=") &&
        !url.includes("tfs=1")
      );
    },

    applyTfsParam(url) {
      const newUrl = Utils.injectUrlParams(url, ["tfs=1"]);
      Utils.redirectTo(newUrl);
      return true;
    },

    matchesCategoryPattern(url) {
      return CONFIG.urlPatterns.category.test(url);
    },

    applyCategoryBypass(hostname, url) {
      const config = this.getDomainConfig(hostname);

      if (config && config.test(url)) {
        this.applyDomainConfig(url, config);
        return true;
      }

      if (!/&t=1/.test(url)) {
        Utils.redirectTo(`${url}&t=1`);
        return true;
      }

      return false;
    },
  };

  // ============================================================================
  // META REDIRECT HANDLER
  // ============================================================================

  const MetaRedirectHandler = {
    skip() {
      try {
        const metaRefresh = Utils.safeQuerySelector(
          CONFIG.selectors.metaRefresh
        );

        if (metaRefresh) {
          const content = metaRefresh.getAttribute("content");
          const redirectUrl = content?.split("URL=")[1];

          if (redirectUrl) {
            Utils.redirectTo(redirectUrl);
          }
        }
      } catch (error) {
        Utils.error("Error in skipMetaRedirect:", error);
      }
    },
  };

  // ============================================================================
  // UI MANIPULATOR MODULE
  // ============================================================================

  const UIManipulator = {
    hideCountdownAndShowButton() {
      try {
        const countdown = Utils.safeQuerySelector(CONFIG.selectors.countdown);
        const downloadButton = Utils.safeQuerySelector(
          CONFIG.selectors.downloadButton
        );

        if (countdown) {
          countdown.style.display = "none";
        }

        if (downloadButton) {
          downloadButton.style.display = "block";
        }
      } catch (error) {
        Utils.error("Error in hideCountdownAndShowButton:", error);
      }
    },

    makeElementVisible(element) {
      if (!element) return;

      element.style.display = "block";
      element.style.visibility = "visible";
    },

    removeElement(element) {
      element?.remove();
    },

    removeElements(selector) {
      Utils.safeQuerySelectorAll(selector).forEach((el) => el.remove());
    },
  };

  // ============================================================================
  // OFREOK BYPASS HANDLER
  // ============================================================================

  const OfreokBypassHandler = {
    isOfreokDomain() {
      return CONFIG.domains.ofreok.includes(Utils.getCurrentHostname());
    },

    init() {
      if (!this.isOfreokDomain()) return;

      Utils.log("Initializing Ofreok bypass");

      this.forceRevealContent();
      this.disableAntiBypass();
      this.createDomGuard();
      this.handleDownloadButton();
      this.startContinuousMonitoring();
    },

    forceRevealContent() {
      const realLinks = [
        Utils.safeQuerySelector(CONFIG.selectors.downloadButton),
        Utils.safeQuerySelector(CONFIG.selectors.mp4Link),
        Utils.safeQuerySelector('a[href*="/direct/"]'),
      ].filter(Boolean);

      realLinks.forEach((link) => UIManipulator.makeElementVisible(link));

      const selectorsToRemove = [
        CONFIG.selectors.countdown,
        CONFIG.selectors.downloadButton,
        CONFIG.selectors.modalDialog,
        CONFIG.selectors.modal,
      ].join(", ");

      UIManipulator.removeElements(selectorsToRemove);

      Utils.safeQuerySelectorAll(CONFIG.selectors.hiddenElements).forEach(
        (el) => {
          UIManipulator.makeElementVisible(el);
        }
      );
    },

    disableAntiBypass() {
      if (typeof countdown !== "undefined") {
        countdown.start = () => {};
        countdown.stop = () => {};
        if (countdown.container) {
          countdown.container.style.display = "none";
        }
      }

      Object.defineProperty(window, "adsbygoogle", {
        value: [],
        writable: false,
      });

      if (typeof MutationObserver !== "undefined") {
        const originalObserve = MutationObserver.prototype.observe;
        MutationObserver.prototype.observe = function () {
          Utils.log("MutationObserver disabled");
        };
      }
    },

    createDomGuard() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType !== 1) return;

            if (
              node.matches?.(
                `${CONFIG.selectors.countdown}, ${CONFIG.selectors.modalDialog}`
              )
            ) {
              node.remove();
            }

            node
              .querySelectorAll?.(CONFIG.selectors.hiddenElements)
              .forEach((el) => {
                UIManipulator.makeElementVisible(el);
              });
          });
        });
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style"],
      });
    },

    handleDownloadButton() {
      const realLink = Utils.safeQuerySelector(
        `a${CONFIG.selectors.downloadButton}`
      );
      const fakeForm = Utils.safeQuerySelector(CONFIG.selectors.downloadForm);
      const clickMeDiv = Utils.safeQuerySelector(CONFIG.selectors.clickMeDiv);

      if (realLink) {
        UIManipulator.makeElementVisible(realLink);
      }

      if (fakeForm) {
        fakeForm.style.display = "none";
        fakeForm.submit();
      }

      if (clickMeDiv) {
        clickMeDiv.style.display = "none";
      }
    },

    startContinuousMonitoring() {
      setInterval(() => {
        this.forceRevealContent();
        this.disableAntiBypass();
        this.handleDownloadButton();
      }, CONFIG.constants.OFREOK_POLL_INTERVAL);
    },

    interceptDownloadClick() {
      Utils.safeQuerySelectorAll("a, button").forEach((element) => {
        if (/(download|تحميل)/i.test(element.textContent)) {
          element.addEventListener(
            "click",
            (e) => {
              e.preventDefault();

              const directLink =
                Utils.safeQuerySelector(CONFIG.selectors.mp4LinkAny)?.href ||
                Utils.safeQuerySelector(CONFIG.selectors.videoElement)?.src;

              if (directLink) {
                Utils.log("Redirecting to direct link:", directLink);
                window.location.href = directLink;
              }
            },
            true
          );
        }
      });
    },
  };

  // ============================================================================
  // DOWNLOAD HANDLER MODULE
  // ============================================================================

  const DownloadHandler = {
    init() {
      if (OfreokBypassHandler.isOfreokDomain()) {
        OfreokBypassHandler.interceptDownloadClick();
        return;
      }

      this.attachClickInterceptor();
    },

    findDownloadButton() {
      let button =
        Utils.safeQuerySelector("a.download-button") ||
        Utils.safeQuerySelector("button.download-button") ||
        Utils.safeQuerySelector('a[href*="movie="]');

      if (!button) {
        button = Utils.safeQuerySelectorAll("a, button").find((el) =>
          /download/i.test(el.textContent)
        );
      }

      return button;
    },

    findMp4Link() {
      let mp4Link = Utils.safeQuerySelector(CONFIG.selectors.mp4Link);

      if (!mp4Link) {
        const allMp4Links = Utils.safeQuerySelectorAll(
          CONFIG.selectors.mp4LinkAny
        );
        mp4Link = allMp4Links[0];
      }

      return mp4Link;
    },

    attachClickInterceptor() {
      const downloadButton = this.findDownloadButton();

      if (downloadButton) {
        Utils.log("Download button found. Attaching click interceptor.");

        downloadButton.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            e.stopPropagation();

            const mp4Link = this.findMp4Link();

            if (mp4Link) {
              Utils.log("Redirecting to MP4:", mp4Link.href);
              window.location.href = mp4Link.href;
            } else {
              Utils.log("No MP4 link found. Checking video element...");

              const videoElement = Utils.safeQuerySelector(
                CONFIG.selectors.videoElement
              );
              if (videoElement?.src) {
                window.location.href = videoElement.src;
              }
            }
          },
          true
        );
      }
    },
  };

  // ============================================================================
  // AD BLOCKER MODULE
  // ============================================================================

  const AdBlocker = {
    init() {
      if (!this.shouldBlockAds()) return;

      this.observeDynamicContent();
    },

    shouldBlockAds() {
      return CONFIG.domains.dynamicAds.includes(Utils.getCurrentHostname());
    },

    observeDynamicContent() {
      const debouncedBlocker = Utils.debounce(() => {
        this.blockAdLinks();
      }, CONFIG.constants.DEBOUNCE_DELAY);

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList" || mutation.type === "attributes") {
            debouncedBlocker();
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["href"],
      });
    },

    blockAdLinks() {
      Utils.safeQuerySelectorAll(CONFIG.selectors.allLinks).forEach((link) => {
        const href = link.getAttribute("href");

        if (href && Utils.isBlockedDomain(href)) {
          link.removeAttribute("href");
          Utils.log("Blocked redirect to:", href);
        }
      });
    },
  };

  // ============================================================================
  // MAIN CONTROLLER
  // ============================================================================

  const BypassController = {
    init() {
      Utils.log("Initializing script on:", Utils.getCurrentHostname());

      try {
        // Phase 1: Anti-inspection
        AntiInspection.init();

        // Phase 2: URL normalization (may redirect)
        if (URLNormalizer.normalize()) {
          Utils.log("URL normalization triggered redirect");
          return;
        }

        // Phase 3: Meta redirect handling
        MetaRedirectHandler.skip();

        // Phase 4: UI manipulation
        UIManipulator.hideCountdownAndShowButton();

        // Phase 5: Ofreok-specific bypass
        OfreokBypassHandler.init();

        // Phase 6: Download button handling
        DownloadHandler.init();

        // Phase 7: Ad blocking
        AdBlocker.init();

        Utils.log("Script initialization complete");
      } catch (error) {
        Utils.error("Fatal error during initialization:", error);
      }
    },
  };

  // ============================================================================
  // ENTRY POINT
  // ============================================================================

  function bootstrap() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        BypassController.init()
      );
    } else {
      BypassController.init();
    }
  }

  bootstrap();
})();

// ==UserScript==
// @name         Kemono/Coomer Grid Gallery Layout
// @namespace    https://greasyfork.org/users/172087
// @version      0.9.1
// @description  Add a responsive grid gallery layout for the kemono/coomer thumbnails, using the first attachment image file as the cover
// @author       Neko_Aria
// @icon         https://kemono.cr/static/favicon.ico
// @match        https://coomer.st/*
// @match        https://kemono.cr/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517432/KemonoCoomer%20Grid%20Gallery%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/517432/KemonoCoomer%20Grid%20Gallery%20Layout.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Core configuration constants
  const CONFIG = {
    LAYOUT: {
      GRID_GAP: "16px",
      GRID_MIN_COLUMN_WIDTH: "250px",
    },
    SELECTORS: {
      GRID: ".card-list__items",
      POST_CARD: ".post-card",
      POST_IMAGE: ".post-card__image",
    },
    SUPPORTED_IMAGES: new Set([
      ".bmp",
      ".gif",
      ".jpeg",
      ".jpg",
      ".png",
      ".webp",
    ]),
    SITES: {
      "kemono.cr": {
        API_BASE_URL: "https://kemono.cr/api/v1",
        IMAGE_BASE_URL: "https://img.kemono.cr/thumbnail/data",
      },
      "coomer.st": {
        API_BASE_URL: "https://coomer.st/api/v1",
        IMAGE_BASE_URL: "https://img.coomer.st/thumbnail/data",
      },
    },
  };

  // Get current site configuration
  function getCurrentSiteConfig() {
    const domain = window.location.hostname;
    return CONFIG.SITES[domain] || null;
  }

  // Inject styles
  const STYLES = `
        .card-list--legacy .card-list__items {
          display: grid !important;
          grid-template-columns: repeat(auto-fill, ${CONFIG.LAYOUT.GRID_MIN_COLUMN_WIDTH});
          gap: ${CONFIG.LAYOUT.GRID_GAP};
          padding: ${CONFIG.LAYOUT.GRID_GAP};
          width: 100%;
          margin: 0 auto;
          grid-auto-rows: auto;
        }

        .post-card {
          width: 100% !important;
          margin: 0 !important;
          break-inside: avoid;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          overflow: hidden;
          height: auto !important;
          transition: transform 0.2s ease;
        }

        .post-card:hover {
          transform: translateY(-2px);
        }

        .post-card__image-container {
          position: relative;
          width: 100%;
          height: auto !important;
        }

        .post-card__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .loading-overlay {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 20px;
          border-radius: 8px;
          z-index: 9999;
          display: flex;
          align-items: center;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid #fff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 1s linear infinite;
          margin-right: 10px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;

  // Utility classes
  class DOMUtils {
    static createLoadingOverlay() {
      const overlay = document.createElement("div");
      overlay.className = "loading-overlay";
      overlay.innerHTML = `
            <div class="loading-spinner"></div>
            <span>Loading images...</span>
          `;
      document.body.appendChild(overlay);
      return overlay;
    }

    static waitForElement(selector) {
      return new Promise((resolve) => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }

        const observer = new MutationObserver((_, obs) => {
          const element = document.querySelector(selector);
          if (element) {
            obs.disconnect();
            resolve(element);
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      });
    }

    static createImageLoadPromise(imgElement) {
      return new Promise((resolve) => {
        imgElement.onload = resolve;
        imgElement.onerror = resolve;
      });
    }
  }

  class URLParser {
    static parseUserPath() {
      const path = window.location.pathname;
      const matches = path.match(/^\/([^\/]+)\/user\/(.+)/);
      return matches ? { service: matches[1], userId: matches[2] } : null;
    }

    static isImageFile(path) {
      if (!path) return false;
      const extension = path.toLowerCase().slice(path.lastIndexOf("."));
      return CONFIG.SUPPORTED_IMAGES.has(extension);
    }
  }

  // Gallery core class
  class Gallery {
    constructor() {
      this.grid = null;
      this.postAttachments = new Map();
      this.loadingOverlay = null;
      this.imageLoadPromises = [];
      this.siteConfig = getCurrentSiteConfig();
    }

    async initialize() {
      try {
        this.grid = await DOMUtils.waitForElement(CONFIG.SELECTORS.GRID);
        this.grid.style.removeProperty("--card-size");

        await this.loadPostData();
        await this.processExistingCards();
      } catch (error) {
        console.error("Gallery initialization failed:", error);
      } finally {
        this.cleanup();
      }
    }

    async loadPostData() {
      this.loadingOverlay = DOMUtils.createLoadingOverlay();
      const urlParams = URLParser.parseUserPath();

      if (!urlParams || !this.siteConfig) {
        return;
      }

      try {
        const posts = await this.fetchPosts(urlParams);
        this.processPostsData(posts);
      } catch (error) {
        console.error("Failed to load post data:", error);
      }
    }

    async fetchPosts({ service, userId }) {
      const baseUrl = `${this.siteConfig.API_BASE_URL}/${service}/user/${userId}/posts`;

      const searchParams = new URLSearchParams(window.location.search);
      const queryString = searchParams.toString();

      const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }

    processPostsData(posts) {
      posts.forEach((post) => {
        const attachmentPath = post.attachments?.[0]?.path || post.file?.path;
        if (attachmentPath) {
          this.postAttachments.set(post.id, attachmentPath);
        }
      });
    }

    async processExistingCards() {
      const cards = this.grid.querySelectorAll(CONFIG.SELECTORS.POST_CARD);
      const processPromises = Array.from(cards).map((card) =>
        this.processCard(card)
      );

      await Promise.all(processPromises);
    }

    async processCard(card) {
      const link = card.querySelector('a[href*="/user/"][href*="/post/"]');
      if (!link) return;

      const postId = link.href.split("/").pop();
      const attachmentPath = this.postAttachments.get(postId);
      const imgElement = card.querySelector(CONFIG.SELECTORS.POST_IMAGE);

      if (
        imgElement &&
        attachmentPath &&
        URLParser.isImageFile(attachmentPath)
      ) {
        const imageUrl = `${this.siteConfig.IMAGE_BASE_URL}${attachmentPath}`;
        imgElement.src = imageUrl;

        const loadPromise = DOMUtils.createImageLoadPromise(imgElement);
        this.imageLoadPromises.push(loadPromise);
        await loadPromise;
      }
    }

    cleanup() {
      if (this.loadingOverlay) {
        this.loadingOverlay.remove();
      }
      this.imageLoadPromises = [];
    }
  }

  // Initialization and monitoring logic
  class GalleryManager {
    constructor() {
      this.gallery = null;
      this.isProcessing = false;
      this.lastUrl = location.href;

      this.initializeGallery = this.initializeGallery.bind(this);
      this.debouncedInit = this.debounce(this.initializeGallery);
    }

    async initializeGallery() {
      if (this.isProcessing) return;
      this.isProcessing = true;

      try {
        if (this.gallery) {
          this.gallery.cleanup();
        }
        this.gallery = new Gallery();
        await this.gallery.initialize();
      } catch (error) {
        console.error("Gallery initialization failed:", error);
      } finally {
        this.isProcessing = false;
      }
    }

    setupUrlChangeListener() {
      const observer = new MutationObserver(() => {
        if (location.href !== this.lastUrl) {
          this.lastUrl = location.href;
          this.debouncedInit();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
      window.addEventListener("popstate", this.initializeGallery);
    }

    debounce(fn, delay = 200) {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
      };
    }

    start() {
      GM_addStyle(STYLES);
      this.initializeGallery();
      this.setupUrlChangeListener();
    }
  }

  // Start application
  new GalleryManager().start();
})();
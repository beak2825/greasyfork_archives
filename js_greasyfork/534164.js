// ==UserScript==
// @name         Auto-play video thumbnails (Sxyprn, Watchporn, Yesporn, TheyAreHuge, Eporner, ShyFap)
// @namespace    https://greasyfork.org/users/1168969
// @version      1.5
// @description  Auto-play video thumbnails with dark theme on adult sites including Eporner, Sxyprn, Watchporn, Yesporn, TheyAreHuge, ShyFap
// @author       6969RandomGuy6969
// @match        https://sxyprn.com/*
// @match        https://watchporn.to/*
// @match        https://yesporn.vip/*
// @match        https://www.theyarehuge.com/*
// @match        https://www.eporner.com/*
// @match        https://www.shyfap.net/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @icon         https://cdn-icons-png.flaticon.com/512/3998/3998861.png
// @downloadURL https://update.greasyfork.org/scripts/534164/Auto-play%20video%20thumbnails%20%28Sxyprn%2C%20Watchporn%2C%20Yesporn%2C%20TheyAreHuge%2C%20Eporner%2C%20ShyFap%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534164/Auto-play%20video%20thumbnails%20%28Sxyprn%2C%20Watchporn%2C%20Yesporn%2C%20TheyAreHuge%2C%20Eporner%2C%20ShyFap%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ==================== GM MENU ====================
  // Register menu commands for easy access to more scripts
  GM_registerMenuCommand('🔞 More Scripts (Sleazyfork)', () => {
    GM_openInTab('https://sleazyfork.org/en/users/1168969-6969randomguy6969', { active: true });
  });

  GM_registerMenuCommand('📜 More Scripts (Greasyfork)', () => {
    GM_openInTab('https://greasyfork.org/en/users/1168969-6969randomguy6969', { active: true });
  });

  // ==================== CORE FUNCTIONALITY ====================
  const hostname = window.location.hostname;

  // Generic preview injector
  function insertPreviewVideo(image, videoUrl) {
    if (!videoUrl) return;

    // Avoid duplicate
    if (image.dataset.previewAttached) return;
    image.dataset.previewAttached = "1";

    const video = document.createElement('video');
    video.src = videoUrl;
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    video.style.position = "absolute";
    video.style.top = "0";
    video.style.left = "0";

    const parent = image.parentNode;
    parent.style.position = 'relative';
    parent.appendChild(video);
    image.style.opacity = "0";
  }

  // IntersectionObserver wrapper
  function observeElements(selector, getUrl) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const url = getUrl(el);
          if (url) insertPreviewVideo(el, url);
          observer.unobserve(el);
        }
      });
    }, { rootMargin: "200px" });

    function watch() {
      document.querySelectorAll(selector).forEach(el => observer.observe(el));
    }

    watch();
    new MutationObserver(watch).observe(document.body, { childList: true, subtree: true });
  }

  // Site-specific handlers
  const siteHandlers = {
    "eporner.com": function () {
      function buildWebmUrl(videoIdFull) {
        const shortId = videoIdFull.substring(0, 8);
        const d1 = shortId.charAt(0);
        const d2 = shortId.substring(0, 2);
        const d3 = shortId.substring(0, 3);
        return `https://static-eu-cdn.eporner.com/thumbs/static4/${d1}/${d2}/${d3}/${shortId}/${shortId}-preview.webm`;
      }

      observeElements(".mbimg img[data-st]", img => {
        const dataSt = img.getAttribute("data-st");
        if (!dataSt) return null;
        const [videoIdFull] = dataSt.split("|");
        if (!videoIdFull || videoIdFull.length < 8) return null;
        return buildWebmUrl(videoIdFull);
      });
    },

    "sxyprn.com": function () {
      document.querySelectorAll(".mini_post_vid_thumb").forEach(img => {
        const video = img.nextElementSibling;
        if (video && (video.tagName === "VIDEO" || video.tagName === "IFRAME")) {
          video.play();
        }
      });
    },

    "watchporn.to": () =>
      observeElements("img.thumb.lazy-load[data-preview]", el => el.getAttribute("data-preview")),

    "yesporn.vip": () =>
      observeElements("img.lazy-load[data-preview]", el => el.getAttribute("data-preview")),

    "theyarehuge.com": function () {
      observeElements("img[data-preview]", el => el.getAttribute("data-preview"));

      // Dark theme injection
      const style = document.createElement("style");
      style.textContent = `
        body, html { background-color:#000 !important; color:#d1d1d1 !important; }
        * { background-color:transparent !important; border-color:#444 !important; color:inherit !important; }
        a, p, h1, h2, h3, h4, h5, h6, span, div { color:#d1d1d1 !important; }
        img, video { filter:brightness(0.95) contrast(1.1); }
        .header, .footer, .sidebar, .navbar, .top-menu, .main-header { background-color:#000 !important; }
        [style*="#303030"], [style*="#FFFFFF"] { background-color:#000 !important; color:#d1d1d1 !important; }
      `;
      document.head.appendChild(style);

      const logo = document.querySelector('img[src*="tah-logo-m.png"]');
      if (logo) {
        logo.style.filter = "invert(1) hue-rotate(-180deg) brightness(1) saturate(10)";
      }
    },

    "shyfap.net": function () {
      document.querySelectorAll(".media-card_preview").forEach(card => {
        const videoUrl = card.getAttribute("data-preview");
        const video = card.querySelector("video");
        const img = card.querySelector("img");

        if (video) {
          video.muted = true;
          video.loop = true;
          video.autoplay = true;
          video.playsInline = true;
          video.preload = "auto";
          video.style.width = "100%";
          video.style.height = "100%";
          video.style.objectFit = "cover";
          if (img) img.style.display = "none";
        } else if (img && videoUrl) {
          insertPreviewVideo(img, videoUrl);
        }
      });
    }
  };

  // Dispatcher
  window.addEventListener("load", () => {
    for (const domain in siteHandlers) {
      if (hostname.includes(domain)) {
        siteHandlers[domain]();
        break;
      }
    }
  });
})();
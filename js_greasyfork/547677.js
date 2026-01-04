// ==UserScript==
// @name         Get Old Cnblogs Favicon Back
// @name:en      Get Old Cnblogs Favicon Back
// @name:zh-CN   恢复博客园旧版网站图标
// @name:zh-TW   恢復博客園舊版網站圖標
// @name:zh      恢复博客园旧版网站图标
// @name:es      Recuperar el antiguo favicon de Cnblogs.
// @name:fr      Récupérer l'ancien favicon de Cnblogs.
// @name:de      Altes Cnblogs-Favicon zurückholen.
// @name:ja      古いCnblogsのファビコンを取り戻す
// @name:ko      이전 Cnblogs 파비콘 되찾기
// @name:ru      Вернуть старый фавикон Cnblogs
// @name:pt      Recuperar o antigo favicon do Cnblogs.
// @name:it      Recupera la vecchia favicon di Cnblogs.
// @name:nl      Oude Cnblogs Favicon terughalen.
// @name:ar      استعادة أيقونة Cnblogs القديمة
// @name:hi      पुराने Cnblogs फ़ेविकॉन को वापस लाएँ
// @name:tr      Eski Cnblogs Favicon'unu Geri Getir.
// @name:pl      Przywróć starą ikonę Cnblogs
// @name:sv      Få tillbaka gamla Cnblogs favicon
// @name:fi      Hae vanha Cnblogsin kuvake takaisin
// @name:da      Få det gamle Cnblogs Favicon tilbage
// @name:no      Få tilbake det gamle Cnblogs-faviconet
// @name:cs      Získat zpět starý favicon Cnblogs
// @name:hu      Régi Cnblogs Favicon visszaállítása
// @name:ro      Recuperați vechiul favicon Cnblogs.
// @name:bg      Върни старата икона на Cnblogs.
// @name:el      Επαναφορά του παλιού Favicon του Cnblogs.
// @name:uk      Повернути старий Favicon Cnblogs
// @name:th      นำ Favicon เก่าของ Cnblogs กลับมา
// @name:vi      Lấy lại favicon cũ của Cnblogs.
// @name:id      Dapatkan Kembali Favicon Cnblogs Lama
// @name:ms      Dapatkan Kembali Favicon Cnblogs Lama
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Replace specific favicon with a old one on cnblogs.
// @description:en  Replace specific favicon with a old one on cnblogs.
// @description:zh  将博客园新版图标替换为旧版图标。
// @description:zh-CN  将博客园新版图标替换为旧版图标。
// @description:zh-TW  將博客園新版圖標替換為舊版圖標。
// @description:zh  将博客园新版图标替换为旧版图标。
// @description:es  Reemplazar el favicon específico por uno antiguo en cnblogs.
// @description:fr  Remplacer le favicon spécifique par un ancien sur cnblogs.
// @description:de  Ersetzen Sie das spezifische Favicon durch ein altes auf cnblogs.
// @description:ja  cnblogsで特定のファビコンを古いものに置き換える。
// @description:ko  cnblogs에서 특정 파비콘을 이전 것으로 교체합니다.
// @description:ru  Заменить конкретный фавикон старым на cnblogs.
// @description:pt  Substituir o favicon específico por um antigo no cnblogs.
// @description:it  Sostituire la favicon specifica con una vecchia su cnblogs.
// @description:nl  Vervang specifiek favicon door een oude op cnblogs.
// @description:ar  استبدل الأيقونة المفضلة المحددة بأخرى قديمة على cnblogs.
// @description:hi  cnblogs पर विशिष्ट फ़ेविकॉन को पुराने वाले से बदलें।
// @description:tr  cnblogs'ta belirli favori simgesini eski bir simgeyle değiştirin.
// @description:pl  Zastąp konkretną ikonę witryny (favicon) starą na cnblogs.
// @description:sv  Byt ut specifik favicon mot en gammal på cnblogs.
// @description:fi  Korvaa tietty favicon vanhalla cnblogsissa.
// @description:da  Erstat specifik favicon med en gammel en på cnblogs.
// @description:no  Bytt ut et spesifikt favicon med et gammelt på cnblogs.
// @description:cs  Nahradit konkrétní faviconu starou na cnblogs.
// @description:hu  Cserélje ki a specifikus favicont egy régire a cnblogs-on.
// @description:ro  Înlocuiți faviconul specific cu unul vechi pe cnblogs.
// @description:bg  Замени конкретен фавикон със стария на cnblogs.
// @description:el  Αντικαταστήστε το συγκεκριμένο favicon με ένα παλιό στο cnblogs.
// @description:uk  Замінити конкретний фавікон на старий на cnblogs.
// @description:th  เปลี่ยน favicon เฉพาะด้วยอันเก่าบน cnblogs.
// @description:vi  Thay thế favicon cụ thể bằng một cái cũ trên cnblogs.
// @description:id  Gantikan favicon tertentu dengan yang lama di cnblogs.
// @description:ms  Gantikan favicon tertentu dengan yang lama di cnblogs.
// @author       aspen138
// @icon         https://assets.cnblogs.com/favicon_v3_preview.ico?v=1
// @icon64       https://assets.cnblogs.com/favicon_v3_preview.ico?v=1
// @match        *://*.cnblogs.com/*
// @include      *://*.cnblogs.com/*
// @exclude      *://passport.cnblogs.com/*
// @resource     old_favicon https://assets.cnblogs.com/favicon.ico
// @connect      cnblogs.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547677/Get%20Old%20Cnblogs%20Favicon%20Back.user.js
// @updateURL https://update.greasyfork.org/scripts/547677/Get%20Old%20Cnblogs%20Favicon%20Back.meta.js
// ==/UserScript==
 
 
 
(function () {
  'use strict';
 
  // Favicon URLs
  const FAVICON_URL_V3 = 'https://assets.cnblogs.com/favicon_v3_preview.ico?v=1';
  const FAVICON_URL_COMMON = 'https://common.cnblogs.com/favicon.svg';
  const FAVICON_URL_V3P2 = 'https://assets.cnblogs.com/favicon_v3_2.ico';
  const FAVICON_URL_DEFAULT = FAVICON_URL_V3; // Default favicon to use
 
  // Link mappings for different icon types
  const linkMap = {
    "icon": FAVICON_URL_DEFAULT,
    "shortcut icon": FAVICON_URL_DEFAULT,
    "apple-touch-icon": FAVICON_URL_COMMON, // Use SVG for Apple touch icon
  };
 
  // Meta tag mappings
  const metaMap = {
    "application-name": "博客园",
    "apple-mobile-web-app-title": "博客园"
  };
 
  function main() {
    waitForElement("body").then(() => {
      console.log("CNBlogs favicon enhancer: Body loaded, initializing...");
    });
 
    waitForElement("head").then(() => {
      console.log("CNBlogs favicon enhancer: Head loaded, applying changes...");
      monitorHead();
      monitorTitle();
    });
  }
 
  // Utility function to wait for elements to load
  async function waitForElement(selector) {
    const el = document.querySelector(selector);
    if (el) return el;
 
    return new Promise((resolve) => {
      const fn = () => {
        const el2 = document.querySelector(selector);
        if (el2) {
          return resolve(el2);
        }
        requestAnimationFrame(fn);
      };
      requestAnimationFrame(fn);
    });
  }
 
  // Monitor and update favicon and related elements
  function monitorHead() {
    const sync = () => {
      // Update favicon links
      Object.entries(linkMap).forEach(([rel, targetValue]) => {
        let link = document.querySelector(`link[rel="${rel}"]`);
 
        // If link doesn't exist, create it
        if (!link) {
          link = document.createElement("link");
          link.rel = rel;
          document.head.appendChild(link);
        }
 
        // Update href if different
        if (link.getAttribute("href") !== targetValue) {
          link.setAttribute("href", targetValue);
          console.log(`CNBlogs favicon enhancer: Updated ${rel} to ${targetValue}`);
        }
      });
 
      // Update meta tags
      Object.entries(metaMap).forEach(([name, targetValue]) => {
        let meta = document.querySelector(`meta[name="${name}"]`);
 
        // If meta doesn't exist, create it
        if (!meta) {
          meta = document.createElement("meta");
          meta.name = name;
          document.head.appendChild(meta);
        }
 
        // Update content if different
        if (meta.getAttribute("content") !== targetValue) {
          meta.setAttribute("content", targetValue);
          console.log(`CNBlogs favicon enhancer: Updated meta ${name} to ${targetValue}`);
        }
      });
 
      // Handle notification-based favicon switching (if applicable)
      handleNotificationFavicon();
    };
 
    // Initial sync
    sync();
 
    // Monitor for changes
    const mutationObserverOptions = {
      subtree: true,
      characterData: true,
      childList: true,
      attributes: true
    };
 
    // Re-sync when page visibility changes
    window.addEventListener("visibilitychange", sync);
 
    // Monitor head for changes
    new MutationObserver(sync).observe(document.head, mutationObserverOptions);
 
    console.log("CNBlogs favicon enhancer: Monitoring started");
  }
 
  // Handle notification-based favicon switching
  function handleNotificationFavicon() {
    // Check for notification indicators (adjust selector based on CNBlogs structure)
    const hasNotification = document.querySelector('[class*="notification"], [class*="unread"], .msg-count, [data-count]:not([data-count="0"])');
 
    if (hasNotification) {
      // Use a different favicon when there are notifications
      const notificationFavicon = FAVICON_URL_V3P2;
      const faviconLink = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
 
      if (faviconLink && faviconLink.getAttribute("href") !== notificationFavicon) {
        faviconLink.setAttribute("href", notificationFavicon);
        console.log("CNBlogs favicon enhancer: Switched to notification favicon");
      }
    }
  }
 
  // Monitor and enhance page title
  async function monitorTitle() {
    const titleEl = await waitForElement("head > title");
 
    const sync = () => {
      const currentTitle = document.title;
 
      // Enhance title with CNBlogs branding if needed
      let newTitle = currentTitle;
 
      // Add notification count to title if present
      const notificationElement = document.querySelector('[class*="notification"], .msg-count');
      if (notificationElement) {
        const count = notificationElement.textContent.trim();
        if (count && count !== '0' && !currentTitle.startsWith(`(${count})`)) {
          newTitle = `(${count}) ${currentTitle}`;
        }
      }
 
      // Ensure "博客园" branding is present
      if (!newTitle.includes("博客园") && !newTitle.includes("CNBlogs")) {
        if (newTitle.includes(" - ")) {
          newTitle = newTitle.replace(" - ", " - 博客园 - ");
        } else {
          newTitle = `${newTitle} - 博客园`;
        }
      }
 
      if (newTitle !== document.title) {
        document.title = newTitle;
        console.log(`CNBlogs favicon enhancer: Title updated to "${newTitle}"`);
      }
    };
 
    // Initial sync
    sync();
 
    // Monitor for changes
    window.addEventListener("visibilitychange", sync);
    new MutationObserver(sync).observe(titleEl, {
      subtree: true,
      characterData: true,
      childList: true
    });
 
    // Also monitor for dynamic content changes that might affect notifications
    new MutationObserver(sync).observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'data-count']
    });
 
    console.log("CNBlogs favicon enhancer: Title monitoring started");
  }
 
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
 
  console.log("CNBlogs favicon enhancer: Script loaded and initialized");
 
})();
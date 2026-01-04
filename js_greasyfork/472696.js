// ==UserScript==
// @name         E-Hentai Helper
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  画廊新窗口打开
// @author       乃木流架
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEh0lEQVR4nO1bzW/URhSfhUNLdt5mntMoioTUQ6V+8PFHcOAEpRcilJ3xpipVKB+RCB/imJW4cOWEEpReEC1pe+mZK3f+AEhvTUMrpT0hVRy2eo7XnrHHXpcdk8TMSE/a+MVjv5/f98wwlhlqZqbd5eIrCXhDcbzTCIJgWYI4tzg7O8FKRksC3lYc/1GAgyaS5Ph3F/AmyWpIvsLYIcXFD3v9gu+MOD42QJD05U2kXkoQqxLEvYbQKslkyAh4I7F5U+3FwyXGPmANGyST4mJdN4dF8gnkHLSLL5oovAkCbg7l7YI4yxTgrVQtxAPW8EHmYJiBBOxrF/pZ5xiCCIfhhH7Ttar8/Thy8soSABSIXtaDkpBV+QcegJC+bjaWglBV+QcegBXGDpFAWjhRWRMo4x94AJo4PADgNaBfYgLi6Z5XbjVTJGMRAOo9I+kBwKwGiGf7oHKrlUhGHwbB5wEDnwiBzwQHPhUGXwv0fTEkfTWIvhxWvh+AviGiSjpC0dIZTH6tOkIWdVqGHeJRnWMb6ffsLtPh5ZDjd7b2WtyGWyAqar8pEF9GPX9XHSFFwg//pyOWCh7aq9o5ttHwHuNZEHxT+i4WfreNFxI+D847AUDqFSPHnRBgauTEtntLa/PdbrLk+K127RcL0BulfG2Rl7TIPQAQLaHdfzsACsvtpJscwkefavP8mVnKbikQ2yV8AmgreV4bT9QCgAJ8I3lw7P8CULXrrED8bhOi18bjOe3R+PN86vMycFwCMFAcf60NAH2vQkdcS663xdXce+h8jpc1bft5lCxyLACihwen6wBAcrxkE4R+59/D4G/YgHENwBvt9/Oh7ToFAKY+s6gybeF5lXeeKV/3Dzb7dwMAp00G4nX6d3CxOgD2trttVTnrzCJKBf8rpoRPPmmU/TsBQAL2JeBdTQW35qan+bhhMLuqLEH8qKtzRFr4IzL4mn+whUenAMxNT3P9CxEgrvIAmx+wCpwBxPAPBfbvDAAWedzgoqYFr439N2PkAbaQZlP5rEmQ2o+yf6cArET1AT63OcdxnWA8WhLEHxan90pziqnQFezfKQA0uu3JU3Z1dgIAOcInFlP5KZ1bMwtLWKwdABqUENUGgJHYxHNwcSWZuyOWcgCU2H8tAPQ6nU8U4L91ABDy4Is8AGkK3m3jyRwAJfZfCwA0qDiqBkD1PCAeZnIDYjtbHOl+YJT91wZACDBFZbLLPMCa3oLYyL9b6gfK4v9YAITabrCiXWCmPYqe7d4yKprXbKik8yZ8PRzHWalzAFbS3WClu8BkB+fjl2yV7CSrlAdkwqGKNSSn3sMWGjnHOcYO1wJAk4YHALwG9L0JgPcBA+8EwUeBgQ+DgH1G5+i0bGyVNXwoEGtpZhksRwuJaaWFL5t8aGqBffyh5PibFgXOMDo6RkfI0nxarDcRhFj471M5cWeOHT0SMXUziJmb0emqxpwdFmv6l9/9+pPXdYBadJy0StXWCOL4yFZYtegcnWEOTSOOO/GXL26aLM7OTuw6xujI+Z7v7nazQzxYph0jic1r4z+3DJUNJNkEGAAAAABJRU5ErkJggg==
// @match        *://*.e-hentai.org/*
// @match        *://e-hentai.org/
// @match        *://*.exhentai.org/*
// @match        *://exhentai.org/
// @grant        none
// @run-at       document-start
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/472696/E-Hentai%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/472696/E-Hentai%20Helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const CONFIG = {
    name: "E-Hentai Helper",
    selectors: {
      galleryLinks: ".itg.gltc .gl3c a",
    },
    debug: false
  };

  class Logger {
    static prefix = [
      `%c${CONFIG.name}`,
      `background:#f66158;border-radius:0.5em;color:white;font-weight:bold;padding:2px 0.5em`
    ];

    static log(...args) {
      if (CONFIG.debug) {
        console.log(...this.prefix, ...args);
      }
    }
  }

  class GalleryHelper {
    static init() {
      Logger.log("初始化");
      this.setupGalleryLinks();
      this.observeNewContent();
    }

    static setupGalleryLinks() {
      document.querySelectorAll(CONFIG.selectors.galleryLinks).forEach(link => {
        if (!link.hasAttribute("target")) {
          link.setAttribute("target", "_blank");
          link.setAttribute("rel", "noopener noreferrer"); // 安全性优化
        }
      });
    }

    static observeNewContent() {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.addedNodes.length) {
            this.setupGalleryLinks();
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  // 页面加载完成后初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => GalleryHelper.init());
  } else {
    GalleryHelper.init();
  }

})();

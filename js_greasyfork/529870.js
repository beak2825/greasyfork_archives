// ==UserScript==
// @name         YouTube Minimal Ultimate
// @version      1.0.2
// @description  Optimized YouTube experience with zero refresh issues
// @namespace    http://tampermonkey.net/
// @author       CY Fung
// @license      MIT
// @supportURL   https://github.com/cyfung1031/userscript-supports
// @run-at       document-start
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @icon         https://raw.githubusercontent.com/cyfung1031/userscript-supports/main/icons/youtube-minimal.png
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.1/js.cookie.min.js#sha512=wT7uPE7tOP6w4o28u1DN775jYjHQApdBnib5Pho4RB0Pgd9y7eSkAV1BTqQydupYDB9GBhTcQQzyNMPMV3cAew==
// @unwrap
// @inject-into  page
// @downloadURL https://update.greasyfork.org/scripts/529870/YouTube%20Minimal%20Ultimate.user.js
// @updateURL https://update.greasyfork.org/scripts/529870/YouTube%20Minimal%20Ultimate.meta.js
// ==/UserScript==

'use strict';

/* global Cookies */

const CONFIG = {
  HOSTS: {
    DESKTOP: 'www.youtube.com',
    MOBILE: 'm.youtube.com'
  },
  COOKIE: {
    NAME: 'ytm-redirect',
    OPTIONS: { 
      domain: '.youtube.com',
      secure: true,
      sameSite: 'Lax'
    }
  },
  URL_PARAMS: ['app', 'persist_app']
};

(function() {
  'use strict';

  class DeviceSwitcher {
    static init() {
      this.cleanParams();
      return this.checkStoredRedirect();
    }

    static cleanParams() {
      const url = new URL(location.href);
      CONFIG.URL_PARAMS.forEach(p => url.searchParams.delete(p));
      history.replaceState(null, '', url);
    }

    static checkStoredRedirect() {
      const redirectData = Cookies.getJSON(CONFIG.COOKIE.NAME);
      if (!redirectData) return false;

      Cookies.remove(CONFIG.COOKIE.NAME, CONFIG.COOKIE.OPTIONS);
      
      const { url, timestamp } = redirectData;
      if (Date.now() - timestamp > 5000) return false;

      const newUrl = new URL(url);
      newUrl.searchParams.set('app', this.getAppType(newUrl));
      location.replace(newUrl.toString());
      return true;
    }

    static getAppType(url) {
      return url.hostname === CONFIG.HOSTS.DESKTOP ? 'desktop' : 'm';
    }

    static prepareRedirect(targetHost, isPersistent) {
      const currentUrl = new URL(location.href);
      currentUrl.hostname = targetHost;
      
      if (isPersistent) {
        Cookies.set(CONFIG.COOKIE.NAME, {
          url: currentUrl.toString(),
          timestamp: Date.now()
        }, CONFIG.COOKIE.OPTIONS);
      }

      currentUrl.searchParams.set('app', this.getAppType(currentUrl));
      currentUrl.searchParams.set('persist_app', isPersistent ? '1' : '0');
      location.replace(currentUrl.toString());
    }

    static currentDeviceType() {
      return location.hostname === CONFIG.HOSTS.DESKTOP ? 'desktop' : 'mobile';
    }
  }

  class UIManager {
    static init() {
      this.injectStyles();
      this.setupEventListeners();
      this.addDeviceSwitchUI();
    }

    static injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .ytm-device-switcher {
          position: fixed;
          top: 60px;
          right: 20px;
          z-index: 9999;
          background: rgba(0,0,0,0.8);
          border-radius: 8px;
          padding: 10px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        .ytm-switch-btn {
          display: block;
          color: #fff;
          background: #303030;
          border: none;
          padding: 8px 16px;
          margin: 4px 0;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .ytm-switch-btn:hover {
          background: #606060;
        }
        /* 增強暫停層隱藏 */
        .ytp-pause-overlay, 
        .html5-video-player.ended-mode .ytp-paid-content-overlay,
        ytd-pause-overlay-renderer {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    static addDeviceSwitchUI() {
      const container = document.createElement('div');
      container.className = 'ytm-device-switcher';
      
      const persistentBtn = document.createElement('button');
      persistentBtn.className = 'ytm-switch-btn';
      persistentBtn.textContent = `切換到${DeviceSwitcher.currentDeviceType() === 'desktop' ? '手機版' : '電腦版'} (永久)`;
      persistentBtn.onclick = () => this.switchDevice(true);

      const tempBtn = document.createElement('button');
      tempBtn.className = 'ytm-switch-btn';
      tempBtn.textContent = `切換到${DeviceSwitcher.currentDeviceType() === 'desktop' ? '手機版' : '電腦版'} (暫時)`;
      tempBtn.onclick = () => this.switchDevice(false);

      container.append(persistentBtn, tempBtn);
      document.body.appendChild(container);
    }

    static switchDevice(isPersistent) {
      const target = DeviceSwitcher.currentDeviceType() === 'desktop' 
        ? CONFIG.HOSTS.MOBILE 
        : CONFIG.HOSTS.DESKTOP;
      DeviceSwitcher.prepareRedirect(target, isPersistent);
    }

    static setupEventListeners() {
      document.addEventListener('click', this.handleControlClick.bind(this));
      document.addEventListener('keydown', this.handleKeyboard.bind(this));
      document.addEventListener('DOMNodeInserted', this.handleDynamicElements.bind(this));
    }

    static handleControlClick(e) {
      const video = document.querySelector('#movie_player video, video.html5-main-video');
      if (video && e.target.closest('.player-controls-background, .ytp-chrome-bottom')) {
        e.preventDefault();
        video[video.paused ? 'play' : 'pause']();
      }
    }

    static handleKeyboard(e) {
      const video = document.querySelector('#movie_player video, video.html5-main-video');
      if (!video || e.target.tagName === 'INPUT') return;

      switch(e.code) {
        case 'Space':
          e.preventDefault();
          video[video.paused ? 'play' : 'pause']();
          break;
        case 'ArrowLeft':
          video.currentTime = Math.max(0, video.currentTime - 5);
          break;
        case 'ArrowRight':
          video.currentTime = Math.min(video.duration, video.currentTime + 5);
          break;
      }
    }

    static handleDynamicElements(e) {
      if (e.target.classList?.contains('ytp-pause-overlay')) {
        e.target.style.display = 'none';
      }
    }
  }

  if (DeviceSwitcher.init()) return;

  const registerMenuCommands = () => {
    const deviceType = DeviceSwitcher.currentDeviceType();
    const targetName = deviceType === 'desktop' ? '手機版' : '電腦版';

    GM_registerMenuCommand(`切換到${targetName} (永久)`, () => {
      DeviceSwitcher.prepareRedirect(
        deviceType === 'desktop' ? CONFIG.HOSTS.MOBILE : CONFIG.HOSTS.DESKTOP,
        true
      );
    });

    GM_registerMenuCommand(`切換到${targetName} (暫時)`, () => {
      DeviceSwitcher.prepareRedirect(
        deviceType === 'desktop' ? CONFIG.HOSTS.MOBILE : CONFIG.HOSTS.DESKTOP,
        false
      );
    });
  };

  window.addEventListener('DOMContentLoaded', () => {
    UIManager.init();
    registerMenuCommands();
  });
})();
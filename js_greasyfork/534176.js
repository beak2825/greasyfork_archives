// ==UserScript==
// @name         HHDragon - Chọn server tự động (có fallback)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Tự động click nút "Bg" nếu có, nếu không thì click "Hx" trên hhdragon.com
// @author       Hoàng Nam
// @match        https://hhdragon.*/*
// @license            MIT2
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow

// @icon         https://hhtqtv.vip/assets/upload/Y0TLch0LF2St2yP1710963733.png
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/534176/HHDragon%20-%20Ch%E1%BB%8Dn%20server%20t%E1%BB%B1%20%C4%91%E1%BB%99ng%20%28c%C3%B3%20fallback%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534176/HHDragon%20-%20Ch%E1%BB%8Dn%20server%20t%E1%BB%B1%20%C4%91%E1%BB%99ng%20%28c%C3%B3%20fallback%29.meta.js
// ==/UserScript==


(function () {
  // Hiển thị favicon nếu có
  const icons = document.querySelectorAll('link[rel~="icon"]');
  if (icons.length) {
    icons.forEach((icon, i) => console.log(`🔍 Favicon [${i + 1}]:`, icon.href));
  } else {
    console.log("❌ Không tìm thấy favicon trong trang.");
  }
})();

(() => {
  'use strict';

  const SELECTORS = {
    vip: '#sv_vip',
    v1: '#sv_v1',
    hd: '#sv_hd',
    hl: '#sv_hl',
    bg: '#sv_bg',
    dl: '#sv_dl',
    hx: '#sv_hx',
  };

  const SERVER_ORDER = ['vip', 'v1', 'hl', 'bg', 'hd', 'dl', 'hx'];
  const STORAGE_KEY = 'preferredServer';
  const menuIds = [];
  const log = console.log;

  const getButton = (server) =>
    document.querySelector(SELECTORS[server]) ||
    (server === 'hl' ? document.querySelector(SELECTORS.hl) : null);

  const clickServerButton = (server) => {
    const btn = getButton(server);
    if (btn) {
      btn.click();
      log(`✅ [HHDragon] Đã chọn và click ${server.toUpperCase()}.`);
      return true;
    } else {
      log(`❌ [HHDragon] Không tìm thấy nút cho server: ${server}`);
      return false;
    }
  };

  const tryFallbackServers = (preferred, timeout = 5000, interval = 200) => {
    const serversToTry = [preferred, ...SERVER_ORDER.filter(s => s !== preferred)];
    let index = 0, waited = 0;

    const timer = setInterval(() => {
      const server = serversToTry[index];
      const btn = getButton(server);
      if (btn) {
        clearInterval(timer);
        clickServerButton(server);
      } else if (waited >= timeout) {
        clearInterval(timer);
        log(`❌ Không tìm thấy bất kỳ server nào sau ${timeout}ms`);
      } else {
        log(`⏳ Đang kiểm tra server: ${server.toUpperCase()}...`);
        index = (index + 1) % serversToTry.length;
        waited += interval;
      }
    }, interval);
  };

  const setPreferredServer = (server) => {
    localStorage.setItem(STORAGE_KEY, server);
    log(`✅ Đã chọn server: ${server.toUpperCase()}.`);
    refreshMenu();
  };

  const clearPreferredServer = () => {
    localStorage.removeItem(STORAGE_KEY);
    log("❌ Đã xóa lựa chọn server.");
    refreshMenu();
  };

  const registerMenuCommands = () => {
    const current = localStorage.getItem(STORAGE_KEY);
    const createLabel = (server, name) => (current === server ? `✅ ${name}` : name);

    Object.entries({
      vip: 'Chọn Server: VIP',
      v1: 'Chọn Server: V1',
      hl: 'Chọn Server: HL',
      dl: 'Chọn Server: DL',
      hd: 'Chọn Server: HD',
      bg: 'Chọn Server: BG',
      hx: 'Chọn Server: HX',
    }).forEach(([key, label]) => {
      menuIds.push(GM_registerMenuCommand(createLabel(key, label), () => setPreferredServer(key)));
    });

    menuIds.push(GM_registerMenuCommand("❌ Xóa lựa chọn server", clearPreferredServer));
  };

  const refreshMenu = () => {
    if (typeof GM_unregisterMenuCommand !== 'undefined') {
      menuIds.forEach(id => {
        try {
          GM_unregisterMenuCommand(id);
        } catch (e) {
          console.warn("Không thể hủy menu:", e);
        }
      });
      menuIds.length = 0;
    }
    registerMenuCommands();
  };

  window.addEventListener('load', () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      tryFallbackServers(saved);
    } else {
      log("💡 [HHDragon] Chưa chọn server. Dùng menu Tampermonkey để chọn.");
    }
  });

  registerMenuCommands();
})();

// ==UserScript==
// @name         Save SaveMyExams
// @name:en      Save SaveMyExams
// @namespace    http://tampermonkey.net/
// @version      2025.6.14
// @description  去除Save My Exams非登录用户的5次查看限制
// @description:en Remove the 5-view limit for non-logged-in users of Save My Exams
// @author       ZZW
// @match        *://www.savemyexams.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=savemyexams.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529887/Save%20SaveMyExams.user.js
// @updateURL https://update.greasyfork.org/scripts/529887/Save%20SaveMyExams.meta.js
// ==/UserScript==


(() => {
  function clearCookies() {
    const cookies = document.cookie.split('; ');
    const domain = location.hostname.split('.').slice(-2).join('.');
    const past = 'Thu, 01 Jan 1970 00:00:00 GMT';

    cookies.forEach(c => {
      const eq = c.indexOf('=');
      const name = eq > -1 ? c.substr(0, eq) : c;

      document.cookie = `${name}=; expires=${past}; path=/`;
      document.cookie = `${name}=; expires=${past}; path=/; domain=.${domain}`;
    });
  }

  async function clearStorage() {
    try {
      localStorage.clear();
    } catch (e) {}
    try {
      sessionStorage.clear();
    } catch (e) {}

    if (indexedDB && typeof indexedDB.databases === 'function') {
      try {
        const dbs = await indexedDB.databases();
        dbs.forEach(db => {
          if (db.name) indexedDB.deleteDatabase(db.name);
        });
      } catch (e) {
      }
    }
  }

  function clearServiceWorkers() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then(rs => rs.forEach(r => r.unregister()))
        .catch(() => {});
    }
  }

  async function wipe() {
    clearCookies();
    await clearStorage();
    clearServiceWorkers();
  }

  wipe();

  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    if (e.defaultPrevented || (e.button !== 0 && e.button !== 1)) return;

    wipe();
  }, true);
})();
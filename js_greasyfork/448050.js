// ==UserScript==
// @name        Disable BiliBili banner AD
// @namespace   Hill98
// @description Disable BiliBili banner advertise
// @version     1.1.2
// @author      Hill-98
// @license     MIT
// @icon        https://www.bilibili.com/favicon.ico
// @homepageURL https://github.com/Hill-98/userscripts
// @supportURL  https://github.com/Hill-98/userscripts/issues
// @grant       none
// @match       https://www.bilibili.com/
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/448050/Disable%20BiliBili%20banner%20AD.user.js
// @updateURL https://update.greasyfork.org/scripts/448050/Disable%20BiliBili%20banner%20AD.meta.js
// ==/UserScript==

const DISABLE_HANDLE_KEY = '__dbba_$$disable_handle$$';

if (sessionStorage.getItem(DISABLE_HANDLE_KEY)) {
  sessionStorage.removeItem(DISABLE_HANDLE_KEY);
  return;
}

let __INITIAL_DATA__ = null;

class FakeString extends String {
  indexOf(str) {
    document.querySelector('.logo-img').src = str;
    return 1;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('a.inner-logo')?.addEventListener('dblclick', () => {
    sessionStorage.setItem(DISABLE_HANDLE_KEY, 'true');
    location.reload();
  });
});

document.addEventListener('readystatechange', () => {
  if (document.readyState === 'interactive') {
    window.__INITIAL_DATA__ = window.__INITIAL_DATA__.map((item) => {
      const request = item.request;
      if (request.url.includes('//api.bilibili.com/x/web-show/page/header')) {
        item.response.litpic = new FakeString('');
      }
      return item;
    });
  }
});

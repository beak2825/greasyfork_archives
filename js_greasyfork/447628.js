// ==UserScript==
// @name         Manhuagui - Recover Blocked Manga
// @namespace    https://www.manhuagui.com/
// @version      0.3
// @description  Recover blocked manga on www.manhuagui.com | V0.3 添加对 m.manhuagui.com 的匹配；直接修改cookie以实现解除屏蔽
// @author       DD1969
// @match        https://*.manhuagui.com/comic/*/
// @match        https://*.manhuagui.com/comic/*/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manhuagui.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447628/Manhuagui%20-%20Recover%20Blocked%20Manga.user.js
// @updateURL https://update.greasyfork.org/scripts/447628/Manhuagui%20-%20Recover%20Blocked%20Manga.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  // wait until cookie loaded
  await new Promise(resolve => {
    setInterval(() => {
      if (document.cookie) {
        resolve();
      }
    }, 200);
  });

  // set cookie directly
  if (document.cookie.includes('country=JP') && !document.cookie.includes('country=CN')) {
    document.cookie = 'country=CN';
    window.location.reload();
  }

})();
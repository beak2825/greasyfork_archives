// ==UserScript==
// @name         orna codex lang switcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  orna codex lang switcher!
// @author       Rplus
// @match        https://playorna.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playorna.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454203/orna%20codex%20lang%20switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/454203/orna%20codex%20lang%20switcher.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let qs = new URLSearchParams(location.search);
  let nav = document.querySelector('#nav');
  let a = nav.querySelector('a.nav-item');
  let a_en = a.cloneNode();
  let a_zh = a.cloneNode();

  a_zh.textContent = 'zh';
  qs.set('lang', 'zh-hant');
  a_zh.href = '?' + qs.toString();

  a_en.textContent = 'en';
  qs.set('lang', 'en');
  a_en.href = '?' + qs.toString();

  nav.append(a_en);
  nav.append(a_zh);
})();
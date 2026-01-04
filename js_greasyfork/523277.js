// ==UserScript==
// @name         Clean_Liste_Sujets
// @namespace    Clean_Liste_Sujets
// @version      0.6.1
// @description  Supprime des elements du 18-25 et GDC
// @author       Atlantis
// @match        https://www.jeuxvideo.com/recherche/forums/0-51*
// @match        https://www.jeuxvideo.com/forums/0-51*
// @icon         https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/128px/1f4cb.png
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/523277/Clean_Liste_Sujets.user.js
// @updateURL https://update.greasyfork.org/scripts/523277/Clean_Liste_Sujets.meta.js
// ==/UserScript==

document.querySelectorAll('.topic-list > li').forEach(li => {
    const titleText = li.querySelector('.topic-title')?.textContent.toLowerCase();
    if (/\brsa\b/.test(titleText) || /\baah\b/.test(titleText) || /\brsaistes\b/.test(titleText)) li.remove();
});
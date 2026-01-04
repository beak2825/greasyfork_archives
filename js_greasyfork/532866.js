// ==UserScript==
// @name        全言語⇔日本語 i
// @namespace   http://tampermonkey.net/
// @version     1.2
// @description Execute UserScript
// @author      Your Name
// @match        https://hitomi.la/*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/532866/%E5%85%A8%E8%A8%80%E8%AA%9E%E2%87%94%E6%97%A5%E6%9C%AC%E8%AA%9E%20i.user.js
// @updateURL https://update.greasyfork.org/scripts/532866/%E5%85%A8%E8%A8%80%E8%AA%9E%E2%87%94%E6%97%A5%E6%9C%AC%E8%AA%9E%20i.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'i') {
            javascript:(function(){
  const url = window.location.href;
  
  if (url.startsWith('https://hitomi.la/artist/')) {
    let newUrl = url;
    if (url.includes('-all.html')) {
      newUrl = url.replace(/-all\.html/, '-japanese.html');
    } else if (url.includes('-japanese.html')) {
      newUrl = url.replace(/-japanese\.html/, '-all.html');
    }
    if (newUrl !== url) {
      window.location.href = newUrl;
    }
    return;
  }
  
  (function trySwitch(count){
    const items = document.querySelectorAll('#lang-list li');
    if (!items.length) {
      if (count < 10) {
        return setTimeout(() => trySwitch(count + 1), 100);
      }
      alert('このギャラリーに日本語版はありません。');
      return;
    }
    for (let i = 0; i < items.length; i++) {
      const a = items[i].querySelector('a');
      if (!a) continue;
      const txt = a.textContent.trim();
      const href = a.getAttribute('href') || '';
      const dataLang = a.getAttribute('data-language') || '';
      if (txt === '日本語' || href.includes('japanese') || dataLang === 'japanese') {
        a.click();
        return;
      }
    }
    alert('このギャラリーに日本語版はありません。');
  })(0);
})();
        }
    });
})();
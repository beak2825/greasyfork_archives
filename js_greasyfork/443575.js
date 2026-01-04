// ==UserScript==
// @name         Lang attribute setter (prioritize Kanji font on Japanese Websites)
// @namespace    https://github.com/patarapolw/wanikani-userscript
// @version      0.2.0
// @description  Fixes Han unification, for example, for Japanese (can be edited to prioritize other langs)
// @author       polv
// @license      MIT
// @match        *://community.wanikani.com/*
// @match        *://*.kanjipedia.jp/*
// @match        *://moji.tekkai.com/*
// @match        *://*.immersionkit.com/*
// @match        *://youglish.com/*
// @match        *://docs.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eastasiastudent.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443575/Lang%20attribute%20setter%20%28prioritize%20Kanji%20font%20on%20Japanese%20Websites%29.user.js
// @updateURL https://update.greasyfork.org/scripts/443575/Lang%20attribute%20setter%20%28prioritize%20Kanji%20font%20on%20Japanese%20Websites%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const LANG = 'ja-JP';
  const LOCALSTORAGE_KEY = '.user.js--lang-attr';
  const originalLang = document.documentElement.lang;

  checkInject();

  Object.assign(window, {
    langAttrSetter: {
      inject: doInject,
      setPath: setInject,
      unsetPath: unsetInject,
    },
  });

  function doInject(lang = LANG) {
    return (document.documentElement.lang = lang);
  }

  function checkInject() {
    if (typeof location === 'undefined') {
      return doInject();
    }
    const domain = '.' + location.origin.split('://')[1];
    if (domain.endsWith('.youglish.com')) {
      // Example URL: https://youglish.com/pronounce/%E5%AE%B6%E6%97%8F/japanese
      const lang = location.pathname.split('/').slice(2);
      if (!lang.length) return;
      switch (lang[0]) {
        case 'japanese': {
          return doInject('ja-JP');
        }
        case 'korean': {
          return doInject('ko-KR');
        }
        case 'chinese': {
          return doInject(`zh-${(lang[1] || 'CN').toLocaleUpperCase()}`);
        }
      }
      return;
    }

    const paths = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) || '{}');
    if (paths[location.pathname]) {
      return doInject(paths[location.pathname]);
    }

    if (domain.endsWith('.docs.google.com')) return;
    return doInject();
  }

  function setInject(lang = LANG) {
    const paths = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) || '{}');
    if (paths[location.pathname]) {
      console.log('original value:', paths[location.pathname]);
    }
    paths[location.pathname] = lang;
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(paths));
    return doInject(lang);
  }

  function unsetInject() {
    const paths = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) || '{}');
    if (paths[location.pathname]) {
      console.log('original value:', paths[location.pathname]);
    }
    delete paths[location.pathname];
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(paths));
    return doInject(originalLang);
  }
})();

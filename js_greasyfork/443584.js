// ==UserScript==
// @name         Add lang hyphen, if not exists for HTML tags
// @namespace    https://github.com/patarapolw/wanikani-userscript
// @version      0.1.4
// @description  Arch Linux Firefox doesn't set lang="ja" as Japanese
// @author       polv
// @license      MIT
// @match        *://*/*
// @exclude      https://www.wanikani.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eastasiastudent.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443584/Add%20lang%20hyphen%2C%20if%20not%20exists%20for%20HTML%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/443584/Add%20lang%20hyphen%2C%20if%20not%20exists%20for%20HTML%20tags.meta.js
// ==/UserScript==

(() => {
  // src/fix-lang-hyphen.ts
  var FIX_LANG_HYPHEN = {
    ja: "",
    ko: "",
    zh: "",
    vi: ""
  };
  getLang(document.documentElement);
  fixLangObserver();
  function fixLangObserver(el = document.body) {
    new MutationObserver((muts) => {
      for (const mut of muts) {
        mut.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement) {
            findAndFixLang(n);
          }
        });
      }
    }).observe(el, {
      childList: true,
      subtree: true
    });
    findAndFixLang(el);
  }
  function findAndFixLang(el) {
    el.querySelectorAll("*").forEach((it) => getLang(it));
  }
  function getLang(it, fix = true) {
    let aLang = it.getAttribute("lang");
    if (aLang && typeof FIX_LANG_HYPHEN[aLang] === "string") {
      aLang += "-" + FIX_LANG_HYPHEN[aLang];
      if (fix) {
        it.setAttribute("lang", aLang);
      }
      return aLang;
    }
    return null;
  }
})();

// ==UserScript==
// @name               Stack Exchange - Hide Cookies Consent Banner
// @name:zh-TW         Stack Exchange - 隱藏 Cookies 同意橫幅
// @namespace          https://github.com/jlhg/userscript
// @license            MIT
// @version            0.1.2
// @description        Hide Stack Exchange websites' annoying cookies consent banner
// @description:zh-TW  隱藏 Stack Exchange 網站惱人的 Cookies 同意橫幅
// @author             jlhg
// @homepage           https://github.com/jlhg/userscript
// @supportURL         https://github.com/jlhg/userscript/issues
// @match              https://*.stackexchange.com/*
// @match              https://stackoverflow.com/*
// @match              https://serverfault.com/*
// @match              https://superuser.com/*
// @match              https://mathoverflow.net/*
// @match              https://stackapps.com/*
// @match              https://askubuntu.com/*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/479385/Stack%20Exchange%20-%20Hide%20Cookies%20Consent%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/479385/Stack%20Exchange%20-%20Hide%20Cookies%20Consent%20Banner.meta.js
// ==/UserScript==

// Other Notes
// The match website list is referenced from https://stackexchange.com/sites.

(function() {
  'use strict';

  function waitElement(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  waitElement('#onetrust-consent-sdk')
    .then((el) => { $(el).hide(); });
})();

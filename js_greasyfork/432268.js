/** Plurk Custom Theme EX - userscript for expanding Plurk custom theme
 *
 *  This tool will read CSS rules from
 *  `https://www.plurk.com/Users/getCustomCss?user_id=${uid}`, and insert rules
 *  which start with class selector `._ex_` to HTML head.
 *
 *  How to use it:
 *  1. To use the expand theme, insert `._ex_ ` in front of the selector
 *    for your homepage, or insert `._ex_._global_ ` for global.
 *  2. This tool can read other users expand css when you visit their
 *    homepage. To one-time enable this feature, goto someone's homepage,
 *    open the web console and enter `ENABLE_CUSTOM_CSS_EX_FROM_OTHERS`.
 */

// ==UserScript==
// @name         Plurk Custom Theme EX
// @description  Expand Plurk custom theme
// @version      0.2.5
// @license      MIT
// @namespace    https://github.com/stdai1016
// @match        https://www.plurk.com/*
// @exclude      https://www.plurk.com/_comet/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432268/Plurk%20Custom%20Theme%20EX.user.js
// @updateURL https://update.greasyfork.org/scripts/432268/Plurk%20Custom%20Theme%20EX.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
  'use strict';

  /** Insert CSS rules to HEAD
   *  @param uid user id
   */
  async function updateCustomCssExFrom (uid) {
    function filter (r) {
      const ss = Array.from(r.split('{')[0].split(','), s => s.trim());
      return ss.some(s => s.startsWith('._lc_ ._ex_'));
    }
    function convert (r) {
      const i = r.indexOf('{');
      let ss = Array.from(r.substr(0, i).split(','), s => s.trim());
      ss = Array.from(ss.filter(filter), s => {
        s = s.substr('._lc_ ._ex_'.length);
        if (!s.startsWith('._global_ ')) s = `._home_${s}`;
        else s = s.substr('._global_ '.length);
        return s;
      });
      return ss.length ? `${ss.join(', ')} ${r.substr(i)}` : '';
    }
    const url = `https://www.plurk.com/Users/getCustomCss?user_id=${uid}`;
    const rules = (await (await fetch(url)).text()).split(/\r?\n/);
    const rulesEx = Array.from(rules.filter(filter), convert);
    (document.getElementById(`plurkCustomCssEx-${uid}`) || (function () {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.id = `plurkCustomCssEx-${uid}`;
      document.head.appendChild(style);
      return style;
    })()).innerHTML = rulesEx.join('\n');
  }

  /* ======= Area Judgment ======= */
  const NAV_IMG_URL = /^https:\/\/avatars\.plurk\.com\/(\d+)-\w+\.\w+$/;
  const CSS_LNK_URL = /^https:\/\/.+\/getCustomCss\?user_id=(\d+)/;
  const link = document.head.querySelector('#theme-custom');

  function getPageUserId () {
    // eslint-disable-next-line
    if (window.GLOBAL?.page_user) return window.GLOBAL.page_user.id;
    const link = document.head.querySelector('#theme-custom');
    const meta = document.head.querySelector('meta[property="og:image"]');
    return link?.href.match(CSS_LNK_URL)?.[1] ||
           meta?.content.match(NAV_IMG_URL)?.[1];
  }

  function getUserId () {
    // eslint-disable-next-line
    if (window.GLOBAL) return window.GLOBAL.session_user.id;
    const img = document.body.querySelector('#nav-account img');
    return img?.src.match(NAV_IMG_URL)?.[1];
  }

  const pid = getPageUserId();
  const uid = getUserId();
  console.debug(`page id: ${pid}, user id: ${uid}`);

  if (pid) {
    if (pid === uid) {
      document.body.classList.add('_home_');
      (new MutationObserver(r => r.forEach(m => updateCustomCssExFrom(pid))))
        .observe(link, { attributes: true, attributeFilter: ['href'] });
    } else if (window.localStorage.getItem(`plurkCustomCssEx-${pid}`) ||
        window.localStorage.getItem('plurkCustomCssEx-forever')) {
      window.localStorage.removeItem(`plurkCustomCssEx-${pid}`);
      updateCustomCssExFrom(pid);
    } else {
      function _eccefo (forever) {
        if (window.confirm('Are you sure to enable this feature?')) {
          const k = forever ? 'forever' : pid;
          window.localStorage.setItem(`plurkCustomCssEx-${k}`, 1);
          location.reload();
        }
      }
      (function () {
        // set as global function
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = [
          _eccefo.toString(),
          `var pid = ${pid};`,
          'Object.defineProperty(window, "ENABLE_CUSTOM_CSS_EX_FROM_OTHERS",',
          '  { get: function () { _eccefo(); } });',
          'Object.defineProperty(',
          '  window,',
          '  "ENABLE_CUSTOM_CSS_EX_FROM_OTHERS_FOREVER",',
          '  { get: function () { _eccefo(true); } }',
          ');'
        ].join('\r\n');
        document.head.appendChild(script);
      })();
    }
  }
  if (uid) updateCustomCssExFrom(uid);
})();

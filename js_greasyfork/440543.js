// ==UserScript==
// @name        Press "d" to DuckDuckGo from Kagi
// @namespace   https://github.com/gslin/press-d-to-duckduckgo-from-kagi
// @match       https://kagi.com/search*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @version     0.20231006.1
// @author      Gea-Suan Lin <gslin@gslin.com>
// @description Press "d" to DuckDuckGo from Kagi.
// @require     https://greasyfork.org/scripts/38445-monkeyconfig/code/MonkeyConfig.js?version=251319
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/440543/Press%20%22d%22%20to%20DuckDuckGo%20from%20Kagi.user.js
// @updateURL https://update.greasyfork.org/scripts/440543/Press%20%22d%22%20to%20DuckDuckGo%20from%20Kagi.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const cfg = new MonkeyConfig({
    menuCommand: true,
    params: {
      search_engine: {
        type: 'text',
        default: 'https://www.duckduckgo.com/?q=',
      },
    },
    title: 'Press "d" to DuckDuckGo in Kagi',
  });

  window.addEventListener('keyup', function(event) {
    if (['input', 'textarea'].indexOf(document.activeElement.tagName.toLowerCase()) >= 0) {
      return;
    }
    if ('d' !== event.key) {
      return;
    }

    let q = document.getElementById('searchBar').value;
    let q_encoded = encodeURIComponent(q).replace(/%20/g, '+');
    let url = cfg.get('search_engine') + q_encoded;

    document.location = url;
  });
})();

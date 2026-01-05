// ==UserScript==
// @name         Prevent Wikia Ads
// @namespace    https://greasyfork.org/users/649
// @version      1.0.9
// @description  Prevent the ads that pop up when clicking a link to an external page on Wikias
// @author       Adrien Pyke
// @match        *://*.wikia.com/*
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/22420/Prevent%20Wikia%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/22420/Prevent%20Wikia%20Ads.meta.js
// ==/UserScript==

(() => {
  'use strict';

  waitForElems({
    sel: 'a.exitstitial',
    onmatch(link) {
      link.onclick = e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (e.button === 0) {
          location.href = link.href;
        } else if (e.button === 1) {
          GM_openInTab(link.href, true);
        }
        return false;
      };
      link.onauxclick = link.onclick;
    }
  });
})();

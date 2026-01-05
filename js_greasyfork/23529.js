// ==UserScript==
// @name         Reddit Disable No Participation
// @namespace    https://greasyfork.org/users/649
// @version      1.0.8
// @description  Disables No Participation on Reddit
// @author       Adrien Pyke
// @match        *://*.reddit.com/*
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23529/Reddit%20Disable%20No%20Participation.user.js
// @updateURL https://update.greasyfork.org/scripts/23529/Reddit%20Disable%20No%20Participation.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const MATCH = /^https?:\/\/np\.reddit\.com/iu;
  const REPLACE = {
    regex: /^(https?:\/\/)np(.+)/iu,
    replaceWith: '$1www$2'
  };

  if (location.href.match(MATCH)) {
    location.replace(location.href.replace(REPLACE.regex, REPLACE.replaceWith));
  }

  document.addEventListener('DOMContentLoaded', () => {
    waitForElems({
      sel: 'a',
      onmatch(link) {
        if (link.href.match(MATCH)) {
          link.href = link.href.replace(REPLACE.regex, REPLACE.replaceWith);
        }
      }
    });
  });
})();

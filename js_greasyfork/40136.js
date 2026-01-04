// ==UserScript==
// @name         Rulu.co remove ads
// @namespace    https://greasyfork.org/users/649
// @version      1.0.6
// @description  Removes ad links from Rulu.co
// @author       Adrien Pyke
// @match        *://www.rulu.co/*
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40136/Ruluco%20remove%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/40136/Ruluco%20remove%20ads.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const Util = {
    qq(query, context = document) {
      return Array.from(context.querySelectorAll(query));
    }
  };

  const REGEX = /^https?:\/\/rulu\.io\/j\//iu;

  Util.qq('a')
    .filter(link => link.href.match(REGEX))
    .forEach(link => (link.href = link.href.replace(REGEX, '')));

  waitForElems({
    sel: '#d0bf',
    onmatch(overlay) {
      overlay.remove();
    }
  });
})();

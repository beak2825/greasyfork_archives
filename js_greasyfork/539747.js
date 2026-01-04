// ==UserScript==
// @name         Clean Tweet URL
// @namespace    https://greasyfork.org/users/214573
// @version      0.1.1-fox
// @description  Clean tweet URL
// @license      MIT
// @match        *://x.com/*
// @match        *://twitter.com/*
// @match        *://mobile.x.com/*
// @match        *://mobile.twitter.com/*
// @match        *://fxtwitter.com/*
// @match        *://vxtwitter.com/*
// @match        *://fixupx.com/*
// @match        *://foxvx.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539747/Clean%20Tweet%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/539747/Clean%20Tweet%20URL.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function () {
  'use strict';

  const isFoxvx = window.location.hostname === 'foxvx.com'; // 好耶狐狸
  const tweet =
    /^(?:|https?:\/\/)(?:|mobile\.)(?:x|twitter|fxtwitter|vxtwitter|fixupx).com\/(\w+|i\/web)\/status\/(\d+)[^\d].+/;

  const isTweet = window.location.href.match(tweet);
  if (isFoxvx) {
    const url = window.location.href.replace('foxvx', 'x');
    setTimeout(() => window.location.replace(url), 3000);
  } else if (isTweet && window.location.search) {
    const url = `https://x.com/${isTweet[1]}/status/${isTweet[2]}`;
    console.debug(`query detected, redirect to: ${url}`);
    window.location.replace(url);
  }
})();

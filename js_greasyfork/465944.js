// ==UserScript==
// @name         Automatic Redirection from Chinese Bing to International Bing
// @namespace    https://www.tampermonkey.net/
// @version      1.5
// @description  Redirect Chinese Bing to International Bing
// @author       Greasy Fork
// @license      MIT
// @match        https://cn.bing.com/*
// @match        https://www.bing.com/*
// @match        https://global.bing.com/*
// @match        https://bing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465944/Automatic%20Redirection%20from%20Chinese%20Bing%20to%20International%20Bing.user.js
// @updateURL https://update.greasyfork.org/scripts/465944/Automatic%20Redirection%20from%20Chinese%20Bing%20to%20International%20Bing.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const redirectUrl = (url) => {
    let updatedUrl = new URL(url);
    updatedUrl.hostname = 'global.bing.com';
    updatedUrl.searchParams.set('setmkt', 'en-US');
    updatedUrl.searchParams.set('setlang', 'en-US');
    updatedUrl.searchParams.set('cc', 'US');
    return updatedUrl.href;
  };

  const currentUrl = window.location.href;
  const isGlobalBing =
    currentUrl === 'https://global.bing.com/?scope=web&cc=US' ||
    currentUrl.startsWith('https://global.bing.com/account');

  if (!isGlobalBing) {
    window.location.replace(redirectUrl(currentUrl));
  }

  document.body.innerHTML = document.body.innerHTML.replace(
    /cn.bing.com/g,
    'global.bing.com'
  );
})();
// ==UserScript==
// @name         removeSspaiOauthLoginDom
// @namespace    http://tampermonkey.net/
// @version      2024-11-18
// @license      MIT
// @description  remove Sspai Oauth Login Dom
// @author       Anonymous
// @match        https://neo.sspai.com/login
// @match        https://sspai.com/login
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sspai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517869/removeSspaiOauthLoginDom.user.js
// @updateURL https://update.greasyfork.org/scripts/517869/removeSspaiOauthLoginDom.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.onload = function() {
    // remove Sspai Oauth Login Dom
    document.querySelectorAll('.ss__login__actions').forEach((el) => {
      el.remove();
    });
  };


})();
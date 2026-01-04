// ==UserScript==
// @name         Twitter No Slop CSS
// @version      1.4
// @description  Loads custom CSS for Twitter to remove slop
// @author       https://github.com/ruukulada
// @namespace    https://github.com/ruukulada
// @match        https://*.x.com/*
// @icon         https://abs.twimg.com/favicons/twitter.2.ico
// @license      MIT
// @grant        none
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/536556/Twitter%20No%20Slop%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/536556/Twitter%20No%20Slop%20CSS.meta.js
// ==/UserScript==

(function () {
  'use strict';
  function injectCSS(css) {
    const style = document.createElement('style');
    style.type = 'text/css'; style.innerHTML = css;
    document.head.appendChild(style);
  }
  function loadExternalCSS(url) {
    fetch(url)
      .then((response) => response.text())
      .then((css) => { injectCSS(css); })
  }
  const cssUrl = 'https://ruukulada.github.io/UserStyles/src/twitternoslop.css';
  loadExternalCSS(cssUrl);
})();

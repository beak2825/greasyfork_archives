// ==UserScript==
// @name        Greasy Fork: fix wrong charset css
// @namespace   UserScripts
// @match       https://greasyfork.org/*
// @grant       none
// @version     1.0.2
// @author      CY Fung
// @license     MIT
// @description To fix the wrong characters like arrow symbols
// @run-at      document-end
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/474345/Greasy%20Fork%3A%20fix%20wrong%20charset%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/474345/Greasy%20Fork%3A%20fix%20wrong%20charset%20css.meta.js
// ==/UserScript==
(() => {
  for (const link of document.querySelectorAll('link[rel="stylesheet"][media="screen"][href]:not([href*=":"])')) {
    const href = link.getAttribute('href');
    fetch(href).then(r => r.text()).then(text => {
      const blob = new Blob([text], { type: 'text/css; charset=UTF-8' });
      const blobURL = URL.createObjectURL(blob);
      const newLink = link.cloneNode(false);
      newLink.setAttribute('href', blobURL);
      const onLoad = () => {
        link.remove();
        newLink.removeEventListener('load', onLoad, false);
      }
      newLink.addEventListener('load', onLoad, false);
      link.parentNode.insertBefore(newLink, link);
    }).catch(console.warn);
  }
})();
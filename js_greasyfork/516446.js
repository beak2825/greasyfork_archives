// ==UserScript==
// @name           wings.io Auto Respawn
// @namespace      https://github.com/AbdurazaaqMohammed
// @version        1.0
// @author         Abdurazaaq Mohammed
// @description    Auto respawn on wings.io
// @match          https://wings.io/
// @icon           https://wings.io/images/favicon.png
// @homepage       https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL     https://github.com/AbdurazaaqMohammed/userscripts/issues
// @license        The Unlicense
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/516446/wingsio%20Auto%20Respawn.user.js
// @updateURL https://update.greasyfork.org/scripts/516446/wingsio%20Auto%20Respawn.meta.js
// ==/UserScript==
(function() {
	'use strict';

  const playButton = document.querySelector("#playButton");

  function setup() {
    const myCSS = '#overlay { display: none !important; }';
    if (typeof GM_addStyle === 'function') GM_addStyle(myCSS);
    else if (typeof PRO_addStyle === 'function') PRO_addStyle(myCSS);
    else if (typeof addStyle === 'function') addStyle(myCSS);
    else {
      var node = document.createElement("style"); node.type = "text/css"; node.appendChild(document.createTextNode(myCSS));
      var heads = document.getElementsByTagName("head");
      heads.length > 0 ? heads[0].appendChild(node) ? (document.documentElement) : document.documentElement.appendChild(node) : new MutationObserver(function () { if (document.documentElement) { obs.disconnect(); document.documentElement.appendChild(node); } }).observe(document, {childList: true});
    }
    setInterval(function() {
      clickPlay(document.getElementById('nick').value);
    }, 200)
  }

  playButton.addEventListener("click", setup);
})();
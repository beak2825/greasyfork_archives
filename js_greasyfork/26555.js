// ==UserScript==
// @name        Wikia load images
// @namespace   rwslol.com
// @description show all lazy-loaded images since Wikia code is full of garbage and it's easier to make this hamfisted userscript than to whitelist whatever script normally loads them when adblocking everything else
// @include     http://*.wikia.com/*
// @include     https://*.wikia.com/*
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26555/Wikia%20load%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/26555/Wikia%20load%20images.meta.js
// ==/UserScript==

imgs = document.getElementsByTagName('img');
for (i = 0; i < imgs.length; i++) {
  var lazy = imgs[i].getAttribute("data-src");
  if (lazy) {
    imgs[i].src = lazy;
    imgs[i].className = "";
  }
}

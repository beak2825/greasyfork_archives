// ==UserScript==
// @name Block Short Video Carousel View
// @namespace http://dzen.ru/
// @version 0.4
// @description Block the short video carousel view on dzen.ru
// @author Your Name
// @match https://dzen.ru/*
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @grant GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462220/Block%20Short%20Video%20Carousel%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/462220/Block%20Short%20Video%20Carousel%20View.meta.js
// ==/UserScript==

/* global jQuery */

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes) {
      jQuery('.short-video-carousel-view').hide();
    }
  });
});

var config = { childList: true, subtree: true };
observer.observe(document.body, config);

GM_addStyle('.short-video-carousel-view { display: none !important; }');
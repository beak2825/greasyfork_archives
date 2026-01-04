// ==UserScript==
// @name        Fix image links on Old Reddit
// @namespace   https://github.com/abdurazaaqmohammed
// @version     1.1.2
// @description Fix opening redd.it image links on Old Reddit
// @author      Abdurazaaq Mohammed
// @homepage    https://github.com/abdurazaaqmohammed/userscripts
// @license     The Unlicense
// @supportURL  https://github.com/abdurazaaqmohammed/userscripts/issues
// @match       https://*.reddit.com/*
// @exclude     https://www.reddit.com/*
// @exclude     https://new.reddit.com/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/484871/Fix%20image%20links%20on%20Old%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/484871/Fix%20image%20links%20on%20Old%20Reddit.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function openImageViewer(imgLink) {
    // Uncomment below and comment/delete the other line if you want to redirect to the image directly instead of opening in a new tab.
    //window.location.href = 'https://abdurazaaqmohammed.github.io/imgviewer?viewimg=' + imgLink;
    window.open('https://abdurazaaqmohammed.github.io/imgviewer?viewimg=' + imgLink);
  }

  function fixImageLinks(mutationsList, observer) {
    document.querySelectorAll(".media-preview").forEach((gallery) => gallery.addEventListener("click", function() { openImageViewer(Array.from(gallery.querySelectorAll('img')).map(id => `${id.src.split('?')[0]}`).join(',')) }) );

    document.querySelectorAll('a[href^="https://preview.redd.it"], a[href^="https://i.redd.it"]').forEach(link => {
      const imgLink = link.href;
      // Overwriting the href would break copying the image link, so remove the old href and set onClick to open the viewer instead.
      link.removeAttribute("href");
      link.addEventListener("click", function() { openImageViewer(imgLink); });
    });
  }

  const url = window.location.href;
  const brokenImg = 'https://old.reddit.com/r/funny/comments/media/nice_hat/?url=';
  url.startsWith(brokenImg) ? window.location.href = 'https://abdurazaaqmohammed.github.io/imgviewer?viewimg=' + url.split(brokenImg)[1] : new MutationObserver(fixImageLinks).observe(document, { subtree: true, childList: true });

})();
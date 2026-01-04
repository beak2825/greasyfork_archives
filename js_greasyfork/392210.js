// ==UserScript==
// @name         GoogleGifs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically plays gifs on google pages
// @author       Ian Pearce (@peeinears)
// @match        https://www.google.com/*
// @grant        MIT
// @downloadURL https://update.greasyfork.org/scripts/392210/GoogleGifs.user.js
// @updateURL https://update.greasyfork.org/scripts/392210/GoogleGifs.meta.js
// ==/UserScript==


// This script is originally from an extension called GoogleGifs by Ian Pearce, hence I have credited him as the author. I have merely turned it into a userscript because the extension was removed from Chrome's webstore.

(function() {
    'use strict';

    function playGIFs() {
        var els, i, a, img, matches, url;
        els = document.getElementsByClassName('rg_di');
        for (i = 0; i < els.length; i++) {
            if (els[i].animated) continue;
            els[i].animated = true;
            a = els[i].getElementsByTagName('a')[0];
            if (!a) continue;
            img = els[i].getElementsByTagName('img')[0];
            if (!img) continue;
            matches = a.href.match(/imgurl=(\S+?)(&|$)/i);
            if (matches !== null && matches.length > 1) {
                url = unescape(unescape(matches[1]));
                if (/\.gif(\?.*)?$/i.test(url)) {
                    img.src = url;
                }
            }
        }
  }

  // continue to load GIFs added to DOM after initial page load
  window.setInterval(playGIFs, 1000);
})();
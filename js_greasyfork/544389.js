// ==UserScript==
// @name        Old Reddit Redirect (Nice Hat Fix)
// @namespace   https://greasyfork.org/en/users/1500856-titouan
// @description Redirect to old Reddit except /gallery, /media, /poll paths. Fixes the "nice hat" bug where clicking image links opens an unrelated "nice hat" post on old Reddit.
// @include     *://www.reddit.com/*
// @version     1.0
// @run-at      document-start
// @author      Titouan
// @license     MIT
// @grant       none
// @icon        https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-76x76.png
// @downloadURL https://update.greasyfork.org/scripts/544389/Old%20Reddit%20Redirect%20%28Nice%20Hat%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544389/Old%20Reddit%20Redirect%20%28Nice%20Hat%20Fix%29.meta.js
// ==/UserScript==

(() => {
    const exclude = ['/gallery', '/media', '/poll'];
    const path = location.pathname.toLowerCase();
    if (!exclude.some(p => path.startsWith(p))) {
        location.replace(`https://old.reddit.com${location.pathname}${location.search}${location.hash}`);
    }
})();

// ==UserScript==
// @name     Insomnia Go to new post
// @description Insomnia new post
// @match    https://www.insomnia.gr/followed/*
// @match    http://www.insomnia.gr/followed/*
// @include        https://www.insomnia.gr/followed/*
// @include        http://www.insomnia.gr/followed/*
// @match    http://www.insomnia.gr/forums/*
// @match    https://www.insomnia.gr/forums/*
// @exclude  http://www.insomnia.gr/forums/topic/*
// @exclude  https://www.insomnia.gr/forums/topic/*
// @include        https://www.insomnia.gr/forums/*
// @match    http://www.insomnia.gr/discover/*
// @match    https://www.insomnia.gr/discover/*
// @include        http://www.insomnia.gr/discover/*
// @grant    none
// @version 0.0.1.20180109083327
// @namespace https://greasyfork.org/users/162251
// @downloadURL https://update.greasyfork.org/scripts/37200/Insomnia%20Go%20to%20new%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/37200/Insomnia%20Go%20to%20new%20post.meta.js
// ==/UserScript==
    window.addEventListener('click', event => {
  const el = event.target.closest('[href*="forums/topic"]');
  const el2 = event.target.closest('[href*="?do=getNewComment"]');
  const href = el && el.getAttribute('href');
      if (el && (!el2)) {
    el.setAttribute('href', decodeURIComponent(href + '?do=getNewComment'));
  }
}, true);
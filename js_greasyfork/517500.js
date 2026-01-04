// ==UserScript==
// @name Old Reddit Image Loader
// @namespace https://rant.li/boson
// @match       *://*.reddit.com/*
// @grant none
// @version 1.1
// @author Boson
// @description add images in comments
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/517500/Old%20Reddit%20Image%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/517500/Old%20Reddit%20Image%20Loader.meta.js
// ==/UserScript==
[...document.querySelectorAll('a')].forEach((element) => {
  if(element.innerHTML == '&lt;image&gt;'){
    const my_img = document.createElement('img');
    my_img.src = element.href;
    my_img.style = 'max-width:240px;width:100%';
    element.replaceWith(my_img);
  }
});
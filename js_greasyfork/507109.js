// ==UserScript==
// @name Old Reddit Image Loader
// @namespace Violentmonkey Scripts
// @match *://old.reddit.com/*
// @grant none
// @version 1.0
// @license MIT
// @author -
// @description 5/31/2024, 12:30:37 AM
// @downloadURL https://update.greasyfork.org/scripts/507109/Old%20Reddit%20Image%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/507109/Old%20Reddit%20Image%20Loader.meta.js
// ==/UserScript==
[...document.querySelectorAll('a')].forEach((element) => {
  if(element.innerHTML == '&lt;image&gt;'){
    const my_img = document.createElement('img');
    my_img.src = element.href;
    my_img.style = 'max-width:240px;width:100%';
    element.replaceWith(my_img);
  }
});
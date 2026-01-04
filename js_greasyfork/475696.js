// ==UserScript==
// @name     Stackoverflow: Fix broken images
// @description Script to replace just links (which should be images instead) with `img` tags for properly representation
// @version  0.2.0
// @namespace ClasherKasten
// @grant    none
// @license MIT
// @include https://stackoverflow.com/questions/*
// @downloadURL https://update.greasyfork.org/scripts/475696/Stackoverflow%3A%20Fix%20broken%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/475696/Stackoverflow%3A%20Fix%20broken%20images.meta.js
// ==/UserScript==

const links = document.querySelectorAll('a[href^="https://i.stack.imgur.com/"]');
links.forEach(link => {
  const img = document.createElement('img');
  img.src = link.href;
  img.alt = link.innerText;
  link.innerText = '';
  link.appendChild(img);
});
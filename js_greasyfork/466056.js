// ==UserScript== 
// @name        Emojipedia Minimal
// @namespace   org.emojipedia.minimal
// @description Minor fixes and clutter removal
// @match       *://emojipedia.org/*
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn5OZPC90ZXh0Pjwvc3ZnPgo=
// @version     23.04
// @license     Public Domain
// @downloadURL https://update.greasyfork.org/scripts/466056/Emojipedia%20Minimal.user.js
// @updateURL https://update.greasyfork.org/scripts/466056/Emojipedia%20Minimal.meta.js
// ==/UserScript==

// TODO search bar
// https://emojipedia.org/search/?q=
// https://pagedart.com/blog/how-to-add-a-search-bar-in-html/


let
  item,
  cssSelectors = [
    '.ad',
    '.ad-sidebar',
    '.emoji-navbar-header',
    '.page-header-part',
    '.sidebar',
    '.sponsor',
    '.topMainAd',
    '.vendor-list',
    'footer',
    'form.short-link',
    'li > p',
    'script',
    'section'
  ];

for (const item of document.querySelectorAll('li > h2')) {
  item.style.fontSize = 'xx-large';
  item.style.paddingBottom = '5%';
}

if (document.querySelector('h1')) {
  item = document.querySelector('h1');
  item.style.fontSize = 'xxx-large';
  item.style.paddingBottom = '5%';
}

if (document.querySelector('.search-multilang-button')) {
  item = document.querySelector('.search-multilang-button');
  item.textContent = 'Change language';
  item.style.position = 'absolute';
  item.style.right = 0;
  item.remove();
  document.body.append(item);
}

//if (document.querySelector('.emoji-navbar-search-form')) {
item = document.querySelector('.emoji-navbar-search-form');
item.style.position = 'fixed';
item.style.right = 0;
item.style.left = 0;
item.style.top = 0;
item.action='/search/?q=';
item.querySelector('input').name = 'q';
//item.querySelector('input').removeAttribute('placeholder');
item.querySelector('input').placeholder = 'Search Emojis';
document.body.append(item);
//}

document.querySelector('.sidebar').style.display = 'unset';

for (let i = 0; i < cssSelectors.length; i++) {
  for (const item of document.querySelectorAll(cssSelectors[i])) {
    item.remove();
  }
}

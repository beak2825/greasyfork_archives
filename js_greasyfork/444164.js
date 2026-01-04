// ==UserScript==
// @name        manga sites tweaks
// @namespace   Itsnotlupus Industries
// @match       https://1stkissmanga.io/*
// @match       https://manga-tx.com/*
// @match       https://isekaiscan.com/*
// @match       https://manhuaplus.com/*
// @grant       none
// @version     1.5
// @author      -
// @description image loading indicators, prevent headers from being sticky
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/444164/manga%20sites%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/444164/manga%20sites%20tweaks.meta.js
// ==/UserScript==

// TODO: Add applicable manga domains as needed.
// TODO: maybe try to auto-reload broken images? 

// utilities
const crel = (e, attrs) => Object.assign(document.createElement(e), attrs);
const observe = (fn, e = document.body, config = { attributes: 1, childList: 1, subtree: 1 }) => {
  const observer = new MutationObserver(fn);
  observer.observe(e, config);
  return () => observer.disconnect();
};

// yin yang SVG derived from https://icons8.com/preloaders/en/filtered-search/all/free;svg/
const loading_svg = 'data:image/svg+xml;base64,'+btoa`
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="128" viewBox="0 -128 128 256">
  <circle cx="64" cy="64" r="63.31" fill="#fff"/>
  <g>
    <path d="M3.13 44.22a64 64 0 1 0 80.65-41.1 64 64 0 0 0-80.65 41.1zm34.15-4.83a10.63 10.63 0 1 1-13.4 6.8 10.63 10.63 0 0 1 13.4-6.8zm7.85 82.66A61.06 61.06 0 0 1 5.7 45.86 30.53 30.53 0 0 0 64 64a30.53 30.53 0 0 1 58.3 18.12l.35-1.14-.58 1.9a61.06 61.06 0 0 1-76.94 39.2zM106.9 73.2A10.63 10.63 0 1 0 93.5 80a10.63 10.63 0 0 0 13.4-6.8z"/>
    <animateTransform attributeName="transform" dur="1200ms" from="0 64 64" repeatCount="indefinite" to="-360 64 64" type="rotate"/>
  </g>
</svg>`;

// show a clear loading state when a page is missing
document.head.append(crel('style', {
  type: 'text/css',
  textContent: `img.wp-manga-chapter-img,img[class^="wp-image-"] {
    min-height: 300px;
    background: fixed repeat-y center #777 url('${loading_svg}');
  }
  .c-blog-post .entry-content .entry-content_wrap {
    line-height: 1em;
  }
  `}));

observe(() => {
  // don't bring up a distracting sticky header on every scroll up
  document.querySelectorAll('.sticky').forEach(e => e.classList.remove('sticky'));
  // unset min-height on loaded images, to render thin slices correctly
  document.querySelectorAll(`img.wp-manga-chapter-img:not([style*='min-height']),img[class^="wp-image-"]:not([style*='min-height'])`).forEach(img => {
    if (img.naturalWidth) img.style.minHeight=0;
  });
});
  

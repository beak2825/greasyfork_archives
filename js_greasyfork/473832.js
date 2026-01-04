// ==UserScript==
// @name        DGG Wiki dark mode
// @namespace   Obamna LULW
// @description STOP BURNING MY EYES REE
// @match       https://wiki.destiny.gg/*
// @grant       none
// @version     0.1.1
// @author      mif
// @license     MIT
// @homepageURL https://greasyfork.org/en/scripts/473832-dgg-wiki-dark-mode
// @downloadURL https://update.greasyfork.org/scripts/473832/DGG%20Wiki%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/473832/DGG%20Wiki%20dark%20mode.meta.js
// ==/UserScript==

let head = document.getElementsByTagName('HEAD')[0];
let link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
// link.href = 'style.css';
link.href = 'https://meta.wikimedia.org/w/index.php?title=User:DavidL/darktheme.css&ctype=text/css&action=raw'
head.appendChild(link);

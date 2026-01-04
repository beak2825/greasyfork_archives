// ==UserScript==
// @name        pixiv no susume
// @description pixiv hide susume
// @namespace   pks
// @include     https://www.pixiv.net/*
// @include     http://www.pixiv.net/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/39255/pixiv%20no%20susume.user.js
// @updateURL https://update.greasyfork.org/scripts/39255/pixiv%20no%20susume.meta.js
// ==/UserScript==

var css = '._10B0Nri,._2V6YY0n,._28nOzbY,._3O5pic4,._2Fwd5oy {height: 56px;}',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

style.type = 'text/css';
if (style.styleSheet){
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}

head.appendChild(style);
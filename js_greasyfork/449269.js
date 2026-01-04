// ==UserScript==
// @name        OpenWRT Max Width
// @namespace   Violentmonkey Scripts
// @match       http://10.0.0.1/*
// @match       http://192.168.1.1/*
// @match       http://192.168.0.1/*
// @match       http://openwrt.lan/*
// @match       http://immortalwrt.lan/*
// @match       http://ohmywrt.lan/*
// @grant       none
// @version     1.1
// @author      -
// @description 8/10/2022, 2:29:55 AM
// @downloadURL https://update.greasyfork.org/scripts/449269/OpenWRT%20Max%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/449269/OpenWRT%20Max%20Width.meta.js
// ==/UserScript==

var css = '.container { max-width: 1500px; }',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

head.appendChild(style);

style.type = 'text/css';
if (style.styleSheet){
  // This is required for IE8 and below.
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}

// ==UserScript==
// @name        Google Search old favicon (2012—2015)
// @author      XXN
// @namespace   XXN
// @description Use old favicon for Google Search (pre September 2015)
// @include     https?://*.google.*/*
// @include     https?://google.*/*
// @exclude	/^htt.*://(mail|accounts|support|maps|play|news|drive|translate|plus)\.google\.*.*/
// @exclude     /^htt.*://(mail|accounts|support|maps|play|news|drive|translate|plus)\.google\.co.*/
// @version     1.21
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12186/Google%20Search%20old%20favicon%20%282012%E2%80%942015%29.user.js
// @updateURL https://update.greasyfork.org/scripts/12186/Google%20Search%20old%20favicon%20%282012%E2%80%942015%29.meta.js
// ==/UserScript==

var favicon_link_html = document.createElement('link');
favicon_link_html.rel = 'icon';
favicon_link_html.href = 'http://www.iconj.com/ico/d/2/d2mdwwgcs3.ico';
favicon_link_html.type = 'image/x-icon';

try { 
  document.getElementsByTagName('head')[0].appendChild( favicon_link_html ); 
}
catch(e) { }
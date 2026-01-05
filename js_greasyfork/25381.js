// ==UserScript==
// @name        Big Weibo Images
// @author      Arnold François Lecherche
// @namespace   greasyfork.org
// @icon        http://tw.weibo.com/favicon.ico
// @version     0.0.1
// @description Changes medium-sized Weibo images to full-sized
// @include     http://weibo.com/*
// @include     http://*.weibo.com/*
// @include     https://weibo.com/*
// @include     https://*.weibo.com/*
// @run-at      document-end
// @copyright   2016 Arnold François Lecherche
// @downloadURL https://update.greasyfork.org/scripts/25381/Big%20Weibo%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/25381/Big%20Weibo%20Images.meta.js
// ==/UserScript==

(function (d, R, S, undefined) {
  'use strict';
  var mid = '/bmiddle/', midRegex = new R(mid);
  function enlarge() {
    var imgs = d.images, i = imgs.length, s;
    while (i--) {
      s = S(imgs[i].src || '');
      if (midRegex.test(s)) imgs[i].src = s.replace(mid, '/large/');
    }
  }
  enlarge();
  d.addEventListener('DOMContentLoaded', enlarge, false);
  d.addEventListener('load', enlarge, false);
  d.addEventListener('click', enlarge, false);
})(document, RegExp, String);
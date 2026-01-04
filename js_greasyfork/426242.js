// ==UserScript==
// @name oncam.me Download Links
// @author Arnold François Lecherche
// @namespace greasyfork.org
// @version 1.00
// @description Download videos from oncam.me
// @include http://oncam.me/*
// @include http://*.oncam.me/*
// @include https://oncam.me/*
// @include https://*.oncam.me/*
// @grant none
// @run-at document-end
// @copyright 2021 Arnold François Lecherche
// @downloadURL https://update.greasyfork.org/scripts/426242/oncamme%20Download%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/426242/oncamme%20Download%20Links.meta.js
// ==/UserScript==
(function (w, d) {
  'use strict';
  var a = false;
  function init() {
    var v, s, n, r, l, u, p;
    if (a) return;
    v = d.getElementById('player-fluid');
    s = v.getElementsByTagName('source');
    n = s.length;
    if (!n) return;
    r = /_(\d+p)\./;
    l = [];
    while (n--) s[n].src && l.push(s[n].src);
    n = l.length;
    if (!n) return;
    u = d.createElement('ul');
    while (n--) u.innerHTML += '<li><a download="download" href="' + l[n] + '" type="video/mp4">Download' + (r.test(l[n]) ? ' (' + l[n].match(r)[1] + ')' : '') + '</a></li>';
    p = d.getElementById('video');
    p.parentNode.insertBefore(u, p.nextSibling);
    a = true;
  }
  init();
  d.addEventListener('DOMContentLoaded', init, false);
  w.addEventListener('load', init, false);
})(window, document);
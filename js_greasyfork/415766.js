// ==UserScript==
// @name erome download links
// @author Arnold François Lecherche and EromeScriptThrowaway
// @namespace greasyfork.org
// @icon https://www.erome.com/android-chrome-192x192.png
// @version 1.00
// @description Exposes media-download links for erome media galleries
// @include http://erome.com/*
// @include http://*.erome.com/*
// @include https://erome.com/*
// @include https://*.erome.com/*
// @grant none
// @run-at document-end
// @copyright 2020 Arnold François Lecherche
// @downloadURL https://update.greasyfork.org/scripts/415766/erome%20download%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/415766/erome%20download%20links.meta.js
// ==/UserScript==
(function (A, w, d, b) {
  'use strict';
  var v = A.from(d.getElementsByTagName('video'));
  function videoSourceFilter(n) {
    return n.tagName && n.tagName.toLowerCase() === 'source';
  }
  function videoHDFilter(s) {
    return s && s.src && s.getAttribute('label') === 'HD';
  }
  function videoMap(v) {
    var s = A.from(v.childNodes).filter(videoSourceFilter);
    if (s.length === 1) return s[0].src;
    return videoSources.filter(videoHDFilter)[0].src;
  }
  function addLink(s, e) {
    var l = d.createElement('a');
    l.setAttribute('href', s);
    l.download = '';
    l.textContent += s;
    e.parentElement.parentElement.appendChild(l);
    e.parentElement.parentElement.appendChild(d.createElement('br'));
  }
  function init() {
    var i = (v || '').length || 0, s, j;
    while (i--) {
      s = A.from(v[i].childNodes).filter(videoSourceFilter);
      j = s.length;
      while (j--) addLink(s[j].src, v[i]);
    }
    d.removeEventListener('DOMContentLoaded', init, false);
    w.removeEventListener('load', init, false);
  }
  switch (d.readyState) {
    case 'interactive':
    case 'complete':
      init();
      break;
    default:
      d.addEventListener('DOMContentLoaded', init, false);
      w.addEventListener('load', init, false);
  }
})(Array, window, document, document.body || document.getElementsByTagName('body')[0] || document.getElementsByTagName('frameset')[0]);
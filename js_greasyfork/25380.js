// ==UserScript==
// @name        Big Instagram Images
// @author      Arnold François Lecherche
// @namespace   greasyfork.org
// @icon        https://instagramstatic-a.akamaihd.net/h1/images/ico/favicon.ico/dfa85bb1fd63.ico
// @version     0.0.2
// @description Makes Instagram preview images full-sized
// @include     http://instagram.com/*
// @include     http://*.instagram.com/*
// @include     https://instagram.com/*
// @include     https://*.instagram.com/*
// @run-at      document-end
// @copyright   2017 Arnold François Lecherche
// @downloadURL https://update.greasyfork.org/scripts/25380/Big%20Instagram%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/25380/Big%20Instagram%20Images.meta.js
// ==/UserScript==

(function (d, S, undefined) {
  'use strict';
  var si = /\/s\d+x\d+\//g, sh = /\/sh\d\.\d+\//g, cr = /\/c\d[\d\.]+\d\//g, t = +(new Date()),
    k = '$Download$' + S(Math.random()).substring(2) + '$';
  function enlarge() {
    var imgs = d.images, i = imgs.length, s, a, p, l, n, m;
    while (i--) {
      m = imgs[i];
      s = S(m.src || '');
      if (si.test(s)) s = s.replace(si, '/');
      if (sh.test(s)) s = s.replace(sh, '/');
      if (cr.test(s)) s = s.replace(cr, '/');
      if (s && s !== m.src) m.src = s;
      a = m.parentNode.parentNode.parentNode;
      if (a.nodeName.toLowerCase() === 'a' && a.href.indexOf('taken-by=') > -1) {
        p = d.createElement('span');
        p.setAttribute('class', a.getAttribute('class'));
        l = a.childNodes;
        for (n = l.length; n--;) if (l[n].nodeType === 1) p.appendChild(l[n]);
        a.parentNode.insertBefore(p,a);
        a.appendChild(d.createTextNode('Info'));
        a.rel = 'noopener noreferrer nofollow';
        a.style.display = 'inline';
        a.style.width = 'auto';
        a.target = '_blank';
        p.appendChild(a);
        a = d.createElement('a');
        a.appendChild(d.createTextNode('Download'));
        a.rel = 'noopener noreferrer nofollow';
        a.style.float = 'right';
        a.download = '';
        a.href = s;
        p.appendChild(a);
      }
      p = m.parentNode.parentNode.parentNode.parentNode;
      if (p.nodeName.toLowerCase() !== 'article') p = p.parentNode;
      if (p.nodeName.toLowerCase() === 'article' && !(k in p)) {
        a = d.createElement('a');
        a.appendChild(d.createTextNode('Download'));
        a.rel = 'noopener noreferrer nofollow';
        a.style.float = 'right';
        a.download = '';
        a.href = s;
        p[k] = true;
        p.appendChild(a);
      }
    }
    imgs = a = p = l = m = null;
  }
  function gatekeeper(evt) {
    var n = +(new Date());
    if (n - t < 100) return;
    t = n;
    enlarge();
  }
  enlarge();
  d.addEventListener('DOMContentLoaded', enlarge, false);
  d.addEventListener('load', enlarge, false);
  d.addEventListener('click', enlarge, false);
  d.addEventListener('mousemove', gatekeeper, false);
  d.addEventListener('keydown', gatekeeper, false);
  d.addEventListener('scroll', gatekeeper, false);
})(document, String);
// ==UserScript==
// @name Volafile Chat Timestamps
// @author Arnold François Lecherche, dongmaster, and lg188
// @namespace greasyfork.org
// @icon https://volafile.org/favicon.ico
// @version 1.00
// @description Adds timestamps to chat messages on Volafile.
// @include http://volafile.org/r/*
// @include http://*.volafile.org/r/*
// @include https://volafile.org/r/*
// @include https://*.volafile.org/r/*
// @grant none
// @run-at document-end
// @copyright 2021 Arnold François Lecherche
// @downloadURL https://update.greasyfork.org/scripts/426260/Volafile%20Chat%20Timestamps.user.js
// @updateURL https://update.greasyfork.org/scripts/426260/Volafile%20Chat%20Timestamps.meta.js
// ==/UserScript==

(function (w, d, M) {
  'use strict';
  var obs = new M(observ), conf = {
    childList: true
  }, a = false, k;
  function observ(muts) {
    var i = muts.length, m, j;
    while (i--) {
      m = muts[i].addedNodes;
      j = m.length;
      while (j--) if (m[j].hasAttribute('data-timestamp') === false) timestamp(m[j]);
    }
  }
  function timestamp(msg) {
    var unam = msg.getElementsByClassName('username')[0], time, ts;
    if (!unam) return;
    ts = create_element('span', new Date().toISOString() + ' | ');
    ts.setAttribute('class', 'userscript_chat_timestamp');
    unam.insertBefore(ts, unam.childNodes[0]);
    msg.setAttribute('data-timestamp', 'true');
  }
  function create_element(elem, txt) {
    var uelem = d.createElement(elem);
    uelem.appendChild(d.createTextNode(txt));
    return uelem;
  }
  function init() {
    var msgs;
    if (a) return k && w.clearInterval(k);
    else k = k || w.setInterval(init, 1e3);
    msgs = d.getElementById('chat_messages');
    if (!msgs) return;
    obs.observe(msgs, conf);
    a = true;
    if (k) w.clearInterval(k);
  }
  init();
  d.addEventListener('DOMContentLoaded', init, false);
  w.addEventListener('load', init, false);
})(window, document, MutationObserver);
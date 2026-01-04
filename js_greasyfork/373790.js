// ==UserScript==
// @name           skip dereferrer.me
// @namespace      https://greasyfork.org/de/users/222470-ale8min4
// @description    hides advertising and skips the waiting time on dereferrer.me
// @author         ale8min4
// @locale         en
// @version        0.0.1
// @license        GPLv2
// @include        *://*dereferer.me/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/373790/skip%20dereferrerme.user.js
// @updateURL https://update.greasyfork.org/scripts/373790/skip%20dereferrerme.meta.js
// ==/UserScript==

  var h, s;
  h = window.location.href;
  s = h.substring(22, h.length);
  window.location.href = s;
  
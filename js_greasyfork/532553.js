// ==UserScript==
// @name         ANON.TO Redirect (2025 Edition)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  anon.to redirect to use actual link target, not visible text
// @author       ChatGPT
// @match        http://*.anon.to/*
// @match        https://*.anon.to/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/532553/ANONTO%20Redirect%20%282025%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532553/ANONTO%20Redirect%20%282025%20Edition%29.meta.js
// ==/UserScript==

(function() {
  'use strict';
  $(document).ready(function() {
    const href = $('a#redirect_anchor').attr('href');
    if (href) {
      window.location.href = href;
    }
  });
})();

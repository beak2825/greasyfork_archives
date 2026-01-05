// ==UserScript==
// @name         Redacted :: Fix PTH URLs
// @author       newstarshipsmell
// @namespace    https://greasyfork.org/en/scripts/27972-redacted-fix-pth-urls
// @version      1.0
// @description  Reload PTH URLs with RED URLs instead, whether or not logged into PTH, and replace PTH URLs on RED with RED URLs.
// @include      https://passtheheadphones.me/*
// @include      https://redacted.ch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27972/Redacted%20%3A%3A%20Fix%20PTH%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/27972/Redacted%20%3A%3A%20Fix%20PTH%20URLs.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (window.location.hostname == 'passtheheadphones.me') {
    if (window.location.pathname == '/login.php') {
      var returnUrl = document.cookie.split('redirect=')[1].split(';')[0];
      if (returnUrl)
        window.location.assign('https://redacted.ch' + decodeURIComponent(returnUrl));
    } else {
      window.location.assign(window.location.href.replace(/passtheheadphones\.me/, 'redacted.ch'));
    }
  } else {
    var links = document.querySelectorAll('a[href^="https://passtheheadphones.me/"]');
    for (var j in links){
      if (!links.hasOwnProperty(j)) continue;
      links[j].href = links[j].href.replace(/https:\/\/passtheheadphones\.me/, '');
      links[j].title = 'This is a PTH URL!';
      links[j].innerHTML += ' <img src="/static/common/symbols/warned.png">';
    }
  }
})();
// ==UserScript==
// @name    Fix Voiceforge
// @include https://www.voiceforge.com/*
// @description Quick and dirty monkeypatch for the VoiceForge demo page requesting an HTTP version of JQuery.
// @version 1
// @namespace https://greasyfork.org/users/200317
// @downloadURL https://update.greasyfork.org/scripts/370822/Fix%20Voiceforge.user.js
// @updateURL https://update.greasyfork.org/scripts/370822/Fix%20Voiceforge.meta.js
// ==/UserScript==

(function(s) {
  r = new XMLHttpRequest(); // yep, really
  r.addEventListener("load", (function() {
  	e = document.createElement('script');
    e.type = 'text/javascript'; // just to be safe
    // paste the body of newly-requested jquery next to the script that uses it; this is a workaround because the site's
    // script already runs after the bogus plaintext request is made and errors out because it got blocked by HSTS
    e.innerHTML = this.responseText + document.querySelectorAll("body > script:nth-child(8)")[0].innerHTML;
    s.parentNode.insertBefore(e, s);
  }));
  r.open("GET", s.getAttribute('src').replace('http', 'https')); // re-request jquery
	r.send();
}) (
  document.querySelectorAll("head > script:nth-child(4)")[0]
);
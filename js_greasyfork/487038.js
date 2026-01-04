// ==UserScript==
// @name         LinkSpy concatenated with clicksfly.com Bypass
// @version      1.1
// @description  Redirects from LinkSpy shortened URLs to the original URLs before any content is loaded.
// @author       Rust1667
// @match        https://linkspy.cc/tr/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/487038/LinkSpy%20concatenated%20with%20clicksflycom%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/487038/LinkSpy%20concatenated%20with%20clicksflycom%20Bypass.meta.js
// ==/UserScript==

// Example link:
// https://linkspy.cc/tr/aHR0cHM6Ly9jbGlja3NmbHkuY29tL2Z1bGw/YXBpPWNhMDNkN2Q1YzBjODgzMzViMGY5YmVmZDkyMWQ5YWYxMWZmZmM4OTEmdXJsPWFIUjBjSE02THk5M2QzY3VabWxzWldOeWVYQjBMbU5qTDBOdmJuUmhhVzVsY2k5RlFrTTVSRE5GUkVZNUxtaDBiV3c9JnR5cGU9Mg==
// Decoded to:
// https://clicksfly.com/full?api=ca03d7d5c0c88335b0f9befd921d9af11fffc891&url=aHR0cHM6Ly93d3cuZmlsZWNyeXB0LmNjL0NvbnRhaW5lci9FQkM5RDNFREY5Lmh0bWw=&type=2
// Decoded to:
// https://www.filecrypt.cc/Container/EBC9D3EDF9.html

(function() {
    'use strict';
    if ( window.location.href.startsWith('https://linkspy.cc/tr/') ) {

      //----Bypass linkspy.cc----
      var encodedUrl = window.location.href.split('/tr/')[1];
      var decodedUrl = atob(encodedUrl);
      if (!decodedUrl.startsWith('https://clicksfly.com/')) {
        window.location.assign(decodedUrl);

      //----Bypass clicksfly.com----
      } else if (decodedUrl.startsWith('https://clicksfly.com/')) {
        var urlParam = new URLSearchParams(decodedUrl).get('url');
        var decodedURL2 = atob(urlParam);
        window.location.assign(decodedURL2);
      }
    }

})();

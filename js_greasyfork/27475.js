// ==UserScript==
// @name		imgur HTTP-to-HTTPS redirector
// @namespace	https://greasyfork.org/users/19952-xant1k-bt
// @description	Replace http:// with https:// in the address bar
// @include		http://imgur.com/*
// @include		http://i.imgur.com/*
// @version		1.0
// @author		Xant1k@bt
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/27475/imgur%20HTTP-to-HTTPS%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/27475/imgur%20HTTP-to-HTTPS%20redirector.meta.js
// ==/UserScript==

(function(){
  var debug = 0;
  var new_location = location.href.replace(/http\:/, 'https:');
  if ( debug > 0 ) {
    alert(  "Hash:     "+location.hash+
          "\nHost:     "+location.host+
          "\nHostname: "+location.hostname+
          "\nHREF:     "+location.href+
          "\nPathname: "+location.pathname+
          "\nPort:     "+location.port+
          "\nProtocol: "+location.protocol+
          "\n"+
          "\nNew Location: "+new_location);
  };
  location.href = new_location;
})();
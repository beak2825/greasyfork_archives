// ==UserScript==
// @name           Smile@Amazon
// @name:de        Smile@Amazon
// @description    Redirects any Amazon shopping site to its Smile representation
// @description:de Leitet jede Amazon Shopping Seite zu ihrem Smile Äquivalent um
// @namespace      zScript
// @include        https://www.amazon.tld/*
// @icon           https://smile.amazon.com/favicon.ico
// @version        1.2
// @grant          none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js 
// @downloadURL https://update.greasyfork.org/scripts/372320/Smile%40Amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/372320/Smile%40Amazon.meta.js
// ==/UserScript==

// I created this script because any other Script redirecting to Amazon Smile has one or another flaw
// Most Scripts check for only one TLD like .COM, this script should work for all domains Tampermonkey supports.
// As Amazon redirects its shopping site always to the HTTPS protocol and the WWW subdomain, i only include httpS://WWW.amazon...
// As Amazon prevents to be included in Frames from other sites, i only prevent redirection if the top window is already smile.amazon
// This way i leave (i)frames created by smile.amazon the way Amazon created them, hoping they know what they're doing.
//
// This edited script will only redirect if the page exists (a problem for sites that dont have amazon smile such as Amazon JP)
(function() {
    'use strict';
    if(top.location.href.match(/^http(?:s)?:\/\/smile\.amazon\.[^/]+\//i) === null){
      var xhr = new XMLHttpRequest();
      $.ajax({
        url:window.location.href.replace(/^http(?:s)?:\/\/www\./i, "https://smile."),
        success: function() {
          if(xhr.responseURL.match(/^http(?:s)?:\/\/smile\.amazon\.[^/]+\//i) !== null) {
            window.location.replace(window.location.href.replace(/^http(?:s)?:\/\/www\./i, "https://smile."));
          }
        },
        xhr: function() {
         return xhr;
    		}
	  	});  
    }
})();
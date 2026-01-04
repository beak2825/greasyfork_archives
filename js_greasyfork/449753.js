// ==UserScript==
// @name       Amazon Auto-Smile
// @namespace  
// @version    0.1
// @description  Automatically redirects all www.amazon.com URLs to their smile.amazon.com equivalent.
// @match      http://www.amazon.com/*
// @match      https://www.amazon.com/*
// @match      https://us.amazon.com/*
// @run-at document-end
// @copyright  2013
// @downloadURL https://update.greasyfork.org/scripts/449753/Amazon%20Auto-Smile.user.js
// @updateURL https://update.greasyfork.org/scripts/449753/Amazon%20Auto-Smile.meta.js
// ==/UserScript==

// Only redirect if we're the top window
//
// This prevents iframes embedded within www.amazon.com pages from 
// triggering redirects themselves: we only want the outer window to do that. 
// Unfortunately, it has the side-effect that if amazon.com is embedded
// in a frame on some other website, we'll skip doing the redirect even though 
// we're supposed to. 

if (window.self === window.top) {
    var new_host = window.location.host.replace(/^(?:www|us)\./, 'smile.');
    var new_url = window.location.protocol + '//' + new_host + window.location.pathname + window.location.search + window.location.hash;
    const signedIn = !document.evaluate('//span[text()="Hello, Sign in"]', document).iterateNext();
    if (signedIn) {
      //console.log('nav to ', new_url);
      window.location.replace(new_url);
    }
}
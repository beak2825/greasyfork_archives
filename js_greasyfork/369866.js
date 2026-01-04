// ==UserScript==
// @name       Reddit auto-old
// @namespace
// @version    1
// @description  Automatically redirects all www.reddit.com URLs to their old.reddit.com equivalent.
// @match      http://www.reddit.com/*
// @match      https://www.reddit.com/*
// @run-at document-start
// @copyright  2018
// @namespace https://greasyfork.org/users/193492
// @downloadURL https://update.greasyfork.org/scripts/369866/Reddit%20auto-old.user.js
// @updateURL https://update.greasyfork.org/scripts/369866/Reddit%20auto-old.meta.js
// ==/UserScript==

// Only redirect if we're the top window
//
// This prevents iframes embedded within www.reddit.com pages from
// triggering redirects themselves: we only want the outer window to do that.
// Unfortunately, it has the side-effect that if amazon.com is embedded
// in a frame on some other website, we'll skip doing the redirect even though
// we're supposed to.

if (window.self === window.top) {
    var new_host = window.location.host.replace(/^www\./, 'old.');
    var new_url = window.location.protocol + '//' + new_host + window.location.pathname + window.location.search + window.location.hash;
    window.location.replace(new_url);
}
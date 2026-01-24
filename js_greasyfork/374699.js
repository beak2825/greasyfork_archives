// ==UserScript==
// @name         Link Sanitizer
// @description  Clean up unnecessary hyperlink redirections and link shims
// @version      1.2.1
// @author       wespe <jan@wespe.dev>
// @license      WTFPL 2.0; http://www.wtfpl.net/about/
// @namespace    https://github.com/cloux
// @homepage     https://github.com/cloux/LinkSanitizer
// @supportURL   https://github.com/cloux/LinkSanitizer
// @icon         http://icons.iconarchive.com/icons/designbolts/seo/128/Natural-Link-icon.png
// @include      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/374699/Link%20Sanitizer.user.js
// @updateURL https://update.greasyfork.org/scripts/374699/Link%20Sanitizer.meta.js
// ==/UserScript==

(function() {
  // Limit contentType to "text/plain" or "text/html"
  if ((document.contentType != undefined) && (document.contentType != "text/plain") && (document.contentType != "text/html")) {
    console.log("Hyperlink Sanitizer - Not loading for content type " + document.contentType);
    return;
  }

  // Sanitize single link
  function sanitize(weblink) {
    // skip non-http links
    if (! /^http/.test(weblink)) {
      return weblink;
    }
    // whitelisted services
    if ( /google\.[a-z]*\/(ServiceLogin|Logout|AccountChooser)/.test(weblink) // google login service
      || /^https:\/\/(translate|consent)\.google\./.test(weblink)             // google services
      || /^http.*(login|registration)[./?].*http/.test(weblink)               // aliexpress, heise.de
      || /\/oauth\?/.test(weblink)                                            // OAuth on aws.amazon.com
      || /\/signin[/?]/.test(weblink)                                         // amazon.com, google, gmail
      || /^https?:\/\/downloads\.(sourceforge|sf)\.net\//.test(weblink)       // downloads.sourceforge.net
      || /^https?:\/\/(www\.)?facebook\.com\/sharer/.test(weblink)            // share on FB
      || /^https?:\/\/(www\.)?linkedin\.com\/share/.test(weblink)             // share on linkedin
      || /^https?:\/\/(www\.)?pinterest\.com\/pin\/create\//.test(weblink)    // pinterest post
      || /^https?:\/\/(www\.)?getpocket\.com\/save/.test(weblink)             // save link to pocket
      || /^https?:\/\/[a-z.]*archive\.org\//.test(weblink)                    // archive.org
      || /^https?:\/\/github\.com\//.test(weblink)                            // Github
      || /^https:\/\/id\.atlassian\.com\//.test(weblink)                      // Atlassian Login
      ) {
      return weblink;
    }
    var cleanlink = weblink.replace(/^..*(https?(%3A|:)[^\\()&]*).*/, '$1');
    cleanlink = cleanlink.replace(/%23/g, '#').replace(/%26/g, '&').replace(/%2F/g, '/').replace(/%3A/g, ':').replace(/%3D/g, '=').replace(/%3F/g, '?');
    // NOTE: %25 must be translated last
    cleanlink = cleanlink.replace(/%25/g, '%');
    return cleanlink;
  }

  // Sanitize all HREF links within document
  function sanitize_links() {
    for (var element of document.getElementsByTagName("a")) {
      if (typeof element.href === 'undefined') {
        continue;
      }
      var link = element.getAttribute('href');
      if (! /..https?(%3A|:)/.test(link)) {
        continue;
      }
      var sanitizedLink = sanitize(link);
      if (link != sanitizedLink) {
        console.log("Hyperlink: " + link);
        console.log("SANITIZED: " + sanitizedLink);
        element.setAttribute('href', sanitizedLink);
      }
    }
  }

  function mutation_callback(mutationsList) {
    for (var mutation of mutationsList) {
      if ((mutation.type == "attributes") || (mutation.type == "childList")) {
        sanitize_links();
        return;
      }
    }
  }

  function load_sanitizer() {
    sanitize_links();
    // Create an observer instance linked to the callback function
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(mutation_callback);
    // Start observing added elements and changes of href attributes
    observer.observe(window.document.documentElement, { attributeFilter: [ "href" ], childList: true, subtree: true });
  }

  window.addEventListener("load", load_sanitizer);
})();

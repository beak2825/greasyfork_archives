// ==UserScript==
// @name               TXTClickableLinks
// @name:de            TXTClickableLinks
// @name:en            TXTClickableLinks
// @namespace          sun/userscripts
// @version            1.1.16
// @description        Converts URLs in plain text files to clickable links.
// @description:de     Konvertiert URLs in Textdateien zu anklickbaren Links.
// @description:en     Converts URLs in plain text files to clickable links.
// @compatible         chrome
// @compatible         edge
// @compatible         firefox
// @compatible         opera
// @compatible         safari
// @homepageURL        https://forgejo.sny.sh/sun/userscripts
// @supportURL         https://forgejo.sny.sh/sun/userscripts/issues
// @contributionURL    https://liberapay.com/sun
// @contributionAmount €1.00
// @author             Sunny <sunny@sny.sh>
// @include            *://*/*
// @match              *://*/*
// @run-at             document-end
// @inject-into        auto
// @grant              none
// @noframes
// @icon               https://forgejo.sny.sh/sun/userscripts/raw/branch/main/icons/TXTClickableLinks.png
// @copyright          2021-present, Sunny (https://sny.sh/)
// @license            Hippocratic License; https://forgejo.sny.sh/sun/userscripts/src/branch/main/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/427602/TXTClickableLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/427602/TXTClickableLinks.meta.js
// ==/UserScript==

(() => {
  // Regular Expression for URL validation
  //
  // Copyright (c) 2010-2018 Diego Perini (http://www.iport.it)
  //
  // Permission is hereby granted, free of charge, to any person
  // obtaining a copy of this software and associated documentation
  // files (the "Software"), to deal in the Software without
  // restriction, including without limitation the rights to use,
  // copy, modify, merge, publish, distribute, sublicense, and/or sell
  // copies of the Software, and to permit persons to whom the
  // Software is furnished to do so, subject to the following
  // conditions:
  //
  // The above copyright notice and this permission notice shall be
  // included in all copies or substantial portions of the Software.
  const reWeburl =
    /((?:(?:(?:https?|ftp|file):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?)/gi;

  if (
    (document.body.childElementCount === 1 &&
      document.body.getElementsByTagName("pre")[0].getAttribute("style") ===
        "word-wrap: break-word; white-space: pre-wrap;") || // Chrome
    document.getElementsByTagName("link")[0].getAttribute("href") ===
      "resource://content-accessible/plaintext.css" // Firefox
  ) {
    const pre = document.getElementsByTagName("pre")[0];
    pre.innerHTML = pre.innerHTML.replace(reWeburl, '<a href="$1">$1</a>');
  }
})();

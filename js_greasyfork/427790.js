
// ==UserScript==
// @name        cppref-hashtag
// @version     0.1.4
// @description Add Python-doc-like links to cppreference
// @author      QuarticCat <QuarticCat@protonmail.com>
// @match       *://*.cppreference.com/*
// @icon        https://www.google.com/s2/favicons?domain=cppreference.com
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@1
// @license     MIT
// @namespace   https://github.com/QuarticCat
// @homepageURL https://github.com/QuarticCat/cppref-hashtag
// @supportURL  https://greasyfork.org/scripts/427790
// @downloadURL https://update.greasyfork.org/scripts/427790/cppref-hashtag.user.js
// @updateURL https://update.greasyfork.org/scripts/427790/cppref-hashtag.meta.js
// ==/UserScript==

(function () {
'use strict';

var css_248z = "a.headerlink{color:#0072aa;padding:0 4px;text-decoration:none;visibility:hidden}";

document.head.append(VM.createElement("style", null, css_248z));

for (const headline of document.getElementsByClassName('mw-headline')) {
  // Inject links
  const link = VM.createElement("a", {
    className: "headerlink",
    href: `#${headline.id}`,
    title: "Permalink to this headline"
  }, "\xB6");
  headline.insertAdjacentElement('afterend', link); // Add hover events

  const parent = headline.parentNode;
  parent.addEventListener('mouseenter', () => {
    link.style.visibility = 'visible';
  });
  parent.addEventListener('mouseleave', () => {
    link.style.visibility = 'hidden';
  });
}

}());

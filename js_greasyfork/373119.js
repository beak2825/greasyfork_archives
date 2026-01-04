// ==UserScript==
// @name        etf.com view full article
// @namespace   https://github.com/jmegner
// @version     0.4
// @description Redirects to full article view for articles at etf.com.
// @license     Unlicense
// @homepageURL https://github.com/jmegner/greasemonkey_etf_dot_com_view_full_article
// @supportURL  https://github.com/jmegner/greasemonkey_etf_dot_com_view_full_article/issues
// @match       https://www.etf.com/sections/*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/373119/etfcom%20view%20full%20article.user.js
// @updateURL https://update.greasyfork.org/scripts/373119/etfcom%20view%20full%20article.meta.js
// ==/UserScript==

// Only redirect if we're the top window.
// This condition prevents iframes embedded within etf.com pages from
// triggering redirects themselves: we only want the outer window to do that.
// It has the side-effect that if etf.com is embedded
// in a frame on some other website, we'll skip doing the redirect

var noPagingSuffix = "?nopaging=1";

if (window.self === window.top && window.location.href.indexOf(noPagingSuffix) == -1)
{
  window.location.replace(window.location.href + noPagingSuffix);
}

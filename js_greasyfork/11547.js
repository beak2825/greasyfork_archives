// ==UserScript==
// @name        HN better domain names
// @description Displays the full domain name of each item on Hacker News.
// @version     2
// @namespace   https://tomkwok.com/hacker-news-greasemonkey-scripts/
// @include     http://news.ycombinator.com/*
// @include     https://news.ycombinator.com/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/11547/HN%20better%20domain%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/11547/HN%20better%20domain%20names.meta.js
// ==/UserScript==

GM_addStyle(".orig-domain { color: #222 !important; }");

(function() {
  var HTTP_SCHEME = /^https?:\/\//;
  var spans = document.getElementsByClassName('comhead');

  for (var i = 0; i < spans.length; i++) {
    var span = spans[i];
    var a = span.previousSibling;
    var sitestr = span.getElementsByClassName('sitestr')[0];

    if (a.href && a.href.match(HTTP_SCHEME)) {
      orig_domain = new RegExp(sitestr.innerHTML.replace(/\s/, "")
                                                .replace(/\./, "\."));
      console.log(orig_domain);
      var h = a.href.replace(HTTP_SCHEME, "")
                    .replace(/\/.*/, "")
                    .replace(/^www\d*\./, "")
                    .replace(orig_domain, function (orig_domain){ return '<span class="orig-domain">' + orig_domain + '</span>'; });
      //span.innerHTML = " (" + h + ")";
      sitestr.innerHTML = h;
    }
  }
})();
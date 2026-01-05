// ==UserScript==
// @name        Fake News Warnings
// @namespace   all-fake-news
// @description Display a popup warning on fake news sites. See: http://www.infowars.com/the-ultimate-fake-news-list/
// @include     *
// @version     0.1.2
// @run-at      document-start
// @license     MIT License
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25503/Fake%20News%20Warnings.user.js
// @updateURL https://update.greasyfork.org/scripts/25503/Fake%20News%20Warnings.meta.js
// ==/UserScript==

$("document").ready(function () {

  var warningText = "WARNING: %s is known to publish fake news and disinformation! Proceed at your own risk!";

  var fakeNewsDomains = [
    'abcnews.com',
    'abcnews.go.com',
    'americanprogress.org',
    'americanprogressaction.org',
    'bbc.co.uk',
    'bbc.com',
    'bbcnews.com',
    'bloomberg.com',
    'businessinsider.com',
    'buzzfeed.com',
    'cbc.ca',
    'cbslocal.com',
    'cbsnews.com',
    'chicagotribune.com',
    'cnbc.com',
    'cnn.com',
    'dailykos.com',
    'economist.com',
    'eutimes.net',
    'ft.com',
    'gawker.com',
    'huffingtonpost.com',
    'latimes.com',
    'littlegreenfootballs.com',
    'mediaite.com',
    'mediamatters.org',
    'motherjones.com',
    'moveon.org',
    'msn.com',
    'msnbc.com',
    'nbcnews.com',
    'news.sky.com',
    'news.vice.com',
    'newsweek.com',
    'newyorker.com',
    'npr.org',
    'nydailynews.com',
    'nytimes.com',
    'pbs.org',
    'politico.com',
    'rawstory.com',
    'rollingstone.com',
    'salon.com',
    'seattletimes.com',
    'slate.com',
    'superstation95.com',
    'thedailybeast.com',
    'theguardian.com',
    'theyoungturks.co.uk',
    'thinkprogress.org',
    'time.com',
    'tytnetwork.com',
    'usatoday.com',
    'vice.com',
    'washingtonpost.com',
    'wonkette.com',
    'yahoo.com',
  ];

  function extractDomain(url) {
    var domain;
    if (url.indexOf("://") > -1) {
      domain = url.split('/')[2];
    } else {
      domain = url.split('/')[0];
    }
    domain = domain.split(':')[0];
    return domain;
  }

  function isFakeNewsLink(domain) {
    for (var i = 0; i < fakeNewsDomains.length; i++) {
      if (domain.indexOf(fakeNewsDomains[i]) >= 0) {
        return true;
      }
    }
    return false;
  }

  var url = window.location.href;

  var domain = extractDomain(url);

  if (isFakeNewsLink(domain)) {
    var warning = warningText.replace(/%s/g, domain);
    alert(warning);
  }
});

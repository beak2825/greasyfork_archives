// ==UserScript==
// @name        Drudge Link Enhancements
// @namespace   drudgereport.com
// @description Enhances links on Drudge Report and neuters links to fake-news sites
//
// @include     http://*.drudgereport.com/*
// @include     http://drudgereport.com/*
// @version     0.2.6
// @grant       GM_addStyle
// @run-at      document-end
// @license     MIT License
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/23771/Drudge%20Link%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/23771/Drudge%20Link%20Enhancements.meta.js
// ==/UserScript==

$("document").ready(function () {
  GM_addStyle('.fake-news-prefix { font-size: 0.8em; display: inline; }');
  GM_addStyle('.fake-news { font-size: 0.8em; }');
  GM_addStyle('.fake-news-icon { display: inline; }');

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

  var icon = "<img class='fake-news-icon' src='data:image/png;base64,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' style='margin-right: 6px; vertical-align: middle;' />";
  var title = "Fake news sites, like this one, have been tagged";
  var linkStats = {};

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

  function appendLinkStats(stats) {
    var tuples = [];
    var statsHtml = '<h3>Link Stats</h3>';

    for (var key in stats) {
      tuples.push([key, stats[key]]);
    }

    // Reverse sort
    tuples.sort(function(a, b) {
      a = a[1];
      b = b[1];
      return a < b ? 1 : (a > b ? -1 : 0);
    });

    for (var i=0; i<tuples.length; i++) {
      var key = tuples[i][0]
      var val = tuples[i][1];
      statsHtml += "<div class='linkstat-entry'>"+key+" == "+val+"</div>"
    }

    $('body').append(statsHtml);
  }

  function isFakeNewsLink(domain) {
    for (var i = 0; i < fakeNewsDomains.length; i++) {
      if (domain.indexOf(fakeNewsDomains[i]) >= 0) {
        return true;
      }
    }
    return false;
  }

  function tagFakeNewsLink(link, domain) {
    var originalUrl = null;
    if (isFakeNewsLink(domain)) {
      // console.log("replacing fake news: " + domain);
      originalUrl = link.attr("href");
      // console.log("original link: " + originalUrl);
      link.replaceWith(
        '<a href="'+originalUrl+'" title="click this turd pile to go there anyway">'+icon+'</a>' +
        "<div title='click the turd pile to go there anyway' class='fake-news-prefix'>"+domain+" Fake-News link removed</div> <div title='"+title+"' class='fake-news'>" + link.text() + "</div>"
      );
    } else {
      // Add a popup with the link's domain name
      link.attr("title", domain);
    }
  }

  $("a").each(function() {
    var link = $(this);
    var href = link.attr("href");
    var domain = extractDomain(href);
    // console.log(domain);

    tagFakeNewsLink(link, domain);

    // if (linkStats[domain] == null) {
    //   linkStats[domain] = 1;
    // } else {
    //   linkStats[domain] += 1;
    // }
  });

  // appendLinkStats(linkStats);
});

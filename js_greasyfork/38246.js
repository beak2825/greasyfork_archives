// ==UserScript==
// @name Library Genesis
// @version 0.1.1
// @description Open search results in new tab and automatically trigger the download.
// @match *://libgen.io/search.php*
// @match *://libgen.lc/search.php*
// @match *://libgen.rs/search.php*
// @match *://gen.lib.rus.ec/search.php*

// @match *://libgen.me/item/*
// @match *://libgen.pw/item/*
// @match *://*.libgen.io/ads.php*
// @match *://booksdescr.org/ads.php*
// @match *://library.lol/main/*
//
// @require http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/5782
// @downloadURL https://update.greasyfork.org/scripts/38246/Library%20Genesis.user.js
// @updateURL https://update.greasyfork.org/scripts/38246/Library%20Genesis.meta.js
// ==/UserScript==

//  Inspired from Jeremy Cartrell's HN Script
$(document).ready(function() {
  var addBlankTarget = function() {
    var selector = 'table.c tr:not(:first-child) a';
    $(selector).attr('target', '_blank');
  }

  var Downloader = {
    TIMEOUT: 500,
    init: function(href) {
      if (! href.includes('search.php')) {
      	Downloader.showSpinner();
      }

      if (href.includes('libgen.io/ads.php')) {
        Downloader.initLibgenio();
      } else if (href.includes('libgen.pw/item') || href.includes('libgen.me/item')) {
        Downloader.initLibgenpw();
      } else if (href.includes('booksdescr.org/ads.php')) {
        Downloader.initBooksDescr();
      } else if (href.includes('library.lol/main/')) {
        Downloader.initDownload($('#info #download a'));
      }
    },
    initDownload: function(downloadLink) {
      setTimeout(function() {
        window.location.replace(downloadLink.attr('href'));
      }, Downloader.TIMEOUT);
    },
    initBooksDescr: function() {
      setTimeout(function() {
        var href = $('body > table#main tbody tr td:nth-child(2) a:first-child').attr('href');
        window.location.replace(href);
      }, Downloader.TIMEOUT);
    },
    initLibgenio: function() {
      setTimeout(function() {
        var href = $('body > table tr td:nth-child(3) a:first-child').attr('href');
        window.location.replace(href);
      }, Downloader.TIMEOUT);
    },
    initLibgenpw: function() {
      setTimeout(function() {
        if ($('.book-info__download a').length > 0) {
          window.location.href = $('.book-info__download a').attr('href');
        } else if ($('.book-info__get a').length > 0) {
          window.location.replace($('.book-info__get a').attr('href'));
        }
      }, Downloader.TIMEOUT);
    },
    showSpinner: function() {
      $('head').append('<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/css-spinning-spinners/1.1.0/load5.css" />');
      $('body').append('<div class="loading"></div>');
      $('<style>').prop("type", "text/css").html("\
        .loading:before {\
					position: absolute;\
					margin: auto;\
          top: 40%;\
					left: 0;\
					right: 0;\
					font-size: 0.75em;\
        }\
      ").appendTo('head');
    }
  }

  addBlankTarget();
  Downloader.init(window.location.href);
  $('table.c').get(0).scrollIntoView({ behavior: 'smooth' });
});

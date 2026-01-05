// ==UserScript==
// @name           Reddit Inline Gallery
// @namespace      http://google.dcom
// @description    Add's inline gallery viewmode on reddit.com
// @version        1.2
// @include        http://www.reddit.com/*
// @include        http://*.reddit.com/*
// @exclude        http://www.reddit.com/ads/*
// @require 	   http://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.js
// @downloadURL https://update.greasyfork.org/scripts/4723/Reddit%20Inline%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/4723/Reddit%20Inline%20Gallery.meta.js
// ==/UserScript==
//

(function() {
  $('head').append('<link rel="stylesheet" type="text/css" href="http://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.css">');

  $('#siteTable div.entry').each(function(index) {
    var gallink = $(this).find('p.title a.title').clone();
    gallink.addClass('fancybox');gallink.removeClass('title');gallink.removeClass('may-blank');
    gallink.attr('data-fancybox-group', 'gallery');
    gallink.attr('title', gallink.html());
    gallink.html('open gallery');

    var extension = gallink.attr('href').substr((gallink.attr('href').lastIndexOf('.') +1));
    if (extension != 'jpg' && gallink.attr('href').indexOf('imgur') != -1) {
      gallink.attr('href', gallink.attr('href') + '.jpg');
      var extension_force = true;
    }

    if (extension == 'jpg' || extension_force == true) {
      $(this).find('ul.flat-list').append('<li>' + gallink.get(0).outerHTML + '</li>');
    }
  });

  $(".fancybox").fancybox({
    openEffect  : 'none',
    closeEffect : 'none'
  });
})();

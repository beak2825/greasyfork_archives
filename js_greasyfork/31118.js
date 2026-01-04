// ==UserScript==
// @name         9anime Batch Downloader
// @namespace    https://greasyfork.org/en/scripts/31118-9anime-batch-downloader
// @version      2.3.4
// @description  Download all episodes automatically from Server F4 (only). How to use: Open the anime page. Start playing the video. Just above the server list you should see the Download all button. Hit it, copy the links and add to your download manager as a batch, and enjoy!!
// @author       wrick17
// @match        https://9anime.to/watch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31118/9anime%20Batch%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/31118/9anime%20Batch%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var interval = setInterval(function() {
      var downloadButton = $('.download.movie');
      var link = downloadButton.attr('href');

      if (link) {
        clearInterval(interval);
        $('#servers')
        .before('<button class="btn btn-primary btn-sm download-trigger" style="margin-bottom: 10px;">Download all of \'em!</button>')
        .before('<button class="btn btn-primary btn-sm download-close" style="margin-bottom: 10px; display: none;">Close the links box.</button>')
        .before('<div class="download-label" style="display: none; color: #9a9a9a; margin-bottom: 15px; ">Add the following links to your download manager and enjoy:</div>')
        .before('<textarea class="download-links" style="display: none; width: 100%; height: 200px; background: #0f0e13; color: #9a9a9a; border: none; margin-bottom: 10px; padding: 10px;"></textarea>');
      }
    }, 100);

    $('body').on('click', '.download-trigger', function(e) {

      var episodesArray = [];
      $('#servers .server[data-type="direct"] .episodes li a').each(function(idx, el) {
        episodesArray.push( $(el).html() );
      });

      var downloadButton = $('.download.movie');
      var link = downloadButton.attr('href');

      var match = (/(.*)- (?:[0-9\-]+) -(.*)/g).exec(link);
      var start = match[1] + '- ';
      var end = ' -' + match[2];


      var linksBlob = '';
      episodesArray.forEach(function(episode) {
        linksBlob += encodeURI(start + episode + end) + '\n';
      });

      $('.download-links').val(linksBlob).show();
      $('.download-label, .download-close').show();
      $('.download-trigger').hide();

    });

    $('body').on('click', '.download-close', function(e) {
      $('.download-links').val('');
      $('.download-label, .download-close, .download-links').hide();
      $('.download-trigger').show();
    })

})();

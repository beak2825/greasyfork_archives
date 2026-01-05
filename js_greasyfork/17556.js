// ==UserScript==
// @name           IMDb: 'Highest Rated Titles' quick links for person page
// @namespace      https://greasyfork.org/en/users/8981-buzz
// @description    This script adds small but very practical links to the IMDb person detail page. It links directly to the film list by job type (director, writer and actor), sorted by rating and shows only Feature films and TV Movies.
// @author         buzz
// @require        https://code.jquery.com/jquery-2.2.0.min.js
// @version        0.5
// @license        GPLv2
// @match          *://*.imdb.com/name/nm*
// @grant          none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/17556/IMDb%3A%20%27Highest%20Rated%20Titles%27%20quick%20links%20for%20person%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/17556/IMDb%3A%20%27Highest%20Rated%20Titles%27%20quick%20links%20for%20person%20page.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

$(function($) {
  var imdb_id;
  var re = /^\/name\/(nm[0-9]{7})\//;
  var m = re.exec(window.location.pathname);
  if (m) {
    imdb_id = m[1];
    var $f = $('#filmography'), links = [];
    var jobs = ['director', 'actor', 'actress', 'writer'];
    for (var i = 0; i < jobs.length; i++) {
      var job = jobs[i];
      if ($f.find('a[name=' + job + ']').length === 1) {
        var text = job.charAt(0).toUpperCase() + job.slice(1);
        links.push('<a href="/filmosearch?explore=title_type&role=' + imdb_id + '&ref_=filmo_ref_job_typ&sort=user_rating,desc&mode=detail&page=1&job_type=' + job +
            '&title_type=movie%2CtvMovie" title="Show movies by rating (' + text + ')">' + text + '</a>');
      }
    }
    $('#jumpto').before('<div id="job-quicklinks">Quicklinks (by Rating): ' + links.join(' <span class="ghost">|</span> ') + '</div>');
  }
});

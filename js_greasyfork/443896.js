// ==UserScript==
// @name AO3: [Wrangling] Search Wrangling Home
// @description adds a search box on the wrangling home page to filter your assigned fandoms by their name
// @version 0.1
// @author Rhine
// @namespace https://github.com/RhineCloud
// @include http*://*archiveofourown.org/tag_wranglers/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/443896/AO3%3A%20%5BWrangling%5D%20Search%20Wrangling%20Home.user.js
// @updateURL https://update.greasyfork.org/scripts/443896/AO3%3A%20%5BWrangling%5D%20Search%20Wrangling%20Home.meta.js
// ==/UserScript==

(function($) {
  const table = $('div.assigned.module table');
  const assigned = table.find('tbody tr');
  
  // insert the search box
  table.before('<p><input type="text" id="fandom_search" placeholder="Search.."></p>');
  
  // make it do the hiding/showing after typing
  $('#fandom_search').on('keyup', function() {
    let query = $(this).val().toLowerCase();
    
    assigned.hide();
    assigned.filter(function() {
      return $(this).find('th').text().toLowerCase().indexOf(query) > -1;
    }).show();
  });
})(jQuery);

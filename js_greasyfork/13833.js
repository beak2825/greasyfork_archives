// ==UserScript==
// @name        TraktTvNumberOfElements
// @namespace   notableTieView
// @description Display the number of Shows on the progress page(s)
// @include    http://trakt.tv/users/*/progress
// @include    http://trakt.tv/users/*/progress**
// @require  https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @version     1.1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/13833/TraktTvNumberOfElements.user.js
// @updateURL https://update.greasyfork.org/scripts/13833/TraktTvNumberOfElements.meta.js
// ==/UserScript==

waitForKeyElements('#progress-wrapper div.container', execute);

function execute() {
  var foundShows = 0;
  paginationLis = $('.pagination-bottom ul.pagination li');
  n = paginationLis.length;
  numPages = n - 2;
  if ((paginationLis.length > 0) && !(paginationLis.eq(n - 1).hasClass('disabled'))) {
    ref = $(paginationLis).eq(n - 2).children().eq(0).attr('href');
    $.ajax({
      url: ref,
      success: function (responseData) {
        res = responseData;
        foundShows = $(res).find('.container').eq(3).children('div').length - 1;
      },
      async: false
    });
  } else {
    foundShows = $('#progress-wrapper>.container>div').length - 1; // the last div is pagination
  }
  numShows = foundShows;
  if (numPages > 0) {
    numShows = 60 * (numPages - 1) + foundShows;
  }
  $('#progress-wrapper div.container').prepend('<h1>'.concat(numShows).concat(' Shows</h1>'));
  $('#huckster-content-page').remove();
}

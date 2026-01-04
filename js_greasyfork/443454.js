// ==UserScript==
// @name        Simulcast Calendar Dub Remover - crunchyroll.com
// @namespace   Violentmonkey Scripts
// @match       https://www.crunchyroll.com/simulcastcalendar
// @grant       none
// @version     1.2
// @author      farhil
// @description Removes dubs from simulcast calendar to reduce clutter. Also adds "Last Week" button when it is missing.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443454/Simulcast%20Calendar%20Dub%20Remover%20-%20crunchyrollcom.user.js
// @updateURL https://update.greasyfork.org/scripts/443454/Simulcast%20Calendar%20Dub%20Remover%20-%20crunchyrollcom.meta.js
// ==/UserScript==
$(document).ready(function () {
  $('.releases li').each(function() {
      var $this = $(this);
      var text = $('.season-name', $this).text();
      if (text.includes('Dub)')) {
          $this.remove();
      }
  })

  if ($('.pagination-arrow').length === 0)   {
      var lastWeekButton = '<a class="pagination-arrow pagination-last js-pagination-last" href="/simulcastcalendar?date=' + getFormattedDate(-7) + '"><svg viewBox="0 0 48 48"><title>Last Week</title><use xlink:href="/i/svg/simulcastcalendar/calendar_icons.svg#cr_prev"></use></svg></a>'

      $('.viewport .content').prepend(lastWeekButton);
  }
});

// Gets current date with an offset formatted as 'yyyy-mm-dd'
function getFormattedDate(offset) {
  var result = new Date();
  result.setDate(result.getDate() + offset);
  return result.toISOString().split('T')[0];
}
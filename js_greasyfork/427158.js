// ==UserScript==
// @name        Display match event time in NZT - sportsbay.org
// @namespace   Violentmonkey Scripts
// @match       https://sportsbay.org/*
// @grant       none
// @version     0.0.1
// @author      Bin
// @description 28/05/2021, 15:40:30
// @downloadURL https://update.greasyfork.org/scripts/427158/Display%20match%20event%20time%20in%20NZT%20-%20sportsbayorg.user.js
// @updateURL https://update.greasyfork.org/scripts/427158/Display%20match%20event%20time%20in%20NZT%20-%20sportsbayorg.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

$(function() {
  const nztName = 'Pacific/Auckland';
  const displayDateFormat = 'ddd, MMM DD';

  const updateDateBanner = () => {
    $('tbody .date').each(function() {
      const $el = $(this);
      const date = moment($el.text(), 'dddd, MMMM DD, YYYY').format(displayDateFormat)
      let $prev = $el.prev();
      while($prev.length) {
        if(date !== $prev.find('.value-title').data('nztDate')) {
          break;
        }
        $prev = $prev.prev();
      }

      if(!$prev.length) {
        return;
      }

      $prev.after($el);
      if ($prev.hasClass('date')) {
        $prev.hide();
      }
    });
  }

  const updateDisplayTime = () => {
    $('.time.dtstart .value-title').each(function() {
      const $el = $(this);
      if ($el.data('nztDate')) {
        return;
      }
      const nztMoment = moment.tz($el.attr('title'), nztName);
      const nztDate = nztMoment.format(displayDateFormat);
      $el.html(`${nztDate}<br />${nztMoment.format('HH:mm')}`).data('nztDate', nztDate);
    }).css({
      display: 'block',
      backgroundPosition: '5px 4px',
      lineHeight: '20px',
      paddingLeft: '23px'
    }).parent().css({width: '108px'});
    
    updateDateBanner();
  };

  $("#content").css({
    width: 'auto',
    maxWidth: '920px'
  });

  $('#changedate').append(
    $(document.createElement('option'))
    .attr('value', nztName)
    .text('New Zealand Time (NZT)')
  ).val(nztName).change();

  $('.filterable tbody').on('append.infiniteScroll', function() {
    updateDisplayTime();
  });

  updateDisplayTime();
});

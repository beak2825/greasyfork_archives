// ==UserScript==
// @name         Waze Live map big moods
// @version      0.4
// @description  Waze live map big moods and events
// @author       ixxvivxxi
// @include      https://www.waze.com/livemap*
// @include      https://www.waze.com/*/livemap*
// @grant        none
// @namespace    https://greasyfork.org/ru/scripts/10624-waze-live-map-big-moods-and-events
// @downloadURL https://update.greasyfork.org/scripts/10624/Waze%20Live%20map%20big%20moods.user.js
// @updateURL https://update.greasyfork.org/scripts/10624/Waze%20Live%20map%20big%20moods.meta.js
// ==/UserScript==

$( document ).ready(function() {
  var css = '.xs-mood { width:30px !important; height: 24px !important; background-size:30px 24px !important; margin-top: -18px !important; margin-left: -14px !important;} ' +
            '.small-pin { width: 28px !important; height: 33px !important;background-size: 28px 33px !important;  margin-top: -30px !important; margin-left: -12px !important;}',
      head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);

  $('.search-forms').append('<div class="checkbox"> <label> <input type="checkbox" id="showhide"> Спрятать/показать значки</label> </div>');



  setInterval(function() {
    if (W.controller._mapView.map._zoom > 7) {
      $('.small-dot').addClass('small-pin');
      $('.small-dot').removeClass('small-dot');
      $('.medium-dot').addClass('small-pin');
      $('.medium-dot').removeClass('medium-dot');
      $('.big-dot').addClass('small-pin');
      $('.big-dot').removeClass('big-dot');
    }
}, 3000);

});

$('.search-forms').on('click', '#showhide', function() {
  $('.leaflet-marker-pane').toggle();
});

// ==UserScript==
// @name           MunzeeZoomMap
// @name:cs        MunzeeZoomMap
// @namespace      Kaas.Greasemonkey.Munzee
// @description    Enables you to zoom a Munzee map into a larger scale.
// @description:cs Umožňuje zoomovat munzee mapu do většího měřítka.
// @include        https://www.munzee.com/map*
// @version        1.0.0
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/20271/MunzeeZoomMap.user.js
// @updateURL https://update.greasyfork.org/scripts/20271/MunzeeZoomMap.meta.js
// ==/UserScript==

jQuery(document).ready(function ($)
{
  // original values:
  //  12 for "only vacant rooms"
  //  15 for "show circle"
  //  13 for everything else
  var newMinZoom = 8;
  
  _minZoom = newMinZoom;  // override default
  the_map.setOptions({minZoom:  newMinZoom});

  $('#check_vacant').change(function( ) { the_map.setOptions({minZoom:  newMinZoom}); });
  $('#check_circles').change(function( ) { the_map.setOptions({minZoom:  newMinZoom}); });
});
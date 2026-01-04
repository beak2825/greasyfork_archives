// ==UserScript==
// @name         CuppaZee Map Permalink
// @namespace    https://cuppazee.app/
// @version      0.1
// @description  Switches Permalinks on munzee.com/map to use CuppaZee's Map Link service
// @author       sohcah
// @match        https://www.munzee.com/map*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=munzee.com
// @grant        none
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/459675/CuppaZee%20Map%20Permalink.user.js
// @updateURL https://update.greasyfork.org/scripts/459675/CuppaZee%20Map%20Permalink.meta.js
// ==/UserScript==

(function() {
    'use strict';

     $('#openpermamodal').click(function() {
    const code = geohash.encode( map.getCenter().lat, map.getCenter().lng, 9 );
    const url = 'https://map.cuppazee.app/' + code + '/' + map.getZoom().toFixed( 1 );
    $('#permabody').empty().append( '<a href="' + url + '">' + url + '</a>' );
  });
})();
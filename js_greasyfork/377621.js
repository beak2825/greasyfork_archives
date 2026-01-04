// ==UserScript==
// @name         luke g dauter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  embed gmap into hit
// @author       pyro
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *www.mturkcontent.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377621/luke%20g%20dauter.user.js
// @updateURL https://update.greasyfork.org/scripts/377621/luke%20g%20dauter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if ($("p:contains('Scan the results for the goole search of the street address.')").length) {
        console.log("luke");
        let url = $('a').attr('href').replace('http://www.google.com/search?q=','');
        $('a').append('<div class="mapouter"><div class="gmap_canvas"><iframe width="600" height="500" id="gmap_canvas" src="https://maps.google.com/maps?q=' + url + '&t=k&z=19&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe></div><style>.mapouter{text-align:right;height:500px;width:600px;}.gmap_canvas {overflow:hidden;background:none!important;height:500px;width:600px;}</style></div>')
    }
})();
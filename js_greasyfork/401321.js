// ==UserScript==
// @name         TornAPI Toggles
// @namespace    Heasleys.TornApiToggles
// @version      1.0
// @description  Hide/Unhide API requests on Torn API "try it" page
// @author       Heasleys4hemp [1468764]
// @match       *.torn.com/api.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401321/TornAPI%20Toggles.user.js
// @updateURL https://update.greasyfork.org/scripts/401321/TornAPI%20Toggles.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i = 0;

    $(document).ajaxComplete(function( event, request, settings ) {

        if (settings.url.includes('api.torn.com')){
            $('div > span > h4').each(function() {
                let pre = $(this).next();

                let a = '<a data-toggle="collapse" href="#selection_' + i + '" aria-expanded="false" aria-controls="selection_' + i + '" class="collapsed"></a>';
                let d = '<div id="selection_' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="selection_' + i + '"></div>';

                $(this).wrap(a);
                pre.wrap(d);

                i++;
            });
        }

    });

})();
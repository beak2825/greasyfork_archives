// ==UserScript==
// @name         FV Basecampe Search improvement
// @version      2024-12-30
// @description  Limit search to active project
// @author       Foliovision
// @match        https://3.basecamp.com/*
// @grant        none
// @license      GPL v3
// @namespace https://greasyfork.org/users/1268909
// @downloadURL https://update.greasyfork.org/scripts/534998/FV%20Basecampe%20Search%20improvement.user.js
// @updateURL https://update.greasyfork.org/scripts/534998/FV%20Basecampe%20Search%20improvement.meta.js
// ==/UserScript==

(function() {
    jQuery(document).on('click', '.nav__link--search', function() {
        var project_id = jQuery('meta[name=current-bucket-id]').attr('content');
        if( project_id ) {
            console.log('Project ID: '+project_id);
            var int_count = 0;
            var int = setInterval( function() {
                var search = jQuery('#search_bucket_id');
                if( search.length ) {
                    search.val(project_id);
                    clearInterval(int);
                }

                int_count++;
                if( int_count > 100 ) {
                    clearInterval(int);
                }
            }, 10 );
        }
    });
})();
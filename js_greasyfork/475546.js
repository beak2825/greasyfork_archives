// ==UserScript==
// @name        AO3: Shake Gift
// @author      nonethefewer
// @match       *://*.archiveofourown.org/*
// @version     1.1.3.0
// @grant       none
// @description Shake gifts in AO3
// @license     MIT
// @icon        http://archiveofourown.org/favicon.ico
// @namespace https://greasyfork.org/users/838162
// @downloadURL https://update.greasyfork.org/scripts/475546/AO3%3A%20Shake%20Gift.user.js
// @updateURL https://update.greasyfork.org/scripts/475546/AO3%3A%20Shake%20Gift.meta.js
// ==/UserScript==

(function($) {
    $(document).ready(function() {
        if ( !$('body').hasClass('logged-in') ) { return; }

        var $base_url = "https://archiveofourown.org/collections/$COLLECTION$/works?commit=Sort+and+Filter&work_search%5Bquery%5D=id%3A$ID$";
        var $main = $( '#main' );
        var $thurl = "";
        $('.index.group li.work', $main).each( function() {
            var work_id = this.id.replace('work_', '');
            var collection = "";
            if ( work_id !== '' ) {
                var $dove = $('div.mystery', this);
                if ($dove.length > 0)
                {
                    collection = $('h5 a', this)[0].getAttribute("href").split("/")[2];
                    $thurl = $base_url.replace("$COLLECTION$", collection).replace("$ID$", work_id);
                    $('.actions', this).append('<a style="right: 0; position: absolute; margin-right: 10px;" href="' + $thurl + '">Shake Gift</a>');
                }
            }
        });
    });
})(window.jQuery);

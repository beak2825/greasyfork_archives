// ==UserScript==
// @name         Vasco Mturk Find related categories
// @author       Tehapollo
// @version      1.0
// @include      *mturkcontent.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  1 key will submit hit
// @downloadURL https://update.greasyfork.org/scripts/374049/Vasco%20Mturk%20Find%20related%20categories.user.js
// @updateURL https://update.greasyfork.org/scripts/374049/Vasco%20Mturk%20Find%20related%20categories.meta.js
// ==/UserScript==

(function() {
    'use strict';

if ($("p:contains('You will be shown a topic on the top.')").length) {
    $(document).keypress(function(event){
        if (String.fromCharCode(event.which) == 1)
          $('input#submitButton.btn.btn-primary').click();


   });
}
})();
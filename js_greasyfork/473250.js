// ==UserScript==
// @name        Github Issue to Originator
// @match       https://github.com/*/*/issues/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @grant       none
// @version     1.0.1
// @author      karthick-oc
// @description Assigns github issues to originator
// @namespace https://greasyfork.org/users/1153239
// @downloadURL https://update.greasyfork.org/scripts/473250/Github%20Issue%20to%20Originator.user.js
// @updateURL https://update.greasyfork.org/scripts/473250/Github%20Issue%20to%20Originator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    show_originator_option();

    function show_originator_option() {
        let _author = document.querySelector(".author").innerHTML;
        console.log(_author);
        $('#assignees-select-menu').parent().before('<a id="orginator-btn" href="#">Assign to originator</a>');
        $('#orginator-btn').click(function() {
            $('#assignees-select-menu summary').click();
            $('#assignee-filter-field').val(_author);
            $('[data-filterable-for="assignee-filter-field"] label')[0].click();
        });
    }

  $("body").on( "mousemove", function(event) {
      if ($('#orginator-btn').length == 0)
      {
        show_originator_option();
      }
    });

})();
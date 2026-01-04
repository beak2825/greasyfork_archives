// ==UserScript==
// @name         direct links to issues
// @namespace    AlexanderJahn
// @version      0.1
// @description  direct link to issues
// @author       You
// @match        https://github.com/fedger/menu-service/projects/2*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.js
// @require http://code.jquery.com/ui/1.12.1/jquery-ui.js
// @downloadURL https://update.greasyfork.org/scripts/379407/direct%20links%20to%20issues.user.js
// @updateURL https://update.greasyfork.org/scripts/379407/direct%20links%20to%20issues.meta.js
// ==/UserScript==
var $ = window.jQuery;

(function() {
    'use strict';

    var i = setInterval(function() {
        $( "div" ).each(function( i ) {
            if ( $(this).hasClass( "js-project-issue-details-container" ) ) {
                if ( $(this).children("span.card-octicon.position-absolute").children("a").length == 0){
                    var href = $(this).children('a[href*="/"]').attr('href');
                    $(this).children("span.card-octicon.position-absolute").append('<a href="'+href+'" target="_blank">🔗</a>');
                }
            }
        });
        //console.log(count);
    }, 500);

})();